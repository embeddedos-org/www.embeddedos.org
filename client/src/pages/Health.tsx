import { motion } from "framer-motion";
import { Link } from "wouter";
import { Activity, Watch, Fingerprint, Microscope, Stethoscope, ArrowRight, Shield, Cpu, Wifi, Heart, Zap, ChevronDown } from "lucide-react";
import { Suspense, lazy, useState, useRef, useEffect } from "react";
const DeviceRadarChart = lazy(() => import("../components/DeviceRadarChart"));

const HealthDevice3DCanvas = lazy(() =>
  import("../components/HealthDevice3D").then(m => ({ default: m.HealthDevice3DCanvas }))
);

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.06, ease: "easeOut" as const },
  }),
};

const DEVICES = [
  {
    id: "health-key-ultra",
    name: "HEALTH-KEY ULTRA",
    tagline: "USB-C Pendrive Health Monitor",
    desc: "The world's first medical-grade health monitor in a USB-C pendrive form factor. Plug into any device for instant ECG, blood oxygen, alcohol detection, temperature, UV exposure, and motion tracking.",
    patent: "U.S. Patent Pending — 64/073,334 (May 23, 2026)",
    color: "#F85149",
    icon: Activity,
    formFactor: "USB-C Pendrive",
    chip: "nRF52840",
    device3d: "key" as const,
    waveType: "ecg" as const,
    waveLabel: "Live ECG Simulation",
    waveColor: "#F85149",
    metrics: ["ECG (12-lead)", "SpO₂", "BAC Breath", "Heart Rate", "Temperature", "UV Index", "IMU / Motion", "USB-C Pass-Through"],
    status: "Patent Pending",
  },
  {
    id: "health-band-neuro",
    name: "HEALTH-BAND Neuro",
    tagline: "AI-Powered Neuro Wristband",
    desc: "A wristband that reads your muscles and nerves. sEMG gesture control lets you operate devices with hand gestures. TENS therapy provides pain relief. Full biometric monitoring included.",
    patent: "U.S. Patent Pending — 64/076,078 (May 27, 2026)",
    color: "#F59E0B",
    icon: Watch,
    formFactor: "Wristband",
    chip: "nRF52840 + TFLite",
    device3d: "band" as const,
    waveType: "neural" as const,
    waveLabel: "sEMG Neural Signal",
    waveColor: "#F59E0B",
    metrics: ["sEMG Gesture Control", "TENS Therapy", "BAC Breath", "ECG", "SpO₂", "Heart Rate", "HRV", "Skin Temperature"],
    status: "Patent Pending",
  },
  {
    id: "health-ring",
    name: "HEALTH-RING",
    tagline: "Titanium Smart Ring",
    desc: "Medical-grade health monitoring in a titanium ring. Continuous ECG for AFib detection, cuffless blood pressure, HbA1c estimation, sleep staging, and stress scoring — all from your finger.",
    patent: "Provisional Target: 2026 Q3 — EOS-2026-003",
    color: "#A78BFA",
    icon: Fingerprint,
    formFactor: "Titanium Finger Ring",
    chip: "Custom ASIC",
    device3d: "ring" as const,
    waveType: "spo2" as const,
    waveLabel: "SpO₂ Waveform",
    waveColor: "#A78BFA",
    metrics: ["ECG (AFib Detection)", "SpO₂", "HbA1c Estimation", "Cuffless Blood Pressure", "HRV", "Sleep Stages", "Stress Score", "Body Temperature"],
    status: "In Development",
  },
  {
    id: "health-lab",
    name: "HEALTH-LAB",
    tagline: "14-Day Biosensor Patch",
    desc: "A flexible biosensor patch worn on the skin for 14 days. Continuously monitors glucose, lactate, cortisol, electrolytes, uric acid, and pH — the most comprehensive wearable biochemistry panel ever built.",
    patent: "Provisional Target: 2026 Q3 — EOS-2026-004",
    color: "#34D399",
    icon: Microscope,
    formFactor: "Flexible Biosensor Patch",
    chip: "Custom ASIC + BLE 5.3",
    device3d: "lab" as const,
    waveType: "temp" as const,
    waveLabel: "Glucose Trend",
    waveColor: "#34D399",
    metrics: ["Continuous Glucose", "Lactate", "Cortisol", "Sodium (Na⁺)", "Potassium (K⁺)", "Uric Acid", "pH", "14-Day Wear"],
    status: "In Development",
  },
];

