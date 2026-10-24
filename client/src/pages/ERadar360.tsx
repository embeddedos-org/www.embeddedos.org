import { useState, useEffect, type CSSProperties } from "react";
import { Link } from "wouter";
import {
  BpPage,
  BoardFigure,
  LocalNav,
  PageHero,
  Section,
  Stats,
} from "@/components/bp";
import "./ERadar360.css";

// ─── Animated Radar Sweep ────────────────────────────────────────────────────
// CSS animation (ERadar360.css), paused by the button and stopped under
// prefers-reduced-motion; no script runs per frame.
function RadarSweep({ active }: { active: boolean }) {
  return (
    <div className={active ? "rs on" : "rs"} aria-hidden="true">
      {[1, 2, 3, 4].map(i => (
        <i
          key={i}
          className="rs-ring"
          style={{ margin: `${i * 14}%` } as CSSProperties}
        />
      ))}
      <i className="rs-x" />
      <i className="rs-y" />
      {active && (
        <>
          <i className="rs-sweep" />
          <i
            className="rs-blip"
            style={{ top: "25%", left: "60%", animationDelay: "0.5s" }}
          />
          <i
            className="rs-blip"
            style={{ top: "65%", left: "30%", animationDelay: "1.2s" }}
          />
          <i
            className="rs-blip c"
            style={{ top: "40%", left: "75%", animationDelay: "0.8s" }}
          />
        </>
      )}
      <i className="rs-dot" />
    </div>
  );
}

// ─── Alert Simulation ────────────────────────────────────────────────────────
// Module scope, not component scope: declared inside AlertDemo this array was a
// new object every render, so naming it as an effect dependency would have
// restarted the interval on each one.
const ALERT_MSGS = [
  { msg: "Vehicle approaching at 85 km/h — 120 m", type: "warn" },
  { msg: "Laser detection: object at 45° — 28 m", type: "info" },
  { msg: "V2X: Traffic signal ahead — SPaT received", type: "info" },
  { msg: "COLLISION RISK — hard brake recommended", type: "danger" },
  { msg: "Blind spot: vehicle detected right rear", type: "warn" },
  { msg: "V2X: Emergency vehicle approaching — 400 m", type: "danger" },
  { msg: "Radar clear — all zones nominal", type: "ok" },
];

const ALERT_COLORS: Record<string, string> = {
  warn: "#F59E0B",
  info: "#22D3EE",
  danger: "#F85149",
  ok: "#34D399",
};

