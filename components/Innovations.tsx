import Link from "next/link";
import Image from "next/image";
import { getProjects } from "@/services/project.service";

// This is a Server Component by default
const Innovations = async () => {
  // Fetch first 6 projects for the homepage
  const projectsData = await getProjects(1, 10);
  const projects = projectsData.results.slice(0, 6);

  return (
    <section className="bg-[#00040C] py-16 md:py-24">
      <div className="container mx-auto px-4 lg:px-12">
        {/* Header Section */}
        <div className="max-w-2xl mb-12 md:mb-16">
          <p className="text-[#FCE8C6] uppercase tracking-[0.2em] font-saira font-medium text-sm mb-4">
            OUR WORK
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold font-oxanium mb-6 bg-gradient-to-br from-yellow-300 to-[#FFFCCB] bg-clip-text text-transparent">
            Innovations We Delivered
          </h2>
          <p className="text-[#F3EEE0] font-saira text-base md:text-lg leading-relaxed">
            First hand insight into how our processes have been implemented in
            all the projects we&apos;ve worked on.
          </p>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="text-center text-white/60 py-12">
            No projects found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {projects.map((project) => (
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
                        Innovation
                      </span>
                      <span className="text-white/60 text-sm font-saira">
                        View Project →
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

        {/* View All Works button */}
        <div className="flex justify-center mt-12 md:mt-16">
          <Link
            href="/project"
            className="inline-flex items-center gap-3 px-8 py-4 bg-yellow-300/10 border border-yellow-300/20 rounded-full text-yellow-300 font-saira text-base hover:bg-yellow-300/20 transition-all duration-300"
          >
            <span>View All Works</span>
            <Image
              src="/images/innovations/icon-right-gold.svg"
              alt="Right arrow"
              width={16}
              height={16}
              className="mt-1"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Innovations;
