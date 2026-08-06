import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  Wrench,
  ArrowRight,
  Play,
  Code,
  Cpu,
  Zap,
  GitBranch,
  Timer,
  Shield,
  Monitor,
  Package,
  CheckCircle2,
  ChevronRight,
  Copy,
  Star,
  Info,
  AlertCircle,
  Layers,
  HardDrive,
  Terminal,
  FileCode,
  Settings,
  BarChart3,
  Wifi,
  Brain,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      delay: i * 0.07,
      ease: [0.23, 1, 0.32, 1] as [number, number, number, number],
    },
  }),
};

// ─── COMMANDS ──────────────────────────────────────────────────────────────
const COMMANDS = [
  {
    group: "Project Management",
    color: "#F97316",
    cmds: [
      {
        cmd: "ebuild init <name>",
        flags: "--template rtos|bare|app  --target <board>  --bsp <path>",
        desc: "Create a new EoS project. Generates CMakeLists.txt, linker scripts, startup code, and ebuild.toml for the specified target board.",
        example: "ebuild init my-sensor --template rtos --target esp32",
      },
      {
        cmd: "ebuild clean",
        flags: "--all",
        desc: "Remove all build artifacts. --all also removes the CMake cache.",
        example: "ebuild clean --all",
      },
      {
        cmd: "ebuild info",
        flags: "",
        desc: "Print project metadata: target board, EoS version, enabled features, memory layout.",
        example: "ebuild info",
      },
    ],
  },
  {
    group: "Build",
    color: "#22D3EE",
    cmds: [
      {
        cmd: "ebuild build",
        flags: "--jobs N  --release  --debug  --size",
        desc: "Compile and link the firmware. Produces firmware.elf, firmware.bin, and firmware.map. --size prints a detailed memory usage report.",
        example: "ebuild build --jobs 8 --size",
      },
      {
        cmd: "ebuild build --target <board>",
        flags: "--bsp <path>  --features wifi,bt",
        desc: "Cross-compile for a different board without changing ebuild.toml. Useful for CI/CD pipelines that build for multiple targets.",
        example: "ebuild build --target stm32h7 --features wifi",
      },
    ],
  },
  {
    group: "Simulation",
    color: "#A78BFA",
    cmds: [
      {
        cmd: "ebuild sim",
        flags: "--platform <board>  --gui  --gdb  --bsp <path>",
        desc: "Launch EoSim with the compiled firmware. --gui opens the graphical pin visualizer. --gdb starts a GDB stub on port 3333.",
        example: "ebuild sim --platform esp32 --gui",
      },
      {
        cmd: "ebuild eflow open",
        flags: "--port 8090",
        desc: "Launch the eFlow visual block editor in your browser. Automatically loads the current project's BSP for auto-populated pin names.",
        example: "ebuild eflow open --port 8090",
      },
    ],
  },
  {
    group: "Flash & Monitor",
    color: "#34D399",
    cmds: [
      {
        cmd: "ebuild flash",
        flags:
          "--port /dev/ttyUSB0  --interface jlink|stlink|cmsis-dap  --verify  --offset 0x8000000",
        desc: "Write firmware to the target device. Auto-detects the programmer. --verify reads back and confirms the flash contents.",
        example: "ebuild flash --interface stlink --verify",
      },
      {
        cmd: "ebuild monitor",
        flags: "--baud N  --port <port>  --timestamp  --filter <regex>",
        desc: "Open a serial monitor. --filter shows only lines matching a regex. --timestamp prepends UTC timestamps to each line.",
        example: "ebuild monitor --baud 115200 --filter '\\[app\\]'",
      },
      {
        cmd: "ebuild ota push",
        flags: "--url <device-ip>  --key <signing-key>",
        desc: "Push a signed OTA update to a device running eBoot. The device verifies the signature before applying the update.",
        example: "ebuild ota push --url 192.168.1.42 --key keys/ota.pem",
      },
    ],
  },
  {
    group: "CAD Analysis",
    color: "#F59E0B",
    cmds: [
      {
        cmd: "ebuild cad analyze <schematic>",
        flags: "--format kicad|altium  --output report.json",
        desc: "Parse a KiCad or Altium schematic. Identifies the MCU, maps all peripheral pins, checks power rails, and produces an EoS compatibility report.",
        example: "ebuild cad analyze my-board.kicad_sch --output report.json",
      },
      {
        cmd: "ebuild cad generate <schematic>",
        flags: "--output bsp/  --name <board-name>",
        desc: "Generate a complete Board Support Package from a schematic: pins.h, clocks.c, peripherals.c, linker.ld, and ebuild.toml.",
        example:
          "ebuild cad generate my-board.kicad_sch --output bsp/ --name my-board",
      },
      {
        cmd: "ebuild cad diff <old> <new>",
        flags: "",
        desc: "Compare two schematic versions and show what changed: new pins, removed peripherals, power rail changes.",
        example: "ebuild cad diff v1.kicad_sch v2.kicad_sch",
      },
    ],
  },
  {
    group: "Analysis & Quality",
    color: "#F472B6",
    cmds: [
      {
        cmd: "ebuild analyze",
        flags: "--stack  --misra  --memory  --all",
        desc: "Run the full static analysis suite. Reports stack depth per task, MISRA C:2012 violations, memory overlap, and uninitialized variable usage.",
        example: "ebuild analyze --all",
      },
      {
        cmd: "ebuild size",
        flags: "--sections  --symbols  --json",
        desc: "Detailed firmware size report: .text, .data, .bss per file and per symbol. --json outputs machine-readable data for CI dashboards.",
        example: "ebuild size --symbols",
      },
      {
        cmd: "ebuild test",
        flags: "--coverage  --filter <pattern>",
        desc: "Run the EoS unit test suite on the host machine (no hardware needed). --coverage generates an HTML coverage report.",
        example: "ebuild test --coverage",
      },
    ],
  },
];

