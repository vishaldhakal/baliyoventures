import BlogDetails from "./components/blogDetails";
import { getBlogsDetails } from "@/services/blog.service";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const post = await getBlogsDetails(slug);

  return {
    title: post.title,
  };
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const post = await getBlogsDetails(slug);

  return (
    <div>
      <BlogDetails post={post} />
    </div>
  );
}
