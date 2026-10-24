import { useState, type CSSProperties } from "react";
import { Link } from "wouter";
import { BpPage, PageHero, Section } from "@/components/bp";
import "./EIPC.css";

const transports = [
  {
    id: "shared",
    label: "Shared Memory",
    color: "#F97316",
    latency: "Lowest",
    throughput: "10 GB/s",
    desc: "Zero-copy shared memory ring buffer. Fastest transport for same-core or same-chip communication.",
  },
  {
    id: "uart",
    label: "UART",
    color: "#22D3EE",
    latency: "Higher",
    throughput: "3 Mbps",
    desc: "Framed UART transport with hardware flow control. Ideal for cross-board communication.",
  },
  {
    id: "spi",
    label: "SPI",
    color: "#A855F7",
    latency: "Low",
    throughput: "50 Mbps",
    desc: "Full-duplex SPI transport with DMA. Used for high-speed sensor data pipelines.",
  },
  {
    id: "tcp",
    label: "TCP/IP",
    color: "#34D399",
    latency: "Highest",
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
    color: "#F97316",
    title: "Shared-Memory Fast Path",
    desc: "Shared memory transport for same-core communication, with latency dependent on the target and message configuration.",
  },
  {
    color: "#22D3EE",
    title: "HMAC Authentication",
    desc: "Every frame is authenticated with HMAC-SHA256. Prevents spoofing and replay attacks between EoS services.",
  },
  {
    color: "#A855F7",
    title: "Capability-Based Security",
    desc: "Services declare capabilities in their manifest. EIPC enforces capability checks before routing any message.",
  },
  {
    color: "#34D399",
    title: "4 Transport Backends",
    desc: "Shared memory, UART, SPI, and TCP/IP transports. Same API regardless of transport — swap without code changes.",
  },
];

export default function EIPCPage() {
  const [activeTransport, setActiveTransport] = useState("shared");
  const t = transports.find(x => x.id === activeTransport)!;

  return (
    <BpPage className="eipc">
      <PageHero
        sig
        label="EIPC"
        title="EIPC"
        sub="Embedded Inter-Process Communication"
        lead="Zero-copy, HMAC-authenticated IPC protocol for EoS services. Transport-dependent latency, 4 transport backends, capability-based security."
      />

      <Section
        title="Transport Backends"
        lead="Same EIPC API regardless of transport. Swap backends without changing application code."
      >
        <div className="ctas ipc-tabs">
          {transports.map(tr => (
            <button
              key={tr.id}
              type="button"
              onClick={() => setActiveTransport(tr.id)}
              aria-pressed={activeTransport === tr.id}
              className="btn gh"
            >
              {tr.label}
            </button>
          ))}
        </div>
        <div className="ipc-panel" style={{ "--c": t.color } as CSSProperties}>
          <div className="ipc-fig">
            <b>{t.latency}</b>
            <span>Relative latency</span>
          </div>
          <div className="ipc-fig">
            <b>{t.throughput}</b>
            <span>Throughput</span>
          </div>
          <div>
            <p className="ipc-desc">{t.desc}</p>
          </div>
        </div>
      </Section>

      <Section
        title="Wire Format"
        lead="Every EIPC frame follows this binary layout. Authenticated with HMAC-SHA256."
      >
        <div className="tbl ipc-wire">
          <table>
            <thead>
              <tr>
                <th scope="col">Field</th>
                <th scope="col">Size</th>
                <th scope="col">Value</th>
                <th scope="col">Description</th>
              </tr>
            </thead>
            <tbody>
              {wireFormat.map(row => (
                <tr key={row.field}>
                  <td className="ipc-mono">{row.field}</td>
                  <td>{row.size}</td>
                  <td className="ipc-mono">{row.value}</td>
                  <td>{row.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Features">
        <ul className="cards two">
          {features.map(f => (
            <li key={f.title}>
              <div className="card">
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section tight>
        <div className="ctas">
          <Link href="/api-docs" className="btn pri">
            API Reference{" "}
            <span className="ar" aria-hidden="true">
              →
            </span>
          </Link>
          <Link href="/eos" className="btn gh">
            EoS Kernel
          </Link>
          <Link href="/product-eipc" className="btn gh">
            eIPC engineering detail
          </Link>
        </div>
      </Section>
    </BpPage>
  );
}
