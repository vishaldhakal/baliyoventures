import Image from "next/image";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Github, Linkedin, Twitter } from "lucide-react";

export default function Team() {
  const teamMembers = [
    {
      name: "Rajesh Sharma",
      role: "CEO & Founder",
      image: "/team/1.jpg",
      bio: "Tech visionary with 10+ years of experience in software development and AI",
      social: {
        linkedin: "#",
        twitter: "#",
        github: "#",
      },
    },
    {
      name: "Priya Patel",
      role: "CTO",
      image: "/team/2.jpg",
      bio: "AI/ML expert specializing in computer vision and deep learning",
      social: {
        linkedin: "#",
        twitter: "#",
        github: "#",
      },
    },
    {
      name: "Alex Wong",
      role: "Lead Engineer",
      image: "/team/3.jpg",
      bio: "Full-stack developer with expertise in scalable cloud architectures",
      social: {
        linkedin: "#",
        twitter: "#",
        github: "#",
      },
    },
    {
      name: "Sarah Miller",
      role: "Product Manager",
      image: "/team/4.jpg",
      bio: "Product strategist focused on delivering innovative tech solutions",
      social: {
        linkedin: "#",
        twitter: "#",
        github: "#",
      },
    },
  ];

  return (
    <section className="py-20 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Meet Our <span className="text-primary">Team</span>
        </h2>
        <p className="text-muted-foreground mb-12 max-w-2xl">
          Our diverse team of experts brings together years of experience in
          technology, innovation, and business strategy.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <Card
              key={index}
              className="border-primary/20 hover:border-primary transition-colors"
            >
              <CardContent className="p-6">
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover rounded-full"
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold">{member.name}</h3>
                  <p className="text-primary font-medium mb-2">{member.role}</p>
                  <p className="text-muted-foreground text-sm mb-4">
                    {member.bio}
                  </p>
                  <div className="flex justify-center gap-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:text-primary"
                      asChild
                    >
                      <a
                        href={member.social.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Linkedin className="h-5 w-5" />
                        <span className="sr-only">LinkedIn</span>
                      </a>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:text-primary"
                      asChild
                    >
                      <a
                        href={member.social.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Twitter className="h-5 w-5" />
                        <span className="sr-only">Twitter</span>
                      </a>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:text-primary"
                      asChild
                    >
                      <a
                        href={member.social.github}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Github className="h-5 w-5" />
                        <span className="sr-only">GitHub</span>
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
