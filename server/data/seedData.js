/**
 * MediCare AI - Realistic Hospital Seed Data (JavaScript)
 */

export const INITIAL_DEPARTMENTS = [
  {
    id: "dept-cardio",
    name: "Cardiology",
    code: "CARD",
    description: "Advanced cardiac care, non-invasive imaging, catheterization, and post-operative cardiac rehabilitation.",
    headDoctorName: "Dr. Elena Rostova",
    floor: "3rd Floor, West Wing",
    rooms: ["Room 301", "Room 302", "Cath Lab 1", "CCU 1-8"],
    icon: "HeartPulse",
    workingHours: "24/7 Emergency & 08:00 - 18:00 Outpatient",
    services: ["Echocardiography", "Coronary Angiography", "Holter Monitoring", "Pacemaker Clinic"],
    equipment: ["3D Echocardiogram", "Digital Cath Lab", "Cardiac Defibrillator", "Stress ECG System"]
  },
  {
    id: "dept-neuro",
    name: "Neurology & Neurosurgery",
    code: "NEUR",
    description: "Comprehensive diagnostics and surgical care for complex central and peripheral nervous system disorders.",
    headDoctorName: "Dr. Marcus Vance",
    floor: "4th Floor, North Wing",
    rooms: ["Room 401", "Room 402", "Neuro ICU", "EEG Lab"],
    icon: "Brain",
    workingHours: "08:30 - 19:00 (Emergency 24/7)",
    services: ["EEG & EMG Diagnostics", "Stroke Intervention", "Epilepsy Monitoring", "Spine Care"],
    equipment: ["Digital Video EEG", "Intraoperative Neuromonitoring", "Neuronavigation System"]
  },
  {
    id: "dept-ortho",
    name: "Orthopedics & Joint Care",
    code: "ORTH",
    description: "Specialized arthroscopic reconstruction, robotic joint replacement, and sports trauma therapy.",
    headDoctorName: "Dr. Sarah Jenkins",
    floor: "2nd Floor, East Wing",
    rooms: ["Room 210", "Room 212", "Ortho OT 3", "Rehab Gym"],
    icon: "Bone",
    workingHours: "08:00 - 17:30",
    services: ["Robotic Knee & Hip Replacement", "Sports Medicine", "Fracture Clinic", "Spine Decompression"],
    equipment: ["MAKO Robotic Arm", "C-Arm Fluoroscopy", "Bone Density DEXA Scanner"]
  },
  {
    id: "dept-radio",
    name: "Radiology & Imaging Sciences",
    code: "RAD",
    description: "Precision medical imaging and minimally invasive interventional radiology procedures.",
    headDoctorName: "Dr. Vikram Patel",
    floor: "1st Floor, Basement Wing A",
    rooms: ["MRI Suite 101", "CT Suite 102", "Ultrasound 1-4", "Digital X-Ray 105"],
    icon: "Scan",
    workingHours: "24/7 Continuous Services",
    services: ["3T Multiparametric MRI", "Dual-Source CT Angiography", "Ultrasound Guided Biopsy", "Digital Mammography"],
    equipment: ["Siemens MAGNETOM 3T MRI", "Somatom 256-Slice CT", "Voluson E10 Ultrasound", "Carestream DRX X-Ray"]
  },
  {
    id: "dept-pedia",
    name: "Pediatrics & Neonatology",
    code: "PED",
    description: "Warm, family-centered medical care for infants, children, and adolescents, including level III NICU.",
    headDoctorName: "Dr. Maya Lin",
    floor: "2nd Floor, South Wing",
    rooms: ["Room 220", "Room 224", "NICU Pod A-C", "Pediatric Play Area"],
    icon: "Baby",
    workingHours: "08:00 - 20:00 (Emergency 24/7)",
    services: ["Neonatal Intensive Care", "Well-Baby Checkups", "Pediatric Pulmonology", "Vaccination Program"],
    equipment: ["Giraffe Infant Incubator", "Nitric Oxide Delivery System", "Pediatric Ventilators"]
  },
  {
    id: "dept-general",
    name: "General & Internal Medicine",
    code: "GEN",
    description: "Holistic adult primary care, acute disease management, and multisystem metabolic disorder treatment.",
    headDoctorName: "Dr. Robert Thorne",
    floor: "Ground Floor, Clinic Wing",
    rooms: ["Room 101", "Room 102", "Room 103", "Room 104"],
    icon: "Stethoscope",
    workingHours: "07:30 - 21:00",
    services: ["Preventive Health Audits", "Diabetes Management", "Hypertension Clinic", "Geriatric Care"],
    equipment: ["Point-of-Care Ultrasound", "Ambulatory Blood Pressure Monitors", "Spirometry Unit"]
  },
  {
    id: "dept-er",
    name: "Emergency & Trauma Center",
    code: "ER",
    description: "Level 1 rapid trauma resuscitation, acute cardiac care, toxicological response, and critical stabilization.",
    headDoctorName: "Dr. Chloe Adams",
    floor: "Ground Floor, Direct Ambulance Ramp",
    rooms: ["Triage Bay 1-4", "Resuscitation 1-2", "Minor Procedure OT", "Fast-Track Beds"],
    icon: "Siren",
    workingHours: "24/7/365 Open Always",
    services: ["Trauma Resuscitation", "Acute Stroke Protocol", "Polytrauma Stabilization", "Chest Pain Emergency"],
    equipment: ["Crash Carts", "Sonosite Fast-POCUS", "Zoll Defibrillators", "Rapid Blood Infusers"]
  },
  {
    id: "dept-icu",
    name: "Intensive Care Unit (ICU)",
    code: "ICU",
    description: "High-acuity medical and surgical intensive care monitored 24/7 by board-certified intensivists.",
    headDoctorName: "Dr. Arthur Bell",
    floor: "3rd Floor, Central Core",
    rooms: ["ICU Pod 1-12", "Isolation Unit 13-14", "Family Consultation Rm"],
    icon: "Activity",
    workingHours: "24/7 Monitored Critical Care",
    services: ["Advanced Mechanical Ventilation", "Continuous Hemodiafiltration (CRRT)", "Hemodynamic Monitoring"],
    equipment: ["Hamilton G5 Ventilators", "Prismaflex CRRT System", "EV1000 Cardiac Monitors"]
  }
];

