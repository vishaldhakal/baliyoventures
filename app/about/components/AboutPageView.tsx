import WhoAreWe from "./WhoAreWe";
import MessageFromMD from "./MessageFromMD";
import FAQs from "./FAQs";
import Testimonials from "./Testimonials";
import WorkCulture from "./WorkCulture";
import MissionVisionAndValues from "./MissionVisionAndValues";
import WorkingProcess from "./WorkingProcess";
import AboutHero from "./AboutHero";
import WhatWeDo from "./WhatWeDo";
import TeamCarousel from "./TeamCarousel";
import {
  getTeam,
  getTestimonials,
  getFaq,
  getGallery,
} from "@/services/about.service";

const AboutPageView = async () => {
  const teamMembers = await getTeam();
  const testimonials = await getTestimonials();
  const faqs = await getFaq();
  const gallery = await getGallery();

  return (
    <>
      <AboutHero />
      <WhoAreWe />
      <MissionVisionAndValues />
      <WorkingProcess />
      <WhatWeDo />
      <MessageFromMD />
      <WorkCulture gallery={gallery} />
      <TeamCarousel teamMembers={teamMembers} />
      <Testimonials testimonials={testimonials} />
      <FAQs faqs={faqs} />
      {/* Other about page sections can be added here */}
    </>
  );
};

export default AboutPageView;
