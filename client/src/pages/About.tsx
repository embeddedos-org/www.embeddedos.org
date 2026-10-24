import { Link } from "wouter";
import { BOARD_COUNT, REPO_COUNT } from "@/data/stack";
import { SOCIAL_URLS } from "@/data/foundation";
import { openContactForm } from "@/lib/contact-form";
import { BpPage, LocalNav, PageHero, Section, Stats } from "@/components/bp";
import "./About.css";

const MILESTONES = [
  {
    year: "2018",
    title: "Project Inception",
    desc: "embeddedos.org domain registered and the EmbeddedOS project started — early research into a unified open-source OS for every embedded device.",
  },
  {
    year: "2020",
    title: "Kernel Architecture Research",
    desc: "Core kernel architecture and real-time scheduling research underway, targeting ARM Cortex-M and RISC-V platforms.",
  },
  {
    year: "2023",
    title: "EoS Kernel v0.1",
    desc: "First public release of the EoS real-time kernel, supporting ARM Cortex-M and RISC-V architectures.",
  },
  {
    year: "2024",
    title: "Health Devices & Patents",
    desc: "HEALTH-KEY ULTRA and HEALTH-BAND Neuro patent applications filed (U.S. App. No. 64/073,334 and 64/076,078).",
  },
  {
    year: "2024",
    title: "AeroSwift Announced",
    desc: "AeroSwift Personal and Transit VTOL aircraft platforms announced, powered by EmbeddedOS avionics stack.",
  },
  {
    year: "2025",
    title: "22 Open-Source Repos",
    desc: "Ecosystem grows to 22 public repositories covering kernel, AI, dev tools, health, aerospace, and applications.",
  },
  {
    year: "2026",
    title: "501(c)(3) Foundation",
    desc: "Embedded Operating Systems Research Foundation incorporated as a 501(c)(3) public charity (EIN: 41-4821627), effective March 11, 2026.",
  },
  {
    year: "2026",
    title: "eAI & eNI Released",
    desc: "On-device AI inference (eAI) and neural interface adapter (eNI) released, enabling edge AI on embedded hardware.",
  },
];

const TEAM_VALUES = [
  {
    title: "Open by Default",
    desc: "Every line of code, every design decision, every research paper — published openly under MIT license.",
  },
  {
    title: "Hardware First",
    desc: "We build for real hardware. From 8-bit microcontrollers to 64-bit SoCs, EmbeddedOS runs everywhere.",
  },
  {
    title: "Education Driven",
    desc: "14 technical books, a kids edition, and a hardware lab — we invest in the next generation of embedded engineers.",
  },
  {
    title: "Community Powered",
    desc: "A 501(c)(3) Foundation with no VC funding. Every contribution, donation, and pull request matters.",
  },
  {
    title: "Inclusive Ecosystem",
    desc: "From hobbyists to aerospace engineers, EmbeddedOS is designed for every skill level and every device.",
  },
  {
    title: "Transparent Governance",
    desc: "Public roadmap, open issues, and community RFCs. No black boxes, no hidden agendas.",
  },
];