export const INITIAL_USERS = [
  {
    id: "usr-admin",
    name: "Eleanor Vance",
    email: "admin@medicare.ai",
    role: "super_admin",
    phone: "+1 (555) 019-2831",
    department: "Executive Medical Administration",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    status: "active"
  },
  {
    id: "usr-hosp-admin",
    name: "David Sterling",
    email: "hospital.admin@medicare.ai",
    role: "hospital_admin",
    phone: "+1 (555) 019-3321",
    department: "Hospital Operations",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    status: "active"
  },
  {
    id: "usr-doc-elena",
    name: "Dr. Elena Rostova",
    email: "elena.rostova@medicare.ai",
    role: "doctor",
    phone: "+1 (555) 438-9901",
    department: "Cardiology",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80",
    status: "active"
  },
  {
    id: "usr-doc-marcus",
    name: "Dr. Marcus Vance",
    email: "marcus.vance@medicare.ai",
    role: "doctor",
    phone: "+1 (555) 438-9902",
    department: "Neurology & Neurosurgery",
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80",
    status: "active"
  },
  {
    id: "usr-doc-sarah",
    name: "Dr. Sarah Jenkins",
    email: "sarah.jenkins@medicare.ai",
    role: "doctor",
    phone: "+1 (555) 438-9903",
    department: "Orthopedics & Joint Care",
    avatar: "https://images.unsplash.com/photo-1594824813515-58f700445d3e?auto=format&fit=crop&w=400&q=80",
    status: "active"
  },
  {
    id: "usr-doc-vikram",
    name: "Dr. Vikram Patel",
    email: "vikram.patel@medicare.ai",
    role: "doctor",
    phone: "+1 (555) 438-9904",
    department: "Radiology & Imaging Sciences",
    avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80",
    status: "active"
  },
  {
    id: "usr-doc-maya",
    name: "Dr. Maya Lin",
    email: "maya.lin@medicare.ai",
    role: "doctor",
    phone: "+1 (555) 438-9905",
    department: "Pediatrics & Neonatology",
    avatar: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&w=400&q=80",
    status: "active"
  },
  {
    id: "usr-nurse-clara",
    name: "Clara Higgins, RN",
    email: "clara.higgins@medicare.ai",
    role: "nurse",
    phone: "+1 (555) 782-1142",
    department: "Cardiology & Inpatient Ward",
    avatar: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=400&q=80",
    status: "active"
  },
  {
    id: "usr-recep-james",
    name: "James Wilson",
    email: "reception@medicare.ai",
    role: "receptionist",
    phone: "+1 (555) 012-9800",
    department: "Central Patient Admissions",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    status: "active"
  },
  {
    id: "usr-patient-alex",
    name: "Alexander Hayes",
    email: "alexander.hayes@example.com",
    role: "patient",
    phone: "+1 (555) 902-8812",
    department: "Patient Portal",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
    status: "active"
  },
  {
    id: "usr-patient-sophia",
    name: "Sophia Martinez",
    email: "sophia.martinez@example.com",
    role: "patient",
    phone: "+1 (555) 902-7714",
    department: "Patient Portal",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    status: "active"
  }
];

