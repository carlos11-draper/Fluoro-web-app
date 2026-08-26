import os
from datetime import datetime, timedelta, timezone
from pathlib import Path

import bcrypt
import jwt
from dotenv import load_dotenv
from fastapi import HTTPException, Request

load_dotenv(Path(__file__).parent / ".env")

JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_HOURS = 12
MAX_ATTEMPTS = 5
LOCKOUT_MINUTES = 15


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


def create_access_token(email: str) -> str:
    payload = {
        "sub": email,
        "type": "access",
        "exp": datetime.now(timezone.utc) + timedelta(hours=ACCESS_TOKEN_HOURS),
    }
    return jwt.encode(payload, os.environ["JWT_SECRET"], algorithm=JWT_ALGORITHM)


def require_admin(request: Request) -> str:
    header = request.headers.get("Authorization", "")
    if not header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(
            header[7:], os.environ["JWT_SECRET"], algorithms=[JWT_ALGORITHM]
        )
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Session expired, sign in again")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    if payload.get("type") != "access" or payload.get("sub") != os.environ["ADMIN_EMAIL"].lower():
        raise HTTPException(status_code=401, detail="Invalid token")
    return payload["sub"]


async def seed_admin(db):
    email = os.environ["ADMIN_EMAIL"].lower()
    password = os.environ["ADMIN_PASSWORD"]
    existing = await db.admin_users.find_one({"email": email})
    if existing is None:
        await db.admin_users.insert_one(
            {
                "email": email,
                "password_hash": hash_password(password),
                "role": "admin",
                "created_at": datetime.now(timezone.utc).isoformat(),
            }
        )
    elif not verify_password(password, existing["password_hash"]):
        await db.admin_users.update_one(
            {"email": email}, {"$set": {"password_hash": hash_password(password)}}
        )


def client_identifier(request: Request, email: str) -> str:
    # Behind the k8s ingress request.client.host is a rotating proxy IP, so the
    # email is the stable key for lockout counting.
    return email.lower()


async def assert_not_locked(db, identifier: str):
    doc = await db.login_attempts.find_one({"identifier": identifier})
    if not doc:
        return
    if doc.get("count", 0) >= MAX_ATTEMPTS:
        last = datetime.fromisoformat(doc["last_attempt"])
        if datetime.now(timezone.utc) - last < timedelta(minutes=LOCKOUT_MINUTES):
            raise HTTPException(
                status_code=429,
                detail=f"Too many failed attempts. Try again in {LOCKOUT_MINUTES} minutes.",
            )
        await db.login_attempts.delete_one({"identifier": identifier})


async def record_failure(db, identifier: str):
    await db.login_attempts.update_one(
        {"identifier": identifier},
        {
            "$inc": {"count": 1},
            "$set": {"last_attempt": datetime.now(timezone.utc).isoformat()},
        },
        upsert=True,
    )


async def clear_failures(db, identifier: str):
    await db.login_attempts.delete_one({"identifier": identifier})


async def authenticate_admin(db, email: str, password: str) -> bool:
    user = await db.admin_users.find_one({"email": email.lower()})
    if not user:
        return False
    return verify_password(password, user["password_hash"])