// ─── WORKFLOW STEPS ────────────────────────────────────────────────────────
const WORKFLOW = [
  {
    phase: "Design",
    color: "#F97316",
    steps: [
      {
        title: "Design your schematic in KiCad",
        desc: "Place your MCU, sensors, power regulators, and connectors. Assign net names that match EoS HAL conventions (UART_TX, SPI_CLK, etc.).",
      },
      {
        title: "Run CAD analysis",
        desc: "ebuild cad analyze my-board.kicad_sch — ebuild identifies the MCU, maps all peripheral pins, and checks EoS compatibility.",
        code: "ebuild cad analyze my-board.kicad_sch\n# [CAD] MCU: STM32H743ZIT6\n# [CAD] 14 peripherals mapped\n# [CAD] EoS compatibility: FULL",
      },
      {
        title: "Generate the BSP",
        desc: "ebuild cad generate produces pins.h, clocks.c, peripherals.c, and linker.ld — all derived from your schematic.",
        code: "ebuild cad generate my-board.kicad_sch --output bsp/ --name my-board",
      },
    ],
  },
  {
    phase: "Develop",
    color: "#A78BFA",
    steps: [
      {
        title: "Create the project",
        desc: "ebuild init creates a complete project pre-configured for your BSP. All pin names match your schematic labels.",
        code: "ebuild init my-firmware --template rtos --bsp bsp/my-board\ncd my-firmware",
      },
      {
        title: "Write firmware (or use eFlow)",
        desc: "Write C code using the EoS HAL, or use ebuild eflow open to design visually. eFlow auto-populates pin names from your BSP.",
        code: "// All pin names come from bsp/my-board/pins.h\neos_uart_init(UART_DEBUG, 115200);\neos_i2c_init(I2C_SENSORS, 400000);",
      },
      {
        title: "Build",
        desc: "ebuild build compiles your code. The bundled ARM GCC toolchain means no separate toolchain install.",
        code: "ebuild build --jobs 8 --size\n# .text: 44,128 bytes / 2,097,152 (2.1%)\n# .data:  1,024 bytes / 1,048,576 (0.1%)\n# Build complete in 3.2s",
      },
    ],
  },
  {
    phase: "Simulate",
    color: "#22D3EE",
    steps: [
      {
        title: "Simulate with your BSP",
        desc: "ebuild sim --bsp bsp/my-board launches EoSim with virtual peripherals that match your real schematic.",
        code: "ebuild sim --bsp bsp/my-board --gui\n# [EoSim] BME280 (I2C1 0x76): temp=23.4°C\n# [EoSim] W25Q128 (SPI2): 16MB NOR flash",
      },
      {
        title: "Inject virtual sensor data",
        desc: "Simulate different environmental conditions without physical hardware.",
        code: "# In another terminal while simulation runs:\neosim inject --peripheral bme280 --temp 85.0\n# [app] ALERT: Temperature critical: 85.0°C",
      },
      {
        title: "Debug with GDB",
        desc: "ebuild sim --gdb exposes a GDB stub. Connect any GDB client to set breakpoints and inspect memory.",
        code: "ebuild sim --gdb\n# GDB server on :3333\n\n# In another terminal:\narm-none-eabi-gdb build/firmware.elf\n(gdb) target remote :3333\n(gdb) break sensor_task",
      },
    ],
  },
  {
    phase: "Validate",
    color: "#34D399",
    steps: [
      {
        title: "Run static analysis",
        desc: "ebuild analyze checks stack depth, MISRA compliance, memory overlap, and uninitialized variables.",
        code: "ebuild analyze --all\n# Stack: all tasks within limits OK\n# MISRA: 0 required violations OK\n# Memory: no overlaps OK\n# Overall: PASS",
      },
      {
        title: "Run unit tests",
        desc: "ebuild test runs the EoS test suite on your host machine — no hardware needed for unit tests.",
        code: "ebuild test --coverage\n# Running 47 tests...\n# 47 passed, 0 failed\n# Coverage: 87.3% (report: build/coverage/index.html)",
      },
      {
        title: "Check firmware size",
        desc: "ebuild size --symbols shows per-symbol memory usage. Identify which functions are consuming the most flash.",
        code: "ebuild size --symbols | head -10\n# led_task:       1,024 bytes (.text)\n# sensor_task:    2,048 bytes (.text)\n# bme280_driver:  4,096 bytes (.text)",
      },
    ],
  },
  {
    phase: "Deploy",
    color: "#F59E0B",
    steps: [
      {
        title: "Flash to hardware",
        desc: "When your PCB arrives, flash the same firmware you already tested in simulation. ebuild auto-detects the programmer.",
        code: "ebuild flash --interface jlink --verify\n# [ebuild] J-Link v10.1 detected\n# [ebuild] Writing 180,224 bytes... OK\n# [ebuild] Verify: OK",
      },
      {
        title: "Monitor live output",
        desc: "ebuild monitor connects to the UART console. Use --filter to show only relevant log lines.",
        code: "ebuild monitor --baud 115200 --filter '\\[app\\]'\n# [app] EmbeddedOS v2.5.0 starting...\n# [app] BME280 init OK\n# [app] Temp: 22.8°C",
      },
      {
        title: "OTA updates",
        desc: "Once deployed, push firmware updates over Wi-Fi using eBoot's OTA pipeline. No physical access needed.",
        code: "ebuild ota push --url 192.168.1.42 --key keys/ota.pem\n# [OTA] Connecting to device...\n# [OTA] Uploading firmware (180KB)...\n# [OTA] Device verifying signature...\n# [OTA] Update applied. Device rebooting.",
      },
    ],
  },
];

