import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ProjectCard from "@/components/dashboard/ProjectCard";
import { getHealthScore } from "@/lib/health-score";

const glassCard: React.CSSProperties = {
  background: "rgba(255,255,255,0.55)",
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
  border: "1px solid rgba(255,255,255,0.6)",
  borderRadius: "16px",
  boxShadow: "0 4px 24px rgba(44,44,42,0.06)",
};

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id as string;

  const projects = await prisma.project.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });

  const favoritesCount = projects.filter((p: any) => p.isFavorite).length;
  const avgHealth = projects.length > 0
    ? Math.round(projects.reduce((sum: number, p: any) => sum + getHealthScore(p).percentage, 0) / projects.length)
    : 0;

  return (
    <div>
      <h1 style={{ fontSize: "28px", fontWeight: 600, color: "#2C2C2A", marginBottom: "4px", letterSpacing: "-0.3px" }}>
        Welcome back, {session?.user?.name?.split(" ")[0]}
      </h1>
      <p style={{ fontSize: "14px", color: "#888780", marginBottom: "28px" }}>
        Here's what's in your vault.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "14px", marginBottom: "36px" }}>
        <div style={{ ...glassCard, padding: "18px" }}>
          <p style={{ fontSize: "12px", color: "#888780", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Total projects</p>
          <p style={{ fontSize: "28px", fontWeight: 700, color: "#2C2C2A" }}>{projects.length}</p>
        </div>
        <div style={{ ...glassCard, padding: "18px" }}>
          <p style={{ fontSize: "12px", color: "#888780", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Avg. documentation health</p>
          <p style={{
            fontSize: "28px", fontWeight: 700,
            background: "linear-gradient(135deg, #D85A30, #F0997B)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            {projects.length > 0 ? `${avgHealth}%` : "—"}
          </p>
        </div>
        <div style={{ ...glassCard, padding: "18px" }}>
          <p style={{ fontSize: "12px", color: "#888780", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Favorites</p>
          <p style={{ fontSize: "28px", fontWeight: 700, color: "#EF9F27" }}>{favoritesCount}</p>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
        <h2 style={{ fontSize: "16px", fontWeight: 600, color: "#2C2C2A" }}>Your projects</h2>
        <Link
          href="/projects/new"
          style={{
            padding: "9px 18px",
            background: "linear-gradient(135deg, #D85A30, #C4471F)",
            color: "#fff", borderRadius: "10px", fontSize: "13px", fontWeight: 500,
            textDecoration: "none", boxShadow: "0 4px 14px rgba(216,90,48,0.3)",
          }}
        >
          + New project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div style={{ ...glassCard, border: "1px dashed rgba(180,178,169,0.6)", padding: "56px", textAlign: "center" }}>
          <p style={{ fontSize: "16px", color: "#2C2C2A", marginBottom: "6px", fontWeight: 500 }}>No projects yet</p>
          <p style={{ fontSize: "13px", color: "#888780", marginBottom: "18px" }}>
            Create your first project to start building your developer memory.
          </p>
          <Link
            href="/projects/new"
            style={{ padding: "10px 20px", background: "linear-gradient(135deg, #D85A30, #C4471F)", color: "#fff", borderRadius: "10px", fontSize: "13px", fontWeight: 500, textDecoration: "none" }}
          >
            Create project
          </Link>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px" }}>
          {projects.map((project: any) => (
            <ProjectCard key={project.id} project={{ ...project, healthPercentage: getHealthScore(project).percentage }} />
          ))}
        </div>
      )}
    </div>
  );
}