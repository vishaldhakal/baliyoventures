import { Metadata } from "next";
import HrView from "@/components/admin/hr/HrView";
import { getLeaveForms } from "@/services/leave.service";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Team & HR Leave Applications | Baliyo Admin",
  description: "Manage employee leave applications and team directory",
};

export default async function HrAdminPage() {
  const leaveData = await getLeaveForms(1).catch(() => ({
    count: 0,
    next: null,
    previous: null,
    results: [],
  }));

  return <HrView leaveForms={leaveData.results || []} />;
}
