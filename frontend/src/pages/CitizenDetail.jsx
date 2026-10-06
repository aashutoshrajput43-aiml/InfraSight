import React from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function CitizenDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const refCode = id || "IS-0092";

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
              Pothole · Vijay Nagar
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
              In Progress
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Ring Road service lane, near Vijay Nagar Square · Ward 34
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
          <div className="text-xl font-black text-amber-600 font-display mt-0.5">82/100</div>
          <div className="text-[10px] text-slate-500">High priority</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-sm">
          <div className="text-[10px] font-bold text-slate-400 uppercase">DEMO AI VERDICT</div>
          <div className="text-xl font-black text-slate-900 font-display mt-0.5">96%</div>
          <div className="text-[10px] text-emerald-600 font-semibold">Pothole confidence</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-sm">
          <div className="text-[10px] font-bold text-slate-400 uppercase">MERGED REPORTS</div>
          <div className="text-xl font-black text-slate-900 font-display mt-0.5">13</div>
          <div className="text-[10px] text-cyan-700 font-semibold">+1 since Oct 4</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-sm">
          <div className="text-[10px] font-bold text-slate-400 uppercase">DAYS OPEN</div>
          <div className="text-xl font-black text-slate-900 font-display mt-0.5">4</div>
          <div className="text-[10px] text-slate-500">Target ≤ 4 days</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-sm">
          <div className="text-[10px] font-bold text-slate-400 uppercase">POTHOLE DEPTH</div>
          <div className="text-xl font-black text-slate-900 font-display mt-0.5">9 cm</div>
          <div className="text-[10px] text-red-500 font-semibold">Above 5 cm threshold</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-sm">
          <div className="text-[10px] font-bold text-slate-400 uppercase">FIX TARGET</div>
          <div className="text-xl font-black text-cyan-800 font-display mt-0.5">Oct 6</div>
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
                src="/pothole.jpg"
                alt="Pothole overlay"
                className="w-full h-full object-cover"
              />

              {/* Bounding Box 1 */}
              <div
                className="absolute border-2 border-cyan-400 rounded-lg shadow-lg pointer-events-none"
                style={{ left: "18%", top: "45%", width: "64%", height: "42%" }}
              >
                <span className="absolute -top-6 left-0 bg-cyan-700 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                  Pothole 96%
                </span>
                <span className="absolute -bottom-5 right-0 bg-slate-900/90 text-cyan-300 text-[10px] font-mono px-1.5 py-0.5 rounded">
                  ~9 cm deep
                </span>
              </div>

              {/* Dimension Tag */}
              <div
                className="absolute border border-dashed border-cyan-300 bg-cyan-900/60 text-white text-[10px] px-2 py-1 rounded pointer-events-none"
                style={{ right: "12%", top: "40%" }}
              >
                ~52 cm est. width
              </div>
            </div>

            <div className="mt-3 bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 text-xs text-emerald-900 flex items-center gap-2">
              <i className="fas fa-check-circle text-emerald-600" />
              <span>
                <strong>Demo verdict:</strong> 96% confidence · Pothole on asphalt service lane
              </span>
            </div>
          </div>

          {/* Merged Reports Bar Chart */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Merged reports near this pothole · demo data
            </h3>

            <div className="mt-5 flex items-end justify-around gap-6 h-32 pt-2 px-4">
              {[
                { date: "Oct 2", count: 3 },
                { date: "Oct 3", count: 5, peak: true },
                { date: "Oct 4", count: 4 },
                { date: "Oct 5", count: 2 },
              ].map((item) => (
                <div key={item.date} className="flex-1 flex flex-col items-center justify-end h-full gap-2">
                  <span className="text-xs font-bold text-slate-700">{item.count}</span>
                  <div
                    className={`w-12 rounded-t-md ${
                      item.peak ? "bg-cyan-700" : "bg-teal-600"
                    }`}
                    style={{ height: `${(item.count / 6) * 100}%` }}
                  />
                  <span className="text-[10px] text-slate-400 font-medium">{item.date}</span>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-slate-400 mt-4 pt-3 border-t border-slate-100">
              13 citizen reports total (12 merged + original). Peak on Oct 3 follows morning traffic on the Ring Road service lane.
            </p>
          </div>

          {/* Repair Timeline */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4">
              Repair timeline
            </h3>

            <div className="space-y-4 pl-2 border-l-2 border-slate-200 ml-2">
              <div className="relative pl-4">
                <span className="absolute -left-[21px] top-0.5 w-3 h-3 rounded-full bg-cyan-700 ring-4 ring-white" />
                <div className="text-xs font-bold text-slate-800">Reported</div>
                <div className="text-[11px] text-slate-400">Oct 2, 2026 · 9:14 AM IST</div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Photo + GPS submitted; merged with 12 nearby reports.
                </p>
              </div>

              <div className="relative pl-4">
                <span className="absolute -left-[21px] top-0.5 w-3 h-3 rounded-full bg-cyan-700 ring-4 ring-white" />
                <div className="text-xs font-bold text-slate-800">In Progress</div>
                <div className="text-[11px] text-slate-400">Oct 3, 2026 · 11:40 AM IST</div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Ward 34 crew assigned; inspection completed on site.
                </p>
              </div>

              <div className="relative pl-4">
                <span className="absolute -left-[21px] top-0.5 w-3 h-3 rounded-full bg-amber-400 ring-4 ring-white" />
                <div className="text-xs font-bold text-slate-800">Fixed – awaiting verification</div>
                <div className="text-[11px] text-slate-400">Expected by Oct 6, 2026 · 48-hour target</div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Repair evidence submitted; simulated AI verification pending.
                </p>
              </div>
            </div>
          </div>

          {/* Before / After Evidence */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              Before / after evidence
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-slate-900 border border-slate-200">
                  <img
                    src="/pothole.jpg"
                    alt="Damaged road pothole"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-red-600 text-white text-[10px] font-bold rounded">
                    Oct 2 · damaged
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Before: citizen photo, 9:14 AM</div>
              </div>

              <div>
                <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-slate-900 border border-slate-200">
                  <img
                    src="/pothole_repaired.jpg"
                    alt="Repaired road patch"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-bold rounded">
                    Oct 5 · repaired
                  </span>
                  <span className="absolute bottom-2 left-2 right-2 text-center bg-black/60 text-white text-[10px] py-1 rounded backdrop-blur-sm">
                    Patched surface
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">After: crew photo, 4:52 PM</div>
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
                <div className="text-[10px] font-bold text-slate-400 uppercase">PRIORITY</div>
                <div className="text-2xl font-black text-amber-600 font-display">
                  82 <span className="text-xs font-normal text-slate-500">High priority</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  score 82/100 · escalated to Ward 34 crew
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Severity</span>
                <strong className="text-slate-800">9 cm deep</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Traffic Lane</span>
                <strong className="text-slate-800">Service lane</strong>
              </div>
            </div>
          </div>

          {/* Location Pin Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Location pin
            </h3>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center text-base mb-2">
                <i className="fas fa-map-pin" />
              </div>
              <strong className="text-sm text-slate-800">Vijay Nagar Sq.</strong>
              <span className="text-xs text-slate-500">Ring Road service lane</span>
              <span className="text-[11px] font-mono text-slate-400 mt-1">
                22.7533° N, 75.8937° E · GPS accuracy ±4 m · Ward 34
              </span>
            </div>
          </div>

          {/* Related Hazard Alert Card */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900">
            <div className="font-bold flex items-center gap-1.5 mb-1 text-amber-800">
              <i className="fas fa-exclamation-triangle" />
              <span>Related hazard nearby</span>
            </div>
            <p className="leading-relaxed">
              Broken streetlight 40 m ahead on the same service lane (IS-0087) — dark patch increases pothole risk after 7 PM.
            </p>
          </div>

          {/* Insights for this Report */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs">
              Insights for this report
            </h3>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="font-bold text-slate-900">Verification nearly done</div>
              <p className="text-slate-500 mt-0.5">
                Before/after photos align within ±4 m GPS match; the simulated AI check is the only open step before Fixed is confirmed.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="font-bold text-slate-900">Repeat damage risk</div>
              <p className="text-slate-500 mt-0.5">
                This stretch was patched in March 2026 and re-opened within 5 months — crews suggest a full-depth repair instead of surface patching.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="font-bold text-slate-900">Strong citizen signal</div>
              <p className="text-slate-500 mt-0.5">
                13 merged reports from Vijay Nagar, Palasia, and Mahalaxmi Nagar confirm the same defect, raising confidence in the pin.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Recommendation Banner */}
      <div className="bg-cyan-50/70 border border-cyan-200 rounded-xl p-4 flex items-start gap-3 text-xs text-cyan-950">
        <span className="w-5 h-5 rounded-full bg-cyan-700 text-white flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
          <i className="fas fa-info text-[10px]" />
        </span>
        <p className="leading-relaxed">
          <strong>Recommended next step:</strong> expect the simulated verification verdict by Oct 6 evening. If it passes, this report moves to Fixed and you will get a closure photo plus a rate-the-repair prompt; if the patch fails inspection, it reopens at the same priority score.
        </p>
      </div>
    </div>
  );
}
