import { useState, type CSSProperties } from "react";
import { Link } from "wouter";
import { BpPage, PageHero, Section } from "@/components/bp";
import "./NeuralLinkAI.css";

const specs = [
  {
    label: "Channel Count",
    value: "Config.",
    unit: "hardware-defined",
    color: "#A855F7",
  },
  {
    label: "Sample Rate",
    value: "Config.",
    unit: "hardware-defined",
    color: "#F97316",
  },
  { label: "Applications", value: "4", unit: "use cases", color: "#22D3EE" },
  {
    label: "Research Modalities",
    value: "6",
    unit: "modalities",
    color: "#34D399",
  },
];

const signalTypes = [
  {
    id: "eeg",
    name: "EEG",
    desc: "Scalp-level electrical activity considered for BCI, sleep, and seizure-pattern research. Performance depends on the protocol, electrodes, and acquisition hardware.",
    color: "#A855F7",
  },
  {
    id: "emg",
    name: "EMG",
    desc: "Muscle electrical activity considered for assistive-control and gesture research. Performance depends on the protocol, electrodes, and acquisition hardware.",
    color: "#F97316",
  },
  {
    id: "ecog",
    name: "ECoG",
    desc: "Cortical-surface recording modality considered for motor-interface research. Clinical use is outside the current platform claim.",
    color: "#22D3EE",
  },
  {
    id: "lfp",
    name: "LFP",
    desc: "Deep-brain recording modality considered for laboratory research. No therapeutic or clinical use is claimed.",
    color: "#34D399",
  },
  {
    id: "spikes",
    name: "Spikes",
    desc: "Single-unit action-potential research. Acquisition and resolution depend on the electrode and hardware configuration.",
    color: "#FBBF24",
  },
  {
    id: "fnirs",
    name: "fNIRS",
    desc: "Optical hemodynamic-response modality considered for non-invasive research. Hardware support requires configuration-specific validation.",
    color: "#F472B6",
  },
];

const applications = [
  {
    color: "#A855F7",
    title: "Motor Assistive-Control Research",
    desc: "Research target: evaluate motor-intent decoding for assistive control using a configuration documented with the acquisition hardware.",
  },
  {
    color: "#F97316",
    title: "Seizure-Pattern Research",
    desc: "Research target: study seizure-pattern detection from scalp EEG. No clinical performance or treatment outcome is claimed.",
  },
  {
    color: "#22D3EE",
    title: "BCI Communication Research",
    desc: "Research target: evaluate P300- and SSVEP-based communication with protocol-specific accuracy and throughput reporting.",
  },
  {
    color: "#34D399",
    title: "Cognitive-Indicator Research",
    desc: "Research target: investigate cognitive-load and fatigue indicators; safety-critical use would require independent validation and approval.",
  },
];

export default function NeuralLinkAIPage() {
  const [activeSignal, setActiveSignal] = useState("eeg");
  const signal = signalTypes.find(s => s.id === activeSignal)!;

  return (
    <BpPage className="nlai">
      <PageHero
        sig
        label="NEURAL LINK AI · RESEARCH"
        title="Neural Link AI"
        sub="eNI — Embedded Neural Interface Platform"
        lead="An in-development neural-interface research platform. Channel count and sample rate depend on the acquisition hardware and configuration; no clinical performance is claimed."
      />

      <div className="wrap nl-specs">
        <ul className="gstats tx">
          {specs.map(s => (
            <li key={s.label}>
              <b>{s.value}</b>
              <span>{s.label}</span>
              <span className="nl-unit">{s.unit}</span>
            </li>
          ))}
        </ul>
      </div>

      <Section
        title="Research Signal Modalities"
        lead="The research design considers six neural signal modalities. Hardware support and performance require configuration-specific validation."
      >
        <div className="ctas nl-tabs">
          {signalTypes.map(s => (
            <button
              key={s.id}
              type="button"
              onClick={() => setActiveSignal(s.id)}
              aria-pressed={activeSignal === s.id}
              className="btn gh"
            >
              {s.name}
            </button>
          ))}
        </div>
        <div
          className="card nl-signal"
          style={{ "--c": signal.color } as CSSProperties}
        >
          <h3>{signal.name}</h3>
          <p>{signal.desc}</p>
        </div>
      </Section>

      <Section title="Applications">
        <ul className="cards two">
          {applications.map(a => (
            <li key={a.title}>
              <div className="card">
                <h3>{a.title}</h3>
                <p>{a.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section tight>
        <div className="ctas">
          <Link href="/eai" className="btn pri">
            EAI Platform{" "}
            <span className="ar" aria-hidden="true">
              →
            </span>
          </Link>
          <Link href="/api-docs" className="btn gh">
            API Reference
          </Link>
        </div>
      </Section>
    </BpPage>
  );
}
