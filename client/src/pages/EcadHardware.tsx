import { useState, useRef, lazy, Suspense } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "wouter";
import {
  Heart,
  Plane,
  Car,
  Bot,
  Factory,
  Leaf,
  Building2,
  Microscope,
  Rocket,
  Shield,
  Wifi,
  Zap,
  Brain,
  Globe,
  HardDrive,
  ChevronRight,
  ArrowRight,
  ExternalLink,
  Package,
  Activity,
  Layers,
} from "lucide-react";

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
    icon: Heart,
    color: "#EF4444",
    title: "eHealth365",
    subtitle: "Wearable Health Platform",
    status: "Production",
    standard: "510(k) Class II",
    products: [
      "HEALTH-KEY ULTRA",
      "HEALTH-BAND Neuro",
      "HEALTH-RING",
      "HEALTH-LAB",
    ],
    desc: "Four-device wearable health monitoring ecosystem covering ~90% of all health metrics. From cardiovascular vitals to blood chemistry, neural signals to activity tracking.",
    specs: [
      { label: "MCU", value: "nRF5340 + STM32H7" },
      { label: "Connectivity", value: "BLE 5.3 LR" },
      { label: "FDA Path", value: "510(k) / De Novo" },
      { label: "Sensors", value: "ECG, EEG, SpO₂, CGM" },
    ],
    href: "/health",
    ghref: "https://github.com/embeddedos-org/eCAD-Hardware-Products",
  },
  {
    id: "radar",
    icon: Car,
    color: "#F97316",
    title: "eRadar360 / Aegis One",
    subtitle: "Automotive Safety System",
    status: "Production",
    standard: "ISO 26262 ASIL-D",
    products: ["Front Radar", "Rear Radar", "Side Radars ×4", "Fusion ECU"],
    desc: "360° automotive safety system fusing 4× 77 GHz FMCW radar, 8× cameras, LiDAR, and V2X. AI threat detection at <10 ms latency on EoS.",
    specs: [
      { label: "Radar", value: "TI AWR2944 77 GHz" },
      { label: "Range", value: "0–250 m, 0.75 m res" },
      { label: "Latency", value: "<10 ms threat detect" },
      { label: "Standard", value: "ISO 26262 ASIL-D" },
    ],
    href: "/eradar360",
    ghref: "https://github.com/embeddedos-org/eCAD-Hardware-Products",
  },
  {
    id: "aerospace",
    icon: Plane,
    color: "#22D3EE",
    title: "eAerospace",
    subtitle: "Aircraft, UAV & Space Systems",
    status: "Design",
    standard: "DO-254 / ECSS",
    products: ["Aircraft Components", "Avionics", "UAV / VTOL", "CubeSat"],
    desc: "Complete aerospace hardware portfolio from flight computers and avionics to UAV swarm controllers and 1U CubeSat reference designs. All running EoS.",
    specs: [
      { label: "MCU", value: "STM32H7, LEON3FT" },
      { label: "Bus", value: "ARINC-429, CAN FD" },
      { label: "Standard", value: "DO-254, ECSS" },
      { label: "Class", value: "IPC Class 3" },
    ],
    href: "/aerospace",
    ghref: "https://github.com/embeddedos-org/eCAD-Hardware-Products",
  },
  {
    id: "pam",
    icon: Rocket,
    color: "#F472B6",
    title: "ePAM",
    subtitle: "Personal Air Mobility",
    status: "Design",
    standard: "FAA / EASA",
    products: ["Urban Drone (eVTOL)", "Space Shuttle", "Eco Car", "Combo Unit"],
    desc: "Solar-hybrid personal transport — 4-product line. 4-5 seat capacity, solar + water/hydrogen hybrid power. From $28K mass-market EcoCar to $4M suborbital Space Shuttle.",
    specs: [
      { label: "Power", value: "Solar + H₂ hybrid" },
      { label: "Range", value: "0–100 km altitude" },
      { label: "Seats", value: "4–5 passengers" },
      { label: "Price", value: "$28K – $9M" },
    ],
    href: "/aerospace",
    ghref: "https://github.com/embeddedos-org/eCAD-Hardware-Products",
  },
  {
    id: "robotics",
    icon: Bot,
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
    icon: Factory,
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
      { label: "Certif.", value: "CE, UL, ATEX" },
    ],
    href: "/ecad-hardware",
    ghref: "https://github.com/embeddedos-org/eCAD-Hardware-Products",
  },
  {
    id: "medical",
    icon: Microscope,
    color: "#F59E0B",
    title: "eMedical",
    subtitle: "Diagnostic & Surgical Devices",
    status: "Design",
    standard: "IEC 60601-1",
    products: ["ECG / EEG", "Ultrasound", "Surgical Robots", "Lab Equipment"],
    desc: "Medical hardware portfolio covering diagnostic equipment, surgical devices, patient care systems, and laboratory equipment. All designed to IEC 60601-1 medical-grade standards.",
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
    icon: Leaf,
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
      { label: "Certif.", value: "UL 1973, CE" },
    ],
    href: "/ecad-hardware",
    ghref: "https://github.com/embeddedos-org/eCAD-Hardware-Products",
  },
  {
    id: "smartcity",
    icon: Building2,
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
      { label: "Certif.", value: "FCC, CE, ETSI" },
    ],
    href: "/ecad-hardware",
    ghref: "https://github.com/embeddedos-org/eCAD-Hardware-Products",
  },
  {
    id: "defense",
    icon: Shield,
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
    icon: Wifi,
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
      { label: "Certif.", value: "FCC, CE, Bluetooth SIG" },
    ],
    href: "/ecad-hardware",
    ghref: "https://github.com/embeddedos-org/eCAD-Hardware-Products",
  },
  {
    id: "electronics",
    icon: Zap,
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
    icon: Activity,
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
    icon: Globe,
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
    desc: "Cybersecurity hardware portfolio covering security appliances, physical security, and access control. FIPS 140-3 and CC EAL4+ certified designs.",
    specs: [
      { label: "Standard", value: "FIPS 140-3, CC EAL4+" },
      { label: "Crypto", value: "AES-256, RSA-4096, ECC" },
      { label: "Biometrics", value: "Fingerprint, Iris, Face" },
      { label: "Certif.", value: "ISO 27001, FIPS 201-3" },
    ],
    href: "/ecad-hardware",
    ghref: "https://github.com/embeddedos-org/eCAD-Hardware-Products",
  },
  {
    id: "future",
    icon: Brain,
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
  Production: "#34D399",
  Design: "#FBBF24",
  Concept: "#A78BFA",
};

