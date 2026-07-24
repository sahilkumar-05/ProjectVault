"use client";

import { useProject } from "@/hooks/useProject";

type LinkItem = { label: string; url: string };

export default function ResourcesPage() {
  const { project, setProject, saving, saved, save, loading } = useProject();
  if (loading || !project) return <p style={{ color: "#888780", fontSize: "13px" }}>Loading...</p>;

  const links: LinkItem[] = project.links || [];

  const updateLink = (i: number, key: keyof LinkItem, value: string) => {
    const updated = [...links];
    updated[i] = { ...updated[i], [key]: value };
    setProject({ ...project, links: updated });
  };

  const addLink = () => setProject({ ...project, links: [...links, { label: "", url: "" }] });
  const removeLink = (i: number) => setProject({ ...project, links: links.filter((_, idx) => idx !== i) });

  return (
    <div>
      <div style={{ marginBottom: "1rem" }}>
        <label style={{ display: "block", fontSize: "13px", marginBottom: "4px", color: "#5F5E5A" }}>GitHub repository</label>
        <input
          type="url"
          value={project.githubUrl || ""}
          onChange={(e) => setProject({ ...project, githubUrl: e.target.value })}
          style={{ width: "100%", padding: "8px 12px", border: "1px solid #E4DFD2", borderRadius: "8px" }}
        />
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <label style={{ display: "block", fontSize: "13px", marginBottom: "4px", color: "#5F5E5A" }}>Live URL</label>
        <input
          type="url"
          value={project.liveUrl || ""}
          onChange={(e) => setProject({ ...project, liveUrl: e.target.value })}
          style={{ width: "100%", padding: "8px 12px", border: "1px solid #E4DFD2", borderRadius: "8px" }}
        />
      </div>

      <label style={{ display: "block", fontSize: "13px", marginBottom: "4px", color: "#5F5E5A" }}>Other links</label>
      {links.map((link, i) => (
        <div key={i} style={{ display: "flex", gap: "6px", marginBottom: "6px" }}>
          <input
            type="text"
            value={link.label}
            onChange={(e) => updateLink(i, "label", e.target.value)}
            placeholder="Label"
            style={{ flex: 1, padding: "6px 10px", border: "1px solid #E4DFD2", borderRadius: "6px" }}
          />
          <input
            type="url"
            value={link.url}
            onChange={(e) => updateLink(i, "url", e.target.value)}
            placeholder="URL"
            style={{ flex: 2, padding: "6px 10px", border: "1px solid #E4DFD2", borderRadius: "6px" }}
          />
          <button onClick={() => removeLink(i)} style={{ background: "none", border: "none", color: "#993C1D", cursor: "pointer" }}>✕</button>
        </div>
      ))}
      <button onClick={addLink} style={{ padding: "6px 12px", background: "#fff", border: "1px dashed #B4B2A9", borderRadius: "8px", fontSize: "12px", color: "#5F5E5A", cursor: "pointer", marginBottom: "1.5rem" }}>
        + Add link
      </button>

      <div style={{ padding: "12px", background: "#FAF7F0", border: "0.5px dashed #B4B2A9", borderRadius: "8px", fontSize: "12px", color: "#888780", marginBottom: "1.5rem" }}>
        Image & PDF uploads will be added in the next module.
      </div>

      <button
        onClick={() => save({ githubUrl: project.githubUrl, liveUrl: project.liveUrl, links })}
        disabled={saving}
        style={{ padding: "10px 20px", background: "#D85A30", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 500, cursor: "pointer" }}
      >
        {saving ? "Saving..." : saved ? "Saved ✓" : "Save changes"}
      </button>
    </div>
  );
}