"use client";

import { useProject } from "@/hooks/useProject";

type Feature = { title: string; description: string };

export default function FeaturesPage() {
  const { project, setProject, saving, saved, save, loading } = useProject();

  if (loading || !project) {
    return (
      <div style={{ height: "120px", background: "#FAF7F0", borderRadius: "8px", animation: "pulse 1.5s ease-in-out infinite" }} />
    );
  }

  const features: Feature[] = project.features || [];

  const updateFeature = (i: number, key: keyof Feature, value: string) => {
    const updated = [...features];
    updated[i] = { ...updated[i], [key]: value };
    setProject({ ...project, features: updated });
  };

  const addFeature = () => setProject({ ...project, features: [...features, { title: "", description: "" }] });
  const removeFeature = (i: number) => setProject({ ...project, features: features.filter((_, idx) => idx !== i) });

  return (
    <div>
      {project.aiGeneratedFields?.includes("features") && (
        <div style={{ background: "#FFF4E5", border: "0.5px solid #F0997B", borderRadius: "8px", padding: "8px 12px", fontSize: "12px", color: "#993C1D", marginBottom: "1rem" }}>
          ✨ This content was AI-generated. Review and save to confirm.
        </div>
      )}

      {features.map((f, i) => (
        <div key={i} style={{ background: "#FAF7F0", border: "0.5px solid #E4DFD2", borderRadius: "8px", padding: "12px", marginBottom: "10px" }}>
          <input
            type="text"
            value={f.title}
            onChange={(e) => updateFeature(i, "title", e.target.value)}
            placeholder="Feature title"
            style={{ width: "100%", padding: "6px 10px", border: "1px solid #E4DFD2", borderRadius: "6px", marginBottom: "6px", fontWeight: 500 }}
          />
          <textarea
            value={f.description}
            onChange={(e) => updateFeature(i, "description", e.target.value)}
            placeholder="Feature description"
            rows={2}
            style={{ width: "100%", padding: "6px 10px", border: "1px solid #E4DFD2", borderRadius: "6px", fontFamily: "inherit" }}
          />
          <button onClick={() => removeFeature(i)} style={{ marginTop: "6px", background: "none", border: "none", color: "#993C1D", fontSize: "12px", cursor: "pointer" }}>
            Remove
          </button>
        </div>
      ))}

      <button onClick={addFeature} style={{ padding: "8px 14px", background: "#fff", border: "1px dashed #B4B2A9", borderRadius: "8px", fontSize: "13px", color: "#5F5E5A", cursor: "pointer", marginBottom: "1.5rem" }}>
        + Add feature
      </button>

      <div>
        <button
          onClick={() => save({ features }, "features")}
          disabled={saving}
          style={{ padding: "10px 20px", background: "#D85A30", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 500, cursor: "pointer" }}
        >
          {saving ? "Saving..." : saved ? "Saved ✓" : "Save changes"}
        </button>
      </div>
    </div>
  );
}