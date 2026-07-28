"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export interface PaginationControlsProps {
  currentPage: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
  itemLabel?: string;
  className?: string;
}

export function getPaginationRange(currentPage: number, totalPages: number) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (currentPage <= 2) {
    return [1, 2, 3, "...", totalPages];
  }

  if (currentPage === 3) {
    return [1, 2, 3, 4, "...", totalPages];
  }

  if (currentPage >= totalPages - 1) {
    return [1, "...", totalPages - 2, totalPages - 1, totalPages];
  }

  if (currentPage === totalPages - 2) {
    return [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
}

export default function PaginationControls({
  currentPage,
  totalCount,
  pageSize,
  onPageChange,
  loading = false,
  itemLabel = "items",
  className = "",
}: PaginationControlsProps) {
  const totalPages = Math.ceil(totalCount / pageSize);

  if (loading || totalCount <= pageSize) {
    return null;
  }

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalCount);
  const paginationRange = getPaginationRange(currentPage, totalPages);
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <div
      className={`px-5 py-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between shadow-xs ${className}`}
    >
      <span className="text-[11px] text-slate-500 font-medium">
        Showing {startItem}–{endItem} of {totalCount} {itemLabel}
      </span>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrev || loading}
          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          aria-label="Previous Page"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>

        {paginationRange.map((item, idx) => {
          if (item === "...") {
            return (
              <span
                key={`ellipsis-${idx}`}
                className="min-w-[28px] h-7 flex items-center justify-center text-xs text-slate-400 font-semibold select-none"
              >
                ...
              </span>
            );
          }
          const p = item as number;
          return (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              disabled={loading}
              className={`min-w-[28px] h-7 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
                p === currentPage
                  ? "bg-slate-900 text-white border-slate-900"
                  : "border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {p}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNext || loading}
          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          aria-label="Next Page"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
