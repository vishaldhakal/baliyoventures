"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ExternalLink, FileText, Globe, Tag, Info, User, HelpCircle, Award, Layers } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ProjectDetailResponse } from "@/types/projects";

interface ProjectDetailSheetProps {
  isOpen: boolean;
  onClose: () => void;
  projectSlug: string | null;
}

export default function ProjectDetailSheet({
  isOpen,
  onClose,
  projectSlug,
}: ProjectDetailSheetProps) {
  const [project, setProject] = useState<ProjectDetailResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen || !projectSlug) {
      setProject(null);
      return;
    }

    const fetchDetails = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(
          `https://yachu.baliyoventures.com/api/baliyo/projects/${projectSlug}/`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch project details");
        }
        const data = await response.json();
        setProject(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Could not retrieve project info.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [isOpen, projectSlug]);

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

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

          {/* Sliding Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="fixed inset-y-0 right-0 w-full max-w-2xl bg-[#030a1c] border-l border-white/10 z-50 shadow-2xl flex flex-col justify-between"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#050e26]">
              <div className="flex items-center gap-2.5">
                <Info className="h-5 w-5 text-yellow-300" />
                <h2 className="text-xl font-bold font-oxanium text-[#FCE8C6] tracking-tight">
                  Project Workspace Details
                </h2>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-all cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              {loading ? (
                <div className="h-64 flex flex-col items-center justify-center gap-3">
                  <div className="h-8 w-8 border-2 border-yellow-300 border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm text-gray-400 font-saira">Retrieving details...</span>
                </div>
              ) : error ? (
                <div className="bg-red-950/40 border border-red-500/30 p-4 rounded-xl text-center text-red-200 text-sm font-saira">
                  {error}
                </div>
              ) : project ? (
                <div className="space-y-6">
                  {/* Thumbnail / Large Image */}
                  <div className="relative aspect-[16/9] w-full bg-gray-950 rounded-2xl overflow-hidden border border-white/10">
                    {project.thumbnail_image ? (
                      <Image
                        src={project.thumbnail_image}
                        alt={project.thumbnail_image_alt_description || project.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm font-saira">
                        No Project Image
                      </div>
                    )}
                  </div>

                  {/* Title & Slug */}
                  <div className="space-y-1">
                    <span className="text-[10px] bg-yellow-300/10 text-yellow-300 px-2 py-0.5 rounded border border-yellow-300/20 font-saira uppercase font-bold">
                      {project.category && project.category[0]?.title || "Product Development"}
                    </span>
                    <h3 className="text-2xl font-bold text-white font-oxanium pt-1">
                      {project.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <div className="bg-white/5 border border-white/5 p-5 rounded-2xl space-y-2">
                    <h4 className="text-xs font-bold text-[#FCE8C6] font-oxanium uppercase tracking-wider flex items-center gap-2">
                      <Layers className="h-4 w-4" /> Description
                    </h4>
                    <p className="text-gray-300 text-sm font-saira leading-relaxed whitespace-pre-wrap">
                      {project.description || "No description provided."}
                    </p>
                  </div>

                  {/* HTML Content Rich Fields (specs, problem solves, case study, team member) */}
                  {[
                    { title: "Technical Specifications", content: project.specs, icon: Award },
                    { title: "Problem It Solves", content: project.problem_it_solves, icon: HelpCircle },
                    { title: "Case Study Details", content: project.case_study, icon: FileText },
                    { title: "Team Members Involved", content: project.team_member, icon: User },
                  ].map((field) => {
                    const Icon = field.icon;
                    if (!field.content) return null;
                    return (
                      <div key={field.title} className="bg-white/5 border border-white/5 p-5 rounded-2xl space-y-3">
                        <h4 className="text-xs font-bold text-[#FCE8C6] font-oxanium uppercase tracking-wider flex items-center gap-2">
                          <Icon className="h-4 w-4" /> {field.title}
                        </h4>
                        <div
                          className="text-gray-300 text-sm font-saira leading-relaxed prose prose-invert max-w-none prose-sm"
                          dangerouslySetInnerHTML={{ __html: field.content }}
                        />
                      </div>
                    );
                  })}

                  {/* Files & Documents Attachments */}
                  {(project.catalogue || project.quotation) && (
                    <div className="bg-[#050e26] border border-white/10 p-5 rounded-2xl space-y-3">
                      <h4 className="text-xs font-bold text-[#FCE8C6] font-oxanium uppercase tracking-wider flex items-center gap-2">
                        <FileText className="h-4 w-4" /> Attached Files & Forms
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        {project.catalogue && (
                          <Link
                            href={project.catalogue}
                            target="_blank"
                            className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-all text-xs font-saira"
                          >
                            <span className="text-gray-300 truncate mr-2">Download Catalogue</span>
                            <ExternalLink className="h-3.5 w-3.5 text-yellow-300" />
                          </Link>
                        )}
                        {project.quotation && (
                          <Link
                            href={project.quotation}
                            target="_blank"
                            className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-all text-xs font-saira"
                          >
                            <span className="text-gray-300 truncate mr-2">Download Quotation</span>
                            <ExternalLink className="h-3.5 w-3.5 text-yellow-300" />
                          </Link>
                        )}
                      </div>
                    </div>
                  )}

                  {/* SEO Fields */}
                  <div className="bg-white/5 border border-white/5 p-5 rounded-2xl space-y-3">
                    <h4 className="text-xs font-bold text-[#FCE8C6] font-oxanium uppercase tracking-wider flex items-center gap-2">
                      <Globe className="h-4 w-4" /> Search Engine Optimization (SEO)
                    </h4>
                    <div className="space-y-2 text-xs font-saira text-gray-300">
                      <div>
                        <span className="text-gray-500 font-bold block mb-1">Meta Title</span>
                        <span className="text-white bg-black/40 px-3 py-2 rounded-xl block border border-white/5">{project.meta_title || "None"}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 font-bold block mb-1">Meta Description</span>
                        <span className="text-white bg-black/40 px-3 py-2 rounded-xl block border border-white/5 leading-relaxed">{project.meta_description || "None"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500 text-sm font-saira">
                  No data loaded.
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="px-6 py-4 border-t border-white/10 bg-[#050e26] flex justify-between items-center">
              {project && (
                <Link
                  href={`/project/${project.slug}`}
                  target="_blank"
                  className="flex items-center gap-1.5 text-xs text-yellow-300 hover:text-white font-saira font-semibold transition-colors"
                >
                  View live page
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              )}
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-semibold transition-all cursor-pointer font-saira text-gray-300 hover:text-white"
              >
                Close Details
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
