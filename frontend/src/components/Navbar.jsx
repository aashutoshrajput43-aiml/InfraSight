import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar({ criticalCount = 3 }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0f172a] h-14 px-5 flex items-center justify-between shadow-md border-b border-slate-800">
      {/* Brand */}
      <div
        className="flex items-center gap-3 cursor-pointer select-none"
        onClick={() => navigate(isAdmin ? "/admin" : "/report")}
      >
        <img
          src="/logo.png"
          alt="InfraSight Logo"
          className="h-9 w-auto object-contain rounded-md"
        />
        <div className="flex flex-col">
          <span className="text-white font-extrabold text-base tracking-tight leading-none font-display">
            Infra<span className="text-cyan-400">Sight</span>
          </span>
          <span className="text-[10px] text-slate-400 font-medium tracking-wide">
            Indore Infrastructure Monitor
          </span>
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="flex bg-[#1e293b] p-1 rounded-lg gap-1 border border-slate-700/60 shadow-inner">
        <button
          onClick={() => navigate("/report")}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
            !isAdmin
              ? "bg-cyan-600 text-white shadow-sm font-bold"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <i className="fas fa-mobile-alt text-xs" />
          <span>Citizen App</span>
        </button>
        <button
          onClick={() => navigate("/admin")}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
            isAdmin
              ? "bg-cyan-600 text-white shadow-sm font-bold"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <i className="fas fa-chart-line text-xs" />
          <span>Admin Dashboard</span>
        </button>
      </div>

      {/* Right status area */}
      <div className="flex items-center gap-3">
        {/* Region pill */}
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 bg-slate-800/80 rounded-full border border-slate-700 text-[11px] text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Indore Municipal Corp.</span>
        </div>

        {/* Notifications */}
        <div className="relative cursor-pointer p-1 text-slate-400 hover:text-white transition-colors">
          <i className="fas fa-bell text-base" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-slate-900" />
        </div>

        {/* Critical Badge */}
        <span className="bg-red-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm">
          {criticalCount} Critical
        </span>

        {/* Avatar */}
        <div
          onClick={() => navigate(isAdmin ? "/admin" : "/login")}
          className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold ring-2 ring-slate-700 cursor-pointer shadow-sm"
          title="Amit Kumar (IMC Admin)"
        >
          AK
        </div>
      </div>
    </header>
  );
}
