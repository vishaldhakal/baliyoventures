import { getProjects } from "@/services/project.service";
import AdminProjectsView from "@/components/admin/projects/AdminProjectsView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard - Product Development Projects | Baliyo Ventures",
  description: "Manage product development projects in the Baliyo Ventures admin panel.",
};

interface AdminPageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const resolvedSearchParams = await searchParams;
  const currentPage = parseInt(resolvedSearchParams.page || "1", 10);
  const pageSize = 9;

  // Fetch only projects in the "product-development" category
  const projectsData = await getProjects(currentPage, pageSize, "product-development");

  return (
    <AdminProjectsView
      projectsData={projectsData}
      currentPage={currentPage}
      pageSize={pageSize}
    />
  );
}
