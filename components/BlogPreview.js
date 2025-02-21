import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import Image from "next/image";
import Link from "next/link";

export default function BlogPreview() {
  const blogPosts = [
    {
      title: "The Future of AI in Nepal's Tech Industry",
      excerpt:
        "Exploring how artificial intelligence is transforming Nepal's growing technology sector and creating new opportunities.",
      image: "/blog/ai-future.jpg",
      date: "March 15, 2024",
      category: "Artificial Intelligence",
      slug: "/blog/ai-future-nepal",
    },
    {
      title: "Building Scalable Cloud Solutions",
      excerpt:
        "Best practices and strategies for developing cloud-native applications that can scale effectively.",
      image: "/blog/cloud-scaling.jpg",
      date: "March 10, 2024",
      category: "Cloud Computing",
      slug: "/blog/scalable-cloud-solutions",
    },
    {
      title: "Innovation in Manufacturing Tech",
      excerpt:
        "How modern technology is revolutionizing manufacturing processes and improving efficiency.",
      image: "/blog/manufacturing-tech.jpg",
      date: "March 5, 2024",
      category: "Industry 4.0",
      slug: "/blog/manufacturing-innovation",
    },
  ];

  return (
    <section className="py-20 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">
            Latest <span className="text-primary">Insights</span>
          </h2>
          <Button
            variant="outline"
            className="border-primary text-primary hover:bg-primary/10"
            asChild
          >
            <Link href="/blog">View All Posts</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <Card
              key={index}
              className="border-primary/20 hover:border-primary transition-colors"
            >
              <Link href={post.slug}>
                <div className="relative h-48 w-full">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover rounded-t-lg"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex gap-2 mb-3">
                    <span className="text-xs text-primary font-medium">
                      {post.category}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {post.date}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground">{post.excerpt}</p>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
