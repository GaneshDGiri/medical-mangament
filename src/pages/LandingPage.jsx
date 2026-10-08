import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import HospitalVideoPlayer from "../components/common/HospitalVideoPlayer";
import {
  Activity,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Sparkles,
  HeartPulse,
  Stethoscope,
  Cpu,
  MapPin,
  Clock,
  PhoneCall,
  Star,
  CheckCircle,
  Video,
  Play
} from "lucide-react";

export default function LandingPage({ onOpenEmergency, onOpenVideo }) {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [docsRes, deptsRes] = await Promise.all([
          api.get("/doctors"),
          api.get("/departments"),
        ]);
        setDoctors((docsRes.data.doctors || []).slice(0, 3));
        setDepartments((deptsRes.data.departments || []).slice(0, 6));
      } catch (err) {
        console.error("Failed to load landing data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-teal-100 selection:text-teal-900">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32 border-b border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-b from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-950">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-teal-500/10 dark:bg-teal-500/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Value Prop */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-teal-700 dark:text-teal-300">
                <span>Joint Commission International (JCI) Accredited</span>
                <span aria-hidden="true">·</span>
                <span>Level 1 Trauma Center</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1] text-balance">
                Precision Medicine Powered by Clinical Intelligence
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                MediCare AI merges board-certified specialist clinical care, real-time hospital resource orchestration, interactive 3D diagnostic suites, and AI-assisted patient navigation.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  to="/appointments"
                  className="px-6 py-3.5 rounded-xl font-bold text-sm bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-600/25 transition-all flex items-center gap-2 hover:-translate-y-0.5"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Appointment</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/equipment"
                  className="px-6 py-3.5 rounded-xl font-bold text-sm bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition-all flex items-center gap-2"
                >
                  <Cpu className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span>Explore 3D Equipment</span>
                </Link>

                <button
                  type="button"
                  onClick={onOpenVideo}
                  className="px-5 py-3.5 rounded-xl font-semibold text-sm bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 transition-colors flex items-center gap-1.5"
                >
                  <Play className="w-4 h-4 fill-teal-600 dark:fill-teal-400 text-teal-600 dark:text-teal-400" />
                  <span>Watch 4K Video Tour</span>
                </button>

                <Link
                  to="/navigation"
                  className="px-5 py-3.5 rounded-xl font-semibold text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>Hospital Map</span>
                </Link>
              </div>

              {/* Zero-Pill Metric Discipline */}
              <div className="pt-6 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">99.8%</div>
                  <div className="text-slate-500 dark:text-slate-400">Clinical Safety Score</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">15+</div>
                  <div className="text-slate-500 dark:text-slate-400">Robotic Theaters</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">24/7</div>
                  <div className="text-slate-500 dark:text-slate-400">Emergency & Trauma</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">48k+</div>
                  <div className="text-slate-500 dark:text-slate-400">Annual Consultations</div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Diagnostic Spotlight Card */}
            <div className="lg:col-span-5">
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-200">
                      Live Hospital Operations
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">Status: Nominal</span>
                </div>

                {/* Live stats feed */}
                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Critical Care ICU Occupancy</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">10 / 14 Beds (71%)</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Average ER Triage Wait Time</span>
                    <span className="font-mono font-bold text-teal-600 dark:text-teal-400">4.2 Minutes</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Radiology (3T MRI & CT)</span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">Online · Calibrated</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Telemedicine Consultation Rooms</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">6 Encrypted Links Active</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    to="/telehealth"
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-teal-50 dark:bg-teal-950/50 hover:bg-teal-100 dark:hover:bg-teal-900/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 flex items-center justify-center gap-2 transition-colors"
                  >
                    <Video className="w-4 h-4" />
                    <span>Launch Virtual Telehealth Room</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Hospital Video Visualization & 4K Tour Section */}
      <section id="video-tour" className="py-20 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 text-xs font-semibold font-mono text-teal-400 uppercase tracking-wider">
              <span>Interactive Clinical Video Showcase</span>
              <span aria-hidden="true">·</span>
              <span>4K Visualization</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Experience the Future of Smart Healthcare
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Take an interactive virtual video walkthrough of our robotic surgery theaters, Siemens 3T MRI imaging suite, and patient telemetry care network.
            </p>
          </div>

          <HospitalVideoPlayer autoPlay={false} />
        </div>
      </section>

      {/* 3. Departments Grid */}
      <section className="py-20 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider mb-2">
                Centers of Excellence
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Specialized Medical Departments
              </h2>
            </div>
            <Link
              to="/departments"
              className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 shrink-0"
            >
              <span>View all 8 departments</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept) => (
              <div
                key={dept.id}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-teal-500/50 dark:hover:border-teal-500/50 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-teal-600 dark:text-teal-400">
                      {dept.code}
                    </span>
                    <span className="text-xs text-slate-400">{dept.floor}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {dept.name}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {dept.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Head: {dept.headDoctorName}</span>
                  <Link
                    to={`/appointments?dept=${dept.id}`}
                    className="font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 flex items-center gap-1"
                  >
                    <span>Book</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Featured Doctors */}
      <section className="py-20 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-100/50 dark:bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider mb-2">
                Distinguished Faculty
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Meet Our Board-Certified Specialists
              </h2>
            </div>
            <Link
              to="/doctors"
              className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 shrink-0"
            >
              <span>Explore all physicians</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {doctors.map((doc) => (
              <div
                key={doc.id}
                className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 overflow-hidden shadow-sm flex flex-col justify-between"
              >
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={doc.avatar}
                      alt={doc.name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                    />
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                        {doc.name}
                      </h3>
                      <p className="text-xs text-teal-600 dark:text-teal-400 font-medium">
                        {doc.specialization}
                      </p>
                      <div className="flex items-center gap-1 text-[11px] text-amber-500 mt-1">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">{doc.rating}</span>
                        <span className="text-slate-400">({doc.reviewCount} reviews)</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {doc.bio}
                  </p>

                  <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <span>{doc.experience} Years Exp</span>
                    <span aria-hidden="true">·</span>
                    <span>Fee: ${doc.fee}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">Available</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                  <Link
                    to={`/doctors/${doc.id}`}
                    className="flex-1 py-2 text-center rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    View Profile
                  </Link>
                  <Link
                    to={`/appointments?doc=${doc.id}`}
                    className="flex-1 py-2 text-center rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white transition-colors"
                  >
                    Book Visit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Equipment Teaser with 3D link */}
      <section className="py-20 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl z-10">
              <span className="text-xs font-semibold font-mono text-teal-400 uppercase tracking-wider">
                Virtual Diagnostic Exploration
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Inspect Advanced 3D Medical Equipment
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Interact with high-fidelity 3D models of our Siemens 3.0T MRI, Somatom Dual-Source CT, and Hamilton ICU Ventilators. Review preparation guidelines, safety protocols, and operational workflows.
              </p>
              <div className="pt-2">
                <Link
                  to="/equipment"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-colors"
                >
                  <Cpu className="w-4 h-4" />
                  <span>Launch 3D Equipment Explorer</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="z-10 p-4 bg-slate-800/80 border border-slate-700 rounded-2xl text-xs space-y-2 max-w-sm w-full">
              <div className="flex items-center justify-between text-slate-400">
                <span>Featured Unit</span>
                <span className="text-teal-400 font-mono">3D WebGL</span>
              </div>
              <p className="font-bold text-sm text-white">Siemens MAGNETOM 3T MRI</p>
              <p className="text-slate-300 text-[11px]">
                Sub-millimeter cranial and musculoskeletal volumetric imaging without radiation exposure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Emergency Bar */}
      <section className="py-12 bg-rose-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl font-extrabold uppercase tracking-wide">
              Immediate Emergency or Acute Trauma?
            </h3>
            <p className="text-xs text-rose-100">
              Ground Floor East Ramp · 24/7 Monitored Resuscitation · Free Valet Triage
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="tel:911"
              className="px-6 py-3 rounded-xl bg-white text-rose-700 font-extrabold text-xs shadow-lg hover:bg-rose-50 transition-colors flex items-center gap-2"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Dial 911</span>
            </a>
            <button
              onClick={onOpenEmergency}
              className="px-6 py-3 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs border border-rose-400 transition-colors"
            >
              Open ER Dispatch Portal
            </button>
          </div>
        </div>
      </section>

      {/* 6. Footer */}
      <footer className="py-12 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-teal-600" />
            <span className="font-bold text-slate-900 dark:text-white">MediCare AI</span>
            <span>· Smart Hospital Management System</span>
          </div>
          <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400">
            <Link to="/about" className="hover:underline">About</Link>
            <Link to="/doctors" className="hover:underline">Physicians</Link>
            <Link to="/departments" className="hover:underline">Departments</Link>
            <Link to="/equipment" className="hover:underline">3D Tech</Link>
            <Link to="/navigation" className="hover:underline">Navigation</Link>
          </div>
          <div>© 2026 MediCare AI Health Systems. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
