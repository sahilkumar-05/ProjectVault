import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ProjectCard from "@/components/dashboard/ProjectCard";
import { getHealthScore } from "@/lib/health-score";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id as string;

  const projects = await prisma.project.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });

  const favoritesCount = projects.filter((p: any) => p.isFavorite).length;
  const avgHealth =
    projects.length > 0
      ? Math.round(
          projects.reduce((sum: number, p: any) => sum + getHealthScore(p).percentage, 0) / projects.length
        )
      : 0;

  const firstName = session?.user?.name?.split(" ")[0];

  return (
    <div className="relative">
      <Blob className="right-[-120px] top-[-160px] h-[420px] w-[420px] bg-[#FFE4E1]" duration="8s" />
      <Blob className="left-[-140px] top-[280px] h-[380px] w-[380px] bg-[#EFEDF4]" duration="9s" delay="1s" />

      <div className="relative z-10">
        <h1 className="mb-1 text-[28px] font-semibold tracking-[-0.02em]">
          Welcome back,{" "}
          <span className="font-[Reenie_Beanie] text-4xl font-normal text-[#D85A30]">{firstName}</span>
        </h1>
        <p className="mb-7 text-sm text-[#78716C]">Here&apos;s what&apos;s in your vault.</p>

        {/* STATS */}
        <div className="mb-9 grid grid-cols-1 gap-3.5 sm:grid-cols-3">
          <GlassCard>
            <p className="mb-1.5 text-xs uppercase tracking-[0.05em] text-[#78716C]">Total projects</p>
            <p className="text-[28px] font-bold">{projects.length}</p>
          </GlassCard>

          <GlassCard>
            <p className="mb-1.5 text-xs uppercase tracking-[0.05em] text-[#78716C]">Avg. documentation health</p>
            <p className="bg-gradient-to-br from-[#D85A30] to-[#F0997B] bg-clip-text text-[28px] font-bold text-transparent">
              {projects.length > 0 ? `${avgHealth}%` : "—"}
            </p>
          </GlassCard>

          <GlassCard>
            <p className="mb-1.5 text-xs uppercase tracking-[0.05em] text-[#78716C]">Favorites</p>
            <p className="text-[28px] font-bold text-[#EF9F27]">{favoritesCount}</p>
          </GlassCard>
        </div>

        {/* HEADER ROW */}
        <div className="mb-3.5 flex items-center justify-between">
          <h2 className="
          text-base font-semibold">Your projects</h2>
          <Link
            href="/projects/new"
            className="rounded-full bg-gradient-to-br from-[#D85A30] to-[#C4471F] px-4.5 py-2.5 text-[13px] font-medium text-white shadow-[0_4px_14px_rgba(216,90,48,0.3)] transition-transform hover:scale-105"
          >
            + New project
          </Link>
        </div>

        {/* PROJECTS */}
        {projects.length === 0 ? (
          <GlassCard className="border-dashed !border-stone-300 px-14 py-14 text-center">
            <p className="mb-1.5 text-base font-medium">No projects yet</p>
            <p className="mb-4.5 text-[13px] text-[#78716C]">
              Create your first project to start building your developer memory.
            </p>
            <Link
              href="/projects/new"
              className="inline-block rounded-full bg-gradient-to-br from-[#D85A30] to-[#C4471F] px-5 py-2.5 text-[13px] font-medium text-white transition-transform hover:scale-105"
            >
              Create project
            </Link>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project: any) => (
              <ProjectCard
                key={project.id}
                project={{ ...project, healthPercentage: getHealthScore(project).percentage }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function GlassCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-white/70 p-[18px] backdrop-blur-2xl backdrop-saturate-[1.6] ${className}`}
      style={{
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0.3) 55%, rgba(255,255,255,0.45) 100%)",
        boxShadow:
          "0 8px 32px rgba(44,44,42,0.08), inset 0 1px 0 rgba(255,255,255,0.9), inset 0 0 0 1px rgba(255,255,255,0.15)",
      }}
    >
      {/* top light-catch line */}
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent" />
      {/* diagonal mirror sheen */}
      <span
        className="pointer-events-none absolute -inset-x-4 -top-1/2 h-[220%] rotate-[-25deg]"
        style={{
          background:
            "linear-gradient(90deg, transparent 30%, rgba(255,255,255,0.35) 48%, rgba(255,255,255,0.05) 55%, transparent 70%)",
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

function Blob({
  className,
  duration,
  delay = "0s",
}: {
  className: string;
  duration: string;
  delay?: string;
}) {
  return (
    <div
      className={`pointer-events-none absolute z-0 rounded-full opacity-50 blur-[70px] ${className}`}
      style={{ animation: `pv-float ${duration} ease-in-out infinite`, animationDelay: delay }}
    />
  );
}