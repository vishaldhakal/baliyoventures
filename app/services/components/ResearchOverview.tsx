"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type ResearchOverviewProps = {
  title: string;
  description: string;
  cta?: string;
};

export default function ResearchOverview({
  title,
  description,
  cta,
}: ResearchOverviewProps) {
  return (
    <section className="relative w-full min-h-[600px] flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute right-0 top-0 bottom-0 w-[55%] z-0">
        <Image
          src="/images/research/research-bg.jpg"
          alt="Research Background"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Full width gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#282303] from-40% via-[#171717] to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#282303]/90 via-[#171717]/80 to-transparent pointer-events-none" />

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-[663px] flex flex-col gap-[42px]"
        >
          <h2 className="font-oxanium text-[42px] font-semibold leading-[1.14] text-transparent bg-clip-text bg-gradient-to-br from-yellow-300 to-[#FFFCCB] md:max-w-[600px]">
            {/* Innovating for a better Tomorrow  */}
            {title}
          </h2>
          <p className="text-white font-inter text-xl font-medium leading-[1.6]">
            {/* Our Commitment to research and Development goes beyond creating
            products- We&apos;re dedicated to solving real-world challenges and
            shaping the future of Technology. */}
            {description}
          </p>
          {cta && (
            <Button
              asChild
              className="text-[#00040C] font-inter bg-yellow-300 text-xl w-fit font-medium leading-[1.6] hover:bg-yellow-300/80 transition-all duration-300"
            >
              <Link href="/contact">{cta}</Link>
            </Button>
          )}
        </motion.div>
      </div>
    </section>
  );
}
