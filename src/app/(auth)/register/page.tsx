"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Something went wrong");
      return;
    }

    router.push("/login");
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#FAF7F0" }}>
      <form onSubmit={handleSubmit} style={{ background: "#fff", padding: "2rem", borderRadius: "12px", border: "1px solid #E4DFD2", width: "360px" }}>
        <h1 style={{ fontSize: "20px", marginBottom: "1.5rem", color: "#2C2C2A" }}>Create your account</h1>

        {error && (
          <p style={{ color: "#993C1D", fontSize: "13px", marginBottom: "1rem" }}>{error}</p>
        )}

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", fontSize: "13px", marginBottom: "4px", color: "#5F5E5A" }}>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: "100%", padding: "8px 12px", border: "1px solid #E4DFD2", borderRadius: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", fontSize: "13px", marginBottom: "4px", color: "#5F5E5A" }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: "8px 12px", border: "1px solid #E4DFD2", borderRadius: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", fontSize: "13px", marginBottom: "4px", color: "#5F5E5A" }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            style={{ width: "100%", padding: "8px 12px", border: "1px solid #E4DFD2", borderRadius: "8px" }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{ width: "100%", padding: "10px", background: "#D85A30", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 500, cursor: "pointer" }}
        >
          {loading ? "Creating..." : "Create account"}
        </button>

        <p style={{ fontSize: "13px", marginTop: "1rem", color: "#5F5E5A", textAlign: "center" }}>
          Already have an account? <Link href="/login" style={{ color: "#D85A30" }}>Log in</Link>
        </p>
      </form>
    </div>
  );
}