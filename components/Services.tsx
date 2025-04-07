import { ServiceListResponse } from "@/types/services";
import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

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
    <HoverCard>
      <HoverCardTrigger asChild>
        <Card className="bg-[#171717] border-[rgba(255,255,255,0.07)] h-full transition-all duration-300 hover:border-[#F0D100]/20 hover:shadow-[0_0_15px_rgba(240,209,0,0.1)]">
          <CardHeader className="pb-4">
            <div className="w-12 h-12 flex items-center justify-center">
              <Image
                src={icon}
                alt={title}
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
          </CardHeader>

          <CardContent className="flex-grow flex flex-col">
            <h3 className="text-[#E4E4E4] text-2xl font-semibold uppercase tracking-wider mb-4 font-oxanium">
              {title}
            </h3>
            <p className="text-[#B5B5B5] text-sm font-light leading-[2.1] tracking-widest mb-auto">
              {description}
            </p>
          </CardContent>

          <CardFooter className="pt-7 flex flex-col w-full">
            <Separator className="bg-[rgba(255,255,255,0.07)]" />
            <div className="pt-7 ml-auto">
              <Button
                variant="ghost"
                className="w-full flex items-center justify-between text-[#E5E5E5] text-xs uppercase font-semibold tracking-widest font-saira group hover:bg-[rgba(240,209,0,0.2)]"
              >
                <span>Learn More</span>
                <ArrowRightIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 bg-[#171717] border-[rgba(255,255,255,0.07)] text-[#E4E4E4]">
        <div className="flex justify-between space-x-4">
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">{title}</h4>
            <p className="text-sm text-[#B5B5B5]">{description}</p>
            <div className="flex items-center pt-2">
              <Button
                variant="ghost"
                className="text-xs uppercase font-semibold tracking-widest font-saira group hover:bg-[rgba(240,209,0,0.2)] px-0"
              >
                <span className="text-[#F0D100]">View Projects</span>
                <ArrowRightIcon className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

const Services = ({ services }: { services: ServiceListResponse[] }) => {
  // const services = [
  //   {
  //     icon: "/images/services/product-dev-icon.svg",
  //     title: "Product Development",
  //     description:
  //       "Web development is the process of creating websites and web applications for the internet or intranet.",
  //   },
  //   {
  //     icon: "/images/services/product-dev-icon.svg",
  //     title: "software Development",
  //     description:
  //       "Cloud solutions refer to the use of cloud computing technology to provide services and solutions over the internet.",
  //   },
  //   {
  //     icon: "/images/services/research-dev-icon.svg",
  //     title: "Research & Development",
  //     description:
  //       "Revolutionize your Digital Presence with Cutting-Edge Mobile App Development, Design, and Innovation Services.",
  //   },
  //   {
  //     icon: "/images/services/product-dev-icon.svg",
  //     title: "Manufacturing Process",
  //     description:
  //       "Optimize your manufacturing processes with our technical expertise and innovative approaches.",
  //   },
  //   {
  //     icon: "/images/services/research-dev-icon.svg",
  //     title: "Baliyo Marketing",
  //     description:
  //       "Strategic digital marketing solutions to enhance your brand presence and customer reach.",
  //   },
  //   {
  //     icon: "/images/services/product-dev-icon.svg",
  //     title: "Mobile Solutions",
  //     description:
  //       "Cross-platform mobile applications designed for performance and exceptional user experience.",
  //   },
  // ];

  return (
    <section className="py-16 md:py-24 bg-[#212121] relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4 font-oxanium bg-gradient-to-br from-[#F0D100] to-[#FFFCCB] bg-clip-text text-transparent">
            Services & Solutions
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.short_description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
