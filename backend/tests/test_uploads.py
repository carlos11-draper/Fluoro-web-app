import io
import os
import re
import uuid

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

PNG_BYTES = (
    b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06"
    b"\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\nIDATx\x9cc\x00\x01\x00\x00\x05\x00"
    b"\x01\r\n-\xb4\x00\x00\x00\x00IEND\xaeB`\x82"
)


@pytest.fixture(scope="module")
def client():
    return requests.Session()


@pytest.fixture(scope="module")
def token(client):
    r = client.post(
        f"{BASE_URL}/api/auth/login",
        json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD},
        timeout=30,
    )
    if r.status_code != 200:
        pytest.fail(f"admin login failed {r.status_code}: {r.text[:300]}")
    tok = r.json().get("token")
    assert tok
    return tok


@pytest.fixture(scope="module")
def auth(token):
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture(scope="module")
def created_paths():
    return []


def _upload(client, auth, data: bytes, filename: str, ctype: str, chunks: int = 1):
    upload_id = uuid.uuid4().hex[:20]
    size = (len(data) + chunks - 1) // chunks if chunks > 1 else len(data)
    last = None
    for i in range(chunks):
        part = data[i * size:(i + 1) * size] if chunks > 1 else data
        files = {"chunk": (filename, io.BytesIO(part), ctype)}
        form = {
            "upload_id": upload_id,
            "index": str(i),
            "total": str(chunks),
            "filename": filename,
            "content_type": ctype,
        }
        last = client.post(
            f"{BASE_URL}/api/uploads/chunk", data=form, files=files, headers=auth, timeout=180
        )
        if last.status_code != 200:
            return last, None
    return last, last.json()


# --- POST /api/uploads/chunk : happy path (single chunk image) ---
class TestUploadImage:
    def test_single_chunk_image_upload_and_serve(self, client, auth, created_paths):
        resp, body = _upload(client, auth, PNG_BYTES, "TEST_pixel.png", "image/png")
        assert resp.status_code == 200, resp.text
        assert body["status"] == "complete"
        assert re.fullmatch(r"/api/files/fluoro-seals/site-media/[0-9a-f-]{36}\.png", body["url"]), body
        created_paths.append(body["path"])

        served = client.get(f"{BASE_URL}{body['url']}", timeout=60)
        assert served.status_code == 200
        assert served.content == PNG_BYTES
        assert served.headers["Content-Type"].startswith("image/png")
        # NOTE: app sets Cache-Control public,max-age=86400 but the preview ingress
        # rewrites it to no-store, so we do not assert on it here.


# --- Chunked assembly correctness ---
class TestChunkAssembly:
    def test_multi_chunk_assembles_identically(self, client, auth, created_paths):
        data = os.urandom(200_000)
        upload_id = uuid.uuid4().hex[:20]
        half = len(data) // 2

        r0 = client.post(
            f"{BASE_URL}/api/uploads/chunk",
            data={
                "upload_id": upload_id,
                "index": "0",
                "total": "2",
                "filename": "TEST_clip.mp4",
                "content_type": "video/mp4",
            },
            files={"chunk": ("TEST_clip.mp4", io.BytesIO(data[:half]), "video/mp4")},
            headers=auth,
            timeout=120,
        )
        assert r0.status_code == 200, r0.text
        assert r0.json() == {"status": "pending", "received": 1, "total": 2}

        r1 = client.post(
            f"{BASE_URL}/api/uploads/chunk",
            data={
                "upload_id": upload_id,
                "index": "1",
                "total": "2",
                "filename": "TEST_clip.mp4",
                "content_type": "video/mp4",
            },
            files={"chunk": ("TEST_clip.mp4", io.BytesIO(data[half:]), "video/mp4")},
            headers=auth,
            timeout=120,
        )
        assert r1.status_code == 200, r1.text
        body = r1.json()
        assert body["status"] == "complete"
        assert body["url"].endswith(".mp4")
        created_paths.append(body["path"])

        served = client.get(f"{BASE_URL}{body['url']}", timeout=120)
        assert served.status_code == 200
        assert served.content == data
        assert served.headers["Content-Type"].startswith("video/mp4")


