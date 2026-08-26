import io
import os
import uuid

import pytest
import requests
from dotenv import dotenv_values
from PIL import Image

frontend_env = dotenv_values("/app/frontend/.env")
base_url = os.environ.get("REACT_APP_BACKEND_URL") or frontend_env.get("REACT_APP_BACKEND_URL")
if not base_url:
    raise RuntimeError("REACT_APP_BACKEND_URL missing")
BASE_URL = base_url.rstrip("/")

ADMIN_EMAIL = "admin@fluoroseals.in"
ADMIN_PASSWORD = "FluoroAdmin@2026"


def _png_bytes(w=120, h=80):
    buf = io.BytesIO()
    Image.new("RGB", (w, h), (30, 60, 200)).save(buf, format="PNG")
    return buf.getvalue()


@pytest.fixture(scope="module")
def client():
    return requests.Session()


@pytest.fixture(scope="module")
def auth(client):
    r = client.post(
        f"{BASE_URL}/api/auth/login",
        json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD},
        timeout=30,
    )
    if r.status_code != 200:
        pytest.fail(f"admin login failed {r.status_code}: {r.text[:300]}")
    return {"Authorization": f"Bearer {r.json()['token']}"}


@pytest.fixture(scope="module")
def uploaded_url(client, auth):
    data = _png_bytes()
    r = client.post(
        f"{BASE_URL}/api/uploads/chunk",
        data={
            "upload_id": uuid.uuid4().hex[:20],
            "index": "0",
            "total": "1",
            "filename": "TEST_edit.png",
            "content_type": "image/png",
        },
        files={"chunk": ("TEST_edit.png", io.BytesIO(data), "image/png")},
        headers=auth,
        timeout=60,
    )
    assert r.status_code == 200, r.text
    return r.json()["url"]


def _dims(client, url):
    r = client.get(f"{BASE_URL}{url}", timeout=60)
    assert r.status_code == 200
    return Image.open(io.BytesIO(r.content)).size


class TestTransform:
    def test_requires_auth(self, client, uploaded_url):
        r = client.post(
            f"{BASE_URL}/api/media/transform", json={"url": uploaded_url, "rotate": 90}, timeout=30
        )
        assert r.status_code == 401

    def test_rotate_90_swaps_dimensions(self, client, auth, uploaded_url):
        r = client.post(
            f"{BASE_URL}/api/media/transform",
            json={"url": uploaded_url, "rotate": 90},
            headers=auth,
            timeout=120,
        )
        assert r.status_code == 200, r.text
        new_url = r.json()["url"]
        assert new_url.endswith(".webp")
        assert _dims(client, new_url) == (80, 120)

    def test_crop(self, client, auth, uploaded_url):
        r = client.post(
            f"{BASE_URL}/api/media/transform",
            json={"url": uploaded_url, "crop": {"x": 10, "y": 10, "width": 50, "height": 40}},
            headers=auth,
            timeout=120,
        )
        assert r.status_code == 200, r.text
        assert _dims(client, r.json()["url"]) == (50, 40)

    def test_invalid_rotate(self, client, auth, uploaded_url):
        r = client.post(
            f"{BASE_URL}/api/media/transform",
            json={"url": uploaded_url, "rotate": 45},
            headers=auth,
            timeout=30,
        )
        assert r.status_code == 400

    def test_crop_too_small(self, client, auth, uploaded_url):
        r = client.post(
            f"{BASE_URL}/api/media/transform",
            json={"url": uploaded_url, "crop": {"x": 0, "y": 0, "width": 5, "height": 5}},
            headers=auth,
            timeout=30,
        )
        assert r.status_code == 400

    def test_unknown_file_404(self, client, auth):
        r = client.post(
            f"{BASE_URL}/api/media/transform",
            json={"url": f"/api/files/fluoro-seals/site-media/{uuid.uuid4()}.png", "rotate": 90},
            headers=auth,
            timeout=30,
        )
        assert r.status_code == 404

    def test_bad_scheme(self, client, auth):
        r = client.post(
            f"{BASE_URL}/api/media/transform",
            json={"url": "ftp://x.com/a.png", "rotate": 90},
            headers=auth,
            timeout=30,
        )
        assert r.status_code == 400


class TestHiddenValue:
    def test_put_accepts_hidden_and_restores(self, client, auth):
        before = client.get(f"{BASE_URL}/api/site-images", timeout=30).json()["images"]
        r = client.put(
            f"{BASE_URL}/api/site-images",
            json={"images": {"story": "__hidden__"}},
            headers=auth,
            timeout=30,
        )
        assert r.status_code == 200, r.text
        assert r.json()["images"]["story"] == "__hidden__"

        # restore
        restore = before.get("story", "https://customer-assets-v7afamib.emergentagent.net/job_company-portal-256/artifacts/v4vst1d6_IMG_1154.webp")
        rr = client.put(
            f"{BASE_URL}/api/site-images",
            json={"images": {"story": restore}},
            headers=auth,
            timeout=30,
        )
        assert rr.status_code == 200
