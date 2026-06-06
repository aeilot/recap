"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

export type RevealVariant =
  | "fade"
  | "brush"
  | "belt"
  | "drift"
  | "smoke"
  | "ink"
  | "scenery"
  | "erase";

const ease = [0.22, 1, 0.36, 1] as const;

function buildVariants(variant: RevealVariant, i: number): Variants {
  switch (variant) {
    // 歲末 — brush stroke wiping in from the left, like writing
    case "brush":
      return {
        hidden: { opacity: 0, clipPath: "inset(0 100% 0 0)" },
        show: {
          opacity: 1,
          clipPath: "inset(0 0% 0 0)",
          transition: { duration: 1.6, ease },
        },
      };
    // 夢 — mechanical slide from the left, as if on a conveyor belt
    case "belt":
      return {
        hidden: { opacity: 0, x: -70 },
        show: {
          opacity: 1,
          x: 0,
          transition: { duration: 0.9, ease: [0.65, 0, 0.35, 1] },
        },
      };
    // 午夜飛行 — turbulent sway, drifting in with a slight roll
    case "drift":
      return {
        hidden: { opacity: 0, y: 30, rotate: -1.2, filter: "blur(6px)" },
        show: {
          opacity: 1,
          y: 0,
          rotate: 0,
          filter: "blur(0px)",
          transition: { duration: 1.5, ease },
        },
      };
    // 特拉阿托尼 — emerging from smoke, scaling down with a warm glow
    case "smoke":
      return {
        hidden: { opacity: 0, scale: 1.12, filter: "blur(14px)" },
        show: {
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          transition: { duration: 2, ease },
        },
      };
    // 雨西湖 — wet ink bleeding into focus
    case "ink":
      return {
        hidden: { opacity: 0, filter: "blur(16px)", letterSpacing: "0.3em" },
        show: {
          opacity: 1,
          filter: "blur(0px)",
          letterSpacing: "0.02em",
          transition: { duration: 1.8, ease },
        },
      };
    // 旅行 — passing scenery, sliding from alternating sides
    case "scenery":
      return {
        hidden: { opacity: 0, x: i % 2 === 0 ? -48 : 48 },
        show: {
          opacity: 1,
          x: 0,
          transition: { duration: 1.3, ease },
        },
      };
    // 留白 — dissolving / being erased
    case "erase":
      return {
        hidden: { opacity: 0, filter: "blur(4px)" },
        show: {
          opacity: 1,
          filter: "blur(0px)",
          transition: { duration: 1.6, ease },
        },
      };
    default:
      return {
        hidden: { opacity: 0, y: 26, filter: "blur(8px)" },
        show: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { duration: 1.2, ease },
        },
      };
  }
}

export default function Reveal({
  children,
  delay = 0,
  index = 0,
  variant = "fade",
  className,
}: {
  children: ReactNode;
  delay?: number;
  index?: number;
  variant?: RevealVariant;
  className?: string;
}) {
  const variants = buildVariants(variant, index);
  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-12% 0px -12% 0px" }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}
