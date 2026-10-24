import type { CSSProperties } from "react";
import { Link } from "wouter";
import { SIM_PLATFORM_COUNT } from "@/data/stack";
import { BOARDS_URL, EOS_BOARDS, MEDIA_HOME } from "@/black/data";
import {
  BpPage,
  BoardFigure,
  LocalNav,
  PageHero,
  Section,
} from "@/components/bp";
import "./HardwareLab.css";

const BOARD_FAMILIES = [
  {
    family: "ARM Cortex-M",
    color: "#F97316",
    boards: [
      "STM32F4",
      "STM32H7",
      "STM32L4",
      "nRF52840",
      "nRF5340",
      "SAMD51",
      "RP2040",
      "LPC55S69",
      "IMXRT1060",
      "IMXRT1170",
    ],
  },
  {
    family: "ARM Cortex-A",
    color: "#22D3EE",
    boards: [
      "Raspberry Pi 4",
      "Raspberry Pi CM4",
      "BeagleBone Black",
      "NVIDIA Jetson Nano",
      "NVIDIA Jetson Xavier",
      "Rockchip RK3588",
      "Allwinner H6",
    ],
  },
  {
    family: "RISC-V",
    color: "#A78BFA",
    boards: [
      "ESP32-C3",
      "ESP32-C6",
      "GD32VF103",
      "K210 (Kendryte)",
      "SiFive HiFive1",
      "SiFive Unmatched",
      "Bouffalo BL602",
    ],
  },
  {
    family: "Xtensa / ESP",
    color: "#34D399",
    boards: ["ESP32", "ESP32-S2", "ESP32-S3", "ESP8266", "ESP32-H2"],
  },
  {
    family: "AVR / 8-bit",
    color: "#F59E0B",
    boards: ["ATmega328P", "ATmega2560", "ATtiny85", "ATmega32U4"],
  },
  {
    family: "Automotive / Industrial",
    color: "#60A5FA",
    boards: [
      "Renesas RH850",
      "Infineon AURIX TC3xx",
      "NXP S32K3",
      "TI TMS570",
      "STM32G4 (Motor)",
    ],
  },
  {
    family: "Custom / SoC",
    color: "#F472B6",
    boards: [
      "EoS Reference Board v1",
      "EoS Reference Board v2",
      "EoS Health SoC",
      "AeroOS Flight Computer",
      "Custom ASIC (Health)",
    ],
  },
];

const FEATURES = [
  {
    title: "Board Definitions",
    desc: "Repository board definitions across ARM, RISC-V, Xtensa, AVR, and automotive SoC targets.",
  },
  {
    title: "EoSim Simulator",
    desc: `${SIM_PLATFORM_COUNT} repository platform profiles for firmware simulation without physical hardware.`,
  },
  {
    title: "Secure Boot",
    desc: "Design goal: hardware-backed secure boot with eBoot; per-platform validation is pending.",
  },
  {
    title: "Universal Drivers",
    desc: "Unified driver-model goal; portability and hardware validation vary by target.",
  },
  {
    title: "ebuild Targeting",
    desc: "Repository tooling exposes target-based builds, for example: `ebuild build --target stm32h7`; results vary by target.",
  },
  {
    title: "OTA Updates",
    desc: "Design target: delta OTA updates with rollback protection; per-platform validation is pending.",
  },
];

