"use client";

import {
  CheckCircle2,
  FileText,
  FolderGit2,
  Home,
  Loader2,
  PlusCircle,
  ShoppingBag,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function PublicCreateProjectOrderView() {
  const apiBase =
    process.env.NEXT_PUBLIC_API_URL || "https://yachu.baliyoventures.com/api/baliyo";

  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [projectName, setProjectName] = useState("");
  const [quantity, setQuantity] = useState<number | "">(1);
  const [remarks, setRemarks] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedOrderInfo, setSubmittedOrderInfo] = useState<{
    name: string;
    project: string;
    qty: number;
  } | null>(null);

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
        setSubmittedOrderInfo({
          name: fullName.trim(),
          project: projectName.trim(),
          qty: Number(quantity),
        });
        setIsSubmitted(true);
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

  const resetForm = () => {
    setFullName("");
    setPhoneNumber("");
    setProjectName("");
    setQuantity(1);
    setRemarks("");
    setIsSubmitted(false);
    setSubmittedOrderInfo(null);
    setError("");
  };

  if (isSubmitted && submittedOrderInfo) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans pb-12">
        {/* Top Dark Header */}
        <header className="w-full bg-[#00040C] border-b border-slate-800 py-4 px-6 mb-8">
          <div className="max-w-2xl mx-auto flex items-center justify-center">
            <Link href="/" className="relative w-40 h-10 block">
              <Image
                src="/logo.svg"
                alt="Baliyo Ventures"
                fill
                className="object-contain"
                priority
              />
            </Link>
          </div>
        </header>

        <div className="max-w-xl mx-auto px-4 text-center space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-lg space-y-6">
            <div className="mx-auto w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Order Placed Successfully!
              </h1>
              <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
                Thank you, <span className="font-bold text-slate-900">{submittedOrderInfo.name}</span>. We have received your order for{" "}
                <span className="font-bold text-slate-900">"{submittedOrderInfo.project}"</span> (Qty: {submittedOrderInfo.qty}). Our team will reach out to you shortly.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 border-t border-slate-100">
              <button
                onClick={resetForm}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                Place Another Order
              </button>
              <Link
                href="/"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <Home className="w-4 h-4" />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-12">
      {/* Top Dark Header */}
      <header className="w-full bg-[#00040C] border-b border-slate-800 py-4 px-6 mb-6">
        <div className="max-w-2xl mx-auto flex items-center justify-center">
          <Link href="/" className="relative w-40 h-10 block">
            <Image
              src="/logo.svg"
              alt="Baliyo Ventures"
              fill
              className="object-contain"
              priority
            />
          </Link>
          
        </div>
      </header>

      <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6 px-4 sm:px-0">

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
            Place an Order
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
            href="/"
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
                <span>Submitting Order...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4 text-white" />
                <span>Save Project Order</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
    </div>
  );
}
