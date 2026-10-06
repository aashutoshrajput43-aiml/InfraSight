from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class DetectionBBox(BaseModel):
    class_name: str = Field(..., alias="class")
    confidence: float
    bbox: List[float] = Field(default_factory=lambda: [0.0, 0.0, 1.0, 1.0])  # [x, y, w, h] normalized 0-1
    severity: float = 0.5

    class Config:
        populate_by_name = True

class DetectionResult(BaseModel):
    issues: List[DetectionBBox]
    image_url: Optional[str] = None

class StatusHistoryItem(BaseModel):
    id: str
    status: str
    changed_by: str
    changed_at: datetime

    class Config:
        from_attributes = True

class ComplaintItem(BaseModel):
    id: str
    department: str
    body: str
    sent_at: Optional[datetime] = None
    email_status: str

    class Config:
        from_attributes = True

class ConnectedHazardItem(BaseModel):
    id: str
    hazard_issue_id: str
    type: str
    distance_m: float
    risk_level: str
    area: str

class IssueResponse(BaseModel):
    id: str
    type: str
    latitude: float
    longitude: float
    address: Optional[str] = None
    area: str
    severity: float
    priority_score: float
    priority_reason: Optional[str] = None
    report_count: int
    status: str
    created_at: datetime
    fixed_at: Optional[datetime] = None
    image_url: Optional[str] = None
    detections: Optional[List[Dict[str, Any]]] = None
    status_history: Optional[List[StatusHistoryItem]] = None
    complaints: Optional[List[ComplaintItem]] = None
    connected_hazards: Optional[List[ConnectedHazardItem]] = None
    is_merged: Optional[bool] = False
    merged_count: Optional[int] = 0

    class Config:
        from_attributes = True

class IssueStatusUpdate(BaseModel):
    status: str = Field(..., pattern="^(Reported|In Progress|Fixed)$")
    changed_by: Optional[str] = "Admin"

class ReportCreate(BaseModel):
    latitude: float
    longitude: float
    address: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None

class HeatmapPoint(BaseModel):
    lat: float
    lng: float
    weight: float
    type: str
    area: str
    score: float
    id: str

class StatsResponse(BaseModel):
    total_issues: int
    critical_issues: int
    in_progress_issues: int
    fixed_issues: int
    avg_fix_time_days: float
    issues_by_type: Dict[str, int]
    reports_over_time: List[Dict[str, Any]]
    issues_by_area: List[Dict[str, Any]]
    top_priority_issues: List[IssueResponse]

class RepairVerificationResponse(BaseModel):
    id: str
    issue_id: str
    after_image_url: str
    gps_match: bool
    distance_m: float
    ai_verdict: str
    confidence: float
    created_at: datetime
    status_updated_to: str
