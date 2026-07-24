"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Save, Box, FileText, Image as ImageIcon, Globe, Sparkles, Loader2 } from "lucide-react";
import { ProjectDetailResponse } from "@/types/projects";

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  projectSlug: string | null; // If null, we are in CREATE mode. If provided, we are in EDIT mode.
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

  // Auto-generate slug from title
  const generateSlug = () => {
    const generated = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // Remove non-word chars
      .replace(/[\s_]+/g, "-") // Replace spaces/underscores with hyphens
      .replace(/-+/g, "-"); // Replace multiple hyphens
    setSlug(generated);
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
      try {
        const res = await fetch(`https://yachu.baliyoventures.com/api/baliyo/projects/${projectSlug}/`);
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
    if (!title) {
      setError("Project Title is required.");
      setActiveTab("basic");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("title", title);
      const computedSlug = slug || title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_]+/g, "-")
        .replace(/-+/g, "-");
      formData.append("slug", computedSlug);
      formData.append("description", description);
      formData.append("specs", specs);
      formData.append("problem_it_solves", problemItSolves);
      formData.append("case_study", caseStudy);
      formData.append("team_member", teamMember);
      formData.append("meta_title", metaTitle);
      formData.append("meta_description", metaDescription);

      // Append files if selected
      if (thumbnailFile) {
        formData.append("thumbnail_image", thumbnailFile);
      }
      if (catalogueFile) {
        formData.append("catalogue", catalogueFile);
      }
      if (quotationFile) {
        formData.append("quotation", quotationFile);
      }

      // If category list was writable, we would append it here.
      // But we know categories are read-only on projects endpoint.

      const url = isEdit
        ? `https://yachu.baliyoventures.com/api/baliyo/projects/${projectSlug}/`
        : `https://yachu.baliyoventures.com/api/baliyo/projects/`;

      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method: method,
        body: formData, // Fetch automatically sets multipart/form-data boundaries for FormData
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
      setError(err.message || "An error occurred while saving the project.");
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
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-xs z-40 cursor-pointer"
          />

          {/* Form Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", duration: 0.35 }}
            className="fixed inset-0 m-auto w-full max-w-2xl h-[85vh] bg-[#030a1c] border border-white/10 z-50 rounded-3xl overflow-hidden flex flex-col justify-between shadow-2xl"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#050e26]">
              <div className="flex items-center gap-2.5">
                <Box className="h-5 w-5 text-yellow-300" />
                <h2 className="text-xl font-bold font-oxanium text-[#FCE8C6] tracking-tight">
                  {isEdit ? "Update Project Details" : "Register Product Development"}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-all cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Error banner */}
            {error && (
              <div className="px-6 py-3 bg-red-950/40 border-b border-red-500/20 text-red-200 text-xs font-saira flex items-start gap-2 max-h-20 overflow-y-auto">
                <span className="font-bold">Error:</span>
                <span className="break-all">{error}</span>
              </div>
            )}

            {/* Tab navigation */}
            <div className="flex border-b border-white/10 bg-[#040b1e]/80 text-xs font-semibold font-saira">
              {[
                { id: "basic", label: "1. Primary Info", icon: Box },
                { id: "details", label: "2. Technical Info", icon: FileText },
                { id: "assets", label: "3. Media & Files", icon: ImageIcon },
                { id: "seo", label: "4. SEO Meta", icon: Globe },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    type="button"
                    className={`flex-1 flex items-center justify-center gap-1.5 py-3 border-b-2 transition-all cursor-pointer ${
                      activeTab === tab.id
                        ? "border-yellow-300 text-yellow-300 bg-white/5"
                        : "border-transparent text-gray-400 hover:text-white hover:bg-white/2"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Form Scroll Body */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar text-sm font-saira">
              {fetchLoading ? (
                <div className="h-full flex flex-col items-center justify-center gap-3 py-20">
                  <div className="h-8 w-8 border-2 border-yellow-300 border-t-transparent rounded-full animate-spin" />
                  <span className="text-gray-400">Loading details from server...</span>
                </div>
              ) : (
                <>
                  {/* TAB 1: BASIC INFO */}
                  {activeTab === "basic" && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-4"
                    >
                      <div className="space-y-1.5">
                        <label className="text-gray-300 font-semibold">Project Title *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. BALIYO Vertical Feed Mixer"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="w-full h-11 px-4 rounded-xl border border-white/10 bg-[#0c1222]/80 text-white placeholder-gray-500 focus:border-yellow-300/40 focus:ring-0 outline-none transition-all"
                        />
                      </div>


                      <div className="space-y-1.5">
                        <label className="text-gray-300 font-semibold">Brief Description</label>
                        <textarea
                          rows={4}
                          placeholder="Write a clear summary of what this project accomplished..."
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="w-full p-4 rounded-xl border border-white/10 bg-[#0c1222]/80 text-white placeholder-gray-500 focus:border-yellow-300/40 focus:ring-0 outline-none transition-all resize-none leading-relaxed"
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* TAB 2: RICH DETAILS */}
                  {activeTab === "details" && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-4"
                    >
                      <div className="space-y-1.5">
                        <label className="text-gray-300 font-semibold">Technical Specifications (HTML allowed)</label>
                        <textarea
                          rows={3}
                          placeholder="<table><thead><tr><th>Specs</th><th>Details</th>... (supports html)"
                          value={specs}
                          onChange={(e) => setSpecs(e.target.value)}
                          className="w-full p-4 rounded-xl border border-white/10 bg-[#0c1222]/80 text-white placeholder-gray-500 focus:border-yellow-300/40 focus:ring-0 outline-none transition-all font-mono text-xs leading-relaxed"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-gray-300 font-semibold">Problem It Solves (HTML allowed)</label>
                        <textarea
                          rows={3}
                          placeholder="Detail the issues solved by this innovation..."
                          value={problemItSolves}
                          onChange={(e) => setProblemItSolves(e.target.value)}
                          className="w-full p-4 rounded-xl border border-white/10 bg-[#0c1222]/80 text-white placeholder-gray-500 focus:border-yellow-300/40 focus:ring-0 outline-none transition-all font-mono text-xs leading-relaxed"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-gray-300 font-semibold">Case Study Details (HTML allowed)</label>
                        <textarea
                          rows={3}
                          placeholder="Comprehensive case study content..."
                          value={caseStudy}
                          onChange={(e) => setCaseStudy(e.target.value)}
                          className="w-full p-4 rounded-xl border border-white/10 bg-[#0c1222]/80 text-white placeholder-gray-500 focus:border-yellow-300/40 focus:ring-0 outline-none transition-all font-mono text-xs leading-relaxed"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-gray-300 font-semibold">Team Members (HTML allowed)</label>
                        <textarea
                          rows={3}
                          placeholder="Key people involved in design, planning, or delivery..."
                          value={teamMember}
                          onChange={(e) => setTeamMember(e.target.value)}
                          className="w-full p-4 rounded-xl border border-white/10 bg-[#0c1222]/80 text-white placeholder-gray-500 focus:border-yellow-300/40 focus:ring-0 outline-none transition-all font-mono text-xs leading-relaxed"
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* TAB 3: MEDIA & FILES */}
                  {activeTab === "assets" && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-5"
                    >
                      {/* Thumbnail upload */}
                      <div className="bg-white/3 border border-white/5 p-4 rounded-2xl space-y-3">
                        <label className="text-gray-300 font-bold block">Thumbnail Image</label>
                        {existingThumbnail && !thumbnailFile && (
                          <div className="flex items-center gap-3 bg-[#0a0f1d] p-3 rounded-xl border border-white/10 mb-2">
                            <div className="relative h-10 w-16 rounded overflow-hidden">
                              <img src={existingThumbnail} alt="Thumbnail preview" className="object-cover w-full h-full" />
                            </div>
                            <span className="text-xs text-gray-400 truncate flex-1">Currently: {existingThumbnail.split("/").pop()}</span>
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setThumbnailFile(e.target.files ? e.target.files[0] : null)}
                          className="w-full text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-yellow-300/10 file:text-yellow-300 hover:file:bg-yellow-300/20 file:transition-all file:cursor-pointer"
                        />
                        {thumbnailFile && (
                          <div className="text-xs text-yellow-300 font-semibold">Ready to upload: {thumbnailFile.name}</div>
                        )}
                      </div>

                      {/* Catalogue file */}
                      <div className="bg-white/3 border border-white/5 p-4 rounded-2xl space-y-3">
                        <label className="text-gray-300 font-bold block">Project Catalogue PDF</label>
                        {existingCatalogue && !catalogueFile && (
                          <div className="flex items-center justify-between bg-[#0a0f1d] p-3 rounded-xl border border-white/10 mb-2 text-xs">
                            <span className="text-gray-400 truncate flex-1">Currently: {existingCatalogue.split("/").pop()}</span>
                          </div>
                        )}
                        <input
                          type="file"
                          accept="application/pdf,application/msword"
                          onChange={(e) => setCatalogueFile(e.target.files ? e.target.files[0] : null)}
                          className="w-full text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-yellow-300/10 file:text-yellow-300 hover:file:bg-yellow-300/20 file:transition-all file:cursor-pointer"
                        />
                        {catalogueFile && (
                          <div className="text-xs text-yellow-300 font-semibold">Ready to upload: {catalogueFile.name}</div>
                        )}
                      </div>

                      {/* Quotation file */}
                      <div className="bg-white/3 border border-white/5 p-4 rounded-2xl space-y-3">
                        <label className="text-gray-300 font-bold block">Quotation Details PDF</label>
                        {existingQuotation && !quotationFile && (
                          <div className="flex items-center justify-between bg-[#0a0f1d] p-3 rounded-xl border border-white/10 mb-2 text-xs">
                            <span className="text-gray-400 truncate flex-1">Currently: {existingQuotation.split("/").pop()}</span>
                          </div>
                        )}
                        <input
                          type="file"
                          accept="application/pdf,application/msword"
                          onChange={(e) => setQuotationFile(e.target.files ? e.target.files[0] : null)}
                          className="w-full text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-yellow-300/10 file:text-yellow-300 hover:file:bg-yellow-300/20 file:transition-all file:cursor-pointer"
                        />
                        {quotationFile && (
                          <div className="text-xs text-yellow-300 font-semibold">Ready to upload: {quotationFile.name}</div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* TAB 4: SEO METADATA */}
                  {activeTab === "seo" && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-4"
                    >
                      <div className="space-y-1.5">
                        <label className="text-gray-300 font-semibold">SEO Meta Title</label>
                        <input
                          type="text"
                          placeholder="e.g. Innovative Bowling Machine in Nepal | Baliyo Ventures"
                          value={metaTitle}
                          onChange={(e) => setMetaTitle(e.target.value)}
                          className="w-full h-11 px-4 rounded-xl border border-white/10 bg-[#0c1222]/80 text-white placeholder-gray-500 focus:border-yellow-300/40 focus:ring-0 outline-none transition-all"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-gray-300 font-semibold">SEO Meta Description</label>
                        <textarea
                          rows={4}
                          placeholder="Add meta tags description for google searches..."
                          value={metaDescription}
                          onChange={(e) => setMetaDescription(e.target.value)}
                          className="w-full p-4 rounded-xl border border-white/10 bg-[#0c1222]/80 text-white placeholder-gray-500 focus:border-yellow-300/40 focus:ring-0 outline-none transition-all resize-none leading-relaxed"
                        />
                      </div>
                    </motion.div>
                  )}
                </>
              )}
            </form>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-white/10 bg-[#050e26] flex justify-between items-center">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-semibold transition-all cursor-pointer font-saira text-gray-300 hover:text-white"
              >
                Cancel
              </button>
              
              <button
                type="button"
                disabled={loading || fetchLoading}
                onClick={handleSubmit}
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-yellow-300 to-[#FFFCCB] text-[#00040C] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm transition-all cursor-pointer font-oxanium flex items-center gap-1.5 shadow-lg shadow-yellow-500/10"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-[#00040C]" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 text-[#00040C]" />
                    Save Project
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
