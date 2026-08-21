import { BlogResponse } from "../types/blogs";
 
export const getBlogs = async (): Promise<BlogResponse[]> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs`);
    if (!response.ok) return [];
    const data = await response.json();
    return data.results ?? data;
  } catch (err) {
    console.error("Failed to fetch blogs:", err);
    return [];
  }
};


export const getBlogsDetails = async (slug: string): Promise<BlogResponse> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs/${slug}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch blog details for: ${slug}`);
  }
  return response.json();
};