import ProjectDetailView from "./components/ProjectDetailView";

type ProjectDetailProps = {
  params: Promise<{ slug: string }>;
};

export type Project = {
  title: string;
  slug: string;
  description: string;
  image: string;
};

export type Service = {
  title: string;
  slug: string;
  description: string;
  image: string;
  projects: Project[];
};

const services: Service[] = [
  {
    title: "Product Development",
    slug: "product-development",
    description:
      "Web development is the process of creating websites and web applications for the internet or intranet.",
    image: "/images/research/product-dev.jpg",
    projects: [
      {
        title: "Oil Heating Boiler",
        slug: "oil-heating-boiler",
        description:
          "Oil heating boiler uses heating oil (such as kerosene or diesel) as fuel to generate heat for commercial or Co....",
        image: "/images/projects/oil-heating-boiler.jpg",
      },
      {
        title: "Drainage Cleaning Robot",
        slug: "drainage-cleaning-robot",
        description:
          "A drainage cleaning robot is a robotic system designed to inspect, clean, and remove blockages from drainage systems, sewers, and pipelines.....",
        image: "/images/projects/drainage-robot.jpg",
      },
      {
        title: "Yachu Bottle mould design and manufacture assist",
        slug: "yachu-bottle-mould",
        description:
          "For the Yachu Bottle mould design and manufacture, here's how we can proceed .................",
        image: "/images/projects/yachu-bottle.jpg",
      },
      {
        title: "Cricket Balling Machine",
        slug: "cricket-balling-machine",
        description:
          "Oil heating boiler uses heating oil (such as kerosene or diesel) as fuel to generate heat for commercial or Co....",
        image: "/images/projects/cricket-machine.jpg",
      },
      {
        title: "Industrial Robotic Arm Protype",
        slug: "industrial-robotic-arm",
        description:
          "A drainage cleaning robot is a robotic system designed to inspect, clean, and remove blockages from drainage systems, sewers, and pipelines.....",
        image: "/images/projects/robotic-arm.jpg",
      },
      {
        title: "Sister V1",
        slug: "sister-v1",
        description:
          "For the Yachu Bottle mould design and manufacture, here's how we can proceed",
        image: "/images/projects/sister-v1.jpg",
      },
    ],
  },
  {
    title: "Software Development",
    slug: "software-development",
    description:
      "Cloud solutions refer to the use of cloud computing technology to provide services and solutions over the internet.",
    image: "/images/research/software-dev.jpg",
    projects: [
      {
        title: "Rojgar Koshi Digital Investment",
        slug: "rojgar-koshi",
        description:
          "A comprehensive digital investment platform designed to empower investors with tools and insights for making informed investment decisions.",
        image: "/images/projects/rojgar-koshi.jpg",
      },
      {
        title: "Jobbriz",
        slug: "jobbriz",
        description:
          "A modern job portal connecting employers with talented professionals, featuring advanced search and matching algorithms.",
        image: "/images/projects/jobbriz.jpg",
      },
      {
        title: "Mero Desh Meraii Utpadan",
        slug: "mero-desh",
        description:
          "An e-commerce platform promoting and selling locally produced goods, supporting local manufacturers and artisans.",
        image: "/images/projects/mero-desh.jpg",
      },
      {
        title: "Yeti PM Property Management App",
        slug: "yeti-pm",
        description:
          "A comprehensive property management solution for landlords and property managers to streamline operations and improve tenant experience.",
        image: "/images/projects/yeti-pm.jpg",
      },
      {
        title: "HikingBeez",
        slug: "hiking-beez",
        description:
          "A community-driven platform for hiking enthusiasts to discover trails, share experiences, and organize hiking events.",
        image: "/images/projects/hiking-beez.jpg",
      },
      {
        title: "Business Clinic",
        slug: "business-clinic",
        description:
          "A digital consulting platform connecting businesses with expert consultants for strategic guidance and problem-solving.",
        image: "/images/projects/business-clinic.jpg",
      },
      {
        title: "BAIN",
        slug: "bain",
        description:
          "A investing platform for the people of Nepal to invest in startup, find mentors, and get funding.",
        image: "/images/projects/hiking-beez.jpg",
      },
    ],
  },
  {
    title: "Research & Development",
    slug: "research-development",
    description:
      "Revolutionize your Digital Presence with Cutting-Edge Mobile App Development, Design, and Innovation Services.",
    image: "/images/research/research-dev.jpg",
    projects: [
      {
        title: "Robotics",
        slug: "robotics",
        description:
          "Cutting-edge robotics research and development focusing on automation, AI integration, and innovative mechanical solutions for industrial applications.",
        image: "/images/projects/robotics.jpg",
      },
      {
        title: "Virtual Reality (VR)",
        slug: "virtual-reality",
        description:
          "Immersive virtual reality experiences and solutions, pushing the boundaries of digital interaction and virtual environments.",
        image: "/images/projects/virtual-reality.jpg",
      },
      {
        title: "Augmented Reality (AR)",
        slug: "augmented-reality",
        description:
          "Advanced augmented reality applications that blend digital content with the real world, creating interactive and engaging user experiences.",
        image: "/images/projects/augmented-reality.jpg",
      },
      {
        title: "Artificial Intelligence (AI)",
        slug: "ai-machine-learning",
        description:
          "Integrating AI and machine learning technologies to automate tasks, optimize processes, and drive innovation in various industries.",
        image: "/images/projects/augmented-reality.jpg",
      },
    ],
  },
];

export default async function ProjectDetail({ params }: ProjectDetailProps) {
  const { slug } = await params;
  const service = services.find((service) => service.slug === slug);
  if (!service) {
    return <div>Service not found</div>;
  }
  return <ProjectDetailView service={service} />;
}
