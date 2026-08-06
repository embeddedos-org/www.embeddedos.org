import { motion } from "framer-motion";
import { Link } from "wouter";
import { Zap, ArrowRight, Cpu, Code, CheckCircle, Layers } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.06, ease: "easeOut" as const },
  }),
};

const BUILD_STEPS = [
  {
    step: "01",
    title: "Hardware Design",
    desc: "Define your target hardware: MCU, peripherals, memory map, and pin assignments using the visual board designer.",
  },
  {
    step: "02",
    title: "Driver Configuration",
    desc: "Select and configure drivers from the library: GPIO, UART, SPI, I2C, CAN, USB, and custom peripherals.",
  },
  {
    step: "03",
    title: "RTOS Setup",
    desc: "Configure the EOS Kernel: task priorities, stack sizes, scheduling policy, and inter-task communication channels.",
  },
  {
    step: "04",
    title: "Application Logic",
    desc: "Build your application logic using eFlow's visual block editor — no assembly required for common patterns.",
  },
  {
    step: "05",
    title: "Build & Validate",
    desc: "ebuild compiles, links, and runs static analysis. EoSim validates the firmware against your hardware model.",
  },
  {
    step: "06",
    title: "Simulate",
    desc: "Run full hardware simulation with EoSim: GPIO toggling, UART output, memory inspection, and CPU profiling.",
  },
  {
    step: "07",
    title: "Deploy",
    desc: "Flash to real hardware via JTAG, SWD, or USB bootloader. Monitor with ebuild's integrated serial console.",
  },
  {
    step: "08",
    title: "Monitor & Update",
    desc: "Use the eBoot OTA system for wireless updates. Monitor device health with the built-in telemetry stack.",
  },
];

const ARCH_LAYERS = [
  {
    name: "eApps / EAI / ENI",
    desc: "Application layer: 60+ apps, AI inference, network services",
    color: "#F97316",
  },
  {
    name: "EIPC",
    desc: "Inter-process communication: typed channels, message queues",
    color: "#22D3EE",
  },
  {
    name: "EoS / eBoot",
    desc: "Core OS: real-time kernel, secure bootloader, hardware abstraction",
    color: "#A78BFA",
  },
  {
    name: "Hardware",
    desc: "Target hardware: MCU, SBC, automotive ECU, x86 system",
    color: "#34D399",
  },
];

const CI_GATES = [
  {
    name: "Static Analysis",
    desc: "MISRA-C, CERT-C, and custom rule sets",
    icon: Code,
  },
  {
    name: "Unit Tests",
    desc: "Hardware-in-the-loop and simulation-based testing",
    icon: CheckCircle,
  },
  {
    name: "Integration Tests",
    desc: "Full system simulation with EoSim",
    icon: Layers,
  },
  {
    name: "Deploy",
    desc: "Automated OTA deployment with rollback support",
    icon: Zap,
  },
];

const HARDWARE_TARGETS = [
  {
    category: "MCU",
    examples: [
      "STM32F4/H7",
      "ESP32/S3",
      "Nordic nRF52",
      "NXP LPC/i.MX RT",
      "TI MSP430/CC32xx",
    ],
  },
  {
    category: "SBC",
    examples: [
      "Raspberry Pi 4/5",
      "BeagleBone Black",
      "NVIDIA Jetson",
      "Rockchip RK3588",
      "Allwinner H616",
    ],
  },
  {
    category: "Automotive",
    examples: [
      "NXP S32K",
      "Infineon AURIX",
      "Renesas RH850",
      "TI TDA4VM",
      "Qualcomm SA8155P",
    ],
  },
  {
    category: "x86 / x64",
    examples: [
      "Intel NUC",
      "AMD Ryzen Embedded",
      "VIA Eden",
      "Kontron COM Express",
      "Advantech",
    ],
  },
  {
    category: "Simulator",
    examples: [
      "EoSim STM32",
      "EoSim ESP32",
      "EoSim RPi4",
      "EoSim RISC-V",
      "EoSim Custom",
    ],
  },
];

