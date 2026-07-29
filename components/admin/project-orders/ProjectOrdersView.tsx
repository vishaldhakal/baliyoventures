"use client";

import PaginationControls from "@/components/admin/PaginationControls";
import { ProjectOrder, ProjectOrdersListResponse } from "@/types/project-orders";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  AlertTriangle,
  Eye,
  FileText,
  FolderGit2,
  Hash,
  Loader2,
  Phone,
  Plus,
  Search,
  ShoppingBag,
  Trash2,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const PAGE_SIZE = 10;

export default function ProjectOrdersView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const apiBase =
    process.env.NEXT_PUBLIC_API_URL || "https://yachu.baliyoventures.com/api/baliyo";

  const [ordersData, setOrdersData] = useState<ProjectOrdersListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal / Drawer States
  const [selectedOrder, setSelectedOrder] = useState<ProjectOrder | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [deleteOrder, setDeleteOrder] = useState<ProjectOrder | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchOrders = async (query: string = searchTerm) => {
    setLoading(true);
    setError(false);
    try {
      const searchParam = query.trim()
        ? `&search=${encodeURIComponent(query.trim())}`
        : "";
      const res = await fetch(
        `${apiBase}/project-orders/?page=${currentPage}&page_size=${PAGE_SIZE}${searchParam}`,
        { cache: "no-store" }
      );
      if (!res.ok) throw new Error("Failed to fetch project orders");
      const data: ProjectOrdersListResponse = await res.json();
      setOrdersData(data);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOrders(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [currentPage, searchTerm]);

  const handleDelete = async () => {
    if (!deleteOrder) return;
    setDeleting(true);
    try {
      const res = await fetch(`${apiBase}/project-orders/${deleteOrder.id}/`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete order");
      setIsDeleteOpen(false);
      setDeleteOrder(null);
      fetchOrders(searchTerm);
    } catch (err) {
      console.error(err);
      alert("Could not delete project order. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const displayOrders = ordersData?.results || [];


  return (
    <div className="space-y-6 font-sans pb-12">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <ShoppingBag className="h-6 w-6 text-slate-900" />
            Project Orders
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage custom project requests, client orders, and requested quantities.
          </p>
        </div>

        <Link
          href="/admin/project-orders/create"
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-all cursor-pointer shadow-sm shrink-0"
        >
          <Plus className="h-4 w-4 text-white" />
          Create Order
        </Link>
      </div>


      {/* Search Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-3 shadow-xs">
        <Search className="h-4 w-4 text-slate-400 shrink-0" />
        <input
          type="text"
          placeholder="Search by client name, project name, or phone number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 bg-transparent text-xs text-slate-900 placeholder-slate-400 border-none outline-none font-sans"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="text-xs text-slate-400 hover:text-slate-600"
          >
            Clear
          </button>
        )}
      </div>

      {/* Pagination Controls Top */}
      {ordersData && ordersData.count > 0 && (
        <PaginationControls
          currentPage={currentPage}
          totalCount={ordersData.count}
          pageSize={PAGE_SIZE}
          onPageChange={(page) => router.push(`/admin/project-orders?page=${page}`)}
          itemLabel="orders"
        />
      )}

      {/* Orders Table Layout */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-xs text-rose-500 font-semibold">
                Failed to load project orders.
              </p>
            </div>
          ) : displayOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4 space-y-2">
              <AlertCircle className="h-10 w-10 text-slate-300" />
              <h3 className="text-sm font-bold text-slate-700">No Orders Found</h3>
              <p className="text-slate-400 text-xs max-w-xs font-sans">
                {searchTerm
                  ? `No orders match "${searchTerm}".`
                  : "No project orders have been created yet."}
              </p>
              {!searchTerm && (
                <Link
                  href="/admin/project-orders/create"
                  className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-xs hover:bg-slate-800 transition-all"
                >
                  <Plus className="h-3.5 w-3.5" /> Create First Order
                </Link>
              )}
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs font-sans">
              <thead>
                <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-600 font-semibold">
                  <th className="px-6 py-3.5">Client Name</th>
                  <th className="px-6 py-3.5">Phone Number</th>
                  <th className="px-6 py-3.5">Project Name</th>
                  <th className="px-6 py-3.5 text-center">Quantity</th>
                  <th className="px-6 py-3.5 max-w-xs">Remarks</th>
                  <th className="px-6 py-3.5">Date Created</th>
                  <th className="px-6 py-3.5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {displayOrders.map((order: ProjectOrder) => (
                  <tr
                    key={order.id}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    onClick={() => {
                      setSelectedOrder(order);
                      setIsDetailOpen(true);
                    }}
                  >

                    {/* Client Name */}
                    <td className="px-6 py-4 font-semibold text-slate-900 text-sm">
                      {order.full_name}
                    </td>

                    {/* Phone Number */}
                    <td className="px-6 py-4 text-slate-600">
                      {order.phone_number || "—"}
                    </td>

                    {/* Project Name */}
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {order.project_name}
                    </td>

                    {/* Quantity Badge */}
                    <td className="px-6 py-4 text-center font-bold text-slate-800 text-xs">
                      {order.quantity}
                    </td>

                    {/* Remarks */}
                    <td className="px-6 py-4 text-slate-600 max-w-xs truncate" title={order.remarks || undefined}>
                      {order.remarks || "—"}
                    </td>

                    {/* Created Date */}
                    <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                      {new Date(order.created_at).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>

                    {/* Actions */}
                    <td
                      className="px-6 py-4 whitespace-nowrap text-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex justify-center items-center gap-2">
                        {/* View Order details */}
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setIsDetailOpen(true);
                          }}
                          title="View Order Details"
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>

                        {/* Delete Order */}
                        <button
                          onClick={() => {
                            setDeleteOrder(order);
                            setIsDeleteOpen(true);
                          }}
                          title="Delete Order"
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-all cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Detail Drawer Modal */}
      <AnimatePresence>
        {isDetailOpen && selectedOrder && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDetailOpen(false)}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="fixed inset-0 m-auto w-full max-w-lg h-fit max-h-[90vh] overflow-y-auto bg-white border border-slate-200 z-50 rounded-2xl shadow-2xl overflow-hidden font-sans"
            >
              {/* Header */}
              <div className="bg-white border-b border-slate-100 p-5 sm:p-6 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-slate-100 rounded-xl text-slate-900">
                    <ShoppingBag className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold tracking-tight text-slate-900">
                      Order #{selectedOrder.id}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Received {new Date(selectedOrder.created_at).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsDetailOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Body Content */}
              <div className="p-5 sm:p-6 space-y-4">
                {/* 2-Column Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Client Name */}
                  <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      <User className="h-3.5 w-3.5 text-slate-500" />
                      Client Name
                    </div>
                    <p className="text-sm font-extrabold text-slate-900 truncate">
                      {selectedOrder.full_name}
                    </p>
                  </div>

                  {/* Phone Number */}
                  <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      <Phone className="h-3.5 w-3.5 text-slate-500" />
                      Phone Number
                    </div>
                    <p className="text-sm font-bold text-slate-800 truncate">
                      {selectedOrder.phone_number || "Not provided"}
                    </p>
                  </div>

                  {/* Project Name */}
                  <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1 sm:col-span-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        <FolderGit2 className="h-3.5 w-3.5 text-slate-500" />
                        Project / Product
                      </div>
                      <div className="flex items-center gap-1 text-xs font-bold text-slate-700">
                        <Hash className="h-3.5 w-3.5 text-slate-400" />
                        <span>Qty: {selectedOrder.quantity}</span>
                      </div>
                    </div>
                    <p className="text-sm font-extrabold text-slate-900">
                      {selectedOrder.project_name}
                    </p>
                  </div>
                </div>

                {/* Remarks Section */}
                {selectedOrder.remarks && (
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      <FileText className="h-3.5 w-3.5 text-slate-500" />
                      Order Notes & Remarks
                    </div>
                    <div className="p-4 bg-slate-50 border-l-4 border-slate-900 rounded-r-xl border-y border-r border-slate-200/80 text-xs font-medium text-slate-800 leading-relaxed whitespace-pre-wrap">
                      {selectedOrder.remarks}
                    </div>
                  </div>
                )}

                {/* Footer Action */}
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setIsDetailOpen(false)}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-all cursor-pointer shadow-xs active:scale-[0.99]"
                  >
                    Close Details
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Alert Modal */}
      <AnimatePresence>
        {isDeleteOpen && deleteOrder && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleteOpen(false)}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="fixed inset-0 m-auto w-full max-w-md h-fit bg-white border border-slate-200 z-50 rounded-2xl p-6 shadow-2xl space-y-5 font-sans"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-rose-100 text-rose-600 rounded-xl">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Delete Project Order?
                  </h3>
                  <p className="text-xs text-slate-500">
                    This action cannot be undone.
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-xs text-slate-700 leading-relaxed">
                Are you sure you want to delete order{" "}
                <span className="font-bold text-slate-900">#{deleteOrder.id}</span> for{" "}
                <span className="font-bold text-slate-900">
                  "{deleteOrder.project_name}"
                </span>{" "}
                by <span className="font-bold text-slate-900">{deleteOrder.full_name}</span>?
              </div>

              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={() => setIsDeleteOpen(false)}
                  disabled={deleting}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-white" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-3.5 w-3.5 text-white" />
                      Confirm Delete
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
