import { motion } from "framer-motion";
import { ArrowRight, Plane, Rocket, Zap, Shield, Cpu, Wifi, Battery, Wind, Navigation, Gauge } from "lucide-react";
import { Suspense, lazy, useState, useRef, useEffect } from "react";

const AeroSwiftPersonalCanvas = lazy(() =>
  import("../components/AeroSwift3D").then(m => ({ default: m.AeroSwiftPersonalCanvas }))
);
const AeroSwiftTransitCanvas = lazy(() =>
  import("../components/AeroSwift3D").then(m => ({ default: m.AeroSwiftTransitCanvas }))
);

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.06, ease: "easeOut" as const },
  }),
};

const VEHICLES = [
  {
    name: "AeroSwift-Personal (AS-1/2)",
    tagline: "Personal Air Vehicle",
    desc: "A 1-to-2 passenger personal air vehicle (PAV) designed for daily consumer commutes. Features foldable wings for garage storage, solar-hybrid propulsion, and a 90 kWh battery pack for 300+ km range.",
    color: "#60A5FA",
    icon: Plane,
    model: "personal" as const,
    telemetry: [
      { label: "Passengers", value: "1–2" },
      { label: "Battery", value: "90 kWh" },
      { label: "Range", value: "300+ km" },
      { label: "Storage", value: "Foldable Wings" },
      { label: "Top Speed", value: "185 mph" },
      { label: "Altitude", value: "1,200 ft" },
    ],
    features: ["Consumer commute", "Garage-storable", "Autonomous flight modes", "Tesla-style controls"],
  },
  {
    name: "AeroSwift-Transit (AS-10)",
    tagline: "Urban Air Taxi",
    desc: "A 10-passenger urban air mobility (UAM) shuttle for commercial air taxi networks. Features a wide-body cabin, 480 kWh solid-state battery, triple-redundant safety systems, and AeroOS real-time OS.",
    color: "#F472B6",
    icon: Rocket,
    model: "transit" as const,
    telemetry: [
      { label: "Passengers", value: "10" },
      { label: "Battery", value: "480 kWh" },
      { label: "Range", value: "320 km" },
      { label: "Safety", value: "Triple-Redundant" },
      { label: "Top Speed", value: "210 mph" },
      { label: "Altitude", value: "2,800 ft" },
    ],
    features: ["Commercial air taxi", "Wide-body cabin", "Fleet management", "AeroOS RTOS"],
  },
];

const TECH_STACK = [
  { name: "AeroOS", desc: "Real-time operating system for flight control", icon: Cpu, color: "#F97316" },
  { name: "Flight Computer", desc: "8-layer & 12-layer TMR PCB design", icon: Shield, color: "#22D3EE" },
  { name: "Solar-Hybrid Drive", desc: "Photovoltaic + battery propulsion system", icon: Zap, color: "#F59E0B" },
  { name: "BLE + 5G Telemetry", desc: "Real-time fleet monitoring and control", icon: Wifi, color: "#34D399" },
  { name: "Solid-State Battery", desc: "480 kWh next-gen energy storage", icon: Battery, color: "#A78BFA" },
  { name: "VTOL Aerodynamics", desc: "Vertical takeoff and landing system", icon: Wind, color: "#60A5FA" },
];

// Animated telemetry gauge
function TelemetryGauge({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
      <div className="text-sm font-bold" style={{ color }}>{value}</div>
      <div className="text-[10px] text-white/40 mt-0.5 capitalize">{label}</div>
    </div>
  );
}

