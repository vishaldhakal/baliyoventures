"use client";

import PaginationControls from "@/components/admin/PaginationControls";
import { Vendor } from "@/types/projects";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  Building2,
  Loader2,
  MapPin,
  Pencil,
  Phone,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function VendorsView() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Create Form State
  const [showAddVendorForm, setShowAddVendorForm] = useState(false);
  const [vendorName, setVendorName] = useState("");
  const [vendorPhone, setVendorPhone] = useState("");
  const [vendorAddress, setVendorAddress] = useState("");
  const [addingVendor, setAddingVendor] = useState(false);

  // Edit Modal State
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [updatingVendor, setUpdatingVendor] = useState(false);

  // Delete Modal State
  const [deletingVendor, setDeletingVendor] = useState<Vendor | null>(null);
  const [deletingVen, setDeletingVen] = useState(false);

  const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://yachu.baliyoventures.com/api/baliyo";

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const pageSize = 10;

  const fetchVendors = async (page = 1, query = searchTerm) => {
    setLoading(true);
    try {
      const searchParam = query.trim() ? `&search=${encodeURIComponent(query.trim())}` : "";
      const res = await fetch(`${apiBase}/vendors/?page=${page}&page_size=${pageSize}${searchParam}`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setVendors(Array.isArray(data) ? data : data.results || []);
        if (!Array.isArray(data)) {
          setTotalCount(data.count || 0);
          setHasNext(!!data.next);
          setHasPrev(!!data.previous);
        }
        setCurrentPage(page);
      }
    } catch (err) {
      console.error("Failed to fetch vendors:", err);
    } finally {
      setLoading(false);
    }
  };

  // Debounced backend search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchVendors(1, searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleCreateVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorName.trim()) return;
    setAddingVendor(true);
    try {
      const res = await fetch(`${apiBase}/vendors/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: vendorName,
          phone_no: vendorPhone || "0000000000",
          vendor_address: vendorAddress,
        }),
      });
      if (res.ok) {
        setVendorName("");
        setVendorPhone("");
        setVendorAddress("");
        setShowAddVendorForm(false);
        fetchVendors(1, searchTerm);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAddingVendor(false);
    }
  };

  const handleOpenEditVendor = (v: Vendor) => {
    setEditingVendor(v);
    setEditName(v.name);
    setEditPhone(v.phone_no || "");
    setEditAddress(v.vendor_address || "");
  };

  const handleUpdateVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVendor || !editName.trim()) return;
    setUpdatingVendor(true);
    const identifier = editingVendor.slug || editingVendor.id;
    try {
      const res = await fetch(`${apiBase}/vendors/${identifier}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          phone_no: editPhone,
          vendor_address: editAddress,
        }),
      });
      if (res.ok) {
        setEditingVendor(null);
        fetchVendors(currentPage, searchTerm);
      }
    } catch (err) {
      console.error("Failed to update vendor:", err);
    } finally {
      setUpdatingVendor(false);
    }
  };

  const handleDeleteVendor = async () => {
    if (!deletingVendor) return;
    setDeletingVen(true);
    const identifier = deletingVendor.slug || deletingVendor.id;
    try {
      const res = await fetch(`${apiBase}/vendors/${identifier}/`, {
        method: "DELETE",
      });
      if (res.ok) {
        setDeletingVendor(null);
        fetchVendors(currentPage, searchTerm);
      }
    } catch (err) {
      console.error("Failed to delete vendor:", err);
    } finally {
      setDeletingVen(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Vendors & Suppliers
          </h1>
        </div>
        <button
          onClick={() => setShowAddVendorForm(!showAddVendorForm)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-all cursor-pointer shadow-xs shrink-0"
        >
          <Plus className="h-4 w-4 text-white" />
          Add Vendor Profile
        </button>
      </div>



      {/* Vendors Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-3 shadow-xs">
        <Search className="h-4 w-4 text-slate-400 shrink-0" />
        <input
          type="text"
          placeholder="Search vendors by name, phone, or address..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 bg-transparent text-xs text-slate-900 outline-none placeholder-slate-400 font-sans"
        />
      </div>

      {/* Top Pagination Controls */}
      <PaginationControls
        currentPage={currentPage}
        totalCount={totalCount}
        pageSize={pageSize}
        onPageChange={(page) => fetchVendors(page, searchTerm)}
        loading={loading}
        itemLabel="vendors"
      />

      {/* Vendors Table List */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 text-slate-600 animate-spin" />
          </div>
        ) : vendors.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400 italic font-sans">
            {searchTerm ? `No vendors found matching "${searchTerm}".` : "No vendors registered yet. Click \"Add Vendor Profile\" above to create one."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-sans">
              <thead>
                <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-600 font-semibold">
                  <th className="px-6 py-3.5">Vendor / Supplier Name</th>
                  <th className="px-6 py-3.5">Phone Number</th>
                  <th className="px-6 py-3.5">Address / Location</th>
                  <th className="px-6 py-3.5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {vendors.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-3.5 font-semibold text-slate-900 text-sm flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-slate-500 shrink-0" />
                      {v.name}
                    </td>
                    <td className="px-6 py-3.5 text-slate-600 font-mono">
                      {v.phone_no ? (
                        <span className="flex items-center gap-1.5">
                          <Phone className="h-3.5 w-3.5 text-slate-400" />
                          {v.phone_no}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Not provided</span>
                      )}
                    </td>
                    <td className="px-6 py-3.5 text-slate-600">
                      {v.vendor_address ? (
                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          {v.vendor_address}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Not provided</span>
                      )}
                    </td>
                    <td className="px-6 py-3.5 whitespace-nowrap text-center">
                      <div className="flex justify-center items-center gap-2">
                        <button
                          onClick={() => handleOpenEditVendor(v)}
                          title="Edit Vendor"
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all cursor-pointer"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingVendor(v)}
                          title="Delete Vendor"
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-all cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Bottom Pagination Controls */}
      <PaginationControls
        currentPage={currentPage}
        totalCount={totalCount}
        pageSize={pageSize}
        onPageChange={(page) => fetchVendors(page, searchTerm)}
        loading={loading}
        itemLabel="vendors"
      />

      {/* --- CREATE VENDOR MODAL --- */}
      <AnimatePresence>
        {showAddVendorForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 font-sans">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs cursor-pointer"
              onClick={() => setShowAddVendorForm(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="relative w-full max-w-lg bg-white border border-slate-200 z-10 rounded-2xl shadow-2xl text-slate-900 flex flex-col"
            >
              {/* Header */}
              <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70 shrink-0 rounded-t-2xl">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Building2 className="h-5 w-5 text-slate-800 shrink-0" />
                  <h2 className="text-sm font-bold text-slate-900 truncate">
                    Create Vendor & Supplier Profile
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddVendorForm(false)}
                  className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200/60 transition-all cursor-pointer shrink-0"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Form Content */}
              <form id="create-vendor-form" onSubmit={handleCreateVendor} className="p-5 space-y-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Vendor Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Robotronics Nepal, DigiKey"
                    value={vendorName}
                    onChange={(e) => setVendorName(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:border-slate-400 transition-all"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Phone Number <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="+977 9800000000"
                    value={vendorPhone}
                    onChange={(e) => setVendorPhone(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:bg-white focus:border-slate-400 transition-all"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Address / Location <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Kupondole, Lalitpur"
                    value={vendorAddress}
                    onChange={(e) => setVendorAddress(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:bg-white focus:border-slate-400 transition-all"
                  />
                </div>
              </form>

              {/* Action Footer */}
              <div className="flex items-center justify-end gap-3 px-5 py-3.5 bg-slate-50 border-t border-slate-100 shrink-0 rounded-b-2xl">
                <button
                  type="button"
                  onClick={() => setShowAddVendorForm(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-semibold text-xs hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="create-vendor-form"
                  disabled={addingVendor || !vendorName.trim()}
                  className="px-5 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                >
                  {addingVendor ? <Loader2 className="h-3.5 w-3.5 animate-spin text-white" /> : <Plus className="h-3.5 w-3.5 text-white" />}
                  Save Vendor Profile
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- EDIT VENDOR MODAL --- */}
      <AnimatePresence>
        {editingVendor && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 font-sans">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs cursor-pointer"
              onClick={() => setEditingVendor(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="relative w-full max-w-lg bg-white border border-slate-200 z-10 rounded-2xl shadow-2xl text-slate-900 flex flex-col"
            >
              {/* Header */}
              <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70 shrink-0 rounded-t-2xl">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Pencil className="h-5 w-5 text-slate-800 shrink-0" />
                  <h2 className="text-sm font-bold text-slate-900 truncate">
                    Edit Vendor Profile
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingVendor(null)}
                  className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200/60 transition-all cursor-pointer shrink-0"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Form Content */}
              <form id="edit-vendor-form" onSubmit={handleUpdateVendor} className="p-5 space-y-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Vendor Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:border-slate-400 transition-all"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:bg-white focus:border-slate-400 transition-all"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Address / Location
                  </label>
                  <input
                    type="text"
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:bg-white focus:border-slate-400 transition-all"
                  />
                </div>
              </form>

              {/* Action Footer */}
              <div className="flex items-center justify-end gap-3 px-5 py-3.5 bg-slate-50 border-t border-slate-100 shrink-0 rounded-b-2xl">
                <button
                  type="button"
                  onClick={() => setEditingVendor(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-semibold text-xs hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="edit-vendor-form"
                  disabled={updatingVendor || !editName.trim()}
                  className="px-5 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                >
                  {updatingVendor ? <Loader2 className="h-3.5 w-3.5 animate-spin text-white" /> : "Save Changes"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- DELETE VENDOR CONFIRMATION MODAL --- */}
      <AnimatePresence>
        {deletingVendor && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 font-sans">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs cursor-pointer"
              onClick={() => setDeletingVendor(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="relative w-full max-w-md bg-white border border-slate-200 z-10 rounded-2xl p-6 shadow-2xl space-y-4 font-sans"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-rose-100 text-rose-600 rounded-xl">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Delete Vendor Profile?</h3>
                  <p className="text-xs text-slate-500">This action cannot be undone.</p>
                </div>
              </div>
              <p className="text-xs text-slate-700 bg-slate-50 border border-slate-200 p-3 rounded-xl">
                Are you sure you want to delete vendor <span className="font-bold text-slate-900">"{deletingVendor.name}"</span>?
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setDeletingVendor(null)}
                  disabled={deletingVen}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteVendor}
                  disabled={deletingVen}
                  className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  {deletingVen ? <Loader2 className="h-3.5 w-3.5 animate-spin text-white" /> : <Trash2 className="h-3.5 w-3.5 text-white" />}
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
