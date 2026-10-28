import { useState, lazy, Suspense, type CSSProperties } from "react";
import { Link } from "wouter";
import {
  BpPage,
  BoardFigure,
  LocalNav,
  PageHero,
  Section,
  Stats,
} from "@/components/bp";
import "./EcadHardware.css";

const ArchitectureDiagram3D = lazy(
  () => import("../components/ArchitectureDiagram3D")
);

// eHealth365 sensor fusion block diagram
const HEALTH_LAYERS = [
  {
    label: "Cloud / Mobile App",
    sublabels: ["iOS", "Android", "Web"],
    color: "#34D399",
    y: 1.6,
    width: 3.6,
  },
  {
    label: "EAI Inference",
    sublabels: ["Arrhythmia", "SpO₂", "HRV"],
    color: "#A78BFA",
    y: 0.9,
    width: 3.4,
  },
  {
    label: "Signal Processing",
    sublabels: ["IIR filter", "Pan-Tompkins"],
    color: "#22D3EE",
    y: 0.2,
    width: 3.2,
  },
  {
    label: "ADC / Amplifier",
    sublabels: ["24-bit", "500 Hz"],
    color: "#F97316",
    y: -0.5,
    width: 3.0,
  },
  {
    label: "Sensors",
    sublabels: ["ECG", "SpO₂", "PPG", "Temp"],
    color: "#EF4444",
    y: -1.2,
    width: 2.8,
  },
];

// eRadar360 sensor fusion block diagram
const RADAR_LAYERS = [
  {
    label: "Decision Output",
    sublabels: ["Object class", "Trajectory"],
    color: "#22D3EE",
    y: 1.6,
    width: 3.6,
  },
  {
    label: "Sensor Fusion",
    sublabels: ["Kalman filter", "EKF"],
    color: "#F97316",
    y: 0.9,
    width: 3.4,
  },
  {
    label: "Perception AI",
    sublabels: ["EAI INT4", "YOLO-nano"],
    color: "#A78BFA",
    y: 0.2,
    width: 3.2,
  },
  {
    label: "Signal Processing",
    sublabels: ["FFT", "CFAR", "Doppler"],
    color: "#FBBF24",
    y: -0.5,
    width: 3.0,
  },
  {
    label: "Sensor Array",
    sublabels: ["77GHz FMCW", "LiDAR", "Camera"],
    color: "#EF4444",
    y: -1.2,
    width: 2.8,
  },
];

// eAerospace flight control block diagram
const AERO_LAYERS = [
  {
    label: "Mission Computer",
    sublabels: ["EoS SMP", "EAI autopilot"],
    color: "#60A5FA",
    y: 1.6,
    width: 3.6,
  },
  {
    label: "Flight Control",
    sublabels: ["PID", "Kalman", "TECS"],
    color: "#22D3EE",
    y: 0.9,
    width: 3.4,
  },
  {
    label: "Sensor Fusion",
    sublabels: ["IMU", "GPS", "Baro", "Mag"],
    color: "#F97316",
    y: 0.2,
    width: 3.2,
  },
  {
    label: "Actuator Control",
    sublabels: ["PWM", "CAN", "UAVCAN"],
    color: "#A78BFA",
    y: -0.5,
    width: 3.0,
  },
  {
    label: "Hardware",
    sublabels: ["Motors", "Servos", "ESC"],
    color: "#6B7280",
    y: -1.2,
    width: 2.8,
  },
];

const HW_DIAGRAMS = [
  {
    id: "health",
    title: "eHealth365 Sensor Pipeline",
    subtitle: "ECG → ADC → AI → Cloud",
    color: "#EF4444",
    layers: HEALTH_LAYERS,
  },
  {
    id: "radar",
    title: "eRadar360 Sensor Fusion",
    subtitle: "77GHz + LiDAR + Camera → AI",
    color: "#22D3EE",
    layers: RADAR_LAYERS,
  },
  {
    id: "aero",
    title: "eAerospace Flight Control",
    subtitle: "Sensors → FCS → Mission Computer",
    color: "#60A5FA",
    layers: AERO_LAYERS,
  },
];

