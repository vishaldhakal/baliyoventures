import Image from "next/image";

const MissionVisionAndValues = () => {
  return (
    <section className="py-24 bg-[#050505] relative overflow-hidden">
      {/* Yellow blur elements */}
      <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-[#F0D100] rounded-full blur-[368px] opacity-20"></div>
      <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-[#F0D100] rounded-full blur-[368px] opacity-20"></div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row justify-center items-stretch gap-16 lg:gap-[76px] max-w-5xl mx-auto">
          {/* Mission */}
          <div className="flex flex-col items-center gap-6 w-full lg:w-[270px]">
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-48 h-48">
                <Image
                  src="/images/about/mission-icon.png"
                  alt="Mission"
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="text-[#F0D100] text-2xl font-bold font-oxanium">
                OUR MISSION
              </h3>
            </div>
            <p className="text-[#B0B0B0] text-base text-justify leading-relaxed">
              To empower businesses through innovative technology solutions,
              fostering growth and digital transformation while maintaining the
              highest standards of quality and client satisfaction.
            </p>
          </div>

          {/* Vertical Line */}
          <div className="hidden lg:block w-[2px] bg-white/10 self-stretch"></div>

          {/* Vision */}
          <div className="flex flex-col items-center gap-6 w-full lg:w-[270px]">
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-48 h-48">
                <Image
                  src="/images/about/vision-icon.png"
                  alt="Vision"
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="text-[#F0D100] text-2xl font-bold font-oxanium">
                OUR VISION
              </h3>
            </div>
            <p className="text-[#B0B0B0] text-base text-justify leading-relaxed">
              To be the leading technology partner for businesses worldwide,
              recognized for our innovative solutions, technical excellence, and
              unwavering commitment to client success.
            </p>
          </div>

          {/* Vertical Line */}
          <div className="hidden lg:block w-[2px] bg-white/10 self-stretch"></div>

          {/* Values */}
          <div className="flex flex-col items-center gap-6 w-full lg:w-[282px]">
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-48 h-48">
                <Image
                  src="/images/about/values-icon.png"
                  alt="Values"
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="text-[#F0D100] text-2xl font-bold font-oxanium">
                OUR VALUES
              </h3>
            </div>
            <p className="text-[#B0B0B0] text-base text-justify leading-relaxed">
              Embracing Innovation, Development, ensuring Excellence, Integrity,
              and Client-Centricity – pushing boundaries, maintaining high
              standards, acting ethically, and prioritizing client success.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionVisionAndValues;
