"use client";

import {
  ArrowLeft,
  FileText,
  FolderGit2,
  Loader2,
  Save,
  ShoppingBag,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateProjectOrderView() {
  const router = useRouter();
  const apiBase =
    process.env.NEXT_PUBLIC_API_URL || "https://yachu.baliyoventures.com/api/baliyo";

  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [projectName, setProjectName] = useState("");
  const [quantity, setQuantity] = useState<number | "">(1);
  const [remarks, setRemarks] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      setError("Full Name is required.");
      return;
    }
    if (!projectName.trim()) {
      setError("Project Name is required.");
      return;
    }
    if (!quantity || Number(quantity) < 1) {
      setError("Quantity must be at least 1.");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      const payload = {
        full_name: fullName.trim(),
        phone_number: phoneNumber.trim() || null,
        project_name: projectName.trim(),
        quantity: Number(quantity),
        remarks: remarks.trim() || null,
      };

      const res = await fetch(`${apiBase}/project-orders/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push("/admin/project-orders");
        router.refresh();
      } else {
        const data = await res.json().catch(() => null);
        setError(
          typeof data === "string"
            ? data
            : data
            ? JSON.stringify(data)
            : "Failed to place project order."
        );
      }
    } catch (err) {
      console.error("Create Project Order error:", err);
      setError("An unexpected error occurred while placing the project order.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6 pb-12 font-sans px-1 sm:px-0">
      {/* Admin Back Link Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <Link
          href="/admin/project-orders"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl transition-all cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Project Orders</span>
        </Link>

      </div>

      {/* Hero Title Block */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-sm space-y-1 relative overflow-hidden">
        <div className="absolute -right-4 -bottom-4 text-white/5 pointer-events-none">
          <ShoppingBag className="w-32 h-32" />
        </div>
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-white/10 rounded-xl backdrop-blur-xs">
            <ShoppingBag className="h-5 w-5 text-amber-400" />
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Create Project Order
          </h1>
        </div>
      </div>

      {/* Form Container */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-7 space-y-5 sm:space-y-6 shadow-xs"
      >
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-start gap-2">
            <span className="font-bold shrink-0">Error:</span>
            <span>{error}</span>
          </div>
        )}

        {/* Section 1: Client Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
            <User className="h-4 w-4 text-slate-500" />
            <h2 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              Client Details
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 block">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Ram Shrestha"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 transition-all"
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 block">
                Phone Number <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="tel"
                inputMode="tel"
                placeholder="e.g. 9801234567"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Order Information */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
            <FolderGit2 className="h-4 w-4 text-slate-500" />
            <h2 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              Project Specification
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
            {/* Project Name */}
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-slate-800 block">
                Project / Product Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. BALIYO Automated Feed Mixer"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 transition-all"
              />
            </div>

            {/* Quantity */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 block">
                Quantity <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center rounded-xl bg-slate-50 border border-slate-200 overflow-hidden focus-within:border-slate-900 focus-within:ring-2 focus-within:ring-slate-900/10 transition-all h-11">
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => Math.max(1, (Number(prev) || 1) - 1))}
                  className="px-3 text-slate-600 hover:text-slate-900 font-bold text-sm h-full hover:bg-slate-200/60 transition-colors"
                >
                  -
                </button>
                <input
                  type="number"
                  inputMode="numeric"
                  min={1}
                  required
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(e.target.value === "" ? "" : Number(e.target.value))
                  }
                  className="w-full text-center bg-transparent text-xs font-extrabold text-slate-900 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => (Number(prev) || 0) + 1)}
                  className="px-3 text-slate-600 hover:text-slate-900 font-bold text-sm h-full hover:bg-slate-200/60 transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Remarks */}
        <div className="space-y-2 pt-2">
          <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-slate-500" />
              Remarks / Special Notes
            </span>
            <span className="text-[10px] text-slate-400 font-normal">(Optional)</span>
          </label>
          <textarea
            rows={3}
            placeholder="Add delivery location, specific customization requirements, or client notes..."
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 transition-all resize-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Link
            href="/admin/project-orders"
            className="w-full sm:w-auto text-center px-5 py-3 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition-colors order-2 sm:order-1"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting || !fullName.trim() || !projectName.trim()}
            className="w-full sm:w-auto px-7 py-3 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer order-1 sm:order-2 active:scale-[0.99]"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-white" />
                <span>Saving Order...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4 text-white" />
                <span>Save Project Order</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
