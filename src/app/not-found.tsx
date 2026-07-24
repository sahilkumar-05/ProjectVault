import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#FAF7F0", padding: "24px", textAlign: "center" }}>
      <h1 style={{ fontSize: "48px", color: "#D85A30", fontWeight: 600, marginBottom: "8px" }}>404</h1>
      <p style={{ fontSize: "14px", color: "#888780", marginBottom: "20px" }}>
        This page — or project — doesn't exist.
      </p>
      <Link
        href="/dashboard"
        style={{ padding: "10px 20px", background: "#D85A30", color: "#fff", borderRadius: "8px", fontWeight: 500, textDecoration: "none" }}
      >
        Back to dashboard
      </Link>
    </div>
  );
}