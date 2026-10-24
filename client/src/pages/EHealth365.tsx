import { useState, useEffect, type CSSProperties } from "react";
import { Link } from "wouter";
import { usePrefersReducedMotion } from "@/lib/reduced-motion";
import {
  BpPage,
  BoardFigure,
  LocalNav,
  PageHero,
  Section,
  Stats,
} from "@/components/bp";
import "./EHealth365.css";

// ─── Live Biometric Waveform ─────────────────────────────────────────────────
function BiometricWave({
  color,
  label,
  value,
  unit,
  wave,
}: {
  color: string;
  label: string;
  value: number;
  unit: string;
  wave: number[];
}) {
  const [tick, setTick] = useState(0);
  // the scan line stays still for a visitor who prefers reduced motion
  const reduceMotion = usePrefersReducedMotion();
  useEffect(() => {
    if (reduceMotion) return;
    const id = setInterval(() => setTick(t => t + 1), 80);
    return () => clearInterval(id);
  }, [reduceMotion]);

  const W = 200,
    H = 48;
  const pts = wave
    .map((v, i) => {
      const x = (i / (wave.length - 1)) * W;
      const y = H - (v / 100) * H;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="eh-wave" style={{ "--c": color } as CSSProperties}>
      <div className="eh-wave-h">
        <span className="k">{label}</span>
        <span className="eh-val">
          {value}
          <span className="eh-unit">{unit}</span>
        </span>
      </div>
      <svg
        width="100%"
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
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
          x1={tick % W}
          y1="0"
          x2={tick % W}
          y2={H}
          stroke={color}
          strokeWidth="1"
          strokeOpacity="0.4"
        />
      </svg>
    </div>
  );
}

// ─── Device card ─────────────────────────────────────────────────────────────
function DeviceCard({
  name,
  tagline,
  color,
  metrics,
  price,
  battery,
  form,
}: {
  name: string;
  tagline: string;
  color: string;
  metrics: string[];
  price: string;
  battery: string;
  form: string;
}) {
  return (
    <div className="card eh-dev" style={{ "--c": color } as CSSProperties}>
      <h3>{name}</h3>
      <p>{tagline}</p>

      <span className="k eh-cap">Planned Capabilities</span>
      <ul className="eh-metrics">
        {metrics.map(m => (
          <li key={m}>{m}</li>
        ))}
      </ul>

      <div className="eh-foot">
        <div>
          <b className="eh-price">{price}</b>
          <span>{form}</span>
        </div>
        <div className="eh-bat">
          <b>{battery}</b>
          <span>battery</span>
        </div>
      </div>
    </div>
  );
}

// ─── Coverage Matrix ─────────────────────────────────────────────────────────
const COVERAGE = [
  {
    metric: "Heart rate & HRV",
    device: "ring",
    method: "Optical PPG",
    schedule: "Continuous",
  },
  {
    metric: "SpO₂ oxygen",
    device: "ring",
    method: "Optical sensor",
    schedule: "Continuous",
  },
  {
    metric: "Body temperature",
    device: "ring",
    method: "Thermistor",
    schedule: "Continuous",
  },
  {
    metric: "Sleep stages (REM/Deep/Light)",
    device: "ring",
    method: "Accel + HRV",
    schedule: "Nightly",
  },
  {
    metric: "Steps & activity",
    device: "ring",
    method: "Accelerometer",
    schedule: "Continuous",
  },
  {
    metric: "Stress score",
    device: "ring",
    method: "HRV analysis",
    schedule: "Hourly",
  },
  {
    metric: "Ketones",
    device: "ring",
    method: "Micro breath port",
    schedule: "2× daily",
  },
  {
    metric: "Blood glucose",
    device: "patch",
    method: "CGM micro-sensor",
    schedule: "Every 15 min",
  },
  {
    metric: "Sodium, potassium",
    device: "patch",
    method: "Sweat biosensor",
    schedule: "Every 4 hrs",
  },
  {
    metric: "Magnesium, zinc",
    device: "patch",
    method: "Sweat biosensor",
    schedule: "Every 4 hrs",
  },
  {
    metric: "Hydration level",
    device: "patch",
    method: "Bioimpedance",
    schedule: "3× daily",
  },
  {
    metric: "Skin pH",
    device: "patch",
    method: "pH sensor",
    schedule: "Every 4 hrs",
  },
  {
    metric: "Lactate",
    device: "patch",
    method: "Sweat sensor",
    schedule: "During exercise",
  },
  {
    metric: "Vitamins A,C,D,E,K,B1–B12",
    device: "patch",
    method: "Monthly blood cartridge",
    schedule: "Monthly",
  },
  {
    metric: "Iron, zinc, calcium, magnesium",
    device: "patch",
    method: "Monthly mineral cartridge",
    schedule: "Monthly",
  },
  {
    metric: "Calories in (nutrition)",
    device: "app",
    method: "AI food camera",
    schedule: "Per meal",
  },
];

const DEVICE_LABEL: Record<"ring" | "patch" | "app", string> = {
  ring: "💍 Smart Ring Pro",
  patch: "🩹 Smart Patch Pro",
  app: "📱 Mobile App",
};

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function EHealth365() {
  const [activeDevice, setActiveDevice] = useState<"ring" | "patch" | "app">(
    "ring"
  );

  const WAVES = {
    hr: [
      50, 52, 55, 70, 90, 65, 55, 52, 50, 52, 55, 70, 90, 65, 55, 52, 50, 52,
      55, 70,
    ],
    spo2: [
      85, 86, 87, 88, 88, 87, 88, 89, 90, 89, 88, 88, 87, 88, 89, 90, 89, 88,
      88, 87,
    ],
    glucose: [
      55, 57, 60, 63, 65, 67, 68, 67, 65, 63, 61, 60, 59, 60, 62, 64, 65, 64,
      63, 62,
    ],
    temp: [
      70, 71, 71, 72, 72, 73, 73, 72, 72, 71, 71, 72, 72, 73, 73, 72, 71, 71,
      72, 72,
    ],
  };

  return (
    <BpPage className="eh">
      <PageHero
        label="eCAD Hardware"
        title={
          <>
            e<span>Health</span>365
          </>
        }
        sub="Two-Device Health Research Concept"
        lead="Smart Ring Pro + Smart Patch Pro + AI mobile hub — a concept system with planned sensing capabilities that require validation."
        visual={
          <BoardFigure
            base="/media/home-2026-10-22/industries/d01"
            width={1280}
            height={720}
            eager
            alt="eHealth365: the Smart Ring Pro and the Smart Patch Pro designs, rendered"
            caption={
              <>
                <span>
                  <b>Smart Ring Pro + Smart Patch Pro</b> — the two eHealth365
                  wearable designs
                </span>
                <span>Render · design stage</span>
              </>
            }
          />
        }
      >
        <ul className="badges">
          <li className="dot" style={{ "--c": "#34D399" } as CSSProperties}>
            Concept Design
          </li>
        </ul>
        <div className="eh-hstats">
          <Stats
            small
            items={[
              { value: "Design", label: "Current Stage" },
              { value: "2", label: "Device Concepts" },
              { value: "Pending", label: "Validation" },
            ]}
          />
        </div>
        <div className="ctas">
          <a
            href="https://github.com/embeddedos-org/eCAD-Hardware-Products/tree/master/eHealth365_CAD_Design"
            target="_blank"
            rel="noopener noreferrer"
            className="btn or"
          >
            View CAD Files <span aria-hidden="true">↗</span>
          </a>
          <Link href="/health" className="btn gh">
            EoS Health Devices <span className="ar">›</span>
          </Link>
        </div>
      </PageHero>

      <LocalNav
        name="eHealth365"
        items={[
          { id: "signals", label: "Signals" },
          { id: "devices", label: "Devices" },
          { id: "matrix", label: "Sensing matrix" },
          { id: "estimates", label: "Estimates" },
          { id: "designs", label: "Designs" },
        ]}
      />

      {/* simulated concept biometrics */}
      <Section id="signals" alt ariaLabel="Simulated concept data">
        <p className="label eh-sim">Simulated Concept Data</p>
        <div className="eh-waves">
          <BiometricWave
            color="#F85149"
            label="Heart Rate"
            value={72}
            unit="bpm"
            wave={WAVES.hr}
          />
          <BiometricWave
            color="#22D3EE"
            label="SpO₂"
            value={98}
            unit="%"
            wave={WAVES.spo2}
          />
          <BiometricWave
            color="#F59E0B"
            label="Blood Glucose"
            value={94}
            unit="mg/dL"
            wave={WAVES.glucose}
          />
          <BiometricWave
            color="#F472B6"
            label="Body Temperature"
            value={36.8}
            unit="°C"
            wave={WAVES.temp}
          />
        </div>
      </Section>

      {/* Device Cards */}
      <Section
        id="devices"
        title="Two Planned Device Concepts"
        lead="Each concept targets a different sensing modality. The listed capabilities are design goals, not validated measurements."
        split
      >
        <div className="cards two">
          <DeviceCard
            name="Smart Ring Pro"
            tagline="Vitality Hub — autonomic nervous system & movement"
            color="#F97316"
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
            price="Estimate: $299"
            battery="Target: 4–5 days"
            form="Titanium/ceramic · No screen · Haptic feedback"
          />
          <DeviceCard
            name="Smart Patch Pro"
            tagline="Chemistry Hub — blood & interstitial fluid monitoring"
            color="#A78BFA"
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
            price="Estimate: $199"
            battery="Target: 7 days"
            form="Flexible adhesive puck · Upper arm · Weekly patch"
          />
        </div>
      </Section>

      {/* Coverage Matrix */}
      <Section
        id="matrix"
        alt
        title="Planned Sensing Matrix"
        lead="Filter by device to see the planned sensing responsibilities."
        split
      >
        <div
          className="ctas eh-filter"
          role="group"
          aria-label="Filter by device"
        >
          {(["ring", "patch", "app"] as const).map(d => (
            <button
              key={d}
              type="button"
              onClick={() => setActiveDevice(d)}
              aria-pressed={activeDevice === d}
              className="btn gh sm"
            >
              {DEVICE_LABEL[d]}
            </button>
          ))}
        </div>
        <div
          className="tbl"
          tabIndex={0}
          role="region"
          aria-label="Planned sensing matrix table"
        >
          <table>
            <thead>
              <tr>
                <th scope="col">Research Metric</th>
                <th scope="col">Proposed Method</th>
                <th scope="col">Target Schedule</th>
              </tr>
            </thead>
            <tbody>
              {COVERAGE.filter(r => r.device === activeDevice).map(row => (
                <tr key={row.metric}>
                  <td>{row.metric}</td>
                  <td className="eh-mono">{row.method}</td>
                  <td>
                    <span className="eh-sched">{row.schedule}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Pricing */}
      <Section
        id="estimates"
        title="Concept Cost Estimates"
        lead="Illustrative planning estimates, not products offered for sale."
        split
      >
        <ul className="cards four">
          {[
            {
              item: "Smart Ring Pro",
              price: "$299",
              note: "Concept estimate",
            },
            {
              item: "Smart Patch Pro",
              price: "$199",
              note: "Concept estimate",
            },
            {
              item: "Weekly patch refills",
              price: "$15/week",
              note: "Concept estimate",
            },
            {
              item: "Monthly blood cartridge",
              price: "$25/month",
              note: "Concept estimate",
            },
          ].map(p => (
            <li key={p.item}>
              <div className="card eh-est">
                <p>{p.item}</p>
                <b>{p.price}</b>
                <span className="k">{p.note}</span>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      {/* CTA */}
      <Section
        id="designs"
        alt
        title="Explore the Hardware Designs"
        lead="Full KiCad schematics, flex PCB layouts, BOM, 3D models, and app architecture — all open-source."
      >
        <div className="ctas">
          <a
            href="https://github.com/embeddedos-org/eCAD-Hardware-Products/tree/master/eHealth365_CAD_Design"
            target="_blank"
            rel="noopener noreferrer"
            className="btn or"
          >
            View on GitHub <span aria-hidden="true">↗</span>
          </a>
          <Link href="/health" className="btn gh">
            EoS Health Devices{" "}
            <span className="ar" aria-hidden="true">
              →
            </span>
          </Link>
        </div>
      </Section>
    </BpPage>
  );
}
