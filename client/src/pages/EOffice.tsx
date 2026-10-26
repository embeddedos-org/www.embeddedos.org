import ProductRepositoryPanel from "@/components/ProductRepositoryPanel";
import { useState, type CSSProperties } from "react";
import { Link } from "wouter";
import {
  FileText,
  Table2,
  Presentation,
  StickyNote,
  PenTool,
  Calculator,
  Calendar,
  Users,
  Mail,
  MessageSquare,
  FolderOpen,
} from "lucide-react";
import {
  Band,
  BpPage,
  LocalNav,
  PageHero,
  Section,
  Stats,
} from "@/components/bp";
import "./EOffice.css";

const APPS = [
  {
    id: "edocs",
    name: "eDocs",
    subtitle: "Documents",
    desc: "eDocs is the suite\u2019s documents app. Explore its implementation and current feature coverage in the repository.",
    icon: FileText,
    color: "#a1a1aa",
  },
  {
    id: "esheets",
    name: "eSheets",
    subtitle: "Spreadsheets",
    desc: "eSheets is the suite\u2019s spreadsheets app. Explore its implementation and current feature coverage in the repository.",
    icon: Table2,
    color: "#a1a1aa",
  },
  {
    id: "eslides",
    name: "eSlides",
    subtitle: "Presentations",
    desc: "eSlides is the suite\u2019s presentations app. Explore its implementation and current feature coverage in the repository.",
    icon: Presentation,
    color: "#a1a1aa",
  },
  {
    id: "enotes",
    name: "eNotes",
    subtitle: "Notes",
    desc: "eNotes is the suite\u2019s notes app. Explore its implementation and current feature coverage in the repository.",
    icon: StickyNote,
    color: "#a1a1aa",
  },
  {
    id: "eforms",
    name: "eForms",
    subtitle: "Forms",
    desc: "eForms is the suite\u2019s forms app. Explore its implementation and current feature coverage in the repository.",
    icon: PenTool,
    color: "#a1a1aa",
  },
  {
    id: "edb",
    name: "eDB",
    subtitle: "Database front-end",
    desc: "eDB is the suite\u2019s database front-end app. Explore its implementation and current feature coverage in the repository.",
    icon: Calculator,
    color: "#a1a1aa",
  },
  {
    id: "eplanner",
    name: "ePlanner",
    subtitle: "Planning and calendar",
    desc: "ePlanner is the suite\u2019s planning and calendar app. Explore its implementation and current feature coverage in the repository.",
    icon: Calendar,
    color: "#a1a1aa",
  },
  {
    id: "esway",
    name: "eSway",
    subtitle: "Web storytelling",
    desc: "eSway is the suite\u2019s web storytelling app. Explore its implementation and current feature coverage in the repository.",
    icon: Users,
    color: "#a1a1aa",
  },
  {
    id: "email",
    name: "eMail",
    subtitle: "Email",
    desc: "eMail is the suite\u2019s email app. Explore its implementation and current feature coverage in the repository.",
    icon: Mail,
    color: "#a1a1aa",
  },
  {
    id: "econnect",
    name: "eConnect",
    subtitle: "Messaging and connectivity",
    desc: "eConnect is the suite\u2019s messaging and connectivity app. Explore its implementation and current feature coverage in the repository.",
    icon: MessageSquare,
    color: "#a1a1aa",
  },
  {
    id: "edrive",
    name: "eDrive",
    subtitle: "File storage",
    desc: "eDrive is the suite\u2019s file storage app. Explore its implementation and current feature coverage in the repository.",
    icon: FolderOpen,
    color: "#a1a1aa",
  },
];

const PLATFORMS = [
  "Web / PWA",
  "Electron desktop",
  "Browser & editor extensions",
];

const STATS = [
  {
    value: "11",
    label: "Productivity apps",
  },
  {
    value: "React",
    label: "Web interface",
  },
  {
    value: "Electron",
    label: "Desktop wrapper",
  },
  {
    value: "MIT",
    label: "License",
  },
];

