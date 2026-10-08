import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "../../components/common/Sidebar";
import BackButton from "../../components/common/BackButton";
import AdminDashboard from "./AdminDashboard";
import DoctorDashboard from "./DoctorDashboard";
import PatientDashboard from "./PatientDashboard";
import NurseDashboard from "./NurseDashboard";
import ReceptionistDashboard from "./ReceptionistDashboard";
import { Menu, X } from "lucide-react";

export default function DashboardRouter() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const role = user?.role || "patient";

  const renderRoleDashboard = () => {
    switch (role) {
      case "super_admin":
      case "hospital_admin":
        return <AdminDashboard />;
      case "doctor":
        return <DoctorDashboard />;
      case "nurse":
        return <NurseDashboard />;
      case "receptionist":
        return <ReceptionistDashboard />;
      default:
        return <PatientDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col lg:flex-row">
      {/* Mobile Sidebar Toggle Header */}
      <div className="lg:hidden p-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-2 text-xs font-semibold"
        >
          {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          <span>Dashboard Menu</span>
        </button>
        <span className="text-xs font-bold text-teal-600 dark:text-teal-400 capitalize">
          {role.replace("_", " ")} Mode
        </span>
      </div>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Viewport */}
      <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
          <BackButton fallback="/" label="Back to Hospital Overview" />
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Signed in as <span className="font-semibold text-teal-600 dark:text-teal-400">{user?.name}</span> ({role.replace("_", " ")})
          </div>
        </div>
        {renderRoleDashboard()}
      </main>
    </div>
  );
}
