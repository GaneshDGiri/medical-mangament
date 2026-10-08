import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import BackButton from "../components/common/BackButton";
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Stethoscope,
  Video,
  CheckCircle2,
  XCircle,
  Plus,
  AlertCircle,
  X,
  Filter,
  Layers
} from "lucide-react";
import toast from "react-hot-toast";

export default function AppointmentsPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("list"); // "list" | "calendar"

  // Booking Modal
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState(searchParams.get("doc") || "");
  const [selectedDeptId, setSelectedDeptId] = useState(searchParams.get("dept") || "");
  const [bookDate, setBookDate] = useState("2026-10-14");
  const [bookTimeSlot, setBookTimeSlot] = useState("10:00 AM");
  const [bookType, setBookType] = useState("in-person");
  const [bookSymptoms, setBookSymptoms] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Reschedule Modal
  const [rescheduleTarget, setRescheduleTarget] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newSlot, setNewSlot] = useState("");

  const timeSlots = ["09:00 AM", "09:45 AM", "10:30 AM", "11:15 AM", "02:00 PM", "03:00 PM", "04:15 PM"];

  const loadAppointments = async () => {
    try {
      const res = await api.get("/appointments");
      if (res.data.success) {
        setAppointments(res.data.appointments || []);
      }
    } catch (err) {
      console.error("Failed to load appointments", err);
    }
  };

  useEffect(() => {
    async function loadData() {
      try {
        const [docsRes, deptsRes] = await Promise.all([
          api.get("/doctors"),
          api.get("/departments"),
        ]);
        setDoctors(docsRes.data.doctors || []);
        setDepartments(deptsRes.data.departments || []);
        await loadAppointments();

        if (searchParams.get("doc") || searchParams.get("dept")) {
          setShowBookingModal(true);
        }
      } catch (err) {
        console.error("Error loading appointment dependencies", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [searchParams]);

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDoctorId) {
      toast.error("Please select a physician");
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post("/appointments", {
        doctorId: selectedDoctorId,
        departmentId: selectedDeptId || "dept-cardio",
        date: bookDate,
        timeSlot: bookTimeSlot,
        type: bookType,
        symptoms: bookSymptoms
      });

      if (res.data.success) {
        toast.success("Appointment booked successfully!");
        setShowBookingModal(false);
        setBookSymptoms("");
        await loadAppointments();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const res = await api.put(`/appointments/${id}`, { status: newStatus });
      if (res.data.success) {
        toast.success(`Appointment status updated to ${newStatus}`);
        setAppointments((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
        );
      }
    } catch (err) {
      toast.error("Status update failed");
    }
  };

  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();
    if (!newDate || !newSlot) {
      toast.error("Select both date and time slot");
      return;
    }

    try {
      const res = await api.put(`/appointments/${rescheduleTarget.id}`, {
        date: newDate,
        timeSlot: newSlot,
        status: "confirmed"
      });
      if (res.data.success) {
        toast.success("Appointment rescheduled successfully");
        setRescheduleTarget(null);
        await loadAppointments();
      }
    } catch (err) {
      toast.error("Reschedule failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <BackButton fallback="/dashboard" label="Back to Dashboard" className="mb-4" />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-teal-600 dark:text-teal-400 mb-1">
                <span>Clinical Scheduling</span>
                <span aria-hidden="true">·</span>
                <span>In-Person & Telehealth</span>
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Appointment Management
              </h1>
            </div>

            <div className="flex items-center gap-3">
            {/* View toggle */}
            <div className="p-1 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center text-xs">
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  viewMode === "list"
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400"
                }`}
              >
                List View
              </button>
              <button
                onClick={() => setViewMode("calendar")}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  viewMode === "calendar"
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400"
                }`}
              >
                Calendar View
              </button>
            </div>

            <button
              onClick={() => setShowBookingModal(true)}
              className="px-4 py-2 rounded-xl font-bold text-xs bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/25 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>
          </div>
        </div>
      </div>

        {/* Appointments List / Calendar view */}
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-500 animate-pulse">
            Loading appointments...
          </div>
        ) : appointments.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <CalendarIcon className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-bold text-base text-slate-900 dark:text-white">No Appointments Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You currently have no scheduled consultations. Book a slot with a specialist doctor.
            </p>
            <button
              onClick={() => setShowBookingModal(true)}
              className="px-5 py-2.5 rounded-xl font-bold text-xs bg-teal-600 text-white"
            >
              Book First Appointment
            </button>
          </div>
        ) : viewMode === "list" ? (
          <div className="space-y-3">
            {appointments.map((apt) => (
              <div
                key={apt.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
              >
                {/* Details */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[11px] font-bold text-teal-600 dark:text-teal-400">
                      {apt.date} · {apt.timeSlot}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="capitalize font-semibold text-slate-700 dark:text-slate-300">
                      {apt.type === "video" ? "📹 Virtual Telehealth" : "🏥 In-Person Clinic"}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span
                      className={`font-semibold capitalize px-2 py-0.5 rounded text-[10px] ${
                        apt.status === "confirmed"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                          : apt.status === "cancelled"
                          ? "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                          : "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                      }`}
                    >
                      {apt.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {apt.doctorName} <span className="text-slate-400 font-normal">({apt.departmentName})</span>
                  </h3>

                  <p className="text-slate-500 dark:text-slate-400">
                    Patient: <span className="font-semibold text-slate-700 dark:text-slate-200">{apt.patientName}</span> · Reason: {apt.symptoms}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {apt.type === "video" && apt.status === "confirmed" && (
                    <a
                      href="/telehealth"
                      className="px-3.5 py-1.5 rounded-xl font-semibold bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 hover:bg-teal-100 transition-colors flex items-center gap-1.5"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Join Telehealth</span>
                    </a>
                  )}

                  {apt.status === "confirmed" && (
                    <button
                      onClick={() => {
                        setRescheduleTarget(apt);
                        setNewDate(apt.date);
                        setNewSlot(apt.timeSlot);
                      }}
                      className="px-3 py-1.5 rounded-xl font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors"
                    >
                      Reschedule
                    </button>
                  )}

                  {apt.status === "confirmed" && (
                    <button
                      onClick={() => handleUpdateStatus(apt.id, "cancelled")}
                      className="px-3 py-1.5 rounded-xl font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    >
                      Cancel
                    </button>
                  )}

                  {/* Doctor / Admin completion toggle */}
                  {(user?.role === "doctor" || user?.role === "super_admin" || user?.role === "hospital_admin") && apt.status === "confirmed" && (
                    <button
                      onClick={() => handleUpdateStatus(apt.id, "completed")}
                      className="px-3 py-1.5 rounded-xl font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                    >
                      Mark Completed
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Calendar representation */
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Weekly Consultation Schedule (October 2026)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-7 gap-3 text-xs">
              {["Mon 12", "Tue 13", "Wed 14", "Thu 15", "Fri 16", "Sat 17", "Sun 18"].map((dayName, idx) => {
                const dayDateStr = `2026-10-${12 + idx}`;
                const aptsThisDay = appointments.filter((a) => a.date === dayDateStr);

                return (
                  <div key={dayName} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 min-h-36 flex flex-col justify-between">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white mb-2">{dayName}</p>
                      <div className="space-y-1.5">
                        {aptsThisDay.map((a) => (
                          <div
                            key={a.id}
                            className="p-1.5 rounded-lg bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-200 text-[10px] leading-tight"
                          >
                            <p className="font-bold font-mono">{a.timeSlot}</p>
                            <p className="truncate">{a.doctorName}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    {aptsThisDay.length === 0 && (
                      <p className="text-[10px] text-slate-400 italic">No bookings</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Booking Modal */}
        {showBookingModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 space-y-5 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Schedule New Consultation
                </h3>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleBookSubmit} className="space-y-4">
                {/* Physician Select */}
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Select Specialist Physician
                  </label>
                  <select
                    value={selectedDoctorId}
                    onChange={(e) => setSelectedDoctorId(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="">-- Choose a doctor --</option>
                    {doctors.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} — {d.specialization} (${d.fee})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Consultation Mode */}
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Consultation Format
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setBookType("in-person")}
                      className={`p-2.5 rounded-xl border text-center font-semibold transition-colors ${
                        bookType === "in-person"
                          ? "bg-teal-50 dark:bg-teal-950 border-teal-500 text-teal-700 dark:text-teal-300"
                          : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      🏥 In-Person Clinic
                    </button>
                    <button
                      type="button"
                      onClick={() => setBookType("video")}
                      className={`p-2.5 rounded-xl border text-center font-semibold transition-colors ${
                        bookType === "video"
                          ? "bg-teal-50 dark:bg-teal-950 border-teal-500 text-teal-700 dark:text-teal-300"
                          : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      📹 Virtual Telehealth
                    </button>
                  </div>
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      value={bookDate}
                      onChange={(e) => setBookDate(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                      Time Slot
                    </label>
                    <select
                      value={bookTimeSlot}
                      onChange={(e) => setBookTimeSlot(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                    >
                      {timeSlots.map((ts) => (
                        <option key={ts} value={ts}>{ts}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Symptoms / Reason */}
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Symptoms or Reason for Visit
                  </label>
                  <textarea
                    rows={3}
                    value={bookSymptoms}
                    onChange={(e) => setBookSymptoms(e.target.value)}
                    placeholder="Briefly describe your symptoms or medical objective..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowBookingModal(false)}
                    className="px-4 py-2 text-slate-600 dark:text-slate-400 font-semibold hover:underline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 rounded-xl font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-md transition-colors"
                  >
                    {submitting ? "Confirming..." : "Confirm Booking"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Reschedule Modal */}
        {rescheduleTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 space-y-4 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Reschedule Appointment
                </h3>
                <button onClick={() => setRescheduleTarget(null)}>
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleRescheduleSubmit} className="space-y-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">New Date</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">New Time Slot</label>
                  <select
                    value={newSlot}
                    onChange={(e) => setNewSlot(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    {timeSlots.map((ts) => (
                      <option key={ts} value={ts}>{ts}</option>
                    ))}
                  </select>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setRescheduleTarget(null)}
                    className="px-4 py-2 font-semibold text-slate-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl font-bold bg-teal-600 text-white"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
