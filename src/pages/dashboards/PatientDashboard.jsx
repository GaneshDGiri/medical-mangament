import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
import {
  Calendar,
  Clock,
  HeartPulse,
  Pill,
  Video,
  FileText,
  MapPin,
  ArrowRight,
  ShieldAlert,
  Activity,
  CheckCircle2
} from "lucide-react";

export default function PatientDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPatientData() {
      try {
        const [aptRes, rxRes] = await Promise.all([
          api.get("/appointments"),
          api.get("/prescriptions"),
        ]);
        setAppointments(aptRes.data.appointments || []);
        setPrescriptions(rxRes.data.prescriptions || []);
      } catch (err) {
        console.error("Failed to load patient portal", err);
      } finally {
        setLoading(false);
      }
    }
    loadPatientData();
  }, []);

  const nextAppointment = appointments[0];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-teal-700 to-cyan-700 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-mono tracking-wider text-teal-200">
            Encrypted Patient Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">
            Hello, {user?.name || "Alexander"}
          </h1>
          <p className="text-xs text-teal-100 mt-1">
            Record ID: MED-PAT-9021 · Blood Group: O+ · Primary Care: Dr. Elena Rostova
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/appointments"
            className="px-5 py-3 rounded-xl font-bold text-xs bg-white text-teal-900 hover:bg-teal-50 transition-colors shadow-md flex items-center gap-2"
          >
            <Calendar className="w-4 h-4 text-teal-600" />
            <span>Schedule New Visit</span>
          </Link>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <Link
          to="/appointments"
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-teal-500 shadow-sm transition-all flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-slate-900 dark:text-white">Book Clinic</p>
            <p className="text-[11px] text-slate-400">Doctor slots</p>
          </div>
        </Link>

        <Link
          to="/telehealth"
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-teal-500 shadow-sm transition-all flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-slate-900 dark:text-white">Join Meeting</p>
            <p className="text-[11px] text-slate-400">Video room</p>
          </div>
        </Link>

        <Link
          to="/records"
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-teal-500 shadow-sm transition-all flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-slate-900 dark:text-white">Health Records</p>
            <p className="text-[11px] text-slate-400">EHR history</p>
          </div>
        </Link>

        <Link
          to="/navigation"
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-teal-500 shadow-sm transition-all flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-slate-900 dark:text-white">Hospital Map</p>
            <p className="text-[11px] text-slate-400">Wayfinding</p>
          </div>
        </Link>
      </div>

      {/* Main Grid: Next Appointment & Vitals Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Next Appointment Card */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-5 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="font-bold text-xs uppercase text-teal-600 dark:text-teal-400 tracking-wider">
              Upcoming Medical Consultation
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </div>

          {nextAppointment ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {nextAppointment.doctorName}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {nextAppointment.departmentName} · Status: <span className="font-semibold text-emerald-600 capitalize">{nextAppointment.status}</span>
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-sm font-bold text-teal-600 dark:text-teal-400">
                    {nextAppointment.date}
                  </span>
                  <p className="text-xs text-slate-500">{nextAppointment.timeSlot}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Appointment Focus</span>
                <p className="text-slate-600 dark:text-slate-400">{nextAppointment.symptoms}</p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                {nextAppointment.type === "video" ? (
                  <Link
                    to="/telehealth"
                    className="px-5 py-2.5 rounded-xl font-bold bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-2"
                  >
                    <Video className="w-4 h-4" />
                    <span>Join Video Call</span>
                  </Link>
                ) : (
                  <Link
                    to="/navigation"
                    className="px-5 py-2.5 rounded-xl font-bold bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-2"
                  >
                    <MapPin className="w-4 h-4" />
                    <span>Get Route Directions</span>
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-slate-400">
              No upcoming appointments. Schedule your preventive visit today.
            </div>
          )}
        </div>

        {/* Right Vitals Card */}
        <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="font-bold text-xs uppercase text-slate-700 dark:text-slate-200">
              Personal Vitals Telemetry
            </span>
            <Activity className="w-4 h-4 text-teal-600" />
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
              <div>
                <p className="text-slate-500">Blood Pressure</p>
                <p className="font-mono text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                  124 / 82 <span className="text-[11px] font-normal text-slate-400">mmHg</span>
                </p>
              </div>
              <span className="text-emerald-600 font-semibold text-[11px]">Optimal</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
              <div>
                <p className="text-slate-500">Resting Heart Rate</p>
                <p className="font-mono text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                  72 <span className="text-[11px] font-normal text-slate-400">bpm</span>
                </p>
              </div>
              <span className="text-emerald-600 font-semibold text-[11px]">Normal Sinus</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
              <div>
                <p className="text-slate-500">Oxygen Saturation</p>
                <p className="font-mono text-base font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  98%
                </p>
              </div>
              <span className="text-emerald-600 font-semibold text-[11px]">Normal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
