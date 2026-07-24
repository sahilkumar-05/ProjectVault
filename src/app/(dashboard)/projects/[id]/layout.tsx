import { auth } from "@/lib/auth";
import HealthScore from "@/components/project/HealthScore";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import AIGenerator from "@/components/project/AIGenerator";

import ProjectTabs from "@/components/project/ProjectTabs";

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const { id } = await params;

  const project = await prisma.project.findUnique({ where: { id } });

  if (!project || project.userId !== session?.user?.id) {
    notFound();
  }

  return (
    <div>
      <div style={{ marginBottom: "16px" }}>
        <h1 style={{ fontSize: "20px", color: "#2C2C2A", marginBottom: "4px" }}>
          {project.name}
        </h1>
        {project.description && (
          <p style={{ fontSize: "13px", color: "#888780" }}>{project.description}</p>
        )}
      </div>
        <HealthScore project={project} />
      <AIGenerator project={project} />

      <ProjectTabs projectId={id} />

      <div
        style={{
          background: "#fff",
          border: "0.5px solid #E4DFD2",
          borderTop: "none",
          borderRadius: "0 8px 8px 8px",
          padding: "24px",
        }}
      >
        {children}
      </div>
    </div>
  );
}