export const INITIAL_DOCTORS = [
  {
    id: "doc-1",
    userId: "usr-doc-elena",
    name: "Dr. Elena Rostova, MD, FACC",
    gender: "Female",
    specialization: "Interventional Cardiologist",
    departmentId: "dept-cardio",
    departmentName: "Cardiology",
    qualification: "MD (Johns Hopkins), Fellowship in Cardiology (Cleveland Clinic)",
    experience: 16,
    fee: 180,
    rating: 4.95,
    reviewCount: 142,
    roomNumber: "Room 301, West Wing",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80",
    bio: "Specializes in minimally invasive coronary revascularization, complex valvular heart disorders, and preventive cardiac wellness.",
    skills: ["Angioplasty & Stenting", "TAVR", "Advanced Echocardiography", "Hypertension Management"],
    availability: {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      hours: "09:00 - 16:30",
      status: "online"
    },
    acceptsVirtual: true
  },
  {
    id: "doc-2",
    userId: "usr-doc-marcus",
    name: "Dr. Marcus Vance, MD, PhD",
    gender: "Male",
    specialization: "Senior Neurosurgeon & Neuro-oncologist",
    departmentId: "dept-neuro",
    departmentName: "Neurology & Neurosurgery",
    qualification: "MD, PhD (Harvard Medical School), Skull Base Fellowship (UCSF)",
    experience: 19,
    fee: 240,
    rating: 4.92,
    reviewCount: 98,
    roomNumber: "Room 401, North Wing",
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80",
    bio: "Pioneer in image-guided micro-neurosurgery, brain tumors, spine surgery, and cranial base reconstructions.",
    skills: ["Complex Brain Tumor Resection", "Minimally Invasive Spine", "Aneurysm Clipping"],
    availability: {
      days: ["Monday", "Tuesday", "Thursday"],
      hours: "10:00 - 17:00",
      status: "online"
    },
    acceptsVirtual: true
  },
  {
    id: "doc-3",
    userId: "usr-doc-sarah",
    name: "Dr. Sarah Jenkins, MD, FAAOS",
    gender: "Female",
    specialization: "Robotic Orthopedic Surgeon",
    departmentId: "dept-ortho",
    departmentName: "Orthopedics & Joint Care",
    qualification: "MD (Stanford Medicine), Fellowship in Adult Reconstruction (Mayo Clinic)",
    experience: 14,
    fee: 160,
    rating: 4.88,
    reviewCount: 167,
    roomNumber: "Room 210, East Wing",
    avatar: "https://images.unsplash.com/photo-1594824813515-58f700445d3e?auto=format&fit=crop&w=400&q=80",
    bio: "Focuses on computer-assisted robotic total joint arthroplasty, fast-track recovery, and athletic knee repairs.",
    skills: ["Robotic Knee Replacement", "Hip Resurfacing", "ACL & Meniscal Repair", "Patellofemoral Pain"],
    availability: {
      days: ["Monday", "Wednesday", "Friday"],
      hours: "08:30 - 15:30",
      status: "online"
    },
    acceptsVirtual: true
  },
  {
    id: "doc-4",
    userId: "usr-doc-vikram",
    name: "Dr. Vikram Patel, MD, FRCR",
    gender: "Male",
    specialization: "Interventional Radiologist",
    departmentId: "dept-radio",
    departmentName: "Radiology & Imaging Sciences",
    qualification: "MD (AIIMS), Fellowship in Cross-Sectional Imaging (Massachusetts General)",
    experience: 15,
    fee: 150,
    rating: 4.90,
    reviewCount: 115,
    roomNumber: "Suite 101, Radiology Wing",
    avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80",
    bio: "Expertise in high-resolution multi-parametric 3T body MRI, vascular embolization, and CT-guided biopsies.",
    skills: ["3T MRI Protocol", "Vascular Embolization", "CT Biopsy Guidance"],
    availability: {
      days: ["Tuesday", "Wednesday", "Thursday", "Saturday"],
      hours: "09:00 - 18:00",
      status: "online"
    },
    acceptsVirtual: false
  },
  {
    id: "doc-5",
    userId: "usr-doc-maya",
    name: "Dr. Maya Lin, MD, FAAP",
    gender: "Female",
    specialization: "Consultant Pediatrician",
    departmentId: "dept-pedia",
    departmentName: "Pediatrics & Neonatology",
    qualification: "MD (Columbia University), Residency (CHOP)",
    experience: 12,
    fee: 130,
    rating: 4.97,
    reviewCount: 210,
    roomNumber: "Room 220, South Wing",
    avatar: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&w=400&q=80",
    bio: "Empathetic pediatric healthcare from infancy through adolescence, newborn care, and asthma mitigation.",
    skills: ["Childhood Asthma", "Newborn Critical Monitoring", "Developmental Screening"],
    availability: {
      days: ["Monday", "Tuesday", "Wednesday", "Friday"],
      hours: "08:00 - 16:00",
      status: "online"
    },
    acceptsVirtual: true
  }
];

