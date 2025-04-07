import type React from "react";
import Image from "next/image";
import { CalendarIcon, TagIcon, FolderIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { BlogResponse } from "@/types/blogs"; // Adjust the import path as necessary
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BlogDetailsProps {
  post: BlogResponse;
}

const BlogDetails: React.FC<BlogDetailsProps> = ({ post }) => {
  // Format the date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <section className="py-12 bg-black text-white min-h-screen sm:py-16 lg:py-20">
      <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
        <div className="max-w-5xl mx-auto">
          {/* Enhanced Breadcrumb */}
          <div className="mb-8 py-3 px-4  backdrop-blur-sm rounded-lg">
            <Breadcrumb>
              <BreadcrumbList className="flex-wrap">
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href="/"
                    className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                      <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-gray-600" />
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href="/blogs"
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    Blogs
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-gray-600" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-gray-200 font-medium truncate max-w-[200px] sm:max-w-xs">
                    {post.title}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Featured Image */}
          <div className="relative w-full h-[400px] rounded-2xl overflow-hidden mb-8">
            <Image
              src={post.thumbnail_image || "/placeholder.svg"}
              alt="blogimage "
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          </div>

          {/* Category and Date */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center">
              <FolderIcon className="w-4 h-4 mr-2 text-gray-400" />
              <Badge
                variant="outline"
                className="text-gray-300 border-gray-700"
              >
                {post.category.title}
              </Badge>
            </div>
            <div className="flex items-center">
              <CalendarIcon className="w-4 h-4 mr-2 text-gray-400" />
              <span className="text-sm text-gray-400">
                {formatDate(post.created_at)}
              </span>
            </div>
          </div>

          {/* Title */}
          <div className="max-w-2xl mb-6">
            <h1 className="text-4xl font-bold text-white sm:text-5xl leading-tight">
              {post.title}
            </h1>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2 mb-8">
            <TagIcon className="w-4 h-4 text-gray-400" />
            {post.tags.map((tag) => (
              <Badge
                key={tag.id}
                variant="secondary"
                className="bg-gray-800 hover:bg-gray-700 text-gray-200"
              >
                {tag.title}
              </Badge>
            ))}
          </div>

          {/* Description */}
          <div className="mt-6 mb-10 text-lg text-gray-300 leading-relaxed">
            <div dangerouslySetInnerHTML={{ __html: post.description }} />
          </div>

          {/* Article Content */}
          <div className="mt-12 sm:mt-16 lg:grid lg:grid-cols-12 lg:gap-x-16 xl:gap-x-24">
            <article
              className="prose prose-invert lg:prose-lg lg:col-span-12 max-w-none
              prose-headings:text-white 
              prose-p:text-gray-300 
              prose-a:text-blue-400 
              prose-strong:text-white
              prose-blockquote:border-l-4 
              prose-blockquote:border-gray-700 
              prose-blockquote:pl-4
              prose-blockquote:text-gray-300
              prose-blockquote:font-normal
              prose-blockquote:italic
              prose-li:text-gray-300"
            >
              {/* This is where the full article content would go */}
              <p className="text-gray-400 italic">
                Full article content would be displayed here...
              </p>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogDetails;
