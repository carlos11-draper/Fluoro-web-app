from fastapi import (
    FastAPI,
    APIRouter,
    Depends,
    File,
    Form,
    HTTPException,
    Request,
    Response,
    UploadFile,
)
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import asyncio
import os
import logging
import re
import shutil
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr, constr
from typing import List, Dict
import uuid
from datetime import datetime, timezone

from email_service import send_enquiry_notification, send_enquiry_confirmation
from storage import APP_NAME, get_object, init_storage, put_object
from auth import (
    assert_not_locked,
    authenticate_admin,
    clear_failures,
    client_identifier,
    create_access_token,
    record_failure,
    require_admin,
    seed_admin,
)


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str


class EnquiryCreate(BaseModel):
    name: constr(min_length=1, max_length=120)
    email: EmailStr
    phone: constr(max_length=40) = ""
    company: constr(max_length=160) = ""
    subject: constr(max_length=200) = ""
    message: constr(min_length=1, max_length=4000)


class Enquiry(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: str = ""
    company: str = ""
    subject: str = ""
    message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}


@api_router.post("/contact", response_model=Enquiry)
async def create_enquiry(payload: EnquiryCreate):
    enquiry = Enquiry(**payload.model_dump())
    doc = enquiry.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.enquiries.insert_one(doc)

    # Best-effort emails — never fail the submission if email errors.
    try:
        await send_enquiry_notification(enquiry)
    except Exception as e:
        logger.error(f"Enquiry email notification failed: {e}")
    try:
        await send_enquiry_confirmation(enquiry)
    except Exception as e:
        logger.error(f"Enquiry confirmation email failed: {e}")

    return enquiry


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks

ALLOWED_IMAGE_KEYS = {
    "heroVideo",
    "heroBackdrop",
    "machineServicing",
    "spareManufacturing",
    "importSubstitution",
    "capabilities",
    "story",
    "founder",
    "caseReconditioning",
    "caseAerospace",
    "caseInjection",
    "caseDefence",
}


class LoginPayload(BaseModel):
    email: EmailStr
    password: constr(min_length=1, max_length=200)


class SiteImagesPayload(BaseModel):
    images: Dict[str, str]


@api_router.post("/auth/login")
async def admin_login(payload: LoginPayload, request: Request):
    email = payload.email.lower()
    identifier = client_identifier(request, email)
    await assert_not_locked(db, identifier)
    if not await authenticate_admin(db, email, payload.password):
        await record_failure(db, identifier)
        raise HTTPException(status_code=401, detail="Invalid email or password")
    await clear_failures(db, identifier)
    return {"token": create_access_token(email), "email": email}


@api_router.get("/auth/me")
async def admin_me(email: str = Depends(require_admin)):
    return {"email": email, "role": "admin"}


@api_router.get("/site-images")
async def get_site_images():
    doc = await db.site_config.find_one({"key": "images"}, {"_id": 0})
    return {"images": (doc or {}).get("images", {})}


@api_router.put("/site-images")
async def put_site_images(payload: SiteImagesPayload, email: str = Depends(require_admin)):
    updates = {}
    for key, url in payload.images.items():
        if key not in ALLOWED_IMAGE_KEYS:
            raise HTTPException(status_code=400, detail=f"Unknown image key: {key}")
        url = url.strip()
        if not url:
            continue
        if not url.startswith(("http://", "https://", "/api/files/")) or len(url) > 800:
            raise HTTPException(status_code=400, detail=f"Invalid URL for {key}")
        updates[f"images.{key}"] = url
    updates["updated_at"] = datetime.now(timezone.utc).isoformat()
    updates["updated_by"] = email
    await db.site_config.update_one({"key": "images"}, {"$set": updates}, upsert=True)
    doc = await db.site_config.find_one({"key": "images"}, {"_id": 0})
    return {"images": (doc or {}).get("images", {})}


class SiteSettingsPayload(BaseModel):
    brochure_url: constr(max_length=800) = ""
    brochure_filename: constr(max_length=200) = ""


def _settings_response(doc):
    doc = doc or {}
    return {
        "brochure_url": doc.get("brochure_url", ""),
        "brochure_filename": doc.get("brochure_filename", ""),
        "brochure_downloads": doc.get("brochure_downloads", 0),
    }


@api_router.get("/site-settings")
async def get_site_settings():
    doc = await db.site_config.find_one({"key": "settings"}, {"_id": 0})
    return _settings_response(doc)


@api_router.put("/site-settings")
async def put_site_settings(payload: SiteSettingsPayload, email: str = Depends(require_admin)):
    url = payload.brochure_url.strip()
    if url:
        if not url.startswith(("http://", "https://", "/api/files/")):
            raise HTTPException(status_code=400, detail="Invalid brochure URL")
        if not url.lower().split("?")[0].endswith(".pdf"):
            raise HTTPException(status_code=400, detail="Brochure must be a PDF file")
    await db.site_config.update_one(
        {"key": "settings"},
        {
            "$set": {
                "brochure_url": url,
                "brochure_filename": payload.brochure_filename.strip() if url else "",
                "updated_at": datetime.now(timezone.utc).isoformat(),
                "updated_by": email,
            }
        },
        upsert=True,
    )
    doc = await db.site_config.find_one({"key": "settings"}, {"_id": 0})
    return _settings_response(doc)


