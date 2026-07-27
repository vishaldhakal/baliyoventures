"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ShoppingCart,
  Plus,
  Trash2,
  Loader2,
  Building2,
  Calendar,
  FileText,
  Save,
  Cpu,
} from "lucide-react";
import { Vendor, Component, ComponentModel } from "@/types/projects";

interface PurchaseItemForm {
  component_model: number | "";
  quantity: number;
  price_per_item: number;
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
    { component_model: "", quantity: 1, price_per_item: 0 },
  ]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMeta = async () => {
      setLoadingMeta(true);
      try {
        const [vRes, cRes, cmRes] = await Promise.all([
          fetch(`${apiBase}/vendors/`, { cache: "no-store" }),
          fetch(`${apiBase}/components/`, { cache: "no-store" }),
          fetch(`${apiBase}/component-models/`, { cache: "no-store" }),
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
      { component_model: "", quantity: 1, price_per_item: 0 },
    ]);

  const removeItem = (index: number) =>
    setFormItems((prev) => prev.filter((_, idx) => idx !== index));

  const updateItem = (
    index: number,
    field: keyof PurchaseItemForm,
    value: number | ""
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
      (item) => item.component_model !== "" && item.quantity > 0
    );

    if (validItems.length === 0) {
      setError("Please add at least one component item with a quantity greater than 0.");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      const body = {
        items: validItems.map((item) => ({
          component_model: item.component_model,
          quantity: item.quantity,
          price_per_item: item.price_per_item,
        })),
        purchase_date: purchaseDate || null,
        notes: notes || null,
        vendor: selectedVendor !== "" ? selectedVendor : null,
      };

      const res = await fetch(`${apiBase}/component-purchases/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
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
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Cpu className="h-4 w-4 text-slate-600" />
                    Purchase Line Items <span className="text-rose-500">*</span>
                  </label>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Add component models purchased along with quantity and unit cost.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addItem}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-all cursor-pointer"
                >
                  <Plus className="h-4 w-4 text-slate-600" />
                  Add Line Item
                </button>
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
                        <div className="md:col-span-6 space-y-1">
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
                                e.target.value === "" ? 1 : Number(e.target.value)
                              )
                            }
                            className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-900 outline-none focus:border-slate-400 transition-all"
                          />
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
                                e.target.value === "" ? 0 : Number(e.target.value)
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
