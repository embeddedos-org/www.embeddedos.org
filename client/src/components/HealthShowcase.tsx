import { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Watch,
  Fingerprint,
  Microscope,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link } from "wouter";
import { usePrefersReducedMotion } from "@/lib/reduced-motion";

const DEVICES = [
  {
    id: "key",
    name: "HEALTH-KEY ULTRA",
    tagline: "USB-C Pendrive Health Monitor",
    color: "#F85149",
    icon: Activity,
    glowClass: "animate-glow-red",
    patent: "Patent Pending #64/073,334",
    chip: "nRF52840",
    formFactor: "USB-C Pendrive",
    waveType: "ecg" as const,
    metrics: [
      "ECG (12-lead)",
      "SpO₂",
      "BAC Breath",
      "Heart Rate",
      "Temperature",
      "UV Index",
    ],
    desc: "In-development USB-C research design for exploring ECG, blood-oxygen, breath-alcohol, temperature, UV, and motion sensing. Validation is pending.",
    signalPath: ["Sensor Array", "nRF52840", "USB-C", "Mobile App"],
  },
  {
    id: "band",
    name: "HEALTH-BAND Neuro",
    tagline: "AI-Powered Neuro Wristband",
    color: "#F59E0B",
    icon: Watch,
    glowClass: "animate-glow-amber",
    patent: "Patent Pending #64/076,078",
    chip: "nRF52840 + TFLite",
    formFactor: "Wristband",
    waveType: "neural" as const,
    metrics: [
      "sEMG Gesture Control",
      "TENS Stimulation Research",
      "ECG",
      "SpO₂",
      "HRV",
      "Skin Temp",
    ],
    desc: "In-development wristband research design for sEMG gesture studies, biometric sensing, and TENS exploration. No therapeutic benefit is claimed.",
    signalPath: ["sEMG Electrodes", "nRF52840", "TFLite AI", "Gesture Output"],
  },
  {
    id: "ring",
    name: "HEALTH-RING",
    tagline: "Titanium Smart Ring",
    color: "#A78BFA",
    icon: Fingerprint,
    glowClass: "animate-glow-purple",
    patent: "Provisional Target Q3 2026",
    chip: "Custom ASIC",
    formFactor: "Titanium Ring",
    waveType: "spo2" as const,
    metrics: [
      "ECG (AFib)",
      "SpO₂",
      "HbA1c Est.",
      "Blood Pressure",
      "Sleep Staging",
      "Stress Score",
    ],
    desc: "Concept ring for researching optical and electrical sensing. Clinical measurement and diagnostic performance have not been validated.",
    signalPath: ["Optical Sensors", "Custom ASIC", "BLE 5.3", "Health App"],
  },
  {
    id: "lab",
    name: "HEALTH-LAB",
    tagline: "Biosensor Patch Concept",
    color: "#34D399",
    icon: Microscope,
    glowClass: "animate-glow-green",
    patent: "Provisional Target Q3 2026",
    chip: "Custom ASIC + BLE 5.3",
    formFactor: "Flexible Patch",
    waveType: "glucose" as const,
    metrics: [
      "Continuous Glucose",
      "Lactate",
      "Cortisol",
      "Electrolytes",
      "Uric Acid",
      "pH",
    ],
    desc: "Concept flexible biosensor patch for studying multiple biochemical sensing methods. Wear duration and measurement performance require physical validation.",
    signalPath: [
      "Biosensor Array",
      "Custom ASIC",
      "BLE 5.3",
      "Clinical Dashboard",
    ],
  },
];

