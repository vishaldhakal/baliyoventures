import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LeaveFormAdminView from "@/components/LeaveFormAdminView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leave Requests Admin Panel | Baliyo Ventures",
  description: "View and manage leave requests submitted by employees of Baliyo Ventures.",
};

export default async function LeaveFormAdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (token !== "baliyo_admin_authenticated") {
    redirect("/leave-form/admin/login");
  }

  return <LeaveFormAdminView />;
}
