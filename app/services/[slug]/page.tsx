import ProjectDetailView from "./components/ProjectDetailView";
import { getServicesDetails } from "@/services/service.service";

type ProjectDetailProps = {
  params: Promise<{ slug: string }>;
};
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const post = await getServicesDetails(slug);

  return {
    title: post.title,
  };
}
export default async function ProjectDetail({ params }: ProjectDetailProps) {
  const { slug } = await params;

  try {
    const service = await getServicesDetails(slug);

    // Check if the response is valid JSON
    if (!service || Array.isArray(service)) {
      return <div>Service not found</div>;
    }

    return <ProjectDetailView service={service} />;
  } catch (error) {
    console.error("Error fetching service details:", error);
    return <div>Error: Unable to fetch service details</div>;
  }
}
