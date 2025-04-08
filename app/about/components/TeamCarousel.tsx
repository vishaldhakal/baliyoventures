"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface TeamMember {
  id: number;
  name: string;
  position: string;
  image: string;
}

const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: "MD.Anil Singh",
    position: "Managing Director",
    image: "/images/team/team-member-5.png",
  },
  {
    id: 2,
    name: "VISHAL DHAKAL",
    position: "Backend Developer ",
    image: "/images/team/team-member-2.png",
  },
  {
    id: 3,
    name: "Er. Manav Khadka",
    position: "Electronics & Communication Engineer",
    image: "/images/team/manav.png",
  },
  {
    id: 4,
    name: "Prithvi Chaudhary ",
    position: "Product Manager",
    image: "/images/team/prithvi.png",
  },
  {
    id: 5,
    name: "Dipawoli Malla",
    position: "CEO",
    image: "/images/team/team-member-8.png",
  },
];

const TeamCarousel = () => {
  const [startIndex, setStartIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const getVisibleMembers = () => {
    const visibleMembers = [];
    for (let i = 0; i < 5; i++) {
      const index = (startIndex + i) % teamMembers.length;
      visibleMembers.push({ ...teamMembers[index], displayIndex: i });
    }
    return visibleMembers;
  };

  const handleNext = () => {
    setStartIndex((prev) => (prev + 1) % teamMembers.length);
  };

  const handlePrev = () => {
    setStartIndex(
      (prev) => (prev - 1 + teamMembers.length) % teamMembers.length
    );
  };

  const getTranslateX = (index: number) => {
    return index * 280 - 2 * 280 + "px";
  };

  const getScale = (index: number) => {
    return index === 2 ? 1.3 : index === 1 || index === 3 ? 1.1 : 1;
  };

  const getZIndex = (index: number) => {
    if (index === 2) return 40; // Active item
    if (index === 1 || index === 3) return 30; // Adjacent items
    return 20; // Outer items
  };

  return (
    <div className="relative w-full bg-[#00040C] py-32">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-white mb-24">
          Meet Our Team
        </h2>
        <div className="relative h-[700px] flex items-center justify-center overflow-hidden">
          <button
            onClick={handlePrev}
            className="absolute left-4 z-50 text-white bg-[#E8D974] hover:bg-[#d4c666] p-4 rounded-full transition-colors duration-200"
            aria-label="Previous"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div className="flex items-center justify-center relative w-full max-w-[1600px] mx-auto">
            {getVisibleMembers().map((member, index) => {
              const isActive = index === 2;

              return (
                <motion.div
                  key={`${member.id}-${index}`}
                  className="absolute cursor-pointer"
                  style={{
                    zIndex: getZIndex(index),
                  }}
                  initial={false}
                  animate={{
                    x: getTranslateX(index),
                    scale: getScale(index),
                    opacity: index === 0 || index === 4 ? 0.5 : 1,
                    rotateY:
                      index < 2 ? "15deg" : index > 2 ? "-15deg" : "0deg",
                  }}
                  transition={{
                    duration: 0.7,
                    ease: [0.4, 0.0, 0.2, 1],
                    opacity: { duration: 0.5 },
                    rotateY: { duration: 0.7 },
                    scale: {
                      duration: 0.4,
                      ease: "easeOut",
                    },
                  }}
                  whileHover={{
                    scale: isActive ? getScale(index) : getScale(index) * 1.05,
                    transition: { duration: 0.2 },
                  }}
                  onClick={() =>
                    setStartIndex(
                      (startIndex + index - 2 + teamMembers.length) %
                        teamMembers.length
                    )
                  }
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div className="relative">
                    <motion.div
                      className={cn(
                        "relative w-[280px] h-[280px] rounded-full overflow-hidden transition-all duration-300",
                        isActive
                          ? "border-4 border-[#E8D974]"
                          : "border-2 border-gray-600"
                      )}
                      whileHover={!isActive ? { scale: 1.05 } : {}}
                      transition={{ duration: 0.2 }}
                    >
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover"
                      />
                      {hoveredIndex === index && !isActive && (
                        <AnimatePresence>
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center"
                          >
                            <div className="text-center text-white p-4">
                              <p className="text-xl font-semibold">
                                {member.name}
                              </p>
                              <p className="text-base text-gray-300">
                                {member.position}
                              </p>
                            </div>
                          </motion.div>
                        </AnimatePresence>
                      )}
                    </motion.div>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute -bottom-24 left-1/2 -translate-x-1/2 text-center w-full"
                      >
                        <p className="text-3xl font-semibold text-white">
                          {member.name}
                        </p>
                        <p className="text-xl text-gray-300 mt-2">
                          {member.position}
                        </p>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
          <button
            onClick={handleNext}
            className="absolute right-4 z-50 text-white bg-[#E8D974] hover:bg-[#d4c666] p-4 rounded-full transition-colors duration-200"
            aria-label="Next"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamCarousel;
