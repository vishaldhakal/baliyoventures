"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ServiceListResponse } from "@/types/services";

interface ServiceCardProps extends ServiceListResponse {
  index: number;
}

export default function ServiceCard({
  title,
  short_description,
  slug,
  thumbnail_image,
  thumbnail_image_alt_description,
  index,
}: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group flex flex-col gap-6 rounded-[5px] border border-white/[0.07] bg-[#171717] p-6"
    >
      {/* Image */}
      <div className="relative h-[300px] w-full overflow-hidden rounded-sm">
        <Image
          src={thumbnail_image}
          alt={thumbnail_image_alt_description}
          fill
          className="object-cover object-center transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2.5">
        <h3 className="font-oxanium text-xl font-semibold uppercase tracking-[0.02em] text-[#E4E4E4]">
          {title}
        </h3>
        <p className="font-inter text-sm font-light leading-[2.14] tracking-[0.03em] text-[#B5B5B5]">
          {short_description}
        </p>
      </div>

      {/* Learn More Button */}
      <div className="mt-7">
        <motion.button className="group/btn cursor-pointer flex items-center gap-3 rounded-sm bg-yellow-300/20 px-4 py-2.5 transition-colors hover:bg-yellow-300/30">
          <a
            href={`/services/${slug}`}
            className="font-headings text-sm font-semibold uppercase tracking-[0.03em] text-[#E5E5E5]"
          >
            Learn More
          </a>
          <ArrowRight className="h-4 w-4 stroke-[1.5px] text-[#E5E5E5] transition-transform group-hover/btn:translate-x-1" />
        </motion.button>
      </div>
    </motion.div>
  );
}
