import { Suspense, lazy, useRef, useEffect, type CSSProperties } from "react";
import { usePrefersReducedMotion } from "@/lib/reduced-motion";
import { useOnScreen } from "@/lib/on-screen";
import ViewportGate from "../components/ViewportGate";
import { BpPage, PageHero, Section, Stats } from "@/components/bp";
import "./Aerospace.css";

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

const VEHICLES = [
  {
    name: "AeroSwift-Personal (AS-1/2)",
    tagline: "Personal Air Vehicle Concept",
    desc: "Concept design for a 1-to-2 passenger personal air vehicle. Foldable wings, solar-hybrid propulsion, a 90 kWh battery, and 300+ km range are design targets, not flight-tested specifications.",
    color: "#60A5FA",
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
    color: "#F97316",
  },
  {
    name: "Flight Computer",
    desc: "Proposed 8-layer and 12-layer TMR PCB designs",
    color: "#22D3EE",
  },
  {
    name: "Solar-Hybrid Drive",
    desc: "Proposed photovoltaic and battery propulsion concept",
    color: "#F59E0B",
  },
  {
    name: "BLE + 5G Telemetry",
    desc: "Planned fleet telemetry and control research",
    color: "#34D399",
  },
  {
    name: "Solid-State Battery",
    desc: "480 kWh energy-storage design target",
    color: "#A78BFA",
  },
  {
    name: "VTOL Aerodynamics",
    desc: "Proposed vertical-takeoff-and-landing architecture",
    color: "#60A5FA",
  },
];

// Animated altitude/speed chart
function FlightSimChart({ color }: { color: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  // F-23: paint one static frame instead of looping when the visitor
  // prefers reduced motion.
  const reduceMotion = usePrefersReducedMotion();
  // Draw only while the chart is on screen: scrolled away, it keeps its last
  // frame and costs nothing.
  const onScreen = useOnScreen(canvasRef);
  const offsetRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const animate = onScreen && !reduceMotion;

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
      fadeL.addColorStop(0, "rgba(0,0,0,1)");
      fadeL.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = fadeL;
      ctx.fillRect(0, 0, w * 0.1, h);

      const fadeR = ctx.createLinearGradient(w * 0.9, 0, w, 0);
      fadeR.addColorStop(0, "rgba(0,0,0,0)");
      fadeR.addColorStop(1, "rgba(0,0,0,1)");
      ctx.fillStyle = fadeR;
      ctx.fillRect(w * 0.9, 0, w * 0.1, h);

      offsetRef.current += 0.025;
      // F-23: one static frame under reduced motion (and while off screen);
      // the loop otherwise.
      if (animate) frameRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(frameRef.current);
  }, [color, reduceMotion, onScreen]);

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

// One vehicle: its 3D concept on a large stage with the simulated telemetry,
// and the concept's details beside it.
function VehicleRow({ vehicle }: { vehicle: (typeof VEHICLES)[0] }) {
  return (
    <article className="av" style={{ "--c": vehicle.color } as CSSProperties}>
      <div className="av-vis">
        <div className="av-stage">
          <Suspense fallback={<div className="av-wait" />}>
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
          <span className="av-tag">Concept 3D Render</span>
          <span className="av-vtol">VTOL</span>
        </div>

        {/* Flight telemetry chart */}
        <div className="av-tele">
          <div className="av-tele-h">
            <span className="k">Simulated Flight Telemetry</span>
            <span className="av-sim">● SIMULATED</span>
          </div>
          <div className="av-chart">
            <FlightSimChart color={vehicle.color} />
          </div>
        </div>

        {/* Telemetry gauges */}
        <ul className="av-gauges">
          {vehicle.telemetry.slice(0, 3).map(t => (
            <li key={t.label}>
              <b>{t.value}</b>
              <span>{t.label}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="av-text">
        <h3>{vehicle.name}</h3>
        <p className="av-tagline">{vehicle.tagline}</p>
        <p className="av-desc">{vehicle.desc}</p>

        <dl className="av-specs">
          {vehicle.telemetry.slice(3).map(s => (
            <div key={s.label}>
              <dt>{s.label}</dt>
              <dd>{s.value}</dd>
            </div>
          ))}
        </dl>

        <ul className="av-feat">
          {vehicle.features.map(f => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export default function Aerospace() {
  return (
    <BpPage className="ae">
      <PageHero
        sig
        label="eos-aero · Concept Design"
        title="Solar-Hybrid VTOL Aircraft"
        lead="AeroSwift is a concept family of solar-hybrid vertical-takeoff aircraft and a research software architecture. No aircraft has been flight-tested or certified."
      >
        <div className="ctas">
          <a
            href="https://github.com/embeddedos-org"
            target="_blank"
            rel="noopener noreferrer"
            className="btn pri"
          >
            View on GitHub{" "}
            <span className="ar" aria-hidden="true">
              →
            </span>
          </a>
        </div>
      </PageHero>

      <div className="wrap ae-stats">
        <Stats
          items={[
            { value: "2", label: "Concept Designs" },
            { value: "480 kWh", label: "Battery Target" },
            { value: "VTOL", label: "Design Goal" },
            { value: "AeroOS", label: "Research OS" },
          ]}
        />
      </div>

      {/* Vehicles with 3D */}
      <Section
        id="vehicles"
        wide
        title="Two Vehicle Concepts"
        lead="Illustrative 3D concept renders with simulated telemetry. Values shown are design targets pending hardware and flight testing."
        split
      >
        <div className="av-list">
          {VEHICLES.map(v => (
            <VehicleRow key={v.name} vehicle={v} />
          ))}
        </div>
      </Section>

      {/* Tech Stack */}
      <Section
        id="stack"
        alt
        title="AeroOS Technology Stack"
        lead="A research architecture targeting aerospace safety objectives. It has not been certified for safety-critical flight."
        split
      >
        <ul className="cards">
          {TECH_STACK.map(tech => (
            <li key={tech.name}>
              <div
                className="card ae-tech"
                style={{ "--c": tech.color } as CSSProperties}
              >
                <p className="ae-tn">{tech.name}</p>
                <p>{tech.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      {/* CTA */}
      <Section
        id="research"
        title="Open Aerospace Research"
        lead="Explore the available research designs and software, contribute evidence, or use the concepts as a starting point for independently validated aerospace work."
      >
        <div className="ctas">
          <a
            href="https://github.com/embeddedos-org"
            target="_blank"
            rel="noopener noreferrer"
            className="btn or"
          >
            Explore AeroSwift{" "}
            <span className="ar" aria-hidden="true">
              →
            </span>
          </a>
        </div>
      </Section>
    </BpPage>
  );
}
