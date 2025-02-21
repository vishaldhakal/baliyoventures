import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

export default function ContactForm() {
  return (
    <section className="py-20 px-4 md:px-6 lg:px-8 bg-card">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Got any Project in <span className="text-primary">mind?</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Feel free to reach out to us for any inquiries or collaboration
              opportunities.
            </p>
          </div>
          <form className="space-y-6">
            <Input
              placeholder="Your Name"
              className="bg-background border-primary/20 focus-visible:border-primary"
            />
            <Input
              type="email"
              placeholder="Your Email"
              className="bg-background border-primary/20 focus-visible:border-primary"
            />
            <Textarea
              placeholder="Your Message"
              className="min-h-[120px] bg-background border-primary/20 focus-visible:border-primary"
            />
            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
