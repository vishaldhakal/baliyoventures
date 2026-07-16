import Link from "next/link";
import Image from "next/image";
import { getProjects } from "@/services/project.service";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface ProjectsPageProps {
  searchParams: {
    page?: string;
  };
}

const ProjectsPage = async ({ searchParams }: ProjectsPageProps) => {
  const currentPage = parseInt(searchParams.page || "1", 10);
  const pageSize = 10;

  const projectsData = await getProjects(currentPage, pageSize);
  const totalPages = Math.ceil(projectsData.count / pageSize);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l;

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
      if (l) {
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
    <div className="bg-[#00040C] min-h-screen py-16 md:py-24">
      <div className="container mx-auto px-4 lg:px-12">
        {/* Header Section */}
        <div className="max-w-2xl mb-12 md:mb-16">
          <p className="text-[#FCE8C6] uppercase tracking-[0.2em] font-saira font-medium text-sm mb-4">
            OUR PORTFOLIO
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold font-oxanium mb-6 bg-gradient-to-br from-yellow-300 to-[#FFFCCB] bg-clip-text text-transparent">
            All Projects
          </h2>
          <p className="text-[#F3EEE0] font-saira text-base md:text-lg leading-relaxed">
            Explore our complete portfolio of innovations and projects delivered
            by Baliyo Ventures.
          </p>
          <p className="text-[#F3EEE0]/60 font-saira text-sm mt-2">
            Showing {projectsData.results.length} of {projectsData.count}{" "}
            projects
          </p>
        </div>

        {/* Projects Grid */}
        {projectsData.results.length === 0 ? (
          <div className="text-center text-white/60 py-12">
            No projects found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {projectsData.results.map((project) => (
              <div key={project.id} className="group">
                <Link href={`/project/${project.slug}`} className="block">
                  <div className="relative aspect-[4/3] mb-4 rounded-xl overflow-hidden bg-gray-800">
                    {project.thumbnail_image ? (
                      <Image
                        src={project.thumbnail_image}
                        alt={
                          project.thumbnail_image_alt_description ||
                          project.title
                        }
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                        No Image
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-yellow-300 text-sm font-saira tracking-wider">
                        Project
                      </span>
                    </div>
                    <h3 className="text-white font-oxanium text-xl font-semibold group-hover:text-yellow-300 transition-colors duration-300">
                      {project.title}
                    </h3>
                    <p className="text-[#F3EEE0]/80 text-sm font-saira line-clamp-2">
                      {project.meta_description ||
                        "Innovative project delivered by Baliyo Ventures"}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <Pagination>
              <PaginationContent className="gap-2">
                <PaginationItem>
                  <PaginationPrevious
                    href={`/projects?page=${currentPage - 1}`}
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "text-white hover:text-yellow-300 border-yellow-300/20 hover:border-yellow-300/40"
                    }
                  />
                </PaginationItem>

                {getPageNumbers().map((pageNumber, index) => (
                  <PaginationItem key={index}>
                    {pageNumber === "..." ? (
                      <PaginationEllipsis className="text-white/60" />
                    ) : (
                      <PaginationLink
                        href={`/projects?page=${pageNumber}`}
                        isActive={pageNumber === currentPage}
                        className={
                          pageNumber === currentPage
                            ? "bg-yellow-300/20 text-yellow-300 border-yellow-300/40 hover:bg-yellow-300/30"
                            : "text-white hover:text-yellow-300 border-yellow-300/20 hover:border-yellow-300/40"
                        }
                      >
                        {pageNumber}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    href={`/projects?page=${currentPage + 1}`}
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : "text-white hover:text-yellow-300 border-yellow-300/20 hover:border-yellow-300/40"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;
