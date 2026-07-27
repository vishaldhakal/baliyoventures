import { Metadata } from "next";
import ContactsView from "@/components/admin/contacts/ContactsView";
import { getContactLeads } from "@/services/admin.service";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Inquiries & Client Leads | Baliyo Admin",
  description: "Website contact leads for Baliyo Ventures and Baliyo Technologies",
};

export default async function ContactsAdminPage() {
  const contactLeads = await getContactLeads();
  return <ContactsView contactLeads={contactLeads} />;
}
