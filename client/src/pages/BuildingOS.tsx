import { motion } from "framer-motion";
import { Layers, Shield, Cpu, Code, ArrowRight, BookOpen } from "lucide-react";
import { Link } from "wouter";
import { BOARD_COUNT } from "@/data/stack";

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
    <div className="min-h-screen bg-[#0A0E1A] text-white">
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-cyan-500/5" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-sm font-medium mb-6">
              <BookOpen className="w-4 h-4" /> DEEP DIVE
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white via-orange-200 to-orange-400 bg-clip-text text-transparent">
              Building an OS from Scratch
            </h1>
            <p className="text-xl text-gray-400">
              A deep dive into how EmbeddedOS was designed and built — the
              architecture decisions, tradeoffs, and lessons learned from
              building a production embedded OS.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto space-y-12">
          {sections.map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-start gap-6">
                <div
                  className="text-5xl font-black font-mono flex-shrink-0 leading-none"
                  style={{ color: s.color + "40" }}
                >
                  {s.num}
                </div>
                <div className="flex-1">
                  <h2
                    className="text-2xl font-bold text-white mb-3"
                    style={{
                      borderLeft: `3px solid ${s.color}`,
                      paddingLeft: "1rem",
                    }}
                  >
                    {s.title}
                  </h2>
                  <p className="text-gray-400 mb-4 leading-relaxed">
                    {s.content}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {s.points.map(p => (
                      <div
                        key={p}
                        className="flex items-start gap-2 bg-white/5 rounded-lg px-3 py-2"
                      >
                        <div
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5"
                          style={{ background: s.color }}
                        />
                        <span className="text-gray-300 text-sm">{p}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/eos"
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors"
            >
              Explore EoS Kernel <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/api-docs"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold border border-white/20 transition-colors"
            >
              API Reference
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
