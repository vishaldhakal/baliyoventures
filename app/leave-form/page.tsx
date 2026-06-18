import LeaveFormView from "@/components/LeaveFormView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leave Request Form | Baliyo Ventures",
  description:
    "Submit your leave request at Baliyo Ventures. Fill in your details, select your leave type, duration, and choose an approver.",
  openGraph: {
    title: "Leave Request Form | Baliyo Ventures",
    description:
      "Submit your leave request at Baliyo Ventures. Fill in your details, select your leave type, duration, and choose an approver.",
    images: "/favicon.ico",
  },
};

export default function LeaveFormPage() {
  return <LeaveFormView />;
}