// Canvas waveform
function WaveCanvas({
  type,
  color,
  width = 400,
  height = 70,
}: {
  type: string;
  color: string;
  width?: number;
  height?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const lastFrameRef = useRef<number>(0);
  // F-23: paint one static frame instead of looping when the visitor
  // prefers reduced motion.
  const reduceMotion = usePrefersReducedMotion();
  const offsetRef = useRef(0);
  const visibleRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const generateWave = (x: number): number => {
      switch (type) {
        case "ecg": {
          const t = ((x % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
          if (t < 0.3) return Math.sin(t * 10) * 0.15;
          if (t < 0.5) return -Math.sin((t - 0.3) * 15) * 0.08;
          if (t < 0.6) return Math.sin((t - 0.5) * 31.4) * 0.9;
          if (t < 0.7) return -Math.sin((t - 0.6) * 31.4) * 0.35;
          if (t < 0.9) return Math.sin((t - 0.7) * 15.7) * 0.2;
          return 0;
        }
        case "neural":
          return (
            Math.sin(x * 3.7) * 0.4 +
            Math.sin(x * 7.3) * 0.2 +
            Math.sin(x * 1.1) * 0.3 +
            (Math.random() - 0.5) * 0.05
          );
        case "spo2":
          return (
            Math.sin(x * 0.8) * 0.6 +
            Math.sin(x * 1.6) * 0.2 +
            Math.sin(x * 0.4) * 0.15
          );
        case "glucose":
          return (
            Math.sin(x * 0.4) * 0.4 +
            Math.sin(x * 1.2) * 0.15 +
            Math.sin(x * 2.8) * 0.08
          );
        default:
          return Math.sin(x) * 0.5;
      }
    };

    // P-01: paint one frame. Kept separate from the loop so the first frame
    // can render immediately (prerender snapshot, reduced motion) and the
    // loop below can throttle/pause without affecting it.
    const paint = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // P-01: glow without shadowBlur. shadowBlur forces a full-canvas
      // offscreen blur pass on every frame and was the single most expensive
      // call in this loop. A wide low-alpha halo stroke under the bright
      // core stroke reads the same at these sizes for a fraction of the cost.
      ctx.strokeStyle = color;
      ctx.beginPath();

      const points = 180;
      for (let i = 0; i < points; i++) {
        const px = (i / points) * w;
        const t = (i / points) * Math.PI * 6 + offsetRef.current;
        const py = h / 2 - generateWave(t) * (h * 0.4);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.save();
      ctx.globalAlpha = 0.25;
      ctx.lineWidth = 7;
      ctx.stroke();
      ctx.restore();
      ctx.lineWidth = 2;
      ctx.stroke();

      // Fade edges
      const gl = ctx.createLinearGradient(0, 0, w * 0.12, 0);
      gl.addColorStop(0, "rgba(10,15,30,1)");
      gl.addColorStop(1, "rgba(10,15,30,0)");
      ctx.fillStyle = gl;
      ctx.fillRect(0, 0, w * 0.12, h);

      const gr = ctx.createLinearGradient(w * 0.88, 0, w, 0);
      gr.addColorStop(0, "rgba(10,15,30,0)");
      gr.addColorStop(1, "rgba(10,15,30,1)");
      ctx.fillStyle = gr;
      ctx.fillRect(w * 0.88, 0, w * 0.12, h);

      offsetRef.current +=
        type === "neural" ? 0.07 : type === "ecg" ? 0.04 : 0.025;
    };

    // P-01: the rAF loop. Throttled to ~30fps (visually identical for a
    // glowing waveform, halves the per-second canvas cost) and fully
    // stopped — not just skipped — while the canvas is offscreen or the
    // tab is hidden, so a below-the-fold showcase never burns main-thread
    // time during page load.
    let running = false;
    const tick = (now: number) => {
      frameRef.current = 0;
      if (!running) return;
      if (now - lastFrameRef.current >= 33) {
        lastFrameRef.current = now;
        paint();
      }
      frameRef.current = requestAnimationFrame(tick);
    };
    const start = () => {
      if (running || reduceMotion) return;
      running = true;
      lastFrameRef.current = performance.now();
      frameRef.current = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      frameRef.current = 0;
    };
    const maybeStart = () => {
      if (!document.hidden && visibleRef.current) start();
      else stop();
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
        maybeStart();
      },
      // Start a little before the canvas scrolls into view so the wave is
      // already moving when the visitor arrives.
      { rootMargin: "200px" }
    );
    io.observe(canvas);
    document.addEventListener("visibilitychange", maybeStart);

    paint();
    maybeStart();

    return () => {
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", maybeStart);
    };
  }, [type, color, reduceMotion]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="w-full h-full"
      style={{ display: "block" }}
      aria-hidden="true"
    />
  );
}

