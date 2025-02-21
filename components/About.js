import Image from "next/image";
import { Button } from "./ui/button";

export default function About() {
  return (
    <section className="relative py-20 px-4 md:px-6 lg:px-8">
      {/* Background Pattern */}
      <div className="absolute left-0 top-0 h-full w-32 opacity-20">
        <div className="relative h-full w-full">
          <Image
            src="/pattern.svg"
            alt="Pattern"
            fill
            className="object-cover"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="relative z-10">
            <span className="text-primary font-medium mb-4 block">
              About Us
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              We Are <span className="text-primary">Baliyo Ventures</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-6">
              We're not just building products; We're shaping the future of
              technology in Nepal.
            </p>
            <p className="text-muted-foreground mb-8">
              Baliyo Ventures specializes in machinery and innovative solutions,
              focusing on improving product design, manufacturing processes, and
              scalability. Whether you're a business looking for tech solutions
              or a professional aspiring to make a difference in the tech world,
              we invite you to join us on this exciting journey.
            </p>
            <Button
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10"
            >
              Learn More about Baliyo Ventures
            </Button>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative aspect-square rounded-full overflow-hidden transform -rotate-6">
              <Image
                src="/baliyoadvantage/1.jpeg"
                alt="Baliyo Team"
                fill
                className="object-cover"
              />
            </div>
            {/* Logo Overlay */}
            <div className="absolute -top-8 right-0 w-32 h-32">
              <Image
                src="/baliyo-logo.svg"
                alt="Baliyo Logo"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Background Pattern Right */}
      <div className="absolute right-0 bottom-0 h-full w-32 opacity-20 rotate-180">
        <div className="relative h-full w-full">
          <Image
            src="/pattern.svg"
            alt="Pattern"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
