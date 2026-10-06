import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import CitizenShell from "./pages/CitizenShell";
import CitizenLogin from "./pages/CitizenLogin";
import CitizenReport from "./pages/CitizenReport";
import CitizenSuccess from "./pages/CitizenSuccess";
import CitizenReports from "./pages/CitizenReports";
import CitizenDetail from "./pages/CitizenDetail";
import AdminShell from "./pages/AdminShell";
import AdminOverview from "./pages/AdminOverview";
import AdminIssues from "./pages/AdminIssues";
import AdminHeatmap from "./pages/AdminHeatmap";
import AdminVerification from "./pages/AdminVerification";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#f1f5f9] text-[#0f172a] flex flex-col font-sans">
        {/* Fixed Global Top Navigation */}
        <Navbar criticalCount={3} />

        {/* Route Outlets */}
        <div className="pt-14 flex-1 flex flex-col">
          <Routes>
            {/* Citizen Routes wrapped in CitizenShell */}
            <Route element={<CitizenShell />}>
              <Route path="/login" element={<CitizenLogin />} />
              <Route path="/report" element={<CitizenReport />} />
              <Route path="/report/success/:id" element={<CitizenSuccess />} />
              <Route path="/my-reports" element={<CitizenReports />} />
              <Route path="/my-reports/:id" element={<CitizenDetail />} />
            </Route>

            {/* Admin Routes wrapped in AdminShell */}
            <Route path="/admin" element={<AdminShell />}>
              <Route index element={<AdminOverview />} />
              <Route path="issues" element={<AdminIssues />} />
              <Route path="heatmap" element={<AdminHeatmap />} />
              <Route path="verification" element={<AdminVerification />} />
            </Route>

            {/* Default Catch-all */}
            <Route path="/" element={<Navigate to="/report" replace />} />
            <Route path="*" element={<Navigate to="/report" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
