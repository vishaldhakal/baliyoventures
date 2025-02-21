import Hero from "@/components/Hero";
import About from "@/components/About";
import MissionVision from "@/components/MissionVision";
import Stats from "@/components/Stats";
import Services from "@/components/Services";
import Portfolio from "@/components/Portfolio";
import Testimonials from "@/components/Testimonials";
import Team from "@/components/Team";
import BlogPreview from "@/components/BlogPreview";
import Faq from "@/components/Faq";
import ContactForm from "@/components/ContactForm";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <About />
      <MissionVision />
      <Stats />
      <Services />
      <Portfolio />
      <Testimonials />
      <Team />
      <BlogPreview />
      <Faq />
      <ContactForm />
    </main>
  );
}