function CategoryCard({
  cat,
  index,
}: {
  cat: (typeof CATEGORIES)[0];
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        delay: (index % 4) * 0.07,
        duration: 0.5,
        ease: [0.23, 1, 0.32, 1],
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="rounded-2xl border flex flex-col overflow-hidden transition-all duration-300"
      style={{
        background: hovered ? `${cat.color}08` : "rgba(255,255,255,0.03)",
        borderColor: hovered ? `${cat.color}40` : "rgba(255,255,255,0.08)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
      }}
    >
      {/* Header */}
      <div className="p-5 pb-4 flex items-start gap-4">
        <motion.div
          animate={{ scale: hovered ? 1.1 : 1, rotate: hovered ? 5 : 0 }}
          transition={{ duration: 0.3 }}
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${cat.color}20` }}
        >
          <cat.icon size={24} style={{ color: cat.color }} />
        </motion.div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-white text-lg leading-tight">
              {cat.title}
            </h3>
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{
                background: `${STATUS_COLORS[cat.status]}20`,
                color: STATUS_COLORS[cat.status],
              }}
            >
              {cat.status}
            </span>
          </div>
          <div className="text-sm mt-0.5" style={{ color: cat.color }}>
            {cat.subtitle}
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="px-5 pb-4">
        <p className="text-gray-400 text-sm leading-relaxed">{cat.desc}</p>
      </div>

      {/* Product list */}
      <div className="px-5 pb-4 flex flex-wrap gap-1.5">
        {cat.products.map(p => (
          <span
            key={p}
            className="text-[11px] px-2 py-0.5 rounded-md font-mono"
            style={{
              background: "rgba(255,255,255,0.06)",
              color: "rgba(255,255,255,0.6)",
            }}
          >
            {p}
          </span>
        ))}
      </div>

      {/* Specs */}
      <div className="px-5 pb-4 grid grid-cols-2 gap-2">
        {cat.specs.map(s => (
          <div
            key={s.label}
            className="rounded-lg p-2"
            style={{ background: "rgba(255,255,255,0.04)" }}
          >
            <div className="text-[10px] text-gray-500 uppercase tracking-wider">
              {s.label}
            </div>
            <div className="text-xs font-semibold text-white mt-0.5">
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* Standard badge */}
      <div className="px-5 pb-3">
        <span className="text-[10px] font-mono" style={{ color: cat.color }}>
          Standard: {cat.standard}
        </span>
      </div>

      {/* Footer actions */}
      <div
        className="mt-auto px-5 py-4 border-t flex items-center justify-between"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <Link href={cat.href}>
          <motion.div
            whileHover={{ x: 3 }}
            className="flex items-center gap-1 text-sm font-semibold cursor-pointer"
            style={{ color: cat.color }}
          >
            Learn more <ArrowRight size={14} />
          </motion.div>
        </Link>
        <a href={cat.ghref} target="_blank" rel="noopener noreferrer">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-white transition-colors cursor-pointer"
          >
            GitHub <ExternalLink size={11} />
          </motion.div>
        </a>
      </div>
    </motion.div>
  );
}

export default function EcadHardware() {
  const [filter, setFilter] = useState<
    "all" | "Production" | "Design" | "Concept"
  >("all");

  const filtered =
    filter === "all" ? CATEGORIES : CATEGORIES.filter(c => c.status === filter);

  return (
    <div className="min-h-screen bg-[#050A14] text-white">
      {/* Hero */}
      <section className="relative pt-28 pb-16 px-6 overflow-hidden">
        <img
          loading="lazy"
          decoding="async"
          src="/manus-storage/product-ecad-hardware_f5806032.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-8 pointer-events-none"
        />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div
          className="absolute top-20 left-1/3 w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{
            background: "radial-gradient(circle, #F97316, transparent)",
          }}
        />
        <div
          className="absolute top-40 right-1/3 w-80 h-80 rounded-full blur-3xl opacity-10"
          style={{
            background: "radial-gradient(circle, #22D3EE, transparent)",
          }}
        />

        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 border"
              style={{
                background: "rgba(249,115,22,0.1)",
                borderColor: "rgba(249,115,22,0.3)",
                color: "#F97316",
              }}
            >
              <Package size={12} /> eCAD HARDWARE PRODUCTS · MIT LICENSE
            </span>
            <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
              Hardware{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #F97316, #FBBF24)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Design
              </span>{" "}
              Portfolio
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed mb-8">
              15 CAD hardware design categories — from health wearables to
              aerospace systems, industrial PLCs to personal air mobility
              vehicles. All engineered to run the EmbeddedOS stack. KiCad
              schematics, Altium designs, Gerber files, BOMs, and datasheets.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {(["all", "Production", "Design", "Concept"] as const).map(f => (
                <motion.button
                  key={f}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setFilter(f)}
                  className="px-5 py-2 rounded-lg text-sm font-semibold border transition-all"
                  style={{
                    background:
                      filter === f ? "rgba(249,115,22,0.2)" : "transparent",
                    borderColor:
                      filter === f ? "#F97316" : "rgba(255,255,255,0.15)",
                    color: filter === f ? "#F97316" : "rgba(255,255,255,0.6)",
                  }}
                >
                  {f === "all" ? "All Categories" : f}
                  {f !== "all" && (
                    <span className="ml-2 text-[10px] opacity-70">
                      ({CATEGORIES.filter(c => c.status === f).length})
                    </span>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section
        className="border-y py-8 px-6"
        style={{
          borderColor: "rgba(255,255,255,0.07)",
          background: "rgba(255,255,255,0.02)",
        }}
      >
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: "15", label: "Design Categories", color: "#F97316" },
            { value: "2", label: "Production Ready", color: "#34D399" },
            { value: "50+", label: "Product Lines", color: "#22D3EE" },
            { value: "10", label: "Future Concepts", color: "#A78BFA" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="text-center"
            >
              <div className="text-3xl font-black" style={{ color: s.color }}>
                {s.value}
              </div>
              <div className="text-xs text-gray-500 mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filtered.map((cat, i) => (
              <CategoryCard key={cat.id} cat={cat} index={i} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Future Designs Spotlight */}
      <section
        className="py-16 px-6"
        style={{
          background: "rgba(139,92,246,0.04)",
          borderTop: "1px solid rgba(139,92,246,0.15)",
        }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black mb-4">
              Donor-Sponsored Future Designs
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              10 concept-stage hardware products for health, accessibility,
              climate, and research. Each has a datasheet stub, BOM placeholder,
              and one-page business plan for donor evaluation.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
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
                desc: "1U CubeSat with EmbeddedOS flight SW",
                tier: "$30K",
              },
            ].map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -3, scale: 1.03 }}
                className="rounded-xl border p-4 text-center cursor-pointer"
                style={{
                  background: "rgba(139,92,246,0.06)",
                  borderColor: "rgba(139,92,246,0.2)",
                }}
              >
                <div className="text-3xl mb-2">{item.icon}</div>
                <div className="font-bold text-white text-sm">{item.name}</div>
                <div className="text-[11px] text-gray-400 mt-1 leading-tight">
                  {item.desc}
                </div>
                <div
                  className="mt-2 text-[10px] font-semibold"
                  style={{ color: "#A78BFA" }}
                >
                  Donor tier: {item.tier}
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/donate">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-3.5 rounded-xl font-bold text-white flex items-center gap-2 mx-auto"
                style={{
                  background: "linear-gradient(135deg, #8B5CF6, #6366F1)",
                }}
              >
                Sponsor a Future Design <ChevronRight size={18} />
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* Hardware Block Diagrams */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-medium mb-4">
              <Layers className="w-4 h-4" /> BLOCK DIAGRAMS
            </div>
            <h2 className="text-3xl font-black text-white mb-3">
              Hardware Architecture
            </h2>
            <p className="text-gray-400">
              Interactive 3D block diagrams for key hardware product pipelines.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {HW_DIAGRAMS.map(d => (
              <div key={d.id}>
                <div className="mb-3">
                  <div className="text-white font-bold text-sm">{d.title}</div>
                  <div className="text-white/40 text-xs">{d.subtitle}</div>
                </div>
                <Suspense
                  fallback={
                    <div className="h-64 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/20 text-xs">
                      Loading…
                    </div>
                  }
                >
                  <ArchitectureDiagram3D layers={d.layers} height={260} />
                </Suspense>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-black mb-4">
            Run EmbeddedOS on Your Hardware
          </h2>
          <p className="text-gray-400 mb-8">
            All hardware designs are MIT-licensed and available on GitHub. KiCad
            schematics, Altium designs, Gerber files, BOMs, and datasheets
            included.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://github.com/embeddedos-org/eCAD-Hardware-Products"
              target="_blank"
              rel="noopener noreferrer"
            >
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-3.5 rounded-xl font-bold text-white flex items-center gap-2"
                style={{
                  background: "linear-gradient(135deg, #F97316, #EF4444)",
                }}
              >
                View on GitHub <ExternalLink size={16} />
              </motion.button>
            </a>
            <Link href="/getting-started">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-3.5 rounded-xl font-bold border flex items-center gap-2"
                style={{ borderColor: "rgba(255,255,255,0.2)", color: "white" }}
              >
                Get Started <ChevronRight size={16} />
              </motion.button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