export const INITIAL_PATIENTS = [
  {
    id: "pat-1",
    userId: "usr-patient-alex",
    name: "Alexander Hayes",
    age: 42,
    gender: "Male",
    bloodGroup: "O+",
    phone: "+1 (555) 902-8812",
    emergencyContact: "Claire Hayes (+1 555-902-8899)",
    allergies: ["Penicillin", "Sulfa drugs"],
    chronicConditions: ["Hypertension (Grade 1)", "Mild Sleep Apnea"],
    recentVitals: {
      bloodPressure: "124/82 mmHg",
      heartRate: "72 bpm",
      oxygenSat: "98%",
      temperature: "98.6 °F",
      weight: "78 kg",
      height: "178 cm"
    }
  },
  {
    id: "pat-2",
    userId: "usr-patient-sophia",
    name: "Sophia Martinez",
    age: 29,
    gender: "Female",
    bloodGroup: "A-",
    phone: "+1 (555) 902-7714",
    emergencyContact: "Carlos Martinez (+1 555-902-7700)",
    allergies: ["Latex"],
    chronicConditions: ["Seasonal Asthma"],
    recentVitals: {
      bloodPressure: "116/74 mmHg",
      heartRate: "68 bpm",
      oxygenSat: "99%",
      temperature: "98.4 °F",
      weight: "61 kg",
      height: "165 cm"
    }
  }
];

