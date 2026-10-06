import React from "react";
import { Link, useLocation } from "react-router-dom";

export function PriorityBadge({ score, category, showDot = true, className = "" }) {
  let type = "low";
  let label = "Low";

  if (score >= 80 || category === "critical") {
    type = "critical";
    label = "Critical";
  } else if (score >= 65 || category === "high") {
    type = "high";
    label = "High";
  } else if (score >= 50 || category === "medium") {
    type = "medium";
    label = "Medium";
  } else {
    type = "low";
    label = "Low";
  }

  const styles = {
    critical: "bg-red-50 text-red-600 border border-red-200",
    high: "bg-orange-50 text-orange-600 border border-orange-200",
    medium: "bg-yellow-50 text-yellow-700 border border-yellow-200",
    low: "bg-green-50 text-green-700 border border-green-200",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold tracking-tight ${styles[type]} ${className}`}
    >
      {showDot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            type === "critical"
              ? "bg-red-500"
              : type === "high"
              ? "bg-orange-500"
              : type === "medium"
              ? "bg-yellow-500"
              : "bg-green-500"
          }`}
        />
      )}
      {label} {score !== undefined && typeof score === "number" ? score : ""}
    </span>
  );
}

export function StatusBadge({ status, className = "" }) {
  const norm = (status || "Reported").toLowerCase();

  if (norm.includes("fixed")) {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200 ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
        Fixed
      </span>
    );
  }
  if (norm.includes("progress")) {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-600 border border-orange-200 ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
        In Progress
      </span>
    );
  }
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
      Reported
    </span>
  );
}

export function StatusStepper({ status }) {
  const norm = (status || "Reported").toLowerCase();
  const isProgress = norm.includes("progress") || norm.includes("fixed");
  const isFixed = norm.includes("fixed");

  return (
    <div className="flex items-center gap-1.5 py-1">
      {/* Step 1: Reported */}
      <div className="flex flex-col items-center">
        <div className="w-2.5 h-2.5 rounded-full bg-cyan-600 ring-2 ring-cyan-100" />
        <span className="text-[10px] font-semibold text-cyan-700 mt-1">Reported</span>
      </div>
      <div className={`w-6 h-0.5 ${isProgress ? "bg-cyan-600" : "bg-slate-200"}`} />

      {/* Step 2: In Progress */}
      <div className="flex flex-col items-center">
        <div
          className={`w-2.5 h-2.5 rounded-full ${
            isProgress
              ? isFixed
                ? "bg-cyan-600"
                : "bg-orange-500 ring-4 ring-orange-100"
              : "bg-slate-300"
          }`}
        />
        <span className={`text-[10px] font-semibold mt-1 ${isProgress ? (isFixed ? "text-slate-600" : "text-orange-600 font-bold") : "text-slate-400"}`}>
          In Progress
        </span>
      </div>
      <div className={`w-6 h-0.5 ${isFixed ? "bg-green-600" : "bg-slate-200"}`} />

      {/* Step 3: Fixed */}
      <div className="flex flex-col items-center">
        <div
          className={`w-2.5 h-2.5 rounded-full ${
            isFixed ? "bg-green-600 ring-4 ring-green-100" : "bg-slate-300"
          }`}
        />
        <span className={`text-[10px] font-semibold mt-1 ${isFixed ? "text-green-700 font-bold" : "text-slate-400"}`}>
          Fixed
        </span>
      </div>
    </div>
  );
}

export function ScoreGauge({ score = 82, size = 160 }) {
  const radius = size * 0.4;
  const strokeWidth = size * 0.08;
  const circumference = 2 * Math.PI * radius;
  const safeScore = Math.min(100, Math.max(0, score));
  const offset = circumference - (safeScore / 100) * circumference;

  let strokeColor = "#22c55e"; // green
  if (safeScore >= 80) strokeColor = "#ef4444"; // red
  else if (safeScore >= 65) strokeColor = "#f97316"; // orange
  else if (safeScore >= 50) strokeColor = "#eab308"; // yellow

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#f1f5f9"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-3xl font-extrabold tracking-tight leading-none" style={{ color: strokeColor }}>
          {score}
        </span>
        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mt-0.5">
          / 100
        </span>
      </div>
    </div>
  );
}

export function StatCard({ type = "c-total", icon, num, label, trend, trendUp = true }) {
  const typeBorders = {
    "c-total": "border-t-cyan-500 text-cyan-600",
    "c-critical": "border-t-red-500 text-red-600",
    "c-progress": "border-t-orange-500 text-orange-600",
    "c-fixed": "border-t-green-500 text-green-600",
    "c-time": "border-t-purple-500 text-purple-600",
  };

  return (
    <div className={`bg-white rounded-[14px] p-5 shadow-card border-t-[3px] ${typeBorders[type]} relative overflow-hidden transition-transform hover:-translate-y-0.5`}>
      <div className="text-xl mb-2.5">{icon}</div>
      <div className="text-2xl font-extrabold text-[#0f172a] leading-tight">{num}</div>
      <div className="text-xs font-medium text-[#94a3b8] mt-1">{label}</div>
      {trend && (
        <div className={`text-[11px] font-semibold mt-2 flex items-center gap-1 ${trendUp ? "text-red-500" : "text-green-600"}`}>
          <i className={`fas fa-arrow-${trendUp ? "up" : "down"}`} />
          {trend}
        </div>
      )}
    </div>
  );
}
