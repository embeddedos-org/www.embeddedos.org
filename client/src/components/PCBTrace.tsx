import { useRef, useEffect } from "react";
import { usePrefersReducedMotion } from "@/lib/reduced-motion";
import { useOnScreen } from "@/lib/on-screen";

interface TraceSegment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  speed: number;
  offset: number;
}

const TRACES: TraceSegment[] = [
  // Horizontal traces
  {
    x1: 0.05,
    y1: 0.2,
    x2: 0.35,
    y2: 0.2,
    color: "#F97316",
    speed: 0.8,
    offset: 0,
  },
  {
    x1: 0.35,
    y1: 0.2,
    x2: 0.35,
    y2: 0.5,
    color: "#F97316",
    speed: 0.8,
    offset: 0.3,
  },
  {
    x1: 0.35,
    y1: 0.5,
    x2: 0.65,
    y2: 0.5,
    color: "#F97316",
    speed: 0.8,
    offset: 0.6,
  },
  {
    x1: 0.65,
    y1: 0.5,
    x2: 0.65,
    y2: 0.3,
    color: "#22D3EE",
    speed: 1.0,
    offset: 0.1,
  },
  {
    x1: 0.65,
    y1: 0.3,
    x2: 0.95,
    y2: 0.3,
    color: "#22D3EE",
    speed: 1.0,
    offset: 0.4,
  },
  {
    x1: 0.05,
    y1: 0.6,
    x2: 0.25,
    y2: 0.6,
    color: "#A78BFA",
    speed: 0.6,
    offset: 0.2,
  },
  {
    x1: 0.25,
    y1: 0.6,
    x2: 0.25,
    y2: 0.8,
    color: "#A78BFA",
    speed: 0.6,
    offset: 0.5,
  },
  {
    x1: 0.25,
    y1: 0.8,
    x2: 0.75,
    y2: 0.8,
    color: "#A78BFA",
    speed: 0.6,
    offset: 0.8,
  },
  {
    x1: 0.75,
    y1: 0.8,
    x2: 0.75,
    y2: 0.6,
    color: "#34D399",
    speed: 0.9,
    offset: 0.15,
  },
  {
    x1: 0.75,
    y1: 0.6,
    x2: 0.95,
    y2: 0.6,
    color: "#34D399",
    speed: 0.9,
    offset: 0.45,
  },
  {
    x1: 0.45,
    y1: 0.1,
    x2: 0.55,
    y2: 0.1,
    color: "#F59E0B",
    speed: 1.2,
    offset: 0.0,
  },
  {
    x1: 0.55,
    y1: 0.1,
    x2: 0.55,
    y2: 0.4,
    color: "#F59E0B",
    speed: 1.2,
    offset: 0.25,
  },
];

// Pads / vias
const PADS = [
  { x: 0.35, y: 0.2, r: 0.015, color: "#F97316" },
  { x: 0.35, y: 0.5, r: 0.015, color: "#F97316" },
  { x: 0.65, y: 0.5, r: 0.015, color: "#22D3EE" },
  { x: 0.65, y: 0.3, r: 0.015, color: "#22D3EE" },
  { x: 0.25, y: 0.6, r: 0.015, color: "#A78BFA" },
  { x: 0.25, y: 0.8, r: 0.015, color: "#A78BFA" },
  { x: 0.75, y: 0.8, r: 0.015, color: "#34D399" },
  { x: 0.75, y: 0.6, r: 0.015, color: "#34D399" },
  { x: 0.55, y: 0.1, r: 0.015, color: "#F59E0B" },
  { x: 0.55, y: 0.4, r: 0.015, color: "#F59E0B" },
  // MCU center
  { x: 0.5, y: 0.5, r: 0.035, color: "#ffffff" },
];

export default function PCBTrace({ running = true }: { running?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  // F-23: paint one static frame instead of looping when the visitor
  // prefers reduced motion.
  const reduceMotion = usePrefersReducedMotion();
  // Signals only move while the bench runs, so frames are drawn only then, and
  // only while the board is on screen; stopped, it shows one still frame.
  const onScreen = useOnScreen(canvasRef);
  const tRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // the page's Black Edition greys and type (bp.css tokens), with their values as fallbacks
    const css = getComputedStyle(canvas);
    const token = (name: string, fallback: string) =>
      css.getPropertyValue(name).replace(/\s+/g, " ").trim() || fallback;
    const gridInk = token("--line", "#232326");
    const mono = token("--mono", "ui-monospace, Menlo, monospace");

    const animate = running && onScreen && !reduceMotion;
    let dpr = 1;

    const draw = () => {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      // PCB background grid
      ctx.strokeStyle = gridInk;
      ctx.lineWidth = 0.5;
      const gridSize = 20;
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      if (running) tRef.current += 0.016;

      // Draw static traces
      for (const trace of TRACES) {
        const x1 = trace.x1 * w,
          y1 = trace.y1 * h;
        const x2 = trace.x2 * w,
          y2 = trace.y2 * h;
        ctx.beginPath();
        ctx.strokeStyle = trace.color + "30";
        ctx.lineWidth = 2;
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        if (!running) continue;

        // Animated signal dot
        const progress = (tRef.current * trace.speed + trace.offset) % 1;
        const px = x1 + (x2 - x1) * progress;
        const py = y1 + (y2 - y1) * progress;

        // Glow dot
        const grad = ctx.createRadialGradient(px, py, 0, px, py, 8);
        grad.addColorStop(0, trace.color + "ff");
        grad.addColorStop(0.4, trace.color + "80");
        grad.addColorStop(1, trace.color + "00");
        ctx.beginPath();
        ctx.arc(px, py, 8, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = trace.color;
        ctx.fill();
      }

      // Draw pads
      for (const pad of PADS) {
        const px = pad.x * w,
          py = pad.y * h,
          r = pad.r * Math.min(w, h);
        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fillStyle = pad.color + "30";
        ctx.strokeStyle = pad.color + "80";
        ctx.lineWidth = 1.5;
        ctx.fill();
        ctx.stroke();

        // Pulse ring
        if (running) {
          const pulse = (Math.sin(tRef.current * 3 + pad.x * 10) + 1) / 2;
          ctx.beginPath();
          ctx.arc(px, py, r + pulse * r * 1.5, 0, Math.PI * 2);
          ctx.strokeStyle =
            pad.color +
            Math.round(pulse * 60)
              .toString(16)
              .padStart(2, "0");
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // MCU label (never under 12px, the smallest text the site uses)
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.font = `bold ${Math.max(12, Math.min(w, h) * 0.025)}px ${mono}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("MCU", 0.5 * w, 0.5 * h);

      // F-23: one static frame under reduced motion (and while stopped or
      // scrolled away); the loop otherwise.
      if (animate) frameRef.current = requestAnimationFrame(draw);
    };

    // a sharp canvas, at no more than 1.5 device pixels per CSS pixel;
    // resizing clears it, so a still frame is drawn again
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(canvas.offsetWidth * dpr);
      canvas.height = Math.round(canvas.offsetHeight * dpr);
      if (!animate) draw();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    if (animate) draw();
    return () => {
      cancelAnimationFrame(frameRef.current);
      ro.disconnect();
    };
  }, [running, reduceMotion, onScreen]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full rounded-xl"
      style={{ background: "var(--panel, #0b0b0d)" }}
      aria-label="PCB signal trace visualization"
    />
  );
}
