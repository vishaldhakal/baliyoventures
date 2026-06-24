import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LeaveFormLoginView from "@/components/LeaveFormLoginView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login | Baliyo Ventures",
  description: "Sign in to access the leave request administration dashboard.",
};

export default async function LeaveFormLoginPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (token === "baliyo_admin_authenticated") {
    redirect("/leave-form/admin");
  }

  return <LeaveFormLoginView />;
}
