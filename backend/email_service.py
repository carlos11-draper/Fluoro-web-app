"""Transactional email via Emergent's managed Resend integration.

Sends an internal notification to the company owner inbox whenever a new
enquiry is submitted through the website contact form. Recipient comes from
server-side config (OWNER_EMAIL), body is built from a fixed server-side
template with all caller-supplied values escaped.
"""
import os
import re
import ipaddress
import logging
import httpx
from html import escape
from html.parser import HTMLParser
from urllib.parse import urlparse
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent / '.env')

logger = logging.getLogger(__name__)

# Emergent managed email proxy. Hardcoded constant so it survives deployment.
EMAIL_BASE_URL = "https://integrations.emergentagent.com"
EMAIL_KEY = os.environ["EMERGENT_EMAIL_KEY"]
EMAIL_FROM_NAME = os.environ["EMAIL_FROM_NAME"]
OWNER_EMAIL = os.environ["OWNER_EMAIL"]

# Public company contact details shown in the customer confirmation email.
COMPANY_PHONE = "+91 98450 48359"

# ---------------------------------------------------------------------------
# Guardrail gate (copied from the Resend playbook — do not weaken)
# ---------------------------------------------------------------------------
_SHORTENERS = ("bit.ly", "tinyurl.com", "t.co", "is.gd", "cutt.ly", "goo.gl", "rebrand.ly")
_CRED_ASK = ("reply with your password", "reply with the code", "send your password", "cvv",
             "send us your password", "enter your password below", "confirm your card number",
             "your full card number", "seed phrase", "recovery phrase", "verify your card",
             "social security number", "confirm your bank details")
_HOSTISH = re.compile(r"\b(?:https?://)?((?:[a-z0-9-]+\.)+[a-z]{2,})", re.I)


def _host_ok(host: str) -> bool:
    if not host or "xn--" in host:
        return False
    try:
        ipaddress.ip_address(host)
        return False
    except ValueError:
        pass
    return not any(host == s or host.endswith("." + s) for s in _SHORTENERS)


def _same_site(shown: str, real: str) -> bool:
    return shown == real or real.endswith("." + shown) or shown.endswith("." + real)


