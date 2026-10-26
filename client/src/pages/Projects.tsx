import type { CSSProperties } from "react";
import { REPO_COUNT, SIM_PLATFORM_COUNT } from "@/data/stack";
import {
  Band,
  BpPage,
  LocalNav,
  PageHero,
  Section,
  Stats,
} from "@/components/bp";
import "./Projects.css";

const REPO_GROUPS = [
  {
    title: "Core OS",
    color: "#F97316",
    repos: [
      {
        name: "EoS Kernel",
        desc: "Real-time embedded OS — the heart of EmbeddedOS",
        href: "https://github.com/embeddedos-org/eos",
        stars: "⭐ Core",
      },
      {
        name: "eBoot",
        desc: "Secure bootloader with OTA update support",
        href: "https://github.com/embeddedos-org/eBoot",
        stars: "⭐ Core",
      },
      {
        name: "eIPC",
        desc: "Ultra-low latency inter-process communication",
        href: "https://github.com/embeddedos-org/eIPC",
        stars: "⭐ Core",
      },
      {
        name: "ebuild",
        desc: "Next-gen build tool for the EoS ecosystem",
        href: "https://github.com/embeddedos-org/ebuild",
        stars: "⭐ Core",
      },
      {
        name: "eosllm",
        desc: "On-device LLM inference engine",
        href: "https://github.com/embeddedos-org/eosllm",
        stars: "⭐ Core",
      },
      // eos-programming-language is a private repo — link the org profile until it is published.
      {
        name: "EoS Language",
        desc: "Fastest embedded APIs & programming language",
        href: "https://github.com/embeddedos-org",
        stars: "⭐ Core",
      },
    ],
  },
  {
    title: "AI & Neural",
    color: "#34D399",
    repos: [
      {
        name: "eAI",
        desc: "AI layer with eBot agent and edge inference",
        href: "https://github.com/embeddedos-org/eAI",
        stars: "⭐ AI",
      },
      {
        name: "eNI",
        desc: "Neural interface adapter for BCI devices",
        href: "https://github.com/embeddedos-org/eNI",
        stars: "⭐ AI",
      },
    ],
  },
  {
    title: "Dev Tools",
    color: "#22D3EE",
    repos: [
      {
        name: "EoSim",
        desc: `${SIM_PLATFORM_COUNT}-platform simulator for hardware-free development`,
        href: "https://github.com/embeddedos-org/eosim",
        stars: "⭐ Tools",
      },
      {
        name: "EoStudio",
        desc: "Universal IDE v3.1 for EmbeddedOS development",
        href: "https://github.com/embeddedos-org/eostudio",
        stars: "⭐ Tools",
      },
    ],
  },
  {
    title: "Applications",
    color: "#A78BFA",
    repos: [
      {
        name: "eApps",
        desc: "60+ embedded apps across all platforms",
        href: "https://github.com/embeddedos-org/eApps",
        stars: "⭐ Apps",
      },
      {
        name: "eOffice",
        desc: "11-app office suite for embedded systems",
        href: "https://github.com/embeddedos-org/eApps",
        stars: "⭐ Apps",
      },
      {
        name: "eBrowser",
        desc: "Privacy-first lightweight browser",
        href: "https://github.com/embeddedos-org/eApps",
        stars: "⭐ Apps",
      },
      {
        name: "eDB",
        desc: "Embedded SQL database with AI query support",
        href: "https://github.com/embeddedos-org/eApps",
        stars: "⭐ Apps",
      },
    ],
  },
  {
    title: "Health Devices",
    color: "#F85149",
    repos: [
      {
        name: "HEALTH-KEY ULTRA",
        desc: "USB-C ECG + SpO₂ pendrive — Patent Pending",
        href: "https://github.com/embeddedos-org/eos-health",
        stars: "🔬 Health",
      },
      {
        name: "HEALTH-BAND Neuro",
        desc: "sEMG + TENS AI wristband — Patent Pending",
        href: "https://github.com/embeddedos-org/eos-health",
        stars: "🔬 Health",
      },
      {
        name: "HEALTH-RING",
        desc: "Titanium smart ring with ECG + glucose",
        href: "https://github.com/embeddedos-org/eos-health",
        stars: "🔬 Health",
      },
      {
        name: "HEALTH-LAB",
        desc: "14-day biosensor patch for biochemistry",
        href: "https://github.com/embeddedos-org/eos-health",
        stars: "🔬 Health",
      },
      {
        name: "Health Hub App",
        desc: "Unified iOS + Android health app",
        href: "https://github.com/embeddedos-org/eos-health",
        stars: "🔬 Health",
      },
    ],
  },
  {
    title: "Aerospace",
    color: "#60A5FA",
    repos: [
      // eos-aero is a private repo — point at the on-site Aerospace page instead of a 404.
      {
        name: "AeroSwift Personal",
        desc: "1-2 seat solar-hybrid VTOL aircraft",
        href: "/aerospace",
        stars: "✈️ Aero",
      },
      {
        name: "AeroSwift Transit",
        desc: "10-seat urban air taxi platform",
        href: "/aerospace",
        stars: "✈️ Aero",
      },
    ],
  },
];

const STATS = [
  { value: String(REPO_COUNT), label: "Repositories" },
  { value: "60+", label: "Applications" },
  { value: "4", label: "Health Devices" },
  { value: "2", label: "Aircraft Models" },
];

// Anchors for the local navigation, one per repository group.
const groupId = (title: string) =>
  "group-" + title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

export default function Projects() {
  return (
    <BpPage className="projectspage">
      <PageHero
        sig
        label="Open Source Ecosystem"
        title={
          <>
            All <span>Projects</span>
          </>
        }
        lead={
          <>
            {REPO_COUNT} open-source repositories spanning embedded OS, AI,
            health devices, aerospace, and developer tools. Everything is open.
            Everything is connected.
          </>
        }
      >
        <div className="ctas">
          <a
            href="https://github.com/embeddedos-org"
            target="_blank"
            rel="noopener noreferrer"
            className="btn pri"
          >
            Browse All on GitHub{" "}
            <span className="ar" aria-hidden="true">
              →
            </span>
          </a>
        </div>
      </PageHero>

      <div className="wrap pj-stats">
        <Stats items={STATS} />
      </div>

      <LocalNav
        name="Projects"
        items={REPO_GROUPS.map(g => ({ id: groupId(g.title), label: g.title }))}
      />

      {/* Repo Groups */}
      <Section className="pj-groups">
        {REPO_GROUPS.map(group => (
          <div
            key={group.title}
            id={groupId(group.title)}
            className="pj-group"
            style={{ "--c": group.color } as CSSProperties}
          >
            <h2 className="pj-gh">{group.title}</h2>
            <ul className="cards">
              {group.repos.map(repo => (
                <li key={repo.name}>
                  <a
                    href={repo.href}
                    {...(repo.href.startsWith("/")
                      ? {}
                      : { target: "_blank", rel: "noopener noreferrer" })}
                    className="card"
                  >
                    <div className="top">
                      <h3>{repo.name}</h3>
                      <span className="pj-tag">{repo.stars}</span>
                    </div>
                    <p>{repo.desc}</p>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Section>

      <Band
        title="Star the Repos"
        lead={
          <>
            Every star helps EmbeddedOS grow. Join {REPO_COUNT} repos and help
            build the OS for every device.
          </>
        }
      >
        <a
          href="https://github.com/embeddedos-org"
          target="_blank"
          rel="noopener noreferrer"
          className="btn pri"
        >
          View All Repos
        </a>
      </Band>
    </BpPage>
  );
}
