import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
import {
  Calendar,
  Clock,
  User,
  Video,
  FileText,
  Pill,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Stethoscope
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDoctorData() {
      try {
        const res = await api.get("/appointments");
        if (res.data.success) {
          setAppointments(res.data.appointments || []);
        }
      } catch (err) {
        console.error("Failed to load doctor dashboard", err);
      } finally {
        setLoading(false);
      }
    }
    loadDoctorData();
  }, []);

  const patientTrend = [
    { day: "Mon", patients: 8 },
    { day: "Tue", patients: 12 },
    { day: "Wed", patients: 10 },
    { day: "Thu", patients: 14 },
    { day: "Fri", patients: 9 },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-teal-700 to-cyan-700 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-mono tracking-wider text-teal-200">
            Attending Physician Console
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">
            Welcome back, {user?.name || "Dr. Elena Rostova"}
          </h1>
          <p className="text-xs text-teal-100 mt-1">
            Department of Cardiology · Outpatient Clinic Suite 301 · Schedule: 09:00 - 16:30
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/telehealth"
            className="px-4 py-2.5 rounded-xl font-bold text-xs bg-white text-teal-800 hover:bg-teal-50 transition-colors flex items-center gap-2 shadow-sm"
          >
            <Video className="w-4 h-4 text-teal-600" />
            <span>Open Telehealth Room</span>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-1">
          <span className="text-slate-500">Scheduled Consultations</span>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
            {appointments.length} Visits
          </p>
          <p className="text-[11px] text-teal-600 font-medium">3 Telehealth · 2 Clinic</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-1">
          <span className="text-slate-500">Patient Satisfaction Rating</span>
          <p className="text-2xl font-extrabold text-amber-500 font-mono tabular-nums">
            4.95 / 5.0
          </p>
          <p className="text-[11px] text-slate-500">142 verified reviews</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-1">
          <span className="text-slate-500">Pending Lab & CT Reviews</span>
          <p className="text-2xl font-extrabold text-teal-600 font-mono tabular-nums">
            2 Pending
          </p>
          <p className="text-[11px] text-slate-500">Radiology PACS integrated</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-1">
          <span className="text-slate-500">Active Prescriptions</span>
          <p className="text-2xl font-extrabold text-emerald-600 font-mono tabular-nums">
            28 Active
          </p>
          <p className="text-[11px] text-emerald-600 font-medium">No Drug Interactions</p>
        </div>
      </div>

      {/* Main Grid: Consultation Queue & Patient Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Appointments Queue */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Upcoming Patient Consultation Queue
            </h3>
            <Link to="/appointments" className="font-semibold text-teal-600 hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {appointments.map((apt) => (
              <div
                key={apt.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-teal-600 dark:text-teal-400">
                      {apt.timeSlot}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {apt.patientName}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-slate-400">
                      ({apt.type})
                    </span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 mt-1">
                    Symptoms: {apt.symptoms}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    to="/records"
                    className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100"
                  >
                    Clinical Notes
                  </Link>
                  <Link
                    to="/prescriptions"
                    className="px-3 py-1.5 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-700"
                  >
                    E-Prescribe
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Weekly Volume Chart */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            Daily Patient Consult Volume
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={patientTrend}>
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
                <Bar dataKey="patients" fill="#0d9488" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
