import { Metadata } from "next";
import VendorsView from "@/components/admin/inventory/VendorsView";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Vendors & Suppliers | Baliyo Admin",
  description: "Manage hardware suppliers, contacts, and warehouse vendor addresses",
};

export default function VendorsPage() {
  return <VendorsView />;
}
