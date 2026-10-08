import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../services/api";
import BackButton from "../components/common/BackButton";
import {
  Star,
  MapPin,
  Clock,
  Video,
  Award,
  CheckCircle,
  Calendar,
  GraduationCap
} from "lucide-react";

export default function DoctorProfilePage() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDoctor() {
      try {
        const res = await api.get(`/doctors/${id}`);
        if (res.data.success) {
          setDoctor(res.data.doctor);
        }
      } catch (err) {
        console.error("Failed to load doctor profile", err);
      } finally {
        setLoading(false);
      }
    }
    loadDoctor();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xs text-slate-500 animate-pulse">
        Loading specialist profile...
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen p-8 text-center text-slate-500">
        Doctor profile not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <BackButton fallback="/doctors" label="Back to Doctors Directory" />

        {/* Doctor Hero Card */}
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col md:flex-row items-start gap-8">
          <img
            src={doctor.avatar}
            alt={doctor.name}
            referrerPolicy="no-referrer"
            className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl object-cover border-2 border-slate-200 dark:border-slate-700 shadow-md shrink-0"
          />

          <div className="space-y-4 flex-1">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-teal-600 dark:text-teal-400">
                <span>{doctor.departmentName}</span>
                <span aria-hidden="true">·</span>
                <span>{doctor.experience} Years Active Practice</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
                {doctor.name}
              </h1>
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                {doctor.specialization}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">{doctor.rating}</span>
                <span>({doctor.reviewCount} verified reviews)</span>
              </div>
              <span>·</span>
              <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                <MapPin className="w-4 h-4 text-teal-600" />
                <span>{doctor.roomNumber}</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
              {doctor.bio}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                to={`/appointments?doc=${doctor.id}`}
                className="px-6 py-3 rounded-xl font-bold text-xs bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/25 transition-all flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Book In-Person Clinic Visit (${doctor.fee})</span>
              </Link>

              {doctor.acceptsVirtual && (
                <Link
                  to="/telehealth"
                  className="px-5 py-3 rounded-xl font-semibold text-xs bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 transition-colors flex items-center gap-1.5"
                >
                  <Video className="w-4 h-4" />
                  <span>Start Virtual Telehealth</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Two Column Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          {/* Left: Credentials & Clinical Focus */}
          <div className="md:col-span-2 space-y-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 space-y-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-teal-600" />
                <span>Academic Training & Credentials</span>
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {doctor.qualification}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 space-y-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-teal-600" />
                <span>Core Clinical Competencies</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700 dark:text-slate-300">
                {doctor.skills?.map((skill, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                    <CheckCircle className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span>{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Schedule & Location */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 space-y-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-600" />
                <span>Clinic Schedule</span>
              </h3>
              <div className="space-y-2 text-slate-600 dark:text-slate-400">
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span>Available Days</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {doctor.availability?.days?.join(", ")}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span>Clinic Hours</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {doctor.availability?.hours}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Consultation Fee</span>
                  <span className="font-bold font-mono text-teal-600 dark:text-teal-400">
                    ${doctor.fee}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-teal-900 dark:text-teal-200 space-y-2">
              <p className="font-bold">Need assistance booking?</p>
              <p className="text-[11px] text-teal-800 dark:text-teal-300 leading-relaxed">
                Our AI Hospital Assistant can recommend suitable time slots based on your symptom notes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
