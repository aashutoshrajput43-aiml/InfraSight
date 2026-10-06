import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CitizenReports() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");

  const reports = [
    {
      id: "IS-0092",
      title: "Pothole on main carriageway",
      category: "Road & Potholes",
      location: "Vijay Nagar, near Scheme 54",
      reported: "Oct 5, 9:42 AM",
      updated: "2 hrs ago",
      priority: "High",
      status: "In Progress",
      step: 3,
      badgeColor: "bg-teal-50 text-teal-800 border-teal-200",
      photo: "/pothole.jpg",
    },
    {
      id: "IS-0087",
      title: "Streetlight not working",
      category: "Lighting",
      location: "Palasia Square, A.B. Road",
      reported: "Oct 4, 6:15 PM",
      updated: "Yesterday",
      priority: "Medium",
      status: "Reported",
      step: 1,
      badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
      photo: "/streetlight.jpg",
    },
    {
      id: "IS-0079",
      title: "Overflowing garbage bin",
      category: "Waste",
      location: "Bicholi Mardana Road",
      reported: "Oct 3, 8:05 AM",
      updated: "Oct 4",
      priority: "Low",
      status: "Reported",
      step: 1,
      badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
      photo: "/garbage.jpg",
    },
    {
      id: "IS-0061",
      title: "Broken footpath slab",
      category: "Footpath",
      location: "New Palasia, near Sapna Sangeeta",
      reported: "Sep 26, 5:30 PM",
      updated: "Fixed Oct 1, 11:20 AM · Closed in 5 days",
      priority: "Fixed",
      status: "Fixed",
      step: 4,
      badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
      photo: "/footpath.jpg",
    },
  ];

  const filtered = reports.filter((r) => {
    if (filter === "All") return true;
    if (filter === "Active") return r.status !== "Fixed";
    if (filter === "Fixed") return r.status === "Fixed";
    return true;
  });

  const fixStats = [
    { cat: "Potholes", your: 5.0, city: 6.2 },
    { cat: "Lighting", your: 3.5, city: 4.0 },
    { cat: "Waste", your: 2.0, city: 3.1 },
    { cat: "Footpath", your: 4.7, city: 5.4 },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
            My Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Every issue you've reported, with live repair status from IMC crews.
          </p>
        </div>

        <button
          onClick={() => navigate("/report")}
          className="px-4 py-2 bg-cyan-700 hover:bg-cyan-800 text-white font-bold text-xs rounded-lg shadow-sm transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <i className="fas fa-plus text-xs" />
          <span>New Report</span>
        </button>
      </div>

      {/* 5 Stat Cards Strip */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="text-xs text-slate-500 font-medium">Total reports</div>
          <div className="text-2xl font-black text-slate-900 font-display mt-0.5">4</div>
          <div className="text-[11px] text-cyan-700 font-semibold mt-0.5">+2 this week</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="text-xs text-slate-500 font-medium">Active</div>
          <div className="text-2xl font-black text-slate-900 font-display mt-0.5">3</div>
          <div className="text-[11px] text-amber-600 font-semibold mt-0.5">1 in progress</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="text-xs text-slate-500 font-medium">Fixed</div>
          <div className="text-2xl font-black text-slate-900 font-display mt-0.5">1</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">Closed in 5 days</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="text-xs text-slate-500 font-medium">Avg first response</div>
          <div className="text-2xl font-black text-slate-900 font-display mt-0.5">6 hrs</div>
          <div className="text-[11px] text-slate-500 font-medium mt-0.5">City avg 9 hrs</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm col-span-2 md:col-span-1">
          <div className="text-xs text-slate-500 font-medium">Reports within 24h</div>
          <div className="text-2xl font-black text-slate-900 font-display mt-0.5">75%</div>
          <div className="text-[11px] text-slate-500 font-medium mt-0.5">Above ward target</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilter("All")}
          className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
            filter === "All"
              ? "bg-cyan-700 text-white shadow-sm"
              : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          All 4
        </button>
        <button
          onClick={() => setFilter("Active")}
          className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
            filter === "Active"
              ? "bg-cyan-700 text-white shadow-sm"
              : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          Active 3
        </button>
        <button
          onClick={() => setFilter("Fixed")}
          className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
            filter === "Fixed"
              ? "bg-cyan-700 text-white shadow-sm"
              : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          Fixed 1
        </button>
      </div>

      {/* Grid of Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => navigate(`/my-reports/${item.id}`)}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start gap-3.5">
                <img
                  src={item.photo}
                  alt={item.title}
                  className="w-16 h-16 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 font-display truncate">
                      {item.title}
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border flex-shrink-0 ${item.badgeColor}`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">
                    {item.location} · {item.category}
                  </p>
                  <div className="mt-1 text-[11px] text-slate-400">
                    Reported {item.reported}
                  </div>
                </div>
              </div>

              {/* Status Stepper */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                {["Reported", "Acknowledged", "In Progress", "Fixed"].map((st, idx) => {
                  const stepNum = idx + 1;
                  const isDone = stepNum <= item.step;
                  return (
                    <div key={st} className="flex flex-col items-center flex-1 relative">
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold z-10 transition-colors ${
                          isDone
                            ? "bg-cyan-700 text-white"
                            : "bg-slate-100 text-slate-400 border border-slate-300"
                        }`}
                      >
                        {isDone ? "✓" : ""}
                      </div>
                      <span
                        className={`text-[10px] mt-1 font-semibold truncate ${
                          isDone ? "text-slate-800" : "text-slate-400"
                        }`}
                      >
                        {st}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="font-mono font-bold text-slate-400">#{item.id}</span>
              <span className="text-cyan-700 font-bold hover:underline flex items-center gap-1">
                <span>View detail</span>
                <i className="fas fa-arrow-right text-[10px]" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 2 Bottom Analytics Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Average days to fix */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 font-display">
            Average days to fix, by category
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Your closed reports vs the Indore city benchmark · unit: days
          </p>

          <div className="mt-6 space-y-4">
            {fixStats.map((st) => (
              <div key={st.cat} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>{st.cat}</span>
                  <span className="text-slate-500">
                    <strong className="text-cyan-800">{st.your} d</strong> (City: {st.city} d)
                  </span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex gap-0.5">
                  <div
                    className="bg-cyan-700 h-full rounded-l-full"
                    style={{ width: `${(st.your / 8) * 100}%` }}
                    title={`Your reports: ${st.your}d`}
                  />
                  <div
                    className="bg-sky-300 h-full rounded-r-full"
                    style={{ width: `${(st.city / 8) * 100}%` }}
                    title={`City benchmark: ${st.city}d`}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-cyan-700" />
              <span>Your reports (avg days)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-sky-300" />
              <span>City benchmark</span>
            </span>
          </div>
        </div>

        {/* Right: What your portfolio tells us */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-display">
              What your portfolio tells us
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Signals from your four submissions · demo data
            </p>

            <div className="space-y-3 mt-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="font-bold text-slate-900">Fastest close: waste</div>
                <p className="text-slate-500 mt-0.5">
                  Overflowing bin on Bicholi Mardana Road is tracking toward a 2-day resolution — well ahead of the city average.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="font-bold text-slate-900">Longest wait: potholes</div>
                <p className="text-slate-500 mt-0.5">
                  Road repairs run about 5 days in your history. The Vijay Nagar carriageway pothole entered In Progress within 12 hours of reporting.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="font-bold text-slate-900">One-tap tracking works</div>
                <p className="text-slate-500 mt-0.5">
                  Every report you've submitted has been acknowledged within 24 hours, so status steppers stay current without follow-up calls.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 bg-cyan-50/70 border border-cyan-100 rounded-xl p-3 text-xs text-cyan-900">
            <strong>Recommended next step:</strong> Enable notifications for #IS-0092 — high-priority road work usually moves from In Progress to Fixed within 48 hours.
          </div>
        </div>
      </div>
    </div>
  );
}
