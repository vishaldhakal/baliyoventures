import Hero from "./Hero";
import AboutUs from "./AboutUs";
import Services from "./Services";
import Stats from "./Stats";
import Innovations from "./Innovations";
import OurClients from "./OurClients";
import ProjectInMind from "./ProjectInMind";
import LandingContact from "./LandingContact";

const HomePageView = () => {
  return (
    <main className="min-h-screen bg-[#00040C]">
      <Hero />
      <AboutUs />
      <Stats />
      <Services />
      <Innovations />
      <OurClients />
      <ProjectInMind />
      <LandingContact />
    </main>
  );
};

export default HomePageView;