@api_router.post("/brochure/track-download")
async def track_brochure_download():
    await db.site_config.update_one(
        {"key": "settings"}, {"$inc": {"brochure_downloads": 1}}, upsert=True
    )
    doc = await db.site_config.find_one({"key": "settings"}, {"_id": 0})
    return {"brochure_downloads": (doc or {}).get("brochure_downloads", 0)}


UPLOAD_TMP = Path("/tmp/fs_uploads")
MAX_IMAGE_BYTES = 15 * 1024 * 1024
MAX_VIDEO_BYTES = 80 * 1024 * 1024
MAX_PDF_BYTES = 25 * 1024 * 1024
VIDEO_TYPES = {"video/mp4", "video/webm", "video/quicktime"}
PDF_TYPE = "application/pdf"


@api_router.post("/uploads/chunk")
async def upload_chunk(
    chunk: UploadFile = File(...),
    upload_id: str = Form(...),
    index: int = Form(...),
    total: int = Form(...),
    filename: str = Form(...),
    content_type: str = Form(...),
    email: str = Depends(require_admin),
):
    is_video = content_type in VIDEO_TYPES
    is_pdf = content_type == PDF_TYPE
    if not (is_video or is_pdf or content_type.startswith("image/")):
        raise HTTPException(status_code=400, detail="Only images, mp4/webm videos and PDF files are allowed")
    if not re.fullmatch(r"[A-Za-z0-9-]{8,64}", upload_id):
        raise HTTPException(status_code=400, detail="Invalid upload id")

    folder = UPLOAD_TMP / upload_id
    folder.mkdir(parents=True, exist_ok=True)
    limit = MAX_VIDEO_BYTES if is_video else MAX_PDF_BYTES if is_pdf else MAX_IMAGE_BYTES

    # Drop abandoned partial uploads older than an hour.
    cutoff = datetime.now(timezone.utc).timestamp() - 3600
    for stale in UPLOAD_TMP.iterdir():
        if stale.is_dir() and stale != folder and stale.stat().st_mtime < cutoff:
            shutil.rmtree(stale, ignore_errors=True)

    payload = await chunk.read()
    received = sum(p.stat().st_size for p in folder.iterdir()) + len(payload)
    if received > limit:
        shutil.rmtree(folder, ignore_errors=True)
        raise HTTPException(
            status_code=400,
            detail=f"File is too large — limit is {limit // (1024 * 1024)}MB",
        )
    (folder / f"{index:05d}").write_bytes(payload)

    if index + 1 < total:
        return {"status": "pending", "received": index + 1, "total": total}

    parts = sorted(folder.iterdir())
    data = b"".join(p.read_bytes() for p in parts)
    shutil.rmtree(folder, ignore_errors=True)

    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else "bin"
    if not re.fullmatch(r"[a-z0-9]{1,5}", ext):
        ext = "bin"
    path = f"{APP_NAME}/site-media/{uuid.uuid4()}.{ext}"
    result = await asyncio.to_thread(put_object, path, data, content_type)

    await db.files.insert_one(
        {
            "id": str(uuid.uuid4()),
            "storage_path": result["path"],
            "original_filename": filename[:200],
            "content_type": content_type,
            "size": result.get("size", len(data)),
            "is_deleted": False,
            "uploaded_by": email,
            "created_at": datetime.now(timezone.utc).isoformat(),
        }
    )
    return {"status": "complete", "path": result["path"], "url": f"/api/files/{result['path']}"}


@api_router.get("/files/{path:path}")
async def serve_file(path: str):
    record = await db.files.find_one({"storage_path": path, "is_deleted": False})
    if not record:
        raise HTTPException(status_code=404, detail="File not found")
    data, ctype = await asyncio.to_thread(get_object, path)
    headers = {"Cache-Control": "public, max-age=86400"}
    if (record.get("content_type") or ctype) == PDF_TYPE:
        safe = re.sub(r"[^A-Za-z0-9._ -]", "", record.get("original_filename") or "") or "brochure.pdf"
        headers["Content-Disposition"] = f'inline; filename="{safe}"'
    return Response(
        content=data,
        media_type=record.get("content_type") or ctype,
        headers=headers,
    )


@app.on_event("startup")
async def on_startup():
    await seed_admin(db)
    await db.admin_users.create_index("email", unique=True)
    await db.login_attempts.create_index("identifier")
    await db.files.create_index("storage_path")
    try:
        await asyncio.to_thread(init_storage)
        logger.info("Object storage initialised")
    except Exception as e:
        logger.error(f"Object storage init failed: {e}")


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()