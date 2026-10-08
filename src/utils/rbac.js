/**
 * MediCare AI - Role-Based Access Control (RBAC) Permissions Helper (JavaScript)
 */

export const ROLES = {
  SUPER_ADMIN: "super_admin",
  HOSPITAL_ADMIN: "hospital_admin",
  DOCTOR: "doctor",
  NURSE: "nurse",
  RECEPTIONIST: "receptionist",
  PATIENT: "patient"
};

export const ROLE_LABELS = {
  [ROLES.SUPER_ADMIN]: "Super Administrator",
  [ROLES.HOSPITAL_ADMIN]: "Hospital Operations Admin",
  [ROLES.DOCTOR]: "Attending Physician / Doctor",
  [ROLES.NURSE]: "Registered Nurse / Ward Staff",
  [ROLES.RECEPTIONIST]: "Patient Admissions / Receptionist",
  [ROLES.PATIENT]: "Registered Patient"
};

export const PERMISSIONS = {
  // Clinical
  ADD_DIAGNOSIS: [ROLES.SUPER_ADMIN, ROLES.HOSPITAL_ADMIN, ROLES.DOCTOR],
  ISSUE_PRESCRIPTION: [ROLES.SUPER_ADMIN, ROLES.DOCTOR],
  RECORD_VITALS: [ROLES.SUPER_ADMIN, ROLES.HOSPITAL_ADMIN, ROLES.DOCTOR, ROLES.NURSE],
  VIEW_ALL_RECORDS: [ROLES.SUPER_ADMIN, ROLES.HOSPITAL_ADMIN, ROLES.DOCTOR, ROLES.NURSE],

  // Admissions & Scheduling
  ADMIT_PATIENT: [ROLES.SUPER_ADMIN, ROLES.HOSPITAL_ADMIN, ROLES.RECEPTIONIST, ROLES.NURSE],
  APPROVE_APPOINTMENT: [ROLES.SUPER_ADMIN, ROLES.HOSPITAL_ADMIN, ROLES.DOCTOR, ROLES.RECEPTIONIST],
  BOOK_APPOINTMENT: [ROLES.SUPER_ADMIN, ROLES.HOSPITAL_ADMIN, ROLES.RECEPTIONIST, ROLES.PATIENT, ROLES.DOCTOR],

  // Hospital Resources
  MANAGE_EQUIPMENT: [ROLES.SUPER_ADMIN, ROLES.HOSPITAL_ADMIN],
  DISPENSE_PHARMACY: [ROLES.SUPER_ADMIN, ROLES.HOSPITAL_ADMIN, ROLES.NURSE],
  BROADCAST_SYSTEM_ALERTS: [ROLES.SUPER_ADMIN, ROLES.HOSPITAL_ADMIN, ROLES.DOCTOR],
  VIEW_EXECUTIVE_ANALYTICS: [ROLES.SUPER_ADMIN, ROLES.HOSPITAL_ADMIN]
};

export function hasPermission(user, permissionKey) {
  if (!user || !user.role) return false;
  const allowed = PERMISSIONS[permissionKey];
  return Array.isArray(allowed) && allowed.includes(user.role);
}

export function canAccessPatientRecord(user, recordPatientId) {
  if (!user) return false;
  if ([ROLES.SUPER_ADMIN, ROLES.HOSPITAL_ADMIN, ROLES.DOCTOR, ROLES.NURSE].includes(user.role)) {
    return true;
  }
  if (user.role === ROLES.PATIENT) {
    return user.id === recordPatientId || user.email === recordPatientId;
  }
  return false;
}
