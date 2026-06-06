"use client";

import { useEffect, useRef } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import { intro, chapters, finaleLine, type Block } from "../story";

function blockText(b: Block): string {
  switch (b.type) {
    case "p":
    case "lead":
    case "litany":
      return b.text;
    case "lines":
      return b.lines.join("\n");
    case "verse":
      return (
        b.stanzas.map((s) => s.join("\n")).join("\n\n") +
        (b.author ? `\n— ${b.author}` : "")
      );
    default:
      return "";
  }
}

const manuscript: string = (() => {
  const parts: string[] = [];
  intro.forEach((b) => parts.push(blockText(b)));
  chapters.forEach((c) => {
    if (c.title) parts.push(c.title);
    c.blocks.forEach((b) => parts.push(blockText(b)));
  });
  return parts.filter(Boolean).join("\n");
})();

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

export default function Finale() {
  const zoneRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const msRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const finalRef = useRef<HTMLParagraphElement>(null);
  const reducedRef = useRef(false);

  const { scrollYProgress } = useScroll({
    target: zoneRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    reducedRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (textRef.current) textRef.current.textContent = manuscript;

    if (reducedRef.current) {
      if (textRef.current) textRef.current.textContent = "";
      if (msRef.current) msRef.current.style.opacity = "0";
      if (glowRef.current) glowRef.current.style.opacity = "1";
      if (finalRef.current) finalRef.current.style.opacity = "1";
    }
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (reducedRef.current) return;

    // accelerating backspace: more text removed per unit scroll as we go
    const removed = Math.pow(clamp01(p), 1.7);
    const kept = Math.max(0, Math.round(manuscript.length * (1 - removed)));

    if (textRef.current) {
      textRef.current.textContent = manuscript.slice(0, kept);
    }

    // manuscript fades out as the last words vanish
    const finalIn = clamp01((p - 0.9) / 0.1);
    if (msRef.current) msRef.current.style.opacity = String(1 - finalIn);

    // background light surfaces near the end
    if (glowRef.current) {
      glowRef.current.style.opacity = String(clamp01((p - 0.72) / 0.28));
    }

    // the last whisper breathes in
    if (finalRef.current) {
      finalRef.current.style.opacity = String(finalIn);
      finalRef.current.style.filter = `blur(${(1 - finalIn) * 14}px)`;
    }
  });

  return (
    <>
      <section ref={zoneRef} className="relative h-[420vh]">
        <div className="sticky top-0 flex h-screen items-end justify-center overflow-hidden px-6">
          {/* light that surfaces once the page empties */}
          <div
            ref={glowRef}
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 transition-none"
            style={{
              background:
                "radial-gradient(60% 50% at 50% 45%, rgba(199,160,106,0.12), transparent 70%)",
            }}
          />

          {/* the body text, eaten from where the reader just was, upward */}
          <div
            ref={msRef}
            className="relative z-10 h-full w-full max-w-2xl [mask-image:linear-gradient(to_bottom,transparent,#000_22%,#000_100%)]"
          >
            <div className="flex h-full flex-col justify-end pb-[16vh]">
              <p
                ref={textRef}
                className="cursor whitespace-pre-wrap text-justify text-base leading-[2.1] tracking-wide text-[var(--ink-dim)] sm:text-lg"
              />
            </div>
          </div>

          {/* the final whisper */}
          <p
            ref={finalRef}
            className="absolute max-w-xl px-6 text-center text-xl font-light leading-[2.2] tracking-[0.18em] text-[var(--ink)] opacity-0 sm:text-2xl"
          >
            {finaleLine}
          </p>
        </div>
      </section>

      <footer className="flex flex-col items-center gap-3 px-6 pb-24 pt-10 text-center">
        <span className="h-12 w-px bg-gradient-to-b from-transparent to-[var(--ink-faint)]/40" />
        <p className="text-xs tracking-[0.5em] text-[var(--ink-faint)]/60">2025 · 留白</p>
      </footer>
    </>
  );
}
