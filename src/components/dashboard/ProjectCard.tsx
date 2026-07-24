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
    <div style={{ position: "relative" }}>
      <Link
        href={`/projects/${project.id}/overview`}
        style={{
          background: "rgba(255,255,255,0.55)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          border: "1px solid rgba(255,255,255,0.6)",
          borderRadius: "16px",
          padding: "18px",
          textDecoration: "none",
          display: "block",
          boxShadow: "0 4px 24px rgba(44,44,42,0.06)",
          transition: "transform 0.15s ease, box-shadow 0.15s ease",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
          <span style={{ fontWeight: 500, fontSize: "14px", color: "#2C2C2A" }}>
            {project.name}
          </span>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={toggleFavorite}
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: "14px", color: isFavorite ? "#EF9F27" : "#B4B2A9" }}
              title="Toggle favorite"
            >
              ★
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowConfirm(true);
              }}
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: "13px", color: "#B4B2A9" }}
              title="Delete project"
            >
              ✕
            </button>
          </div>
        </div>

        {project.description && (
          <p style={{ fontSize: "13px", color: "#888780", margin: "6px 0" }}>
            {project.description.slice(0, 80)}
          </p>
        )}

        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "8px" }}>
          {project.techStack.map((tech) => (
            <span
              key={tech}
              style={{ fontSize: "11px", background: "#E6F1FB", color: "#0C447C", padding: "2px 8px", borderRadius: "20px" }}
            >
              {tech}
            </span>
          ))}
        </div>
        <div style={{ height: "4px", background: "#EEEDFE", borderRadius: "2px", overflow: "hidden", marginTop: "10px" }}>
          <div style={{ width: `${project.healthPercentage}%`, height: "100%", background: "linear-gradient(90deg, #D85A30, #F0997B)" }} />
        </div>
        <p style={{ fontSize: "11px", color: "#888780", marginTop: "4px" }}>{project.healthPercentage}% documented</p>
      </Link>

      {showConfirm && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(255,255,255,0.97)",
            borderRadius: "12px",
            border: "0.5px solid #E4DFD2",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            padding: "16px",
          }}
        >
          <p style={{ fontSize: "13px", color: "#2C2C2A", textAlign: "center" }}>
            Delete "{project.name}"? This can't be undone.
          </p>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={handleDelete}
              disabled={deleting}
              style={{ padding: "6px 14px", background: "#993C1D", color: "#fff", border: "none", borderRadius: "6px", fontSize: "12px", cursor: "pointer" }}
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowConfirm(false);
              }}
              style={{ padding: "6px 14px", background: "#E4DFD2", color: "#2C2C2A", border: "none", borderRadius: "6px", fontSize: "12px", cursor: "pointer" }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}