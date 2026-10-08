import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Video,
  FileText,
  Pill,
  Cpu,
  MapPin,
  TrendingUp,
  Stethoscope,
  HeartPulse,
  UserCheck,
  Settings,
  ShieldCheck,
  AlertOctagon
} from "lucide-react";

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth();
  const location = useLocation();
  const role = user?.role || "patient";

  const getLinks = () => {
    switch (role) {
      case "super_admin":
      case "hospital_admin":
        return [
          { label: "Executive Analytics", href: "/dashboard", icon: TrendingUp },
          { label: "Appointments", href: "/appointments", icon: Calendar },
          { label: "Specialist Doctors", href: "/doctors", icon: Stethoscope },
          { label: "Department Units", href: "/departments", icon: HeartPulse },
          { label: "Equipment Fleet", href: "/equipment/manage", icon: Cpu },
          { label: "Pharmacy Inventory", href: "/pharmacy", icon: Pill },
          { label: "Virtual Care Suite", href: "/telehealth", icon: Video },
          { label: "Hospital Navigation", href: "/navigation", icon: MapPin },
        ];
      case "doctor":
        return [
          { label: "Doctor Console", href: "/dashboard", icon: LayoutDashboard },
          { label: "Consultation Queue", href: "/appointments", icon: Calendar },
          { label: "Clinical Records", href: "/records", icon: FileText },
          { label: "Prescription Pad", href: "/prescriptions", icon: Pill },
          { label: "Virtual Consultation", href: "/telehealth", icon: Video },
          { label: "Hospital Directory", href: "/doctors", icon: Stethoscope },
        ];
      case "nurse":
        return [
          { label: "Inpatient Ward", href: "/dashboard", icon: LayoutDashboard },
          { label: "Patient Vitals Roster", href: "/records", icon: HeartPulse },
          { label: "Medication Admin", href: "/pharmacy", icon: Pill },
          { label: "Appointments Today", href: "/appointments", icon: Calendar },
        ];
      case "receptionist":
        return [
          { label: "Admissions Desk", href: "/dashboard", icon: LayoutDashboard },
          { label: "Book Appointments", href: "/appointments", icon: Calendar },
          { label: "Doctor Availability", href: "/doctors", icon: Stethoscope },
          { label: "Hospital Navigation", href: "/navigation", icon: MapPin },
        ];
      default: // patient
        return [
          { label: "Patient Dashboard", href: "/dashboard", icon: LayoutDashboard },
          { label: "Book Appointment", href: "/appointments", icon: Calendar },
          { label: "Health Records", href: "/records", icon: FileText },
          { label: "Prescriptions", href: "/prescriptions", icon: Pill },
          { label: "Virtual Consultations", href: "/telehealth", icon: Video },
          { label: "Find Doctors", href: "/doctors", icon: Stethoscope },
          { label: "Hospital Map & 3D", href: "/navigation", icon: MapPin },
        ];
    }
  };

  const links = getLinks();

  return (
    <aside
      className={`fixed lg:sticky top-16 left-0 z-30 w-64 h-[calc(100vh-4rem)] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-transform duration-200 ease-in-out shrink-0 overflow-y-auto ${
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}
    >
      <div className="p-4 flex flex-col h-full justify-between">
        <div>
          {/* User Role Card */}
          <div className="p-3 mb-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-600/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
              {user?.avatar ? (
                <img src={user.avatar} alt="" className="w-10 h-10 rounded-lg object-cover" />
              ) : (
                <ShieldCheck className="w-5 h-5" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user?.name || "Guest User"}</p>
              <p className="text-[11px] text-teal-600 dark:text-teal-400 capitalize font-medium">
                {role.replace("_", " ")}
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {links.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    isActive
                      ? "bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800/60"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-teal-600 dark:text-teal-400" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Quick Emergency Status badge */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
              <span>ER Trauma Readiness</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-[11px] font-mono text-slate-700 dark:text-slate-300">Level 1 · All Bays Active</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
