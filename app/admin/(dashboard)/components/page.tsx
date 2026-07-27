import { Metadata } from "next";
import ComponentsView from "@/components/admin/inventory/ComponentsView";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Components & Models | Baliyo Admin",
  description: "Manage hardware components, step models, and technical specifications",
};

export default function ComponentsPage() {
  return <ComponentsView />;
}
