import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import BackButton from "../components/common/BackButton";
import {
  HeartPulse,
  Brain,
  Bone,
  Scan,
  Baby,
  Stethoscope,
  Siren,
  Activity,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDept, setSelectedDept] = useState(null);

  useEffect(() => {
    async function loadDepts() {
      try {
        const res = await api.get("/departments");
        if (res.data.success) {
          setDepartments(res.data.departments || []);
          if (res.data.departments.length > 0) {
            setSelectedDept(res.data.departments[0]);
          }
        }
      } catch (err) {
        console.error("Failed to load departments", err);
      } finally {
        setLoading(false);
      }
    }
    loadDepts();
  }, []);

  const getDeptIcon = (code) => {
    switch (code) {
      case "CARD": return HeartPulse;
      case "NEUR": return Brain;
      case "ORTH": return Bone;
      case "RAD": return Scan;
      case "PED": return Baby;
      case "ER": return Siren;
      case "ICU": return Activity;
      default: return Stethoscope;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <BackButton fallback="/" label="Back to Overview" className="mb-4" />
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-teal-600 dark:text-teal-400 mb-2">
            <span>Hospital Infrastructure</span>
            <span aria-hidden="true">·</span>
            <span>Multidisciplinary Centers</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Clinical Departments
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Explore dedicated specialized centers with advanced equipment, 24/7 coverage, and certified medical leadership.
          </p>
        </div>

        {loading ? (
          <div className="py-20 text-center text-xs text-slate-500 animate-pulse">
            Loading hospital departments...
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Department List / Selector */}
            <div className="lg:col-span-5 space-y-3">
              {departments.map((dept) => {
                const IconComponent = getDeptIcon(dept.code);
                const isSelected = selectedDept?.id === dept.id;
                return (
                  <button
                    key={dept.id}
                    onClick={() => setSelectedDept(dept)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between group ${
                      isSelected
                        ? "bg-white dark:bg-slate-900 border-teal-500 shadow-md ring-1 ring-teal-500"
                        : "bg-white/60 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800/80 hover:bg-white dark:hover:bg-slate-900"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                          isSelected
                            ? "bg-teal-600 text-white"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:text-teal-600"
                        }`}
                      >
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                          {dept.name}
                        </h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {dept.floor}
                        </p>
                      </div>
                    </div>
                    <ArrowRight
                      className={`w-4 h-4 transition-transform ${
                        isSelected ? "text-teal-600 translate-x-1" : "text-slate-300"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Right: Selected Department Detail Panel */}
            {selectedDept && (
              <div className="lg:col-span-7 p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-6">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <span className="font-mono text-xs font-bold text-teal-600 dark:text-teal-400">
                      Code: {selectedDept.code}
                    </span>
                    <span className="text-xs text-slate-500">{selectedDept.floor}</span>
                  </div>
                  <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-3">
                    {selectedDept.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                    {selectedDept.description}
                  </p>
                </div>

                {/* Key Personnel & Hours */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <p className="text-slate-500 dark:text-slate-400">Department Head</p>
                    <p className="font-bold text-slate-900 dark:text-white mt-0.5">{selectedDept.headDoctorName}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <p className="text-slate-500 dark:text-slate-400">Operational Hours</p>
                    <p className="font-bold text-slate-900 dark:text-white mt-0.5">{selectedDept.workingHours}</p>
                  </div>
                </div>

                {/* Services list */}
                {selectedDept.services && selectedDept.services.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                      Key Clinical Services
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {selectedDept.services.map((svc, i) => (
                        <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                          <span>{svc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Equipment roster */}
                {selectedDept.equipment && selectedDept.equipment.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                      Diagnostic & Surgical Equipment
                    </h3>
                    <div className="flex flex-wrap gap-2 text-xs">
                      {selectedDept.equipment.map((eq, i) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800/60"
                        >
                          {eq}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Direct CTA */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3">
                  <Link
                    to={`/appointments?dept=${selectedDept.id}`}
                    className="px-6 py-3 rounded-xl font-bold text-xs bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/20 transition-all flex items-center gap-2"
                  >
                    <span>Book in {selectedDept.name}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    to="/navigation"
                    className="px-5 py-3 rounded-xl font-semibold text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    View on Hospital Map
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
