import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { NotificationProvider } from "./context/NotificationContext";

// Common UI
import Navbar from "./components/common/Navbar";
import AIChat from "./components/common/AIChat";
import EmergencyModal from "./components/common/EmergencyModal";
import CommandPalette from "./components/common/CommandPalette";
import HospitalVideoModal from "./components/common/HospitalVideoModal";

// Pages
import LandingPage from "./pages/LandingPage";
import AboutPage from "./pages/AboutPage";
import DoctorsPage from "./pages/DoctorsPage";
import DoctorProfilePage from "./pages/DoctorProfilePage";
import DepartmentsPage from "./pages/DepartmentsPage";
import HospitalMapPage from "./pages/HospitalMapPage";
import EquipmentExplorerPage from "./pages/EquipmentExplorerPage";
import EquipmentManagementPage from "./pages/EquipmentManagementPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import MeetingRoomPage from "./pages/MeetingRoomPage";
import MedicalRecordsPage from "./pages/MedicalRecordsPage";
import PrescriptionsPage from "./pages/PrescriptionsPage";
import PharmacyPage from "./pages/PharmacyPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardRouter from "./pages/dashboards/DashboardRouter";

function NotFoundPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-center space-y-4">
      <h1 className="text-6xl font-extrabold text-teal-600 font-mono">404</h1>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white">Page or Department Not Found</h2>
      <p className="text-xs text-slate-500 max-w-sm">
        The requested clinical room or hospital service link does not exist.
      </p>
      <Link
        to="/"
        className="px-5 py-2.5 rounded-xl font-bold text-xs bg-teal-600 text-white hover:bg-teal-700"
      >
        Return to Hospital Home
      </Link>
    </div>
  );
}

export default function App() {
  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);

  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors selection:bg-teal-100 selection:text-teal-900">
              <Navbar
                onOpenEmergency={() => setEmergencyOpen(true)}
                onOpenSearch={() => setSearchOpen(true)}
                onOpenVideo={() => setVideoOpen(true)}
              />

              <div className="flex-1">
                <Routes>
                  <Route
                    path="/"
                    element={
                      <LandingPage
                        onOpenEmergency={() => setEmergencyOpen(true)}
                        onOpenVideo={() => setVideoOpen(true)}
                      />
                    }
                  />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/doctors" element={<DoctorsPage />} />
                  <Route path="/doctors/:id" element={<DoctorProfilePage />} />
                  <Route path="/departments" element={<DepartmentsPage />} />
                  <Route path="/navigation" element={<HospitalMapPage />} />
                  <Route path="/equipment" element={<EquipmentExplorerPage />} />
                  <Route path="/equipment/manage" element={<EquipmentManagementPage />} />
                  <Route path="/appointments" element={<AppointmentsPage />} />
                  <Route path="/telehealth" element={<MeetingRoomPage />} />
                  <Route path="/records" element={<MedicalRecordsPage />} />
                  <Route path="/prescriptions" element={<PrescriptionsPage />} />
                  <Route path="/pharmacy" element={<PharmacyPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/dashboard" element={<DashboardRouter />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </div>

              {/* Global Floating AI Hospital Assistant */}
              <AIChat onOpenEmergency={() => setEmergencyOpen(true)} />

              {/* Global Emergency Modal */}
              <EmergencyModal
                isOpen={emergencyOpen}
                onClose={() => setEmergencyOpen(false)}
              />

              {/* Global Command Palette (Cmd+K) */}
              <CommandPalette
                isOpen={searchOpen}
                onClose={() => setSearchOpen(false)}
              />

              {/* Global Hospital Video Tour Modal */}
              <HospitalVideoModal
                isOpen={videoOpen}
                onClose={() => setVideoOpen(false)}
              />

              <Toaster
                position="top-right"
                toastOptions={{
                  style: {
                    background: "#0f172a",
                    color: "#f8fafc",
                    fontSize: "12px",
                    borderRadius: "12px",
                    border: "1px solid #1e293b",
                  },
                }}
              />
            </div>
          </BrowserRouter>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
