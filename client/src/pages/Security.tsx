import { BpPage, PageHero, Section, Band } from "@/components/bp";
import { openContactForm } from "@/lib/contact-form";
import "./Security.css";

const policies = [
  {
    title: "Responsible Disclosure",
    desc: "Use the contact form below with vulnerability details. We follow a 90-day disclosure timeline. Critical vulnerabilities are patched within 7 days.",
  },
  {
    title: "Scope",
    desc: "All EmbeddedOS repositories on GitHub are in scope: EoS kernel, eBootloader, EAI, ENI, EIPC, eBuild, EoSim, EoStudio, eDB, eBrowser, eOffice, and all related tooling.",
  },
  {
    title: "Out of Scope",
    desc: "Third-party dependencies, GitHub infrastructure, social engineering attacks, and physical attacks on hardware are out of scope.",
  },
  {
    title: "Recognition",
    desc: "Security researchers who responsibly disclose valid vulnerabilities are credited in the security advisory and our Hall of Fame.",
  },
];

const features = [
  {
    title: "Capability-Based Security",
    desc: "EoS uses capability tokens for all inter-process communication. Processes cannot access resources they were not explicitly granted at creation time.",
  },
  {
    title: "Verified Boot Chain",
    desc: "eBootloader implements a 5-stage verified boot with Ed25519 signatures, hardware root of trust, and rollback protection.",
  },
  {
    title: "Memory Safety",
    desc: "EoS enforces strict memory isolation between processes using MPU/MMU. Stack canaries and ASLR are supported on capable hardware.",
  },
  {
    title: "Cryptographic Primitives",
    desc: "The EoS crypto module provides AES-256-GCM, ChaCha20-Poly1305, Ed25519, X25519, SHA-3, and BLAKE3 — all with constant-time implementations.",
  },
  {
    title: "Secure OTA Updates",
    desc: "All firmware updates are signed with Ed25519 and verified before activation. Version rollback is prevented by a hardware-backed counter.",
  },
  {
    title: "Post-Quantum Roadmap",
    desc: "CRYSTALS-Kyber and CRYSTALS-Dilithium are on the v0.3 roadmap for quantum-resistant key exchange and signatures.",
  },
];

export default function Security() {
  return (
    <BpPage className="security">
      <PageHero
        sig
        label="SECURITY POLICY"
        title="Security Policy"
        lead="How to report vulnerabilities and how EmbeddedOS is built to be secure."
      />

      <Section title="Report a Vulnerability">
        {/* the page's most important instruction, set apart as a callout */}
        <div className="gnote sc-warn" role="note">
          <p>
            Do <strong>not</strong> open a public GitHub issue for security
            vulnerabilities.{" "}
            <button
              type="button"
              onClick={() => openContactForm({ topic: "security" })}
              className="tl"
            >
              Report it here
            </button>{" "}
            with details. We will respond within 48 hours.
          </p>
        </div>
        <ul className="cards two">
          {policies.map(p => (
            <li key={p.title}>
              <div className="card">
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Security Architecture" alt>
        <ul className="cards">
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

      <Band title="Contact Security Team">
        <button
          type="button"
          onClick={() => openContactForm({ topic: "security" })}
          className="btn or"
        >
          Contact Security Team
        </button>
      </Band>
    </BpPage>
  );
}
