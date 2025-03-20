import Image from "next/image";
import Link from "next/link";

const WhatWeDo = () => {
  return (
    <section className="relative bg-black py-24 md:py-32 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-400 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-400 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container relative mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="max-w-xl mx-auto text-center mb-16">
          <div className="inline-block bg-[#EDEDFF] rounded-lg px-4 py-2 mb-4 transform hover:scale-105 transition-transform">
            <span className="text-[#3C3C46] text-sm font-medium uppercase tracking-wider">
              What WE DO
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            We&apos;re shaping the{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200">
              future of technology
            </span>{" "}
            in Nepal.
          </h2>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Content */}
          <div className="w-full lg:w-1/2 lg:pr-8">
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-3xl p-8 shadow-2xl transform hover:-translate-y-1 transition-transform">
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
                We focus on helping your business grow with customized IT
                solutions. Our approach combines innovation, efficiency, and
                industry expertise to address your specific needs which helps
                your business stays competitive and adaptable, leveraging the
                latest technologies for long-term success.
              </p>
              <div className="mt-8">
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-8 py-3 rounded-xl font-semibold hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 shadow-lg hover:shadow-yellow-400/20"
                >
                  Explore our Services
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="w-full lg:w-1/2">
            <div className="relative">
              {/* Decorative Elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-r from-yellow-400 to-yellow-200 rounded-full opacity-20 blur-lg" />
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-r from-yellow-400 to-yellow-200 rounded-full opacity-20 blur-lg" />

              {/* Main Image */}
              <div className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/about/what-we-do.jpg"
                  alt="What We Do"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats or Additional Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-8 border-t border-gray-800">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">
              100+
            </div>
            <div className="text-gray-400">Projects Completed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">
              50+
            </div>
            <div className="text-gray-400">Happy Clients</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">
              3+
            </div>
            <div className="text-gray-400">Years Experience</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">
              24/7
            </div>
            <div className="text-gray-400">Support Available</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatWeDo;