export default function EOffice() {
  const [activeApp, setActiveApp] = useState("edocs");
  const app = APPS.find(a => a.id === activeApp)!;
  const AppIcon = app.icon;

  return (
    <BpPage className="eoffice">
      <PageHero
        label="eOffice Suite"
        title={
          <>
            eOffice
            <br />
            11-App Suite
          </>
        }
        lead="An open-source React and TypeScript suite with eleven productivity apps, a shared launcher, and documented web, desktop, and extension builds."
        visual={<ProductRepositoryPanel product="eoffice" />}
      >
        <ul className="badges">
          {PLATFORMS.map(p => (
            <li key={p}>{p}</li>
          ))}
        </ul>
        <div className="ctas">
          <Link href="/eapps" className="btn pri">
            View All eApps{" "}
            <span className="ar" aria-hidden="true">
              →
            </span>
          </Link>
          <Link href="/getting-started" className="btn gh">
            Get Started
          </Link>
        </div>
      </PageHero>

      <LocalNav
        name="eOffice"
        items={[
          { id: "explore", label: "Explore the Suite" },
          { id: "facts", label: "Office Apps" },
          { id: "get-started", label: "Get Started" },
        ]}
      />

      {/* App explorer */}
      <Section
        id="explore"
        title="Explore the Suite"
        lead="Click any app to see what it does"
        split
      >
        <div className="eo-grid">
          {APPS.map(a => {
            const AIcon = a.icon;
            return (
              <button
                key={a.id}
                type="button"
                onClick={() => setActiveApp(a.id)}
                aria-pressed={activeApp === a.id}
                style={{ "--c": a.color } as CSSProperties}
              >
                <span className="eo-ic" aria-hidden="true">
                  <AIcon size={18} />
                </span>
                <span>{a.name}</span>
              </button>
            );
          })}
        </div>

        {/* App detail */}
        <div
          className="eo-detail"
          key={activeApp}
          style={{ "--c": app.color } as CSSProperties}
        >
          <div className="card">
            <div className="eo-head">
              <span className="eo-ic" aria-hidden="true">
                <AppIcon size={22} />
              </span>
              <div>
                <h3>{app.name}</h3>
                <p className="eo-sub">{app.subtitle}</p>
              </div>
            </div>
            <p>{app.desc}</p>
            <a
              className="btn gh"
              href={`https://github.com/embeddedos-org/eOffice/tree/master/apps/${app.id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Browse {app.name} source ↗
            </a>
          </div>

          <div className="code eo-prev">
            <div className="cbar">
              <b>eOffice / apps / {app.id}</b>
            </div>
            <div className="eo-lines">
              <p>
                Read the app source, then use the suite’s build instructions to
                run it locally.
              </p>
              <a
                className="tl"
                href={`https://github.com/embeddedos-org/eOffice/tree/master/apps/${app.id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open the app folder on GitHub ↗
              </a>
              <a
                className="tl"
                href="https://github.com/embeddedos-org/eOffice/blob/master/README.md"
                target="_blank"
                rel="noopener noreferrer"
              >
                Read the suite README ↗
              </a>
            </div>
          </div>
        </div>
      </Section>

      {/* Stats */}
      <Section id="facts" tight className="eo-facts">
        <Stats items={STATS} />
      </Section>

      {/* CTA */}
      <Band
        id="get-started"
        title="Explore the suite and build it locally"
        lead="Follow the eOffice README for web development, Electron packaging, and extension builds. Check each app’s current coverage before choosing a deployment."
      >
        <Link href="/eapps" className="btn pri">
          Browse All eApps{" "}
          <span className="ar" aria-hidden="true">
            →
          </span>
        </Link>
        <Link href="/getting-started" className="btn gh">
          Get Started
        </Link>
        <Link href="/product-eoffice" className="btn gh">
          eOffice engineering detail
        </Link>
      </Band>
    </BpPage>
  );
}
