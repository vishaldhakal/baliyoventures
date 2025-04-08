import { Metadata } from "next";
import AboutPageView from "./components/AboutPageView";

export default function AboutPage() {
  return <AboutPageView />;
}

export const metadata: Metadata = {
  title: "About Baliyo Ventures - How we build technology",
  description:
    "Baliyo Ventures is a product design and development company that helps businesses build their tech.",
  openGraph: {
    title: "About Baliyo Ventures - How we build technology",
    description:
      "Baliyo Ventures is a product design and development company that helps businesses build their tech.",
    images: "/images/about/about-hero-1.jpg",
  },
};
