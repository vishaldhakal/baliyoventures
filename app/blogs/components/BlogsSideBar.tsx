import { BlogsSideBarProps } from "@/types/blogs";
import BlogsSidebarList from "./BlogsSidebarList";

export default function BlogsSideBar({ blogs }: BlogsSideBarProps) {
  return (
    <aside className="w-full">
      <BlogsSidebarList blogs={blogs} />
    </aside>
  );
}
