"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Project = {
  id: string;
  name: string;
  description: string | null;
  techStack: string[];
  isFavorite: boolean;
  healthPercentage: number;
};

export default function ProjectCard({ project }: { project: Project }) {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(project.isFavorite);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newValue = !isFavorite;
    setIsFavorite(newValue);

    await fetch(`/api/projects/${project.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isFavorite: newValue }),
    });
    router.refresh();
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleting(true);

    await fetch(`/api/projects/${project.id}`, { method: "DELETE" });
    router.refresh();
  };

  return (
    <div className="relative font-[Outfit]">
      <Link
        href={`/projects/${project.id}/overview`}
        className="group relative block overflow-hidden rounded-3xl border border-white/70 p-[18px] backdrop-blur-2xl backdrop-saturate-[1.6] transition-all duration-150 hover:-translate-y-0.5"
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
          className="pointer-events-none absolute -inset-x-4 -top-1/2 h-[220%] rotate-[-25deg] transition-opacity duration-300 group-hover:opacity-80"
          style={{
            background:
              "linear-gradient(90deg, transparent 30%, rgba(255,255,255,0.35) 48%, rgba(255,255,255,0.05) 55%, transparent 70%)",
          }}
        />

        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <span className="text-sm font-medium text-[#292524]">{project.name}</span>
            <div className="flex gap-2">
              <button
                onClick={toggleFavorite}
                title="Toggle favorite"
                className="text-sm transition-transform hover:scale-110"
                style={{ color: isFavorite ? "#EF9F27" : "#B4B2A9" }}
              >
                ★
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowConfirm(true);
                }}
                title="Delete project"
                className="text-[13px] text-[#B4B2A9] transition-colors hover:text-[#D85A30]"
              >
                ✕
              </button>
            </div>
          </div>

          {project.description && (
            <p className="my-1.5 text-[13px] text-[#78716C]">{project.description.slice(0, 80)}</p>
          )}

          <div className="mt-2 flex flex-wrap gap-1.5">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="rounded-full bg-[#EFEDF4] px-2 py-0.5 text-[11px] text-[#5B5578]"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-[#EEEDFE]">
            <div
              className="h-full bg-gradient-to-r from-[#D85A30] to-[#F0997B]"
              style={{ width: `${project.healthPercentage}%` }}
            />
          </div>
          <p className="mt-1 text-[11px] text-[#78716C]">{project.healthPercentage}% documented</p>
        </div>
      </Link>

      {showConfirm && (
        <div
          className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2.5 rounded-3xl border border-white/70 p-4 backdrop-blur-2xl backdrop-saturate-[1.6]"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.85) 100%)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.9)",
          }}
        >
          <p className="text-center text-[13px] text-[#292524]">
            Delete &quot;{project.name}&quot;? This can&apos;t be undone.
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="rounded-full bg-[#993C1D] px-3.5 py-1.5 text-xs text-white transition-transform hover:scale-105 disabled:opacity-70"
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowConfirm(false);
              }}
              className="rounded-full bg-stone-100 px-3.5 py-1.5 text-xs text-[#292524] transition-transform hover:scale-105"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}