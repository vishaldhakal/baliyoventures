"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import AdminProjectsView from "@/components/admin/projects/AdminProjectsView";
import { Loader2 } from "lucide-react";
import { ProjectsListResponse } from "@/types/projects";

const PAGE_SIZE = 9;

export default function ProjectsAdminPage() {
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const [projectsData, setProjectsData] = useState<ProjectsListResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiBase =
      process.env.NEXT_PUBLIC_API_URL || "https://yachu.baliyoventures.com/api/baliyo";
    setLoading(true);
    fetch(
      `${apiBase}/projects/?page=${currentPage}&page_size=${PAGE_SIZE}&category=product-development`,
      { cache: "no-store" }
    )
      .then((res) => res.json())
      .then((data) => setProjectsData(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [currentPage]);

  if (loading || !projectsData) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <AdminProjectsView
      projectsData={projectsData}
      currentPage={currentPage}
      pageSize={PAGE_SIZE}
    />
  );
}
