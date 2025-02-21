import Image from "next/image";
import { Button } from "./ui/button";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-between px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex-1 max-w-2xl">
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6">
          From Vision to <span className="text-primary">Reality</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8">
          Shaping the future of technology in Nepal. We're not just building
          products, we're creating the future.
        </p>
        <div className="flex gap-4">
          <Button
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Meet our Robot
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-primary text-primary hover:bg-primary/10"
          >
            Get in Touch
          </Button>
        </div>
      </div>
      <div className="hidden md:flex flex-1 justify-end">
        <div className="relative w-[600px] h-[500px]">
          <Image
            src="/hero.png"
            alt="Robot Illustration"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>
    </section>
  );
}
