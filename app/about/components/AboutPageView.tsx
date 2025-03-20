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

const AboutPageView = () => {
  return (
    <>
      <AboutHero />
      <WhoAreWe />
      <MissionVisionAndValues />
      <WorkingProcess />
      <WhatWeDo />
      <MessageFromMD />
      <WorkCulture />
      <TeamCarousel />
      <Testimonials />
      <FAQs />
      {/* Other about page sections can be added here */}
    </>
  );
};

export default AboutPageView;
