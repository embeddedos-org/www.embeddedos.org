import type { CSSProperties } from "react";
import { Link } from "wouter";
import { BOARD_COUNT, REPO_COUNT, SIM_PLATFORM_COUNT } from "@/data/stack";
import { ARCHITECTURE_STAGES, MATURITY_STATUSES } from "@/data/architecture";
import { BpPage, LocalNav, PageHero, Section, Stats } from "@/components/bp";
import "./WhatWeDo.css";

/** The ray-traced industry device renders (1280 × 720) from the homepage. */
const RENDERS = "/media/home-2026-10-22/industries/";

const USE_CASES = [
  {
    title: "Healthcare & Wearables",
    desc: "HEALTH-KEY ULTRA and HEALTH-BAND Neuro are in-development reference designs. The proposed stack combines EoS, configuration-specific ENI acquisition, EAI research models, encrypted local data, and a planned companion app; clinical validation is pending.",
    products: ["EoS", "ENI", "EAI", "eDB", "eServiceApps"],
    href: "/health",
  },
  {
    title: "Aerospace & UAV",
    desc: "AeroSwift Personal is a concept aircraft and software reference architecture. The design combines EoS, an ARINC-429 HAL target, eBoot, EIPC, and EoSim; it has not been flight-tested or certified.",
    products: ["EoS", "eBoot", "EIPC", "EoSim"],
    href: "/aerospace",
  },
  {
    title: "Automotive & ADAS",
    desc: "eRadar360 Aegis One is a design-stage reference architecture combining radar, camera, and V2X inputs with experimental EAI detection, EIPC data paths, and an eBuild target for NXP S32K344. Performance, partitioning, and end-to-end integration remain validation targets.",
    products: ["EoS", "EAI", "EIPC", "eBuild"],
    href: "/eradar360",
  },
  {
    title: "Industrial & IIoT",
    desc: "EoS targets IEC 61131-3 PLCs and Modbus gateways. eDB stores time-series sensor data with AES-256 encryption. EIPC bridges OT and IT networks securely. eFlow provides a visual node editor for industrial automation logic without writing C.",
    products: ["EoS", "eDB", "EIPC", "eFlow"],
    href: "/ecad-hardware",
  },
  {
    title: "Robotics & Cobots",
    desc: "This reference scenario explores EoS servo control, ENI sEMG input, on-device EAI models, and EoStudio-assisted configuration. Individual elements carry separate maturity labels and require system-specific validation.",
    products: ["EoS", "ENI", "EAI", "EoStudio"],
    href: "/ecad-hardware",
  },
  {
    title: "Smart City & Infrastructure",
    desc: `EoS runs on smart meters, traffic controllers, and 5G gateways. eDB stores utility telemetry. EIPC routes data between city subsystems. eFlow visualises sensor pipelines. EoSim validates firmware for ${SIM_PLATFORM_COUNT} virtual platforms before deployment.`,
    products: ["EoS", "eDB", "EIPC", "eFlow", "EoSim"],
    href: "/ecad-hardware",
  },
  {
    title: "Medical Devices",
    desc: "The medical research stack targets IEC 60601-1 design requirements. ENI channel count and sample rate are configuration-specific; BCI, neurofeedback, seizure-pattern classification, and regulated patient-data use all require separate validation and approval.",
    products: ["EoS", "ENI", "EAI", "eDB"],
    href: "/ecad-hardware",
  },
  {
    title: "Energy & CleanTech",
    desc: "EoS runs on BMS controllers and solar inverters. eDB stores energy telemetry and grid state. EIPC routes data between battery packs and inverter controllers. EoSim validates firmware for energy hardware before deployment.",
    products: ["EoS", "eDB", "EIPC", "EoSim"],
    href: "/ecad-hardware",
  },
];

const PRODUCT_NUMBERS = [
  { value: String(REPO_COUNT), label: "GitHub Repos" },
  { value: String(BOARD_COUNT), label: "Supported Boards" },
  { value: "300+", label: "Public APIs" },
  { value: "43", label: "eApps" },
  { value: "13", label: "Product Lines" },
  { value: "15", label: "Hardware Categories" },
];

/** The project families, each with the page that explains it. */
const WHAT_WE_BUILD = [
  {
    title: "EoS + eBoot",
    sub: "OS Foundation",
    desc: "Real-time kernel with 33 HAL peripherals, 41 product profiles, SMP/AMP multicore. Secure bootloader with A/B slots, Ed25519 signing, and measured boot.",
    href: "/eos",
    cta: "Explore EoS",
  },
  {
    title: "EAI + ENI",
    sub: "Intelligence",
    desc: "On-device AI, configurable neural-interface research, and longer-term AGI-enabling research. Model and acquisition limits depend on the named hardware configuration; no achieved AGI system is claimed.",
    href: "/eai",
    cta: "Explore EAI",
  },
  {
    title: "EIPC + eDB",
    sub: "Data & Comms",
    desc: "Capability-secured inter-process communication with HMAC-SHA256 and zero-copy shared memory. Multi-model database with SQL, document, and key-value stores.",
    href: "/eipc",
    cta: "Explore EIPC",
  },
  {
    title: "eOffice + eApps",
    sub: "Applications",
    desc: "11-app office suite with real-time CRDT collaboration. 43 cross-platform apps in C+LVGL covering productivity, media, games, and connectivity.",
    href: "/eoffice",
    cta: "Explore eOffice",
  },
  {
    title: "EoStudio + EoSim",
    sub: "Developer Tools",
    desc: `Full IDE with board picker, HAL configurator, and AI tutor. Simulate firmware on ${SIM_PLATFORM_COUNT} virtual platforms with QEMU, Renode, and HIL bridge.`,
    href: "/eostudio",
    cta: "Explore EoStudio",
  },
  {
    title: "eBuild + eFlow",
    sub: "Build System",
    desc: "18-command cross-compilation CLI targeting ARM, x86, and RISC-V. Visual node editor for sensor pipelines and automation logic without writing C.",
    href: "/ebuild",
    cta: "Explore eBuild",
  },
];

