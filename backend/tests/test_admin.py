"""Admin auth + site-images API tests (Fluoro Seals)."""
import os

import pytest
import requests
from dotenv import dotenv_values

frontend_env = dotenv_values("/app/frontend/.env")
base_url = os.environ.get("REACT_APP_BACKEND_URL") or frontend_env.get("REACT_APP_BACKEND_URL")
if not base_url:
    raise RuntimeError("REACT_APP_BACKEND_URL missing")
BASE_URL = base_url.rstrip("/")

ADMIN_EMAIL = "admin@fluoroseals.in"
ADMIN_PASSWORD = "FluoroAdmin@2026"

ORIGINAL_HERO = None


@pytest.fixture(scope="module")
def api_client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="module")
def token(api_client):
    r = api_client.post(
        f"{BASE_URL}/api/auth/login",
        json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD},
        timeout=30,
    )
    if r.status_code != 200:
        pytest.fail(f"Admin login failed {r.status_code}: {r.text[:300]}")
    data = r.json()
    assert data["email"] == ADMIN_EMAIL
    assert isinstance(data["token"], str) and len(data["token"]) > 20
    return data["token"]


# --- Auth ---
class TestAuth:
    def test_login_success(self, token):
        assert token

    def test_login_wrong_password(self, api_client):
        r = api_client.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": ADMIN_EMAIL, "password": "WrongPass_123"},
            timeout=30,
        )
        assert r.status_code == 401, r.text
        assert "detail" in r.json()

    def test_login_invalid_email_format(self, api_client):
        r = api_client.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": "not-an-email", "password": "x"},
            timeout=30,
        )
        assert r.status_code == 422, r.text

    def test_me_requires_token(self, api_client):
        r = requests.get(f"{BASE_URL}/api/auth/me", timeout=30)
        assert r.status_code == 401, r.text

    def test_me_with_token(self, token):
        r = requests.get(
            f"{BASE_URL}/api/auth/me",
            headers={"Authorization": f"Bearer {token}"},
            timeout=30,
        )
        assert r.status_code == 200, r.text
        body = r.json()
        assert body["email"] == ADMIN_EMAIL
        assert body["role"] == "admin"

    def test_me_with_garbage_token(self):
        r = requests.get(
            f"{BASE_URL}/api/auth/me",
            headers={"Authorization": "Bearer abc.def.ghi"},
            timeout=30,
        )
        assert r.status_code == 401, r.text

    def test_bcrypt_hash_format(self):
        """Stored admin password hash must be a bcrypt $2b$ hash."""
        import asyncio

        from motor.motor_asyncio import AsyncIOMotorClient

        async def _get():
            c = AsyncIOMotorClient(os.environ.get("MONGO_URL") or dotenv_values("/app/backend/.env")["MONGO_URL"])
            dbname = os.environ.get("DB_NAME") or dotenv_values("/app/backend/.env")["DB_NAME"]
            doc = await c[dbname].admin_users.find_one({"email": ADMIN_EMAIL})
            c.close()
            return doc

        doc = asyncio.get_event_loop().run_until_complete(_get())
        assert doc is not None, "admin user not seeded"
        assert doc["password_hash"].startswith("$2b$"), doc["password_hash"][:10]


# --- Site images ---
class TestSiteImages:
    def test_get_public(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/site-images", timeout=30)
        assert r.status_code == 200, r.text
        body = r.json()
        assert isinstance(body.get("images"), dict)
        global ORIGINAL_HERO
        ORIGINAL_HERO = body["images"]

    def test_put_requires_auth(self, api_client):
        r = requests.put(
            f"{BASE_URL}/api/site-images",
            json={"images": {"heroBackdrop": "https://example.com/a.jpg"}},
            timeout=30,
        )
        assert r.status_code == 401, r.text

    def test_put_unknown_key_rejected(self, token):
        r = requests.put(
            f"{BASE_URL}/api/site-images",
            json={"images": {"notAKey": "https://example.com/a.jpg"}},
            headers={"Authorization": f"Bearer {token}"},
            timeout=30,
        )
        assert r.status_code == 400, r.text

    def test_put_non_http_url_rejected(self, token):
        r = requests.put(
            f"{BASE_URL}/api/site-images",
            json={"images": {"heroBackdrop": "javascript:alert(1)"}},
            headers={"Authorization": f"Bearer {token}"},
            timeout=30,
        )
        assert r.status_code == 400, r.text

    def test_put_and_get_persistence_then_restore(self, token):
        prev = requests.get(f"{BASE_URL}/api/site-images", timeout=30).json()["images"]
        new_url = "https://images.pexels.com/photos/36532643/pexels-photo-36532643.jpeg"
        r = requests.put(
            f"{BASE_URL}/api/site-images",
            json={"images": {**prev, "heroBackdrop": new_url}},
            headers={"Authorization": f"Bearer {token}"},
            timeout=30,
        )
        assert r.status_code == 200, r.text
        assert r.json()["images"]["heroBackdrop"] == new_url

        g = requests.get(f"{BASE_URL}/api/site-images", timeout=30)
        assert g.status_code == 200
        assert g.json()["images"]["heroBackdrop"] == new_url

        # restore
        rr = requests.put(
            f"{BASE_URL}/api/site-images",
            json={"images": prev},
            headers={"Authorization": f"Bearer {token}"},
            timeout=30,
        )
        assert rr.status_code == 200
        assert requests.get(f"{BASE_URL}/api/site-images", timeout=30).json()["images"] == prev
