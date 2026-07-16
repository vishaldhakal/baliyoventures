import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  Calendar,
  Tag,
  FileText,
  Download,
  ChevronRight,
  ExternalLink,
  Users,
  Play,
  Video,
  Image as ImageIcon,
  Lightbulb,
  FileCheck,
  ClipboardList,
} from "lucide-react";
import { getProjectDetails } from "@/services/project.service";
import ResearchOverview from "@/app/services/components/ResearchOverview";
import { SimilarProject } from "@/types/projects";
import ShareButtons from "./components/ShareButtons";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

// Base URL helper to resolve relative media paths from backend APIs
const resolveImageUrl = (url: string | null): string => {
  if (!url) return "/default-image.jpg";
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  return `http://yachu.baliyoventures.com${url}`;
};

// Extract YouTube video ID from URL
const getYouTubeEmbedUrl = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
  }
  return null;
};

export async function generateMetadata({ params }: ProjectPageProps) {
  const { slug } = await params;
  try {
    const project = await getProjectDetails(slug);
    return {
      title: project.meta_title || `${project.title} - Baliyo Ventures`,
      description:
        project.meta_description ||
        `Learn about ${project.title} developed by Baliyo Ventures.`,
      openGraph: {
        title: project.meta_title || `${project.title} - Baliyo Ventures`,
        description:
          project.meta_description ||
          `Learn about ${project.title} developed by Baliyo Ventures.`,
        images: project.thumbnail_image
          ? [resolveImageUrl(project.thumbnail_image)]
          : [],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Project Details - Baliyo Ventures",
      description:
        "Discover innovative engineering and software solutions by Baliyo Ventures.",
    };
  }
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;

  try {
    const project = await getProjectDetails(slug);

    if (!project) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-[#00040C] text-white">
          <p className="font-oxanium text-xl">Project not found</p>
        </div>
      );
    }

    // Safely extract gallery images
    const galleryImages = (project.images || [])
      .map((img: any) => {
        if (typeof img === "string") return img;
        if (img && typeof img === "object" && img.image) return img.image;
        return null;
      })
      .filter(Boolean) as string[];

    // Format date string beautifully
    const formattedDate = project.created_at
      ? new Date(project.created_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "April 2025";

    // Check if there are any demos
    const hasDemos = project.demos && project.demos.length > 0;

    // Check if there are any rendering images
    const hasRenderingImages =
      project.rendering_images && project.rendering_images.length > 0;

    // Check if there are any additional sections
    const hasSpecs = project.specs && project.specs.trim().length > 0;
    const hasProblem =
      project.problem_it_solves && project.problem_it_solves.trim().length > 0;
    const hasCaseStudy =
      project.case_study && project.case_study.trim().length > 0;
    const hasTeam =
      project.team_member && project.team_member.trim().length > 0;

    return (
      <main className="min-h-screen bg-[#00040C] text-white pt-24 md:pt-32">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          {/* Back Navigation Button */}
          <div className="mb-8 md:mb-12">
            <Link
              href={
                project.category && project.category[0]
                  ? `/services/${project.category[0].slug}`
                  : "/projects"
              }
              className="inline-flex items-center gap-2 group text-sm font-semibold uppercase tracking-[0.05em] text-[#B5B5B5] hover:text-[#FFFCCB] transition-colors"
            >
              <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to{" "}
              {project.category && project.category[0]
                ? project.category[0].title
                : "Projects"}
            </Link>
          </div>

          {/* Hero Section */}
          <div className="flex flex-col gap-6 mb-12">
            <div className="flex flex-wrap items-center gap-3">
              {project.category?.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/services/${cat.slug}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] hover:bg-yellow-300/10 hover:border-yellow-300/20 text-xs font-medium text-[#FFFCCB] tracking-[0.03em] transition-all"
                >
                  <Tag className="h-3.5 w-3.5 text-yellow-300" />
                  {cat.title}
                </Link>
              ))}
            </div>

            <h1 className="font-oxanium text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.1] tracking-[-0.02em] text-[#CDCDCD]">
              {project.title}
            </h1>
          </div>

          {/* Grid Layout: Left Content, Right Information panel */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 mb-20">
            {/* Left Content Column */}
            <div className="lg:col-span-2 flex flex-col gap-10">
              {/* Main Cover Image */}
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg border border-white/[0.08] bg-white/[0.02] shadow-[0_0_50px_rgba(0,0,0,0.8)]">
                <Image
                  src={resolveImageUrl(project.thumbnail_image)}
                  alt={project.thumbnail_image_alt_description || project.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Project Description */}
              {project.description && (
                <div className="flex flex-col gap-6">
                  <h2 className="font-oxanium text-2xl font-semibold uppercase tracking-[0.02em] text-[#E4E4E4] border-b border-white/[0.08] pb-3">
                    Overview
                  </h2>
                  <div
                    className="font-inter text-base font-light leading-[2.0] tracking-[0.03em] text-[#B5B5B5] space-y-6 [&>p]:leading-[2.0] [&>p>strong]:text-[#E5E5E5] [&>p>strong]:font-semibold [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2"
                    dangerouslySetInnerHTML={{ __html: project.description }}
                  />
                </div>
              )}

              {/* Problem It Solves */}
              {hasProblem && (
                <div className="flex flex-col gap-6">
                  <h2 className="font-oxanium text-2xl font-semibold uppercase tracking-[0.02em] text-[#E4E4E4] border-b border-white/[0.08] pb-3 flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-300" />
                    Problem It Solves
                  </h2>
                  <div
                    className="font-inter text-base font-light leading-[2.0] tracking-[0.03em] text-[#B5B5B5] space-y-6 [&>p]:leading-[2.0] [&>p>strong]:text-[#E5E5E5] [&>p>strong]:font-semibold [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2"
                    dangerouslySetInnerHTML={{
                      __html: project.problem_it_solves,
                    }}
                  />
                </div>
              )}

              {/* Specifications */}
              {hasSpecs && (
                <div className="flex flex-col gap-6">
                  <h2 className="font-oxanium text-2xl font-semibold uppercase tracking-[0.02em] text-[#E4E4E4] border-b border-white/[0.08] pb-3 flex items-center gap-2">
                    <ClipboardList className="h-5 w-5 text-yellow-300" />
                    Specifications
                  </h2>
                  <div
                    className="font-inter text-base font-light leading-[2.0] tracking-[0.03em] text-[#B5B5B5] space-y-6 [&>p]:leading-[2.0] [&>p>strong]:text-[#E5E5E5] [&>p>strong]:font-semibold [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2"
                    dangerouslySetInnerHTML={{ __html: project.specs }}
                  />
                </div>
              )}

              {/* Case Study */}
              {hasCaseStudy && (
                <div className="flex flex-col gap-6">
                  <h2 className="font-oxanium text-2xl font-semibold uppercase tracking-[0.02em] text-[#E4E4E4] border-b border-white/[0.08] pb-3 flex items-center gap-2">
                    <FileCheck className="h-5 w-5 text-yellow-300" />
                    Case Study
                  </h2>
                  <div
                    className="font-inter text-base font-light leading-[2.0] tracking-[0.03em] text-[#B5B5B5] space-y-6 [&>p]:leading-[2.0] [&>p>strong]:text-[#E5E5E5] [&>p>strong]:font-semibold [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2"
                    dangerouslySetInnerHTML={{ __html: project.case_study }}
                  />
                </div>
              )}

              {/* Team Members */}
              {hasTeam && (
                <div className="flex flex-col gap-6">
                  <h2 className="font-oxanium text-2xl font-semibold uppercase tracking-[0.02em] text-[#E4E4E4] border-b border-white/[0.08] pb-3 flex items-center gap-2">
                    <Users className="h-5 w-5 text-yellow-300" />
                    Team Members
                  </h2>
                  <div
                    className="font-inter text-base font-light leading-[2.0] tracking-[0.03em] text-[#B5B5B5]"
                    dangerouslySetInnerHTML={{ __html: project.team_member }}
                  />
                </div>
              )}

              {/* Demos / Videos */}
              {hasDemos && (
                <div className="flex flex-col gap-6">
                  <h2 className="font-oxanium text-2xl font-semibold uppercase tracking-[0.02em] text-[#E4E4E4] border-b border-white/[0.08] pb-3 flex items-center gap-2">
                    <Video className="h-5 w-5 text-yellow-300" />
                    Demos & Videos
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {project.demos.map((demo, index) => {
                      // Check if it's a YouTube video
                      const youtubeEmbedUrl = demo.video_url
                        ? getYouTubeEmbedUrl(demo.video_url)
                        : null;
                      const videoFileUrl = demo.video_file
                        ? resolveImageUrl(demo.video_file)
                        : null;

                      return (
                        <div
                          key={demo.id || index}
                          className="relative aspect-video w-full overflow-hidden rounded-md border border-white/[0.08] bg-white/[0.01] group"
                        >
                          {youtubeEmbedUrl ? (
                            <iframe
                              src={youtubeEmbedUrl}
                              title={`${project.title} Demo ${index + 1}`}
                              className="w-full h-full"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          ) : videoFileUrl ? (
                            <video
                              src={videoFileUrl}
                              controls
                              className="w-full h-full object-cover"
                              poster={project.thumbnail_image || undefined}
                            >
                              Your browser does not support the video tag.
                            </video>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <Play className="h-12 w-12 opacity-20" />
                            </div>
                          )}
                          <div className="absolute bottom-2 right-2 bg-black/60 px-2 py-1 rounded text-xs text-white/80">
                            Demo {index + 1}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Gallery Images */}
              {galleryImages.length > 0 && (
                <div className="flex flex-col gap-6">
                  <h2 className="font-oxanium text-2xl font-semibold uppercase tracking-[0.02em] text-[#E4E4E4] border-b border-white/[0.08] pb-3 flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-yellow-300" />
                    Project Gallery
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {galleryImages.map((imgUrl, index) => (
                      <div
                        key={index}
                        className="group relative aspect-[4/3] w-full overflow-hidden rounded-md border border-white/[0.08] bg-white/[0.01]"
                      >
                        <Image
                          src={resolveImageUrl(imgUrl)}
                          alt={`${project.title} Gallery ${index + 1}`}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Rendering Images */}
              {hasRenderingImages && (
                <div className="flex flex-col gap-6">
                  <h2 className="font-oxanium text-2xl font-semibold uppercase tracking-[0.02em] text-[#E4E4E4] border-b border-white/[0.08] pb-3 flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-yellow-300" />
                    Rendering Images
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {project.rendering_images.map((render, index) => (
                      <div
                        key={render.id || index}
                        className="group relative aspect-[4/3] w-full overflow-hidden rounded-md border border-white/[0.08] bg-white/[0.01]"
                      >
                        <Image
                          src={resolveImageUrl(render.image)}
                          alt={`${project.title} Rendering ${index + 1}`}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Information & Action Panel */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 flex flex-col gap-6 p-6 md:p-8 rounded-lg border border-white/[0.07] bg-[#12151C]/80 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
                <h3 className="font-oxanium text-xl font-semibold uppercase tracking-[0.02em] text-[#FFFCCB] border-b border-white/[0.08] pb-4">
                  Project Details
                </h3>

                <div className="flex flex-col gap-5 my-2">
                  <div className="flex items-start gap-4">
                    <Calendar className="h-5 w-5 text-yellow-300/80 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-[#8F8F8F] uppercase tracking-[0.05em]">
                        Launch Date
                      </p>
                      <p className="text-sm font-medium text-[#E4E4E4] mt-0.5">
                        {formattedDate}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Tag className="h-5 w-5 text-yellow-300/80 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-[#8F8F8F] uppercase tracking-[0.05em]">
                        Category
                      </p>
                      <p className="text-sm font-medium text-[#E4E4E4] mt-0.5">
                        {project.category && project.category[0]
                          ? project.category[0].title
                          : "Software Development"}
                      </p>
                    </div>
                  </div>

                  {hasTeam && (
                    <div className="flex items-start gap-4">
                      <Users className="h-5 w-5 text-yellow-300/80 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-[#8F8F8F] uppercase tracking-[0.05em]">
                          Team
                        </p>
                        <p className="text-sm font-medium text-[#E4E4E4] mt-0.5 line-clamp-2">
                          {project.team_member
                            ?.replace(/<[^>]*>/g, "")
                            .split("\n")
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Catalogue / Quotation PDF download buttons */}
                {(project.catalogue || project.quotation) && (
                  <div className="flex flex-col gap-3 mt-4 pt-6 border-t border-white/[0.08]">
                    {project.catalogue && (
                      <a
                        href={resolveImageUrl(project.catalogue)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between gap-3 w-full px-5 py-3 rounded bg-yellow-300 text-[#00040C] font-semibold text-sm hover:bg-yellow-300/90 transition-colors uppercase tracking-[0.03em]"
                      >
                        <span className="flex items-center gap-2">
                          <FileText className="h-4 w-4 shrink-0" />
                          View Catalogue
                        </span>
                        <ExternalLink className="h-4 w-4 shrink-0" />
                      </a>
                    )}

                    {project.quotation && (
                      <a
                        href={resolveImageUrl(project.quotation)}
                        download
                        className="flex items-center justify-between gap-3 w-full px-5 py-3 rounded border border-white/[0.1] bg-[#1C1F26] text-[#E4E4E4] font-semibold text-sm hover:bg-white/[0.05] transition-colors uppercase tracking-[0.03em]"
                      >
                        <span className="flex items-center gap-2">
                          <Download className="h-4 w-4 shrink-0" />
                          Download Quotation
                        </span>
                        <Download className="h-4 w-4 shrink-0 opacity-40" />
                      </a>
                    )}
                  </div>
                )}

                {/* Demo Count Badge */}
                {hasDemos && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded bg-white/[0.04] border border-white/[0.06]">
                    <Video className="h-4 w-4 text-yellow-300/80" />
                    <span className="text-xs text-[#B5B5B5]">
                      {project.demos.length} Demo
                      {project.demos.length > 1 ? "s" : ""} Available
                    </span>
                  </div>
                )}

                {/* Share Project section */}
                <ShareButtons
                  title={project.title}
                  description={project.meta_description || project.description}
                />
              </div>
            </div>
          </div>

          {/* Similar Projects Section */}
          {project.similar_projects && project.similar_projects.length > 0 && (
            <div className="border-t border-white/[0.08] pt-16 pb-20">
              <h2 className="font-oxanium text-3xl font-semibold uppercase tracking-[0.02em] text-[#CDCDCD] mb-8 md:mb-12">
                Similar Projects
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {project.similar_projects.map((simProj: SimilarProject) => (
                  <Link
                    href={`/project/${simProj.slug}`}
                    key={simProj.slug}
                    className="group flex flex-col gap-6 rounded-[5px] border border-white/[0.07] bg-[#12151C] p-6 hover:border-yellow-300/20 transition-all hover:-translate-y-1 duration-300"
                  >
                    {/* Thumbnail */}
                    <div className="relative h-[200px] w-full overflow-hidden rounded-sm bg-white/[0.01]">
                      <Image
                        src={resolveImageUrl(simProj.thumbnail_image)}
                        alt={
                          simProj.thumbnail_image_alt_description ||
                          simProj.title
                        }
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex flex-col gap-2.5">
                      <h3 className="font-oxanium text-xl font-semibold uppercase tracking-[0.02em] text-[#E4E4E4] group-hover:text-yellow-300 transition-colors">
                        {simProj.title}
                      </h3>
                      <p className="font-inter text-sm font-light leading-[2.14] tracking-[0.03em] text-[#B5B5B5] line-clamp-3">
                        {simProj.meta_description}
                      </p>
                    </div>

                    {/* Action Indicator */}
                    <div className="mt-auto pt-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.05em] text-yellow-300/80 group-hover:text-yellow-300">
                      Learn More
                      <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* CTA section at the bottom */}
        <ResearchOverview
          title={`Got any ${project.title} related projects in mind?`}
          description={`We are always looking for new research and collaboration opportunities. If you have any ${project.title} related project in mind, please contact us.`}
          cta="Contact Us"
        />
      </main>
    );
  } catch (error) {
    console.error("Error loading project details page:", error);
    return (
      <main className="min-h-screen bg-[#00040C] text-white flex items-center justify-center">
        <div className="text-center flex flex-col gap-4 max-w-md p-6">
          <h1 className="font-oxanium text-2xl font-bold text-red-400">
            Unable to load project
          </h1>
          <p className="text-[#B5B5B5] font-inter text-sm">
            There was a problem fetching this project's details from our
            servers. Please try again later.
          </p>
          <Link
            href="/projects"
            className="inline-flex items-center justify-center gap-2 mt-4 px-6 py-2.5 rounded bg-yellow-300 text-[#00040C] font-semibold text-sm hover:bg-yellow-300/90 transition-colors uppercase tracking-[0.03em]"
          >
            Back to Projects
          </Link>
        </div>
      </main>
    );
  }
}
