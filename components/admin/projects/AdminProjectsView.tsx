"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence } from "framer-motion";
import {
  FolderGit2,
  ExternalLink,
  Box,
  Grid,
  AlertCircle,
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  Loader2,
  Check,
  AlertTriangle,
} from "lucide-react";
import { ProjectsListResponse } from "@/types/projects";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// Subcomponents
import ProjectDetailSheet from "./ProjectDetailSheet";
import ProjectFormModal from "./ProjectFormModal";

interface AdminProjectsViewProps {
  projectsData: ProjectsListResponse;
  currentPage: number;
  pageSize: number;
}

export default function AdminProjectsView({
  projectsData,
  currentPage,
  pageSize,
}: AdminProjectsViewProps) {
  const router = useRouter();

  // Client-side search state
  const [searchTerm, setSearchTerm] = useState("");

  // Modals & Panels states
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedProjectSlug, setSelectedProjectSlug] = useState<string | null>(
    null,
  );

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formProjectSlug, setFormProjectSlug] = useState<string | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteProjectSlug, setDeleteProjectSlug] = useState<string | null>(
    null,
  );
  const [deleteProjectTitle, setDeleteProjectTitle] = useState("");
  const [deleting, setDeleting] = useState(false);

  const totalPages = Math.ceil(projectsData.count / pageSize);

  // Filter projects by search term client-side
  const filteredProjects = projectsData.results.filter(
    (project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.slug &&
        project.slug.toLowerCase().includes(searchTerm.toLowerCase())),
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

  // Open detailing
  const handleOpenDetails = (slug: string) => {
    setSelectedProjectSlug(slug);
    setIsDetailOpen(true);
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
      const res = await fetch(
        `https://yachu.baliyoventures.com/api/baliyo/projects/${deleteProjectSlug}/`,
        {
          method: "DELETE",
        },
      );
      if (!res.ok) {
        throw new Error("Failed to delete project.");
      }
      setIsDeleteOpen(false);
      setDeleteProjectSlug(null);
      // Trigger Next.js route refresh
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Could not delete project. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold text-[#FCE8C6] font-oxanium tracking-tight">
            Product Development
          </h1>
        </div>
        <button
          onClick={() => handleOpenForm(null)}
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-yellow-300 to-[#FFFCCB] text-[#00040C] font-semibold text-sm hover:opacity-90 transition-all font-oxanium cursor-pointer shadow-lg shadow-yellow-500/10 shrink-0"
        >
          <Plus className="h-4.5 w-4.5 text-[#00040C]" />
          Create Project
        </button>
      </div>

      {/* KPI Info Cards */}

      {/* Search Filter bar */}
      <div className="bg-[#030a1c] border border-white/10 rounded-2xl p-4 flex items-center gap-3">
        <Search className="h-5 w-5 text-gray-500 shrink-0" />
        <input
          type="text"
          placeholder="Filter projects by title or slug on this page..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 border-none outline-none font-saira"
        />
      </div>

      {/* Projects Table Layout */}
      <div className="bg-[#030a1c]/80 border border-white/10 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          {filteredProjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4 space-y-2">
              <AlertCircle className="h-10 w-10 text-yellow-300/30" />
              <h3 className="text-base font-bold text-white font-oxanium">
                No Entries Found
              </h3>
              <p className="text-gray-400 text-xs font-saira max-w-xs">
                We couldn't find any projects matching "{searchTerm}" on this
                page.
              </p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs font-saira">
              <thead>
                <tr className="bg-[#050e26] border-b border-white/10 text-gray-400 font-bold">
                  <th className="px-6 py-4 w-20">Thumbnail</th>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4 max-w-xs">Short Description</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-300">
                {filteredProjects.map((project) => (
                  <tr
                    key={project.id}
                    className="hover:bg-white/2 transition-colors cursor-pointer group"
                    onClick={() => handleOpenDetails(project.slug)}
                  >
                    {/* Thumbnail Image */}
                    <td
                      className="px-6 py-4 whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="relative h-10 w-16 bg-gray-950 rounded-lg overflow-hidden border border-white/10 shadow-md">
                        {project.thumbnail_image ? (
                          <Image
                            src={project.thumbnail_image}
                            alt={
                              project.thumbnail_image_alt_description ||
                              project.title
                            }
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[8px] text-gray-600">
                            No Image
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Project Title */}
                    <td className="px-6 py-4 font-bold text-white font-oxanium text-sm truncate max-w-[200px]">
                      {project.title}
                    </td>

                    {/* Project Meta Description */}
                    <td className="px-6 py-4 max-w-xs truncate text-gray-400">
                      {project.meta_description ||
                        "No project description available."}
                    </td>

                    {/* Category Label */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-block text-[9px] bg-yellow-300/10 text-yellow-300 px-2 py-0.5 rounded border border-yellow-300/10">
                        Product Dev
                      </span>
                    </td>

                    {/* Actions Trigger Buttons */}
                    <td
                      className="px-6 py-4 whitespace-nowrap text-center"
                      onClick={(e) => e.stopPropagation()} // Stop triggering table row click details sheet
                    >
                      <div className="flex justify-center items-center gap-2">
                        {/* Open detail panel */}
                        <button
                          onClick={() => handleOpenDetails(project.slug)}
                          title="View detail space"
                          className="p-2 rounded-xl bg-white/5 hover:bg-yellow-300/10 text-gray-400 hover:text-yellow-300 border border-white/5 hover:border-yellow-300/25 transition-all cursor-pointer"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        {/* Open editor */}
                        <button
                          onClick={() => handleOpenForm(project.slug)}
                          title="Edit project details"
                          className="p-2 rounded-xl bg-white/5 hover:bg-yellow-300/10 text-gray-400 hover:text-yellow-300 border border-white/5 hover:border-yellow-300/25 transition-all cursor-pointer"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>

                        {/* Open deletion */}
                        <button
                          onClick={() =>
                            handleOpenDelete(project.slug, project.title)
                          }
                          title="Delete entry"
                          className="p-2 rounded-xl bg-white/5 hover:bg-red-500/10 text-gray-400 hover:text-red-400 border border-white/5 hover:border-red-500/25 transition-all cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
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

      {/* List Pagination */}
      {totalPages > 1 && (
        <div className="pt-2 flex justify-center">
          <Pagination>
            <PaginationContent className="gap-2">
              <PaginationItem>
                <PaginationPrevious
                  href={`/admin?page=${currentPage - 1}`}
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-40 text-gray-500 border-white/5"
                      : "text-white hover:text-yellow-300 border-white/10 hover:border-yellow-300/30 bg-[#030a1c]"
                  }
                />
              </PaginationItem>

              {getPageNumbers().map((pageNumber, index) => (
                <PaginationItem key={index}>
                  {pageNumber === "..." ? (
                    <PaginationEllipsis className="text-gray-500" />
                  ) : (
                    <PaginationLink
                      href={`/admin?page=${pageNumber}`}
                      isActive={pageNumber === currentPage}
                      className={
                        pageNumber === currentPage
                          ? "bg-yellow-300/15 text-yellow-300 border-yellow-300/30 hover:bg-yellow-300/25"
                          : "text-white hover:text-yellow-300 border-white/10 hover:border-yellow-300/30 bg-[#030a1c]"
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
                      ? "pointer-events-none opacity-40 text-gray-500 border-white/5"
                      : "text-white hover:text-yellow-300 border-white/10 hover:border-yellow-300/30 bg-[#030a1c]"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* RENDER MODALS AND SHEETS */}

      {/* Slide-over details sheet */}
      <ProjectDetailSheet
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedProjectSlug(null);
        }}
        projectSlug={selectedProjectSlug}
      />

      {/* Creation & Edit dialog */}
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

      {/* Delete Confirmation Alert Modal */}
      <AnimatePresence>
        {isDeleteOpen && (
          <>
            {/* Backdrop */}
            <div
              onClick={() => setIsDeleteOpen(false)}
              className="fixed inset-0 bg-black/85 backdrop-blur-xs z-50 cursor-pointer"
            />
            {/* Alert Dialog box */}
            <div className="fixed inset-0 m-auto w-full max-w-md h-fit bg-[#030a1c] border border-red-500/20 z-50 rounded-3xl p-6 shadow-2xl space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-500/10 text-red-400 rounded-2xl border border-red-500/20">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-oxanium">
                    Delete Entry?
                  </h3>
                  <p className="text-xs text-gray-400 font-saira">
                    This action is permanent and irreversible.
                  </p>
                </div>
              </div>

              <div className="bg-[#050e26] border border-white/5 p-4 rounded-xl text-sm font-saira text-gray-300 leading-relaxed">
                Are you sure you want to delete{" "}
                <span className="text-white font-bold font-oxanium">
                  "{deleteProjectTitle}"
                </span>
                ?
              </div>

              <div className="flex items-center justify-between gap-4">
                <button
                  onClick={() => setIsDeleteOpen(false)}
                  disabled={deleting}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-semibold border border-white/10 transition-all font-saira text-gray-300 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-semibold transition-all font-oxanium flex items-center justify-center gap-1.5 shadow-lg shadow-red-600/10 cursor-pointer"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-white" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 text-white" />
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