const CATEGORIES = [
  {
    id: "health",
    color: "#EF4444",
    title: "eHealth365",
    subtitle: "Wearable Health Platform",
    status: "Design",
    standard: "IEC 60601-1; FDA pathway",
    products: [
      "HEALTH-KEY ULTRA",
      "HEALTH-BAND Neuro",
      "HEALTH-RING",
      "HEALTH-LAB",
    ],
    desc: "Four in-development health research designs spanning cardiovascular, biochemical, neural, and activity sensing goals. Physical and clinical validation are pending.",
    specs: [
      { label: "MCU", value: "nRF5340 + STM32H7" },
      { label: "Connectivity", value: "BLE 5.3 LR" },
      { label: "FDA Work", value: "Planned; not submitted" },
      { label: "Sensors", value: "ECG, EEG, SpO₂, CGM" },
    ],
    href: "/health",
    ghref: "https://github.com/embeddedos-org/eCAD-Hardware-Products",
  },
  {
    id: "radar",
    color: "#F97316",
    title: "eRadar360 / Aegis One",
    subtitle: "Automotive Sensing Concept",
    status: "Design",
    standard: "ISO 26262",
    products: ["Front Radar", "Rear Radar", "Side Radars ×4", "Fusion ECU"],
    desc: "Design-stage automotive sensing reference architecture for radar, camera, LiDAR, and V2X fusion. Detection performance and safety behavior are not yet validated.",
    specs: [
      { label: "Proposed Radar", value: "TI AWR2944 77 GHz" },
      { label: "Range", value: "Design target; test pending" },
      { label: "Latency", value: "Benchmark pending" },
      { label: "Standard", value: "ISO 26262 target" },
    ],
    href: "/eradar360",
    ghref: "https://github.com/embeddedos-org/eCAD-Hardware-Products",
  },
  {
    id: "aerospace",
    color: "#22D3EE",
    title: "eAerospace",
    subtitle: "Aircraft, UAV & Space Concepts",
    status: "Design",
    standard: "DO-254 / ECSS",
    products: ["Aircraft Components", "Avionics", "UAV / VTOL", "CubeSat"],
    desc: "Concept aerospace reference designs spanning flight computers, avionics, UAV controllers, and CubeSat hardware. No flight testing or certification is claimed.",
    specs: [
      { label: "Proposed MCU", value: "STM32H7, LEON3FT" },
      { label: "Proposed Bus", value: "ARINC-429, CAN FD" },
      { label: "Targets", value: "DO-254, ECSS" },
      { label: "PCB Target", value: "IPC Class 3" },
    ],
    href: "/aerospace",
    ghref: "https://github.com/embeddedos-org/eCAD-Hardware-Products",
  },
  {
    id: "pam",
    color: "#F472B6",
    title: "ePAM",
    subtitle: "Personal Air Mobility",
    status: "Design",
    standard: "FAA / EASA",
    products: ["Urban Drone (eVTOL)", "Space Shuttle", "Eco Car", "Combo Unit"],
    desc: "Concept studies for four solar-hybrid personal-transport designs. Capacity, propulsion, altitude, and pricing are planning targets, not validated specifications or offers for sale.",
    specs: [
      { label: "Power Target", value: "Solar + H₂ hybrid" },
      { label: "Altitude Target", value: "Up to 100 km" },
      { label: "Capacity Target", value: "4–5 passengers" },
      { label: "Price Estimate", value: "$28K – $9M planning range" },
    ],
    href: "/aerospace",
    ghref: "https://github.com/embeddedos-org/eCAD-Hardware-Products",
  },
  {
    id: "robotics",
    color: "#A78BFA",
    title: "eRobotics",
    subtitle: "Industrial Robots & AMR",
    status: "Design",
    standard: "ISO 10218-1",
    products: ["Robotic Arms", "Welding Robots", "AMR / AGV", "Cobots"],
    desc: "Industrial robotics portfolio covering servo-driven arms, autonomous mobile robots, warehouse delivery systems, and agricultural robots. EoS SMP on Cortex-A72.",
    specs: [
      { label: "MCU", value: "Cortex-A72 + M4" },
      { label: "Control", value: "EtherCAT, PROFINET" },
      { label: "Standard", value: "ISO 10218-1, 3691-4" },
      { label: "Vision", value: "Stereo + ToF" },
    ],
    href: "/ecad-hardware",
    ghref: "https://github.com/embeddedos-org/eCAD-Hardware-Products",
  },
  {
    id: "industrial",
    color: "#34D399",
    title: "eIndustrial",
    subtitle: "IIoT & Industrial Electronics",
    status: "Design",
    standard: "IEC 61010-1",
    products: ["PLCs", "Gateways", "HMI Panels", "Edge AI Nodes"],
    desc: "Industrial hardware for temperature, pressure, gas, and flow sensors. PLCs, Modbus gateways, HMI panels, and Edge AI nodes for IEC 61131-3 compliant automation.",
    specs: [
      { label: "Protocols", value: "Modbus, PROFIBUS, OPC-UA" },
      { label: "Standard", value: "IEC 61010-1, 61131-3" },
      { label: "Temp range", value: "-40°C to +85°C" },
      { label: "Targets", value: "CE, UL, ATEX" },
    ],
    href: "/ecad-hardware",
    ghref: "https://github.com/embeddedos-org/eCAD-Hardware-Products",
  },
  {
    id: "medical",
    color: "#F59E0B",
    title: "eMedical",
    subtitle: "Diagnostic & Surgical Devices",
    status: "Design",
    standard: "IEC 60601-1",
    products: ["ECG / EEG", "Ultrasound", "Surgical Robots", "Lab Equipment"],
    desc: "Medical research design portfolio spanning diagnostic, surgical, patient-care, and laboratory concepts. IEC 60601-1 is a design target, not an achieved certification.",
    specs: [
      { label: "Standard", value: "IEC 60601-1, ISO 13485" },
      { label: "FDA Path", value: "510(k) / PMA" },
      { label: "Isolation", value: "BF / CF patient applied" },
      { label: "EMC", value: "IEC 60601-1-2" },
    ],
    href: "/ecad-hardware",
    ghref: "https://github.com/embeddedos-org/eCAD-Hardware-Products",
  },
  {
    id: "energy",
    color: "#10B981",
    title: "eEnergy",
    subtitle: "Battery, Solar & Power Electronics",
    status: "Design",
    standard: "IEC 62619",
    products: [
      "BMS Controllers",
      "Solar Inverters",
      "DC-DC Converters",
      "Smart Breakers",
    ],
    desc: "Energy hardware portfolio covering battery management systems, renewable energy controllers, and power electronics. EoS manages real-time power flow and safety cutoffs.",
    specs: [
      { label: "Standard", value: "IEC 62619, IEC 61730" },
      { label: "Voltage", value: "12V – 1500V DC" },
      { label: "Power", value: "Up to 250 kW" },
      { label: "Targets", value: "UL 1973, CE" },
    ],
    href: "/ecad-hardware",
    ghref: "https://github.com/embeddedos-org/eCAD-Hardware-Products",
  },
  {
    id: "smartcity",
    color: "#60A5FA",
    title: "eSmartCity",
    subtitle: "Urban Infrastructure & Utilities",
    status: "Design",
    standard: "IEC 62264",
    products: [
      "Traffic Controllers",
      "Smart Meters",
      "5G Gateways",
      "Parking Systems",
    ],
    desc: "Smart city hardware for urban infrastructure, utilities, and telecommunications. EoS runs on traffic lights, smart meters, water/gas monitoring, and 5G IoT gateways.",
    specs: [
      { label: "Standard", value: "IEC 62264, IEC 62056" },
      { label: "Comms", value: "5G, LoRaWAN, NB-IoT" },
      { label: "Protocols", value: "DLMS/COSEM, MQTT" },
      { label: "Targets", value: "FCC, CE, ETSI" },
    ],
    href: "/ecad-hardware",
    ghref: "https://github.com/embeddedos-org/eCAD-Hardware-Products",
  },
  {
    id: "defense",
    color: "#6366F1",
    title: "eDefense",
    subtitle: "Tactical & Surveillance Systems",
    status: "Design",
    standard: "MIL-STD-810",
    products: [
      "EO/IR Cameras",
      "Tactical Radios",
      "Mesh Networks",
      "Detection Sensors",
    ],
    desc: "Defense hardware portfolio covering surveillance systems, tactical communications, and protection equipment. All designed to MIL-STD-810 rugged standards.",
    specs: [
      { label: "Standard", value: "MIL-STD-810, 188, 461" },
      { label: "Encryption", value: "AES-256, FIPS 140-3" },
      { label: "Temp range", value: "-55°C to +125°C" },
      { label: "Shock", value: "40g, 11ms half-sine" },
    ],
    href: "/ecad-hardware",
    ghref: "https://github.com/embeddedos-org/eCAD-Hardware-Products",
  },
  {
    id: "consumer",
    color: "#06B6D4",
    title: "eConsumer",
    subtitle: "Smart Home, Wearables & AR",
    status: "Design",
    standard: "Matter 1.3",
    products: [
      "Smart Speakers",
      "AR Glasses",
      "Smart Watches",
      "Industrial AR Helmets",
    ],
    desc: "Consumer hardware portfolio covering smart home devices, personal wearables, and augmented reality devices. Matter 1.3 and BLE 5.3 connectivity.",
    specs: [
      { label: "Standard", value: "Matter 1.3, Zigbee" },
      { label: "Comms", value: "BLE 5.3, ANT+, Wi-Fi 6" },
      { label: "MCU", value: "nRF5340, ESP32-S3" },
      { label: "Targets", value: "FCC, CE, Bluetooth SIG" },
    ],
    href: "/ecad-hardware",
    ghref: "https://github.com/embeddedos-org/eCAD-Hardware-Products",
  },
  {
    id: "electronics",
    color: "#FBBF24",
    title: "eElectronics",
    subtitle: "PCBs, FPGAs & AI Accelerators",
    status: "Design",
    standard: "IPC-2221",
    products: ["PCB Designs", "FPGA Modules", "AI Accelerators", "RF Modules"],
    desc: "Electronics and semiconductor hardware portfolio covering PCBs, embedded controllers, RF modules, FPGAs, AI accelerators, and emerging quantum technologies.",
    specs: [
      { label: "Standard", value: "IPC-2221, JEDEC" },
      { label: "Layer count", value: "2–16 layer PCBs" },
      { label: "RF", value: "Sub-GHz to 77 GHz" },
      { label: "AI", value: "NPU, FPGA, ASIC" },
    ],
    href: "/ecad-hardware",
    ghref: "https://github.com/embeddedos-org/eCAD-Hardware-Products",
  },
  {
    id: "mining",
    color: "#F87171",
    title: "eMining",
    subtitle: "Autonomous Mining & Construction",
    status: "Design",
    standard: "IECEx / ATEX",
    products: [
      "Autonomous Haul Trucks",
      "Mine Monitoring",
      "Gas Detection",
      "Construction Robots",
    ],
    desc: "Mining, heavy industry, and construction hardware portfolio covering autonomous mining equipment, industrial safety systems, and construction robots.",
    specs: [
      { label: "Standard", value: "ISO 17757, IECEx" },
      { label: "Protection", value: "ATEX Zone 1 / 2" },
      { label: "Comms", value: "LoRaWAN, 4G LTE, UWB" },
      { label: "Sensors", value: "Gas, Vibration, GNSS" },
    ],
    href: "/ecad-hardware",
    ghref: "https://github.com/embeddedos-org/eCAD-Hardware-Products",
  },
  {
    id: "cybersec",
    color: "#14B8A6",
    title: "eCybersecurity",
    subtitle: "HSMs, Firewalls & Access Control",
    status: "Design",
    standard: "FIPS 140-3",
    products: [
      "Hardware Security Modules",
      "Firewalls",
      "Biometric Access",
      "Perimeter Sensors",
    ],
    desc: "Cybersecurity reference designs for security appliances, physical security, and access control. FIPS 140-3 and CC EAL4+ are targets, not achieved certifications.",
    specs: [
      { label: "Standard", value: "FIPS 140-3, CC EAL4+" },
      { label: "Crypto", value: "AES-256, RSA-4096, ECC" },
      { label: "Biometrics", value: "Fingerprint, Iris, Face" },
      { label: "Targets", value: "ISO 27001, FIPS 201-3" },
    ],
    href: "/ecad-hardware",
    ghref: "https://github.com/embeddedos-org/eCAD-Hardware-Products",
  },
  {
    id: "future",
    color: "#8B5CF6",
    title: "Future Designs",
    subtitle: "Donor-Sponsored Concepts",
    status: "Concept",
    standard: "Various",
    products: [
      "eVision (blind aid)",
      "eHand (prosthetic)",
      "eBCI-Lite (EEG)",
      "eCubeSat-1U",
    ],
    desc: "10 concept-stage hardware products for health, accessibility, climate, and research. Each has a datasheet stub, BOM placeholder, and business plan for donor evaluation.",
    specs: [
      { label: "eVision", value: "Obstacle detection band" },
      { label: "eHand", value: "6-DOF myoelectric prosthetic" },
      { label: "eFarm", value: "Solar LoRaWAN soil sensor" },
      { label: "eCubeSat", value: "1U CubeSat reference design" },
    ],
    href: "/donate",
    ghref: "https://github.com/embeddedos-org/eCAD-Hardware-Products",
  },
];

