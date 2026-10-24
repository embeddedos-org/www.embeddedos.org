import { useState, type CSSProperties } from "react";
import { Link } from "wouter";
import { copyText } from "@/lib/clipboard";
import { moveTabFocus } from "@/lib/tablist";
import { Band, BpPage, LocalNav, PageHero, Section } from "@/components/bp";
import "./EFlow.css";

// ─── BLOCK TYPES ───────────────────────────────────────────────────────────
const BLOCK_TYPES = [
  {
    category: "I/O Blocks",
    color: "#F97316",
    blocks: [
      {
        name: "GPIO Output",
        desc: "Drive a pin HIGH or LOW. Connects to Timer or Logic blocks.",
        code: "eos_gpio_write(GPIO_PA5, HIGH);",
      },
      {
        name: "GPIO Input",
        desc: "Read a pin state. Outputs 0 or 1 to downstream blocks.",
        code: "uint8_t v = eos_gpio_read(GPIO_PC13);",
      },
      {
        name: "UART Write",
        desc: "Send a string or formatted value over UART.",
        code: 'eos_uart_printf(UART1, "val=%d\\n", x);',
      },
      {
        name: "ADC Read",
        desc: "Sample an analog pin in millivolts (0–3300mV).",
        code: "uint32_t mv = eos_adc_read_mv(ADC1_CH0);",
      },
      {
        name: "PWM Output",
        desc: "Set duty cycle (0–100%) on a PWM channel.",
        code: "eos_pwm_set_duty(PWM_CH0, duty);",
      },
    ],
  },
  {
    category: "Timing Blocks",
    color: "#22D3EE",
    blocks: [
      {
        name: "Periodic Timer",
        desc: "Fires an output signal at a fixed interval (ms). Drives loops.",
        code: "eos_task_delay_ms(500);",
      },
      {
        name: "One-Shot Timer",
        desc: "Fires once after a delay, then stops.",
        code: "eos_timer_once(1000, callback);",
      },
      {
        name: "Watchdog",
        desc: "Resets the device if not kicked within the timeout period.",
        code: "eos_wdt_kick();",
      },
    ],
  },
  {
    category: "Logic Blocks",
    color: "#A78BFA",
    blocks: [
      {
        name: "If / Else",
        desc: "Branches the data flow based on a condition.",
        code: "if (condition) { ... } else { ... }",
      },
      {
        name: "Counter",
        desc: "Increments on each input pulse. Resets at a configurable limit.",
        code: "static uint32_t count = 0; count++;",
      },
      {
        name: "Threshold",
        desc: "Outputs 1 when input exceeds a value, 0 otherwise.",
        code: "output = (input > threshold) ? 1 : 0;",
      },
      {
        name: "Map / Scale",
        desc: "Linearly maps an input range to an output range.",
        code: "out = (in - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;",
      },
    ],
  },
  {
    category: "Bus / Protocol Blocks",
    color: "#34D399",
    blocks: [
      {
        name: "I²C Read",
        desc: "Read N bytes from a device register over I²C.",
        code: "eos_i2c_read(I2C1, addr, reg, buf, len);",
      },
      {
        name: "I²C Write",
        desc: "Write bytes to a device register over I²C.",
        code: "eos_i2c_write(I2C1, addr, reg, data, len);",
      },
      {
        name: "SPI Transfer",
        desc: "Full-duplex SPI transaction.",
        code: "eos_spi_transfer(SPI1, tx, rx, len);",
      },
      {
        name: "CAN Frame",
        desc: "Send or receive a CAN bus frame.",
        code: "eos_can_send(CAN1, id, data, dlc);",
      },
    ],
  },
  {
    category: "AI / Compute Blocks",
    color: "#F59E0B",
    blocks: [
      {
        name: "TFLite Infer",
        desc: "Run a TFLite model on input tensor. Outputs classification or regression result.",
        code: "eai_infer(model, input_tensor, output_tensor);",
      },
      {
        name: "FFT",
        desc: "Fast Fourier Transform on a float array. Outputs frequency spectrum.",
        code: "eos_fft(samples, N, output_spectrum);",
      },
      {
        name: "PID Controller",
        desc: "Classic PID loop with configurable Kp, Ki, Kd.",
        code: "float out = eos_pid_update(&pid, setpoint, measured);",
      },
      {
        name: "Kalman Filter",
        desc: "1D Kalman filter for sensor fusion and noise reduction.",
        code: "float est = eos_kalman_update(&kf, measurement);",
      },
    ],
  },
];

