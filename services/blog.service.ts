import { BlogResponse } from "../types/blogs";
 
 export const getBlogs = async (): Promise<BlogResponse[]> => {
   const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs`);
   const data = await response.json();
   return data.results.map((item: BlogResponse) => ({
    id: item.id,
     title: item.title,
     slug: item.slug,
    thumbnail_image: item.thumbnail_image,
     thumbnail_image_alt_description: item.thumbnail_image_alt_description,
  }));
 };


export const getBlogsDetails = async (slug: string): Promise<BlogResponse> => {
  const response = await fetch(`${process.env.PUBLIC_API_URL}/blogs/${slug}`);
  const data = await response.json();
  return data;
};