import {
  useState,
  useEffect,
  useRef,
  useCallback,
  lazy,
  Suspense,
} from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cpu,
  Zap,
  Terminal,
  Play,
  Square,
  RotateCcw,
  ChevronRight,
  Radio,
  Wifi,
  Activity,
  AlertCircle,
  CheckCircle2,
  Github,
} from "lucide-react";
import { BOARD_COUNT } from "@/data/stack";
const PCBTrace = lazy(() => import("../components/PCBTrace"));
const Oscilloscope = lazy(() => import("../components/Oscilloscope"));

// ─── Types ───────────────────────────────────────────────────────────────────

type PinState = "HIGH" | "LOW";
type PinMode = "INPUT" | "OUTPUT";
interface Pin {
  id: number;
  label: string;
  mode: PinMode;
  state: PinState;
  pwm?: number;
}
interface LogEntry {
  id: number;
  ts: string;
  level: "info" | "warn" | "error" | "ok";
  msg: string;
}

// ─── Board definitions ────────────────────────────────────────────────────────

const BOARDS = [
  {
    id: "stm32f4",
    name: "STM32F4 Discovery",
    mcu: "STM32F407VGT6",
    arch: "ARM Cortex-M4",
    freq: "168 MHz",
    flash: "1 MB",
    ram: "192 KB",
    color: "#22D3EE",
    pins: [
      {
        id: 0,
        label: "PA0",
        mode: "OUTPUT" as PinMode,
        state: "LOW" as PinState,
      },
      {
        id: 1,
        label: "PA1",
        mode: "OUTPUT" as PinMode,
        state: "LOW" as PinState,
      },
      {
        id: 2,
        label: "PB0",
        mode: "OUTPUT" as PinMode,
        state: "LOW" as PinState,
      },
      {
        id: 3,
        label: "PB1",
        mode: "INPUT" as PinMode,
        state: "LOW" as PinState,
      },
      {
        id: 4,
        label: "PC0",
        mode: "OUTPUT" as PinMode,
        state: "LOW" as PinState,
      },
      {
        id: 5,
        label: "PC1",
        mode: "OUTPUT" as PinMode,
        state: "LOW" as PinState,
      },
      {
        id: 6,
        label: "PD0",
        mode: "INPUT" as PinMode,
        state: "LOW" as PinState,
      },
      {
        id: 7,
        label: "PD1",
        mode: "OUTPUT" as PinMode,
        state: "LOW" as PinState,
      },
    ],
  },
  {
    id: "esp32",
    name: "ESP32 DevKit",
    mcu: "ESP32-D0WDQ6",
    arch: "Xtensa LX6 (dual-core)",
    freq: "240 MHz",
    flash: "4 MB",
    ram: "520 KB",
    color: "#34D399",
    pins: [
      {
        id: 0,
        label: "GPIO2",
        mode: "OUTPUT" as PinMode,
        state: "LOW" as PinState,
      },
      {
        id: 1,
        label: "GPIO4",
        mode: "OUTPUT" as PinMode,
        state: "LOW" as PinState,
      },
      {
        id: 2,
        label: "GPIO5",
        mode: "OUTPUT" as PinMode,
        state: "LOW" as PinState,
      },
      {
        id: 3,
        label: "GPIO12",
        mode: "INPUT" as PinMode,
        state: "LOW" as PinState,
      },
      {
        id: 4,
        label: "GPIO13",
        mode: "OUTPUT" as PinMode,
        state: "LOW" as PinState,
      },
      {
        id: 5,
        label: "GPIO14",
        mode: "INPUT" as PinMode,
        state: "LOW" as PinState,
      },
      {
        id: 6,
        label: "GPIO16",
        mode: "OUTPUT" as PinMode,
        state: "LOW" as PinState,
      },
      {
        id: 7,
        label: "GPIO17",
        mode: "OUTPUT" as PinMode,
        state: "LOW" as PinState,
      },
    ],
  },
  {
    id: "rpi-pico",
    name: "Raspberry Pi Pico",
    mcu: "RP2040",
    arch: "ARM Cortex-M0+ (dual-core)",
    freq: "133 MHz",
    flash: "2 MB",
    ram: "264 KB",
    color: "#A78BFA",
    pins: [
      {
        id: 0,
        label: "GP0",
        mode: "OUTPUT" as PinMode,
        state: "LOW" as PinState,
      },
      {
        id: 1,
        label: "GP1",
        mode: "OUTPUT" as PinMode,
        state: "LOW" as PinState,
      },
      {
        id: 2,
        label: "GP2",
        mode: "INPUT" as PinMode,
        state: "LOW" as PinState,
      },
      {
        id: 3,
        label: "GP3",
        mode: "OUTPUT" as PinMode,
        state: "LOW" as PinState,
      },
      {
        id: 4,
        label: "GP4",
        mode: "OUTPUT" as PinMode,
        state: "LOW" as PinState,
      },
      {
        id: 5,
        label: "GP5",
        mode: "INPUT" as PinMode,
        state: "LOW" as PinState,
      },
      {
        id: 6,
        label: "GP6",
        mode: "OUTPUT" as PinMode,
        state: "LOW" as PinState,
      },
      {
        id: 7,
        label: "GP7",
        mode: "OUTPUT" as PinMode,
        state: "LOW" as PinState,
      },
    ],
  },
];

