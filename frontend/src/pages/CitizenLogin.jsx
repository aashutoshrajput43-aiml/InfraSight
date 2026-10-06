import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CitizenLogin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("signin");
  const [email, setEmail] = useState("ananya.sharma@indore.in");
  const [fullName, setFullName] = useState("Ananya Sharma");

  const handleContinue = (e) => {
    e.preventDefault();
    localStorage.setItem("infrasight_role", "citizen");
    localStorage.setItem("infrasight_user", email || "citizen@indore.gov.in");
    localStorage.setItem("infrasight_userName", fullName || "Indore Citizen");
    navigate("/report");
  };

  const chartData = [
    { day: "Mon", count: 17 },
    { day: "Tue", count: 21 },
    { day: "Wed", count: 15 },
    { day: "Thu", count: 26 },
    { day: "Fri", count: 30, peak: true },
    { day: "Sat", count: 23 },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Split Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Mission & Highlights */}
        <div className="lg:col-span-7 space-y-6 pt-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Citizen entry · Demo prototype</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight font-display">
            Make your neighbourhood safer, one report at a time.
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
            InfraSight helps Indore citizens flag potholes, broken streetlights, and damaged drains in seconds — and watch the city respond.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                <i className="fas fa-check text-xs" />
              </div>
              <p className="text-sm text-slate-700 font-medium">
                <strong>Report in under a minute</strong> — snap, confirm location, submit.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                <i className="fas fa-check text-xs" />
              </div>
              <p className="text-sm text-slate-700 font-medium">
                <strong>Track every update</strong> — from submission to verified repair.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                <i className="fas fa-check text-xs" />
              </div>
              <p className="text-sm text-slate-700 font-medium">
                <strong>Backed by AI triage</strong> — urgent hazards reach crews faster.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Clean Welcome Card */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7">
            <div className="mb-5">
              <h2 className="text-xl font-bold text-slate-900 font-display">Welcome to InfraSight</h2>
              <p className="text-xs text-slate-500 mt-1">
                Sign in or create a citizen account to start reporting.
              </p>
            </div>

            {/* Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-xl mb-5 border border-slate-200">
              <button
                type="button"
                onClick={() => setActiveTab("signin")}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeTab === "signin"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("create")}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeTab === "create"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Create account
              </button>
            </div>

            <form onSubmit={handleContinue} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-600/10 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Full name {activeTab === "create" ? "(new accounts)" : "(optional)"}
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ananya Sharma"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-600/10 transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-cyan-700 hover:bg-cyan-800 text-white font-bold text-sm rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
              >
                <span>Continue as citizen</span>
                <i className="fas fa-arrow-right text-xs" />
              </button>

              <p className="text-[11px] text-center text-slate-400">
                No password needed in this prototype — any email works.
              </p>
            </form>

            {/* Trust Note Card */}
            <div className="mt-5 bg-cyan-50/60 border border-cyan-100 rounded-xl p-3.5 flex items-start gap-2.5 text-[11px] text-cyan-900 leading-relaxed">
              <i className="fas fa-shield-alt text-cyan-600 mt-0.5 text-xs flex-shrink-0" />
              <span>
                <strong>Trust note:</strong> this is an illustrative demo state. No real accounts are created, no data leaves your device, and reports shown throughout InfraSight are simulated for the Indore pilot preview.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4-Stat Metric Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="text-xs text-slate-500 font-medium">Citizen reports (demo week)</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1 font-display">164</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
            <span>▲ 12%</span>
            <span className="text-slate-400 font-normal">vs prior week</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="text-xs text-slate-500 font-medium">Wards already onboard</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1 font-display">7 of 12</div>
          <div className="text-[11px] text-slate-500 font-medium mt-0.5">
            pilot coverage
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="text-xs text-slate-500 font-medium">Median time to report</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1 font-display">48 sec</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
            <span>▲ faster</span>
            <span className="text-slate-400 font-normal">than paper intake</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="text-xs text-slate-500 font-medium">Demo citizens signed in</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1 font-display">2,310</div>
          <div className="text-[11px] text-slate-500 font-medium mt-0.5">
            simulated accounts
          </div>
        </div>
      </div>

      {/* 2 Middle Cards: Pilot Chart + Why Neighbours Sign Up */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Card: Bar chart */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-display">
              Citizen reports per day – pilot week
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Illustrative demo data · unit: reports per day
            </p>

            {/* Custom Bar Visualization */}
            <div className="mt-6 flex items-end justify-between gap-3 h-40 pt-6 px-2">
              {chartData.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[11px] font-bold text-slate-600 group-hover:text-cyan-700">
                    {d.count}
                  </span>
                  <div
                    className={`w-full max-w-[36px] rounded-t-md transition-all ${
                      d.peak
                        ? "bg-cyan-600 group-hover:bg-cyan-700"
                        : "bg-cyan-700/80 group-hover:bg-cyan-700"
                    }`}
                    style={{ height: `${(d.count / 32) * 100}%` }}
                  />
                  <span className="text-xs text-slate-500 font-medium">{d.day}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-slate-500 mt-6 pt-4 border-t border-slate-100">
            Simulated sign-up week activity: citizen reports climb toward the Thursday–Friday peak, peaking at 30 reports in a single day.
          </p>
        </div>

        {/* Right Card: Why neighbours sign up */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-display">Why neighbours sign up</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Insights from the simulated Indore pilot
            </p>

            <div className="space-y-4 mt-5">
              <div className="flex items-start gap-3">
                <i className="fas fa-check text-cyan-600 text-xs mt-1" />
                <div className="text-xs text-slate-700 leading-relaxed">
                  <strong>Speed wins trust.</strong> Citizens who submit within a minute are the most likely to report a second issue in the same week.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <i className="fas fa-map-pin text-orange-500 text-xs mt-1" />
                <div className="text-xs text-slate-700 leading-relaxed">
                  <strong>Location does the heavy lifting.</strong> Auto-captured GPS removes the hardest step — describing exactly where the hazard is.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <i className="fas fa-layer-group text-cyan-600 text-xs mt-1" />
                <div className="text-xs text-slate-700 leading-relaxed">
                  <strong>Every report counts.</strong> Duplicate submissions are merged automatically, so repeat reports strengthen a case instead of cluttering it.
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-cyan-50/80 border border-cyan-100 rounded-xl p-3 flex items-start gap-2.5 text-xs text-cyan-900">
            <i className="fas fa-lightbulb text-cyan-600 mt-0.5 flex-shrink-0" />
            <span>
              <strong>Recommended next step:</strong> sign in with any email above and continue as a citizen to try the one-minute reporting flow for yourself.
            </span>
          </div>
        </div>
      </div>

      {/* Horizontal Workflow Strip */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
          {/* Step 1 */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-700 flex items-center justify-center font-bold text-sm">
              1
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">Citizen report</div>
              <div className="text-[11px] text-slate-400">photo · location · category</div>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-400 font-semibold px-2">
            <span>seconds</span>
            <i className="fas fa-arrow-right text-xs text-slate-300 ml-1" />
          </div>

          {/* Step 2 */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              2
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">AI triage</div>
              <div className="text-[11px] text-slate-400">priority + duplicate merge</div>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-400 font-semibold px-2">
            <span>routed to ward</span>
            <i className="fas fa-arrow-right text-xs text-slate-300 ml-1" />
          </div>

          {/* Step 3 */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-bold text-sm">
              3
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">Municipal crew</div>
              <div className="text-[11px] text-slate-400">repair + verification</div>
            </div>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 text-center pt-3 mt-2 border-t border-slate-100">
          How a citizen report travels through InfraSight — from your phone to a verified repair.
        </div>
      </div>
    </div>
  );
}
