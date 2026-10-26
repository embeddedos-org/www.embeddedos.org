import { Suspense, lazy, type CSSProperties } from "react";
import { Link } from "wouter";
import ViewportGate from "../components/ViewportGate";
import { BOARD_COUNT } from "@/data/stack";
import { Band, BpPage, PageHero, Section } from "@/components/bp";
import "./EBoot.css";
const EBootCanvas = lazy(() =>
  import("../components/EoS3D").then(m => ({ default: m.EBootCanvas }))
);

const BOOT_STAGES = [
  {
    step: "01",
    name: "ROM Bootloader",
    desc: "Immutable factory code verifies eBoot signature using hardware root-of-trust keys burned into OTP fuses.",
    color: "#60A5FA",
  },
  {
    step: "02",
    name: "eBoot Stage 1",
    desc: "Minimal loader initialises clocks, DRAM, and the cryptographic engine. Verifies Stage 2 signature.",
    color: "#22D3EE",
  },
  {
    step: "03",
    name: "eBoot Stage 2",
    desc: "Full bootloader environment. Loads EoS kernel image, verifies hash chain, applies OTA staging if pending.",
    color: "#34D399",
  },
  {
    step: "04",
    name: "EoS Kernel",
    desc: "Verified kernel image handed control. Device is in a fully attested, trusted state.",
    color: "#F97316",
  },
];

const FEATURES = [
  {
    color: "#34D399",
    title: "Verified Boot Chain",
    desc: "Every stage cryptographically signed. A tampered image cannot boot — the chain breaks and recovery mode activates.",
  },
  {
    color: "#22D3EE",
    title: "OTA Update Pipeline",
    desc: "Dual-bank A/B update with automatic rollback. Failed updates revert to the last known-good image automatically.",
  },
  {
    color: "#F97316",
    title: "Hardware Root of Trust",
    desc: "Keys burned into OTP fuses at manufacturing. No software path can override the root verification.",
  },
  {
    color: "#F59E0B",
    title: "Fast Boot (<200ms)",
    desc: "Optimised stage initialisation gets devices to the EoS kernel in under 200ms on most MCU families.",
  },
  {
    color: "#A78BFA",
    title: "Recovery Console",
    desc: "UART recovery shell for field repair. Re-flash firmware without physical access to JTAG.",
  },
  {
    color: "#60A5FA",
    title: `${BOARD_COUNT} Board Support`,
    desc: "Same eBoot codebase across all EoS-supported MCU families. One tool, every device.",
  },
];

// The boot log shown beside the stages: one line per step, its prefix in the
// colour of the stage that prints it.
const BOOT_LOG = [
  {
    color: "#60A5FA",
    prefix: "[ROM]   ",
    text: "Verifying eBoot Stage 1 signature... OK",
  },
  {
    color: "#22D3EE",
    prefix: "[BOOT1] ",
    text: "Initialising clocks @ 480 MHz... OK",
  },
  {
    color: "#22D3EE",
    prefix: "[BOOT1] ",
    text: "DRAM init 64MB SDRAM... OK",
  },
  {
    color: "#22D3EE",
    prefix: "[BOOT1] ",
    text: "Verifying Stage 2 signature... OK",
  },
  {
    color: "#34D399",
    prefix: "[BOOT2] ",
    text: "OTA staging: no pending update",
  },
  {
    color: "#34D399",
    prefix: "[BOOT2] ",
    text: "Verifying EoS kernel hash... OK",
  },
  {
    color: "#34D399",
    prefix: "[BOOT2] ",
    text: "Handing control to EoS kernel...",
  },
  {
    color: "#F97316",
    prefix: "[EoS]   ",
    text: "EmbeddedOS v2.4.1 booting... 187ms",
  },
  {
    color: "#F97316",
    prefix: "[EoS]   ",
    text: "All systems nominal. ✓",
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
        lead="A cryptographically verified, multi-stage bootloader for EmbeddedOS devices. Hardware root-of-trust, OTA A/B updates with automatic rollback, and sub-200ms boot time."
        visual={
          // The 3D boot sequence on a large stage; it loads only near the viewport.
          <div className="board stage">
            <Suspense fallback={<div className="stage-wait" />}>
              <ViewportGate>
                <EBootCanvas hovered={false} />
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
            eBoot Docs
          </Link>
        </div>
      </PageHero>

      <Section
        title="Boot Sequence"
        lead="Four verified stages from silicon to running OS"
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
              <b>boot-sequence.log</b>
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
        lead="eBoot is included with every EoS installation. No separate configuration needed."
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