// ─── PIPELINE STEPS ────────────────────────────────────────────────────────
const PIPELINE = [
  {
    step: "01",
    title: "Design",
    desc: "Open eFlow in your browser or via ebuild eflow open. Drag blocks from the palette onto the canvas.",
    color: "#F97316",
  },
  {
    step: "02",
    title: "Connect",
    desc: "Draw wires between block output ports and input ports. eFlow validates type compatibility in real time.",
    color: "#22D3EE",
  },
  {
    step: "03",
    title: "Configure",
    desc: "Click any block to set its parameters: pin numbers, baud rates, thresholds, model paths, timer intervals.",
    color: "#A78BFA",
  },
  {
    step: "04",
    title: "Simulate",
    desc: "Click Run in eFlow to simulate the block diagram in-browser. Virtual GPIO pins respond, UART output appears in the console.",
    color: "#34D399",
  },
  {
    step: "05",
    title: "Generate",
    desc: "Click Generate Code. eFlow produces a complete, readable C source file that uses the EoS HAL — no magic, no black box.",
    color: "#F59E0B",
  },
  {
    step: "06",
    title: "Build",
    desc: "ebuild build compiles the generated code. The output is a standard .elf / .bin firmware image.",
    color: "#60A5FA",
  },
  {
    step: "07",
    title: "Validate",
    desc: "ebuild analyze runs stack depth analysis, MISRA checks, and memory overlap detection on the generated firmware.",
    color: "#F472B6",
  },
  {
    step: "08",
    title: "Deploy",
    desc: "ebuild flash writes the firmware to your board via JTAG, SWD, or USB bootloader. ebuild monitor shows live output.",
    color: "#F97316",
  },
];

// ─── USE CASES ─────────────────────────────────────────────────────────────
const USE_CASES = [
  {
    title: "Sensor Data Pipeline",
    desc: "Read a BME280 temperature sensor over I²C every 1 second, apply a Kalman filter, and send the result over UART. No manual register manipulation needed.",
    blocks: [
      "Periodic Timer (1000ms)",
      "I²C Read (BME280, 0x76)",
      "Kalman Filter",
      "UART Write",
    ],
    color: "#34D399",
  },
  {
    title: "Motor Speed Controller",
    desc: "Read encoder pulses on a GPIO interrupt, compute RPM, run a PID loop against a setpoint, and output the corrected duty cycle to a PWM channel.",
    blocks: [
      "GPIO Input (encoder)",
      "Counter",
      "Map / Scale",
      "PID Controller",
      "PWM Output",
    ],
    color: "#F97316",
  },
  {
    title: "Edge AI Classifier",
    desc: "Sample an ADC microphone at 16kHz, run FFT to extract frequency features, feed into a TFLite keyword-spotting model, and toggle a GPIO on detection.",
    blocks: [
      "ADC Read (16kHz)",
      "FFT (512 samples)",
      "TFLite Infer",
      "Threshold",
      "GPIO Output",
    ],
    color: "#A78BFA",
  },
  {
    title: "CAN Bus Gateway",
    desc: "Receive CAN frames from a vehicle bus, parse the payload, apply a threshold check, and relay filtered data over UART to a host computer.",
    blocks: ["CAN Frame (receive)", "If / Else", "Threshold", "UART Write"],
    color: "#22D3EE",
  },
];

// ─── COMPARISON ────────────────────────────────────────────────────────────
const COMPARISON = [
  {
    aspect: "Learning curve",
    eflow: "Visual — no embedded C knowledge needed to start",
    manual:
      "Requires understanding of MCU datasheets, HAL APIs, and RTOS concepts",
  },
  {
    aspect: "Best for",
    eflow: "Prototyping, teaching, standard I/O patterns, sensor pipelines",
    manual: "Custom drivers, performance-critical code, complex state machines",
  },
  {
    aspect: "Code quality",
    eflow:
      "Generated code is readable, HAL-idiomatic C — same quality as hand-written",
    manual: "Full control over every line",
  },
  {
    aspect: "Debugging",
    eflow: "Visual simulation in-browser before flashing",
    manual: "GDB + hardware debugger",
  },
  {
    aspect: "Extensibility",
    eflow: "Custom blocks can be written in C and imported into eFlow",
    manual: "Unlimited — write anything",
  },
  {
    aspect: "CAD integration",
    eflow: "Pin names auto-populated from BSP / KiCad schematic",
    manual: "Manual pin assignment from datasheet",
  },
];

// ─── WHAT IS EFLOW ─────────────────────────────────────────────────────────
const PILLARS = [
  {
    title: "Block-Based",
    desc: "Every hardware capability is a block: GPIO, UART, I²C, SPI, ADC, PWM, timers, AI inference, PID controllers, filters. Drag them onto the canvas.",
  },
  {
    title: "Wire-Connected",
    desc: "Draw wires between output ports and input ports. eFlow validates type compatibility in real time — you cannot connect incompatible blocks.",
  },
  {
    title: "Generates Real C",
    desc: "Click Generate and eFlow produces readable, HAL-idiomatic C code. No obfuscated output — you can read, modify, and extend the generated code.",
  },
];

