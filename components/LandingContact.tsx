"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  contactFormSchema,
  type ContactFormValues,
} from "@/lib/schema/contact-form-schema";

const LandingContact = () => {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = (data: ContactFormValues) => {
    console.log("Form submitted:", data);
    // Add actual form submission logic here
  };

  return (
    <>
      <section className="bg-[#111111] py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-oxanium bg-gradient-to-br from-yellow-300 to-[#FFFCCB] bg-clip-text text-transparent">
              Want Help Building Your Next Big Idea?
            </h2>
            <p className="text-white opacity-80">
              Baliyo Ventures is here to help you build your next big idea.
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start gap-16">
            {/* Contact Form */}
            <div className="w-full md:w-1/2 max-w-[564px] flex flex-col gap-6">
              <div className="mb-2">
                <h2 className="text-2xl font-bold text-white">
                  Drop Us A Line
                </h2>
                <p className="text-white opacity-80">
                  Get in touch with us for any queries or support
                </p>
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col gap-4"
                >
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="relative group">
                          <FormLabel className="absolute -top-2 left-4 px-1 text-xs text-[#7D7D7D] group-focus-within:text-yellow-300 bg-[#111111] z-10">
                            Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="John Abraham"
                              className="w-full bg-[#171717] border-[#6F6F6F] focus-visible:border-yellow-300 focus-visible:ring-0 focus:ring-0 rounded-lg px-4 py-6 text-white"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-500 text-xs mt-1" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem className="relative group">
                          <FormLabel className="absolute -top-2 left-4 px-1 text-xs text-[#7D7D7D] group-focus-within:text-yellow-300 bg-[#111111] z-10">
                            Phone Number
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="+977 9800000000"
                              className="w-full bg-[#171717] border-[#6F6F6F] focus-visible:border-yellow-300 focus-visible:ring-0 focus:ring-0 rounded-lg px-4 py-6 text-white"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-500 text-xs mt-1" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="relative group">
                          <FormLabel className="absolute -top-2 left-4 px-1 text-xs text-[#7D7D7D] group-focus-within:text-yellow-300 bg-[#111111] z-10">
                            Email
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="johndoe@gmail.com"
                              className="w-full bg-[#171717] border-[#6F6F6F] focus-visible:border-yellow-300 focus-visible:ring-0 focus:ring-0 rounded-lg px-4 py-6 text-white"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-500 text-xs mt-1" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem className="relative group">
                          <FormLabel className="absolute -top-2 left-4 px-1 text-xs text-[#7D7D7D] group-focus-within:text-yellow-300 bg-[#111111] z-10">
                            Message
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us about your project or query..."
                              className="w-full bg-[#171717] border-[#6F6F6F] focus-visible:border-yellow-300 focus-visible:ring-0 focus:ring-0 rounded-lg px-4 py-6 text-white min-h-[105px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-500 text-xs mt-1" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="bg-[#EBB51F] hover:bg-[#d9a71c] text-black font-bold py-6 rounded-md mt-4 flex items-center justify-center gap-2 w-full md:w-auto md:self-start cursor-pointer"
                  >
                    Send Message
                    <ArrowRight size={16} />
                  </Button>
                </form>
              </Form>
            </div>

            {/* Illustration */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-6">
              <Image
                src="/images/typing-illustration.svg"
                alt="Contact illustration"
                width={500}
                height={400}
                className="w-full max-w-[500px] h-auto"
              />
            </div>
          </div>
        </div>
      </section>
      <div className="relative h-[119px] w-full">
        <Image
          src="/images/footer.png"
          alt="Baliyo Ventures Footer"
          fill
          className="object-cover h-40 bg-[#111111] w-full"
        />
      </div>
    </>
  );
};

export default LandingContact;
