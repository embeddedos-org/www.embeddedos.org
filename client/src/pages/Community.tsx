import { Link } from "wouter";
import { COMMUNITY_LINKS } from "@/data/community";
import { SOCIAL_URLS } from "@/data/foundation";
import { BOARD_COUNT, REPO_COUNT } from "@/data/stack";
import {
  Band,
  BpPage,
  LocalNav,
  PageHero,
  Section,
  Stats,
} from "@/components/bp";
import "./Community.css";

const ways = [
  {
    title: "Contribute Code",
    desc: "Fix bugs, add features, write BSP drivers, or improve the EoS kernel. All skill levels welcome.",
    href: "https://github.com/embeddedos-org",
    cta: "View GitHub",
  },
  {
    title: "Write Documentation",
    desc: "Improve API docs, write tutorials, translate content, or add examples to the developer wiki.",
    href: "/docs",
    cta: "View Docs",
  },
  {
    title: "Join Discussions",
    desc: "Ask questions, share projects, and help other engineers on GitHub Discussions.",
    href: "https://github.com/orgs/embeddedos-org/discussions",
    cta: "Open Discussions",
  },
  {
    title: "Donate",
    desc: "Fund open-source development, free certifications, and education for engineers worldwide.",
    href: "/donate",
    cta: "Donate Now",
  },
  {
    title: "Spread the Word",
    desc: "Star the repos, share on social media, write blog posts, or speak at conferences.",
    href: "https://github.com/embeddedos-org",
    cta: "Star on GitHub",
  },
  {
    title: "Join a Working Group",
    desc: "Join the kernel WG, AI WG, hardware WG, or documentation WG for focused collaboration.",
    href: "https://github.com/orgs/embeddedos-org/discussions",
    cta: "Find a WG",
  },
];

const stats = [
  { value: String(REPO_COUNT), label: "Open Repositories" },
  { value: String(BOARD_COUNT), label: "Supported Boards" },
  { value: "300+", label: "Public APIs" },
  { value: "14", label: "Books Published" },
];

/*
  Every href here reads SOCIAL_URLS. This list is where the drift that
  constant exists to prevent kept reappearing: X was written as twitter.com
  while the footer and /about used x.com, and YouTube as youtube.com while
  everywhere else used www.youtube.com — the same account under two names,
  twice on one screen.
*/
const channels = [
  {
    label: "GitHub",
    desc: "Issues, PRs, and Discussions",
    href: SOCIAL_URLS.github,
  },
  {
    label: "X / Twitter",
    desc: "@EmbeddedOS_ORG — announcements & updates",
    href: SOCIAL_URLS.x,
  },
  {
    label: "Instagram",
    desc: "@embeddedos.org — hardware, builds and events",
    href: SOCIAL_URLS.instagram,
  },
  {
    label: "YouTube",
    desc: "Tutorials, demos, and conference talks",
    href: SOCIAL_URLS.youtube,
  },
  {
    label: "Discord",
    desc: "Real-time community chat and collaboration",
    href: SOCIAL_URLS.discord,
  },
  {
    label: "GitHub Discussions",
    desc: "Q&A, show & tell, and RFC discussions",
    href: SOCIAL_URLS.discussions,
  },
];

export default function Community() {
  return (
    <BpPage className="community">
      <PageHero
        sig
        label="COMMUNITY"
        title="Built by the Community"
        lead="EmbeddedOS is built by embedded engineers from around the world. Every contribution — code, docs, hardware designs, or feedback — makes the platform better for everyone."
      />
      <LocalNav
        name="Community"
        items={[
          { id: "contribute", label: "Ways to contribute" },
          { id: "resources", label: "Resources" },
          { id: "channels", label: "Channels" },
        ]}
      />

      <div className="wrap cm-stats">
        <Stats items={stats.map(s => ({ value: s.value, label: s.label }))} />
      </div>

      <Section
        id="contribute"
        title="6 Ways to Contribute"
        lead="Every skill set has a place in the EmbeddedOS community."
        split
      >
        <ul className="cards">
          {ways.map(w => (
            <li key={w.title}>
              <div className="card">
                <h3>{w.title}</h3>
                <p>{w.desc}</p>
                <a href={w.href} className="more cm-go">
                  {w.cta} <span aria-hidden="true">→</span>
                </a>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <section id="resources" className="sec alt" data-community-resources>
        <div className="wrap">
          <div className="sec-h split">
            <h2>Community Resources</h2>
            <div className="lead">
              Follow public decisions, report work, and find the guidance used
              to contribute to this repository.
            </div>
          </div>
          <ul className="glinks cols cm-links">
            {COMMUNITY_LINKS.map(link => (
              <li key={link.name}>
                <a href={link.href} target="_blank" rel="noopener noreferrer">
                  <span>{link.name}</span>
                  <small>{link.description}</small>
                  <i aria-hidden="true">↗</i>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Section id="channels" title="Community Channels" split>
        <ul className="cards cm-channels">
          {channels.map(c => (
            <li key={c.label}>
              <a
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className="card"
              >
                <h3>{c.label}</h3>
                <p>{c.desc}</p>
              </a>
            </li>
          ))}
        </ul>
      </Section>

      <Band
        title="Ready to Contribute?"
        lead="Start with a good-first-issue on GitHub or join the weekly community call."
      >
        <Link href="/get-involved" className="btn pri">
          Get Involved{" "}
          <span className="ar" aria-hidden="true">
            →
          </span>
        </Link>
        <a
          href="https://github.com/embeddedos-org"
          target="_blank"
          rel="noopener noreferrer"
          className="btn gh"
        >
          GitHub
        </a>
      </Band>
    </BpPage>
  );
}
