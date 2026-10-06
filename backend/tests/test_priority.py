import pytest
import math
from app.services.priority import calculate_priority, TYPE_WEIGHTS

def test_priority_weights():
    assert TYPE_WEIGHTS["pothole"] == 0.8
    assert TYPE_WEIGHTS["damaged_road"] == 0.7
    assert TYPE_WEIGHTS["broken_streetlight"] == 0.7
    assert TYPE_WEIGHTS["overflowing_drain"] == 0.9
    assert TYPE_WEIGHTS["garbage"] == 0.5

def test_priority_score_bounds():
    # Minimum possible inputs
    min_score, b_min, r_min = calculate_priority("garbage", severity=0.0, location_context=0.0, report_count=1)
    assert 0.0 <= min_score <= 100.0

    # Maximum possible inputs
    max_score, b_max, r_max = calculate_priority("overflowing_drain", severity=1.0, location_context=1.0, report_count=100, connected_bonus=1.0)
    assert 0.0 <= max_score <= 100.0
    assert max_score >= 90.0

def test_priority_formula_breakdown():
    # Test specific values
    # pothole (0.8), sev 0.5, loc 1.0 (school/hospital), count 1 (ln(2)/ln(41)), bonus 0.0
    score, breakdown, reason = calculate_priority(
        issue_type="pothole",
        severity=0.5,
        location_context=1.0,
        report_count=1,
        connected_bonus=0.0
    )
    assert breakdown["type_weight"] == 0.8
    assert breakdown["severity"] == 0.5
    assert breakdown["location_context"] == 1.0
    assert "Near critical school/hospital zone" in reason

def test_connected_bonus_impact():
    score_no_bonus, _, _ = calculate_priority("pothole", severity=0.5, location_context=0.4, report_count=1, connected_bonus=0.0)
    score_with_bonus, _, reason = calculate_priority("pothole", severity=0.5, location_context=0.4, report_count=1, connected_bonus=1.0)
    assert score_with_bonus > score_no_bonus
    assert "High-risk connected hazard adjacent" in reason
