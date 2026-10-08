import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import ThreeEquipmentViewer from "../components/common/ThreeEquipmentViewer";
import BackButton from "../components/common/BackButton";
import {
  Cpu,
  ShieldAlert,
  Clock,
  User,
  ArrowRight,
  RotateCw,
  CheckCircle2,
  AlertTriangle,
  Layers
} from "lucide-react";

export default function EquipmentExplorerPage() {
  const [equipmentList, setEquipmentList] = useState([]);
  const [selectedEq, setSelectedEq] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEquipment() {
      try {
        const res = await api.get("/equipment");
        if (res.data.success) {
          setEquipmentList(res.data.equipment || []);
          if (res.data.equipment.length > 0) {
            setSelectedEq(res.data.equipment[0]);
          }
        }
      } catch (err) {
        console.error("Failed to load equipment", err);
      } finally {
        setLoading(false);
      }
    }
    loadEquipment();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <BackButton fallback="/" label="Back to Overview" className="mb-4" />
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-teal-600 dark:text-teal-400 mb-2">
            <span>High-Tech Diagnostics</span>
            <span aria-hidden="true">·</span>
            <span>Interactive 3D WebGL Visualization</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Medical Equipment Explorer
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Inspect virtual 3D models of our clinical machinery, review patient preparation protocols, and understand diagnostic mechanisms.
          </p>
        </div>

        {loading ? (
          <div className="py-20 text-center text-xs text-slate-500 animate-pulse">
            Loading 3D medical equipment catalog...
          </div>
        ) : (
          <div className="space-y-8">
            {/* Horizontal Equipment Selector */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {equipmentList.map((item) => {
                const isSelected = selectedEq?.id === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedEq(item)}
                    className={`p-3.5 rounded-2xl border text-left transition-all space-y-1 ${
                      isSelected
                        ? "bg-white dark:bg-slate-900 border-teal-500 shadow-md ring-1 ring-teal-500"
                        : "bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900"
                    }`}
                  >
                    <span className="font-mono text-[10px] uppercase font-bold text-teal-600 dark:text-teal-400">
                      {item.type}
                    </span>
                    <p className="font-bold text-xs text-slate-900 dark:text-white truncate">
                      {item.name}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {item.department}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Main Stage: 3D Canvas + Clinical Dossier */}
            {selectedEq && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left 3D Viewport */}
                <div className="lg:col-span-7 space-y-4">
                  <ThreeEquipmentViewer
                    modelType={selectedEq.threeModelType || selectedEq.type}
                    equipmentName={selectedEq.name}
                  />

                  {/* Quick specs pill bar */}
                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-slate-500 text-[11px]">Serial ID</span>
                      <p className="font-mono font-bold text-slate-900 dark:text-white">{selectedEq.serialNumber}</p>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px]">Operational Status</span>
                      <p className="font-semibold text-emerald-600 capitalize">{selectedEq.status.replace("_", " ")}</p>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px]">Physical Location</span>
                      <p className="font-medium text-slate-900 dark:text-white truncate">{selectedEq.location}</p>
                    </div>
                  </div>
                </div>

                {/* Right Clinical Dossier */}
                <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-6 text-xs">
                  <div>
                    <span className="font-mono text-xs font-bold text-teal-600 dark:text-teal-400">
                      {selectedEq.category}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                      {selectedEq.name}
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                      {selectedEq.description}
                    </p>
                  </div>

                  {/* Clinical Purpose */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                    <h3 className="font-bold text-slate-900 dark:text-white text-xs">
                      Clinical Purpose & Indication
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                      {selectedEq.purpose}
                    </p>
                  </div>

                  {/* Patient Preparation Protocol */}
                  <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Patient Preparation Protocol</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-700 dark:text-slate-300">
                      {selectedEq.patientPreparation}
                    </p>
                  </div>

                  {/* Lead specialist */}
                  <div className="flex items-center justify-between text-xs py-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">Lead Department Specialist</span>
                    <span className="font-bold text-slate-900 dark:text-white">{selectedEq.leadPhysician}</span>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                    <Link
                      to="/appointments"
                      className="w-full sm:flex-1 py-3 text-center rounded-xl font-bold text-xs bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-2"
                    >
                      <span>Book Diagnostic Scan</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    <Link
                      to={`/navigation?dest=nav-${selectedEq.type}`}
                      className="w-full sm:flex-1 py-3 text-center rounded-xl font-semibold text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <span>Locate on Map</span>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
