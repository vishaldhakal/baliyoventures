"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";
import Header from "./Header";

const EXCLUDED_PATHS = ["/leave-form", "/admin", "/create-project-order"];

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showHeaderFooter = !EXCLUDED_PATHS.some((path) =>
    pathname.startsWith(path)
  );

  return (
    <>
      {showHeaderFooter && <Header />}
      <main>{children}</main>
      {showHeaderFooter && <Footer />}
    </>
  );
}
