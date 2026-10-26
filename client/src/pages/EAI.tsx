import { useState, Suspense, lazy, type CSSProperties } from "react";
import ViewportGate from "../components/ViewportGate";
import { Link } from "wouter";
import { Band, BpPage, PageHero, Section } from "@/components/bp";
import "./EAI.css";
const EAINetworkCanvas = lazy(() =>
  import("../components/EoS3D").then(m => ({ default: m.EAINetworkCanvas }))
);

const PRODUCTS = [
  {
    id: "eai",
    color: "#34D399",
    name: "EAI Engine",
    tagline: "On-device AI inference — no cloud required",
    desc: "EAI is an in-development embedded inference runtime. Memory requirements depend on model size, architecture, runtime overhead, and target hardware. Research areas include vision, NLP, time-series classification, and anomaly detection.",
    specs: [
      { label: "Runtimes", value: "TFLite · ONNX · GGUF" },
      { label: "Quantization", value: "4-bit, 8-bit, FP16" },
      { label: "Min RAM", value: "256KB (classification)" },
      { label: "LLM Memory", value: "Model- and hardware-dependent" },
      { label: "Tasks", value: "Vision · NLP · Time-series · Anomaly" },
      { label: "Acceleration", value: "CMSIS-NN · Helium · RISC-V V-ext" },
    ],
    demo: [
      ">>> eai.load('gesture_classifier.tflite')",
      ">>> eai.run(sensor_data)",
      "{'class': 'wave_right', 'confidence': 0.97}",
      ">>> eai.load('phi3-mini-4bit.gguf')",
      ">>> eai.chat('What is the sensor reading?')",
      "'Temperature is 23.4°C, humidity 61%. All nominal.'",
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
      ">>> eni.init(bus='SPI', channels=8, rate=1000)",
      ">>> eni.stream.subscribe(on_sample)",
      "Sample: ch[0..7] = [12.3, -4.1, 8.7, ...]",
      ">>> eni.classify('motor_imagery')",
      "{'intent': 'left_hand', 'confidence': 0.91}",
      ">>> eni.trigger_haptic(intensity=0.5)",
    ],
  },
  {
    id: "ebot",
    color: "#F97316",
    name: "eBot Agent",
    tagline: "AI assistant embedded in every EoS device",
    desc: "eBot is an always-available AI agent running on every EmbeddedOS device. It can answer questions about the device state, execute shell commands, debug firmware, and communicate with external APIs — all from a simple chat interface.",
    specs: [
      { label: "Interface", value: "Chat · CLI · REST API" },
      { label: "Models", value: "Local GGUF · Cloud LLM" },
      { label: "Tools", value: "Shell · Sensor read · GPIO · OTA" },
      { label: "Context", value: "Device state · Logs · Docs" },
      { label: "Offline", value: "Full offline mode (GGUF)" },
      { label: "Platform", value: "All EoS devices + web" },
    ],
    demo: [
      "User: What's the CPU temperature?",
      "eBot: CPU is at 42°C. Fan at 35% duty cycle.",
      "User: Increase fan speed to 60%",
      "eBot: Done. Fan now at 60%. Temp dropping.",
      "User: Show me the last 10 error logs",
      "eBot: [WARN] SPI timeout x3, [ERR] OTA hash...",
    ],
  },
];

const USE_CASES = [
  {
    title: "Medical Wearables",
    desc: "Classify ECG arrhythmias, detect falls, and monitor sleep stages — all on-device with no PHI leaving the hardware.",
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
    desc: "Models run in isolated memory partitions. Inference results are signed and attestable.",
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
        lead="Run AI models directly on microcontrollers. Connect brain-computer interface devices. Deploy an AI agent on every EoS device — all without cloud dependency."
        visual={
          // The 3D neural network, on a large stage; it loads only near the viewport.
          <div className="board stage">
            <Suspense fallback={<div className="stage-wait" />}>
              <ViewportGate>
                <EAINetworkCanvas hovered={false} />
              </ViewportGate>
            </Suspense>
          </div>
        }
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
              <b>{product.id}-demo.py</b>
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
        title="Use Cases"
        lead="What you can build with ENI/EAI"
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
        title="Run AI on your embedded device today"
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
