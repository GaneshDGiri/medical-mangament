import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { api } from "../services/api";
import BackButton from "../components/common/BackButton";
import {
  MapPin,
  Navigation,
  Building2,
  Clock,
  ArrowRight,
  CheckCircle2,
  Layers,
  Search,
  Compass,
  Footprints,
  Info
} from "lucide-react";

const FLOORS = [
  { id: "ground", name: "Ground Floor", desc: "Main Entrance, Admissions, Emergency Bay, Pharmacy, General Medicine, Cafeteria" },
  { id: "floor-1", name: "1st Floor (Basement Wing A)", desc: "Radiology & Imaging Sciences, Siemens 3T MRI, CT Suite, Ultrasound" },
  { id: "floor-2", name: "2nd Floor", desc: "Orthopedics & Joint Clinic, Pediatrics & Neonatology, Rehabilitation Gym" },
  { id: "floor-3", name: "3rd Floor", desc: "Cardiology Suite, Cardiac Catheterization Lab, Intensive Care Unit (ICU Pods 1-12)" },
  { id: "floor-4", name: "4th Floor", desc: "Neurology & Neurosurgery, Digital Video EEG, Intraoperative Neuromonitoring" },
];

const HOSPITAL_HOTSPOTS = [
  { id: "mri", name: "Siemens 3T MRI Suite 101", floorId: "floor-1", floorName: "1st Floor", category: "Radiology", icon: "Scan", room: "Suite 101", status: "Operational", desc: "Volumetric high-resolution neurological and joint imaging without ionizing radiation." },
  { id: "ct", name: "Somatom 256-Slice CT Scanner", floorId: "floor-1", floorName: "1st Floor", category: "Radiology", icon: "Scan", room: "Suite 102", status: "Operational", desc: "Dual-source rapid whole-body angiogram and cardiac calcium scoring." },
  { id: "er", name: "Emergency & Trauma Center", floorId: "ground", floorName: "Ground Floor", category: "Emergency", icon: "Siren", room: "Triage Bay 1-4", status: "24/7 Active", desc: "Immediate life-saving resuscitation, acute stroke, and cardiac stabilization." },
  { id: "cardio", name: "Cardiology Outpatient & Echo", floorId: "floor-3", floorName: "3rd Floor", category: "Cardiology", icon: "HeartPulse", room: "Rooms 301-302", status: "Open 08:00 - 18:00", desc: "Specialist consultations with Dr. Elena Rostova and stress echocardiography." },
  { id: "icu", name: "Intensive Care Unit (ICU)", floorId: "floor-3", floorName: "3rd Floor", category: "Critical Care", icon: "Activity", room: "ICU Pods 1-12", status: "Restricted Access", desc: "24/7 monitored critical intensive care with continuous hemodiafiltration." },
  { id: "neuro", name: "Neurology & Neurosurgery", floorId: "floor-4", floorName: "4th Floor", category: "Neurology", icon: "Brain", room: "Room 401", status: "Open 08:30 - 19:00", desc: "Clinical neuro-oncology consultations with Dr. Marcus Vance." },
  { id: "ortho", name: "Robotic Orthopedic Suite", floorId: "floor-2", floorName: "2nd Floor", category: "Orthopedics", icon: "Bone", room: "Room 210", status: "Open 08:00 - 17:30", desc: "Joint reconstruction evaluations and arthroscopy with Dr. Sarah Jenkins." },
  { id: "pedia", name: "Pediatric & NICU Center", floorId: "floor-2", floorName: "2nd Floor", category: "Pediatrics", icon: "Baby", room: "Room 220", status: "Open 08:00 - 20:00", desc: "Pediatric wellness clinics and level III neonatal intensive monitoring." },
  { id: "pharmacy", name: "Outpatient Central Pharmacy", floorId: "ground", floorName: "Ground Floor", category: "Pharmacy", icon: "Pill", room: "Counter 1-8", status: "24/7 Dispensing", desc: "Prescription fulfillment, medication reconciliation, and pharmacist consultation." },
  { id: "reception", name: "Central Admissions & Atrium", floorId: "ground", floorName: "Ground Floor", category: "Admissions", icon: "Building2", room: "Main Lobby", status: "24/7 Reception", desc: "Patient registration, visitor badges, insurance verification, and self-check-in kiosks." },
];