export const INITIAL_EQUIPMENT = [
  {
    id: "eq-mri",
    name: "Siemens Magnetom 3T MRI",
    type: "mri",
    category: "Diagnostic Radiology",
    serialNumber: "MRI-3T-8821X",
    department: "Radiology & Imaging Sciences",
    location: "Radiology Suite 101, Floor 1",
    status: "operational",
    maintenanceDue: "2026-12-15",
    description: "Ultra-high field 3.0 Tesla magnetic resonance imaging suite equipped with BioMatrix technology for brain, spine, and vascular diagnostics.",
    purpose: "Non-invasive volumetric imaging without ionizing radiation for soft tissue, neurovascular evaluation, and joint pathology.",
    patientPreparation: "Remove all metallic objects, jewelry, watches. Fast for 4 hours if abdominal/contrast MRI is scheduled. Inform staff of implants, cardiac pacemakers, or claustrophobia.",
    leadPhysician: "Dr. Vikram Patel",
    threeModelType: "mri"
  },
  {
    id: "eq-ct",
    name: "Somatom Force 256-Slice Dual Source CT",
    type: "ct",
    category: "Diagnostic Radiology",
    serialNumber: "CT-256-4402F",
    department: "Radiology & Imaging Sciences",
    location: "CT Suite 102, Floor 1",
    status: "operational",
    maintenanceDue: "2026-11-20",
    description: "Sub-second coronary and whole-body dual-source computed tomography with ultra-low radiation dose algorithms.",
    purpose: "Rapid cross-sectional imaging for acute stroke, emergency trauma, pulmonary embolism, and coronary calcium scoring.",
    patientPreparation: "Check serum creatinine if IV contrast is indicated. Maintain 2-3 hours hydration. Wear provided hospital gown.",
    leadPhysician: "Dr. Vikram Patel",
    threeModelType: "ct"
  },
  {
    id: "eq-vent",
    name: "Hamilton-G5 High Performance Ventilator",
    type: "ventilator",
    category: "Life Support & Critical Care",
    serialNumber: "VENT-G5-9011C",
    department: "Intensive Care Unit (ICU)",
    location: "ICU Pod 3, Floor 3",
    status: "in_use",
    maintenanceDue: "2026-10-30",
    description: "Adaptive intelligent ventilation with closed-loop oxygenation and lung-protective ventilation.",
    purpose: "Critical mechanical ventilation for patients suffering acute respiratory distress syndrome or post-cardiac arrest.",
    patientPreparation: "Continuous sedation and endotracheal tube stabilization under 24/7 ICU nursing care.",
    leadPhysician: "Dr. Arthur Bell",
    threeModelType: "ventilator"
  },
  {
    id: "eq-ecg",
    name: "Philips PageWriter TC70 Cardiograph",
    type: "ecg",
    category: "Cardiology Monitoring",
    serialNumber: "ECG-TC70-1288",
    department: "Cardiology",
    location: "Room 302, Floor 3",
    status: "operational",
    maintenanceDue: "2027-01-10",
    description: "16-lead clinical diagnostic electrocardiograph with automated DXL ECG analysis algorithms.",
    purpose: "Evaluation of myocardial ischemia, arrhythmias, heart blocks, and baseline cardiac electrical function.",
    patientPreparation: "Rest in supine position for 5 minutes prior to recording. Keep chest bare.",
    leadPhysician: "Dr. Elena Rostova",
    threeModelType: "ecg"
  },
  {
    id: "eq-ultra",
    name: "GE Voluson E10 HD Ultrasound",
    type: "ultrasound",
    category: "Diagnostic Sonography",
    serialNumber: "US-E10-5599Z",
    department: "Radiology & Imaging Sciences",
    location: "Ultrasound Suite 3, Floor 1",
    status: "operational",
    maintenanceDue: "2026-11-05",
    description: "Radiance System Architecture providing matrix curved-array probes and color Doppler.",
    purpose: "Abdominal organ screening, vascular flow studies, musculoskeletal soft tissue tears, and neonatal sonography.",
    patientPreparation: "Full bladder needed for pelvic scans (drink 1L water 1 hour before). Fasting for 6 hours for gallbladder/liver assessment.",
    leadPhysician: "Dr. Vikram Patel",
    threeModelType: "ultrasound"
  }
];

