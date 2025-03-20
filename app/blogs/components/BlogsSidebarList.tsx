import { BlogsSidebarListProps } from "@/types/blogs";
import Image from "next/image";

export default function BlogsSidebarList({ blogs }: BlogsSidebarListProps) {
  return (
    <div className="flex flex-col gap-4 p-4 bg-[#010714] rounded-lg">
      {blogs.map((blog) => (
        <div key={blog.id} className="group cursor-pointer">
          <div className="flex gap-4">
            <div className="relative w-[120px] h-[90px] rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={blog.imageUrl}
                alt={blog.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col gap-2 flex-1 min-w-0">
              <h4 className="text-base font-bold text-[#CDCDCD] leading-[1.67] tracking-[-0.03em] group-hover:text-[#F0D100] line-clamp-2">
                {blog.title}
              </h4>
              <div className="flex gap-4 text-sm">
                <span className="text-[#64607D] font-bold">{blog.date}</span>
                <span className="text-[#64607D] font-bold">
                  {blog.category}
                </span>
              </div>
            </div>
          </div>
          <div className="h-px bg-[#DEE1E6] mt-4" />
        </div>
      ))}
    </div>
  );
}
