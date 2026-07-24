"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Invalid email or password");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#FAF7F0" }}>
      <form onSubmit={handleSubmit} style={{ background: "#fff", padding: "2rem", borderRadius: "12px", border: "1px solid #E4DFD2", width: "360px" }}>
        <h1 style={{ fontSize: "20px", marginBottom: "1.5rem", color: "#2C2C2A" }}>Welcome back</h1>

        {error && (
          <p style={{ color: "#993C1D", fontSize: "13px", marginBottom: "1rem" }}>{error}</p>
        )}

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
            style={{ width: "100%", padding: "8px 12px", border: "1px solid #E4DFD2", borderRadius: "8px" }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{ width: "100%", padding: "10px", background: "#D85A30", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 500, cursor: "pointer" }}
        >
          {loading ? "Logging in..." : "Log in"}
        </button>

        <p style={{ fontSize: "13px", marginTop: "1rem", color: "#5F5E5A", textAlign: "center" }}>
          Don't have an account? <Link href="/register" style={{ color: "#D85A30" }}>Register</Link>
        </p>
      </form>
    </div>
  );
}