export default function Flow() {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="section-padding bg-grid">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            <div className="badge-amber mb-4 inline-flex">
              <Zap size={12} />
              eFlow Visual Programming
            </div>
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-white mb-4">
              Build Embedded Systems{" "}
              <span className="text-gradient">Visually</span>
            </h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto mb-8">
              eFlow is EmbeddedOS's visual programming environment — drag,
              connect, and deploy firmware to 52+ hardware targets without
              writing a single line of boilerplate.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/getting-started"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#F97316] hover:bg-[#EA580C] text-white font-bold rounded-xl transition-all active:scale-95"
              >
                Try eFlow
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/docs"
                className="inline-flex items-center gap-2 px-6 py-3 glass hover:bg-white/10 text-white font-semibold rounded-xl transition-all border border-white/10"
              >
                Documentation
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Build Timeline */}
      <section className="section-padding bg-[#080F1E]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-10 text-center"
          >
            <h2 className="font-heading font-bold text-white text-3xl mb-2">
              From Idea to Deployed Firmware
            </h2>
            <p className="text-white/50">
              The complete 8-step eFlow build and deploy pipeline.
            </p>
          </motion.div>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-[#F97316] via-[#22D3EE] to-[#34D399] hidden sm:block" />
            <div className="space-y-6">
              {BUILD_STEPS.map((step, i) => (
                <motion.div
                  key={step.step}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  className="sm:pl-16 relative"
                >
                  <div className="absolute left-0 top-3 w-12 h-12 rounded-full bg-[#0B1D3A] border-2 border-[#F97316]/50 flex items-center justify-center text-xs font-bold text-[#F97316] hidden sm:flex">
                    {step.step}
                  </div>
                  <div className="glass rounded-xl p-4 border border-white/5">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="sm:hidden text-xs font-bold text-[#F97316]">
                        Step {step.step}
                      </span>
                      <h3 className="font-heading font-bold text-white">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-sm text-white/50">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Runtime Architecture */}
      <section className="section-padding">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-8 text-center"
          >
            <h2 className="font-heading font-bold text-white text-3xl mb-2">
              Runtime Architecture
            </h2>
            <p className="text-white/50">
              The layered architecture that powers every EmbeddedOS deployment.
            </p>
          </motion.div>
          <div className="space-y-3">
            {ARCH_LAYERS.map((layer, i) => (
              <motion.div
                key={layer.name}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="glass rounded-xl p-4 border border-white/5 flex items-center gap-4"
                style={{ borderLeftColor: layer.color, borderLeftWidth: 3 }}
              >
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: layer.color }}
                />
                <div>
                  <div className="font-semibold text-white text-sm">
                    {layer.name}
                  </div>
                  <div className="text-xs text-white/50">{layer.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CI/CD Pipeline */}
      <section className="section-padding bg-[#080F1E]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-8 text-center"
          >
            <h2 className="font-heading font-bold text-white text-3xl mb-2">
              CI/CD Pipeline
            </h2>
            <p className="text-white/50">
              Four quality gates ensure every build is production-ready.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CI_GATES.map((gate, i) => {
              const Icon = gate.icon;
              return (
                <motion.div
                  key={gate.name}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  className="glass rounded-xl p-4 border border-white/5 text-center"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#F97316]/15 border border-[#F97316]/30 flex items-center justify-center mx-auto mb-3">
                    <Icon size={20} className="text-[#F97316]" />
                  </div>
                  <div className="font-semibold text-white text-sm mb-1">
                    {gate.name}
                  </div>
                  <div className="text-xs text-white/50">{gate.desc}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Hardware Targets */}
      <section className="section-padding">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="font-heading font-bold text-white text-3xl mb-2 text-center">
              52+ Hardware Targets
            </h2>
            <p className="text-white/50 text-center">
              14 CPU architectures supported across 5 hardware categories.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {HARDWARE_TARGETS.map((cat, i) => (
              <motion.div
                key={cat.category}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="glass rounded-xl p-4 border border-white/5"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Cpu size={16} className="text-[#F97316]" />
                  <h3 className="font-semibold text-white text-sm">
                    {cat.category}
                  </h3>
                </div>
                <ul className="space-y-1">
                  {cat.examples.map(ex => (
                    <li
                      key={ex}
                      className="text-xs text-white/50 flex items-center gap-1.5"
                    >
                      <span className="w-1 h-1 rounded-full bg-[#F97316]/50 shrink-0" />
                      {ex}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