export default function HospitalMapPage() {
  const [searchParams] = useSearchParams();
  const [selectedFloor, setSelectedFloor] = useState("ground");
  const [selectedSpot, setSelectedSpot] = useState(HOSPITAL_HOTSPOTS[0]);
  const [navigationRoutes, setNavigationRoutes] = useState([]);
  const [activeRoute, setActiveRoute] = useState(null);

  useEffect(() => {
    async function loadRoutes() {
      try {
        const res = await api.get("/hospital/navigation");
        if (res.data.success) {
          setNavigationRoutes(res.data.routes || []);
          const destId = searchParams.get("dest");
          if (destId) {
            const found = res.data.routes.find((r) => r.id === destId);
            if (found) {
              setActiveRoute(found);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load navigation routes", err);
      }
    }
    loadRoutes();
  }, [searchParams]);

  const spotsOnFloor = HOSPITAL_HOTSPOTS.filter((s) => s.floorId === selectedFloor);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <BackButton fallback="/" label="Back to Overview" className="mb-4" />
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-teal-600 dark:text-teal-400 mb-2">
            <span>Wayfinding System</span>
            <span aria-hidden="true">·</span>
            <span>Virtual Hospital Navigator</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Interactive Hospital Explorer & Route Finder
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Locate departments, diagnostic imaging suites, and outpatient rooms with step-by-step turn guidance.
          </p>
        </div>

        {/* Smart "Where do I go?" Route Selector */}
        <div className="p-6 rounded-3xl bg-teal-900 text-white shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-800 flex items-center justify-center">
                <Compass className="w-5 h-5 text-teal-300" />
              </div>
              <div>
                <h2 className="font-bold text-base leading-tight">Where Do I Go? — Smart Wayfinder</h2>
                <p className="text-xs text-teal-200">Select your destination for immediate step-by-step turn-by-turn guidance.</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={activeRoute?.id || ""}
                onChange={(e) => {
                  const r = navigationRoutes.find((x) => x.id === e.target.value);
                  setActiveRoute(r || null);
                }}
                className="px-3.5 py-2 rounded-xl bg-teal-950 border border-teal-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
              >
                <option value="">Select a Destination Procedure / Room</option>
                {navigationRoutes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.title} ({r.floor})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Navigation Steps Representation */}
          {activeRoute && (
            <div className="p-5 rounded-2xl bg-teal-950/80 border border-teal-700/80 space-y-4 text-xs animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-teal-800/80 pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-teal-300 tracking-wider">Active Route Guide</span>
                  <h3 className="font-bold text-sm text-white mt-0.5">{activeRoute.title}</h3>
                </div>
                <div className="text-right">
                  <span className="text-xs text-teal-200">{activeRoute.floor}</span>
                  <p className="text-[11px] font-mono text-teal-400">{activeRoute.room}</p>
                </div>
              </div>

              {/* Visual Route Stepper */}
              <div className="space-y-3">
                {activeRoute.steps.map((st, index) => (
                  <div key={st.step} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-6 h-6 rounded-full bg-teal-500 text-slate-950 font-bold font-mono text-xs flex items-center justify-center shrink-0">
                        {st.step}
                      </div>
                      {index < activeRoute.steps.length - 1 && (
                        <div className="w-0.5 h-6 bg-teal-700 my-0.5" />
                      )}
                    </div>
                    <div className="flex-1 pb-1">
                      <p className="font-bold text-white text-xs">{st.title}</p>
                      <p className="text-[11px] text-teal-200 leading-relaxed">{st.instruction}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Floor Explorer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Floor Selector & Floor Plan */}
          <div className="lg:col-span-8 space-y-6">
            {/* Floor tabs */}
            <div className="flex items-center gap-1.5 p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-x-auto text-xs">
              {FLOORS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFloor(f.id)}
                  className={`px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition-all ${
                    selectedFloor === f.id
                      ? "bg-teal-600 text-white shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {f.name}
                </button>
              ))}
            </div>

            {/* Simulated Interactive Floor Canvas / Map Layout */}
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 text-xs">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {FLOORS.find((f) => f.id === selectedFloor)?.name} Blueprint
                  </span>
                  <p className="text-[11px] text-slate-500">
                    {FLOORS.find((f) => f.id === selectedFloor)?.desc}
                  </p>
                </div>
                <span className="font-mono text-teal-600 dark:text-teal-400 text-[11px]">
                  {spotsOnFloor.length} Key Clinical Units
                </span>
              </div>

              {/* Graphical Room Map Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {spotsOnFloor.map((spot) => {
                  const isSpotActive = selectedSpot?.id === spot.id;
                  return (
                    <button
                      key={spot.id}
                      onClick={() => setSelectedSpot(spot)}
                      className={`p-4 rounded-2xl border text-left transition-all space-y-2 group ${
                        isSpotActive
                          ? "bg-teal-50 dark:bg-teal-950/60 border-teal-500 shadow-md ring-1 ring-teal-500"
                          : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/60 hover:bg-white dark:hover:bg-slate-800"
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase">
                          {spot.category}
                        </span>
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      </div>
                      <p className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400">
                        {spot.name}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                        {spot.room}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* Wayfinding Legend */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-6 text-[11px] text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                  <span>Clinical Suite</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>Operational Active</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span>Emergency Zone</span>
                </span>
              </div>
            </div>
          </div>

          {/* Right: Selected Unit Dossier */}
          {selectedSpot && (
            <div className="lg:col-span-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-5 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="font-mono text-[11px] font-bold text-teal-600 dark:text-teal-400">
                  {selectedSpot.category}
                </span>
                <span className="text-slate-400 font-medium">{selectedSpot.floorName}</span>
              </div>

              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  {selectedSpot.name}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
                  Location: {selectedSpot.room}
                </p>
                <p className="text-slate-600 dark:text-slate-400 text-xs mt-3 leading-relaxed">
                  {selectedSpot.desc}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                <p className="font-bold text-slate-900 dark:text-white">Operating Status</p>
                <p className="text-teal-600 dark:text-teal-400 font-mono text-[11px]">{selectedSpot.status}</p>
              </div>

              <div className="pt-2 space-y-2">
                <Link
                  to="/appointments"
                  className="w-full py-2.5 rounded-xl font-bold text-xs bg-teal-600 hover:bg-teal-700 text-white transition-colors flex items-center justify-center gap-2"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Schedule Consultation Here</span>
                </Link>

                <Link
                  to="/equipment"
                  className="w-full py-2.5 rounded-xl font-semibold text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Explore Equipment Specifications</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
