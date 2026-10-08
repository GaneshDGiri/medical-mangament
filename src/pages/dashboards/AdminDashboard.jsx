import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import {
  Users,
  Calendar,
  Activity,
  DollarSign,
  TrendingUp,
  Cpu,
  Bed,
  Siren,
  ShieldCheck
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from "recharts";

const COLORS = ["#0d9488", "#0284c7", "#6366f1", "#f59e0b", "#ec4899"];

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const res = await api.get("/hospital/analytics");
        if (res.data.success) {
          setAnalytics(res.data.analytics);
        }
      } catch (err) {
        console.error("Failed to load analytics", err);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  if (loading || !analytics) {
    return (
      <div className="py-20 text-center text-xs text-slate-500 animate-pulse">
        Calculating executive hospital analytics...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-teal-600 dark:text-teal-400 mb-1">
          <span>Executive Administration Console</span>
          <span aria-hidden="true">·</span>
          <span>Hospital Operations</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Hospital Analytics & Governance
        </h1>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-1">
          <span className="text-slate-500">Active Patient Roster</span>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
            {analytics.totalPatients} Patients
          </p>
          <p className="text-[11px] text-teal-600 font-medium">↑ 12% vs last month</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-1">
          <span className="text-slate-500">Board-Certified Physicians</span>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
            {analytics.totalDoctors} Specialists
          </p>
          <p className="text-[11px] text-emerald-600 font-medium">100% Shift Coverage</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-1">
          <span className="text-slate-500">Bed Occupancy Rate</span>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
            {analytics.occupancyRate}
          </p>
          <p className="text-[11px] text-slate-500">{analytics.availableBeds} Critical Beds Open</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-1">
          <span className="text-slate-500">Emergency Traumas Today</span>
          <p className="text-2xl font-extrabold text-rose-600 font-mono tabular-nums">
            {analytics.emergencyCasesToday} Cases
          </p>
          <p className="text-[11px] text-rose-500 font-medium">Average Triage: 4.2m</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Trend Area Chart */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Weekly Consultation Throughput & Completion
            </h3>
            <span className="text-xs text-slate-400 font-mono">Oct 2026</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.weeklyAppointments}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "1px solid #1e293b",
                    borderRadius: "12px",
                    color: "#fff",
                    fontSize: "11px"
                  }}
                />
                <Area type="monotone" dataKey="count" stroke="#0d9488" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCount)" name="Booked" />
                <Area type="monotone" dataKey="completed" stroke="#0284c7" strokeWidth={2} strokeDasharray="4 4" fill="none" name="Completed" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Revenue Breakdown */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            Department Revenue Volume
          </h3>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.departmentDistribution} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis type="number" stroke="#94a3b8" fontSize={10} tickFormatter={(v) => `$${v/1000}k`} />
                <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={11} width={80} />
                <Tooltip
                  formatter={(val) => [`$${val.toLocaleString()}`, "Revenue"]}
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "1px solid #1e293b",
                    borderRadius: "12px",
                    color: "#fff",
                    fontSize: "11px"
                  }}
                />
                <Bar dataKey="revenue" fill="#0d9488" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
