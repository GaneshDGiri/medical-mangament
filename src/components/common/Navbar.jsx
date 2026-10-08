import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useNotifications } from "../../context/NotificationContext";
import {
  Activity,
  Sun,
  Moon,
  Search,
  AlertCircle,
  Bell,
  User,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  ShieldCheck,
  Stethoscope,
  Wifi,
  WifiOff,
  CheckCheck,
  Sparkles,
  Radio,
  ArrowLeft,
  Video
} from "lucide-react";

export default function Navbar({ onOpenEmergency, onOpenSearch, onOpenVideo }) {
  const { user, isAuthenticated, logout, switchDemoRole } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const {
    notifications,
    unreadCount,
    isConnected,
    markAsRead,
    markAllAsRead,
    broadcastNotification
  } = useNotifications();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showSimulator, setShowSimulator] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { label: "Find Doctors", href: "/doctors" },
    { label: "Departments", href: "/departments" },
    { label: "Hospital Map", href: "/navigation" },
    { label: "3D Equipment", href: "/equipment" },
    { label: "About Hospital", href: "/about" },
  ];

  const demoRoles = [
    { role: "patient", label: "Patient (Alexander Hayes)", desc: "Health records, prescriptions, booking" },
    { role: "doctor", label: "Doctor (Dr. Elena Rostova)", desc: "Queue, diagnoses EHR, prescriptions" },
    { role: "nurse", label: "Nurse (Clara Higgins)", desc: "Ward bed roster, vitals recording" },
    { role: "receptionist", label: "Receptionist (James Wilson)", desc: "Walk-in check-in, admissions desk" },
    { role: "hospital_admin", label: "Hospital Admin (David Sterling)", desc: "Fleet, departments, operations" },
    { role: "super_admin", label: "Super Admin (Eleanor Vance)", desc: "Hospital governance, analytics, audit" },
  ];

  const handleDemoSwitch = async (roleKey) => {
    setShowRoleMenu(false);
    await switchDemoRole(roleKey);
    navigate("/dashboard");
  };

  const handleSimulateEvent = async (type) => {
    setShowSimulator(false);
    setShowNotifMenu(false);
    switch (type) {
      case "lab_result":
        await broadcastNotification({
          title: "Lab Result Ready: CBC & Lipid Panel",
          message: "Patient Alexander Hayes' blood analysis is finalized by Dr. Patel. Available in EHR.",
          type: "lab_result",
          role: "all",
          link: "/records"
        });
        break;
      case "appointment_reminder":
        await broadcastNotification({
          title: "Appointment Reminder: Tomorrow 10:30 AM",
          message: "Cardiology follow-up with Dr. Elena Rostova in Suite 301. Please arrive 10 mins early.",
          type: "appointment",
          role: "all",
          link: "/appointments"
        });
        break;
      case "emergency_alert":
        await broadcastNotification({
          title: "EMERGENCY: Level 1 Trauma Resuscitation",
          message: "Incoming multi-trauma inbound to Ground Floor Bay 2. Trauma team standby activated.",
          type: "emergency",
          role: "all",
          link: "/dashboard"
        });
        break;
      default:
        await broadcastNotification({
          title: "System Broadcast Announcement",
          message: "All Siemens MAGNETOM MRI and CT scanners calibrated. Central PACS storage synchronized.",
          type: "system",
          role: "all",
          link: "/equipment"
        });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand & Back Navigation */}
        <div className="flex items-center gap-3 shrink-0">
          {location.pathname !== "/" && (
            <button
              type="button"
              onClick={() => {
                if (window.history.length > 1) navigate(-1);
                else navigate("/");
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200/80 dark:border-slate-700/80 group"
              title="Return to previous section"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 group-hover:-translate-x-0.5 transition-transform" />
              <span className="hidden sm:inline">Back</span>
            </button>
          )}

          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <Activity className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                MediCare <span className="text-teal-600 dark:text-teal-400">AI</span>
              </span>
            </div>
          </Link>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                className={`transition-colors whitespace-nowrap hover:text-teal-600 dark:hover:text-teal-400 ${
                  isActive ? "text-teal-600 dark:text-teal-400 font-semibold" : ""
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Hospital Video Tour Button */}
          {onOpenVideo && (
            <button
              onClick={onOpenVideo}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900/60 border border-teal-200 dark:border-teal-800 transition-colors"
              title="Watch 4K Hospital Video Tour"
            >
              <Video className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>Video Tour</span>
            </button>
          )}

          {/* Natural Language AI Search (Cmd+K) */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/80 rounded-lg transition-colors border border-slate-200/60 dark:border-slate-700/60"
            title="Natural Language AI Search (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span className="hidden sm:inline">AI Search...</span>
            <kbd className="hidden md:inline font-mono text-[10px] bg-white dark:bg-slate-900 px-1 py-0.5 rounded border border-slate-200 dark:border-slate-700">
              ⌘K
            </kbd>
          </button>

          {/* Real-Time Socket.IO Notification Center */}
          <div className="relative">
            <button
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="relative p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              title="Real-Time Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full bg-teal-600 text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Panel */}
            {showNotifMenu && (
              <div
                className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-3 z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-150"
              >
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">Live Notifications</span>
                    <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Socket.IO
                    </span>
                  </div>

                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-[11px] text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 font-medium"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      Mark all read
                    </button>
                  )}
                </div>

                {/* Notifications Stream */}
                <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                  {notifications.length === 0 ? (
                    <div className="py-6 text-center text-slate-400">
                      No notifications yet.
                    </div>
                  ) : (
                    notifications.slice(0, 8).map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markAsRead(n.id)}
                        className={`p-2.5 rounded-xl border transition-colors cursor-pointer space-y-1 ${
                          !n.isRead
                            ? "bg-teal-50/70 dark:bg-teal-950/40 border-teal-200 dark:border-teal-800"
                            : "bg-slate-50/50 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-700/60"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 dark:text-white text-xs">
                            {n.title}
                          </span>
                          {!n.isRead && (
                            <span className="w-2 h-2 rounded-full bg-teal-500" />
                          )}
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
                          {n.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                {/* Real-Time Event Simulation Toolbar */}
                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => setShowSimulator(!showSimulator)}
                    className="w-full py-1.5 px-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Radio className="w-3 h-3 text-teal-600" />
                    <span>Test / Trigger Live Real-Time Event</span>
                  </button>

                  {showSimulator && (
                    <div className="mt-2 grid grid-cols-2 gap-1.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-[10px]">
                      <button
                        onClick={() => handleSimulateEvent("appointment_reminder")}
                        className="p-1.5 text-left rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-medium hover:border-teal-500"
                      >
                        📅 Appointment Reminder
                      </button>
                      <button
                        onClick={() => handleSimulateEvent("lab_result")}
                        className="p-1.5 text-left rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-medium hover:border-teal-500"
                      >
                        🧪 Lab Results Ready
                      </button>
                      <button
                        onClick={() => handleSimulateEvent("emergency_alert")}
                        className="p-1.5 text-left rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-medium text-rose-600 hover:border-rose-500"
                      >
                        🚨 Critical Trauma Alert
                      </button>
                      <button
                        onClick={() => handleSimulateEvent("system")}
                        className="p-1.5 text-left rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-medium hover:border-teal-500"
                      >
                        📢 System Announcement
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Emergency Alert Button */}
          <button
            onClick={onOpenEmergency}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800/80 rounded-lg transition-all shadow-sm"
          >
            <AlertCircle className="w-3.5 h-3.5 animate-pulse text-rose-600 dark:text-rose-400" />
            <span className="whitespace-nowrap">Emergency</span>
          </button>

          {/* Role Switcher Dropdown (RBAC demonstration) */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-teal-50 dark:bg-teal-950/40 hover:bg-teal-100 dark:hover:bg-teal-900/60 border border-teal-200 dark:border-teal-800/70 rounded-lg transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span className="hidden sm:inline capitalize">
                {user?.role ? user.role.replace("_", " ") : "Demo Roles"}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showRoleMenu && (
              <div
                className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-2 z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-150"
                onClick={() => setShowRoleMenu(false)}
              >
                <div className="px-2.5 py-1.5 font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[10px]">
                  RBAC Role Switcher (1-Click)
                </div>
                {demoRoles.map((r) => (
                  <button
                    key={r.role}
                    onClick={() => handleDemoSwitch(r.role)}
                    className={`w-full text-left px-2.5 py-2 rounded-lg transition-colors flex flex-col gap-0.5 ${
                      user?.role === r.role
                        ? "bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-200 font-medium"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                    }`}
                  >
                    <span className="font-semibold">{r.label}</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">{r.desc}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Profile / Dashboard Access */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1 pl-2 text-xs rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-teal-600 text-white flex items-center justify-center font-semibold text-xs overflow-hidden">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    user.name?.[0] || "U"
                  )}
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showUserMenu && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-1 z-50 text-xs"
                  onClick={() => setShowUserMenu(false)}
                >
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="font-semibold text-slate-900 dark:text-white truncate">{user.name}</p>
                    <p className="text-teal-600 dark:text-teal-400 capitalize text-[10px] font-bold">
                      {user.role?.replace("_", " ")}
                    </p>
                  </div>
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4 text-teal-600" />
                    Dashboard
                  </Link>
                  <Link
                    to="/appointments"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
                  >
                    <Stethoscope className="w-4 h-4 text-teal-600" />
                    Appointments
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 rounded-lg transition-colors whitespace-nowrap shadow-sm shadow-teal-600/20"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
