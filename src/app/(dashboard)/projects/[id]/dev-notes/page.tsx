"use client";

import { useProject } from "@/hooks/useProject";

export default function DevNotesPage() {
  const { project, setProject, saving, saved, save, loading } = useProject();
  if (loading || !project) {
    return (
      <div style={{ height: "120px", background: "#FAF7F0", borderRadius: "8px", animation: "pulse 1.5s ease-in-out infinite" }} />
    );
  }

  const fields = [
    { key: "challenges", label: "Challenges faced" },
    { key: "learnings", label: "Key learnings" },
    { key: "futureImprovements", label: "Future improvements" },
  ] as const;

  return (
    <div>
      {project.aiGeneratedFields?.includes("devNotes") && (
        <div style={{ background: "#FFF4E5", border: "0.5px solid #F0997B", borderRadius: "8px", padding: "8px 12px", fontSize: "12px", color: "#993C1D", marginBottom: "1rem" }}>
          ✨ This content was AI-generated. Review and save to confirm.
        </div>
      )}

      {fields.map(({ key, label }) => (
        <div key={key} style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", fontSize: "13px", marginBottom: "4px", color: "#5F5E5A" }}>{label}</label>
          <textarea
            value={project[key] || ""}
            onChange={(e) => setProject({ ...project, [key]: e.target.value })}
            rows={4}
            style={{ width: "100%", padding: "8px 12px", border: "1px solid #E4DFD2", borderRadius: "8px", fontFamily: "inherit" }}
          />
        </div>
      ))}
      <button
        onClick={() =>
          save(
            { challenges: project.challenges, learnings: project.learnings, futureImprovements: project.futureImprovements },
            "devNotes"
          )
        }
        disabled={saving}
        style={{ padding: "10px 20px", background: "#D85A30", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 500, cursor: "pointer" }}
      >
        {saving ? "Saving..." : saved ? "Saved ✓" : "Save changes"}
      </button>
    </div>
  );
}