const STATUS_COLORS: Record<string, string> = {
  Design: "#FBBF24",
  Concept: "#A78BFA",
};

const MEDIA = "/media/home-2026-10-22/industries/";

/**
 * The homepage's industry renders (Chapters.tsx, data-clip) that show a design
 * from a category on this page. The caption names the design actually shown;
 * the wording follows the homepage chapter for that render. Future Designs has
 * no render, so it has no figure.
 */
const CATEGORY_RENDER: Record<
  string,
  { clip: string; design: string; shows: string }
> = {
  health: {
    clip: "d02",
    design: "HEALTH-BAND Neuro",
    shows: "the wristband design, one of the four in this category",
  },
  radar: {
    clip: "d04",
    design: "eRadar360",
    shows: "the windshield-mounted design",
  },
  aerospace: {
    clip: "d07",
    design: "eMR-400",
    shows: "a multirotor inspection drone design in the UAV and drone line",
  },
  pam: {
    clip: "d06",
    design: "Urban Drone",
    shows: "the four-seat tilt-rotor eVTOL design, shown as a scale model",
  },
  robotics: {
    clip: "d08",
    design: "eRobotics",
    shows:
      "a robot assembled from five designs: the eAMR-500 base, eArm-7 arm, eGripper-3F hand, eVision-4K eyes and eLiDAR-360",
  },
  industrial: {
    clip: "d11",
    design: "ePLC-1000",
    shows: "a modular PLC design for IEC 61131-3 programs",
  },
  medical: {
    clip: "d03",
    design: "eECG-12",
    shows: "a battery-powered 12-lead ECG design",
  },
  energy: {
    clip: "d12",
    design: "eBMS-100A",
    shows: "a battery-management design that watches every cell",
  },
  smartcity: {
    clip: "d13",
    design: "eSL-400",
    shows: "a street-light controller design that reports over LoRaWAN",
  },
  defense: {
    clip: "d19",
    design: "eRGD-2000",
    shows: "a rugged mission computer that cools by conduction, with no fan",
  },
  consumer: {
    clip: "d17",
    design: "eHub-Pro",
    shows: "a smart-home hub design for Matter, Zigbee, Z-Wave, BLE and Wi-Fi",
  },
  electronics: {
    clip: "d16",
    design: "eASIC-Vision",
    shows: "a computer-vision chip design",
  },
  mining: {
    clip: "d14",
    design: "eGasDetect-4",
    shows: "a four-gas detector design",
  },
  cybersec: {
    clip: "d18",
    design: "eHSM-9000",
    shows: "a network-attached hardware security module design",
  },
};

