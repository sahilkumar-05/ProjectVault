"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewProjectPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [techStackInput, setTechStackInput] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const techStack = techStackInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description, techStack, githubUrl }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Something went wrong");
      return;
    }

    router.push(`/projects/${data.id}/overview`);
  };

  return (
    <div style={{ maxWidth: "480px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "20px", color: "#2C2C2A", marginBottom: "1.5rem" }}>
        Create a new project
      </h1>

      <form onSubmit={handleSubmit} style={{ background: "#fff", border: "0.5px solid #E4DFD2", borderRadius: "12px", padding: "1.5rem" }}>
        {error && (
          <p style={{ color: "#993C1D", fontSize: "13px", marginBottom: "1rem" }}>{error}</p>
        )}

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", fontSize: "13px", marginBottom: "4px", color: "#5F5E5A" }}>
            Project name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: "100%", padding: "8px 12px", border: "1px solid #E4DFD2", borderRadius: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", fontSize: "13px", marginBottom: "4px", color: "#5F5E5A" }}>
            Short description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            required
            style={{ width: "100%", padding: "8px 12px", border: "1px solid #E4DFD2", borderRadius: "8px", fontFamily: "inherit" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", fontSize: "13px", marginBottom: "4px", color: "#5F5E5A" }}>
            Tech stack (comma separated)
          </label>
          <input
            type="text"
            value={techStackInput}
            onChange={(e) => setTechStackInput(e.target.value)}
            required
            placeholder="Next.js, PostgreSQL, Tailwind"
            style={{ width: "100%", padding: "8px 12px", border: "1px solid #E4DFD2", borderRadius: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", fontSize: "13px", marginBottom: "4px", color: "#5F5E5A" }}>
            GitHub URL (optional)
          </label>
          <input
            type="url"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            placeholder="https://github.com/username/repo"
            style={{ width: "100%", padding: "8px 12px", border: "1px solid #E4DFD2", borderRadius: "8px" }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{ padding: "10px 20px", background: "#D85A30", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 500, cursor: "pointer" }}
        >
          {loading ? "Creating..." : "Create project"}
        </button>
      </form>
    </div>
  );
}