"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type User = { name: string; email: string; createdAt: string };

export default function ProfileForm({ user }: { user: User }) {
  const router = useRouter();
  const [name, setName] = useState(user.name);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!name.trim()) {
      setError("Name can't be empty");
      return;
    }
    setError("");
    setSaving(true);
    const res = await fetch("/api/user", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    setSaving(false);

    if (!res.ok) {
      setError("Something went wrong");
      return;
    }

    setSaved(true);
    router.refresh();
    setTimeout(() => setSaved(false), 2000);
  };

  const memberSince = new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const initial = user.name.charAt(0).toUpperCase();

  return (
    <div style={{ background: "#fff", border: "0.5px solid #E4DFD2", borderRadius: "12px", padding: "28px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "28px", flexWrap: "wrap" }}>
        <div
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "50%",
            background: "#D85A30",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: "28px",
            fontWeight: 600,
            flexShrink: 0,
          }}
        >
          {initial}
        </div>
        <div>
          <p style={{ fontSize: "17px", fontWeight: 600, color: "#2C2C2A", marginBottom: "2px" }}>
            {user.name}
          </p>
          <p style={{ fontSize: "13px", color: "#888780" }}>Member since {memberSince}</p>
        </div>
      </div>

      {error && (
        <p style={{ color: "#993C1D", fontSize: "13px", marginBottom: "1rem" }}>{error}</p>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "1.5rem" }}>
        <div>
          <label style={{ display: "block", fontSize: "13px", marginBottom: "6px", color: "#5F5E5A", fontWeight: 500 }}>
            Full name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: "100%", padding: "10px 14px", border: "1px solid #E4DFD2", borderRadius: "8px", fontSize: "14px" }}
          />
        </div>

        <div>
          <label style={{ display: "block", fontSize: "13px", marginBottom: "6px", color: "#5F5E5A", fontWeight: 500 }}>
            Email address
          </label>
          <input
            type="email"
            value={user.email}
            disabled
            style={{ width: "100%", padding: "10px 14px", border: "1px solid #E4DFD2", borderRadius: "8px", background: "#FAF7F0", color: "#888780", cursor: "not-allowed", fontSize: "14px" }}
          />
          <p style={{ fontSize: "11px", color: "#B4B2A9", marginTop: "4px" }}>Email can't be changed</p>
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        style={{
          padding: "10px 24px",
          background: "#D85A30",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          fontWeight: 500,
          fontSize: "14px",
          cursor: "pointer",
        }}
      >
        {saving ? "Saving..." : saved ? "Saved ✓" : "Save changes"}
      </button>
    </div>
  );
}