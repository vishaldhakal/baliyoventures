export default function Stats() {
  const stats = [
    { number: "2+", label: "Years of Experience" },
    { number: "11+", label: "Satisfied Partners" },
    { number: "100+", label: "Projects Launched" },
    { number: "50+", label: "Services Listed" },
  ];

  return (
    <section className="py-20 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-6 bg-card rounded-lg">
              <h3 className="text-4xl font-bold mb-2 text-primary">
                {stat.number}
              </h3>
              <p className="text-muted-foreground font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
