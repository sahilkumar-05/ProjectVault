import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ProjectCard from "@/components/dashboard/ProjectCard";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id as string;

  const projects = await prisma.project.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });

  const favoritesCount = projects.filter((p) => p.isFavorite).length;

  return (
    <div>
      <h1 style={{ fontSize: "22px", color: "#2C2C2A", marginBottom: "4px" }}>
        Welcome back, {session?.user?.name?.split(" ")[0]}
      </h1>
      <p style={{ fontSize: "14px", color: "#5F5E5A", marginBottom: "24px" }}>
        Here's what's in your vault.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "32px" }}>
        <div style={{ background: "#fff", border: "0.5px solid #E4DFD2", borderRadius: "12px", padding: "16px" }}>
          <p style={{ fontSize: "13px", color: "#888780", marginBottom: "4px" }}>Total projects</p>
          <p style={{ fontSize: "24px", fontWeight: 500, color: "#2C2C2A" }}>{projects.length}</p>
        </div>
        <div style={{ background: "#fff", border: "0.5px solid #E4DFD2", borderRadius: "12px", padding: "16px" }}>
          <p style={{ fontSize: "13px", color: "#888780", marginBottom: "4px" }}>Avg. documentation health</p>
          <p style={{ fontSize: "24px", fontWeight: 500, color: "#2C2C2A" }}>—</p>
        </div>
        <div style={{ background: "#fff", border: "0.5px solid #E4DFD2", borderRadius: "12px", padding: "16px" }}>
          <p style={{ fontSize: "13px", color: "#888780", marginBottom: "4px" }}>Favorites</p>
          <p style={{ fontSize: "24px", fontWeight: 500, color: "#2C2C2A" }}>{favoritesCount}</p>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
        <h2 style={{ fontSize: "15px", color: "#2C2C2A" }}>Your projects</h2>
        <Link
          href="/projects/new"
          style={{ padding: "8px 16px", background: "#D85A30", color: "#fff", borderRadius: "8px", fontSize: "13px", fontWeight: 500, textDecoration: "none" }}
        >
          + New project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div style={{ background: "#fff", border: "0.5px dashed #B4B2A9", borderRadius: "12px", padding: "48px", textAlign: "center" }}>
          <p style={{ fontSize: "15px", color: "#2C2C2A", marginBottom: "6px" }}>No projects yet</p>
          <p style={{ fontSize: "13px", color: "#888780", marginBottom: "16px" }}>
            Create your first project to start building your developer memory.
          </p>
          <Link
            href="/projects/new"
            style={{ padding: "8px 18px", background: "#D85A30", color: "#fff", borderRadius: "8px", fontSize: "13px", fontWeight: 500, textDecoration: "none" }}
          >
            Create project
          </Link>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}