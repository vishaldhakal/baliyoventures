"use client";

import PaginationControls from "@/components/admin/PaginationControls";
import {
  Component,
  ComponentModel,
  ComponentPurchase,
  ComponentPurchaseItem,
  Vendor,
} from "@/types/projects";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  Building2,
  Calendar,
  Cpu,
  ExternalLink,
  Eye,
  FileText,
  Loader2,
  MapPin,
  Paperclip,
  Pencil,
  Phone,
  Plus,
  Printer,
  Search,
  ShoppingCart,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

interface PurchaseItemForm {
  component_model: number | "";
  quantity: number;
  unit: string;
  price_per_item: number;
}

export default function PurchasesView() {
  const apiBase =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://yachu.baliyoventures.com/api/baliyo";

  const [purchases, setPurchases] = useState<ComponentPurchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Bill detail modal state
  const [viewingBill, setViewingBill] = useState<ComponentPurchase | null>(null);
  const [loadingBillDetail, setLoadingBillDetail] = useState(false);

  // Form (Create & Edit) modal state
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingBillId, setEditingBillId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Metadata dropdown state
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [components, setComponents] = useState<Component[]>([]);
  const [componentModels, setComponentModels] = useState<ComponentModel[]>([]);
  const [loadingMeta, setLoadingMeta] = useState(false);

  // Form fields
  const [selectedVendor, setSelectedVendor] = useState<number | "">("");
  const [purchaseDate, setPurchaseDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [notes, setNotes] = useState("");
  const [billFile, setBillFile] = useState<File | null>(null);
  const [existingBillUrl, setExistingBillUrl] = useState<string | null>(null);
  const [formItems, setFormItems] = useState<PurchaseItemForm[]>([
    { component_model: "", quantity: 1, unit: "pcs", price_per_item: 0 },
  ]);

  // Delete modal state
  const [deletingPurchase, setDeletingPurchase] =
    useState<ComponentPurchase | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const pageSize = 10;

  const fetchPurchases = useCallback(async (page = 1, query = searchTerm) => {
    setLoading(true);
    try {
      const searchParam = query.trim() ? `&search=${encodeURIComponent(query.trim())}` : "";
      const res = await fetch(`${apiBase}/component-purchases/?page=${page}&page_size=${pageSize}${searchParam}`, {
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        setPurchases(Array.isArray(data) ? data : data.results || []);
        if (!Array.isArray(data)) {
          setTotalCount(data.count || 0);
          setHasNext(!!data.next);
          setHasPrev(!!data.previous);
        }
        setCurrentPage(page);
      }
    } catch (err) {
      console.error("Failed to fetch purchases:", err);
    } finally {
      setLoading(false);
    }
  }, [apiBase, pageSize, searchTerm]);

  // Debounced backend search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPurchases(1, searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, fetchPurchases]);

  const handleSelectBill = async (p: ComponentPurchase) => {
    setViewingBill(p);
    setLoadingBillDetail(true);
    try {
      const res = await fetch(`${apiBase}/component-purchases/${p.id}/`, {
        cache: "no-store",
      });
      if (res.ok) {
        const detailData = await res.json();
        setViewingBill(detailData);
      }
    } catch (err) {
      console.error("Failed to fetch purchase detail:", err);
    } finally {
      setLoadingBillDetail(false);
    }
  };

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
      console.error(err);
    } finally {
      setLoadingMeta(false);
    }
  };


  const handleOpenEdit = async (bill: ComponentPurchase) => {
    setEditingBillId(bill.id);
    setSelectedVendor(bill.vendor ?? "");
    setPurchaseDate(
      bill.purchase_date || new Date().toISOString().split("T")[0]
    );
    setNotes(bill.notes || "");
    setExistingBillUrl(bill.bill_file || null);
    setBillFile(null);
    setShowFormModal(true);
    fetchMeta();

    if (!bill.items || bill.items.length === 0) {
      try {
        const res = await fetch(`${apiBase}/component-purchases/${bill.id}/`, {
          cache: "no-store",
        });
        if (res.ok) {
          const detailData: ComponentPurchase = await res.json();
          if (detailData.items && detailData.items.length > 0) {
            setFormItems(
              detailData.items.map((i) => ({
                component_model: i.component_model,
                quantity: i.quantity,
                unit: i.unit || "pcs",
                price_per_item: i.price_per_item,
              }))
            );
          }
        }
      } catch (err) {
        console.error("Failed to load items for edit:", err);
      }
    } else {
      setFormItems(
        bill.items.map((i) => ({
          component_model: i.component_model,
          quantity: i.quantity,
          unit: i.unit || "pcs",
          price_per_item: i.price_per_item,
        }))
      );
    }
  };

  const handleCloseFormModal = () => {
    setShowFormModal(false);
    setEditingBillId(null);
    setBillFile(null);
    setExistingBillUrl(null);
  };

  const addItem = () =>
    setFormItems((p) => [...p, { component_model: "", quantity: 1, unit: "pcs", price_per_item: 0 }]);

  const removeItem = (i: number) =>
    setFormItems((p) => p.filter((_, idx) => idx !== i));

  const updateItem = (
    i: number,
    field: keyof PurchaseItemForm,
    value: number | string
  ) =>
    setFormItems((p) =>
      p.map((item, idx) => (idx === i ? { ...item, [field]: value } : item))
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

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    const validItems = formItems.filter(
      (item) => item.component_model !== "" && item.quantity > 0
    );
    if (validItems.length === 0) return;
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

      const url = editingBillId
        ? `${apiBase}/component-purchases/${editingBillId}/`
        : `${apiBase}/component-purchases/`;

      const method = editingBillId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: formData,
      });

      if (res.ok) {
        const savedData = await res.json();
        handleCloseFormModal();
        if (viewingBill && viewingBill.id === editingBillId) {
          setViewingBill(savedData);
        }
        fetchPurchases(currentPage);
      }
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePurchase = async () => {
    if (!deletingPurchase) return;
    setDeleting(true);
    try {
      const res = await fetch(
        `${apiBase}/component-purchases/${deletingPurchase.id}/`,
        { method: "DELETE" }
      );
      if (res.ok) {
        setDeletingPurchase(null);
        setViewingBill(null);
        fetchPurchases(currentPage);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  const fmtDate = (d?: string | null) =>
    d
      ? new Date(d).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "—";

  const fmtCurrency = (n?: number | null) =>
    n != null
      ? `Rs. ${Number(n).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
      : "Rs. 0.00";

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Component Purchases
          </h1>
        </div>
        <Link
          href="/admin/purchases/create"
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-all cursor-pointer shadow-xs shrink-0"
        >
          <Plus className="h-4 w-4 text-white" />
          New Purchase Order
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-3 shadow-xs">
        <Search className="h-4 w-4 text-slate-400 shrink-0" />
        <input
          type="text"
          placeholder="Search by vendor, notes, or date..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 bg-transparent text-xs text-slate-900 outline-none placeholder-slate-400"
        />
      </div>

      {/* Top Pagination Controls */}
      <PaginationControls
        currentPage={currentPage}
        totalCount={totalCount}
        pageSize={pageSize}
        onPageChange={(page) => fetchPurchases(page, searchTerm)}
        loading={loading}
        itemLabel="orders"
      />

      {/* Main Purchases Table Container */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        {/* Table Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            All Purchase Orders ({totalCount})
          </h3>
          {totalCount > 0 && (
            <span className="text-[10px] text-slate-400 font-mono">
              Page {currentPage} of {Math.ceil(totalCount / pageSize)}
            </span>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 text-slate-500 animate-spin" />
          </div>
        ) : purchases.length === 0 ? (
          <div className="p-14 text-center text-xs text-slate-400 italic font-sans">
            {searchTerm ? `No purchase orders found matching "${searchTerm}".` : "No purchase orders found. Click \"New Purchase Order\" to create one."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-sans">
              <thead>
                <tr className="bg-white border-b border-slate-100 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Vendor / Supplier</th>
                  <th className="px-5 py-3">Notes</th>
                  <th className="px-5 py-3 text-right">Total Price</th>
                  <th className="px-5 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {purchases.map((purchase) => (
                  <tr
                    key={purchase.id}
                    className="hover:bg-slate-50/60 transition-colors group cursor-pointer"
                    onClick={() => handleSelectBill(purchase)}
                  >

                    {/* Date */}
                    <td className="px-5 py-3.5 font-semibold text-slate-600 font-mono text-xs whitespace-nowrap">
                      {purchase.purchase_date
                        ? fmtDate(purchase.purchase_date)
                        : fmtDate(purchase.created_at)}
                    </td>

                    {/* Vendor */}
                    <td className="px-5 py-3.5">
                      {purchase.vendor_name ? (
                        <span className="inline-flex items-center gap-1.5 font-medium text-slate-800">
                          <Building2 className="h-4 w-4 text-slate-400 shrink-0" />
                          {purchase.vendor_name}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">—</span>
                      )}
                    </td>

                    {/* Notes */}
                    <td className="px-5 py-3.5 text-slate-500 max-w-xs truncate">
                      {purchase.notes || <span className="text-slate-300 italic">—</span>}
                    </td>

                    {/* Total Price */}
                    <td className="px-5 py-3.5 text-right text-slate-900 font-mono">
                      {fmtCurrency(purchase.total_price)}
                    </td>

                    {/* Actions */}
                    <td
                      className="px-5 py-3.5 text-center whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex justify-center items-center gap-1.5">
                        <button
                          onClick={() => handleSelectBill(purchase)}
                          title="View Bill Details"
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(purchase)}
                          title="Edit Purchase Order"
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all cursor-pointer"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingPurchase(purchase)}
                          title="Delete Purchase Order"
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
        onPageChange={(page) => fetchPurchases(page, searchTerm)}
        loading={loading}
        itemLabel="orders"
      />

      {/* ── Bill Detail Modal ── */}
      <AnimatePresence>
        {viewingBill && (
          <>
            <div
              onClick={() => setViewingBill(null)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="fixed inset-0 m-auto z-50 w-full max-w-2xl h-fit max-h-[90vh] overflow-y-auto rounded-2xl bg-white border border-slate-200 shadow-2xl font-sans"
            >
              <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-slate-700" />
                  Purchase Order #{viewingBill.id}
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(viewingBill)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-all cursor-pointer"
                  >
                    <Pencil className="h-3 w-3" /> Edit
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all cursor-pointer"
                    title="Print"
                  >
                    <Printer className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewingBill(null)}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-5">
                {/* Meta details */}
                <div className="grid grid-cols-2 gap-4 bg-slate-50 border border-slate-200 p-4 rounded-xl text-xs">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Vendor
                    </p>
                    {viewingBill.vendor_name ? (
                      <div className="space-y-0.5">
                        <p className="font-bold text-slate-900 flex items-center gap-1">
                          <Building2 className="h-3.5 w-3.5 text-slate-500" />
                          {viewingBill.vendor_name}
                        </p>
                        {viewingBill.vendor_phone && (
                          <p className="text-slate-500 flex items-center gap-1">
                            <Phone className="h-3 w-3 text-slate-400" />
                            {viewingBill.vendor_phone}
                          </p>
                        )}
                        {viewingBill.vendor_address && (
                          <p className="text-slate-500 flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-slate-400" />
                            {viewingBill.vendor_address}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-slate-400 italic">No vendor specified</p>
                    )}
                  </div>

                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Date
                    </p>
                    <p className="font-bold text-slate-900 flex items-center gap-1 justify-end">
                      <Calendar className="h-3.5 w-3.5 text-slate-500" />
                      {viewingBill.purchase_date
                        ? fmtDate(viewingBill.purchase_date)
                        : fmtDate(viewingBill.created_at)}
                    </p>
                  </div>
                </div>

                {/* Items table */}
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-2">
                    Line Items
                  </label>
                  {loadingBillDetail ? (
                    <div className="flex justify-center py-10 border border-slate-200 rounded-xl">
                      <Loader2 className="h-6 w-6 text-slate-400 animate-spin" />
                    </div>
                  ) : (
                    <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                            <th className="px-4 py-2.5">Component</th>
                            <th className="px-4 py-2.5">Model</th>
                            <th className="px-4 py-2.5 text-right">Qty</th>
                            <th className="px-4 py-2.5 text-left">Unit</th>
                            <th className="px-4 py-2.5 text-right">Price/Unit</th>
                            <th className="px-4 py-2.5 text-right">Subtotal</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {viewingBill.items && viewingBill.items.length > 0 ? (
                            viewingBill.items.map((item: ComponentPurchaseItem) => (
                              <tr key={item.id} className="hover:bg-slate-50/60">
                                <td className="px-4 py-2.5 font-medium text-slate-800">
                                  <div className="flex items-center gap-1.5">
                                    <Cpu className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                    {item.component_name ?? "—"}
                                  </div>
                                </td>
                                <td className="px-4 py-2.5 text-slate-600">
                                  {item.component_model_name ?? `Model #${item.component_model}`}
                                </td>
                                <td className="px-4 py-2.5 text-right font-mono text-slate-700">
                                  {item.quantity}
                                </td>
                                <td className="px-4 py-2.5 text-left text-slate-500 text-[11px] font-semibold uppercase">
                                  {item.unit || "pcs"}
                                </td>
                                <td className="px-4 py-2.5 text-right font-mono text-slate-600">
                                  {fmtCurrency(item.price_per_item)}
                                </td>
                                <td className="px-4 py-2.5 text-right font-bold text-slate-900">
                                  {fmtCurrency(item.total_price)}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={6} className="px-4 py-4 text-center text-slate-400 italic">
                                No items recorded.
                              </td>
                            </tr>
                          )}
                        </tbody>
                        <tfoot>
                          <tr className="border-t border-slate-200 bg-slate-50 font-bold">
                            <td colSpan={5} className="px-4 py-2.5 text-right text-slate-700">
                              Grand Total
                            </td>
                            <td className="px-4 py-2.5 text-right text-slate-900 font-extrabold">
                              {fmtCurrency(viewingBill.total_price)}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  )}
                </div>

                {/* Notes */}
                {viewingBill.notes && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs">
                    <p className="font-bold text-slate-700 mb-0.5">Notes</p>
                    <p className="text-slate-600">{viewingBill.notes}</p>
                  </div>
                )}

                {/* Attached Bill File / Image */}
                {viewingBill.bill_file && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs">
                    <p className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Paperclip className="h-4 w-4 text-slate-600" />
                      Attached Bill / Invoice
                    </p>
                    {/\.(jpg|jpeg|png|webp|gif)$/i.test(viewingBill.bill_file) ? (
                      <div className="space-y-2">
                        <img
                          src={viewingBill.bill_file}
                          alt="Bill attachment"
                          className="max-h-56 w-auto rounded-lg border border-slate-200 object-contain bg-white"
                        />
                        <a
                          href={viewingBill.bill_file}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 hover:text-slate-900 underline"
                        >
                          <ExternalLink className="h-3 w-3" /> View full resolution
                        </a>
                      </div>
                    ) : (
                      <a
                        href={viewingBill.bill_file}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 font-semibold hover:bg-slate-100 transition-colors"
                      >
                        <FileText className="h-4 w-4 text-slate-500" />
                        <span>Open Bill Document</span>
                        <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                      </a>
                    )}
                  </div>
                )}

                {/* Bottom actions */}
                <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                  <button
                    onClick={() => setDeletingPurchase(viewingBill)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-semibold transition-all cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                  <button
                    onClick={() => setViewingBill(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Create / Edit Form Modal ── */}
      <AnimatePresence>
        {showFormModal && (
          <>
            <div
              onClick={handleCloseFormModal}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="fixed inset-0 m-auto w-full max-w-2xl h-fit max-h-[90vh] overflow-y-auto bg-white border border-slate-200 z-50 rounded-2xl shadow-2xl font-sans"
            >
              <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4 text-slate-700" />
                  {editingBillId
                    ? `Edit Purchase Order #${editingBillId}`
                    : "New Purchase Order"}
                </h2>
                <button
                  onClick={handleCloseFormModal}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleSubmitForm} className="p-6 space-y-5">
                {loadingMeta ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-slate-500" />
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1.5">
                          Vendor / Supplier{" "}
                          <span className="text-slate-400 font-normal">(optional)</span>
                        </label>
                        <select
                          value={selectedVendor}
                          onChange={(e) =>
                            setSelectedVendor(
                              e.target.value === "" ? "" : Number(e.target.value)
                            )
                          }
                          className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:bg-white focus:border-slate-400"
                        >
                          <option value="">— No specific vendor —</option>
                          {vendors.map((v) => (
                            <option key={v.id} value={v.id}>
                              {v.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1.5">
                          Purchase Date
                        </label>
                        <input
                          type="date"
                          value={purchaseDate}
                          onChange={(e) => setPurchaseDate(e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:bg-white focus:border-slate-400"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-[11px] font-bold text-slate-700">
                          Purchase Items *
                        </label>
                        <button
                          type="button"
                          onClick={addItem}
                          className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition-all cursor-pointer"
                        >
                          <Plus className="h-3 w-3" />
                          Add Item
                        </button>
                      </div>

                      <div className="space-y-3">
                        {formItems.map((item, index) => (
                          <div
                            key={index}
                            className="grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr_auto] gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl"
                          >
                            <div>
                              <label className="text-[10px] font-semibold text-slate-500 block mb-1">
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
                                className="w-full p-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 outline-none focus:border-slate-400"
                              >
                                <option value="">— Select model —</option>
                                {componentModels.map((m) => {
                                  const compName = getComponentName(m.id);
                                  return (
                                    <option key={m.id} value={m.id}>
                                      {compName ? `${compName} › ` : ""}
                                      {m.name}
                                    </option>
                                  );
                                })}
                              </select>
                              {item.component_model !== "" &&
                                getComponentName(item.component_model) && (
                                  <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                                    <Cpu className="h-2.5 w-2.5" />
                                    {getComponentName(item.component_model)}
                                  </p>
                                )}
                            </div>

                            <div>
                              <label className="text-[10px] font-semibold text-slate-500 block mb-1">
                                Quantity *
                              </label>
                              <input
                                type="number"
                                min={1}
                                required
                                value={item.quantity}
                                onChange={(e) =>
                                  updateItem(index, "quantity", Number(e.target.value))
                                }
                                className="w-full p-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 outline-none focus:border-slate-400"
                              />
                            </div>

                            <div>
                              <label className="text-[10px] font-semibold text-slate-500 block mb-1">
                                Unit
                              </label>
                              <select
                                value={item.unit}
                                onChange={(e) =>
                                  updateItem(index, "unit", e.target.value)
                                }
                                className="w-full p-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 outline-none focus:border-slate-400 cursor-pointer"
                              >
                                <option value="pcs">Pcs</option>
                                <option value="kg">Kg</option>
                                <option value="m">Meter (m)</option>
                              </select>
                            </div>

                            <div>
                              <label className="text-[10px] font-semibold text-slate-500 block mb-1">
                                Price / Unit
                              </label>
                              <input
                                type="number"
                                min={0}
                                step="0.01"
                                value={item.price_per_item}
                                onChange={(e) =>
                                  updateItem(
                                    index,
                                    "price_per_item",
                                    Number(e.target.value)
                                  )
                                }
                                className="w-full p-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 outline-none focus:border-slate-400"
                              />
                            </div>

                            <div className="flex items-end pb-0.5">
                              <button
                                type="button"
                                onClick={() => removeItem(index)}
                                disabled={formItems.length === 1}
                                className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-500 border border-rose-100 disabled:opacity-30 transition-all cursor-pointer"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1.5">
                        Notes{" "}
                        <span className="text-slate-400 font-normal">(optional)</span>
                      </label>
                      <textarea
                        rows={2}
                        placeholder="e.g. urgent order, received partial shipment..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:bg-white focus:border-slate-400 resize-none"
                      />
                    </div>

                    {/* Bill File Field */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-700 block">
                        Bill / Invoice File <span className="text-slate-400 font-normal">(optional)</span>
                      </label>

                      {existingBillUrl && !billFile && (
                        <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs mb-1.5">
                          <div className="flex items-center gap-2 truncate">
                            <Paperclip className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                            <span className="text-slate-700 font-medium truncate">Current file attached</span>
                          </div>
                          <a
                            href={existingBillUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-slate-800 font-semibold hover:underline shrink-0 ml-2"
                          >
                            <ExternalLink className="h-3 w-3" /> View current file
                          </a>
                        </div>
                      )}

                      {billFile ? (
                        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                          <Paperclip className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                          <span className="font-medium text-slate-700 truncate flex-1">{billFile.name}</span>
                          <span className="text-[10px] text-slate-400 shrink-0">
                            {(billFile.size / 1024).toFixed(1)} KB
                          </span>
                          <button
                            type="button"
                            onClick={() => setBillFile(null)}
                            className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Clear selected file"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ) : (
                        <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-dashed border-slate-300 hover:border-slate-400 hover:bg-slate-100 transition-all cursor-pointer">
                          <Paperclip className="h-3.5 w-3.5 text-slate-400" />
                          <span className="text-xs text-slate-500 font-medium">
                            {existingBillUrl ? "Click to upload replacement bill file" : "Click to upload bill file (PDF or image)"}
                          </span>
                          <input
                            type="file"
                            accept=".pdf,.png,.jpg,.jpeg,.webp,.gif"
                            className="hidden"
                            onChange={(e) => setBillFile(e.target.files?.[0] ?? null)}
                          />
                        </label>
                      )}
                    </div>

                    {grandTotal > 0 && (
                      <div className="flex justify-end">
                        <div className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-xs font-bold tabular-nums">
                          Grand Total: {fmtCurrency(grandTotal)}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={handleCloseFormModal}
                        className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={
                          submitting ||
                          formItems.every((i) => i.component_model === "")
                        }
                        className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 flex items-center gap-1.5 shadow-xs disabled:opacity-50 cursor-pointer"
                      >
                        {submitting ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin text-white" />
                        ) : (
                          <ShoppingCart className="h-3.5 w-3.5 text-white" />
                        )}
                        {editingBillId ? "Update Purchase Order" : "Save Purchase Order"}
                      </button>
                    </div>
                  </>
                )}
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Delete Modal ── */}
      <AnimatePresence>
        {deletingPurchase && (
          <>
            <div
              onClick={() => !deleting && setDeletingPurchase(null)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-[60] cursor-pointer"
            />
            <div className="fixed inset-0 m-auto w-full max-w-md h-fit bg-white border border-slate-200 z-[60] rounded-2xl p-6 shadow-xl space-y-4 font-sans">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-rose-100 text-rose-600 rounded-xl">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Delete Purchase Order?
                  </h3>
                  <p className="text-xs text-slate-500">This action cannot be undone.</p>
                </div>
              </div>
              <p className="text-xs text-slate-700 bg-slate-50 border border-slate-200 p-3 rounded-xl">
                Deleting{" "}
                <span className="font-bold text-slate-900">
                  PO #{deletingPurchase.id}
                </span>{" "}
                will remove the record. Added inventory stock will remain.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setDeletingPurchase(null)}
                  disabled={deleting}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeletePurchase}
                  disabled={deleting}
                  className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  {deleting ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-white" />
                  ) : (
                    <Trash2 className="h-3.5 w-3.5 text-white" />
                  )}
                  Confirm Delete
                </button>
              </div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
