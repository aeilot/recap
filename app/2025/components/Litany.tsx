"use client";

import { motion } from "framer-motion";

export default function Litany({ text }: { text: string }) {
  const parts: { t: string; hit: boolean }[] = [];
  const re = /(不相信|相信)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push({ t: text.slice(last, m.index), hit: false });
    parts.push({ t: m[0], hit: true });
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push({ t: text.slice(last), hit: false });

  return (
    <motion.p
      initial={{ opacity: 0, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 2.2, ease: "easeOut" }}
      className="text-justify text-base leading-[2] tracking-[0.04em] text-[var(--ink-dim)] sm:text-lg sm:leading-[2.05]"
    >
      {parts.map((p, i) =>
        p.hit ? (
          <span key={i} className="text-[var(--accent)]/90 text-[var(--accent)]">
            {p.t}
          </span>
        ) : (
          <span key={i}>{p.t}</span>
        )
      )}
    </motion.p>
  );
}
