"use client";

import { useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";

export default function InView({
  children,
  margin = "200px",
}: {
  children: ReactNode;
  margin?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // @ts-expect-error framer accepts string margins
  const inView = useInView(ref, { margin });
  return (
    <div ref={ref} className="pointer-events-none absolute inset-0">
      {inView ? children : null}
    </div>
  );
}
