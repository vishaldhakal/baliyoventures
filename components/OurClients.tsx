"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Partner } from "@/types/about";

const OurClients = ({ partners }: { partners: Partner[] }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section className="py-16 md:py-24 lg:py-32 bg-gradient-to-b from-[#201f1f] to-[#000000]">
      <div className="container mx-auto px-4 md:px-8 lg:px-12">
        <div className="flex flex-col items-center max-w-6xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16 md:mb-20"
          >
            <h2 className="text-3xl md:text-4xl lg:text-7xl font-bold mb-2 text-white">
              Trusted by Industry Leaders
            </h2>
            <p className="text-white/80 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
              We&apos;re proud to collaborate with forward-thinking companies,
              helping them achieve their digital transformation goals.
            </p>
          </motion.div>

          {/* Logos Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="w-full"
          >
            <div className="flex flex-wrap justify-center gap-8">
              {partners.map((partner, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  className="relative group"
                >
                  <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 h-[120px] sm:h-[140px] w-[120px] sm:w-[140px] flex items-center justify-center">
                    <div className="relative w-full h-full">
                      <Image
                        src={partner.image}
                        alt={partner.image_alt_description}
                        fill
                        className="object-contain filter group-hover:brightness-110 transition-all duration-300"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 md:mt-20 text-center"
          >
            <p className="text-white text-lg mb-6">
              Ready to join our growing list of successful partnerships?
            </p>
            <a
              href="/contact"
              className="inline-flex items-center px-8 py-3 rounded-full bg-gray-900 text-white hover:bg-gray-800 transition-colors duration-300"
            >
              Let&apos;s Work Together
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default OurClients;
