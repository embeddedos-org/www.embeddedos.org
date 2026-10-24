import { Link } from "wouter";
import { BOARD_COUNT, REPO_COUNT, SIM_PLATFORM_COUNT } from "@/data/stack";
import { BpPage, LocalNav, PageHero, Section } from "@/components/bp";
import "./Resources.css";

const sections = [
  {
    id: "documentation",
    title: "Documentation",
    items: [
      {
        name: "EoS API Reference",
        desc: "Full C API reference — 197 functions, 14 modules.",
        link: "/api-docs",
        external: false,
      },
      {
        name: "Getting Started Guide",
        desc: "5 onboarding paths from no hardware to full deployment.",
        link: "/getting-started",
        external: false,
      },
      {
        name: "eBuild Reference",
        desc: "Complete ebuild CLI and ebuild.toml configuration reference.",
        link: "/ebuild",
        external: false,
      },
      {
        name: "eFlow Documentation",
        desc: "Visual block programming — block library, pipeline, examples.",
        link: "/eflow",
        external: false,
      },
      {
        name: "Books (14 titles)",
        desc: "Free embedded systems textbooks and reference guides.",
        link: "/books",
        external: false,
      },
    ],
  },
  {
    id: "code",
    title: "Code & Examples",
    items: [
      {
        name: "GitHub — embeddedos-org",
        desc: `All ${REPO_COUNT} public repositories: kernel, drivers, apps, tools.`,
        link: "https://github.com/embeddedos-org",
        external: true,
      },
      {
        name: "EoSim Demo",
        desc: "Try EoS in your browser — no hardware needed.",
        link: "/demo",
        external: false,
      },
      {
        name: "eCAD Hardware Designs",
        desc: "Open hardware CAD files for all eCAD products.",
        link: "https://github.com/embeddedos-org/eCAD-Hardware-Products",
        external: true,
      },
      {
        name: "eAI Edge Stack",
        desc: "One-command eNI + eIPC + eAI deployment.",
        link: "/eai-edge",
        external: false,
      },
    ],
  },
  {
    id: "downloads",
    title: "Downloads",
    items: [
      {
        name: "EoS Firmware Images",
        desc: `Pre-built firmware for ${BOARD_COUNT} supported boards.`,
        link: "https://github.com/embeddedos-org/eos/releases",
        external: true,
      },
      {
        name: "eBuild CLI",
        desc: "Build tool for Linux, macOS, and Windows.",
        link: "https://github.com/embeddedos-org/ebuild/releases",
        external: true,
      },
      {
        name: "EoStudio IDE",
        desc: "Desktop IDE for Linux, macOS, and Windows.",
        link: "https://github.com/embeddedos-org/eostudio/releases",
        external: true,
      },
      {
        name: "EoSim CLI",
        desc: `Hardware simulator for ${SIM_PLATFORM_COUNT} platforms.`,
        link: "https://github.com/embeddedos-org/eosim/releases",
        external: true,
      },
    ],
  },
  {
    id: "support",
    title: "Community & Support",
    items: [
      {
        name: "GitHub Discussions",
        desc: "Q&A, feature requests, and RFCs.",
        link: "https://github.com/orgs/embeddedos-org/discussions",
        external: true,
      },
      {
        name: "Report an Issue",
        desc: "Bug reports and tracking on GitHub.",
        link: "https://github.com/embeddedos-org/eos/issues",
        external: true,
      },
      {
        name: "Certification Program",
        desc: "12 tracks, 60 certifications, free exams.",
        link: "/certification",
        external: false,
      },
      {
        name: "Internship Program",
        desc: "Paid internships for students and new graduates.",
        link: "/internship",
        external: false,
      },
    ],
  },
  {
    id: "site-pages",
    title: "Site Pages",
    items: [
      // The footer's hub for these: they are real pages with no footer
      // column, so this section is their way in — see
      // tests/unit/navigation.test.ts.
      {
        name: "Live Demo",
        desc: "Try EoS in your browser — no hardware needed.",
        link: "/demo",
        external: false,
      },
      {
        name: "Hardware Lab",
        desc: "The boards and rigs the Foundation tests against.",
        link: "/hardware-lab",
        external: false,
      },
      {
        name: "Kids Edition",
        desc: "Embedded computing for young learners, free.",
        link: "/kids",
        external: false,
      },
      {
        name: "Building an OS",
        desc: "How an operating system gets built, step by step.",
        link: "/building-os",
        external: false,
      },
      {
        name: "AI OS",
        desc: "The AI-native operating system track.",
        link: "/ai-os",
        external: false,
      },
      {
        name: "Roadmap",
        desc: "Where the platform is going and in what order.",
        link: "/roadmap",
        external: false,
      },
      {
        name: "Stacks",
        desc: "Curated software stacks for common targets.",
        link: "/stacks",
        external: false,
      },
      {
        name: "eFlow Editor",
        desc: "Visual programming for embedded pipelines.",
        link: "/eflow",
        external: false,
      },
      {
        name: "Architecture",
        desc: "How the EoS system fits together.",
        link: "/architecture",
        external: false,
      },
    ],
  },
];

export default function ResourcesPage() {
  return (
    <BpPage className="resources">
      <PageHero
        sig
        label="RESOURCES"
        title="Resources"
        lead="Everything you need to build with EmbeddedOS — documentation, code, downloads, and community."
      />
      <LocalNav
        name="Resources"
        items={sections.map(section => ({
          id: section.id,
          label: section.title,
        }))}
      />

      <Section className="rs-main">
        <div className="rs-groups">
          {sections.map(section => (
            <div key={section.title} id={section.id} className="rs-group">
              <h2>{section.title}</h2>
              <ul className="glinks">
                {section.items.map(item => (
                  <li key={item.name}>
                    {item.external ? (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span>{item.name} </span>
                        <i aria-hidden="true">↗</i>
                        <small>{item.desc}</small>
                      </a>
                    ) : (
                      <Link href={item.link}>
                        <span>{item.name}</span>
                        <small>{item.desc}</small>
                        <i aria-hidden="true">→</i>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>
    </BpPage>
  );
}
