import { Metadata } from "next";
import ProjectOrdersView from "@/components/admin/project-orders/ProjectOrdersView";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Project Orders | Baliyo Admin",
  description: "Manage and record project orders and client requests",
};

export default function ProjectOrdersPage() {
  return <ProjectOrdersView />;
}
