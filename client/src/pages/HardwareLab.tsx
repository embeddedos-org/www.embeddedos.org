import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  Cpu,
  Wrench,
  Zap,
  Shield,
  Wifi,
  ChevronRight,
  Heart,
  Radio,
  Plane,
  Factory,
  Home,
  Microscope,
  Bot,
  Globe,
  Car,
  ExternalLink,
  Layers,
  FlaskConical,
} from "lucide-react";
import { Link } from "wouter";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.05, ease: "easeOut" as const },
  }),
};

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
    icon: Cpu,
    title: "52+ Boards",
    desc: "Comprehensive BSP support across ARM, RISC-V, Xtensa, AVR, and automotive SoCs.",
  },
  {
    icon: Zap,
    title: "EoSim Simulator",
    desc: "Test firmware on 63+ virtual boards without physical hardware.",
  },
  {
    icon: Shield,
    title: "Secure Boot",
    desc: "Hardware-backed secure boot with eBoot on every supported platform.",
  },
  {
    icon: Wifi,
    title: "Universal Drivers",
    desc: "Unified driver model — write once, run on any supported board.",
  },
  {
    icon: Wrench,
    title: "ebuild Integration",
    desc: "One command to build for any target: `ebuild build --target stm32h7`.",
  },
  {
    icon: ArrowRight,
    title: "OTA Updates",
    desc: "Delta OTA firmware updates with rollback protection on all platforms.",
  },
];

// ─── eCAD Product Family Card ────────────────────────────────────────────────
function FamilyCard({
  icon: Icon,
  name,
  tagline,
  color,
  products,
  href,
  external,
  delay,
}: {
  icon: React.FC<{
    size?: number;
    className?: string;
    style?: React.CSSProperties;
  }>;
  name: string;
  tagline: string;
  color: string;
  products: string[];
  href: string;
  external?: boolean;
  delay: number;
}) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group rounded-3xl border p-6 transition-all duration-300"
      style={
        {
          background: hovered ? `${color}06` : "#0D1117",
          borderColor: hovered ? `${color}40` : "rgba(255,255,255,0.08)",
          boxShadow: hovered ? `0 20px 60px ${color}15` : "none",
        } as React.CSSProperties
      }
    >
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-colors"
        style={
          {
            background: hovered ? `${color}20` : `${color}10`,
            border: `1px solid ${color}20`,
          } as React.CSSProperties
        }
      >
        <Icon size={20} style={{ color } as React.CSSProperties} />
      </div>
      <h3 className="text-lg font-black text-white mb-1">{name}</h3>
      <p className="text-sm text-white/40 mb-4 leading-relaxed">{tagline}</p>
      <div className="space-y-1 mb-5">
        {products.map(p => (
          <div
            key={p}
            className="flex items-center gap-2 text-xs text-white/50"
          >
            <div
              className="w-1 h-1 rounded-full shrink-0"
              style={{ background: color }}
            />
            {p}
          </div>
        ))}
      </div>
      {external ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs font-bold transition-colors"
          style={
            {
              color: hovered ? color : "rgba(255,255,255,0.3)",
            } as React.CSSProperties
          }
        >
          View CAD Files <ExternalLink size={11} />
        </a>
      ) : (
        <Link
          href={href}
          className="flex items-center gap-1.5 text-xs font-bold transition-colors"
          style={
            {
              color: hovered ? color : "rgba(255,255,255,0.3)",
            } as React.CSSProperties
          }
        >
          Learn More <ChevronRight size={11} />
        </Link>
      )}
    </motion.div>
  );
}

const ECAD_FAMILIES = [
  {
    icon: Heart,
    name: "eHealth365",
    tagline: "Smart Ring Pro + Smart Patch Pro — ~90% health metric coverage",
    color: "#F97316",
    products: [
      "Smart Ring Pro — vitality hub ($299)",
      "Smart Patch Pro — chemistry hub ($199)",
      "AI mobile health hub",
      "Monthly blood + mineral cartridges",
    ],
    href: "/ehealth365",
    delay: 0,
  },
  {
    icon: Radio,
    name: "eRadar360 / Aegis One",
    tagline: "360° automotive safety — radar, laser, V2X, 6 TOPS AI",
    color: "#22D3EE",
    products: [
      "TI AWR2944 77 GHz FMCW radar",
      "5× InGaAs APD laser detection",
      "Autotalks TEKTON3 V2X",
      "RK3588S 6 TOPS NPU",
    ],
    href: "/eradar360",
    delay: 0.05,
  },
  {
    icon: Heart,
    name: "EoS Health Devices",
    tagline:
      "KEY ULTRA, BAND Neuro, RING, LAB — four flagship health wearables",
    color: "#F472B6",
    products: [
      "HEALTH-KEY ULTRA — multi-biometric wristband",
      "HEALTH-BAND Neuro — EEG + neural feedback",
      "HEALTH-RING — continuous vitals ring",
      "HEALTH-LAB — clinical-grade patch",
    ],
    href: "/health",
    delay: 0.1,
  },
  {
    icon: Plane,
    name: "eAerospace",
    tagline: "Aircraft, avionics, UAV/drone, and space systems",
    color: "#60A5FA",
    products: [
      "Aircraft — STM32H7, CAN FD, ARINC-429",
      "Avionics — RK3588S, ZED-F9P, DO-254",
      "UAV/VTOL/Swarm — STM32G4, nRF5340",
      "Space/CubeSat — LEON3FT, ECSS",
    ],
    href: "https://github.com/embeddedos-org/eCAD-Hardware-Products/tree/master/eAerospace_CAD_Design",
    external: true,
    delay: 0.15,
  },
  {
    icon: Factory,
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
    delay: 0.2,
  },
  {
    icon: Home,
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
    delay: 0.25,
  },
  {
    icon: Microscope,
    name: "eMedical",
    tagline: "Medical-grade devices — FDA 510(k), IEC 62304, ISO 14971",
    color: "#A78BFA",
    products: [
      "Diagnostic imaging peripherals",
      "Patient monitoring devices",
      "Implantable-adjacent sensors",
      "FDA 510(k) / IEC 62304 / ISO 14971",
    ],
    href: "https://github.com/embeddedos-org/eCAD-Hardware-Products/tree/master/eMedical_CAD_Design",
    external: true,
    delay: 0.3,
  },
  {
    icon: Bot,
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
    delay: 0.35,
  },
  {
    icon: Globe,
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
    delay: 0.4,
  },
  {
    icon: Zap,
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
    delay: 0.45,
  },
  {
    icon: Shield,
    name: "eCybersecurity",
    tagline: "HSM, TPM, secure elements — FIPS 140-3 compliant",
    color: "#34D399",
    products: [
      "Hardware security modules (HSM)",
      "TPM 2.0 compatible designs",
      "Secure boot hardware roots",
      "FIPS 140-3 compliant designs",
    ],
    href: "https://github.com/embeddedos-org/eCAD-Hardware-Products/tree/master/eCybersecurity_CAD_Design",
    external: true,
    delay: 0.5,
  },
  {
    icon: Car,
    name: "eTransport",
    tagline: "Automotive ECUs — AUTOSAR, ISO 26262, CAN FD",
    color: "#60A5FA",
    products: [
      "AUTOSAR-compliant ECUs",
      "CAN FD / LIN / FlexRay interfaces",
      "V2X communication modules",
      "ISO 26262 ASIL-B/D designs",
    ],
    href: "https://github.com/embeddedos-org/eCAD-Hardware-Products/tree/master/eTransport_CAD_Design",
    external: true,
    delay: 0.55,
  },
];

