import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  ChevronRight,
  Radio,
  Zap,
  Shield,
  Wifi,
  Cpu,
  MapPin,
  AlertTriangle,
  Eye,
  Activity,
  ArrowRight,
  ExternalLink,
  Car,
  Navigation,
  Lock,
  Layers,
} from "lucide-react";

// ─── Animated Radar Sweep ────────────────────────────────────────────────────
function RadarSweep({ active }: { active: boolean }) {
  return (
    <div className="relative w-64 h-64 mx-auto">
      {/* Radar rings */}
      {[1, 2, 3, 4].map(i => (
        <div
          key={i}
          className="absolute inset-0 rounded-full border border-[#22D3EE]/20"
          style={{ margin: `${i * 14}%` } as React.CSSProperties}
        />
      ))}
      {/* Cross-hairs */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-px bg-[#22D3EE]/10" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-full w-px bg-[#22D3EE]/10" />
      </div>
      {/* Sweep */}
      {active && (
        <motion.div
          className="absolute inset-0"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "conic-gradient(from 0deg, transparent 270deg, rgba(34,211,238,0.4) 360deg)",
            }}
          />
        </motion.div>
      )}
      {/* Blips */}
      {active && (
        <>
          <motion.div
            className="absolute w-2 h-2 rounded-full bg-[#F97316]"
            style={{ top: "25%", left: "60%" }}
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          />
          <motion.div
            className="absolute w-2 h-2 rounded-full bg-[#F97316]"
            style={{ top: "65%", left: "30%" }}
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1.2 }}
          />
          <motion.div
            className="absolute w-1.5 h-1.5 rounded-full bg-[#22D3EE]"
            style={{ top: "40%", left: "75%" }}
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.8 }}
          />
        </>
      )}
      {/* Center dot */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-3 h-3 rounded-full bg-[#22D3EE] shadow-[0_0_12px_#22D3EE]" />
      </div>
    </div>
  );
}

// ─── Sensor Spec Card ────────────────────────────────────────────────────────
function SensorCard({
  icon: Icon,
  label,
  value,
  color,
  delay,
}: {
  icon: React.FC<{ size?: number; style?: React.CSSProperties }>;
  label: string;
  value: string;
  color: string;
  delay: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      className="rounded-2xl border border-white/10 p-4 hover:border-white/20 transition-colors"
      style={{ background: `${color}08` }}
    >
      <div className="flex items-center gap-3 mb-2">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: `${color}20` }}
        >
          <Icon size={16} style={{ color }} />
        </div>
        <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">
          {label}
        </span>
      </div>
      <p className="text-sm font-mono text-white/80 leading-relaxed">{value}</p>
    </motion.div>
  );
}

