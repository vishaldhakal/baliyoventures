"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getLeaveForms, LeaveFormRecord, LeaveFormListResponse } from "@/services/leave.service";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  Calendar,
  User,
  Clock,
  RefreshCw,
  FileText,
  UserCheck
} from "lucide-react";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const leaveTypeLabels: Record<string, string> = {
  paid: "Paid Leave",
  sick: "Sick Leave",
  unpaid: "Unpaid Leave",
  weekly: "Weekly Off",
  other: "Other",
};

const leaveTypeColors: Record<string, string> = {
  paid: "bg-emerald-50 text-emerald-700 border border-emerald-200/60",
  sick: "bg-rose-50 text-rose-700 border border-rose-200/60",
  unpaid: "bg-amber-50 text-amber-700 border border-amber-200/60",
  weekly: "bg-blue-50 text-blue-700 border border-blue-200/60",
  other: "bg-purple-50 text-purple-700 border border-purple-200/60",
};

export default function LeaveFormAdminView() {
  const [data, setData] = useState<LeaveFormListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [selectedRecord, setSelectedRecord] = useState<LeaveFormRecord | null>(null);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const router = useRouter();

  const fetchData = async (pageNum: number) => {
    setLoading(true);
    setError("");
    try {
      const res = await getLeaveForms(pageNum);
      setData(res);
      setPage(pageNum);
    } catch (err: any) {
      console.error(err);
      setError("Failed to fetch leave requests. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [page]);

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      const res = await fetch("/api/admin/logout", {
        method: "POST",
      });
      if (res.ok) {
        router.push("/leave-form/admin/login");
        router.refresh();
      } else {
        setError("Failed to log out");
      }
    } catch (err) {
      setError("An error occurred during logout");
    } finally {
      setLogoutLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (e) {
      return dateStr;
    }
  };

  const formatDateTime = (dateTimeStr: string) => {
    if (!dateTimeStr) return "-";
    try {
      return new Date(dateTimeStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return dateTimeStr;
    }
  };

  // Determine items showing summary
  const itemsPerPage = data?.results.length || 0;
  const totalItems = data?.count || 0;
  const startItem = totalItems > 0 ? (page - 1) * 10 + 1 : 0;
  const endItem = Math.min(page * 10, totalItems);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 py-6 px-3 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10 space-y-4 sm:space-y-6">
        {/* Header Navigation */}
        <header className="flex flex-row items-center justify-between gap-3 bg-white border border-gray-200 p-3 sm:p-5 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="relative w-28 sm:w-32 h-10 sm:h-12 bg-[#00040C] rounded-xl px-2 sm:px-3 py-1 flex items-center justify-center shrink-0">
              <Image
                src="/logo.svg"
                alt="Baliyo Ventures"
                fill
                className="object-contain p-1.5"
                priority
              />
            </div>
            <div className="h-6 w-[1px] bg-gray-200 hidden md:block" />
            <h1 className="text-base sm:text-lg font-bold tracking-wide text-gray-900 hidden md:block">
              Leave Requests Admin Panel
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => fetchData(page)}
              variant="outline"
              size="icon"
              disabled={loading}
              className="border-gray-200 hover:bg-gray-50 h-9 w-9 sm:h-10 sm:w-10 text-gray-500 transition-all cursor-pointer shrink-0"
            >
              <RefreshCw className={`h-4 w-4 sm:h-4.5 sm:w-4.5 ${loading ? "animate-spin" : ""}`} />
            </Button>
            <Button
              onClick={handleLogout}
              disabled={logoutLoading}
              variant="outline"
              className="border-red-150 text-red-600 hover:bg-red-50 hover:border-red-200 rounded-xl px-3 sm:px-4 h-9 sm:h-10 text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              {logoutLoading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <LogOut className="h-3.5 w-3.5" />
              )}
              Sign Out
            </Button>
          </div>
        </header>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm flex items-center justify-between gap-2">
            <span>{error}</span>
            <Button
              onClick={() => fetchData(page)}
              variant="link"
              className="text-red-700 hover:text-red-800 p-0 h-auto font-medium text-xs sm:text-sm shrink-0"
            >
              Retry
            </Button>
          </div>
        )}

        {/* Dashboard Content */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 tracking-wide">Leave Application Records</h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                Showing entries {startItem} - {endItem} of {totalItems} total requests
              </p>
            </div>
          </div>

          <div>
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-3">
                <Loader2 className="h-10 w-10 text-gray-900 animate-spin" />
                <span className="text-gray-500 text-sm">Fetching records...</span>
              </div>
            ) : data && data.results.length > 0 ? (
              <>
                {/* Desktop/Tablet Table view */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50/70 text-gray-500 text-xs font-semibold tracking-wider">
                        <th className="py-4 px-6">Employee</th>
                        <th className="py-4 px-6">Leave Type</th>
                        <th className="py-4 px-6 text-center">Days</th>
                        <th className="py-4 px-6">Leave Period</th>
                        <th className="py-4 px-6">Approved By</th>
                        <th className="py-4 px-6">Submission Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-150 text-sm">
                      {data.results.map((record) => (
                        <tr
                          key={record.id}
                          onClick={() => setSelectedRecord(record)}
                          className="hover:bg-gray-50/50 transition-colors group cursor-pointer"
                        >
                          <td className="py-4 px-6">
                            <div className="font-semibold text-gray-900 group-hover:text-gray-950 transition-colors">
                              {record.employee_name}
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs text-gray-500 mt-0.5">
                              <span className="flex items-center gap-1">
                                <Mail className="h-3 w-3 shrink-0" />
                                {record.employee_email}
                              </span>
                              <span className="hidden sm:inline text-gray-300">•</span>
                              <span className="flex items-center gap-1">
                                <Phone className="h-3 w-3 shrink-0" />
                                {record.employee_contact_number}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                leaveTypeColors[record.reason_of_leave] ||
                                "bg-gray-100 text-gray-700 border border-gray-200"
                              }`}
                            >
                              {leaveTypeLabels[record.reason_of_leave] || record.reason_of_leave}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-center font-semibold text-gray-800">
                            {record.days}
                          </td>
                          <td className="py-4 px-6 text-gray-600">
                            <div className="flex items-center gap-1 text-xs">
                              <Calendar className="h-3.5 w-3.5 text-gray-400" />
                              <span>
                                {formatDate(record.leave_from_date)}
                                {" - "}
                                {formatDate(record.leave_to_date)}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-gray-600">
                            <span className="flex items-center gap-1.5 text-xs">
                              <UserCheck className="h-3.5 w-3.5 text-gray-400" />
                              {record.approved_by}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-gray-500 text-xs">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatDateTime(record.created_at)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile list view (optimized down to 320px) */}
                <div className="md:hidden divide-y divide-gray-100">
                  {data.results.map((record) => (
                    <div
                      key={record.id}
                      onClick={() => setSelectedRecord(record)}
                      className="p-4 hover:bg-gray-50/50 active:bg-gray-100 transition-colors cursor-pointer space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-gray-900 text-sm truncate">
                            {record.employee_name}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5 truncate">
                            {record.employee_email}
                          </div>
                        </div>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${
                            leaveTypeColors[record.reason_of_leave] ||
                            "bg-gray-100 text-gray-700 border border-gray-200"
                          }`}
                        >
                          {leaveTypeLabels[record.reason_of_leave] || record.reason_of_leave}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <Calendar className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                          <span className="truncate">
                            {formatDate(record.leave_from_date)}
                          </span>
                        </div>
                        <div className="text-right font-semibold text-gray-800">
                          {record.days} {record.days === 1 ? "Day" : "Days"}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-y-1 text-xs text-gray-400 pt-2 border-t border-gray-50">
                        <span className="flex items-center gap-1 truncate max-w-[150px]">
                          <User className="h-3 w-3 shrink-0" />
                          Approved: {record.approved_by}
                        </span>
                        <span className="flex items-center gap-1 shrink-0">
                          <Clock className="h-3 w-3 shrink-0" />
                          {formatDate(record.created_at)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="py-20 text-center">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600">No leave requests found</h3>
                <p className="text-sm text-gray-400 mt-1">
                  Once employees submit leave forms, they will show up here.
                </p>
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {data && data.count > 0 && (
            <div className="p-4 sm:p-5 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="text-xs text-gray-500 order-2 sm:order-1 text-center sm:text-left">
                Showing <span className="font-semibold text-gray-900">{startItem}</span> to{" "}
                <span className="font-semibold text-gray-900">{endItem}</span> of{" "}
                <span className="font-semibold text-gray-900">{totalItems}</span> entries
              </div>

              <div className="flex items-center justify-center gap-2 order-1 sm:order-2 w-full sm:w-auto">
                <Button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={!data.previous || loading}
                  variant="outline"
                  className="border-gray-200 bg-white hover:bg-gray-50 hover:text-gray-900 h-8 sm:h-9 px-2 sm:px-3 rounded-lg text-xs transition-all disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer flex-1 sm:flex-none"
                >
                  <ChevronLeft className="h-3.5 w-3.5 mr-0.5 sm:mr-1 shrink-0" />
                  Previous
                </Button>
                <div className="text-xs font-semibold text-gray-700 px-3 bg-white h-8 sm:h-9 flex items-center rounded-lg border border-gray-200 shrink-0">
                  Page {page}
                </div>
                <Button
                  onClick={() => setPage((prev) => prev + 1)}
                  disabled={!data.next || loading}
                  variant="outline"
                  className="border-gray-200 bg-white hover:bg-gray-50 hover:text-gray-900 h-8 sm:h-9 px-2 sm:px-3 rounded-lg text-xs transition-all disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer flex-1 sm:flex-none"
                >
                  Next
                  <ChevronRight className="h-3.5 w-3.5 ml-0.5 sm:ml-1 shrink-0" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Leave Request Detail Dialog */}
      <Dialog open={selectedRecord !== null} onOpenChange={(open) => !open && setSelectedRecord(null)}>
        <DialogContent className="bg-white border border-gray-250 text-gray-900 rounded-2xl sm:max-w-lg max-w-[95%] p-4 sm:p-6">
          <DialogHeader className="border-b border-gray-100 pb-3 sm:pb-4 mb-3 sm:mb-4">
            <DialogTitle className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
              <FileText className="h-5 w-5 text-gray-700" />
              Leave Request Details
            </DialogTitle>
          </DialogHeader>

          {selectedRecord && (
            <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-0.5">
                  <div className="text-[10px] sm:text-xs text-gray-400 font-medium">Employee Name</div>
                  <div className="font-semibold flex items-center gap-1 sm:gap-1.5 text-gray-900 truncate">
                    <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400 shrink-0" />
                    {selectedRecord.employee_name}
                  </div>
                </div>
                <div className="space-y-0.5">
                  <div className="text-[10px] sm:text-xs text-gray-400 font-medium">Leave Type</div>
                  <div>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${
                        leaveTypeColors[selectedRecord.reason_of_leave] ||
                        "bg-gray-100 text-gray-700 border border-gray-250"
                      }`}
                    >
                      {leaveTypeLabels[selectedRecord.reason_of_leave] || selectedRecord.reason_of_leave}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-0.5">
                  <div className="text-[10px] sm:text-xs text-gray-400 font-medium">Contact Number</div>
                  <div className="text-gray-800 flex items-center gap-1 sm:gap-1.5 truncate">
                    <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400 shrink-0" />
                    {selectedRecord.employee_contact_number}
                  </div>
                </div>
                <div className="space-y-0.5">
                  <div className="text-[10px] sm:text-xs text-gray-400 font-medium">Email Address</div>
                  <div className="text-gray-800 flex items-center gap-1 sm:gap-1.5 truncate">
                    <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400 shrink-0" />
                    {selectedRecord.employee_email}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 border-t border-gray-100 pt-2 sm:pt-3">
                <div className="space-y-0.5">
                  <div className="text-[10px] sm:text-xs text-gray-400 font-medium">Leave Period</div>
                  <div className="text-gray-800 flex items-center gap-1 sm:gap-1.5">
                    <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400 shrink-0" />
                    <span className="text-[11px] sm:text-xs">
                      {formatDate(selectedRecord.leave_from_date)} - {formatDate(selectedRecord.leave_to_date)}
                    </span>
                  </div>
                </div>
                <div className="space-y-0.5">
                  <div className="text-[10px] sm:text-xs text-gray-400 font-medium">Total Duration</div>
                  <div className="text-gray-900 font-bold">
                    {selectedRecord.days} {selectedRecord.days === 1 ? "Day" : "Days"}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 border-t border-gray-100 pt-2 sm:pt-3">
                <div className="space-y-0.5">
                  <div className="text-[10px] sm:text-xs text-gray-400 font-medium">Approved By</div>
                  <div className="text-gray-800 flex items-center gap-1 sm:gap-1.5 truncate">
                    <UserCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400 shrink-0" />
                    {selectedRecord.approved_by}
                  </div>
                </div>
                <div className="space-y-0.5">
                  <div className="text-[10px] sm:text-xs text-gray-400 font-medium">Submitted On</div>
                  <div className="text-gray-800 flex items-center gap-1 sm:gap-1.5">
                    <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400 shrink-0" />
                    <span className="text-[11px] sm:text-xs">
                      {formatDateTime(selectedRecord.created_at)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 border-t border-gray-100 pt-2 sm:pt-3">
                <div className="text-[10px] sm:text-xs text-gray-400 font-medium">Reason for Leave</div>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-2.5 sm:p-3.5 text-gray-700 leading-relaxed max-h-28 sm:max-h-36 overflow-y-auto whitespace-pre-wrap text-[11px] sm:text-xs">
                  {selectedRecord.brief_reason}
                </div>
              </div>
            </div>
          )}

          <div className="mt-4 sm:mt-6 flex justify-end border-t border-gray-100 pt-3 sm:pt-4">
            <Button
              onClick={() => setSelectedRecord(null)}
              className="bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl px-5 h-9 sm:h-10 text-xs sm:text-sm cursor-pointer"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
