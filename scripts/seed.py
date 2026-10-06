import random
import sys
from pathlib import Path
from datetime import datetime, timezone, timedelta

# Ensure UTF-8 output on Windows
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent.parent / "backend"
sys.path.insert(0, str(backend_dir))

from app.core.database import SessionLocal, Base, engine, haversine_distance_meters
from app.models import Issue, Report, ConnectedHazard, StatusHistory, Complaint, RepairVerification
from app.services.priority import calculate_priority
from app.services.complaint import generate_complaint_letter

# Indore Hubs & Coordinates
INDORE_AREAS = [
    {"name": "Vijay Nagar", "lat": 22.7533, "lng": 75.8937, "weight": 25},
    {"name": "Palasia", "lat": 22.7244, "lng": 75.8839, "weight": 20},
    {"name": "Rajwada", "lat": 22.7186, "lng": 75.8462, "weight": 18},
    {"name": "Bhawarkua", "lat": 22.6926, "lng": 75.8676, "weight": 14},
    {"name": "Sarafa", "lat": 22.7170, "lng": 75.8520, "weight": 12},
    {"name": "Navlakha", "lat": 22.7001, "lng": 75.8770, "weight": 10},
    {"name": "Patnipura", "lat": 22.7380, "lng": 75.8750, "weight": 8},
    {"name": "Rau", "lat": 22.6280, "lng": 75.8070, "weight": 7},
    {"name": "Annapurna", "lat": 22.6980, "lng": 75.8340, "weight": 6},
    {"name": "Geeta Bhawan", "lat": 22.7190, "lng": 75.8860, "weight": 6},
]

ISSUE_TYPES = [
    ("pothole", 0.35),
    ("damaged_road", 0.20),
    ("broken_streetlight", 0.15),
    ("overflowing_drain", 0.15),
    ("garbage", 0.15),
]

STREET_NAMES = [
    "AB Road Corridor", "MG Road", "Ring Road Sector A", "Main Market Lane",
    "Scheme No. 54", "Near Flyover Pillar 14", "Opposite City Hospital",
    "Near DAV Public School", "Bazaar Road", "Square Intersection"
]

