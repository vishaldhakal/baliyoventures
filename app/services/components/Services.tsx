"use client";

import { motion } from "framer-motion";
import ServiceCard from "./ServiceCard";
import { ServiceListResponse } from "@/types/services";

export default function Services({
  services,
}: {
  services: ServiceListResponse[];
}) {
  return (
    <section className="w-full bg-[#00040C] py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-6 md:gap-16"
        >
          {/* Section Title */}
          <h2 className="text-center font-oxanium text-[42px] font-semibold leading-[1.43] tracking-[0.012em] text-transparent bg-clip-text bg-gradient-to-br from-[#F0D100] to-[#FFFCCB]">
            Services & Solutions
          </h2>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {services.map((service, index) => (
              <ServiceCard key={service.title} {...service} index={index} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