const EXAMPLE_FLOW = [
  { label: "Periodic Timer", sub: "1000ms", color: "#22D3EE" },
  { label: "I²C Read", sub: "BME280 0x76", color: "#34D399" },
  { label: "Kalman Filter", sub: "noise reduction", color: "#A78BFA" },
  { label: "Threshold", sub: "> 30°C alert", color: "#F59E0B" },
  { label: "UART Write", sub: "115200 baud", color: "#F97316" },
];

const EXAMPLE_C = `void sensor_task(void *arg) {
    eos_i2c_init(I2C1, 400000);
    eos_kalman_t kf = eos_kalman_init(0.1f, 1.0f);
    while (1) {
        float raw = bme280_read_temp(I2C1, 0x76);
        float filtered = eos_kalman_update(&kf, raw);
        if (filtered > 30.0f) {
            eos_uart_printf(UART1, "[ALERT] Temp=%.1f°C\\n", filtered);
        } else {
            eos_uart_printf(UART1, "Temp=%.1f°C\\n", filtered);
        }
        eos_task_delay_ms(1000);
    }
}`;

// ─── CAD INTEGRATION ───────────────────────────────────────────────────────
const CAD_STEPS = [
  {
    step: "1",
    title: "Import Schematic",
    desc: "Run ebuild cad analyze my-board.kicad_sch. ebuild reads your KiCad schematic and extracts all MCU pin assignments.",
    color: "#F97316",
  },
  {
    step: "2",
    title: "Auto-Populated Blocks",
    desc: "Open eFlow. Every GPIO, UART, SPI, and I²C block is pre-configured with the correct pin names from your schematic (e.g. UART_TX = PA9).",
    color: "#A78BFA",
  },
  {
    step: "3",
    title: "Simulate Your Real Board",
    desc: "Run the simulation. Virtual peripherals match your actual schematic — the BME280 on I²C1 address 0x76 responds exactly as it will on real hardware.",
    color: "#34D399",
  },
];

