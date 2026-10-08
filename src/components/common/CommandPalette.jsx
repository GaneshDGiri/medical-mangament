import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import {
  Search,
  X,
  Stethoscope,
  HeartPulse,
  Cpu,
  MapPin,
  Calendar,
  ArrowRight,
  Sparkles,
  Bot,
  Compass,
  CornerDownLeft
} from "lucide-react";

const SUGGESTED_SEARCHES = [
  "Female cardiologist for heart checkup",
  "My knee hurts after running stairs",
  "Where do I go for an MRI scan?",
  "Pediatrician for newborn wellness checkup",
  "Emergency chest tightness",
  "View my upcoming appointments"
];

export default function CommandPalette({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [results, setResults] = useState({
    doctors: [],
    departments: [],
    equipment: [],
    navigation: [],
    appointments: []
  });
  const [aiInterpretation, setAiInterpretation] = useState("");
  const [recommendedAction, setRecommendedAction] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onClose();
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setAiInterpretation("");
      setRecommendedAction("");
      return;
    }

    const timer = setTimeout(async () => {
      if (!query.trim()) {
        try {
          const [docsRes, deptRes, routesRes] = await Promise.all([
            api.get("/doctors"),
            api.get("/departments"),
            api.get("/hospital/navigation")
          ]);
          setResults({
            doctors: (docsRes.data.doctors || []).slice(0, 3),
            departments: (deptRes.data.departments || []).slice(0, 3),
            equipment: [],
            navigation: (routesRes.data.routes || []).slice(0, 2),
            appointments: []
          });
          setAiInterpretation("Type any natural language health inquiry (e.g. 'female cardiologist', 'MRI prep', 'knee rehab').");
        } catch {
          // Ignore
        }
        return;
      }

      setLoading(true);
      try {
        const res = await api.post("/ai/search", { query });
        if (res.data.success) {
          setResults(res.data.results || {
            doctors: [],
            departments: [],
            equipment: [],
            navigation: [],
            appointments: []
          });
          setAiInterpretation(res.data.aiInterpretation || "");
          setRecommendedAction(res.data.recommendedAction || "");
        }
      } catch {
        // Fallback
      } finally {
        setLoading(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [query, isOpen]);

  if (!isOpen) return null;

  const handleSelect = (url) => {
    onClose();
    navigate(url);
  };

  const hasAnyResults =
    (results.doctors?.length || 0) > 0 ||
    (results.departments?.length || 0) > 0 ||
    (results.equipment?.length || 0) > 0 ||
    (results.navigation?.length || 0) > 0 ||
    (results.appointments?.length || 0) > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-20 p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search with natural language: 'female heart doctor', 'where is MRI', 'knee pain'..."
            autoFocus
            className="flex-1 text-sm bg-transparent border-none outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AI Interpretation Banner */}
        {aiInterpretation && (
          <div className="px-5 py-3 bg-teal-50/80 dark:bg-teal-950/50 border-b border-teal-100 dark:border-teal-900/60 text-xs text-teal-900 dark:text-teal-200 flex items-start gap-2.5">
            <Bot className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold text-[11px] text-teal-700 dark:text-teal-300 uppercase tracking-wide">
                AI Clinical Context Match
              </span>
              <p className="text-[11px] leading-relaxed text-slate-700 dark:text-slate-300">
                {aiInterpretation}
              </p>
              {recommendedAction && (
                <p className="text-[11px] font-semibold text-teal-700 dark:text-teal-300 mt-1">
                  💡 Recommendation: {recommendedAction}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Filter Category Tabs */}
        <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto text-[11px]">
          {["all", "doctors", "departments", "equipment", "navigation", "appointments"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded-lg font-semibold capitalize whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? "bg-teal-600 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Results Body */}
        <div className="max-h-[55vh] overflow-y-auto p-4 space-y-4 text-xs">
          {loading && (
            <div className="text-center py-6 text-slate-400 animate-pulse flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-500 animate-spin" />
              <span>Analyzing natural language intent across clinical registry...</span>
            </div>
          )}

          {!loading && !hasAnyResults && query.trim() && (
            <div className="text-center py-8 text-slate-400">
              No matching records found for "{query}". Try checking suggested inquiries below.
            </div>
          )}

          {/* Quick Query Suggestions if empty */}
          {!query.trim() && (
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Try Natural Language Queries:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED_SEARCHES.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => setQuery(s)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950 text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-300 text-[11px] font-medium transition-colors"
                  >
                    "{s}"
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Doctors */}
          {(activeTab === "all" || activeTab === "doctors") && results.doctors?.length > 0 && (
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 mb-2 flex items-center gap-1.5">
                <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                <span>Specialist Physicians ({results.doctors.length})</span>
              </div>
              <div className="space-y-1">
                {results.doctors.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => handleSelect(`/doctors/${doc.id}`)}
                    className="w-full p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-center justify-between text-left transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200 flex items-center justify-center font-bold text-xs shrink-0">
                        {doc.name[4] || "D"}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400">
                          {doc.name}
                        </p>
                        <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                          {doc.specialization} · {doc.departmentName} · Fee: ${doc.fee}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Departments */}
          {(activeTab === "all" || activeTab === "departments") && results.departments?.length > 0 && (
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 mb-2 flex items-center gap-1.5">
                <HeartPulse className="w-3.5 h-3.5 text-teal-600" />
                <span>Clinical Departments ({results.departments.length})</span>
              </div>
              <div className="space-y-1">
                {results.departments.map((dept) => (
                  <button
                    key={dept.id}
                    onClick={() => handleSelect(`/departments`)}
                    className="w-full p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-center justify-between text-left transition-colors group"
                  >
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400">
                        {dept.name}
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 text-[11px] truncate max-w-md">
                        {dept.floor} · {dept.description}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Equipment */}
          {(activeTab === "all" || activeTab === "equipment") && results.equipment?.length > 0 && (
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 mb-2 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-teal-600" />
                <span>3D Medical Equipment ({results.equipment.length})</span>
              </div>
              <div className="space-y-1">
                {results.equipment.map((eq) => (
                  <button
                    key={eq.id}
                    onClick={() => handleSelect(`/equipment`)}
                    className="w-full p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-center justify-between text-left transition-colors group"
                  >
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400">
                        {eq.name}
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                        {eq.location} · {eq.purpose}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          {(activeTab === "all" || activeTab === "navigation") && results.navigation?.length > 0 && (
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 mb-2 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-teal-600" />
                <span>Hospital Navigation Routes ({results.navigation.length})</span>
              </div>
              <div className="space-y-1">
                {results.navigation.map((nav) => (
                  <button
                    key={nav.id}
                    onClick={() => handleSelect(`/navigation?dest=${nav.id}`)}
                    className="w-full p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-center justify-between text-left transition-colors group"
                  >
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400">
                        {nav.title}
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                        {nav.floor} · {nav.room}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Appointments */}
          {(activeTab === "all" || activeTab === "appointments") && results.appointments?.length > 0 && (
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 mb-2 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-teal-600" />
                <span>Appointments ({results.appointments.length})</span>
              </div>
              <div className="space-y-1">
                {results.appointments.map((apt) => (
                  <button
                    key={apt.id}
                    onClick={() => handleSelect(`/appointments`)}
                    className="w-full p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-center justify-between text-left transition-colors group"
                  >
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400">
                        {apt.date} · {apt.timeSlot} — {apt.doctorName}
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                        Patient: {apt.patientName} · {apt.symptoms}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-teal-500" />
            <span>AI Semantic & Intent Grounded Search</span>
          </span>
          <div className="flex items-center gap-2">
            <span>[ESC] to dismiss</span>
          </div>
        </div>
      </div>
    </div>
  );
}
