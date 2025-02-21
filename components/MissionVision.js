import Image from "next/image";
import { Card, CardContent } from "./ui/card";
import { Rocket, Lightbulb, Target } from "lucide-react";

export default function MissionVision() {
  const items = [
    {
      title: "OUR MISSION",
      description:
        "To empower businesses through innovative technology solutions, fostering growth and digital transformation while maintaining the highest standards of quality and client satisfaction.",
      icon: Rocket,
    },
    {
      title: "OUR VISION",
      description:
        "To be the leading technology partner for businesses worldwide, recognized for our innovative solutions, technical excellence, and unwavering commitment to client success.",
      icon: Lightbulb,
    },
    {
      title: "OUR VALUES",
      description:
        "Embracing Innovation, Development, ensuring Excellence, Integrity, and Client-Centricity – pushing boundaries, maintaining high standards, acting ethically, and prioritizing client success.",
      icon: Target,
    },
  ];

  return (
    <section className="py-20 px-4 md:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <Card
              key={index}
              className="bg-card/50 border-primary/20 hover:border-primary transition-colors overflow-hidden"
            >
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  {/* Icon */}
                  <div className="mb-4">
                    <item.icon className="h-8 w-8 text-primary" />
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-primary mb-4">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
