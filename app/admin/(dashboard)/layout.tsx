import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (token !== "baliyo_admin_authenticated") {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[#00040C] text-white flex flex-col md:flex-row">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto max-h-screen">
        <div className="p-6 md:p-10 container mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