def seed_database():
    print("🌱 Initializing InfraSight Indore Seed Database...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Clear existing data for clean seed
    db.query(RepairVerification).delete()
    db.query(Complaint).delete()
    db.query(StatusHistory).delete()
    db.query(ConnectedHazard).delete()
    db.query(Report).delete()
    db.query(Issue).delete()
    db.commit()

    total_target = 90
    created_issues = []
    now = datetime.now(timezone.utc)

    # 1. First create anchor showcase issues matching design reference
    anchor_issues = [
        {
            "type": "pothole",
            "lat": 22.7289, "lng": 75.8732,
            "area": "Vijay Nagar",
            "address": "AB Road near DAV Public School, Vijay Nagar",
            "severity": 0.58,
            "report_count": 42,
            "status": "In Progress",
            "created_days_ago": 2,
            "score": 94.0,
            "reason": "Near DAV Public School (high-traffic zone), on AB Road arterial route, large pothole (2.8m²) with 42 reports — critical risk."
        },
        {
            # Placed 15m from the anchor pothole: High-risk connected hazard!
            "type": "broken_streetlight",
            "lat": 22.7290, "lng": 75.8733,
            "area": "Vijay Nagar",
            "address": "AB Road pole #42, Vijay Nagar",
            "severity": 0.50,
            "report_count": 22,
            "status": "In Progress",
            "created_days_ago": 3,
            "score": 79.0,
            "reason": "Broken streetlight 15m from major pothole — elevated risk especially at night."
        },
        {
            # Placed 28m from anchor pothole: Secondary drain overflow hazard
            "type": "overflowing_drain",
            "lat": 22.7288, "lng": 75.8734,
            "area": "Vijay Nagar",
            "address": "AB Road service lane, Vijay Nagar",
            "severity": 0.55,
            "report_count": 18,
            "status": "Reported",
            "created_days_ago": 2,
            "score": 75.0,
            "reason": "Drain overflow 28m away — water pooling near pothole accelerates asphalt erosion."
        },
        {
            "type": "overflowing_drain",
            "lat": 22.7196, "lng": 75.8577,
            "area": "Palasia",
            "address": "Palasia Chowk near Hospital Junction",
            "severity": 0.65,
            "report_count": 31,
            "status": "Reported",
            "created_days_ago": 3,
            "score": 89.0,
            "reason": "Stormwater overflow near Hospital Junction, contaminating pedestrian pathway, 31 reports."
        },
        {
            # Placed 20m from Palasia drain
            "type": "damaged_road",
            "lat": 22.7197, "lng": 75.8578,
            "area": "Palasia",
            "address": "Palasia Chowk Road Bend",
            "severity": 0.60,
            "report_count": 19,
            "status": "Reported",
            "created_days_ago": 3,
            "score": 82.0,
            "reason": "Severe road subsidence adjacent to overflowing stormwater drain."
        },
        {
            "type": "broken_streetlight",
            "lat": 22.7186, "lng": 75.8462,
            "area": "Rajwada",
            "address": "Rajwada Circle Main Gate",
            "severity": 0.45,
            "report_count": 28,
            "status": "Reported",
            "created_days_ago": 4,
            "score": 78.0,
            "reason": "4 non-functional heritage lights at high-density night market intersection."
        },
        {
            "type": "garbage",
            "lat": 22.7102, "lng": 75.8721,
            "area": "Sarafa",
            "address": "Sarafa Bazaar Food Street",
            "severity": 0.50,
            "report_count": 19,
            "status": "In Progress",
            "created_days_ago": 1,
            "score": 73.0,
            "reason": "Commercial organic waste overflowing onto narrow street, blocking night bazaar passage."
        },
        {
            # Placed 22m from Sarafa garbage: Medium risk
            "type": "overflowing_drain",
            "lat": 22.7103, "lng": 75.8723,
            "area": "Sarafa",
            "address": "Sarafa Bazaar lane 3",
            "severity": 0.52,
            "report_count": 14,
            "status": "Reported",
            "created_days_ago": 2,
            "score": 71.0,
            "reason": "Drain blocked by solid waste and overflowing into market lane."
        },
        {
            "type": "damaged_road",
            "lat": 22.7049, "lng": 75.8510,
            "area": "Bhawarkua",
            "address": "Bhawarkua Main University Road",
            "severity": 0.40,
            "report_count": 15,
            "status": "Reported",
            "created_days_ago": 6,
            "score": 61.0,
            "reason": "Extensive asphalt cracking and subsidence near student transit hub."
        },
        {
            "type": "traffic_signal",
            "lat": 22.7186, "lng": 75.8540,
            "area": "Rajwada",
            "address": "Rajwada Chowk main intersection",
            "severity": 0.85,
            "report_count": 17,
            "status": "Reported",
            "created_days_ago": 1,
            "score": 95.0,
            "reason": "Broken traffic signal at high-density commercial crossroads; uncontrolled pedestrian conflict zone."
        },
        {
            "type": "open_manhole",
            "lat": 22.7380, "lng": 75.8750,
            "area": "Patnipura",
            "address": "Patnipura Main Bazaar, near Sharma Kirana",
            "severity": 0.80,
            "report_count": 14,
            "status": "Reported",
            "created_days_ago": 1,
            "score": 90.0,
            "reason": "Uncovered sewer chamber in middle of two-wheeler lane; branch warning marker installed by locals."
        },
        {
            "type": "water_pipeline",
            "lat": 22.6926, "lng": 75.8676,
            "area": "Bhawarkua",
            "address": "Near University Road & Sai Kirana Market",
            "severity": 0.70,
            "report_count": 11,
            "status": "In Progress",
            "created_days_ago": 2,
            "score": 89.0,
            "reason": "Pressurized water main pipeline burst gushing water onto road and eroding pavement foundation."
        },
    ]

    for item in anchor_issues:
        issue_time = now - timedelta(days=item["created_days_ago"])
        iss = Issue(
            type=item["type"],
            latitude=item["lat"],
            longitude=item["lng"],
            address=item["address"],
            area=item["area"],
            severity=item["severity"],
            priority_score=item["score"],
            priority_reason=item["reason"],
            report_count=item["report_count"],
            status=item["status"],
            created_at=issue_time
        )
        db.add(iss)
        db.flush()
        created_issues.append(iss)

    # 2. Generate remaining random realistic Indore issues (total ~90)
    for i in range(len(anchor_issues), total_target):
        # Pick area weighted by density
        area_info = random.choices(
            INDORE_AREAS,
            weights=[a["weight"] for a in INDORE_AREAS]
        )[0]

        # Jitter coordinates within ~1-2km of area center
        lat_jitter = random.gauss(0, 0.007)
        lng_jitter = random.gauss(0, 0.007)
        lat = round(area_info["lat"] + lat_jitter, 5)
        lng = round(area_info["lng"] + lng_jitter, 5)

        # Issue type
        itype = random.choices(
            [t[0] for t in ISSUE_TYPES],
            weights=[t[1] for t in ISSUE_TYPES]
        )[0]

        severity = round(random.uniform(0.2, 0.85), 2)
        report_count = random.choices([1, 2, 3, 5, 8, 12, 22, 35], weights=[35, 25, 15, 10, 7, 4, 3, 1])[0]

        # Status distribution: ~50% Reported, ~30% In Progress, ~20% Fixed
        status = random.choices(["Reported", "In Progress", "Fixed"], weights=[50, 30, 20])[0]

        created_days_ago = random.randint(0, 14)
        created_at = now - timedelta(days=created_days_ago, hours=random.randint(1, 23))
        fixed_at = created_at + timedelta(days=random.randint(1, 4)) if status == "Fixed" else None

        loc_context = 1.0 if random.random() < 0.25 else (0.7 if random.random() < 0.4 else 0.4)
        score, _, reason = calculate_priority(
            issue_type=itype,
            severity=severity,
            location_context=loc_context,
            report_count=report_count,
            location_desc=f"Near {random.choice(STREET_NAMES)}, {area_info['name']}"
        )

        iss = Issue(
            type=itype,
            latitude=lat,
            longitude=lng,
            address=f"{random.choice(STREET_NAMES)}, {area_info['name']}",
            area=area_info["name"],
            severity=severity,
            priority_score=score,
            priority_reason=reason,
            report_count=report_count,
            status=status,
            created_at=created_at,
            fixed_at=fixed_at
        )
        db.add(iss)
        db.flush()
        created_issues.append(iss)

    print(f"✅ Created {len(created_issues)} infrastructure issues.")

    # 3. Create Reports, Status History, and Complaints for each issue
    for iss in created_issues:
        # Create initial report
        rep = Report(
            issue_id=iss.id,
            image_url=f"/uploads/sample_{iss.type}.jpg",
            latitude=iss.latitude,
            longitude=iss.longitude,
            detections=[{
                "class": iss.type,
                "confidence": round(random.uniform(0.82, 0.98), 2),
                "bbox": [0.2, 0.25, 0.5, 0.45],
                "severity": iss.severity
            }],
            created_at=iss.created_at
        )
        db.add(rep)

        # Status history
        sh1 = StatusHistory(
            issue_id=iss.id,
            status="Reported",
            changed_by="Citizen App (Verified)",
            changed_at=iss.created_at
        )
        db.add(sh1)

        if iss.status in ["In Progress", "Fixed"]:
            sh2 = StatusHistory(
                issue_id=iss.id,
                status="In Progress",
                changed_by="IMC Field Maintenance Dispatch",
                changed_at=iss.created_at + timedelta(hours=random.randint(4, 24))
            )
            db.add(sh2)

        if iss.status == "Fixed":
            sh3 = StatusHistory(
                issue_id=iss.id,
                status="Fixed",
                changed_by="AI Repair Verifier (96.4% confidence)",
                changed_at=iss.fixed_at or (iss.created_at + timedelta(days=2))
            )
            db.add(sh3)

            # Also create repair verification record for Fixed issues
            verif = RepairVerification(
                issue_id=iss.id,
                after_image_url="/uploads/sample_fixed_road.jpg",
                gps_match=True,
                distance_m=round(random.uniform(1.2, 5.0), 1),
                ai_verdict="Fixed",
                confidence=round(random.uniform(0.94, 0.98), 3),
                created_at=iss.fixed_at or iss.created_at
            )
            db.add(verif)

        # Complaints
        dept, body = generate_complaint_letter(
            issue_id=iss.id,
            issue_type=iss.type,
            area=iss.area,
            address=iss.address,
            severity=iss.severity,
            priority_score=iss.priority_score,
            priority_reason=iss.priority_reason,
            report_count=iss.report_count,
            image_url=rep.image_url
        )
        comp = Complaint(
            issue_id=iss.id,
            department=dept,
            body=body,
            sent_at=iss.created_at + timedelta(hours=1) if iss.status != "Reported" else None,
            email_status="Sent" if iss.status != "Reported" else "Draft"
        )
        db.add(comp)

    # 4. Form explicit Connected Hazards (Feature 6)
    # broken_streetlight + pothole = high
    # overflowing_drain + damaged_road = high
    # garbage + overflowing_drain = medium
    hazard_count = 0
    for i in range(len(created_issues)):
        iss_a = created_issues[i]
        for j in range(i + 1, len(created_issues)):
            iss_b = created_issues[j]
            if iss_a.type != iss_b.type and iss_a.status != "Fixed" and iss_b.status != "Fixed":
                dist = haversine_distance_meters(iss_a.latitude, iss_a.longitude, iss_b.latitude, iss_b.longitude)
                if dist <= 40.0:
                    pair = frozenset([iss_a.type, iss_b.type])
                    if frozenset(["broken_streetlight", "pothole"]) == pair:
                        risk = "high"
                    elif frozenset(["overflowing_drain", "damaged_road"]) == pair:
                        risk = "high"
                    elif frozenset(["garbage", "overflowing_drain"]) == pair:
                        risk = "medium"
                    else:
                        risk = "low"

                    ch = ConnectedHazard(
                        issue_a=iss_a.id,
                        issue_b=iss_b.id,
                        risk_level=risk
                    )
                    db.add(ch)
                    hazard_count += 1
                    if hazard_count >= 15:
                        break
        if hazard_count >= 15:
            break

    db.commit()
    db.close()
    print(f"🎉 Seeding complete! Inserted {len(created_issues)} issues across Indore with complaints, history, and {hazard_count} connected hazards.")

if __name__ == "__main__":
    seed_database()
