import { Metadata } from "next";
import ContentView from "@/components/admin/content/ContentView";

export const metadata: Metadata = {
  title: "Content & Services Manager | Baliyo Admin",
  description: "Manage services, blogs, partners, and gallery media",
};

export default function ContentAdminPage() {
  return <ContentView />;
}
