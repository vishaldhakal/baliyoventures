export interface ProjectCategory {
  id: number;
  title: string;
  slug: string;
  icon: string;
  thumbnail_image: string;
  thumbnail_image_alt_description: string | null;
  short_description: string;
}

export interface SimilarProject {
  id: number;
  title: string;
  slug: string;
  thumbnail_image: string | null;
  thumbnail_image_alt_description: string | null;
  meta_description: string;
  meta_title: string;
}

export interface ProjectImage {
  id: number;
  image: string;
  project: number;
}

export interface ProjectDemo {
  id: number;
  video_url: string | null;
  video_file: string | null;
  created_at: string;
  updated_at: string;
  project: number;
}

export interface ProjectRenderingImage {
  id: number;
  image: string;
  created_at: string;
  updated_at: string;
  project: number;
}

export interface Project {
  id: number;
  title: string;
  slug: string;
  thumbnail_image: string | null;
  thumbnail_image_alt_description: string | null;
  meta_description: string;
  meta_title: string;
}

export interface ProjectDetailResponse {
  id: number;
  images: ProjectImage[];
  category: ProjectCategory[];
  demos: ProjectDemo[];
  rendering_images: ProjectRenderingImage[];
  title: string;
  slug: string;
  description: string;
  specs: string | null;
  problem_it_solves: string | null;
  case_study: string | null;
  team_member: string | null;
  meta_title: string | null;
  meta_description: string | null;
  thumbnail_image: string | null;
  thumbnail_image_alt_description: string | null;
  catalogue: string | null;
  quotation: string | null;
  created_at: string;
  updated_at: string;
  similar_projects: SimilarProject[];
}

export interface ProjectsListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: SimilarProject[];
}