export default function HardwareLab() {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="section-padding bg-grid">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            <div className="badge-teal mb-4 inline-flex">
              <Cpu size={12} />
              Hardware Lab
            </div>
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-white mb-4">
              52+ Supported{" "}
              <span className="text-gradient">Hardware Platforms</span>
            </h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto mb-8">
              EmbeddedOS runs on ARM Cortex-M/A, RISC-V, Xtensa, AVR, and
              automotive SoCs. One OS, every device.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="https://github.com/embeddedos-org/eos"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#F97316] hover:bg-[#EA580C] text-white font-bold rounded-xl transition-all active:scale-95"
              >
                View BSP on GitHub
                <ArrowRight size={16} />
              </a>
              <Link
                href="/getting-started"
                className="inline-flex items-center gap-2 px-6 py-3 glass hover:bg-white/10 text-white font-semibold rounded-xl transition-all border border-white/10"
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-[#080F1E]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  className="glass rounded-xl p-4 border border-white/5 flex items-start gap-3"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#F97316]/15 border border-[#F97316]/30 flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-[#F97316]" />
                  </div>
                  <div>
                    <div className="font-semibold text-white text-sm">
                      {f.title}
                    </div>
                    <div className="text-xs text-white/50 mt-0.5">{f.desc}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Board Families */}
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
              Supported Board Families
            </h2>
            <p className="text-white/50">
              Comprehensive BSP coverage across all major embedded
              architectures.
            </p>
          </motion.div>
          <div className="space-y-8">
            {BOARD_FAMILIES.map((family, fi) => (
              <motion.div
                key={family.family}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={fi}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="text-xs font-bold px-3 py-1 rounded-full"
                    style={{
                      background: family.color + "20",
                      color: family.color,
                      border: `1px solid ${family.color}40`,
                    }}
                  >
                    {family.family}
                  </div>
                  <div className="h-px flex-1 bg-white/5" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {family.boards.map(board => (
                    <span
                      key={board}
                      className="text-xs px-3 py-1.5 rounded-lg bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 hover:text-white transition-colors cursor-default"
                    >
                      {board}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* eCAD Hardware Families */}
      <section className="section-padding">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-10 text-center"
          >
            <div className="badge-teal mb-4 inline-flex">
              <Layers size={12} />
              eCAD Hardware Products
            </div>
            <h2 className="font-heading font-bold text-white text-3xl mb-2">
              18 Hardware Product Families
            </h2>
            <p className="text-white/50">
              Open-source hardware designs across health, automotive, aerospace,
              industrial, consumer, and beyond — all running EoS.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {ECAD_FAMILIES.map(f => (
              <FamilyCard key={f.name} {...f} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <a
              href="https://github.com/embeddedos-org/eCAD-Hardware-Products"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#22D3EE] hover:bg-[#06B6D4] text-[#0B1D3A] font-bold rounded-xl transition-all active:scale-95"
            >
              Browse All 18 Families on GitHub <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* EoSim CTA */}
      <section className="section-padding bg-[#080F1E]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="glass rounded-2xl p-8 border border-[#22D3EE]/20 bg-[#22D3EE]/5 text-center"
          >
            <div className="badge-teal mb-4 inline-flex">
              EoSim — Board Simulator
            </div>
            <h2 className="font-heading font-bold text-white text-2xl mb-3">
              No Hardware? No Problem.
            </h2>
            <p className="text-white/60 mb-6 max-w-xl mx-auto">
              EoSim simulates 63+ boards in software. Develop, test, and debug
              firmware without any physical hardware.
            </p>
            <Link
              href="/flow"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#22D3EE] hover:bg-[#06B6D4] text-[#0B1D3A] font-bold rounded-xl transition-all active:scale-95"
            >
              Try EoSim
              <ChevronRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
