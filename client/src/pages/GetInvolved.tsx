import ProgrammeList from "@/components/ProgrammeList";
import { BpPage, LocalNav, PageHero, Section } from "@/components/bp";
import "./GetInvolved.css";

const WAYS_TO_CONTRIBUTE = [
  {
    title: "Write Code",
    desc: "Fix bugs, add features, or build new components. All skill levels welcome — from first PR to kernel hacker.",
    action: "Browse Issues",
    href: "https://github.com/embeddedos-org/eos/issues",
  },
  {
    title: "Improve Docs",
    desc: "Write tutorials, fix typos, translate content, or add examples. Good docs are as valuable as good code.",
    action: "View Docs Repo",
    href: "https://github.com/embeddedos-org/embeddedos-org",
  },
  {
    title: "Test Hardware",
    desc: "Port EmbeddedOS to new boards, test BSPs, and report hardware-specific bugs.",
    action: "Hardware Lab",
    href: "/hardware-lab",
  },
  {
    title: "Build Apps",
    desc: "Create new eApps, browser extensions, or mobile apps for the ecosystem.",
    action: "eApps Repo",
    href: "https://github.com/embeddedos-org/eApps",
  },
  {
    title: "Join Discussions",
    desc: "Answer questions, share ideas, and help newcomers in GitHub Discussions.",
    action: "Open Discussions",
    href: "https://github.com/orgs/embeddedos-org/discussions",
  },
  {
    title: "Star & Share",
    desc: "Star the repos, share on social media, and help grow the EmbeddedOS community.",
    action: "Star on GitHub",
    href: "https://github.com/embeddedos-org",
  },
];

const REPOS = [
  {
    name: "eos",
    desc: "Core kernel",
    href: "https://github.com/embeddedos-org/eos",
  },
  {
    name: "eAI",
    desc: "AI layer",
    href: "https://github.com/embeddedos-org/eAI",
  },
  {
    name: "eApps",
    desc: "App store",
    href: "https://github.com/embeddedos-org/eApps",
  },
  {
    name: "eos-health",
    desc: "Health devices",
    href: "https://github.com/embeddedos-org/eos-health",
  },
  {
    name: "ebuild",
    desc: "Build tool & SDK",
    href: "https://github.com/embeddedos-org/ebuild",
  },
];

export default function GetInvolved() {
  return (
    <BpPage className="involved">
      <PageHero
        sig
        label="Foundation · 501(c)(3)"
        title="Get Involved"
        lead="EmbeddedOS is built by the community, for the community. Whether you write code, improve docs, or just star the repos — every contribution matters."
      >
        <div className="ctas">
          <a
            href="https://github.com/embeddedos-org"
            target="_blank"
            rel="noopener noreferrer"
            className="btn pri"
          >
            Browse All Repos{" "}
            <span className="ar" aria-hidden="true">
              →
            </span>
          </a>
        </div>
      </PageHero>
      <LocalNav
        name="Get Involved"
        items={[
          { id: "ways", label: "Ways to contribute" },
          { id: "repositories", label: "Key repositories" },
          { id: "values", label: "Our values" },
          { id: "programmes", label: "Programmes" },
        ]}
      />

      <Section
        id="ways"
        title="6 Ways to Contribute"
        lead="No contribution is too small. Find the path that fits you."
        split
      >
        <ul className="cards">
          {WAYS_TO_CONTRIBUTE.map(way => (
            <li key={way.title}>
              <div className="card">
                <h3>{way.title}</h3>
                <p>{way.desc}</p>
                <a
                  href={way.href}
                  target={way.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    way.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="more gi-go"
                >
                  {way.action}
                  <span aria-hidden="true"> →</span>
                </a>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        id="repositories"
        title="Key Repositories"
        lead="Start with one of these to make your first contribution."
        split
        alt
      >
        <ul className="glinks cols gi-repos">
          {REPOS.map(repo => (
            <li key={repo.name}>
              <a href={repo.href} target="_blank" rel="noopener noreferrer">
                <span>embeddedos-org / {repo.name}</span>
                <small>{repo.desc}</small>
                <i aria-hidden="true">↗</i>
              </a>
            </li>
          ))}
        </ul>
      </Section>

      <section id="values" className="band gi-values">
        <div className="wrap">
          <div>
            <h2>Our Values</h2>
            <p className="gi-v1">
              Foundation. 501(c)(3). Community-driven. Free forever.
            </p>
            <p className="lead">
              EmbeddedOS is licensed under the MIT License. All hardware designs
              are open hardware. We will never add paywalls, ads, or proprietary
              features.
            </p>
          </div>
          <div className="ctas">
            <a
              href="https://github.com/embeddedos-org"
              target="_blank"
              rel="noopener noreferrer"
              className="btn pri"
            >
              Star Us on GitHub
            </a>
          </div>
        </div>
      </section>

      <ProgrammeList
        id="programmes"
        track="community"
        heading="Community Programmes"
        intro="Ways to take part beyond contributing code."
      />
    </BpPage>
  );
}
