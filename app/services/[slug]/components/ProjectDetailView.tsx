import ResearchOverview from "../../components/ResearchOverview";
import { Service } from "../page";
import ProjectCard from "./ProjectCard";

type ProjectDetailViewProps = {
  service: Service;
};

export default function ProjectDetailView({ service }: ProjectDetailViewProps) {
  return (
    <main className="bg-[#00040C] pt-8 md:pt-16">
      <div className="container mx-auto px-4 mb-8 md:mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-[#CDCDCD] leading-[1.19] tracking-[-0.03em] mb-8 md:mb-12">
          {service.title}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {service.projects.map((project, index) => (
            <ProjectCard
              key={project.slug}
              title={project.title}
              description={project.description}
              image={project.image}
              slug={project.slug}
              index={index}
            />
          ))}
        </div>
      </div>
      <ResearchOverview
        title={`Got any ${service.title} related projects in mind?`}
        description={`We are always looking for new research to add to our website. If you have any ${service.title} related research, please contact us.`}
        cta="Contact Us"
      />
    </main>
  );
}
