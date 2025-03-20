import Image from "next/image";

const ServiceCard = ({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) => {
  return (
    <div className="bg-[#171717] border border-[rgba(255,255,255,0.07)] p-8 rounded-md">
      <div className="mb-6">
        <div className="w-12 h-12 flex items-center justify-center">
          <Image
            src={icon}
            alt={title}
            width={48}
            height={48}
            className="object-contain"
          />
        </div>
      </div>
      <h3 className="text-[#E4E4E4] text-2xl font-semibold uppercase tracking-wider mb-2 font-oxanium">
        {title}
      </h3>
      <p className="text-[#B5B5B5] text-sm font-light leading-[2.1] tracking-widest mb-7">
        {description}
      </p>
      <div className="pt-7">
        <button className="flex items-center gap-3 text-[#E5E5E5] text-xs uppercase font-semibold tracking-widest font-saira relative group">
          <span className="absolute inset-0 bg-[rgba(240,209,0,0.2)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-sm"></span>
          <span className="relative z-10 py-2.5 px-4">Learn More</span>
          <span className="relative z-10 pr-3">
            <Image
              src="/images/services/learn-more-arrow.svg"
              alt="arrow"
              width={16}
              height={16}
              className="group-hover:translate-x-1 transition-transform duration-300"
            />
          </span>
        </button>
      </div>
    </div>
  );
};

const Services = () => {
  const services = [
    {
      icon: "/images/services/product-dev-icon.svg",
      title: "Product Development",
      description:
        "Web development is the process of creating websites and web applications for the internet or intranet.",
    },
    {
      icon: "/images/services/product-dev-icon.svg",
      title: "software Development",
      description:
        "Cloud solutions refer to the use of cloud computing technology to provide services and solutions over the internet.",
    },
    {
      icon: "/images/services/research-dev-icon.svg",
      title: "Research & Development",
      description:
        "Revolutionize your Digital Presence with Cutting-Edge Mobile App Development, Design, and Innovation Services.",
    },
    {
      icon: "/images/services/product-dev-icon.svg",
      title: "Manufacturing Process",
      description:
        "Optimize your manufacturing processes with our technical expertise and innovative approaches.",
    },
    {
      icon: "/images/services/research-dev-icon.svg",
      title: "Baliyo Marketing",
      description:
        "Strategic digital marketing solutions to enhance your brand presence and customer reach.",
    },
    {
      icon: "/images/services/product-dev-icon.svg",
      title: "Mobile Solutions",
      description:
        "Cross-platform mobile applications designed for performance and exceptional user experience.",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-[#212121] relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4 font-oxanium bg-gradient-to-br from-[#F0D100] to-[#FFFCCB] bg-clip-text text-transparent">
            Services & Solutions
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
