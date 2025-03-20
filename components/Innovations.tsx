import Link from "next/link";
import Image from "next/image";

const Innovations = () => {
  const projects = [
    {
      id: 1,
      image: "/images/innovations/project-3.jpg",
      title: "Brand Identity",
      description: "Visual branding and identity systems for modern companies",
      link: "/projects/brand-identity",
    },
    {
      id: 2,
      image: "/images/innovations/project-1.jpg",
      title: "Smart Hardware System",
      description: "Advanced hardware solutions for industrial automation",
      link: "/projects/smart-hardware",
    },
    {
      id: 3,
      image: "/images/innovations/project-1.jpg",
      title: "Smart Hardware System",
      description: "Advanced hardware solutions for industrial automation",
      link: "/projects/smart-hardware",
    },
    {
      id: 4,
      image: "/images/innovations/project-2.jpg",
      title: "Software Platform",
      description: "Scalable software infrastructure for enterprise needs",
      link: "/projects/software-platform",
    },
    {
      id: 5,
      image: "/images/innovations/project-5.jpg",
      title: "Product Development",
      description: "End-to-end product development and manufacturing",
      link: "/projects/product-development",
    },
    {
      id: 4,
      image: "/images/innovations/project-4.jpg",
      title: "Engineering Solutions",
      description: "Comprehensive engineering services for complex challenges",
      link: "/projects/engineering-solutions",
    },
  ];

  return (
    <section className="bg-[#00040C] py-8 sm:py-12 md:py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-12">
        {/* Responsive grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {/* Text Column - Full width on mobile */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1 mb-8 md:mb-0">
            <p className="text-[#FCE8C6] uppercase tracking-[0.2em] font-saira font-medium text-sm mb-3 md:mb-5">
              OUR WORK
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold font-oxanium mb-4 md:mb-6 bg-gradient-to-br from-[#F0D100] to-[#FFFCCB] bg-clip-text text-transparent">
              Innovations we Delivered
            </h2>
            <p className="text-[#F3EEE0] font-saira text-sm md:text-base leading-relaxed mb-6 md:mb-8">
              First hand insight into how our processes have been implemented in
              all the projects we&apos;ve worked on.
            </p>
          </div>

          {/* Projects Grid - Responsive layout */}
          {projects.map((project, index) => (
            <div
              key={project.id}
              className={`relative min-h-[250px] md:min-h-[300px] ${
                index === 1 || index === 5 || index === 3 ? "md:row-span-2" : ""
              }`}
            >
              <Link
                href={project.link}
                className="block transform transition-all duration-300 hover:scale-[1.02] h-full"
              >
                <div className="bg-[#DAD4C2] rounded-[20px] overflow-hidden relative h-full min-h-[250px] md:min-h-[300px]">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                    <h3 className="text-white font-oxanium font-semibold text-lg mb-1">
                      {project.title}
                    </h3>
                    <p className="text-[#F3EEE0] text-sm hidden md:block">
                      {project.description}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          ))}

          {/* View All Works button - Full width on mobile */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-center mt-6 md:mt-8">
            <Link
              href="/projects"
              className="flex items-center gap-3 md:gap-4 text-[#F0D100] font-saira text-base md:text-lg hover:opacity-75 transition-opacity duration-200"
            >
              <span>View All Works</span>
              <Image
                src="/images/innovations/icon-right-gold.svg"
                alt="Right arrow"
                width={12}
                height={12}
                className="mt-1"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Innovations;
