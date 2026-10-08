import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  UserCheck,
  Calendar,
  Clock,
  Search,
  CheckCircle2,
  XCircle,
  Plus
} from "lucide-react";
import toast from "react-hot-toast";

export default function ReceptionistDashboard() {
  const [queue, setQueue] = useState([
    { token: "T-101", patient: "Alexander Hayes", doctor: "Dr. Elena Rostova", dept: "Cardiology", time: "10:30 AM", status: "Checked In" },
    { token: "T-102", patient: "Sophia Martinez", doctor: "Dr. Sarah Jenkins", dept: "Orthopedics", time: "11:15 AM", status: "Waiting in Lobby" },
    { token: "T-103", patient: "Liam Chen", doctor: "Dr. Marcus Vance", dept: "Neurology", time: "11:45 AM", status: "Scheduled" },
  ]);

  const handleStatusToggle = (token) => {
    setQueue((prev) =>
      prev.map((q) =>
        q.token === token
          ? { ...q, status: q.status === "Checked In" ? "Sent to Doctor" : "Checked In" }
          : q
      )
    );
    toast.success(`Updated status for queue token ${token}`);
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-teal-600 dark:text-teal-400 mb-1">
          <span>Central Admissions & Check-In</span>
          <span aria-hidden="true">·</span>
          <span>Main Atrium Desk</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Receptionist Patient Queue & Admissions
        </h1>
      </div>

      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm overflow-hidden text-xs">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h2 className="font-bold text-sm text-slate-900 dark:text-white">
            Today's Outpatient Waiting Queue
          </h2>
          <Link
            to="/appointments"
            className="px-3.5 py-1.5 rounded-xl font-bold bg-teal-600 text-white flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Admit / Schedule Walk-In</span>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
              <tr>
                <th className="px-6 py-3">Token #</th>
                <th className="px-6 py-3">Patient Name</th>
                <th className="px-6 py-3">Physician</th>
                <th className="px-6 py-3">Department</th>
                <th className="px-6 py-3">Scheduled Slot</th>
                <th className="px-6 py-3">Current Status</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {queue.map((q) => (
                <tr key={q.token} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-teal-600 dark:text-teal-400">{q.token}</td>
                  <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{q.patient}</td>
                  <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{q.doctor}</td>
                  <td className="px-6 py-4 text-slate-500">{q.dept}</td>
                  <td className="px-6 py-4 font-mono text-slate-500">{q.time}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`font-semibold px-2 py-0.5 rounded text-[10px] ${
                        q.status === "Sent to Doctor"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                          : q.status === "Checked In"
                          ? "bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300"
                          : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                      }`}
                    >
                      {q.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleStatusToggle(q.token)}
                      className="px-3 py-1.5 rounded-lg font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 transition-colors"
                    >
                      Update Stage
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
