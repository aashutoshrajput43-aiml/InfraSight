import React, { useState } from "react";
import { HeatmapView } from "../components/MapComponents";

export default function AdminHeatmap() {
  const [layerMode, setLayerMode] = useState("both"); // "markers", "heatmap", "both"
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    { label: "All", count: 412 },
    { label: "Potholes", count: 148 },
    { label: "Streetlights", count: 96 },
    { label: "Drainage", count: 74 },
    { label: "Waste", count: 58 },
    { label: "Water supply", count: 36 },
  ];

  const problemAreas = [
    {
      rank: 1,
      name: "Vijay Nagar",
      score: 92,
      note: "148 reports · pothole cluster on AB Road service lanes",
      scoreColor: "bg-red-50 text-red-700 border-red-200",
    },
    {
      rank: 2,
      name: "Palasia",
      score: 78,
      note: "96 reports · streetlight outages along the 3-km stretch",
      scoreColor: "bg-orange-50 text-orange-700 border-orange-200",
    },
    {
      rank: 3,
      name: "Rajwada",
      score: 64,
      note: "71 reports · drainage overflow near the market core",
      scoreColor: "bg-amber-50 text-amber-700 border-amber-200",
    },
    {
      rank: 4,
      name: "Bhawarkua",
      score: 51,
      note: "54 reports · recurring waste pickup misses",
      scoreColor: "bg-amber-50 text-amber-700 border-amber-200",
    },
    {
      rank: 5,
      name: "Sarafa",
      score: 38,
      note: "43 reports · water supply pressure complaints",
      scoreColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
  ];

  const mapPoints = [
    { lat: 22.7186, lng: 75.8540, weight: 0.98, score: 95, area: "Rajwada", type: "Traffic signal" },
    { lat: 22.7533, lng: 75.8937, weight: 0.96, score: 92, area: "Vijay Nagar", type: "Pothole" },
    { lat: 22.7380, lng: 75.8750, weight: 0.91, score: 90, area: "Patnipura", type: "Open manhole" },
    { lat: 22.6926, lng: 75.8676, weight: 0.88, score: 89, area: "Bhawarkua", type: "Water supply" },
    { lat: 22.7210, lng: 75.8830, weight: 0.82, score: 78, area: "Palasia", type: "Streetlight" },
    { lat: 22.7179, lng: 75.8543, weight: 0.70, score: 64, area: "Rajwada", type: "Drainage" },
    { lat: 22.7170, lng: 75.8530, weight: 0.42, score: 38, area: "Sarafa", type: "Waste" },
    { lat: 22.6360, lng: 75.8060, weight: 0.35, score: 32, area: "Rau", type: "Pothole" },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            INFRASIGHT · INDORE MUNICIPAL CORPORATION · SPATIAL ANALYSIS
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display mt-0.5">
            Infrastructure heatmap
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Live geographic density & priority clustering across Indore wards.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-slate-100 p-1 rounded-xl flex gap-1 border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setLayerMode("markers")}
              className={`px-3 py-1 rounded-lg transition-all ${
                layerMode === "markers" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Markers
            </button>
            <button
              onClick={() => setLayerMode("heatmap")}
              className={`px-3 py-1 rounded-lg transition-all ${
                layerMode === "heatmap" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Heatmap
            </button>
            <button
              onClick={() => setLayerMode("both")}
              className={`px-3 py-1 rounded-lg transition-all ${
                layerMode === "both" ? "bg-cyan-700 text-white shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Both
            </button>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            MAPPED CLUSTERS
          </div>
          <div className="text-2xl font-black text-slate-900 font-display mt-0.5">6</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">▲ 2 new this week</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            PEAK CLUSTER LOAD
          </div>
          <div className="text-2xl font-black text-red-600 font-display mt-0.5">96</div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">▲ Vijay Nagar · reports/km²</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            ZONES ABOVE THRESHOLD
          </div>
          <div className="text-2xl font-black text-amber-600 font-display mt-0.5">3 / 6</div>
          <div className="text-[11px] text-amber-600 font-medium mt-1">▲ density &gt; 60</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            FILTERED ISSUE TYPES
          </div>
          <div className="text-2xl font-black text-cyan-800 font-display mt-0.5">5 + All</div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">▼ 412 active reports</div>
        </div>
      </div>

      {/* Filter Category Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {categories.map((c) => (
          <button
            key={c.label}
            onClick={() => setSelectedCategory(c.label)}
            className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all border ${
              selectedCategory === c.label
                ? "bg-cyan-700 border-cyan-700 text-white shadow-sm"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            ● {c.label} · {c.count}
          </button>
        ))}
      </div>

      {/* Main Grid: Heatmap (Left) + Problem Areas (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Heatmap Area */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
          <h2 className="text-sm font-bold text-slate-900 font-display">
            Report density across Indore · last 30 days
          </h2>

          <div className="h-96 rounded-xl overflow-hidden border border-slate-200 relative">
            <HeatmapView points={mapPoints} layerMode={layerMode} />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold">Low</span>
              <div className="w-32 h-2.5 rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 via-orange-500 to-red-600" />
              <span className="text-[11px] font-bold">High</span>
            </div>
            <span className="text-[11px]">Reports per km² · transparent heat circles overlay</span>
          </div>
        </div>

        {/* Most Problematic Areas */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-display">
              Most problematic areas
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Ranked by weighted density score (reports, severity, repeat cluster overlap).
            </p>
          </div>

          <div className="space-y-3 text-xs">
            {problemAreas.map((area) => (
              <div
                key={area.rank}
                className="p-3.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200/80 transition-all flex items-start justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <span className="font-bold text-slate-400 mt-0.5">{area.rank}</span>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{area.name}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{area.note}</div>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-black border ${area.scoreColor}`}
                >
                  {area.score}
                </span>
              </div>
            ))}
          </div>

          {/* Field action card */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-950">
            <strong>Field action:</strong> dispatch the Vijay Nagar resurfacing crew first — its cluster overlaps two drainage hotspots, so a single combined work order clears the densest block.
          </div>
        </div>
      </div>

      {/* Bottom 3 Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="text-xs font-bold text-slate-900">AB Road corridor drives the heat</div>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            The two hottest zones sit within 1.5 km of each other along AB Road; pothole reports there account for roughly a third of all mapped density.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="text-xs font-bold text-slate-900">Drainage hides inside road clusters</div>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            Rajwada and Vijay Nagar overlap where drainage overflow weakens the road base — repairing drains first reduces repeat pothole reports.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="text-xs font-bold text-slate-900">Sarafa is trending down</div>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            Water supply pressure complaints fell after last month's line works; its heat circle has cooled from mid-intensity to the lightest tier.
          </p>
        </div>
      </div>
    </div>
  );
}
