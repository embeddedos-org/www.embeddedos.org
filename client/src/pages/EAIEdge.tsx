import { Fragment, type CSSProperties } from "react";
import { Link } from "wouter";
import { BpPage, PageHero, Section, Stats } from "@/components/bp";
import "./EAIEdge.css";

const pipeline = [
  {
    id: "eni",
    name: "eNI",
    subtitle: "Neural / Sensor Input",
    color: "#A855F7",
    desc: "Research design for configuration-specific neural and sensor acquisition. Planned processing stages include filtering, spike sorting, and structured EIPC output.",
  },
  {
    id: "eipc",
    name: "eIPC",
    subtitle: "Secure Transport",
    color: "#22D3EE",
    desc: "Intended to route research data between eNI and eAI using configuration-specific integrity, encryption, and transport options.",
  },
  {
    id: "eai",
    name: "eAI",
    subtitle: "On-Device Inference",
    color: "#F97316",
    desc: "Intended to evaluate manifest-pinned ML models on configured device accelerators or CPUs and publish research outputs through EIPC.",
  },
];

const useCases = [
  {
    title: "Motor BCI Research",
    desc: "Concept pipeline for configuration-specific ECoG acquisition, experimental decoding, and assistive-control research.",
    color: "#A855F7",
  },
  {
    title: "Seizure-Pattern Research",
    desc: "Concept pipeline for EEG pattern-classification research. No detection performance, stimulation behavior, or treatment outcome is claimed.",
    color: "#F97316",
  },
  {
    title: "Gesture Research",
    desc: "Concept pipeline for configuration-specific EMG acquisition and experimental gesture classification.",
    color: "#22D3EE",
  },
  {
    title: "Cognitive-Indicator Research",
    desc: "Concept pipeline for studying EEG-derived fatigue indicators. No safety-critical monitoring performance is claimed.",
    color: "#34D399",
  },
];

// The illustrative setup, line by line: a comment, a command after its "$"
// prompt, or simulated output. Not a verified deployment recipe.
const setup: { kind: "c" | "cmd" | "out"; text: string; gap?: boolean }[] = [
  { kind: "c", text: "# Clone the eAI Edge stack" },
  { kind: "cmd", text: "git clone https://github.com/embeddedos-org/eAI" },
  {
    kind: "cmd",
    text: "cmake -B build -DPLATFORM=rk3588s -DMANIFEST=manifest.yml",
  },
  { kind: "cmd", text: "cmake --build build && ebuild flash" },
  {
    kind: "c",
    text: "# Smoke test: verify all 3 pipeline stages are running",
    gap: true,
  },
  { kind: "cmd", text: "ebuild monitor --filter eai-edge" },
  { kind: "out", text: "[simulated] eNI: configuration detected" },
  { kind: "out", text: "[simulated] eIPC: transport check pending" },
  { kind: "out", text: "[simulated] eAI: research model placeholder" },
];

export default function EAIEdgePage() {
  return (
    <BpPage className="eaiedge">
      <PageHero
        sig
        label="EAI EDGE RESEARCH CONCEPT"
        title="eAI Edge"
        sub="Intelligent Edge Node with Neural-Interface Input"
        lead="An in-development concept for a manifest-pinned eNI → eIPC → eAI research workflow. Hardware support, setup steps, and performance require validation on a named configuration."
      />

      <div className="wrap ee-stats">
        <Stats
          small
          items={[
            { value: "v0.1.0", label: "Current Version" },
            { value: "v0.1", label: "Profile" },
            { value: "Config.", label: "Hardware-Defined Channels" },
            { value: "Pending", label: "Power Validation" },
          ]}
        />
      </div>

      <Section
        title="Planned Pipeline"
        lead="The concept links three planned stages for acquisition, transport, and experimental inference."
      >
        <ol className="ee-flow">
          {pipeline.map((p, i) => (
            <Fragment key={p.id}>
              {i > 0 && (
                <li className="ee-arrow" aria-hidden="true">
                  →
                </li>
              )}
              <li className="card" style={{ "--c": p.color } as CSSProperties}>
                <span className="st">{p.subtitle}</span>
                <h3>{p.name}</h3>
                <p>{p.desc}</p>
              </li>
            </Fragment>
          ))}
        </ol>
      </Section>

      <Section
        title="Illustrative Setup"
        lead="Conceptual commands for a proposed workflow, not a verified deployment recipe."
      >
        <div className="code ee-code">
          <pre className="wrapm">
            {setup.map((l, i) => (
              <span
                key={i}
                className={l.gap ? `ee-l ${l.kind} gap` : `ee-l ${l.kind}`}
              >
                {l.kind === "cmd" && (
                  <>
                    <span className="ee-ps">$</span>{" "}
                  </>
                )}
                {l.text}
              </span>
            ))}
          </pre>
        </div>
      </Section>

      <Section title="Research Use Cases">
        <ul className="cards two">
          {useCases.map(u => (
            <li key={u.title}>
              <div className="card" style={{ "--c": u.color } as CSSProperties}>
                <h3 className="ee-dot">{u.title}</h3>
                <p>{u.desc}</p>
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
          <Link href="/neural-link-ai" className="btn gh">
            Neural Link AI
          </Link>
        </div>
      </Section>
    </BpPage>
  );
}
