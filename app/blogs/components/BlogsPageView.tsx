import { getBlogs } from "@/services/blog.service";
import BlogCard from "./BlogCard";
import BlogsSideBar from "./BlogsSideBar";
import { BlogResponse } from "@/types/blogs";

export default async function BlogsPageView() {
  const blogs: BlogResponse[] = await getBlogs();

  return (
    <main className="bg-[#00040C] px-4 py-8 md:py-16">
      <div className="container mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-[#CDCDCD] leading-[1.19] tracking-[-0.03em] mb-8 md:mb-12">
          Our Latest Blog Posts
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_405px] gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
            {blogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6 lg:sticky lg:top-24 lg:h-fit">
            <BlogsSideBar blogs={blogs} />
          </div>
        </div>
      </div>
    </main>
  );
}
