"""Verifies enquiries submitted through the public API land in MongoDB (collection: enquiries)."""
import os
import uuid

import pytest
import requests
from dotenv import dotenv_values
from motor.motor_asyncio import AsyncIOMotorClient

benv = dotenv_values("/app/backend/.env")
fenv = dotenv_values("/app/frontend/.env")
MONGO_URL = os.environ.get("MONGO_URL") or benv["MONGO_URL"]
DB_NAME = os.environ.get("DB_NAME") or benv["DB_NAME"]
BASE_URL = (os.environ.get("REACT_APP_BACKEND_URL") or fenv["REACT_APP_BACKEND_URL"]).rstrip("/")


@pytest.mark.anyio
async def test_enquiry_persisted_and_cleaned_up():
    tag = uuid.uuid4().hex[:8]
    email = f"qa_rfq_{tag}@example.com"
    payload = {
        "name": "TEST_QA_Rfq",
        "email": email,
        "company": "TEST_QA_Co",
        "message": "TEST_QA marker persistence check",
    }
    r = requests.post(f"{BASE_URL}/api/contact", json=payload, timeout=30)
    assert r.status_code == 200, r.text

    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    try:
        doc = await db.enquiries.find_one({"email": email}, {"_id": 0})
        assert doc is not None, "enquiry not found in enquiries collection"
        assert doc["name"] == "TEST_QA_Rfq"
        assert doc["company"] == "TEST_QA_Co"
        assert "TEST_QA marker" in doc["message"]
        assert doc["id"] == r.json()["id"]
    finally:
        await db.enquiries.delete_many({"email": email})
        client.close()


@pytest.fixture
def anyio_backend():
    return "asyncio"
