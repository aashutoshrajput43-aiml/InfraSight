import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function CitizenSuccess() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const rawIssue = location.state?.issue || {};
  const categoryRaw = rawIssue.category || rawIssue.type || "Pothole";
  const categoryName = categoryRaw.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const categoryLower = categoryName.toLowerCase();

  const issue = {
    id: rawIssue.id || id || "IS-0092",
    category: categoryName,
    categoryLower: categoryLower,
    area: rawIssue.area || "Vijay Nagar",
    address: rawIssue.address || "Vijay Nagar Main Road, near Scheme No. 78 junction",
    priority_score: Math.round(rawIssue.priority_score || 82),
    priority_level: rawIssue.priority_level || (rawIssue.priority_score >= 80 ? "Critical" : rawIssue.priority_score >= 65 ? "High" : "Medium"),
    report_count: rawIssue.report_count || 13,
  };

  const refCode = issue.id || "IS-0092";
  const priorityScore = issue.priority_score || 82;

  const factors = [
    { label: "Hazard", score: 88, color: "bg-teal-700" },
    { label: "Traffic", score: 81, color: "bg-cyan-700" },
    { label: "Image", score: 76, color: "bg-sky-600" },
    { label: "Corrob.", score: 84, color: "bg-amber-600" },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top 4 Metric Pills */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            PRIORITY SCORE
          </div>
          <div className="text-2xl font-black text-slate-900 font-display mt-0.5">
            {priorityScore}/100
          </div>
          <div className="text-[11px] text-amber-600 font-semibold mt-1">High priority</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            REFERENCE
          </div>
          <div className="text-2xl font-black text-slate-900 font-display mt-0.5">
            {refCode}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            {issue.area} · {issue.category}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            MERGED REPORTS
          </div>
          <div className="text-2xl font-black text-slate-900 font-display mt-0.5">
            {issue.report_count || 13}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            Same GPS point · within 25 m
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            INSPECTION TARGET
          </div>
          <div className="text-2xl font-black text-slate-900 font-display mt-0.5">
            48 hrs
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">Zone 3 queue</div>
        </div>
      </div>

      {/* Main Hero Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl shadow-sm">
              <i className="fas fa-check" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
              Your report is submitted
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
              The {issue.categoryLower} you flagged on {issue.address} is now in the Indore Municipal Corporation queue.
            </p>

            {/* Reference ID Pill */}
            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-cyan-800 bg-cyan-50 border border-cyan-200 px-3 py-1 rounded-md font-mono">
                REF {refCode}
              </span>
              <span className="text-slate-400">Save this ID to track status anytime.</span>
            </div>

            {/* Merged Banner */}
            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 leading-relaxed">
              <div className="font-bold flex items-center gap-1.5 mb-1">
                <i className="fas fa-layer-group text-amber-700" />
                <span>Merged with an existing report:</span>
              </div>
              <p>
                A nearby report filed 2 days ago covers the same GPS point (within 25 m). Your evidence strengthens that case — you'll be notified when it is repaired.
              </p>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => navigate("/my-reports")}
                className="px-5 py-2.5 bg-cyan-700 hover:bg-cyan-800 text-white font-bold text-xs rounded-lg shadow-sm transition-all"
              >
                Track report
              </button>

              <button
                type="button"
                onClick={() => navigate("/report")}
                className="px-5 py-2.5 border border-slate-200 text-slate-700 font-bold text-xs rounded-lg hover:bg-slate-50 transition-all"
              >
                Report another issue
              </button>
            </div>
          </div>

          {/* Radial Score Gauge Badge */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="#0e7490"
                  strokeWidth="8"
                  strokeDasharray="264"
                  strokeDashoffset={264 * (1 - priorityScore / 100)}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold text-slate-900 font-display">
                  {priorityScore}
                </span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  / 100
                </span>
              </div>
            </div>

            <div className="mt-3">
              <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-[11px] font-bold rounded-full uppercase tracking-wider">
                High Priority
              </span>
            </div>

            <p className="text-[11px] text-slate-400 mt-2">
              Scored at submission from hazard type, road class and image confidence.
            </p>
          </div>
        </div>
      </div>

      {/* Two Middle Analysis Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Why this scored High */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-display">
              Why this scored High
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Weighted factors from the demo AI assessment (score 0–100 each):
            </p>

            {/* Custom Bar Visualization */}
            <div className="mt-6 flex items-end justify-around gap-6 h-36 pt-4 px-2">
              {factors.map((f, i) => (
                <div key={i} className="flex-1 flex flex-col items-center justify-end h-full gap-2">
                  <span className="text-xs font-bold text-slate-700">{f.score}</span>
                  <div
                    className={`w-12 ${f.color} rounded-t-md transition-all`}
                    style={{ height: `${(f.score / 100) * 100}%` }}
                  />
                  <span className="text-xs text-slate-500 font-medium">{f.label}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-slate-400 mt-6 pt-4 border-t border-slate-100">
            Demo AI assessment: hazard severity and corroboration carry the most weight for this case.
          </p>
        </div>

        {/* Right: What happens next */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-display">What happens next</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Lifecycle of your report in Indore Municipal Corporation
            </p>

            <div className="space-y-4 mt-5">
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-cyan-100 text-cyan-800 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  1
                </span>
                <div className="text-xs text-slate-700 leading-relaxed">
                  <strong>Ward engineer notified</strong> — the merged case routes to the Zone 3 inspection queue, expected within 48 hours.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-cyan-100 text-cyan-800 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  2
                </span>
                <div className="text-xs text-slate-700 leading-relaxed">
                  <strong>Status updates</strong> — you'll see Received → Verified → Repair scheduled → Fixed under My Reports.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-cyan-100 text-cyan-800 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  3
                </span>
                <div className="text-xs text-slate-700 leading-relaxed">
                  <strong>Repair proof</strong> — when closed, the crew's after-photo and GPS match appear on the case for your confirmation.
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-500">
            Estimated turnaround in Ward 34: <strong>2–3 business days</strong>
          </div>
        </div>
      </div>

      {/* Recommended Banner */}
      <div className="bg-cyan-50/80 border border-cyan-200 rounded-xl p-4 flex items-start gap-3 text-xs text-cyan-950">
        <span className="px-2 py-0.5 bg-cyan-700 text-white font-bold rounded text-[10px] flex-shrink-0 mt-0.5">
          RECOMMENDED
        </span>
        <p className="leading-relaxed">
          Tap <strong>Track report</strong> and turn on notifications for REF {refCode}. Because your submission merged into a 13-report case, your confirmation will speed up repair verification — no further action is needed until the Zone 3 inspection.
        </p>
      </div>
    </div>
  );
}
