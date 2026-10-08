import React, { useState } from "react";
import {
  AlertTriangle,
  PhoneCall,
  Ambulance,
  MapPin,
  Clock,
  ShieldAlert,
  X,
  CheckCircle2,
  Stethoscope
} from "lucide-react";
import toast from "react-hot-toast";

export default function EmergencyModal({ isOpen, onClose }) {
  const [dispatchRequested, setDispatchRequested] = useState(false);
  const [patientLocation, setPatientLocation] = useState("");

  if (!isOpen) return null;

  const handleRequestAmbulance = (e) => {
    e.preventDefault();
    if (!patientLocation.trim()) {
      toast.error("Please enter current street address or landmark");
      return;
    }
    setDispatchRequested(true);
    toast.success("Rapid Ambulance Unit DISPATCHED · ETA 6-8 minutes");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 border-2 border-rose-500 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Banner */}
        <div className="bg-rose-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center animate-pulse">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-base font-extrabold uppercase tracking-wide">
                Emergency & Trauma Center
              </h2>
              <p className="text-xs text-rose-100">Level 1 Rapid Resuscitation Service · 24/7/365</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs text-slate-700 dark:text-slate-300">
          {/* Urgent Phone Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href="tel:911"
              className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex items-center gap-3 hover:bg-rose-100 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-md">
                <PhoneCall className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-rose-600 dark:text-rose-400">Critical Life Threat</p>
                <p className="text-lg font-extrabold text-rose-700 dark:text-rose-300">Dial 911</p>
              </div>
            </a>

            <a
              href="tel:+18005559911"
              className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-3 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-teal-600 text-white flex items-center justify-center shrink-0">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-500">Hospital ER Desk</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">1-800-555-9911</p>
              </div>
            </a>
          </div>

          {/* Rapid Physical Location */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start gap-3">
            <MapPin className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-bold text-slate-900 dark:text-white text-xs">Direct Emergency Entrance</p>
              <p className="text-slate-600 dark:text-slate-400">
                Ground Floor, East Campus Ramp (Under the Red Canopy).
              </p>
              <p className="text-[11px] text-teal-600 dark:text-teal-400 font-medium">
                Free 24/7 emergency valet & immediate nurse triage bay upon arrival.
              </p>
            </div>
          </div>

          {/* Ambulance Dispatch Simulation */}
          <div className="border border-slate-200 dark:border-slate-700 rounded-2xl p-4 bg-white dark:bg-slate-900">
            <h3 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Ambulance className="w-4 h-4 text-rose-600" />
              <span>Rapid Ambulance Dispatch</span>
            </h3>

            {!dispatchRequested ? (
              <form onSubmit={handleRequestAmbulance} className="space-y-3">
                <input
                  type="text"
                  value={patientLocation}
                  onChange={(e) => setPatientLocation(e.target.value)}
                  placeholder="Enter current location / address (e.g., 450 Medical Way, Apt 3B)"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-900 dark:text-white"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl font-bold text-xs bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <Ambulance className="w-4 h-4" />
                  Dispatch Hospital Intensive Care Unit
                </button>
              </form>
            ) : (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 space-y-1">
                <div className="flex items-center gap-2 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Ambulance Unit #4 En Route</span>
                </div>
                <p className="text-[11px]">
                  Estimated arrival to <span className="font-semibold">{patientLocation}</span>:{" "}
                  <span className="font-bold font-mono">6 minutes</span>. Paramedics equipped with Mobile ECG & Trauma Kits.
                </p>
              </div>
            )}
          </div>

          {/* Safety First Advice */}
          <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl text-[11px] text-amber-900 dark:text-amber-200 space-y-1">
            <p className="font-bold">While Help is En Route:</p>
            <ul className="list-disc list-inside space-y-0.5 text-slate-600 dark:text-slate-400">
              <li>Keep patient calm, sitting or slightly reclined.</li>
              <li>Loosen tight clothing around neck and chest.</li>
              <li>Do not administer food or drinks if surgery might be required.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
