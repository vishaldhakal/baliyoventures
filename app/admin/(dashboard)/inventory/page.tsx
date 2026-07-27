import { Metadata } from "next";
import InventoryView from "@/components/admin/inventory/InventoryView";
import { getInventoryItems } from "@/services/admin.service";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Inventory Stock | Baliyo Admin",
  description: "Warehouse inventory stock levels and component availability",
};

export default async function InventoryPage() {
  const inventoryItems = await getInventoryItems();

  return (
    <InventoryView
      initialInventoryItems={inventoryItems}
    />
  );
}
