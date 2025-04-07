"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight } from "lucide-react";
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
import { useState } from "react";
import { postContactForm } from "@/services/contact.service";

const ContactHero = () => {
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState("");

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    console.log("Form submitted:", data);
    setLoading(true);

    try {
      await postContactForm(data);
      setNotification("Your message has been sent!");
      form.reset();
    } catch (error) {
      console.error("Error submitting form:", error);
      setNotification("There was an error sending your message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-[#00040C] py-8 md:py-16">
      <div className="container mx-auto px-4">
        {notification && <div className="text-green-500">{notification}</div>}

        <div className="flex flex-col md:flex-row justify-between items-start gap-16">
          {/* Contact Form */}
          <div className="w-full md:w-1/2 max-w-[564px] flex flex-col gap-6">
            <div className="mb-2">
              <h2 className="text-2xl font-bold text-white">Drop Us A Line</h2>
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
                        <FormLabel className="absolute -top-2 left-4 px-1 text-xs text-[#7D7D7D] group-focus-within:text-[#F0D100] bg-[#111111] z-10">
                          Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="John Abraham"
                            className="w-full bg-[#171717] border-[#6F6F6F] focus-visible:border-[#F0D100] focus-visible:ring-0 focus:ring-0 rounded-lg px-4 py-6 text-white"
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
                        <FormLabel className="absolute -top-2 left-4 px-1 text-xs text-[#7D7D7D] group-focus-within:text-[#F0D100] bg-[#111111] z-10">
                          Phone Number
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="+977 9800000000"
                            className="w-full bg-[#171717] border-[#6F6F6F] focus-visible:border-[#F0D100] focus-visible:ring-0 focus:ring-0 rounded-lg px-4 py-6 text-white"
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
                        <FormLabel className="absolute -top-2 left-4 px-1 text-xs text-[#7D7D7D] group-focus-within:text-[#F0D100] bg-[#111111] z-10">
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="johndoe@gmail.com"
                            className="w-full bg-[#171717] border-[#6F6F6F] focus-visible:border-[#F0D100] focus-visible:ring-0 focus:ring-0 rounded-lg px-4 py-6 text-white"
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
                        <FormLabel className="absolute -top-2 left-4 px-1 text-xs text-[#7D7D7D] group-focus-within:text-[#F0D100] bg-[#111111] z-10">
                          Message
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us about your project or query..."
                            className="w-full bg-[#171717] border-[#6F6F6F] focus-visible:border-[#F0D100] focus-visible:ring-0 focus:ring-0 rounded-lg px-4 py-6 text-white min-h-[105px]"
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
                  className={`bg-[#EBB51F] hover:bg-[#d9a71c] text-black font-bold py-6 rounded-md mt-4 flex items-center justify-center gap-2 w-full md:w-auto md:self-start cursor-pointer ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Message"}
                  {loading && <ArrowRight size={16} className="animate-spin" />}
                </Button>
              </form>
            </Form>
          </div>

          {/* Map Image */}
          <div className="w-full md:w-1/2 rounded-lg overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!4v1742466076446!6m8!1m7!1sCAoSLEFGMVFpcE1Cd2lUN1QyODRCODFVRWFXYmhOZXM2M0R1M2FSTmpLS0ZMTXgz!2m2!1d27.6817430889086!2d85.3285065497472!3f41.990502454161515!4f17.378424892324247!5f0.6600832241808038"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactHero;
