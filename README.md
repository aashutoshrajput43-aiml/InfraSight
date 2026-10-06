# InfraSight — AI-Powered Public Infrastructure Monitoring (Indore, India)

[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.3-61DAFB.svg?logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF.svg?logo=vite&logoColor=white)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![PostGIS](https://img.shields.io/badge/PostGIS-Spatial_Engine-336791.svg?logo=postgresql&logoColor=white)](https://postgis.net/)
[![Ultralytics](https://img.shields.io/badge/YOLOv8n-Hybrid_Vision-00FFFF.svg)](https://ultralytics.com)

**InfraSight** is an enterprise-grade AI public infrastructure monitoring system engineered for **Indore Municipal Corporation (IMC)**. It automatically **detects**, **classifies**, **deduplicates**, **prioritizes**, and **tracks** municipal defects (potholes, damaged roads, broken streetlights, overflowing drains, and garbage) across Indore's major transit corridors and commercial wards.

---

## 🏛️ Project Architecture & Features

1. **Photo Reporting with GPS**: Camera/gallery upload (`<input type="file" capture="environment">`), HTML5 Geolocation API with manual drag-and-drop pin correction on Leaflet map. Validates image type (JPEG, PNG, WEBP) and size (max 8 MB).
2. **Multi-Issue Hybrid AI Detection**: Ultralytics YOLOv8n combined with Vision LLM (Gemini 1.5 Flash / Claude 3.5 Sonnet) and IoU deduplication. Detects multiple defects per photo, visualizes bounding boxes, and permits citizen category overrides.
3. **Multi-Factor Priority Scoring**: Dynamic 0–100 score engine considering defect type, physical footprint, real-time OSM Overpass institutional context (schools, hospitals, arterial BRTS corridors), citizen petition count, and hazardous multi-issue clustering.
4. **Sub-20m Duplicate Merging**: Automatically aggregates incoming citizen reports occurring within 20m of open municipal tickets, incrementing report weight without cluttering the maintenance backlog.
5. **Admin Workspace & Issues TanStack Table**: Sortable, multi-filtered issue registry synced with a Leaflet Indore map featuring custom priority-colored score pills.
6. **Connected Hazards Matrix**: Automatically scans 30m neighborhood radius for multi-risk combinations (e.g. *Broken Streetlight + Pothole* = High Risk at night; *Overflowing Drain + Damaged Road* = High Risk subsidence).
7. **AI Repair Verification**: Field teams upload "after" photos. Evaluates GPS proximity (<30m delta), re-runs AI vision inspection to ensure defect absence, and awards "Verified Fixed by AI" badge with 96%+ confidence.
8. **Automated IMC Formal Complaints**: Crafts formal official correspondence addressed to the appropriate IMC wing (Roads, Electricity, Drainage, Sanitation) with email dispatch via Resend / SMTP.
9. **Real-Time Citizen Timeline**: Live audit trail tracking ticket stages from `Reported` → `Work Order Assigned` → `Repair Verified`.
10. **Indore City Heatmap**: Leaflet + density visualization centered on Indore `[22.7196° N, 75.8577° E]`, featuring layer toggles (`Markers`, `Heatmap`, `Both`), issue filters, and ranked problem areas.

---

## 🚀 Quickstart & Local Setup

### Prerequisites
- **Python 3.10+** (Python 3.12 recommended)
- **Node.js 18+** & **npm**

---

### Step 1: Backend Setup

```bash
cd backend

# Create and activate virtual environment (optional but recommended)
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run database seed (generates 90 realistic Indore issues across Vijay Nagar, Palasia, Rajwada, etc.)
cd ..
python scripts/seed.py
cd backend

# Start FastAPI backend server
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
The backend API is now live at:
- **API Root & Docs**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **Health Check**: [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health)

---

### Step 2: Frontend Setup

```bash
cd frontend

# Install npm packages
npm install --legacy-peer-deps

# Start Vite dev server
npm run dev -- --host 127.0.0.1 --port 5173
```
Open **[http://127.0.0.1:5173](http://127.0.0.1:5173)** in your browser.

---

## 🛠️ Supabase & PostGIS Production Setup

1. Create a project in [Supabase](https://supabase.com).
2. Navigate to **SQL Editor** and run the initial migration:
   ```sql
   -- Found in db/migrations/001_initial_schema.sql
   ```
3. Run the Row Level Security (RLS) policies:
   ```sql
   -- Found in db/rls.sql
   ```
4. Create a public Supabase Storage bucket named `infrasight-images`.
5. Update your `.env` file:
   ```env
   DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres
   SUPABASE_URL=https://[PROJECT].supabase.co
   SUPABASE_ANON_KEY=[YOUR_ANON_KEY]
   SUPABASE_SERVICE_KEY=[YOUR_SERVICE_KEY]
   ```

*Note: For local zero-config testing, InfraSight automatically uses SQLite with built-in Haversine geospatial math and local disk storage in `backend/uploads/` if Supabase keys are not present.*

---

## 🧠 Hybrid AI Detection Pipeline

The pipeline operates in 4 stages (`backend/app/services/detection.py`):
1. **Ultralytics YOLOv8n**: Runs on the uploaded photo using fine-tuned weights (`backend/weights/best.pt`) if present, otherwise pretrained `yolov8n.pt`. Detects potholes and garbage bounding boxes.
2. **Vision LLM (Gemini / Claude)**: If YOLO confidence is below 0.5 or the detected category is an uncovered class (e.g. broken streetlight, overflowing drain), the image is dispatched to the Vision LLM with a strict JSON contract:
   ```json
   {"issues":[{"class":"pothole|damaged_road|broken_streetlight|overflowing_drain|garbage","confidence":0.0-1.0,"bbox":[x,y,w,h]}]}
   ```
3. **IoU Merging**: Combines predictions and eliminates overlapping duplicate bounding boxes (`IoU > 0.5`), keeping the higher confidence detection.
4. **Mock Fallback (`MOCK_AI=true`)**: If running offline or without GPU/API keys, returns realistic municipal detections so demonstrations never fail.

---

## 📐 Priority Scoring Formula

The priority score (clamped between **0 and 100**) is calculated in `backend/app/services/priority.py`:

$$\text{Score} = 100 \times \left(0.25 \times T + 0.20 \times S + 0.25 \times L + 0.20 \times R + 0.10 \times C\right)$$

- **$T$ (Type Weight)**:
  - `overflowing_drain`: $0.9$
  - `pothole`: $0.8$
  - `damaged_road`: $0.7$
  - `broken_streetlight`: $0.7$
  - `garbage`: $0.5$
- **$S$ (Severity)**: Bounding-box area normalized to image area: $w \times h \in [0, 1]$.
- **$L$ (Location Context)**:
  - $1.0$ if a school or hospital is within $200\text{ m}$.
  - $0.7$ if a primary or secondary arterial road is within $100\text{ m}$.
  - $0.4$ otherwise (standard municipal zone).
- **$R$ (Report Factor)**: Logarithmic citizen petition scaling:
  $$R = \min\left(1.0, \frac{\ln(1 + \text{report\_count})}{\ln(41)}\right)$$
- **$C$ (Connected Hazards Bonus)**:
  - $1.0$ for high-risk combinations (*broken streetlight + pothole*, *overflowing drain + damaged road* within $30\text{ m}$).
  - $0.5$ for medium-risk combinations (*garbage + overflowing drain*).
  - $0.0$ otherwise.

---

## 🎬 2-Minute Demo Script

Follow this step-by-step sequence to demonstrate the entire platform:

1. **Open the Citizen App** (`http://127.0.0.1:5173/report`):
   - Click the camera/gallery box or select a photo.
   - Click **"Detect Issue with AI"**. Watch the laser scan animation complete and view the bounding box overlaid on the photo with confidence tags (`Pothole — 94%`, `Road Damage — 78%`).
2. **Submit Report & Duplicate Merging**:
   - Keep coordinates near Vijay Nagar (`22.7289° N, 75.8732° E`) and click **"Submit Report"**.
   - You land on the **Success Screen** (`/report/success/:id`). Notice the animated Circular Priority Gauge (**82/100 Critical**), the **"Why this priority?"** explanation, and the green banner showing:
     > *"Merged with 12 similar reports in 200m radius — combined priority elevated."*
3. **Review Citizen Tracking** (`/my-reports`):
   - Click **"View My Reports"** to view live cards with 3-stage steppers (`Reported` → `In Progress` → `Fixed`). Click a card to view the timestamped audit timeline.
4. **Switch to Admin Dashboard**:
   - In the top navigation bar, click **"Admin Dashboard"** (`/admin`).
   - Examine the 5 colored stat cards, the **Issues by Type** bar chart, the **Reports Over Time** 14-day trend line, and the **Issues by Area** progress bars.
5. **Explore Issues Table & Map** (`/admin/issues`):
   - Review the sortable TanStack Table and interactive Leaflet map with priority-colored circle markers.
   - Click an issue to open the **Detail Panel**. Check the **Connected Hazards warning banner** (*"Broken streetlight 15m from pothole: elevated risk"*).
   - Click **"Send to IMC Roads Department"** to dispatch the auto-generated complaint letter.
6. **Execute Repair Verification** (`/admin/verification`):
   - Switch to **Repair Verification** from the sidebar.
   - Inspect the side-by-side **Before** vs **After** repair cards with the GPS delta match check (`±2m`) and AI verification verdict (**96.4% confidence**).
   - Click **"Approve — Mark as Fixed"**.
7. **View City Heatmap** (`/admin/heatmap`):
   - Switch between `Markers`, `Heatmap`, and `Both` layers to visualize Indore's high-density municipal hotspots across Vijay Nagar, Palasia, and Rajwada.

---

## 🧪 Unit Testing

Run the automated test suite in the backend directory:
```bash
cd backend
python -m pytest tests/
```
Output:
```
tests/test_pipeline.py ....  [50%]
tests/test_priority.py ....  [100%]
================ 8 passed in 3.30s ================
```

---

## 🏛️ Project Directory Structure

```
InfraSight/
├── backend/
│   ├── app/
│   │   ├── core/         # Config, database, auth & RBAC
│   │   ├── models/       # SQLAlchemy models (Issue, Report, Complaint, etc.)
│   │   ├── routers/      # API endpoints (/reports, /issues, /health)
│   │   ├── schemas/      # Pydantic v2 validation models
│   │   ├── services/     # Hybrid detection, OSM Overpass, priority, complaints, repair
│   │   └── main.py       # FastAPI application entrypoint
│   ├── tests/            # Pytest test cases
│   ├── uploads/          # Static media storage
│   ├── weights/          # YOLO model weights (best.pt)
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── api/          # HTTP client
│   │   ├── components/   # Common badges, Navbar, AdminSidebar, Leaflet maps
│   │   ├── pages/        # Citizen pages (PWA shell) & Admin workspace pages
│   │   ├── App.jsx       # Route configuration
│   │   └── index.css     # Design tokens & animations
│   ├── package.json
│   └── tailwind.config.js
├── db/
│   ├── migrations/       # PostGIS DDL migration files
│   └── rls.sql           # Supabase Row Level Security policies
├── scripts/
│   └── seed.py           # Database seeder (90 realistic Indore tickets)
├── training/
│   └── train_yolo.ipynb  # Google Colab fine-tuning notebook
├── .env.example
├── docker-compose.yml
└── README.md
```
