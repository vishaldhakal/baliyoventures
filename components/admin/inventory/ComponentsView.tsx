"use client";

import PaginationControls from "@/components/admin/PaginationControls";
import { Component, ComponentModel, Vendor } from "@/types/projects";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  Boxes,
  Building2,
  Check,
  ChevronDown,
  Cpu,
  Eye,
  FileText,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import RichTextEditor from "../projects/RichTextEditor";

interface ComponentsViewProps {
  slug?: string;
}

export default function ComponentsView({ slug }: ComponentsViewProps) {
  const router = useRouter();
  const [componentsList, setComponentsList] = useState<Component[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);

  // Search filter
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;

  // Currently selected Component (when viewing component models via /admin/components/[slug])
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
  const [componentModels, setComponentModels] = useState<ComponentModel[]>([]);
  const [modelsLoading, setModelsLoading] = useState(false);

  // Accordion state for expanded component models
  const [expandedModelIds, setExpandedModelIds] = useState<number[]>([]);

  // Modal / Action states for Component
  const [showAddComponentModal, setShowAddComponentModal] = useState(false);
  const [componentName, setComponentName] = useState("");
  const [selectedVendorId, setSelectedVendorId] = useState<number | "">("");
  const [addingComponent, setAddingComponent] = useState(false);
  const [isVendorDropdownOpen, setIsVendorDropdownOpen] = useState(false);
  const [vendorSearch, setVendorSearch] = useState("");

  const [editingComponent, setEditingComponent] = useState<Component | null>(null);
  const [editCompName, setEditCompName] = useState("");
  const [editCompVendorId, setEditCompVendorId] = useState<number | "">("");
  const [updatingComp, setUpdatingComp] = useState(false);
  const [isEditVendorDropdownOpen, setIsEditVendorDropdownOpen] = useState(false);
  const [editVendorSearch, setEditVendorSearch] = useState("");

  const [deletingComponent, setDeletingComponent] = useState<Component | null>(null);
  const [deletingComp, setDeletingComp] = useState(false);

  // Modal / Action states for Component Model
  const [showAddModelModal, setShowAddModelModal] = useState(false);
  const [modelName, setModelName] = useState("");
  const [modelSpecs, setModelSpecs] = useState("");
  const [addingModel, setAddingModel] = useState(false);

  const [editingModel, setEditingModel] = useState<ComponentModel | null>(null);
  const [editModelName, setEditModelName] = useState("");
  const [editModelSpecs, setEditModelSpecs] = useState("");
  const [updatingModel, setUpdatingModel] = useState(false);

  const [deletingModel, setDeletingModel] = useState<ComponentModel | null>(null);
  const [deletingMod, setDeletingMod] = useState(false);

  const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://yachu.baliyoventures.com/api/baliyo";

  // Fetch components with pagination & backend search
  const fetchComponentsOnly = async (page = 1, query = searchTerm) => {
    setLoading(true);
    try {
      const searchParam = query.trim() ? `&search=${encodeURIComponent(query.trim())}` : "";
      const res = await fetch(`${apiBase}/components/?page=${page}&page_size=${pageSize}${searchParam}`, { cache: "no-store" });
      if (res.ok) {
        const cData = await res.json();
        const results = Array.isArray(cData) ? cData : cData.results || [];
        setComponentsList(results);
        if (!Array.isArray(cData)) {
          setTotalCount(cData.count || results.length);
        } else {
          setTotalCount(results.length);
        }
        setCurrentPage(page);
      }
    } catch (err) {
      console.error("Failed to fetch components:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch component detail + models using /components/slug/ API
  const fetchComponentDetailBySlug = async (targetSlug: string) => {
    setModelsLoading(true);
    try {
      const res = await fetch(`${apiBase}/components/${targetSlug}/`, { cache: "no-store" });
      if (res.ok) {
        const compDetail: Component = await res.json();
        setSelectedComponent(compDetail);
        setComponentModels(compDetail.models || []);
        setExpandedModelIds([]);
      }
    } catch (err) {
      console.error("Failed to fetch component detail:", err);
    } finally {
      setModelsLoading(false);
    }
  };

  // Fetch vendors lazily with backend search
  const [fetchingVendors, setFetchingVendors] = useState(false);

  const fetchVendorsList = async (query = "") => {
    setFetchingVendors(true);
    try {
      const url = query.trim()
        ? `${apiBase}/vendors/?search=${encodeURIComponent(query.trim())}`
        : `${apiBase}/vendors/`;
      const vRes = await fetch(url, { cache: "no-store" });
      if (vRes.ok) {
        const vData = await vRes.json();
        setVendors(vData.results || vData);
      }
    } catch (err) {
      console.error("Failed to fetch vendors:", err);
    } finally {
      setFetchingVendors(false);
    }
  };

  const fetchVendorsIfNeeded = async () => {
    if (vendors.length > 0) return;
    await fetchVendorsList();
  };

  useEffect(() => {
    if (!isVendorDropdownOpen || !vendorSearch.trim()) return;
    const timer = setTimeout(() => {
      fetchVendorsList(vendorSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [vendorSearch, isVendorDropdownOpen]);

  useEffect(() => {
    if (!isEditVendorDropdownOpen || !editVendorSearch.trim()) return;
    const timer = setTimeout(() => {
      fetchVendorsList(editVendorSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [editVendorSearch, isEditVendorDropdownOpen]);

  const fetchedSlugRef = useRef<string | null>(null);

  useEffect(() => {
    if (slug) {
      if (fetchedSlugRef.current !== slug) {
        fetchedSlugRef.current = slug;
        fetchComponentDetailBySlug(slug);
      }
    } else {
      fetchedSlugRef.current = null;
      setSelectedComponent(null);
      setComponentModels([]);
    }
  }, [slug]);

  // Debounced backend search effect (triggers when searchTerm changes)
  useEffect(() => {
    if (slug) return;
    const timer = setTimeout(() => {
      fetchComponentsOnly(1, searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, slug]);

  const handleSelectComponent = (comp: Component) => {
    router.push(`/admin/components/${comp.slug || comp.id}`);
  };

  const handleBackToComponents = () => {
    setSelectedComponent(null);
    setComponentModels([]);
    setExpandedModelIds([]);
    router.push("/admin/components");
  };

  const toggleModelExpand = (id: number) => {
    setExpandedModelIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // --- COMPONENT HANDLERS ---
  const handleOpenAddComponentModal = () => {
    fetchVendorsIfNeeded();
    setShowAddComponentModal(true);
  };

  const handleCreateComponent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!componentName.trim()) return;
    setAddingComponent(true);
    try {
      const res = await fetch(`${apiBase}/components/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: componentName,
          vendor: selectedVendorId || null,
        }),
      });
      if (res.ok) {
        setComponentName("");
        setSelectedVendorId("");
        setShowAddComponentModal(false);
        fetchComponentsOnly(1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAddingComponent(false);
    }
  };

  const handleOpenEditComponent = (comp: Component) => {
    fetchVendorsIfNeeded();
    setEditingComponent(comp);
    setEditCompName(comp.name);
    setEditCompVendorId(comp.vendor || comp.vendor_details?.id || "");
  };

  const handleUpdateComponent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingComponent || !editCompName.trim()) return;
    setUpdatingComp(true);
    try {
      const res = await fetch(`${apiBase}/components/${editingComponent.slug}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editCompName,
          vendor: editCompVendorId || null,
        }),
      });
      if (res.ok) {
        setEditingComponent(null);
        if (slug) {
          fetchComponentDetailBySlug(slug);
        } else {
          fetchComponentsOnly(currentPage);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingComp(false);
    }
  };

  const handleDeleteComponent = async () => {
    if (!deletingComponent) return;
    setDeletingComp(true);
    try {
      const res = await fetch(`${apiBase}/components/${deletingComponent.slug}/`, {
        method: "DELETE",
      });
      if (res.ok) {
        setDeletingComponent(null);
        if (selectedComponent?.id === deletingComponent.id) {
          handleBackToComponents();
        } else {
          fetchComponentsOnly(currentPage);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingComp(false);
    }
  };

  // --- COMPONENT MODEL HANDLERS ---
  const handleCreateComponentModel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modelName.trim() || !selectedComponent) return;
    setAddingModel(true);
    try {
      const res = await fetch(`${apiBase}/component-models/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          component: selectedComponent.id,
          name: modelName,
          specs: modelSpecs,
        }),
      });
      if (res.ok) {
        setModelName("");
        setModelSpecs("");
        setShowAddModelModal(false);
        if (slug) {
          fetchComponentDetailBySlug(slug);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAddingModel(false);
    }
  };

  const handleOpenEditModel = (model: ComponentModel) => {
    setEditingModel(model);
    setEditModelName(model.name);
    setEditModelSpecs(model.specs || "");
  };

  const handleUpdateComponentModel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingModel || !editModelName.trim()) return;
    setUpdatingModel(true);
    try {
      const res = await fetch(`${apiBase}/component-models/${editingModel.slug}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editModelName,
          specs: editModelSpecs,
        }),
      });
      if (res.ok) {
        setEditingModel(null);
        if (slug) {
          fetchComponentDetailBySlug(slug);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingModel(false);
    }
  };

  const handleDeleteModel = async () => {
    if (!deletingModel) return;
    setDeletingMod(true);
    try {
      const res = await fetch(`${apiBase}/component-models/${deletingModel.slug}/`, {
        method: "DELETE",
      });
      if (res.ok) {
        setDeletingModel(null);
        if (slug) {
          fetchComponentDetailBySlug(slug);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingMod(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* SCREEN 1: SELECTED COMPONENT DRILLDOWN (ACCORDION MODEL LIST VIA /components/slug/) */}
      {selectedComponent ? (
        <div className="space-y-6">
          {/* Top Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBackToComponents}
                className="p-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 transition-all cursor-pointer shrink-0 shadow-xs"
                title="Back to Components List"
              >
                <ArrowLeft className="h-4.5 w-4.5" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200">
                    Component #{selectedComponent.id}
                  </span>
                  {(selectedComponent.vendor_name || selectedComponent.vendor_details?.name) && (
                    <span className="text-xs text-slate-500 font-medium">
                      Supplier: {selectedComponent.vendor_name || selectedComponent.vendor_details?.name}
                    </span>
                  )}
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                  {selectedComponent.name} — Component Models
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleOpenEditComponent(selectedComponent)}
                className="px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Pencil className="h-3.5 w-3.5" /> Edit Component
              </button>
              <button
                onClick={() => setShowAddModelModal(!showAddModelModal)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-all cursor-pointer shadow-xs"
              >
                <Plus className="h-4 w-4 text-white" /> Add Model
              </button>
            </div>
          </div>



          {/* Component Models List */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Models List for {selectedComponent.name} ({componentModels.length})
              </h3>
            </div>

            {modelsLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-6 w-6 text-slate-600 animate-spin" />
              </div>
            ) : componentModels.length === 0 ? (
              <div className="text-center py-12 text-xs text-slate-400 italic font-sans">
                No models registered for this component yet. Click "+ Add Model" above to create one.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {componentModels.map((m) => {
                  const hasSpecs = Boolean(m.specs && m.specs.replace(/<[^>]*>/g, "").trim().length > 0);
                  const isExpanded = hasSpecs && expandedModelIds.includes(m.id);

                  return (
                    <div key={m.id} className="transition-colors">
                      {/* Row Header */}
                      <div
                        onClick={() => hasSpecs && toggleModelExpand(m.id)}
                        className={`p-4 flex items-center justify-between transition-colors select-none ${
                          hasSpecs ? "hover:bg-slate-50/80 cursor-pointer" : ""
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-sm text-slate-900">{m.name}</span>
                        </div>

                        <div
                          className="flex items-center gap-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {hasSpecs && (
                            <button
                              onClick={() => toggleModelExpand(m.id)}
                              className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg border border-slate-200 transition-all cursor-pointer"
                            >
                              {isExpanded ? "Hide Specs" : "View Specs"}
                            </button>
                          )}
                          <button
                            onClick={() => handleOpenEditModel(m)}
                            title="Edit model"
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all cursor-pointer"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setDeletingModel(m)}
                            title="Delete model"
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-all cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Expandable Specifications Panel */}
                      {hasSpecs && (
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden border-t border-slate-100 bg-slate-50/50"
                            >
                              <div className="p-5 space-y-2">
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                                  <FileText className="h-3.5 w-3.5 text-slate-500" />
                                  Specifications
                                </div>
                                <div
                                  className="prose prose-slate max-w-none text-xs text-slate-800 leading-relaxed p-4 bg-white rounded-xl border border-slate-200 shadow-xs"
                                  dangerouslySetInnerHTML={{ __html: m.specs || "" }}
                                />
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* SCREEN 2: MASTER COMPONENTS LIST VIEW */
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Components & Models
              </h1>
            </div>
            <button
              onClick={handleOpenAddComponentModal}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-all cursor-pointer shadow-xs shrink-0"
            >
              <Plus className="h-4 w-4 text-white" />
              Create Component
            </button>
          </div>



          {/* Search Bar */}
          <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-3 shadow-xs">
            <Search className="h-4 w-4 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search components by name or supplier..."
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
            onPageChange={(page) => fetchComponentsOnly(page)}
            loading={loading}
            itemLabel="components"
          />

          {/* Components Table List */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-200 bg-slate-50/70">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Registered Components List ({totalCount || componentsList.length})
              </h3>
            </div>

            {loading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="h-8 w-8 text-slate-600 animate-spin" />
              </div>
            ) : componentsList.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-400 italic font-sans">
                {searchTerm ? `No components found matching "${searchTerm}".` : "No components registered yet. Click \"Create Component\" above to add one."}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs font-sans">
                  <thead>
                    <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-600 font-semibold">
                      <th className="px-6 py-3.5">Component Name</th>
                      <th className="px-6 py-3.5">Supplier / Vendor</th>
                      <th className="px-6 py-3.5">Registered Models</th>
                      <th className="px-6 py-3.5 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {componentsList.map((comp) => {
                      const count = comp.no_of_models ?? comp.models_count ?? comp.models?.length ?? 0;
                      return (
                        <tr
                          key={comp.id}
                          onClick={() => handleSelectComponent(comp)}
                          className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                        >
                          <td className="px-6 py-3.5 font-semibold text-slate-900 text-sm">
                            {comp.name}
                          </td>
                          <td className="px-6 py-3.5 text-slate-600">
                            {comp.vendor_name || comp.vendor_details?.name || "Not assigned"}
                          </td>
                          <td className="px-6 py-3.5">
                            <span className="inline-block text-[10px] px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                              {count} Models
                            </span>
                          </td>
                          <td
                            className="px-6 py-3.5 whitespace-nowrap text-center"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex justify-center items-center gap-2">
                              {/* View Models */}
                              <button
                                onClick={() => handleSelectComponent(comp)}
                                title="View Component Models"
                                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all cursor-pointer flex items-center gap-1"
                              >
                                <Eye className="h-3.5 w-3.5" />
                                <span className="text-[11px] font-semibold hidden sm:inline">Models</span>
                              </button>

                              {/* Edit Component */}
                              <button
                                onClick={() => handleOpenEditComponent(comp)}
                                title="Edit Component"
                                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all cursor-pointer"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </button>

                              {/* Delete Component */}
                              <button
                                onClick={() => setDeletingComponent(comp)}
                                title="Delete Component"
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
            onPageChange={(page) => fetchComponentsOnly(page)}
            loading={loading}
            itemLabel="components"
          />
        </div>
      )}

      {/* --- CREATE BASE COMPONENT MODAL --- */}
      <AnimatePresence>
        {showAddComponentModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 font-sans">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs cursor-pointer"
              onClick={() => setShowAddComponentModal(false)}
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
                  <Cpu className="h-5 w-5 text-slate-800 shrink-0" />
                  <h2 className="text-sm font-bold text-slate-900 truncate">
                    Create Base Component
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddComponentModal(false)}
                  className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200/60 transition-all cursor-pointer shrink-0"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Form Content */}
              <form id="create-component-form" onSubmit={handleCreateComponent} className="p-5 space-y-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Component Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="E.g. Stepper Motor, Microcontroller, Motor Driver"
                    value={componentName}
                    onChange={(e) => setComponentName(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:border-slate-400 transition-all"
                  />
                </div>

                {/* Custom Searchable Vendor Dropdown */}
                <div className="space-y-1.5 relative">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                    Supplier / Vendor <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  {(() => {
                    const selectedVendor = vendors.find((v) => v.id === selectedVendorId);
                    return (
                      <>
                        <button
                          type="button"
                          onClick={() => setIsVendorDropdownOpen(!isVendorDropdownOpen)}
                          className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-medium transition-all cursor-pointer text-left shadow-xs ${
                            isVendorDropdownOpen
                              ? "bg-white border-slate-400 ring-2 ring-slate-900/5 text-slate-900"
                              : "bg-slate-50 hover:bg-slate-100/80 border-slate-200 text-slate-900"
                          }`}
                        >
                          {selectedVendor ? (
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              <Building2 className="h-4 w-4 text-slate-600 shrink-0" />
                              <span className="font-bold text-slate-900 truncate">{selectedVendor.name}</span>
                            </div>
                          ) : (
                            <span className="text-slate-400 font-medium">-- Select Supplier / Vendor --</span>
                          )}
                          <ChevronDown
                            className={`h-4 w-4 text-slate-500 shrink-0 transition-transform duration-200 ${
                              isVendorDropdownOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        <AnimatePresence>
                          {isVendorDropdownOpen && (
                            <>
                              <div
                                className="fixed inset-0 z-40"
                                onClick={() => setIsVendorDropdownOpen(false)}
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
                                      placeholder="Search vendor..."
                                      value={vendorSearch}
                                      onChange={(e) => setVendorSearch(e.target.value)}
                                      className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all"
                                      autoFocus
                                    />
                                  </div>
                                </div>

                                {/* List Items */}
                                <div className="overflow-y-auto max-h-56 divide-y divide-slate-100">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedVendorId("");
                                      setIsVendorDropdownOpen(false);
                                      setVendorSearch("");
                                    }}
                                    className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs transition-colors cursor-pointer text-left ${
                                      selectedVendorId === "" ? "bg-slate-100 font-bold text-slate-900" : "hover:bg-slate-50 text-slate-600"
                                    }`}
                                  >
                                    <span>-- None / Unassigned --</span>
                                    {selectedVendorId === "" && <Check className="h-4 w-4 text-slate-700" />}
                                  </button>
                                  {fetchingVendors ? (
                                    <div className="p-4 text-center text-xs text-slate-400 flex items-center justify-center gap-2 font-medium">
                                      <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-500" /> Searching vendors...
                                    </div>
                                  ) : vendors.length > 0 ? (
                                    vendors.map((v) => {
                                      const isSelected = selectedVendorId === v.id;
                                      return (
                                        <button
                                          key={v.id}
                                          type="button"
                                          onClick={() => {
                                            setSelectedVendorId(v.id);
                                            setIsVendorDropdownOpen(false);
                                            setVendorSearch("");
                                          }}
                                          className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs transition-colors cursor-pointer text-left ${
                                            isSelected
                                              ? "bg-slate-900 text-white font-bold"
                                              : "hover:bg-slate-50 text-slate-800"
                                          }`}
                                        >
                                          <span className="truncate">{v.name}</span>
                                          {isSelected && <Check className="h-4 w-4 text-amber-400 shrink-0 ml-2" />}
                                        </button>
                                      );
                                    })
                                  ) : (
                                    <div className="p-4 text-center text-xs text-slate-400 font-medium">
                                      No vendors matching "{vendorSearch}"
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
              </form>

              {/* Action Footer */}
              <div className="flex items-center justify-end gap-3 px-5 py-3.5 bg-slate-50 border-t border-slate-100 shrink-0 rounded-b-2xl">
                <button
                  type="button"
                  onClick={() => setShowAddComponentModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-semibold text-xs hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="create-component-form"
                  disabled={addingComponent || !componentName.trim()}
                  className="px-5 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                >
                  {addingComponent ? <Loader2 className="h-3.5 w-3.5 animate-spin text-white" /> : <Plus className="h-3.5 w-3.5 text-white" />}
                  Save Component
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- CREATE COMPONENT MODEL MODAL --- */}
      <AnimatePresence>
        {showAddModelModal && selectedComponent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 font-sans">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs cursor-pointer"
              onClick={() => setShowAddModelModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="relative w-full max-w-xl bg-white border border-slate-200 z-10 rounded-2xl shadow-2xl text-slate-900 flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70 shrink-0 rounded-t-2xl">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Boxes className="h-5 w-5 text-slate-800 shrink-0" />
                  <h2 className="text-sm font-bold text-slate-900 truncate">
                    Create Model for {selectedComponent.name}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddModelModal(false)}
                  className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200/60 transition-all cursor-pointer shrink-0"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Form Content */}
              <form id="create-model-form" onSubmit={handleCreateComponentModel} className="p-5 space-y-4 overflow-y-auto">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Model Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. NEMA 17, ESP32-WROOM-32D, L298N"
                    value={modelName}
                    onChange={(e) => setModelName(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:border-slate-400 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Specifications (Rich Text)
                  </label>
                  <RichTextEditor
                    value={modelSpecs}
                    onChange={setModelSpecs}
                    placeholder="Technical specifications, pinout info, voltage rating..."
                  />
                </div>
              </form>

              {/* Action Footer */}
              <div className="flex items-center justify-end gap-3 px-5 py-3.5 bg-slate-50 border-t border-slate-100 shrink-0 rounded-b-2xl">
                <button
                  type="button"
                  onClick={() => setShowAddModelModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-semibold text-xs hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="create-model-form"
                  disabled={addingModel || !modelName.trim()}
                  className="px-5 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                >
                  {addingModel ? <Loader2 className="h-3.5 w-3.5 animate-spin text-white" /> : <Plus className="h-3.5 w-3.5 text-white" />}
                  Save Model
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- EDIT COMPONENT MODAL --- */}
      <AnimatePresence>
        {editingComponent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 font-sans">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs cursor-pointer"
              onClick={() => setEditingComponent(null)}
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
                    Edit Base Component
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingComponent(null)}
                  className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200/60 transition-all cursor-pointer shrink-0"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Form Content */}
              <form id="edit-component-form" onSubmit={handleUpdateComponent} className="p-5 space-y-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Component Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editCompName}
                    onChange={(e) => setEditCompName(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:border-slate-400 transition-all"
                  />
                </div>

                {/* Custom Searchable Edit Vendor Dropdown */}
                <div className="space-y-1.5 relative">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                    Supplier / Vendor <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  {(() => {
                    const selectedVendor = vendors.find((v) => v.id === editCompVendorId);
                    return (
                      <>
                        <button
                          type="button"
                          onClick={() => setIsEditVendorDropdownOpen(!isEditVendorDropdownOpen)}
                          className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-medium transition-all cursor-pointer text-left shadow-xs ${
                            isEditVendorDropdownOpen
                              ? "bg-white border-slate-400 ring-2 ring-slate-900/5 text-slate-900"
                              : "bg-slate-50 hover:bg-slate-100/80 border-slate-200 text-slate-900"
                          }`}
                        >
                          {selectedVendor ? (
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              <Building2 className="h-4 w-4 text-slate-600 shrink-0" />
                              <span className="font-bold text-slate-900 truncate">{selectedVendor.name}</span>
                            </div>
                          ) : (
                            <span className="text-slate-400 font-medium">-- Select Supplier / Vendor --</span>
                          )}
                          <ChevronDown
                            className={`h-4 w-4 text-slate-500 shrink-0 transition-transform duration-200 ${
                              isEditVendorDropdownOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        <AnimatePresence>
                          {isEditVendorDropdownOpen && (
                            <>
                              <div
                                className="fixed inset-0 z-40"
                                onClick={() => setIsEditVendorDropdownOpen(false)}
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
                                      placeholder="Search vendor..."
                                      value={editVendorSearch}
                                      onChange={(e) => setEditVendorSearch(e.target.value)}
                                      className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all"
                                      autoFocus
                                    />
                                  </div>
                                </div>

                                {/* List Items */}
                                <div className="overflow-y-auto max-h-56 divide-y divide-slate-100">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditCompVendorId("");
                                      setIsEditVendorDropdownOpen(false);
                                      setEditVendorSearch("");
                                    }}
                                    className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs transition-colors cursor-pointer text-left ${
                                      editCompVendorId === "" ? "bg-slate-100 font-bold text-slate-900" : "hover:bg-slate-50 text-slate-600"
                                    }`}
                                  >
                                    <span>-- None / Unassigned --</span>
                                    {editCompVendorId === "" && <Check className="h-4 w-4 text-slate-700" />}
                                  </button>
                                  {fetchingVendors ? (
                                    <div className="p-4 text-center text-xs text-slate-400 flex items-center justify-center gap-2 font-medium">
                                      <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-500" /> Searching vendors...
                                    </div>
                                  ) : vendors.length > 0 ? (
                                    vendors.map((v) => {
                                      const isSelected = editCompVendorId === v.id;
                                      return (
                                        <button
                                          key={v.id}
                                          type="button"
                                          onClick={() => {
                                            setEditCompVendorId(v.id);
                                            setIsEditVendorDropdownOpen(false);
                                            setEditVendorSearch("");
                                          }}
                                          className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs transition-colors cursor-pointer text-left ${
                                            isSelected
                                              ? "bg-slate-900 text-white font-bold"
                                              : "hover:bg-slate-50 text-slate-800"
                                          }`}
                                        >
                                          <span className="truncate">{v.name}</span>
                                          {isSelected && <Check className="h-4 w-4 text-amber-400 shrink-0 ml-2" />}
                                        </button>
                                      );
                                    })
                                  ) : (
                                    <div className="p-4 text-center text-xs text-slate-400 font-medium">
                                      No vendors matching "{editVendorSearch}"
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
              </form>

              {/* Action Footer */}
              <div className="flex items-center justify-end gap-3 px-5 py-3.5 bg-slate-50 border-t border-slate-100 shrink-0 rounded-b-2xl">
                <button
                  type="button"
                  onClick={() => setEditingComponent(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-semibold text-xs hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="edit-component-form"
                  disabled={updatingComp || !editCompName.trim()}
                  className="px-5 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                >
                  {updatingComp ? <Loader2 className="h-3.5 w-3.5 animate-spin text-white" /> : "Save Changes"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- DELETE COMPONENT CONFIRMATION MODAL --- */}
      <AnimatePresence>
        {deletingComponent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 font-sans">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs cursor-pointer"
              onClick={() => setDeletingComponent(null)}
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
                  <h3 className="text-sm font-bold text-slate-900">Delete Component?</h3>
                  <p className="text-xs text-slate-500">This action cannot be undone.</p>
                </div>
              </div>
              <p className="text-xs text-slate-700 bg-slate-50 border border-slate-200 p-3 rounded-xl">
                Are you sure you want to delete <span className="font-bold text-slate-900">"{deletingComponent.name}"</span>?
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setDeletingComponent(null)}
                  disabled={deletingComp}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteComponent}
                  disabled={deletingComp}
                  className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  {deletingComp ? <Loader2 className="h-3.5 w-3.5 animate-spin text-white" /> : <Trash2 className="h-3.5 w-3.5 text-white" />}
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- EDIT COMPONENT MODEL MODAL (RICH TEXT SPECS) --- */}
      <AnimatePresence>
        {editingModel && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 font-sans">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs cursor-pointer"
              onClick={() => setEditingModel(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="relative w-full max-w-xl bg-white border border-slate-200 z-10 rounded-2xl shadow-2xl text-slate-900 flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70 shrink-0 rounded-t-2xl">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Pencil className="h-5 w-5 text-slate-800 shrink-0" />
                  <h2 className="text-sm font-bold text-slate-900 truncate">
                    Edit Component Model
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingModel(null)}
                  className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200/60 transition-all cursor-pointer shrink-0"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Form Content */}
              <form id="edit-model-form" onSubmit={handleUpdateComponentModel} className="p-5 space-y-4 overflow-y-auto">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Model Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editModelName}
                    onChange={(e) => setEditModelName(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:border-slate-400 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Specifications (Rich Text)
                  </label>
                  <RichTextEditor
                    value={editModelSpecs}
                    onChange={setEditModelSpecs}
                    placeholder="Enter technical specifications, pinout info, voltage rating..."
                  />
                </div>
              </form>

              {/* Action Footer */}
              <div className="flex items-center justify-end gap-3 px-5 py-3.5 bg-slate-50 border-t border-slate-100 shrink-0 rounded-b-2xl">
                <button
                  type="button"
                  onClick={() => setEditingModel(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-semibold text-xs hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="edit-model-form"
                  disabled={updatingModel || !editModelName.trim()}
                  className="px-5 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                >
                  {updatingModel ? <Loader2 className="h-3.5 w-3.5 animate-spin text-white" /> : "Save Model"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- DELETE COMPONENT MODEL CONFIRMATION MODAL --- */}
      <AnimatePresence>
        {deletingModel && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 font-sans">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs cursor-pointer"
              onClick={() => setDeletingModel(null)}
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
                  <h3 className="text-sm font-bold text-slate-900">Delete Component Model?</h3>
                  <p className="text-xs text-slate-500">This action cannot be undone.</p>
                </div>
              </div>
              <p className="text-xs text-slate-700 bg-slate-50 border border-slate-200 p-3 rounded-xl">
                Are you sure you want to delete model <span className="font-bold text-slate-900">"{deletingModel.name}"</span>?
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setDeletingModel(null)}
                  disabled={deletingMod}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteModel}
                  disabled={deletingMod}
                  className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  {deletingMod ? <Loader2 className="h-3.5 w-3.5 animate-spin text-white" /> : <Trash2 className="h-3.5 w-3.5 text-white" />}
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
