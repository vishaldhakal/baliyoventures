"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { TeamMember } from "@/types/about";
import {
  ChevronLeft,
  ChevronRight,
  Linkedin,
  Twitter,
  Instagram,
  Facebook,
  Globe,
  User,
} from "lucide-react";
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
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  // Helper function to get social icon
  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case "linkedin":
        return <Linkedin className="h-4 w-4" />;
      case "twitter":
        return <Twitter className="h-4 w-4" />;
      case "instagram":
        return <Instagram className="h-4 w-4" />;
      case "facebook":
        return <Facebook className="h-4 w-4" />;
      case "website":
        return <Globe className="h-4 w-4" />;
      default:
        return null;
    }
  };

  // Get available social links
  const getSocialLinks = (member: TeamMember) => {
    const links = [];
    if (member.linkedin)
      links.push({ platform: "linkedin", url: member.linkedin });
    if (member.twitter)
      links.push({ platform: "twitter", url: member.twitter });
    if (member.instagram)
      links.push({ platform: "instagram", url: member.instagram });
    if (member.facebook)
      links.push({ platform: "facebook", url: member.facebook });
    if (member.website)
      links.push({ platform: "website", url: member.website });
    return links;
  };

  // Handle image error
  const handleImageError = (memberId: string) => {
    setImageErrors((prev) => ({ ...prev, [memberId]: true }));
  };

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
                {teamMembers.map((member) => {
                  const socialLinks = getSocialLinks(member);
                  const hasImageError = imageErrors[member.id];

                  return (
                    <CarouselItem
                      key={member.id}
                      className="pl-6 basis-1/2 lg:basis-1/4"
                    >
                      <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-colors duration-300 hover:border-[#E8D974]/40 h-full">
                        <div className="relative aspect-[4/5] w-full overflow-hidden bg-white/5">
                          {/* Image or Placeholder */}
                          {member.image && !hasImageError ? (
                            <Image
                              src={member.image}
                              alt={
                                member.image_alt_description ||
                                member.name ||
                                "Team member"
                              }
                              fill
                              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                              onError={() =>
                                handleImageError(String(member.id))
                              }
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-white/5 to-white/10">
                              <User className="h-20 w-20 text-white/20" />
                            </div>
                          )}

                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        </div>

                        <div className="flex flex-col gap-1 px-4 py-4 flex-1">
                          <p className="text-base font-semibold text-white">
                            {member.name}
                          </p>
                          <p className="text-sm text-white/50 min-h-[20px]">
                            {member.designation}
                          </p>

                          {/* Social Links - Only show if available */}
                          {socialLinks.length > 0 && (
                            <div className="flex gap-2 mt-2 pt-2 border-t border-white/5">
                              {socialLinks.map((link) => (
                                <a
                                  key={link.platform}
                                  href={link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-white/40 hover:text-[#E8D974] transition-colors duration-200"
                                  aria-label={`${member.name}'s ${link.platform}`}
                                >
                                  {getSocialIcon(link.platform)}
                                </a>
                              ))}
                            </div>
                          )}
                        </div>

                        <span className="absolute bottom-[4.25rem] left-4 h-0.5 w-8 rounded-full bg-[#E8D974] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      </div>
                    </CarouselItem>
                  );
                })}
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
