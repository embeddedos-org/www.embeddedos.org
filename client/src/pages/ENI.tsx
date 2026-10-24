import { useState, type CSSProperties } from "react";
import { Link } from "wouter";
import { BpPage, PageHero, Section, Stats } from "@/components/bp";
import "./ENI.css";

const channels = [
  {
    id: "eeg",
    label: "EEG",
    color: "#A855F7",
    hz: "Config-specific",
    bits: "Front-end specific",
    count: "Config-specific",
  },
  {
    id: "emg",
    label: "EMG",
    color: "#F97316",
    hz: "Config-specific",
    bits: "Front-end specific",
    count: "Config-specific",
  },
  {
    id: "ecog",
    label: "ECoG",
    color: "#22D3EE",
    hz: "Config-specific",
    bits: "Front-end specific",
    count: "Config-specific",
  },
  {
    id: "lfp",
    label: "LFP",
    color: "#34D399",
    hz: "Config-specific",
    bits: "Front-end specific",
    count: "Config-specific",
  },
];

const pipeline = [
  {
    step: "01",
    title: "Acquisition",
    desc: "Configure acquisition for the attached front end. Channel count and sample rate depend on the acquisition hardware and configuration; limits require measurement on a named setup.",
  },
  {
    step: "02",
    title: "Filtering",
    desc: "Hardware-accelerated bandpass filtering (0.1 Hz – 10 kHz), notch filtering (50/60 Hz), and common-average referencing.",
  },
  {
    step: "03",
    title: "Spike Detection",
    desc: "Threshold-crossing and template-matching spike detection are research pipeline goals; throughput and latency benchmarks are pending for each hardware configuration.",
  },
  {
    step: "04",
    title: "Feature Extraction",
    desc: "Spike waveform features, LFP power bands (delta/theta/alpha/beta/gamma), and coherence measures extracted per channel.",
  },
  {
    step: "05",
    title: "Decoding",
    desc: "EAI-powered neural decoder: population vector decoding, Kalman filter, or deep learning decoder (LSTM/Transformer) for BCI applications.",
  },
  {
    step: "06",
    title: "Output",
    desc: "Decoded neural commands delivered via EIPC to EoS applications, ready for the actuator or downstream service to act on.",
  },
];

const useCases = [
  {
    color: "#A855F7",
    title: "Brain-Computer Interface",
    desc: "Research target: evaluate motor-intent decoding for assistive control and publish protocol-specific accuracy results.",
  },
  {
    color: "#F97316",
    title: "Closed-Loop Neurostimulation",
    desc: "Research target: study detect-stimulate-measure feedback loops. No clinical efficacy or treatment claim is made.",
  },
  {
    color: "#22D3EE",
    title: "Neural Prosthetics",
    desc: "Cochlear implant signal processing, retinal prosthetics, and somatosensory feedback for prosthetic hands.",
  },
  {
    color: "#34D399",
    title: "Research Platforms",
    desc: "High-density Utah array and Michigan probe support. Compatible with Open Ephys, Blackrock, and Intan hardware.",
  },
];

export default function ENIPage() {
  const [activeChannel, setActiveChannel] = useState("eeg");
  const ch = channels.find(c => c.id === activeChannel)!;

  return (
    <BpPage className="enipage">
      <PageHero
        sig
        label="ENI · RESEARCH"
        title="ENI"
        sub="Embedded Neural Interface Framework"
        lead="An in-development neural acquisition and processing framework. Channel count and sample rate depend on the acquisition hardware and configuration; performance remains a research target."
      />

      <Section
        title="Signal Acquisition Modes"
        lead="ENI research covers four signal types through configurable acquisition pipelines."
      >
        <div className="ctas eni-tabs">
          {channels.map(c => (
            <button
              key={c.id}
              type="button"
              onClick={() => setActiveChannel(c.id)}
              aria-pressed={activeChannel === c.id}
              className="btn gh"
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className="eni-mode" style={{ "--c": ch.color } as CSSProperties}>
          <Stats
            small
            items={[
              { value: ch.hz, label: "Configured Rate" },
              { value: ch.bits, label: "ADC Configuration" },
              { value: ch.count, label: "Configured Channels" },
            ]}
          />
        </div>
      </Section>

      <Section title="ENI Processing Pipeline">
        <ol className="steps num eni-steps">
          {pipeline.map(p => (
            <li key={p.step}>
              <span className="n">{p.step}</span>
              <div>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="Use Cases">
        <ul className="cards two">
          {useCases.map(u => (
            <li key={u.title}>
              <div className="card">
                <h3>{u.title}</h3>
                <p>{u.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section tight>
        <div className="ctas">
          <Link href="/eai" className="btn pri">
            See EAI Integration{" "}
            <span className="ar" aria-hidden="true">
              →
            </span>
          </Link>
          <Link href="/api-docs" className="btn gh">
            API Reference
          </Link>
          <Link href="/product-eni" className="btn gh">
            eNI engineering detail
          </Link>
        </div>
      </Section>
    </BpPage>
  );
}
