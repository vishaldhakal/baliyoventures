"use client";

import {
  Building2,
  Clock,
  Cpu,
  ExternalLink,
  FolderGit2,
  Loader2,
  LogOut,
  Menu,
  Package,
  ShoppingCart,
  Wrench,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

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
      name: "Daily Project Logs",
      href: "/admin/daily-logs",
      icon: Clock,
      active: pathname.startsWith("/admin/daily-logs"),
    },
    {
      name: "Projects",
      href: "/admin",
      icon: FolderGit2,
      active: pathname === "/admin" || pathname.startsWith("/admin/projects"),
    },
    {
      name: "Inventory",
      href: "/admin/inventory",
      icon: Package,
      active: pathname.startsWith("/admin/inventory"),
    },
    {
      name: "Components & Models",
      href: "/admin/components",
      icon: Cpu,
      active: pathname.startsWith("/admin/components"),
    },
    {
      name: "Purchases",
      href: "/admin/purchases",
      icon: ShoppingCart,
      active: pathname.startsWith("/admin/purchases"),
    },
    {
      name: "Vendors",
      href: "/admin/vendors",
      icon: Building2,
      active: pathname.startsWith("/admin/vendors"),
    },
    {
      name: "Tools",
      href: "/admin/tools",
      icon: Wrench,
      active: pathname.startsWith("/admin/tools"),
    },
  ];

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden w-full bg-black border-b border-slate-800 px-6 py-4 flex items-center justify-between z-20">
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
          className="text-white hover:text-slate-300 transition-colors cursor-pointer"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 transition-transform duration-300 ease-in-out z-30 w-64 bg-white border-r border-slate-200 flex flex-col justify-between h-full min-h-screen shrink-0 shadow-sm`}
      >
        <div>
          {/* Header & Logo with Black Background */}
          <div className="p-6 bg-black border-b border-slate-800 flex items-center justify-between">
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
              className="md:hidden text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="px-4 py-4">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-sans">
                Product Management
              </span>

            </div>

            <nav className="space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition-all group font-sans ${
                      item.active
                        ? "bg-white text-slate-900 border border-slate-200 shadow-xs font-bold ring-1 ring-slate-900/5"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    <Icon
                      className={`h-4.5 w-4.5 shrink-0 transition-transform ${
                        item.active ? "text-slate-900" : "text-slate-400 group-hover:text-slate-700"
                      }`}
                    />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Footer Section */}
        <div className="p-4 border-t border-slate-200 space-y-2">
          {/* Main Website Link */}
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all font-sans"
          >
            <span>Main Website</span>
            <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
          </Link>

          {/* User info */}
          <div className="px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 flex flex-col font-sans">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">
              Logged In
            </span>
            <span className="text-xs text-slate-700 font-medium truncate mt-0.5">
              baliyoventures@gmail.com
            </span>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-sans border border-rose-200"
          >
            {loggingOut ? (
              <Loader2 className="h-4 w-4 shrink-0 animate-spin text-rose-600" />
            ) : (
              <LogOut className="h-4 w-4 shrink-0 text-rose-600" />
            )}
            {loggingOut ? "Signing Out..." : "Sign Out"}
          </button>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-10 md:hidden"
        />
      )}
    </>
  );
}