// Animated altitude/speed chart
function FlightSimChart({ color }: { color: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const offsetRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Grid lines
      ctx.strokeStyle = "rgba(255,255,255,0.04)";
      ctx.lineWidth = 1;
      for (let i = 1; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(0, (h / 4) * i);
        ctx.lineTo(w, (h / 4) * i);
        ctx.stroke();
      }

      // Flight path (smooth altitude curve)
      ctx.shadowBlur = 12;
      ctx.shadowColor = color;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.beginPath();

      const points = 150;
      for (let i = 0; i < points; i++) {
        const x = (i / points) * w;
        const t = (i / points) * Math.PI * 3 + offsetRef.current;
        const y = h * 0.5 - (
          Math.sin(t * 0.8) * h * 0.2 +
          Math.sin(t * 1.6) * h * 0.1 +
          Math.sin(t * 0.3) * h * 0.15
        );
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Fill under curve
      ctx.shadowBlur = 0;
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, color + "30");
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.beginPath();
      for (let i = 0; i < points; i++) {
        const x = (i / points) * w;
        const t = (i / points) * Math.PI * 3 + offsetRef.current;
        const y = h * 0.5 - (
          Math.sin(t * 0.8) * h * 0.2 +
          Math.sin(t * 1.6) * h * 0.1 +
          Math.sin(t * 0.3) * h * 0.15
        );
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fill();

      // Edge fades
      const fadeL = ctx.createLinearGradient(0, 0, w * 0.1, 0);
      fadeL.addColorStop(0, "rgba(8,15,30,1)");
      fadeL.addColorStop(1, "rgba(8,15,30,0)");
      ctx.fillStyle = fadeL;
      ctx.fillRect(0, 0, w * 0.1, h);

      const fadeR = ctx.createLinearGradient(w * 0.9, 0, w, 0);
      fadeR.addColorStop(0, "rgba(8,15,30,0)");
      fadeR.addColorStop(1, "rgba(8,15,30,1)");
      ctx.fillStyle = fadeR;
      ctx.fillRect(w * 0.9, 0, w * 0.1, h);

      offsetRef.current += 0.025;
      frameRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(frameRef.current);
  }, [color]);

  return <canvas ref={canvasRef} width={500} height={80} className="w-full h-full" style={{ display: "block" }} />;
}

