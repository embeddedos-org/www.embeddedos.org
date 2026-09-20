import { motion } from "framer-motion";
import {
  ArrowRight,
  Plane,
  Rocket,
  Zap,
  Shield,
  Cpu,
  Wifi,
  Battery,
  Wind,
  Navigation,
  Gauge,
} from "lucide-react";
import { Suspense, lazy, useRef, useEffect } from "react";
import { usePrefersReducedMotion } from "@/lib/reduced-motion";
import ViewportGate from "../components/ViewportGate";

const AeroSwiftPersonalCanvas = lazy(() =>
  import("../components/AeroSwift3D").then(m => ({
    default: m.AeroSwiftPersonalCanvas,
  }))
);
const AeroSwiftTransitCanvas = lazy(() =>
  import("../components/AeroSwift3D").then(m => ({
    default: m.AeroSwiftTransitCanvas,
  }))
);

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.06, ease: "easeOut" as const },
  }),
};

const VEHICLES = [
  {
    name: "AeroSwift-Personal (AS-1/2)",
    tagline: "Personal Air Vehicle Concept",
    desc: "Concept design for a 1-to-2 passenger personal air vehicle. Foldable wings, solar-hybrid propulsion, a 90 kWh battery, and 300+ km range are design targets, not flight-tested specifications.",
    color: "#60A5FA",
    icon: Plane,
    model: "personal" as const,
    telemetry: [
      { label: "Target Capacity", value: "1–2" },
      { label: "Target Battery", value: "90 kWh" },
      { label: "Target Range", value: "300+ km" },
      { label: "Design Feature", value: "Foldable Wings" },
      { label: "Target Speed", value: "185 mph" },
      { label: "Target Altitude", value: "1,200 ft" },
    ],
    features: [
      "Target use: consumer commute",
      "Design goal: garage storage",
      "Proposed autonomous flight modes",
      "Proposed touchscreen controls",
    ],
  },
  {
    name: "AeroSwift-Transit (AS-10)",
    tagline: "Urban Air Taxi Concept",
    desc: "Concept design for a 10-passenger urban-air-mobility shuttle. Cabin capacity, a 480 kWh solid-state battery, redundancy, and performance figures are design targets, not flight-tested specifications.",
    color: "#F472B6",
    icon: Rocket,
    model: "transit" as const,
    telemetry: [
      { label: "Target Capacity", value: "10" },
      { label: "Target Battery", value: "480 kWh" },
      { label: "Target Range", value: "320 km" },
      { label: "Design Target", value: "Triple-Redundant" },
      { label: "Target Speed", value: "210 mph" },
      { label: "Target Altitude", value: "2,800 ft" },
    ],
    features: [
      "Target use: commercial air taxi",
      "Proposed wide-body cabin",
      "Planned fleet management",
      "AeroOS research architecture",
    ],
  },
];

const TECH_STACK = [
  {
    name: "AeroOS",
    desc: "Research operating-system design for flight-control studies",
    icon: Cpu,
    color: "#F97316",
  },
  {
    name: "Flight Computer",
    desc: "Proposed 8-layer and 12-layer TMR PCB designs",
    icon: Shield,
    color: "#22D3EE",
  },
  {
    name: "Solar-Hybrid Drive",
    desc: "Proposed photovoltaic and battery propulsion concept",
    icon: Zap,
    color: "#F59E0B",
  },
  {
    name: "BLE + 5G Telemetry",
    desc: "Planned fleet telemetry and control research",
    icon: Wifi,
    color: "#34D399",
  },
  {
    name: "Solid-State Battery",
    desc: "480 kWh energy-storage design target",
    icon: Battery,
    color: "#A78BFA",
  },
  {
    name: "VTOL Aerodynamics",
    desc: "Proposed vertical-takeoff-and-landing architecture",
    icon: Wind,
    color: "#60A5FA",
  },
];

// Animated telemetry gauge
function TelemetryGauge({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
      <div className="text-sm font-bold" style={{ color }}>
        {value}
      </div>
      <div className="text-[10px] text-white/40 mt-0.5 capitalize">{label}</div>
    </div>
  );
}

// Animated altitude/speed chart
function FlightSimChart({ color }: { color: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  // F-23: paint one static frame instead of looping when the visitor
  // prefers reduced motion.
  const reduceMotion = usePrefersReducedMotion();
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
        const y =
          h * 0.5 -
          (Math.sin(t * 0.8) * h * 0.2 +
            Math.sin(t * 1.6) * h * 0.1 +
            Math.sin(t * 0.3) * h * 0.15);
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
        const y =
          h * 0.5 -
          (Math.sin(t * 0.8) * h * 0.2 +
            Math.sin(t * 1.6) * h * 0.1 +
            Math.sin(t * 0.3) * h * 0.15);
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
      // F-23: one static frame under reduced motion; the loop otherwise.
      if (!reduceMotion) frameRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(frameRef.current);
  }, [color, reduceMotion]);

  return (
    <canvas
      ref={canvasRef}
      width={500}
      height={80}
      className="w-full h-full"
      style={{ display: "block" }}
      aria-hidden="true"
    />
  );
}