// ─── Alert Simulation ────────────────────────────────────────────────────────
function AlertDemo() {
  const [alerts, setAlerts] = useState<
    { id: number; msg: string; type: string }[]
  >([]);
  const [running, setRunning] = useState(false);

  const ALERT_MSGS = [
    { msg: "Vehicle approaching at 85 km/h — 120 m", type: "warn" },
    { msg: "Laser detection: object at 45° — 28 m", type: "info" },
    { msg: "V2X: Traffic signal ahead — SPaT received", type: "info" },
    { msg: "COLLISION RISK — hard brake recommended", type: "danger" },
    { msg: "Blind spot: vehicle detected right rear", type: "warn" },
    { msg: "V2X: Emergency vehicle approaching — 400 m", type: "danger" },
    { msg: "Radar clear — all zones nominal", type: "ok" },
  ];

  useEffect(() => {
    if (!running) return;
    let i = 0;
    const interval = setInterval(() => {
      const alert = ALERT_MSGS[i % ALERT_MSGS.length];
      setAlerts(prev => [{ id: Date.now(), ...alert }, ...prev].slice(0, 5));
      i++;
    }, 1200);
    return () => clearInterval(interval);
  }, [running]);

  const colorMap: Record<string, string> = {
    warn: "#F59E0B",
    info: "#22D3EE",
    danger: "#F85149",
    ok: "#34D399",
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0D1117] p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold text-white/40 uppercase tracking-widest">
          Live Alert Feed
        </span>
        <button
          onClick={() => setRunning(r => !r)}
          className="text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors"
          style={{
            background: running ? "#F8514920" : "#22D3EE20",
            color: running ? "#F85149" : "#22D3EE",
            border: `1px solid ${running ? "#F8514940" : "#22D3EE40"}`,
          }}
        >
          {running ? "Stop" : "Simulate"}
        </button>
      </div>
      <div className="space-y-2 min-h-[160px]">
        <AnimatePresence>
          {alerts.map(a => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center gap-2 text-xs font-mono py-1.5 px-3 rounded-lg"
              style={{
                background: `${colorMap[a.type]}15`,
                borderLeft: `2px solid ${colorMap[a.type]}`,
              }}
            >
              <span style={{ color: colorMap[a.type] }}>●</span>
              <span className="text-white/70">{a.msg}</span>
            </motion.div>
          ))}
        </AnimatePresence>
        {!running && alerts.length === 0 && (
          <div className="flex items-center justify-center h-full text-white/20 text-xs">
            Click Simulate to start
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function ERadar360() {
  const [radarActive, setRadarActive] = useState(true);
  const heroRef = useRef(null);

  const SPECS = [
    {
      icon: Radio,
      label: "Front Radar",
      value:
        "TI AWR2944 · 77 GHz FMCW · 120° FOV · 0–250 m · 0.75 m resolution",
      color: "#22D3EE",
      delay: 0,
    },
    {
      icon: Radio,
      label: "Rear Radar",
      value:
        "TI AWR2944 · 77 GHz FMCW · 120° FOV · 0–150 m · 0.75 m resolution",
      color: "#22D3EE",
      delay: 0.05,
    },
    {
      icon: Zap,
      label: "Laser Detection",
      value:
        "5× Hamamatsu G12183-010K InGaAs APD · 360° (72° spacing) · <50 ms latency",
      color: "#F97316",
      delay: 0.1,
    },
    {
      icon: Wifi,
      label: "V2X",
      value: "Autotalks TEKTON3 DSRC + C-V2X · 1 km LOS · BSM, TIM, SPaT, MAP",
      color: "#A78BFA",
      delay: 0.15,
    },
    {
      icon: Cpu,
      label: "AI Processor",
      value: "Rockchip RK3588S · 6 TOPS NPU · 97% false-alert suppression",
      color: "#34D399",
      delay: 0.2,
    },
    {
      icon: Cpu,
      label: "Co-Processor",
      value: "STM32H7B3 · Laser ADC · OBD-II parsing · GPS fusion",
      color: "#F59E0B",
      delay: 0.25,
    },
    {
      icon: MapPin,
      label: "GNSS",
      value: "u-blox NEO-M9N · GPS + GLONASS + Galileo + BeiDou",
      color: "#60A5FA",
      delay: 0.3,
    },
    {
      icon: Eye,
      label: "Display",
      value: '4" Samsung AMOLED · 480×800 · MIPI-DSI',
      color: "#F472B6",
      delay: 0.35,
    },
    {
      icon: Lock,
      label: "Connectivity",
      value: "Wi-Fi 6 + BT 5.3 + USB-C · 12V OBD-II or USB-C 5V/3A",
      color: "#22D3EE",
      delay: 0.4,
    },
  ];

  const CERTS = [
    "FCC Part 15B",
    "FCC Part 15.253 (77 GHz)",
    "FCC Part 90/95 (V2X)",
    "NHTSA FMVSS 111",
    "SAE J3016",
    "ISO 26262 ASIL-B",
    "IEC 62443",
    "UNECE WP.29 R155/R156",
  ];

  const CONFIGS = [
    {
      name: "eRadar360 Standard",
      desc: "Radar + Laser + GPS",
      cogs: "$285",
      msrp: "$699",
      margin: "59%",
    },
    {
      name: "eRadar360 Pro",
      desc: "Standard + V2X DSRC/C-V2X",
      cogs: "$310",
      msrp: "$899",
      margin: "65%",
    },
    {
      name: "Aegis One OEM",
      desc: "No display, V2X optional",
      cogs: "$240",
      msrp: "OEM pricing",
      margin: "—",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0A0E1A] text-white">
      {/* Hero */}
      <section
        ref={heroRef}
        className="relative min-h-[90vh] flex items-center overflow-hidden"
      >
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(rgba(34,211,238,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.3) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #22D3EE 0%, transparent 70%)",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-2 mb-6">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#22D3EE]/10 text-[#22D3EE] border border-[#22D3EE]/20 uppercase tracking-widest">
                  eCAD Hardware
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20 uppercase tracking-widest">
                  Pre-Production
                </span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-heading font-black mb-4 leading-tight">
                eRadar<span className="text-[#22D3EE]">360</span>
              </h1>
              <p className="text-xl text-white/60 mb-2 font-semibold">
                Also marketed as{" "}
                <span className="text-[#A78BFA]">Aegis One</span> (OEM)
              </p>
              <p className="text-lg text-white/50 mb-8 leading-relaxed">
                360° automotive safety — fusing 77 GHz radar, laser detection,
                V2X communication, and 6 TOPS AI in a single windshield-mounted
                device.
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                {[
                  "360° Radar",
                  "Laser Detection",
                  "V2X / DSRC",
                  "6 TOPS AI",
                  "97% Accuracy",
                ].map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-xs font-semibold bg-white/5 text-white/60 border border-white/10"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex gap-4">
                <a
                  href="https://github.com/embeddedos-org/eCAD-Hardware-Products/tree/master/eRadar360_CAD_Design"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-[#22D3EE] text-[#0A0E1A] hover:bg-[#22D3EE]/90 transition-colors"
                >
                  View CAD Files <ExternalLink size={14} />
                </a>
                <Link
                  href="/hardware-lab"
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-colors"
                >
                  Hardware Lab <ChevronRight size={14} />
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Right — Radar animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col items-center gap-6"
          >
            <div className="rounded-3xl border border-[#22D3EE]/20 bg-[#0D1117] p-8 w-full max-w-sm">
              <div className="text-center mb-4">
                <span className="text-xs font-bold text-[#22D3EE]/60 uppercase tracking-widest">
                  Live Radar Simulation
                </span>
              </div>
              <RadarSweep active={radarActive} />
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => setRadarActive(r => !r)}
                  className="text-xs px-4 py-2 rounded-lg font-semibold transition-colors"
                  style={{
                    background: radarActive ? "#F8514920" : "#22D3EE20",
                    color: radarActive ? "#F85149" : "#22D3EE",
                    border: `1px solid ${radarActive ? "#F8514940" : "#22D3EE40"}`,
                  }}
                >
                  {radarActive ? "Pause Radar" : "Start Radar"}
                </button>
              </div>
            </div>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 w-full max-w-sm">
              {[
                { val: "250 m", label: "Max Range" },
                { val: "<50 ms", label: "Alert Latency" },
                { val: "97%", label: "Accuracy" },
              ].map(s => (
                <div
                  key={s.label}
                  className="rounded-xl border border-white/10 bg-white/5 p-3 text-center"
                >
                  <div className="text-lg font-black text-[#22D3EE]">
                    {s.val}
                  </div>
                  <div className="text-[10px] text-white/40 uppercase tracking-wider">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sensor Specs */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-3xl font-heading font-black mb-3">
              Sensor Architecture
            </h2>
            <p className="text-white/50">
              Four independent sensor modalities fused by a 6 TOPS AI processor.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SPECS.map(s => (
              <SensorCard key={s.label} {...s} />
            ))}
          </div>
        </div>
      </section>

      {/* Alert Demo */}
      <section className="py-20 border-t border-white/5 bg-[#0D1117]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-heading font-black mb-4">
                Real-Time Threat Detection
              </h2>
              <p className="text-white/50 mb-6 leading-relaxed">
                The AI processor fuses radar, laser, and V2X data streams in
                real time. Threats are classified, filtered (97% false-alert
                suppression), and surfaced to the driver in under 50 ms.
              </p>
              <div className="space-y-3">
                {[
                  {
                    icon: Radio,
                    label: "Radar fusion",
                    desc: "Front + rear 77 GHz FMCW, 0.75 m resolution",
                  },
                  {
                    icon: Zap,
                    label: "Laser grid",
                    desc: "5-point 360° coverage, <50 ms alert latency",
                  },
                  {
                    icon: Wifi,
                    label: "V2X messages",
                    desc: "BSM, TIM, SPaT, MAP at 1 km LOS range",
                  },
                  {
                    icon: Cpu,
                    label: "AI classifier",
                    desc: "RK3588S NPU, 6 TOPS, radar signature fingerprinting",
                  },
                ].map(item => (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#22D3EE]/10 flex items-center justify-center shrink-0 mt-0.5">
                      <item.icon size={14} className="text-[#22D3EE]" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">
                        {item.label}
                      </div>
                      <div className="text-xs text-white/40">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <AlertDemo />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Configurations */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-3xl font-heading font-black mb-3">
              Configurations & Pricing
            </h2>
            <p className="text-white/50">
              Three configurations for consumer, pro, and OEM markets.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {CONFIGS.map((c, i) => (
              <motion.div
                key={c.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-2xl border p-6 ${i === 1 ? "border-[#22D3EE]/40 bg-[#22D3EE]/5" : "border-white/10 bg-white/5"}`}
              >
                {i === 1 && (
                  <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#22D3EE]/20 text-[#22D3EE] uppercase tracking-widest mb-3">
                    Most Popular
                  </span>
                )}
                <h3 className="text-lg font-bold text-white mb-1">{c.name}</h3>
                <p className="text-sm text-white/40 mb-4">{c.desc}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/40">COGS</span>
                    <span className="text-white font-mono">{c.cogs}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">MSRP</span>
                    <span className="text-[#22D3EE] font-bold font-mono">
                      {c.msrp}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Margin</span>
                    <span className="text-[#34D399] font-mono">{c.margin}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-20 border-t border-white/5 bg-[#0D1117]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <h2 className="text-3xl font-heading font-black mb-3">
              Regulatory Compliance
            </h2>
            <p className="text-white/50">
              Full documentation complete for all major markets.
            </p>
          </motion.div>
          <div className="flex flex-wrap gap-3">
            {CERTS.map((c, i) => (
              <motion.span
                key={c}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-[#34D399]/10 text-[#34D399] border border-[#34D399]/20"
              >
                <Shield size={12} />
                {c}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-heading font-black mb-4">
              Explore the CAD Files
            </h2>
            <p className="text-white/50 mb-8">
              Full KiCad schematics, PCB stackup, BOM, pick-and-place, firmware,
              and simulation code — all open-source under MIT License.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://github.com/embeddedos-org/eCAD-Hardware-Products/tree/master/eRadar360_CAD_Design"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-[#22D3EE] text-[#0A0E1A] hover:bg-[#22D3EE]/90 transition-colors"
              >
                View on GitHub <ExternalLink size={14} />
              </a>
              <Link
                href="/hardware-lab"
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-colors"
              >
                All Hardware Products <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
