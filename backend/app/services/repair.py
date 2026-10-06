import math
from typing import Dict, Any, Tuple
from app.core.database import haversine_distance_meters
from app.services.detection import detect_infrastructure_issues

async def verify_repair_evidence(
    orig_lat: float,
    orig_lng: float,
    after_lat: float,
    after_lng: float,
    after_image_path: str,
    original_type: str
) -> Dict[str, Any]:
    """
    Evaluates whether an infrastructure repair has been successfully executed:
    1. Validates GPS proximity (must be within 30m of original coordinate).
    2. Runs detection on the 'after' image to check if the defect still persists.
    3. Returns verdict ('Fixed', 'Not Fixed', 'Uncertain'), confidence, and distance.
    """
    # 1. Proximity check
    dist_m = haversine_distance_meters(orig_lat, orig_lng, after_lat, after_lng)
    gps_match = dist_m <= 30.0

    # 2. Run AI detection on the after photo
    after_detections = await detect_infrastructure_issues(after_image_path, fallback_hint="repaired_clean_road")

    # Check if original defect class is detected in after photo with high confidence (>0.4)
    matching_remaining_issues = [
        d for d in after_detections
        if d.get("class") == original_type and d.get("confidence", 0.0) >= 0.4
    ]

    if not gps_match:
        return {
            "gps_match": False,
            "distance_m": round(dist_m, 1),
            "ai_verdict": "Uncertain",
            "confidence": 0.45,
            "reason": f"GPS mismatch: Repair photo uploaded {dist_m:.1f}m away (threshold 30m).",
            "is_fixed": False
        }

    if len(matching_remaining_issues) == 0:
        # Problem is resolved
        confidence = 0.964  # per reference design
        return {
            "gps_match": True,
            "distance_m": round(dist_m, 1),
            "ai_verdict": "Fixed",
            "confidence": confidence,
            "reason": f"AI verified: {original_type.replace('_', ' ').title()} defect cleared. Surface restored.",
            "is_fixed": True
        }
    else:
        # Defect still detected
        highest_conf = max(d.get("confidence", 0.7) for d in matching_remaining_issues)
        return {
            "gps_match": True,
            "distance_m": round(dist_m, 1),
            "ai_verdict": "Not Fixed",
            "confidence": round(highest_conf, 2),
            "reason": f"Defect still visible: {original_type.replace('_', ' ').title()} identified with {highest_conf*100:.0f}% confidence.",
            "is_fixed": False
        }
