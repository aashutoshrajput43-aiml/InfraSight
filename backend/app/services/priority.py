import math
from typing import Dict, Any, Tuple

TYPE_WEIGHTS = {
    "pothole": 0.8,
    "damaged_road": 0.7,
    "broken_streetlight": 0.7,
    "overflowing_drain": 0.9,
    "garbage": 0.5,
}

def calculate_priority(
    issue_type: str,
    severity: float,
    location_context: float,
    report_count: int,
    connected_bonus: float = 0.0,
    location_desc: str = ""
) -> Tuple[float, Dict[str, Any], str]:
    """
    Computes priority score (0-100) and rationale.
    Formula:
    score = 100 * (0.25*type_weight + 0.20*severity + 0.25*location_context + 0.20*report_factor + 0.10*connected_bonus)
    """
    # 1. Type weight
    t_key = issue_type.lower().strip().replace(" ", "_")
    type_weight = TYPE_WEIGHTS.get(t_key, 0.6)

    # 2. Severity (clamped 0 to 1)
    sev_norm = max(0.0, min(1.0, float(severity)))

    # 3. Location context (1.0, 0.7, 0.4)
    loc_norm = max(0.0, min(1.0, float(location_context)))

    # 4. Report factor: min(1, ln(1 + count) / ln(41))
    safe_count = max(1, int(report_count))
    report_factor = min(1.0, math.log(1.0 + safe_count) / math.log(41.0))

    # 5. Connected hazards bonus: 1.0 high, 0.5 medium, 0.0 none
    conn_norm = max(0.0, min(1.0, float(connected_bonus)))

    # 6. Combined score
    raw_score = 100.0 * (
        (0.25 * type_weight) +
        (0.20 * sev_norm) +
        (0.25 * loc_norm) +
        (0.20 * report_factor) +
        (0.10 * conn_norm)
    )

    final_score = round(max(0.0, min(100.0, raw_score)), 1)

    # 7. Construct dynamic reason
    reasons = []
    if loc_norm >= 1.0:
        reasons.append("Near critical school/hospital zone")
    elif loc_norm >= 0.7:
        reasons.append("Along high-density arterial corridor")

    if sev_norm >= 0.6:
        reasons.append(f"Severe physical footprint ({int(sev_norm*100)}% visual area)")
    elif sev_norm >= 0.3:
        reasons.append("Moderate structural damage")

    if safe_count > 1:
        reasons.append(f"{safe_count} citizen reports registered")

    if conn_norm >= 1.0:
        reasons.append("High-risk connected hazard adjacent")
    elif conn_norm >= 0.5:
        reasons.append("Associated secondary hazard nearby")

    if not reasons:
        reasons.append(f"Standard priority infrastructure ticket for {issue_type.replace('_', ' ')}")

    reason_text = ", ".join(reasons)
    if location_desc and "Within" in location_desc:
        reason_text = f"{location_desc} — {reason_text}"

    breakdown = {
        "type_weight": round(type_weight, 2),
        "severity": round(sev_norm, 2),
        "location_context": round(loc_norm, 2),
        "report_factor": round(report_factor, 2),
        "connected_bonus": round(conn_norm, 2),
        "final_score": final_score
    }

    return final_score, breakdown, reason_text
