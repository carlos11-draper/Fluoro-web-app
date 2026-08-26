import io
import os
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

PDF_BYTES = (
    b"%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n"
    b"2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n"
    b"3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]>>endobj\n"
    b"trailer<</Root 1 0 R>>\n%%EOF"
)


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


def _upload(client, auth, data: bytes, filename: str, ctype: str, chunks: int = 1):
    upload_id = uuid.uuid4().hex[:20]
    size = (len(data) + chunks - 1) // chunks if chunks > 1 else len(data)
    last = None
    for i in range(chunks):
        part = data[i * size:(i + 1) * size] if chunks > 1 else data
        last = client.post(
            f"{BASE_URL}/api/uploads/chunk",
            data={
                "upload_id": upload_id,
                "index": str(i),
                "total": str(chunks),
                "filename": filename,
                "content_type": ctype,
            },
            files={"chunk": (filename, io.BytesIO(part), ctype)},
            headers=auth,
            timeout=180,
        )
        if last.status_code != 200:
            return last, None
    return last, last.json()


class TestBrochureUpload:
    def test_pdf_upload_and_serve_inline(self, client, auth):
        resp, body = _upload(client, auth, PDF_BYTES, "TEST_portfolio.pdf", "application/pdf")
        assert resp.status_code == 200, resp.text
        assert body["status"] == "complete"
        assert body["url"].endswith(".pdf")

        served = client.get(f"{BASE_URL}{body['url']}", timeout=60)
        assert served.status_code == 200
        assert served.content == PDF_BYTES
        assert served.headers["Content-Type"].startswith("application/pdf")
        assert "inline" in served.headers.get("Content-Disposition", "inline")

    def test_pdf_over_25mb_rejected(self, client, auth):
        data = b"%PDF" + b"\x00" * (25 * 1024 * 1024 + 1024)
        r, _ = _upload(client, auth, data, "TEST_big.pdf", "application/pdf", chunks=7)
        assert r.status_code == 400, r.status_code
        assert "large" in r.json().get("detail", "").lower()


class TestSiteSettings:
    def test_get_public(self, client):
        r = client.get(f"{BASE_URL}/api/site-settings", timeout=30)
        assert r.status_code == 200
        body = r.json()
        assert "brochure_url" in body and "brochure_filename" in body
        assert isinstance(body.get("brochure_downloads"), int)

    def test_track_download_increments(self, client):
        before = client.get(f"{BASE_URL}/api/site-settings", timeout=30).json()["brochure_downloads"]
        r = client.post(f"{BASE_URL}/api/brochure/track-download", timeout=30)
        assert r.status_code == 200
        assert r.json()["brochure_downloads"] == before + 1
        after = client.get(f"{BASE_URL}/api/site-settings", timeout=30).json()["brochure_downloads"]
        assert after == before + 1

    def test_put_requires_auth(self, client):
        r = client.put(
            f"{BASE_URL}/api/site-settings",
            json={"brochure_url": "/api/files/x.pdf"},
            timeout=30,
        )
        assert r.status_code == 401

    def test_put_rejects_non_pdf(self, client, auth):
        r = client.put(
            f"{BASE_URL}/api/site-settings",
            json={"brochure_url": "https://example.com/file.exe"},
            headers=auth,
            timeout=30,
        )
        assert r.status_code == 400

    def test_put_rejects_bad_scheme(self, client, auth):
        r = client.put(
            f"{BASE_URL}/api/site-settings",
            json={"brochure_url": "ftp://example.com/file.pdf"},
            headers=auth,
            timeout=30,
        )
        assert r.status_code == 400

    def test_set_and_clear_brochure(self, client, auth):
        before = client.get(f"{BASE_URL}/api/site-settings", timeout=30).json()

        resp, body = _upload(client, auth, PDF_BYTES, "TEST_set.pdf", "application/pdf")
        assert resp.status_code == 200, resp.text

        r = client.put(
            f"{BASE_URL}/api/site-settings",
            json={"brochure_url": body["url"], "brochure_filename": "TEST_set.pdf"},
            headers=auth,
            timeout=30,
        )
        assert r.status_code == 200, r.text
        assert r.json()["brochure_url"] == body["url"]
        assert r.json()["brochure_filename"] == "TEST_set.pdf"

        got = client.get(f"{BASE_URL}/api/site-settings", timeout=30).json()
        assert got["brochure_url"] == body["url"]

        r = client.put(
            f"{BASE_URL}/api/site-settings",
            json={"brochure_url": "", "brochure_filename": ""},
            headers=auth,
            timeout=30,
        )
        assert r.status_code == 200
        cleared = r.json()
        assert cleared["brochure_url"] == "" and cleared["brochure_filename"] == ""

        # restore original state
        client.put(
            f"{BASE_URL}/api/site-settings",
            json={
                "brochure_url": before.get("brochure_url", ""),
                "brochure_filename": before.get("brochure_filename", ""),
            },
            headers=auth,
            timeout=30,
        )