const FUTURE = [
  {
    icon: "👓",
    name: "eVision",
    desc: "Obstacle-detection band for blind users",
    tier: "$5K",
  },
  {
    icon: "🤖",
    name: "eHand",
    desc: "6-DOF myoelectric prosthetic hand",
    tier: "$2K",
  },
  {
    icon: "🧠",
    name: "eBCI-Lite",
    desc: "8-channel dry-electrode EEG headband",
    tier: "$10K",
  },
  {
    icon: "🌾",
    name: "eFarm",
    desc: "Solar LoRaWAN soil sensor mesh",
    tier: "$1K",
  },
  {
    icon: "💧",
    name: "eHydro",
    desc: "Water-quality monitoring buoy",
    tier: "$3K",
  },
  {
    icon: "🐝",
    name: "eHive",
    desc: "Acoustic beehive monitor",
    tier: "$500",
  },
  {
    icon: "🚙",
    name: "eRover-Mini",
    desc: "$400 autonomous research rover",
    tier: "$2K",
  },
  {
    icon: "🎓",
    name: "eEdu-Kit",
    desc: "Classroom STEM dev board + curriculum",
    tier: "$1K",
  },
  {
    icon: "⚡",
    name: "eMeshGrid",
    desc: "Off-grid micro-grid controller",
    tier: "$25K",
  },
  {
    icon: "🛰️",
    name: "eCubeSat-1U",
    desc: "1U CubeSat concept with research firmware",
    tier: "$30K",
  },
];

