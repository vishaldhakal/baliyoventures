import BlogsPageView from "./components/BlogsPageView";
import { Metadata } from "next";
export default function BlogsPage() {
  return <BlogsPageView />;
}

export const metadata: Metadata = {
  title: "Baliyo Ventures - Blogs",
  description: "Baliyo Ventures - Blogs",
  openGraph: {
    title: "Baliyo Ventures - Blogs",
    description: "Baliyo Ventures - Blogs",
    images: "/images/about/about-hero-1.jpg",
  },
};
