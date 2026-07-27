"use client";

import { useState } from "react";
import { ContactLead } from "@/types/admin";
import AdminHeader from "@/components/admin/AdminHeader";
import {
  Mail,
  Building2,
  Search,
  Calendar,
  User,
  Phone,
  MessageSquare,
  Sparkles,
  X,
  ExternalLink,
} from "lucide-react";

interface ContactsViewProps {
  contactLeads: ContactLead[];
}

export default function ContactsView({ contactLeads }: ContactsViewProps) {
  const [selectedCompany, setSelectedCompany] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [activeLead, setActiveLead] = useState<ContactLead | null>(null);

  const filteredLeads = contactLeads.filter((item) => {
    const matchesCompany =
      selectedCompany === "all" ? true : item.company === selectedCompany;
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.email.toLowerCase().includes(search.toLowerCase()) ||
      item.message.toLowerCase().includes(search.toLowerCase());
    return matchesCompany && matchesSearch;
  });

  const venturesCount = contactLeads.filter((c) => c.company === "baliyoventures").length;
  const techCount = contactLeads.filter((c) => c.company === "baliyotechnologies").length;

  return (
    <div className="space-y-6 pb-12">
      <AdminHeader
        title="Client Inquiries & Contact Leads"
        subtitle="Manage website form submissions for Baliyo Ventures & Baliyo Technologies"
      />

      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-[#030a1c] border border-purple-500/20 p-5 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400 font-medium">Total Inquiries Received</span>
            <h3 className="text-2xl font-bold text-purple-400 font-saira mt-1">
              {contactLeads.length} Messages
            </h3>
          </div>
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Mail className="h-6 w-6" />
          </div>
        </div>

        <div className="rounded-2xl bg-[#030a1c] border border-amber-500/20 p-5 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400 font-medium">Baliyo Ventures</span>
            <h3 className="text-2xl font-bold text-yellow-300 font-saira mt-1">
              {venturesCount} Submissions
            </h3>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 text-yellow-400 border border-amber-500/20">
            <Building2 className="h-6 w-6" />
          </div>
        </div>

        <div className="rounded-2xl bg-[#030a1c] border border-cyan-500/20 p-5 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400 font-medium">Baliyo Technologies</span>
            <h3 className="text-2xl font-bold text-cyan-400 font-saira mt-1">
              {techCount} Submissions
            </h3>
          </div>
          <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Building2 className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="rounded-2xl bg-[#030a1c] border border-white/10 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedCompany("all")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-saira transition-all cursor-pointer ${
                selectedCompany === "all"
                  ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              All Inquiries ({contactLeads.length})
            </button>
            <button
              onClick={() => setSelectedCompany("baliyoventures")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-saira transition-all cursor-pointer ${
                selectedCompany === "baliyoventures"
                  ? "bg-amber-500/20 text-yellow-300 border border-amber-500/30"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Ventures ({venturesCount})
            </button>
            <button
              onClick={() => setSelectedCompany("baliyotechnologies")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-saira transition-all cursor-pointer ${
                selectedCompany === "baliyotechnologies"
                  ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Technologies ({techCount})
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search sender name, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-400/50"
            />
          </div>
        </div>

        {/* Inquiries Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-gray-400 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Sender Info</th>
                <th className="py-3 px-4">Company Target</th>
                <th className="py-3 px-4">Phone Number</th>
                <th className="py-3 px-4">Message Snippet</th>
                <th className="py-3 px-4">Received Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-200">
              {filteredLeads.map((lead) => (
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
                  <td className="py-3 px-4 text-gray-300 font-mono">
                    {lead.phone}
                  </td>
                  <td className="py-3 px-4 text-gray-300 max-w-xs truncate">
                    {lead.message}
                  </td>
                  <td className="py-3 px-4 text-gray-400">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setActiveLead(lead)}
                      className="px-3 py-1 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/30 transition-all font-saira font-bold text-[11px] cursor-pointer"
                    >
                      View Message
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Message Preview Sheet Modal */}
      {activeLead && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#030a1c] border border-white/15 rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4 relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-purple-400" />
                <h3 className="text-base font-bold text-white font-saira">
                  Inquiry Details
                </h3>
              </div>
              <button
                onClick={() => setActiveLead(null)}
                className="text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-white/5 border border-white/5">
                <div>
                  <span className="text-gray-400 block text-[10px]">Sender Name</span>
                  <span className="text-white font-bold text-sm font-saira">{activeLead.name}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Company Tag</span>
                  <span className="text-yellow-300 font-bold capitalize">{activeLead.company}</span>
                </div>
                <div className="mt-2">
                  <span className="text-gray-400 block text-[10px]">Email</span>
                  <a href={`mailto:${activeLead.email}`} className="text-purple-300 underline font-mono">
                    {activeLead.email}
                  </a>
                </div>
                <div className="mt-2">
                  <span className="text-gray-400 block text-[10px]">Phone</span>
                  <a href={`tel:${activeLead.phone}`} className="text-cyan-300 font-mono">
                    {activeLead.phone}
                  </a>
                </div>
              </div>

              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-bold mb-1">
                  Full Inquiry Body
                </span>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-gray-200 leading-relaxed font-sans text-xs">
                  {activeLead.message}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <a
                href={`mailto:${activeLead.email}?subject=RE: Baliyo Inquiry`}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-xs font-bold font-saira hover:opacity-90 transition-all flex items-center gap-1.5"
              >
                <Mail className="h-3.5 w-3.5" /> Reply via Email
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
