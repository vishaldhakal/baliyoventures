import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="h-screen bg-[#00040C] flex items-center justify-center relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-40 w-32 h-32 bg-[#EBB51F] opacity-20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-40 right-60 w-40 h-40 bg-[#EBB51F] opacity-20 rounded-full blur-2xl"></div>
      </div>

      <div className="container mx-auto px-4 z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            Turning <span className="text-[#F0D100]">Ideas</span> into{" "}
            <span className="text-[#F0D100]">Reality</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl">
            We help businesses transform their ideas into innovative
            technological solutions. Experience the future with Baliyo Ventures.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="bg-[#F0D100] hover:bg-[#d9a71c] text-black font-bold px-8 py-6 rounded-md text-lg">
              Get Started
            </Button>
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white/10 px-8 py-6 rounded-md text-lg"
            >
              Learn More <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
