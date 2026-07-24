import { getHealthScore } from "@/lib/health-score";

const SECTION_LABELS: Record<string, string> = {
  overview: "Overview",
  features: "Features",
  architecture: "Architecture",
  setup: "Setup",
  documentation: "Documentation",
  resources: "Resources",
  devNotes: "Dev Notes",
  interviewNotes: "Interview Notes",
};

export default function HealthScore({ project }: { project: any }) {
  const { status, percentage } = getHealthScore(project);

  return (
    <div style={{ background: "rgba(255,255,255,0.55)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", border: "1px solid rgba(255,255,255,0.6)", borderRadius: "16px", padding: "16px", marginBottom: "16px", boxShadow: "0 4px 24px rgba(44,44,42,0.06)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
        <span style={{ fontSize: "13px", color: "#5F5E5A" }}>Documentation Health</span>
        <span style={{ fontSize: "16px", fontWeight: 600, color: "#D85A30" }}>{percentage}%</span>
      </div>

      <div style={{ height: "6px", background: "#EEEDFE", borderRadius: "3px", overflow: "hidden", marginBottom: "10px" }}>
        <div style={{ width: `${percentage}%`, height: "100%", background: "linear-gradient(90deg, #D85A30, #F0997B)", transition: "width 0.3s" }} />
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
        {Object.entries(status).map(([key, done]) => (
          <span
            key={key}
            style={{
              fontSize: "11px",
              padding: "2px 8px",
              borderRadius: "20px",
              background: done ? "#EAF3DE" : "#FBEAEA",
              color: done ? "#27500A" : "#993C1D",
            }}
          >
            {done ? "✓" : "✕"} {SECTION_LABELS[key]}
          </span>
        ))}
      </div>
    </div>
  );
}