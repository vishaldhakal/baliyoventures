"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";

export default function Testimonials() {
  const testimonials = [
    {
      name: "John Smith",
      role: "CTO, TechCorp",
      image: "/avatar.webp",
      content:
        "Baliyo Ventures has been instrumental in our digital transformation journey. Their expertise in AI and machine learning helped us achieve remarkable results.",
    },
    {
      name: "Sarah Johnson",
      role: "CEO, InnovateNow",
      image: "/avatar.webp",
      content:
        "Working with Baliyo Ventures was a game-changer for our business. Their team's technical prowess and commitment to excellence are unmatched.",
    },
    {
      name: "Michael Chen",
      role: "Product Manager, FutureTech",
      image: "/avatar.webp",
      content:
        "The team at Baliyo Ventures delivered beyond our expectations. Their innovative solutions and attention to detail set them apart.",
    },
  ];

  return (
    <section className="py-20 px-4 md:px-6 lg:px-8 bg-card">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-12">
          What Our <span className="text-primary">Clients Say</span>
        </h2>

        <Carousel className="w-full">
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <Card className="border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden">
                        <Image
                          src={testimonial.image}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold">{testimonial.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                    <p className="text-muted-foreground">
                      {testimonial.content}
                    </p>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
}
