import { auth } from "@/lib/auth";
import HealthScore from "@/components/project/HealthScore";
import Link from "next/link";
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
    <div className="relative">
      <Blob className="right-[-140px] top-[-160px] h-[380px] w-[380px] bg-[#E8EFE8]" duration="8s" />

      <div className="relative z-10">
        <Link
          href="/dashboard"
          className="mb-4.5 inline-flex items-center gap-1.5 rounded-lg bg-[#D85A30] px-3.5 py-1.5 text-[13px] font-medium text-white shadow-[0_1px_3px_rgba(44,44,42,0.05)] transition-transform hover:scale-105"
        >
          ← Dashboard
        </Link>

        <div className="mb-4">
          <h1 className="mb-1 text-xl font-semibold tracking-[-0.01em]">{project.name}</h1>
          {project.description && <p className="text-[13px] text-[#78716C]">{project.description}</p>}
        </div>

        <HealthScore project={project} />
        <AIGenerator project={project} />

        <ProjectTabs projectId={id} />

        <div className="rounded-b-3xl rounded-tr-3xl border border-white/60 bg-white/70 p-6 shadow-[0_4px_24px_rgba(44,44,42,0.06)] backdrop-blur-[14px]">
          {children}
        </div>
      </div>
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