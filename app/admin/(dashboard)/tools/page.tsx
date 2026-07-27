import ToolsView from "@/components/admin/tools/ToolsView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tools & Technologies | Admin Dashboard",
  description: "Manage tools and technologies used in projects.",
};

export default function ToolsPage() {
  return <ToolsView />;
}
