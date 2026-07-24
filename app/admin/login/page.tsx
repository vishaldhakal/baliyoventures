import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminLoginView from "@/components/admin/AdminLoginView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login | Baliyo Ventures",
  description: "Sign in to access the Baliyo Ventures administration dashboard.",
};

export default async function AdminLoginPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (token === "baliyo_admin_authenticated") {
    redirect("/admin");
  }

  return <AdminLoginView />;
}