function AlertDemo() {
  const [alerts, setAlerts] = useState<
    { id: number; msg: string; type: string }[]
  >([]);
  const [running, setRunning] = useState(false);

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

  return (
    <div className="er-feed">
      <div className="er-feed-h">
        <span className="label">Simulated Alert Feed</span>
        <button
          type="button"
          onClick={() => setRunning(r => !r)}
          className={running ? "btn gh sm er-stop" : "btn gh sm"}
        >
          {running ? "Stop" : "Simulate"}
        </button>
      </div>
      <ul className="er-alerts">
        {alerts.map(a => (
          <li
            key={a.id}
            style={{ "--c": ALERT_COLORS[a.type] } as CSSProperties}
          >
            <span aria-hidden="true">●</span>
            <span>{a.msg}</span>
          </li>
        ))}
      </ul>
      {!running && alerts.length === 0 && (
        <p className="er-idle">Click Simulate to start</p>
      )}
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function ERadar360() {
  const [radarActive, setRadarActive] = useState(true);

  const SPECS = [
    {
      label: "Front Radar",
      value:
        "Proposed TI AWR2944 front radar · 77 GHz FMCW · targets: 120° FOV, 250 m range, 0.75 m resolution",
      color: "#22D3EE",
    },
    {
      label: "Rear Radar",
      value:
        "Proposed TI AWR2944 rear radar · 77 GHz FMCW · targets: 120° FOV, 150 m range, 0.75 m resolution",
      color: "#22D3EE",
    },
    {
      label: "Laser Detection",
      value:
        "Five-sensor InGaAs APD concept · 360° layout · latency benchmark pending",
      color: "#F97316",
    },
    {
      label: "V2X",
      value:
        "Proposed Autotalks TEKTON3 DSRC + C-V2X · target: 1 km LOS · planned BSM, TIM, SPaT, MAP support",
      color: "#A78BFA",
    },
    {
      label: "AI Processor",
      value: "Rockchip RK3588S design target · classifier validation pending",
      color: "#34D399",
    },
    {
      label: "Co-Processor",
      value:
        "Proposed STM32H7B3 co-processor · planned laser ADC, OBD-II parsing, and GPS fusion",
      color: "#F59E0B",
    },
    {
      label: "GNSS",
      value:
        "Proposed u-blox NEO-M9N · planned GPS, GLONASS, Galileo, and BeiDou support",
      color: "#60A5FA",
    },
    {
      label: "Display",
      value: 'Proposed 4" Samsung AMOLED · 480×800 · MIPI-DSI',
      color: "#F472B6",
    },
    {
      label: "Connectivity",
      value:
        "Proposed Wi-Fi 6, BT 5.3, and USB-C · target power: 12V OBD-II or USB-C 5V/3A",
      color: "#22D3EE",
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
    <BpPage className="er">
      <PageHero
        label="eCAD Hardware"
        title={
          <>
            eRadar<span>360</span>
          </>
        }
        sub={
          <>
            Planned OEM name: <span className="er-oem">Aegis One</span>
          </>
        }
        lead="A design-stage automotive sensing concept combining 77 GHz radar, laser detection, V2X, and edge AI. Hardware performance and safety behavior have not been validated."
        visual={
          <BoardFigure
            base="/media/home-2026-10-22/industries/d04"
            width={1280}
            height={720}
            eager
            alt="eRadar360: the windshield-mounted car safety design, rendered"
            caption={
              <>
                <span>
                  <b>eRadar360</b> — the windshield-mounted design: front and
                  rear 77 GHz radar, five laser detectors and V2X
                </span>
                <span>Render · design stage</span>
              </>
            }
          />
        }
      >
        <ul className="badges">
          <li className="dot" style={{ "--c": "#F59E0B" } as CSSProperties}>
            Design Stage
          </li>
          {[
            "360° Radar Design",
            "Laser Detection Concept",
            "V2X / DSRC Design",
            "AI Design Target",
            "Validation Pending",
          ].map(tag => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
        <div className="ctas">
          <a
            href="https://github.com/embeddedos-org/eCAD-Hardware-Products/tree/master/eRadar360_CAD_Design"
            target="_blank"
            rel="noopener noreferrer"
            className="btn pri"
          >
            View CAD Files <span aria-hidden="true">↗</span>
          </a>
          <Link href="/hardware-lab" className="btn gh">
            Hardware Lab <span className="ar">›</span>
          </Link>
        </div>
      </PageHero>

      <LocalNav
        name="eRadar360"
        items={[
          { id: "simulation", label: "Simulation" },
          { id: "sensors", label: "Sensors" },
          { id: "threat", label: "Threat detection" },
          { id: "configurations", label: "Configurations" },
          { id: "targets", label: "Targets" },
        ]}
      />

      {/* Radar simulation and the headline targets */}
      <Section id="simulation" alt ariaLabel="Illustrative radar simulation">
        <div className="split2 er-sim">
          <div>
            <p className="label">Illustrative Radar Simulation</p>
            <div className="er-sim-stats">
              <Stats
                small
                items={[
                  { value: "250 m", label: "Range Target" },
                  { value: "Pending", label: "Latency Benchmark" },
                  { value: "Pending", label: "Accuracy Validation" },
                ]}
              />
            </div>
          </div>
          <div className="er-scope">
            <RadarSweep active={radarActive} />
            <button
              type="button"
              onClick={() => setRadarActive(r => !r)}
              className="btn gh sm"
            >
              {radarActive ? "Pause Radar" : "Start Radar"}
            </button>
          </div>
        </div>
      </Section>

      {/* Sensor Specs */}
      <Section
        id="sensors"
        title="Sensor Architecture"
        lead="Proposed sensor modalities and processing hardware for a reference design."
        split
      >
        <ul className="cards">
          {SPECS.map(s => (
            <li key={s.label}>
              <div
                className="card er-spec"
                style={{ "--c": s.color } as CSSProperties}
              >
                <span className="k">{s.label}</span>
                <p>{s.value}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      {/* Alert Demo */}
      <Section id="threat" alt>
        <div className="split2 er-threat">
          <div>
            <div className="sec-h">
              <h2>Threat-Detection Research</h2>
              <p className="lead">
                The reference design proposes radar, laser, and V2X fusion with
                an edge classifier. Detection latency, false-alert rate, and
                driver-alert behavior require physical testing.
              </p>
            </div>
            <dl className="er-list">
              {[
                {
                  label: "Radar fusion",
                  desc: "Proposed front + rear 77 GHz FMCW; 0.75 m resolution target",
                },
                {
                  label: "Laser grid",
                  desc: "Five-point coverage concept; latency benchmark pending",
                },
                {
                  label: "V2X messages",
                  desc: "Planned BSM, TIM, SPaT, and MAP support; 1 km LOS target",
                },
                {
                  label: "AI classifier",
                  desc: "Proposed RK3588S NPU and radar-signature classifier; validation pending",
                },
              ].map(item => (
                <div key={item.label}>
                  <dt>{item.label}</dt>
                  <dd>{item.desc}</dd>
                </div>
              ))}
            </dl>
          </div>
          <AlertDemo />
        </div>
      </Section>

      {/* Configurations */}
      <Section
        id="configurations"
        title="Planned Configurations & Cost Estimates"
        lead="Illustrative reference configurations and planning estimates; no product is offered for sale."
        split
      >
        <ul className="cards">
          {CONFIGS.map((c, i) => (
            <li key={c.name}>
              <div className={i === 1 ? "card hl" : "card"}>
                {i === 1 && (
                  <span className="k er-ref">Reference Configuration</span>
                )}
                <h3>{c.name}</h3>
                <p>{c.desc}</p>
                <dl className="er-cost">
                  <div>
                    <dt>COGS Estimate</dt>
                    <dd>{c.cogs}</dd>
                  </div>
                  <div>
                    <dt>Price Estimate</dt>
                    <dd>{c.msrp}</dd>
                  </div>
                  <div>
                    <dt>Margin Estimate</dt>
                    <dd>{c.margin}</dd>
                  </div>
                </dl>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      {/* Certifications */}
      <Section
        id="targets"
        alt
        title="Regulatory and Safety Targets"
        lead="These standards guide the design; no certification or regulatory approval is claimed."
        split
      >
        <ul className="er-certs">
          {CERTS.map(c => (
            <li key={c}>Target: {c}</li>
          ))}
        </ul>
      </Section>

      {/* CTA */}
      <Section
        id="cad"
        title="Explore the CAD Files"
        lead="Draft KiCad schematic, PCB stackup documentation, BOM, pick-and-place data, firmware, and simulation code are available under the MIT License."
      >
        <div className="ctas">
          <a
            href="https://github.com/embeddedos-org/eCAD-Hardware-Products/tree/master/eRadar360_CAD_Design"
            target="_blank"
            rel="noopener noreferrer"
            className="btn pri"
          >
            View on GitHub <span aria-hidden="true">↗</span>
          </a>
          <Link href="/hardware-lab" className="btn gh">
            All Hardware Products{" "}
            <span className="ar" aria-hidden="true">
              →
            </span>
          </Link>
        </div>
      </Section>
    </BpPage>
  );
}
