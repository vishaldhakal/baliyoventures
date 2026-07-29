import { Metadata } from "next";
import PublicCreateProjectOrderView from "@/components/project-orders/PublicCreateProjectOrderView";

export const metadata: Metadata = {
  title: "Place an Order | Baliyo Ventures",
  description:
    "Place a custom project or product order with Baliyo Ventures. Fill out your requirements and our engineering team will get in touch with you.",
};

export default function CreateProjectOrderPage() {
  return <PublicCreateProjectOrderView />;
}