const STATS = [
  { value: "4", label: "Health Devices", color: "#F97316" },
  { value: "~95%", label: "Clinical Metrics Covered", color: "#34D399" },
  { value: "2", label: "Patents Pending", color: "#A78BFA" },
  { value: "1", label: "Unified App", color: "#22D3EE" },
];

const STATUS_COLORS: Record<string, string> = {
  "Patent Pending": "#34D399",
  "In Development": "#F59E0B",
};

// Biometric waveform canvas component
function BiometricWaveform({ type, color }: { type: "ecg" | "spo2" | "neural" | "temp"; color: string }) {
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
          const t = x % (Math.PI * 2);
          if (t < 0.3) return Math.sin(t * 10) * 0.3;
          if (t < 0.5) return Math.sin((t - 0.3) * Math.PI / 0.2) * 1.0;
          if (t < 0.7) return -Math.sin((t - 0.5) * Math.PI / 0.2) * 0.4;
          if (t < 1.0) return Math.sin((t - 0.7) * Math.PI / 0.3) * 0.6;
          return Math.sin(t * 2) * 0.05;
        }
        case "spo2": return Math.sin(x * 1.2) * 0.6 + Math.sin(x * 2.4) * 0.2;
        case "neural": return Math.sin(x * 8) * 0.15 + Math.sin(x * 3.3) * 0.4 + Math.sin(x * 1.1) * 0.3 + (Math.random() - 0.5) * 0.08;
        case "temp": return Math.sin(x * 0.5) * 0.3 + Math.sin(x * 1.5) * 0.1;
        default: return 0;
      }
    };

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      ctx.shadowBlur = 8;
      ctx.shadowColor = color;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();

      const points = 200;
      for (let i = 0; i < points; i++) {
        const x = (i / points) * w;
        const t = (i / points) * Math.PI * 4 + offsetRef.current;
        const y = h / 2 - generateWave(t) * (h * 0.38);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      const grad = ctx.createLinearGradient(0, 0, w * 0.15, 0);
      grad.addColorStop(0, "rgba(10,15,30,1)");
      grad.addColorStop(1, "rgba(10,15,30,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w * 0.15, h);

      const grad2 = ctx.createLinearGradient(w * 0.85, 0, w, 0);
      grad2.addColorStop(0, "rgba(10,15,30,0)");
      grad2.addColorStop(1, "rgba(10,15,30,1)");
      ctx.fillStyle = grad2;
      ctx.fillRect(w * 0.85, 0, w * 0.15, h);

      offsetRef.current += type === "neural" ? 0.06 : 0.03;
      frameRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(frameRef.current);
  }, [type, color]);

  return <canvas ref={canvasRef} width={400} height={60} className="w-full h-full" style={{ display: "block" }} />;
}

