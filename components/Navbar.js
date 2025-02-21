"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import MobileNav from "./MobileNav";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Services", href: "/services" },
    { name: "About", href: "/about" },
    { name: "Research & Development", href: "/research" },
    { name: "Blogs", href: "/blogs" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/40">
      <nav className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/baliyo-logo.svg"
            alt="Baliyo Ventures"
            width={120}
            height={50}
            priority
          />
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Sign Up Button */}
        <Button
          variant="outline"
          className="hidden md:flex border-primary text-primary hover:text-background relative overflow-hidden transition-colors group rounded-full"
        >
          <span className="relative z-10">Signup</span>
          <span className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-500 transform scale-0 rounded-full transition-transform duration-1000 origin-center group-hover:scale-[400%]"></span>
        </Button>

        <MobileNav />
      </nav>
    </header>
  );
}
