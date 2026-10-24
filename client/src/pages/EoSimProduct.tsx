import { useState, type CSSProperties } from "react";
import { SIM_PLATFORM_COUNT } from "@/data/stack";
import { Link } from "wouter";
import { BpPage, PageHero, Section } from "@/components/bp";
import "./EoSimProduct.css";

const commands = [
  {
    cmd: "eosim list",
    desc: `List all ${SIM_PLATFORM_COUNT} simulation platforms from the registry. Supports --filter and --group flags.`,
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
    <BpPage className="eosimp">
      <PageHero
        sig
        label="EOSIM"
        title="EoSim"
        sub="The EmbeddedOS Hardware Simulator"
        lead={
          <>
            {SIM_PLATFORM_COUNT} virtual platforms, full peripheral simulation,
            hardware-in-the-loop bridge, and a CLI + GUI interface. Test your
            firmware without hardware.
          </>
        }
      >
        <div className="ctas">
          <Link href="/demo" className="btn pri">
            Try in Browser
          </Link>
          <Link href="/getting-started" className="btn gh">
            Getting Started
          </Link>
          <Link href="/product-eosim" className="btn gh">
            EoSim engineering detail
          </Link>
        </div>
      </PageHero>

      <Section
        title="CLI Reference"
        lead={
          <>
            All EoSim commands with examples. Run <code>eosim --help</code> for
            the full reference.
          </>
        }
      >
        <div className="es-cmds">
          {commands.map((c, i) => (
            <button
              key={c.cmd}
              type="button"
              onClick={() => setActiveCmd(i)}
              aria-pressed={activeCmd === i}
              className="btn gh"
            >
              {c.cmd}
            </button>
          ))}
        </div>
        <div className="code es-out">
          <div className="cbar">
            <span>{commands[activeCmd].desc}</span>
          </div>
          <pre className="wrapm">
            <span className="es-ps">$ </span>
            <span>{commands[activeCmd].example}</span>
          </pre>
        </div>
      </Section>

      <Section
        title={<>{SIM_PLATFORM_COUNT} Supported Platforms</>}
        lead="Full peripheral simulation including GPIO, UART, SPI, I²C, ADC, PWM, DMA, and interrupts."
      >
        <ul className="cards">
          {platforms.map(p => (
            <li key={p.family}>
              <div className="card" style={{ "--c": p.color } as CSSProperties}>
                <div className="top">
                  <h3>{p.family}</h3>
                  <span className="st">{p.count} boards</span>
                </div>
                <ul>
                  {p.boards.map(b => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </Section>
    </BpPage>
  );
}
