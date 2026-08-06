import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { copyText } from "@/lib/clipboard";
import {
  Layers,
  ArrowRight,
  Play,
  Code,
  Cpu,
  Zap,
  GitBranch,
  Timer,
  Wifi,
  Brain,
  Package,
  CheckCircle2,
  ChevronRight,
  Monitor,
  Shield,
  Wrench,
  Copy,
  Star,
  Info,
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
    icon: Layers,
  },
  {
    step: "02",
    title: "Connect",
    desc: "Draw wires between block output ports and input ports. eFlow validates type compatibility in real time.",
    color: "#22D3EE",
    icon: GitBranch,
  },
  {
    step: "03",
    title: "Configure",
    desc: "Click any block to set its parameters: pin numbers, baud rates, thresholds, model paths, timer intervals.",
    color: "#A78BFA",
    icon: Wrench,
  },
  {
    step: "04",
    title: "Simulate",
    desc: "Click Run in eFlow to simulate the block diagram in-browser. Virtual GPIO pins respond, UART output appears in the console.",
    color: "#34D399",
    icon: Monitor,
  },
  {
    step: "05",
    title: "Generate",
    desc: "Click Generate Code. eFlow produces a complete, readable C source file that uses the EoS HAL — no magic, no black box.",
    color: "#F59E0B",
    icon: Code,
  },
  {
    step: "06",
    title: "Build",
    desc: "ebuild build compiles the generated code. The output is a standard .elf / .bin firmware image.",
    color: "#60A5FA",
    icon: Cpu,
  },
  {
    step: "07",
    title: "Validate",
    desc: "ebuild analyze runs stack depth analysis, MISRA checks, and memory overlap detection on the generated firmware.",
    color: "#F472B6",
    icon: Shield,
  },
  {
    step: "08",
    title: "Deploy",
    desc: "ebuild flash writes the firmware to your board via JTAG, SWD, or USB bootloader. ebuild monitor shows live output.",
    color: "#F97316",
    icon: Zap,
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

export default function EFlow() {
  const [activeCategory, setActiveCategory] = useState(0);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyCode = async (code: string) => {
    if (!(await copyText(code))) return;
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#080F1E]">
      {/* Hero */}
      <section className="relative py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628] to-[#080F1E]" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-[#A78BFA]/6 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#F97316]/5 rounded-full blur-[80px]" />
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
                background: "rgba(167,139,250,0.12)",
                border: "1px solid rgba(167,139,250,0.3)",
                color: "#A78BFA",
              }}
            >
              <Layers size={12} /> eFlow — Visual Programming
            </span>
          </motion.div>
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="font-heading font-black text-5xl sm:text-7xl text-white mb-6 leading-[1.02]"
          >
            Build Firmware
            <br />
            <span style={{ color: "#A78BFA" }}>Without Writing Code</span>
          </motion.h1>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="text-white/60 text-xl max-w-2xl mx-auto mb-8 leading-relaxed"
          >
            eFlow is EmbeddedOS's visual block programming environment. Drag
            GPIO, timer, AI, and protocol blocks onto a canvas, connect them
            with wires, and eFlow generates production-ready C code that runs on
            any EoS-supported board.
          </motion.p>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white transition-all active:scale-95"
              style={{
                background: "#A78BFA",
                boxShadow: "0 0 24px rgba(167,139,250,0.3)",
              }}
            >
              <Play size={16} /> Try eFlow Demo
            </Link>
            <Link
              href="/getting-started"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white/80 transition-all border border-white/15 hover:border-white/30"
            >
              Getting Started <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* What is eFlow */}
      <section className="pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-heading font-black text-3xl sm:text-4xl text-white mb-4">
              What is eFlow?
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto">
              eFlow is a node-based visual editor — the same paradigm used by
              Unreal Engine Blueprints, Node-RED, and Max/MSP — but designed
              specifically for embedded firmware on EmbeddedOS.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-3 gap-5 mb-12">
            {[
              {
                icon: Layers,
                color: "#A78BFA",
                title: "Block-Based",
                desc: "Every hardware capability is a block: GPIO, UART, I²C, SPI, ADC, PWM, timers, AI inference, PID controllers, filters. Drag them onto the canvas.",
              },
              {
                icon: GitBranch,
                color: "#22D3EE",
                title: "Wire-Connected",
                desc: "Draw wires between output ports and input ports. eFlow validates type compatibility in real time — you cannot connect incompatible blocks.",
              },
              {
                icon: Code,
                color: "#34D399",
                title: "Generates Real C",
                desc: "Click Generate and eFlow produces readable, HAL-idiomatic C code. No obfuscated output — you can read, modify, and extend the generated code.",
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  className="rounded-2xl border p-6"
                  style={{
                    background: `${item.color}08`,
                    borderColor: `${item.color}20`,
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: `${item.color}18` }}
                  >
                    <Icon size={22} style={{ color: item.color }} />
                  </div>
                  <h3 className="font-heading font-bold text-white text-lg mb-2">
                    {item.title}
                  </h3>
                  <p className="text-white/55 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Visual pipeline diagram */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="rounded-2xl border border-white/8 p-6 overflow-x-auto"
            style={{ background: "rgba(167,139,250,0.04)" }}
          >
            <div className="text-xs font-bold text-white/30 uppercase tracking-widest mb-4 text-center">
              Example: Temperature Sensor → UART Output
            </div>
            <div className="flex items-center gap-2 min-w-max mx-auto w-fit">
              {[
                { label: "Periodic Timer", sub: "1000ms", color: "#22D3EE" },
                { label: "I²C Read", sub: "BME280 0x76", color: "#34D399" },
                {
                  label: "Kalman Filter",
                  sub: "noise reduction",
                  color: "#A78BFA",
                },
                { label: "Threshold", sub: "> 30°C alert", color: "#F59E0B" },
                { label: "UART Write", sub: "115200 baud", color: "#F97316" },
              ].map((block, i, arr) => (
                <div key={block.label} className="flex items-center gap-2">
                  <div
                    className="rounded-xl border px-4 py-3 text-center min-w-[100px]"
                    style={{
                      background: `${block.color}12`,
                      borderColor: `${block.color}35`,
                    }}
                  >
                    <div className="text-xs font-bold text-white">
                      {block.label}
                    </div>
                    <div
                      className="text-[10px] mt-0.5"
                      style={{ color: block.color }}
                    >
                      {block.sub}
                    </div>
                  </div>
                  {i < arr.length - 1 && (
                    <div className="flex items-center gap-0.5">
                      <div className="w-6 h-0.5 bg-white/20" />
                      <ArrowRight size={10} className="text-white/30" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="text-center mt-4 text-xs text-white/30">
              ↓ eFlow generates this C code ↓
            </div>
            <div
              className="mt-3 rounded-xl border border-white/8 overflow-hidden"
              style={{ background: "rgba(5,10,20,0.9)" }}
            >
              <pre className="p-4 text-xs font-mono text-[#E6EDF3] overflow-x-auto leading-relaxed">{`void sensor_task(void *arg) {
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
}`}</pre>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 8-Step Pipeline */}
      <section className="pb-20 bg-[#060C1A]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-16">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-heading font-black text-3xl sm:text-4xl text-white mb-4">
              The 8-Step eFlow Pipeline
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              From blank canvas to flashed firmware in 8 steps. Each step is
              handled by eFlow and ebuild — no manual toolchain configuration
              needed.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PIPELINE.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.step}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  className="rounded-2xl border p-5"
                  style={{
                    background: `${step.color}06`,
                    borderColor: `${step.color}20`,
                  }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: `${step.color}18` }}
                    >
                      <Icon size={16} style={{ color: step.color }} />
                    </div>
                    <span
                      className="text-xs font-black"
                      style={{ color: step.color }}
                    >
                      {step.step}
                    </span>
                  </div>
                  <h3 className="font-heading font-bold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-white/50 text-xs leading-relaxed">
                    {step.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Block Library */}
      <section className="pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-16">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="font-heading font-black text-3xl sm:text-4xl text-white mb-4">
              Block Library
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              Every block generates a specific EoS HAL call. Click a block to
              see the generated C code.
            </p>
          </motion.div>

          {/* Category tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {BLOCK_TYPES.map((cat, i) => (
              <button
                key={cat.category}
                onClick={() => setActiveCategory(i)}
                className="px-4 py-2 rounded-xl text-sm font-bold transition-all"
                style={
                  activeCategory === i
                    ? { background: cat.color, color: "#000" }
                    : {
                        background: `${cat.color}12`,
                        color: cat.color,
                        border: `1px solid ${cat.color}25`,
                      }
                }
              >
                {cat.category}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {BLOCK_TYPES[activeCategory].blocks.map(block => (
                  <div
                    key={block.name}
                    className="rounded-2xl border p-4"
                    style={{
                      background: `${BLOCK_TYPES[activeCategory].color}06`,
                      borderColor: `${BLOCK_TYPES[activeCategory].color}20`,
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-heading font-bold text-white text-sm">
                        {block.name}
                      </h3>
                      <button
                        onClick={() => copyCode(block.code)}
                        className="flex items-center gap-1 text-[10px] text-white/30 hover:text-white/60 transition-colors"
                      >
                        {copiedCode === block.code ? (
                          <CheckCircle2 size={10} className="text-[#34D399]" />
                        ) : (
                          <Copy size={10} />
                        )}
                        {copiedCode === block.code ? "Copied" : "Copy"}
                      </button>
                    </div>
                    <p className="text-white/50 text-xs mb-3 leading-relaxed">
                      {block.desc}
                    </p>
                    <pre
                      className="rounded-lg p-2 text-[10px] font-mono overflow-x-auto"
                      style={{
                        background: "rgba(5,10,20,0.8)",
                        color: BLOCK_TYPES[activeCategory].color,
                      }}
                    >
                      {block.code}
                    </pre>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Use Cases */}
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
              Real-World Use Cases
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              Common embedded patterns that eFlow handles in minutes — no manual
              HAL calls, no register-level debugging.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 gap-5">
            {USE_CASES.map((uc, i) => (
              <motion.div
                key={uc.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="rounded-2xl border p-6"
                style={{
                  background: `${uc.color}06`,
                  borderColor: `${uc.color}20`,
                }}
              >
                <h3 className="font-heading font-bold text-white text-lg mb-2">
                  {uc.title}
                </h3>
                <p className="text-white/55 text-sm mb-4 leading-relaxed">
                  {uc.desc}
                </p>
                <div className="flex flex-wrap gap-2">
                  {uc.blocks.map((b, j) => (
                    <span
                      key={b}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium"
                      style={{ background: `${uc.color}15`, color: uc.color }}
                    >
                      {j > 0 && <ArrowRight size={9} />}
                      {b}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* eFlow vs Manual C */}
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
              eFlow vs Writing C Directly
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              eFlow is not a replacement for writing C — it is a faster starting
              point. Here is when to use each approach.
            </p>
          </motion.div>
          <div className="rounded-2xl border border-white/8 overflow-hidden">
            <div className="grid grid-cols-3 bg-white/5 border-b border-white/8 text-xs font-bold uppercase tracking-widest text-white/40">
              <div className="p-4">Aspect</div>
              <div
                className="p-4 border-l border-white/8"
                style={{ color: "#A78BFA" }}
              >
                eFlow (Visual)
              </div>
              <div
                className="p-4 border-l border-white/8"
                style={{ color: "#22D3EE" }}
              >
                Manual C
              </div>
            </div>
            {COMPARISON.map((row, i) => (
              <motion.div
                key={row.aspect}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="grid grid-cols-3 border-b border-white/5 last:border-0"
              >
                <div className="p-4 text-sm font-semibold text-white/60">
                  {row.aspect}
                </div>
                <div className="p-4 text-sm text-white/55 border-l border-white/5">
                  {row.eflow}
                </div>
                <div className="p-4 text-sm text-white/55 border-l border-white/5">
                  {row.manual}
                </div>
              </motion.div>
            ))}
          </div>
          <div
            className="mt-4 flex items-start gap-2 p-4 rounded-xl text-sm"
            style={{
              background: "rgba(167,139,250,0.08)",
              border: "1px solid rgba(167,139,250,0.2)",
            }}
          >
            <Info size={14} className="text-[#A78BFA] mt-0.5 shrink-0" />
            <span className="text-[#A78BFA]">
              <strong>Tip:</strong> Start with eFlow to prototype quickly, then
              use "Export to C" to get the generated code and extend it manually
              for performance-critical sections.
            </span>
          </div>
        </div>
      </section>

      {/* CAD Integration */}
      <section className="pb-20 bg-[#060C1A]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-16">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-10"
          >
            <h2 className="font-heading font-black text-3xl sm:text-4xl text-white mb-4 text-center">
              CAD + eFlow Integration
            </h2>
            <p className="text-white/50 max-w-xl mx-auto text-center">
              When you import a KiCad schematic via ebuild cad analyze, eFlow
              automatically populates all block pin fields with the correct pin
              names from your schematic. No manual lookup in the datasheet.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
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
            ].map((item, i) => (
              <motion.div
                key={item.step}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="rounded-2xl border p-6"
                style={{
                  background: `${item.color}08`,
                  borderColor: `${item.color}25`,
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 font-black text-lg"
                  style={{ background: `${item.color}20`, color: item.color }}
                >
                  {item.step}
                </div>
                <h3 className="font-heading font-bold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-white/55 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24 pt-16 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="font-heading font-black text-3xl text-white mb-4">
              Ready to Try eFlow?
            </h2>
            <p className="text-white/50 mb-8">
              Open the interactive simulator and run an eFlow block diagram in
              your browser — no install required.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/demo"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white transition-all active:scale-95"
                style={{
                  background: "#A78BFA",
                  boxShadow: "0 0 20px rgba(167,139,250,0.25)",
                }}
              >
                <Play size={16} /> Open eFlow Demo
              </Link>
              <Link
                href="/getting-started"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white/70 border border-white/15 hover:border-white/30 transition-all"
              >
                Getting Started Guide <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
