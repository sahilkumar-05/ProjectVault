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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#FDFCF8] p-6 font-[Outfit] text-[#292524]">
      <FontsAndGrain />
      <Blob className="right-[-120px] top-[-140px] h-[380px] w-[380px] bg-[#EFEDF4]" duration="7s" />
      <Blob className="bottom-[-140px] left-[-120px] h-[360px] w-[360px] bg-[#FFE4E1]" duration="8s" delay="1s" />

      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-[360px] rounded-3xl border border-white/60 bg-white/70 p-8 shadow-[0_4px_24px_rgba(44,44,42,0.06)] backdrop-blur-[14px]"
      >
        <div className="mb-6 flex items-center gap-2">
          <span className="relative flex h-6 w-6 items-center justify-center rounded-full bg-[#D85A30]">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
          </span>
          <span className="text-sm font-medium">ProjectVault</span>
        </div>

        <h1 className="mb-6 text-xl font-semibold tracking-[-0.02em]">
          Create your <span className="font-[Reenie_Beanie] text-3xl font-normal text-[#D85A30]">vault</span>
        </h1>

        {error && <p className="mb-4 text-[13px] text-[#993C1D]">{error}</p>}

        <div className="mb-4">
          <label className="mb-1 block text-[13px] text-[#78716C]">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm outline-none transition-colors focus-visible:border-[#D85A30] focus-visible:ring-2 focus-visible:ring-[#D85A30]/20"
          />
        </div>

        <div className="mb-4">
          <label className="mb-1 block text-[13px] text-[#78716C]">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm outline-none transition-colors focus-visible:border-[#D85A30] focus-visible:ring-2 focus-visible:ring-[#D85A30]/20"
          />
        </div>

        <div className="mb-6">
          <label className="mb-1 block text-[13px] text-[#78716C]">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm outline-none transition-colors focus-visible:border-[#D85A30] focus-visible:ring-2 focus-visible:ring-[#D85A30]/20"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-[#D85A30] py-2.5 text-sm font-medium text-white transition-transform hover:scale-[1.02] disabled:opacity-70"
        >
          {loading ? "Creating..." : "Create account"}
        </button>

        <p className="mt-4 text-center text-[13px] text-[#78716C]">
          Already have an account?{" "}
          <Link href="/login" className="text-[#D85A30]">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}

function Blob({
  className,
  duration,
  delay = "0s",
}: {
  className: string;
  duration: string;
  delay?: string;
}) {
  return (
    <div
      className={`pointer-events-none absolute z-0 rounded-full opacity-50 blur-[70px] ${className}`}
      style={{ animation: `register-float ${duration} ease-in-out infinite`, animationDelay: delay }}
    />
  );
}

function FontsAndGrain() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600&family=Reenie+Beanie&display=swap');

        @keyframes register-float {
          0%, 100% { transform: translateY(-10px); }
          50% { transform: translateY(10px); }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; }
        }
      `}</style>
      <svg className="pointer-events-none fixed inset-0 z-50 h-0 w-0">
        <filter id="register-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="2" stitchTiles="stitch" />
        </filter>
      </svg>
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.35] mix-blend-overlay"
        style={{ filter: "url(#register-grain)" }}
      />
    </>
  );
}