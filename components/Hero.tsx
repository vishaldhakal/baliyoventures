import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="h-screen bg-[#00040C] flex items-center justify-center relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-40 w-32 h-32 bg-[#EBB51F] opacity-20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-40 right-60 w-40 h-40 bg-[#EBB51F] opacity-20 rounded-full blur-2xl"></div>
      </div>

      <div className="container mx-auto px-4 z-10">
        <div className="flex flex-col items-center text-center max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-4xl lg:text-4xl font-bold text-white/90 mb-2">
            Baliyo Ventures Building Technology For Nepali Businesses
          </h1>
          <h2 className="text-lg md:text-xl text-gray-300 mb-10 max-w-4xl font-mono">
            Looking for a reliable partner to build your next big idea? Whether
            you&apos;re a startup or an established company, we&apos;re here to
            help.Baliyo ventures can help you build the best technology whether
            it is <span className="text-yellow-300">mechanical</span>,{" "}
            <span className="text-yellow-300">software</span> or{" "}
            <span className="text-yellow-300">electronics</span>.
          </h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="bg-yellow-300 hover:bg-yellow-400 hover:scale-105 transition-all duration-300 cursor-pointer text-black font-bold px-8 py-6 rounded-md text-lg hover:shadow-[0_0_15px_rgba(235,181,31,0.5)] shadow-[0_0_25px_rgba(235,181,31,0.7)]">
              Have Any Project In Mind?
            </Button>
            <Button
              variant="outline"
              className="border-white text-black hover:bg-white/10 hover:scale-105 transition-all duration-300 hover:text-white cursor-pointer px-8 py-6 rounded-md text-lg"
            >
              Explore What We Have Done
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
