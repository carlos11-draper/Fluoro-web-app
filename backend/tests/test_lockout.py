"""Brute-force lockout test — uses a throwaway email so the real admin identifier is never locked."""
import os

import pytest
import requests
from dotenv import dotenv_values

frontend_env = dotenv_values("/app/frontend/.env")
BASE_URL = (os.environ.get("REACT_APP_BACKEND_URL") or frontend_env["REACT_APP_BACKEND_URL"]).rstrip("/")
DUMMY_EMAIL = "qa_lockout_probe@example.com"


def _login(email, password):
    return requests.post(
        f"{BASE_URL}/api/auth/login", json={"email": email, "password": password}, timeout=30
    )


def test_lockout_after_five_failures():
    statuses = [_login(DUMMY_EMAIL, "WrongPass_123").status_code for _ in range(6)]
    print("statuses:", statuses)
    assert statuses[:5] == [401] * 5, statuses
    assert statuses[5] == 429, f"expected 429 lockout on 6th attempt, got {statuses}"


@pytest.fixture(autouse=True)
def cleanup():
    yield
    import asyncio

    from motor.motor_asyncio import AsyncIOMotorClient

    benv = dotenv_values("/app/backend/.env")

    async def _clean():
        c = AsyncIOMotorClient(os.environ.get("MONGO_URL") or benv["MONGO_URL"])
        db = c[os.environ.get("DB_NAME") or benv["DB_NAME"]]
        await db.login_attempts.delete_many({"identifier": {"$regex": DUMMY_EMAIL}})
        await db.enquiries.delete_many({"name": {"$regex": "^TEST_QA"}})
        c.close()

    asyncio.new_event_loop().run_until_complete(_clean())
