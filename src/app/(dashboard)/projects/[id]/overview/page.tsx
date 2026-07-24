"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Project = {
  id: string;
  name: string;
  description: string | null;
  problem: string | null;
  solution: string | null;
  techStack: string[];
};

export default function OverviewPage() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch(`/api/projects/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProject(data);
        setLoading(false);
      });
  }, [id]);

  const handleSave = async () => {
    if (!project) return;
    setSaving(true);
    setSaved(false);

    await fetch(`/api/projects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: project.name,
        description: project.description,
        problem: project.problem,
        solution: project.solution,
        techStack: project.techStack,
        aiGeneratedFields: (project as any).aiGeneratedFields?.filter((k: string) => k !== "overview"),
      }),
    });

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (loading || !project) {
    return <p style={{ color: "#888780", fontSize: "13px" }}>Loading...</p>;
  }

  return (
    <div>
      {(project as any).aiGeneratedFields?.includes("overview") && (
        <div style={{ background: "#FFF4E5", border: "0.5px solid #F0997B", borderRadius: "8px", padding: "8px 12px", fontSize: "12px", color: "#993C1D", marginBottom: "1rem" }}>
          ✨ This content was AI-generated. Review and save to confirm.
        </div>
      )}
      <div style={{ marginBottom: "1rem" }}>
        <label style={{ display: "block", fontSize: "13px", marginBottom: "4px", color: "#5F5E5A" }}>
          Project name
        </label>
        <input
          type="text"
          value={project.name}
          onChange={(e) => setProject({ ...project, name: e.target.value })}
          style={{ width: "100%", padding: "8px 12px", border: "1px solid #E4DFD2", borderRadius: "8px" }}
        />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label style={{ display: "block", fontSize: "13px", marginBottom: "4px", color: "#5F5E5A" }}>
          Description
        </label>
        <textarea
          value={project.description || ""}
          onChange={(e) => setProject({ ...project, description: e.target.value })}
          rows={2}
          style={{ width: "100%", padding: "8px 12px", border: "1px solid #E4DFD2", borderRadius: "8px", fontFamily: "inherit" }}
        />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label style={{ display: "block", fontSize: "13px", marginBottom: "4px", color: "#5F5E5A" }}>
          Problem
        </label>
        <textarea
          value={project.problem || ""}
          onChange={(e) => setProject({ ...project, problem: e.target.value })}
          rows={3}
          placeholder="What problem does this project solve?"
          style={{ width: "100%", padding: "8px 12px", border: "1px solid #E4DFD2", borderRadius: "8px", fontFamily: "inherit" }}
        />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label style={{ display: "block", fontSize: "13px", marginBottom: "4px", color: "#5F5E5A" }}>
          Solution
        </label>
        <textarea
          value={project.solution || ""}
          onChange={(e) => setProject({ ...project, solution: e.target.value })}
          rows={3}
          placeholder="How does it solve that problem?"
          style={{ width: "100%", padding: "8px 12px", border: "1px solid #E4DFD2", borderRadius: "8px", fontFamily: "inherit" }}
        />
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <label style={{ display: "block", fontSize: "13px", marginBottom: "4px", color: "#5F5E5A" }}>
          Tech stack (comma separated)
        </label>
        <input
          type="text"
          value={project.techStack.join(", ")}
          onChange={(e) =>
            setProject({
              ...project,
              techStack: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
            })
          }
          style={{ width: "100%", padding: "8px 12px", border: "1px solid #E4DFD2", borderRadius: "8px" }}
        />
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        style={{ padding: "10px 20px", background: "#D85A30", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 500, cursor: "pointer" }}
      >
        {saving ? "Saving..." : saved ? "Saved ✓" : "Save changes"}
      </button>
    </div>
  );
}