export const INITIAL_APPOINTMENTS = [
  {
    id: "apt-101",
    patientId: "usr-patient-alex",
    patientName: "Alexander Hayes",
    patientEmail: "alexander.hayes@example.com",
    doctorId: "doc-1",
    doctorName: "Dr. Elena Rostova",
    departmentId: "dept-cardio",
    departmentName: "Cardiology",
    date: "2026-10-12",
    timeSlot: "10:30 AM",
    type: "in-person",
    status: "confirmed",
    symptoms: "Mild chest tightness following exertion, review of hypertension medication.",
    fee: 180,
    paymentStatus: "paid",
    notes: "Patient requested ECG and blood pressure trend review."
  },
  {
    id: "apt-102",
    patientId: "usr-patient-alex",
    patientName: "Alexander Hayes",
    patientEmail: "alexander.hayes@example.com",
    doctorId: "doc-4",
    doctorName: "Dr. Vikram Patel",
    departmentId: "dept-radio",
    departmentName: "Radiology & Imaging Sciences",
    date: "2026-10-15",
    timeSlot: "02:00 PM",
    type: "in-person",
    status: "confirmed",
    symptoms: "Cardiac Calcium Scoring CT scan prescribed by Dr. Rostova.",
    fee: 150,
    paymentStatus: "paid",
    notes: "Requires contrast screening check prior to table entry."
  },
  {
    id: "apt-103",
    patientId: "usr-patient-sophia",
    patientName: "Sophia Martinez",
    patientEmail: "sophia.martinez@example.com",
    doctorId: "doc-3",
    doctorName: "Dr. Sarah Jenkins",
    departmentId: "dept-ortho",
    departmentName: "Orthopedics & Joint Care",
    date: "2026-10-14",
    timeSlot: "11:15 AM",
    type: "video",
    status: "confirmed",
    symptoms: "Post-running right patellofemoral knee soreness, follow-up on physical therapy response.",
    fee: 160,
    paymentStatus: "paid",
    notes: "Virtual consultation via Medicare Secure Video portal."
  }
];

export const INITIAL_MEETINGS = [
  {
    id: "meet-1",
    title: "Virtual Orthopedic Follow-Up: Sophia Martinez",
    meetingCode: "MED-ORT-8291",
    hostDoctorId: "doc-3",
    hostDoctorName: "Dr. Sarah Jenkins",
    patientId: "usr-patient-sophia",
    patientName: "Sophia Martinez",
    department: "Orthopedics & Joint Care",
    startTime: "2026-10-14T11:15:00.000Z",
    durationMinutes: 30,
    status: "scheduled",
    agenda: "Evaluate range of motion, patellar tracking, and progressive resistance exercise regimen.",
    isSecure: true
  }
];

