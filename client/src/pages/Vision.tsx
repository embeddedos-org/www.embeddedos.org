import { Link } from "wouter";
import { BpPage, PageHero, Section } from "@/components/bp";
import "./Vision.css";

const pillars = [
  {
    title: "Every Device, Every Architecture",
    desc: "EmbeddedOS runs on ARM Cortex-M/A/R, RISC-V, x86, MIPS, ARC, and Xtensa — from a 4KB microcontroller to a 64-core server. One OS, every device.",
  },
  {
    title: "AI as a First-Class Citizen",
    desc: "AI inference is not a plugin or an afterthought. EAI is built into the EoS kernel scheduler, memory manager, and power governor — so AI tasks run with the same determinism as real-time tasks.",
  },
  {
    title: "Security Without Compromise",
    desc: "Capability-based security, verified boot, post-quantum cryptography, and formal verification — not as optional add-ons, but as the foundation every application is built on.",
  },
  {
    title: "Free, Forever",
    desc: "EmbeddedOS is MIT licensed and will remain free forever. The Foundation is a 501(c)(3) nonprofit — no investor pressure, no licensing fees, no vendor lock-in.",
  },
  {
    title: "Developer Experience First",
    desc: "EoStudio, eBuild, EoSim, eFlow — every tool in the EmbeddedOS ecosystem is designed to make embedded development faster, safer, and more accessible than it has ever been.",
  },
  {
    title: "Education & Access",
    desc: "10,000 free certifications. Open curriculum. Internships and fellowships for students worldwide. EmbeddedOS believes the next generation of embedded engineers should not be limited by access to tools or education.",
  },
];

const timeline = [
  {
    year: "2018",
    event: "embeddedos.org domain registered — EmbeddedOS project started",
  },
  {
    year: "2020",
    event:
      "Kernel architecture research phase — real-time scheduling, memory management",
  },
  {
    year: "2023",
    event: "EoS kernel v0.1 released — ARM Cortex-M, RISC-V, x86 support",
  },
  {
    year: "2024",
    event: "EAI v0.1 released — INT8 inference on Cortex-M55 with Helium MVE",
  },
  {
    year: "Current",
    event:
      "eAI Edge v0.1 profile is recorded as shipped, bundling eNI, EIPC, and eAI",
  },
  {
    year: "2025",
    event: "EoStudio, EoSim, eBuild, eFlow, eDB, eBrowser released",
  },
  {
    year: "2026",
    event:
      "Foundation incorporated as 501(c)(3) public charity (EIN: 41-4821627)",
  },
  {
    year: "2026",
    event: "eHealth365 and eRadar360 hardware products launched",
  },
  {
    year: "2027",
    event:
      "v1.0 — safety-critical certification, DO-178C DAL-A, IEC 61508 SIL-3",
  },
  {
    year: "2030",
    event: "Vision: EmbeddedOS running on 1 billion devices worldwide",
  },
];

export default function Vision() {
  return (
    <BpPage className="vision">
      <PageHero
        sig
        label="VISION"
        title="Our Vision"
        lead="A world where every embedded device — from a $0.50 microcontroller to a $50,000 medical device — runs on a secure, AI-capable, open-source operating system."
      />

      <Section title="Six Pillars of EmbeddedOS">
        <ul className="cards">
          {pillars.map(p => (
            <li key={p.title}>
              <div className="card">
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Foundation Timeline" alt>
        <ol className="vs-tl">
          {timeline.map(t => (
            <li key={t.year + t.event}>
              <span className="vs-y">{t.year}</span>
              <p>{t.event}</p>
            </li>
          ))}
        </ol>
      </Section>

      <section className="band">
        <div className="wrap">
          <div>
            <h2>Join the Mission</h2>
            <p className="lead">
              Whether you contribute code, documentation, funding, or your time
              — you are part of building the future of embedded computing.
            </p>
          </div>
          <div className="ctas">
            <Link href="/get-involved" className="btn pri">
              Get Involved{" "}
              <span className="ar" aria-hidden="true">
                →
              </span>
            </Link>
            <Link href="/donate" className="btn gh">
              Donate
            </Link>
          </div>
        </div>
      </section>
    </BpPage>
  );
}
