"use client";

import { ProjectDailyUpdate } from "@/types/projects";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  Clock,
  FileText,
  FolderGit2,
  HelpCircle,
  Loader2,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface ProjectSimple {
  id: number;
  title: string;
  slug: string;
}

function timeAgo(dateStr: string) {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  const days = Math.floor(diff / 86400);
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function DailyLogsView() {
  const [logs, setLogs] = useState<ProjectDailyUpdate[]>([]);
  const [loading, setLoading] = useState(true);

  // Ordered project list derived from logs (most recent first)
  const [orderedProjects, setOrderedProjects] = useState<ProjectSimple[]>([]);

  // All Product Development Projects fetched from API
  const [allProjects, setAllProjects] = useState<ProjectSimple[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const apiBase =
    process.env.NEXT_PUBLIC_API_URL || "https://yachu.baliyoventures.com/api/baliyo";

  // Fetch all Product Development projects for the filter dropdown
  useEffect(() => {
    const fetchAllProjects = async () => {
      setLoadingProjects(true);
      try {
        const res = await fetch(
          `${apiBase}/projects/?category=product-development&page_size=100`,
          { cache: "no-store" }
        );
        if (res.ok) {
          const data = await res.json();
          const results = data.results || data;
          setAllProjects(results.map((p: any) => ({ id: p.id, title: p.title, slug: p.slug })));
        }
      } catch (err) {
        console.error("Failed to fetch all projects:", err);
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchAllProjects();
  }, [apiBase]);

  // Build the API URL based on active filters
  const buildUrl = (projectId: number | null, search: string) => {
    const params = new URLSearchParams();
    params.set("category", "product-development");
    if (projectId) params.set("project", String(projectId));
    if (search.trim()) params.set("search", search.trim());
    return `${apiBase}/project-daily-updates/?${params.toString()}`;
  };

  const fetchLogs = async (projectId: number | null, search: string) => {
    setLoading(true);
    try {
      const res = await fetch(buildUrl(projectId, search), { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        const results: ProjectDailyUpdate[] = data.results || data;
        setLogs(results);

        // Build ordered project list from returned logs — deduplicated, order = first appearance
        if (projectId === null) {
          const seen = new Set<number>();
          const derived: ProjectSimple[] = [];
          results.forEach((log) => {
            if (!seen.has(log.project)) {
              seen.add(log.project);
              derived.push({
                id: log.project,
                title: log.project_title || `Project #${log.project}`,
                slug: log.project_slug || "",
              });
            }
          });
          setOrderedProjects(derived);
        }
      }
    } catch (err) {
      console.error("Failed to fetch daily logs:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchLogs(null, "");
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // When project filter changes → immediate API call
  const handleSelectProject = (id: number | null) => {
    setSelectedProjectId(id);
    fetchLogs(id, searchTerm);
  };

  // Search with debounce → API call
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      fetchLogs(selectedProjectId, value);
    }, 350);
  };

  const handleDeleteLog = async (id: number) => {
    setDeletingId(id);
    try {
      const res = await fetch(`${apiBase}/project-daily-updates/${id}/`, {
        method: "DELETE",
      });
      if (res.ok) {
        setLogs((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete daily log:", err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Daily Project Logs
          </h1>

        </div>
        <Link
          href="/admin/daily-logs/create"
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-all shadow-xs shrink-0"
        >
          <Plus className="h-4 w-4 text-white" />
          Log Daily Update
        </Link>
      </div>

      {/* Search & Filter Row in Same Line */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-3 shadow-xs flex-1 max-w-2xl">
          <Search className="h-4 w-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search daily logs by title, decision, or problem..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="flex-1 bg-transparent text-xs text-slate-900 placeholder-slate-400 border-none outline-none font-sans"
          />
          {searchTerm && (
            <button
              onClick={() => handleSearch("")}
              className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer p-0.5 shrink-0"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filters & Count */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Custom project dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((o) => !o)}
              className="inline-flex items-center gap-2 px-3.5 p-3 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:border-slate-300 transition-all cursor-pointer min-w-[140px] justify-between shadow-xs"
            >
              <span className="truncate">
                {selectedProjectId !== null
                  ? ((allProjects.find((p) => p.id === selectedProjectId) || orderedProjects.find((p) => p.id === selectedProjectId))?.title ?? "Project")
                  : "All Projects"}
              </span>
              <span className="flex items-center gap-0.5 shrink-0 ml-1">
                {selectedProjectId !== null && (
                  <span
                    onClick={(e) => { e.stopPropagation(); handleSelectProject(null); }}
                    className="p-0.5 rounded text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                  >
                    <X className="h-3 w-3" />
                  </span>
                )}
                <ChevronDown
                  className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-150 ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </span>
            </button>

            {/* Dropdown panel */}
            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-1 w-60 bg-white border border-slate-200 rounded-xl shadow-xl z-30 py-1 overflow-hidden">
                {/* All option */}
                <button
                  onClick={() => { handleSelectProject(null); setDropdownOpen(false); }}
                  className={`w-full flex items-center justify-between px-3.5 py-2 text-xs cursor-pointer text-left transition-colors
                    ${selectedProjectId === null
                      ? "text-slate-900 font-bold bg-slate-100/70"
                      : "text-slate-700 hover:bg-slate-50 font-medium"
                    }`}
                >
                  <span>All Projects</span>
                  {selectedProjectId === null && (
                    <span className="text-slate-900 text-xs font-bold">✓</span>
                  )}
                </button>

                <div className="my-1 border-t border-slate-100" />

                {/* Per-project options from API */}
                <div className="max-h-60 overflow-y-auto divide-y divide-slate-50">
                  {loadingProjects ? (
                    <div className="p-3 flex items-center gap-2 text-xs text-slate-400 justify-center">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading all projects...
                    </div>
                  ) : (allProjects.length > 0 ? allProjects : orderedProjects).map((p) => {
                    const isActive = selectedProjectId === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => { handleSelectProject(p.id); setDropdownOpen(false); }}
                        className={`w-full flex items-center justify-between px-3.5 py-2 text-xs cursor-pointer text-left transition-colors
                          ${isActive
                            ? "text-slate-900 font-bold bg-slate-100/70"
                            : "text-slate-700 hover:bg-slate-50 font-medium"
                          }`}
                      >
                        <div className="min-w-0 flex-1 truncate">
                          <span className="truncate">{p.title}</span>
                        </div>
                        {isActive && (
                          <span className="text-slate-900 text-xs font-bold shrink-0 ml-2">✓</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Entry count */}
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
            {loading ? (
              <span className="flex items-center gap-1.5 text-slate-300">
                <Loader2 className="h-3 w-3 animate-spin" /> loading…
              </span>
            ) : (
              `${logs.length} ${logs.length === 1 ? "entry" : "entries"}`
            )}
          </span>
        </div>
      </div>

      {/* Timeline */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-6 w-6 text-slate-300 animate-spin" />
        </div>
      ) : logs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Clock className="h-12 w-12 text-slate-200 mb-3" />
          <p className="text-sm font-semibold text-slate-600">No daily logs found</p>
          <p className="text-xs text-slate-400 mt-1 max-w-xs">
            {searchTerm || selectedProjectId
              ? "Try clearing your filters."
              : 'Click "Log Daily Update" to record your first entry.'}
          </p>
          {!searchTerm && !selectedProjectId && (
            <Link
              href="/admin/daily-logs/create"
              className="mt-4 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-all"
            >
              <Plus className="h-3.5 w-3.5" />
              Create First Log
            </Link>
          )}
        </div>
      ) : (
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-5 top-0 bottom-0 w-px bg-slate-200" />

          <div className="space-y-0">
            {logs.map((log) => {
              const hasExtras = log.decision || log.reason || log.problem;
              return (
                <div key={log.id} className="relative flex gap-5 group">
                  {/* Icon node on the line */}
                  <div className="relative z-10 flex-shrink-0 w-10 flex flex-col items-center">
                    <div
                      className={`mt-5 w-10 h-10 rounded-full border-2 flex items-center justify-center bg-white
                        ${hasExtras ? "border-violet-300" : "border-slate-300"}`}
                    >
                      <FileText
                        className={`h-4 w-4 ${
                          hasExtras ? "text-violet-500" : "text-slate-400"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Card + timestamp */}
                  <div className="flex-1 pb-6 min-w-0">
                    {/* Timestamp */}
                    <p className="text-[11px] text-slate-400 mt-5 mb-2 font-medium">
                      {timeAgo(log.created_at)}{" "}
                      <span className="text-slate-300">({formatTime(log.created_at)})</span>
                    </p>

                    {/* Card */}
                    <div className="bg-white border border-slate-200 rounded-xl shadow-xs hover:shadow-sm transition-shadow overflow-hidden">
                      <div className="p-4">
                        {/* Task text */}
                        <p className="text-xs text-slate-800 font-medium leading-relaxed whitespace-pre-line">
                          {log.task}
                        </p>

                        {/* Extras */}
                        {hasExtras && (
                          <div className="mt-3 flex flex-col gap-2">
                            {log.decision && (
                              <div className="flex items-start gap-2">
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" />
                                <div>
                                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                                    Decision
                                  </span>
                                  <p className="text-[11px] text-slate-600 mt-0.5 leading-normal">
                                    {log.decision}
                                  </p>
                                </div>
                              </div>
                            )}
                            {log.reason && (
                              <div className="flex items-start gap-2">
                                <HelpCircle className="h-3.5 w-3.5 text-blue-500 mt-0.5 shrink-0" />
                                <div>
                                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                                    Reason
                                  </span>
                                  <p className="text-[11px] text-slate-600 mt-0.5 leading-normal">
                                    {log.reason}
                                  </p>
                                </div>
                              </div>
                            )}
                            {log.problem && (
                              <div className="flex items-start gap-2">
                                <AlertTriangle className="h-3.5 w-3.5 text-rose-500 mt-0.5 shrink-0" />
                                <div>
                                  <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">
                                    Problem
                                  </span>
                                  <p className="text-[11px] text-rose-600 mt-0.5 leading-normal">
                                    {log.problem}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Card footer */}
                      <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between">
                        {log.project_slug ? (
                          <Link
                            href={`/admin/projects/${log.project_slug}?tab=daily_updates`}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-violet-600 hover:text-violet-800 transition-colors"
                          >
                            <FolderGit2 className="h-3 w-3" />
                            {log.project_title || `Project #${log.project}`}
                          </Link>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                            <FolderGit2 className="h-3 w-3" />
                            {log.project_title || `Project #${log.project}`}
                          </span>
                        )}

                        <button
                          onClick={() => handleDeleteLog(log.id)}
                          disabled={deletingId === log.id}
                          className="p-1 rounded-md text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer disabled:opacity-50"
                          title="Delete log"
                        >
                          {deletingId === log.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
