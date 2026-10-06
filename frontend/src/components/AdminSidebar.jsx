import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function AdminSidebar({ issueCount = 90, pendingVerifications = 12 }) {
  const location = useLocation();
  const currentPath = location.pathname;

  const navLinks = [
    {
      section: "Overview",
      items: [
        { label: "Dashboard", icon: "fa-chart-pie", path: "/admin" },
      ],
    },
    {
      section: "Issues",
      items: [
        { label: "Issues Table + Map", icon: "fa-table", path: "/admin/issues", badge: issueCount },
      ],
    },
    {
      section: "Analytics",
      items: [
        { label: "City Heatmap", icon: "fa-fire", path: "/admin/heatmap" },
      ],
    },
    {
      section: "Verification",
      items: [
        { label: "Repair Verification", icon: "fa-check-double", path: "/admin/verification", badge: pendingVerifications, badgeColor: "bg-orange-500" },
      ],
    },
  ];

  return (
    <aside className="w-[240px] bg-[#0f172a] text-slate-400 fixed top-14 bottom-0 left-0 z-40 flex flex-col border-r border-slate-800 select-none overflow-y-auto">
      <div className="py-4 flex-1">
        {navLinks.map((sec, idx) => (
          <div key={idx} className="px-3.5 mb-4">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 mb-1.5">
              {sec.section}
            </div>
            <div className="space-y-1">
              {sec.items.map((item) => {
                const isActive = currentPath === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-semibold transition-all ${
                      isActive
                        ? "bg-cyan-600 text-white shadow-sm font-bold"
                        : "hover:bg-[#1e293b] hover:text-white"
                    }`}
                  >
                    <i className={`fas ${item.icon} w-4 text-center text-sm`} />
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.badge !== undefined && (
                      <span
                        className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full text-white ${
                          item.badgeColor || "bg-red-500"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        <div className="px-3.5 mt-2 pt-2 border-t border-slate-800">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 mb-1.5">
            System
          </div>
          <div className="space-y-1">
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-semibold hover:bg-[#1e293b] hover:text-white transition-all text-left">
              <i className="fas fa-cog w-4 text-center text-sm" />
              <span>Settings</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-semibold hover:bg-[#1e293b] hover:text-white transition-all text-left">
              <i className="fas fa-file-alt w-4 text-center text-sm" />
              <span>Reports Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* User Footer */}
      <div className="p-4 border-t border-slate-800 bg-[#0f172a]/80">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold ring-2 ring-slate-700 shadow-sm">
            AK
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-white text-xs font-bold truncate">Amit Kumar</span>
            <span className="text-[10px] text-slate-400 truncate">IMC Administrator</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
