import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  Heart, Activity, Droplets, Thermometer, Moon, Zap,
  ChevronRight, ExternalLink, ArrowRight, Shield, Cpu,
  Wifi, Battery, Watch, FlaskConical
} from "lucide-react";

// ─── Live Biometric Waveform ─────────────────────────────────────────────────
function BiometricWave({ color, label, value, unit, wave }: {
  color: string; label: string; value: number; unit: string; wave: number[];
}) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 80);
    return () => clearInterval(id);
  }, []);

  const W = 200, H = 48;
  const pts = wave.map((v, i) => {
    const x = (i / (wave.length - 1)) * W;
    const y = H - (v / 100) * H;
    return `${x},${y}`;
  }).join(" ");

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0D1117] p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">{label}</span>
        <span className="text-lg font-black font-mono" style={{ color }}>
          {value}<span className="text-xs font-normal text-white/30 ml-1">{unit}</span>
        </span>
      </div>
      <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id={`grad-${label}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polyline
          points={pts}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <polygon
          points={`0,${H} ${pts} ${W},${H}`}
          fill={`url(#grad-${label})`}
        />
        {/* Scan line */}
        <line
          x1={(tick % W)}
          y1="0"
          x2={(tick % W)}
          y2={H}
          stroke={color}
          strokeWidth="1"
          strokeOpacity="0.4"
        />
      </svg>
    </div>
  );
}

