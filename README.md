# MediCare AI — Smart Hospital Management System

> **A Next-Generation MERN Healthcare Ecosystem with Role-Based Access Control (RBAC), Gemini-Powered Clinical Assistant, 3D Equipment Explorer, and Interactive Hospital Navigation.**

---

## 🏥 Overview

**MediCare AI** is a production-grade Hospital Management SaaS platform engineered to integrate outpatient scheduling, clinical electronic health records (EHR), telemedicine video consultations, multi-floor hospital wayfinding, and interactive WebGL 3D diagnostics.

---

## 🛠 Technology Stack

### Frontend
- **React.js (JSX)** with Vite
- **React Router DOM v7** for single-page routing
- **Tailwind CSS v4** with glassmorphism & responsive typography
- **Three.js** for interactive 3D WebGL medical equipment visualization (MRI, CT, Ventilator, ECG, Ultrasound)
- **Recharts** for analytics, revenue, and patient flow charts
- **Lucide React** for clinical iconography
- **Axios** with automatic Bearer token interceptors
- **React Hot Toast** for notifications

### Backend
- **Node.js & Express.js**
- **In-Memory & File-Synced MongoDB/Mongoose Datastore** with full CRUD, filtering, regex search, and relational indexing
- **JWT Authentication & bcrypt password hashing**
- **Role-Based Access Control (RBAC)** across 6 distinct hospital personas
- **@google/genai SDK** with server-side Gemini 3.8 Flash integration for AI clinical guidance and hospital search

---

## 👥 Demo User Accounts & Roles

You can test any role instantly with the **1-Click Demo Switcher** in the navigation bar or on the sign-in page:

| Role | Demo User | Email | Password | Key Capabilities |
| :--- | :--- | :--- | :--- | :--- |
| **Super Admin** | Eleanor Vance | `admin@medicare.ai` | `password123` | Executive analytics, hospital-wide governance, system settings |
| **Hospital Admin** | David Sterling | `hospital.admin@medicare.ai` | `password123` | Fleet management, departments, staff, bed allocations |
| **Doctor** | Dr. Elena Rostova | `elena.rostova@medicare.ai` | `password123` | Consultation queue, clinical EHR notes, e-prescriptions, telehealth |
| **Nurse** | Clara Higgins, RN | `clara.higgins@medicare.ai` | `password123` | Inpatient ward bed roster, vitals recording, medication schedule |
| **Receptionist** | James Wilson | `reception@medicare.ai` | `password123` | Walk-in admissions, waiting queue tokens, doctor availability |
| **Patient** | Alexander Hayes | `alexander.hayes@example.com` | `password123` | Book clinic/telehealth, review records, prescriptions, wayfinding |

---

## 🤖 AI Hospital Assistant Endpoints

The AI assistant connects through the backend using `@google/genai` without exposing API keys:

- `POST /api/ai/chat` — Contextual clinical guidance, doctor scheduling, and preparation rules with triage safety notices
- `POST /api/ai/search` — Fuzzy search across doctors, departments, machinery, and rooms
- `GET /api/ai/hospital-info` — Hospital accreditations, emergency trauma numbers, and services

---

## 🚀 Key Functional Modules

1. **Medical Equipment Explorer (3D Three.js)**:
   - Interactive 3D models for Siemens 3T MRI, Somatom CT, Hamilton Ventilator, ECG Monitor, and Ultrasound Cart.
   - Rotation, zoom, wireframe toggle, and preparation protocols (e.g. fasting, metal screening).

2. **Interactive Hospital Map ("Where do I go?")**:
   - Multi-floor blueprint explorer (Ground, 1st, 2nd, 3rd, 4th floors).
   - Turn-by-turn route stepper from Reception to diagnostic rooms.

3. **Virtual Telemedicine Consultation Suite**:
   - Video room interface with microphone, camera, and screen share controls.
   - Live in-call chat and synchronized vital telemetry.

4. **Emergency Trauma Dispatch**:
   - 1-click hotline alert to Level 1 trauma team.
   - Rapid ambulance unit dispatch tracker.

5. **E-Prescription & Pharmacy Inventory**:
   - Digital prescription pad with dosage, frequency, and duration.
   - Real-time low-stock tracking and restock actions.

---

## 🏃‍♂️ Running the System

```bash
# Install dependencies
npm install

# Start full-stack server (port 3000)
npm run dev

# Build for production
npm run build
```