/** The hardware design portfolio by sector, each with the page that holds it. */
const HARDWARE = [
  {
    label: "Health",
    sub: "4 wearables",
    href: "/health",
    render: "d02", // The HEALTH-BAND Neuro wristband design, rendered
  },
  {
    label: "Aerospace",
    sub: "Aircraft, UAV, Space",
    href: "/aerospace",
    render: "d07", // The eMR-400 multirotor inspection drone design, rendered
  },
  {
    label: "Transport",
    sub: "ADAS, Rail, Maritime",
    href: "/eradar360",
    render: "d05", // The eNav-ECDIS electronic chart display design for ships, rendered
  },
  {
    label: "Robotics",
    sub: "Arms, AMR, Cobots",
    href: "/ecad-hardware",
    render: "d08", // A robot assembled from eRobotics designs: the eAMR-500 mobile base and the eArm-7 arm, rendered
  },
  {
    label: "Industrial",
    sub: "PLCs, Sensors, HMI",
    href: "/ecad-hardware",
    render: "d11", // The ePLC-1000 modular PLC design, rendered
  },
  {
    label: "Energy",
    sub: "BMS, Solar, Grid",
    href: "/ecad-hardware",
    render: "d12", // The eBMS-100A battery-management design, rendered
  },
  {
    label: "Smart City",
    sub: "Traffic, Utilities, 5G",
    href: "/ecad-hardware",
    render: "d13", // The eSL-400 street-light controller design, rendered
  },
  {
    label: "Medical",
    sub: "ECG, EEG, Surgical",
    href: "/ecad-hardware",
    render: "d03", // The eECG-12 battery-powered 12-lead ECG design, rendered
  },
  {
    label: "ePAM",
    sub: "eVTOL, Space, EcoCar",
    href: "/aerospace",
    render: "d06", // The Urban Drone four-seat tilt-rotor eVTOL design as a scale model, rendered
  },
  {
    label: "Defense",
    sub: "Surveillance, Tactical",
    href: "/ecad-hardware",
    render: "d19", // The eRGD-2000 rugged mission computer design, rendered
  },
  {
    label: "Consumer",
    sub: "Smart home, AR, Wearables",
    href: "/ecad-hardware",
    render: "d17", // The eHub-Pro smart-home hub design, rendered
  },
  {
    label: "Electronics",
    sub: "PCBs, FPGAs, AI chips",
    href: "/ecad-hardware",
    render: "d16", // The eASIC-Vision computer-vision chip design, rendered
  },
  {
    label: "Mining",
    sub: "Autonomous, Safety",
    href: "/ecad-hardware",
    render: "d14", // The eGasDetect-4 four-gas detector design, rendered
  },
  {
    label: "Cybersecurity",
    sub: "HSMs, Firewalls, Access",
    href: "/ecad-hardware",
    render: "d18", // The eHSM-9000 hardware security module design, rendered
  },
  {
    label: "Future Designs",
    sub: "10 concept products",
    href: "/ecad-hardware",
  },
];

