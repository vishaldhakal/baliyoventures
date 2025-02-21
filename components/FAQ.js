import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

export default function Faq() {
  const faqItems = [
    {
      question: "What services does Baliyo Ventures provide?",
      answer:
        "Baliyo Ventures offers a comprehensive range of technology services including software development, AI/ML solutions, cloud architecture, product development, and digital transformation consulting. We specialize in creating custom solutions tailored to our clients' specific needs.",
    },
    {
      question: "How do you ensure project quality and timely delivery?",
      answer:
        "We follow industry-standard agile methodologies with regular sprints and quality checks. Our development process includes thorough testing, code reviews, and continuous integration/deployment practices. We maintain transparent communication with clients through regular updates and project management tools.",
    },
    {
      question: "Can you handle large-scale enterprise projects?",
      answer:
        "Yes, we have extensive experience in handling enterprise-level projects. Our team has successfully delivered complex solutions for various industries, utilizing scalable architecture and best practices in security and performance optimization.",
    },
    {
      question: "Do you provide post-development support and maintenance?",
      answer:
        "Absolutely! We offer comprehensive post-development support and maintenance packages. This includes regular updates, bug fixes, performance monitoring, and technical support to ensure your solution continues to operate optimally.",
    },
    {
      question: "What technologies do you specialize in?",
      answer:
        "We specialize in modern web and mobile technologies including React, Next.js, Node.js, Python, and various cloud platforms. We also have expertise in emerging technologies like AI/ML, blockchain, and IoT solutions.",
    },
  ];

  return (
    <section className="py-20 px-4 md:px-6 lg:px-8 bg-card">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Frequently Asked <span className="text-primary">Questions</span>
        </h2>
        <p className="text-muted-foreground text-center mb-12">
          Find answers to common questions about our services and processes
        </p>

        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
