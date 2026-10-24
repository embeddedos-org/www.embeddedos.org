import { Link } from "wouter";

import ProgrammeList from "@/components/ProgrammeList";
import {
  RESEARCH_KINDS,
  areaSummary,
  badgeOf,
  byKinds,
  formatDate,
  isInternal,
  kindSummary,
  type ContentItem,
} from "@/data/content";
import { Band, BpPage, LocalNav, PageHero, Section } from "@/components/bp";
import "./Research.css";

/**
 * Research output indexes, in one place. /research is the footer's hub
 * for them: these indexes are not footer columns, so these cards are
 * their way in — see tests/unit/navigation.test.ts.
 */
/**
 * Where each research output kind is listed. Written out (rather than derived
 * from the category registry) so the hub's promise is visible at the point of
 * use — and so tests/unit/navigation.test.ts can see the addresses too.
 */
const RESEARCH_KIND_PATHS: Record<string, string> = {
  publication: "/publications",
  "white-paper": "/white-papers",
  "technical-report": "/technical-reports",
  benchmark: "/benchmarks",
  dataset: "/datasets",
};

const areas = [
  {
    title: "Neural Link & AI Integration",
    desc: "Research into brain-computer interfaces (BCI) using the ENI framework. Topics include spike sorting algorithms, neural decoding, closed-loop stimulation, and BCI latency optimization.",
    href: "/neural-link-ai",
  },
  {
    title: "AI Operating Systems",
    desc: "Investigating how AI inference should be integrated at the OS level — scheduling AI tasks alongside real-time tasks, memory management for model weights, and hardware-aware kernel extensions.",
    href: "/ai-os",
  },
  {
    title: "Building OS with Linux/RTOS",
    desc: "Research into hybrid OS architectures that combine Linux user-space with real-time EoS kernel guarantees — enabling rich application ecosystems without sacrificing determinism.",
    href: "/building-os",
  },
  {
    title: "Future Research Programs",
    desc: "Post-quantum cryptography for embedded systems, formal verification of the EoS kernel, energy harvesting OS primitives, and federated learning on microcontrollers.",
    href: "/future-research",
  },
  {
    title: "Open Hardware Research",
    desc: "CAD-driven hardware co-design using the eCAD framework — from schematic capture to firmware simulation. Research into open hardware certification pathways (CE, FCC, FDA).",
    href: "/hardware-lab",
  },
  {
    title: "Embedded AI Benchmarks",
    desc: "Developing standardized benchmarks for embedded AI inference — latency, throughput, energy efficiency, and accuracy on constrained hardware. Published openly for community use.",
    href: "/eai",
  },
];

/**
 * Publications come from the shared content registry, not from an array here.
 *
 * This page previously kept its own list, and it had drifted: four entries
 * pointed at the same URLs as /news while giving them different titles. One
 * article, two names, depending which page you landed on. A registry keyed by
 * href makes that impossible to reintroduce.
 */
const papers: ContentItem[] = byKinds(RESEARCH_KINDS);

export default function Research() {
  return (
    <BpPage className="research">
      <PageHero
        sig
        label="RESEARCH"
        title="Research Programs"
        lead="The EmbeddedOS Foundation conducts open research across embedded AI, neural interfaces, OS architecture, and hardware security. All findings are published openly."
      />
      <LocalNav
        name="Research"
        items={[
          { id: "areas", label: "Areas" },
          { id: "programme", label: "Research programme" },
          { id: "programmes", label: "Programmes" },
          { id: "publications", label: "Publications" },
        ]}
      />

      <Section id="areas" title="Research Areas">
        <ul className="cards">
          {areas.map(a => (
            <li key={a.title}>
              <Link href={a.href} className="card">
                <h3>{a.title}</h3>
                <p>{a.desc}</p>
                <span className="more">
                  Read more <span aria-hidden="true">→</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      {/*
        The research programme's full shape, counts included — and the zeroes
        are the point. Listing only categories that already have something in
        them hides the programme from anyone deciding what to write next, and
        lets the published taxonomy drift with whoever published last. A
        category showing 0 is a commissioning brief; a category that quietly
        disappeared is a mystery.
      */}
      <Section
        id="programme"
        title="Research Programme"
        lead="What the Foundation publishes, and what it publishes about. Counts are live; a zero is work not yet done, not a category that does not exist."
        split
        alt
      >
        <h3 className="label rp-h">By output</h3>
        <ul className="rp-grid five">
          {kindSummary(RESEARCH_KINDS).map(c => (
            <li key={c.key}>
              <Link
                href={RESEARCH_KIND_PATHS[c.key] ?? "/research"}
                className={c.count > 0 ? "rp-cell on" : "rp-cell"}
              >
                <span className="rp-name">{c.label}</span>
                <span className="rp-n">
                  {c.count > 0 ? `${c.count} published` : "none yet"}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <h3 className="label rp-h">By subject</h3>
        {/*
          Each subject is now a link to its own page. /research is the
          footer's hub for the eight /research/* routes, and a hub whose
          members are not reachable from it is not a hub — it just looked
          like one.
        */}
        <ul className="rp-grid">
          {areaSummary().map(c => (
            <li key={c.key}>
              <Link
                href={`/research/${c.key}`}
                className={c.count > 0 ? "rp-cell on" : "rp-cell"}
              >
                <span className="rp-name">{c.label}</span>
                <span className="rp-n">
                  {c.count > 0 ? `${c.count} published` : "none yet"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <ProgrammeList
        id="programmes"
        track="research"
        heading="Research Programmes"
        intro="Collaboration and funding, as distinct from what the Foundation publishes."
      />

      <Section id="publications" title="Publications & Reports">
        <ul className="rs-papers">
          {papers.map(p => (
            <li key={p.title}>
              <div>
                <div className="rs-title">{p.title}</div>
                <div className="rs-meta">
                  <span className="rs-date">{formatDate(p.date)}</span>
                  <span>{badgeOf(p)}</span>
                </div>
              </div>
              {isInternal(p) ? (
                <Link
                  href={p.href}
                  aria-label={`Read ${p.title}`}
                  className="rs-go"
                >
                  <span aria-hidden="true">→</span>
                </Link>
              ) : (
                <a
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Read ${p.title}, opens in a new tab`}
                  className="rs-go"
                >
                  <span aria-hidden="true">↗</span>
                </a>
              )}
            </li>
          ))}
        </ul>
      </Section>

      <Band
        title="Contribute to Research"
        lead="The Foundation welcomes research contributions. Apply for a fellowship or open a research RFC on GitHub Discussions."
      >
        <Link href="/internship" className="btn pri">
          Apply for Fellowship{" "}
          <span className="ar" aria-hidden="true">
            →
          </span>
        </Link>
        <a
          href="https://github.com/orgs/embeddedos-org/discussions"
          target="_blank"
          rel="noopener noreferrer"
          className="btn gh"
        >
          GitHub Discussions
        </a>
      </Band>
    </BpPage>
  );
}
