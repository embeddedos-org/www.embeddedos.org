import type { CSSProperties } from "react";
import { Link } from "wouter";
import { BOARD_COUNT } from "@/data/stack";
import { BpPage, LocalNav, PageHero } from "@/components/bp";
import "./BuildingOS.css";

/** An anchor id for a chapter: "Secure Boot Chain" → "secure-boot-chain". */
const chapterId = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const sections = [
  {
    num: "01",
    title: "Why Build a New OS?",
    color: "#F97316",
    content:
      "Most embedded systems run bare-metal code or a simple RTOS like FreeRTOS. These work well for simple devices but break down as complexity grows: no memory isolation, no security model, no standard driver interface, no update mechanism. EmbeddedOS was designed to solve these problems without sacrificing the determinism and small footprint that embedded developers need.",
    points: [
      "Memory isolation between tasks using MPU/MMU",
      "Capability-based security model (no ambient authority)",
      `Standard HAL — same driver code on ${BOARD_COUNT} boards`,
      "Secure OTA with cryptographic verification",
    ],
  },
  {
    num: "02",
    title: "Kernel Architecture",
    color: "#22D3EE",
    content:
      "EoS uses a microkernel architecture: the kernel only handles task scheduling, memory management, and IPC. Everything else — drivers, filesystems, networking — runs as isolated services in unprivileged mode. This means a buggy driver cannot corrupt the kernel or other services.",
    points: [
      "Preemptive priority scheduler (256 priority levels)",
      "MPU-enforced memory isolation between services",
      "EIPC for zero-copy inter-service communication",
      "Kernel footprint: 48 KB flash, 8 KB RAM minimum",
    ],
  },
  {
    num: "03",
    title: "Secure Boot Chain",
    color: "#A855F7",
    content:
      "Every EoS device boots through a 4-stage verified chain: ROM bootloader → eBoot → EoS kernel → user applications. Each stage verifies the cryptographic signature of the next before executing it. A compromised application cannot affect the kernel; a compromised kernel cannot affect eBoot.",
    points: [
      "ROM → eBoot: RSA-4096 or ECDSA-P384 signature",
      "eBoot → EoS: SHA-256 hash + Ed25519 signature",
      "EoS → Apps: per-app capability manifest + signature",
      "Anti-rollback counter stored in OTP fuses",
    ],
  },
  {
    num: "04",
    title: "Inter-Process Communication",
    color: "#34D399",
    content:
      "EIPC is the backbone of EoS. Every service call — reading a sensor, writing to flash, sending a network packet — goes through EIPC. This gives us a single point for authentication, capability checking, and audit logging. The shared-memory transport avoids copying payloads between address spaces.",
    points: [
      "4 transports: shared memory, UART, SPI, TCP/IP",
      "HMAC-SHA256 authentication on every frame",
      "Capability checking before routing any message",
      "Audit log of all service calls for forensics",
    ],
  },
  {
    num: "05",
    title: "The Build System",
    color: "#FBBF24",
    content:
      "eBuild is the EoS build system. It reads a KiCad schematic or a board description file and automatically generates the correct HAL configuration, linker script, and startup code for your target hardware. No more manually editing linker scripts or copying startup files between projects.",
    points: [
      "KiCad schematic → HAL config in one command",
      "Automatic linker script generation from board spec",
      "Reproducible builds with content-addressed artifact cache",
      `Cross-compilation for ${BOARD_COUNT} targets from any host OS`,
    ],
  },
];

export default function BuildingOS() {
  return (
    <BpPage className="bos">
      <PageHero
        sig
        label="DEEP DIVE"
        title="Building an OS from Scratch"
        lead="A deep dive into how EmbeddedOS was designed and built — the architecture decisions, tradeoffs, and lessons learned from building a production embedded OS."
      />
      <LocalNav
        name="Building an OS"
        items={sections.map(s => ({ id: chapterId(s.title), label: s.title }))}
      />

      {sections.map(s => (
        <section
          key={s.num}
          id={chapterId(s.title)}
          className="sec bo-ch"
          style={{ "--c": s.color } as CSSProperties}
        >
          <div className="wrap bo-row">
            <div className="bo-h">
              <span className="bo-num">{s.num}</span>
              <h2>{s.title}</h2>
            </div>
            <div className="bo-b">
              <p>{s.content}</p>
              <ul className="bo-pts">
                {s.points.map(p => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ))}

      <section className="sec tight bo-end">
        <div className="wrap">
          <div className="ctas">
            <Link href="/eos" className="btn pri">
              Explore EoS Kernel{" "}
              <span className="ar" aria-hidden="true">
                →
              </span>
            </Link>
            <Link href="/api-docs" className="btn gh">
              API Reference
            </Link>
          </div>
        </div>
      </section>
    </BpPage>
  );
}
