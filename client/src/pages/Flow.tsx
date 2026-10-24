import type { CSSProperties } from "react";
import { Link } from "wouter";
import { BOARD_COUNT } from "@/data/stack";
import { BpPage, LocalNav, PageHero, Section } from "@/components/bp";
import "./Flow.css";

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
  },
  {
    name: "Unit Tests",
    desc: "Hardware-in-the-loop and simulation-based testing",
  },
  {
    name: "Integration Tests",
    desc: "Full system simulation with EoSim",
  },
  {
    name: "Deploy",
    desc: "Automated OTA deployment with rollback support",
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
    <BpPage className="flowpage">
      <PageHero
        sig
        label="eFlow Visual Programming"
        title={
          <>
            Build Embedded Systems <span>Visually</span>
          </>
        }
        lead={
          <>
            eFlow is EmbeddedOS's visual programming environment — drag,
            connect, and deploy firmware to {BOARD_COUNT} hardware targets
            without writing a single line of boilerplate.
          </>
        }
      >
        <div className="ctas">
          <Link href="/getting-started" className="btn pri">
            Try eFlow{" "}
            <span className="ar" aria-hidden="true">
              →
            </span>
          </Link>
          <Link href="/docs" className="btn gh">
            Documentation
          </Link>
        </div>
      </PageHero>

      <LocalNav
        name="eFlow"
        items={[
          { id: "pipeline", label: "Pipeline" },
          { id: "architecture", label: "Architecture" },
          { id: "ci-cd", label: "CI/CD" },
          { id: "targets", label: "Hardware" },
        ]}
      />

      <Section
        id="pipeline"
        title="From Idea to Deployed Firmware"
        lead="The complete 8-step eFlow build and deploy pipeline."
      >
        <ol className="steps num fl-steps">
          {BUILD_STEPS.map(step => (
            <li key={step.step}>
              <span className="n">{step.step}</span>
              <div>
                <span className="fl-step">Step {step.step}</span>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section
        id="architecture"
        title="Runtime Architecture"
        lead="The layered architecture that powers every EmbeddedOS deployment."
      >
        <ol className="fl-layers">
          {ARCH_LAYERS.map(layer => (
            <li
              key={layer.name}
              style={{ "--c": layer.color } as CSSProperties}
            >
              <span className="fl-layer">{layer.name}</span>
              <span className="fl-ldesc">{layer.desc}</span>
            </li>
          ))}
        </ol>
      </Section>

      <Section
        id="ci-cd"
        title="CI/CD Pipeline"
        lead="Four quality gates ensure every build is production-ready."
      >
        <ol className="cards four">
          {CI_GATES.map(gate => (
            <li key={gate.name}>
              <div className="card">
                <h3>{gate.name}</h3>
                <p>{gate.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section
        id="targets"
        title={<>{BOARD_COUNT} Hardware Targets</>}
        lead="14 CPU architectures supported across 5 hardware categories."
      >
        <ul className="cards fl-targets">
          {HARDWARE_TARGETS.map(cat => (
            <li key={cat.category}>
              <div className="card">
                <h3>{cat.category}</h3>
                <ul>
                  {cat.examples.map(ex => (
                    <li key={ex}>{ex}</li>
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
