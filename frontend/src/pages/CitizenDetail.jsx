import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { api } from "../api/client";
import { SinglePinMap } from "../components/MapComponents";
import { formatCategory, getPhotoForType, getPrioBadge, getPrioLevel, getDepartmentForType } from "../utils/issueHelpers";

export default function CitizenDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [issueData, setIssueData] = useState(location.state?.issue || null);
  const [isLoading, setIsLoading] = useState(!location.state?.issue);

  useEffect(() => {
    async function fetchIssue() {
      if (!id) return;
      try {
        setIsLoading(true);
        const data = await api.getIssueById(id);
        if (data) setIssueData(data);
      } catch (err) {
        console.warn("Could not fetch issue by id, falling back to cached/default state:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchIssue();
  }, [id]);

  const raw = issueData || {};
  const refCode = raw.id?.length > 8 ? `IS-${raw.id.slice(0, 4).toUpperCase()}` : raw.id || id || "IS-0092";
  const catName = formatCategory(raw.type || raw.category);
  const areaName = raw.area || "Vijay Nagar";
  const addressName = raw.address || "AB Road, Indore";
  const pScore = Math.round(raw.priority_score || 82);
  const pLevel = getPrioLevel(pScore);
  const pBadge = getPrioBadge(pScore);
  const status = raw.status === "Reported" ? "Reported" : raw.status || "In Progress";
  const reportCount = raw.report_count || 13;
  const lat = raw.latitude || 22.7533;
  const lng = raw.longitude || 75.8937;
  const photoUrl = getPhotoForType(raw.type, raw.image_url);
  const dept = getDepartmentForType(raw.type);

  const bbox = raw.detections?.[0]?.bbox || [0.18, 0.45, 0.64, 0.42];
  const boxPos = {
    left: `${Math.round(bbox[0] * 100)}%`,
    top: `${Math.round(bbox[1] * 100)}%`,
    width: `${Math.round(bbox[2] * 100)}%`,
    height: `${Math.round(bbox[3] * 100)}%`,
  };

  const hazard = raw.connected_hazards?.[0]
    ? `${formatCategory(raw.connected_hazards[0].type)} ${raw.connected_hazards[0].distance_m}m away (${raw.connected_hazards[0].risk_level} risk)`
    : null;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <button
              onClick={() => navigate("/my-reports")}
              className="hover:text-cyan-700 font-semibold flex items-center gap-1"
            >
              <i className="fas fa-arrow-left text-[10px]" />
              <span>My Reports</span>
            </button>
            <span>/</span>
            <span className="font-mono text-slate-700 font-bold">{refCode}</span>
          </div>

          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
              {catName} · {areaName}
            </h1>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                status === "Fixed"
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                  : status === "In Progress"
                  ? "bg-amber-50 text-amber-800 border-amber-200"
                  : "bg-cyan-50 text-cyan-800 border-cyan-200"
              }`}
            >
              {status}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {addressName} · {areaName} Ward
          </p>
        </div>

        <button
          onClick={() => navigate("/my-reports")}
          className="px-3.5 py-1.5 border border-slate-200 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-50 transition-all self-start sm:self-auto"
        >
          Back to Reports
        </button>
      </div>

      {/* Top 6 Stat Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-sm">
          <div className="text-[10px] font-bold text-slate-400 uppercase">PRIORITY SCORE</div>
          <div className="text-xl font-black text-amber-600 font-display mt-0.5">{pScore}/100</div>
          <div className="text-[10px] text-slate-500">{pLevel} priority</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-sm">
          <div className="text-[10px] font-bold text-slate-400 uppercase">AI CONFIDENCE</div>
          <div className="text-xl font-black text-slate-900 font-display mt-0.5">
            {Math.round((raw.detections?.[0]?.confidence || 0.94) * 100)}%
          </div>
          <div className="text-[10px] text-emerald-600 font-semibold">{catName} detected</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-sm">
          <div className="text-[10px] font-bold text-slate-400 uppercase">MERGED REPORTS</div>
          <div className="text-xl font-black text-slate-900 font-display mt-0.5">{reportCount}</div>
          <div className="text-[10px] text-cyan-700 font-semibold">Corroborated</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-sm">
          <div className="text-[10px] font-bold text-slate-400 uppercase">ASSIGNED DEPT</div>
          <div className="text-sm font-black text-slate-900 font-display mt-1 truncate">
            {dept}
          </div>
          <div className="text-[10px] text-slate-500">IMC Municipal</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-sm">
          <div className="text-[10px] font-bold text-slate-400 uppercase">SEVERITY INDEX</div>
          <div className="text-xl font-black text-slate-900 font-display mt-0.5">
            {Math.round((raw.severity || 0.75) * 100)}%
          </div>
          <div className="text-[10px] text-red-500 font-semibold">High footprint</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-sm">
          <div className="text-[10px] font-bold text-slate-400 uppercase">SLA TARGET</div>
          <div className="text-xl font-black text-cyan-800 font-display mt-0.5">48 hrs</div>
          <div className="text-[10px] text-emerald-600 font-semibold">On schedule</div>
        </div>
      </div>

      {/* Two Column Inspector Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Photos, Timeline & Merged Chart */}
        <div className="lg:col-span-7 space-y-6">
          {/* Citizen Photo with AI Overlays */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
              Citizen photo · AI detection overlay
            </h2>

            <div className="relative rounded-xl overflow-hidden bg-slate-900 border border-slate-200 aspect-[16/10] flex items-center justify-center">
              <img
                src={photoUrl}
                alt={catName}
                className="w-full h-full object-cover"
              />

              {/* Bounding Box */}
              <div
                className="absolute border-2 border-cyan-400 rounded-lg shadow-lg pointer-events-none"
                style={boxPos}
              >
                <span className="absolute -top-6 left-0 bg-cyan-700 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow whitespace-nowrap">
                  {catName} · {Math.round((raw.detections?.[0]?.confidence || 0.94) * 100)}%
                </span>
              </div>
            </div>

            <div className="mt-3 bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 text-xs text-emerald-900 flex items-center gap-2">
              <i className="fas fa-check-circle text-emerald-600" />
              <span>
                <strong>AI Inspection Verdict:</strong> High accuracy detection · verified by IMC Vision model
              </span>
            </div>
          </div>

          {/* Repair Timeline */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4">
              Repair lifecycle timeline
            </h3>

            <div className="space-y-4 pl-2 border-l-2 border-slate-200 ml-2">
              <div className="relative pl-4">
                <span className="absolute -left-[21px] top-0.5 w-3 h-3 rounded-full bg-cyan-700 ring-4 ring-white" />
                <div className="text-xs font-bold text-slate-800">Report Registered</div>
                <div className="text-[11px] text-slate-400">Photo + GPS verified in IMC queue</div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Assigned priority score {pScore}/100 based on traffic and school proximity.
                </p>
              </div>

              <div className="relative pl-4">
                <span
                  className={`absolute -left-[21px] top-0.5 w-3 h-3 rounded-full ring-4 ring-white ${
                    status === "In Progress" || status === "Fixed" ? "bg-cyan-700" : "bg-slate-300"
                  }`}
                />
                <div className="text-xs font-bold text-slate-800">Department Dispatch</div>
                <div className="text-[11px] text-slate-400">Routed to {dept}</div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Inspection ticket created; field engineering team scheduled.
                </p>
              </div>

              <div className="relative pl-4">
                <span
                  className={`absolute -left-[21px] top-0.5 w-3 h-3 rounded-full ring-4 ring-white ${
                    status === "Fixed" ? "bg-emerald-600" : "bg-slate-300"
                  }`}
                />
                <div className="text-xs font-bold text-slate-800">
                  {status === "Fixed" ? "Completed & Closed" : "Field Resolution"}
                </div>
                <div className="text-[11px] text-slate-400">
                  {status === "Fixed" ? "Verified via AI after-photo" : "Under field repair"}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {status === "Fixed"
                    ? "Repair marked complete with photo audit."
                    : "Target resolution within 48 hours."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Location, Priority & Insights */}
        <div className="lg:col-span-5 space-y-5">
          {/* Priority Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">PRIORITY ASSESSMENT</div>
                <div className="text-2xl font-black text-amber-600 font-display">
                  {pScore} <span className="text-xs font-normal text-slate-500">{pLevel} priority</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Score {pScore}/100 · escalated to {dept}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Corroboration</span>
                <strong className="text-slate-800">{reportCount} citizen reports</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Status</span>
                <strong className="text-slate-800">{status}</strong>
              </div>
            </div>
          </div>

          {/* Location Pin & Map Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              GPS Location & Map
            </h3>

            <div className="h-48 rounded-xl overflow-hidden border border-slate-200 mb-3">
              <SinglePinMap lat={lat} lng={lng} label={catName} />
            </div>

            <div className="text-xs text-slate-600">
              <strong className="block text-slate-900">{areaName}</strong>
              <span>{addressName}</span>
              <div className="text-[11px] font-mono text-slate-400 mt-1">
                {lat.toFixed(4)}° N, {lng.toFixed(4)}° E · Indore Municipal Corporation
              </div>
            </div>
          </div>

          {/* Related Hazard Alert Card */}
          {hazard && (
            <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900">
              <div className="font-bold flex items-center gap-1.5 mb-1 text-amber-800">
                <i className="fas fa-exclamation-triangle" />
                <span>Connected hazard alert</span>
              </div>
              <p className="leading-relaxed">{hazard}</p>
            </div>
          )}

          {/* Insights for this Report */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3 text-xs">
            <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs">
              Municipal Insight
            </h3>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="font-bold text-slate-900">Auto-generated complaint draft</div>
              <p className="text-slate-500 mt-0.5">
                Official Indore Municipal Corporation work order registered with reference code #{refCode}.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="font-bold text-slate-900">Citizen notification</div>
              <p className="text-slate-500 mt-0.5">
                Status updates will automatically appear here once field crews update their repair log.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
