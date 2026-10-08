import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { copyText } from "@/lib/clipboard";
import { moveTabFocus } from "@/lib/tablist";
import { SIM_PLATFORM_COUNT } from "@/data/stack";
import {
  Terminal,
  Cpu,
  Package,
  PenTool,
  ArrowRight,
  CheckCircle2,
  Copy,
  ChevronRight,
  Monitor,
  Wifi,
  Brain,
  HardDrive,
  Code,
  Layers,
  Play,
  Shield,
  Wrench,
  Info,
  AlertCircle,
  Star,
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

const ECOSYSTEM = [
  {
    id: "ebuild",
    name: "ebuild",
    role: "Build Tool",
    desc: "Creates, builds and simulates EoS projects, analyzes KiCad schematics, and drives flash tools.",
    color: "#F97316",
    icon: Wrench,
  },
  {
    id: "eosim",
    name: "EoSim",
    role: "Simulator",
    desc: `Registry of ${SIM_PLATFORM_COUNT} platform descriptors and simulation engines. Cortex-M apps run on QEMU through ebuild sim.`,
    color: "#22D3EE",
    icon: Monitor,
  },
  {
    id: "eos",
    name: "EoS Kernel",
    role: "RTOS Kernel",
    desc: "The real-time OS kernel. Provides HAL, scheduler, IPC, drivers, and POSIX subset.",
    color: "#F97316",
    icon: Cpu,
  },
  {
    id: "eboot",
    name: "eBoot",
    role: "Bootloader",
    desc: "Secure bootloader with verified boot, OTA A/B updates, and hardware root of trust.",
    color: "#F59E0B",
    icon: Shield,
  },
  {
    id: "eflow",
    name: "eFlow",
    role: "Visual Programming",
    desc: "Drag-and-drop block editor that generates production C code. No assembly needed for common patterns.",
    color: "#A78BFA",
    icon: Layers,
  },
  {
    id: "eai",
    name: "EAI / ENI",
    role: "Edge AI",
    desc: "On-device TFLite/ONNX inference and neural interface adapter for BCI devices.",
    color: "#34D399",
    icon: Brain,
  },
  {
    id: "eapps",
    name: "eApps",
    role: "App Ecosystem",
    desc: "60+ apps including eOffice Suite, eBrowser, eDB, and eBot AI assistant.",
    color: "#60A5FA",
    icon: Package,
  },
  {
    id: "eostudio",
    name: "EoStudio",
    role: "IDE",
    desc: "Universal IDE with AI tutor, 3D modeler, game editor, and UI designer.",
    color: "#F472B6",
    icon: Code,
  },
];

type Path = "nosim" | "sim" | "stm32" | "esp32" | "apps" | "hardware-design";

const PATHS: {
  id: Path;
  icon: typeof Terminal;
  label: string;
  sublabel: string;
  color: string;
  badge?: string;
}[] = [
  {
    id: "nosim",
    icon: Play,
    label: "Just Looking",
    sublabel: "Illustrative browser demo",
    color: "#34D399",
  },
  {
    id: "sim",
    icon: Monitor,
    label: "Simulator on My Computer",
    sublabel: "ebuild sim on QEMU — verified",
    color: "#22D3EE",
    badge: "Start here",
  },
  {
    id: "esp32",
    icon: Wifi,
    label: "I Have an ESP32",
    sublabel: "Status: not ready yet",
    color: "#F97316",
  },
  {
    id: "stm32",
    icon: Cpu,
    label: "I Have an STM32",
    sublabel: "Simulate now; images next",
    color: "#22D3EE",
  },
  {
    id: "apps",
    icon: Package,
    label: "I Want to Build eApps",
    sublabel: "C + LVGL cross-platform apps",
    color: "#F59E0B",
  },
  {
    id: "hardware-design",
    icon: PenTool,
    label: "I'm a Hardware Engineer",
    sublabel: "KiCad → analyze → simulate → validate",
    color: "#A78BFA",
  },
];

interface Step {
  title: string;
  text?: string;
  code?: string;
  tip?: string;
  warn?: string;
  substeps?: string[];
}

interface PathContent {
  title: string;
  color: string;
  intro: string;
  prereq: string;
  time: string;
  steps: Step[];
  nextSteps: { label: string; href: string }[];
}

const PATH_CONTENT: Record<Path, PathContent> = {
  nosim: {
    title: "See an EoS Program in Your Browser",
    color: "#34D399",
    intro:
      'The /demo page is an interactive, illustrative visualisation of what a small EoS program does: GPIO pins toggle and a console prints. It runs in JavaScript in your browser. It does not compile or execute EoS. To run the real EoS kernel with no hardware, use the "Simulator on My Computer" path, which runs it under QEMU.',
    prereq: "A modern browser. Nothing to install.",
    time: "~2 minutes",
    steps: [
      {
        title: "Open the Demo",
        text: "Go to /demo. Pick a board and one of the example programs, then press Run.",
        substeps: [
          "The board view and console are animated by the page itself",
          "Use it to see the shape of an EoS program: tasks, delays, GPIO, UART output",
        ],
        warn: "This is a visualisation, not an emulator. Nothing you see on /demo has been compiled or executed.",
      },
      {
        title: "Run the Real Thing",
        text: 'To boot the actual EoS kernel and your own code without hardware, follow "Simulator on My Computer". It takes about 10 minutes on Linux or WSL2.',
        code: `ebuild init my-blink --template rtos --target stm32f4\ncd my-blink && ebuild sim`,
      },
    ],
    nextSteps: [
      { label: "Open the demo", href: "/demo" },
      { label: "Read the EoS Kernel docs", href: "/eos" },
    ],
  },
  sim: {
    title: "Run EoS on a Simulated Board (QEMU)",
    color: "#22D3EE",
    intro:
      "ebuild creates an EoS project and `ebuild sim` builds it with the EoS kernel for QEMU's Arm Cortex-M3 machine, then boots it and shows the program's output. Every command and output on this page was run on Ubuntu 20.04 (WSL2) with Python 3.12, arm-none-eabi-gcc 9.2.1 and QEMU 4.2.1.",
    prereq:
      "Linux or WSL2 (verified: Ubuntu 20.04). Python 3.10+, Git, the Arm GNU toolchain and QEMU. Ubuntu 20.04's own python3 is 3.8, which is too old, so step 2 fetches a current Python without root. macOS should work with the same tools but has not been verified for this guide.",
    time: "~10 minutes",
    steps: [
      {
        title: "Install the Toolchain and QEMU",
        code: `sudo apt install git python3-venv gcc-arm-none-eabi qemu-system-arm`,
      },
      {
        title: "Install ebuild and EoSim",
        text: "ebuild is the EmbeddedOS build tool. EoSim provides the platform registry that `ebuild platforms list` reads. Neither is on PyPI yet, so install them from GitHub. uv supplies Python 3.12 for the virtual environment, with no root needed, so this works on Ubuntu 20.04 too.",
        code: `curl -LsSf https://astral.sh/uv/install.sh | sh && source $HOME/.local/bin/env\nuv venv -p 3.12 .venv && . .venv/bin/activate\nuv pip install "embeddedos-ebuild @ git+https://github.com/embeddedos-org/ebuild" \\\n               "embeddedos-eosim @ git+https://github.com/embeddedos-org/EoSim"\n\nebuild --version\n# ebuild, version 3.0.1`,
        tip: "Already on Python 3.10+ (Ubuntu 22.04 or later)? python3 -m venv .venv works in place of uv. With Ubuntu 20.04's python3 (3.8), the install fails with: requires a different Python: 3.8.10 not in '>=3.9'. Do not run `pip install ebuild`: that name on PyPI belongs to an unrelated project.",
      },
      {
        title: "Fetch the EoS Sources",
        text: "ebuild builds your application against the EoS kernel and bootloader sources. It keeps them in ~/.ebuild/repos.",
        code: `ebuild setup\n# [ok]   eos: ~/.ebuild/repos/eos\n# [ok]   eboot: ~/.ebuild/repos/eboot\n# [ok] Setup complete. Repos are ready.\n\nebuild doctor     # checks compilers, cmake, ninja and the repos`,
        tip: "Ran ebuild setup on this machine before? It never pulls an existing clone, so run `ebuild repos update` to bring eos and eboot up to date. An older eos checkout makes `ebuild sim` stop with: sim.yaml not found.",
      },
      {
        title: "Create Your First Project",
        code: `ebuild init my-blink --template rtos --target stm32f4\ncd my-blink\n\n# my-blink/\n#   src/main.c          <- your application\n#   tests/test_main.c   <- unit test target\n#   build.yaml          <- ebuild build configuration\n#   eos.yaml            <- EoS project configuration (board, kind)\n#   README.md`,
        tip: "`ebuild init` is the guide's name for `ebuild new`. The rtos template maps to `ebuild new --template rtos-app`.",
      },
      {
        title: "The Generated main.c",
        text: "The rtos template is a producer/consumer program. It uses an EoS queue, a mutex and two tasks:",
        code: `static void producer_task(void *arg) {\n    uint32_t seq = 0;\n    while (1) {\n        message_t msg = { .id = seq++, .value = (int32_t)(seq * 10) };\n        eos_queue_send(g_queue, &msg, EOS_WAIT_FOREVER);\n        eos_task_delay_ms(500);\n    }\n}\n\nstatic void consumer_task(void *arg) {\n    message_t msg;\n    while (1) {\n        if (eos_queue_receive(g_queue, &msg, EOS_WAIT_FOREVER) == EOS_KERN_OK)\n            printf("[consumer] id=%lu value=%ld\\n", msg.id, msg.value);\n    }\n}`,
      },
      {
        title: "Simulate It",
        text: "ebuild sim compiles your sources and the EoS kernel for QEMU's lm3s6965evb (Cortex-M3), boots the image and prints its output. The kernel's SysTick and PendSV scheduling are real. The board's peripherals are not modelled.",
        code: `ebuild sim --timeout 4\n\n# Building stm32f4 application for qemu_cortex_m3 (lm3s6965evb)...\n# [ok] Image: .../my-blink/_build/sim/firmware.elf\n# Running on lm3s6965evb (timeout 4s)...\n# [my-blink] Starting kernel...\n# [consumer] id=0 value=10\n# [consumer] id=1 value=20\n# ...\n# [consumer] id=8 value=90\n# [ok] Simulation ran: 10 line(s) of output, stopped after 4s`,
        tip: "For CI, assert on output: ebuild sim --expect 'id=3 value=40'. It exits non-zero if the text never appears, if the guest exits with an error, or if the image prints nothing.",
      },
      {
        title: "Which Boards Can Be Simulated",
        text: "ebuild sim runs Arm Cortex-M targets: stm32f4, stm32h7, stm32l4, nrf52, nrf52840, rp2040 and raspi-pico, all on the same QEMU Cortex-M3 machine. Other boards, such as esp32, are refused with a message instead of being faked.",
        code: `ebuild platforms list\n# 153 EoSim platforms (* = runnable with \`ebuild sim\`):\n#    adi-aducm4050            arm      Analog Devices\n#    ...\n\nebuild sim --platform esp32\n# Error: no simulation target for board 'esp32' yet. Boards ebuild sim can run: ...`,
      },
      {
        title: "Debug with GDB",
        text: "Run the image under QEMU's GDB stub yourself. ebuild does not wrap this step yet.",
        code: `qemu-system-arm -M lm3s6965evb -nographic -semihosting \\\n  -kernel _build/sim/firmware.elf -gdb unix:/tmp/eos.sock,server,nowait -S &\n\ngdb-multiarch _build/sim/firmware.elf \\\n  -ex "target remote /tmp/eos.sock" -ex "break consumer_task" -ex continue\n# Breakpoint 1, consumer_task (arg=0x0) at src/main.c:39`,
      },
    ],
    nextSteps: [
      { label: "EoS Kernel deep dive", href: "/eos" },
      { label: "Hardware engineer workflow", href: "/getting-started" },
    ],
  },
  esp32: {
    title: "ESP32: Not Ready Yet",
    color: "#F97316",
    intro:
      "ESP32 support is not usable end to end today, and this page will not pretend otherwise. You can create an ESP32 project. Building it needs the Xtensa toolchain, which ebuild does not bundle. ebuild sim cannot run ESP32 code. Producing a flashable MCU image from an ebuild project is tracked in ebuild#171.",
    prereq:
      "If you want to help: an ESP32 DevKit, the xtensa-esp32-elf toolchain and esptool.",
    time: "—",
    steps: [
      {
        title: "What Works Today",
        code: `ebuild init my-esp32-app --template rtos --target esp32   # creates the project\nebuild doctor\n#  warn  xtensa-esp32-elf   not installed — no esp32 builds`,
      },
      {
        title: "What Does Not Work Yet",
        substeps: [
          "ebuild build does not yet cross-compile a board image (ebuild#171)",
          "ebuild sim --platform esp32 is refused; there is no ESP32 simulation target",
          "ebuild flash <image> --tool esptool calls esptool, but the maintainers have not verified it on hardware",
        ],
      },
    ],
    nextSteps: [
      {
        label: "Track ESP32 / MCU image support",
        href: "https://github.com/embeddedos-org/ebuild/issues/171",
      },
      { label: "Simulate a Cortex-M board instead", href: "/getting-started" },
    ],
  },
  stm32: {
    title: "STM32: Simulate Now, Hardware Images Next",
    color: "#22D3EE",
    intro:
      "The EoS kernel cross-compiles for Cortex-M4 (STM32F4), and its Cortex-M scheduler is exercised in CI on QEMU. What is missing is an `ebuild build` that turns your project into a flashable STM32 image. Today it builds a host binary, and it does not say so (ebuild#171). Until that lands, simulate with ebuild sim and treat flashing as experimental.",
    prereq:
      "An STM32 Nucleo or Discovery board and OpenOCD, for when hardware images land.",
    time: "—",
    steps: [
      {
        title: "Simulate Your STM32 Application",
        code: `ebuild init my-stm32-app --template rtos --target stm32f4\ncd my-stm32-app && ebuild sim`,
      },
      {
        title: "Build the EoS Kernel for Cortex-M4",
        text: "This is the same build CI runs. It produces the EoS libraries for an STM32F4-class core.",
        code: `git clone https://github.com/embeddedos-org/eos.git && cd eos\ncmake -B build/arm -DCMAKE_TOOLCHAIN_FILE=toolchains/arm-cortex-m4.cmake -DEOS_BUILD_TESTS=OFF\ncmake --build build/arm -j`,
      },
      {
        title: "Flashing (Experimental)",
        text: "ebuild flash drives OpenOCD, pyOCD, st-flash, nrfjprog or esptool for an image you already have. The maintainers have not verified it on hardware for this guide.",
        code: `ebuild flash firmware.bin --tool openocd --target stm32f4\nebuild monitor --baud 115200`,
      },
    ],
    nextSteps: [
      {
        label: "Track STM32 image support",
        href: "https://github.com/embeddedos-org/ebuild/issues/171",
      },
      { label: "EoS Kernel docs", href: "/eos" },
    ],
  },
  apps: {
    title: "Build eApps (C + LVGL)",
    color: "#F59E0B",
    intro:
      "eApps is a collection of C applications on the LVGL graphics library. The native build of the app libraries was verified for this guide on Ubuntu 20.04. Running the apps on a desktop window needs SDL2. That step has not yet been re-verified for this guide.",
    prereq:
      "Git, CMake 3.16+, GCC or Clang. SDL2 (libsdl2-dev) to run apps on a desktop.",
    time: "~10 minutes",
    steps: [
      {
        title: "Clone and Build",
        code: `git clone --recursive https://github.com/embeddedos-org/eApps.git\ncd eApps\ncmake -B build -DCMAKE_BUILD_TYPE=Release\ncmake --build build -j`,
      },
      {
        title: "Desktop Executables (needs SDL2)",
        text: "With SDL2 installed, standalone executables per app are built when you ask for them. Without SDL2, CMake prints: Skipping eapps_port: SDL2 not found.",
        code: `sudo apt install libsdl2-dev\ncmake -B build -DEAPPS_BUILD_STANDALONE=ON\ncmake --build build -j`,
      },
    ],
    nextSteps: [
      {
        label: "eApps on GitHub",
        href: "https://github.com/embeddedos-org/eApps",
      },
      { label: "eOffice Suite", href: "/eoffice" },
    ],
  },
  "hardware-design": {
    title: "Hardware Engineer Workflow",
    color: "#A78BFA",
    intro:
      "Start from a KiCad schematic. ebuild analyze identifies the MCU and peripherals and generates board, boot and build configuration, and you simulate application logic for that MCU family. The eCAD repository's V0–V4 validation gate checks a product's design data and refuses to call anything a pass without evidence. It is honest about the current state: the example product below does not pass yet.",
    prereq:
      "The simulator path above (ebuild and its virtual environment, still active).",
    time: "~20 minutes",
    steps: [
      {
        title: "Get the Designs and the Validator",
        code: `git clone https://github.com/embeddedos-org/eCAD-Hardware-Products.git && cd eCAD-Hardware-Products\nuv pip install jsonschema pyyaml\npython tools/validate_products.py capabilities   # which external tools are available here`,
      },
      {
        title: "Analyze a Schematic",
        text: "From inside eCAD-Hardware-Products, on the eRadar360 schematic:",
        code: `ebuild analyze --file eRadar360_CAD_Design/hardware/eradar360.kicad_sch\n\n# [info] MCU: STM32H7 (cortex-m7)\n# [info] Peripherals: 2 detected\n#   - usb: J1_usb\n#   - audio: J2_audio\n# [ok]   board: _generated/board.yaml\n# [ok]   boot: _generated/boot.yaml\n# [ok]   build: _generated/build.yaml\n# [ok]   eos_config: _generated/eos_product_config.h\n# [info] Validation: PASS (0 errors, 3 warnings)`,
        tip: "Read the warnings: for this schematic, flash and RAM sizes are not in the design and have to be filled in.",
      },
      {
        title: "Validate the Product's Design Data",
        text: "V0 schema, V1 sanity, V2 invariants, V3 golden and V4 corner checks. Anything that could not be executed is reported as BLOCKED, never as a pass. eRadar360 currently fails V0 (canonical BOM and datasheet contract) and is blocked at V1–V4 (no simulation model, CAD inputs, golden or corner evidence yet):",
        code: `python tools/validate_products.py validate --product eRadar360_CAD_Design:hardware --output out/\n# prints a JSON summary; its verdict_counts are FAIL 1, everything else 0\n# bundle: out/bundle.json\n\n# the per-gate verdicts are in the product's receipt:\npython -c "import json; [print(g['gate'], g['verdict']) for g in json.load(open('out/products/eRadar360_CAD_Design__hardware/receipt.json'))['gates']]"\n# V0 FAIL\n# V1 BLOCKED\n# V2 BLOCKED\n# V3 BLOCKED\n# V4 BLOCKED`,
      },
      {
        title: "Simulate Firmware for That MCU Family",
        code: `cd .. && ebuild init radar-fw --template rtos --target stm32h7\ncd radar-fw && ebuild sim`,
        warn: "Simulation runs on QEMU's Cortex-M3: it checks kernel and application logic, not your board's peripherals or timing.",
      },
    ],
    nextSteps: [
      {
        label: "eCAD-Hardware-Products",
        href: "https://github.com/embeddedos-org/eCAD-Hardware-Products",
      },
      { label: "Hardware lab", href: "/hardware-lab" },
    ],
  },
};

export default function GettingStarted() {
  const [activePath, setActivePath] = useState<Path>("sim");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyCode = async (code: string, key: string) => {
    if (!(await copyText(code))) return;
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#080F1E]">
      {/* Hero */}
      <section className="relative py-20 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628] to-[#080F1E]" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-[#F97316]/5 rounded-full blur-[100px]" />
          <div className="absolute top-1/4 right-1/3 w-64 h-64 bg-[#22D3EE]/4 rounded-full blur-[80px]" />
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
              <Play size={12} /> Getting Started
            </span>
          </motion.div>
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="font-heading font-black text-5xl sm:text-6xl text-white mb-5 leading-[1.05]"
          >
            Start Building with
            <br />
            <span style={{ color: "#F97316" }}>EmbeddedOS</span>
          </motion.h1>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="text-white/60 text-xl max-w-2xl mx-auto mb-4 leading-relaxed"
          >
            No hardware required to get started. Every command on the simulator
            path was run as written before it was published.
          </motion.p>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-[#34D399]"
            style={{
              background: "rgba(52,211,153,0.08)",
              border: "1px solid rgba(52,211,153,0.2)",
            }}
          >
            <CheckCircle2 size={14} /> Boot the real EoS kernel on QEMU with
            ebuild sim — no hardware needed
          </motion.div>
        </div>
      </section>

      {/* Ecosystem Map */}
      <section className="pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="font-heading font-black text-2xl text-white mb-2">
              The EmbeddedOS Ecosystem
            </h2>
            <p className="text-white/40 text-sm">
              8 tools that work together — understand what each one does before
              you start
            </p>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {ECOSYSTEM.map((tool, i) => {
              const TIcon = tool.icon;
              return (
                <motion.div
                  key={tool.id}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  className="rounded-2xl border p-4"
                  style={{
                    background: `${tool.color}06`,
                    borderColor: `${tool.color}20`,
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: `${tool.color}18` }}
                    >
                      <TIcon size={14} style={{ color: tool.color }} />
                    </div>
                    <div>
                      <div className="font-heading font-bold text-white text-sm">
                        {tool.name}
                      </div>
                      <div
                        className="text-[10px]"
                        style={{ color: tool.color }}
                      >
                        {tool.role}
                      </div>
                    </div>
                  </div>
                  <p className="text-white/45 text-xs leading-relaxed">
                    {tool.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Path Selector */}
      <section className="pb-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-6"
          >
            <h2 className="font-heading font-black text-2xl text-white mb-1">
              Choose Your Path
            </h2>
            <p className="text-white/40 text-sm">
              Pick the option that matches where you are right now
            </p>
          </motion.div>
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
            role="tablist"
            aria-label="Getting started paths"
            onKeyDown={moveTabFocus}
          >
            {PATHS.map(p => {
              const PIcon = p.icon;
              return (
                <button
                  key={p.id}
                  role="tab"
                  id={`path-tab-${p.id}`}
                  aria-selected={activePath === p.id}
                  aria-controls={`path-panel-${p.id}`}
                  tabIndex={activePath === p.id ? 0 : -1}
                  onClick={() => setActivePath(p.id)}
                  className="relative flex items-center gap-3 p-4 rounded-2xl text-left transition-all"
                  style={
                    activePath === p.id
                      ? {
                          background: `${p.color}15`,
                          border: `1.5px solid ${p.color}50`,
                        }
                      : {
                          background: "rgba(255,255,255,0.03)",
                          border: "1px solid rgba(255,255,255,0.08)",
                        }
                  }
                >
                  {p.badge && (
                    <span
                      className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold"
                      style={{ background: p.color, color: "#000" }}
                    >
                      {p.badge}
                    </span>
                  )}
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background:
                        activePath === p.id ? `${p.color}25` : `${p.color}12`,
                    }}
                  >
                    <PIcon size={18} style={{ color: p.color }} />
                  </div>
                  <div>
                    <div className="font-heading font-bold text-white text-sm">
                      {p.label}
                    </div>
                    <div className="text-xs text-white/45">{p.sublabel}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Path Content */}
      <section className="pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {(Object.keys(PATH_CONTENT) as Path[]).map(pathId => {
            const content = PATH_CONTENT[pathId];
            return (
              <div
                key={pathId}
                role="tabpanel"
                id={`path-panel-${pathId}`}
                aria-labelledby={`path-tab-${pathId}`}
                hidden={pathId !== activePath}
              >
                <div
                  className="rounded-2xl border p-6 mb-6"
                  style={{
                    background: `${content.color}08`,
                    borderColor: `${content.color}25`,
                  }}
                >
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <h2 className="font-heading font-black text-2xl sm:text-3xl text-white">
                      {content.title}
                    </h2>
                    <span
                      className="px-3 py-1 rounded-full text-xs font-bold"
                      style={{
                        background: `${content.color}20`,
                        color: content.color,
                      }}
                    >
                      {content.time}
                    </span>
                  </div>
                  <p className="text-white/60 text-base mb-4 leading-relaxed">
                    {content.intro}
                  </p>
                  <div
                    className="flex items-start gap-2 p-3 rounded-xl"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <Info size={14} className="text-white/40 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-white/40 uppercase tracking-wider">
                        Prerequisites:{" "}
                      </span>
                      <span className="text-xs text-white/60">
                        {content.prereq}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {content.steps.map((step, i) => (
                    <motion.div
                      key={step.title}
                      variants={fadeUp}
                      initial="hidden"
                      animate="visible"
                      custom={i}
                      className="rounded-2xl border border-white/8 overflow-hidden"
                      style={{ background: "rgba(255,255,255,0.02)" }}
                    >
                      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black text-white shrink-0"
                          style={{
                            background: `${content.color}25`,
                            border: `1px solid ${content.color}40`,
                          }}
                        >
                          {i + 1}
                        </div>
                        <h3 className="font-heading font-bold text-white">
                          {step.title}
                        </h3>
                      </div>
                      <div className="px-5 py-4 space-y-3">
                        {step.text && (
                          <p className="text-sm text-white/60 leading-relaxed">
                            {step.text}
                          </p>
                        )}
                        {step.substeps && (
                          <ul className="space-y-1.5">
                            {step.substeps.map(s => (
                              <li
                                key={s}
                                className="flex items-start gap-2 text-sm text-white/55"
                              >
                                <ChevronRight
                                  size={13}
                                  className="mt-0.5 shrink-0"
                                  style={{ color: content.color }}
                                />
                                {s}
                              </li>
                            ))}
                          </ul>
                        )}
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
                                onClick={() =>
                                  copyCode(step.code!, `${pathId}-${i}`)
                                }
                                className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors"
                              >
                                {copiedKey === `${pathId}-${i}` ? (
                                  <CheckCircle2
                                    size={12}
                                    className="text-[#34D399]"
                                  />
                                ) : (
                                  <Copy size={12} />
                                )}
                                {copiedKey === `${pathId}-${i}`
                                  ? "Copied!"
                                  : "Copy"}
                              </button>
                            </div>
                            <pre className="p-4 text-xs overflow-x-auto font-mono leading-relaxed">
                              <code style={{ color: "#E6EDF3" }}>
                                {step.code}
                              </code>
                            </pre>
                          </div>
                        )}
                        {step.tip && (
                          <div
                            className="flex items-start gap-2 p-3 rounded-xl text-xs"
                            style={{
                              background: `${content.color}08`,
                              border: `1px solid ${content.color}20`,
                            }}
                          >
                            <Star
                              size={12}
                              style={{ color: content.color }}
                              className="mt-0.5 shrink-0"
                            />
                            <span style={{ color: content.color }}>
                              <strong>Tip:</strong> {step.tip}
                            </span>
                          </div>
                        )}
                        {step.warn && (
                          <div
                            className="flex items-start gap-2 p-3 rounded-xl text-xs"
                            style={{
                              background: "rgba(248,81,73,0.08)",
                              border: "1px solid rgba(248,81,73,0.2)",
                            }}
                          >
                            <AlertCircle
                              size={12}
                              className="text-[#F85149] mt-0.5 shrink-0"
                            />
                            <span className="text-[#F85149]">
                              <strong>Note:</strong> {step.warn}
                            </span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div
                  className="mt-8 rounded-2xl border border-white/8 p-5"
                  style={{ background: "rgba(255,255,255,0.02)" }}
                >
                  <div className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">
                    What's Next
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {content.nextSteps.map(ns => {
                      const className =
                        "inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white/70 hover:text-white transition-all";
                      const style = {
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                      };
                      // wouter's Link routes client-side; GitHub links must be plain anchors.
                      return ns.href.startsWith("http") ? (
                        <a
                          key={ns.label}
                          href={ns.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={className}
                          style={style}
                        >
                          {ns.label} <ArrowRight size={13} />
                        </a>
                      ) : (
                        <Link
                          key={ns.label}
                          href={ns.href}
                          className={className}
                          style={style}
                        >
                          {ns.label} <ArrowRight size={13} />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-6"
          >
            <h2 className="font-heading font-black text-2xl text-white mb-1">
              Once it builds, where to look next
            </h2>
            <p className="text-white/40 text-sm">
              The pages that explain how the pieces fit together
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              {
                href: "/architecture",
                label: "How EmbeddedOS is put together",
                desc: "The full stack, layer by layer, with the diagrams.",
              },
              {
                href: "/ecosystem",
                label: "Every component and what it does",
                desc: "Each project, its purpose, and how they depend on each other.",
              },
              {
                href: "/products",
                label: "The component reference pages",
                desc: "Engineering detail for each project, with usage examples.",
              },
              {
                href: "/downloads",
                label: "Every repository and install command",
                desc: "All EmbeddedOS repositories, MIT licensed, in one list.",
              },
              {
                href: "/stacks",
                label: "Pick a stack for your device",
                desc: "Which components you need for the kind of hardware you are building.",
              },
            ].map(l => (
              <Link
                key={l.href}
                href={l.href}
                className="block rounded-2xl border border-white/8 p-5 transition-all hover:border-white/20"
                style={{ background: "rgba(255,255,255,0.02)" }}
              >
                <span className="block font-bold text-white text-sm mb-1">
                  {l.label}
                </span>
                <span className="block text-white/50 text-xs leading-relaxed">
                  {l.desc}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Quick reference */}
      <section className="pb-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              {
                label: "EoS Kernel",
                href: "/eos",
                color: "#F97316",
                icon: Cpu,
              },
              {
                label: "eBoot",
                href: "/eboot",
                color: "#F59E0B",
                icon: Shield,
              },
              { label: "eFlow", href: "/flow", color: "#A78BFA", icon: Layers },
              {
                label: "EAI / ENI",
                href: "/eai",
                color: "#34D399",
                icon: Brain,
              },
              {
                label: "eOffice",
                href: "/eoffice",
                color: "#22D3EE",
                icon: Package,
              },
              {
                label: "Hardware Lab",
                href: "/hardware-lab",
                color: "#60A5FA",
                icon: HardDrive,
              },
            ].map(l => {
              const LIcon = l.icon;
              return (
                <Link
                  key={l.label}
                  href={l.href}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl border text-center transition-all hover:scale-[1.02]"
                  style={{
                    background: `${l.color}08`,
                    borderColor: `${l.color}20`,
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${l.color}18` }}
                  >
                    <LIcon size={16} style={{ color: l.color }} />
                  </div>
                  <span className="text-xs font-bold text-white/60">
                    {l.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
