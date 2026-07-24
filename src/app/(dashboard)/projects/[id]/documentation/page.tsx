"use client";

import { useProject } from "@/hooks/useProject";

export default function DocumentationPage() {
  const { project, setProject, saving, saved, save, loading } = useProject();
  if (loading || !project) {
    return (
      <div style={{ height: "120px", background: "#FAF7F0", borderRadius: "8px", animation: "pulse 1.5s ease-in-out infinite" }} />
    );
  }

  return (
    <div>
      <label style={{ display: "block", fontSize: "13px", marginBottom: "4px", color: "#5F5E5A" }}>
        Documentation (Markdown)
      </label>
      <textarea
        value={project.documentation || ""}
        onChange={(e) => setProject({ ...project, documentation: e.target.value })}
        rows={16}
        style={{ width: "100%", padding: "8px 12px", border: "1px solid #E4DFD2", borderRadius: "8px", fontFamily: "monospace", fontSize: "13px", marginBottom: "1rem" }}
      />
      <button
        onClick={() => save({ documentation: project.documentation })}
        disabled={saving}
        style={{ padding: "10px 20px", background: "#D85A30", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 500, cursor: "pointer" }}
      >
        {saving ? "Saving..." : saved ? "Saved ✓" : "Save changes"}
      </button>
    </div>
  );
}