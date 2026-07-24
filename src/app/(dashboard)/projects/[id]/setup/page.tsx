"use client";

import { useProject } from "@/hooks/useProject";

export default function SetupPage() {
  const { project, setProject, saving, saved, save, loading } = useProject();
  if (loading || !project) return <p style={{ color: "#888780", fontSize: "13px" }}>Loading...</p>;

  const fields = [
    { key: "installation", label: "Installation steps" },
    { key: "envVariables", label: "Environment variables" },
    { key: "apiNotes", label: "API notes" },
  ] as const;

  return (
    <div>
      {fields.map(({ key, label }) => (
        <div key={key} style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", fontSize: "13px", marginBottom: "4px", color: "#5F5E5A" }}>{label}</label>
          <textarea
            value={project[key] || ""}
            onChange={(e) => setProject({ ...project, [key]: e.target.value })}
            rows={5}
            style={{ width: "100%", padding: "8px 12px", border: "1px solid #E4DFD2", borderRadius: "8px", fontFamily: "monospace", fontSize: "13px" }}
          />
        </div>
      ))}
      <button
        onClick={() => save({ installation: project.installation, envVariables: project.envVariables, apiNotes: project.apiNotes })}
        disabled={saving}
        style={{ padding: "10px 20px", background: "#D85A30", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 500, cursor: "pointer" }}
      >
        {saving ? "Saving..." : saved ? "Saved ✓" : "Save changes"}
      </button>
    </div>
  );
}