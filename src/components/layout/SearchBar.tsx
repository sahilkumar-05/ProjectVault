"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Project = {
  id: string;
  name: string;
  techStack: string[];
};

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then(setAllProjects);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const results = query.trim()
    ? allProjects.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.techStack.some((t) => t.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  const goToProject = (id: string) => {
    setQuery("");
    setOpen(false);
    router.push(`/projects/${id}/overview`);
  };

  return (
    <div ref={wrapperRef} style={{ position: "relative", width: "100%", maxWidth: "280px" }}>
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder="Search by name or tech..."
        style={{
          width: "100%",
          padding: "8px 14px",
          borderRadius: "10px",
          border: "1px solid rgba(216,90,48,0.25)",
          fontSize: "13px",
          background: "rgba(216,210,255,0.06)",
          backdropFilter: "blur(8px)",
          color: "#000000",
        }}
      />

      {open && query.trim() && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            right: 0,
            background: "rgba(40,12,16,0.95)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(216,90,48,0.25)",
            borderRadius: "10px",
            overflow: "hidden",
            zIndex: 30,
            maxHeight: "260px",
            overflowY: "auto",
          }}
        >
          {results.length === 0 ? (
            <p style={{ padding: "12px 14px", fontSize: "13px", color: "#888780" }}>
              No projects match "{query}"
            </p>
          ) : (
            results.map((p) => (
              <button
                key={p.id}
                onClick={() => goToProject(p.id)}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  padding: "10px 14px",
                  background: "none",
                  border: "none",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                  cursor: "pointer",
                  color: "#ffffff",
                  fontSize: "13px",
                }}
              >
                <span style={{ fontWeight: 500 }}>{p.name}</span>
                {p.techStack.length > 0 && (
                  <span style={{ color: "#888780", fontSize: "12px" }}> — {p.techStack.join(", ")}</span>
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}