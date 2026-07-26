import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import StepsRibbon from "./StepsRibbon";

const FEATURES = [
  { title: "9 sections per project", desc: "Overview, architecture, setup, docs, resources, dev notes, interview notes, and more." },
  { title: "AI Documentation Generator", desc: "Missing a section? AI fills it in based on what you've already written — you review and approve." },
  { title: "Project-specific AI chat", desc: "Ask your own project questions. It only knows what you told it — nothing more, nothing less." },
  { title: "Interview prep, built in", desc: "Generate HR and technical explanations, plus a 30-second and 2-minute pitch, on demand." },
];

const CHAT_EXCHANGE = [
  { role: "user", text: "Why did I use Redis for the queue instead of just Postgres?" },
  {
    role: "ai",
    text: "Per your dev notes: job volume spiked past 400/min during testing, and you needed sub-ms enqueue times. You benchmarked both — Postgres LISTEN/NOTIFY added ~40ms latency under load, Redis stayed flat.",
  },
];

export default async function LandingPage() {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#FDFCF8] font-[Outfit] text-[#292524]">
      <FontsAndGrain />

      {/* NAV */}
      <div className="sticky top-4 z-40 flex justify-center px-4">
        <nav className="flex w-full max-w-md items-center justify-between rounded-full border border-white/60 bg-white/70 px-3 py-2 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] backdrop-blur-[20px]">
          <div className="flex items-center gap-2 pl-2">
            <span className="relative flex h-6 w-6 items-center justify-center rounded-full bg-[#D85A30]">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
            </span>
            <span className="text-sm font-medium">ProjectVault</span>
          </div>
          <div className="flex items-center gap-1">
            <Link href="/login" className="rounded-full px-4 py-2 text-sm text-[#78716C] hover:text-[#292524]">
              Log in
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-[#D85A30] px-4 py-2 text-sm font-medium text-white transition-transform hover:scale-105"
            >
              Get started
            </Link>
          </div>
        </nav>
      </div>

      {/* HERO */}
      <section className="relative flex flex-col items-center px-6 pb-28 pt-24 text-center">
        <Blob className="left-1/2 top-[-140px] h-[420px] w-[420px] -translate-x-[65%] bg-[#FFE4E1]" duration="6s" />
        <Blob className="left-1/2 top-[-80px] h-[380px] w-[380px] -translate-x-[20%] bg-[#E6E6FA]" duration="7s" delay="1.2s" />

        <p className="relative z-10 mb-5 text-xs uppercase tracking-[0.2em] text-[#78716C]">
          Your Developer Memory System
        </p>
        <h1 className="relative z-10 max-w-2xl text-[clamp(32px,7vw,56px)] font-semibold leading-[1.15] tracking-[-0.025em]">
          GitHub stores code.
          <br />
          <span className="font-[Reenie_Beanie] text-6xl font-normal text-[#D85A30] sm:text-7xl">
            ProjectVault
          </span>{" "}
          stores knowledge.
        </h1>
        <p className="relative z-10 mx-auto mt-5 max-w-[560px] text-base leading-relaxed text-[#78716C]">
          Every project you build has a story — why you built it, how it works, what you learned.
          Six months later, you've forgotten all of it. ProjectVault remembers so you don't have to.
        </p>
        <Link
          href="/register"
          className="relative z-10 mt-8 inline-block rounded-full bg-[#D85A30] px-8 py-3.5 text-sm font-medium text-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] transition-transform hover:scale-[1.03]"
        >
          Start your vault →
        </Link>
      </section>

      {/* PROBLEM */}
      <section className="relative border-t border-stone-100 px-6 py-24 text-center">
        <Blob className="left-[20%] top-1/2 h-[400px] w-[400px] -translate-y-1/2 bg-[#E8EFE8]" duration="8s" />
        <p className="relative z-10 mb-4 text-xs uppercase tracking-[0.2em] text-[#78716C]">The Problem</p>
        <h2 className="relative z-10 mx-auto max-w-xl text-[clamp(24px,4vw,36px)] font-semibold leading-tight tracking-[-0.025em]">
          Why can&apos;t you explain your own project in an interview?
        </h2>
        <p className="relative z-10 mx-auto mt-5 max-w-[560px] text-[15px] leading-relaxed text-[#78716C]">
          You built it. You debugged it at 2am. You were proud of it. Then months passed —
          and now the architecture, the decisions, the &quot;why&quot; behind it all is just... gone.
          Documentation was an afterthought, if it happened at all.
        </p>
      </section>

      {/* SOLUTION */}
      <section className="relative border-t border-stone-100 px-6 py-24 text-center">
        <Blob className="right-[20%] top-1/2 h-[400px] w-[400px] -translate-y-1/2 bg-[#EFEDF4]" duration="7s" delay="0.8s" />
        <p className="relative z-10 mb-4 text-xs uppercase tracking-[0.2em] text-[#78716C]">The Solution</p>
        <h2 className="relative z-10 mx-auto max-w-xl text-[clamp(24px,4vw,36px)] font-semibold leading-tight tracking-[-0.025em]">
          One vault for everything your project knows.
        </h2>
        <p className="relative z-10 mx-auto mt-5 max-w-[560px] text-[15px] leading-relaxed text-[#78716C]">
          Architecture diagrams, setup notes, challenges you overcame, interview-ready explanations —
          all in one place, tied to the project it belongs to. And if you forgot to write it down, AI fills the gaps.
        </p>
      </section>

      {/* FEATURES */}
      <section className="relative border-t border-stone-100 px-6 py-24">
        <div className="mx-auto grid max-w-3xl gap-5 sm:grid-cols-2">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-3xl border border-stone-100 bg-white p-6 text-left shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]"
            >
              <h3 className="mb-2 text-[15px] font-medium">{f.title}</h3>
              <p className="text-[13px] leading-relaxed text-[#78716C]">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* AI CHAT SHOWCASE */}
      <section className="relative overflow-hidden border-t border-stone-100 px-6 py-24">
        <Blob className="left-[15%] top-[10%] h-[360px] w-[360px] bg-[#FFE4E1]" duration="9s" />
        <Blob className="right-[10%] bottom-[5%] h-[320px] w-[320px] bg-[#E6E6FA]" duration="7s" delay="1s" />

        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <p className="mb-4 flex items-center justify-center gap-2 text-xs uppercase tracking-[0.2em] text-[#78716C]">
            <SparkleIcon className="h-3.5 w-3.5 text-[#D85A30]" />
            Talk to Your Project
          </p>
          <h2 className="mx-auto max-w-xl text-[clamp(24px,4vw,36px)] font-semibold leading-tight tracking-[-0.025em]">
            Ask it anything. It only knows{" "}
            <span className="font-[Reenie_Beanie] text-4xl font-normal text-[#D85A30] sm:text-5xl">
              your
            </span>{" "}
            project.
          </h2>
          <p className="mx-auto mt-5 max-w-[560px] text-[15px] leading-relaxed text-[#78716C]">
            No hallucinated frameworks, no generic advice. The chat is scoped to what you actually wrote —
            your architecture notes, your setup steps, your dev log. Ask it to jog your memory before a call.
          </p>
        </div>

        {/* Chat mockup card */}
        <div className="relative z-10 mx-auto mt-12 max-w-lg">
          <div className="overflow-hidden rounded-3xl border border-stone-100 bg-white shadow-[0_12px_40px_-8px_rgba(0,0,0,0.08)]">
            <div className="flex items-center gap-2 border-b border-stone-100 bg-[#FDFCF8] px-5 py-3.5">
              <span className="h-2 w-2 rounded-full bg-[#D85A30]" />
              <span className="text-xs font-medium text-[#78716C]">taskflow-api — project chat</span>
            </div>

            <div className="flex flex-col gap-4 px-5 py-6">
              {CHAT_EXCHANGE.map((m, i) =>
                m.role === "user" ? (
                  <div key={i} className="flex justify-end">
                    <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-[#292524] px-4 py-2.5 text-left text-[13px] leading-relaxed text-white">
                      {m.text}
                    </div>
                  </div>
                ) : (
                  <div key={i} className="flex items-start gap-2.5">
                    <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#FFE4E1]">
                      <SparkleIcon className="h-3 w-3 text-[#D85A30]" />
                    </span>
                    <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-[#F5F3EE] px-4 py-2.5 text-left text-[13px] leading-relaxed text-[#44403C]">
                      {m.text}
                    </div>
                  </div>
                )
              )}
            </div>

            <div className="border-t border-stone-100 px-5 py-3.5">
              <div className="flex items-center gap-2 rounded-full border border-stone-200 bg-[#FDFCF8] px-4 py-2.5">
                <span className="text-[13px] text-[#A8A29E]">Ask about this project…</span>
                <span className="ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-[#D85A30]">
                  <SendIcon className="h-3 w-3 text-white" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <StepsRibbon />

      {/* CTA */}
      <section className="relative overflow-hidden border-t border-stone-100 px-6 py-28 text-center">
        <Blob className="left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 bg-[#FFE4E1]" duration="9s" />
        <div className="relative z-10">
          <h2 className="text-[clamp(26px,5vw,40px)] font-semibold tracking-[-0.025em]">
            Stop forgetting your own work.
          </h2>
          <p className="mt-3 text-[15px] text-[#78716C]">Free to start. No credit card required.</p>
          <Link
            href="/register"
            className="mt-8 inline-block rounded-full bg-[#D85A30] px-8 py-3.5 text-sm font-medium text-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] transition-transform hover:scale-[1.03]"
          >
            Create your vault →
          </Link>
        </div>
      </section>

      <footer className="border-t border-stone-100 px-6 py-8 text-center text-xs text-stone-400">
        ProjectVault — your developer memory system
      </footer>
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
      className={`pointer-events-none absolute rounded-full opacity-60 blur-[60px] ${className}`}
      style={{ animation: `pv-float ${duration} ease-in-out infinite`, animationDelay: delay }}
    />
  );
}

function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2c.4 3.6 1.4 6 3 7.6 1.6 1.6 4 2.6 7 3-3.6.4-6 1.4-7.6 3-1.6 1.6-2.6 4-3 7-.4-3.6-1.4-6-3-7.6C6.8 14.4 4.4 13.4 1 13c3.6-.4 6-1.4 7.6-3C10.2 8.4 11.2 6 12 2z" />
    </svg>
  );
}

function SendIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 2 11 13" />
      <path d="M22 2 15 22l-4-9-9-4 20-7Z" />
    </svg>
  );
}

function FontsAndGrain() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600&family=Reenie+Beanie&display=swap');

        @keyframes pv-float {
          0%, 100% { transform: translateY(-10px); }
          50% { transform: translateY(10px); }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; }
        }
      `}</style>
      <svg className="pointer-events-none fixed inset-0 z-50 h-0 w-0">
        <filter id="pv-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="2" stitchTiles="stitch" />
        </filter>
      </svg>
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.35] mix-blend-overlay"
        style={{ filter: "url(#pv-grain)" }}
      />
    </>
  );
}