// ─── EBUILD.TOML REFERENCE ─────────────────────────────────────────────────
const TOML_EXAMPLE = `[project]
name = "my-sensor-node"
version = "1.0.0"
eos_version = "2.5.0"

[target]
board = "stm32h743"
cpu = "cortex-m7"
fpu = "fpv5-d16"
clock_hz = 480_000_000

[memory]
flash_size = "2MB"
ram_size   = "1MB"
flash_origin = "0x08000000"
ram_origin   = "0x20000000"

[features]
rtos     = true
wifi     = false
bluetooth = false
eai      = false
eboot    = true

[dependencies]
bme280 = "1.2.0"
w25q   = "0.9.1"

[build]
optimization = "Os"   # Os = size, O2 = speed, Og = debug
lto = true
stack_size = 4096

[analysis]
misra = "advisory"    # required | advisory | off
stack_check = true
coverage = false`;

export default function EBuildPage() {
  const [activeGroup, setActiveGroup] = useState(0);
  const [activePhase, setActivePhase] = useState(0);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#080F1E]">
      {/* Hero */}
      <section className="relative py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628] to-[#080F1E]" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-[#F97316]/6 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#22D3EE]/4 rounded-full blur-[80px]" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
          >
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6"
              style={{
                background: "rgba(249,115,22,0.12)",
                border: "1px solid rgba(249,115,22,0.3)",
                color: "#F97316",
              }}
            >
              <Wrench size={12} /> ebuild — Developer Workflow
            </span>
          </motion.div>
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="font-heading font-black text-5xl sm:text-7xl text-white mb-6 leading-[1.02]"
          >
            One Tool for the
            <br />
            <span style={{ color: "#F97316" }}>Entire EoS Lifecycle</span>
          </motion.h1>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="text-white/60 text-xl max-w-2xl mx-auto mb-8 leading-relaxed"
          >
            ebuild is the EmbeddedOS build tool. It handles everything from
            project creation to CAD analysis, simulation, static analysis,
            flashing, and OTA updates — with a single CLI and zero configuration
            files to maintain manually.
          </motion.p>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link
              href="/getting-started"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white transition-all active:scale-95"
              style={{
                background: "#F97316",
                boxShadow: "0 0 24px rgba(249,115,22,0.3)",
              }}
            >
              <Play size={16} /> Get Started
            </Link>
            <Link
              href="/eflow"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white/80 transition-all border border-white/15 hover:border-white/30"
            >
              eFlow Visual Editor <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Install */}
      <section className="pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="rounded-2xl border border-white/8 overflow-hidden"
            style={{ background: "rgba(249,115,22,0.04)" }}
          >
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#F85149]/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#F0883E]/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#3FB950]/50" />
              </div>
              <span className="text-xs text-white/30">Terminal</span>
              <button
                onClick={() => copyCode("pip install embeddedos-ebuild")}
                className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors"
              >
                {copiedCode === "pip install embeddedos-ebuild" ? (
                  <CheckCircle2 size={12} className="text-[#34D399]" />
                ) : (
                  <Copy size={12} />
                )}
                Copy
              </button>
            </div>
            <pre className="p-5 text-sm font-mono text-[#E6EDF3]">
              <span className="text-white/40">$ </span>pip install
              embeddedos-ebuild{"\n"}
              <span className="text-white/40">$ </span>ebuild --version{"\n"}
              <span style={{ color: "#34D399" }}>
                ebuild v2.1.0 (EmbeddedOS Build Tool)
              </span>
              {"\n"}
              <span className="text-white/40">$ </span>ebuild platforms list |
              wc -l{"\n"}
              <span style={{ color: "#34D399" }}>63</span>
            </pre>
          </motion.div>
          <div className="grid grid-cols-3 gap-3 mt-4">
            {[
              {
                label: "63+ boards",
                sub: "supported targets",
                color: "#F97316",
              },
              {
                label: "Zero config",
                sub: "toolchain bundled",
                color: "#22D3EE",
              },
              {
                label: "One command",
                sub: "build → flash → monitor",
                color: "#34D399",
              },
            ].map(item => (
              <div
                key={item.label}
                className="rounded-xl border p-3 text-center"
                style={{
                  background: `${item.color}08`,
                  borderColor: `${item.color}20`,
                }}
              >
                <div
                  className="font-heading font-black text-lg"
                  style={{ color: item.color }}
                >
                  {item.label}
                </div>
                <div className="text-xs text-white/40">{item.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Full Workflow */}
      <section className="pb-20 bg-[#060C1A]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-16">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="font-heading font-black text-3xl sm:text-4xl text-white mb-4">
              The Complete Developer Workflow
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              From KiCad schematic to OTA-updated production firmware — every
              step handled by ebuild.
            </p>
          </motion.div>

          {/* Phase tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {WORKFLOW.map((phase, i) => (
              <button
                key={phase.phase}
                onClick={() => setActivePhase(i)}
                className="px-4 py-2 rounded-xl text-sm font-bold transition-all"
                style={
                  activePhase === i
                    ? { background: phase.color, color: "#000" }
                    : {
                        background: `${phase.color}12`,
                        color: phase.color,
                        border: `1px solid ${phase.color}25`,
                      }
                }
              >
                {phase.phase}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activePhase}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <div className="space-y-4">
                {WORKFLOW[activePhase].steps.map((step, i) => (
                  <div
                    key={step.title}
                    className="rounded-2xl border border-white/8 overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.02)" }}
                  >
                    <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black text-white shrink-0"
                        style={{
                          background: `${WORKFLOW[activePhase].color}25`,
                          border: `1px solid ${WORKFLOW[activePhase].color}40`,
                        }}
                      >
                        {i + 1}
                      </div>
                      <h3 className="font-heading font-bold text-white">
                        {step.title}
                      </h3>
                    </div>
                    <div className="px-5 py-4 space-y-3">
                      <p className="text-sm text-white/60 leading-relaxed">
                        {step.desc}
                      </p>
                      {step.code && (
                        <div
                          className="relative rounded-xl overflow-hidden border border-white/8"
                          style={{ background: "rgba(5,10,20,0.9)" }}
                        >
                          <div className="flex items-center justify-between px-4 py-2 border-b border-white/5">
                            <div className="flex gap-1.5">
                              <div className="w-2.5 h-2.5 rounded-full bg-[#F85149]/50" />
                              <div className="w-2.5 h-2.5 rounded-full bg-[#F0883E]/50" />
                              <div className="w-2.5 h-2.5 rounded-full bg-[#3FB950]/50" />
                            </div>
                            <button
                              onClick={() => copyCode(step.code!)}
                              className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors"
                            >
                              {copiedCode === step.code ? (
                                <CheckCircle2
                                  size={12}
                                  className="text-[#34D399]"
                                />
                              ) : (
                                <Copy size={12} />
                              )}
                              {copiedCode === step.code ? "Copied!" : "Copy"}
                            </button>
                          </div>
                          <pre className="p-4 text-xs overflow-x-auto font-mono leading-relaxed">
                            <code style={{ color: "#E6EDF3" }}>
                              {step.code}
                            </code>
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Command Reference */}
      <section className="pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-16">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="font-heading font-black text-3xl sm:text-4xl text-white mb-4">
              Command Reference
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              Every ebuild command with flags, descriptions, and examples.
            </p>
          </motion.div>

          <div className="flex flex-wrap gap-2 mb-6">
            {COMMANDS.map((group, i) => (
              <button
                key={group.group}
                onClick={() => setActiveGroup(i)}
                className="px-4 py-2 rounded-xl text-sm font-bold transition-all"
                style={
                  activeGroup === i
                    ? { background: group.color, color: "#000" }
                    : {
                        background: `${group.color}12`,
                        color: group.color,
                        border: `1px solid ${group.color}25`,
                      }
                }
              >
                {group.group}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeGroup}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <div className="space-y-4">
                {COMMANDS[activeGroup].cmds.map(cmd => (
                  <div
                    key={cmd.cmd}
                    className="rounded-2xl border border-white/8 p-5"
                    style={{ background: `${COMMANDS[activeGroup].color}04` }}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <code
                          className="font-mono font-bold text-sm"
                          style={{ color: COMMANDS[activeGroup].color }}
                        >
                          {cmd.cmd}
                        </code>
                        {cmd.flags && (
                          <div className="text-xs text-white/35 font-mono mt-1">
                            {cmd.flags}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => copyCode(cmd.example)}
                        className="flex items-center gap-1 text-[10px] text-white/30 hover:text-white/60 transition-colors shrink-0"
                      >
                        {copiedCode === cmd.example ? (
                          <CheckCircle2 size={10} className="text-[#34D399]" />
                        ) : (
                          <Copy size={10} />
                        )}
                        Copy example
                      </button>
                    </div>
                    <p className="text-sm text-white/55 mb-3 leading-relaxed">
                      {cmd.desc}
                    </p>
                    <pre
                      className="rounded-lg p-3 text-xs font-mono overflow-x-auto"
                      style={{
                        background: "rgba(5,10,20,0.8)",
                        color: "#E6EDF3",
                      }}
                    >
                      <span className="text-white/30">$ </span>
                      {cmd.example}
                    </pre>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ebuild.toml Reference */}
      <section className="pb-20 bg-[#060C1A]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-16">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="font-heading font-black text-3xl sm:text-4xl text-white mb-4">
              ebuild.toml Reference
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              The project configuration file. Every field is optional — ebuild
              uses sensible defaults for everything not specified.
            </p>
          </motion.div>
          <div className="rounded-2xl border border-white/8 overflow-hidden">
            <div
              className="flex items-center justify-between px-5 py-3 border-b border-white/5"
              style={{ background: "rgba(249,115,22,0.05)" }}
            >
              <div className="flex items-center gap-2">
                <FileCode size={14} className="text-[#F97316]" />
                <span className="text-xs font-bold text-white/50">
                  ebuild.toml
                </span>
              </div>
              <button
                onClick={() => copyCode(TOML_EXAMPLE)}
                className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors"
              >
                {copiedCode === TOML_EXAMPLE ? (
                  <CheckCircle2 size={12} className="text-[#34D399]" />
                ) : (
                  <Copy size={12} />
                )}
                {copiedCode === TOML_EXAMPLE ? "Copied!" : "Copy all"}
              </button>
            </div>
            <pre
              className="p-5 text-xs sm:text-sm font-mono leading-relaxed overflow-x-auto"
              style={{ background: "rgba(5,10,20,0.95)", color: "#E6EDF3" }}
            >
              {TOML_EXAMPLE}
            </pre>
          </div>
        </div>
      </section>

      {/* CAD Workflow Detail */}
      <section className="pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-16">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="font-heading font-black text-3xl sm:text-4xl text-white mb-4">
              CAD → Firmware Pipeline
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              The complete flow from KiCad schematic to simulated, validated,
              and deployed firmware — without touching a soldering iron until
              the very end.
            </p>
          </motion.div>

          {/* Visual flow */}
          <div className="overflow-x-auto pb-4">
            <div className="flex items-center gap-2 min-w-max mx-auto w-fit mb-8">
              {[
                {
                  label: "KiCad Schematic",
                  sub: ".kicad_sch",
                  color: "#F97316",
                },
                {
                  label: "ebuild cad analyze",
                  sub: "MCU + pin map",
                  color: "#F59E0B",
                },
                {
                  label: "ebuild cad generate",
                  sub: "BSP files",
                  color: "#A78BFA",
                },
                {
                  label: "ebuild init",
                  sub: "project scaffold",
                  color: "#22D3EE",
                },
                {
                  label: "ebuild build",
                  sub: "firmware.elf",
                  color: "#34D399",
                },
                { label: "ebuild sim", sub: "virtual board", color: "#60A5FA" },
                {
                  label: "ebuild analyze",
                  sub: "static analysis",
                  color: "#F472B6",
                },
                {
                  label: "ebuild flash",
                  sub: "real hardware",
                  color: "#F97316",
                },
              ].map((node, i, arr) => (
                <div key={node.label} className="flex items-center gap-2">
                  <div
                    className="rounded-xl border px-3 py-2.5 text-center min-w-[90px]"
                    style={{
                      background: `${node.color}12`,
                      borderColor: `${node.color}30`,
                    }}
                  >
                    <div className="text-[10px] font-bold text-white leading-tight">
                      {node.label}
                    </div>
                    <div
                      className="text-[9px] mt-0.5"
                      style={{ color: node.color }}
                    >
                      {node.sub}
                    </div>
                  </div>
                  {i < arr.length - 1 && (
                    <div className="flex items-center gap-0.5">
                      <div className="w-4 h-0.5 bg-white/15" />
                      <ArrowRight size={9} className="text-white/25" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div
            className="flex items-start gap-3 p-4 rounded-xl"
            style={{
              background: "rgba(249,115,22,0.06)",
              border: "1px solid rgba(249,115,22,0.2)",
            }}
          >
            <Star size={14} className="text-[#F97316] mt-0.5 shrink-0" />
            <div className="text-sm text-white/60 leading-relaxed">
              <strong className="text-[#F97316]">Key insight:</strong> Because
              you simulate with the same BSP that was generated from your
              schematic, the firmware that passes simulation will work on real
              hardware on the first flash — no "it works in sim but not on
              hardware" surprises. The virtual BME280 on I²C1 address 0x76
              behaves identically to the real chip.
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24 pt-4 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="font-heading font-black text-3xl text-white mb-4">
              Start Building
            </h2>
            <p className="text-white/50 mb-8">
              Install ebuild and create your first EoS project in under 5
              minutes.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/getting-started"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white transition-all active:scale-95"
                style={{
                  background: "#F97316",
                  boxShadow: "0 0 20px rgba(249,115,22,0.25)",
                }}
              >
                <Play size={16} /> Getting Started Guide
              </Link>
              <Link
                href="/eflow"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white/70 border border-white/15 hover:border-white/30 transition-all"
              >
                Try eFlow Visual Editor <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