// ─── Sample programs ──────────────────────────────────────────────────────────

const PROGRAMS = [
  {
    id: "blink",
    name: "LED Blink",
    desc: "Toggles an output pin at 1 Hz",
    code: `// EoS LED Blink — runs on every supported board
#include <eos/gpio.h>
#include <eos/time.h>

int main(void) {
    eos_gpio_set_mode(PIN_0, GPIO_OUTPUT);
    eos_log("EoSim: LED blink started");

    while (1) {
        eos_gpio_write(PIN_0, GPIO_HIGH);
        eos_log("PIN_0 → HIGH");
        eos_delay_ms(500);

        eos_gpio_write(PIN_0, GPIO_LOW);
        eos_log("PIN_0 → LOW");
        eos_delay_ms(500);
    }
}`,
    run: (
      pins: Pin[],
      setLog: (fn: (l: LogEntry[]) => LogEntry[]) => void,
      tick: number
    ) => {
      const isHigh = Math.floor(tick / 5) % 2 === 0;
      const newPins = pins.map(p =>
        p.id === 0 ? { ...p, state: isHigh ? "HIGH" : ("LOW" as PinState) } : p
      );
      if (tick % 5 === 0) {
        const state = isHigh ? "HIGH" : "LOW";
        setLog(l => [
          ...l.slice(-49),
          {
            id: Date.now(),
            ts: new Date().toLocaleTimeString(),
            level: "ok" as const,
            msg: `PIN_0 → ${state}`,
          },
        ]);
      }
      return newPins;
    },
  },
  {
    id: "uart",
    name: "UART Echo",
    desc: "Sends periodic messages over UART0",
    code: `// EoS UART Echo — UART0 at 115200 baud
#include <eos/uart.h>
#include <eos/time.h>

int main(void) {
    eos_uart_init(UART0, 115200);
    eos_log("UART0 initialized at 115200 baud");
    uint32_t counter = 0;

    while (1) {
        char buf[64];
        snprintf(buf, sizeof(buf),
            "EoS heartbeat #%u\\r\\n", counter++);
        eos_uart_write(UART0, buf, strlen(buf));
        eos_log("TX: %s", buf);
        eos_delay_ms(1000);
    }
}`,
    run: (
      pins: Pin[],
      setLog: (fn: (l: LogEntry[]) => LogEntry[]) => void,
      tick: number
    ) => {
      if (tick % 10 === 0) {
        const count = Math.floor(tick / 10);
        setLog(l => [
          ...l.slice(-49),
          {
            id: Date.now(),
            ts: new Date().toLocaleTimeString(),
            level: "info" as const,
            msg: `UART0 TX: "EoS heartbeat #${count}\\r\\n"`,
          },
        ]);
      }
      return pins;
    },
  },
  {
    id: "gpio-scan",
    name: "GPIO Scanner",
    desc: "Cycles through all output pins sequentially",
    code: `// EoS GPIO Scanner — knight-rider pattern
#include <eos/gpio.h>
#include <eos/time.h>

#define PIN_COUNT 8

int main(void) {
    for (int i = 0; i < PIN_COUNT; i++)
        eos_gpio_set_mode(i, GPIO_OUTPUT);

    eos_log("GPIO scanner started");
    int active = 0;

    while (1) {
        for (int i = 0; i < PIN_COUNT; i++)
            eos_gpio_write(i, i == active ? GPIO_HIGH : GPIO_LOW);

        eos_log("Active pin: %d → HIGH", active);
        active = (active + 1) % PIN_COUNT;
        eos_delay_ms(200);
    }
}`,
    run: (
      pins: Pin[],
      setLog: (fn: (l: LogEntry[]) => LogEntry[]) => void,
      tick: number
    ) => {
      const active = tick % 8;
      const newPins = pins.map(p => ({
        ...p,
        state:
          p.mode === "OUTPUT" && p.id === active ? "HIGH" : ("LOW" as PinState),
      }));
      if (tick % 2 === 0) {
        setLog(l => [
          ...l.slice(-49),
          {
            id: Date.now(),
            ts: new Date().toLocaleTimeString(),
            level: "ok" as const,
            msg: `Active pin: ${active} → HIGH`,
          },
        ]);
      }
      return newPins;
    },
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

// ─── Component ────────────────────────────────────────────────────────────────

export default function Demo() {
  const [boardIdx, setBoardIdx] = useState(0);
  const [programIdx, setProgramIdx] = useState(0);
  const [running, setRunning] = useState(false);
  const [pins, setPins] = useState<Pin[]>(BOARDS[0].pins);
  const [log, setLog] = useState<LogEntry[]>([]);
  // The tick count lives only in a ref: it is passed to program.run() but never
  // rendered, so holding it in state re-rendered the page every 100ms for
  // nothing.
  const tickRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const logEndRef = useRef<HTMLDivElement>(null);
  const logBoxRef = useRef<HTMLDivElement>(null);

  const board = BOARDS[boardIdx];
  const program = PROGRAMS[programIdx];

  // Declared before the effect that calls it. It previously sat below, which
  // worked only because effect bodies run after the whole render has evaluated
  // — a dependency on statement order that reads like a bug.
  const stop = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    setRunning(false);
  }, []);

  // Reset when board or program changes
  useEffect(() => {
    stop();
    setPins(
      BOARDS[boardIdx].pins.map(p => ({ ...p, state: "LOW" as PinState }))
    );
    setLog([]);
    tickRef.current = 0;
  }, [boardIdx, programIdx, stop]);

  // Keep the newest line in view, by scrolling the log box itself.
  //
  // This used to call logEndRef.scrollIntoView(), which scrolls *every*
  // ancestor scroll container — including the document. The effect also runs
  // on mount, when the board reset clears the log, so merely opening /demo
  // dragged the page down to y≈1086 and the visitor arrived below the heading.
  // Setting scrollTop moves only the box.
  useEffect(() => {
    const box = logBoxRef.current;
    if (!box || log.length === 0) return;
    box.scrollTop = box.scrollHeight;
  }, [log]);

  const start = useCallback(() => {
    if (running) return;
    setRunning(true);
    setLog(l => [
      ...l,
      {
        id: Date.now(),
        ts: new Date().toLocaleTimeString(),
        level: "info",
        msg: `EoSim: running "${program.name}" on ${board.name}`,
      },
    ]);
    intervalRef.current = setInterval(() => {
      tickRef.current += 1;
      const t = tickRef.current;
      setPins(prev => program.run(prev, setLog, t));
    }, 100);
  }, [running, program, board]);

  const reset = useCallback(() => {
    stop();
    setPins(
      BOARDS[boardIdx].pins.map(p => ({ ...p, state: "LOW" as PinState }))
    );
    setLog([]);
    tickRef.current = 0;
  }, [boardIdx, stop]);

  // Cleanup on unmount
  useEffect(
    () => () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    },
    []
  );

  const togglePin = (pinId: number) => {
    if (running) return;
    setPins(prev =>
      prev.map(p =>
        p.id === pinId && p.mode === "OUTPUT"
          ? { ...p, state: p.state === "HIGH" ? "LOW" : "HIGH" }
          : p
      )
    );
  };

  return (
    <div className="min-h-screen bg-[#080F1E]">
      {/* Hero */}
      <section className="relative py-14 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628] to-[#080F1E]" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
          >
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-5"
              style={{
                background: "rgba(34,211,238,0.12)",
                border: "1px solid rgba(34,211,238,0.3)",
                color: "#22D3EE",
              }}
            >
              <Cpu size={12} /> EoSim — In-Browser Board Simulator
            </span>
          </motion.div>
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="font-heading font-black text-4xl sm:text-5xl text-white mb-4 leading-tight"
          >
            Simulate{" "}
            <span style={{ color: "#22D3EE" }}>{BOARD_COUNT} Boards</span>
            <br />
            Without Hardware
          </motion.h1>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="text-white/60 text-lg max-w-2xl mx-auto mb-6"
          >
            Run real EoS firmware code in your browser. Toggle GPIO pins, watch
            UART output, and test your programs on STM32, ESP32, Raspberry Pi
            Pico, and more — no hardware required.
          </motion.p>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
            className="flex flex-wrap justify-center gap-3"
          >
            <a
              href="https://github.com/embeddedos-org/EoSim"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all hover:opacity-90 active:scale-95"
              style={{ background: "#22D3EE", color: "#080F1E" }}
            >
              <Github size={15} /> View EoSim on GitHub
            </a>
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm border border-white/15 text-white/70 hover:bg-white/5 transition-all"
            >
              Documentation <ChevronRight size={14} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Simulator */}
      <section className="pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* PCB Trace + Oscilloscope visualization row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
            {/* PCB Signal Trace */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0}
              className="rounded-2xl border overflow-hidden"
              style={{
                background: "rgba(5,10,20,0.9)",
                borderColor: `${BOARDS[boardIdx].color}30`,
                height: 220,
              }}
            >
              <div
                className="flex items-center gap-2 px-4 py-2.5 border-b"
                style={{ borderColor: `${BOARDS[boardIdx].color}20` }}
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: BOARDS[boardIdx].color }}
                />
                <span
                  className="text-xs font-mono font-bold"
                  style={{ color: BOARDS[boardIdx].color }}
                >
                  PCB Signal Traces
                </span>
                <span className="ml-auto text-[10px] text-white/25 font-mono">
                  {BOARDS[boardIdx].name}
                </span>
              </div>
              <div style={{ height: 180 }}>
                <Suspense
                  fallback={
                    <div className="w-full h-full flex items-center justify-center text-white/20 text-xs">
                      Loading...
                    </div>
                  }
                >
                  <PCBTrace running={running} />
                </Suspense>
              </div>
            </motion.div>
            {/* Oscilloscope */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={1}
              className="rounded-2xl border overflow-hidden"
              style={{
                background: "rgba(5,10,20,0.9)",
                borderColor: "rgba(34,211,238,0.2)",
                height: 220,
              }}
            >
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#22D3EE]/15">
                <div
                  className={`w-2 h-2 rounded-full transition-all ${running ? "bg-[#22D3EE] animate-pulse" : "bg-white/20"}`}
                />
                <span className="text-xs font-mono font-bold text-[#22D3EE]">
                  Oscilloscope
                </span>
                <span className="ml-auto text-[10px] text-white/25 font-mono">
                  {PROGRAMS[programIdx].name}
                </span>
              </div>
              <div style={{ height: 180 }}>
                <Suspense
                  fallback={
                    <div className="w-full h-full flex items-center justify-center text-white/20 text-xs">
                      Loading...
                    </div>
                  }
                >
                  <Oscilloscope
                    program={
                      PROGRAMS[programIdx].id as "blink" | "echo" | "gpio"
                    }
                    running={running}
                    color={BOARDS[boardIdx].color}
                  />
                </Suspense>
              </div>
            </motion.div>
          </div>

          {/* Board + Program selectors */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            {/* Board selector */}
            <div className="flex-1">
              <div className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2">
                Target Board
              </div>
              <div className="flex flex-wrap gap-2">
                {BOARDS.map((b, i) => (
                  <button
                    key={b.id}
                    onClick={() => setBoardIdx(i)}
                    className="px-3 py-2 rounded-lg text-sm font-semibold transition-all"
                    style={
                      boardIdx === i
                        ? { background: b.color, color: "#080F1E" }
                        : {
                            background: "rgba(255,255,255,0.05)",
                            color: "rgba(255,255,255,0.5)",
                            border: "1px solid rgba(255,255,255,0.1)",
                          }
                    }
                  >
                    {b.name}
                  </button>
                ))}
              </div>
            </div>
            {/* Program selector */}
            <div className="flex-1">
              <div className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2">
                Program
              </div>
              <div className="flex flex-wrap gap-2">
                {PROGRAMS.map((p, i) => (
                  <button
                    key={p.id}
                    onClick={() => setProgramIdx(i)}
                    className="px-3 py-2 rounded-lg text-sm font-semibold transition-all"
                    style={
                      programIdx === i
                        ? { background: "#F97316", color: "#fff" }
                        : {
                            background: "rgba(255,255,255,0.05)",
                            color: "rgba(255,255,255,0.5)",
                            border: "1px solid rgba(255,255,255,0.1)",
                          }
                    }
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main simulator grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Left: Board info + GPIO */}
            <div className="space-y-4">
              {/* Board info card */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={0}
                className="rounded-2xl border p-5"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  borderColor: `${board.color}30`,
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${board.color}20` }}
                  >
                    <Cpu size={20} style={{ color: board.color }} />
                  </div>
                  <div>
                    <div className="font-heading font-bold text-white text-lg">
                      {board.name}
                    </div>
                    <div className="text-xs text-white/40">{board.mcu}</div>
                  </div>
                  <div className="ml-auto">
                    <span
                      className="text-xs font-bold px-2 py-1 rounded-full"
                      style={{
                        background: `${board.color}20`,
                        color: board.color,
                      }}
                    >
                      {board.arch}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    {
                      label: "Clock",
                      value: board.freq,
                      icon: <Zap size={12} />,
                    },
                    {
                      label: "Flash",
                      value: board.flash,
                      icon: <Radio size={12} />,
                    },
                    {
                      label: "RAM",
                      value: board.ram,
                      icon: <Activity size={12} />,
                    },
                  ].map(s => (
                    <div
                      key={s.label}
                      className="rounded-lg p-3 text-center"
                      style={{ background: "rgba(255,255,255,0.04)" }}
                    >
                      <div className="flex items-center justify-center gap-1 text-white/40 text-xs mb-1">
                        {s.icon} {s.label}
                      </div>
                      <div className="font-bold text-white text-sm">
                        {s.value}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* GPIO pins */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={1}
                className="rounded-2xl border p-5"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  borderColor: "rgba(255,255,255,0.08)",
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="font-heading font-bold text-white">
                    GPIO Pins
                  </div>
                  <div className="text-xs text-white/40">
                    {running
                      ? "Read-only while running"
                      : "Click OUTPUT pins to toggle"}
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {pins.map(pin => (
                    <button
                      key={pin.id}
                      onClick={() => togglePin(pin.id)}
                      disabled={pin.mode === "INPUT" || running}
                      className="rounded-xl p-3 text-center transition-all"
                      style={{
                        background:
                          pin.state === "HIGH"
                            ? `${board.color}25`
                            : "rgba(255,255,255,0.04)",
                        border: `1px solid ${pin.state === "HIGH" ? board.color + "60" : "rgba(255,255,255,0.08)"}`,
                        cursor:
                          pin.mode === "INPUT" || running
                            ? "default"
                            : "pointer",
                        opacity: pin.mode === "INPUT" ? 0.6 : 1,
                      }}
                    >
                      <div
                        className="text-xs font-bold mb-1"
                        style={{
                          color:
                            pin.state === "HIGH"
                              ? board.color
                              : "rgba(255,255,255,0.5)",
                        }}
                      >
                        {pin.label}
                      </div>
                      <div className="flex items-center justify-center gap-1">
                        <div
                          className="w-2 h-2 rounded-full transition-all"
                          style={{
                            background:
                              pin.state === "HIGH"
                                ? board.color
                                : "rgba(255,255,255,0.2)",
                          }}
                        />
                        <span
                          className="text-[10px]"
                          style={{
                            color:
                              pin.state === "HIGH"
                                ? board.color
                                : "rgba(255,255,255,0.3)",
                          }}
                        >
                          {pin.state}
                        </span>
                      </div>
                      <div className="text-[9px] text-white/25 mt-0.5">
                        {pin.mode}
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Controls */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={2}
                className="flex gap-3"
              >
                <button
                  onClick={start}
                  disabled={running}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm transition-all active:scale-95 disabled:opacity-40"
                  style={{
                    background: running ? "rgba(34,211,238,0.1)" : "#22D3EE",
                    color: running ? "#22D3EE" : "#080F1E",
                  }}
                >
                  <Play size={16} /> {running ? "Running…" : "Run"}
                </button>
                <button
                  onClick={stop}
                  disabled={!running}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm transition-all active:scale-95 disabled:opacity-40"
                  style={{
                    background: "rgba(248,81,73,0.15)",
                    color: "#F85149",
                    border: "1px solid rgba(248,81,73,0.3)",
                  }}
                >
                  <Square size={16} /> Stop
                </button>
                <button
                  onClick={reset}
                  aria-label="Reset simulation"
                  title="Reset simulation"
                  className="px-4 py-3 rounded-xl font-bold text-sm transition-all active:scale-95"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    color: "rgba(255,255,255,0.5)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <RotateCcw size={16} />
                </button>
              </motion.div>
            </div>

            {/* Right: Code + UART log */}
            <div className="space-y-4">
              {/* Code viewer */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={0}
                className="rounded-2xl border overflow-hidden"
                style={{
                  background: "#0D1117",
                  borderColor: "rgba(255,255,255,0.08)",
                }}
              >
                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#F85149]/60" />
                    <div className="w-3 h-3 rounded-full bg-[#F0883E]/60" />
                    <div className="w-3 h-3 rounded-full bg-[#3FB950]/60" />
                  </div>
                  <div className="text-xs text-white/30 ml-2 font-mono">
                    {program.name.toLowerCase().replace(/ /g, "_")}.c
                  </div>
                  <div className="ml-auto text-xs text-white/20">
                    {program.desc}
                  </div>
                </div>
                <pre
                  className="p-4 text-xs font-mono text-white/70 overflow-x-auto leading-relaxed"
                  style={{ maxHeight: "280px", overflowY: "auto" }}
                >
                  <code>{program.code}</code>
                </pre>
              </motion.div>

              {/* UART / log output */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={1}
                className="rounded-2xl border overflow-hidden"
                style={{
                  background: "#0A0F1A",
                  borderColor: "rgba(255,255,255,0.08)",
                }}
              >
                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
                  <Terminal size={14} className="text-white/40" />
                  <div className="text-xs text-white/40 font-mono">
                    UART / Serial Output
                  </div>
                  <div className="ml-auto flex items-center gap-1.5">
                    <div
                      className={`w-2 h-2 rounded-full transition-all ${running ? "bg-[#3FB950] animate-pulse" : "bg-white/20"}`}
                    />
                    <span className="text-[10px] text-white/30">
                      {running ? "LIVE" : "IDLE"}
                    </span>
                  </div>
                </div>
                <div
                  ref={logBoxRef}
                  className="p-4 font-mono text-xs space-y-1 overflow-y-auto"
                  style={{ height: "240px" }}
                >
                  <AnimatePresence initial={false}>
                    {log.length === 0 && (
                      <div className="text-white/20 text-center pt-8">
                        Press Run to start simulation…
                      </div>
                    )}
                    {log.map(entry => (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.15 }}
                        className="flex items-start gap-2"
                      >
                        <span className="text-white/20 shrink-0">
                          {entry.ts}
                        </span>
                        {entry.level === "ok" && (
                          <CheckCircle2
                            size={12}
                            className="text-[#3FB950] shrink-0 mt-0.5"
                          />
                        )}
                        {entry.level === "info" && (
                          <Wifi
                            size={12}
                            className="text-[#22D3EE] shrink-0 mt-0.5"
                          />
                        )}
                        {entry.level === "warn" && (
                          <AlertCircle
                            size={12}
                            className="text-[#F0883E] shrink-0 mt-0.5"
                          />
                        )}
                        {entry.level === "error" && (
                          <AlertCircle
                            size={12}
                            className="text-[#F85149] shrink-0 mt-0.5"
                          />
                        )}
                        <span
                          style={{
                            color:
                              entry.level === "ok"
                                ? "#3FB950"
                                : entry.level === "info"
                                  ? "#22D3EE"
                                  : entry.level === "warn"
                                    ? "#F0883E"
                                    : "#F85149",
                          }}
                        >
                          {entry.msg}
                        </span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  <div ref={logEndRef} />
                </div>
              </motion.div>
            </div>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            {[
              {
                icon: <Cpu size={20} />,
                color: "#22D3EE",
                title: `${BOARD_COUNT} Supported Boards`,
                desc: "STM32, ESP32, Raspberry Pi Pico, RISC-V, nRF52, i.MX RT, and more — all simulated in-browser.",
              },
              {
                icon: <Zap size={20} />,
                color: "#F97316",
                title: "Real EoS API Surface",
                desc: "Programs use the same eos/gpio.h, eos/uart.h, and eos/time.h headers as production firmware.",
              },
              {
                icon: <Activity size={20} />,
                color: "#A78BFA",
                title: "HIL Bridge Support",
                desc: "Connect EoSim to real hardware via the HIL bridge for hardware-in-the-loop testing workflows.",
              },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="rounded-2xl border p-5"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  borderColor: "rgba(255,255,255,0.07)",
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: `${f.color}15` }}
                >
                  <span style={{ color: f.color }}>{f.icon}</span>
                </div>
                <div className="font-heading font-bold text-white mb-1">
                  {f.title}
                </div>
                <div className="text-white/50 text-sm leading-relaxed">
                  {f.desc}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
