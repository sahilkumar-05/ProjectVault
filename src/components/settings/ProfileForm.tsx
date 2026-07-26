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

  const dirty = name.trim() !== user.name;

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

  const memberSince = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const initial = user.name.charAt(0).toUpperCase();

  return (
    <div className="rounded-3xl border border-stone-100 bg-white p-7 font-[Outfit] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]">
      {/* Identity row */}
      <div className="mb-8 flex flex-wrap items-center gap-4">
        <div className="relative flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full bg-[#D85A30] text-2xl font-semibold text-white ring-4 ring-[#FFE4E1]">
          {initial}
        </div>
        <div>
          <p className="mb-0.5 text-[17px] font-semibold text-[#292524]">{user.name}</p>
          <p className="text-[13px] text-[#78716C]">Member since {memberSince}</p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 flex items-center gap-2 rounded-xl border border-[#F3D6C8] bg-[#FFF4EF] px-4 py-2.5 text-[13px] text-[#993C1D]">
          <ErrorIcon className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Fields */}
      <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-[13px] font-medium text-[#5F5E5A]">Full name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-stone-200 bg-[#FDFCF8] px-3.5 py-2.5 text-sm text-[#292524] outline-none transition-colors focus:border-[#D85A30] focus:ring-2 focus:ring-[#FFE4E1]"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-[13px] font-medium text-[#5F5E5A]">Email address</label>
          <input
            type="email"
            value={user.email}
            disabled
            className="w-full cursor-not-allowed rounded-xl border border-stone-200 bg-[#FAF7F0] px-3.5 py-2.5 text-sm text-[#A8A29E]"
          />
          <p className="mt-1.5 text-[11px] text-[#B4B2A9]">Email can&apos;t be changed</p>
        </div>
      </div>

      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={saving || !dirty}
        className="inline-flex items-center gap-2 rounded-full bg-[#D85A30] px-6 py-2.5 text-sm font-medium text-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] transition-all hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
      >
        {saving && <SpinnerIcon className="h-3.5 w-3.5 animate-spin" />}
        {saved && !saving && <CheckIcon className="h-3.5 w-3.5" />}
        {saving ? "Saving…" : saved ? "Saved" : "Save changes"}
      </button>
    </div>
  );
}

function SpinnerIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function ErrorIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v5" />
      <path d="M12 16h.01" />
    </svg>
  );
}