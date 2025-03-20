import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Youtube,
  Instagram,
  Facebook,
  Twitter,
} from "lucide-react";

const ContactMap = () => {
  return (
    <section className="relative bg-gradient-to-b from-[#010714] to-[#020917] py-20 overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-[#EBB51F]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-[#EBB51F]/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#EBB51F]/3 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-wider">
            Get in Touch
          </h2>
          <div className="w-24 h-1 bg-[#EBB51F] mx-auto rounded-full" />
        </div>

        <div className="flex flex-col md:flex-row justify-center items-start md:items-center gap-8 md:gap-16 pb-16">
          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 lg:gap-16 max-w-[1000px] w-full">
            {/* Phone Contact */}
            <div className="group flex flex-col items-center transform transition-all duration-500 hover:translate-y-[-8px]">
              <div className="relative">
                <div className="absolute inset-0 bg-[#EBB51F]/20 rounded-full blur group-hover:blur-xl transition-all duration-500" />
                <div className="bg-gradient-to-br from-[#EBB51F] to-[#F0D100] p-4 rounded-full mb-5 w-16 h-16 flex items-center justify-center shadow-lg shadow-[#EBB51F]/20 group-hover:shadow-[#EBB51F]/40 transition-all duration-500 relative">
                  <Phone
                    size={28}
                    className="text-white transform group-hover:rotate-12 transition-transform duration-300"
                  />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 tracking-wide">
                Phone
              </h3>
              <div className="text-center">
                <Link
                  href="tel:+977-9866316114"
                  className="text-gray-300 hover:text-[#F0D100] transition-colors duration-300 text-lg relative group-hover:underline decoration-[#EBB51F]/30 underline-offset-4"
                >
                  +977-9866316114
                </Link>
              </div>
            </div>

            {/* Email Contact */}
            <div className="group flex flex-col items-center transform transition-all duration-500 hover:translate-y-[-8px]">
              <div className="relative">
                <div className="absolute inset-0 bg-[#EBB51F]/20 rounded-full blur group-hover:blur-xl transition-all duration-500" />
                <div className="bg-gradient-to-br from-[#EBB51F] to-[#F0D100] p-4 rounded-full mb-5 w-16 h-16 flex items-center justify-center shadow-lg shadow-[#EBB51F]/20 group-hover:shadow-[#EBB51F]/40 transition-all duration-500 relative">
                  <Mail
                    size={28}
                    className="text-white transform group-hover:rotate-12 transition-transform duration-300"
                  />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 tracking-wide">
                Email
              </h3>
              <Link
                href="mailto:baliyoventures@gmail.com"
                className="text-gray-300 hover:text-[#F0D100] transition-colors duration-300 text-lg relative group-hover:underline decoration-[#EBB51F]/30 underline-offset-4"
              >
                baliyoventures@gmail.com
              </Link>
            </div>

            {/* Address Contact */}
            <div className="group flex flex-col items-center transform transition-all duration-500 hover:translate-y-[-8px] md:col-span-2 lg:col-span-1">
              <div className="relative">
                <div className="absolute inset-0 bg-[#EBB51F]/20 rounded-full blur group-hover:blur-xl transition-all duration-500" />
                <div className="bg-gradient-to-br from-[#EBB51F] to-[#F0D100] p-4 rounded-full mb-5 w-16 h-16 flex items-center justify-center shadow-lg shadow-[#EBB51F]/20 group-hover:shadow-[#EBB51F]/40 transition-all duration-500 relative">
                  <MapPin
                    size={28}
                    className="text-white transform group-hover:rotate-12 transition-transform duration-300"
                  />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 tracking-wide">
                Address
              </h3>
              <p className="text-gray-300 text-center text-lg">
                Sankhamul-6, Lalitpur, Nepal
              </p>
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="flex flex-col items-center justify-center mt-8">
          <h4 className="text-2xl font-semibold mb-8 tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-[#EBB51F] to-[#F0D100]">
            Connect With Us
          </h4>
          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            <Link href="#" className="relative group">
              <div className="absolute inset-0 bg-[#EBB51F]/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="bg-[#00040C] border-2 border-[#7D7D7D] rounded-full w-16 h-16 flex items-center justify-center transform transition-all duration-500 hover:scale-110 hover:border-[#EBB51F] hover:bg-[#EBB51F]/10 relative">
                <Youtube
                  size={28}
                  className="text-[#7D7D7D] group-hover:text-[#EBB51F] transition-colors duration-500"
                />
              </div>
            </Link>
            <Link href="#" className="relative group">
              <div className="absolute inset-0 bg-[#EBB51F]/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="bg-[#00040C] border-2 border-[#7D7D7D] rounded-full w-16 h-16 flex items-center justify-center transform transition-all duration-500 hover:scale-110 hover:border-[#EBB51F] hover:bg-[#EBB51F]/10 relative">
                <Instagram
                  size={28}
                  className="text-[#7D7D7D] group-hover:text-[#EBB51F] transition-colors duration-500"
                />
              </div>
            </Link>
            <Link href="#" className="relative group">
              <div className="absolute inset-0 bg-[#EBB51F]/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="bg-[#00040C] border-2 border-[#7D7D7D] rounded-full w-16 h-16 flex items-center justify-center transform transition-all duration-500 hover:scale-110 hover:border-[#EBB51F] hover:bg-[#EBB51F]/10 relative">
                <Facebook
                  size={28}
                  className="text-[#7D7D7D] group-hover:text-[#EBB51F] transition-colors duration-500"
                />
              </div>
            </Link>
            <Link href="#" className="relative group">
              <div className="absolute inset-0 bg-[#EBB51F]/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="bg-[#00040C] border-2 border-[#7D7D7D] rounded-full w-16 h-16 flex items-center justify-center transform transition-all duration-500 hover:scale-110 hover:border-[#EBB51F] hover:bg-[#EBB51F]/10 relative">
                <Twitter
                  size={28}
                  className="text-[#7D7D7D] group-hover:text-[#EBB51F] transition-colors duration-500"
                />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactMap;
