import { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Watch, Fingerprint, Microscope, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "wouter";

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
    metrics: ["ECG (12-lead)", "SpO₂", "BAC Breath", "Heart Rate", "Temperature", "UV Index"],
    desc: "The world's first medical-grade health monitor in a USB-C pendrive. Plug into any device for instant ECG, blood oxygen, alcohol detection, temperature, UV exposure, and motion tracking.",
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
    metrics: ["sEMG Gesture Control", "TENS Therapy", "ECG", "SpO₂", "HRV", "Skin Temp"],
    desc: "A wristband that reads your muscles and nerves. sEMG gesture control lets you operate devices with hand gestures. TENS therapy provides pain relief. Full biometric monitoring included.",
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
    metrics: ["ECG (AFib)", "SpO₂", "HbA1c Est.", "Blood Pressure", "Sleep Staging", "Stress Score"],
    desc: "Medical-grade health monitoring in a titanium ring. Continuous ECG for AFib detection, cuffless blood pressure, HbA1c estimation, sleep staging, and stress scoring — all from your finger.",
    signalPath: ["Optical Sensors", "Custom ASIC", "BLE 5.3", "Health App"],
  },
  {
    id: "lab",
    name: "HEALTH-LAB",
    tagline: "14-Day Biosensor Patch",
    color: "#34D399",
    icon: Microscope,
    glowClass: "animate-glow-green",
    patent: "Provisional Target Q3 2026",
    chip: "Custom ASIC + BLE 5.3",
    formFactor: "Flexible Patch",
    waveType: "glucose" as const,
    metrics: ["Continuous Glucose", "Lactate", "Cortisol", "Electrolytes", "Uric Acid", "pH"],
    desc: "A flexible biosensor patch worn on the skin for 14 days. Continuously monitors glucose, lactate, cortisol, electrolytes, uric acid, and pH — the most comprehensive wearable biochemistry panel ever built.",
    signalPath: ["Biosensor Array", "Custom ASIC", "BLE 5.3", "Clinical Dashboard"],
  },
];

// Canvas waveform
function WaveCanvas({ type, color, width = 400, height = 70 }: { type: string; color: string; width?: number; height?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const offsetRef = useRef(0);

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
          return (Math.sin(x * 3.7) * 0.4 + Math.sin(x * 7.3) * 0.2 + Math.sin(x * 1.1) * 0.3 + (Math.random() - 0.5) * 0.05);
        case "spo2":
          return Math.sin(x * 0.8) * 0.6 + Math.sin(x * 1.6) * 0.2 + Math.sin(x * 0.4) * 0.15;
        case "glucose":
          return Math.sin(x * 0.4) * 0.4 + Math.sin(x * 1.2) * 0.15 + Math.sin(x * 2.8) * 0.08;
        default:
          return Math.sin(x) * 0.5;
      }
    };

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Glow
      ctx.shadowBlur = 10;
      ctx.shadowColor = color;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();

      const points = 300;
      for (let i = 0; i < points; i++) {
        const px = (i / points) * w;
        const t = (i / points) * Math.PI * 6 + offsetRef.current;
        const py = h / 2 - generateWave(t) * (h * 0.4);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
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

      offsetRef.current += type === "neural" ? 0.07 : type === "ecg" ? 0.04 : 0.025;
      frameRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(frameRef.current);
  }, [type, color]);

  return <canvas ref={canvasRef} width={width} height={height} className="w-full h-full" style={{ display: "block" }} />;
}

