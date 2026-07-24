"use client";
import { useEffect, useState } from "react";
import { useProject } from "@/hooks/useProject";


type LinkItem = { label: string; url: string };

export default function ResourcesPage() {
  const { project, setProject, saving, saved, save, loading } = useProject();
  const [files, setFiles] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (project?.id) {
      fetch(`/api/files?projectId=${project.id}`)
        .then((res) => res.json())
        .then(setFiles);
    }
  }, [project?.id]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !project?.id) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("projectId", project.id);

    const res = await fetch("/api/files", { method: "POST", body: formData });
    const newFile = await res.json();
    setUploading(false);

    if (res.ok) {
      setFiles([newFile, ...files]);
    }

    e.target.value = ""; // reset so the same or a new file can be selected again
  };


  const handleFileDelete = async (fileId: string) => {
    await fetch(`/api/files/${fileId}`, { method: "DELETE" });
    setFiles(files.filter((f) => f.id !== fileId));
  };

  if (loading || !project) {
    return (
      <div style={{ height: "120px", background: "#FAF7F0", borderRadius: "8px", animation: "pulse 1.5s ease-in-out infinite" }} />
    );
  }

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

      <div style={{ marginBottom: "1.5rem" }}>
        <label style={{ display: "block", fontSize: "13px", marginBottom: "6px", color: "#5F5E5A" }}>
          Images & PDFs
        </label>

        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={handleFileUpload}
          disabled={uploading}
          style={{ fontSize: "13px", marginBottom: "10px" }}
        />
        {uploading && <p style={{ fontSize: "12px", color: "#888780" }}>Uploading...</p>}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginTop: "10px" }}>
          {files.map((file) => (
            <div key={file.id} style={{ border: "0.5px solid #E4DFD2", borderRadius: "8px", padding: "8px", position: "relative" }}>
              {file.type === "image" ? (
                <a href={file.url} target="_blank" rel="noopener noreferrer">
                  <img src={file.url} alt={file.filename} style={{ width: "100%", height: "80px", objectFit: "cover", borderRadius: "6px", cursor: "pointer" }} />
                </a>
              ) : (
                <a href={file.url} target="_blank" rel="noopener noreferrer" style={{ display: "block", fontSize: "12px", color: "#0C447C", padding: "20px 0", textAlign: "center" }}>
                  📄 {file.filename}
                </a>
              )}
              <button
                onClick={() => handleFileDelete(file.id)}
                style={{ position: "absolute", top: "4px", right: "4px", background: "rgba(255,255,255,0.9)", border: "none", borderRadius: "50%", width: "20px", height: "20px", fontSize: "11px", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
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