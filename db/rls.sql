-- InfraSight: Row Level Security Policies for Supabase
-- Enable RLS on core tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE connected_hazards ENABLE ROW LEVEL SECURITY;
ALTER TABLE status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE repair_verifications ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    coalesce(
      (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin',
      false
    )
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. Profiles
CREATE POLICY "Users can read own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id OR is_admin());

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id OR is_admin());

CREATE POLICY "Users can insert own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id OR is_admin());

-- 2. Issues (Public can read all open/reported issues; Admins full access)
CREATE POLICY "Anyone authenticated or anonymous can view issues"
    ON issues FOR SELECT
    USING (true);

CREATE POLICY "Admins can insert or update issues"
    ON issues FOR ALL
    USING (is_admin())
    WITH CHECK (is_admin());

CREATE POLICY "Authenticated users can create issues"
    ON issues FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL OR is_admin());

-- 3. Reports (Citizens read and create only their own reports; admins read all)
CREATE POLICY "Citizens read own reports; Admins read all reports"
    ON reports FOR SELECT
    USING (auth.uid() = user_id OR is_admin());

CREATE POLICY "Citizens insert own reports"
    ON reports FOR INSERT
    WITH CHECK (auth.uid() = user_id OR user_id IS NULL OR is_admin());

CREATE POLICY "Admins update or delete reports"
    ON reports FOR ALL
    USING (is_admin())
    WITH CHECK (is_admin());

-- 4. Connected Hazards (All can view; Admins manage)
CREATE POLICY "Anyone can view connected hazards"
    ON connected_hazards FOR SELECT
    USING (true);

CREATE POLICY "Admins manage connected hazards"
    ON connected_hazards FOR ALL
    USING (is_admin())
    WITH CHECK (is_admin());

-- 5. Status History (All can view audit trail; Admins add)
CREATE POLICY "Anyone can view status history"
    ON status_history FOR SELECT
    USING (true);

CREATE POLICY "Admins or system insert status history"
    ON status_history FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL OR is_admin());

-- 6. Complaints (Admins can view and manage complaints)
CREATE POLICY "Admins manage complaints"
    ON complaints FOR ALL
    USING (is_admin())
    WITH CHECK (is_admin());

CREATE POLICY "Citizens view complaints linked to their reports"
    ON complaints FOR SELECT
    USING (
      EXISTS (
        SELECT 1 FROM reports
        WHERE reports.issue_id = complaints.issue_id AND reports.user_id = auth.uid()
      )
      OR is_admin()
    );

-- 7. Repair Verifications (Admins manage repair verifications; public can view results)
CREATE POLICY "Anyone can view verifications"
    ON repair_verifications FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users or Admins can submit verification"
    ON repair_verifications FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL OR is_admin());

CREATE POLICY "Admins can update verification"
    ON repair_verifications FOR UPDATE
    USING (is_admin())
    WITH CHECK (is_admin());
