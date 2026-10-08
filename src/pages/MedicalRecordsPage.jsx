import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import BackButton from "../components/common/BackButton";
import {
  FileText,
  HeartPulse,
  Plus,
  AlertTriangle,
  User,
  Calendar,
  Stethoscope,
  X,
  CheckCircle2
} from "lucide-react";
import toast from "react-hot-toast";

export default function MedicalRecordsPage() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Record Form
  const [patientName, setPatientName] = useState("Alexander Hayes");
  const [diagnosis, setDiagnosis] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [treatmentPlan, setTreatmentPlan] = useState("");
  const [doctorNotes, setDoctorNotes] = useState("");
  const [vitalsBp, setVitalsBp] = useState("120/80");
  const [vitalsHr, setVitalsHr] = useState("72");

  const loadRecords = async () => {
    try {
      const res = await api.get("/medical-records");
      if (res.data.success) {
        setRecords(res.data.records || []);
      }
    } catch (err) {
      console.error("Failed to load medical records", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!diagnosis || !treatmentPlan) {
      toast.error("Diagnosis and Treatment Plan are required");
      return;
    }

    try {
      const res = await api.post("/medical-records", {
        patientName,
        departmentName: "Cardiology",
        diagnosis,
        symptoms,
        treatmentPlan,
        doctorNotes,
        vitals: {
          bloodPressure: `${vitalsBp} mmHg`,
          heartRate: `${vitalsHr} bpm`,
          oxygenSat: "99%",
          temperature: "98.6 °F"
        }
      });

      if (res.data.success) {
        toast.success("Medical record entry recorded successfully");
        setShowAddModal(false);
        setDiagnosis("");
        setSymptoms("");
        setTreatmentPlan("");
        setDoctorNotes("");
        await loadRecords();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create medical record");
    }
  };

  const isDoctorOrAdmin =
    user?.role === "doctor" || user?.role === "super_admin" || user?.role === "hospital_admin";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <BackButton fallback="/dashboard" label="Back to Dashboard" className="mb-4" />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-teal-600 dark:text-teal-400 mb-1">
                <span>Electronic Health Record (EHR)</span>
                <span aria-hidden="true">·</span>
                <span>Encrypted Patient History</span>
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Medical Records & Clinical History
              </h1>
            </div>

            {isDoctorOrAdmin && (
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 rounded-xl font-bold text-xs bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/25 transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Medical Entry</span>
              </button>
            )}
          </div>
        </div>

        {/* Allergy Alert Card */}
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 flex items-start gap-3 text-xs">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Active Patient Allergy Warnings</p>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
              Alexander Hayes: <span className="font-semibold text-rose-600 dark:text-rose-400">Penicillin, Sulfa drugs</span>. Sophia Martinez: <span className="font-semibold text-rose-600 dark:text-rose-400">Latex</span>.
            </p>
          </div>
        </div>

        {/* Records Roster */}
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-500 animate-pulse">
            Loading clinical health records...
          </div>
        ) : records.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 text-xs">
            No medical records found.
          </div>
        ) : (
          <div className="space-y-6">
            {records.map((rec) => (
              <div
                key={rec.id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4 text-xs"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-bold text-teal-600 dark:text-teal-400">
                      {rec.date}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      Attending: {rec.doctorName}
                    </span>
                    <span className="text-slate-400">({rec.departmentName})</span>
                  </div>

                  <span className="text-slate-500 font-medium">
                    Patient: <span className="font-bold text-slate-900 dark:text-white">{rec.patientName}</span>
                  </span>
                </div>

                {/* Diagnosis */}
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Primary Clinical Diagnosis
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                    {rec.diagnosis}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mt-1">
                    Reported Symptoms: {rec.symptoms}
                  </p>
                </div>

                {/* Vitals Grid */}
                {rec.vitals && (
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <span className="text-slate-500 text-[10px]">Blood Pressure</span>
                      <p className="font-mono font-bold text-slate-900 dark:text-white">{rec.vitals.bloodPressure}</p>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px]">Heart Rate</span>
                      <p className="font-mono font-bold text-slate-900 dark:text-white">{rec.vitals.heartRate}</p>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px]">Oxygen Saturation</span>
                      <p className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{rec.vitals.oxygenSat}</p>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px]">Temperature</span>
                      <p className="font-mono font-bold text-slate-900 dark:text-white">{rec.vitals.temperature}</p>
                    </div>
                  </div>
                )}

                {/* Treatment plan & notes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200/60 dark:border-teal-800/60 text-teal-900 dark:text-teal-200 space-y-1">
                    <span className="font-bold text-[11px]">Treatment Plan & Recommendations</span>
                    <p className="text-[11px] leading-relaxed text-slate-700 dark:text-slate-300">{rec.treatmentPlan}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                    <span className="font-bold text-slate-800 dark:text-slate-200 text-[11px]">Physician Progress Notes</span>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">{rec.doctorNotes}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Record Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 space-y-4 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Add Clinical Medical Record Entry
                </h3>
                <button onClick={() => setShowAddModal(false)}>
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleAddSubmit} className="space-y-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Patient</label>
                  <select
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="Alexander Hayes">Alexander Hayes</option>
                    <option value="Sophia Martinez">Sophia Martinez</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Diagnosis</label>
                  <input
                    type="text"
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    required
                    placeholder="e.g. Mild Cervical Radiculopathy"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Vitals BP (mmHg)</label>
                    <input
                      type="text"
                      value={vitalsBp}
                      onChange={(e) => setVitalsBp(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Heart Rate (bpm)</label>
                    <input
                      type="text"
                      value={vitalsHr}
                      onChange={(e) => setVitalsHr(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Treatment Plan</label>
                  <textarea
                    rows={2}
                    value={treatmentPlan}
                    onChange={(e) => setTreatmentPlan(e.target.value)}
                    required
                    placeholder="Medications, diagnostic imaging ordered, physical therapy..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Doctor Progress Notes</label>
                  <textarea
                    rows={2}
                    value={doctorNotes}
                    onChange={(e) => setDoctorNotes(e.target.value)}
                    placeholder="Clinical findings, differential diagnosis notes..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 font-semibold text-slate-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl font-bold bg-teal-600 text-white"
                  >
                    Save Record
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
