import os
from pathlib import Path
from typing import Optional
from fastapi import APIRouter, Depends, Form, File, UploadFile, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db, haversine_distance_meters
from app.core.auth import get_current_user, CurrentUser
from app.models import Issue, Report, ConnectedHazard, StatusHistory, Complaint
from app.services.storage import save_uploaded_image
from app.services.detection import detect_infrastructure_issues
from app.services.osm import get_location_context
from app.services.priority import calculate_priority
from app.services.complaint import generate_complaint_letter
from app.schemas import IssueResponse

router = APIRouter(prefix="/reports", tags=["Reports"])

# Connected hazard risk rules (within 30m)
RISK_RULES = {
    frozenset(["broken_streetlight", "pothole"]): "high",
    frozenset(["overflowing_drain", "damaged_road"]): "high",
    frozenset(["garbage", "overflowing_drain"]): "medium",
}

def determine_hazard_risk(type_a: str, type_b: str) -> Optional[str]:
    pair = frozenset([type_a.lower(), type_b.lower()])
    return RISK_RULES.get(pair, None)

@router.post("", response_model=IssueResponse)
async def create_report(
    image: UploadFile = File(...),
    latitude: float = Form(...),
    longitude: float = Form(...),
    category: Optional[str] = Form(None),
    address: Optional[str] = Form(None),
    area: Optional[str] = Form("Vijay Nagar"),
    description: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    user: CurrentUser = Depends(get_current_user),
):
    """
    POST /reports:
    1. Validates & stores image.
    2. Runs hybrid AI detection (YOLOv8 + Vision LLM).
    3. Handles category selection or AI classification.
    4. Deduplication: if same class within 20m of open issue, merge and increment.
    5. Calculates priority score from formula with Overpass OSM context.
    6. Identifies connected hazards within 30m.
    7. Generates formal IMC complaint.
    """
    # 1. Save photo
    image_url = await save_uploaded_image(image)

    # 2. Hybrid AI detection
    upload_local_path = ""
    if image_url.startswith("/uploads/"):
        upload_local_path = str(Path(__file__).resolve().parent.parent.parent / "uploads" / image_url.replace("/uploads/", ""))

    detections = await detect_infrastructure_issues(
        upload_local_path,
        fallback_hint=category or image.filename or ""
    )

    # Determine primary issue class and severity
    if category and category.lower() != "auto":
        clean_cat = category.lower().replace(" ", "_").replace("🕳️_", "").replace("💡_", "").replace("🌊_", "").replace("🚮_", "").replace("🛣️_", "")
        # map common strings
        if "pothole" in clean_cat:
            issue_type = "pothole"
        elif "streetlight" in clean_cat or "light" in clean_cat:
            issue_type = "broken_streetlight"
        elif "drain" in clean_cat:
            issue_type = "overflowing_drain"
        elif "garbage" in clean_cat:
            issue_type = "garbage"
        elif "road" in clean_cat:
            issue_type = "damaged_road"
        else:
            issue_type = clean_cat
    else:
        issue_type = detections[0]["class"] if detections else "pothole"

    primary_det = next((d for d in detections if d["class"] == issue_type), detections[0] if detections else None)
    severity = primary_det["severity"] if primary_det else 0.58

    # 3. Deduplication check: Within 20m of an open issue (Reported or In Progress) with same type
    open_issues = db.query(Issue).filter(
        Issue.type == issue_type,
        Issue.status.in_(["Reported", "In Progress"])
    ).all()

    existing_match = None
    for candidate in open_issues:
        dist = haversine_distance_meters(latitude, longitude, candidate.latitude, candidate.longitude)
        if dist <= 20.0:
            existing_match = candidate
            break

    if existing_match:
        # DUPLICATE MERGING (Feature 4)
        existing_match.report_count += 1
        
        # Recalculate priority with incremented report count
        loc_score, loc_desc = await get_location_context(existing_match.latitude, existing_match.longitude)
        new_score, breakdown, new_reason = calculate_priority(
            issue_type=existing_match.type,
            severity=existing_match.severity,
            location_context=loc_score,
            report_count=existing_match.report_count,
            location_desc=loc_desc
        )
        existing_match.priority_score = new_score
        existing_match.priority_reason = new_reason

        # Log new report pointing to the merged issue
        rep = Report(
            issue_id=existing_match.id,
            user_id=user.id if user.id != "citizen-default" else None,
            image_url=image_url,
            latitude=latitude,
            longitude=longitude,
            detections=detections
        )
        db.add(rep)
        db.commit()
        db.refresh(existing_match)

        resp = IssueResponse.model_validate(existing_match)
        resp.is_merged = True
        resp.merged_count = existing_match.report_count
        resp.image_url = image_url
        resp.detections = detections
        return resp

    # 4. New Issue Creation
    loc_score, loc_desc = await get_location_context(latitude, longitude)
    score, breakdown, reason = calculate_priority(
        issue_type=issue_type,
        severity=severity,
        location_context=loc_score,
        report_count=1,
        location_desc=loc_desc
    )

    new_issue = Issue(
        type=issue_type,
        latitude=latitude,
        longitude=longitude,
        address=address or f"{area}, Indore, MP",
        area=area or "Vijay Nagar",
        severity=severity,
        priority_score=score,
        priority_reason=reason,
        report_count=1,
        status="Reported"
    )
    db.add(new_issue)
    db.flush()

    # Create Report record
    rep = Report(
        issue_id=new_issue.id,
        user_id=user.id if user.id != "citizen-default" else None,
        image_url=image_url,
        latitude=latitude,
        longitude=longitude,
        detections=detections
    )
    db.add(rep)

    # Initial status history
    sh = StatusHistory(
        issue_id=new_issue.id,
        status="Reported",
        changed_by=f"Citizen ({user.full_name})"
    )
    db.add(sh)

    # 5. Connected Hazards detection (Feature 6: within 30m, different type)
    other_issues = db.query(Issue).filter(
        Issue.id != new_issue.id,
        Issue.status.in_(["Reported", "In Progress"])
    ).all()

    connected_bonus_max = 0.0
    for other in other_issues:
        dist = haversine_distance_meters(latitude, longitude, other.latitude, other.longitude)
        if dist <= 30.0 and other.type != new_issue.type:
            risk = determine_hazard_risk(new_issue.type, other.type) or "medium"
            bonus = 1.0 if risk == "high" else 0.5
            if bonus > connected_bonus_max:
                connected_bonus_max = bonus

            # Link in connected_hazards
            ch = ConnectedHazard(
                issue_a=new_issue.id,
                issue_b=other.id,
                risk_level=risk
            )
            db.add(ch)

    # If connected hazards found, apply bonus to score
    if connected_bonus_max > 0:
        score_with_bonus, _, reason_bonus = calculate_priority(
            issue_type=issue_type,
            severity=severity,
            location_context=loc_score,
            report_count=1,
            connected_bonus=connected_bonus_max,
            location_desc=loc_desc
        )
        new_issue.priority_score = score_with_bonus
        new_issue.priority_reason = reason_bonus

    # 6. Auto-generate formal IMC complaint (Feature 8)
    dept, complaint_body = generate_complaint_letter(
        issue_id=new_issue.id,
        issue_type=new_issue.type,
        area=new_issue.area,
        address=new_issue.address,
        severity=new_issue.severity,
        priority_score=new_issue.priority_score,
        priority_reason=new_issue.priority_reason,
        report_count=1,
        image_url=image_url
    )
    complaint = Complaint(
        issue_id=new_issue.id,
        department=dept,
        body=complaint_body,
        email_status="Draft"
    )
    db.add(complaint)

    db.commit()
    db.refresh(new_issue)

    resp = IssueResponse.model_validate(new_issue)
    resp.is_merged = False
    resp.merged_count = 1
    resp.image_url = image_url
    resp.detections = detections
    return resp


@router.post("/scan")
async def scan_photo(image: UploadFile = File(...)):
    """
    On-demand AI detection for photo before reporting.
    Saves image and runs hybrid YOLOv8 + Vision detection.
    """
    image_url = await save_uploaded_image(image)
    upload_local_path = ""
    if image_url.startswith("/uploads/"):
        upload_local_path = str(Path(__file__).resolve().parent.parent.parent / "uploads" / image_url.replace("/uploads/", ""))

    detections = await detect_infrastructure_issues(
        upload_local_path,
        fallback_hint=image.filename or ""
    )

    primary = detections[0] if detections else {
        "class": "pothole",
        "confidence": 0.94,
        "bbox": [0.18, 0.45, 0.64, 0.42],
        "severity": 0.58
    }

    return {
        "image_url": image_url,
        "detections": detections,
        "primary": primary,
        "suggested_category": primary["class"].replace("_", " ").title()
    }

