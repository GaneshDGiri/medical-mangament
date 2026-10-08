import React, { useState } from "react";
import {
  HeartPulse,
  Activity,
  Bed,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Pill
} from "lucide-react";
import toast from "react-hot-toast";

export default function NurseDashboard() {
  const [patients, setPatients] = useState([
    { bed: "Bed 301-A", name: "Alexander Hayes", age: 42, condition: "Post-Cardiac Angiogram", bp: "124/82", hr: 72, o2: "98%", status: "Stable", medTime: "12:00 PM (Telmisartan 40mg)" },
    { bed: "Bed 301-B", name: "Sophia Martinez", age: 29, condition: "Patellofemoral Rehab", bp: "116/74", hr: 68, o2: "99%", status: "Stable", medTime: "02:00 PM (Celecoxib 100mg)" },
    { bed: "ICU Pod 3", name: "Robert Thorne", age: 67, condition: "Acute Respiratory Weaning", bp: "135/88", hr: 84, o2: "95%", status: "Monitored", medTime: "11:30 AM (IV Infusion)" },
  ]);

  const handleLogVitals = (bed) => {
    toast.success(`Vitals verified and pushed to EHR for ${bed}`);
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-teal-600 dark:text-teal-400 mb-1">
          <span>Inpatient Nursing Station</span>
          <span aria-hidden="true">·</span>
          <span>West Wing & ICU Cluster</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Nurse Clinical Ward Console
        </h1>
      </div>

      {/* Roster Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm overflow-hidden text-xs">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h2 className="font-bold text-sm text-slate-900 dark:text-white">
            Assigned Ward Bed Patients
          </h2>
          <span className="font-mono text-teal-600 text-[11px]">3 Inpatients Monitored</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
              <tr>
                <th className="px-6 py-3">Bed & Room</th>
                <th className="px-6 py-3">Patient Name</th>
                <th className="px-6 py-3">Condition</th>
                <th className="px-6 py-3">Current Vitals</th>
                <th className="px-6 py-3">Medication Schedule</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {patients.map((p, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4 font-bold font-mono text-teal-600 dark:text-teal-400">{p.bed}</td>
                  <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{p.name} ({p.age}y)</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{p.condition}</td>
                  <td className="px-6 py-4 font-mono">
                    <span className="font-bold text-slate-900 dark:text-white">{p.bp}</span>
                    <span className="text-slate-400"> · {p.hr} bpm · {p.o2}</span>
                  </td>
                  <td className="px-6 py-4 text-teal-700 dark:text-teal-300 font-medium">{p.medTime}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleLogVitals(p.bed)}
                      className="px-3 py-1.5 rounded-lg font-semibold bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 hover:bg-teal-100 transition-colors"
                    >
                      Record Vitals
                    </button>
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
