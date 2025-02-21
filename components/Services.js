import { Card, CardHeader, CardTitle, CardDescription } from "./ui/card";

export default function Services() {
  const services = [
    {
      title: "Product Development",
      description:
        "We develop innovative products that solve real-world problems",
    },
    {
      title: "Software Development",
      description: "Custom software solutions tailored to your needs",
    },
    {
      title: "Research & Development",
      description: "Cutting-edge research in AI and robotics",
    },
  ];

  return (
    <section className="py-20 px-4 md:px-6 lg:px-8 bg-card">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-12">
          Services & <span className="text-primary">Solutions</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card
              key={index}
              className="bg-background border-primary/20 hover:border-primary transition-colors"
            >
              <CardHeader>
                <CardTitle className="text-xl mb-2">{service.title}</CardTitle>
                <CardDescription className="text-muted-foreground">
                  {service.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
