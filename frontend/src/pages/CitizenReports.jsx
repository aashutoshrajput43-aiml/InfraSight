import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { formatCategory, getPhotoForType, getPrioBadge } from "../utils/issueHelpers";

export default function CitizenReports() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");
  const [reportsList, setReportsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const defaultReports = [
    {
      id: "IS-0095",
      rawId: "IS-0095",
      title: "Traffic signal malfunction at crossroad",
      category: "Traffic & Signals",
      location: "Rajwada Chowk main intersection",
      reported: "Oct 6, 8:15 AM",
      priority: "Critical",
      status: "Reported",
      step: 1,
      badgeColor: "bg-red-50 text-red-800 border-red-200",
      photo: "/traffic_signal.jpg",
      rawItem: null,
    },
    {
      id: "IS-0092",
      rawId: "IS-0092",
      title: "Pothole on main carriageway",
      category: "Road & Potholes",
      location: "Vijay Nagar, near Scheme 54",
      reported: "Oct 5, 9:42 AM",
      priority: "High",
      status: "In Progress",
      step: 3,
      badgeColor: "bg-teal-50 text-teal-800 border-teal-200",
      photo: "/pothole.jpg",
      rawItem: null,
    },
    {
      id: "IS-0089",
      rawId: "IS-0089",
      title: "Pipeline burst & water flooding road",
      category: "Water Supply",
      location: "Bhawarkua, near University Road",
      reported: "Oct 5, 2:30 PM",
      priority: "High",
      status: "In Progress",
      step: 3,
      badgeColor: "bg-teal-50 text-teal-800 border-teal-200",
      photo: "/pipeline.jpg",
      rawItem: null,
    },
    {
      id: "IS-0087",
      rawId: "IS-0087",
      title: "Streetlight not working",
      category: "Lighting",
      location: "Palasia Square, A.B. Road",
      reported: "Oct 4, 6:15 PM",
      priority: "Medium",
      status: "Reported",
      step: 1,
      badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
      photo: "/streetlight.jpg",
      rawItem: null,
    },
    {
      id: "IS-0079",
      rawId: "IS-0079",
      title: "Overflowing garbage bin",
      category: "Waste",
      location: "Bicholi Mardana Road",
      reported: "Oct 3, 8:05 AM",
      priority: "Low",
      status: "Reported",
      step: 1,
      badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
      photo: "/garbage.jpg",
      rawItem: null,
    },
    {
      id: "IS-0061",
      rawId: "IS-0061",
      title: "Broken footpath slab",
      category: "Footpath",
      location: "New Palasia, near Sapna Sangeeta",
      reported: "Sep 26, 5:30 PM",
      priority: "Fixed",
      status: "Fixed",
      step: 4,
      badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
      photo: "/footpath.jpg",
      rawItem: null,
    },
  ];

  useEffect(() => {
    async function loadReports() {
      try {
        setIsLoading(true);
        // 1. Fetch from backend endpoint /issues/mine
        const backendMine = await api.getMyReports().catch(() => []);
        
        // 2. Fetch any locally submitted IDs
        const localIds = JSON.parse(localStorage.getItem("infrasight_my_reports") || "[]");
        const extraPromises = localIds.map((id) => api.getIssueById(id).catch(() => null));
        const extraIssues = (await Promise.all(extraPromises)).filter(Boolean);

        // Merge backend and local submissions uniquely
        const combined = [...(backendMine || []), ...extraIssues];
        const seen = new Set();
        const unique = [];
        for (const it of combined) {
          if (it?.id && !seen.has(it.id)) {
            seen.add(it.id);
            unique.push(it);
          }
        }

        if (unique.length > 0) {
          const mapped = unique.map((item) => {
            const shortId = item.id.length > 8 ? `IS-${item.id.slice(0, 4).toUpperCase()}` : item.id;
            const catName = formatCategory(item.type);
            const photoUrl = getPhotoForType(item.type, item.image_url);
            const status = item.status === "Reported" ? "Reported" : item.status;
            let step = 1;
            if (status === "In Progress") step = 3;
            else if (status === "Fixed") step = 4;
            else if (status === "Acknowledged") step = 2;

            let badgeColor = "bg-amber-50 text-amber-800 border-amber-200";
            if (status === "Fixed") badgeColor = "bg-emerald-50 text-emerald-800 border-emerald-200";
            else if (status === "In Progress") badgeColor = "bg-teal-50 text-teal-800 border-teal-200";
            else if (item.priority_score >= 80) badgeColor = "bg-red-50 text-red-800 border-red-200";

            return {
              id: shortId,
              rawId: item.id,
              title: item.title || `${catName} on ${item.address || item.area || "road"}`,
              category: catName,
              location: `${item.area || "Indore"}, ${item.address || ""}`,
              reported: item.created_at ? new Date(item.created_at).toLocaleDateString("en-IN", { month: "short", day: "numeric" }) : "Today",
              priority: item.priority_score >= 80 ? "Critical" : item.priority_score >= 65 ? "High" : "Medium",
              status,
              step,
              badgeColor,
              photo: photoUrl,
              rawItem: item,
            };
          });
          setReportsList(mapped);
        } else {
          setReportsList(defaultReports);
        }
      } catch (err) {
        console.warn("My reports fetch fallback:", err);
        setReportsList(defaultReports);
      } finally {
        setIsLoading(false);
      }
    }
    loadReports();
  }, []);

  const filtered = reportsList.filter((r) => {
    if (filter === "All") return true;
    if (filter === "Active") return r.status !== "Fixed";
    if (filter === "Fixed") return r.status === "Fixed";
    return true;
  });

  const totalCount = reportsList.length;
  const activeCount = reportsList.filter((r) => r.status !== "Fixed").length;
  const fixedCount = reportsList.filter((r) => r.status === "Fixed").length;

  const fixStats = [
    { cat: "Potholes", your: 4.8, city: 6.2 },
    { cat: "Lighting", your: 3.2, city: 4.0 },
    { cat: "Waste", your: 1.8, city: 3.1 },
    { cat: "Footpath", your: 4.5, city: 5.4 },
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
          <div className="text-2xl font-black text-slate-900 font-display mt-0.5">{totalCount}</div>
          <div className="text-[11px] text-cyan-700 font-semibold mt-0.5">Live database sync</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="text-xs text-slate-500 font-medium">Active</div>
          <div className="text-2xl font-black text-slate-900 font-display mt-0.5">{activeCount}</div>
          <div className="text-[11px] text-amber-600 font-semibold mt-0.5">Under IMC review</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="text-xs text-slate-500 font-medium">Fixed</div>
          <div className="text-2xl font-black text-slate-900 font-display mt-0.5">{fixedCount}</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">Resolved on site</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="text-xs text-slate-500 font-medium">Avg first response</div>
          <div className="text-2xl font-black text-slate-900 font-display mt-0.5">5.4 hrs</div>
          <div className="text-[11px] text-slate-500 font-medium mt-0.5">City avg 9 hrs</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm col-span-2 md:col-span-1">
          <div className="text-xs text-slate-500 font-medium">Reports within 24h</div>
          <div className="text-2xl font-black text-slate-900 font-display mt-0.5">85%</div>
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
          All ({totalCount})
        </button>
        <button
          onClick={() => setFilter("Active")}
          className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
            filter === "Active"
              ? "bg-cyan-700 text-white shadow-sm"
              : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          Active ({activeCount})
        </button>
        <button
          onClick={() => setFilter("Fixed")}
          className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
            filter === "Fixed"
              ? "bg-cyan-700 text-white shadow-sm"
              : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          Fixed ({fixedCount})
        </button>
      </div>

      {/* Grid of Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() =>
              navigate(`/my-reports/${item.rawId || item.id}`, {
                state: { issue: item.rawItem || item },
              })
            }
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
              Signals from your municipal submissions
            </p>

            <div className="space-y-3 mt-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="font-bold text-slate-900">Fastest close: waste</div>
                <p className="text-slate-500 mt-0.5">
                  Overflowing bin issues are tracking toward a 2-day resolution — well ahead of the city average.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="font-bold text-slate-900">Longest wait: road potholes</div>
                <p className="text-slate-500 mt-0.5">
                  Road repairs run about 4-5 days. High priority cases receive priority slotting within 24 hours.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="font-bold text-slate-900">One-tap tracking active</div>
                <p className="text-slate-500 mt-0.5">
                  Every report is registered with GPS precision and auto-dispatched to the assigned IMC department.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 bg-cyan-50/70 border border-cyan-100 rounded-xl p-3 text-xs text-cyan-900">
            <strong>Recommended next step:</strong> Check on active road cases — IMC operations teams update statuses after field crew completion.
          </div>
        </div>
      </div>
    </div>
  );
}
