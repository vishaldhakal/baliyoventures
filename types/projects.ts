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

export interface ProjectDetailResponse {
  id: number;
  images: { id: number; image: string }[] | string[] | any[]; // Backend might return full objects or string URLs, let's keep it flexible
  category: ProjectCategory[];
  title: string;
  slug: string;
  description: string;
  meta_title: string;
  meta_description: string;
  thumbnail_image: string | null;
  thumbnail_image_alt_description: string | null;
  catalogue: string | null;
  quotation: string | null;
  created_at: string;
  updated_at: string;
  similar_projects: SimilarProject[];
}
