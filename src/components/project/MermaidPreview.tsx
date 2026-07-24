"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

mermaid.initialize({ startOnLoad: false, theme: "neutral" });

export default function MermaidPreview({ code }: { code: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!code.trim()) {
      if (ref.current) ref.current.innerHTML = "";
      return;
    }
    const id = `mermaid-${Math.random().toString(36).slice(2)}`;
    mermaid
      .render(id, code)
      .then(({ svg }) => {
        setError("");
        if (ref.current) ref.current.innerHTML = svg;
      })
      .catch(() => setError("Invalid diagram syntax"));
  }, [code]);

  if (!code.trim()) return null;

  return (
    <div style={{ marginTop: "8px", padding: "12px", background: "#FAF7F0", border: "0.5px solid #E4DFD2", borderRadius: "8px" }}>
      {error ? <p style={{ fontSize: "12px", color: "#993C1D" }}>{error}</p> : <div ref={ref} />}
    </div>
  );
}