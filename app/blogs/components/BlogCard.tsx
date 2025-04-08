import { BlogCardProps } from "@/types/blogs";
import Image from "next/image";
import Link from "next/link";

export default function BlogCard({ blog }: BlogCardProps) {
  return (
    <Link href={`/blogs/${blog.slug}`}>
      <div className="flex flex-col gap-3 md:gap-4 group cursor-pointer">
        <div className="relative w-full h-[200px] md:h-[240px] rounded-lg overflow-hidden">
          <Image
            src={blog.thumbnail_image || ""}
            alt={blog.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="flex flex-col gap-2 md:gap-3">
          <h3 className="text-lg md:text-xl font-bold text-[#CDCDCD] leading-[1.8] tracking-[-0.03em] group-hover:text-yellow-300 transition-colors duration-300">
            {blog.title}
          </h3>
        </div>
      </div>
    </Link>
  );
}
