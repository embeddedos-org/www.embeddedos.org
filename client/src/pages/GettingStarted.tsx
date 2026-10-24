import { useState, type CSSProperties } from "react";
import { Link } from "wouter";
import { copyText } from "@/lib/clipboard";
import { moveTabFocus } from "@/lib/tablist";
import { SIM_PLATFORM_COUNT } from "@/data/stack";
import { BpPage, LocalNav, PageHero, Section } from "@/components/bp";
import "./GettingStarted.css";

const ECOSYSTEM = [
  {
    id: "ebuild",
    name: "ebuild",
    role: "Build Tool",
    desc: "Creates, builds and simulates EoS projects, analyzes KiCad schematics, and drives flash tools.",
    color: "#F97316",
  },
  {
    id: "eosim",
    name: "EoSim",
    role: "Simulator",
    desc: `Registry of ${SIM_PLATFORM_COUNT} platform descriptors and simulation engines. Cortex-M apps run on QEMU through ebuild sim.`,
    color: "#22D3EE",
  },
  {
    id: "eos",
    name: "EoS Kernel",
    role: "RTOS Kernel",
    desc: "The real-time OS kernel. Provides HAL, scheduler, IPC, drivers, and POSIX subset.",
    color: "#F97316",
  },
  {
    id: "eboot",
    name: "eBoot",
    role: "Bootloader",
    desc: "Secure bootloader with verified boot, OTA A/B updates, and hardware root of trust.",
    color: "#F59E0B",
  },
  {
    id: "eflow",
    name: "eFlow",
    role: "Visual Programming",
    desc: "Drag-and-drop block editor that generates production C code. No assembly needed for common patterns.",
    color: "#A78BFA",
  },
  {
    id: "eai",
    name: "EAI / ENI",
    role: "Edge AI",
    desc: "On-device TFLite/ONNX inference and neural interface adapter for BCI devices.",
    color: "#34D399",
  },
  {
    id: "eapps",
    name: "eApps",
    role: "App Ecosystem",
    desc: "60+ apps including eOffice Suite, eBrowser, eDB, and eBot AI assistant.",
    color: "#60A5FA",
  },
  {
    id: "eostudio",
    name: "EoStudio",
    role: "IDE",
    desc: "Universal IDE with AI tutor, 3D modeler, game editor, and UI designer.",
    color: "#F472B6",
  },
];

type Path = "nosim" | "sim" | "stm32" | "esp32" | "apps" | "hardware-design";

