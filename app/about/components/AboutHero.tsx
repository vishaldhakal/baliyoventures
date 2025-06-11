import Image from "next/image";
import Link from "next/link";

const AboutHero = () => {
  return (
    <section className="relative min-h-[90vh] bg-black ">
      <div className="mx-auto container px-2">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Content */}
          <div className="flex flex-col justify-center space-y-8">
            <h1 className="text-4xl font-bold text-white md:text-5xl lg:text-5xl">
              <span className="text-yellow-400">About</span> Baliyo Ventures
            </h1>
            <h2 className="text-white/80 text-lg md:text-xl leading-relaxed max-w-xl me-auto font-mono">
              Know more about Baliyo Ventures and our journey. How we build,
              innovate and deliver. Our process and our team.
            </h2>
            <div className="flex gap-4">
              <Link
                href="tel:+9779861058990"
                className="inline-block rounded-md border-2 border-gradient-to-br from-yellow-400 to-yellow-100 bg-black/20 px-6 py-3 text-lg font-medium text-white transition-all hover:bg-yellow-400 hover:text-black"
              >
                Give us a call
              </Link>
              <Link
                href="/contact"
                className="inline-block rounded-md border-2 border-gradient-to-br from-yellow-400 to-yellow-100 bg-black/20 px-6 py-3 text-lg font-medium text-white transition-all hover:bg-yellow-400 hover:text-black"
              >
                Contact Us
              </Link>
            </div>
          </div>

          {/* Images */}
          <div className="relative h-[600px] lg:h-[700px]">
            <div className="absolute left-0 top-0 h-full w-full">
              <div className="relative h-full w-full">
                {/* Image 1 */}
                <div className="absolute left-[5%] top-[5%] h-[300px] w-[250px] overflow-hidden rounded-[22px] border-4 border-black md:h-[400px] md:w-[300px]">
                  <Image
                    src="/images/about/about-hero-1.jpg"
                    alt="About Hero Image 1"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                {/* Image 2 */}
                <div className="absolute right-[5%] top-[2%] h-[280px] w-[230px] overflow-hidden rounded-[22px] border-4 border-gradient-to-br from-yellow-400 to-yellow-100 md:h-[350px] md:w-[280px]">
                  <Image
                    src="/images/about/about-hero-2.jpg"
                    alt="About Hero Image 2"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                {/* Image 3 */}
                <div className="absolute bottom-[10%] right-[15%] h-[300px] w-[250px] overflow-hidden rounded-[22px] border-4 border-black md:h-[380px] md:w-[300px]">
                  <Image
                    src="/images/about/about-hero-3.jpg"
                    alt="About Hero Image 3"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;
