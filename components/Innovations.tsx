import Link from "next/link";
import Image from "next/image";

const Innovations = () => {
  const projects = [
    {
      id: 3,
      image: "/images/innovations/project-1.jpg",
      title: "Smart Hardware System",
      description: "Advanced hardware solutions for industrial automation",
      link: "/projects/smart-hardware",
      category: "Innovation",
    },
    {
      id: 5,
      image: "/images/innovations/project-5.jpg",
      title: "Product Development",
      description: "End-to-end product development and manufacturing",
      link: "/projects/product-development",
      category: "Development",
    },
    {
      id: 6,
      image: "/images/innovations/project-4.jpg",
      title: "Engineering Solutions",
      description: "Comprehensive engineering services for complex challenges",
      link: "/projects/engineering-solutions",
      category: "Engineering",
    },
  ];

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {projects.map((project) => (
            <div key={project.id} className="group">
              <Link href={project.link} className="block">
                <div className="relative aspect-[4/3] mb-4 rounded-xl overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-yellow-300 text-sm font-saira tracking-wider">
                      {project.category}
                    </span>
                    <span className="text-white/60 text-sm font-saira">
                      View Project →
                    </span>
                  </div>
                  <h3 className="text-white font-oxanium text-xl font-semibold group-hover:text-yellow-300 transition-colors duration-300">
                    {project.title}
                  </h3>
                  <p className="text-[#F3EEE0]/80 text-sm font-saira line-clamp-2">
                    {project.description}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* View All Works button */}
        <div className="flex justify-center mt-12 md:mt-16">
          <Link
            href="/projects"
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
