import React from "react";
import BackButton from "../components/common/BackButton";
import HospitalVideoPlayer from "../components/common/HospitalVideoPlayer";
import {
  ShieldCheck,
  Award,
  Building2,
  Users,
  HeartHandshake,
  CheckCircle2,
  Activity,
  Stethoscope,
  Video
} from "lucide-react";

export default function AboutPage() {
  const milestones = [
    { year: "2012", title: "Foundation of MediCare Center", desc: "Established with 120 critical care beds and the region's first dedicated pediatric surgical suite." },
    { year: "2017", title: "Joint Commission Gold Seal", desc: "Received international quality accreditation for perioperative safety and infection control." },
    { year: "2021", title: "Robotic Surgical & 3T Imaging Wing", desc: "Commissioned the Siemens 3.0T MAGNETOM MRI and MAKO robotic arthroplasty platforms." },
    { year: "2025", title: "Autonomous Clinical Orchestration", desc: "Integrated real-time resource telemetry, smart bed allocation, and AI hospital assistant guidance." },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-16">
        <div>
          <BackButton fallback="/" label="Back to Home" className="mb-6" />

          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-teal-600 dark:text-teal-400">
              <span>Hospital Heritage & Mission</span>
              <span aria-hidden="true">·</span>
              <span>Est. 2012</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Healing Through Innovation, Guided by Compassion
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              MediCare AI is a tertiary medical facility providing multidisciplinary clinical care across cardiology, neurology, orthopedics, radiology, and trauma medicine.
            </p>
          </div>
        </div>

        {/* Video Tour Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-teal-600 dark:text-teal-400 font-mono">
                <Video className="w-3.5 h-3.5" />
                <span>4K HD CLINICAL TOUR</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                Explore Hospital Infrastructure & Diagnostic Wings
              </h2>
            </div>
            <span className="hidden sm:inline text-xs text-slate-500 font-mono">
              Live Interactive Broadcast
            </span>
          </div>

          <HospitalVideoPlayer autoPlay={false} />
        </div>

        {/* Mission & Vision Cards */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Our Mission</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              To deliver patient-centered, technologically advanced, and clinically validated care with complete transparency, uncompromising patient safety, and genuine empathy.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Our Vision</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              To set the global benchmark for modern smart hospital ecosystems, blending digital telemedicine, AI assisted triage, and robotic surgery for seamless patient outcomes.
            </p>
          </div>
        </div>

        {/* Milestones / History */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Institutional History</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {milestones.map((m) => (
              <div
                key={m.year}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2"
              >
                <span className="font-mono text-sm font-extrabold text-teal-600 dark:text-teal-400">
                  {m.year}
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{m.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications and Accreditations */}
        <div className="p-8 rounded-3xl bg-slate-900 text-white space-y-6">
          <h2 className="text-xl font-bold">Accreditations & Quality Standards</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-slate-300">
            <div className="space-y-1">
              <Award className="w-6 h-6 text-teal-400 mb-2" />
              <p className="font-bold text-white text-sm">JCI Gold Seal</p>
              <p>Joint Commission International Ambulatory & Inpatient Hospital Standard.</p>
            </div>
            <div className="space-y-1">
              <ShieldCheck className="w-6 h-6 text-teal-400 mb-2" />
              <p className="font-bold text-white text-sm">ISO 9001:2026</p>
              <p>Certified clinical quality management and diagnostic precision assurance.</p>
            </div>
            <div className="space-y-1">
              <Activity className="w-6 h-6 text-teal-400 mb-2" />
              <p className="font-bold text-white text-sm">Magnet Nursing Award</p>
              <p>National recognition for outstanding nursing leadership and patient ratio excellence.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
