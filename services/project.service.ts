import { ProjectDetailResponse, ProjectsListResponse } from "@/types/projects";

const getApiBase = () =>
  process.env.NEXT_PUBLIC_API_URL || "https://yachu.baliyoventures.com/api/baliyo";

export const getProjectDetails = async (
  slug: string,
): Promise<ProjectDetailResponse> => {
  const apiBase = getApiBase();
  const response = await fetch(
    `${apiBase}/projects/${slug}/`,
    {
      cache: "no-store",
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
  category = "product-development",
): Promise<ProjectsListResponse> => {
  const apiBase = getApiBase();
  const url = new URL(`${apiBase}/projects/`);
  url.searchParams.set("page", page.toString());
  url.searchParams.set("page_size", pageSize.toString());
  if (category) {
    url.searchParams.set("category", category);
  }

  const response = await fetch(url.toString(), {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch projects");
  }
  return response.json();
};
