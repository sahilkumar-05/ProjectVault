"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSectionStatus } from "@/lib/health-score";

const SECTION_LABELS: Record<string, string> = {
  overview: "Overview",
  features: "Features",
  setup: "Setup",
  devNotes: "Dev Notes",
  interviewNotes: "Interview Notes",
};

// Only these 5 sections are AI-generatable per spec
const GENERATABLE = ["overview", "features", "setup", "devNotes", "interviewNotes"];

export default function AIGenerator({ project }: { project: any }) {
  const router = useRouter();
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  const status = getSectionStatus(project);
  const missing = GENERATABLE.filter((key) => !status[key as keyof typeof status]);

  if (missing.length === 0) return null;

  const handleGenerate = async () => {
    setGenerating(true);
    setError("");

    const res = await fetch("/api/ai/generate-docs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId: project.id, sections: missing }),
    });

    const data = await res.json();
    setGenerating(false);

    if (!res.ok) {
      setError(data.error || "Something went wrong");
      return;
    }

    // Flatten generated sections into project fields
    const updateData: Record<string, any> = {};
    const newAiFields: string[] = [...(project.aiGeneratedFields || [])];

    if (data.generated.overview) {
      Object.assign(updateData, data.generated.overview);
      if (!newAiFields.includes("overview")) newAiFields.push("overview");
    }
    if (data.generated.features) {
      updateData.features = data.generated.features;
      if (!newAiFields.includes("features")) newAiFields.push("features");
    }
    if (data.generated.setup) {
      Object.assign(updateData, data.generated.setup);
      if (!newAiFields.includes("setup")) newAiFields.push("setup");
    }
    if (data.generated.devNotes) {
      Object.assign(updateData, data.generated.devNotes);
      if (!newAiFields.includes("devNotes")) newAiFields.push("devNotes");
    }
    if (data.generated.interviewNotes) {
      Object.assign(updateData, data.generated.interviewNotes);
      if (!newAiFields.includes("interviewNotes")) newAiFields.push("interviewNotes");
    }

    updateData.aiGeneratedFields = newAiFields;

    await fetch(`/api/projects/${project.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateData),
    });

    router.refresh();
  };

  return (
    <div style={{ background: "#fff", border: "0.5px solid #E4DFD2", borderRadius: "12px", padding: "14px", marginBottom: "16px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontSize: "13px", color: "#2C2C2A", marginBottom: "2px" }}>
            {missing.length} section{missing.length > 1 ? "s" : ""} missing:{" "}
            <span style={{ color: "#888780" }}>
              {missing.map((m) => SECTION_LABELS[m]).join(", ")}
            </span>
          </p>
          {error && <p style={{ fontSize: "12px", color: "#993C1D" }}>{error}</p>}
        </div>
        <button
          onClick={handleGenerate}
          disabled={generating}
          style={{ padding: "8px 16px", background: "#D85A30", color: "#fff", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap" }}
        >
          {generating ? "Generating..." : "✨ Complete with AI"}
        </button>
      </div>
    </div>
  );
}