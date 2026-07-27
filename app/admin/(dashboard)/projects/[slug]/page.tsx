import ProjectWorkspaceView from "@/components/admin/projects/ProjectWorkspaceView";
import { getProjectDetails } from "@/services/project.service";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const project = await getProjectDetails(slug);
    return {
      title: `${project.title} - Workspace | Baliyo Admin`,
      description: project.meta_description || `Project workspace for ${project.title}`,
    };
  } catch {
    return {
      title: "Project Workspace | Baliyo Admin",
    };
  }
}

export default async function AdminProjectWorkspacePage({ params }: ProjectPageProps) {
  const { slug } = await params;
  let initialProject = undefined;

  try {
    initialProject = await getProjectDetails(slug);
  } catch (err) {
    console.error("Could not pre-fetch project details:", err);
  }

  return (
    <ProjectWorkspaceView
      initialProject={initialProject}
      projectSlug={slug}
    />
  );
}
