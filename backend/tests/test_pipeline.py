import pytest
from app.services.detection import calculate_iou, merge_detections, get_mock_detections
from app.core.database import haversine_distance_meters

def test_iou_identical_boxes():
    box1 = [0.1, 0.1, 0.5, 0.5]
    box2 = [0.1, 0.1, 0.5, 0.5]
    iou = calculate_iou(box1, box2)
    assert abs(iou - 1.0) < 1e-5

def test_iou_disjoint_boxes():
    box1 = [0.0, 0.0, 0.2, 0.2]
    box2 = [0.8, 0.8, 0.2, 0.2]
    iou = calculate_iou(box1, box2)
    assert iou == 0.0

def test_merge_detections_deduplicates():
    detections = [
        {"class": "pothole", "confidence": 0.95, "bbox": [0.1, 0.1, 0.4, 0.4], "severity": 0.16},
        {"class": "pothole", "confidence": 0.70, "bbox": [0.11, 0.11, 0.39, 0.39], "severity": 0.15},
    ]
    merged = merge_detections(detections, iou_threshold=0.5)
    assert len(merged) == 1
    assert merged[0]["confidence"] == 0.95

def test_haversine_distance_accuracy():
    # Coordinates in Indore: Vijay Nagar (22.7533, 75.8937) and Palasia (22.7244, 75.8839)
    dist = haversine_distance_meters(22.7533, 75.8937, 22.7244, 75.8839)
    # Distance is approx 3.3 km (3300m)
    assert 3000 <= dist <= 3700

    # Test 15 meter offset
    dist_near = haversine_distance_meters(22.7196, 75.8577, 22.7197, 75.8577)
    assert dist_near < 25.0
