"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PlusIcon, MinusIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Faq } from "@/types/about";

interface FAQsProps {
  faqs: Faq[];
}

const FAQs: React.FC<FAQsProps> = ({ faqs }) => {
  return (
    <section className="py-24 bg-[#050505] relative overflow-hidden">
      {/* Yellow blur elements */}
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-yellow-300 rounded-full blur-[368px] opacity-20"></div>
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-yellow-300 rounded-full blur-[368px] opacity-20"></div>

      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-br from-yellow-300 to-[#FFFCCB] font-oxanium">
          Frequently Asked Questions
        </h2>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-none group"
              >
                <div
                  className="
                    bg-[#010714] border border-[#131B2C] 
                    group-data-[state=open]:border-yellow-300 
                    group-data-[state=open]:shadow-[0px_0px_10px_rgba(240,209,0,0.3)]
                    hover:border-yellow-300 rounded-lg shadow-md overflow-hidden 
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
                      <MinusIcon className="h-5 w-5 text-yellow-300 group-data-[state=closed]:hidden block" />
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
