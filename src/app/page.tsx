import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function LandingPage() {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div style={{ background: "#0a0a0a", color: "#F5F1EA", overflow: "hidden" }}>
      {/* NAV */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 40px", position: "relative", zIndex: 10 }}>
        <span style={{ fontWeight: 600, fontSize: "18px", color: "#F5F1EA" }}>
          ProjectVault
        </span>
        <div style={{ display: "flex", gap: "12px" }}>
          <Link href="/login" style={{ color: "#B4B2A9", fontSize: "14px", textDecoration: "none", padding: "8px 16px" }}>
            Log in
          </Link>
          <Link
            href="/register"
            style={{ background: "#D85A30", color: "#fff", fontSize: "14px", textDecoration: "none", padding: "8px 18px", borderRadius: "8px", fontWeight: 500 }}
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section
        style={{
          position: "relative",
          textAlign: "center",
          padding: "100px 24px 140px",
          background: "radial-gradient(circle at 50% 30%, rgba(216,90,48,0.25) 0%, rgba(10,10,10,0) 60%)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-100px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "700px",
            height: "700px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(216,90,48,0.15) 0%, transparent 70%)",
            filter: "blur(40px)",
            zIndex: 0,
          }}
        />
        <div style={{ position: "relative", zIndex: 1 }}>
          <p style={{ color: "#D85A30", fontSize: "13px", letterSpacing: "1.5px", marginBottom: "16px", textTransform: "uppercase" }}>
            Your Developer Memory System
          </p>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 600, lineHeight: 1.15, marginBottom: "20px", maxWidth: "800px", margin: "0 auto 20px" }}>
            GitHub stores code.<br />
            <span style={{ color: "#D85A30" }}>ProjectVault</span> stores knowledge.
          </h1>
          <p style={{ color: "#B4B2A9", fontSize: "16px", maxWidth: "560px", margin: "0 auto 32px", lineHeight: 1.6 }}>
            Every project you build has a story — why you built it, how it works, what you learned.
            Six months later, you've forgotten all of it. ProjectVault remembers so you don't have to.
          </p>
          <Link
            href="/register"
            style={{ display: "inline-block", background: "#D85A30", color: "#fff", padding: "14px 32px", borderRadius: "10px", fontSize: "15px", fontWeight: 500, textDecoration: "none" }}
          >
            Start your vault →
          </Link>
        </div>
      </section>

      {/* PROBLEM */}
      <section
        style={{
          position: "relative",
          padding: "100px 24px",
          textAlign: "center",
          borderTop: "0.5px solid #1a1a1a",
          background: "radial-gradient(circle at 20% 50%, rgba(216,90,48,0.08) 0%, transparent 50%)",
        }}
      >
        <p style={{ color: "#D85A30", fontSize: "13px", letterSpacing: "1.5px", marginBottom: "16px", textTransform: "uppercase" }}>
          The Problem
        </p>
        <h2 style={{ fontSize: "clamp(24px, 3.5vw, 36px)", fontWeight: 600, maxWidth: "700px", margin: "0 auto 20px", lineHeight: 1.3 }}>
          Why can't you explain your own project in an interview?
        </h2>
        <p style={{ color: "#888780", fontSize: "15px", maxWidth: "560px", margin: "0 auto", lineHeight: 1.7 }}>
          You built it. You debugged it at 2am. You were proud of it. Then months passed —
          and now the architecture, the decisions, the "why" behind it all is just... gone.
          Documentation was an afterthought, if it happened at all.
        </p>
      </section>

      {/* SOLUTION */}
      <section
        style={{
          position: "relative",
          padding: "100px 24px",
          textAlign: "center",
          borderTop: "0.5px solid #1a1a1a",
          background: "radial-gradient(circle at 80% 50%, rgba(216,90,48,0.08) 0%, transparent 50%)",
        }}
      >
        <p style={{ color: "#D85A30", fontSize: "13px", letterSpacing: "1.5px", marginBottom: "16px", textTransform: "uppercase" }}>
          The Solution
        </p>
        <h2 style={{ fontSize: "clamp(24px, 3.5vw, 36px)", fontWeight: 600, maxWidth: "700px", margin: "0 auto 20px", lineHeight: 1.3 }}>
          One vault for everything your project knows.
        </h2>
        <p style={{ color: "#888780", fontSize: "15px", maxWidth: "560px", margin: "0 auto 40px", lineHeight: 1.7 }}>
          Architecture diagrams, setup notes, challenges you overcame, interview-ready explanations —
          all in one place, tied to the project it belongs to. And if you forgot to write it down, AI fills the gaps.
        </p>
      </section>

      {/* FEATURES */}
      <section style={{ position: "relative", padding: "60px 24px 100px", borderTop: "0.5px solid #1a1a1a" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" }}>
          {[
            { title: "9 sections per project", desc: "Overview, architecture, setup, docs, resources, dev notes, interview notes, and more." },
            { title: "AI Documentation Generator", desc: "Missing a section? AI fills it in based on what you've already written — you review and approve." },
            { title: "Project-specific AI chat", desc: "Ask your own project questions. It only knows what you told it — nothing more, nothing less." },
            { title: "Interview prep, built in", desc: "Generate HR and technical explanations, plus a 30-second and 2-minute pitch, on demand." },
          ].map((f) => (
            <div
              key={f.title}
              style={{
                background: "#111111",
                border: "0.5px solid #232323",
                borderRadius: "14px",
                padding: "24px",
                textAlign: "left",
              }}
            >
              <h3 style={{ fontSize: "15px", fontWeight: 500, marginBottom: "8px", color: "#F5F1EA" }}>{f.title}</h3>
              <p style={{ fontSize: "13px", color: "#888780", lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          position: "relative",
          textAlign: "center",
          padding: "100px 24px 120px",
          borderTop: "0.5px solid #1a1a1a",
          background: "radial-gradient(circle at 50% 100%, rgba(216,90,48,0.2) 0%, transparent 60%)",
        }}
      >
        <h2 style={{ fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 600, marginBottom: "16px" }}>
          Stop forgetting your own work.
        </h2>
        <p style={{ color: "#888780", fontSize: "15px", marginBottom: "32px" }}>
          Free to start. No credit card required.
        </p>
        <Link
          href="/register"
          style={{ display: "inline-block", background: "#D85A30", color: "#fff", padding: "14px 32px", borderRadius: "10px", fontSize: "15px", fontWeight: 500, textDecoration: "none" }}
        >
          Create your vault →
        </Link>
      </section>

      <footer style={{ borderTop: "0.5px solid #1a1a1a", padding: "24px", textAlign: "center", fontSize: "12px", color: "#5F5E5A" }}>
        ProjectVault — your developer memory system
      </footer>
    </div>
  );
}