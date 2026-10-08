import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import BackButton from "../components/common/BackButton";
import {
  Pill,
  Printer,
  Download,
  Plus,
  Clock,
  User,
  Stethoscope,
  X,
  FileText,
  CheckCircle2
} from "lucide-react";
import toast from "react-hot-toast";

export default function PrescriptionsPage() {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Prescription State
  const [patientName, setPatientName] = useState("Alexander Hayes");
  const [doctorNotes, setDoctorNotes] = useState("");
  const [meds, setMeds] = useState([
    { name: "Telmisartan", dosage: "40 mg", frequency: "Once daily", duration: "90 days", instructions: "Morning after breakfast" }
  ]);

  const loadPrescriptions = async () => {
    try {
      const res = await api.get("/prescriptions");
      if (res.data.success) {
        setPrescriptions(res.data.prescriptions || []);
      }
    } catch (err) {
      console.error("Failed to load prescriptions", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrescriptions();
  }, []);

  const addMedRow = () => {
    setMeds([...meds, { name: "", dosage: "", frequency: "Once daily", duration: "30 days", instructions: "" }]);
  };

  const removeMedRow = (index) => {
    setMeds(meds.filter((_, idx) => idx !== index));
  };

  const updateMedRow = (index, field, value) => {
    const updated = [...meds];
    updated[index][field] = value;
    setMeds(updated);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (meds.some((m) => !m.name || !m.dosage)) {
      toast.error("Please fill in medication name and dosage for all items");
      return;
    }

    try {
      const res = await api.post("/prescriptions", {
        patientName,
        medications: meds,
        doctorNotes
      });
      if (res.data.success) {
        toast.success("Digital Prescription generated and sent to Pharmacy");
        setShowCreateModal(false);
        await loadPrescriptions();
      }
    } catch (err) {
      toast.error("Failed to create prescription");
    }
  };

  const handlePrintSlip = (rx) => {
    window.print();
  };

  const isDoctor = user?.role === "doctor" || user?.role === "super_admin";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <BackButton fallback="/dashboard" label="Back to Dashboard" className="mb-4" />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-teal-600 dark:text-teal-400 mb-1">
                <span>Pharmacy & Therapeutics</span>
                <span aria-hidden="true">·</span>
                <span>Digital E-Prescriptions</span>
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Prescription Management
              </h1>
            </div>

            {isDoctor && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 rounded-xl font-bold text-xs bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/25 transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Issue New E-Prescription</span>
              </button>
            )}
          </div>
        </div>

        {/* Prescription Slips */}
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-500 animate-pulse">
            Loading prescription registry...
          </div>
        ) : prescriptions.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 text-xs">
            No prescriptions on record.
          </div>
        ) : (
          <div className="space-y-6">
            {prescriptions.map((rx) => (
              <div
                key={rx.id}
                className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-6 text-xs"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-teal-600/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
                      <Pill className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-mono text-[11px] font-bold text-teal-600 dark:text-teal-400">
                        Rx ID: {rx.id} · Date: {rx.date}
                      </span>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        Prescribing Physician: {rx.doctorName}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 font-medium">
                      Patient: <span className="font-bold text-slate-900 dark:text-white">{rx.patientName}</span>
                    </span>
                    <button
                      onClick={() => handlePrintSlip(rx)}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 transition-colors"
                      title="Print Official Slip"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Medication Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                        <th className="pb-2">Medication</th>
                        <th className="pb-2">Dosage</th>
                        <th className="pb-2">Frequency</th>
                        <th className="pb-2">Duration</th>
                        <th className="pb-2">Special Instructions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {rx.medications?.map((m, idx) => (
                        <tr key={idx} className="py-2.5">
                          <td className="py-2.5 font-bold text-slate-900 dark:text-white">{m.name}</td>
                          <td className="py-2.5 font-mono text-slate-600 dark:text-slate-300">{m.dosage}</td>
                          <td className="py-2.5 text-slate-600 dark:text-slate-300">{m.frequency}</td>
                          <td className="py-2.5 font-mono text-slate-600 dark:text-slate-300">{m.duration}</td>
                          <td className="py-2.5 text-teal-700 dark:text-teal-300">{m.instructions}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {rx.doctorNotes && (
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400">
                    <span className="font-bold text-slate-800 dark:text-slate-200">Doctor's Guidance:</span>{" "}
                    {rx.doctorNotes}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Issue Prescription Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 space-y-4 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Issue Digital E-Prescription
                </h3>
                <button onClick={() => setShowCreateModal(false)}>
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleCreateSubmit} className="space-y-4">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Select Patient</label>
                  <select
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="Alexander Hayes">Alexander Hayes</option>
                    <option value="Sophia Martinez">Sophia Martinez</option>
                  </select>
                </div>

                {/* Medication Items */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Prescribed Medications</label>
                    <button
                      type="button"
                      onClick={addMedRow}
                      className="text-teal-600 font-semibold text-xs flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Medicine
                    </button>
                  </div>

                  {meds.map((m, idx) => (
                    <div key={idx} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input
                          type="text"
                          placeholder="Medicine name (e.g. Telmisartan)"
                          value={m.name}
                          onChange={(e) => updateMedRow(idx, "name", e.target.value)}
                          required
                          className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                        />
                        <input
                          type="text"
                          placeholder="Dosage (e.g. 40 mg)"
                          value={m.dosage}
                          onChange={(e) => updateMedRow(idx, "dosage", e.target.value)}
                          required
                          className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                        />
                        <input
                          type="text"
                          placeholder="Duration (e.g. 30 days)"
                          value={m.duration}
                          onChange={(e) => updateMedRow(idx, "duration", e.target.value)}
                          className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                        />
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Timing / Instructions (e.g. Once daily after breakfast)"
                          value={m.instructions}
                          onChange={(e) => updateMedRow(idx, "instructions", e.target.value)}
                          className="flex-1 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                        />
                        {meds.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeMedRow(idx)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-lg"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Doctor Guidance Notes</label>
                  <textarea
                    rows={2}
                    value={doctorNotes}
                    onChange={(e) => setDoctorNotes(e.target.value)}
                    placeholder="Dietary instructions, contraindications..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 font-semibold text-slate-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl font-bold bg-teal-600 text-white"
                  >
                    Issue Prescription
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
