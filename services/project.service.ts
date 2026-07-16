import { ProjectDetailResponse, ProjectsListResponse } from "@/types/projects";

export const getProjectDetails = async (
  slug: string,
): Promise<ProjectDetailResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/projects/${slug}/`,
    {
      next: { revalidate: 3600 }, // Cache/revalidate every hour
    },
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch project details for: ${slug}`);
  }
  return response.json();
};

export const getProjects = async (
  page = 1,
  pageSize = 12,
): Promise<ProjectsListResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/projects/?page=${page}&page_size=${pageSize}`,
    {
      next: { revalidate: 3600 },
    },
  );
  if (!response.ok) {
    throw new Error("Failed to fetch projects");
  }
  return response.json();
};