export const INITIAL_MEDICAL_RECORDS = [
  {
    id: "rec-1",
    patientId: "usr-patient-alex",
    patientName: "Alexander Hayes",
    doctorId: "doc-1",
    doctorName: "Dr. Elena Rostova",
    departmentName: "Cardiology",
    date: "2026-09-18",
    diagnosis: "Essential Stage 1 Hypertension with favorable cardiovascular score",
    symptoms: "Intermittent mild headache, blood pressure readings fluctuating around 138/88 mmHg at home.",
    vitals: {
      bloodPressure: "128/84 mmHg",
      heartRate: "74 bpm",
      oxygenSat: "98%",
      temperature: "98.6 °F",
      bmi: "24.6"
    },
    treatmentPlan: "Titrated Telmisartan 40mg once daily in morning. Advised DASH dietary protocol (<2g sodium/day). Scheduled cardiac calcium scoring CT in 3 weeks.",
    doctorNotes: "ECG reveals normal sinus rhythm without left ventricular hypertrophy. Patient is highly compliant with exercise guidelines."
  },
  {
    id: "rec-2",
    patientId: "usr-patient-sophia",
    patientName: "Sophia Martinez",
    doctorId: "doc-3",
    doctorName: "Dr. Sarah Jenkins",
    departmentName: "Orthopedics & Joint Care",
    date: "2026-09-24",
    diagnosis: "Patellofemoral Pain Syndrome (Right Knee)",
    symptoms: "Anterior knee discomfort while descending stairs and after 5km jogging. No joint effusion or locking.",
    vitals: {
      bloodPressure: "116/74 mmHg",
      heartRate: "68 bpm",
      oxygenSat: "99%",
      temperature: "98.4 °F",
      bmi: "22.4"
    },
    treatmentPlan: "4 weeks targeted quadriceps vastus medialis obliquus (VMO) strengthening and closed-chain resistance training. Temporary restriction of downhill running.",
    doctorNotes: "McMurray and Lachman negative. Good joint line stability. Virtual follow-up scheduled for mid-October."
  }
];

export const INITIAL_PRESCRIPTIONS = [
  {
    id: "rx-101",
    appointmentId: "apt-101",
    patientId: "usr-patient-alex",
    patientName: "Alexander Hayes",
    doctorId: "doc-1",
    doctorName: "Dr. Elena Rostova",
    date: "2026-09-18",
    status: "active",
    medications: [
      {
        name: "Telmisartan",
        dosage: "40 mg",
        frequency: "Once daily",
        duration: "90 days",
        instructions: "Morning after breakfast"
      },
      {
        name: "Rosuvastatin",
        dosage: "10 mg",
        frequency: "Once daily",
        duration: "90 days",
        instructions: "Bedtime for plaque stabilization"
      }
    ],
    doctorNotes: "Avoid NSAIDs such as Ibuprofen without checking with the clinic."
  },
  {
    id: "rx-102",
    appointmentId: "apt-103",
    patientId: "usr-patient-sophia",
    patientName: "Sophia Martinez",
    doctorId: "doc-3",
    doctorName: "Dr. Sarah Jenkins",
    date: "2026-09-24",
    status: "active",
    medications: [
      {
        name: "Celecoxib",
        dosage: "100 mg",
        frequency: "Twice daily as needed",
        duration: "7 days",
        instructions: "With meals during activity inflammation"
      }
    ],
    doctorNotes: "Ice pack application for 15 minutes post-exercise."
  }
];

export const INITIAL_PHARMACY = [
  {
    id: "med-1",
    name: "Telmisartan 40mg",
    category: "Antihypertensive (ARB)",
    brand: "Micardis / Generic",
    stockQuantity: 420,
    minAlertLevel: 50,
    unitPrice: 18.50,
    expiryDate: "2028-04-15",
    rackLocation: "Rack B-04"
  },
  {
    id: "med-2",
    name: "Rosuvastatin 10mg",
    category: "Lipid Lowering / Statin",
    brand: "Crestor / Generic",
    stockQuantity: 310,
    minAlertLevel: 40,
    unitPrice: 22.00,
    expiryDate: "2027-11-30",
    rackLocation: "Rack B-08"
  },
  {
    id: "med-3",
    name: "Celecoxib 100mg",
    category: "NSAID / COX-2 Selective",
    brand: "Celebrex / Generic",
    stockQuantity: 185,
    minAlertLevel: 30,
    unitPrice: 28.50,
    expiryDate: "2027-08-20",
    rackLocation: "Rack C-02"
  },
  {
    id: "med-4",
    name: "Amoxicillin-Clavulanate 625mg",
    category: "Antibacterial",
    brand: "Augmentin",
    stockQuantity: 24,
    minAlertLevel: 35,
    unitPrice: 34.00,
    expiryDate: "2027-03-10",
    rackLocation: "Rack A-01"
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: "notif-1",
    userId: "usr-patient-alex",
    role: "patient",
    title: "Appointment Confirmed",
    message: "Your in-person Cardiology appointment with Dr. Elena Rostova on Oct 12 at 10:30 AM is confirmed.",
    type: "appointment",
    isRead: false,
    createdAt: "2026-10-07T14:20:00.000Z",
    link: "/appointments"
  },
  {
    id: "notif-2",
    userId: "usr-patient-alex",
    role: "patient",
    title: "Lab Result Ready",
    message: "Comprehensive Metabolic Panel & Lipid Profile results are now available in your health records.",
    type: "lab_result",
    isRead: false,
    createdAt: "2026-10-08T01:10:00.000Z",
    link: "/records"
  },
  {
    id: "notif-3",
    userId: "usr-doc-elena",
    role: "doctor",
    title: "New Patient Scheduled",
    message: "Alexander Hayes booked a consultation slot on Oct 12, 10:30 AM.",
    type: "appointment",
    isRead: false,
    createdAt: "2026-10-07T14:20:00.000Z",
    link: "/appointments"
  },
  {
    id: "notif-4",
    userId: null,
    role: "all",
    title: "Hospital System Announcement",
    message: "Siemens MAGNETOM 3T MRI firmware calibration completed. All imaging suites operating at 100% capacity.",
    type: "system",
    isRead: false,
    createdAt: "2026-10-08T01:30:00.000Z",
    link: "/equipment"
  }
];

