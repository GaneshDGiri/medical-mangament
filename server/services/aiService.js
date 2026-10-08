/**
 * MediCare AI - AI Service Integration (JavaScript)
 * Gemini-powered Hospital Assistant & Natural Language Clinical Search
 */

import { GoogleGenAI } from "@google/genai";
import { db } from "./db.js";

const apiKey = process.env.GEMINI_API_KEY || "";
let aiClient = null;

if (apiKey) {
  try {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  } catch (err) {
    console.warn("Failed to initialize GoogleGenAI client:", err);
  }
}

const SYSTEM_INSTRUCTION = `
You are the MediCare AI Hospital Assistant for "MediCare AI — Smart Hospital Management System".
Your role is to guide patients, visitors, and clinical staff with:
1. Hospital navigation & directions (Floors, wings, rooms, department locations).
2. Department overviews & services (Cardiology, Neurology, Orthopedics, Radiology, Pediatrics, General Medicine, ER, ICU).
3. Doctor schedules, bios, credentials, and appointment guidance.
4. Medical equipment explanations & patient preparation instructions (e.g., MRI fasting & metal precautions, CT contrast hydration, Ultrasound bladder prep).
5. General procedure instructions and appointment preparation.
6. Preliminary symptom context WITH A MANDATORY DISCLAIMER that you are an AI assistant and not a substitute for a licensed healthcare provider. If symptoms suggest an emergency (e.g., severe chest pressure, sudden numbness/paralysis, difficulty breathing, major trauma), strictly direct the user to the nearest Emergency Room or dial 911 / emergency hotline immediately.
`;

