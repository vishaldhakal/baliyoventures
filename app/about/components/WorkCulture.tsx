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
import { Gallery } from "@/types/about";

interface WorkCultureProps {
  gallery: Gallery[];
}

const WorkCulture = ({ gallery }: WorkCultureProps) => {
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
      <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-yellow-300 rounded-full blur-[368px] opacity-20"></div>
      <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-yellow-300 rounded-full blur-[368px] opacity-20"></div>

      <div className="">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-block bg-black/30 border border-yellow-300 rounded-[14px] px-5 py-2 mb-6">
            <p className="text-white uppercase font-bold tracking-wider text-lg">
              Our Work Culture
            </p>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-br from-yellow-300 to-[#FFFCCB] font-oxanium">
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
              {gallery.map((image, index) => (
                <CarouselItem
                  key={image.id}
                  className="md:basis-1/2 lg:basis-1/3 overflow-visible px-4 sm:px-6"
                >
                  <div
                    className={`
                      rounded-2xl overflow-hidden transition-all duration-300 transform-gpu h-full
                      ${
                        current === index
                          ? "scale-110 shadow-xl shadow-yellow-300/10 z-10 border-2 border-yellow-300/50"
                          : "scale-95 opacity-70 blur-[0.5px]"
                      }
                    `}
                  >
                    <div className="relative aspect-[3/4] w-full">
                      <Image
                        src={image.media}
                        alt={image.media_alt_description}
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
                className="w-10 h-10 rounded-full flex items-center justify-center bg-black/30 border border-gray-700 text-white hover:border-yellow-300 hover:bg-yellow-300/10 transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex gap-2">
                {gallery.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => api?.scrollTo(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-colors ${
                      current === i
                        ? "bg-yellow-300"
                        : "bg-gray-600 hover:bg-gray-400"
                    }`}
                    aria-label={`Go to image ${i + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={() => api?.scrollNext()}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-black/30 border border-gray-700 text-white hover:border-yellow-300 hover:bg-yellow-300/10 transition-colors"
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
            className="inline-flex items-center justify-center px-6 py-3 text-white font-medium bg-black/20 border-2 border-yellow-300 rounded-md hover:bg-yellow-300/10 transition-colors"
          >
            Join Us Now
          </Link>
        </div>
      </div>
    </section>
  );
};

export default WorkCulture;