// Signal path flow.
// P-01: plain elements with CSS transitions instead of framer-motion. The
// animated values are simple style interpolations (background, border,
// color, opacity over 0.3s) that CSS handles identically, without waking
// the motion scheduler on every 900ms step.
function SignalPath({ steps, color }: { steps: string[]; color: string }) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setActive(p => (p + 1) % steps.length), 900);
    return () => clearInterval(id);
  }, [steps.length]);

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center gap-1">
          <div
            className="text-[10px] font-bold px-2 py-1 rounded-lg border"
            style={{
              background: i <= active ? `${color}25` : "rgba(255,255,255,0.04)",
              borderColor:
                i <= active ? `${color}60` : "rgba(255,255,255,0.08)",
              color: i <= active ? color : "rgba(255,255,255,0.3)",
              transition:
                "background-color 0.3s, border-color 0.3s, color 0.3s",
            }}
          >
            {step}
          </div>
          {i < steps.length - 1 && (
            <span
              className="text-[10px]"
              style={{
                opacity: i < active ? 1 : 0.2,
                color: i < active ? color : "#ffffff30",
                transition: "opacity 0.3s, color 0.3s",
              }}
            >
              ▶
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

export default function HealthShowcase() {
  const [activeIdx, setActiveIdx] = useState(0);
  const device = DEVICES[activeIdx];
  const Icon = device.icon;

  const prev = useCallback(
    () => setActiveIdx(i => (i - 1 + DEVICES.length) % DEVICES.length),
    []
  );
  const next = useCallback(
    () => setActiveIdx(i => (i + 1) % DEVICES.length),
    []
  );

  return (
    <div className="w-full">
      {/* Device selector tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-none">
        {DEVICES.map((d, i) => {
          const DIcon = d.icon;
          return (
            <button
              key={d.id}
              onClick={() => setActiveIdx(i)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold whitespace-nowrap transition-all duration-200 shrink-0"
              style={{
                background:
                  activeIdx === i ? `${d.color}20` : "rgba(255,255,255,0.04)",
                borderColor:
                  activeIdx === i ? `${d.color}60` : "rgba(255,255,255,0.08)",
                color: activeIdx === i ? d.color : "rgba(255,255,255,0.4)",
              }}
            >
              <DIcon size={12} />
              {d.name}
            </button>
          );
        })}
      </div>

      {/* Main showcase */}
      <AnimatePresence mode="wait">
        <motion.div
          key={device.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
          className="rounded-2xl border overflow-hidden"
          style={{
            borderColor: `${device.color}30`,
            background: "rgba(10,15,30,0.8)",
          }}
        >
          {/* Header */}
          <div
            className="px-6 pt-6 pb-4 border-b"
            style={{ borderColor: `${device.color}20` }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{
                    background: `${device.color}20`,
                    border: `1.5px solid ${device.color}50`,
                  }}
                >
                  <Icon size={22} style={{ color: device.color }} />
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-white text-lg leading-tight">
                    {device.name}
                  </h3>
                  <p
                    className="text-xs font-semibold mt-0.5"
                    style={{ color: device.color }}
                  >
                    {device.tagline}
                  </p>
                </div>
              </div>
              <span
                className="text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0"
                style={{ background: `${device.color}20`, color: device.color }}
              >
                In Development · {device.patent}
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-0">
            {/* Left: waveform + signal path */}
            <div
              className="p-5 border-r"
              style={{ borderColor: `${device.color}15` }}
            >
              {/* Illustrative simulated waveform */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{ background: device.color }}
                  />
                  <span className="text-[10px] text-white/40 uppercase tracking-widest font-mono">
                    Simulated Signal
                  </span>
                </div>
                <div
                  className="h-[70px] rounded-xl overflow-hidden"
                  style={{
                    background: "rgba(0,0,0,0.3)",
                    border: `1px solid ${device.color}20`,
                  }}
                >
                  <WaveCanvas type={device.waveType} color={device.color} />
                </div>
              </div>

              {/* Signal path */}
              <div className="mb-4">
                <div className="text-[10px] text-white/30 uppercase tracking-widest mb-2 font-mono">
                  Illustrative Signal Path
                </div>
                <SignalPath steps={device.signalPath} color={device.color} />
              </div>

              {/* Chip / form factor */}
              <div className="grid grid-cols-2 gap-2">
                <div
                  className="rounded-xl p-3"
                  style={{
                    background: `${device.color}08`,
                    border: `1px solid ${device.color}20`,
                  }}
                >
                  <div className="text-[9px] text-white/30 uppercase tracking-widest">
                    Form Factor
                  </div>
                  <div className="text-xs font-bold text-white mt-0.5">
                    {device.formFactor}
                  </div>
                </div>
                <div
                  className="rounded-xl p-3"
                  style={{
                    background: `${device.color}08`,
                    border: `1px solid ${device.color}20`,
                  }}
                >
                  <div className="text-[9px] text-white/30 uppercase tracking-widest">
                    Chip
                  </div>
                  <div className="text-xs font-bold text-white mt-0.5">
                    {device.chip}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: metrics + description */}
            <div className="p-5">
              <p className="text-sm text-white/60 leading-relaxed mb-4">
                {device.desc}
              </p>
              <div className="text-[10px] text-white/30 uppercase tracking-widest mb-2 font-mono">
                Planned Research Metrics
              </div>
              <div className="flex flex-wrap gap-1.5 mb-5">
                {device.metrics.map((m, i) => (
                  <motion.span
                    key={m}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05, ease: [0.23, 1, 0.32, 1] }}
                    className="text-[10px] font-semibold px-2 py-1 rounded-lg"
                    style={{
                      background: `${device.color}15`,
                      color: device.color,
                      border: `1px solid ${device.color}30`,
                    }}
                  >
                    {m}
                  </motion.span>
                ))}
              </div>
              <Link
                href="/health"
                className="inline-flex items-center gap-2 text-sm font-bold transition-all hover:gap-3"
                style={{ color: device.color }}
              >
                Explore {device.name} <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Nav arrows */}
          <div
            className="flex items-center justify-between px-5 py-3 border-t"
            style={{ borderColor: `${device.color}15` }}
          >
            <button
              onClick={prev}
              className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/80 transition-colors"
            >
              <ChevronLeft size={14} /> Prev
            </button>
            <div
              className="flex"
              role="tablist"
              aria-label="Select health device"
            >
              {DEVICES.map((d, i) => (
                // The visible dot stays 6px, but the button itself is a 28px
                // target: a 6x6 control is unusable on touch and unlabelled
                // buttons are invisible to screen readers.
                <button
                  key={i}
                  onClick={() => setActiveIdx(i)}
                  role="tab"
                  aria-selected={i === activeIdx}
                  aria-label={`Show ${d.name ?? `device ${i + 1}`}`}
                  className="grid place-items-center w-7 h-7 rounded-full"
                >
                  <span
                    className="block w-1.5 h-1.5 rounded-full transition-all duration-300"
                    style={{
                      background:
                        i === activeIdx
                          ? device.color
                          : "rgba(255,255,255,0.2)",
                    }}
                  />
                </button>
              ))}
            </div>
            <button
              onClick={next}
              className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/80 transition-colors"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-4 text-center">
        <Link
          href="/health-compare"
          className="inline-flex items-center gap-2 text-sm font-semibold text-white/50 hover:text-white transition-colors"
        >
          Compare all 4 devices side-by-side <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
