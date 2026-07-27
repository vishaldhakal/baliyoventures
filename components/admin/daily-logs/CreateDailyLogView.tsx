"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  Save,
  Loader2,
  FolderGit2,
  CheckCircle2,
  HelpCircle,
  AlertTriangle,
  ChevronDown,
  Check,
  Search,
} from "lucide-react";

interface ProjectSimple {
  id: number;
  title: string;
  slug: string;
}

export default function CreateDailyLogView() {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectSimple[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  // Form states
  const [formProjectId, setFormProjectId] = useState<number | "">("");
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  const [projectSearch, setProjectSearch] = useState("");
  const [searchingProjects, setSearchingProjects] = useState(false);
  const [formTask, setFormTask] = useState("");
  const [formDecision, setFormDecision] = useState("");
  const [formReason, setFormReason] = useState("");
  const [formProblem, setFormProblem] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const apiBase =
    process.env.NEXT_PUBLIC_API_URL || "https://yachu.baliyoventures.com/api/baliyo";

  useEffect(() => {
    const fetchProjects = async () => {
      setSearchingProjects(true);
      try {
        const query = projectSearch.trim();
        const searchParam = query ? `&search=${encodeURIComponent(query)}` : "";
        const res = await fetch(
          `${apiBase}/projects/?category=product-development&page_size=100${searchParam}`,
          { cache: "no-store" }
        );
        if (res.ok) {
          const data = await res.json();
          const results = data.results || data;
          setProjects(results.map((p: any) => ({ id: p.id, title: p.title, slug: p.slug })));
        }
      } catch (err) {
        console.error("Failed to fetch projects:", err);
      } finally {
        setLoadingProjects(false);
        setSearchingProjects(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchProjects();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [apiBase, projectSearch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formProjectId || !formTask.trim()) {
      setError("Please select a project and enter the task details.");
      return;
    }
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch(`${apiBase}/project-daily-updates/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project: formProjectId,
          task: formTask.trim(),
          decision: formDecision.trim() || null,
          reason: formReason.trim() || null,
          problem: formProblem.trim() || null,
        }),
      });

      if (res.ok) {
        router.push("/admin/daily-logs");
        router.refresh();
      } else {
        const data = await res.json();
        setError(JSON.stringify(data));
      }
    } catch (err) {
      console.error("Failed to submit daily update:", err);
      setError("An unexpected error occurred while saving.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 font-sans">
      {/* Back Button & Header */}
      <div className="border-b border-slate-200 pb-5">
        <Link
          href="/admin/daily-logs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-3"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Daily Logs
        </Link>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <Clock className="h-7 w-7 text-slate-900" />
          Create Daily R&D Log
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Record daily engineering tasks, key decisions, rationale, and technical blockers for a project.
        </p>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 space-y-6 shadow-xs">
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {error}
          </div>
        )}

        {/* 1. Project Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
            <FolderGit2 className="h-4 w-4 text-slate-700" />
            Select Product Development Project <span className="text-rose-500">*</span>
          </label>
          {loadingProjects ? (
            <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading projects...
            </div>
          ) : (
            <div className="relative">
              {(() => {
                const selectedProject = projects.find((p) => p.id === formProjectId);
                return (
                  <>
                    <button
                      type="button"
                      onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}
                      className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-xs font-medium transition-all cursor-pointer text-left shadow-xs ${
                        isProjectDropdownOpen
                          ? "bg-white border-slate-400 ring-2 ring-slate-900/5 text-slate-900"
                          : "bg-slate-50 hover:bg-slate-100/80 border-slate-200 text-slate-900"
                      }`}
                    >
                      {selectedProject ? (
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <FolderGit2 className="h-4 w-4 text-slate-800 shrink-0" />
                          <span className="font-bold text-slate-900 truncate">{selectedProject.title}</span>
                          <span className="text-[10px] font-mono text-slate-400 truncate">/{selectedProject.slug}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 font-medium">-- Choose Product Project --</span>
                      )}
                      <ChevronDown
                        className={`h-4 w-4 text-slate-500 shrink-0 transition-transform duration-200 ${
                          isProjectDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {isProjectDropdownOpen && (
                        <>
                          <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsProjectDropdownOpen(false)}
                          />
                          <motion.div
                            initial={{ opacity: 0, y: -4, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -4, scale: 0.98 }}
                            transition={{ duration: 0.15 }}
                            className="absolute top-full left-0 right-0 mt-2 z-50 rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden flex flex-col w-full"
                          >
                            {/* Search Input Box */}
                            <div className="p-2 bg-slate-50/90 border-b border-slate-200 shrink-0">
                              <div className="relative flex items-center">
                                <Search className="absolute left-3.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                                <input
                                  type="text"
                                  placeholder="Search project title or slug..."
                                  value={projectSearch}
                                  onChange={(e) => setProjectSearch(e.target.value)}
                                  className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all"
                                  autoFocus
                                />
                              </div>
                            </div>

                            {/* Project Items List */}
                            <div className="overflow-y-auto max-h-56 divide-y divide-slate-100">
                              {searchingProjects ? (
                                <div className="p-4 flex items-center justify-center gap-2 text-xs text-slate-500 font-medium">
                                  <Loader2 className="h-4 w-4 animate-spin text-slate-400" /> Searching projects...
                                </div>
                              ) : projects.length > 0 ? (
                                projects.map((p) => {
                                  const isSelected = formProjectId === p.id;
                                  return (
                                    <button
                                      key={p.id}
                                      type="button"
                                      onClick={() => {
                                        setFormProjectId(p.id);
                                        setIsProjectDropdownOpen(false);
                                        setProjectSearch("");
                                      }}
                                      className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs transition-colors cursor-pointer text-left ${
                                        isSelected
                                          ? "bg-slate-900 text-white font-bold"
                                          : "hover:bg-slate-50 text-slate-800"
                                      }`}
                                    >
                                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                        <FolderGit2
                                          className={`h-4 w-4 shrink-0 ${
                                            isSelected ? "text-amber-400" : "text-slate-500"
                                          }`}
                                        />
                                        <span
                                          className={`truncate ${
                                            isSelected ? "text-white" : "text-slate-900 font-semibold"
                                          }`}
                                        >
                                          {p.title}
                                        </span>
                                        <span
                                          className={`text-[10px] font-mono truncate ${
                                            isSelected ? "text-slate-300" : "text-slate-400"
                                          }`}
                                        >
                                          /{p.slug}
                                        </span>
                                      </div>
                                      {isSelected && (
                                        <Check className="h-4 w-4 text-amber-400 shrink-0 ml-2" />
                                      )}
                                    </button>
                                  );
                                })
                              ) : (
                                <div className="p-4 text-center text-xs text-slate-400 font-medium">
                                  No projects found matching "{projectSearch}"
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
          )}
          <p className="text-[11px] text-slate-400">
            Select the project this daily R&D update applies to.
          </p>
        </div>

        <hr className="border-slate-100" />

        {/* 2. Task Description */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-slate-700" />
            User Task <span className="text-rose-500">*</span>
          </label>
          <textarea
            required
            rows={4}
            placeholder="e.g. Assembled power PCB v2, calibrated stepper motors, updated ROS2 nav2 parameters..."
            value={formTask}
            onChange={(e) => setFormTask(e.target.value)}
            className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 placeholder-slate-400 outline-none focus:border-slate-400 focus:bg-white transition-all"
          />
          <p className="text-[11px] text-slate-400">
            Provide a clear summary of tasks accomplished during this update.
          </p>
        </div>

        <hr className="border-slate-100" />

        {/* 3. Decision Made */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            Decision (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Switched motor driver from L298N to TMC2209 for silent stepping"
            value={formDecision}
            onChange={(e) => setFormDecision(e.target.value)}
            className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 placeholder-slate-400 outline-none focus:border-slate-400 focus:bg-white transition-all"
          />
        </div>

        {/* 4. Reason / Rationale */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <HelpCircle className="h-4 w-4 text-blue-600" />
            Reason (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. TMC2209 offers UART control, stealthChop, and lower thermal output"
            value={formReason}
            onChange={(e) => setFormReason(e.target.value)}
            className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 placeholder-slate-400 outline-none focus:border-slate-400 focus:bg-white transition-all"
          />
        </div>

        {/* 5. Problem / Blocker */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle className="h-4 w-4 text-rose-600" />
            Problem (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Waiting on custom 3D printed motor mounts from workshop"
            value={formProblem}
            onChange={(e) => setFormProblem(e.target.value)}
            className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 placeholder-slate-400 outline-none focus:border-slate-400 focus:bg-white transition-all"
          />
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Link
            href="/admin/daily-logs"
            className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-semibold hover:bg-slate-200 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting || !formProjectId || !formTask.trim()}
            className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-all flex items-center gap-2 shadow-xs disabled:opacity-50 cursor-pointer"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin text-white" />
            ) : (
              <Save className="h-4 w-4 text-white" />
            )}
            Save Daily Log Entry
          </button>
        </div>
      </form>
    </div>
  );
}
