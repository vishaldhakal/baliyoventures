import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Cpu,
  Bot,
  Terminal,
  ChevronRight,
  Lightbulb,
  Zap,
  Rocket,
} from "lucide-react";
import Innovations from "@/components/Innovations";
import LandingContact from "@/components/LandingContact";
import ResearchOverview from "@/app/services/components/ResearchOverview";

export const metadata: Metadata = {
  title: "Research & Development | Baliyo Ventures - Pioneering Next-Gen Tech",
  description:
    "Explore dynamic Research & Development at Baliyo Ventures. From robotics and IoT hardware to advanced AI-driven software, we design tomorrow's technology.",
  openGraph: {
    title:
      "Research & Development | Baliyo Ventures - Pioneering Next-Gen Tech",
    description:
      "Explore dynamic Research & Development at Baliyo Ventures. From robotics and IoT hardware to advanced AI-driven software, we design tomorrow's technology.",
    images: "/images/research/hero-1.jpg",
  },
};

const pillars = [
  {
    icon: Bot,
    title: "Robotics & Hardware Prototyping",
    description:
      "Designing state-of-the-art robotic systems and mechanical automation devices. From high-grade CAD models and stress analysis to physical chassis construction and mechanical integration.",
    features: [
      "Industrial Automation",
      "Robo-war Engineering",
      "Custom Mechanical Arms",
    ],
  },
  {
    icon: Cpu,
    title: "Embedded Systems & PCB Design",
    description:
      "Bringing electronics to life with high-performance microcontroller architectures, custom printed circuit board (PCB) designs, sensory arrays, and embedded firmware implementation.",
    features: [
      "Custom Circuit Routing",
      "IoT Sensors Integration",
      "Real-Time Microcontrollers",
    ],
  },
  {
    icon: Terminal,
    title: "AI-Powered Systems & Software",
    description:
      "Developing sophisticated machine learning algorithms, high-efficiency software architectures, computer vision systems, and robust web applications backing complex mechanical devices.",
    features: [
      "Computer Vision Models",
      "Intelligent Systems Integration",
      "High-Throughput Web Backends",
    ],
  },
];

export default function ResearchAndDevelopmentPage() {
  return (
    <main className="min-h-screen bg-[#00040C] text-white pt-24 md:pt-32">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden pb-16 md:pb-24 border-b border-white/[0.05]">
        <div className="absolute inset-0 bg-[url('/images/grid.svg')] bg-center opacity-30 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

        {/* Subtle glowing gradients in the background */}
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-yellow-300/10 blur-[120px] pointer-events-none" />
        <div className="absolute top-20 right-0 h-[450px] w-[450px] rounded-full bg-yellow-500/[0.04] blur-[150px] pointer-events-none" />

        <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content column */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="flex items-center gap-2">
                <span className="h-1 w-10 bg-gradient-to-r from-yellow-300 to-[#FFFCCB]" />
                <span className="text-[#FFFCCB] text-xs font-semibold uppercase tracking-[0.2em] font-oxanium">
                  Innovation Hub
                </span>
              </div>

              <h1 className="font-oxanium text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-[-0.02em] text-[#CDCDCD]">
                Pioneering Frontiers of{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-br from-yellow-300 to-[#FFFCCB]">
                  Research & Development
                </span>
              </h1>

              <p className="font-inter text-base md:text-lg font-light leading-[1.8] text-[#B5B5B5] max-w-2xl">
                At Baliyo Ventures, our R&D division acts as a bridge between
                bold conceptual ideas and robust, physical market-ready
                engineering solutions. We specialize in cross-disciplinary
                development combining robotics, embedded hardware circuits, and
                advanced software models.
              </p>

              <div className="flex flex-wrap gap-4 mt-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded bg-yellow-300 text-[#00040C] font-semibold text-sm hover:bg-yellow-300/90 transition-colors uppercase tracking-[0.03em]"
                >
                  Collaborate With Us
                  <ChevronRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded border border-white/[0.1] bg-[#161616] hover:bg-white/[0.05] text-white font-semibold text-sm transition-colors uppercase tracking-[0.03em]"
                >
                  Explore Services
                </Link>
              </div>
            </div>

            {/* Right Graphics/Image column */}
            <div className="lg:col-span-5">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-white/[0.08] bg-[#12151C]/80 shadow-[0_0_50px_rgba(0,0,0,0.8)] group">
                <Image
                  src="/images/research/hero-1.jpg"
                  alt="Baliyo Ventures R&D Laboratory"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                <div className="absolute bottom-6 left-6 right-6 p-4 rounded bg-[#00040C]/80 border border-white/[0.06] backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded bg-yellow-300/10 text-yellow-300">
                      <Zap className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-[#8F8F8F] uppercase tracking-[0.05em]">
                        R&D Focus
                      </p>
                      <p className="text-sm font-semibold text-[#E4E4E4] mt-0.5">
                        High-Precision Robotics & IoT
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Technical Pillars Section */}
      <section className="py-20 bg-[#02050D]">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-oxanium text-3xl md:text-4xl font-semibold uppercase tracking-[0.02em] text-[#CDCDCD] mb-4">
              Our Technical Pillars
            </h2>
            <p className="font-inter text-sm md:text-base text-[#B5B5B5] font-light leading-relaxed">
              We leverage deeply detailed expertise across three core technology
              sectors to create innovative solutions that solve real-world
              problems.
            </p>
          </div>

          {/* Pillars Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pillars.map((p, index) => {
              const Icon = p.icon;
              return (
                <div
                  key={index}
                  className="group flex flex-col gap-6 p-8 rounded-lg border border-white/[0.06] bg-[#12151C]/60 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.2)] hover:border-yellow-300/20 transition-all duration-300"
                >
                  <div className="p-3 rounded-md w-fit bg-yellow-300/10 text-yellow-300 group-hover:bg-yellow-300/25 transition-all">
                    <Icon className="h-6 w-6" />
                  </div>

                  <div className="flex flex-col gap-3">
                    <h3 className="font-oxanium text-xl font-semibold text-[#E4E4E4] group-hover:text-yellow-300 transition-colors">
                      {p.title}
                    </h3>
                    <p className="font-inter text-sm font-light leading-[1.8] text-[#B5B5B5]">
                      {p.description}
                    </p>
                  </div>

                  <div className="mt-auto pt-6 border-t border-white/[0.06]">
                    <p className="text-xs uppercase tracking-[0.05em] text-[#8F8F8F] mb-3">
                      Key Technologies
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {p.features.map((feat, fIdx) => (
                        <span
                          key={fIdx}
                          className="px-2.5 py-1 rounded bg-white/[0.04] border border-white/[0.06] text-xs font-medium text-[#FFFCCB]"
                        >
                          {feat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Innovations Component showcase (Delivered work) */}
      <Innovations />

      {/* R&D Overview and commitment CTA */}
      <ResearchOverview
        title="Innovating for a better Tomorrow"
        description="Our commitment to research and development goes beyond creating products—We're dedicated to solving real-world challenges, fostering learning ecosystems, and shaping the future of industrial technology."
        cta="Partner With Our R&D Team"
      />

      {/* Bottom Contact Form */}
      <LandingContact />
    </main>
  );
}
