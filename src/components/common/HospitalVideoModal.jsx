import React from "react";
import { X, Video, Sparkles } from "lucide-react";
import HospitalVideoPlayer from "./HospitalVideoPlayer";

export default function HospitalVideoModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Header */}
        <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-sm">MediCare AI Smart Hospital 4K Video Tour</h2>
              <p className="text-[11px] text-slate-400 font-mono">
                Multidisciplinary Surgical Suites · Siemens 3T MRI · Resuscitation Telemetry
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Close Video Tour"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player Body */}
        <div className="p-4 overflow-y-auto flex-1">
          <HospitalVideoPlayer autoPlay={true} />
        </div>
      </div>
    </div>
  );
}
