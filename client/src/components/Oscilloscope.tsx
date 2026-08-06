import { useRef, useEffect } from "react";

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
  const tRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

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
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Background
      ctx.fillStyle = "rgba(5,10,20,0.95)";
      ctx.fillRect(0, 0, w, h);

      // Grid
      ctx.strokeStyle = "rgba(34,211,238,0.06)";
      ctx.lineWidth = 0.5;
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
      ctx.strokeStyle = "rgba(34,211,238,0.12)";
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

      // Labels
      ctx.fillStyle = "rgba(34,211,238,0.5)";
      ctx.font = "9px 'JetBrains Mono', monospace";
      ctx.textAlign = "left";
      ctx.fillText(running ? "▶ RUNNING" : "■ STOPPED", 8, 14);

      ctx.textAlign = "right";
      const labels: Record<string, string> = {
        blink: "GPIO / PWM",
        echo: "UART TX/RX",
        gpio: "ADC Scan",
      };
      ctx.fillText(labels[program] || "", w - 8, 14);

      frameRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(frameRef.current);
      ro.disconnect();
    };
  }, [program, running, color]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full rounded-xl"
      aria-label="Oscilloscope signal display"
    />
  );
}
