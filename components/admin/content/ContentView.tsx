"use client";

import { useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import {
  FileText,
  Sparkles,
  Layers,
  Image as ImageIcon,
  HelpCircle,
  Plus,
  Search,
  ExternalLink,
  Edit,
  Trash2,
} from "lucide-react";

export default function ContentView() {
  const [activeTab, setActiveTab] = useState<"services" | "blogs" | "partners" | "faqs">("services");

  const mockServices = [
    { id: 1, title: "Product Development & Prototyping", slug: "product-development", short: "End-to-end hardware & firmware design" },
    { id: 2, title: "Custom IoT Hardware & Embedded Systems", slug: "iot-hardware", short: "Microcontroller circuit design & telemetry" },
    { id: 3, title: "AI & Machine Learning Vision Solutions", slug: "ai-vision", short: "Edge AI vision model deployment" },
  ];

  const mockBlogs = [
    { id: 1, title: "Building High Reliability IoT Devices in Nepal", category: "Hardware", created: "2026-07-20" },
    { id: 2, title: "Next-Gen Solar Microgrid Automation", category: "Clean Energy", created: "2026-07-15" },
  ];

  const mockPartners = [
    { id: 1, title: "Texel Tech Supplies", url: "https://texel.com.np" },
    { id: 2, title: "Sunlight Energy Systems", url: "https://sunlight.com.np" },
  ];

  return (
    <div className="space-y-6 pb-12">
      <AdminHeader
        title="Content & Marketing Manager"
        subtitle="Manage website services, engineering blog articles, partner logos, and FAQs"
      />

      {/* Main Tab Container */}
      <div className="rounded-2xl bg-[#030a1c] border border-white/10 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("services")}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-saira transition-all cursor-pointer ${
                activeTab === "services"
                  ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Services ({mockServices.length})
            </button>
            <button
              onClick={() => setActiveTab("blogs")}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-saira transition-all cursor-pointer ${
                activeTab === "blogs"
                  ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Blogs ({mockBlogs.length})
            </button>
            <button
              onClick={() => setActiveTab("partners")}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-saira transition-all cursor-pointer ${
                activeTab === "partners"
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Partners ({mockPartners.length})
            </button>
          </div>

          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-400 text-black text-xs font-bold font-saira hover:bg-yellow-300 transition-all cursor-pointer">
            <Plus className="h-4 w-4" /> Add New Entry
          </button>
        </div>

        {/* Tab 1: Services */}
        {activeTab === "services" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mockServices.map((s) => (
              <div
                key={s.id}
                className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3 hover:border-yellow-400/40 transition-all"
              >
                <h4 className="text-sm font-bold text-white font-saira">{s.title}</h4>
                <p className="text-xs text-gray-400">{s.short}</p>
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <span className="text-[10px] text-yellow-300 font-mono">/{s.slug}</span>
                  <div className="flex items-center gap-2">
                    <button className="text-gray-400 hover:text-white cursor-pointer"><Edit className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Blogs */}
        {activeTab === "blogs" && (
          <div className="space-y-3">
            {mockBlogs.map((b) => (
              <div
                key={b.id}
                className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between hover:border-purple-400/40 transition-all"
              >
                <div>
                  <h4 className="text-sm font-bold text-white font-saira">{b.title}</h4>
                  <span className="text-[10px] text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-500/20 mt-1 inline-block">
                    {b.category}
                  </span>
                </div>
                <span className="text-xs text-gray-400">{b.created}</span>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Partners */}
        {activeTab === "partners" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockPartners.map((p) => (
              <div
                key={p.id}
                className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between"
              >
                <div>
                  <h4 className="text-sm font-bold text-white font-saira">{p.title}</h4>
                  <a href={p.url} target="_blank" className="text-xs text-emerald-400 hover:underline flex items-center gap-1 mt-0.5">
                    {p.url} <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
