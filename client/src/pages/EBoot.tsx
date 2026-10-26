import ProductRepositoryPanel from "@/components/ProductRepositoryPanel";
import { type CSSProperties } from "react";
import { Link } from "wouter";
import { Band, BpPage, PageHero, Section } from "@/components/bp";
import "./EBoot.css";

const BOOT_STAGES = [
  {
    step: "01",
    name: "Stage-0",
    desc: "Early reset entry, hardware initialization, watchdog, and transition to Stage-1.",
    color: "#a1a1aa",
  },
  {
    step: "02",
    name: "Stage-1",
    desc: "Scan available images, evaluate boot policy, and select an application or RTOS image.",
    color: "#a1a1aa",
  },
  {
    step: "03",
    name: "Image authentication",
    desc: "Inspect the Ed25519 verification, image metadata, key provisioning, and rollback logic in core/.",
    color: "#a1a1aa",
  },
  {
    step: "04",
    name: "Payload hand-off",
    desc: "Transfer control to the selected image after the configured checks; use recovery when normal boot cannot proceed.",
    color: "#a1a1aa",
  },
];

const FEATURES = [
  {
    color: "#a1a1aa",
    title: "Two-stage boot chain",
    desc: "Stage-0 handles early bring-up; Stage-1 handles image selection and payload hand-off.",
  },
  {
    color: "#a1a1aa",
    title: "Image authentication",
    desc: "The core includes Ed25519 image verification. Read the security options and key-lifecycle documentation before configuring a target.",
  },
  {
    color: "#a1a1aa",
    title: "A/B slot management",
    desc: "Slot selection, anti-rollback counters, and firmware-update modules are present in the core.",
  },
  {
    color: "#a1a1aa",
    title: "Production-key configuration",
    desc: "A real-board Release build requires a production public key unless the documented development-key override is explicitly enabled.",
  },
  {
    color: "#a1a1aa",
    title: "Recovery paths",
    desc: "The repository includes authenticated recovery, a boot menu, and UART transport code.",
  },
  {
    color: "#a1a1aa",
    title: "Target-specific builds",
    desc: "Native builds compile the platform-independent libraries. Cross-compiles select a board and toolchain explicitly.",
  },
];

// The boot log shown beside the stages: one line per step, its prefix in the
// colour of the stage that prints it.
const BOOT_LOG = [
  {
    color: "#a1a1aa",
    prefix: "stage0/  ",
    text: "Reset entry and hardware initialization",
  },
  {
    color: "#a1a1aa",
    prefix: "stage1/  ",
    text: "Image selection and payload hand-off",
  },
  {
    color: "#a1a1aa",
    prefix: "core/    ",
    text: "Verification, slots, recovery, and updates",
  },
  {
    color: "#a1a1aa",
    prefix: "docs/    ",
    text: "Threat model, key lifecycle, and configuration",
  },
];

export default function EBoot() {
  return (
    <BpPage className="eboot">
      <PageHero
        label="eBoot Bootloader"
        title={
          <>
            eBoot
            <br />
            <span>Secure Bootloader</span>
          </>
        }
        lead="A modular C bootloader with Stage-0 and Stage-1, Ed25519 image authentication, slot management, and recovery code. Explore the implementation and configure it for your target."
        visual={<ProductRepositoryPanel product="eboot" />}
      >
        <div className="ctas">
          <Link href="/getting-started" className="btn pri">
            Get Started{" "}
            <span className="ar" aria-hidden="true">
              →
            </span>
          </Link>
          <Link href="/docs" className="btn gh">
            eBoot Docs
          </Link>
        </div>
      </PageHero>

      <Section
        title="Boot Sequence"
        lead="The repository’s boot-chain structure, from early initialization to a selected payload"
      >
        <div className="split2 eb-seq">
          <ol className="eb-stages">
            {BOOT_STAGES.map(stage => (
              <li
                key={stage.step}
                className="card"
                style={{ "--c": stage.color } as CSSProperties}
              >
                <span className="k">STAGE {stage.step}</span>
                <h3>{stage.name}</h3>
                <p>{stage.desc}</p>
              </li>
            ))}
          </ol>
          <div className="code eb-log">
            <div className="cbar">
              <b>Boot implementation · source map</b>
            </div>
            <pre className="wrapm">
              {BOOT_LOG.map((line, i) => (
                <span key={i} className="eb-line">
                  <span style={{ color: line.color }}>{line.prefix}</span>
                  <span>{line.text}</span>
                </span>
              ))}
            </pre>
          </div>
        </div>
      </Section>

      <Section title="eBoot Features">
        <ul className="cards">
          {FEATURES.map(f => (
            <li key={f.title}>
              <div className="card">
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Band
        title="Secure your device from boot"
        lead="Read the build guide, select a target, and configure the trust anchor before deploying firmware."
      >
        <Link href="/getting-started" className="btn pri">
          Flash eBoot{" "}
          <span className="ar" aria-hidden="true">
            →
          </span>
        </Link>
        <Link href="/eos" className="btn gh">
          EoS Kernel
        </Link>
        <Link href="/product-eboot" className="btn gh">
          eBoot engineering detail
        </Link>
      </Band>
    </BpPage>
  );
}
