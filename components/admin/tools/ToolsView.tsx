"use client";

import PaginationControls from "@/components/admin/PaginationControls";
import { ProjectTool } from "@/types/projects";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Loader2, Pencil, Plus, Save, Search, Trash2, Wrench, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function ToolsView() {
  const [tools, setTools] = useState<ProjectTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Create Modal State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newToolName, setNewToolName] = useState("");
  const [newToolQuantity, setNewToolQuantity] = useState<number | "">("");
  const [addingTool, setAddingTool] = useState(false);

  // Edit Modal State
  const [editingTool, setEditingTool] = useState<ProjectTool | null>(null);
  const [editToolName, setEditToolName] = useState("");
  const [editToolQuantity, setEditToolQuantity] = useState<number | "">("");
  const [updatingTool, setUpdatingTool] = useState(false);

  // Delete Modal State
  const [deletingTool, setDeletingTool] = useState<ProjectTool | null>(null);
  const [deletingTl, setDeletingTl] = useState(false);

  const [error, setError] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const pageSize = 10;

  const apiBase =
    process.env.NEXT_PUBLIC_API_URL || "https://yachu.baliyoventures.com/api/baliyo";

  const fetchTools = async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/project-tools/?page=${page}&page_size=${pageSize}`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setTools(Array.isArray(data) ? data : data.results || []);
        if (!Array.isArray(data)) {
          setTotalCount(data.count || 0);
          setHasNext(!!data.next);
          setHasPrev(!!data.previous);
        }
        setCurrentPage(page);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch tools.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTools(1);
  }, []);

  const handleAddTool = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newToolName.trim()) return;
    setAddingTool(true);
    try {
      const res = await fetch(`${apiBase}/project-tools/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newToolName,
          quantity: newToolQuantity !== "" ? Number(newToolQuantity) : null,
        }),
      });
      if (res.ok) {
        setNewToolName("");
        setNewToolQuantity("");
        setShowAddForm(false);
        fetchTools(1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAddingTool(false);
    }
  };

  const handleOpenEditTool = (tool: ProjectTool) => {
    setEditingTool(tool);
    setEditToolName(tool.name);
    setEditToolQuantity(tool.quantity != null ? tool.quantity : "");
  };

  const handleUpdateTool = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTool || !editToolName.trim()) return;
    setUpdatingTool(true);
    try {
      const res = await fetch(`${apiBase}/project-tools/${editingTool.slug || editingTool.id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editToolName,
          quantity: editToolQuantity !== "" ? Number(editToolQuantity) : null,
        }),
      });
      if (res.ok) {
        setEditingTool(null);
        fetchTools(currentPage);
      }
    } catch (err) {
      console.error("Failed to update tool:", err);
    } finally {
      setUpdatingTool(false);
    }
  };

  const handleDeleteTool = async () => {
    if (!deletingTool) return;
    setDeletingTl(true);
    try {
      const res = await fetch(`${apiBase}/project-tools/${deletingTool.slug || deletingTool.id}/`, {
        method: "DELETE",
      });
      if (res.ok) {
        setDeletingTool(null);
        fetchTools(currentPage);
      }
    } catch (err) {
      console.error("Failed to delete tool:", err);
    } finally {
      setDeletingTl(false);
    }
  };

  const filteredTools = tools.filter((t) =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Tools & Technologies
          </h1>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-all cursor-pointer shadow-xs shrink-0"
        >
          <Plus className="h-4 w-4 text-white" />
          Create New Tool
        </button>
      </div>

      {/* Standalone Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-3 shadow-xs">
        <Search className="h-4 w-4 text-slate-400 shrink-0" />
        <input
          type="text"
          placeholder="Search tools by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 bg-transparent text-xs text-slate-900 outline-none placeholder-slate-400 font-sans"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer p-0.5"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Top Pagination Controls */}
      <PaginationControls
        currentPage={currentPage}
        totalCount={totalCount}
        pageSize={pageSize}
        onPageChange={(page) => fetchTools(page)}
        loading={loading}
        itemLabel="tools"
      />

      {/* Main Table Container */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        {/* Table Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            All Tools ({totalCount})
          </h3>
          {totalCount > 0 && (
            <span className="text-[10px] text-slate-400 font-mono">
              Page {currentPage} of {Math.ceil(totalCount / pageSize)}
            </span>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="p-12 flex justify-center">
            <Loader2 className="h-6 w-6 text-slate-300 animate-spin" />
          </div>
        ) : error ? (
          <div className="p-6 text-center text-sm text-red-500 font-medium">
            {error}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-sans">
              <thead>
                <tr className="bg-white border-b border-slate-100 text-slate-400">
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider">Tool Name</th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-center">Default Qty</th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider">Date Added</th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredTools.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-12 text-center text-slate-400 italic">
                      No tools found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredTools.map((tool) => (
                    <tr key={tool.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-5 py-3.5">
                        <span className="font-semibold text-slate-800 text-sm">{tool.name}</span>
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        {tool.quantity != null ? (
                          <span className="text-xs font-bold text-slate-700 font-mono">
                            {tool.quantity}
                          </span>
                        ) : (
                          <span className="text-slate-300 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-slate-500 font-mono text-[11px]">
                        {new Date(tool.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap text-center">
                        <div className="flex justify-center items-center gap-2">
                          <button
                            onClick={() => handleOpenEditTool(tool)}
                            title="Edit Tool"
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all cursor-pointer"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setDeletingTool(tool)}
                            title="Delete Tool"
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-all cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- CREATE NEW TOOL MODAL --- */}
      <AnimatePresence>
        {showAddForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 font-sans">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs cursor-pointer"
              onClick={() => setShowAddForm(false)}
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
                  <Wrench className="h-5 w-5 text-slate-800 shrink-0" />
                  <h2 className="text-sm font-bold text-slate-900 truncate">
                    Add New Tool & Technology
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200/60 transition-all cursor-pointer shrink-0"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Form Content */}
              <form id="create-tool-form" onSubmit={handleAddTool} className="p-5 space-y-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Tool / Framework Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Next.js, SolidWorks, Python, React Native"
                    value={newToolName}
                    onChange={(e) => setNewToolName(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:border-slate-400 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Default Quantity <span className="text-slate-400 font-normal normal-case">(optional)</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 2"
                    value={newToolQuantity}
                    onChange={(e) =>
                      setNewToolQuantity(e.target.value === "" ? "" : Math.max(1, parseInt(e.target.value) || 1))
                    }
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:border-slate-400 transition-all"
                  />
                </div>
              </form>

              {/* Action Footer */}
              <div className="flex items-center justify-end gap-3 px-5 py-3.5 bg-slate-50 border-t border-slate-100 shrink-0 rounded-b-2xl">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-semibold text-xs hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="create-tool-form"
                  disabled={addingTool || !newToolName.trim()}
                  className="px-5 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                >
                  {addingTool ? <Loader2 className="h-3.5 w-3.5 animate-spin text-white" /> : <Save className="h-3.5 w-3.5 text-white" />}
                  Save Tool
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- EDIT TOOL MODAL --- */}
      <AnimatePresence>
        {editingTool && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 font-sans">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs cursor-pointer"
              onClick={() => setEditingTool(null)}
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
                    Edit Tool & Technology
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingTool(null)}
                  className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200/60 transition-all cursor-pointer shrink-0"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Form Content */}
              <form id="edit-tool-form" onSubmit={handleUpdateTool} className="p-5 space-y-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Tool / Framework Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editToolName}
                    onChange={(e) => setEditToolName(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:border-slate-400 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Default Quantity <span className="text-slate-400 font-normal normal-case">(optional)</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 2"
                    value={editToolQuantity}
                    onChange={(e) =>
                      setEditToolQuantity(e.target.value === "" ? "" : Math.max(1, parseInt(e.target.value) || 1))
                    }
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:border-slate-400 transition-all"
                  />
                </div>
              </form>

              {/* Action Footer */}
              <div className="flex items-center justify-end gap-3 px-5 py-3.5 bg-slate-50 border-t border-slate-100 shrink-0 rounded-b-2xl">
                <button
                  type="button"
                  onClick={() => setEditingTool(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-semibold text-xs hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="edit-tool-form"
                  disabled={updatingTool || !editToolName.trim()}
                  className="px-5 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                >
                  {updatingTool ? <Loader2 className="h-3.5 w-3.5 animate-spin text-white" /> : "Save Changes"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- DELETE TOOL CONFIRMATION MODAL --- */}
      <AnimatePresence>
        {deletingTool && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 font-sans">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs cursor-pointer"
              onClick={() => setDeletingTool(null)}
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
                  <h3 className="text-sm font-bold text-slate-900">Delete Tool Record?</h3>
                  <p className="text-xs text-slate-500">This action cannot be undone.</p>
                </div>
              </div>
              <p className="text-xs text-slate-700 bg-slate-50 border border-slate-200 p-3 rounded-xl">
                Are you sure you want to delete tool <span className="font-bold text-slate-900">"{deletingTool.name}"</span>?
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setDeletingTool(null)}
                  disabled={deletingTl}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteTool}
                  disabled={deletingTl}
                  className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  {deletingTl ? <Loader2 className="h-3.5 w-3.5 animate-spin text-white" /> : <Trash2 className="h-3.5 w-3.5 text-white" />}
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
