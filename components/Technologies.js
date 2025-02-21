import { Card, CardContent } from "./ui/card";
import Image from "next/image";

export default function Technologies() {
  const technologies = [
    {
      category: "Frontend",
      items: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
      icon: "/tech/frontend.svg",
    },
    {
      category: "Backend",
      items: ["Node.js", "Python", "Django", "PostgreSQL"],
      icon: "/tech/backend.svg",
    },
    {
      category: "Cloud & DevOps",
      items: ["AWS", "Docker", "Kubernetes", "CI/CD"],
      icon: "/tech/cloud.svg",
    },
    {
      category: "AI & ML",
      items: ["TensorFlow", "PyTorch", "Computer Vision", "NLP"],
      icon: "/tech/ai.svg",
    },
  ];

  return (
    <section className="py-20 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-12">
          Our <span className="text-primary">Tech Stack</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {technologies.map((tech, index) => (
            <Card
              key={index}
              className="border-primary/20 hover:border-primary transition-colors"
            >
              <CardContent className="p-6">
                <div className="relative w-12 h-12 mb-4">
                  <Image
                    src={tech.icon}
                    alt={tech.category}
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-4">{tech.category}</h3>
                <ul className="space-y-2">
                  {tech.items.map((item, i) => (
                    <li key={i} className="text-muted-foreground">
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