const ECAD_FAMILIES = [
  {
    name: "eHealth365",
    tagline: "Smart Ring Pro + Smart Patch Pro — in-development concepts",
    color: "#F97316",
    products: [
      "Smart Ring Pro — planning estimate: $299",
      "Smart Patch Pro — planning estimate: $199",
      "AI mobile health hub",
      "Monthly blood + mineral cartridges",
    ],
    href: "/ehealth365",
  },
  {
    name: "eRadar360 / Aegis One",
    tagline: "Design-stage automotive sensing reference architecture",
    color: "#22D3EE",
    products: [
      "Proposed TI AWR2944 77 GHz FMCW radar",
      "Proposed 5× InGaAs APD laser layout",
      "Proposed Autotalks TEKTON3 V2X",
      "Proposed RK3588S NPU",
    ],
    href: "/eradar360",
  },
  {
    name: "EoS Health Devices",
    tagline:
      "KEY ULTRA, BAND Neuro, RING, LAB — four flagship health wearables",
    color: "#F472B6",
    products: [
      "HEALTH-KEY ULTRA — multi-biometric wristband",
      "HEALTH-BAND Neuro — EEG + neural feedback",
      "HEALTH-RING — continuous vitals ring",
      "HEALTH-LAB — research patch concept",
    ],
    href: "/health",
  },
  {
    name: "eAerospace",
    tagline: "Concept reference designs for aircraft, UAV, and space systems",
    color: "#60A5FA",
    products: [
      "Proposed aircraft stack — STM32H7, CAN FD, ARINC-429",
      "Proposed avionics stack — RK3588S, ZED-F9P",
      "Proposed UAV/VTOL/swarm stack — STM32G4, nRF5340",
      "Proposed space/CubeSat stack — LEON3FT; ECSS target",
    ],
    href: "https://github.com/embeddedos-org/eCAD-Hardware-Products/tree/master/eAerospace_CAD_Design",
    external: true,
  },
  {
    name: "eIndustrial",
    tagline: "Sensors, PLCs, gateways, and smart infrastructure",
    color: "#F59E0B",
    products: [
      "Industrial sensors — temperature, pressure, gas",
      "PLCs, gateways, HMI, edge AI",
      "Smart meters, water/air monitoring",
      "IEC 61010-1 / IEC 61131-3 / IEC 62056",
    ],
    href: "https://github.com/embeddedos-org/eCAD-Hardware-Products/tree/master/eIndustrial_CAD_Design",
    external: true,
  },
  {
    name: "eConsumer",
    tagline: "Smart home, wearables, and AR/smart devices",
    color: "#34D399",
    products: [
      "Smart speakers, hubs, thermostats, cameras",
      "Smart watches, health trackers",
      "AR glasses, smart helmets",
      "Matter 1.3 / Zigbee / BLE 5.3",
    ],
    href: "https://github.com/embeddedos-org/eCAD-Hardware-Products/tree/master/eConsumer_CAD_Design",
    external: true,
  },
  {
    name: "eMedical",
    tagline: "Medical research designs — regulatory targets identified",
    color: "#A78BFA",
    products: [
      "Diagnostic imaging peripherals",
      "Patient monitoring devices",
      "Implantable-adjacent sensors",
      "Targets: FDA pathway / IEC 62304 / ISO 14971",
    ],
    href: "https://github.com/embeddedos-org/eCAD-Hardware-Products/tree/master/eMedical_CAD_Design",
    external: true,
  },
  {
    name: "eRobotics",
    tagline: "Robotic control systems, motor drivers, sensor fusion",
    color: "#F85149",
    products: [
      "Multi-axis motor controllers",
      "Sensor fusion IMUs",
      "ROS 2 compatible control boards",
      "SLAM-ready compute modules",
    ],
    href: "https://github.com/embeddedos-org/eCAD-Hardware-Products/tree/master/eRobotics_CAD_Design",
    external: true,
  },
  {
    name: "eSmartCity",
    tagline: "Traffic, environment, utilities, and public safety",
    color: "#22D3EE",
    products: [
      "Traffic management controllers",
      "Environmental monitoring nodes",
      "Smart lighting controllers",
      "Public safety sensors",
    ],
    href: "https://github.com/embeddedos-org/eCAD-Hardware-Products/tree/master/eSmartCity_CAD_Design",
    external: true,
  },
  {
    name: "eEnergy",
    tagline: "Solar, battery, and grid-edge energy devices",
    color: "#F59E0B",
    products: [
      "Solar MPPT controllers",
      "Battery management systems",
      "Grid-edge monitoring nodes",
      "EV charging controllers",
    ],
    href: "https://github.com/embeddedos-org/eCAD-Hardware-Products/tree/master/eEnergy_CAD_Design",
    external: true,
  },
  {
    name: "eCybersecurity",
    tagline: "HSM, TPM, secure elements — FIPS 140-3 design target",
    color: "#34D399",
    products: [
      "Hardware security modules (HSM)",
      "TPM 2.0 compatible designs",
      "Secure boot hardware roots",
      "FIPS 140-3 target designs",
    ],
    href: "https://github.com/embeddedos-org/eCAD-Hardware-Products/tree/master/eCybersecurity_CAD_Design",
    external: true,
  },
  {
    name: "eTransport",
    tagline: "Automotive ECU concepts targeting AUTOSAR and ISO 26262",
    color: "#60A5FA",
    products: [
      "ECU designs targeting AUTOSAR",
      "CAN FD / LIN / FlexRay interfaces",
      "V2X communication modules",
      "ISO 26262 ASIL-B/D design targets",
    ],
    href: "https://github.com/embeddedos-org/eCAD-Hardware-Products/tree/master/eTransport_CAD_Design",
    external: true,
  },
];

/**
 * Original EoS boards (the homepage showcase, black/data.ts) built around a
 * chip that a family below lists: shown large beside that family. The board is
 * named for what it is, an EoS design for that chip; it does not claim that a
 * target has been validated on it.
 */
