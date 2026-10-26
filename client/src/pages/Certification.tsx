import { useState, type CSSProperties } from "react";
import { Link } from "wouter";
import { BpPage, PageHero, Section, Stats } from "@/components/bp";
import "./Certification.css";

const tracks = [
  {
    id: "eos",
    name: "EoS Developer",
    color: "#F97316",
    certs: [
      "EoS Fundamentals (EoSF)",
      "EoS Advanced (EoSA)",
      "EoS Expert (EoSE)",
      "EoS Architect (EoSAr)",
    ],
    exams: 4,
  },
  {
    id: "security",
    name: "Security",
    color: "#EF4444",
    certs: [
      "Embedded Security Fundamentals (ESF)",
      "Secure Boot Specialist (SBS)",
      "Crypto & PKI (CPK)",
      "Security Architect (ESA)",
    ],
    exams: 4,
  },
  {
    id: "ai",
    name: "AI/ML",
    color: "#A855F7",
    certs: [
      "EAI Fundamentals (EAIF)",
      "EAI Practitioner (EAIP)",
      "Neural Interface Specialist (NIS)",
      "AI Architect (EAIAr)",
    ],
    exams: 4,
  },
  {
    id: "health",
    name: "Health Devices",
    color: "#34D399",
    certs: [
      "eHealth365 Developer (EHD)",
      "Medical Device Compliance (MDC)",
      "BCI Specialist (BCIS)",
      "Health Architect (EHA)",
    ],
    exams: 4,
  },
  {
    id: "aerospace",
    name: "Aerospace",
    color: "#22D3EE",
    certs: [
      "Aerospace Fundamentals (AEF)",
      "DO-178C Compliance (DO178)",
      "ARINC 653 Specialist (A653)",
      "Aerospace Architect (AEA)",
    ],
    exams: 4,
  },
  {
    id: "rtos",
    name: "RTOS & Kernel",
    color: "#FBBF24",
    certs: [
      "RTOS Fundamentals (RTOSF)",
      "Kernel Internals (KI)",
      "Driver Development (DD)",
      "RTOS Architect (RTOSA)",
    ],
    exams: 4,
  },
];

const steps = [
  {
    num: "01",
    title: "Choose a Track",
    desc: "Select the certification track that matches your role and goals. All tracks start with a Fundamentals exam.",
  },
  {
    num: "02",
    title: "Study the Curriculum",
    desc: "Use EoStudio's built-in learning paths, the official documentation, and the EmbeddedOS Books library to prepare.",
  },
  {
    num: "03",
    title: "Practice in EoSim",
    desc: "All certification exams include a practical component. Use EoSim to practice the hands-on tasks before exam day.",
  },
  {
    num: "04",
    title: "Take the Exam",
    desc: "Exams are proctored online. Each exam is 90 minutes: 60 multiple-choice questions + 2 practical tasks in EoSim.",
  },
  {
    num: "05",
    title: "Earn Your Badge",
    desc: "Pass the exam to receive a digital badge (Credly) and a PDF certificate. Badges are verifiable by employers.",
  },
];

export default function CertificationPage() {
  const [activeTrack, setActiveTrack] = useState("eos");
  const track = tracks.find(t => t.id === activeTrack)!;

  return (
    <BpPage className="cert">
      <PageHero
        sig
        label="CERTIFICATION"
        title="Professional Certifications"
        lead="60 industry-recognized credentials across 12 tracks. Free to attempt, verifiable by employers, and backed by the EmbeddedOS 501(c)(3) Foundation."
      >
        <div className="ct-stats">
          <Stats
            items={[
              { value: "60", label: "Certifications" },
              { value: "12", label: "Tracks" },
              { value: "Free", label: "To Attempt" },
              { value: "Credly", label: "Digital Badges" },
            ]}
          />
        </div>
      </PageHero>

      <Section id="tracks" title="Certification Tracks">
        <div className="ct-tracks">
          {tracks.map(t => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTrack(t.id)}
              aria-pressed={activeTrack === t.id}
              className="ct-tb"
              style={{ "--c": t.color } as CSSProperties}
            >
              {t.name}
            </button>
          ))}
        </div>
        <div
          className="ct-track"
          style={{ "--c": track.color } as CSSProperties}
        >
          <div className="ct-th">
            <h3>{track.name} Track</h3>
            <span className="ct-ex">{track.exams} exams</span>
          </div>
          <ol className="ct-certs">
            {track.certs.map((cert, i) => (
              <li key={cert}>
                <span className="ct-n">{i + 1}</span>
                <span>{cert}</span>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <Section id="how" title="How to Earn Your Certification" split>
        <ol className="steps num ct-steps">
          {steps.map(s => (
            <li key={s.num}>
              <span className="n">{s.num}</span>
              <div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="ctas ct-ctas">
          <Link href="/getting-started" className="btn pri">
            Start Studying{" "}
            <span className="ar" aria-hidden="true">
              →
            </span>
          </Link>
          <Link href="/internship" className="btn gh">
            Internship Program
          </Link>
        </div>
      </Section>
    </BpPage>
  );
}
