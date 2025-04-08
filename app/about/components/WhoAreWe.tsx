import Link from "next/link";
import { StatsValueText } from "@/components/StatsValueText";
import { ArrowRight } from "lucide-react";

const WhoAreWe = () => {
  return (
    <section className=" py-20 md:py-32 bg-[#00040C] relative overflow-hidden">
      {/* Yellow blur elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-yellow-300 rounded-full blur-[368px] opacity-40"></div>
      <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-yellow-300 rounded-full blur-[368px] opacity-40"></div>
      <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-yellow-300 rounded-full blur-[368px] opacity-40"></div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-24">
          {/* Left Content */}
          <div className="w-full lg:w-5/12 flex flex-col items-start">
            <div className="flex flex-col items-start text-left w-full">
              <span className="text-yellow-300 font-bold uppercase mb-6">
                About Us
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-br from-yellow-300 to-[#FFFCCB] font-oxanium">
                Who Are We?
              </h2>
              <p className="text-[#B0B0B0] text-base md:text-lg mb-10 max-w-md">
                At Baliyo Ventures, we are passionate about delivering
                innovative solutions that help our clients achieve their
                business goals. Our mission is to help businesses transform
                their ideas into reality, and we are committed to providing
                exceptional service and support to every client.
              </p>
              <Link
                href="/about"
                className="flex items-center justify-center gap-2 text-white font-bold text-sm md:text-base px-3 py-3 hover:opacity-80 transition-opacity"
              >
                Learn more
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Right Content - Stats */}
          <div className="w-full lg:w-6/12 space-y-9">
            <StatsValueText
              value="150"
              subtitle="PROJECTS"
              description="Praesent turpis. Praesent blandit laoreet nibh. Nunc nonummy metus."
            />

            <StatsValueText
              value="3k"
              subtitle="HAPPY CLIENTS"
              description="Praesent blandit laoreet nibh. Suspendisse pulvinar, augue ac venenatis condimentum."
            />

            <StatsValueText
              value="2"
              subtitle="YEARS OF EXPERIENCE"
              description="Praesent blandit laoreet nibh. Suspendisse pulvinar, augue ac venenatis condimentum."
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoAreWe;