function StackDiagram() {
  return (
    <ol className="wd-stages" aria-label="Architecture stages by maturity">
      {ARCHITECTURE_STAGES.map((stage, index) => (
        <li key={stage.id} style={{ "--c": stage.color } as CSSProperties}>
          <span className="wd-stn">STAGE 0{index + 1}</span>
          <div className="wd-stb">
            <div className="wd-sth">
              <h3>{stage.label}</h3>
              <span className="st">{stage.maturity}</span>
            </div>
            <p>{stage.description}</p>
            <p className="wd-prod">{stage.products.join(" · ")}</p>
          </div>
          <Link href={stage.href} className="btn ln wd-stl">
            Project detail{" "}
            <span className="ar" aria-hidden="true">
              →
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}

export default function WhatWeDo() {
  return (
    <BpPage className="whatwedo">
      <img
        loading="lazy"
        decoding="async"
        src="/media/what-we-do-illustration_4c2ad2f7.jpg"
        alt=""
        aria-hidden="true"
        className="wd-heroimg"
      />
      <PageHero
        sig
        label="FOUNDATION · 501(C)(3) · MIT LICENSE"
        title="What EmbeddedOS Does"
        lead="We build open-source embedded-system projects spanning secure boot, a real-time OS, communications, applications, developer tools, on-device AI, and longer-term artificial general intelligence (AGI) research. Each architecture stage below is labeled by its current maturity; no achieved AGI system is claimed."
      >
        <p className="wd-note">
          The architecture below is an illustrative reference, not a claim that
          every stage is available as one production system.
        </p>
        <div className="ctas">
          <Link href="/getting-started">
            <button type="button" className="btn or">
              Get Started{" "}
              <span className="ar" aria-hidden="true">
                →
              </span>
            </button>
          </Link>
          <Link href="/products">
            <button type="button" className="btn gh">
              All Products
            </button>
          </Link>
        </div>
      </PageHero>

      <div className="wrap wd-stats">
        <Stats items={PRODUCT_NUMBERS} />
      </div>

      <LocalNav
        name="What We Do"
        items={[
          { id: "architecture", label: "Architecture" },
          { id: "what-we-build", label: "What We Build" },
          { id: "use-cases", label: "Industry Use Cases" },
          { id: "hardware", label: "Hardware Design Portfolio" },
          { id: "open-source", label: "Open Source" },
        ]}
      />

      {/* Full Stack Architecture */}
      <Section
        id="architecture"
        title="Architecture by Maturity"
        lead="Seven stages describe a possible path from sensing to physical feedback. Available projects, research, plans, and concepts are shown separately so the reference view does not imply uniform readiness."
      >
        <ul className="badges wd-mat" aria-label="Approved maturity labels">
          {MATURITY_STATUSES.map(status => (
            <li key={status}>{status}</li>
          ))}
        </ul>
        <StackDiagram />
      </Section>

      {/* What We Build — product families */}
      <Section
        id="what-we-build"
        title="What We Build"
        lead="Project families that can be evaluated separately or composed for device prototypes across microcontroller and application-processor targets."
        alt
      >
        <ul className="cards">
          {WHAT_WE_BUILD.map(card => (
            <li key={card.title}>
              <div className="card">
                <p className="k">{card.sub}</p>
                <h3>{card.title}</h3>
                <p>{card.desc}</p>
                <Link href={card.href} className="more">
                  {card.cta}{" "}
                  <span className="ar" aria-hidden="true">
                    →
                  </span>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      {/* Use Cases */}
      <Section
        id="use-cases"
        title="Industry Use Cases"
        lead="These reference scenarios show where projects may compose across device categories. They mix available work, research, and planned integrations rather than representing end-to-end shipped systems."
      >
        <ul className="cards two">
          {USE_CASES.map(uc => (
            <li key={uc.title}>
              <div className="card">
                <h3>{uc.title}</h3>
                <p>{uc.desc}</p>
                <ul className="badges wd-tags">
                  {uc.products.map(p => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
                <Link href={uc.href} className="more">
                  Learn more<span className="sr-only"> about {uc.title}</span>{" "}
                  <span className="ar" aria-hidden="true">
                    →
                  </span>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      {/* Hardware Products */}
      <Section
        id="hardware"
        title="Hardware Design Portfolio"
        lead="CAD and hardware references span health, aerospace, industrial, and other device concepts. Their availability and validation vary by design."
        alt
        wide
      >
        <ul className="wd-hw">
          {HARDWARE.map(item => (
            <li key={item.label}>
              <Link
                href={item.href}
                className={item.render ? "wd-dev" : "wd-dev wd-dev-tx"}
              >
                {item.render && (
                  <picture>
                    <source
                      type="image/avif"
                      srcSet={`${RENDERS}${item.render}.avif`}
                    />
                    {/* alt="": the link already names the sector */}
                    <img
                      src={`${RENDERS}${item.render}.webp`}
                      width={1280}
                      height={720}
                      alt=""
                      loading="lazy"
                      decoding="async"
                    />
                  </picture>
                )}
                <span className="wd-dev-t">
                  <b>{item.label}</b>
                  <small>{item.sub}</small>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="ctas wd-hw-all">
          <Link href="/ecad-hardware">
            <button type="button" className="btn gh">
              View All Hardware Products{" "}
              <span className="ar" aria-hidden="true">
                →
              </span>
            </button>
          </Link>
        </div>
      </Section>

      {/* Open Source Mission */}
      <section id="open-source" className="band wd-band">
        <div className="wrap">
          <div>
            <h2>Open Source. Forever.</h2>
            <p className="lead">
              EmbeddedOS Research Foundation is a 501(c)(3) nonprofit.
              Foundation-authored projects are published under the MIT license,
              with public repositories and documentation. We believe open
              infrastructure for intelligent devices should be a public good
              that engineers, students, and researchers can inspect and build
              upon.
            </p>
          </div>
          <div className="ctas">
            <Link href="/about">
              <button type="button" className="btn or">
                About the Foundation{" "}
                <span className="ar" aria-hidden="true">
                  →
                </span>
              </button>
            </Link>
            <Link href="/donate">
              <button type="button" className="btn gh">
                Support Us
              </button>
            </Link>
          </div>
        </div>
      </section>
    </BpPage>
  );
}
