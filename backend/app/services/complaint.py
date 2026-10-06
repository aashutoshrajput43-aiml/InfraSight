import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timezone
from typing import Dict, Any, Tuple
import httpx
from app.core.config import settings

DEPARTMENT_ROUTING = {
    "pothole": "Roads",
    "damaged_road": "Roads",
    "broken_streetlight": "Electricity",
    "overflowing_drain": "Drainage",
    "garbage": "Sanitation",
}

DEPARTMENT_HEADS = {
    "Roads": "Chief Engineer, Roads & Civil Infrastructure Dept., IMC",
    "Electricity": "Superintending Engineer, Streetlighting & Electrical Wing, IMC",
    "Drainage": "Executive Engineer, Stormwater Drainage & Sewage Dept., IMC",
    "Sanitation": "Additional Commissioner, Solid Waste Management & Sanitation, IMC",
}

def generate_complaint_letter(
    issue_id: str,
    issue_type: str,
    area: str,
    address: str,
    severity: float,
    priority_score: float,
    priority_reason: str,
    report_count: int,
    image_url: str = ""
) -> Tuple[str, str]:
    """
    Generates a formal municipal complaint letter addressed to Indore Municipal Corporation.
    Returns (department_name, formal_body_text).
    """
    t_clean = issue_type.lower().replace(" ", "_")
    dept = DEPARTMENT_ROUTING.get(t_clean, "Roads")
    addressee = DEPARTMENT_HEADS.get(dept, "Municipal Commissioner, IMC")

    sev_desc = "Critical" if severity >= 0.7 else ("High" if severity >= 0.4 else "Moderate")
    display_addr = address or f"{area}, Indore, Madhya Pradesh"

    subject = f"URGENT WORK ORDER: {issue_type.replace('_', ' ').title()} at {display_addr} (Priority: {priority_score}/100)"

    body = f"""TO:
{addressee}
Indore Municipal Corporation (IMC),
Nagar Nigam Head Office, Indore, Madhya Pradesh.

SUBJECT: {subject}
REFERENCE CODE: #IND-{issue_id[:8].upper()}
DATE FILED: {datetime.now(timezone.utc).strftime('%B %d, %Y - %I:%M %p UTC')}

Respected Authority,

This automated public works notification has been compiled and verified by the InfraSight AI Public Infrastructure Monitoring System on behalf of the citizens of Indore.

1. INCIDENT DETAILS:
   - Issue Classification : {issue_type.replace('_', ' ').title()}
   - Administrative Zone  : {area} Ward
   - Physical Location    : {display_addr}
   - Assessed Footprint   : {sev_desc} ({int(severity * 100)}% visual severity)
   - Verified Evidence    : {image_url or "Archived on InfraSight Cloud"}

2. CITIZEN PETITION & PRIORITY METRICS:
   - Total Citizen Reports: {report_count} citizen report(s) registered
   - Calculated Priority  : {priority_score} / 100
   - Priority Rationale   : {priority_reason}

3. REQUIRED ACTION:
Due to high vehicular safety hazards and public convenience concerns in this municipal zone, please dispatch the designated {dept} field maintenance team to inspect, cordon off, and execute permanent repair work immediately.

Issued under the Indore Municipal Corporation Smart City e-Governance Framework.
InfraSight Automated Monitoring Dispatcher (Zone Control Room).
"""
    return dept, body.strip()


async def send_complaint_email(
    to_email: str,
    department: str,
    issue_id: str,
    body: str
) -> Dict[str, Any]:
    """
    Sends the complaint email using Resend API, with SMTP or simulated fallback.
    """
    subject = f"[IMC {department.upper()}] Urgent Work Order #{issue_id[:8].upper()}"
    recipient = to_email or settings.COMPLAINT_TO_EMAIL or "imc-road-works-test@indore.nic.in"
    sender = settings.COMPLAINT_FROM_EMAIL

    # 1. Try Resend if API key is provided
    if settings.RESEND_API_KEY and settings.RESEND_API_KEY.startswith("re_"):
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.post(
                    "https://api.resend.com/emails",
                    headers={
                        "Authorization": f"Bearer {settings.RESEND_API_KEY}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "from": sender,
                        "to": [recipient],
                        "subject": subject,
                        "text": body
                    }
                )
                if res.status_code in (200, 201):
                    return {"status": "Sent", "provider": "Resend", "data": res.json()}
        except Exception:
            pass

    # 2. Try SMTP if configured
    if settings.SMTP_USER and settings.SMTP_PASSWORD:
        try:
            msg = MIMEMultipart()
            msg["From"] = sender
            msg["To"] = recipient
            msg["Subject"] = subject
            msg.attach(MIMEText(body, "plain"))

            with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=5) as server:
                if settings.SMTP_USE_TLS:
                    server.starttls()
                server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
                server.send_message(msg)
            return {"status": "Sent", "provider": "SMTP", "recipient": recipient}
        except Exception:
            pass

    # 3. Simulated delivery fallback (safe for offline demo)
    return {
        "status": "Simulated",
        "provider": "Mock Dispatcher",
        "recipient": recipient,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
