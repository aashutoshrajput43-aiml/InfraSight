import React, { useState } from "react";
import { AdminIssueMap } from "../components/MapComponents";

export default function AdminIssues() {
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [areaFilter, setAreaFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [complaintSent, setComplaintSent] = useState(false);

  // Curated, distinct 5 core issues with sensible authentic Indian infrastructure photos
  const issues = [
    {
      id: "IS-0092",
      type: "pothole",
      categoryName: "Pothole",
      area: "Vijay Nagar",
      address: "AB Road, near Scheme No. 78 junction",
      priority_score: 92,
      priority_level: "Critical",
      status: "Open",
      age: "2 d",
      report_count: 13,
      latitude: 22.7533,
      longitude: 75.8937,
      photo: "/pothole.jpg",
      boxLabel: "Pothole · 94%",
      boxPos: { left: "18%", top: "45%", width: "64%", height: "42%" },
      hazard: "Broken streetlight SL-2214 - dark since Sep 28, 18 m from this pothole",
      department: "Roads Department",
      complaintRef: "IMC-2026-11458",
    },
    {
      id: "IS-0087",
      type: "broken_streetlight",
      categoryName: "Streetlight out",
      area: "Palasia",
      address: "Palasia Square, A.B. Road",
      priority_score: 87,
      priority_level: "High",
      status: "In progress",
      age: "4 d",
      report_count: 9,
      latitude: 22.7210,
      longitude: 75.8830,
      photo: "/streetlight.jpg",
      boxLabel: "Broken luminaire · 92%",
      boxPos: { left: "28%", top: "6%", width: "42%", height: "40%" },
      hazard: "Near busy pedestrian crossing — high night collision risk",
      department: "Electrical Wing",
      complaintRef: "IMC-2026-11420",
    },
    {
      id: "IS-0081",
      type: "overflowing_drain",
      categoryName: "Blocked drain",
      area: "Rajwada",
      address: "Rajwada Palace Gate 2 lane",
      priority_score: 81,
      priority_level: "High",
      status: "Open",
      age: "1 d",
      report_count: 7,
      latitude: 22.7179,
      longitude: 75.8543,
      photo: "/drain.jpg",
      boxLabel: "Drain overflow · 91%",
      boxPos: { left: "15%", top: "35%", width: "70%", height: "55%" },
      hazard: "Stagnant stormwater overflowing into food street",
      department: "Drainage Dept",
      complaintRef: "IMC-2026-11390",
    },
    {
      id: "IS-0076",
      type: "garbage",
      categoryName: "Overflowing bin",
      area: "Sarafa",
      address: "Sarafa Bazaar night food lane",
      priority_score: 64,
      priority_level: "Medium",
      status: "In progress",
      age: "3 d",
      report_count: 8,
      latitude: 22.7170,
      longitude: 75.8530,
      photo: "/garbage.jpg",
      boxLabel: "Waste overflow · 95%",
      boxPos: { left: "20%", top: "35%", width: "60%", height: "52%" },
      hazard: null,
      department: "Waste Management",
      complaintRef: "IMC-2026-11340",
    },
    {
      id: "IS-0061",
      type: "footpath",
      categoryName: "Damaged footpath",
      area: "New Palasia",
      address: "Near Sapna Sangeeta Road",
      priority_score: 54,
      priority_level: "Medium",
      status: "Open",
      age: "5 d",
      report_count: 4,
      latitude: 22.7100,
      longitude: 75.8750,
      photo: "/footpath.jpg",
      boxLabel: "Damaged footpath · 87%",
      boxPos: { left: "18%", top: "30%", width: "64%", height: "55%" },
      hazard: null,
      department: "Civil Works",
      complaintRef: "IMC-2026-11260",
    },
  ];

  const filtered = issues.filter((i) => {
    const textMatch =
      !search ||
      (i.id + i.categoryName + i.area + (i.address || "")).toLowerCase().includes(search.toLowerCase());
    const typeMatch = typeFilter === "All" || i.categoryName?.includes(typeFilter) || i.type?.includes(typeFilter);
    const statusMatch = statusFilter === "All" || i.status?.toLowerCase().includes(statusFilter.toLowerCase());
    const areaMatch = areaFilter === "All" || i.area === areaFilter;
    const prioMatch =
      priorityFilter === "All" ||
      (priorityFilter === "Critical" && i.priority_score >= 80) ||
      (priorityFilter === "High" && i.priority_score >= 65 && i.priority_score < 80) ||
      (priorityFilter === "Medium" && i.priority_score >= 50 && i.priority_score < 65) ||
      (priorityFilter === "Low" && i.priority_score < 50);

    return textMatch && typeMatch && statusMatch && areaMatch && prioMatch;
  });

  const getPrioBadge = (score) => {
    if (score >= 80) return "bg-red-50 text-red-700 border-red-200";
    if (score >= 65) return "bg-orange-50 text-orange-700 border-orange-200";
    if (score >= 50) return "bg-amber-50 text-amber-700 border-amber-200";
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  };

  const handleSendComplaint = () => {
    setComplaintSent(true);
    setTimeout(() => setComplaintSent(false), 4000);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            INFRASIGHT · ADMIN CONSOLE
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display mt-0.5">
            Issue triage workspace
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Priority queue across Indore wards. Click any row or pin to inspect evidence & dispatch crews.
          </p>
        </div>

        <div className="text-xs font-semibold text-slate-500 text-right">
          <div>Indore Municipal Corporation · Ward operations</div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            SEARCH REPORTS
          </label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search ID, area, or type..."
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-cyan-600"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            TYPE
          </label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-cyan-600"
          >
            <option value="All">All types</option>
            <option value="Pothole">Pothole</option>
            <option value="Streetlight">Streetlight</option>
            <option value="drain">Drainage</option>
            <option value="garbage">Garbage</option>
            <option value="footpath">Footpath</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            STATUS
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-cyan-600"
          >
            <option value="All">All statuses</option>
            <option value="Open">Open</option>
            <option value="In progress">In progress</option>
            <option value="Fixed">Fixed</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            AREA
          </label>
          <select
            value={areaFilter}
            onChange={(e) => setAreaFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-cyan-600"
          >
            <option value="All">All areas</option>
            <option value="Vijay Nagar">Vijay Nagar</option>
            <option value="Palasia">Palasia</option>
            <option value="Rajwada">Rajwada</option>
            <option value="Sarafa">Sarafa</option>
          </select>
        </div>

        <div className="col-span-2 md:col-span-1">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            PRIORITY
          </label>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-cyan-600"
          >
            <option value="All">All priorities</option>
            <option value="Critical">Critical (80+)</option>
            <option value="High">High (65+)</option>
            <option value="Medium">Medium (50+)</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Queue Table (Left) + Map (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Table */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 font-display">Open issue queue</h2>
            <span className="text-xs text-slate-400 font-medium">
              {filtered.length} curated issues · click to inspect
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3.5">REF</th>
                  <th className="py-3 px-3.5">ISSUE</th>
                  <th className="py-3 px-3.5">AREA</th>
                  <th className="py-3 px-3.5">PRIORITY</th>
                  <th className="py-3 px-3.5">STATUS</th>
                  <th className="py-3 px-3.5 text-right">AGE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((item) => {
                  const isSelected = selectedIssue?.id === item.id;
                  return (
                    <tr
                      key={item.id}
                      onClick={() => {
                        setSelectedIssue(item);
                        setIsDrawerOpen(true);
                      }}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? "bg-cyan-50/70" : "hover:bg-slate-50/80"
                      }`}
                    >
                      <td className="py-3.5 px-3.5 font-mono font-bold text-slate-900">
                        {item.id}
                      </td>
                      <td className="py-3.5 px-3.5 font-semibold text-slate-800">
                        <div className="flex items-center gap-2">
                          <img
                            src={item.photo}
                            alt=""
                            className="w-7 h-7 rounded-md object-cover border border-slate-200 flex-shrink-0"
                          />
                          <span className="truncate">{item.categoryName}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-3.5 text-slate-600">{item.area}</td>
                      <td className="py-3.5 px-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${getPrioBadge(
                            item.priority_score
                          )}`}
                        >
                          {item.priority_score} {item.priority_level}
                        </span>
                      </td>
                      <td className="py-3.5 px-3.5 text-slate-700 font-medium">{item.status}</td>
                      <td className="py-3.5 px-3.5 text-right text-slate-400">{item.age}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Live Markers Map */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden sticky top-20">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 font-display">
              Indore · live markers
            </h2>
            <span className="text-xs font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-full">
              {filtered.length} pins
            </span>
          </div>

          <div className="h-80 w-full relative">
            <AdminIssueMap
              issues={filtered}
              selectedIssue={selectedIssue}
              onSelectIssue={(iss) => {
                setSelectedIssue(iss);
                setIsDrawerOpen(true);
              }}
            />
          </div>

          <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span>Critical</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                <span>High</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Medium</span>
              </span>
            </div>
            <span>Marker size = priority</span>
          </div>
        </div>
      </div>

      {/* Bottom 3 Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="text-xs font-bold text-red-600">Critical cluster</div>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            IS-0092 (Vijay Nagar) is the critical pin — 2 days old, 13 merged reports, inspection target within 48 h.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="text-xs font-bold text-slate-800">Zone load</div>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Rajwada and Sarafa pins sit within 400 m of each other; a single ward crew visit clears both.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="text-xs font-bold text-emerald-600">Response SLA</div>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            All 5 issues acknowledged under 24 hours — zero overdue inspection cases.
          </p>
        </div>
      </div>

      {/* Slide-out Deep Dive Inspector Drawer (Page 8 in PDF) */}
      {isDrawerOpen && selectedIssue && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-xl bg-white h-full shadow-2xl overflow-y-auto flex flex-col p-6 space-y-5">
            {/* Drawer Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${getPrioBadge(
                      selectedIssue.priority_score
                    )}`}
                  >
                    {selectedIssue.priority_level} · {selectedIssue.priority_score}/100
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">
                    Status: {selectedIssue.status}
                  </span>
                </div>
                <h2 className="text-xl font-extrabold text-slate-900 font-display mt-1.5">
                  {selectedIssue.categoryName} #{selectedIssue.id} · {selectedIssue.area}
                </h2>
                <div className="text-xs text-slate-400 mt-0.5">{selectedIssue.address}</div>
              </div>

              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            {/* Stat Row */}
            <div className="grid grid-cols-4 gap-2.5 text-center">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <div className="text-lg font-black text-slate-900">{selectedIssue.priority_score}</div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">Score</div>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <div className="text-lg font-black text-slate-900">{selectedIssue.report_count}</div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">Reports</div>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <div className="text-lg font-black text-slate-900">{selectedIssue.age}</div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">Age</div>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <div className="text-lg font-black text-slate-900">{selectedIssue.hazard ? 1 : 0}</div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">Hazard</div>
              </div>
            </div>

            {/* Field Evidence Photo with Bounding Overlay for THIS EXACT ISSUE */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                AI-annotated field evidence
              </div>
              <div className="relative rounded-xl overflow-hidden aspect-[16/10] bg-slate-900 border border-slate-200">
                <img
                  src={selectedIssue.photo}
                  alt={selectedIssue.categoryName}
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute border-2 border-amber-400 rounded-lg pointer-events-none"
                  style={selectedIssue.boxPos}
                >
                  <span className="absolute -top-5 left-0 bg-amber-500 text-slate-900 text-[10px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap shadow">
                    {selectedIssue.boxLabel}
                  </span>
                </div>
              </div>
              <div className="text-[11px] text-slate-400">
                GPS {selectedIssue.latitude} N, {selectedIssue.longitude} E · Ward 34
              </div>
            </div>

            {/* Connected Hazard Warning */}
            {selectedIssue.hazard && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-950">
                <div className="font-bold flex items-center gap-1.5 text-amber-900 mb-0.5">
                  <i className="fas fa-exclamation-triangle" />
                  <span>Connected hazard alert</span>
                </div>
                <p className="leading-relaxed">{selectedIssue.hazard}</p>
              </div>
            )}

            {/* Complaint Routing Preview */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3 text-xs">
              <div className="font-bold text-slate-800">Complaint routing preview</div>
              <div className="grid grid-cols-2 gap-2 text-slate-600">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Complaint Ref</span>
                  <span className="font-mono font-bold text-slate-800">
                    {selectedIssue.complaintRef}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Assigned Dept</span>
                  <span className="font-bold text-slate-800">{selectedIssue.department}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSendComplaint}
                  disabled={complaintSent}
                  className="px-4 py-2 bg-cyan-700 hover:bg-cyan-800 text-white font-bold rounded-lg shadow-sm transition-all flex items-center gap-1.5"
                >
                  <i className="fas fa-paper-plane text-xs" />
                  <span>{complaintSent ? "Dispatched to IMC ✓" : "Send to IMC Dept."}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
