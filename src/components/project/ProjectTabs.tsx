"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { key: "overview", label: "Overview" },
  { key: "features", label: "Features" },
  { key: "architecture", label: "Architecture" },
  { key: "setup", label: "Setup" },
  { key: "documentation", label: "Documentation" },
  { key: "resources", label: "Resources" },
  { key: "dev-notes", label: "Dev Notes" },
  { key: "interview-notes", label: "Interview Notes" },
  { key: "ai-assistant", label: "AI Assistant" },
];

export default function ProjectTabs({ projectId }: { projectId: string }) {
  const pathname = usePathname();

  return (
    <div style={{ display: "flex", overflowX: "auto" }}>
      {TABS.map((tab) => {
        const href = `/projects/${projectId}/${tab.key}`;
        const isActive = pathname === href;

        return (
          <Link
            key={tab.key}
            href={href}
            style={{
              background: isActive ? "#D85A30" : "#fff",
              color: isActive ? "#4A1B0C" : "#5F5E5A",
              fontSize: "12px",
              fontWeight: isActive ? 500 : 400,
              padding: "8px 14px",
              borderRadius: "8px 8px 0 0",
              marginRight: "2px",
              textDecoration: "none",
              whiteSpace: "nowrap",
              border: "0.5px solid #E4DFD2",
              borderBottom: "none",
            }}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}