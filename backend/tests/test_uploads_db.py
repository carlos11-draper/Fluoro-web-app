import io
import os
import uuid
from pathlib import Path

import pytest
import requests
from dotenv import dotenv_values
from motor.motor_asyncio import AsyncIOMotorClient

frontend_env = dotenv_values("/app/frontend/.env")
backend_env = dotenv_values("/app/backend/.env")
BASE_URL = (os.environ.get("REACT_APP_BACKEND_URL") or frontend_env["REACT_APP_BACKEND_URL"]).rstrip("/")
MONGO_URL = backend_env["MONGO_URL"]
DB_NAME = backend_env["DB_NAME"]

PNG_BYTES = (
    b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06"
    b"\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\nIDATx\x9cc\x00\x01\x00\x00\x05\x00"
    b"\x01\r\n-\xb4\x00\x00\x00\x00IEND\xaeB`\x82"
)


# --- db.files persistence for uploads ---
@pytest.mark.anyio
async def test_upload_recorded_in_mongo_files_collection():
    s = requests.Session()
    login = s.post(
        f"{BASE_URL}/api/auth/login",
        json={"email": "admin@fluoroseals.in", "password": "FluoroAdmin@2026"},
        timeout=30,
    )
    assert login.status_code == 200, login.text
    auth = {"Authorization": f"Bearer {login.json()['token']}"}

    r = s.post(
        f"{BASE_URL}/api/uploads/chunk",
        data={
            "upload_id": uuid.uuid4().hex[:20],
            "index": "0",
            "total": "1",
            "filename": "TEST_dbcheck.png",
            "content_type": "image/png",
        },
        files={"chunk": ("TEST_dbcheck.png", io.BytesIO(PNG_BYTES), "image/png")},
        headers=auth,
        timeout=60,
    )
    assert r.status_code == 200, r.text
    body = r.json()

    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    try:
        rec = await db.files.find_one({"storage_path": body["path"]}, {"_id": 0})
        assert rec is not None, "upload not recorded in db.files"
        assert rec["is_deleted"] is False
        assert rec["content_type"] == "image/png"
        assert rec["original_filename"] == "TEST_dbcheck.png"
        assert rec["uploaded_by"] == "admin@fluoroseals.in"
        assert body["url"] == f"/api/files/{rec['storage_path']}"
        assert rec["size"] == len(PNG_BYTES)

        # soft-delete cleanup -> file must stop serving
        await db.files.update_one({"storage_path": body["path"]}, {"$set": {"is_deleted": True}})
        gone = s.get(f"{BASE_URL}{body['url']}", timeout=30)
        assert gone.status_code == 404
    finally:
        client.close()


@pytest.fixture
def anyio_backend():
    return "asyncio"