// Signal path flow
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
          <motion.div
            animate={{
              background: i <= active ? `${color}25` : "rgba(255,255,255,0.04)",
              borderColor: i <= active ? `${color}60` : "rgba(255,255,255,0.08)",
              color: i <= active ? color : "rgba(255,255,255,0.3)",
            }}
            transition={{ duration: 0.3 }}
            className="text-[10px] font-bold px-2 py-1 rounded-lg border"
          >
            {step}
          </motion.div>
          {i < steps.length - 1 && (
            <motion.span
              animate={{ opacity: i < active ? 1 : 0.2, color: i < active ? color : "#ffffff30" }}
              transition={{ duration: 0.3 }}
              className="text-[10px]">▶</motion.span>
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

  const prev = useCallback(() => setActiveIdx(i => (i - 1 + DEVICES.length) % DEVICES.length), []);
  const next = useCallback(() => setActiveIdx(i => (i + 1) % DEVICES.length), []);

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
                background: activeIdx === i ? `${d.color}20` : "rgba(255,255,255,0.04)",
                borderColor: activeIdx === i ? `${d.color}60` : "rgba(255,255,255,0.08)",
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
          style={{ borderColor: `${device.color}30`, background: "rgba(10,15,30,0.8)" }}
        >
          {/* Header */}
          <div className="px-6 pt-6 pb-4 border-b" style={{ borderColor: `${device.color}20` }}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ background: `${device.color}20`, border: `1.5px solid ${device.color}50` }}>
                  <Icon size={22} style={{ color: device.color }} />
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-white text-lg leading-tight">{device.name}</h3>
                  <p className="text-xs font-semibold mt-0.5" style={{ color: device.color }}>{device.tagline}</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0"
                style={{ background: `${device.color}20`, color: device.color }}>
                {device.patent}
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-0">
            {/* Left: waveform + signal path */}
            <div className="p-5 border-r" style={{ borderColor: `${device.color}15` }}>
              {/* Live waveform */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: device.color }} />
                  <span className="text-[10px] text-white/40 uppercase tracking-widest font-mono">Live Signal</span>
                </div>
                <div className="h-[70px] rounded-xl overflow-hidden"
                  style={{ background: "rgba(0,0,0,0.3)", border: `1px solid ${device.color}20` }}>
                  <WaveCanvas type={device.waveType} color={device.color} />
                </div>
              </div>

              {/* Signal path */}
              <div className="mb-4">
                <div className="text-[10px] text-white/30 uppercase tracking-widest mb-2 font-mono">Signal Path</div>
                <SignalPath steps={device.signalPath} color={device.color} />
              </div>

              {/* Chip / form factor */}
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl p-3" style={{ background: `${device.color}08`, border: `1px solid ${device.color}20` }}>
                  <div className="text-[9px] text-white/30 uppercase tracking-widest">Form Factor</div>
                  <div className="text-xs font-bold text-white mt-0.5">{device.formFactor}</div>
                </div>
                <div className="rounded-xl p-3" style={{ background: `${device.color}08`, border: `1px solid ${device.color}20` }}>
                  <div className="text-[9px] text-white/30 uppercase tracking-widest">Chip</div>
                  <div className="text-xs font-bold text-white mt-0.5">{device.chip}</div>
                </div>
              </div>
            </div>

            {/* Right: metrics + description */}
            <div className="p-5">
              <p className="text-sm text-white/60 leading-relaxed mb-4">{device.desc}</p>
              <div className="text-[10px] text-white/30 uppercase tracking-widest mb-2 font-mono">Monitored Metrics</div>
              <div className="flex flex-wrap gap-1.5 mb-5">
                {device.metrics.map((m, i) => (
                  <motion.span
                    key={m}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05, ease: [0.23, 1, 0.32, 1] }}
                    className="text-[10px] font-semibold px-2 py-1 rounded-lg"
                    style={{ background: `${device.color}15`, color: device.color, border: `1px solid ${device.color}30` }}
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
          <div className="flex items-center justify-between px-5 py-3 border-t" style={{ borderColor: `${device.color}15` }}>
            <button onClick={prev} className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/80 transition-colors">
              <ChevronLeft size={14} /> Prev
            </button>
            <div className="flex gap-1.5">
              {DEVICES.map((_, i) => (
                <button key={i} onClick={() => setActiveIdx(i)}
                  className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                  style={{ background: i === activeIdx ? device.color : "rgba(255,255,255,0.2)" }} />
              ))}
            </div>
            <button onClick={next} className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/80 transition-colors">
              Next <ChevronRight size={14} />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-4 text-center">
        <Link href="/health-compare"
          className="inline-flex items-center gap-2 text-sm font-semibold text-white/50 hover:text-white transition-colors">
          Compare all 4 devices side-by-side <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