// Vehicle card with 3D render
function VehicleCard({
  vehicle,
  index,
}: {
  vehicle: (typeof VEHICLES)[0];
  index: number;
}) {
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
    >
      {/* 3D Aircraft Render */}
      <div className="h-52 w-full relative bg-gradient-to-b from-[#060d1e] to-[#040810]">
        <Suspense
          fallback={
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-[#60A5FA] border-t-transparent rounded-full animate-spin" />
            </div>
          }
        >
          {vehicle.model === "personal" ? (
            <ViewportGate>
              <AeroSwiftPersonalCanvas />
            </ViewportGate>
          ) : (
            <ViewportGate>
              <AeroSwiftTransitCanvas />
            </ViewportGate>
          )}
        </Suspense>
        {/* Overlay badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <div
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: vehicle.color }}
          />
          <span className="text-[9px] text-white/40 font-mono uppercase tracking-widest">
            Concept 3D Render
          </span>
        </div>
        <div
          className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[9px] font-bold"
          style={{
            background: vehicle.color + "25",
            color: vehicle.color,
            border: `1px solid ${vehicle.color}40`,
          }}
        >
          VTOL
        </div>
      </div>

      {/* Flight telemetry chart */}
      <div className="px-4 py-2 bg-[#040810] border-b border-white/5">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[9px] text-white/30 uppercase tracking-widest flex items-center gap-1">
            <Navigation className="w-2.5 h-2.5" /> Simulated Flight Telemetry
          </span>
          <span
            className="text-[9px] font-mono"
            style={{ color: vehicle.color }}
          >
            ● SIMULATED
          </span>
        </div>
        <div className="h-[80px]">
          <FlightSimChart color={vehicle.color} />
        </div>
      </div>

      {/* Telemetry gauges */}
      <div className="px-4 py-3 bg-[#060a14] border-b border-white/5">
        <div className="grid grid-cols-3 gap-2">
          {vehicle.telemetry.slice(0, 3).map(t => (
            <TelemetryGauge
              key={t.label}
              label={t.label}
              value={t.value}
              color={vehicle.color}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start gap-3 mb-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: vehicle.color + "20",
              border: `1px solid ${vehicle.color}40`,
            }}
          >
            <Icon size={24} style={{ color: vehicle.color }} />
          </div>
          <div>
            <h3 className="font-heading font-extrabold text-white text-lg mb-0.5">
              {vehicle.name}
            </h3>
            <p
              className="text-sm font-semibold"
              style={{ color: vehicle.color }}
            >
              {vehicle.tagline}
            </p>
          </div>
        </div>

        <p className="text-sm text-white/60 leading-relaxed mb-4">
          {vehicle.desc}
        </p>

        {/* All specs */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {vehicle.telemetry.slice(3).map(s => (
            <div
              key={s.label}
              className="glass rounded-lg p-2 border border-white/5"
            >
              <div className="text-[10px] text-white/30 uppercase tracking-widest">
                {s.label}
              </div>
              <div className="text-xs text-white font-semibold mt-0.5">
                {s.value}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {vehicle.features.map(f => (
            <span
              key={f}
              className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/50 border border-white/10"
            >
              {f}
            </span>
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
              eos-aero · Concept Design
            </div>
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-white mb-4">
              Solar-Hybrid{" "}
              <span className="text-gradient-blue">VTOL Aircraft</span>
            </h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto mb-8">
              AeroSwift is a concept family of solar-hybrid vertical-takeoff
              aircraft and a research software architecture. No aircraft has
              been flight-tested or certified.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="https://github.com/embeddedos-org"
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
              { value: "2", label: "Concept Designs", color: "#60A5FA" },
              { value: "480 kWh", label: "Battery Target", color: "#F59E0B" },
              { value: "VTOL", label: "Design Goal", color: "#34D399" },
              { value: "AeroOS", label: "Research OS", color: "#F97316" },
            ].map(s => (
              <div key={s.label}>
                <div
                  className="font-heading font-extrabold text-3xl"
                  style={{ color: s.color }}
                >
                  {s.value}
                </div>
                <div className="text-xs text-white/40 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vehicles with 3D */}
      <section className="section-padding bg-[#080F1E]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-10 text-center"
          >
            <h2 className="font-heading font-bold text-white text-3xl mb-2">
              Two Vehicle Concepts
            </h2>
            <p className="text-white/50">
              Illustrative 3D concept renders with simulated telemetry. Values
              shown are design targets pending hardware and flight testing.
            </p>
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
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-10 text-center"
          >
            <h2 className="font-heading font-bold text-white text-3xl mb-2">
              AeroOS Technology Stack
            </h2>
            <p className="text-white/50">
              A research architecture targeting aerospace safety objectives. It
              has not been certified for safety-critical flight.
            </p>
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
                    style={{
                      background: tech.color + "20",
                      border: `1px solid ${tech.color}30`,
                    }}
                  >
                    <Icon size={20} style={{ color: tech.color }} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white mb-0.5">
                      {tech.name}
                    </div>
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
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Gauge className="w-10 h-10 text-[#60A5FA] mx-auto mb-4" />
            <h2 className="font-heading font-bold text-white text-2xl mb-3">
              Open Aerospace Research
            </h2>
            <p className="text-white/50 max-w-xl mx-auto mb-6">
              Explore the available research designs and software, contribute
              evidence, or use the concepts as a starting point for
              independently validated aerospace work.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="https://github.com/embeddedos-org"
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
