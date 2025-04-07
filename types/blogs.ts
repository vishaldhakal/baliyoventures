export interface Blog {
  id: string;
  title: string;
  slug: string;
  thumbnail_image: string | null;
  thumbnail_image_alt_description: string | null;
}

export interface BlogCardProps {
  blog: Blog;
}

export interface BlogsSideBarProps {
  blogs: Blog[];
}

export interface BlogsSidebarListProps {
  blogs: Blog[];
}

export interface BlogsPageViewProps {
  blogs: Blog[];
}

export interface BlogResponse {
  id: string;
  title: string;
  description:string;
  slug: string;
  thumbnail_image: string | null;
  thumbnail_image_alt_description: string | null;
  created_at: string
  category: {
    id: string
    title: string
  }
  tags: {
    id: string
    title: string
  }[]
  // Add any additional properties you want to include in the response
}

