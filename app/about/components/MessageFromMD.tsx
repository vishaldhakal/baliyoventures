import Image from "next/image";

const MessageFromMD = () => {
  return (
    <section className="py-24 md:py-32 bg-[#101010] relative overflow-hidden">
      {/* Decorative SVG positioning */}
      <div className="absolute top-0 right-0 w-full max-w-7xl mx-auto flex justify-end">
        <div className="relative w-full h-full">
          <Image
            src="/images/testimonial.svg"
            alt="Testimonial background"
            width={400}
            height={400}
            className="opacity-20"
          />
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center mb-6 md:mb-10">
          <div className="bg-black/30 border border-[#F0D100] rounded-[14px] px-5 py-2 mb-6">
            <p className="text-white uppercase font-bold text-lg">
              Message from Managing Director
            </p>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-br from-[#F0D100] to-[#FFFCCB] font-oxanium">
            Empowering Business Through Technology
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row items-center mt-10 relative max-w-6xl mx-auto">
          {/* MD Image */}
          <div className="w-full lg:w-4/12 relative z-10 lg:-mr-20">
            <div className="aspect-[3/4] rounded-2xl relative">
              <Image
                src="/images/anil-singh.png"
                alt="Anil Singh"
                fill
                className="object-cover rounded-2xl"
              />
              {/* Decorative boxes */}
              <div className="absolute top-8 -left-4 w-10 h-20 bg-[#F0D100] rounded-md"></div>
              <div className="absolute bottom-8 -right-4 w-10 h-20 bg-[#F0D100] rounded-md"></div>
            </div>
          </div>

          {/* MD Message */}
          <div className="w-full lg:w-9/12 relative z-0">
            <div className="bg-[#0D0D0D] rounded-2xl shadow-[0px_0px_14px_0px_rgba(237,237,255,1)] p-6 md:p-10 md:pl-24">
              <div className="mb-8">
                <div className="mb-4">
                  <svg
                    width="49"
                    height="49"
                    viewBox="0 0 49 49"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M43.8799 24.126H36.3799V18.126C36.3799 14.8166 39.0705 12.126 42.3799 12.126H43.1299C44.3768 12.126 45.3799 11.1229 45.3799 9.87598V5.37598C45.3799 4.1291 44.3768 3.12598 43.1299 3.12598H42.3799C34.0924 3.12598 27.3799 9.83848 27.3799 18.126V40.626C27.3799 43.1104 29.3955 45.126 31.8799 45.126H43.8799C46.3643 45.126 48.3799 43.1104 48.3799 40.626V28.626C48.3799 26.1416 46.3643 24.126 43.8799 24.126ZM16.8799 24.126H9.37988V18.126C9.37988 14.8166 12.0705 12.126 15.3799 12.126H16.1299C17.3768 12.126 18.3799 11.1229 18.3799 9.87598V5.37598C18.3799 4.1291 17.3768 3.12598 16.1299 3.12598H15.3799C7.09238 3.12598 0.379883 9.83848 0.379883 18.126V40.626C0.379883 43.1104 2.39551 45.126 4.87988 45.126H16.8799C19.3643 45.126 21.3799 43.1104 21.3799 40.626V28.626C21.3799 26.1416 19.3643 24.126 16.8799 24.126Z"
                      fill="#F0D100"
                    />
                  </svg>
                </div>
                <p className="text-white text-lg leading-relaxed text-justify">
                  At Baliyo Ventures, our goal is to empower businesses through
                  technology. As a Managing Director, I am committed to
                  delivering innovative solutions that drive growth, efficiency,
                  and long-term success. We are more than just a service
                  provider—we are a strategic partner in your digital journey.
                  With expertise in product design, architecture design,
                  software development, and research & development, we craft
                  tailored solutions that align with your business needs. Our
                  team stays at the forefront of industry advancements,
                  leveraging data-driven strategies to address current
                  challenges while ensuring future readiness. Your success is
                  our priority, and we are dedicated to guiding you through
                  every phase of your transformation. Thankyou for choosing us
                  to help you achieve your vision.
                </p>
              </div>
              <div>
                <h4 className="text-white font-bold text-2xl">Anil Singh</h4>
                <p className="text-[#F0D100] text-lg">Managing Director</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MessageFromMD;
