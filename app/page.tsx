import HomePageView from "@/components/HomePageView";
import { getServices } from "@/services/service.service";
import { Metadata } from "next";

const websiteSchema = {
  "@context": "https://schema.org/",
  "@type": "WebSite",
  name: "Baliyo Ventures",
  url: "https://baliyoventures.com",
  description:
    "Baliyo Ventures - Product Design & Development - Hardware & Software",
  image: "https://baliyoventures.com/aeee.jpg",
  sameAs: [
    "https://www.facebook.com/baliyoventures/",
    "https://www.instagram.com/baliyoventures/",
    "https://twitter.com/baliyoventures",
  ],
  potentialAction: {
    "@type": "SearchAction",
    target: "https://baliyoventures.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+977 9866316114",
    contactType: "customer support",
  },
  openingHours: "Mo-Su 09:00-18:00",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Sankhamul, Town Planning Cross-6",
    addressLocality: "Lalitpur",
    addressRegion: "NP",
    addressCountry: "NP",
  },
};

export const metadata: Metadata = {
  title: "Baliyo Ventures - Mechanical, Software & Electronics Technology",
  description:
    "Looking for a technology partner to design and develop your mechanical and software products? At Baliyo Ventures help businesses build their tech.",
  openGraph: {
    title: "Baliyo Ventures - Mechanical, Software & Electronics Technology",
    description:
      "Looking for a technology partner to design and develop your mechanical and software products? At Baliyo Ventures help businesses build their tech.",
    images: "/favicon.ico",
  },
};

export default async function HomePage() {
  const services = await getServices();
  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
      <HomePageView services={services} />
    </>
  );
}