// ─── Device 3D Card ──────────────────────────────────────────────────────────
function DeviceCard3D({ name, tagline, color, icon: Icon, metrics, price, battery, form }: {
  name: string; tagline: string; color: string;
  icon: React.FC<{ size?: number; style?: React.CSSProperties }>;
  metrics: string[]; price: string; battery: string; form: string;
}) {
  const [hovered, setHovered] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -20;
    setMouse({ x, y });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setMouse({ x: 0, y: 0 }); }}
      onMouseMove={handleMouseMove}
      animate={{ rotateX: mouse.y, rotateY: mouse.x }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="rounded-3xl border p-6 cursor-pointer transition-colors duration-300"
      style={{
        transformStyle: "preserve-3d",
        background: hovered ? `${color}08` : "#0D1117",
        borderColor: hovered ? `${color}40` : "rgba(255,255,255,0.08)",
        boxShadow: hovered ? `0 20px 60px ${color}20` : "none",
      } as React.CSSProperties}

    >
      {/* Icon */}
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
        style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
        <Icon size={24} style={{ color }} />
      </div>
      <h3 className="text-xl font-black text-white mb-1">{name}</h3>
      <p className="text-sm text-white/40 mb-4">{tagline}</p>

      {/* Metrics */}
      <div className="space-y-1.5 mb-5">
        {metrics.map(m => (
          <div key={m} className="flex items-center gap-2 text-xs text-white/60">
            <div className="w-1 h-1 rounded-full" style={{ background: color }} />
            {m}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <div>
          <div className="text-lg font-black" style={{ color }}>{price}</div>
          <div className="text-[10px] text-white/30">{form}</div>
        </div>
        <div className="text-right">
          <div className="text-sm font-semibold text-white/60">{battery}</div>
          <div className="text-[10px] text-white/30">battery</div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Coverage Matrix ─────────────────────────────────────────────────────────
const COVERAGE = [
  { metric: "Heart rate & HRV", device: "ring", method: "Optical PPG", schedule: "Continuous" },
  { metric: "SpO₂ oxygen", device: "ring", method: "Optical sensor", schedule: "Continuous" },
  { metric: "Body temperature", device: "ring", method: "Thermistor", schedule: "Continuous" },
  { metric: "Sleep stages (REM/Deep/Light)", device: "ring", method: "Accel + HRV", schedule: "Nightly" },
  { metric: "Steps & activity", device: "ring", method: "Accelerometer", schedule: "Continuous" },
  { metric: "Stress score", device: "ring", method: "HRV analysis", schedule: "Hourly" },
  { metric: "Ketones", device: "ring", method: "Micro breath port", schedule: "2× daily" },
  { metric: "Blood glucose", device: "patch", method: "CGM micro-sensor", schedule: "Every 15 min" },
  { metric: "Sodium, potassium", device: "patch", method: "Sweat biosensor", schedule: "Every 4 hrs" },
  { metric: "Magnesium, zinc", device: "patch", method: "Sweat biosensor", schedule: "Every 4 hrs" },
  { metric: "Hydration level", device: "patch", method: "Bioimpedance", schedule: "3× daily" },
  { metric: "Skin pH", device: "patch", method: "pH sensor", schedule: "Every 4 hrs" },
  { metric: "Lactate", device: "patch", method: "Sweat sensor", schedule: "During exercise" },
  { metric: "Vitamins A,C,D,E,K,B1–B12", device: "patch", method: "Monthly blood cartridge", schedule: "Monthly" },
  { metric: "Iron, zinc, calcium, magnesium", device: "patch", method: "Monthly mineral cartridge", schedule: "Monthly" },
  { metric: "Calories in (nutrition)", device: "app", method: "AI food camera", schedule: "Per meal" },
];

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function EHealth365() {
  const [activeDevice, setActiveDevice] = useState<"ring" | "patch" | "app">("ring");

  const WAVES = {
    hr: [50, 52, 55, 70, 90, 65, 55, 52, 50, 52, 55, 70, 90, 65, 55, 52, 50, 52, 55, 70],
    spo2: [85, 86, 87, 88, 88, 87, 88, 89, 90, 89, 88, 88, 87, 88, 89, 90, 89, 88, 88, 87],
    glucose: [55, 57, 60, 63, 65, 67, 68, 67, 65, 63, 61, 60, 59, 60, 62, 64, 65, 64, 63, 62],
    temp: [70, 71, 71, 72, 72, 73, 73, 72, 72, 71, 71, 72, 72, 73, 73, 72, 71, 71, 72, 72],
  };

  return (
    <div className="min-h-screen bg-[#0A0E1A] text-white">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "radial-gradient(circle at 30% 50%, #F97316 0%, transparent 50%), radial-gradient(circle at 70% 50%, #A78BFA 0%, transparent 50%)" }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="flex items-center gap-2 mb-6">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/20 uppercase tracking-widest">eCAD Hardware</span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#34D399]/10 text-[#34D399] border border-[#34D399]/20 uppercase tracking-widest">2 Devices</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-heading font-black mb-4 leading-tight">
                e<span className="text-[#F97316]">Health</span>365
              </h1>
              <p className="text-xl text-white/60 mb-2 font-semibold">Two-Device Health Monitoring System</p>
              <p className="text-lg text-white/50 mb-8 leading-relaxed">
                Smart Ring Pro + Smart Patch Pro + AI mobile hub — covering ~90% of all health metrics with just two wearable devices.
              </p>
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { val: "~90%", label: "Health Metrics" },
                  { val: "2", label: "Devices" },
                  { val: "24/7", label: "Monitoring" },
                ].map(s => (
                  <div key={s.label} className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
                    <div className="text-2xl font-black text-[#F97316]">{s.val}</div>
                    <div className="text-[10px] text-white/40 uppercase tracking-wider">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="flex gap-4">
                <a href="https://github.com/embeddedos-org/eCAD-Hardware-Products/tree/master/eHealth365_CAD_Design"
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-[#F97316] text-white hover:bg-[#F97316]/90 transition-colors">
                  View CAD Files <ExternalLink size={14} />
                </a>
                <Link href="/health"
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-colors">
                  EoS Health Devices <ChevronRight size={14} />
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Right — Live biometrics */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-3"
          >
            <div className="text-xs font-bold text-white/30 uppercase tracking-widest mb-4">Live Biometric Feed</div>
            <BiometricWave color="#F85149" label="Heart Rate" value={72} unit="bpm" wave={WAVES.hr} />
            <BiometricWave color="#22D3EE" label="SpO₂" value={98} unit="%" wave={WAVES.spo2} />
            <BiometricWave color="#F59E0B" label="Blood Glucose" value={94} unit="mg/dL" wave={WAVES.glucose} />
            <BiometricWave color="#F472B6" label="Body Temperature" value={36.8} unit="°C" wave={WAVES.temp} />
          </motion.div>
        </div>
      </section>

      {/* Device Cards */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-3xl font-heading font-black mb-3">Two Devices, Complete Coverage</h2>
            <p className="text-white/50">Each device is engineered for a specific sensing modality — together they cover the full health picture.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6">
            <DeviceCard3D
              name="Smart Ring Pro"
              tagline="Vitality Hub — autonomic nervous system & movement"
              color="#F97316"
              icon={Watch}
              metrics={[
                "Heart rate + HRV (optical PPG, continuous)",
                "SpO₂ oxygen saturation (continuous)",
                "Body temperature (thermistor, continuous)",
                "Sleep stages: REM / Deep / Light (nightly)",
                "Steps & activity (accelerometer, continuous)",
                "Stress score via HRV analysis (hourly)",
                "Ketones via micro breath port (2× daily)",
                "Hydration hint via skin conductance (every 4 hrs)",
              ]}
              price="$299"
              battery="4–5 days"
              form="Titanium/ceramic · No screen · Haptic feedback"
            />
            <DeviceCard3D
              name="Smart Patch Pro"
              tagline="Chemistry Hub — blood & interstitial fluid monitoring"
              color="#A78BFA"
              icon={FlaskConical}
              metrics={[
                "Blood glucose via CGM micro-sensor (every 15 min)",
                "Sodium, potassium via sweat biosensor (every 4 hrs)",
                "Magnesium, zinc via sweat biosensor (every 4 hrs)",
                "Hydration via bioimpedance (3× daily)",
                "Skin pH sensor (every 4 hrs)",
                "Lactate during exercise (sweat sensor)",
                "Vitamins A,C,D,E,K,B1–B12 (monthly blood cartridge)",
                "Iron, zinc, calcium, magnesium (monthly mineral cartridge)",
              ]}
              price="$199"
              battery="7 days"
              form="Flexible adhesive puck · Upper arm · Weekly patch"
            />
          </div>
        </div>
      </section>

      {/* Coverage Matrix */}
      <section className="py-20 border-t border-white/5 bg-[#0D1117]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="text-3xl font-heading font-black mb-3">Health Metric Coverage Matrix</h2>
            <p className="text-white/50 mb-6">Filter by device to see what each one monitors.</p>
            <div className="flex gap-2">
              {(["ring", "patch", "app"] as const).map(d => (
                <button
                  key={d}
                  onClick={() => setActiveDevice(d)}
                  className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
                  style={{
                    background: activeDevice === d ? (d === "ring" ? "#F97316" : d === "patch" ? "#A78BFA" : "#22D3EE") : "rgba(255,255,255,0.05)",
                    color: activeDevice === d ? "#fff" : "rgba(255,255,255,0.4)",
                  }}
                >
                  {d === "ring" ? "💍 Smart Ring Pro" : d === "patch" ? "🩹 Smart Patch Pro" : "📱 Mobile App"}
                </button>
              ))}
            </div>
          </motion.div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-xs font-bold text-white/40 uppercase tracking-wider">Health Metric</th>
                  <th className="text-left py-3 px-4 text-xs font-bold text-white/40 uppercase tracking-wider">Method</th>
                  <th className="text-left py-3 px-4 text-xs font-bold text-white/40 uppercase tracking-wider">Schedule</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="wait">
                  {COVERAGE.filter(r => r.device === activeDevice).map((row, i) => (
                    <motion.tr
                      key={row.metric}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ delay: i * 0.04 }}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="py-3 px-4 text-white/80 font-medium">{row.metric}</td>
                      <td className="py-3 px-4 text-white/50 font-mono text-xs">{row.method}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/5 text-white/40">{row.schedule}</span>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-3xl font-heading font-black mb-3">Pricing</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { item: "Smart Ring Pro", price: "$299", note: "One-time purchase" },
              { item: "Smart Patch Pro", price: "$199", note: "Starter kit" },
              { item: "Weekly patch refills", price: "$15/week", note: "Consumable" },
              { item: "Monthly blood cartridge", price: "$25/month", note: "Vitamins + minerals" },
            ].map((p, i) => (
              <motion.div
                key={p.item}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-5"
              >
                <div className="text-sm text-white/50 mb-2">{p.item}</div>
                <div className="text-2xl font-black text-[#F97316] mb-1">{p.price}</div>
                <div className="text-xs text-white/30">{p.note}</div>
              </motion.div>
            ))}
          </div>
          <p className="text-sm text-white/30 mt-4">Total first year: ~$1,100 (ring + patch + refills + app subscription)</p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-white/5 bg-[#0D1117]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl font-heading font-black mb-4">Explore the Hardware Designs</h2>
            <p className="text-white/50 mb-8">Full KiCad schematics, flex PCB layouts, BOM, 3D models, and app architecture — all open-source.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="https://github.com/embeddedos-org/eCAD-Hardware-Products/tree/master/eHealth365_CAD_Design"
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-[#F97316] text-white hover:bg-[#F97316]/90 transition-colors">
                View on GitHub <ExternalLink size={14} />
              </a>
              <Link href="/health"
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-colors">
                EoS Health Devices <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
