import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import BackButton from "../components/common/BackButton";
import {
  Activity,
  ShieldCheck,
  Stethoscope,
  HeartPulse,
  UserCheck,
  User,
  ArrowRight
} from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("alexander.hayes@example.com");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);
  const { login, switchDemoRole } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (res.success) {
      navigate("/dashboard");
    }
  };

  const handleQuickDemo = async (roleName) => {
    setLoading(true);
    const res = await switchDemoRole(roleName);
    setLoading(false);
    if (res.success) {
      navigate("/dashboard");
    }
  };

  const demoAccounts = [
    { role: "patient", name: "Alexander Hayes", label: "Patient Portal", icon: User, desc: "Health records, prescriptions, booking" },
    { role: "doctor", name: "Dr. Elena Rostova", label: "Doctor Console", icon: Stethoscope, desc: "Patient queue, EHR entries, prescriptions" },
    { role: "nurse", name: "Nurse Clara Higgins", label: "Inpatient Ward", icon: HeartPulse, desc: "Bed roster, medication dispensing" },
    { role: "receptionist", name: "James Wilson", label: "Admissions Desk", icon: UserCheck, desc: "Patient check-in, appointments desk" },
    { role: "super_admin", name: "Eleanor Vance", label: "Super Admin", icon: ShieldCheck, desc: "Executive hospital analytics, settings" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 flex flex-col justify-center items-center">
      <div className="w-full max-w-4xl space-y-8">
        <div className="flex items-center justify-between">
          <BackButton fallback="/" label="Back to Home" />
        </div>

        {/* Brand */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-2xl bg-teal-600 flex items-center justify-center text-white shadow-md shadow-teal-600/30">
              <Activity className="w-6 h-6" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              MediCare <span className="text-teal-600 dark:text-teal-400">AI</span>
            </span>
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Hospital System Access Portal
          </h1>
          <p className="text-xs text-slate-500">
            Sign in with institutional credentials or select an instant demo profile below.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left: Login Form */}
          <div className="md:col-span-5 p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-5 text-xs">
            <h2 className="font-bold text-sm text-slate-900 dark:text-white">
              Account Sign In
            </h2>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/25 transition-all text-xs"
              >
                {loading ? "Authenticating..." : "Sign In to Portal"}
              </button>
            </form>

            <div className="pt-2 text-center text-slate-500">
              New patient?{" "}
              <Link to="/register" className="font-semibold text-teal-600 hover:underline">
                Create Patient Account
              </Link>
            </div>
          </div>

          {/* Right: Instant 1-Click Demo Accounts */}
          <div className="md:col-span-7 space-y-3">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
              1-Click Demo Profiles (No Password Required)
            </div>

            <div className="space-y-2.5">
              {demoAccounts.map((d) => {
                const Icon = d.icon;
                return (
                  <button
                    key={d.role}
                    type="button"
                    onClick={() => handleQuickDemo(d.role)}
                    className="w-full p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-teal-500/60 dark:hover:border-teal-500/60 shadow-sm transition-all flex items-center justify-between text-left group"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900 dark:text-white">
                            {d.label}
                          </span>
                          <span className="text-[11px] text-teal-600 dark:text-teal-400 font-medium">
                            ({d.name})
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {d.desc}
                        </p>
                      </div>
                    </div>

                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
