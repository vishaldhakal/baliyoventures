import { Metadata } from "next";
import PurchasesView from "@/components/admin/inventory/PurchasesView";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Component Purchases | Baliyo Admin",
  description: "Record and track component purchase orders with full item breakdown and inventory sync",
};

export default function PurchasesPage() {
  return <PurchasesView />;
}
