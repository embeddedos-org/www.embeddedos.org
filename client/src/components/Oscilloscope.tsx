import { useRef, useEffect } from "react";
import { usePrefersReducedMotion } from "@/lib/reduced-motion";
import { useOnScreen } from "@/lib/on-screen";

interface OscilloscopeProps {
  program: "blink" | "echo" | "gpio";
  running: boolean;
  color?: string;
}

export default function Oscilloscope({
  program,
  running,
  color = "#22D3EE",
}: OscilloscopeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  // F-23: paint one static frame instead of looping when the visitor
  // prefers reduced motion.
  const reduceMotion = usePrefersReducedMotion();
  // The trace only moves while the bench runs, so the scope draws frames only
  // then, and only while it is on screen; stopped, it shows one still frame.
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
    const ground = token("--panel", "#0b0b0d");
    const gridInk = token("--line", "#232326");
    const axisInk = token("--line2", "#34343a");
    const labelInk = token("--fg3", "#86868b");
    const mono = token("--mono", "ui-monospace, Menlo, monospace");

    const animate = running && onScreen && !reduceMotion;
    let dpr = 1;

    const generateSignal = (t: number): number => {
      switch (program) {
        case "blink": {
          // Square wave — LED blink
          const period = Math.PI * 2;
          return t % period < period / 2 ? 0.8 : -0.8;
        }
        case "echo": {
          // Burst pattern — UART echo
          const phase = t % (Math.PI * 4);
          if (phase < 0.5) return Math.sin(phase * 20) * 0.7;
          if (phase < 1.5) return 0;
          if (phase < 2.0) return -Math.sin((phase - 1.5) * 20) * 0.5;
          return 0;
        }
        case "gpio": {
          // Multi-channel staircase — GPIO scanner
          const step = Math.floor(t / 0.8) % 8;
          return (step / 7) * 1.4 - 0.7;
        }
        default:
          return 0;
      }
    };

    const draw = () => {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      // Background
      ctx.fillStyle = ground;
      ctx.fillRect(0, 0, w, h);

      // Grid
      ctx.strokeStyle = gridInk;
      ctx.lineWidth = 1;
      const cols = 10,
        rows = 8;
      for (let i = 0; i <= cols; i++) {
        ctx.beginPath();
        ctx.moveTo((i / cols) * w, 0);
        ctx.lineTo((i / cols) * w, h);
        ctx.stroke();
      }
      for (let i = 0; i <= rows; i++) {
        ctx.beginPath();
        ctx.moveTo(0, (i / rows) * h);
        ctx.lineTo(w, (i / rows) * h);
        ctx.stroke();
      }

      // Center line
      ctx.strokeStyle = axisInk;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(0, h / 2);
      ctx.lineTo(w, h / 2);
      ctx.stroke();
      ctx.setLineDash([]);

      if (running) tRef.current += 0.025;

      // Signal trace with glow
      ctx.shadowBlur = 8;
      ctx.shadowColor = color;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();

      const points = 400;
      for (let i = 0; i < points; i++) {
        const px = (i / points) * w;
        const t = (i / points) * Math.PI * 6 + tRef.current;
        const signal = generateSignal(t);
        const py = h / 2 - signal * (h * 0.38);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Scan line (moving cursor)
      if (running) {
        const scanX = (tRef.current * 20) % w;
        const scanGrad = ctx.createLinearGradient(scanX - 20, 0, scanX + 5, 0);
        scanGrad.addColorStop(0, "rgba(255,255,255,0)");
        scanGrad.addColorStop(1, "rgba(255,255,255,0.08)");
        ctx.fillStyle = scanGrad;
        ctx.fillRect(scanX - 20, 0, 25, h);
      }

      // Labels (12px: the smallest text the site uses)
      ctx.fillStyle = labelInk;
      ctx.font = `600 12px ${mono}`;
      ctx.textAlign = "left";
      ctx.fillText(running ? "▶ RUNNING" : "■ STOPPED", 12, 22);

      ctx.textAlign = "right";
      const labels: Record<string, string> = {
        blink: "GPIO / PWM",
        echo: "UART TX/RX",
        gpio: "ADC Scan",
      };
      ctx.fillText(labels[program] || "", w - 12, 22);

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
  }, [program, running, color, reduceMotion, onScreen]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full rounded-xl"
      aria-label="Oscilloscope signal display"
    />
  );
}