class _EmailScan(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags, self.urls, self.anchors = set(), [], []
        self._href, self._text = None, []

    def handle_starttag(self, tag, attrs):
        self.tags.add(tag.lower())
        self.urls += [v for k, v in attrs if k.lower() in ("href", "src") and v]
        if tag.lower() == "a":
            self._href = dict((k.lower(), v) for k, v in attrs).get("href")
            self._text = []

    def handle_data(self, data):
        if self._href is not None:
            self._text.append(data)

    def handle_endtag(self, tag):
        if tag.lower() == "a" and self._href is not None:
            self.anchors.append((self._href, "".join(self._text)))
            self._href, self._text = None, []


def _assert_safe_email(subject: str, html: str) -> None:
    scan = _EmailScan()
    scan.feed(html)
    if scan.tags & {"form", "input", "textarea", "select"}:
        raise ValueError("No forms or input fields in email (G2)")
    body = f"{subject}\n{html}".lower()
    for p in _CRED_ASK:
        if p in body:
            raise ValueError(f"Email asks the recipient for credentials: {p!r} (G2)")
    for url in scan.urls:
        low = url.strip().lower()
        if low.startswith(("mailto:", "tel:", "cid:", "#")):
            continue
        if not low.startswith("https://"):
            raise ValueError(f"Email links/assets must be absolute https: {url!r} (G3)")
        host = urlparse(low).hostname or ""
        if not _host_ok(host) or urlparse(low).username is not None:
            raise ValueError(f"Shortened, numeric-host or credential-bearing URL: {url!r} (G3)")
    for href, text in scan.anchors:
        real = urlparse(href.strip().lower()).hostname or ""
        if not real:
            continue
        for m in _HOSTISH.finditer(text):
            if not _same_site(m.group(1).lower(), real):
                raise ValueError(f"Anchor text {m.group(1)!r} != real link host {real!r} (G3)")


# ---------------------------------------------------------------------------
# Send helper + enquiry notification
# ---------------------------------------------------------------------------
async def _send_email(*, to: str, subject: str, html: str) -> str | None:
    _assert_safe_email(subject, html)
    payload = {"to": [to], "subject": subject, "html": html, "from_name": EMAIL_FROM_NAME}
    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.post(
            f"{EMAIL_BASE_URL}/api/v1/email/send",
            headers={"X-Email-Key": EMAIL_KEY},
            json=payload,
        )
    resp.raise_for_status()
    return resp.json().get("id")


def _row(label: str, value: str) -> str:
    if not value:
        value = "—"
    return (
        f'<tr>'
        f'<td style="padding:8px 16px;font-family:Arial,sans-serif;font-size:13px;'
        f'color:#64748b;text-transform:uppercase;letter-spacing:1px;white-space:nowrap;'
        f'vertical-align:top">{escape(label)}</td>'
        f'<td style="padding:8px 16px;font-family:Arial,sans-serif;font-size:15px;'
        f'color:#0f172a">{escape(value)}</td>'
        f'</tr>'
    )


async def send_enquiry_notification(enquiry) -> str | None:
    """Notify the company owner of a new website enquiry.

    Best-effort: raises on failure so the caller can log it, but the caller
    must not fail the user's form submission if this errors.
    """
    subject = f"New website enquiry — {enquiry.name}"
    rows = (
        _row("Name", enquiry.name)
        + _row("Email", enquiry.email)
        + _row("Phone", enquiry.phone)
        + _row("Company", enquiry.company)
        + _row("Subject", enquiry.subject)
        + _row("Message", enquiry.message)
    )
    html = (
        f'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" '
        f'style="background:#f8fafc;padding:24px">'
        f'<tr><td>'
        f'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" '
        f'style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0">'
        f'<tr><td style="background:#0f172a;padding:20px 24px">'
        f'<div style="font-family:Arial,sans-serif;font-size:18px;font-weight:bold;'
        f'color:#ffffff;text-transform:uppercase;letter-spacing:1px">New Enquiry</div>'
        f'<div style="font-family:Arial,sans-serif;font-size:12px;color:#60a5fa;'
        f'letter-spacing:2px;text-transform:uppercase;margin-top:4px">'
        f'{escape(EMAIL_FROM_NAME)}</div>'
        f'</td></tr>'
        f'<tr><td style="padding:16px 8px">'
        f'<table role="presentation" width="100%" cellpadding="0" cellspacing="0">{rows}</table>'
        f'</td></tr>'
        f'<tr><td style="padding:16px 24px;border-top:1px solid #e2e8f0">'
        f'<div style="font-family:Arial,sans-serif;font-size:12px;color:#94a3b8">'
        f'This enquiry was submitted through the {escape(EMAIL_FROM_NAME)} website contact form. '
        f'Reply directly to the customer using the email address above.'
        f'</div></td></tr>'
        f'</table></td></tr></table>'
    )
    return await _send_email(to=OWNER_EMAIL, subject=subject, html=html)



async def send_enquiry_confirmation(enquiry) -> str | None:
    """Send a branded 'we received your enquiry' confirmation to the customer.

    Transactional auto-reply to the address the submitter provided. Body is a
    fixed server-side template; only the escaped name is interpolated.
    """
    first_name = escape((enquiry.name or "there").strip().split(" ")[0])
    subject = f"We've received your enquiry — {EMAIL_FROM_NAME}"
    html = (
        f'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" '
        f'style="background:#f8fafc;padding:24px">'
        f'<tr><td>'
        f'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" '
        f'style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0">'
        f'<tr><td style="background:#1d4ed8;padding:24px">'
        f'<div style="font-family:Arial,sans-serif;font-size:20px;font-weight:bold;'
        f'color:#ffffff;text-transform:uppercase;letter-spacing:1px">Enquiry Received</div>'
        f'<div style="font-family:Arial,sans-serif;font-size:12px;color:#bfdbfe;'
        f'letter-spacing:2px;text-transform:uppercase;margin-top:4px">'
        f'{escape(EMAIL_FROM_NAME)}</div>'
        f'</td></tr>'
        f'<tr><td style="padding:28px 24px">'
        f'<p style="font-family:Arial,sans-serif;font-size:16px;color:#0f172a;margin:0 0 16px">'
        f'Dear {first_name},</p>'
        f'<p style="font-family:Arial,sans-serif;font-size:15px;color:#334155;'
        f'line-height:1.6;margin:0 0 16px">'
        f'Thank you for reaching out to {escape(EMAIL_FROM_NAME)}. We have received your '
        f'enquiry and our engineering team will review your requirement and respond to you '
        f'shortly.</p>'
        f'<p style="font-family:Arial,sans-serif;font-size:15px;color:#334155;'
        f'line-height:1.6;margin:0 0 16px">'
        f'For anything urgent, you can reach us directly on '
        f'<a href="tel:{COMPANY_PHONE.replace(" ", "")}" '
        f'style="color:#1d4ed8;text-decoration:none;font-weight:bold">{escape(COMPANY_PHONE)}</a>.</p>'
        f'<p style="font-family:Arial,sans-serif;font-size:15px;color:#0f172a;margin:24px 0 0">'
        f'Warm regards,<br><strong>{escape(EMAIL_FROM_NAME)}</strong></p>'
        f'</td></tr>'
        f'<tr><td style="padding:16px 24px;border-top:1px solid #e2e8f0">'
        f'<div style="font-family:Arial,sans-serif;font-size:12px;color:#94a3b8">'
        f'This is an automated confirmation from the {escape(EMAIL_FROM_NAME)} website. '
        f'We never ask for passwords or payment details by email.'
        f'</div></td></tr>'
        f'</table></td></tr></table>'
    )
    return await _send_email(to=enquiry.email, subject=subject, html=html)
