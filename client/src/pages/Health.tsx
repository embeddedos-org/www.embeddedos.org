import { Suspense, lazy, useState, useRef, useEffect } from "react";
import type { CSSProperties } from "react";
import { Link } from "wouter";
import { usePrefersReducedMotion } from "@/lib/reduced-motion";
import { useOnScreen } from "@/lib/on-screen";
import ViewportGate from "../components/ViewportGate";
import {
  BpPage,
  BoardFigure,
  LocalNav,
  PageHero,
  Section,
  Stats,
} from "@/components/bp";
import "./Health.css";

const DeviceRadarChart = lazy(() => import("../components/DeviceRadarChart"));

const HealthDevice3DCanvas = lazy(() =>
  import("../components/HealthDevice3D").then(m => ({
    default: m.HealthDevice3DCanvas,
  }))
);

const DEVICES = [
  {
    id: "health-key-ultra",
    name: "HEALTH-KEY ULTRA",
    tagline: "USB-C Pendrive Health Monitor",
    desc: "An in-development USB-C research device intended to explore ECG, blood-oxygen, breath-alcohol, temperature, UV, and motion sensing. Physical reliability and clinical validation are pending.",
    patent: "U.S. Patent Pending — 64/073,334 (May 23, 2026)",
    color: "#F85149",
    formFactor: "USB-C Pendrive",
    chip: "nRF52840",
    device3d: "key" as const,
    waveType: "ecg" as const,
    waveLabel: "Simulated ECG Concept",
    waveColor: "#F85149",
    metrics: [
      "ECG (12-lead)",
      "SpO₂",
      "BAC Breath",
      "Heart Rate",
      "Temperature",
      "UV Index",
      "IMU / Motion",
      "USB-C Pass-Through",
    ],
    status: "In Development",
  },
  {
    id: "health-band-neuro",
    name: "HEALTH-BAND Neuro",
    tagline: "AI-Powered Neuro Wristband",
    desc: "An in-development wristband research design for sEMG gesture-control studies, biometric sensing, and TENS exploration. No therapeutic benefit or clinical performance is claimed.",
    patent: "U.S. Patent Pending — 64/076,078 (May 27, 2026)",
    color: "#F59E0B",
    formFactor: "Wristband",
    chip: "nRF52840 + TFLite",
    device3d: "band" as const,
    waveType: "neural" as const,
    waveLabel: "Simulated sEMG Concept",
    waveColor: "#F59E0B",
    metrics: [
      "sEMG Gesture Control",
      "TENS Stimulation Research",
      "BAC Breath",
      "ECG",
      "SpO₂",
      "Heart Rate",
      "HRV",
      "Skin Temperature",
    ],
    status: "In Development",
  },
  {
    id: "health-ring",
    name: "HEALTH-RING",
    tagline: "Titanium Smart Ring",
    desc: "A concept ring for researching optical and electrical sensing. AFib, blood-pressure, HbA1c, sleep, and stress outputs are proposed research goals, not clinically validated measurements.",
    patent: "Provisional Target: 2026 Q3 — EOS-2026-003",
    color: "#A78BFA",
    formFactor: "Titanium Finger Ring",
    chip: "Custom ASIC",
    device3d: "ring" as const,
    waveType: "spo2" as const,
    waveLabel: "Simulated SpO₂ Concept",
    waveColor: "#A78BFA",
    metrics: [
      "ECG (AFib Detection)",
      "SpO₂",
      "HbA1c Estimation",
      "Cuffless Blood Pressure",
      "HRV",
      "Sleep Stages",
      "Stress Score",
      "Body Temperature",
    ],
    status: "In Development",
  },
  {
    id: "health-lab",
    name: "HEALTH-LAB",
    tagline: "Biosensor Patch Concept",
    desc: "A concept flexible biosensor patch for studying glucose, lactate, cortisol, electrolyte, uric-acid, and pH sensing. Wear duration and measurement performance require physical validation.",
    patent: "Provisional Target: 2026 Q3 — EOS-2026-004",
    color: "#34D399",
    formFactor: "Flexible Biosensor Patch",
    chip: "Custom ASIC + BLE 5.3",
    device3d: "lab" as const,
    waveType: "temp" as const,
    waveLabel: "Simulated Glucose Concept",
    waveColor: "#34D399",
    metrics: [
      "Continuous Glucose",
      "Lactate",
      "Cortisol",
      "Sodium (Na⁺)",
      "Potassium (K⁺)",
      "Uric Acid",
      "pH",
      "Target: 14-Day Wear",
    ],
    status: "In Development",
  },
];

const STATS = [
  { value: "4", label: "Device Concepts", color: "#F97316" },
  { value: "Pending", label: "Clinical Validation", color: "#34D399" },
  { value: "2", label: "Patents Pending", color: "#A78BFA" },
  { value: "Planned", label: "Health Hub App", color: "#22D3EE" },
];

