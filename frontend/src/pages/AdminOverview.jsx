import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { api } from "../api/client";

export default function AdminOverview() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const s = await api.getStats();
        if (s) setStats(s);
      } catch (e) {
        console.warn("Using simulated stats for overview", e);
      }
    }
    load();
  }, []);

  const issueTypeData = [
    { name: "Pothole", count: 28, fill: "#e86a2c" },
    { name: "Streetlight", count: 18, fill: "#eab308" },
    { name: "Drainage", count: 16, fill: "#0891b2" },
    { name: "Garbage", count: 12, fill: "#16a34a" },
    { name: "Traffic signal", count: 10, fill: "#ef4444" },
    { name: "Water supply", count: 8, fill: "#06b6d4" },
  ];

  const trendData = [
    { day: "Mon", submitted: 17, resolved: 12 },
    { day: "Tue", submitted: 21, resolved: 18 },
    { day: "Wed", submitted: 15, resolved: 16 },
    { day: "Thu", submitted: 26, resolved: 22 },
    { day: "Fri", submitted: 30, resolved: 28 },
    { day: "Sat", submitted: 23, resolved: 20 },
    { day: "Sun", submitted: 14, resolved: 19 },
  ];

  const topQueue = [
    {
      rank: 1,
      id: "IS-0095",
      title: "Broken traffic signal, collision risk",
      meta: "#IS-0095 · merged 17 reports",
      area: "Rajwada Chowk",
      reports: 17,
      priority: "Critical",
      prioColor: "bg-red-50 text-red-700 border-red-200",
      photo: "/traffic_signal.jpg",
    },
    {
      rank: 2,
      id: "IS-0092",
      title: "Deep pothole, lane collapse risk",
      meta: "#IS-0092 · merged 13 reports",
      area: "Vijay Nagar",
      reports: 13,
      priority: "Critical",
      prioColor: "bg-red-50 text-red-700 border-red-200",
      photo: "/pothole.jpg",
    },
    {
      rank: 3,
      id: "IS-0090",
      title: "Uncovered sewer manhole chamber",
      meta: "#IS-0090 · merged 14 reports",
      area: "Patnipura Bazaar",
      reports: 14,
      priority: "Critical",
      prioColor: "bg-red-50 text-red-700 border-red-200",
      photo: "/manhole.jpg",
    },
    {
      rank: 4,
      id: "IS-0089",
      title: "Burst water supply main pipeline",
      meta: "#IS-0089 · merged 11 reports",
      area: "Bhawarkua",
      reports: 11,
      priority: "High",
      prioColor: "bg-orange-50 text-orange-700 border-orange-200",
      photo: "/pipeline.jpg",
    },
    {
      rank: 5,
      id: "IS-0087",
      title: "Broken streetlight cluster",
      meta: "#IS-0087 · merged 9 reports",
      area: "Palasia",
      reports: 9,
      priority: "High",
      prioColor: "bg-orange-50 text-orange-700 border-orange-200",
      photo: "/streetlight.jpg",
    },
    {
      rank: 6,
      id: "IS-0081",
      title: "Overflowing drain, waterlogging",
      meta: "#IS-0081 · merged 7 reports",
      area: "Rajwada",
      reports: 7,
      priority: "High",
      prioColor: "bg-amber-50 text-amber-700 border-amber-200",
      photo: "/drain.jpg",
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
            Admin Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Indore Municipal Corporation · Operations console
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-cyan-50 text-cyan-800 border border-cyan-200 rounded-full text-xs font-semibold">
            Demo data — simulated dataset
          </span>
          <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold">
            Ward coverage: 85 zones
          </span>
        </div>
      </div>

      {/* 5-Card Stat Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            TOTAL OPEN REPORTS
          </div>
          <div className="text-2xl font-black text-slate-900 font-display mt-0.5">62</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">▲ 6.2% vs last week</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            CRITICAL SEVERITY
          </div>
          <div className="text-2xl font-black text-red-600 font-display mt-0.5">9</div>
          <div className="text-[11px] text-red-500 font-medium mt-1">▲ 4 new today</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            IN PROGRESS
          </div>
          <div className="text-2xl font-black text-slate-900 font-display mt-0.5">28</div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">— steady 7-day avg</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            FIXED THIS WEEK
          </div>
          <div className="text-2xl font-black text-slate-900 font-display mt-0.5">34</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">▲ 18% vs prior week</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm col-span-2 md:col-span-1">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            AVG. FIX TIME
          </div>
          <div className="text-2xl font-black text-slate-900 font-display mt-0.5">2.4 days</div>
          <div className="text-[11px] text-cyan-600 font-medium mt-1">▼ 0.3 days improved</div>
        </div>
      </div>

      {/* Two Wide Chart Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Open reports by issue type */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-base font-bold text-slate-900 font-display">
              Open reports by issue type
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
              Demo data
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-6">
            Current backlog across the five tracked categories · simulated dataset
          </p>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={issueTypeData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
                <Tooltip />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} fill="#0891b2" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Reports last 7 days */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-base font-bold text-slate-900 font-display">
              Reports · last 7 days
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
              Demo data
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-6">
            Citizen submissions vs. resolved cases per day · simulated dataset
          </p>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="submitted"
                  name="Submitted"
                  stroke="#e86a2c"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="resolved"
                  name="Resolved"
                  stroke="#16a34a"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top 5 Priority Queue Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-display">
              Top 5 priority queue
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Ranked by AI priority score — highest-risk cases first
            </p>
          </div>

          <button
            onClick={() => navigate("/admin/issues")}
            className="text-xs text-cyan-700 font-bold hover:underline flex items-center gap-1"
          >
            <span>View all issues</span>
            <i className="fas fa-arrow-right text-[10px]" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-5 w-12">#</th>
                <th className="py-3 px-5">ISSUE</th>
                <th className="py-3 px-5">AREA</th>
                <th className="py-3 px-5">REPORTS</th>
                <th className="py-3 px-5">PRIORITY</th>
                <th className="py-3 px-5 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {topQueue.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => navigate("/admin/issues")}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                >
                  <td className="py-3.5 px-5 font-bold text-cyan-700">{item.rank}</td>
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.photo}
                        alt=""
                        className="w-9 h-9 rounded-lg object-cover border border-slate-200 flex-shrink-0"
                      />
                      <div>
                        <div className="font-bold text-slate-900">{item.title}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{item.meta}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-5 font-medium text-slate-700">{item.area}</td>
                  <td className="py-3.5 px-5 font-bold text-slate-900">{item.reports}</td>
                  <td className="py-3.5 px-5">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${item.prioColor}`}
                    >
                      {item.priority}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right text-slate-400 hover:text-cyan-700">
                    <i className="fas fa-arrow-right text-xs" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
