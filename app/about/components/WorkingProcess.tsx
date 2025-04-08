import React from "react";

const steps = [
  {
    number: 1,
    title: "Planning",
    description:
      "We begin by understanding your vision, defining key objectives, and laying a solid foundation for success.",
    color: "#FA541C", // Orange
  },
  {
    number: 2,
    title: "Finalize Requirement",
    description:
      "We collaborate closely with you to understand your needs, gather key insights, and finalize project goals.",
    color: "#8E33FF", // Purple
  },
  {
    number: 3,
    title: "Plan and Review",
    description:
      "Our team meticulously maps out the development roadmap, reviewing every aspect to ensure smooth implementation.",
    color: "#FFAB00", // Yellow
  },
  {
    number: 4,
    title: "Build and Deploy",
    description:
      "With precision and agility, we bring your vision to life, rigorously testing and deploying solutions for maximum impact.",
    color: "#22C55E", // Green
  },
];

const WorkingProcess = () => {
  return (
    <section className="py-12 md:py-24 bg-[#050505] relative overflow-hidden">
      {/* Yellow blur elements */}
      <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-yellow-300 rounded-full blur-[368px] opacity-20"></div>
      <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-yellow-300 rounded-full blur-[368px] opacity-20"></div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center">
          <h2 className="text-3xl md:text-4xl lg:text-[48px] font-bold text-transparent bg-clip-text bg-gradient-to-br from-yellow-300 to-[#FFFCCB] font-oxanium text-center leading-[1.33] mb-12 md:mb-24">
            Our Working Process
          </h2>

          <div className="relative max-w-[1164px] w-full">
            {/* Center line - hidden on mobile */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/20 -translate-x-1/2 hidden md:block"></div>

            <div className="space-y-12 md:space-y-20">
              {steps.map((step, index) => (
                <div key={step.number} className="relative">
                  {/* Timeline dot */}
                  <div
                    className="absolute left-4 md:left-1/2 top-0 md:-translate-x-1/2 w-4 h-4 rounded-full z-10"
                    style={{ backgroundColor: step.color }}
                  ></div>

                  {/* Content container */}
                  <div className="grid md:grid-cols-2 gap-8 md:gap-16">
                    {/* Content - Shown on mobile and alternates sides on desktop */}
                    <div
                      className={`pl-12 md:pl-0 ${
                        index % 2 === 1 ? "md:col-start-2" : ""
                      }`}
                    >
                      <div
                        className={`md:max-w-[582px] ${
                          index % 2 === 0 ? "md:text-right" : "md:text-left"
                        }`}
                      >
                        <span
                          className="text-sm md:text-base font-bold tracking-wider uppercase"
                          style={{ color: step.color }}
                        >
                          STEP {step.number}
                        </span>
                        <h3 className="text-white text-2xl md:text-[32px] font-bold font-oxanium mt-2 md:mt-3 mb-2">
                          {step.title}
                        </h3>
                        <p className="text-[#B0B0B0] text-sm md:text-base leading-[1.57] opacity-70">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Vertical line for each step except last - Only visible on mobile */}
                  {step.number !== steps.length && (
                    <div className="absolute left-4 top-4 h-[calc(100%+3rem)] w-px bg-white/20 md:hidden"></div>
                  )}

                  {/* Vertical line for each step except last - Only visible on desktop */}
                  {step.number !== steps.length && (
                    <div className="absolute left-1/2 top-4 h-[calc(100%+5rem)] w-px bg-white/20 -translate-x-1/2 hidden md:block"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkingProcess;
