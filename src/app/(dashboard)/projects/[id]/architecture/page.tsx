"use client";

import { useProject } from "@/hooks/useProject";
import MermaidPreview from "@/components/project/MermaidPreview";

export default function ArchitecturePage() {
  const { project, setProject, saving, saved, save, loading } = useProject();

  if (loading || !project) return <p style={{ color: "#888780", fontSize: "13px" }}>Loading...</p>;

  const fields = [
    { key: "erDiagram", label: "ER Diagram" },
    { key: "systemDesign", label: "System Design" },
    { key: "flowcharts", label: "Flowcharts" },
  ] as const;

  return (
    <div>
      <p style={{ fontSize: "12px", color: "#888780", marginBottom: "1rem" }}>
        Written in Mermaid syntax, e.g. <code>graph TD; A--&gt;B;</code>
      </p>

      {fields.map(({ key, label }) => (
        <div key={key} style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", fontSize: "13px", marginBottom: "4px", color: "#5F5E5A" }}>{label}</label>
          <textarea
            value={project[key] || ""}
            onChange={(e) => setProject({ ...project, [key]: e.target.value })}
            rows={4}
            style={{ width: "100%", padding: "8px 12px", border: "1px solid #E4DFD2", borderRadius: "8px", fontFamily: "monospace", fontSize: "13px" }}
          />
          <MermaidPreview code={project[key] || ""} />
        </div>
      ))}

      <button
        onClick={() => save({ erDiagram: project.erDiagram, systemDesign: project.systemDesign, flowcharts: project.flowcharts })}
        disabled={saving}
        style={{ padding: "10px 20px", background: "#D85A30", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 500, cursor: "pointer" }}
      >
        {saving ? "Saving..." : saved ? "Saved ✓" : "Save changes"}
      </button>
    </div>
  );
}