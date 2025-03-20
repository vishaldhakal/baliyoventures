import LandingContact from "@/components/LandingContact";
import Hero from "./components/Hero";
import ResearchOverview from "./components/ResearchOverview";
import Services from "./components/Services";

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
