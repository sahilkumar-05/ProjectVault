"use client";

import { useEffect, useRef, useState } from "react";

const STEPS = [
  {
    step: "01",
    title: "Create a project",
    desc: "Add a project the moment you start it — or months later when you finally remember to.",
  },
  {
    step: "02",
    title: "Fill what you know",
    desc: "Write down architecture, setup steps, challenges — whatever's fresh in your mind right now.",
  },
  {
    step: "03",
    title: "Let AI fill the gaps",
    desc: "Missing a section? Generate it from what's already there, review it, and save.",
  },
  {
    step: "04",
    title: "Walk into interviews ready",
    desc: "Pull up your 30-second pitch, technical explanation, and common Q&A in seconds.",
  },
];

export default function StepsRibbon() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }
  }, []);

  useEffect(() => {
    let raf = 0;

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = sectionRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const viewportH = window.innerHeight;

        // 0 when section top reaches the reading line (70% down viewport),
        // 1 when section bottom reaches that same line.
        const readingLine = viewportH * 0.7;
        const traveled = readingLine - rect.top;
        const pct = Math.min(1, Math.max(0, traveled / rect.height));
        setProgress(pct);
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative border-t border-stone-100 px-6 py-24">
      <p className="mb-4 text-center text-xs uppercase tracking-[0.2em] text-[#78716C]">How it works</p>
      <h2 className="mx-auto mb-16 max-w-xl text-center text-[clamp(24px,4vw,36px)] font-semibold leading-tight tracking-[-0.025em]">
        From first commit to interview-ready
      </h2>

      <div className="relative mx-auto flex max-w-xl">
        {/* self-drawing connector line */}
        <svg
          className="absolute left-[19px] top-0 h-full w-[2px] overflow-visible sm:left-[23px]"
          viewBox="0 0 2 100"
          preserveAspectRatio="none"
          fill="none"
        >
          <path d="M1 0 L1 100" stroke="#EDEAE2" strokeWidth="2" />
          <path
            ref={pathRef}
            d="M1 0 L1 100"
            stroke="#D85A30"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={pathLength}
            strokeDashoffset={pathLength * (1 - progress)}
            style={{ transition: "stroke-dashoffset 80ms linear" }}
          />
        </svg>

        <div className="flex w-full flex-col gap-12">
          {STEPS.map((s, i) => {
            const lit = progress >= (i + 0.5) / STEPS.length;
            return (
              <div key={s.step} className="relative flex gap-6 pl-0">
                <span
                  className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-xs font-medium transition-colors duration-300 sm:h-12 sm:w-12"
                  style={{
                    borderColor: lit ? "#D85A30" : "#EDEAE2",
                    background: lit ? "#D85A30" : "#FDFCF8",
                    color: lit ? "#FFFFFF" : "#78716C",
                  }}
                >
                  {s.step}
                </span>
                <div className="pt-1 text-left">
                  <h3 className="mb-1.5 text-[15px] font-medium">{s.title}</h3>
                  <p className="max-w-sm text-[13px] leading-relaxed text-[#78716C]">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}