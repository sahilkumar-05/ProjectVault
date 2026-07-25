import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ProfileForm from "@/components/settings/ProfileForm";
import { getHealthScore } from "@/lib/health-score";

export default async function SettingsPage() {
  const session = await auth();
  const user = await prisma.user.findUnique({ where: { id: session?.user?.id as string } });
  const projects = await prisma.project.findMany({ where: { userId: session?.user?.id as string } });

  if (!user) return null;

  const favoritesCount = projects.filter((p: any) => p.isFavorite).length;
  const avgHealth = projects.length > 0
    ? Math.round(projects.reduce((sum: number, p: any) => sum + getHealthScore(p).percentage, 0) / projects.length)
    : 0;
  const totalFiles = projects.length; // placeholder count, replaced below with real file count query if needed

  return (
    <div>
      <Link
        href="/dashboard"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          fontSize: "13px",
          fontWeight: 500,
          color: "#fff",
          textDecoration: "none",
          marginBottom: "18px",
          padding: "7px 14px",
          background: "#D85A30",
          border: "0.5px solid #E4DFD2",
          borderRadius: "8px",
          boxShadow: "0 1px 3px rgba(44,44,42,0.05)",
        }}
      >
        ← Dashboard
      </Link>

      <h1 style={{ fontSize: "22px", fontWeight: 600, color: "#2C2C2A", marginBottom: "4px" }}>
        Profile & Settings
      </h1>
      <p style={{ fontSize: "13px", color: "#888780", marginBottom: "24px" }}>
        Manage your account and see your vault at a glance.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(280px, 1fr) minmax(240px, 320px)",
          gap: "20px",
          alignItems: "start",
        }}
      >
        <ProfileForm
          user={{ name: user.name, email: user.email, createdAt: user.createdAt.toISOString() }}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ background: "#fff", border: "0.5px solid #E4DFD2", borderRadius: "12px", padding: "18px" }}>
            <p style={{ fontSize: "12px", color: "#888780", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "12px" }}>
              Your Vault
            </p>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
              <span style={{ fontSize: "13px", color: "#5F5E5A" }}>Total projects</span>
              <span style={{ fontSize: "13px", fontWeight: 600, color: "#2C2C2A" }}>{projects.length}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
              <span style={{ fontSize: "13px", color: "#5F5E5A" }}>Favorites</span>
              <span style={{ fontSize: "13px", fontWeight: 600, color: "#d" }}>{favoritesCount}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "13px", color: "#5F5E5A" }}>Avg. documentation health</span>
              <span style={{ fontSize: "13px", fontWeight: 600, color: "#D85A30" }}>
                {projects.length > 0 ? `${avgHealth}%` : "—"}
              </span>
            </div>
          </div>

          <div style={{ background: "#fff", border: "0.5px solid #E4DFD2", borderRadius: "12px", padding: "18px" }}>
            <p style={{ fontSize: "12px", color: "#888780", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "10px" }}>
              Account
            </p>
            <p style={{ fontSize: "13px", color: "#5F5E5A", marginBottom: "6px" }}>
              Signed in as <strong style={{ color: "#2C2C2A" }}>{user.email}</strong>
            </p>
            <p style={{ fontSize: "12px", color: "#888780" }}>
              Authentication via email & password
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 720px) {
          div[style*="grid-template-columns: minmax(280px"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}