const STATUS_COLORS: Record<string, string> = {
  "In Development": "#F59E0B",
};

// Biometric waveform canvas component
function BiometricWaveform({
  type,
  color,
}: {
  type: "ecg" | "spo2" | "neural" | "temp";
  color: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  // F-23: paint one static frame instead of looping when the visitor
  // prefers reduced motion.
  const reduceMotion = usePrefersReducedMotion();
  // four of these run on the page: each draws only while it is on screen
  const onScreen = useOnScreen(canvasRef);
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
          if (t < 0.5) return Math.sin(((t - 0.3) * Math.PI) / 0.2) * 1.0;
          if (t < 0.7) return -Math.sin(((t - 0.5) * Math.PI) / 0.2) * 0.4;
          if (t < 1.0) return Math.sin(((t - 0.7) * Math.PI) / 0.3) * 0.6;
          return Math.sin(t * 2) * 0.05;
        }
        case "spo2":
          return Math.sin(x * 1.2) * 0.6 + Math.sin(x * 2.4) * 0.2;
        case "neural":
          return (
            Math.sin(x * 8) * 0.15 +
            Math.sin(x * 3.3) * 0.4 +
            Math.sin(x * 1.1) * 0.3 +
            (Math.random() - 0.5) * 0.08
          );
        case "temp":
          return Math.sin(x * 0.5) * 0.3 + Math.sin(x * 1.5) * 0.1;
        default:
          return 0;
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

      // Fade both ends of the trace out (erase it, rather than paint black
      // over it), so whatever ground the canvas sits on shows through.
      ctx.save();
      ctx.shadowBlur = 0;
      ctx.globalCompositeOperation = "destination-out";
      const grad = ctx.createLinearGradient(0, 0, w * 0.15, 0);
      grad.addColorStop(0, "rgba(0,0,0,1)");
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w * 0.15, h);

      const grad2 = ctx.createLinearGradient(w * 0.85, 0, w, 0);
      grad2.addColorStop(0, "rgba(0,0,0,0)");
      grad2.addColorStop(1, "rgba(0,0,0,1)");
      ctx.fillStyle = grad2;
      ctx.fillRect(w * 0.85, 0, w * 0.15, h);
      ctx.restore();

      offsetRef.current += type === "neural" ? 0.06 : 0.03;
      // F-23: one static frame under reduced motion (and while scrolled
      // away); the loop otherwise.
      if (!reduceMotion && onScreen)
        frameRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(frameRef.current);
  }, [type, color, reduceMotion, onScreen]);

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={60}
      className="w-full h-full"
      style={{ display: "block" }}
      aria-hidden="true"
    />
  );
}

// One device: its 3D concept on a large stage, the simulated signal under it,
// and the design's details beside it.
function DeviceRow({ device }: { device: (typeof DEVICES)[0] }) {
  const [hovered, setHovered] = useState(false);

  return (
    <article
      className="hd"
      style={{ "--c": device.color } as CSSProperties}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="hd-vis">
        <div className="hd-stage">
          {/* the canvas mounts once the stage is near the viewport: four
              WebGL scenes no longer start together on page load */}
          <ViewportGate>
            <Suspense fallback={<div className="hd-wait" />}>
              <HealthDevice3DCanvas
                device={device.device3d}
                hovered={hovered}
              />
            </Suspense>
          </ViewportGate>
          <span className="hd-tag">Illustrative 3D Concept</span>
        </div>
        <div className="hd-wave">
          <span className="k">{device.waveLabel}</span>
          <div className="hd-canvas">
            <BiometricWaveform
              type={device.waveType}
              color={device.waveColor}
            />
          </div>
        </div>
      </div>

      <div className="hd-text">
        <span
          className="st"
          style={{ "--c": STATUS_COLORS[device.status] } as CSSProperties}
        >
          {device.status}
        </span>
        <h3>{device.name}</h3>
        <p className="hd-tagline">{device.tagline}</p>
        <p className="hd-desc">{device.desc}</p>

        <dl className="hd-specs">
          <div>
            <dt>Form Factor</dt>
            <dd>{device.formFactor}</dd>
          </div>
          <div>
            <dt>Chip</dt>
            <dd>{device.chip}</dd>
          </div>
        </dl>

        <span className="k hd-mk">Planned Research Metrics</span>
        <ul className="hd-metrics">
          {device.metrics.map(m => (
            <li key={m}>{m}</li>
          ))}
        </ul>

        <p className="hd-patent">{device.patent}</p>
      </div>
    </article>
  );
}

