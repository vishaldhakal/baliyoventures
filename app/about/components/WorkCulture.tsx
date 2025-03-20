"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { type CarouselApi } from "@/components/ui/carousel";
import Link from "next/link";

// Sample work culture images
const workCultureImages = [
  {
    id: 1,
    src: "/images/workculture/image1.jpg",
    alt: "Team collaboration",
  },
  {
    id: 2,
    src: "/images/workculture/image2.jpg",
    alt: "Team meeting",
  },
  {
    id: 3,
    src: "/images/workculture/image3.jpg",
    alt: "Office space",
  },
  {
    id: 4,
    src: "/images/workculture/image4.jpg",
    alt: "Team building activity",
  },
  {
    id: 5,
    src: "/images/workculture/image5.jpg",
    alt: "Collaboration session",
  },
  {
    id: 6,
    src: "/images/workculture/image6.jpg",
    alt: "Team discussion",
  },
  {
    id: 7,
    src: "/images/workculture/image7.jpg",
    alt: "Office celebration",
  },
];

const WorkCulture = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <section className="py-24 bg-[#050505] relative overflow-hidden">
      {/* Yellow blur elements */}
      <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-[#F0D100] rounded-full blur-[368px] opacity-20"></div>
      <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-[#F0D100] rounded-full blur-[368px] opacity-20"></div>

      <div className="">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-block bg-black/30 border border-[#F0D100] rounded-[14px] px-5 py-2 mb-6">
            <p className="text-white uppercase font-bold tracking-wider text-lg">
              Our Work Culture
            </p>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-br from-[#F0D100] to-[#FFFCCB] font-oxanium">
            #LifeatBaliyoVentures
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed">
            At Baliyo Ventures, we believe in creating a work environment that
            is both thrilling and fulfilling. We offer a competitive
            compensation package, along with various benefits to promote
            work-life balance and professional development.
          </p>
        </div>

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
              {workCultureImages.map((image, index) => (
                <CarouselItem
                  key={image.id}
                  className="md:basis-1/2 lg:basis-1/3 overflow-visible px-4 sm:px-6"
                >
                  <div
                    className={`
                      rounded-2xl overflow-hidden transition-all duration-300 transform-gpu h-full
                      ${
                        current === index
                          ? "scale-110 shadow-xl shadow-[#F0D100]/10 z-10 border-2 border-[#F0D100]/50"
                          : "scale-95 opacity-70 blur-[0.5px]"
                      }
                    `}
                  >
                    <div className="relative aspect-[3/4] w-full">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority={index === 0}
                      />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            <div className="flex justify-center items-center mt-10 gap-4">
              <button
                onClick={() => api?.scrollPrev()}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-black/30 border border-gray-700 text-white hover:border-[#F0D100] hover:bg-[#F0D100]/10 transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex gap-2">
                {workCultureImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => api?.scrollTo(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-colors ${
                      current === i
                        ? "bg-[#F0D100]"
                        : "bg-gray-600 hover:bg-gray-400"
                    }`}
                    aria-label={`Go to image ${i + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={() => api?.scrollNext()}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-black/30 border border-gray-700 text-white hover:border-[#F0D100] hover:bg-[#F0D100]/10 transition-colors"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </Carousel>
        </div>

        <div className="text-center">
          <Link
            href="/careers"
            className="inline-flex items-center justify-center px-6 py-3 text-white font-medium bg-black/20 border-2 border-[#F0D100] rounded-md hover:bg-[#F0D100]/10 transition-colors"
          >
            Join Us Now
          </Link>
        </div>
      </div>
    </section>
  );
};

export default WorkCulture;
