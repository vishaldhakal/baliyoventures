"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PlusIcon, MinusIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQs = () => {
  // FAQ data for Baliyo Ventures
  const faqData = [
    {
      question: "What services does Baliyo Ventures offer?",
      answer:
        "Baliyo Ventures offers a comprehensive range of technology solutions including product design, architecture design, software development, and research & development. We specialize in creating tailored digital solutions that help businesses innovate, grow, and succeed in today's competitive landscape.",
    },
    {
      question: "How does Baliyo Ventures approach new projects?",
      answer:
        "We follow a collaborative and strategic approach to every project. Our process begins with understanding your business goals and challenges, followed by a detailed planning phase. We then develop customized solutions, implement them with rigorous quality assurance, and provide ongoing support and maintenance to ensure long-term success.",
    },
    {
      question: "What industries does Baliyo Ventures work with?",
      answer:
        "Baliyo Ventures works with a diverse range of industries including healthcare, finance, education, retail, and manufacturing. Our solutions are adaptable to various sectors, and we have experience delivering successful projects across different business domains.",
    },
    {
      question: "How long does a typical project take to complete?",
      answer:
        "Project timelines vary depending on scope, complexity, and specific requirements. Small to medium projects typically take 2-4 months, while larger enterprise solutions may require 6+ months. During our initial consultation, we provide a detailed timeline based on your project specifications.",
    },
    {
      question:
        "Does Baliyo Ventures offer ongoing support after project completion?",
      answer:
        "Yes, we offer comprehensive post-deployment support and maintenance services. We believe in building long-term relationships with our clients, and our support packages include regular updates, performance monitoring, security patches, and technical assistance to ensure your solution continues to perform optimally.",
    },
  ];

  return (
    <section className="py-24 bg-[#050505] relative overflow-hidden">
      {/* Yellow blur elements */}
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-[#F0D100] rounded-full blur-[368px] opacity-20"></div>
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-[#F0D100] rounded-full blur-[368px] opacity-20"></div>

      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-br from-[#F0D100] to-[#FFFCCB] font-oxanium">
          Frequently Asked Questions
        </h2>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqData.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-none group"
              >
                <div
                  className="
                    bg-[#010714] border border-[#131B2C] 
                    group-data-[state=open]:border-[#F0D100] 
                    group-data-[state=open]:shadow-[0px_0px_10px_rgba(240,209,0,0.3)]
                    hover:border-[#F0D100] rounded-lg shadow-md overflow-hidden 
                    transition-all duration-300
                  "
                >
                  <AccordionTrigger
                    className={cn(
                      "px-6 py-5 flex justify-between text-white hover:no-underline font-medium text-lg",
                      "[&>svg]:hidden" // Hide the default chevron icon
                    )}
                  >
                    <span>{faq.question}</span>
                    <div className="flex items-center justify-center">
                      <PlusIcon className="h-5 w-5 text-gray-400 group-data-[state=open]:hidden block" />
                      <MinusIcon className="h-5 w-5 text-[#F0D100] group-data-[state=closed]:hidden block" />
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-5 text-gray-400 text-base leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </div>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQs;