export const HOSPITAL_NAV_DESTINATIONS = [
  {
    id: "nav-mri",
    title: "MRI Scan (Magnetic Resonance Imaging)",
    category: "Radiology",
    floor: "1st Floor, Basement Wing A",
    room: "MRI Suite 101",
    steps: [
      { step: 1, title: "Enter Hospital Main Atrium", instruction: "Check in at Central Reception or self-service kiosk to validate appointment." },
      { step: 2, title: "Take Radiology Elevators (Wing A)", instruction: "Head past Pharmacy toward the Blue Elevator Bank. Press Floor 1." },
      { step: 3, title: "Radiology Reception Desk", instruction: "Present your clinical order to Desk 2. Complete metal screening checklist." },
      { step: 4, title: "Enter Siemens 3T MRI Suite 101", instruction: "Radiologic Technologist will guide you onto the scanner table." }
    ]
  },
  {
    id: "nav-ct",
    title: "CT Scan (Computed Tomography)",
    category: "Radiology",
    floor: "1st Floor, Basement Wing A",
    room: "CT Suite 102",
    steps: [
      { step: 1, title: "Main Lobby Entrance", instruction: "Proceed through Security to the Diagnostic Corridor." },
      { step: 2, title: "CT Suite 102", instruction: "Follow the Yellow floor line directly to CT Suite 102 entrance." }
    ]
  },
  {
    id: "nav-cardio",
    title: "Cardiology Outpatient Clinic & Echo Lab",
    category: "Cardiology",
    floor: "3rd Floor, West Wing",
    room: "Room 301 & Room 302",
    steps: [
      { step: 1, title: "West Wing Elevator Bank", instruction: "Take West Tower elevators directly to Floor 3." },
      { step: 2, title: "Cardiology Welcome Station", instruction: "Turn left off the elevator. Check in with Nurse Clara Higgins at Desk 3A." },
      { step: 3, title: "Consultation Room 301", instruction: "Meeting with Dr. Elena Rostova." }
    ]
  },
  {
    id: "nav-er",
    title: "Emergency & Rapid Trauma Center",
    category: "Emergency",
    floor: "Ground Floor, Direct Ramp Access",
    room: "Emergency Triage Bay 1-4",
    steps: [
      { step: 1, title: "Emergency Red Canopy Entrance", instruction: "Dedicated vehicle ramp on East Campus entrance with 24/7 triage." },
      { step: 2, title: "Immediate Triage Desk", instruction: "Immediate nursing assessment for acuity level (Level 1-5)." }
    ]
  }
];
