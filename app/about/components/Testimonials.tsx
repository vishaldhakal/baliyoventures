"use client";

import Image from "next/image";
import { StarIcon } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import { type CarouselApi } from "@/components/ui/carousel";

// Dummy testimonial data
const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    role: "CEO, TechSolutions Inc.",
    rating: 5,
    title: "Exceptional development expertise",
    testimonial:
      "Baliyo Ventures exceeded our expectations with their exceptional development expertise. Their team understood our business requirements perfectly and delivered a robust solution that has significantly improved our operational efficiency. The attention to detail and commitment to quality is truly remarkable.",
    image: "/images/testimonials/testimonial-1.jpg",
  },
  {
    id: 2,
    name: "Rohan Patel",
    role: "Marketing Director, GrowthBridge",
    rating: 5,
    title: "Transformed our digital presence",
    testimonial:
      "Working with Baliyo Ventures has transformed our digital presence completely. Their strategic approach to design and development resulted in a user-friendly platform that has increased our customer engagement by 60%. Their team was responsive, professional, and delivered the project ahead of schedule.",
    image: "/images/testimonials/testimonial-2.jpg",
  },
  {
    id: 3,
    name: "Sarah Johnson",
    role: "Operations Manager, HealthTech Solutions",
    rating: 4,
    title: "Reliable and innovative partner",
    testimonial:
      "Baliyo Ventures has been a reliable and innovative partner in our digital transformation journey. Their expertise in healthcare technology helped us create a seamless patient management system. Their team was always available to address our concerns and provided valuable insights throughout the development process.",
    image: "/images/testimonials/testimonial-3.jpg",
  },
  {
    id: 4,
    name: "Michael Chen",
    role: "CTO, FinServe Innovations",
    rating: 5,
    title: "Outstanding technical expertise",
    testimonial:
      "The technical expertise demonstrated by Baliyo Ventures was outstanding. They helped us navigate complex financial regulations while building a secure and scalable platform. Their development methodology is thorough, and they consistently delivered high-quality code that met our stringent requirements.",
    image: "/images/testimonials/testimonial-4.jpg",
  },
  {
    id: 5,
    name: "Neha Gupta",
    role: "Product Manager, RetailTech",
    rating: 5,
    title: "Transformed our customer experience",
    testimonial:
      "Baliyo Ventures has completely transformed our customer experience with their innovative solutions. The e-commerce platform they developed for us is intuitive, fast, and has significantly increased our conversion rates. Their team's dedication to understanding our business challenges made all the difference.",
    image: "/images/testimonials/testimonial-5.jpg",
  },
  {
    id: 6,
    name: "David Wilson",
    role: "Founder, EduLearn Platform",
    rating: 4,
    title: "Exceptional collaboration experience",
    testimonial:
      "Our collaboration with Baliyo Ventures was exceptional from start to finish. They helped us create an educational platform that has revolutionized how we deliver content to students. Their team was proactive in suggesting features that enhanced user engagement and learning outcomes.",
    image: "/images/testimonials/testimonial-6.jpg",
  },
  {
    id: 7,
    name: "Aarav Mehta",
    role: "Director, Supply Chain Solutions",
    rating: 5,
    title: "Game-changing logistics solution",
    testimonial:
      "Baliyo Ventures delivered a game-changing logistics solution for our business. Their deep understanding of supply chain challenges helped them develop a system that optimized our operations and reduced costs. The attention to detail in both the backend architecture and user interface was impressive.",
    image: "/images/testimonials/testimonial-7.jpg",
  },
];

const Testimonials = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <section className="py-24 bg-[#00040C] relative overflow-hidden">
      {/* Yellow blur elements */}
      <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-[#F0D100] rounded-full blur-[368px] opacity-20"></div>
      <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-[#F0D100] rounded-full blur-[368px] opacity-20"></div>

      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold mb-16 text-transparent bg-clip-text bg-gradient-to-br from-[#F0D100] to-[#FFFCCB] font-oxanium text-center">
          What Our Clients Say About Us
        </h2>

        <div className="overflow-visible py-10">
          <Carousel
            opts={{
              align: "center",
              loop: true,
            }}
            setApi={setApi}
            className="w-full"
          >
            <CarouselContent className="overflow-visible py-8">
              {testimonials.map((testimonial, index) => (
                <CarouselItem
                  key={testimonial.id}
                  className="md:basis-1/2 lg:basis-1/3 px-4 overflow-visible"
                >
                  <div
                    className={`
                      bg-[#010714] rounded-xl shadow-lg p-6 h-full flex flex-col
                      transition-all duration-300 transform-gpu
                      ${
                        current === index
                          ? "scale-110 shadow-xl shadow-[#F0D100]/10 border border-[#F0D100]/20 z-10"
                          : "scale-90 opacity-70"
                      }
                    `}
                  >
                    <div className="flex items-center mb-4">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4">
                        <Image
                          src={testimonial.image}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-lg">
                          {testimonial.name}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>

                    <div className="flex mb-2">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`w-5 h-5 ${
                            i < testimonial.rating
                              ? "text-[#FFAC4D] fill-[#FFAC4D]"
                              : "text-[#FFAC4D] fill-transparent"
                          }`}
                        />
                      ))}
                    </div>

                    <h4 className="text-gray-300 font-semibold text-lg mb-2">
                      {testimonial.title}
                    </h4>
                    <p className="text-gray-500 text-sm leading-relaxed flex-grow">
                      {testimonial.testimonial}
                    </p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            <div className="flex justify-center items-center mt-10 gap-4">
              <CarouselPrevious
                className="static translate-y-0 rounded-full bg-transparent text-white border-gray-600 hover:bg-[#F0D100]/10 hover:border-[#F0D100] hover:text-[#F0D100]"
                onClick={() => api?.scrollPrev()}
              />

              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full cursor-pointer ${
                      current === i
                        ? "bg-white"
                        : "bg-gray-600 hover:bg-gray-400"
                    }`}
                    onClick={() => api?.scrollTo(i)}
                  />
                ))}
              </div>

              <CarouselNext
                className="static translate-y-0 rounded-full bg-transparent text-white border-gray-600 hover:bg-[#F0D100]/10 hover:border-[#F0D100] hover:text-[#F0D100]"
                onClick={() => api?.scrollNext()}
              />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
