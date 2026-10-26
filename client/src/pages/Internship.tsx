import type { CSSProperties } from "react";
import { openContactForm } from "@/lib/contact-form";
import { BpPage, PageHero, Section } from "@/components/bp";
import "./Internship.css";

const positions = [
  {
    status: "Open",
    season: "Summer 2026",
    color: "#F97316",
    title: "Kernel Engineering Intern",
    desc: "Work on the EoS RTOS scheduler, memory management, and IPC subsystems. Requires C/C++ proficiency and familiarity with ARM Cortex-M architecture.",
    location: "Remote",
    duration: "12 weeks",
    compensation: "Stipend",
  },
  {
    status: "Open",
    season: "Summer 2026",
    color: "#A855F7",
    title: "Embedded AI Research Intern",
    desc: "Research INT4/INT8 quantization, model compression, and on-device inference optimization for the eAI platform. Python + C, ML background required.",
    location: "Remote",
    duration: "12 weeks",
    compensation: "Stipend",
  },
  {
    status: "Open",
    season: "Fall 2026",
    color: "#22D3EE",
    title: "Neural Interface Engineering Intern",
    desc: "Work on the eNI BCI signal processing pipeline: ADC drivers, digital filter banks, and spike sorting algorithms. DSP and biomedical engineering background preferred.",
    location: "Remote",
    duration: "16 weeks",
    compensation: "Stipend",
  },
  {
    status: "Open",
    season: "Year-Round",
    color: "#34D399",
    title: "Documentation & Developer Relations",
    desc: "Write technical documentation, tutorials, and blog posts. Help onboard new contributors and improve the developer experience across all EmbeddedOS components.",
    location: "Remote",
    duration: "Flexible",
    compensation: "Volunteer/Stipend",
  },
];

const fellowship = [
  {
    title: "Research Fellowship",
    duration: "6 months",
    desc: "For graduate students and early-career researchers. Work on a focused research project (kernel verification, AI inference, neural interfaces, or hardware security) with mentorship from Foundation engineers.",
    stipend: "$2,000/month",
  },
  {
    title: "Engineering Fellowship",
    duration: "6 months",
    desc: "For engineers with 2+ years of embedded systems experience. Lead a major feature or subsystem implementation with full Foundation support and public attribution.",
    stipend: "$3,000/month",
  },
];

export default function Internship() {
  return (
    <BpPage className="intern">
      <PageHero
        sig
        label="INTERNSHIPS & FELLOWSHIPS"
        title="Internships & Fellowships"
        lead="Work on cutting-edge embedded systems, neural interfaces, and AI at the EmbeddedOS Research Foundation."
      />

      <Section title="Open Positions" className="in-open">
        <ul className="cards two">
          {positions.map(p => (
            <li key={p.title}>
              <div
                className="card in-card"
                style={{ "--c": p.color } as CSSProperties}
              >
                <div className="top">
                  <div>
                    <h3>{p.title}</h3>
                    <div className="in-season">{p.season}</div>
                  </div>
                  <span className="st ok">{p.status}</span>
                </div>
                <p>{p.desc}</p>
                <dl className="in-facts">
                  <div>
                    <dt>Location</dt>
                    <dd>{p.location}</dd>
                  </div>
                  <div>
                    <dt>Duration</dt>
                    <dd>{p.duration}</dd>
                  </div>
                  <div>
                    <dt>Compensation</dt>
                    <dd>{p.compensation}</dd>
                  </div>
                </dl>
                <button
                  type="button"
                  onClick={() =>
                    openContactForm({
                      topic: "contact",
                      subject: "Internship Application",
                    })
                  }
                  className="btn gh in-cta"
                >
                  Apply Now{" "}
                  <span className="ar" aria-hidden="true">
                    →
                  </span>
                </button>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        title="Research Fellowship Program"
        lead="The EmbeddedOS Foundation offers 6-month research fellowships for graduate students and early-career researchers."
        split
        alt
      >
        <ul className="cards two">
          {fellowship.map(f => (
            <li key={f.title}>
              <div className="card in-card">
                <h3>{f.title}</h3>
                <div className="in-terms">
                  {f.duration} · {f.stipend}
                </div>
                <p>{f.desc}</p>
                <button
                  type="button"
                  onClick={() =>
                    openContactForm({
                      topic: "contact",
                      subject: "Fellowship Application",
                    })
                  }
                  className="btn gh in-cta"
                >
                  Apply{" "}
                  <span className="ar" aria-hidden="true">
                    →
                  </span>
                </button>
              </div>
            </li>
          ))}
        </ul>
      </Section>
    </BpPage>
  );
}
