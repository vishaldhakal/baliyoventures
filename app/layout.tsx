import type { Metadata } from "next";
import { Oxanium, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TopLoader from "nextjs-toploader";

const oxanium = Oxanium({
  variable: "--font-oxanium",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  authors: [{ name: "Baliyo Ventures", url: "https://baliyoventures.com" }],
  robots: {
    index: true,
    follow: true,
    noimageindex: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${oxanium.variable} ${inter.variable} antialiased`}>
        <TopLoader
          color="#ffff"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
        />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
