import ProjectDetailView from "./components/ProjectDetailView";
import { getServicesDetails } from "@/services/service.service";
import { ServiceDetailResponse } from "@/types/services";

type ProjectDetailProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const service: ServiceDetailResponse = await getServicesDetails(slug);

  return {
    title: service.title,
  };
}

export default async function ProjectDetail({ params }: ProjectDetailProps) {
  const { slug } = await params;

  try {
    const service = await getServicesDetails(slug);

    if (!service) {
      return <div>Service not found</div>;
    }

    return <ProjectDetailView service={service} />;
  } catch (error) {
    console.error("Error fetching service details:", error);
    return <div>Error: Unable to fetch service details</div>;
  }
}
