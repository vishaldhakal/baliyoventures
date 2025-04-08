import BlogsPageView from "./components/BlogsPageView";
import { Metadata } from "next";
export default function BlogsPage() {
  return <BlogsPageView />;
}

export const metadata: Metadata = {
  title: "Baliyo Ventures - Insights about technology",
  description:
    "Want to know whats happening in the world of technology? Read our blogs to get the latest insights and news.",
  openGraph: {
    title: "Baliyo Ventures - Insights about technology",
    description:
      "Want to know whats happening in the world of technology? Read our blogs to get the latest insights and news.",
    images: "/images/about/about-hero-1.jpg",
  },
};
