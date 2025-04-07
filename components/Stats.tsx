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
      {/* Pattern Background */}
      <div className="absolute inset-0 opacity-[0.03]">
        <svg
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-0"
        >
          <defs>
            <pattern
              id="cross-pattern"
              x="0"
              y="0"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="white"
                strokeWidth="1"
                strokeOpacity="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cross-pattern)" />
        </svg>
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
