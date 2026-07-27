"use client";

import { useState } from "react";
import { LeaveFormRecord } from "@/services/leave.service";
import AdminHeader from "@/components/admin/AdminHeader";
import {
  CalendarDays,
  UserCheck,
  Building,
  Search,
  CheckCircle,
  Clock,
  User,
  Phone,
  Mail,
  FileText,
} from "lucide-react";

interface HrViewProps {
  leaveForms: LeaveFormRecord[];
}

export default function HrView({ leaveForms }: HrViewProps) {
  const [activeTab, setActiveTab] = useState<"leaves" | "team">("leaves");
  const [search, setSearch] = useState("");
  const [selectedReason, setSelectedReason] = useState<string>("all");

  const mockTeamMembers = [
    { id: 1, name: "Anil Singh", designation: "Chief Operations Officer", department: "Executive", email: "anil@baliyoventures.com" },
    { id: 2, name: "Prithvi Chaudhary", designation: "Lead Hardware Engineer", department: "R&D Engineering", email: "prithvi@baliyoventures.com" },
    { id: 3, name: "Manav Khadka", designation: "Senior Embedded Firmware Dev", department: "R&D Engineering", email: "manav@baliyoventures.com" },
    { id: 4, name: "Sapana Dhakal", designation: "HR & Operations Coordinator", department: "Human Resources", email: "sapana@baliyoventures.com" },
  ];

  const filteredLeaves = leaveForms.filter((item) => {
    const matchesSearch =
      item.employee_name.toLowerCase().includes(search.toLowerCase()) ||
      item.employee_email.toLowerCase().includes(search.toLowerCase());
    const matchesReason =
      selectedReason === "all" ? true : item.reason_of_leave === selectedReason;
    return matchesSearch && matchesReason;
  });

  return (
    <div className="space-y-6 pb-12">
      <AdminHeader
        title="Team & HR Operations"
        subtitle="Manage employee leave requests, leave approvals, and department directory"
      />

      {/* Top HR KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-[#030a1c] border border-cyan-500/20 p-5 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400 font-medium">Leave Applications</span>
            <h3 className="text-2xl font-bold text-cyan-400 font-saira mt-1">
              {leaveForms.length} Requests
            </h3>
          </div>
          <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <CalendarDays className="h-6 w-6" />
          </div>
        </div>

        <div className="rounded-2xl bg-[#030a1c] border border-yellow-500/20 p-5 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400 font-medium">Core Staff Directory</span>
            <h3 className="text-2xl font-bold text-yellow-300 font-saira mt-1">
              {mockTeamMembers.length} Members
            </h3>
          </div>
          <div className="p-3 rounded-xl bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
            <UserCheck className="h-6 w-6" />
          </div>
        </div>

        <div className="rounded-2xl bg-[#030a1c] border border-emerald-500/20 p-5 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400 font-medium">Approval Managers</span>
            <h3 className="text-2xl font-bold text-emerald-400 font-saira mt-1">
              4 Authorizers
            </h3>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Building className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Main View Container */}
      <div className="rounded-2xl bg-[#030a1c] border border-white/10 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("leaves")}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-saira transition-all cursor-pointer ${
                activeTab === "leaves"
                  ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Leave Applications ({leaveForms.length})
            </button>
            <button
              onClick={() => setActiveTab("team")}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-saira transition-all cursor-pointer ${
                activeTab === "team"
                  ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Team Directory ({mockTeamMembers.length})
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search staff or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400/50"
              />
            </div>
            {activeTab === "leaves" && (
              <select
                value={selectedReason}
                onChange={(e) => setSelectedReason(e.target.value)}
                className="bg-[#030a1c] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400/50"
              >
                <option value="all">All Leave Types</option>
                <option value="paid">Paid</option>
                <option value="sick">Sick</option>
                <option value="unpaid">Unpaid</option>
                <option value="weekly">Weekly</option>
              </select>
            )}
          </div>
        </div>

        {/* Tab 1: Leave Forms */}
        {activeTab === "leaves" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Leave Dates</th>
                  <th className="py-3 px-4">Reason / Notes</th>
                  <th className="py-3 px-4">Approval Authority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-200">
                {filteredLeaves.map((item, index) => (
                  <tr key={index} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 font-semibold text-white">
                      <div>{item.employee_name}</div>
                    </td>
                    <td className="py-3 px-4 text-gray-300">
                      <div className="text-gray-200">{item.employee_email}</div>
                      <div className="text-[10px] text-gray-400">{item.employee_contact_number}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="capitalize text-[10px] font-bold px-2 py-0.5 rounded-md bg-cyan-400/10 text-cyan-300 border border-cyan-400/20">
                        {item.reason_of_leave}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold font-saira text-white">
                      {item.days} Day(s)
                    </td>
                    <td className="py-3 px-4 text-gray-300">
                      {item.leave_from_date} → {item.leave_to_date}
                    </td>
                    <td className="py-3 px-4 text-gray-300 max-w-xs truncate">
                      {item.brief_reason}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle className="h-3 w-3" /> {item.approved_by || "Anil Singh"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Team Members */}
        {activeTab === "team" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockTeamMembers.map((m) => (
              <div
                key={m.id}
                className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between hover:border-yellow-400/40 transition-all"
              >
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white font-saira">{m.name}</h4>
                  <p className="text-xs text-yellow-300">{m.designation}</p>
                  <p className="text-[10px] text-gray-400 font-sans">{m.department}</p>
                  <p className="text-xs text-gray-300">{m.email}</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-yellow-300 font-bold font-saira text-base shrink-0">
                  {m.name.split(" ").map((n) => n[0]).join("")}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
