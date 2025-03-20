import { BlogCardProps } from "@/types/blogs";
import Image from "next/image";

export default function BlogCard({ blog }: BlogCardProps) {
  return (
    <div className="flex flex-col gap-3 md:gap-4 group cursor-pointer">
      <div className="relative w-full h-[200px] md:h-[240px] rounded-lg overflow-hidden">
        <Image
          src={blog.imageUrl}
          alt={blog.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-col gap-2 md:gap-3">
        <h3 className="text-lg md:text-xl font-bold text-[#CDCDCD] leading-[1.8] tracking-[-0.03em] group-hover:text-[#F0D100] transition-colors duration-300">
          {blog.title}
        </h3>
        <p className="text-sm md:text-base text-[#64607D] leading-[1.875] tracking-[-0.02em]">
          {blog.description}
        </p>
      </div>
    </div>
  );
}
