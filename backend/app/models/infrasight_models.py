import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Column, String, Float, Integer, DateTime, Boolean, ForeignKey, Text, JSON
)
from sqlalchemy.orm import relationship
from app.core.database import Base

def generate_uuid() -> str:
    return str(uuid.uuid4())

class Profile(Base):
    __tablename__ = "profiles"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False, default="citizen")  # "citizen" or "admin"
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    reports = relationship("Report", back_populates="user")


class Issue(Base):
    __tablename__ = "issues"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    type = Column(String(50), nullable=False)  # pothole, damaged_road, broken_streetlight, overflowing_drain, garbage
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    address = Column(String(500), nullable=True)
    area = Column(String(100), nullable=False, default="Vijay Nagar")
    severity = Column(Float, nullable=False, default=0.5)  # 0.0 to 1.0
    priority_score = Column(Float, nullable=False, default=50.0)  # 0 to 100
    priority_reason = Column(Text, nullable=True)
    report_count = Column(Integer, nullable=False, default=1)
    status = Column(String(50), nullable=False, default="Reported")  # Reported, In Progress, Fixed
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    fixed_at = Column(DateTime, nullable=True)

    reports = relationship("Report", back_populates="issue", cascade="all, delete-orphan")
    status_history = relationship("StatusHistory", back_populates="issue", cascade="all, delete-orphan")
    complaints = relationship("Complaint", back_populates="issue", cascade="all, delete-orphan")
    verifications = relationship("RepairVerification", back_populates="issue", cascade="all, delete-orphan")


class Report(Base):
    __tablename__ = "reports"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    issue_id = Column(String(36), ForeignKey("issues.id", ondelete="CASCADE"), nullable=True)
    user_id = Column(String(36), ForeignKey("profiles.id", ondelete="SET NULL"), nullable=True)
    image_url = Column(String(1000), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    detections = Column(JSON, default=list)  # list of bbox & classifications
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    issue = relationship("Issue", back_populates="reports")
    user = relationship("Profile", back_populates="reports")


class ConnectedHazard(Base):
    __tablename__ = "connected_hazards"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    issue_a = Column(String(36), ForeignKey("issues.id", ondelete="CASCADE"), nullable=False)
    issue_b = Column(String(36), ForeignKey("issues.id", ondelete="CASCADE"), nullable=False)
    risk_level = Column(String(20), nullable=False)  # high, medium, low
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class StatusHistory(Base):
    __tablename__ = "status_history"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    issue_id = Column(String(36), ForeignKey("issues.id", ondelete="CASCADE"), nullable=False)
    status = Column(String(50), nullable=False)  # Reported, In Progress, Fixed
    changed_by = Column(String(100), nullable=False, default="System")
    changed_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    issue = relationship("Issue", back_populates="status_history")


class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    issue_id = Column(String(36), ForeignKey("issues.id", ondelete="CASCADE"), nullable=False)
    department = Column(String(100), nullable=False)  # Roads, Electricity, Drainage, Sanitation
    body = Column(Text, nullable=False)
    sent_at = Column(DateTime, nullable=True)
    email_status = Column(String(50), nullable=False, default="Draft")  # Draft, Sent, Failed, Simulated

    issue = relationship("Issue", back_populates="complaints")


class RepairVerification(Base):
    __tablename__ = "repair_verifications"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    issue_id = Column(String(36), ForeignKey("issues.id", ondelete="CASCADE"), nullable=False)
    after_image_url = Column(String(1000), nullable=False)
    gps_match = Column(Boolean, nullable=False, default=True)
    distance_m = Column(Float, nullable=False, default=0.0)
    ai_verdict = Column(String(50), nullable=False)  # Fixed, Not Fixed, Uncertain
    confidence = Column(Float, nullable=False, default=0.0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    issue = relationship("Issue", back_populates="verifications")