export default function About() {
  return (
    <BpPage className="about">
      {/* Hero */}
      <PageHero
        sig
        label="About the Foundation"
        title="Embedded Operating Systems Research Foundation"
        lead="A 501(c)(3) organization dedicated to advancing open-source embedded systems research, education, and technology for the benefit of humanity."
      >
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
      </PageHero>
      <LocalNav
        name="About"
        items={[
          { id: "mission", label: "Our Mission" },
          { id: "values", label: "Our Values" },
          { id: "history", label: "History" },
          { id: "details", label: "Foundation Details" },
          { id: "connect", label: "Connect" },
          { id: "foundation", label: "The Foundation" },
        ]}
      />

      {/* Mission */}
      <Section
        id="mission"
        label="Our Mission"
        title="The Operating System for Every Device"
      >
        <div className="split2 ab-mission">
          <div className="prose">
            <p>
              The Embedded Operating Systems Research Foundation was established
              to create a world where every embedded device — from a $2
              microcontroller to a VTOL aircraft — runs on open, auditable, and
              community-maintained software.
            </p>
            <p>
              We believe that the software powering medical devices, industrial
              controllers, aerospace avionics, and consumer electronics should
              be transparent, secure, and accessible to everyone — not locked
              behind proprietary licenses or vendor lock-in.
            </p>
            <p>
              As a 501(c)(3), we are accountable to our community, not to
              shareholders. Every dollar donated goes directly to research,
              development, and education.
            </p>
          </div>
          <Stats
            items={[
              { value: String(REPO_COUNT), label: "Open-Source Repos" },
              { value: String(BOARD_COUNT), label: "Supported Boards" },
              { value: "300+", label: "APIs Documented" },
              { value: "14", label: "Technical Books" },
              { value: "60+", label: "Applications" },
              { value: "4", label: "Health Devices" },
            ]}
          />
        </div>
      </Section>

      {/* Values */}
      <Section id="values" label="Our Values" title="What We Stand For" alt>
        <ul className="cards">
          {TEAM_VALUES.map(v => (
            <li key={v.title}>
              <div className="card">
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      {/* Timeline */}
      <Section id="history" label="History" title="Our Journey">
        <ol className="ab-tl">
          {MILESTONES.map(m => (
            <li key={m.year + m.title}>
              <span className="ab-y">{m.year}</span>
              <div>
                <p className="ab-t">{m.title}</p>
                <p className="ab-d">{m.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {/* Legal */}
      <Section
        id="details"
        label="Legal & Governance"
        title="Foundation Details"
        alt
      >
        <dl className="kv">
          <dt>Legal Name</dt>
          <dd>Embedded Operating Systems Research Foundation</dd>
          <dt>Tax Status</dt>
          <dd>501(c)(3) Organization</dd>
          <dt>Software License</dt>
          <dd>MIT License (all repositories)</dd>
          <dt>Hosting</dt>
          <dd>Powered by InterServer</dd>
          <dt>Website</dt>
          <dd>
            <a
              href="https://www.embeddedos.org"
              target="_blank"
              rel="noopener noreferrer"
              className="tl"
            >
              www.embeddedos.org
            </a>
          </dd>
          <dt>Contact</dt>
          <dd>
            <button
              type="button"
              onClick={() => openContactForm({ topic: "contact" })}
              className="tl"
            >
              Send a message
            </button>
          </dd>
        </dl>
      </Section>

      {/* Social / Connect */}
      <Section
        id="connect"
        title="Connect With Us"
        lead="Follow the foundation across all platforms for updates, research, and community news."
      >
        <div className="ab-social">
          {[
            { href: SOCIAL_URLS.github, label: "GitHub" },
            { href: SOCIAL_URLS.x, label: "X / Twitter" },
            { href: SOCIAL_URLS.linkedin, label: "LinkedIn" },
            { href: SOCIAL_URLS.youtube, label: "YouTube" },
            { href: SOCIAL_URLS.instagram, label: "Instagram" },
            { href: SOCIAL_URLS.facebook, label: "Facebook" },
            {
              onClick: () => openContactForm({ topic: "contact" }),
              label: "Email",
            },
          ].map(({ href, onClick, label }) =>
            href ? (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="btn gh"
              >
                {label}
              </a>
            ) : (
              <button
                key={label}
                type="button"
                onClick={onClick}
                className="btn gh"
              >
                {label}
              </button>
            )
          )}
        </div>
      </Section>

      {/*
        The Foundation's institutional pages, in one place. /about is the
        footer's hub for them: What We Do, Industries, Patents and Careers
        are not footer columns, so this section is their way in — see
        tests/unit/navigation.test.ts.
      */}
      <Section
        id="foundation"
        title="The Foundation"
        lead="What we do, where we work, what we hold, and who does it."
        alt
      >
        <ul className="glinks cols">
          {[
            { label: "What We Do", href: "/what-we-do" },
            { label: "Industries", href: "/industries" },
            { label: "Patents", href: "/patents" },
            { label: "Careers", href: "/careers" },
            { label: "Mission & Scope", href: "/mission" },
            { label: "Transparency", href: "/transparency" },
          ].map(item => (
            <li key={item.href}>
              <Link href={item.href}>
                {item.label} <i aria-hidden="true">→</i>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </BpPage>
  );
}