export default function EFlow() {
  const [activeCategory, setActiveCategory] = useState(0);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyCode = async (code: string) => {
    if (!(await copyText(code))) return;
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <BpPage className="eflow">
      <PageHero
        label="eFlow — Visual Programming"
        title={
          <>
            Build Firmware
            <br />
            Without Writing Code
          </>
        }
        lead="eFlow is EmbeddedOS's visual block programming environment. Drag GPIO, timer, AI, and protocol blocks onto a canvas, connect them with wires, and eFlow generates production-ready C code that runs on any EoS-supported board."
      >
        <div className="ctas">
          <Link href="/demo" className="btn pri">
            Try eFlow Demo
          </Link>
          <Link href="/getting-started" className="btn gh">
            Getting Started{" "}
            <span className="ar" aria-hidden="true">
              →
            </span>
          </Link>
        </div>
      </PageHero>

      <LocalNav
        name="eFlow"
        items={[
          { id: "what", label: "What is eFlow?" },
          { id: "pipeline", label: "Pipeline" },
          { id: "blocks", label: "Block Library" },
          { id: "use-cases", label: "Use Cases" },
          { id: "compare", label: "eFlow vs C" },
          { id: "cad", label: "CAD Integration" },
        ]}
      />

      {/* What is eFlow */}
      <Section
        id="what"
        title="What is eFlow?"
        lead="eFlow is a node-based visual editor — the same paradigm used by Unreal Engine Blueprints, Node-RED, and Max/MSP — but designed specifically for embedded firmware on EmbeddedOS."
        split
      >
        <ul className="cards">
          {PILLARS.map(item => (
            <li key={item.title}>
              <div className="card">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </li>
          ))}
        </ul>

        {/* Visual pipeline diagram */}
        <div className="ef-example">
          <p className="label">Example: Temperature Sensor → UART Output</p>
          <ol className="ef-flow">
            {EXAMPLE_FLOW.map(block => (
              <li
                key={block.label}
                style={{ "--c": block.color } as CSSProperties}
              >
                <b>{block.label}</b>
                <span>{block.sub}</span>
              </li>
            ))}
          </ol>
          <p className="ef-gen">↓ eFlow generates this C code ↓</p>
          <div className="code">
            {/* scrolls sideways on a phone, so a keyboard can reach it */}
            <pre
              tabIndex={0}
              role="region"
              aria-label="C code generated by eFlow"
            >
              {EXAMPLE_C}
            </pre>
          </div>
        </div>
      </Section>

      {/* 8-Step Pipeline */}
      <Section
        id="pipeline"
        title="The 8-Step eFlow Pipeline"
        lead="From blank canvas to flashed firmware in 8 steps. Each step is handled by eFlow and ebuild — no manual toolchain configuration needed."
        split
        alt
      >
        <ol className="steps num ef-steps">
          {PIPELINE.map(step => (
            <li key={step.step} style={{ "--c": step.color } as CSSProperties}>
              <span className="n">{step.step}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {/* Block Library */}
      <Section
        id="blocks"
        title="Block Library"
        lead="Every block generates a specific EoS HAL call. Click a block to see the generated C code."
        split
      >
        {/* Category tabs */}
        <div
          className="ctas ef-tabs"
          role="tablist"
          aria-label="Block categories"
          onKeyDown={moveTabFocus}
        >
          {BLOCK_TYPES.map((cat, i) => (
            <button
              key={cat.category}
              type="button"
              role="tab"
              id={`blocks-tab-${i}`}
              aria-selected={activeCategory === i}
              aria-controls={`blocks-panel-${i}`}
              tabIndex={activeCategory === i ? 0 : -1}
              onClick={() => setActiveCategory(i)}
              className="btn gh"
              style={{ "--c": cat.color } as CSSProperties}
            >
              {cat.category}
            </button>
          ))}
        </div>

        {BLOCK_TYPES.map((cat, i) => (
          <div
            key={cat.category}
            role="tabpanel"
            id={`blocks-panel-${i}`}
            aria-labelledby={`blocks-tab-${i}`}
            hidden={i !== activeCategory}
          >
            <ul className="cards">
              {cat.blocks.map(block => (
                <li key={block.name}>
                  <div className="card ef-block">
                    <div className="top">
                      <h3>{block.name}</h3>
                      <button
                        type="button"
                        onClick={() => copyCode(block.code)}
                        className="ef-copy"
                      >
                        {copiedCode === block.code ? "Copied" : "Copy"}
                      </button>
                    </div>
                    <p>{block.desc}</p>
                    <pre className="ef-snip">{block.code}</pre>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Section>

      {/* Use Cases */}
      <Section
        id="use-cases"
        title="Real-World Use Cases"
        lead="Common embedded patterns that eFlow handles in minutes — no manual HAL calls, no register-level debugging."
        split
        alt
      >
        <ul className="cards two">
          {USE_CASES.map(uc => (
            <li key={uc.title}>
              <div
                className="card"
                style={{ "--c": uc.color } as CSSProperties}
              >
                <h3>{uc.title}</h3>
                <p>{uc.desc}</p>
                <ol className="ef-chain">
                  {uc.blocks.map(b => (
                    <li key={b}>{b}</li>
                  ))}
                </ol>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      {/* eFlow vs Manual C */}
      <Section
        id="compare"
        title="eFlow vs Writing C Directly"
        lead="eFlow is not a replacement for writing C — it is a faster starting point. Here is when to use each approach."
        split
      >
        <div className="tbl">
          <table>
            <thead>
              <tr>
                <th scope="col">Aspect</th>
                <th scope="col">eFlow (Visual)</th>
                <th scope="col">Manual C</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map(row => (
                <tr key={row.aspect}>
                  <td>{row.aspect}</td>
                  <td>{row.eflow}</td>
                  <td>{row.manual}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="gnote ef-tip">
          <strong>Tip:</strong> Start with eFlow to prototype quickly, then use
          &quot;Export to C&quot; to get the generated code and extend it
          manually for performance-critical sections.
        </p>
      </Section>

      {/* CAD Integration */}
      <Section
        id="cad"
        title="CAD + eFlow Integration"
        lead="When you import a KiCad schematic via ebuild cad analyze, eFlow automatically populates all block pin fields with the correct pin names from your schematic. No manual lookup in the datasheet."
        split
        alt
      >
        <ol className="steps num ef-cad">
          {CAD_STEPS.map(item => (
            <li key={item.step} style={{ "--c": item.color } as CSSProperties}>
              <span className="n">{item.step}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {/* CTA */}
      <Band
        title="Ready to Try eFlow?"
        lead="Open the interactive simulator and run an eFlow block diagram in your browser — no install required."
      >
        <Link href="/demo" className="btn pri">
          Open eFlow Demo
        </Link>
        <Link href="/getting-started" className="btn gh">
          Getting Started Guide{" "}
          <span className="ar" aria-hidden="true">
            →
          </span>
        </Link>
      </Band>
    </BpPage>
  );
}