const FAMILY_BOARDS: Record<string, { slug: string; target: string }[]> = {
  "ARM Cortex-M": [
    { slug: "stm32-64", target: "STM32F4" },
    { slug: "lpc55s69", target: "LPC55S69" },
  ],
  "ARM Cortex-A": [{ slug: "cm4-base", target: "Raspberry Pi CM4" }],
  "Xtensa / ESP": [{ slug: "esp32-devkit", target: "ESP32" }],
  "AVR / 8-bit": [{ slug: "atmega328p", target: "ATmega328P" }],
};

/** The EoS boards beside the targets whose chip they carry, in family order. */
const TARGET_BOARDS = BOARD_FAMILIES.flatMap(family =>
  (FAMILY_BOARDS[family.family] ?? []).flatMap(fb => {
    const board = EOS_BOARDS.find(b => b.slug === fb.slug);
    return board ? [{ ...fb, board }] : [];
  })
);

const MEDIA = MEDIA_HOME + "industries/";

/**
 * The homepage's industry renders (Chapters.tsx, data-clip) that show a design
 * from each family. The caption names the design actually shown, and `note`
 * says so where the render is not one of the designs the card lists.
 */
const FAMILY_RENDER: Record<
  string,
  { clip: string; design: string; shows: string; note?: string }
> = {
  eHealth365: {
    clip: "d01",
    design: "Smart Ring Pro + Smart Patch Pro",
    shows: "the two eHealth365 wearable designs",
  },
  "eRadar360 / Aegis One": {
    clip: "d04",
    design: "eRadar360",
    shows: "the windshield-mounted design",
  },
  "EoS Health Devices": {
    clip: "d02",
    design: "HEALTH-BAND Neuro",
    shows: "the wristband design",
  },
  eAerospace: {
    clip: "d07",
    design: "eMR-400",
    shows: "a multirotor inspection drone design in the UAV and drone line",
  },
  eIndustrial: {
    clip: "d11",
    design: "ePLC-1000",
    shows: "a modular PLC design",
  },
  eConsumer: {
    clip: "d17",
    design: "eHub-Pro",
    shows: "a smart-home hub design",
  },
  eMedical: {
    clip: "d03",
    design: "eECG-12",
    shows: "a battery-powered 12-lead ECG design",
  },
  eRobotics: {
    clip: "d08",
    design: "eRobotics",
    shows: "a robot assembled from five eRobotics designs",
  },
  eSmartCity: {
    clip: "d13",
    design: "eSL-400",
    shows: "a street-light controller design",
  },
  eEnergy: {
    clip: "d12",
    design: "eBMS-100A",
    shows: "a battery-management design",
  },
  eCybersecurity: {
    clip: "d18",
    design: "eHSM-9000",
    shows: "a network-attached hardware security module design",
  },
  // eNav-ECDIS is in eTransport_CAD_Design/maritime_systems (data/industries.ts);
  // the card lists the automotive line, which has no render
  eTransport: {
    clip: "d05",
    design: "eNav-ECDIS",
    shows:
      "an electronic chart display design for ships, from eTransport's maritime line",
    note: "The automotive ECU designs listed have no render yet.",
  },
};

function FamilyRow({
  name,
  tagline,
  color,
  products,
  href,
  external,
}: {
  name: string;
  tagline: string;
  color: string;
  products: string[];
  href: string;
  external?: boolean;
}) {
  const render = FAMILY_RENDER[name];
  return (
    <article
      className={render ? "fam has-fig" : "fam"}
      style={{ "--c": color } as CSSProperties}
    >
      {render && (
        <div className="fam-fig">
          <BoardFigure
            base={MEDIA + render.clip}
            width={1280}
            height={720}
            alt={`${render.design}: ${render.shows}`}
            caption={
              <>
                <span>
                  <b>{render.design}</b> — {render.shows}
                  {render.note && <>. {render.note}</>}
                </span>
                <span>Render · design stage</span>
              </>
            }
          />
        </div>
      )}
      <div className="fam-text">
        <h3>{name}</h3>
        <p className="fam-tag">{tagline}</p>
        <ul className="fam-products">
          {products.map(p => (
            <li key={p}>{p}</li>
          ))}
        </ul>
        {external ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="btn gh sm fam-go"
          >
            View CAD Files<span className="sr-only"> for {name}</span>{" "}
            <span aria-hidden="true">↗</span>
          </a>
        ) : (
          <Link href={href} className="btn gh sm fam-go">
            Learn More<span className="sr-only"> about {name}</span>{" "}
            <span className="ar" aria-hidden="true">
              ›
            </span>
          </Link>
        )}
      </div>
    </article>
  );
}

