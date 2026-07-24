"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  FolderGit2,
  CalendarDays,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Loader2,
} from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      const res = await fetch("/api/admin/logout", {
        method: "POST",
      });
      if (res.ok) {
        router.push("/admin/login");
        router.refresh();
      }
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setLoggingOut(false);
    }
  };

  const navItems = [
    {
      name: "Projects",
      href: "/admin",
      icon: FolderGit2,
      active: pathname === "/admin",
    },
  ];

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden w-full bg-[#030a1c] border-b border-white/10 px-6 py-4 flex items-center justify-between z-20">
        <Link href="/admin" className="relative w-32 h-10">
          <Image
            src="/logo.svg"
            alt="Baliyo Ventures"
            fill
            className="object-contain"
          />
        </Link>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-[#FCE8C6] hover:text-white transition-colors cursor-pointer"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 transition-transform duration-300 ease-in-out z-30 w-64 bg-[#030a1c] border-r border-white/10 flex flex-col justify-between h-full min-h-screen shrink-0`}
      >
        <div>
          {/* Header & Logo */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <Link href="/admin" className="relative w-40 h-12 block">
              <Image
                src="/logo.svg"
                alt="Baliyo Ventures"
                fill
                className="object-contain"
                priority
              />
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="md:hidden text-[#FCE8C6] hover:text-white cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="px-6 py-4">
            <span className="text-[10px] font-bold text-gray-500     block mb-4">
              Admin Menu
            </span>
            <nav className="space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all group font-saira ${
                      item.active
                        ? "bg-gradient-to-r from-yellow-300/10 to-[#FFFCCB]/5 text-yellow-300 border-l-2 border-yellow-300"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon
                      className={`h-4.5 w-4.5 shrink-0 ${
                        item.active
                          ? "text-yellow-300"
                          : "text-gray-400 group-hover:text-white"
                      }`}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Footer Section */}
        <div className="p-4 border-t border-white/10 space-y-2">
          {/* Back to site */}

          {/* User info */}
          <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/5 flex flex-col">
            <span className="text-[10px] ">Logged In</span>
            <span className="text-xs text-gray-300 font-medium truncate">
              baliyoventures@gmail.com
            </span>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-400 hover:text-red-300 hover:bg-red-950/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-saira"
          >
            {loggingOut ? (
              <Loader2 className="h-4.5 w-4.5 shrink-0 animate-spin text-red-400" />
            ) : (
              <LogOut className="h-4.5 w-4.5 shrink-0 text-red-400" />
            )}
            {loggingOut ? "Signing Out..." : "Logout"}
          </button>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-10 md:hidden"
        />
      )}
    </>
  );
}
