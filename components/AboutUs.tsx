import { Button } from "@/components/ui/button";
import Image from "next/image";

const AboutUs = () => {
  return (
    <section className="py-16 md:py-24 bg-[#171717] relative overflow-hidden">
      {/* Yellow blur backgrounds */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-10 left-10 w-24 h-24 bg-[#EBB51F] rounded-full blur-xl"></div>
        <div className="absolute top-[40%] right-20 w-32 h-32 bg-[#EBB51F] rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-[30%] w-20 h-20 bg-[#EBB51F] rounded-full blur-xl"></div>
      </div>

      {/* Left Side SVGs */}
      <div className="absolute left-0 top-1/4 w-20 h-full  pointer-events-none">
        <Image
          src="/images/home/left-image.svg"
          alt=""
          width={86}
          height={234}
          className="absolute left-0 top-0"
        />
      </div>

      {/* Right Side SVGs */}
      <div className="absolute right-0 top-1/3 w-20 h-full  pointer-events-none">
        <Image
          src="/images/home/right-image.svg"
          alt=""
          width={81}
          height={142}
          className="absolute right-0 top-0"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          {/* Left Side - Image */}
          <div className="w-full lg:w-1/2 h-[400px] md:h-[500px] relative rounded-lg overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
            <Image
              src="/about-image.jpg"
              alt="Baliyo Ventures Team"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute bottom-4 left-4 z-20">
              <Image
                src="/logo.svg"
                alt="Baliyo Ventures Logo"
                width={150}
                height={70}
                className="brightness-150"
              />
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="w-full lg:w-1/2 max-w-[553px]">
            <h4 className="text-[#F0D100] font-oxanium text-xl mb-2">
              About Us
            </h4>
            <div className="space-y-5">
              <h2 className="text-[#F0D100] font-saira text-3xl font-medium">
                We Are Baliyo Ventures
              </h2>
              <p className="text-2xl text-[#9A9A9A] font-inter leading-[1.375]">
                We&apos;re not just building products; We&apos;re shaping the
                future of technology in Nepal.
              </p>
              <p className="text-lg text-[#9A9A9A] font-inter leading-[1.67]">
                Baliyo Ventures specializes in machinery and innovative
                solutions, focusing on improving product design, manufacturing
                processes, and scalability. Whether you&apos;re a business
                looking for tech solutions or a professional aspiring to make a
                difference in the tech world, we invite you to join us on this
                exciting journey.
              </p>
              <div className="pt-4">
                <Button className="bg-black/20 text-white hover:bg-[#F0D100] hover:text-black border-2 border-[#F0D100] rounded-md px-5 py-3 transition-all duration-300 font-oxanium text-lg">
                  Learn More about Baliyo Ventures
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
