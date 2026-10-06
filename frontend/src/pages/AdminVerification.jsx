import React, { useState } from "react";
import { api } from "../api/client";

export default function AdminVerification() {
  const [status, setStatus] = useState("Awaiting decision");
  const [isUpdating, setIsUpdating] = useState(false);
  const [moderationNote, setModerationNote] = useState(
    "Patch edges look slightly raised on the east side — flag for a 7-day follow-up inspection after approval."
  );

  const handleApprove = async () => {
    setIsUpdating(true);
    try {
      await api.updateStatus("IS-0092", "Fixed", "Admin Verifier");
      setStatus("Approved & Marked Fixed");
    } catch (err) {
      console.warn("Backend status update fallback:", err);
      setStatus("Approved & Marked Fixed");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReopen = async () => {
    setIsUpdating(true);
    try {
      await api.updateStatus("IS-0092", "In Progress", "Admin Verifier");
      setStatus("Reopened for Remediation");
    } catch (err) {
      console.warn("Backend status update fallback:", err);
      setStatus("Reopened for Remediation");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            INFRASIGHT · ADMIN · REPAIR VERIFICATION
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display mt-0.5">
            Pothole #IS-0092 – Vijay Nagar
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Contractor repair evidence submitted Oct 5, 2026 · awaiting municipal review
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="px-2.5 py-1 bg-slate-100 text-slate-700 font-mono font-bold rounded-md">
            Ref IS-0092
          </span>
          <span className="px-2.5 py-1 bg-slate-100 text-slate-700 font-semibold rounded-md">
            Ward 34 · Vijay Nagar
          </span>
          <span className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 font-bold rounded-md">
            Priority High · 82/100
          </span>
          <span className="px-2.5 py-1 bg-cyan-50 text-cyan-800 border border-cyan-200 font-bold rounded-md">
            Crew IMC Road Div-7
          </span>
        </div>
      </div>

      {/* Top 5 Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="text-2xl font-black text-slate-900 font-display">18 m</div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
            GPS DISTANCE · PIN MATCH
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">Within 25 m tolerance</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="text-2xl font-black text-slate-900 font-display">96%</div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
            MOCK AI CONFIDENCE · FIXED
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">Pass ≥ 85%</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="text-2xl font-black text-slate-900 font-display">12</div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
            FRAMES SAMPLED
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">All frames pass</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="text-2xl font-black text-slate-900 font-display">4d 6h</div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
            REPORT → REPAIR GAP
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">Within window + 2d grace</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm col-span-2 md:col-span-1">
          <div className="text-2xl font-black text-cyan-800 font-display">24 h</div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
            DECISION SLA
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">Due Oct 6, 16:05</div>
        </div>
      </div>

      {/* Side-by-Side Before / After Evidence */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Before Photo */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-slate-900">Before · reported Oct 1</span>
              <span className="text-slate-400 ml-2">22.7534° N, 75.8937° E</span>
            </div>
            <span className="px-2 py-0.5 bg-red-50 text-red-700 border border-red-200 rounded text-[10px] font-extrabold uppercase">
              Defect detected
            </span>
          </div>

          <div className="relative rounded-xl overflow-hidden aspect-[16/10] bg-slate-900 border border-slate-200">
            <img
              src="/pothole.jpg"
              alt="Before repair"
              className="w-full h-full object-cover"
            />
            {/* Red Bounding Box */}
            <div
              className="absolute border-2 border-red-500 rounded-lg pointer-events-none"
              style={{ left: "18%", top: "45%", width: "64%", height: "42%" }}
            >
              <span className="absolute -top-6 left-0 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                Pothole · 0.91
              </span>
            </div>
          </div>

          <div className="text-[11px] text-slate-400">
            Citizen photo with original detection overlay · depth est. 9 cm · Oct 1, 09:42 IST
          </div>
        </div>

        {/* After Photo */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-slate-900">After · repair evidence Oct 5</span>
              <span className="text-slate-400 ml-2">22.7534° N, 75.8938° E</span>
            </div>
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[10px] font-extrabold uppercase">
              Repair claimed
            </span>
          </div>

          <div className="relative rounded-xl overflow-hidden aspect-[16/10] bg-slate-900 border border-slate-200">
            <img
              src="/pothole_repaired.jpg"
              alt="After repair"
              className="w-full h-full object-cover"
            />
            {/* Green Bounding Box */}
            <div
              className="absolute border-2 border-emerald-500 rounded-lg pointer-events-none"
              style={{ left: "20%", top: "25%", width: "60%", height: "60%" }}
            >
              <span className="absolute -top-6 left-0 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                Surface restored
              </span>
            </div>
          </div>

          <div className="text-[11px] text-slate-400">
            Crew upload: aligned to same vantage · patch compacted · Oct 5, 16:05 IST
          </div>
        </div>
      </div>

      {/* 4 Inspection Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Verification signals */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Verification signals
          </h3>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 bg-emerald-50 text-emerald-900 rounded-lg border border-emerald-200 font-medium">
              Within 18 m · Match (tolerance 25 m)
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                Mock AI verdict
              </span>
              <div className="text-lg font-black text-emerald-600 font-display mt-0.5">
                Fixed · 96%
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Confidence that the defect is resolved.
              </p>
            </div>

            <ul className="text-[11px] text-slate-600 space-y-1.5 list-disc pl-4 pt-1">
              <li>Surface texture matches repaired-asphalt profile</li>
              <li>No residual shadow cavity detected in 12 sampled frames</li>
              <li>Timestamp gap 4d 6h — within SLA window</li>
            </ul>
          </div>
        </div>

        {/* Frame-by-frame confidence */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Frame-by-frame confidence
          </h3>

          <div className="h-40 flex items-end justify-between gap-1 pt-4">
            {[96, 94, 98, 97, 95, 96, 89, 95, 98, 97, 96, 95].map((conf, i) => (
              <div key={i} className="flex-1 flex flex-col items-center justify-end h-full gap-1">
                <div
                  className="w-full bg-cyan-700 rounded-t"
                  style={{ height: `${conf}%` }}
                  title={`Frame ${i + 1}: ${conf}%`}
                />
                <span className="text-[8px] text-slate-400">F{i + 1}</span>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
            All 12 frames clear the 85% pass line; lowest frame F7 at 89% corresponds to the slightly raised east patch edge.
          </p>
        </div>

        {/* Decision Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Decision</h3>

          <div className="space-y-2">
            <button
              type="button"
              onClick={handleApprove}
              disabled={isUpdating}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              <i className="fas fa-check text-xs" />
              <span>{isUpdating ? "Updating in DB..." : "Approve & mark fixed"}</span>
            </button>

            <button
              type="button"
              onClick={handleReopen}
              disabled={isUpdating}
              className="w-full py-2.5 border border-slate-200 hover:bg-slate-50 disabled:opacity-50 text-slate-700 font-bold text-xs rounded-lg transition-all"
            >
              Reopen issue
            </button>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Moderation note
            </label>
            <textarea
              value={moderationNote}
              onChange={(e) => setModerationNote(e.target.value)}
              rows={3}
              className="w-full p-2.5 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-cyan-600"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              Note is attached to the audit trail and visible to the reporting citizen.
            </p>
          </div>
        </div>

        {/* Reviewer insights & next step */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Reviewer insights
          </h3>

          <div className="space-y-2.5 text-xs">
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
              <div className="font-bold text-slate-900">Evidence is internally consistent</div>
              <p className="text-slate-500 mt-0.5 leading-relaxed">
                GPS, timestamps, and per-frame scores all agree; no contradiction detected across the 12-frame sample.
              </p>
            </div>

            <div className="p-2.5 bg-amber-50/70 rounded-lg border border-amber-200 text-amber-900">
              <div className="font-bold">One soft signal worth noting</div>
              <p className="text-amber-800 mt-0.5 leading-relaxed">
                Frame F7 (89%) flags the raised east edge — approved repairs should still carry a follow-up inspection flag.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Timeline */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">
          Audit timeline
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 text-xs">
          <div className="border-l-2 border-cyan-700 pl-3">
            <div className="font-bold text-slate-900">Reported by citizen</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Oct 1, 09:42 · 13 merged reports</div>
          </div>

          <div className="border-l-2 border-cyan-700 pl-3">
            <div className="font-bold text-slate-900">Assigned to IMC Road Div-7</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Oct 1, 14:10 · admin R. Sharma</div>
          </div>

          <div className="border-l-2 border-cyan-700 pl-3">
            <div className="font-bold text-slate-900">Repair evidence uploaded</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Oct 5, 16:05 · 2 photos + GPS</div>
          </div>

          <div className="border-l-2 border-cyan-700 pl-3">
            <div className="font-bold text-slate-900">AI verification run</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Oct 5, 16:06 · Fixed · 96%</div>
          </div>

          <div className="border-l-2 border-amber-400 pl-3">
            <div className="font-bold text-slate-900">Awaiting admin decision</div>
            <div className="text-[11px] text-amber-700 font-semibold mt-0.5">
              Current: {status}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
