"use client";

import { useState } from "react";
import OverviewMetrics from "@/components/admin/OverviewMetrics";
import AnalyticsCharts from "@/components/admin/AnalyticsCharts";
import {
  DashboardOverviewStats,
  InventoryItem,
  ProjectDailyUpdateRecord,
  ContactLead,
} from "@/types/admin";
import { LeaveFormRecord } from "@/services/leave.service";
import Link from "next/link";
import {
  FolderGit2,
  Package,
  CalendarDays,
  Mail,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from "lucide-react";

interface DashboardOverviewProps {
  stats: DashboardOverviewStats;
  inventoryItems: InventoryItem[];
  dailyUpdates: ProjectDailyUpdateRecord[];
  contactLeads: ContactLead[];
  leaveForms: LeaveFormRecord[];
}

export default function DashboardOverview({
  stats,
  inventoryItems,
  dailyUpdates,
  contactLeads,
  leaveForms,
}: DashboardOverviewProps) {
  const [activeTab, setActiveTab] = useState<"inventory" | "leaves" | "leads" | "updates">("inventory");

  const lowStock = inventoryItems.filter(
    (item) => item.quantity <= (item.min_threshold || 10)
  );

  return (
    <div className="space-y-8 pb-10">
      {/* Top Banner / Hero Welcome */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#07132f] via-[#030a1c] to-[#0d1f40] border border-white/15 p-6 md:p-8 shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -top-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-yellow-300 text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5" /> Baliyo Operations Engine
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white font-saira tracking-wide">
              Welcome back to Baliyo Control Center
            </h2>
            <p className="text-xs md:text-sm text-gray-300 max-w-2xl font-sans leading-relaxed">
              Real-time monitoring across R&D projects, warehouse inventory, employee leave requests, and high-priority lead submissions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/admin/projects"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-yellow-400 text-black text-xs font-bold font-saira hover:bg-yellow-300 transition-all shadow-lg shadow-yellow-500/10"
            >
              <FolderGit2 className="h-4 w-4" /> Manage Projects
            </Link>
            <Link
              href="/admin/inventory"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white text-xs font-bold font-saira hover:bg-white/20 transition-all"
            >
              <Package className="h-4 w-4" /> View Hardware Stock
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <OverviewMetrics stats={stats} />

      {/* Interactive Recharts Analytics Visualizer */}
      <AnalyticsCharts />

      {/* Quick Action Management Tabs */}
      <div className="rounded-2xl bg-[#030a1c] border border-white/10 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h3 className="text-base font-bold text-white font-saira">
              Quick Management Focus
            </h3>
            <p className="text-xs text-gray-400">
              Inspect entities requiring immediate admin review
            </p>
          </div>

          {/* Tabs header */}
          <div className="flex items-center gap-1.5 p-1 bg-white/5 border border-white/10 rounded-xl overflow-x-auto">
            <button
              onClick={() => setActiveTab("inventory")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold font-saira transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "inventory"
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Package className="h-3.5 w-3.5" /> Low Stock ({lowStock.length})
            </button>
            <button
              onClick={() => setActiveTab("leaves")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold font-saira transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "leaves"
                  ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <CalendarDays className="h-3.5 w-3.5" /> Leave Forms ({leaveForms.length})
            </button>
            <button
              onClick={() => setActiveTab("leads")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold font-saira transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "leads"
                  ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Mail className="h-3.5 w-3.5" /> Inquiries ({contactLeads.length})
            </button>
            <button
              onClick={() => setActiveTab("updates")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold font-saira transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "updates"
                  ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <FolderGit2 className="h-3.5 w-3.5" /> Engineering Logs ({dailyUpdates.length})
            </button>
          </div>
        </div>

        {/* Tab 1: Low Stock Items */}
        {activeTab === "inventory" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-300">
                Hardware Components at or below safety threshold
              </span>
              <Link
                href="/admin/inventory"
                className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1 font-saira"
              >
                Go to Inventory Manager <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-gray-400 uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Component Model</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Vendor</th>
                    <th className="py-3 px-4">Current Stock</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-gray-200">
                  {inventoryItems.slice(0, 5).map((item) => {
                    const isLow = item.quantity <= (item.min_threshold || 10);
                    return (
                      <tr key={item.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3 px-4 font-semibold text-white">
                          {item.model_name}
                        </td>
                        <td className="py-3 px-4 text-gray-400">
                          {item.component_name}
                        </td>
                        <td className="py-3 px-4 text-gray-400">
                          {item.vendor_name}
                        </td>
                        <td className="py-3 px-4 font-bold font-saira text-white">
                          {item.quantity} pcs
                        </td>
                        <td className="py-3 px-4">
                          {isLow ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30">
                              <AlertTriangle className="h-3 w-3" /> Reorder Needed
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                              <CheckCircle2 className="h-3 w-3" /> In Stock
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Leave Applications */}
        {activeTab === "leaves" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-300">
                Recent Leave Requests Submitted by Staff
              </span>
              <Link
                href="/admin/hr"
                className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1 font-saira"
              >
                Go to HR & Leave Manager <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-gray-400 uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Employee</th>
                    <th className="py-3 px-4">Leave Type</th>
                    <th className="py-3 px-4">Days</th>
                    <th className="py-3 px-4">Dates</th>
                    <th className="py-3 px-4">Approved By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-gray-200">
                  {leaveForms.slice(0, 5).map((leave, idx) => (
                    <tr key={idx} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 font-semibold text-white">
                        <div>{leave.employee_name}</div>
                        <div className="text-[10px] text-gray-400">{leave.employee_email}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="capitalize text-[10px] font-bold px-2 py-0.5 rounded-md bg-cyan-400/10 text-cyan-300 border border-cyan-400/20">
                          {leave.reason_of_leave} Leave
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold font-saira text-white">
                        {leave.days} Day(s)
                      </td>
                      <td className="py-3 px-4 text-gray-400">
                        {leave.leave_from_date} → {leave.leave_to_date}
                      </td>
                      <td className="py-3 px-4 text-gray-300 font-medium">
                        {leave.approved_by || "Pending"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Contact Leads */}
        {activeTab === "leads" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-300">
                Inquiries submitted via website contact form
              </span>
              <Link
                href="/admin/contacts"
                className="text-xs font-bold text-purple-400 hover:underline flex items-center gap-1 font-saira"
              >
                Go to Inquiry Inbox <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-gray-400 uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Sender</th>
                    <th className="py-3 px-4">Target Entity</th>
                    <th className="py-3 px-4">Message Snippet</th>
                    <th className="py-3 px-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-gray-200">
                  {contactLeads.slice(0, 5).map((lead) => (
                    <tr key={lead.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 font-semibold text-white">
                        <div>{lead.name}</div>
                        <div className="text-[10px] text-gray-400">{lead.email}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            lead.company === "baliyoventures"
                              ? "bg-yellow-400/10 text-yellow-300 border border-yellow-400/20"
                              : "bg-cyan-400/10 text-cyan-300 border border-cyan-400/20"
                          }`}
                        >
                          {lead.company}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-300 max-w-md truncate">
                        {lead.message}
                      </td>
                      <td className="py-3 px-4 text-gray-400">
                        {new Date(lead.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Engineering Logs */}
        {activeTab === "updates" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-300">
                Daily R&D engineering tasks, decisions, & blockers
              </span>
              <Link
                href="/admin/projects"
                className="text-xs font-bold text-yellow-400 hover:underline flex items-center gap-1 font-saira"
              >
                Go to Projects Control <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {dailyUpdates.map((update) => (
                <div
                  key={update.id}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2 hover:border-yellow-400/30 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-yellow-300 font-saira">
                      {update.project_title}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {new Date(update.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-200">{update.task}</p>
                  {update.decision && (
                    <div className="text-[11px] text-emerald-300 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                      <span className="font-bold">Decision:</span> {update.decision}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
