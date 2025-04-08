"use client";

import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { motion } from "framer-motion";

const slides = [
  {
    title:
      "Driving Innovation through cutting-edge research and Development. Where Ideas transform into Solutions that shape the Future.",
    description:
      "Our R&D Division Combines Expertise in Product Development, Software Innovation, and Fundamental research to create breakthrough solutions for tomorrow's challenges. Our interdisciplinary approach ensures seamless integration of cutting-edge technology, user-centric design, and rigorous scientific research to drive meaningful innovation.",
    image: "/images/research/hero-1.jpg",
  },
  {
    title: "Pioneering Tomorrow's Solutions Through Advanced Research",
    description:
      "We're committed to pushing the boundaries of what's possible through innovative research and development. Our team of experts works tirelessly to develop groundbreaking solutions that address real-world challenges.",
    image: "/images/research/hero-1.jpg",
  },
];

export default function Hero() {
  return (
    <section className="relative w-full bg-gradient-to-br from-[#0A0A0A] to-[#020202] py-8 md:py-16">
      <div className="absolute inset-0 bg-[url('/images/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

      <div className="container mx-auto px-4">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {slides.map((slide, index) => (
              <CarouselItem key={index} className="relative w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 bg-[#0A0A0A]/80 backdrop-blur-sm rounded-2xl overflow-hidden">
                  <div className="relative flex flex-col justify-center bg-transparent lg:bg-[#171717]/80 p-6 md:p-8 lg:p-12">
                    <div className="hidden lg:block absolute top-6 left-6">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex items-center gap-2"
                      >
                        <span className="h-1 w-12 bg-gradient-to-r from-yellow-300 to-[#FFFCCB]" />
                        <span className="text-[#FFFCCB] font-medium">
                          Research & Development
                        </span>
                      </motion.div>
                    </div>

                    <div className="flex flex-col gap-6 md:gap-8 lg:gap-10">
                      <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-left font-oxanium text-2xl md:text-3xl lg:text-[32px] font-semibold leading-tight text-transparent bg-clip-text bg-gradient-to-br from-yellow-300 to-[#FFFCCB] min-h-[96px] lg:min-h-[128px]"
                      >
                        {slide.title}
                      </motion.h1>
                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-left font-inter text-sm md:text-base leading-relaxed text-white/90 min-h-[144px] lg:min-h-[168px]"
                      >
                        {slide.description}
                      </motion.p>
                    </div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="flex items-center gap-4 mt-8 lg:mt-12"
                    >
                      <CarouselPrevious className="relative text-white inset-0 h-10 w-10 rounded-full border border-white/10 bg-black/20 backdrop-blur-sm transition-colors hover:bg-white/10 hover:border-white/20" />
                      <CarouselNext className="relative text-white inset-0 h-10 w-10 rounded-full border border-white/10 bg-black/20 backdrop-blur-sm transition-colors hover:bg-white/10 hover:border-white/20" />
                    </motion.div>
                  </div>

                  <div className="group relative aspect-[1/1] w-full overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10" />
                    <Image
                      src={slide.image}
                      alt="Research and Development"
                      fill
                      className="object-cover object-center aspect-square transition-transform duration-700 group-hover:scale-105"
                      priority={index === 0}
                    />
                    <div className="absolute top-6 left-6 z-20 lg:hidden">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex items-center gap-2"
                      >
                        <span className="h-1 w-12 bg-gradient-to-r from-yellow-300 to-[#FFFCCB]" />
                        <span className="text-[#FFFCCB] font-medium">
                          Research & Development
                        </span>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