// Device card with 3D render
function DeviceCard({ device, index }: { device: typeof DEVICES[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  const Icon = device.icon;

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      custom={index}
      className="glass rounded-2xl overflow-hidden border border-white/5 card-hover"
      style={{ borderTopColor: device.color, borderTopWidth: 2 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* 3D Device Render */}
      <div className="h-44 w-full relative bg-gradient-to-b from-[#0a0f1e] to-[#060a14]">
        <Suspense fallback={
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-[#F97316] border-t-transparent rounded-full animate-spin" />
          </div>
        }>
          <HealthDevice3DCanvas device={device.device3d} hovered={hovered} />
        </Suspense>
        {/* Device name overlay */}
        <div className="absolute bottom-2 left-3 flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: device.color }} />
          <span className="text-[9px] text-white/40 font-mono uppercase tracking-widest">3D Preview</span>
        </div>
      </div>

      {/* Biometric Waveform */}
      <div className="px-4 py-2 bg-[#060a14] border-b border-white/5">
        <div className="text-[9px] text-white/30 uppercase tracking-widest mb-1">{device.waveLabel}</div>
        <div className="h-[60px]">
          <BiometricWaveform type={device.waveType} color={device.waveColor} />
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: device.color + "20", border: `1px solid ${device.color}40` }}
          >
            <Icon size={24} style={{ color: device.color }} />
          </div>
          <span
            className="text-[10px] font-bold px-2 py-1 rounded-full"
            style={{ background: STATUS_COLORS[device.status] + "20", color: STATUS_COLORS[device.status] }}
          >
            {device.status}
          </span>
        </div>

        <h3 className="font-heading font-extrabold text-white text-lg mb-0.5">{device.name}</h3>
        <p className="text-sm font-semibold mb-3" style={{ color: device.color }}>{device.tagline}</p>
        <p className="text-sm text-white/60 leading-relaxed mb-4">{device.desc}</p>

        {/* Specs */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="glass rounded-lg p-2 border border-white/5">
            <div className="text-[10px] text-white/30 uppercase tracking-widest">Form Factor</div>
            <div className="text-xs text-white font-semibold mt-0.5">{device.formFactor}</div>
          </div>
          <div className="glass rounded-lg p-2 border border-white/5">
            <div className="text-[10px] text-white/30 uppercase tracking-widest">Chip</div>
            <div className="text-xs text-white font-semibold mt-0.5">{device.chip}</div>
          </div>
        </div>

        {/* Metrics */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {device.metrics.map(m => (
            <span key={m} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/50 border border-white/10">{m}</span>
          ))}
        </div>

        {/* Patent */}
        <div className="text-[10px] text-white/30 border-t border-white/5 pt-3">
          <Shield size={10} className="inline mr-1" />
          {device.patent}
        </div>
      </div>
    </motion.div>
  );
}

export default function Health() {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="section-padding bg-grid relative overflow-hidden">
        {/* Animated background glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/6 w-80 h-80 bg-[#F85149]/8 rounded-full blur-[100px]" />
          <div className="absolute top-1/3 right-1/6 w-72 h-72 bg-[#A78BFA]/8 rounded-full blur-[90px]" />
          <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-[#34D399]/6 rounded-full blur-[80px]" />
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative">
          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            <div className="badge-amber mb-4 inline-flex">
              <Heart size={12} className="animate-heartbeat" />
              EoS Health Ecosystem
            </div>
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-white mb-4">
              The Future of{" "}
              <span className="text-gradient">Wearable Health</span>
            </h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto mb-6">
              Four patent-pending health devices covering ~95% of all clinically relevant health metrics.
              Open hardware, open firmware, unified mobile app.
            </p>
            {/* Live metric tickers */}
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              {[
                { label: "Heart Rate", value: "72 bpm", color: "#F85149" },
                { label: "SpO₂", value: "98%", color: "#F59E0B" },
                { label: "HRV", value: "42 ms", color: "#A78BFA" },
                { label: "Glucose", value: "94 mg/dL", color: "#34D399" },
              ].map(m => (
                <div key={m.label} className="flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs"
                  style={{ background: m.color + "12", borderColor: m.color + "30" }}>
                  <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: m.color }} />
                  <span className="text-white/40">{m.label}</span>
                  <span className="font-bold" style={{ color: m.color }}>{m.value}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="https://github.com/embeddedos-org/eos-health"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#F97316] hover:bg-[#EA580C] text-white font-bold rounded-xl transition-all active:scale-95"
              >
                View on GitHub
                <ArrowRight size={16} />
              </a>
              <Link href="/health-compare" className="inline-flex items-center gap-2 px-6 py-3 glass hover:bg-white/10 text-white font-semibold rounded-xl transition-all border border-white/10">
                Compare Devices
              </Link>
            </div>
            <div className="mt-8 flex justify-center">
              <ChevronDown size={20} className="text-white/20 animate-bounce" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 bg-[#080F1E]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {STATS.map((s) => (
              <div key={s.label}>
                <div className="font-heading font-extrabold text-3xl" style={{ color: s.color }}>{s.value}</div>
                <div className="text-xs text-white/40 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Device Cards with 3D Renders */}
      <section className="section-padding">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-10 text-center">
            <h2 className="font-heading font-bold text-white text-3xl mb-2">The Four-Device Ecosystem</h2>
            <p className="text-white/50">Interactive 3D previews with live biometric signal simulations. Together, these four devices cover ~95% of all clinically relevant health metrics.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 gap-6">
            {DEVICES.map((device, i) => (
              <DeviceCard key={device.id} device={device} index={i} />
            ))}
          </div>

          {/* Radar chart comparison */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={2}
            className="mt-12 glass rounded-2xl p-8 border border-white/5"
          >
            <div className="text-center mb-6">
              <div className="badge-teal mb-3 inline-flex">Capability Radar</div>
              <h3 className="font-heading font-bold text-white text-xl mb-1">Device Capability Comparison</h3>
              <p className="text-sm text-white/40">Click a device to toggle it. Hover to highlight.</p>
            </div>
            <Suspense fallback={<div className="h-64 flex items-center justify-center text-white/20">Loading chart...</div>}>
              <DeviceRadarChart />
            </Suspense>
            <div className="text-center mt-4">
              <Link href="/health-compare" className="inline-flex items-center gap-2 text-sm font-semibold text-white/40 hover:text-white transition-colors">
                Full spec comparison table <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Health Hub App */}
      <section className="section-padding bg-[#080F1E]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="glass rounded-2xl p-8 border border-[#34D399]/20 bg-[#34D399]/5"
          >
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0"
                style={{ background: "#34D39920", border: "1px solid #34D39940" }}
              >
                <Stethoscope size={32} className="text-[#34D399]" />
              </div>
              <div className="flex-1">
                <h2 className="font-heading font-extrabold text-white text-2xl mb-2">Single Health Hub App</h2>
                <p className="text-white/60 mb-4">
                  One app for all four devices. iOS and Android. Connects via BLE 5.3 or USB-C.
                  Includes Digital Twin, AI Food Camera, Doctor Dashboard, and Deficiency Alerts.
                </p>
                <div className="grid sm:grid-cols-2 gap-3 mb-4">
                  {[
                    { icon: Cpu, label: "Digital Twin", desc: "Real-time health model" },
                    { icon: Zap, label: "AI Food Camera", desc: "Instant nutrition analysis" },
                    { icon: Wifi, label: "Doctor Dashboard", desc: "Share with your physician" },
                    { icon: Shield, label: "Deficiency Alerts", desc: "Proactive health warnings" },
                  ].map(({ icon: Icon, label, desc }) => (
                    <div key={label} className="flex items-center gap-3 glass rounded-xl p-3 border border-white/5">
                      <div className="w-8 h-8 rounded-lg bg-[#34D399]/10 flex items-center justify-center flex-shrink-0">
                        <Icon size={16} className="text-[#34D399]" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">{label}</div>
                        <div className="text-xs text-white/40">{desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="https://github.com/embeddedos-org/eos-health"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#34D399] hover:bg-[#10B981] text-[#0a0f1e] font-bold rounded-xl text-sm transition-all active:scale-95"
                  >
                    View Health Repo <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Open Hardware CTA */}
      <section className="section-padding">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="font-heading font-bold text-white text-2xl mb-3">Open Hardware. Open Firmware. Open Data.</h2>
            <p className="text-white/50 max-w-xl mx-auto mb-6">
              All schematics, firmware, and mobile app code are open source under the MIT License.
              Build your own, contribute improvements, or integrate with your platform.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/get-involved" className="inline-flex items-center gap-2 px-6 py-3 bg-[#F97316] hover:bg-[#EA580C] text-white font-bold rounded-xl transition-all active:scale-95">
                Get Involved <ArrowRight size={16} />
              </Link>
              <Link href="/hardware-lab" className="inline-flex items-center gap-2 px-6 py-3 glass hover:bg-white/10 text-white font-semibold rounded-xl transition-all border border-white/10">
                Hardware Lab
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
