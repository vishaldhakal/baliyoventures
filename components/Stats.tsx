import Image from "next/image";

const StatItem = ({ value, label }: { value: string; label: string }) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <h6 className="font-lekton font-bold text-3xl sm:text-4xl md:text-[38px] text-white">
        {value}
      </h6>
      <h6 className="font-saira font-medium text-base sm:text-lg text-white text-center">
        {label}
      </h6>
    </div>
  );
};

const Stats = () => {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/stats/stats-background.png"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black opacity-80"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Facts and Figures Title - Now at the top */}
        <div className="mb-16 flex justify-center">
          <div className="relative inline-block">
            {/* Background with gradient border */}
            <div className="bg-transparent rounded-[14px] px-6 py-4 border border-transparent relative">
              {/* Pseudo-element for gradient border */}
              <div
                className="absolute inset-0 rounded-[14px] -z-10"
                style={{
                  background:
                    "linear-gradient(90deg, #F0D100 0%, transparent 100%)",
                  padding: "1px",
                  mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  maskComposite: "exclude",
                }}
              ></div>
              <h2 className="text-3xl md:text-4xl lg:text-[42px] font-semibold tracking-wider font-oxanium bg-gradient-to-br from-[#F0D100] to-[#FFFCCB] bg-clip-text text-transparent">
                Facts and Figures
              </h2>
            </div>
          </div>
        </div>

        {/* Stats in a 2x2 Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 md:gap-16 max-w-3xl mx-auto">
          <StatItem value="2 YEARS" label="of Expertise" />
          <StatItem value="1k+" label="Satisfied Customers" />
          <StatItem value="100+" label="Machines & Systems Delivered" />
          <StatItem value="50+" label="Companies Served" />
        </div>
      </div>
    </section>
  );
};

export default Stats;
