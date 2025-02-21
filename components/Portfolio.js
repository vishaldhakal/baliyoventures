import { Card, CardContent } from "./ui/card";
import Image from "next/image";

export default function Portfolio() {
  const projects = [
    { name: "Yachu", image: "/baliyoadvantage/1.jpeg" },
    { name: "Birat Expo", image: "/baliyoadvantage/2.jpeg" },
    { name: "Battle", image: "/baliyoadvantage/3.jpeg" },
  ];

  return (
    <section className="py-20 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-12">
          Innovations we <span className="text-primary">Delivered</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <Card
              key={index}
              className="overflow-hidden bg-card border-primary/20 group hover:border-primary transition-all"
            >
              <CardContent className="p-0">
                <div className="relative h-64">
                  <Image
                    src={project.image}
                    alt={project.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
