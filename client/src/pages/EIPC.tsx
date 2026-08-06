import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Network, Shield, Zap, Code, ArrowRight, Lock } from "lucide-react";
import { Link } from "wouter";

const transports = [
  {
    id: "shared",
    label: "Shared Memory",
    color: "#F97316",
    latency: "< 1 μs",
    throughput: "10 GB/s",
    desc: "Zero-copy shared memory ring buffer. Fastest transport for same-core or same-chip communication.",
  },
  {
    id: "uart",
    label: "UART",
    color: "#22D3EE",
    latency: "< 100 μs",
    throughput: "3 Mbps",
    desc: "Framed UART transport with hardware flow control. Ideal for cross-board communication.",
  },
  {
    id: "spi",
    label: "SPI",
    color: "#A855F7",
    latency: "< 10 μs",
    throughput: "50 Mbps",
    desc: "Full-duplex SPI transport with DMA. Used for high-speed sensor data pipelines.",
  },
  {
    id: "tcp",
    label: "TCP/IP",
    color: "#34D399",
    latency: "< 1 ms",
    throughput: "1 Gbps",
    desc: "TCP transport for networked embedded systems. Supports TLS 1.3 via mbedTLS integration.",
  },
];

const wireFormat = [
  {
    field: "Magic",
    size: "4 bytes",
    value: "0x45 0x49 0x50 0x43",
    desc: "Frame identifier (EIPC)",
  },
  { field: "Version", size: "1 byte", value: "0x01", desc: "Protocol version" },
  {
    field: "Flags",
    size: "1 byte",
    value: "0x00–0xFF",
    desc: "Compression, encryption, priority bits",
  },
  {
    field: "Sequence",
    size: "4 bytes",
    value: "uint32_t",
    desc: "Monotonic sequence number for ordering",
  },
  {
    field: "Header Len",
    size: "2 bytes",
    value: "uint16_t",
    desc: "Length of JSON header section",
  },
  {
    field: "Payload Len",
    size: "4 bytes",
    value: "uint32_t",
    desc: "Length of payload section",
  },
  {
    field: "Header",
    size: "variable",
    value: "JSON",
    desc: "Service name, method, metadata",
  },
  {
    field: "Payload",
    size: "variable",
    value: "JSON/CBOR/binary",
    desc: "Method arguments or return values",
  },
  {
    field: "HMAC",
    size: "32 bytes",
    value: "SHA-256",
    desc: "HMAC-SHA256 over header + payload",
  },
];

const features = [
  {
    icon: Zap,
    color: "#F97316",
    title: "Sub-microsecond Latency",
    desc: "Shared memory transport achieves <1μs latency on same-core communication. Zero serialization overhead for binary payloads.",
  },
  {
    icon: Shield,
    color: "#22D3EE",
    title: "HMAC Authentication",
    desc: "Every frame is authenticated with HMAC-SHA256. Prevents spoofing and replay attacks between EoS services.",
  },
  {
    icon: Lock,
    color: "#A855F7",
    title: "Capability-Based Security",
    desc: "Services declare capabilities in their manifest. EIPC enforces capability checks before routing any message.",
  },
  {
    icon: Network,
    color: "#34D399",
    title: "4 Transport Backends",
    desc: "Shared memory, UART, SPI, and TCP/IP transports. Same API regardless of transport — swap without code changes.",
  },
];

export default function EIPCPage() {
  const [activeTransport, setActiveTransport] = useState("shared");
  const t = transports.find(x => x.id === activeTransport)!;

  return (
    <div className="min-h-screen bg-[#0A0E1A] text-white">
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-cyan-500/5" />
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-sm font-medium mb-6">
              <Network className="w-4 h-4" /> EIPC
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-orange-200 to-orange-400 bg-clip-text text-transparent">
              EIPC
            </h1>
            <p className="text-2xl text-gray-300 mb-2">
              Embedded Inter-Process Communication
            </p>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Ultra-low latency, HMAC-authenticated IPC protocol for EoS
              services. Sub-microsecond shared memory transport, 4 transport
              backends, capability-based security.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-2 text-center">
            Transport Backends
          </h2>
          <p className="text-gray-400 text-center mb-8">
            Same EIPC API regardless of transport. Swap backends without
            changing application code.
          </p>
          <div className="flex gap-2 mb-6 justify-center flex-wrap">
            {transports.map(tr => (
              <button
                key={tr.id}
                onClick={() => setActiveTransport(tr.id)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={
                  activeTransport === tr.id
                    ? {
                        background: tr.color + "20",
                        color: tr.color,
                        border: "1px solid " + tr.color + "40",
                      }
                    : {
                        background: "rgba(255,255,255,0.05)",
                        color: "#9CA3AF",
                        border: "1px solid rgba(255,255,255,0.1)",
                      }
                }
              >
                {tr.label}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTransport}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white/5 border border-white/10 rounded-xl p-6 grid grid-cols-3 gap-6 text-center"
            >
              <div>
                <div
                  className="text-3xl font-bold mb-1"
                  style={{ color: t.color }}
                >
                  {t.latency}
                </div>
                <div className="text-gray-500 text-sm">Latency</div>
              </div>
              <div>
                <div
                  className="text-3xl font-bold mb-1"
                  style={{ color: t.color }}
                >
                  {t.throughput}
                </div>
                <div className="text-gray-500 text-sm">Throughput</div>
              </div>
              <div className="text-left">
                <p className="text-gray-400 text-sm">{t.desc}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-2 text-center">
            Wire Format
          </h2>
          <p className="text-gray-400 text-center mb-6">
            Every EIPC frame follows this binary layout. Authenticated with
            HMAC-SHA256.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-gray-500">
                  <th className="text-left py-2 pr-4">Field</th>
                  <th className="text-left py-2 pr-4">Size</th>
                  <th className="text-left py-2 pr-4">Value</th>
                  <th className="text-left py-2">Description</th>
                </tr>
              </thead>
              <tbody>
                {wireFormat.map((row, i) => (
                  <tr
                    key={row.field}
                    className={i % 2 === 0 ? "bg-white/[0.02]" : ""}
                  >
                    <td className="py-2 pr-4 font-mono text-orange-400">
                      {row.field}
                    </td>
                    <td className="py-2 pr-4 text-gray-400">{row.size}</td>
                    <td className="py-2 pr-4 font-mono text-cyan-400 text-xs">
                      {row.value}
                    </td>
                    <td className="py-2 text-gray-400">{row.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-xl p-6"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: f.color + "20" }}
                >
                  <f.icon className="w-5 h-5" style={{ color: f.color }} />
                </div>
                <h3 className="text-white font-semibold mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/api-docs"
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors"
            >
              API Reference <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/eos"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold border border-white/20 transition-colors"
            >
              EoS Kernel
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