// Vehicle card with 3D render
function VehicleCard({ vehicle, index }: { vehicle: typeof VEHICLES[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  const Icon = vehicle.icon;

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      custom={index}
      className="glass rounded-2xl overflow-hidden border border-white/5 card-hover"
      style={{ borderTopColor: vehicle.color, borderTopWidth: 2 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* 3D Aircraft Render */}
      <div className="h-52 w-full relative bg-gradient-to-b from-[#060d1e] to-[#040810]">
        <Suspense fallback={
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-[#60A5FA] border-t-transparent rounded-full animate-spin" />
          </div>
        }>
          {vehicle.model === "personal" ? <AeroSwiftPersonalCanvas /> : <AeroSwiftTransitCanvas />}
        </Suspense>
        {/* Overlay badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: vehicle.color }} />
          <span className="text-[9px] text-white/40 font-mono uppercase tracking-widest">3D Simulation</span>
        </div>
        <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[9px] font-bold" style={{ background: vehicle.color + "25", color: vehicle.color, border: `1px solid ${vehicle.color}40` }}>
          VTOL
        </div>
      </div>

      {/* Flight telemetry chart */}
      <div className="px-4 py-2 bg-[#040810] border-b border-white/5">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[9px] text-white/30 uppercase tracking-widest flex items-center gap-1">
            <Navigation className="w-2.5 h-2.5" /> Live Flight Telemetry
          </span>
          <span className="text-[9px] font-mono" style={{ color: vehicle.color }}>● SIMULATED</span>
        </div>
        <div className="h-[80px]">
          <FlightSimChart color={vehicle.color} />
        </div>
      </div>

      {/* Telemetry gauges */}
      <div className="px-4 py-3 bg-[#060a14] border-b border-white/5">
        <div className="grid grid-cols-3 gap-2">
          {vehicle.telemetry.slice(0, 3).map(t => (
            <TelemetryGauge key={t.label} label={t.label} value={t.value} color={vehicle.color} />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start gap-3 mb-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: vehicle.color + "20", border: `1px solid ${vehicle.color}40` }}
          >
            <Icon size={24} style={{ color: vehicle.color }} />
          </div>
          <div>
            <h3 className="font-heading font-extrabold text-white text-lg mb-0.5">{vehicle.name}</h3>
            <p className="text-sm font-semibold" style={{ color: vehicle.color }}>{vehicle.tagline}</p>
          </div>
        </div>

        <p className="text-sm text-white/60 leading-relaxed mb-4">{vehicle.desc}</p>

        {/* All specs */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {vehicle.telemetry.slice(3).map(s => (
            <div key={s.label} className="glass rounded-lg p-2 border border-white/5">
              <div className="text-[10px] text-white/30 uppercase tracking-widest">{s.label}</div>
              <div className="text-xs text-white font-semibold mt-0.5">{s.value}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {vehicle.features.map(f => (
            <span key={f} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/50 border border-white/10">{f}</span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function Aerospace() {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="section-padding bg-grid">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            <div className="badge-teal mb-4 inline-flex">
              <Plane size={12} />
              eos-aero · AeroSwift Platform
            </div>
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-white mb-4">
              Solar-Hybrid{" "}
              <span className="text-gradient-blue">VTOL Aircraft</span>
            </h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto mb-8">
              The AeroSwift Platform — a unified family of solar-hybrid vertical takeoff and landing aircraft
              powered by AeroOS, scaling from personal transport to commercial urban air mobility.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="https://github.com/embeddedos-org/eos-aero"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#60A5FA] hover:bg-[#3B82F6] text-white font-bold rounded-xl transition-all active:scale-95"
              >
                View on GitHub
                <ArrowRight size={16} />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="py-10 bg-[#080F1E]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { value: "2", label: "Vehicle Models", color: "#60A5FA" },
              { value: "480 kWh", label: "Max Battery", color: "#F59E0B" },
              { value: "VTOL", label: "Flight Mode", color: "#34D399" },
              { value: "AeroOS", label: "Real-Time OS", color: "#F97316" },
            ].map(s => (
              <div key={s.label}>
                <div className="font-heading font-extrabold text-3xl" style={{ color: s.color }}>{s.value}</div>
                <div className="text-xs text-white/40 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vehicles with 3D */}
      <section className="section-padding bg-[#080F1E]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-10 text-center">
            <h2 className="font-heading font-bold text-white text-3xl mb-2">Two Vehicle Models</h2>
            <p className="text-white/50">Interactive 3D renders with live flight telemetry simulation. One unified hardware architecture, one OS, infinite scale.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 gap-6">
            {VEHICLES.map((v, i) => (
              <VehicleCard key={v.name} vehicle={v} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="section-padding">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-10 text-center">
            <h2 className="font-heading font-bold text-white text-3xl mb-2">AeroOS Technology Stack</h2>
            <p className="text-white/50">Built on EmbeddedOS with aerospace-grade extensions for safety-critical flight systems.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TECH_STACK.map((tech, i) => {
              const Icon = tech.icon;
              return (
                <motion.div
                  key={tech.name}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  className="glass rounded-xl p-4 border border-white/5 card-hover flex items-start gap-3"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: tech.color + "20", border: `1px solid ${tech.color}30` }}
                  >
                    <Icon size={20} style={{ color: tech.color }} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white mb-0.5">{tech.name}</div>
                    <div className="text-xs text-white/50">{tech.desc}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-[#080F1E]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <Gauge className="w-10 h-10 text-[#60A5FA] mx-auto mb-4" />
            <h2 className="font-heading font-bold text-white text-2xl mb-3">Open Aerospace Platform</h2>
            <p className="text-white/50 max-w-xl mx-auto mb-6">
              AeroOS and all flight control firmware are open source. Build on top of AeroSwift,
              contribute to the platform, or integrate EmbeddedOS into your own aerospace project.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="https://github.com/embeddedos-org/eos-aero"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#60A5FA] hover:bg-[#3B82F6] text-white font-bold rounded-xl transition-all active:scale-95"
              >
                Explore AeroSwift <ArrowRight size={16} />
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
