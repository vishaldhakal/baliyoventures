"use client";

import PaginationControls from "@/components/admin/PaginationControls";
import { InventoryItem } from "@/types/admin";
import { ComponentModel } from "@/types/projects";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  Boxes,
  Check,
  CheckCircle2,
  ChevronDown,
  Loader2,
  Package,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

interface InventoryViewProps {
  initialInventoryItems?: InventoryItem[];
}

export default function InventoryView({
  initialInventoryItems = [],
}: InventoryViewProps) {
  const [items, setItems] = useState<InventoryItem[]>(initialInventoryItems);
  const [loading, setLoading] = useState(initialInventoryItems.length === 0);
  const [search, setSearch] = useState("");
  const [filterLowStock, setFilterLowStock] = useState(false);

  // Form state to add stock modal
  const [componentModels, setComponentModels] = useState<ComponentModel[]>([]);
  const [showAddStockForm, setShowAddStockForm] = useState(false);
  const [selectedInvModelId, setSelectedInvModelId] = useState<number | "">("");
  const [invStockQty, setInvStockQty] = useState<number | "">(1);
  const [addingStock, setAddingStock] = useState(false);
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [modelSearch, setModelSearch] = useState("");
  const [searchingModels, setSearchingModels] = useState(false);

  // Edit quantity modal state
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [editQuantity, setEditQuantity] = useState<number | "">(1);
  const [updatingStock, setUpdatingStock] = useState(false);

  // Delete inventory item modal state
  const [deletingItem, setDeletingItem] = useState<InventoryItem | null>(null);
  const [deletingStock, setDeletingStock] = useState(false);

  const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://yachu.baliyoventures.com/api/baliyo";

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const pageSize = 10;

  // Fetch Inventory Data directly from GET /api/baliyo/inventory/ with pagination & backend search
  const fetchInventory = async (page = 1, searchQuery = search) => {
    setLoading(true);
    try {
      const searchParam = searchQuery.trim() ? `&search=${encodeURIComponent(searchQuery.trim())}` : "";
      const res = await fetch(`${apiBase}/inventory/?page=${page}&page_size=${pageSize}${searchParam}`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setItems(Array.isArray(data) ? data : data.results || []);
        if (!Array.isArray(data)) {
          setTotalCount(data.count || 0);
          setHasNext(!!data.next);
          setHasPrev(!!data.previous);
        }
        setCurrentPage(page);
      }
    } catch (err) {
      console.error("Failed to fetch inventory:", err);
    } finally {
      setLoading(false);
    }
  };

  // Debounced backend search effect (triggers when search input changes)
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchInventory(1, search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // Fetch component models from API with debounced search query param
  useEffect(() => {
    if (!showAddStockForm) return;

    const fetchModels = async () => {
      setSearchingModels(true);
      try {
        const query = modelSearch.trim();
        const searchParam = query ? `?search=${encodeURIComponent(query)}` : "";
        const res = await fetch(`${apiBase}/component-models/${searchParam}`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setComponentModels(data.results || data);
        }
      } catch (err) {
        console.error("Failed to fetch component models:", err);
      } finally {
        setSearchingModels(false);
      }
    };

    const timer = setTimeout(() => {
      fetchModels();
    }, 300);

    return () => clearTimeout(timer);
  }, [apiBase, showAddStockForm, modelSearch]);

  const handleToggleAddStockForm = () => {
    setShowAddStockForm((prev) => !prev);
  };

  const handleAddStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvModelId || !invStockQty) return;
    setAddingStock(true);
    try {
      const res = await fetch(`${apiBase}/inventory/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          component_model: selectedInvModelId,
          quantity: parseInt(invStockQty.toString(), 10),
        }),
      });
      if (res.ok) {
        setSelectedInvModelId("");
        setInvStockQty(1);
        setShowAddStockForm(false);
        fetchInventory(1, search);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAddingStock(false);
    }
  };

  const handleOpenEditStock = (item: InventoryItem) => {
    setEditingItem(item);
    setEditQuantity(item.quantity);
  };

  const handleUpdateStockQuantity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || editQuantity === "" || editQuantity < 0) return;
    setUpdatingStock(true);
    try {
      const res = await fetch(`${apiBase}/inventory/${editingItem.id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quantity: parseInt(editQuantity.toString(), 10),
        }),
      });
      if (res.ok) {
        setEditingItem(null);
        fetchInventory(currentPage, search);
      }
    } catch (err) {
      console.error("Failed to update inventory stock quantity:", err);
    } finally {
      setUpdatingStock(false);
    }
  };

  const handleDeleteInventoryItem = async () => {
    if (!deletingItem) return;
    setDeletingStock(true);
    try {
      const res = await fetch(`${apiBase}/inventory/${deletingItem.id}/`, {
        method: "DELETE",
      });
      if (res.ok) {
        setDeletingItem(null);
        fetchInventory(currentPage, search);
      }
    } catch (err) {
      console.error("Failed to delete inventory stock:", err);
    } finally {
      setDeletingStock(false);
    }
  };

  const filteredStock = items.filter((item) => {
    const matchesLowStock = filterLowStock
      ? item.quantity <= (item.min_threshold || 10)
      : true;
    return matchesLowStock;
  });

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Inventory
          </h1>
        </div>
        <button
          onClick={handleToggleAddStockForm}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-all cursor-pointer shadow-xs shrink-0"
        >
          <Plus className="h-4 w-4 text-white" />
          Add Inventory Stock
        </button>
      </div>



      {/* Search & Filter Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-3 shadow-xs flex-1">
          <Search className="h-4 w-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search inventory items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-xs text-slate-900 outline-none placeholder-slate-400 font-sans"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer p-0.5 shrink-0"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Low Stock Filter Button (Beside Search Bar) */}
        <button
          onClick={() => setFilterLowStock(!filterLowStock)}
          className={`px-4 p-3 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all cursor-pointer shrink-0 shadow-xs ${
            filterLowStock
              ? "bg-rose-50 border-rose-200 text-rose-700 font-bold"
              : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
          }`}
        >
          <AlertTriangle className={`h-4 w-4 ${filterLowStock ? "text-rose-600" : "text-slate-400"}`} />
          Low Stock Only
        </button>
      </div>

      {/* Top Pagination Controls */}
      <PaginationControls
        currentPage={currentPage}
        totalCount={totalCount}
        pageSize={pageSize}
        onPageChange={(page) => fetchInventory(page, search)}
        loading={loading}
        itemLabel="items"
      />

      {/* Main Stock Table Container */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        {/* Table Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Inventory Stock Items ({totalCount})
          </h3>
          {totalCount > 0 && (
            <span className="text-[10px] text-slate-400 font-mono">
              Page {currentPage} of {Math.ceil(totalCount / pageSize)}
            </span>
          )}
        </div>

        {/* Table Content */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 text-slate-600 animate-spin" />
          </div>
        ) : filteredStock.length === 0 ? (
          <div className="text-center py-16 text-xs text-slate-400 italic font-sans">
            No inventory stock items found matching your filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-sans">
              <thead>
                <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-600 font-semibold">
                  <th className="px-6 py-3.5">Component Model</th>
                  <th className="px-6 py-3.5">Category / Component</th>
                  <th className="px-6 py-3.5">Vendor / Supplier</th>
                  <th className="px-6 py-3.5">Available Quantity</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {filteredStock.map((item) => {
                  const modelName = item.model_name || item.component_model_details?.name || "Unknown Model";
                  const compName = item.component_name || item.component_model_details?.component_name || "General";
                  const vendorName = item.vendor_name || "Not assigned";
                  const isLow = item.quantity <= (item.min_threshold || 10);

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-3.5 font-semibold text-slate-900 text-sm">
                        {modelName}
                      </td>
                      <td className="px-6 py-3.5 text-slate-600 font-medium">
                        {compName}
                      </td>
                      <td className="px-6 py-3.5 text-slate-600">
                        {vendorName}
                      </td>
                      <td className="px-6 py-3.5 font-mono text-sm text-slate-900">
                        {item.quantity} units
                      </td>
                      <td className="px-6 py-3.5">
                        {isLow ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                            <AlertTriangle className="h-3 w-3" /> Low Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="h-3 w-3" /> In Stock
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-3.5 text-center whitespace-nowrap">
                        <div className="flex justify-center items-center gap-2">
                          <button
                            onClick={() => handleOpenEditStock(item)}
                            title="Edit Stock Quantity"
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all cursor-pointer flex items-center gap-1"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            <span className="text-[11px] font-semibold hidden sm:inline">Update Stock</span>
                          </button>
                          <button
                            onClick={() => setDeletingItem(item)}
                            title="Delete Stock Record"
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-all cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
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
        onPageChange={(page) => fetchInventory(page, search)}
        loading={loading}
        itemLabel="items"
      />

      {/* --- EDIT QUANTITY MODAL --- */}
      <AnimatePresence>
        {editingItem && (
          <>
            <div
              onClick={() => setEditingItem(null)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 m-auto w-full max-w-md h-fit bg-white border border-slate-200 z-50 rounded-2xl p-6 shadow-xl space-y-4 font-sans"
            >
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Pencil className="h-4 w-4 text-slate-700" /> Update Stock Quantity
                </h3>
              </div>

              <form onSubmit={handleUpdateStockQuantity} className="space-y-4">
                <div>
                  <p className="text-xs text-slate-500 mb-1">
                    Component Model:
                  </p>
                  <p className="text-sm font-bold text-slate-900">
                    {editingItem.model_name || editingItem.component_model_details?.name || "Unknown Model"}
                  </p>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Available Quantity Units *
                  </label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={editQuantity}
                    onChange={(e) => setEditQuantity(e.target.value ? parseInt(e.target.value, 10) : "")}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-900 outline-none focus:bg-white focus:border-slate-400"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updatingStock || editQuantity === ""}
                    className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 flex items-center gap-1.5 shadow-xs"
                  >
                    {updatingStock ? <Loader2 className="h-3.5 w-3.5 animate-spin text-white" /> : "Save Quantity"}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- DELETE INVENTORY ITEM MODAL --- */}
      <AnimatePresence>
        {deletingItem && (
          <>
            <div
              onClick={() => setDeletingItem(null)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 cursor-pointer"
            />
            <div className="fixed inset-0 m-auto w-full max-w-md h-fit bg-white border border-slate-200 z-50 rounded-2xl p-6 shadow-xl space-y-4 font-sans">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-rose-100 text-rose-600 rounded-xl">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Delete Inventory Record?</h3>
                  <p className="text-xs text-slate-500">This action cannot be undone.</p>
                </div>
              </div>
              <p className="text-xs text-slate-700 bg-slate-50 border border-slate-200 p-3 rounded-xl">
                Are you sure you want to remove stock record for <span className="font-bold text-slate-900">"{deletingItem.model_name || deletingItem.component_model_details?.name || "this model"}"</span>?
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setDeletingItem(null)}
                  disabled={deletingStock}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteInventoryItem}
                  disabled={deletingStock}
                  className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  {deletingStock ? <Loader2 className="h-3.5 w-3.5 animate-spin text-white" /> : <Trash2 className="h-3.5 w-3.5 text-white" />}
                  Confirm Delete
                </button>
              </div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* --- ADD INVENTORY STOCK MODAL --- */}
      <AnimatePresence>
        {showAddStockForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs cursor-pointer"
              onClick={() => setShowAddStockForm(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="relative w-full max-w-lg bg-white border border-slate-200 z-10 rounded-2xl shadow-2xl font-sans text-slate-900 flex flex-col"
            >
              {/* Header */}
              <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70 shrink-0 rounded-t-2xl">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Boxes className="h-5 w-5 text-slate-800 shrink-0" />
                  <h2 className="text-sm font-bold text-slate-900 truncate">
                    Add Stock to Inventory
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddStockForm(false)}
                  className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200/60 transition-all cursor-pointer shrink-0"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Form Content */}
              <form id="add-stock-form" onSubmit={handleAddStock} className="p-5 space-y-4">
                {/* Custom Searchable Component Model Dropdown */}
                <div className="space-y-1.5 relative">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                    Component Model <span className="text-rose-500">*</span>
                  </label>
                  {(() => {
                    const selectedModel = componentModels.find((m) => m.id === selectedInvModelId);
                    return (
                      <>
                        <button
                          type="button"
                          onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                          className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-medium transition-all cursor-pointer text-left shadow-xs ${
                            isModelDropdownOpen
                              ? "bg-white border-slate-400 ring-2 ring-slate-900/5 text-slate-900"
                              : "bg-slate-50 hover:bg-slate-100/80 border-slate-200 text-slate-900"
                          }`}
                        >
                          {selectedModel ? (
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              <Package className="h-4 w-4 text-slate-600 shrink-0" />
                              <div className="min-w-0 flex-1 truncate">
                                <span className="font-bold text-slate-900">{selectedModel.name}</span>
                                {selectedModel.component_name && (
                                  <span className="text-slate-400 text-[11px] ml-1.5 font-mono">
                                    ({selectedModel.component_name})
                                  </span>
                                )}
                              </div>
                            </div>
                          ) : (
                            <span className="text-slate-400 font-medium">-- Select Component Model --</span>
                          )}
                          <ChevronDown
                            className={`h-4 w-4 text-slate-500 shrink-0 transition-transform duration-200 ${
                              isModelDropdownOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        <AnimatePresence>
                          {isModelDropdownOpen && (
                            <>
                              <div
                                className="fixed inset-0 z-40"
                                onClick={() => setIsModelDropdownOpen(false)}
                              />
                              <motion.div
                                initial={{ opacity: 0, y: -4, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -4, scale: 0.98 }}
                                transition={{ duration: 0.15 }}
                                className="absolute top-full left-0 right-0 mt-1.5 z-50 rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden flex flex-col w-full"
                              >
                                {/* Search Box */}
                                <div className="p-2 bg-slate-50/90 border-b border-slate-200 shrink-0">
                                  <div className="relative flex items-center">
                                    <Search className="absolute left-3.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                                    <input
                                      type="text"
                                      placeholder="Search component model..."
                                      value={modelSearch}
                                      onChange={(e) => setModelSearch(e.target.value)}
                                      className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all"
                                      autoFocus
                                    />
                                  </div>
                                </div>

                                {/* List Items */}
                                <div className="overflow-y-auto max-h-56 divide-y divide-slate-100 min-h-[80px]">
                                  {searchingModels ? (
                                    <div className="p-4 flex items-center justify-center gap-2 text-xs text-slate-500 font-medium">
                                      <Loader2 className="h-4 w-4 animate-spin text-slate-400" /> Searching component models...
                                    </div>
                                  ) : componentModels.length > 0 ? (
                                    componentModels.map((m) => {
                                      const isSelected = selectedInvModelId === m.id;
                                      return (
                                        <button
                                          key={m.id}
                                          type="button"
                                          onClick={() => {
                                            setSelectedInvModelId(m.id);
                                            setIsModelDropdownOpen(false);
                                            setModelSearch("");
                                          }}
                                          className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs transition-colors cursor-pointer text-left ${
                                            isSelected
                                              ? "bg-slate-900 text-white font-bold"
                                              : "hover:bg-slate-50 text-slate-800"
                                          }`}
                                        >
                                          <div className="min-w-0 flex-1">
                                            <p className={`font-semibold truncate ${isSelected ? "text-white" : "text-slate-900"}`}>
                                              {m.name}
                                            </p>
                                            {m.component_name && (
                                              <p className={`text-[10px] font-mono truncate ${isSelected ? "text-slate-300" : "text-slate-400"}`}>
                                                {m.component_name}
                                              </p>
                                            )}
                                          </div>
                                          {isSelected && (
                                            <Check className="h-4 w-4 text-amber-400 shrink-0 ml-2" />
                                          )}
                                        </button>
                                      );
                                    })
                                  ) : (
                                    <div className="p-4 text-center text-xs text-slate-400 font-medium">
                                      No component models matching "{modelSearch}"
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                      </>
                    );
                  })()}
                </div>

                {/* Quantity Units Input */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                    Quantity Units <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    placeholder="E.g. 10"
                    value={invStockQty}
                    onChange={(e) => setInvStockQty(e.target.value ? parseInt(e.target.value, 10) : "")}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-900 outline-none focus:bg-white focus:border-slate-400 transition-all"
                  />
                </div>
              </form>

              {/* Action Footer */}
              <div className="flex items-center justify-end gap-3 px-5 py-3.5 bg-slate-50 border-t border-slate-100 shrink-0 rounded-b-2xl">
                <button
                  type="button"
                  onClick={() => setShowAddStockForm(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-semibold text-xs hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="add-stock-form"
                  disabled={addingStock || !selectedInvModelId || !invStockQty}
                  className="px-5 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                >
                  {addingStock ? <Loader2 className="h-3.5 w-3.5 animate-spin text-white" /> : <Plus className="h-3.5 w-3.5 text-white" />}
                  Save Stock Entry
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
