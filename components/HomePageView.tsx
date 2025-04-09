import Hero from "./Hero";
import AboutUs from "./AboutUs";
import Services from "./Services";
import Stats from "./Stats";
import Innovations from "./Innovations";
import OurClients from "./OurClients";
import ProjectInMind from "./ProjectInMind";
import LandingContact from "./LandingContact";
import { ServiceListResponse } from "@/types/services";
import { getPartner } from "@/services/about.service";
import { Partner } from "@/types/about";

interface HomePageViewProps {
  services: ServiceListResponse[];
  partners: Partner[];
}

const HomePageView = async ({ services }: HomePageViewProps) => {
  const partners = await getPartner();
  return (
    <main className="min-h-screen bg-[#00040C]">
      <Hero />
      <AboutUs />
      <Stats />
      <Services services={services} />
      <Innovations />
      <OurClients partners={partners} />
      <ProjectInMind />
      <LandingContact />
    </main>
  );
};

export default HomePageView;
