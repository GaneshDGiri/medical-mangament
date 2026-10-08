/**
 * MediCare AI - Authentication & RBAC Middleware (JavaScript)
 */

import jwt from "jsonwebtoken";
import { db } from "../services/db.js";

const JWT_SECRET = process.env.JWT_SECRET || "medicare_super_secure_jwt_secret_key_2026";

export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export async function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, message: "Authorization token required" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await db.users.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: "User session expired or user not found" });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: "Invalid or expired authorization token" });
  }
}

/**
 * Role-Based Access Control (RBAC) middleware
 * Ensures only users with one of the allowedRoles can proceed.
 */
export function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `RBAC Access Denied: Role '${req.user.role}' is not authorized to perform this operation. Required: [${allowedRoles.join(", ")}]`
      });
    }

    next();
  };
}

/**
 * Patient Record Access Restriction
 * Patients can strictly ONLY view and modify their own records.
 * Doctors, Nurses, and Admins can view based on their clinical roles.
 */
export function verifyPatientOwnership(patientIdParam = "patientId") {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }

    // Admins, Doctors, and Nurses have clinical authorization
    if (["super_admin", "hospital_admin", "doctor", "nurse", "receptionist"].includes(req.user.role)) {
      return next();
    }

    const requestedId = req.params[patientIdParam] || req.body[patientIdParam] || req.query[patientIdParam];
    if (req.user.role === "patient" && requestedId && requestedId !== req.user.id && requestedId !== req.user.email) {
      return res.status(403).json({
        success: false,
        message: "RBAC Privacy Violation: Patients are strictly restricted to their own medical data."
      });
    }

    next();
  };
}
