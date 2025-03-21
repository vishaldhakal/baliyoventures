import LandingContact from "@/components/LandingContact";
import Hero from "./components/Hero";
import ResearchOverview from "./components/ResearchOverview";
import Services from "./components/Services";
import { Metadata } from "next";

export default function ResearchAndDevelopment() {
  return (
    <main>
      <Hero />
      <Services />
      <ResearchOverview
        title="Innovating for a better Tomorrow"
        description="Our Commitment to research and Development goes beyond creating
            products- We're dedicated to solving real-world challenges and
            shaping the future of Technology."
      />
      <LandingContact />
    </main>
  );
}

export const metadata: Metadata = {
  title: "Baliyo Ventures - Services",
  description: "We offer a range of services to help you build your tech.",
  openGraph: {
    title: "Baliyo Ventures - Services",
    description: "We offer a range of services to help you build your tech.",
    images: "/images/about/about-hero-1.jpg",
  },
};
