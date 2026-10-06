-- InfraSight: Initial Schema for Supabase PostgreSQL with PostGIS
-- Extension setup
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table (Citizen and Admin roles)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'citizen' CHECK (role IN ('citizen', 'admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Issues Table
CREATE TABLE IF NOT EXISTS issues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL CHECK (type IN ('pothole', 'damaged_road', 'broken_streetlight', 'overflowing_drain', 'garbage')),
    geom geography(Point, 4326) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    address TEXT,
    area TEXT NOT NULL DEFAULT 'Vijay Nagar',
    severity DOUBLE PRECISION NOT NULL DEFAULT 0.5 CHECK (severity >= 0 AND severity <= 1.0),
    priority_score DOUBLE PRECISION NOT NULL DEFAULT 50.0 CHECK (priority_score >= 0 AND priority_score <= 100.0),
    priority_reason TEXT,
    report_count INTEGER NOT NULL DEFAULT 1,
    status TEXT NOT NULL DEFAULT 'Reported' CHECK (status IN ('Reported', 'In Progress', 'Fixed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    fixed_at TIMESTAMPTZ
);

-- 3. Reports Table
CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    issue_id UUID REFERENCES issues(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    image_url TEXT NOT NULL,
    geom geography(Point, 4326) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    detections JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Connected Hazards Table
CREATE TABLE IF NOT EXISTS connected_hazards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    issue_a UUID NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
    issue_b UUID NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
    risk_level TEXT NOT NULL CHECK (risk_level IN ('high', 'medium', 'low')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(issue_a, issue_b)
);

-- 5. Status History Table
CREATE TABLE IF NOT EXISTS status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    issue_id UUID NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('Reported', 'In Progress', 'Fixed')),
    changed_by TEXT NOT NULL DEFAULT 'System',
    changed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. Complaints Table
CREATE TABLE IF NOT EXISTS complaints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    issue_id UUID NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
    department TEXT NOT NULL CHECK (department IN ('Roads', 'Electricity', 'Drainage', 'Sanitation')),
    body TEXT NOT NULL,
    sent_at TIMESTAMPTZ,
    email_status TEXT NOT NULL DEFAULT 'Draft' CHECK (email_status IN ('Draft', 'Sent', 'Failed', 'Simulated'))
);

-- 7. Repair Verifications Table
CREATE TABLE IF NOT EXISTS repair_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    issue_id UUID NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
    after_image_url TEXT NOT NULL,
    gps_match BOOLEAN NOT NULL DEFAULT true,
    distance_m DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    ai_verdict TEXT NOT NULL CHECK (ai_verdict IN ('Fixed', 'Not Fixed', 'Uncertain')),
    confidence DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Spatial and Performance Indexes
CREATE INDEX IF NOT EXISTS idx_issues_geom ON issues USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_reports_geom ON reports USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_issues_status ON issues (status);
CREATE INDEX IF NOT EXISTS idx_issues_type ON issues (type);
CREATE INDEX IF NOT EXISTS idx_issues_priority_score ON issues (priority_score DESC);
CREATE INDEX IF NOT EXISTS idx_issues_area ON issues (area);
CREATE INDEX IF NOT EXISTS idx_reports_issue_id ON reports (issue_id);
CREATE INDEX IF NOT EXISTS idx_reports_user_id ON reports (user_id);
CREATE INDEX IF NOT EXISTS idx_status_history_issue_id ON status_history (issue_id);
CREATE INDEX IF NOT EXISTS idx_complaints_issue_id ON complaints (issue_id);
