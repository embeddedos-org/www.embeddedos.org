import ProductRepositoryPanel from "@/components/ProductRepositoryPanel";
import { useState, type CSSProperties } from "react";
import { Link } from "wouter";
import { Band, BpPage, PageHero, Section } from "@/components/bp";
import "./EAI.css";

const PRODUCTS = [
  {
    id: "eai",
    color: "#34D399",
    name: "EAI Engine",
    tagline: "Model contracts and build-selectable runtimes",
    desc: "EAI is an in-development embedded inference runtime. Memory requirements depend on model size, architecture, runtime overhead, and target hardware. Research areas include vision, NLP, time-series classification, and anomaly detection.",
    specs: [
      { label: "Runtimes", value: "EAI-Min · EAI-Framework" },
      { label: "Quantization", value: "Model- and backend-dependent" },
      { label: "Memory", value: "Model- and target-dependent" },
      { label: "LLM Memory", value: "Model- and hardware-dependent" },
      { label: "Tasks", value: "Vision · NLP · Time-series · Anomaly" },
      { label: "Optional backends", value: "Vulkan · CoreML · QNN" },
    ],
    demo: [
      "common/       Runtime contracts and shared utilities",
      "min/          Lightweight agent runtime",
      "framework/    Industrial runtime",
      "formats/      Model-format loaders",
    ],
  },
  {
    id: "eni",
    color: "#A78BFA",
    name: "ENI Adapter",
    tagline: "Neural interface for BCI devices over standard buses",
    desc: "ENI (Embedded Neural Interface) is an in-development hardware abstraction layer for neural research devices. It is designed to normalise EEG, EMG, and ECoG signals into a standard EoS event stream. Channel count and sample rate depend on the acquisition hardware and configuration; published limits remain research targets until measured on a named setup.",
    specs: [
      { label: "Signal types", value: "EEG · EMG · ECoG · EOG" },
      { label: "Buses", value: "SPI · I²C · UART · USB" },
      { label: "Sampling", value: "Acquisition-hardware dependent" },
      { label: "Channels", value: "Configuration dependent" },
      { label: "Latency", value: "Benchmark pending" },
      { label: "Output", value: "EoS event stream + raw buffer" },
    ],
    demo: [
      "common/       Shared types and configuration",
      "providers/    Signal-provider code",
      "platform/     Platform adapters",
      "docs/         Integration documentation",
    ],
  },
  {
    id: "ebot",
    color: "#F97316",
    name: "eBot Agent",
    tagline: "Agent runtime modules in eAI",
    desc: "The eAI repository contains a lightweight agent runtime under min/, with routing, memory, tool-registry, and permission modules. Device integration and available tools depend on the selected runtime and configuration.",
    specs: [
      { label: "Interface", value: "C runtime · CLI" },
      { label: "Models", value: "Selected runtime backend" },
      { label: "Tools", value: "Tool registry and permissions" },
      { label: "Context", value: "Application-provided context" },
      { label: "Offline use", value: "Depends on runtime and model" },
      { label: "Platform", value: "Selected platform adapter" },
    ],
    demo: [
      "min/src/      Agent runtime source",
      "min/include/  Public headers",
      "common/       Tool registry and permissions",
      "docs/         Runtime documentation",
    ],
  },
];

const USE_CASES = [
  {
    title: "Medical Wearables",
    desc: "Explore signal-classification research for wearable devices. Clinical performance and privacy properties require validation on a named system.",
  },
  {
    title: "Brain-Computer Interface",
    desc: "Read motor imagery signals from EEG headsets and translate them into device commands via ENI.",
  },
  {
    title: "Industrial Predictive Maintenance",
    desc: "Run vibration anomaly detection models on factory sensors. Alert before failures occur.",
  },
  {
    title: "Edge Vision",
    desc: "Object detection and image classification on camera modules with no cloud upload.",
  },
  {
    title: "AI-Assisted Debugging",
    desc: "eBot reads device logs and suggests fixes in plain language. Ship firmware faster.",
  },
  {
    title: "Secure AI Inference",
    desc: "Investigate isolation, permissions, and model provenance. End-to-end security properties depend on the selected system and configuration.",
  },
];

/** The kind of a demo line, for its colour: a prompt, a result, or a reply. */
function lineKind(line: string) {
  if (line.startsWith(">>>")) return "in";
  if (line.startsWith("'") || line.startsWith("{")) return "out";
  return "msg";
}

export default function EAI() {
  const [active, setActive] = useState("eai");
  const product = PRODUCTS.find(p => p.id === active)!;

  return (
    <BpPage className="eai">
      <PageHero
        label="ENI / EAI"
        title={
          <>
            Neural Interface
            <br />& Edge AI
          </>
        }
        lead="Explore the eAI runtime, agent modules, and neural-interface research. Runtime support and hardware requirements depend on the selected model and target."
        visual={<ProductRepositoryPanel product="eai" />}
      >
        <div className="ctas">
          <Link href="/getting-started" className="btn pri">
            Get Started{" "}
            <span className="ar" aria-hidden="true">
              →
            </span>
          </Link>
          <Link href="/docs" className="btn gh">
            EAI Docs
          </Link>
        </div>
      </PageHero>

      {/* Product selector */}
      <Section id="products">
        <div className="ctas eai-tabs">
          {PRODUCTS.map(p => (
            <button
              key={p.id}
              type="button"
              onClick={() => setActive(p.id)}
              aria-pressed={active === p.id}
              className="btn gh"
              style={{ "--c": p.color } as CSSProperties}
            >
              <i className="dot" aria-hidden="true" /> {p.name}
            </button>
          ))}
        </div>

        <div
          className="eai-pick"
          key={active}
          style={{ "--c": product.color } as CSSProperties}
        >
          <div className="card">
            <h2>{product.name}</h2>
            <p className="eai-tag">{product.tagline}</p>
            <p>{product.desc}</p>
            <a
              className="btn gh"
              href={`https://github.com/embeddedos-org/${active === "eni" ? "eNI" : "eAI"}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View {product.name} source ↗
            </a>
            <dl className="eai-specs">
              {product.specs.map(s => (
                <div key={s.label}>
                  <dt>{s.label}</dt>
                  <dd>{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="code">
            <div className="cbar">
              <b>{product.id} · source map</b>
            </div>
            <pre>
              {product.demo.map((line, i) => (
                <span key={i} className={lineKind(line)}>
                  {line}
                  {"\n"}
                </span>
              ))}
            </pre>
          </div>
        </div>
      </Section>

      {/* Use cases */}
      <Section
        id="use-cases"
        title="Research directions"
        lead="Potential applications to investigate; these examples are not validated device or clinical capabilities"
        split
      >
        <ul className="cards">
          {USE_CASES.map(uc => (
            <li key={uc.title}>
              <div className="card">
                <h3>{uc.title}</h3>
                <p>{uc.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      {/* CTA */}
      <Band
        title="Explore the AI source and build guides"
        lead="EAI and ENI are open-source research components under active development for EoS integrations."
      >
        <Link href="/getting-started" className="btn pri">
          Get Started{" "}
          <span className="ar" aria-hidden="true">
            →
          </span>
        </Link>
        <Link href="/docs" className="btn gh">
          EAI API Reference
        </Link>
        <Link href="/product-eai" className="btn gh">
          EAI engineering detail
        </Link>
      </Band>
    </BpPage>
  );
}
