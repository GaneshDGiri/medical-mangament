import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import BackButton from "../components/common/BackButton";
import {
  Pill,
  Search,
  AlertTriangle,
  Plus,
  RefreshCw,
  Clock,
  MapPin,
  CheckCircle2
} from "lucide-react";
import toast from "react-hot-toast";

export default function PharmacyPage() {
  const { user } = useAuth();
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadPharmacy = async () => {
    try {
      const res = await api.get("/pharmacy");
      if (res.data.success) {
        setMedicines(res.data.medicines || []);
      }
    } catch (err) {
      console.error("Failed to load pharmacy", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPharmacy();
  }, []);

  const handleRestock = async (id, currentQty) => {
    try {
      const res = await api.put(`/pharmacy/${id}`, { stockQuantity: currentQty + 100 });
      if (res.data.success) {
        toast.success("Restocked +100 units");
        setMedicines((prev) =>
          prev.map((m) => (m.id === id ? { ...m, stockQuantity: currentQty + 100 } : m))
        );
      }
    } catch (err) {
      toast.error("Restock failed");
    }
  };

  const filtered = medicines.filter((m) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return m.name.toLowerCase().includes(q) || m.category.toLowerCase().includes(q) || m.rackLocation.toLowerCase().includes(q);
  });

  const lowStockItems = medicines.filter((m) => m.stockQuantity <= m.minAlertLevel);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <BackButton fallback="/dashboard" label="Back to Dashboard" className="mb-4" />
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-teal-600 dark:text-teal-400 mb-1">
            <span>Hospital Pharmacy</span>
            <span aria-hidden="true">·</span>
            <span>Inventory & Formulary</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Pharmacy Inventory & Stock
          </h1>
        </div>

        {/* Low Stock Warning */}
        {lowStockItems.length > 0 && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200 flex items-start gap-3 text-xs">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Critical Low-Stock Alerts</p>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                {lowStockItems.map((m) => `${m.name} (${m.stockQuantity} left)`).join(", ")}. Restock requested.
              </p>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search medicine by generic name, therapeutic class, rack location..."
            className="flex-1 text-xs bg-transparent border-none outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
          />
        </div>

        {/* Medicines Table */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm overflow-hidden text-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold text-[10px] uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3">Medicine & Brand</th>
                  <th className="px-6 py-3">Therapeutic Class</th>
                  <th className="px-6 py-3">In-Stock Quantity</th>
                  <th className="px-6 py-3">Location</th>
                  <th className="px-6 py-3">Expiry Date</th>
                  <th className="px-6 py-3 text-right">Unit Price</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((med) => {
                  const isLow = med.stockQuantity <= med.minAlertLevel;
                  return (
                    <tr key={med.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900 dark:text-white">{med.name}</p>
                        <p className="text-[11px] text-slate-400">{med.brand}</p>
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{med.category}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`font-mono font-bold ${
                            isLow ? "text-rose-600 dark:text-rose-400 animate-pulse" : "text-slate-900 dark:text-white"
                          }`}
                        >
                          {med.stockQuantity} units
                        </span>
                        {isLow && <span className="ml-2 text-[10px] text-rose-500 font-medium">Low Stock</span>}
                      </td>
                      <td className="px-6 py-4 font-mono text-slate-500">{med.rackLocation}</td>
                      <td className="px-6 py-4 font-mono text-slate-500">{med.expiryDate}</td>
                      <td className="px-6 py-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                        ${med.unitPrice.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleRestock(med.id, med.stockQuantity)}
                          className="px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 hover:bg-teal-100 transition-colors"
                        >
                          + Restock 100
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
