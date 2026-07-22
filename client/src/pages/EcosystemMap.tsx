import { useState } from "react";
import { motion } from "framer-motion";
import { Layers, ArrowRight, Cpu, Brain, Globe, Smartphone, Satellite, Heart } from "lucide-react";
import { Link } from "wouter";

const layers = [
  {
    id: "hardware",
    name: "Hardware Layer",
    color: "#6B7280",
    desc: "Physical devices and silicon. 52+ supported boards across ARM Cortex-M/A, RISC-V, ESP32, and custom SoCs.",
    items: ["STM32 Family (F4, H7, U5, WB)", "ESP32 / ESP32-S3 / ESP32-C6", "Raspberry Pi (3, 4, 5, Zero 2W)", "NXP i.MX RT / LPC", "Nordic nRF52/nRF9160", "RK3588S / RK3399", "Custom eCAD Hardware"],
    link: "/hardware-lab",
  },
  {
    id: "hal",
    name: "HAL — Hardware Abstraction Layer",
    color: "#F97316",
    desc: "Unified API for all hardware peripherals. Write once, run on any supported board.",
    items: ["GPIO (input, output, interrupt, PWM)", "UART / SPI / I2C / CAN / USB", "ADC / DAC / DMA", "Timers / RTC / Watchdog", "Flash / EEPROM / SD Card", "Network (Wi-Fi, BLE, Ethernet, Thread)"],
    link: "/eos",
  },
  {
    id: "kernel",
    name: "EoS Kernel",
    color: "#22D3EE",
    desc: "The EmbeddedOS microkernel. RTOS task scheduler, memory management, IPC, and security.",
    items: ["Preemptive task scheduler (priority + round-robin)", "MPU-enforced memory isolation", "EIPC secure inter-process communication", "Crypto subsystem (AES-256, SHA-256, ECDSA)", "OTA update engine with A/B partitions", "Power management (sleep, hibernate, wake)"],
    link: "/eos",
  },
  {
    id: "services",
    name: "System Services",
    color: "#A855F7",
    desc: "OS-level services that run as isolated tasks and expose EIPC interfaces.",
    items: ["eDB — multi-model database (SQL + KV + Doc)", "eBoot — secure bootloader with chain of trust", "eLogger — structured logging service", "eNet — network stack (TCP/IP, MQTT, HTTP)", "eStorage — filesystem (FAT32, LittleFS, ext4)", "eSecurity — key management and audit log"],
    link: "/eboot",
  },
  {
    id: "ai",
    name: "AI & Neural Layer",
    color: "#F472B6",
    desc: "On-device AI inference and neural interface acquisition.",
    items: ["eAI — TFLite / ONNX / GGUF inference engine", "eNI — 1024-channel neural signal acquisition", "eBot — natural language device control agent", "eAI Edge — eNI + eIPC + eAI manifest stack", "Neural Link AI — BCI platform"],
    link: "/eai",
  },
  {
    id: "apps",
    name: "Application Layer",
    color: "#34D399",
    desc: "55+ apps across 6 categories. Native C/LVGL, browser extensions, and Flutter mobile.",
    items: ["eOffice Suite (11 apps)", "System Apps (12 apps)", "Media & Entertainment (8 apps)", "Developer Tools (10 apps)", "Browser Extensions (8 apps)", "Flutter Mobile Companions (6 apps)"],
    link: "/eosuite",
  },
  {
    id: "products",
    name: "Product Verticals",
    color: "#FBBF24",
    desc: "Complete hardware + software product lines built on the EoS stack.",
    items: ["eHealth365 — Smart Ring Pro, Smart Patch Pro", "eRadar360 / Aegis One — 77 GHz radar system", "AeroSwift — aerospace flight computer", "eCAD Hardware — 18 product families"],
    link: "/products",
  },
];

export default function EcosystemMapPage() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#0A0E1A] text-white">
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/5" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-medium mb-6">
              <Layers className="w-4 h-4" /> ECOSYSTEM MAP
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent">The EmbeddedOS Ecosystem</h1>
            <p className="text-xl text-gray-400">7 layers from bare silicon to complete product verticals. Click any layer to explore its components.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto space-y-3">
          {layers.map((layer, i) => (
            <motion.div key={layer.id} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
              <button onClick={() => setActive(active === layer.id ? null : layer.id)} className="w-full text-left">
                <div className="flex items-center justify-between p-4 rounded-xl border transition-all"
                  style={active === layer.id ? { background: layer.color + "15", borderColor: layer.color + "40" } : { background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ background: layer.color }} />
                    <span className="font-semibold text-white">{layer.name}</span>
                  </div>
                  <span className="text-gray-500 text-sm">{active === layer.id ? "▲" : "▼"}</span>
                </div>
              </button>
              {active === layer.id && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                  className="border border-t-0 rounded-b-xl p-6" style={{ borderColor: layer.color + "40", background: layer.color + "08" }}>
                  <p className="text-gray-400 mb-4">{layer.desc}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                    {layer.items.map(item => (
                      <div key={item} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5" style={{ background: layer.color }} />
                        <span className="text-gray-300 text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                  <Link href={layer.link} className="inline-flex items-center gap-2 text-sm font-medium" style={{ color: layer.color }}>Explore {layer.name} <ArrowRight className="w-3 h-3" /></Link>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/products" className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-semibold transition-colors">All Products <ArrowRight className="w-4 h-4" /></Link>
            <Link href="/getting-started" className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold border border-white/20 transition-colors">Get Started</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
