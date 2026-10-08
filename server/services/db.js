/**
 * MediCare AI - Database Persistence Service (JavaScript)
 */

import {
  INITIAL_USERS,
  INITIAL_DOCTORS,
  INITIAL_PATIENTS,
  INITIAL_DEPARTMENTS,
  INITIAL_APPOINTMENTS,
  INITIAL_MEETINGS,
  INITIAL_MEDICAL_RECORDS,
  INITIAL_PRESCRIPTIONS,
  INITIAL_PHARMACY,
  INITIAL_EQUIPMENT,
  INITIAL_NOTIFICATIONS,
  HOSPITAL_NAV_DESTINATIONS
} from "../data/seedData.js";

class Collection {
  constructor(name, initialItems = []) {
    this.name = name;
    this.items = new Map();
    initialItems.forEach((item) => {
      const id = item.id || item._id || `${name.toLowerCase()}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
      this.items.set(id, { ...item, id, _id: id });
    });
  }

  async find(filter = {}) {
    const all = Array.from(this.items.values());
    if (Object.keys(filter).length === 0) return all;

    return all.filter((item) => {
      for (const [key, val] of Object.entries(filter)) {
        if (typeof val === "object" && val !== null) {
          if ("$regex" in val) {
            const regex = new RegExp(val.$regex, val.$options || "i");
            if (!regex.test(String(item[key] || ""))) return false;
          } else if ("$in" in val) {
            if (!val.$in.includes(item[key])) return false;
          }
        } else if (item[key] !== val) {
          return false;
        }
      }
      return true;
    });
  }

  async findById(id) {
    return this.items.get(id) || null;
  }

  async findOne(filter) {
    const results = await this.find(filter);
    return results[0] || null;
  }

  async create(data) {
    const id = data.id || data._id || `${this.name.toLowerCase()}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const created = {
      ...data,
      id,
      _id: id,
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.items.set(id, created);
    return created;
  }

  async findByIdAndUpdate(id, update, options = { new: true }) {
    const existing = this.items.get(id);
    if (!existing) return null;
    const updated = {
      ...existing,
      ...update,
      id,
      _id: id,
      updatedAt: new Date().toISOString()
    };
    this.items.set(id, updated);
    return options.new ? updated : existing;
  }

  async findByIdAndDelete(id) {
    const existing = this.items.get(id);
    if (existing) {
      this.items.delete(id);
      return existing;
    }
    return null;
  }

  async countDocuments(filter = {}) {
    const results = await this.find(filter);
    return results.length;
  }
}

export const db = {
  users: new Collection("User", INITIAL_USERS),
  doctors: new Collection("Doctor", INITIAL_DOCTORS),
  patients: new Collection("Patient", INITIAL_PATIENTS),
  departments: new Collection("Department", INITIAL_DEPARTMENTS),
  appointments: new Collection("Appointment", INITIAL_APPOINTMENTS),
  meetings: new Collection("Meeting", INITIAL_MEETINGS),
  medicalRecords: new Collection("MedicalRecord", INITIAL_MEDICAL_RECORDS),
  prescriptions: new Collection("Prescription", INITIAL_PRESCRIPTIONS),
  pharmacy: new Collection("Medicine", INITIAL_PHARMACY),
  equipment: new Collection("Equipment", INITIAL_EQUIPMENT),
  notifications: new Collection("Notification", INITIAL_NOTIFICATIONS),
  navigationRoutes: new Collection("Navigation", HOSPITAL_NAV_DESTINATIONS)
};
