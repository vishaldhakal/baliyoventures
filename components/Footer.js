import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const services = [
    { name: "Product Development", href: "#" },
    { name: "Baliyo Architecture", href: "#" },
    { name: "Baliyo Software", href: "#" },
    { name: "Baliyo Marketing", href: "#" },
  ];

  const socialLinks = [
    { name: "Facebook", href: "#" },
    { name: "Instagram", href: "#" },
    { name: "Linkedin", href: "#" },
  ];

  return (
    <footer className="bg-card text-foreground">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Logo and Description */}
          <div className="space-y-6">
            <Image
              src="/baliyo-logo.svg"
              alt="Baliyo Ventures"
              width={240}
              height={80}
              className="mb-6"
            />
            <p className="text-muted-foreground">
              Baliyo Ventures is a technology company that provides solutions to
              all your technology needs. We provide services like product
              development, architecture design, software development and
              marketing. We are a team of experienced professionals who are
              dedicated to provide you the best services.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xl font-semibold mb-6">
              Service by Baliyo Ventures
            </h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.name}>
                  <Link
                    href={service.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold mb-6">
              Contact Baliyo Ventures
            </h3>
            <div className="space-y-3 text-muted-foreground">
              <p>Baliyo Ventures Pvt. Ltd.</p>
              <p>Sankhamul, Lalitpur</p>
              <p>Office Hours · 10AM - 6 PM</p>
              <p>
                Phone:{" "}
                <Link
                  href="tel:9866316114"
                  className="hover:text-primary transition-colors"
                >
                  9866316114
                </Link>
              </p>
              <p>
                Email:{" "}
                <Link
                  href="mailto:baliyoventures@gmail.com"
                  className="hover:text-primary transition-colors"
                >
                  baliyoventures@gmail.com
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-16 pt-8 border-t border-muted">
          <p className="text-center text-muted-foreground">
            ©2023 Copyright{" "}
            <span className="font-semibold text-foreground">
              Baliyo Ventures Inc.
            </span>{" "}
            All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
