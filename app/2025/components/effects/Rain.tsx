"use client";

import { useEffect, useRef } from "react";

type Drop = { x: number; y: number; len: number; v: number; a: number };

export default function Rain() {
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

    const count = Math.min(520, Math.floor((w * h) / 2600));
    const drops: Drop[] = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      len: Math.random() * 30 + 20,
      v: Math.random() * 12 + 18,
      a: Math.random() * 0.32 + 0.16,
    }));

    const ro = new ResizeObserver(() => {
      w = canvas.width = parent.clientWidth;
      h = canvas.height = parent.clientHeight;
    });
    ro.observe(parent);

    const wind = 3.4;
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.lineCap = "round";
      for (const d of drops) {
        ctx.lineWidth = d.a > 0.34 ? 1.5 : 1;
        ctx.strokeStyle = `rgba(186, 206, 218, ${d.a})`;
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x + wind, d.y + d.len);
        ctx.stroke();
        d.y += d.v;
        d.x += wind * 0.5;
        if (d.y > h) {
          d.y = -d.len;
          d.x = Math.random() * w;
        }
        if (d.x > w) d.x = 0;
      }
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="absolute inset-0 h-full w-full opacity-90" />;
}
