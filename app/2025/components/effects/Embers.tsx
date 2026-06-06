"use client";

import { useEffect, useRef } from "react";

type Ember = {
  x: number;
  y: number;
  r: number;
  v: number;
  drift: number;
  phase: number;
  a: number;
  hue: number;
};

export default function Embers() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const parent = canvas.parentElement!;
    let w = (canvas.width = parent.clientWidth);
    let h = (canvas.height = parent.clientHeight);
    let raf = 0;

    const count = Math.min(60, Math.floor((w * h) / 22000));
    const embers: Ember[] = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.8 + 0.5,
      v: Math.random() * 0.5 + 0.2,
      drift: Math.random() * 0.8 + 0.2,
      phase: Math.random() * Math.PI * 2,
      a: Math.random() * 0.6 + 0.2,
      hue: 18 + Math.random() * 24,
    }));

    const ro = new ResizeObserver(() => {
      w = canvas.width = parent.clientWidth;
      h = canvas.height = parent.clientHeight;
    });
    ro.observe(parent);

    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      for (const e of embers) {
        e.phase += 0.01;
        e.y -= e.v;
        e.x += Math.sin(e.phase) * e.drift * 0.4;
        if (e.y < -6) {
          e.y = h + 6;
          e.x = Math.random() * w;
        }
        const flick = e.a * (0.6 + 0.4 * Math.sin(e.phase * 3));
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${e.hue}, 85%, 60%, ${flick})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = `hsla(${e.hue}, 90%, 55%, ${flick})`;
        ctx.fill();
      }
      ctx.shadowBlur = 0;
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="absolute inset-0 h-full w-full" />;
}
