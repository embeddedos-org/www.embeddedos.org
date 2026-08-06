import { useState } from "react";
import { motion } from "framer-motion";
import {
  Cpu,
  Terminal,
  Play,
  BarChart3,
  Search,
  List,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Link } from "wouter";

const commands = [
  {
    cmd: "eosim list",
    desc: "List all 63+ simulation platforms from the registry. Supports --filter and --group flags.",
    example: "eosim list --filter cortex-m4",
  },
  {
    cmd: "eosim search",
    desc: "Search platforms by MCU family, board name, or peripheral. Returns ranked results.",
    example: "eosim search stm32f4",
  },
  {
    cmd: "eosim run",
    desc: "Run a firmware binary on a virtual board. Supports ELF, HEX, and BIN formats.",
    example: "eosim run firmware.elf --board stm32f429",
  },
  {
    cmd: "eosim stats",
    desc: "Show real-time simulation statistics: cycle count, memory usage, peripheral state.",
    example: "eosim stats --board stm32f429",
  },
  {
    cmd: "eosim gui",
    desc: "Launch the graphical simulator with pin visualization, logic analyzer, and UART monitor.",
    example: "eosim gui --board esp32s3",
  },
  {
    cmd: "eosim hil",
    desc: "Hardware-in-the-loop bridge: connect a real board to the simulator for hybrid testing.",
    example: "eosim hil --port /dev/ttyUSB0",
  },
];

const platforms = [
  {
    family: "STM32",
    count: 18,
    color: "#F97316",
    boards: [
      "STM32F4 Discovery",
      "STM32H7 Nucleo",
      "STM32L4 Nucleo",
      "STM32WB Nucleo",
    ],
  },
  {
    family: "ESP32",
    count: 8,
    color: "#22D3EE",
    boards: [
      "ESP32-DevKitC",
      "ESP32-S3-DevKitC",
      "ESP32-C3-DevKitM",
      "ESP32-H2-DevKitM",
    ],
  },
  {
    family: "Raspberry Pi",
    count: 6,
    color: "#A855F7",
    boards: ["Pi Pico", "Pi Pico W", "Pi Pico 2", "Pi Zero 2W"],
  },
  {
    family: "Nordic",
    count: 7,
    color: "#34D399",
    boards: ["nRF52840 DK", "nRF5340 DK", "nRF9160 DK", "Thingy:91"],
  },
  {
    family: "NXP",
    count: 9,
    color: "#FBBF24",
    boards: ["MIMXRT1060-EVK", "LPC55S69-EVK", "FRDM-K64F", "i.MX RT1170"],
  },
  {
    family: "Other",
    count: 15,
    color: "#F472B6",
    boards: ["TI CC2652R", "Microchip SAME54", "GD32F450", "CH32V307"],
  },
];

export default function EoSimProductPage() {
  const [activeCmd, setActiveCmd] = useState(0);

  return (
    <div className="min-h-screen bg-[#0A0E1A] text-white">
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/5" />
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-medium mb-6">
              <Cpu className="w-4 h-4" /> EOSIM
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent">
              EoSim
            </h1>
            <p className="text-2xl text-gray-300 mb-2">
              The EmbeddedOS Hardware Simulator
            </p>
            <p className="text-gray-400 max-w-2xl mx-auto">
              63+ virtual boards, full peripheral simulation,
              hardware-in-the-loop bridge, and a CLI + GUI interface. Test your
              firmware without hardware.
            </p>
            <div className="flex flex-wrap gap-4 justify-center mt-8">
              <Link
                href="/demo"
                className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-semibold transition-colors"
              >
                <Play className="w-4 h-4" /> Try in Browser
              </Link>
              <Link
                href="/getting-started"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold border border-white/20 transition-colors"
              >
                Getting Started
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-2 text-center">
            CLI Reference
          </h2>
          <p className="text-gray-400 text-center mb-8">
            All EoSim commands with examples. Run{" "}
            <code className="text-cyan-400 bg-white/5 px-1 rounded">
              eosim --help
            </code>{" "}
            for the full reference.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-6">
            {commands.map((c, i) => (
              <button
                key={c.cmd}
                onClick={() => setActiveCmd(i)}
                className="text-left px-4 py-3 rounded-lg text-sm font-mono transition-all"
                style={
                  activeCmd === i
                    ? {
                        background: "rgba(34,211,238,0.1)",
                        color: "#22D3EE",
                        border: "1px solid rgba(34,211,238,0.3)",
                      }
                    : {
                        background: "rgba(255,255,255,0.05)",
                        color: "#9CA3AF",
                        border: "1px solid rgba(255,255,255,0.1)",
                      }
                }
              >
                {c.cmd}
              </button>
            ))}
          </div>
          <motion.div
            key={activeCmd}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0D1117] border border-white/10 rounded-xl p-6"
          >
            <p className="text-gray-300 mb-4">{commands[activeCmd].desc}</p>
            <div className="bg-black/50 rounded-lg p-4 font-mono text-sm">
              <span className="text-green-400">$ </span>
              <span className="text-white">{commands[activeCmd].example}</span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-2 text-center">
            63+ Supported Platforms
          </h2>
          <p className="text-gray-400 text-center mb-8">
            Full peripheral simulation including GPIO, UART, SPI, I²C, ADC, PWM,
            DMA, and interrupts.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {platforms.map((p, i) => (
              <motion.div
                key={p.family}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-xl p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-semibold">{p.family}</h3>
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-semibold"
                    style={{ background: p.color + "20", color: p.color }}
                  >
                    {p.count} boards
                  </span>
                </div>
                <div className="space-y-1">
                  {p.boards.map(b => (
                    <div key={b} className="flex items-center gap-2">
                      <CheckCircle2
                        className="w-3 h-3 flex-shrink-0"
                        style={{ color: p.color }}
                      />
                      <span className="text-gray-400 text-xs">{b}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