# --- Security & limits ---
class TestUploadSecurity:
    def test_upload_requires_auth(self, client):
        r = client.post(
            f"{BASE_URL}/api/uploads/chunk",
            data={
                "upload_id": uuid.uuid4().hex[:20],
                "index": "0",
                "total": "1",
                "filename": "x.png",
                "content_type": "image/png",
            },
            files={"chunk": ("x.png", io.BytesIO(PNG_BYTES), "image/png")},
            timeout=30,
        )
        assert r.status_code == 401, r.status_code

    @pytest.mark.parametrize("ctype", ["application/x-msdownload", "text/html"])
    def test_disallowed_content_type(self, client, auth, ctype):
        r, _ = _upload(client, auth, b"hello", "TEST_bad.bin", ctype)
        assert r.status_code == 400, r.text
        assert "allowed" in r.json().get("detail", "").lower()

    def test_invalid_upload_id(self, client, auth):
        r = client.post(
            f"{BASE_URL}/api/uploads/chunk",
            data={
                "upload_id": "bad id!!",
                "index": "0",
                "total": "1",
                "filename": "x.png",
                "content_type": "image/png",
            },
            files={"chunk": ("x.png", io.BytesIO(PNG_BYTES), "image/png")},
            headers=auth,
            timeout=30,
        )
        assert r.status_code == 400, r.text

    def test_image_over_15mb_rejected(self, client, auth):
        data = b"\x00" * (15 * 1024 * 1024 + 1024)
        r, _ = _upload(client, auth, data, "TEST_big.png", "image/png", chunks=4)
        assert r.status_code == 400, r.status_code
        assert "large" in r.json().get("detail", "").lower()

    def test_unknown_file_path_404(self, client):
        r = client.get(f"{BASE_URL}/api/files/fluoro-seals/site-media/{uuid.uuid4()}.png", timeout=30)
        assert r.status_code == 404


# --- PUT /api/site-images regression with /api/files values ---
class TestSiteImages:
    def test_get_public(self, client):
        r = client.get(f"{BASE_URL}/api/site-images", timeout=30)
        assert r.status_code == 200
        assert isinstance(r.json().get("images"), dict)

    def test_put_rejects_unknown_key(self, client, auth):
        r = client.put(
            f"{BASE_URL}/api/site-images", json={"images": {"nopeKey": "https://x.com/a.png"}}, headers=auth, timeout=30
        )
        assert r.status_code == 400

    def test_put_rejects_bad_scheme(self, client, auth):
        r = client.put(
            f"{BASE_URL}/api/site-images", json={"images": {"founder": "ftp://x.com/a.png"}}, headers=auth, timeout=30
        )
        assert r.status_code == 400

    def test_put_requires_auth(self, client):
        r = client.put(
            f"{BASE_URL}/api/site-images", json={"images": {"founder": "https://x.com/a.png"}}, timeout=30
        )
        assert r.status_code == 401

    def test_put_accepts_api_files_url_and_merges(self, client, auth, created_paths):
        before = client.get(f"{BASE_URL}/api/site-images", timeout=30).json()["images"]
        resp, body = _upload(client, auth, PNG_BYTES, "TEST_slot.png", "image/png")
        assert resp.status_code == 200, resp.text
        created_paths.append(body["path"])

        r = client.put(
            f"{BASE_URL}/api/site-images", json={"images": {"founder": body["url"]}}, headers=auth, timeout=30
        )
        assert r.status_code == 200, r.text
        images = r.json()["images"]
        assert images["founder"] == body["url"]
        # per-key merge: previously stored keys untouched
        for k, v in before.items():
            if k != "founder":
                assert images.get(k) == v

        got = client.get(f"{BASE_URL}/api/site-images", timeout=30).json()["images"]
        assert got["founder"] == body["url"]

        # restore
        if "founder" in before:
            client.put(
                f"{BASE_URL}/api/site-images", json={"images": {"founder": before["founder"]}}, headers=auth, timeout=30
            )
