"use client";

import {
  chapters,
  intro,
  type Block,
  type Chapter,
  type Mood,
} from "../story";
import Cover from "./Cover";
import Snow from "./Snow";
import ScrollProgress from "./ScrollProgress";
import Reveal, { type RevealVariant } from "./Reveal";
import Litany from "./Litany";
import InView from "./effects/InView";
import Rain from "./effects/Rain";
import Embers from "./effects/Embers";
import Machine from "./effects/Machine";
import Finale from "./Finale";

type MoodConfig = {
  accent: string;
  variant: RevealVariant;
  effect?: "rain" | "embers" | "machine";
};

const MOOD: Record<Mood, MoodConfig> = {
  bow: { accent: "#c7a06a", variant: "brush" },
  machine: { accent: "#9bb2c6", variant: "belt", effect: "machine" },
  archive: { accent: "#b9b2a4", variant: "fade" },
  night: { accent: "#8b97cf", variant: "drift" },
  ember: { accent: "#e0813a", variant: "smoke", effect: "embers" },
  rain: { accent: "#93b6c8", variant: "ink", effect: "rain" },
  journey: { accent: "#dba85a", variant: "scenery" },
  void: { accent: "#8a857a", variant: "erase" },
};

function BlockView({
  block,
  variant,
  mood,
}: {
  block: Block;
  variant: RevealVariant;
  mood: Mood;
}) {
  switch (block.type) {
    case "lead":
      return (
        <Reveal variant={variant}>
          <p className="mx-auto max-w-2xl text-lg leading-[2.1] tracking-wide text-[var(--ink)] sm:text-xl">
            {block.text}
          </p>
        </Reveal>
      );
    case "p":
      return (
        <Reveal variant={variant}>
          <p className="mx-auto max-w-2xl text-justify text-base leading-[2.15] tracking-wide text-[var(--ink-dim)] sm:text-lg">
            {block.text}
          </p>
        </Reveal>
      );
    case "lines":
      return (
        <div className="mx-auto max-w-2xl space-y-3 text-center">
          {block.lines.map((l, i) => {
            const isGlitch = mood === "archive" && l === "我是誰？";
            const isCursor = mood === "void";
            return (
              <Reveal key={i} variant={variant} index={i} delay={i * 0.12}>
                {isGlitch ? (
                  <p
                    data-text={l}
                    className="glitch inline-block text-2xl tracking-[0.18em] text-[var(--ink)] sm:text-4xl"
                  >
                    {l}
                  </p>
                ) : (
                  <p
                    className={`text-lg leading-relaxed tracking-[0.12em] text-[var(--ink)] sm:text-2xl ${
                      isCursor ? "cursor" : ""
                    }`}
                  >
                    {l}
                  </p>
                )}
              </Reveal>
            );
          })}
        </div>
      );
    case "litany":
      return (
        <div className="mx-auto max-w-2xl">
          <Litany text={block.text} />
        </div>
      );
    case "verse":
      return (
        <Reveal variant={variant}>
          <div className="mx-auto max-w-xl space-y-8 text-center">
            {block.stanzas.map((stanza, si) => (
              <div key={si} className="space-y-2">
                {stanza.map((line, li) => (
                  <p
                    key={li}
                    className="text-lg leading-loose tracking-[0.16em] text-[var(--ink)] sm:text-xl"
                  >
                    {line}
                  </p>
                ))}
              </div>
            ))}
            {block.author && (
              <p className="pt-2 text-sm tracking-[0.3em] text-[var(--ink-faint)]">
                — {block.author}
              </p>
            )}
          </div>
        </Reveal>
      );
    default:
      return null;
  }
}

function ChapterView({ chapter }: { chapter: Chapter }) {
  const cfg = MOOD[chapter.mood];
  return (
    <section
      className="relative overflow-hidden px-6 py-[12vh] sm:py-[16vh]"
      style={{ ["--accent" as string]: cfg.accent }}
    >
      {/* per-mood ambient tint */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          background: `radial-gradient(60% 50% at 50% 30%, ${cfg.accent}, transparent 70%)`,
        }}
      />

      {/* per-mood animated effect, mounted only when near viewport */}
      {cfg.effect && (
        <InView>
          {cfg.effect === "rain" && <Rain />}
          {cfg.effect === "embers" && <Embers />}
          {cfg.effect === "machine" && <Machine />}
        </InView>
      )}

      <div className="relative z-10">
        <div className="mx-auto mb-16 max-w-2xl">
          <Reveal variant={cfg.variant}>
            <div className="relative flex items-baseline gap-5">
              <span className="select-none text-6xl font-extralight text-[var(--ink-faint)]/40 sm:text-7xl">
                {chapter.index}
              </span>
              <h2 className="text-3xl font-light tracking-[0.18em] text-[var(--ink)] sm:text-4xl">
                {chapter.title}
              </h2>
            </div>
            <div className="mt-6 h-px w-24 bg-gradient-to-r from-[var(--accent)] to-transparent" />
          </Reveal>
        </div>

        <div className="space-y-10">
          {chapter.blocks.map((b, i) => (
            <BlockView key={i} block={b} variant={cfg.variant} mood={chapter.mood} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function StoryView() {
  return (
    <main className="grain relative">
      <div className="fog" aria-hidden />
      <div className="fog two" aria-hidden />
      <Snow />
      <ScrollProgress />

      <div className="relative z-10">
        <Cover />

        <section className="px-6 py-[14vh]">
          <div className="mx-auto max-w-2xl space-y-10">
            {intro.map((b, i) => (
              <BlockView key={i} block={b} variant="fade" mood="void" />
            ))}
          </div>
        </section>

        {chapters.map((c) => (
          <ChapterView key={c.id} chapter={c} />
        ))}

        <Finale />
      </div>
    </main>
  );
}
