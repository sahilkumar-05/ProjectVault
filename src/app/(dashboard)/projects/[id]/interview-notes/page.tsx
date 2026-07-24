"use client";

import { useState } from "react";
import { useProject } from "@/hooks/useProject";

type QA = { q: string; a: string };

export default function InterviewNotesPage() {
  const { project, setProject, saving, saved, save, loading, id } = useProject();
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  if (loading || !project) {
    return (
      <div style={{ height: "120px", background: "#FAF7F0", borderRadius: "8px", animation: "pulse 1.5s ease-in-out infinite" }} />
    );
  }

  const questions: QA[] = project.commonQuestions || [];

  const updateQ = (i: number, key: keyof QA, value: string) => {
    const updated = [...questions];
    updated[i] = { ...updated[i], [key]: value };
    setProject({ ...project, commonQuestions: updated });
  };
  const addQ = () => setProject({ ...project, commonQuestions: [...questions, { q: "", a: "" }] });
  const removeQ = (i: number) => setProject({ ...project, commonQuestions: questions.filter((_, idx) => idx !== i) });

  const handleGenerate = async () => {
    setGenerating(true);
    setError("");

    const res = await fetch("/api/ai/interview-prep", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId: id }),
    });

    const data = await res.json();
    setGenerating(false);

    if (!res.ok) {
      setError(data.error || "Something went wrong");
      return;
    }

    setProject({
      ...project,
      ...data.generated,
      aiGeneratedFields: [...(project.aiGeneratedFields || []).filter((k: string) => k !== "interviewNotes"), "interviewNotes"],
    });
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <p style={{ fontSize: "13px", color: "#888780" }}>
          Prepare to explain this project confidently in interviews.
        </p>
        <button
          onClick={handleGenerate}
          disabled={generating}
          style={{ padding: "8px 16px", background: "#D85A30", color: "#fff", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap" }}
        >
          {generating ? "Generating..." : "✨ Generate with AI"}
        </button>
      </div>

      {error && <p style={{ fontSize: "12px", color: "#993C1D", marginBottom: "1rem" }}>{error}</p>}

      {project.aiGeneratedFields?.includes("interviewNotes") && (
        <div style={{ background: "#FFF4E5", border: "0.5px solid #F0997B", borderRadius: "8px", padding: "8px 12px", fontSize: "12px", color: "#993C1D", marginBottom: "1rem" }}>
          ✨ This content was AI-generated. Review and save to confirm.
        </div>
      )}

      <div style={{ marginBottom: "1.5rem" }}>
        <label style={{ display: "block", fontSize: "13px", marginBottom: "4px", color: "#5F5E5A" }}>HR explanation</label>
        <textarea
          value={project.hrExplanation || ""}
          onChange={(e) => setProject({ ...project, hrExplanation: e.target.value })}
          rows={3}
          style={{ width: "100%", padding: "8px 12px", border: "1px solid #E4DFD2", borderRadius: "8px", fontFamily: "inherit" }}
        />
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <label style={{ display: "block", fontSize: "13px", marginBottom: "4px", color: "#5F5E5A" }}>Technical explanation</label>
        <textarea
          value={project.technicalExplanation || ""}
          onChange={(e) => setProject({ ...project, technicalExplanation: e.target.value })}
          rows={3}
          style={{ width: "100%", padding: "8px 12px", border: "1px solid #E4DFD2", borderRadius: "8px", fontFamily: "inherit" }}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "12px", marginBottom: "1.5rem" }}>
        <div>
          <label style={{ display: "block", fontSize: "13px", marginBottom: "4px", color: "#5F5E5A" }}>30-second explanation</label>
          <textarea
            value={project.explanation30s || ""}
            onChange={(e) => setProject({ ...project, explanation30s: e.target.value })}
            rows={3}
            style={{ width: "100%", padding: "8px 12px", border: "1px solid #E4DFD2", borderRadius: "8px", fontFamily: "inherit" }}
          />
        </div>
        <div>
          <label style={{ display: "block", fontSize: "13px", marginBottom: "4px", color: "#5F5E5A" }}>2-minute explanation</label>
          <textarea
            value={project.explanation2m || ""}
            onChange={(e) => setProject({ ...project, explanation2m: e.target.value })}
            rows={3}
            style={{ width: "100%", padding: "8px 12px", border: "1px solid #E4DFD2", borderRadius: "8px", fontFamily: "inherit" }}
          />
        </div>
      </div>

      <label style={{ display: "block", fontSize: "13px", marginBottom: "4px", color: "#5F5E5A" }}>Common questions</label>
      {questions.map((qa, i) => (
        <div key={i} style={{ background: "#FAF7F0", border: "0.5px solid #E4DFD2", borderRadius: "8px", padding: "10px", marginBottom: "8px" }}>
          <input
            type="text"
            value={qa.q}
            onChange={(e) => updateQ(i, "q", e.target.value)}
            placeholder="Question"
            style={{ width: "100%", padding: "6px 10px", border: "1px solid #E4DFD2", borderRadius: "6px", marginBottom: "6px", fontWeight: 500 }}
          />
          <textarea
            value={qa.a}
            onChange={(e) => updateQ(i, "a", e.target.value)}
            placeholder="Answer"
            rows={2}
            style={{ width: "100%", padding: "6px 10px", border: "1px solid #E4DFD2", borderRadius: "6px", fontFamily: "inherit" }}
          />
          <button onClick={() => removeQ(i)} style={{ marginTop: "6px", background: "none", border: "none", color: "#993C1D", fontSize: "12px", cursor: "pointer" }}>
            Remove
          </button>
        </div>
      ))}
      <button onClick={addQ} style={{ padding: "8px 14px", background: "#fff", border: "1px dashed #B4B2A9", borderRadius: "8px", fontSize: "13px", color: "#5F5E5A", cursor: "pointer", marginBottom: "1.5rem" }}>
        + Add question
      </button>

      <button
        onClick={() =>
          save(
            {
              hrExplanation: project.hrExplanation,
              technicalExplanation: project.technicalExplanation,
              explanation30s: project.explanation30s,
              explanation2m: project.explanation2m,
              commonQuestions: questions,
            },
            "interviewNotes"
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