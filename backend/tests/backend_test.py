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


@pytest.fixture(scope="module")
def api_client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# --- Health / root ---
class TestHealth:
    def test_root(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/", timeout=30)
        assert r.status_code == 200
        assert r.json().get("message") == "Hello World"


# --- Contact / Enquiry endpoints ---
class TestContact:
    def test_create_enquiry_full_payload(self, api_client):
        tag = str(uuid.uuid4())[:8]
        payload = {
            "name": f"TEST_User_{tag}",
            "email": f"test_{tag}@example.com",
            "phone": "+91 9999999999",
            "company": "TEST_Co",
            "subject": "TEST_Subject",
            "message": "TEST message body for 500T PDC machine reconditioning.",
        }
        r = api_client.post(f"{BASE_URL}/api/contact", json=payload, timeout=30)
        assert r.status_code == 200, r.text
        data = r.json()
        assert isinstance(data.get("id"), str) and len(data["id"]) > 0
        assert "_id" not in data
        for k, v in payload.items():
            assert data[k] == v
        assert "created_at" in data

    def test_create_enquiry_minimal_payload(self, api_client):
        tag = str(uuid.uuid4())[:8]
        payload = {"name": f"TEST_Min_{tag}", "email": f"min_{tag}@example.com", "message": "TEST minimal"}
        r = api_client.post(f"{BASE_URL}/api/contact", json=payload, timeout=30)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["phone"] == ""
        assert data["company"] == ""
        assert data["subject"] == ""

    def test_create_enquiry_missing_required_fields(self, api_client):
        r = api_client.post(f"{BASE_URL}/api/contact", json={"name": "TEST_NoMsg"}, timeout=30)
        assert r.status_code == 422, r.text

    def test_create_enquiry_invalid_email_rejected(self, api_client):
        """Backend now uses EmailStr - invalid emails must be rejected with 422."""
        tag = str(uuid.uuid4())[:8]
        r = api_client.post(
            f"{BASE_URL}/api/contact",
            json={"name": f"TEST_BadEmail_{tag}", "email": "not-an-email", "message": "TEST"},
            timeout=30,
        )
        assert r.status_code == 422, r.text

    def test_list_enquiries_endpoint_removed(self, api_client):
        """GET /api/contact was removed to avoid public PII exposure."""
        r = api_client.get(f"{BASE_URL}/api/contact", timeout=30)
        assert r.status_code == 405, r.text


# --- Status endpoints (template routes) ---
class TestStatus:
    def test_status_create_and_list(self, api_client):
        tag = str(uuid.uuid4())[:8]
        r = api_client.post(f"{BASE_URL}/api/status", json={"client_name": f"TEST_{tag}"}, timeout=30)
        assert r.status_code == 200, r.text
        assert r.json()["client_name"] == f"TEST_{tag}"
        lr = api_client.get(f"{BASE_URL}/api/status", timeout=30)
        assert lr.status_code == 200
        assert any(i["client_name"] == f"TEST_{tag}" for i in lr.json())
