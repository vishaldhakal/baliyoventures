import { Metadata } from "next";
import ComponentsView from "@/components/admin/inventory/ComponentsView";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Component ${slug} | Baliyo Admin`,
    description: `Manage component models and technical specs for ${slug}`,
  };
}

export default async function ComponentSlugPage({ params }: Props) {
  const { slug } = await params;
  return <ComponentsView slug={slug} />;
}
