import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

export default function CitizenShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const isLogin = currentPath === "/login";

  return (
    <div className="min-h-[calc(100vh-56px)] bg-[#f8fafc] text-slate-800 flex flex-col">
      {/* Sub-header / Breadcrumbs & Navigation for Citizen Portal */}
      <div className="bg-white border-b border-slate-200/80 px-4 sm:px-8 py-2.5 shadow-sm sticky top-14 z-30">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className="font-semibold text-slate-800">Indore Municipal Corporation</span>
            <span>/</span>
            <span className="text-cyan-700 font-medium">Citizen Portal</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/report")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentPath === "/report"
                  ? "bg-cyan-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <i className="fas fa-camera text-xs" />
              <span>Report Issue</span>
            </button>

            <button
              onClick={() => navigate("/my-reports")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentPath.startsWith("/my-reports")
                  ? "bg-cyan-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <i className="fas fa-list-check text-xs" />
              <span>My Reports</span>
            </button>

            <button
              onClick={() => navigate("/login")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentPath === "/login"
                  ? "bg-cyan-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <i className="fas fa-user-circle text-xs" />
              <span>Account</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Container with generous breathing space */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Outlet />
      </main>

      {/* Clean Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-4 px-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            <strong>InfraSight</strong> · Built for Indore Municipal Corporation · Swachh & Surakshit Indore
          </span>
          <span className="text-slate-400">
            Emergency road hazard helpline: <strong className="text-slate-700">0731-400-5000</strong>
          </span>
        </div>
      </footer>
    </div>
  );
}