export default function Health() {
  return (
    <BpPage className="hl">
      <PageHero
        label="EoS Health Ecosystem"
        title="The Future of Wearable Health"
        lead="Four open health-research designs in development. Physical reliability, clinical validation, and regulatory review are pending; displayed metrics and signals are illustrative."
        visual={
          <BoardFigure
            base="/media/home-2026-10-22/industries/d02"
            width={1280}
            height={720}
            eager
            alt="HEALTH-BAND Neuro: the wristband design, rendered"
            caption={
              <>
                <span>
                  <b>HEALTH-BAND Neuro</b> — the wristband design, one of the
                  four below
                </span>
                <span>Render · design stage</span>
              </>
            }
          />
        }
      >
        <p className="label hl-sim">Illustrative Simulated Metrics</p>
        <ul className="badges hl-metrics">
          {[
            { label: "Heart Rate", value: "72 bpm", color: "#F85149" },
            { label: "SpO₂", value: "98%", color: "#F59E0B" },
            { label: "HRV", value: "42 ms", color: "#A78BFA" },
            { label: "Glucose", value: "94 mg/dL", color: "#34D399" },
          ].map(m => (
            <li
              key={m.label}
              className="dot"
              style={{ "--c": m.color } as CSSProperties}
            >
              <span>{m.label}</span>
              <b>{m.value}</b>
            </li>
          ))}
        </ul>
        <div className="ctas">
          <a
            href="https://github.com/embeddedos-org/eos-health"
            target="_blank"
            rel="noopener noreferrer"
            className="btn pri"
          >
            View on GitHub{" "}
            <span className="ar" aria-hidden="true">
              →
            </span>
          </a>
          <Link href="/health-compare" className="btn gh">
            Compare Devices
          </Link>
        </div>
      </PageHero>

      <div className="wrap hl-stats">
        <Stats items={STATS.map(s => ({ value: s.value, label: s.label }))} />
      </div>

      <LocalNav
        name="EoS Health"
        items={[
          { id: "devices", label: "Devices" },
          { id: "compare", label: "Comparison" },
          { id: "app", label: "Health Hub App" },
          { id: "open", label: "Open research" },
        ]}
      />

      {/* Device rows with their 3D concepts */}
      <Section
        id="devices"
        wide
        title="Four Device Concepts"
        lead="Illustrative 3D concepts with simulated biometric signals. The listed capabilities are research goals; coverage, reliability, and clinical performance have not been validated."
        split
      >
        <div className="hd-list">
          {DEVICES.map(device => (
            <DeviceRow key={device.id} device={device} />
          ))}
        </div>
      </Section>

      {/* Radar chart comparison */}
      <Section id="compare" alt>
        <div className="split2 hl-radar">
          <div>
            <p className="label">Illustrative Planned-Capability Radar</p>
            <h3 className="h3 hl-rh">Device Capability Comparison</h3>
            <p className="hl-rp">
              Conceptual comparison, not measured device performance.
            </p>
            <Link href="/health-compare" className="btn ln hl-rl">
              Planned specification table{" "}
              <span className="ar" aria-hidden="true">
                →
              </span>
            </Link>
          </div>
          <div className="hl-stage">
            <Suspense
              fallback={<div className="hl-wait">Loading chart...</div>}
            >
              <DeviceRadarChart />
            </Suspense>
          </div>
        </div>
      </Section>

      {/* Health Hub App */}
      <Section
        id="app"
        title="Planned Health Hub App"
        lead="A companion-app concept for the four device designs, with planned iOS, Android, BLE, and USB-C integration. The features below are research goals and are not diagnostic tools."
        split
      >
        <ul className="cards four">
          {[
            {
              label: "Digital Twin",
              desc: "Planned research health model",
            },
            {
              label: "AI Food Camera",
              desc: "Planned nutrition research",
            },
            {
              label: "Clinician Dashboard Concept",
              desc: "Planned research-data sharing",
            },
            {
              label: "Research Indicators",
              desc: "Not diagnostic or clinical alerts",
            },
          ].map(({ label, desc }) => (
            <li key={label}>
              <div className="card">
                <h3 className="hl-ah">{label}</h3>
                <p>{desc}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="ctas hl-after">
          <a
            href="https://github.com/embeddedos-org/eos-health"
            target="_blank"
            rel="noopener noreferrer"
            className="btn gh"
          >
            View Health Repo{" "}
            <span className="ar" aria-hidden="true">
              →
            </span>
          </a>
        </div>
      </Section>

      {/* Open Hardware CTA */}
      <Section
        id="open"
        alt
        title="Open Health Research Direction"
        lead="The project intends to publish design files, research firmware, and companion-app code as they become available. Review the linked repositories for the artifacts currently available."
      >
        <div className="ctas">
          <Link href="/get-involved" className="btn pri">
            Get Involved{" "}
            <span className="ar" aria-hidden="true">
              →
            </span>
          </Link>
          <Link href="/hardware-lab" className="btn gh">
            Hardware Lab
          </Link>
        </div>
      </Section>
    </BpPage>
  );
}