const PATHS: {
  id: Path;
  label: string;
  sublabel: string;
  color: string;
  badge?: string;
}[] = [
  {
    id: "nosim",
    label: "Just Looking",
    sublabel: "Illustrative browser demo",
    color: "#34D399",
  },
  {
    id: "sim",
    label: "Simulator on My Computer",
    sublabel: "ebuild sim on QEMU — verified",
    color: "#22D3EE",
    badge: "Start here",
  },
  {
    id: "esp32",
    label: "I Have an ESP32",
    sublabel: "Status: not ready yet",
    color: "#F97316",
  },
  {
    id: "stm32",
    label: "I Have an STM32",
    sublabel: "Simulate now; images next",
    color: "#22D3EE",
  },
  {
    id: "apps",
    label: "I Want to Build eApps",
    sublabel: "C + LVGL cross-platform apps",
    color: "#F59E0B",
  },
  {
    id: "hardware-design",
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

/** Where to read next once the first build works. */
const WHERE_NEXT = [
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
];

/** Quick reference: the component pages a first-time builder opens most. */
const QUICK_LINKS = [
  { label: "EoS Kernel", href: "/eos" },
  { label: "eBoot", href: "/eboot" },
  { label: "eFlow", href: "/flow" },
  { label: "EAI / ENI", href: "/eai" },
  { label: "eOffice", href: "/eoffice" },
  { label: "Hardware Lab", href: "/hardware-lab" },
];

export default function GettingStarted() {
  const [activePath, setActivePath] = useState<Path>("sim");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyCode = async (code: string, key: string) => {
    if (!(await copyText(code))) return;
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <BpPage className="gs">
      <PageHero
        sig
        label="Getting Started"
        title={
          <>
            Start Building with
            <br />
            <span>EmbeddedOS</span>
          </>
        }
        lead="No hardware required to get started. Every command on the simulator path was run as written before it was published."
      >
        <p className="gs-ok">
          Boot the real EoS kernel on QEMU with ebuild sim — no hardware needed
        </p>
      </PageHero>
      <LocalNav
        name="Getting Started"
        items={[
          { id: "ecosystem", label: "The ecosystem" },
          { id: "paths", label: "Choose your path" },
          { id: "next", label: "Where to look next" },
        ]}
      />

      {/* The eight tools */}
      <Section
        id="ecosystem"
        title="The EmbeddedOS Ecosystem"
        lead="8 tools that work together — understand what each one does before you start"
        split
      >
        <ul className="cards four">
          {ECOSYSTEM.map(tool => (
            <li key={tool.id}>
              <div
                className="card gs-tool"
                style={{ "--c": tool.color } as CSSProperties}
              >
                <span className="k">{tool.role}</span>
                <h3>{tool.name}</h3>
                <p>{tool.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      {/* The six paths: every panel is in the HTML; one is shown */}
      <Section
        id="paths"
        title="Choose Your Path"
        lead="Pick the option that matches where you are right now"
        split
      >
        <div
          className="gs-tabs"
          role="tablist"
          aria-label="Getting started paths"
          onKeyDown={moveTabFocus}
        >
          {PATHS.map(p => (
            <button
              key={p.id}
              role="tab"
              id={`path-tab-${p.id}`}
              aria-selected={activePath === p.id}
              aria-controls={`path-panel-${p.id}`}
              tabIndex={activePath === p.id ? 0 : -1}
              onClick={() => setActivePath(p.id)}
              type="button"
              className="gs-tab"
              style={{ "--c": p.color } as CSSProperties}
            >
              {p.badge && <span className="gs-badge">{p.badge}</span>}
              <span className="gs-tl">{p.label}</span>
              <span className="gs-ts">{p.sublabel}</span>
            </button>
          ))}
        </div>

        {(Object.keys(PATH_CONTENT) as Path[]).map(pathId => {
          const content = PATH_CONTENT[pathId];
          return (
            <div
              key={pathId}
              role="tabpanel"
              id={`path-panel-${pathId}`}
              aria-labelledby={`path-tab-${pathId}`}
              hidden={pathId !== activePath}
              className="gs-panel"
              style={{ "--c": content.color } as CSSProperties}
            >
              <div className="gs-ph">
                <div className="gs-pt">
                  <h3>{content.title}</h3>
                  <span className="gs-time">{content.time}</span>
                </div>
                <p className="gs-intro">{content.intro}</p>
                <p className="gnote gs-pre">
                  <b>Prerequisites: </b>
                  {content.prereq}
                </p>
              </div>

              <ol className="steps num gs-steps">
                {content.steps.map((step, i) => (
                  <li key={step.title}>
                    <span className="n">{i + 1}</span>
                    <div className="gs-step">
                      <h4>{step.title}</h4>
                      {step.text && <p>{step.text}</p>}
                      {step.substeps && (
                        <ul className="gs-sub">
                          {step.substeps.map(s => (
                            <li key={s}>{s}</li>
                          ))}
                        </ul>
                      )}
                      {step.code && (
                        <div className="code">
                          <div className="cbar gs-cbar">
                            <button
                              type="button"
                              onClick={() =>
                                copyCode(step.code!, `${pathId}-${i}`)
                              }
                              className={
                                copiedKey === `${pathId}-${i}`
                                  ? "gs-copy done"
                                  : "gs-copy"
                              }
                            >
                              {copiedKey === `${pathId}-${i}`
                                ? "Copied!"
                                : "Copy"}
                            </button>
                          </div>
                          <pre tabIndex={0}>
                            <code>{step.code}</code>
                          </pre>
                        </div>
                      )}
                      {step.tip && (
                        <p className="gnote gs-tip">
                          <b>Tip:</b> {step.tip}
                        </p>
                      )}
                      {step.warn && (
                        <p className="gnote gs-warn">
                          <b>Note:</b> {step.warn}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ol>

              <div className="gs-nextw">
                <p className="label">What's Next</p>
                <ul className="glinks">
                  {content.nextSteps.map(ns => (
                    <li key={ns.label}>
                      {/* wouter's Link routes client-side; GitHub links must be plain anchors. */}
                      {ns.href.startsWith("http") ? (
                        <a
                          href={ns.href}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span>{ns.label}</span>
                          <i aria-hidden="true">↗</i>
                        </a>
                      ) : (
                        <Link href={ns.href}>
                          <span>{ns.label}</span>
                          <i aria-hidden="true">→</i>
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </Section>

      {/* After the first build */}
      <Section
        id="next"
        title="Once it builds, where to look next"
        lead="The pages that explain how the pieces fit together"
        split
      >
        <ul className="cards">
          {WHERE_NEXT.map(l => (
            <li key={l.href}>
              <Link href={l.href} className="card gs-where">
                <h3>{l.label}</h3>
                <p>{l.desc}</p>
                <i className="gs-ar" aria-hidden="true">
                  →
                </i>
              </Link>
            </li>
          ))}
        </ul>
        <p className="label gs-ql">Quick reference</p>
        <ul className="glinks cols">
          {QUICK_LINKS.map(l => (
            <li key={l.label}>
              <Link href={l.href}>
                <span>{l.label}</span>
                <i aria-hidden="true">→</i>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </BpPage>
  );
}
