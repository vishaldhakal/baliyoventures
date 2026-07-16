"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { TeamMember } from "@/types/about";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

interface TeamCarouselProps {
  teamMembers: TeamMember[];
}

const TeamCarousel = ({ teamMembers }: TeamCarouselProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <section className="relative w-full bg-[#05070D] py-28">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-16 flex flex-col items-center text-center">
          <span className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-[#E8D974]/80">
            The people behind the work
          </span>
          <h2 className="text-4xl font-semibold text-white sm:text-5xl">
            Meet Our Team
          </h2>
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Nav buttons */}
          <button
            onClick={() => api?.scrollPrev()}
            aria-label="Previous team member"
            className="group absolute left-0 cursor-pointer top-1/2 z-20 -translate-x-4 -translate-y-1/2 rounded-full border border-white/10 bg-white/5 p-3 text-white/70 backdrop-blur transition-all hover:border-[#E8D974]/50 hover:text-[#E8D974] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8D974]/60 sm:-translate-x-6"
          >
            <ChevronLeft />
          </button>

          <button
            onClick={() => api?.scrollNext()}
            aria-label="Next team member"
            className="group absolute right-0 top-1/2 z-20 -translate-y-1/2 translate-x-4 rounded-full border border-white/10 bg-white/5 p-3 text-white/70 backdrop-blur transition-all hover:border-[#E8D974]/50 hover:text-[#E8D974] focus-visible:outline-none focus-visible:ring-2 cursor-pointer focus-visible:ring-[#E8D974]/60 sm:translate-x-6"
          >
            <ChevronRight />
          </button>

          {/* Cards */}
          <div className="overflow-hidden px-2 sm:px-4">
            <Carousel
              opts={{
                align: "start",
                loop: true,
                slidesToScroll: 1,
              }}
              setApi={setApi}
              className="w-full"
            >
              <CarouselContent className="-ml-6 py-4">
                {teamMembers.map((member) => (
                  <CarouselItem
                    key={member.id}
                    className="pl-6 basis-1/2 lg:basis-1/4"
                  >
                    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-colors duration-300 hover:border-[#E8D974]/40 h-full">
                      <div className="relative aspect-[4/5] w-full overflow-hidden">
                        <Image
                          src={
                            (member.image ||
                              "/path/to/default/image.webp") as string
                          }
                          alt={
                            member.image_alt_description ||
                            member.name ||
                            "Team member"
                          }
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      </div>

                      <div className="flex flex-col gap-0.5 px-4 py-4">
                        <p className="truncate text-base font-semibold text-white">
                          {member.name}
                        </p>
                        <p className="truncate text-sm text-white/50">
                          {member.designation}
                        </p>
                      </div>

                      <span className="absolute bottom-[4.25rem] left-4 h-0.5 w-8 rounded-full bg-[#E8D974] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>

          {/* Dot indicators */}
          <div className="mt-10 flex items-center justify-center gap-2">
            {teamMembers.map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                aria-label={`Go to team member ${index + 1}`}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300 cursor-pointer",
                  index === current
                    ? "w-6 bg-[#E8D974]"
                    : "w-1.5 bg-white/20 hover:bg-white/40",
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamCarousel;
