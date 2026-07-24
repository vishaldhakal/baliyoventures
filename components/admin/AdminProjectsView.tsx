import { ProjectsListResponse } from "@/types/projects";
import Link from "next/link";
import Image from "next/image";
import { FolderGit2, ExternalLink, Box, Grid, AlertCircle } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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
  const totalPages = Math.ceil(projectsData.count / pageSize);

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

  return (
    <div className="space-y-8">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-[#FCE8C6] font-oxanium tracking-tight">
            Product Development
          </h1>
          <p className="text-gray-400 text-sm font-saira mt-1">
            Displaying and managing website projects filtered by category:
            Product Development.
          </p>
        </div>
      </div>

      {/* Projects Feed */}
      {projectsData.results.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-[#030a1c] border border-white/10 rounded-2xl text-center px-4">
          <AlertCircle className="h-10 w-10 text-yellow-300/40 mb-3" />
          <h3 className="text-lg font-bold text-white font-oxanium">
            No Projects Found
          </h3>
          <p className="text-gray-400 text-sm font-saira mt-1 max-w-sm">
            There are no projects associated with the product-development
            category at the moment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projectsData.results.map((project) => (
            <div
              key={project.id}
              className="bg-[#030a1c] border border-white/10 rounded-2xl overflow-hidden flex flex-col justify-between group hover:border-yellow-300/20 transition-all hover:shadow-[0_4px_25px_rgba(252,232,198,0.02)]"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-[16/10] bg-gray-950 w-full overflow-hidden border-b border-white/5">
                {project.thumbnail_image ? (
                  <Image
                    src={project.thumbnail_image}
                    alt={
                      project.thumbnail_image_alt_description || project.title
                    }
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs font-saira">
                    No Image Uploaded
                  </div>
                )}
              </div>

              {/* Info Container */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white group-hover:text-yellow-300 transition-colors font-oxanium line-clamp-1">
                    {project.title}
                  </h3>
                  <div className="text-xs text-gray-500 font-mono select-all truncate">
                    Slug: {project.slug}
                  </div>
                  <p className="text-gray-400 text-xs font-saira line-clamp-2 leading-relaxed">
                    {project.meta_description ||
                      "No project description available."}
                  </p>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] bg-yellow-300/5 text-yellow-300 px-2 py-0.5 rounded border border-yellow-300/10 font-saira">
                    Product Dev
                  </span>

                  <Link
                    href={`/project/${project.slug}`}
                    target="_blank"
                    className="flex items-center gap-1.5 text-xs text-yellow-300 hover:text-white transition-colors font-saira font-semibold"
                  >
                    View on site
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-8 pt-4 border-t border-white/5 flex justify-center">
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
    </div>
  );
}
