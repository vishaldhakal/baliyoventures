"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ProjectsListResponse } from "@/types/projects";
import { AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  Circle,
  Eye,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// Subcomponents
import ProjectFormModal from "./ProjectFormModal";

interface AdminProjectsViewProps {
  projectsData: ProjectsListResponse;
  currentPage: number;
  pageSize: number;
  error?: boolean;
}

export default function AdminProjectsView({
  projectsData,
  currentPage,
  pageSize,
  error = false,
}: AdminProjectsViewProps) {
  const router = useRouter();

  // Client-side search state
  const [searchTerm, setSearchTerm] = useState("");

  // Modals states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formProjectSlug, setFormProjectSlug] = useState<string | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteProjectSlug, setDeleteProjectSlug] = useState<string | null>(null);
  const [deleteProjectTitle, setDeleteProjectTitle] = useState("");
  const [deleting, setDeleting] = useState(false);

  // Status change state — optimistic update map
  const [statusMap, setStatusMap] = useState<Record<string, "in_progress" | "completed">>({});
  const [updatingStatus, setUpdatingStatus] = useState<Record<string, boolean>>({});
  const [openStatusSlug, setOpenStatusSlug] = useState<string | null>(null);
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number } | null>(null);
  const statusMenuRef = useRef<HTMLDivElement>(null);

  // Close on outside click (targets the floating fixed menu)
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (statusMenuRef.current && !statusMenuRef.current.contains(e.target as Node)) {
        setOpenStatusSlug(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close on scroll or resize
  useEffect(() => {
    const close = () => setOpenStatusSlug(null);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, []);

  const handleStatusChange = async (
    slug: string,
    newStatus: "in_progress" | "completed"
  ) => {
    setStatusMap((prev) => ({ ...prev, [slug]: newStatus }));
    setUpdatingStatus((prev) => ({ ...prev, [slug]: true }));
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://yachu.baliyoventures.com/api/baliyo";
      await fetch(`${apiBase}/projects/${slug}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setUpdatingStatus((prev) => ({ ...prev, [slug]: false }));
    }
  };

  const totalPages = Math.ceil(projectsData.count / pageSize);

  // Filter projects by search term client-side
  const filteredProjects = projectsData.results.filter(
    (project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.slug && project.slug.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  // Pagination calculation
  const getPageNumbers = (): (number | string)[] => {
    const delta = 2;
    const range: number[] = [];
    const rangeWithDots: (number | string)[] = [];
    let l: number | undefined;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      }
    }

    range.forEach((i) => {
      if (l !== undefined) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  };

  // Open full page workspace
  const handleOpenDetails = (slug: string) => {
    router.push(`/admin/projects/${slug}`);
  };

  // Open Form (Create / Edit)
  const handleOpenForm = (slug: string | null = null) => {
    setFormProjectSlug(slug);
    setIsFormOpen(true);
  };

  // Open Delete dialog
  const handleOpenDelete = (slug: string, title: string) => {
    setDeleteProjectSlug(slug);
    setDeleteProjectTitle(title);
    setIsDeleteOpen(true);
  };

  // Execute deletion
  const handleDelete = async () => {
    if (!deleteProjectSlug) return;
    setDeleting(true);
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://yachu.baliyoventures.com/api/baliyo";
      const res = await fetch(`${apiBase}/projects/${deleteProjectSlug}/`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Failed to delete project.");
      }
      setIsDeleteOpen(false);
      setDeleteProjectSlug(null);
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Could not delete project. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Product Development Projects
          </h1>

        </div>
        <button
          onClick={() => handleOpenForm(null)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-all cursor-pointer shadow-sm shrink-0"
        >
          <Plus className="h-4 w-4 text-white" />
          Create Project
        </button>
      </div>

      {/* Search Filter bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-3 shadow-xs">
        <Search className="h-4 w-4 text-slate-400 shrink-0" />
        <input
          type="text"
          placeholder="Search projects by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 bg-transparent text-xs text-slate-900 placeholder-slate-400 border-none outline-none font-sans"
        />
      </div>

      {/* Projects Table Layout */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          {error ? (
            <div className="flex items-center justify-center py-10">
              <p className="text-xs text-rose-500">Failed to fetch projects.</p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4 space-y-2">
              <AlertCircle className="h-10 w-10 text-slate-300" />
              <h3 className="text-sm font-bold text-slate-700">
                No Projects Found
              </h3>
              <p className="text-slate-400 text-xs max-w-xs font-sans">
                We couldn't find any projects matching "{searchTerm}".
              </p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs font-sans">
              <thead>
                <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-600 font-semibold">
                  <th className="px-6 py-3.5 w-20">Thumbnail</th>
                  <th className="px-6 py-3.5">Title</th>
                  <th className="px-6 py-3.5 max-w-xs">Short Description</th>
                  <th className="px-6 py-3.5">Category</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredProjects.map((project) => (
                  <tr
                    key={project.id}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    onClick={() => handleOpenDetails(project.slug)}
                  >
                    {/* Thumbnail Image */}
                    <td
                      className="px-6 py-3.5 whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="relative h-10 w-16 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                        {project.thumbnail_image ? (
                          <Image
                            src={project.thumbnail_image}
                            alt={project.thumbnail_image_alt_description || project.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[9px] text-slate-400">
                            No Image
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Project Title */}
                    <td className="px-6 py-3.5 font-semibold text-slate-900 text-sm truncate max-w-[220px]">
                      {project.title}
                    </td>

                    {/* Project Meta Description */}
                    <td className="px-6 py-3.5 max-w-xs truncate text-slate-500">
                      {project.meta_description || "No project description available."}
                    </td>

                    {/* Category Label */}
                    <td className="px-6 py-3.5 whitespace-nowrap">
                      <span className="inline-block text-[10px] font-semibold bg-amber-50 text-amber-800 px-2.5 py-0.5 rounded-full border border-amber-200">
                        Product Dev
                      </span>
                    </td>

                    {/* Status Dropdown */}
                    <td
                      className="px-6 py-3.5 whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="relative inline-block">
                        {/* Trigger pill */}
                        <button
                          onClick={(e) => {
                            if (openStatusSlug === project.slug) {
                              setOpenStatusSlug(null);
                            } else {
                              const rect = (e.currentTarget as HTMLButtonElement).getBoundingClientRect();
                              setDropdownPos({ top: rect.bottom + 6, left: rect.left });
                              setOpenStatusSlug(project.slug);
                            }
                          }}
                          disabled={updatingStatus[project.slug]}
                          className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full border transition-all cursor-pointer select-none ${
                            (statusMap[project.slug] ?? project.status ?? "in_progress") === "completed"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                              : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                          } disabled:opacity-60 disabled:cursor-not-allowed`}
                        >
                          {updatingStatus[project.slug] ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (statusMap[project.slug] ?? project.status ?? "in_progress") === "completed" ? (
                            <CheckCircle2 className="h-3 w-3" />
                          ) : (
                            <Circle className="h-3 w-3" />
                          )}
                          {(statusMap[project.slug] ?? project.status ?? "in_progress") === "completed"
                            ? "Completed"
                            : "In Progress"}
                          <ChevronDown
                            className={`h-3 w-3 transition-transform duration-200 ${
                              openStatusSlug === project.slug ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      </div>
                    </td>

                    {/* Actions Trigger Buttons */}
                    <td
                      className="px-6 py-3.5 whitespace-nowrap text-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex justify-center items-center gap-2">
                        {/* Open detail workspace */}
                        <button
                          onClick={() => handleOpenDetails(project.slug)}
                          title="Open Workspace"
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>

                        {/* Open editor */}
                        <button
                          onClick={() => handleOpenForm(project.slug)}
                          title="Edit project details"
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all cursor-pointer"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>

                        {/* Delete entry */}
                        <button
                          onClick={() => handleOpenDelete(project.slug, project.title)}
                          title="Delete entry"
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
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pt-2 flex justify-center">
          <Pagination>
            <PaginationContent className="gap-1.5">
              <PaginationItem>
                <PaginationPrevious
                  href={`/admin?page=${currentPage - 1}`}
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-40 text-slate-400 border-slate-200"
                      : "text-slate-700 hover:bg-slate-100 border-slate-200 bg-white"
                  }
                />
              </PaginationItem>

              {getPageNumbers().map((pageNumber, index) => (
                <PaginationItem key={index}>
                  {pageNumber === "..." ? (
                    <PaginationEllipsis className="text-slate-400" />
                  ) : (
                    <PaginationLink
                      href={`/admin?page=${pageNumber}`}
                      isActive={pageNumber === currentPage}
                      className={
                        pageNumber === currentPage
                          ? "bg-slate-900 text-white font-bold border-slate-900"
                          : "text-slate-700 hover:bg-slate-100 border-slate-200 bg-white"
                      }
                    >
                      {pageNumber}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href={`/admin?page=${currentPage + 1}`}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-40 text-slate-400 border-slate-200"
                      : "text-slate-700 hover:bg-slate-100 border-slate-200 bg-white"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* RENDER MODALS */}
      <ProjectFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setFormProjectSlug(null);
        }}
        onSuccess={() => {
          router.refresh();
        }}
        projectSlug={formProjectSlug}
      />

      {/* Fixed-position status dropdown — floats above all overflow containers */}
      {openStatusSlug && dropdownPos && (
        <>
          {/* Transparent backdrop to close on outside click */}
          <div
            className="fixed inset-0 z-[60]"
            onClick={() => setOpenStatusSlug(null)}
          />
          <div
            ref={statusMenuRef}
            style={{ top: dropdownPos.top, left: dropdownPos.left }}
            className="fixed z-[61] w-44 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden"
          >
            <button
              onClick={() => {
                const proj = filteredProjects.find((p) => p.slug === openStatusSlug);
                if (proj) handleStatusChange(proj.slug, "in_progress");
                setOpenStatusSlug(null);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-xs transition-colors hover:bg-slate-50 ${
                (statusMap[openStatusSlug] ??
                  filteredProjects.find((p) => p.slug === openStatusSlug)?.status ??
                  "in_progress") === "in_progress"
                  ? "text-amber-700 font-semibold bg-amber-50/60"
                  : "text-slate-600"
              }`}
            >
              <Circle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
              In Progress
            </button>
            <div className="mx-3 border-t border-slate-100" />
            <button
              onClick={() => {
                const proj = filteredProjects.find((p) => p.slug === openStatusSlug);
                if (proj) handleStatusChange(proj.slug, "completed");
                setOpenStatusSlug(null);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-xs transition-colors hover:bg-slate-50 ${
                (statusMap[openStatusSlug] ??
                  filteredProjects.find((p) => p.slug === openStatusSlug)?.status ??
                  "in_progress") === "completed"
                  ? "text-emerald-700 font-semibold bg-emerald-50/60"
                  : "text-slate-600"
              }`}
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              Completed
            </button>
          </div>
        </>
      )}

      {/* Delete Confirmation Alert Modal */}
      <AnimatePresence>
        {isDeleteOpen && (
          <>
            <div
              onClick={() => setIsDeleteOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 cursor-pointer"
            />
            <div className="fixed inset-0 m-auto w-full max-w-md h-fit bg-white border border-slate-200 z-50 rounded-2xl p-6 shadow-xl space-y-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-rose-100 text-rose-600 rounded-xl">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Delete Project Entry?
                  </h3>
                  <p className="text-xs text-slate-500">
                    This action is permanent and cannot be undone.
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-xs text-slate-700 leading-relaxed">
                Are you sure you want to delete{" "}
                <span className="font-bold text-slate-900">
                  "{deleteProjectTitle}"
                </span>
                ?
              </div>

              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={() => setIsDeleteOpen(false)}
                  disabled={deleting}
                  className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-white" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-3.5 w-3.5 text-white" />
                      Confirm Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
