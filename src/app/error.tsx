"use client";

import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#FAF7F0",
        padding: "24px",
        textAlign: "center",
      }}
    >
      <h1
        style={{
          fontSize: "18px",
          color: "#2C2C2A",
          marginBottom: "8px",
        }}
      >
        Something went wrong
      </h1>

      <p
        style={{
          fontSize: "13px",
          color: "#888780",
          marginBottom: "20px",
          maxWidth: "400px",
        }}
      >
        An unexpected error occurred. You can try again, or head back to your
        dashboard.
      </p>

      <div style={{ display: "flex", gap: "10px" }}>
        <button
          onClick={reset}
          style={{
            padding: "10px 20px",
            background: "#D85A30",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Try again
        </button>

        <Link
          href="/dashboard"
          style={{
            padding: "10px 20px",
            background: "#E4DFD2",
            color: "#2C2C2A",
            borderRadius: "8px",
            fontWeight: 500,
            textDecoration: "none",
          }}
        >
          Go to dashboard
        </Link>
      </div>
    </div>
  );
}