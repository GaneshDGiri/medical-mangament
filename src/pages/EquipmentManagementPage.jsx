import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import BackButton from "../components/common/BackButton";
import {
  Cpu,
  CheckCircle,
  AlertTriangle,
  Wrench,
  Clock,
  MapPin,
  RefreshCw,
  Power
} from "lucide-react";
import toast from "react-hot-toast";

export default function EquipmentManagementPage() {
  const [equipmentList, setEquipmentList] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadEquipment = async () => {
    try {
      const res = await api.get("/equipment");
      if (res.data.success) {
        setEquipmentList(res.data.equipment || []);
      }
    } catch (err) {
      console.error("Failed to load equipment", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEquipment();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await api.put(`/equipment/${id}`, { status: newStatus });
      if (res.data.success) {
        toast.success(`Equipment status updated to ${newStatus}`);
        setEquipmentList((prev) =>
          prev.map((eq) => (eq.id === id ? { ...eq, status: newStatus } : eq))
        );
      }
    } catch (err) {
      toast.error("Status update failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <BackButton fallback="/dashboard" label="Back to Dashboard" className="mb-4" />
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-teal-600 dark:text-teal-400 mb-1">
            <span>Biomedical Engineering</span>
            <span aria-hidden="true">·</span>
            <span>Asset Maintenance & Telemetry</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Hospital Equipment Fleet Management
          </h1>
        </div>

        {/* Fleet Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-slate-500">Total Machinery Fleet</span>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono mt-1">
              {equipmentList.length} Units
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-slate-500">Operational / Calibrated</span>
            <p className="text-2xl font-extrabold text-emerald-600 font-mono mt-1">
              {equipmentList.filter((e) => e.status === "operational").length} Units
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-slate-500">In Active Procedure</span>
            <p className="text-2xl font-extrabold text-teal-600 font-mono mt-1">
              {equipmentList.filter((e) => e.status === "in_use").length} Units
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-slate-500">Scheduled Calibration</span>
            <p className="text-2xl font-extrabold text-amber-500 font-mono mt-1">
              {equipmentList.filter((e) => e.status === "maintenance").length} Units
            </p>
          </div>
        </div>

        {/* Machinery Table */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm overflow-hidden text-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold text-[10px] uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3">Machine & Model</th>
                  <th className="px-6 py-3">Department</th>
                  <th className="px-6 py-3">Location Suite</th>
                  <th className="px-6 py-3">Maintenance Due</th>
                  <th className="px-6 py-3">Current Status</th>
                  <th className="px-6 py-3 text-right">Operational Toggle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {equipmentList.map((eq) => (
                  <tr key={eq.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900 dark:text-white">{eq.name}</p>
                      <p className="font-mono text-[11px] text-slate-400">{eq.serialNumber}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{eq.department}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{eq.location}</td>
                    <td className="px-6 py-4 font-mono text-slate-500">{eq.maintenanceDue}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`capitalize font-semibold px-2 py-0.5 rounded text-[10px] ${
                          eq.status === "operational"
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                            : eq.status === "in_use"
                            ? "bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300"
                            : "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                        }`}
                      >
                        {eq.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <select
                        value={eq.status}
                        onChange={(e) => handleStatusChange(eq.id, e.target.value)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-[11px] text-slate-800 dark:text-slate-200"
                      >
                        <option value="operational">Operational</option>
                        <option value="in_use">In Use</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="out_of_service">Out of Service</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
