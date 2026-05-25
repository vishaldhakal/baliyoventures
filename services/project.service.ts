import { ProjectDetailResponse } from "@/types/projects";

export const getProjectDetails = async (slug: string): Promise<ProjectDetailResponse> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${slug}/`, {
    next: { revalidate: 3600 } // Cache/revalidate every hour
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch project details for: ${slug}`);
  }
  return response.json();
};
