import { useState, type CSSProperties } from "react";
import { Link } from "wouter";
import { copyText } from "@/lib/clipboard";
import { SIM_PLATFORM_COUNT } from "@/data/stack";
import {
  Band,
  BpPage,
  LocalNav,
  PageHero,
  Section,
  Stats,
} from "@/components/bp";
import "./EBuildPage.css";

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

// ─── CAD → FIRMWARE PIPELINE ───────────────────────────────────────────────
const CAD_FLOW = [
  { label: "KiCad Schematic", sub: ".kicad_sch", color: "#F97316" },
  { label: "ebuild cad analyze", sub: "MCU + pin map", color: "#F59E0B" },
  { label: "ebuild cad generate", sub: "BSP files", color: "#A78BFA" },
  { label: "ebuild init", sub: "project scaffold", color: "#22D3EE" },
  { label: "ebuild build", sub: "firmware.elf", color: "#34D399" },
  { label: "ebuild sim", sub: "virtual board", color: "#60A5FA" },
  { label: "ebuild analyze", sub: "static analysis", color: "#F472B6" },
  { label: "ebuild flash", sub: "real hardware", color: "#F97316" },
];

export default function EBuildPage() {
  const [activeGroup, setActiveGroup] = useState(0);
  const [activePhase, setActivePhase] = useState(0);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyCode = async (code: string) => {
    if (!(await copyText(code))) return;
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const phase = WORKFLOW[activePhase];
  const group = COMMANDS[activeGroup];

  return (
    <BpPage className="ebuild">
      <PageHero
        label="ebuild — Developer Workflow"
        title={
          <>
            One Tool for the
            <br />
            Entire EoS Lifecycle
          </>
        }
        lead="ebuild is the EmbeddedOS build tool. It handles everything from project creation to CAD analysis, simulation, static analysis, flashing, and OTA updates — with a single CLI and zero configuration files to maintain manually."
      >
        <div className="ctas">
          <Link href="/getting-started" className="btn pri">
            Get Started
          </Link>
          <Link href="/eflow" className="btn gh">
            eFlow Visual Editor{" "}
            <span className="ar" aria-hidden="true">
              →
            </span>
          </Link>
        </div>
      </PageHero>

      <LocalNav
        name="ebuild"
        items={[
          { id: "install", label: "Install" },
          { id: "workflow", label: "Developer Workflow" },
          { id: "commands", label: "Command Reference" },
          { id: "toml", label: "ebuild.toml" },
          { id: "cad", label: "CAD → Firmware" },
        ]}
      />

      {/* Install */}
      <Section id="install" tight>
        <div className="code eb-term">
          <div className="cbar">
            <b>Terminal</b>
            <button
              type="button"
              onClick={() => copyCode("pip install embeddedos-ebuild")}
              className="eb-copy"
            >
              Copy
            </button>
          </div>
          <pre>
            <span className="pr">$ </span>pip install embeddedos-ebuild{"\n"}
            <span className="pr">$ </span>ebuild --version{"\n"}
            <span className="ok">ebuild v2.1.0 (EmbeddedOS Build Tool)</span>
            {"\n"}
            <span className="pr">$ </span>ebuild platforms list | wc -l{"\n"}
            <span className="ok">63</span>
          </pre>
        </div>
        <Stats
          small
          items={[
            {
              value: `${SIM_PLATFORM_COUNT} platforms`,
              label: "supported targets",
            },
            { value: "Zero config", label: "toolchain bundled" },
            { value: "One command", label: "build → flash → monitor" },
          ]}
        />
      </Section>

      {/* Full Workflow */}
      <Section
        id="workflow"
        title="The Complete Developer Workflow"
        lead="From KiCad schematic to OTA-updated production firmware — every step handled by ebuild."
        split
        alt
      >
        {/* Phase tabs */}
        <div className="ctas eb-tabs">
          {WORKFLOW.map((p, i) => (
            <button
              key={p.phase}
              type="button"
              onClick={() => setActivePhase(i)}
              aria-pressed={activePhase === i}
              className="btn gh"
              style={{ "--c": p.color } as CSSProperties}
            >
              {p.phase}
            </button>
          ))}
        </div>

        <ol
          className="steps num eb-steps"
          key={activePhase}
          style={{ "--c": phase.color } as CSSProperties}
        >
          {phase.steps.map((step, i) => (
            <li key={step.title}>
              <span className="n">{i + 1}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
                {step.code && (
                  <div className="code">
                    <div className="cbar">
                      <span />
                      <button
                        type="button"
                        onClick={() => copyCode(step.code!)}
                        className="eb-copy"
                      >
                        {copiedCode === step.code ? "Copied!" : "Copy"}
                      </button>
                    </div>
                    {/* scrolls sideways on a phone, so a keyboard can reach it */}
                    <pre
                      tabIndex={0}
                      role="region"
                      aria-label={`${step.title}: commands`}
                    >
                      <code>{step.code}</code>
                    </pre>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {/* Command Reference */}
      <Section
        id="commands"
        title="Command Reference"
        lead="Every ebuild command with flags, descriptions, and examples."
        split
      >
        <div className="ctas eb-tabs">
          {COMMANDS.map((g, i) => (
            <button
              key={g.group}
              type="button"
              onClick={() => setActiveGroup(i)}
              aria-pressed={activeGroup === i}
              className="btn gh"
              style={{ "--c": g.color } as CSSProperties}
            >
              {g.group}
            </button>
          ))}
        </div>

        <ul
          className="eb-cmds"
          key={activeGroup}
          style={{ "--c": group.color } as CSSProperties}
        >
          {group.cmds.map(cmd => (
            <li key={cmd.cmd} className="card">
              <div className="top">
                <div className="eb-sig">
                  <code>{cmd.cmd}</code>
                  {cmd.flags && <div className="eb-flags">{cmd.flags}</div>}
                </div>
                <button
                  type="button"
                  onClick={() => copyCode(cmd.example)}
                  className="eb-copy"
                >
                  Copy example
                </button>
              </div>
              <p>{cmd.desc}</p>
              <pre className="eb-ex">
                <span className="pr">$ </span>
                {cmd.example}
              </pre>
            </li>
          ))}
        </ul>
      </Section>

      {/* ebuild.toml Reference */}
      <Section
        id="toml"
        title="ebuild.toml Reference"
        lead="The project configuration file. Every field is optional — ebuild uses sensible defaults for everything not specified."
        split
        alt
      >
        <div className="code">
          <div className="cbar">
            <b>ebuild.toml</b>
            <button
              type="button"
              onClick={() => copyCode(TOML_EXAMPLE)}
              className="eb-copy"
            >
              {copiedCode === TOML_EXAMPLE ? "Copied!" : "Copy all"}
            </button>
          </div>
          <pre tabIndex={0} role="region" aria-label="ebuild.toml example">
            {TOML_EXAMPLE}
          </pre>
        </div>
      </Section>

      {/* CAD Workflow Detail */}
      <Section
        id="cad"
        title="CAD → Firmware Pipeline"
        lead="The complete flow from KiCad schematic to simulated, validated, and deployed firmware — without touching a soldering iron until the very end."
        split
      >
        <ol className="eb-flow">
          {CAD_FLOW.map(node => (
            <li key={node.label} style={{ "--c": node.color } as CSSProperties}>
              <b>{node.label}</b>
              <span>{node.sub}</span>
            </li>
          ))}
        </ol>

        <div className="gnote eb-note">
          <strong>Key insight:</strong> Because you simulate with the same BSP
          that was generated from your schematic, the firmware that passes
          simulation will work on real hardware on the first flash — no &quot;it
          works in sim but not on hardware&quot; surprises. The virtual BME280
          on I²C1 address 0x76 behaves identically to the real chip.
        </div>
      </Section>

      {/* CTA */}
      <Band
        title="Start Building"
        lead="Install ebuild and create your first EoS project in under 5 minutes."
      >
        <Link href="/getting-started" className="btn pri">
          Getting Started Guide
        </Link>
        <Link href="/eflow" className="btn gh">
          Try eFlow Visual Editor{" "}
          <span className="ar" aria-hidden="true">
            →
          </span>
        </Link>
        <Link href="/product-ebuild" className="btn gh">
          eBuild engineering detail
        </Link>
      </Band>
    </BpPage>
  );
}