export default function HardwareLab() {
  return (
    <BpPage className="hw">
      <PageHero
        sig
        label="Hardware Lab"
        title="Repository Hardware Definitions"
        lead="EmbeddedOS defines targets across ARM Cortex-M/A, RISC-V, Xtensa, AVR, and automotive SoCs. Hardware validation varies by target."
      >
        <div className="ctas">
          <a
            href="https://github.com/embeddedos-org/eos"
            target="_blank"
            rel="noopener noreferrer"
            className="btn or"
          >
            View BSP on GitHub{" "}
            <span className="ar" aria-hidden="true">
              →
            </span>
          </a>
          <Link href="/getting-started" className="btn gh">
            Get Started
          </Link>
        </div>
      </PageHero>

      <LocalNav
        name="Hardware Lab"
        items={[
          { id: "capabilities", label: "Capabilities" },
          { id: "targets", label: "Targets" },
          { id: "designs", label: "Design families" },
          { id: "eosim", label: "EoSim" },
        ]}
      />

      {/* Features */}
      <Section id="capabilities" tight ariaLabel="Hardware Lab capabilities">
        <ul className="cards hw-feat">
          {FEATURES.map(f => (
            <li key={f.title}>
              <div className="card">
                <p className="hw-ft">{f.title}</p>
                <p>{f.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      {/* Board Families */}
      <Section
        id="targets"
        wide
        alt
        title="Hardware Targets & Profiles"
        lead="Repository board definitions, simulation profiles, and planned targets; inclusion does not claim physical validation."
        split
      >
        <div className="hw-families">
          {BOARD_FAMILIES.map(family => (
            <div
              key={family.family}
              className="hwf"
              style={{ "--c": family.color } as CSSProperties}
            >
              <div className="hwf-text">
                <h3>{family.family}</h3>
                <ul className="hwf-chips">
                  {family.boards.map(board => (
                    <li key={board}>{board}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* The original EoS boards carry chips these families list, but they
            are not repository board definitions: a sub-section of their own,
            each board marked as design files, not yet manufactured. */}
        <section className="hw-boards" aria-labelledby="eos-boards">
          <h3 id="eos-boards">Original EoS boards</h3>
          <p className="fine hw-proof">
            The EoS boards shown are ray-traced from their KiCad files: design
            files, not yet manufactured or bench-tested. Board designs ©
            Kartikeydheer Srivastava, all rights reserved; EmbeddedOS may use
            them.
          </p>
          <div className="boards hw-bgrid">
            {TARGET_BOARDS.map(({ slug, target, board }) => (
              <BoardFigure
                key={slug}
                base={`${MEDIA_HOME}boards/${slug}`}
                width={1600}
                height={1200}
                alt={`${board.name}, ray-traced from its KiCad files`}
                caption={
                  <>
                    <span>
                      <b>{board.name}</b> — an original EoS{" "}
                      {board.kind.toLowerCase()} with the {board.chip} ({target}{" "}
                      above)
                    </span>
                    <span className="hw-bm">
                      Render ·{" "}
                      <a
                        className="tl"
                        href={BOARDS_URL + board.folder}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Design files
                        <span className="sr-only"> for {board.name}</span>
                      </a>
                      , not yet manufactured
                    </span>
                  </>
                }
              />
            ))}
          </div>
        </section>
      </Section>

      {/* eCAD Hardware Families */}
      <Section
        id="designs"
        wide
        label="eCAD Hardware Designs"
        title="18 Hardware Design Families"
        lead="Open-source design concepts across health, automotive, aerospace, industrial, consumer, and beyond. EoS integration and hardware validation vary by design."
        split
      >
        <div className="hw-fams">
          {ECAD_FAMILIES.map(f => (
            <FamilyRow key={f.name} {...f} />
          ))}
        </div>
        <div className="ctas hw-after">
          <a
            href="https://github.com/embeddedos-org/eCAD-Hardware-Products"
            target="_blank"
            rel="noopener noreferrer"
            className="btn pri"
          >
            Browse All 18 Families on GitHub <span aria-hidden="true">↗</span>
          </a>
        </div>
      </Section>

      {/* EoSim CTA */}
      <Section
        id="eosim"
        alt
        label="EoSim — Board Simulator"
        title="No Hardware? No Problem."
        lead={
          <>
            EoSim simulates {SIM_PLATFORM_COUNT} platforms in software. Develop,
            test, and debug firmware without any physical hardware.
          </>
        }
      >
        <div className="ctas">
          <Link href="/flow" className="btn or">
            Try EoSim <span className="ar">›</span>
          </Link>
        </div>
      </Section>
    </BpPage>
  );
}
