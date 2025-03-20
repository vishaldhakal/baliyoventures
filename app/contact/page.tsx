import { Metadata } from "next";
import ContactPageView from "@/components/ContactPageView";

export const metadata: Metadata = {
  title: "Contact Us - Baliyo Ventures",
  description:
    "Get in touch with Baliyo Ventures for any queries or support. We're here to help you with all your technology needs.",
};

export default function ContactPage() {
  return <ContactPageView />;
}
