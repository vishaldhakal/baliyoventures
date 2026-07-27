"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Save, Box, FileText, Image as ImageIcon, Globe, Loader2, Plus } from "lucide-react";
import { ProjectDetailResponse } from "@/types/projects";
import RichTextEditor from "./RichTextEditor";

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  projectSlug: string | null; // If null = CREATE mode. If provided = EDIT mode.
}

type TabType = "basic" | "details" | "assets" | "seo";

export default function ProjectFormModal({
  isOpen,
  onClose,
  onSuccess,
  projectSlug,
}: ProjectFormModalProps) {
  const isEdit = !!projectSlug;

  const [activeTab, setActiveTab] = useState<TabType>("basic");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [error, setError] = useState("");

  // Form Fields
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [specs, setSpecs] = useState("");
  const [problemItSolves, setProblemItSolves] = useState("");
  const [caseStudy, setCaseStudy] = useState("");
  const [teamMember, setTeamMember] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");

  // Files Form State
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [catalogueFile, setCatalogueFile] = useState<File | null>(null);
  const [quotationFile, setQuotationFile] = useState<File | null>(null);

  // Existing file URLs (when editing)
  const [existingThumbnail, setExistingThumbnail] = useState("");
  const [existingCatalogue, setExistingCatalogue] = useState("");
  const [existingQuotation, setExistingQuotation] = useState("");

  // Reset form
  const resetForm = () => {
    setTitle("");
    setSlug("");
    setDescription("");
    setSpecs("");
    setProblemItSolves("");
    setCaseStudy("");
    setTeamMember("");
    setMetaTitle("");
    setMetaDescription("");
    setThumbnailFile(null);
    setCatalogueFile(null);
    setQuotationFile(null);
    setExistingThumbnail("");
    setExistingCatalogue("");
    setExistingQuotation("");
    setActiveTab("basic");
    setError("");
  };

  // Fetch project details for editing
  useEffect(() => {
    if (!isOpen) return;
    if (!isEdit) {
      resetForm();
      return;
    }

    const fetchDetails = async () => {
      setFetchLoading(true);
      setError("");
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://yachu.baliyoventures.com/api/baliyo";
      try {
        const res = await fetch(`${apiBase}/projects/${projectSlug}/`);
        if (!res.ok) throw new Error("Could not retrieve project data for editing.");
        const data: ProjectDetailResponse = await res.json();
        
        setTitle(data.title || "");
        setSlug(data.slug || "");
        setDescription(data.description || "");
        setSpecs(data.specs || "");
        setProblemItSolves(data.problem_it_solves || "");
        setCaseStudy(data.case_study || "");
        setTeamMember(data.team_member || "");
        setMetaTitle(data.meta_title || "");
        setMetaDescription(data.meta_description || "");
        setExistingThumbnail(data.thumbnail_image || "");
        setExistingCatalogue(data.catalogue || "");
        setExistingQuotation(data.quotation || "");
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load project details.");
      } finally {
        setFetchLoading(false);
      }
    };

    fetchDetails();
  }, [isOpen, projectSlug, isEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Project Title is required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const computedSlug = slug || title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_]+/g, "-")
        .replace(/-+/g, "-");

      const formData = new FormData();
      formData.append("title", title);
      formData.append("slug", computedSlug);

      if (isEdit) {
        formData.append("description", description);
        formData.append("specs", specs);
        formData.append("problem_it_solves", problemItSolves);
        formData.append("case_study", caseStudy);
        formData.append("team_member", teamMember);
        formData.append("meta_title", metaTitle);
        formData.append("meta_description", metaDescription);

        if (thumbnailFile) formData.append("thumbnail_image", thumbnailFile);
        if (catalogueFile) formData.append("catalogue", catalogueFile);
        if (quotationFile) formData.append("quotation", quotationFile);
      }

      const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://yachu.baliyoventures.com/api/baliyo";
      const url = isEdit
        ? `${apiBase}/projects/${projectSlug}/`
        : `${apiBase}/projects/?category=product-development`;

      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method: method,
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(
          errData
            ? JSON.stringify(errData)
            : `Failed to ${isEdit ? "update" : "create"} project.`
        );
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred while saving.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 cursor-pointer"
          />

          {/* Form Modal Backdrop */}
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.35 }}
              className="relative w-full max-w-lg max-h-[92vh] bg-white border border-slate-200 z-10 rounded-2xl overflow-hidden shadow-2xl font-sans text-slate-900 flex flex-col"
            >
              {/* Header */}
              <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Box className="h-5 w-5 text-slate-800 shrink-0" />
                  <h2 className="text-base font-bold text-slate-900 truncate">
                    {!isEdit ? "Create Product Project" : "Edit Project Metadata"}
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200/60 transition-all cursor-pointer shrink-0"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

            {/* Error banner */}
            {error && (
              <div className="px-6 py-3 bg-rose-50 border-b border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                <span className="font-bold">Error:</span>
                <span className="break-all">{error}</span>
              </div>
            )}

            {/* CREATE MODE: Title Only */}
            {!isEdit ? (
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-slate-900 font-bold text-xs block">
                    Product / Project Title *
                  </label>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Enter the title for your new product development project.
                  </p>
                  <input
                    type="text"
                    required
                    autoFocus
                    placeholder="e.g. BALIYO Automated Feed Mixer"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-semibold placeholder-slate-400 focus:bg-white focus:border-slate-400 outline-none transition-all text-xs"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-semibold text-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !title.trim()}
                    className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 disabled:opacity-50 transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin text-white" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 text-white" />
                        Create Project
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              /* EDIT METADATA MODE */
              <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs text-slate-800">
                {fetchLoading ? (
                  <div className="flex flex-col items-center justify-center gap-3 py-12">
                    <Loader2 className="h-8 w-8 text-slate-700 animate-spin" />
                    <span className="text-slate-500">Loading metadata...</span>
                  </div>
                ) : (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-slate-900 font-bold block">SEO Meta Title</label>
                      <input
                        type="text"
                        placeholder="Enter meta title..."
                        value={metaTitle}
                        onChange={(e) => setMetaTitle(e.target.value)}
                        className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 outline-none focus:bg-white focus:border-slate-400 font-medium"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-slate-900 font-bold block">SEO Meta Description</label>
                      <textarea
                        rows={4}
                        placeholder="Enter meta description..."
                        value={metaDescription}
                        onChange={(e) => setMetaDescription(e.target.value)}
                        className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 outline-none focus:bg-white focus:border-slate-400 resize-none font-medium"
                      />
                    </div>

                    {/* Footer Actions */}
                    <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-semibold text-slate-700"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading || fetchLoading}
                        className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin text-white" /> : <Save className="h-4 w-4 text-white" />}
                        Save Metadata
                      </button>
                    </div>
                  </>
                )}
              </form>
            )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
