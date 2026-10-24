import {
  useState,
  useEffect,
  useRef,
  useCallback,
  lazy,
  Suspense,
  type CSSProperties,
} from "react";
import { Link } from "wouter";
import { RotateCcw } from "lucide-react";
import { BOARD_COUNT } from "@/data/stack";
import { BpPage, PageHero, Section } from "@/components/bp";
import "./Demo.css";
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
    code: `// EoS LED Blink — written against the real EoS HAL (eos/hal.h)
#include <eos/hal.h>
#include <stdio.h>

int main(void) {
    eos_hal_init();
    eos_gpio_config_t led = { .pin = 0, .mode = EOS_GPIO_OUTPUT };
    eos_gpio_init(&led);
    printf("LED blink started\\n");

    while (1) {
        eos_gpio_write(0, true);
        printf("PIN_0 -> HIGH\\n");
        eos_delay_ms(500);

        eos_gpio_write(0, false);
        printf("PIN_0 -> LOW\\n");
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
    code: `// EoS UART heartbeat — UART0 at 115200 baud, real EoS HAL
#include <eos/hal.h>
#include <stdio.h>
#include <string.h>

int main(void) {
    eos_hal_init();
    eos_uart_config_t uart = { .port = 0, .baudrate = 115200, .data_bits = 8 };
    eos_uart_init(&uart);
    uint32_t counter = 0;

    while (1) {
        char buf[64];
        int n = snprintf(buf, sizeof(buf),
            "EoS heartbeat #%lu\\r\\n", (unsigned long)counter++);
        eos_uart_write(0, (const uint8_t *)buf, (size_t)n);
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
    code: `// EoS GPIO Scanner — knight-rider pattern, real EoS HAL
#include <eos/hal.h>
#include <stdio.h>

#define PIN_COUNT 8

int main(void) {
    eos_hal_init();
    for (uint16_t i = 0; i < PIN_COUNT; i++) {
        eos_gpio_config_t cfg = { .pin = i, .mode = EOS_GPIO_OUTPUT };
        eos_gpio_init(&cfg);
    }
    int active = 0;

    while (1) {
        for (int i = 0; i < PIN_COUNT; i++)
            eos_gpio_write((uint16_t)i, i == active);

        printf("Active pin: %d -> HIGH\\n", active);
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
    <BpPage className="demo" style={{ "--c": board.color } as CSSProperties}>
      <PageHero
        sig
        label="Interactive Board Visualisation"
        title={
          <>
            See an EoS Program <span>Run</span>
            <br />
            Without Hardware
          </>
        }
        lead="An illustrative, in-browser visualisation of small EoS programs: toggle GPIO pins and watch console output. It does not compile or execute EoS. To boot the real kernel without hardware, use ebuild sim on QEMU (see Getting Started)."
      >
        <div className="ctas">
          <a
            href="https://github.com/embeddedos-org/EoSim"
            target="_blank"
            rel="noopener noreferrer"
            className="btn pri"
          >
            View EoSim on GitHub{" "}
            <span className="ar" aria-hidden="true">
              ↗
            </span>
          </a>
          <Link href="/docs" className="btn gh">
            Documentation{" "}
            <span className="ar" aria-hidden="true">
              →
            </span>
          </Link>
        </div>
      </PageHero>

      {/* The bench: choose a board and a program, run it, watch the instruments */}
      <Section
        wide
        tight
        className="demo-bench"
        ariaLabel="Board visualisation"
      >
        <div className="demo-bar">
          <div className="demo-grp">
            <p className="label">Target Board</p>
            <div className="demo-seg">
              {BOARDS.map((b, i) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setBoardIdx(i)}
                  aria-pressed={boardIdx === i}
                  className="demo-opt"
                  style={{ "--c": b.color } as CSSProperties}
                >
                  {b.name}
                </button>
              ))}
            </div>
          </div>
          <div className="demo-grp">
            <p className="label">Program</p>
            <div className="demo-seg">
              {PROGRAMS.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setProgramIdx(i)}
                  aria-pressed={programIdx === i}
                  className="demo-opt"
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>
          <div className="demo-run">
            <button
              type="button"
              onClick={start}
              disabled={running}
              className="btn or"
            >
              {running ? "Running…" : "Run"}
            </button>
            <button
              type="button"
              onClick={stop}
              disabled={!running}
              className="btn gh"
            >
              Stop
            </button>
            <button
              type="button"
              onClick={reset}
              aria-label="Reset simulation"
              title="Reset simulation"
              className="btn gh demo-reset"
            >
              <RotateCcw size={16} aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* The two instruments, given the room */}
        <div className="demo-scopes">
          <figure className="demo-scope">
            <figcaption>
              <b>PCB Signal Traces</b>
              <span>{BOARDS[boardIdx].name}</span>
            </figcaption>
            <div className="demo-cv">
              <Suspense fallback={<div className="demo-load">Loading...</div>}>
                <PCBTrace running={running} />
              </Suspense>
            </div>
          </figure>
          <figure className="demo-scope">
            <figcaption>
              <b className="nodot">
                <i
                  className={running ? "demo-live on" : "demo-live"}
                  aria-hidden="true"
                />
                Oscilloscope
              </b>
              <span>{PROGRAMS[programIdx].name}</span>
            </figcaption>
            <div className="demo-cv">
              <Suspense fallback={<div className="demo-load">Loading...</div>}>
                <Oscilloscope
                  program={PROGRAMS[programIdx].id as "blink" | "echo" | "gpio"}
                  running={running}
                  color={BOARDS[boardIdx].color}
                />
              </Suspense>
            </div>
          </figure>
        </div>

        <div className="demo-grid">
          {/* Left: the board and its pins */}
          <div className="demo-col">
            <div className="demo-panel demo-board">
              <div className="demo-bh">
                <div>
                  <div className="demo-bn">{board.name}</div>
                  <div className="demo-mcu">{board.mcu}</div>
                </div>
                <span className="demo-arch">{board.arch}</span>
              </div>
              <dl className="demo-specs">
                {[
                  { label: "Clock", value: board.freq },
                  { label: "Flash", value: board.flash },
                  { label: "RAM", value: board.ram },
                ].map(s => (
                  <div key={s.label}>
                    <dt>{s.label}</dt>
                    <dd>{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="demo-panel">
              <div className="demo-ph">
                <div className="demo-pt">GPIO Pins</div>
                <div className="demo-hint">
                  {running
                    ? "Read-only while running"
                    : "Click OUTPUT pins to toggle"}
                </div>
              </div>
              <div className="demo-pins">
                {pins.map(pin => (
                  <button
                    key={pin.id}
                    type="button"
                    onClick={() => togglePin(pin.id)}
                    disabled={pin.mode === "INPUT" || running}
                    className={[
                      "demo-pin",
                      pin.state === "HIGH" && "hi",
                      pin.mode === "INPUT" && "in",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    <span className="demo-pl">{pin.label}</span>
                    <span className="demo-ps">{pin.state}</span>
                    <span className="demo-pm">{pin.mode}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: the program and its serial output */}
          <div className="demo-col">
            <div className="code demo-code">
              <div className="cbar">
                <b>{program.name.toLowerCase().replace(/ /g, "_")}.c</b>
                <span>{program.desc}</span>
              </div>
              <pre tabIndex={0}>
                <code>{program.code}</code>
              </pre>
            </div>

            <div className="code demo-uart">
              <div className="cbar">
                <b>UART / Serial Output</b>
                <span className="demo-state">
                  <i
                    className={running ? "demo-live on ok" : "demo-live"}
                    aria-hidden="true"
                  />
                  {running ? "LIVE" : "IDLE"}
                </span>
              </div>
              <div ref={logBoxRef} className="demo-log" tabIndex={0}>
                {log.length === 0 && (
                  <div className="demo-empty">
                    Press Run to start simulation…
                  </div>
                )}
                {log.map(entry => (
                  <div key={entry.id} className={`demo-ln ${entry.level}`}>
                    <span className="demo-ts">{entry.ts}</span>
                    <span className="demo-msg">{entry.msg}</span>
                  </div>
                ))}
                <div ref={logEndRef} />
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* What the visualisation is, and where the real kernel runs */}
      <Section className="demo-facts">
        <ul className="cards">
          {[
            {
              title: `${BOARD_COUNT} Supported Boards`,
              desc: "STM32, ESP32, Raspberry Pi Pico, RISC-V, nRF52, i.MX RT and more, shown as board views. This is a visualisation, not an emulator.",
            },
            {
              title: "Real Kernel on QEMU",
              desc: "For real execution, ebuild sim builds your code with the EoS kernel and boots it on QEMU's Cortex-M3 machine.",
            },
            {
              title: "HIL Bridge Support",
              desc: "Connect EoSim to real hardware via the HIL bridge for hardware-in-the-loop testing workflows.",
            },
          ].map(f => (
            <li key={f.title}>
              <div className="card">
                <h2 className="demo-fh">{f.title}</h2>
                <p>{f.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>
    </BpPage>
  );
}
