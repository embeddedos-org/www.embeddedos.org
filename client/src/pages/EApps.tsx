import ProductRepositoryPanel from "@/components/ProductRepositoryPanel";
import { type CSSProperties } from "react";
import { Link } from "wouter";
import { BpPage, PageHero, Section, Stats } from "@/components/bp";
import "./EApps.css";

const APP_CATEGORIES = [
  {
    title: "eOffice productivity",
    count: 11,
    color: "#a1a1aa",
    desc: "Eleven productivity apps in the eOffice repository.",
    apps: [
      "eDocs",
      "eSheets",
      "eSlides",
      "ePlanner",
      "eNotes",
      "eMail",
      "eDrive",
      "eConnect",
      "eDB",
      "eForms",
      "eSway",
    ],
  },
  {
    title: "Native applications",
    count: 8,
    color: "#a1a1aa",
    desc: "Selected application folders in eApps/apps; build prerequisites vary.",
    apps: [
      "eclock",
      "ecal",
      "efiles",
      "enote",
      "epdf",
      "esettings",
      "essh",
      "ezip",
    ],
  },
  {
    title: "Marketplace & integrations",
    count: 5,
    color: "#a1a1aa",
    desc: "Source areas in the eApps repository.",
    apps: [
      "Browser extensions",
      "IDE tools",
      "Web apps",
      "Mobile apps",
      "Desktop wrappers",
    ],
  },
];

const STATS = [
  {
    value: "11",
    label: "eOffice apps",
  },
  {
    value: "C / LVGL",
    label: "Native app source",
  },
  {
    value: "JSON",
    label: "Marketplace catalog",
  },
  {
    value: "MIT",
    label: "Repository license",
  },
];

const FEATURED = [
  {
    name: "EoStudio",
    version: "Source available",
    color: "#a1a1aa",
    icon: "01",
    tagline: "Development & design",
    desc: "Python development platform with visual-editing modules, plugins, and ebuild integration.",
    features: [
      "ebuild integration",
      "Code generation modules",
      "Plugin system",
    ],
    platforms: ["See repository for build targets"],
    href: "https://github.com/embeddedos-org/EoStudio",
  },
  {
    name: "EoSim",
    version: "Source available",
    color: "#a1a1aa",
    icon: "02",
    tagline: "Simulation platform",
    desc: "Platform descriptors, simulation engines, and command-line tools. Runtime coverage depends on the selected platform.",
    features: [
      "Platform registry",
      "Simulation tools",
      "Environment diagnostics",
    ],
    platforms: ["See repository for build targets"],
    href: "https://github.com/embeddedos-org/EoSim",
  },
  {
    name: "eOffice Suite",
    version: "Source available",
    color: "#a1a1aa",
    icon: "03",
    tagline: "Productivity apps",
    desc: "React and TypeScript applications with web, Electron, and extension packaging.",
    features: ["eDocs", "eSheets", "eSlides", "ePlanner"],
    platforms: ["See repository for build targets"],
    href: "https://github.com/embeddedos-org/eOffice",
  },
  {
    name: "eBrowser",
    version: "Source available",
    color: "#a1a1aa",
    icon: "04",
    tagline: "Embedded web browser",
    desc: "C11 browser with LVGL UI and a small HTML/CSS/DOM engine for constrained targets. It does not aim for full web-platform parity.",
    features: [
      "CMake modules",
      "LVGL interface",
      "SDL2 and WebAssembly targets",
    ],
    platforms: ["See repository for build targets"],
    href: "https://github.com/embeddedos-org/eBrowser",
  },
];

export default function EApps() {
  return (
    <BpPage className="eapps">
      <PageHero
        label="eApps — App Store"
        title="Explore the eApps ecosystem"
        lead="Discover native apps, web applications, extensions, and desktop projects. Open the source and check each project’s build and release instructions."
        visual={<ProductRepositoryPanel product="eapps" />}
      >
        <div className="ctas">
          <a
            href="https://github.com/embeddedos-org/eApps"
            target="_blank"
            rel="noopener noreferrer"
            className="btn pri"
          >
            Browse on GitHub{" "}
            <span className="ar" aria-hidden="true">
              →
            </span>
          </a>
          <Link href="/product-eapps" className="btn gh">
            eApps engineering detail
          </Link>
        </div>
      </PageHero>

      {/* Featured Applications */}
      <Section
        id="featured"
        title="Featured Applications"
        lead="Explore each project’s own repository for implementation, build targets, and current status"
        split
      >
        <ul className="cards two">
          {FEATURED.map(app => (
            <li key={app.name}>
              <div
                className="card ea-app"
                style={{ "--c": app.color } as CSSProperties}
              >
                <div className="top">
                  <span className="ic" aria-hidden="true">
                    {app.icon}
                  </span>
                  <span className="st">{app.version}</span>
                </div>
                <h3>{app.name}</h3>
                <p className="ea-tag">{app.tagline}</p>
                <p>{app.desc}</p>
                <ul className="ea-chips">
                  {app.features.map(f => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <div className="ea-foot">
                  <ul className="ea-plat">
                    {app.platforms.map(p => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                  <a
                    href={app.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tl"
                  >
                    View on GitHub →
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      {/* Stats */}
      <div className="wrap ea-stats">
        <Stats items={STATS} />
      </div>

      {/* App Categories */}
      <Section id="categories" className="ea-catsec">
        <ul className="ea-cats">
          {APP_CATEGORIES.map(cat => (
            <li key={cat.title} style={{ "--c": cat.color } as CSSProperties}>
              <div className="ea-cat-h">
                <h3>{cat.title}</h3>
                <span className="st">{cat.count} listed examples</span>
                <p>{cat.desc}</p>
              </div>
              <ul className="ea-list">
                {cat.apps.map(app => (
                  <li key={app}>{app}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Section>

      {/* CI/CD Note */}
      <Section id="ci" tight>
        <div className="card hl ea-ci">
          <h3>Automated CI/CD Builds</h3>
          <p>
            The repository contains packaging and release workflows. Triggers,
            required credentials, and published artifacts vary by app. Check the
            selected project’s Actions and Releases pages before downloading.
          </p>
        </div>
      </Section>
    </BpPage>
  );
}
