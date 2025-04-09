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
import { Testimonial } from "@/types/about";

interface TestimonialsProps {
  testimonials: Testimonial[];
}

const Testimonials = ({ testimonials }: TestimonialsProps) => {
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
      <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-yellow-300 rounded-full blur-[368px] opacity-20"></div>
      <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-yellow-300 rounded-full blur-[368px] opacity-20"></div>

      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold mb-16 text-transparent bg-clip-text bg-gradient-to-br from-yellow-300 to-[#FFFCCB] font-oxanium text-center">
          What Our Clients Say About Us
        </h2>

        <div className="mb-16 overflow-visible py-10">
          <Carousel
            opts={{
              align: "center",
              loop: true,
              slidesToScroll: 1,
            }}
            setApi={setApi}
            className="w-full max-w-7xl mx-auto px-4"
          >
            <CarouselContent className="overflow-visible py-10">
              {testimonials.map((testimonial, index) => (
                <CarouselItem
                  key={testimonial.id}
                  className="md:basis-1/2 lg:basis-1/3 overflow-visible px-4 sm:px-6"
                >
                  <div
                    className={`
                      bg-[#010714] rounded-xl shadow-lg p-6 h-full flex flex-col transition-all duration-300 transform-gpu
                      ${
                        current === index
                          ? "scale-110 shadow-xl shadow-yellow-300/10 border border-yellow-300/20 z-10"
                          : "scale-90 opacity-70"
                      }
                    `}
                  >
                    <div className="flex items-center mb-4">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4">
                        <Image
                          src={testimonial.image}
                          alt={
                            testimonial.image_alt_description ||
                            testimonial.name
                          }
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-lg">
                          {testimonial.name}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {testimonial.designation}
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
                      {testimonial.message}
                    </h4>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            <div className="flex justify-center items-center mt-10 gap-4">
              <CarouselPrevious
                className="static translate-y-0 rounded-full bg-transparent text-white border-gray-600 hover:bg-yellow-300/10 hover:border-yellow-300 hover:text-yellow-300"
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
                className="static translate-y-0 rounded-full bg-transparent text-white border-gray-600 hover:bg-yellow-300/10 hover:border-yellow-300 hover:text-yellow-300"
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
