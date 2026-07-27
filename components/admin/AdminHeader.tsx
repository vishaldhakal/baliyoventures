"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  Bell,
  Sparkles,
  ShieldCheck,
  FolderGit2,
  Package,
  CalendarDays,
  FileText,
  X,
} from "lucide-react";
import Link from "next/link";

interface AdminHeaderProps {
  title?: string;
  subtitle?: string;
}

export default function AdminHeader({
  title = "Dashboard & R&D Control Center",
  subtitle = "Real-time analytics and management overview for Baliyo Ventures",
}: AdminHeaderProps) {
  const [showQuickModal, setShowQuickModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="sticky top-0 z-20 bg-[#030a1c]/85 backdrop-blur-xl border-b border-white/10 px-6 py-4 transition-all">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Title & Subtitle */}
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold font-saira text-white tracking-wide">
              {title}
            </h1>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Sync
            </span>
          </div>
          <p className="text-xs text-gray-400 font-sans mt-0.5">{subtitle}</p>
        </div>

        {/* Action Controls & Search */}
        <div className="flex items-center gap-3">
          {/* Global Search Input */}
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects, inventory, leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50 focus:ring-1 focus:ring-yellow-400/30 transition-all font-sans"
            />
          </div>

          {/* Quick Action Button */}
          <button
            onClick={() => setShowQuickModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-black text-xs font-bold font-saira hover:opacity-90 transition-all shadow-lg shadow-yellow-500/10 cursor-pointer shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>Quick Create</span>
          </button>

          {/* Notification Button */}
          <button className="relative p-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400"></span>
          </button>

          {/* Admin User Badge */}
          <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-white/10">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-yellow-400/20 to-amber-600/20 border border-yellow-400/30 flex items-center justify-center text-yellow-300 text-xs font-bold">
              BV
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-semibold text-white leading-none">
                Baliyo Admin
              </span>
              <span className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-emerald-400" /> Executive
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Popover Modal */}
      {showQuickModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#030a1c] border border-white/15 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4 relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-400" />
                <h3 className="text-base font-bold text-white font-saira">
                  Quick Create Shortcut
                </h3>
              </div>
              <button
                onClick={() => setShowQuickModal(false)}
                className="text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-gray-400">
              Select an action to launch creation workflow:
            </p>

            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/admin/projects"
                onClick={() => setShowQuickModal(false)}
                className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/5 border border-white/10 hover:border-yellow-400/50 hover:bg-yellow-400/10 transition-all text-center group cursor-pointer"
              >
                <FolderGit2 className="h-6 w-6 text-yellow-400 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-white font-saira">
                  New Project
                </span>
                <span className="text-[10px] text-gray-400">R&D & Engineering</span>
              </Link>

              <Link
                href="/admin/inventory"
                onClick={() => setShowQuickModal(false)}
                className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-400/50 hover:bg-emerald-400/10 transition-all text-center group cursor-pointer"
              >
                <Package className="h-6 w-6 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-white font-saira">
                  Log Purchase
                </span>
                <span className="text-[10px] text-gray-400">Hardware & Stock</span>
              </Link>

              <Link
                href="/admin/hr"
                onClick={() => setShowQuickModal(false)}
                className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-400/50 hover:bg-cyan-400/10 transition-all text-center group cursor-pointer"
              >
                <CalendarDays className="h-6 w-6 text-cyan-400 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-white font-saira">
                  Leave Form
                </span>
                <span className="text-[10px] text-gray-400">Team Requests</span>
              </Link>

              <Link
                href="/admin/content"
                onClick={() => setShowQuickModal(false)}
                className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/5 border border-white/10 hover:border-purple-400/50 hover:bg-purple-400/10 transition-all text-center group cursor-pointer"
              >
                <FileText className="h-6 w-6 text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-white font-saira">
                  Blog / Service
                </span>
                <span className="text-[10px] text-gray-400">Content Management</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
