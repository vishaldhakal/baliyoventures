import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <div>
      <footer className="bg-[#1D1D1D] text-white pt-6 pb-16 shadow-[0px_16px_48px_0px_rgba(0,0,0,0.18)]">
        <div className="container mx-auto px-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-6">
            {/* Company Info */}
            <div className="space-y-4">
              <Link href="/" className="block relative w-48 h-24 mb-4">
                <Image
                  src="/logo.svg"
                  alt="Baliyo Ventures"
                  fill
                  className="object-contain"
                />
              </Link>
              <p className="text-[#D6DADE] text-sm leading-loose">
                Baliyo Ventures is a technology company that provides solutions
                to all your technology needs. We provide services like product
                development, architecture design, software development and
                marketing. We are a team of experienced professionals who are
                dedicated to provide you the best services.
              </p>
              <div className="flex space-x-4">
                <Link
                  href="/"
                  className="text-white hover:text-[#F0D100] transition flex items-center gap-1"
                >
                  <Facebook size={16} />
                  <span>Facebook</span>
                </Link>
                <Link
                  href="/"
                  className="text-white hover:text-[#F0D100] transition flex items-center gap-1"
                >
                  <Instagram size={16} />
                  <span>Instagram</span>
                </Link>
                <Link
                  href="/"
                  className="text-white hover:text-[#F0D100] transition flex items-center gap-1"
                >
                  <Linkedin size={16} />
                  <span>Linkedin</span>
                </Link>
              </div>
            </div>

            {/* Services */}
            <div className="space-y-4">
              <h4 className="text-lg font-bold mb-3">
                Service by Baliyo Ventures
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/"
                    className="text-white hover:text-[#F0D100] transition"
                  >
                    Product Development
                  </Link>
                </li>
                <li>
                  <Link
                    href="/"
                    className="text-white hover:text-[#F0D100] transition"
                  >
                    Baliyo Architecture
                  </Link>
                </li>
                <li>
                  <Link
                    href="/"
                    className="text-white hover:text-[#F0D100] transition"
                  >
                    Baliyo Software
                  </Link>
                </li>
                <li>
                  <Link
                    href="/"
                    className="text-white hover:text-[#F0D100] transition"
                  >
                    Baliyo Marketing
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h4 className="text-lg font-bold mb-3">
                Contact Baliyo Ventures
              </h4>
              <p className="text-[#D6DADE] text-sm leading-relaxed">
                Baliyo Ventures Pvt. Ltd.
              </p>
              <p className="text-[#D6DADE] text-sm leading-relaxed">
                Sankhamul, Lalitpur
              </p>
              <p className="text-[#D6DADE] text-sm leading-relaxed">
                Office Hours ⋅ 10AM - 6 PM
              </p>
              <div className="flex items-center">
                <span className="text-[#D6DADE] font-bold text-sm">
                  Phone:{" "}
                </span>
                <Link
                  href="tel:9866316114"
                  className="text-white hover:text-[#F0D100] ml-1 text-sm transition"
                >
                  9866316114
                </Link>
              </div>
              <div className="flex items-center">
                <span className="text-[#D6DADE] font-bold text-sm">
                  Email:{" "}
                </span>
                <Link
                  href="mailto:baliyoventures@gmail.com"
                  className="text-white hover:text-[#F0D100] ml-1 text-sm transition"
                >
                  baliyoventures@gmail.com
                </Link>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-[#333] pt-6 text-center text-[#D6DADE] text-sm">
            <p className="flex justify-center items-center gap-1">
              <span>©2023 Copyright</span>
              <span className="font-bold">Baliyo Ventures Inc.</span>
              <span>All Rights Reserved</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
