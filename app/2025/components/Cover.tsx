"use client";

import { motion } from "framer-motion";

export default function Cover() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.6, delay: 0.3 }}
        className="mb-6 text-sm tracking-[0.7em] text-[var(--ink-faint)] sm:text-base"
      >
        年 終 總 結
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, scale: 1.08, filter: "blur(14px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }}
        className="select-none text-[24vw] font-light leading-none tracking-tight text-[var(--ink)] sm:text-[18vw] md:text-[15rem]"
      >
        2025
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 1.2 }}
        className="mt-8 text-lg font-light tracking-[0.4em] text-[var(--ink-dim)] sm:text-xl"
      >
        留 白
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 1.8 }}
        className="mt-3 max-w-md text-sm leading-relaxed text-[var(--ink-faint)]"
      >
        一個難以回憶、難以定義的年份。
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0.4, 1] }}
        transition={{ duration: 3, delay: 2.6, repeat: Infinity, repeatType: "reverse" }}
        className="absolute bottom-10 flex flex-col items-center gap-2 text-[var(--ink-faint)]"
      >
        <span className="text-xs tracking-[0.3em]">向下</span>
        <span className="h-10 w-px bg-gradient-to-b from-[var(--ink-faint)] to-transparent" />
      </motion.div>
    </section>
  );
}