function CategoryRow({ cat }: { cat: (typeof CATEGORIES)[0] }) {
  const render = CATEGORY_RENDER[cat.id];
  return (
    <article
      className={render ? "cat has-fig" : "cat"}
      style={{ "--c": cat.color } as CSSProperties}
    >
      {render && (
        <div className="cat-fig">
          <BoardFigure
            base={MEDIA + render.clip}
            width={1280}
            height={720}
            alt={`${render.design}: ${render.shows}`}
            caption={
              <>
                <span>
                  <b>{render.design}</b> — {render.shows}
                </span>
                <span>Render · design stage</span>
              </>
            }
          />
        </div>
      )}
      <div className="cat-text">
        <div className="cat-top">
          <h3>{cat.title}</h3>
          <span
            className="st"
            style={{ "--c": STATUS_COLORS[cat.status] } as CSSProperties}
          >
            {cat.status}
          </span>
        </div>
        <p className="cat-sub">{cat.subtitle}</p>
        <p className="cat-desc">{cat.desc}</p>

        <ul className="cat-products">
          {cat.products.map(p => (
            <li key={p}>{p}</li>
          ))}
        </ul>

        <dl className="cat-specs">
          {cat.specs.map(s => (
            <div key={s.label}>
              <dt>{s.label}</dt>
              <dd>{s.value}</dd>
            </div>
          ))}
        </dl>

        <p className="cat-std">Target standards: {cat.standard}</p>

        <div className="cat-links">
          <Link href={cat.href} className="btn gh sm">
            Learn more<span className="sr-only"> about {cat.title}</span>{" "}
            <span className="ar" aria-hidden="true">
              →
            </span>
          </Link>
          <a
            href={cat.ghref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn ln sm"
            aria-label={`${cat.title} designs on GitHub (opens in a new tab)`}
          >
            GitHub <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </article>
  );
}

export default function EcadHardware() {
  const [filter, setFilter] = useState<"all" | "Design" | "Concept">("all");

  const filtered =
    filter === "all" ? CATEGORIES : CATEGORIES.filter(c => c.status === filter);

  return (
    <BpPage className="ecad">
      <img
        loading="lazy"
        decoding="async"
        src="/media/product-ecad-hardware_f5806032.jpg"
        width={1400}
        height={788}
        alt=""
        aria-hidden="true"
        className="ecad-heroimg"
      />
      <PageHero
        label="eCAD HARDWARE DESIGNS · MIT LICENSE, EXCEPT EoS BOARDS AND MIRRORED DESIGNS"
        title="Hardware Design Portfolio"
        lead="15 hardware design categories — from health wearables to aerospace systems, industrial PLCs to personal air mobility concepts. The repository includes a mix of design documents, KiCad sources, BOMs, and datasheets; coverage varies by design."
      >
        <p className="ecad-art">Illustrative concept artwork</p>
        <div className="ctas">
          <Link href="/open-hardware" className="btn gh">
            See 4,022 real board CAD files, rendered and verified{" "}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </PageHero>

      <LocalNav
        name="eCAD Hardware"
        items={[
          { id: "categories", label: "Categories" },
          { id: "future", label: "Future designs" },
          { id: "diagrams", label: "Block diagrams" },
          { id: "explore", label: "Explore" },
        ]}
      />

      <div className="wrap ecad-stats">
        <Stats
          items={[
            { value: "15", label: "Design Categories" },
            { value: "50+", label: "Design Entries" },
            { value: "10", label: "Future Concepts" },
          ]}
        />
      </div>

      {/* Categories */}
      <Section
        id="categories"
        wide
        label="eCAD Hardware"
        title="Design Categories"
        lead="Every category is at design or concept stage. The figures are renders of the designs, not photographs of built hardware."
        split
      >
        <div
          className="ctas ecad-filter"
          role="group"
          aria-label="Filter categories by stage"
        >
          {(["all", "Design", "Concept"] as const).map(f => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className="btn gh sm"
            >
              {f === "all" ? "All Categories" : f}
              {f !== "all" && (
                <span className="ecad-n">
                  ({CATEGORIES.filter(c => c.status === f).length})
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="ecad-list">
          {filtered.map(cat => (
            <CategoryRow key={cat.id} cat={cat} />
          ))}
        </div>
      </Section>

      {/* Future Designs Spotlight */}
      <Section
        id="future"
        alt
        title="Donor-Sponsored Future Designs"
        lead="10 concept-stage hardware products for health, accessibility, climate, and research. Each has a datasheet stub, BOM placeholder, and one-page business plan for donor evaluation."
        split
      >
        <ul className="ecad-future">
          {FUTURE.map(item => (
            <li key={item.name} className="card">
              <span className="ecad-emoji" aria-hidden="true">
                {item.icon}
              </span>
              <h3>{item.name}</h3>
              <p>{item.desc}</p>
              <span className="k">Donor tier: {item.tier}</span>
            </li>
          ))}
        </ul>
        <div className="ctas ecad-after">
          <Link href="/donate" className="btn or">
            Sponsor a Future Design{" "}
            <span className="ar" aria-hidden="true">
              →
            </span>
          </Link>
        </div>
      </Section>

      {/* Hardware Block Diagrams */}
      <Section
        id="diagrams"
        label="BLOCK DIAGRAMS"
        title="Illustrative Concept Architecture"
        lead="Interactive concept diagrams for proposed hardware pipelines; not as-built schematics."
        split
      >
        <div className="ecad-diagrams">
          {HW_DIAGRAMS.map(d => (
            <div
              key={d.id}
              className="ecad-dia"
              style={{ "--c": d.color } as CSSProperties}
            >
              <div className="ecad-dia-h">
                <h3>{d.title}</h3>
                <p>{d.subtitle}</p>
              </div>
              <div className="ecad-stage">
                <Suspense fallback={<div className="ecad-wait">Loading…</div>}>
                  <ArchitectureDiagram3D layers={d.layers} height={480} />
                </Suspense>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section
        id="explore"
        alt
        title="Explore the Hardware Designs"
        lead="The repository is MIT-licensed, except the original EoS development boards, which are all rights reserved, and the manufacturer designs mirrored under boards/cad, which keep their manufacturers' licences. It includes a mix of design documents, KiCad sources, BOMs, and datasheets. Artifact coverage varies by design."
      >
        <div className="ctas">
          <a
            href="https://github.com/embeddedos-org/eCAD-Hardware-Products"
            target="_blank"
            rel="noopener noreferrer"
            className="btn pri"
          >
            View on GitHub <span aria-hidden="true">↗</span>
          </a>
          <Link href="/getting-started" className="btn gh">
            Get Started{" "}
            <span className="ar" aria-hidden="true">
              →
            </span>
          </Link>
        </div>
      </Section>
    </BpPage>
  );
}
