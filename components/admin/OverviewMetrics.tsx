"use client";

import {
  FolderGit2,
  Package,
  CalendarDays,
  Mail,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { DashboardOverviewStats } from "@/types/admin";

interface OverviewMetricsProps {
  stats: DashboardOverviewStats;
}

export default function OverviewMetrics({ stats }: OverviewMetricsProps) {
  const cards = [
    {
      title: "Active Projects & R&D",
      value: stats.totalProjects,
      subtitle: `${stats.inProgressProjects} In Progress • ${stats.completedProjects} Completed`,
      icon: FolderGit2,
      badge: "+12% this month",
      glowColor: "from-yellow-500/20 via-amber-500/10 to-transparent",
      borderColor: "border-yellow-500/30",
      iconColor: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
      detailPill: (
        <span className="flex items-center gap-1 text-[10px] font-medium text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
          <Clock className="h-3 w-3" /> {stats.inProgressProjects} Active R&D
        </span>
      ),
    },
    {
      title: "Hardware & Inventory Stock",
      value: stats.totalInventoryItems,
      subtitle: `Total Components in Warehouse`,
      icon: Package,
      badge: stats.lowStockItemsCount > 0 ? `${stats.lowStockItemsCount} Low Stock` : "Optimal Stock",
      glowColor: "from-emerald-500/20 via-teal-500/10 to-transparent",
      borderColor: "border-emerald-500/30",
      iconColor: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
      detailPill: stats.lowStockItemsCount > 0 ? (
        <span className="flex items-center gap-1 text-[10px] font-semibold text-rose-300 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
          <AlertTriangle className="h-3 w-3 text-rose-400" /> {stats.lowStockItemsCount} Need Reorder
        </span>
      ) : (
        <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-300 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20">
          <CheckCircle2 className="h-3 w-3" /> Stock Healthy
        </span>
      ),
    },
    {
      title: "Pending Leave Requests",
      value: stats.pendingLeavesCount,
      subtitle: "Employee Applications Awaiting Review",
      icon: CalendarDays,
      badge: "HR Workflow",
      glowColor: "from-cyan-500/20 via-blue-500/10 to-transparent",
      borderColor: "border-cyan-500/30",
      iconColor: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
      detailPill: (
        <span className="flex items-center gap-1 text-[10px] font-medium text-cyan-300 bg-cyan-400/10 px-2 py-0.5 rounded-full border border-cyan-400/20">
          <TrendingUp className="h-3 w-3" /> Requires Approval
        </span>
      ),
    },
    {
      title: "Inquiries & Client Leads",
      value: stats.totalContactsCount,
      subtitle: `${stats.baliyoVenturesLeads} Ventures • ${stats.baliyoTechLeads} Tech`,
      icon: Mail,
      badge: "High Growth",
      glowColor: "from-purple-500/20 via-indigo-500/10 to-transparent",
      borderColor: "border-purple-500/30",
      iconColor: "text-purple-400 bg-purple-400/10 border-purple-400/20",
      detailPill: (
        <span className="flex items-center gap-1 text-[10px] font-medium text-purple-300 bg-purple-400/10 px-2 py-0.5 rounded-full border border-purple-400/20">
          {stats.baliyoVenturesLeads} Vent / {stats.baliyoTechLeads} Tech
        </span>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={i}
            className={`relative overflow-hidden rounded-2xl bg-[#030a1c] border ${card.borderColor} p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-yellow-500/5 group`}
          >
            {/* Background Ambient Glow */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${card.glowColor} pointer-events-none`}
            />

            <div className="relative z-10 space-y-3">
              <div className="flex items-center justify-between">
                <div
                  className={`p-2.5 rounded-xl border ${card.iconColor} transition-transform group-hover:scale-110`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                {card.detailPill}
              </div>

              <div>
                <h3 className="text-2xl md:text-3xl font-extrabold text-white font-saira tracking-tight">
                  {card.value}
                </h3>
                <p className="text-xs font-semibold text-gray-300 mt-0.5 font-saira">
                  {card.title}
                </p>
                <p className="text-[11px] text-gray-400 mt-1 font-sans truncate">
                  {card.subtitle}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