export async function askHospitalAI(prompt, conversationHistory = []) {
  const doctors = await db.doctors.find();
  const departments = await db.departments.find();
  const equipment = await db.equipment.find();
  const routes = await db.navigationRoutes.find();

  const hospitalContext = `
Hospital Knowledge Context:
- Available Departments: ${departments.map((d) => `${d.name} (${d.floor}, Room: ${d.rooms?.join(", ")})`).join("; ")}
- Featured Doctors: ${doctors.map((doc) => `${doc.name} (${doc.specialization}, ${doc.departmentName}, Fee: $${doc.fee}, Rating: ${doc.rating}/5.0)`).join("; ")}
- High-Tech Equipment: ${equipment.map((eq) => `${eq.name} in ${eq.department} (${eq.location})`).join("; ")}
- Navigation routes: ${routes.map((r) => `${r.title} at ${r.floor}`).join("; ")}
- Emergency Department: 24/7 Level 1 Trauma Center, Ground Floor East Ramp. Emergency Hotline: +1 (800) 555-9911.
`;

  if (aiClient && apiKey) {
    try {
      const messagesFormatted = conversationHistory
        .slice(-4)
        .map((msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`)
        .join("\n");
      const fullPrompt = `${hospitalContext}\n\nRecent Conversation:\n${messagesFormatted}\n\nUser Question: ${prompt}`;

      const response = await aiClient.models.generateContent({
        model: "gemini-3.8-flash",
        contents: fullPrompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
        },
      });

      const responseText = response.text;
      if (responseText && responseText.trim()) {
        return {
          reply: responseText,
          suggestedActions: extractSuggestedActions(prompt, doctors, departments),
          disclaimer: "Notice: MediCare AI is an informational guide and not a substitute for professional medical advice. In an emergency, dial 911 immediately."
        };
      }
    } catch (err) {
      console.warn("Gemini API call encountered error, activating hospital fallback:", err?.message || err);
    }
  }

  return generateContextualFallback(prompt, doctors, departments, equipment, routes);
}

/**
 * Natural Language AI-Powered Search across Hospital Entities
 */
export async function aiSearchHospital(query, user = null) {
  const q = String(query || "").trim().toLowerCase();
  const doctors = await db.doctors.find();
  const departments = await db.departments.find();
  const equipment = await db.equipment.find();
  const routes = await db.navigationRoutes.find();
  let appointments = await db.appointments.find();

  if (user && user.role === "patient") {
    appointments = appointments.filter(
      (a) => a.patientId === user.id || a.patientEmail === user.email
    );
  }

  let aiInterpretation = "";
  let recommendedAction = null;

  // If Gemini API is available, ask it to parse natural language intent & extract clinical entity matches
  if (aiClient && apiKey && q.length > 3) {
    try {
      const prompt = `
Analyze the user's natural language healthcare search query: "${query}"
Context about our hospital:
- Doctors: ${doctors.map((d) => `${d.id}: ${d.name} (${d.specialization}, ${d.departmentName})`).join("; ")}
- Departments: ${departments.map((d) => `${d.id}: ${d.name} (${d.description})`).join("; ")}
- Equipment: ${equipment.map((e) => `${e.id}: ${e.name} (${e.purpose})`).join("; ")}
- Locations/Routes: ${routes.map((r) => `${r.id}: ${r.title} (${r.floor})`).join("; ")}

Return a short, clear JSON object explaining the interpretation:
{
  "summary": "1 sentence explanation of what the user is looking for and the matched specialty",
  "matchedDoctorIds": ["id"],
  "matchedDeptIds": ["id"],
  "matchedEquipmentIds": ["id"],
  "matchedRouteIds": ["id"],
  "recommendedAction": "1 concise next step recommendation"
}
`;

      const res = await aiClient.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.2,
        },
      });

      const parsed = JSON.parse(res.text || "{}");
      aiInterpretation = parsed.summary || "";
      recommendedAction = parsed.recommendedAction || null;

      // Filter matched items based on AI suggestions if provided
      if (parsed.matchedDoctorIds?.length > 0 || parsed.matchedDeptIds?.length > 0) {
        const matchedDocs = doctors.filter((d) =>
          parsed.matchedDoctorIds?.includes(d.id) ||
          d.name.toLowerCase().includes(q) ||
          d.specialization.toLowerCase().includes(q)
        );
        const matchedDepts = departments.filter((dept) =>
          parsed.matchedDeptIds?.includes(dept.id) ||
          dept.name.toLowerCase().includes(q)
        );
        const matchedEq = equipment.filter((eq) =>
          parsed.matchedEquipmentIds?.includes(eq.id) ||
          eq.name.toLowerCase().includes(q)
        );
        const matchedRoutes = routes.filter((r) =>
          parsed.matchedRouteIds?.includes(r.id) ||
          r.title.toLowerCase().includes(q)
        );

        return {
          aiInterpretation,
          recommendedAction,
          results: {
            doctors: matchedDocs,
            departments: matchedDepts,
            equipment: matchedEq,
            navigation: matchedRoutes,
            appointments: appointments.filter(
              (a) =>
                a.doctorName.toLowerCase().includes(q) ||
                a.departmentName.toLowerCase().includes(q) ||
                a.symptoms.toLowerCase().includes(q)
            )
          }
        };
      }
    } catch (err) {
      console.warn("AI natural language parse error, using semantic matcher:", err?.message || err);
    }
  }

  // Semantic Token Matcher fallback
  const matchedDoctors = doctors.filter((d) =>
    d.name.toLowerCase().includes(q) ||
    d.specialization.toLowerCase().includes(q) ||
    d.departmentName.toLowerCase().includes(q) ||
    (d.gender && q.includes(d.gender.toLowerCase())) ||
    d.skills?.some((s) => s.toLowerCase().includes(q)) ||
    (q.includes("heart") && d.departmentName.includes("Cardiology")) ||
    (q.includes("knee") && d.departmentName.includes("Orthopedics")) ||
    (q.includes("brain") && d.departmentName.includes("Neurology")) ||
    (q.includes("child") && d.departmentName.includes("Pediatrics"))
  );

  const matchedDepartments = departments.filter((dept) =>
    dept.name.toLowerCase().includes(q) ||
    dept.description.toLowerCase().includes(q) ||
    dept.services?.some((s) => s.toLowerCase().includes(q)) ||
    (q.includes("heart") && dept.name.includes("Cardiology")) ||
    (q.includes("scan") && dept.name.includes("Radiology")) ||
    (q.includes("bone") && dept.name.includes("Orthopedics"))
  );

  const matchedEquipment = equipment.filter((eq) =>
    eq.name.toLowerCase().includes(q) ||
    eq.type.toLowerCase().includes(q) ||
    eq.purpose.toLowerCase().includes(q) ||
    eq.department.toLowerCase().includes(q) ||
    (q.includes("mri") && eq.type === "mri") ||
    (q.includes("ct") && eq.type === "ct") ||
    (q.includes("breathing") && eq.type === "ventilator")
  );

  const matchedRoutes = routes.filter((r) =>
    r.title.toLowerCase().includes(q) ||
    r.category.toLowerCase().includes(q) ||
    r.floor.toLowerCase().includes(q)
  );

  const matchedAppointments = appointments.filter((a) =>
    a.doctorName.toLowerCase().includes(q) ||
    a.departmentName.toLowerCase().includes(q) ||
    a.date.toLowerCase().includes(q) ||
    a.symptoms.toLowerCase().includes(q)
  );

  // Generate smart AI interpretation note
  if (q.includes("heart") || q.includes("chest") || q.includes("cardio")) {
    aiInterpretation = "Interpreted cardiovascular query: Showing Cardiology department, 3D ECG monitoring, and Dr. Elena Rostova.";
    recommendedAction = "Schedule consultation in Room 301 or dial emergency for severe chest distress.";
  } else if (q.includes("knee") || q.includes("joint") || q.includes("ortho")) {
    aiInterpretation = "Interpreted musculoskeletal query: Showing Orthopedics & Joint Care and Dr. Sarah Jenkins.";
    recommendedAction = "Book in-person physical evaluation at Room 210, East Wing.";
  } else if (q.includes("mri") || q.includes("scan") || q.includes("imaging")) {
    aiInterpretation = "Interpreted radiological diagnostic imaging query: Showing Siemens 3T MRI, CT suites, and turn-by-turn route.";
    recommendedAction = "Check prep guidelines (fasting & metal screening) and navigate to Floor 1 Suite 101.";
  } else if (q.includes("emergency") || q.includes("urgent")) {
    aiInterpretation = "Urgent triage request detected: Level 1 Trauma Center is open 24/7 on Ground Floor East Ramp.";
    recommendedAction = "Dial 911 or proceed directly to Ground Floor Emergency Valet.";
  } else {
    aiInterpretation = `Query interpreted across clinical registry for "${query}".`;
  }

  return {
    aiInterpretation,
    recommendedAction,
    results: {
      doctors: matchedDoctors,
      departments: matchedDepartments,
      equipment: matchedEquipment,
      navigation: matchedRoutes,
      appointments: matchedAppointments
    }
  };
}

function extractSuggestedActions(query, doctors, departments) {
  const q = query.toLowerCase();
  const actions = [];
  if (q.includes("cardio") || q.includes("heart")) {
    actions.push({ label: "Book Dr. Elena Rostova (Cardiology)", link: "/appointments?dept=dept-cardio" });
    actions.push({ label: "Cardiology Floor Guide", link: "/navigation?dest=nav-cardio" });
  } else if (q.includes("mri") || q.includes("scan") || q.includes("radio")) {
    actions.push({ label: "MRI Scan Preparation Guide", link: "/equipment" });
    actions.push({ label: "Radiology Navigation (Floor 1)", link: "/navigation?dest=nav-mri" });
  } else if (q.includes("neuro") || q.includes("brain") || q.includes("spine")) {
    actions.push({ label: "View Dr. Marcus Vance Profile", link: "/doctors" });
    actions.push({ label: "Neurology Department", link: "/departments" });
  } else if (q.includes("emergency") || q.includes("urgent") || q.includes("chest pain")) {
    actions.push({ label: "Open Emergency Hotline Mode", action: "emergency_modal" });
  } else {
    actions.push({ label: "Browse All Doctors", link: "/doctors" });
    actions.push({ label: "Explore Hospital Map", link: "/navigation" });
  }
  return actions;
}

function generateContextualFallback(prompt, doctors, departments, equipment, routes) {
  const q = prompt.toLowerCase();

  if (q.includes("emergency") || q.includes("severe") || q.includes("chest pain") || q.includes("shortness of breath")) {
    return {
      reply: `⚠️ **EMERGENCY ASSISTANCE NEEDED**:
If you or someone nearby is experiencing acute chest pain, severe breathlessness, or heavy bleeding, please **proceed directly to our Emergency Department** or call emergency services immediately:

* **Hospital Emergency Hotline:** +1 (800) 555-9911
* **National Emergency:** 911
* **Location:** Ground Floor, East Ramp (Red Canopy 24/7 Access)
* **Lead ER Physician On Duty:** Dr. Chloe Adams`,
      suggestedActions: [
        { label: "Emergency Hotline Alert", action: "emergency_modal" },
        { label: "Emergency Center Directions", link: "/navigation?dest=nav-er" }
      ],
      disclaimer: "Emergency Notice: MediCare AI is not an emergency triage replacement. Seek immediate emergency care."
    };
  }

  if (q.includes("mri") || q.includes("magnetic resonance")) {
    return {
      reply: `### MRI Scan (Siemens MAGNETOM 3T) Information
* **Location:** Radiology & Imaging Sciences, 1st Floor, Suite 101.
* **Lead Radiologist:** Dr. Vikram Patel, MD, FRCR.
* **Patient Preparation:**
  1. Remove all metal objects (jewelry, belts, piercings, hearing aids).
  2. Fast for 4 hours if abdominal or IV contrast scan is scheduled.
  3. Inform staff of any pacemaker or metal implants.`,
      suggestedActions: [
        { label: "View 3D MRI Machine in Explorer", link: "/equipment" },
        { label: "Navigate to MRI Suite 101", link: "/navigation?dest=nav-mri" }
      ],
      disclaimer: "MediCare AI Informational Guidance."
    };
  }

  return {
    reply: `Hello! I'm your **MediCare AI Assistant**. I can assist you with:
- Finding doctors and checking their available consultation slots.
- Explaining hospital departments, equipment (MRI, CT, Ventilator, ECG), and procedure preparation.
- Giving turn-by-turn directions within our medical center.
- Scheduling appointments or virtual video consultations.

How can I help you today? In an emergency, dial **+1 (800) 555-9911** immediately.`,
    suggestedActions: [
      { label: "Book Doctor Appointment", link: "/appointments" },
      { label: "View Equipment Explorer (3D)", link: "/equipment" },
      { label: "Interactive Hospital Navigation", link: "/navigation" }
    ],
    disclaimer: "Disclaimer: MediCare AI provides general informational assistance and cannot replace formal medical evaluation."
  };
}
