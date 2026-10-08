import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../services/api";
import BackButton from "../components/common/BackButton";
import {
  Search,
  Filter,
  Star,
  Calendar,
  Video,
  Clock,
  ArrowRight,
  ShieldCheck,
  Stethoscope
} from "lucide-react";

export default function DoctorsPage() {
  const [searchParams] = useSearchParams();
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [selectedDept, setSelectedDept] = useState(searchParams.get("dept") || "all");
  const [consultType, setConsultType] = useState("all");
  const [minRating, setMinRating] = useState("all");

  useEffect(() => {
    async function fetchData() {
      try {
        const [docsRes, deptsRes] = await Promise.all([
          api.get("/doctors"),
          api.get("/departments"),
        ]);
        setDoctors(docsRes.data.doctors || []);
        setDepartments(deptsRes.data.departments || []);
      } catch (err) {
        console.error("Failed to load doctors", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredDoctors = doctors.filter((doc) => {
    if (selectedDept !== "all" && doc.departmentId !== selectedDept) return false;
    if (consultType === "virtual" && !doc.acceptsVirtual) return false;
    if (minRating !== "all" && doc.rating < parseFloat(minRating)) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = doc.name.toLowerCase().includes(q);
      const matchSpec = doc.specialization.toLowerCase().includes(q);
      const matchDept = doc.departmentName.toLowerCase().includes(q);
      if (!matchName && !matchSpec && !matchDept) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Title */}
        <div>
          <BackButton fallback="/" label="Back to Home" className="mb-4" />
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-teal-600 dark:text-teal-400 mb-2">
            <span>Specialist Directory</span>
            <span aria-hidden="true">·</span>
            <span>Board-Certified Faculty</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Find Hospital Specialists
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Book in-person clinic appointments or direct telemedicine consultations with verified medical specialists.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
            {/* Search Input */}
            <div className="md:col-span-1 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Doctor name, specialty..."
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Department Filter */}
            <div>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="all">All Departments</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Consultation Type */}
            <div>
              <select
                value={consultType}
                onChange={(e) => setConsultType(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="all">All Consultation Modes</option>
                <option value="virtual">Virtual Telemedicine Available</option>
              </select>
            </div>

            {/* Rating Filter */}
            <div>
              <select
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="all">Any Rating</option>
                <option value="4.8">4.8+ Stars</option>
                <option value="4.9">4.9+ Stars</option>
              </select>
            </div>
          </div>
        </div>

        {/* Doctor Cards Grid */}
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-500 animate-pulse">
            Loading specialist medical roster...
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="py-20 text-center text-xs text-slate-500">
            No doctors match your chosen filters. Try resetting the department or search term.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doc) => (
              <div
                key={doc.id}
                className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="p-6 space-y-4">
                  {/* Doctor Header */}
                  <div className="flex items-start gap-4">
                    <img
                      src={doc.avatar}
                      alt={doc.name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span>Online Consultation Active</span>
                      </div>
                      <h2 className="font-bold text-sm text-slate-900 dark:text-white leading-tight mt-0.5 truncate">
                        {doc.name}
                      </h2>
                      <p className="text-xs text-teal-600 dark:text-teal-400 font-medium truncate">
                        {doc.specialization}
                      </p>
                      <div className="flex items-center gap-1 text-[11px] text-amber-500 mt-1">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                          {doc.rating}
                        </span>
                        <span className="text-slate-400">({doc.reviewCount})</span>
                      </div>
                    </div>
                  </div>

                  {/* Qualification & Experience */}
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
                    <p className="truncate">🎓 {doc.qualification}</p>
                    <p>📍 {doc.roomNumber}</p>
                    <p>
                      ⏱ {doc.availability?.days?.slice(0, 3)?.join(", ")} · {doc.availability?.hours}
                    </p>
                  </div>

                  {/* Pricing and Mode Badges */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      Fee: <span className="font-mono text-teal-600 dark:text-teal-400 font-bold">${doc.fee}</span>
                    </span>
                    {doc.acceptsVirtual && (
                      <span className="flex items-center gap-1 text-[11px] text-teal-600 dark:text-teal-400 font-medium">
                        <Video className="w-3.5 h-3.5" />
                        <span>Telehealth Ready</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs">
                  <Link
                    to={`/doctors/${doc.id}`}
                    className="py-2 text-center rounded-xl font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    View Profile
                  </Link>
                  <Link
                    to={`/appointments?doc=${doc.id}`}
                    className="py-2 text-center rounded-xl font-semibold bg-teal-600 hover:bg-teal-700 text-white transition-colors"
                  >
                    Book Visit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
