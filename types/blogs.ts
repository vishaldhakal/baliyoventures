export interface Blog {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  date: string;
  category: string;
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
