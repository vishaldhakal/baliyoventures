"use client";

import { Component, ComponentModel, Vendor } from "@/types/projects";
import {
  ArrowLeft,
  Building2,
  Calendar,
  Cpu,
  FileText,
  Loader2,
  Paperclip,
  Plus,
  Save,
  ShoppingCart,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface PurchaseItemForm {
  component_model: number | "";
  quantity: number | "";
  unit: string;
  price_per_item: number | "";
}

export default function CreatePurchaseView() {
  const router = useRouter();
  const apiBase =
    process.env.NEXT_PUBLIC_API_URL || "https://yachu.baliyoventures.com/api/baliyo";

  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [components, setComponents] = useState<Component[]>([]);
  const [componentModels, setComponentModels] = useState<ComponentModel[]>([]);
  const [loadingMeta, setLoadingMeta] = useState(true);

  // Form states
  const [selectedVendor, setSelectedVendor] = useState<number | "">("");
  const [purchaseDate, setPurchaseDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [notes, setNotes] = useState("");
  const [formItems, setFormItems] = useState<PurchaseItemForm[]>([
    { component_model: "", quantity: "", unit: "pcs", price_per_item: "" },
  ]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [billFile, setBillFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchMeta = async () => {
      setLoadingMeta(true);
      try {
        const [vRes, cRes, cmRes] = await Promise.all([
        fetch(`${apiBase}/vendors/?page_size=100`, { cache: "no-store" }),
          fetch(`${apiBase}/components/?page_size=100`, { cache: "no-store" }),
          fetch(`${apiBase}/component-models/?page_size=100`, { cache: "no-store" }),
        ]);
        if (vRes.ok) {
          const d = await vRes.json();
          setVendors(d.results ?? d);
        }
        if (cRes.ok) {
          const d = await cRes.json();
          setComponents(d.results ?? d);
        }
        if (cmRes.ok) {
          const d = await cmRes.json();
          setComponentModels(d.results ?? d);
        }
      } catch (err) {
        console.error("Failed to load metadata:", err);
      } finally {
        setLoadingMeta(false);
      }
    };

    fetchMeta();
  }, [apiBase]);

  const addItem = () =>
    setFormItems((prev) => [
      ...prev,
      { component_model: "", quantity: "", unit: "pcs", price_per_item: "" },
    ]);

  const removeItem = (index: number) =>
    setFormItems((prev) => prev.filter((_, idx) => idx !== index));

  const updateItem = (
    index: number,
    field: keyof PurchaseItemForm,
    value: number | string
  ) =>
    setFormItems((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, [field]: value } : item))
    );

  const grandTotal = formItems.reduce(
    (acc, item) =>
      acc + (Number(item.quantity) || 0) * (Number(item.price_per_item) || 0),
    0
  );

  const getComponentName = (modelId: number | "") => {
    if (modelId === "") return "";
    const model = componentModels.find((m) => m.id === modelId);
    if (!model) return "";
    const comp = components.find((c) => c.id === model.component);
    return comp ? comp.name : "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validItems = formItems.filter(
      (item) => item.component_model !== "" && Number(item.quantity) > 0
    );

    if (validItems.length === 0) {
      setError("Please add at least one component item with a quantity greater than 0.");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("purchase_date", purchaseDate || "");
      formData.append("notes", notes || "");
      if (selectedVendor !== "") {
        formData.append("vendor", String(selectedVendor));
      }
      if (billFile) {
        formData.append("bill_file", billFile);
      }
      // items are sent as a JSON string in a separate key and parsed in the view
      formData.append(
        "items",
        JSON.stringify(
          validItems.map((item) => ({
            component_model: item.component_model,
            quantity: item.quantity,
            unit: item.unit || "pcs",
            price_per_item: item.price_per_item,
          }))
        )
      );

      const res = await fetch(`${apiBase}/component-purchases/`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        router.push("/admin/purchases");
        router.refresh();
      } else {
        const data = await res.json();
        setError(typeof data === "string" ? data : JSON.stringify(data));
      }
    } catch (err) {
      console.error("Save error:", err);
      setError("An unexpected error occurred while saving.");
    } finally {
      setSubmitting(false);
    }
  };

  const fmtCurrency = (n: number) =>
    `Rs. ${n.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 font-sans">
      {/* Header & Back Button */}
      <div className="border-b border-slate-200 pb-5">
        <Link
          href="/admin/purchases"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-3"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Component Purchases
        </Link>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <ShoppingCart className="h-7 w-7 text-slate-900" />
          Create Component Purchase Order
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Record a new purchase order, add items, set quantities/prices, and sync automatically with stock.
        </p>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 space-y-6 shadow-xs">
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {error}
          </div>
        )}

        {loadingMeta ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
          </div>
        ) : (
          <>
            {/* Vendor & Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 className="h-4 w-4 text-slate-600" />
                  Vendor / Supplier <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <select
                  value={selectedVendor}
                  onChange={(e) =>
                    setSelectedVendor(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 outline-none focus:border-slate-400 focus:bg-white transition-all cursor-pointer"
                >
                  <option value="">— No specific vendor —</option>
                  {vendors.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-slate-600" />
                  Purchase Date
                </label>
                <input
                  type="date"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 outline-none focus:border-slate-400 focus:bg-white transition-all"
                />
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Items Header */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Cpu className="h-4 w-4 text-slate-600" />
                  Purchase Line Items <span className="text-rose-500">*</span>
                </label>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Add component models purchased along with quantity and unit cost.
                </p>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                {formItems.map((item, index) => {
                  const subtotal = (Number(item.quantity) || 0) * (Number(item.price_per_item) || 0);
                  const compName = getComponentName(item.component_model);

                  return (
                    <div
                      key={index}
                      className="p-4 bg-slate-50/80 border border-slate-200 rounded-2xl space-y-3"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                        {/* Component Model Select */}
                        <div className="md:col-span-4 space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            Component Model *
                          </label>
                          <select
                            required
                            value={item.component_model}
                            onChange={(e) =>
                              updateItem(
                                index,
                                "component_model",
                                e.target.value === "" ? "" : Number(e.target.value)
                              )
                            }
                            className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-900 outline-none focus:border-slate-400 transition-all cursor-pointer"
                          >
                            <option value="">— Select component model —</option>
                            {componentModels.map((m) => {
                              const cName = getComponentName(m.id);
                              return (
                                <option key={m.id} value={m.id}>
                                  {cName ? `${cName} › ` : ""}
                                  {m.name}
                                </option>
                              );
                            })}
                          </select>
                          {compName && (
                            <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mt-1">
                              <Cpu className="h-3 w-3 text-slate-400" />
                              Component: {compName}
                            </p>
                          )}
                        </div>

                        {/* Quantity */}
                        <div className="md:col-span-2 space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            Quantity *
                          </label>
                          <input
                            type="number"
                            min={1}
                            required
                            value={item.quantity}
                            onChange={(e) =>
                              updateItem(
                                index,
                                "quantity",
                                e.target.value === "" ? "" : Number(e.target.value)
                              )
                            }
                            className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-900 outline-none focus:border-slate-400 transition-all"
                          />
                        </div>

                        {/* Unit */}
                        <div className="md:col-span-2 space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            Unit
                          </label>
                          <select
                            value={item.unit}
                            onChange={(e) =>
                              updateItem(index, "unit", e.target.value)
                            }
                            className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-900 outline-none focus:border-slate-400 transition-all cursor-pointer"
                          >
                            <option value="pcs">Pcs</option>
                            <option value="kg">Kg</option>
                            <option value="m">Meter (m)</option>
                          </select>
                        </div>

                        {/* Unit Price */}
                        <div className="md:col-span-3 space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            Unit Price (Rs.)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            min={0}
                            value={item.price_per_item}
                            onChange={(e) =>
                              updateItem(
                                index,
                                "price_per_item",
                                e.target.value === "" ? "" : Number(e.target.value)
                              )
                            }
                            className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-900 outline-none focus:border-slate-400 transition-all"
                          />
                        </div>

                        {/* Remove Item */}
                        <div className="md:col-span-1 flex items-center justify-end md:justify-center pt-2 md:pt-6">
                          {formItems.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeItem(index)}
                              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Remove item"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Subtotal preview */}
                      <div className="flex justify-end border-t border-slate-200/60 pt-2 text-[11px] font-semibold text-slate-600">
                        Subtotal: <span className="ml-1 text-slate-900 font-bold">{fmtCurrency(subtotal)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add Line Item Button at bottom of line items, above Grand Total */}
              <button
                type="button"
                onClick={addItem}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-slate-100/80 hover:border-slate-300 text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-2xs"
              >
                <Plus className="h-4 w-4 text-slate-700" />
                Add Line Item
              </button>
            </div>

            {/* Total summary */}
            <div className="p-4 bg-slate-900 text-white rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Grand Total
                </p>
                <p className="text-xs text-slate-300">
                  Total cost across {formItems.length} line {formItems.length === 1 ? "item" : "items"}
                </p>
              </div>
              <p className="text-xl font-extrabold tracking-tight tabular-nums">
                {fmtCurrency(grandTotal)}
              </p>
            </div>

            <hr className="border-slate-100" />

            {/* Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-slate-600" />
                Notes / Order Details <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <textarea
                rows={3}
                placeholder="Add invoice numbers, delivery notes, or special instructions..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 placeholder-slate-400 outline-none focus:border-slate-400 focus:bg-white transition-all"
              />
            </div>

            {/* Bill File Upload */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Paperclip className="h-4 w-4 text-slate-600" />
                Bill / Invoice File <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              {billFile ? (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <Paperclip className="h-4 w-4 text-slate-500 shrink-0" />
                  <span className="text-xs font-medium text-slate-700 truncate flex-1">{billFile.name}</span>
                  <span className="text-[10px] text-slate-400 shrink-0">
                    {(billFile.size / 1024).toFixed(1)} KB
                  </span>
                  <button
                    type="button"
                    onClick={() => setBillFile(null)}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Remove file"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <label className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-dashed border-slate-300 hover:border-slate-400 hover:bg-slate-100 transition-all cursor-pointer">
                  <Paperclip className="h-4 w-4 text-slate-400" />
                  <span className="text-xs text-slate-500 font-medium">Click to upload bill or invoice (PDF, image, etc.)</span>
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,.webp,.gif"
                    className="hidden"
                    onChange={(e) => setBillFile(e.target.files?.[0] ?? null)}
                  />
                </label>
              )}
            </div>

            {/* Submit buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <Link
                href="/admin/purchases"
                className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-semibold hover:bg-slate-200 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-all flex items-center gap-2 shadow-xs disabled:opacity-50 cursor-pointer"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                ) : (
                  <Save className="h-4 w-4 text-white" />
                )}
                Save Purchase Order
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
