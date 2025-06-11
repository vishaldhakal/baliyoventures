"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import React from "react";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navigationLinks = [
    { href: "/services", label: "Services" },
    { href: "/about", label: "About" },
    { href: "/research-and-development", label: "Research & Development" },
    { href: "/blogs", label: "Blogs" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header
      className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-[#00040C]/90 backdrop-blur-sm" : "bg-[#00040C]"
      } py-4 px-2`}
    >
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <div className="relative w-32 h-14">
            <Image
              src="/logo.svg"
              alt="Baliyo Ventures"
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center bg-[#161616] px-10 py-6 rounded-[40px]">
          <nav className="flex items-center space-x-4">
            {navigationLinks.map((link, index) => (
              <React.Fragment key={link.href}>
                <Link
                  href={link.href}
                  className="text-white font-medium hover:text-yellow-300 transition-colors"
                >
                  {link.label}
                </Link>
                {index < navigationLinks.length - 1 && (
                  <div className="w-1 h-1 bg-[#4D4D4D] rounded-full" />
                )}
              </React.Fragment>
            ))}
          </nav>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Menu className="h-6 w-6 text-white" />
            </SheetTrigger>
            <SheetContent
              side="right"
              className="bg-[#00040C] border-[#161616] p-0"
            >
              <nav className="flex flex-col mt-16">
                {navigationLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-white font-medium p-4 hover:bg-[#161616] transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="tel:+977 9861058990"
                  className="text-white font-medium p-4 hover:bg-[#161616] transition-colors"
                >
                  +977 9861058990
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Contact Button - Hidden on Mobile */}
        <Link href="tel:+977 9861058990" className="hidden md:block">
          <Button className="border border-yellow-300 bg-white/5 hover:bg-yellow-300 hover:text-black text-white rounded-[60px] px-6 h-12 transition-all duration-300">
            +977 9861058990
          </Button>
        </Link>
      </div>
    </header>
  );
};

export default Header;
