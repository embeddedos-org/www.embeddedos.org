import { useState, type CSSProperties } from "react";
import { moveTabFocus } from "@/lib/tablist";
import { Link } from "wouter";
import { SIM_PLATFORM_COUNT } from "@/data/stack";
import { BpPage, PageHero, Section, Stats } from "@/components/bp";
import "./EOSuite.css";

const categories = [
  {
    id: "office",
    name: "eOffice Suite",
    color: "#22D3EE",
    count: 11,
    apps: [
      {
        name: "eWriter",
        desc: "Full-featured word processor with markdown, rich text, and document templates.",
        type: "Native C/LVGL",
      },
      {
        name: "eSheet",
        desc: "Spreadsheet with 200+ formulas, charts, and CSV/XLSX import/export.",
        type: "Native C/LVGL",
      },
      {
        name: "ePresent",
        desc: "Presentation editor with 20 themes, animations, and PDF export.",
        type: "Native C/LVGL",
      },
      {
        name: "eNotes",
        desc: "Markdown notes with tags, search, and cloud sync via eFiles.",
        type: "Native C/LVGL",
      },
      {
        name: "eDraw",
        desc: "Vector drawing and diagramming with SVG export.",
        type: "Native C/LVGL",
      },
      {
        name: "eCalc",
        desc: "Scientific calculator with graphing, unit conversion, and CAS.",
        type: "Native C/LVGL",
      },
      {
        name: "eCalendar",
        desc: "Calendar with recurring events, reminders, and CalDAV sync.",
        type: "Native C/LVGL",
      },
      {
        name: "eContacts",
        desc: "Contact manager with CardDAV sync and vCard import/export.",
        type: "Native C/LVGL",
      },
      {
        name: "eMail",
        desc: "Email client with IMAP/SMTP, S/MIME signing, and offline mode.",
        type: "Native C/LVGL",
      },
      {
        name: "eChat",
        desc: "Encrypted messaging with Matrix protocol support.",
        type: "Native C/LVGL",
      },
      {
        name: "eFiles",
        desc: "File manager with S3, WebDAV, and local storage backends.",
        type: "Native C/LVGL",
      },
    ],
  },
  {
    id: "system",
    name: "System Apps",
    color: "#F97316",
    count: 12,
    apps: [
      {
        name: "eShell",
        desc: "POSIX-compatible shell with tab completion and scripting.",
        type: "Native C",
      },
      {
        name: "eMonitor",
        desc: "System monitor: CPU, RAM, tasks, network, and power.",
        type: "Native C/LVGL",
      },
      {
        name: "eConfig",
        desc: "System configuration UI: network, display, audio, power.",
        type: "Native C/LVGL",
      },
      {
        name: "eUpdate",
        desc: "OTA update manager with rollback and delta update support.",
        type: "Native C",
      },
      {
        name: "eLogger",
        desc: "Structured log viewer with filter, search, and export.",
        type: "Native C/LVGL",
      },
      {
        name: "eDebug",
        desc: "GDB-based debugger with EoSim integration.",
        type: "Native C",
      },
      {
        name: "eFlash",
        desc: "Firmware flash tool for connected devices via JTAG/SWD/UART.",
        type: "Native C",
      },
      {
        name: "eNet",
        desc: "Network manager: Wi-Fi, Ethernet, BLE, Thread, Zigbee.",
        type: "Native C/LVGL",
      },
      {
        name: "ePower",
        desc: "Power management: sleep modes, wake sources, battery stats.",
        type: "Native C",
      },
      {
        name: "eStorage",
        desc: "Storage manager: partition, format, mount, S3 sync.",
        type: "Native C",
      },
      {
        name: "eSecurity",
        desc: "Security dashboard: key management, certificate store, audit log.",
        type: "Native C/LVGL",
      },
      {
        name: "eBackup",
        desc: "Automated backup to S3 or local storage with encryption.",
        type: "Native C",
      },
    ],
  },
  {
    id: "media",
    name: "Media & Entertainment",
    color: "#A855F7",
    count: 8,
    apps: [
      {
        name: "ePlayer",
        desc: "Media player: MP3, AAC, FLAC, MP4, H.264/H.265.",
        type: "Native C/LVGL",
      },
      {
        name: "eCamera",
        desc: "Camera app with RAW capture, filters, and eFiles integration.",
        type: "Native C/LVGL",
      },
      {
        name: "eGallery",
        desc: "Photo/video gallery with albums, search, and slideshow.",
        type: "Native C/LVGL",
      },
      {
        name: "eRadio",
        desc: "Internet radio with 10,000+ stations via RadioBrowser API.",
        type: "Native C/LVGL",
      },
      {
        name: "ePodcast",
        desc: "Podcast client with offline download and playback speed control.",
        type: "Native C/LVGL",
      },
      {
        name: "eReader",
        desc: "E-book reader: EPUB, PDF, MOBI with annotations.",
        type: "Native C/LVGL",
      },
      {
        name: "eGame",
        desc: "Retro game emulator: NES, SNES, GB, GBA via libretro.",
        type: "Native C",
      },
      {
        name: "eVoice",
        desc: "Voice recorder with transcription via eNI microphone.",
        type: "Native C/LVGL",
      },
    ],
  },
  {
    id: "dev",
    name: "Developer Tools",
    color: "#34D399",
    count: 10,
    apps: [
      {
        name: "EoStudio",
        desc: "Full embedded IDE with 12 editors, debugger, and AI tutor.",
        type: "Native C/LVGL",
      },
      {
        name: "EoSim",
        desc: `Hardware simulator: ${SIM_PLATFORM_COUNT} platforms, GPIO, UART, SPI, I2C.`,
        type: "Native C",
      },
      {
        name: "eFlow",
        desc: "Visual block-based firmware programming environment.",
        type: "Native C/LVGL",
      },
      {
        name: "eBuild CLI",
        desc: "Build system: CAD analysis, cross-compile, flash, OTA.",
        type: "Native C",
      },
      {
        name: "eScope",
        desc: "Logic analyzer and oscilloscope via USB/SPI.",
        type: "Native C/LVGL",
      },
      {
        name: "eProtocol",
        desc: "Protocol analyzer: UART, SPI, I2C, CAN, USB.",
        type: "Native C/LVGL",
      },
      {
        name: "eProfile",
        desc: "Performance profiler with flame graphs and memory tracking.",
        type: "Native C",
      },
      {
        name: "eTest",
        desc: "Unit test runner with TAP output and CI integration.",
        type: "Native C",
      },
      {
        name: "eDoc",
        desc: "Documentation generator from C source comments.",
        type: "Native C",
      },
      {
        name: "eLint",
        desc: "MISRA C checker and static analysis tool.",
        type: "Native C",
      },
    ],
  },
  {
    id: "browser",
    name: "Browser Extensions",
    color: "#FBBF24",
    count: 8,
    apps: [
      {
        name: "eAdBlock",
        desc: "Ad and tracker blocker with custom filter lists.",
        type: "Browser Extension",
      },
      {
        name: "ePassword",
        desc: "Password manager with AES-256 vault and autofill.",
        type: "Browser Extension",
      },
      {
        name: "eTranslate",
        desc: "On-device page translation (no cloud) via eAI.",
        type: "Browser Extension",
      },
      {
        name: "eReader Mode",
        desc: "Distraction-free reading mode with custom fonts.",
        type: "Browser Extension",
      },
      {
        name: "eScreenshot",
        desc: "Full-page screenshot with annotation tools.",
        type: "Browser Extension",
      },
      {
        name: "eDevTools",
        desc: "Embedded developer tools: DOM inspector, network monitor.",
        type: "Browser Extension",
      },
      {
        name: "eTheme",
        desc: "Custom theme engine for eBrowser UI.",
        type: "Browser Extension",
      },
      {
        name: "eSync",
        desc: "Bookmark and history sync via eFiles/WebDAV.",
        type: "Browser Extension",
      },
    ],
  },
  {
    id: "mobile",
    name: "Mobile Companion",
    color: "#F472B6",
    count: 6,
    apps: [
      {
        name: "eHealth365 Mobile",
        desc: "Companion app for all eHealth365 devices.",
        type: "Flutter iOS/Android",
      },
      {
        name: "EoSim Mobile",
        desc: "Run and monitor EoSim simulations from your phone.",
        type: "Flutter iOS/Android",
      },
      {
        name: "eRadar360 Monitor",
        desc: "Real-time radar visualization for Aegis One.",
        type: "Flutter iOS/Android",
      },
      {
        name: "eOffice Mobile",
        desc: "Full eOffice Suite on iOS and Android.",
        type: "Flutter iOS/Android",
      },
      {
        name: "EoS Device Manager",
        desc: "Manage all EoS devices: OTA, logs, config.",
        type: "Flutter iOS/Android",
      },
      {
        name: "eBot Agent",
        desc: "Natural language device control via eAI.",
        type: "Flutter iOS/Android",
      },
    ],
  },
];

export default function EOSuitePage() {
  const [activeCategory, setActiveCategory] = useState("office");
  const [search, setSearch] = useState("");
  const query = search.toLowerCase();
  const matches = (a: { name: string; desc: string }) =>
    !query ||
    a.name.toLowerCase().includes(query) ||
    a.desc.toLowerCase().includes(query);
  const totalApps = categories.reduce((sum, c) => sum + c.count, 0);

  return (
    <BpPage className="eosuite">
      <PageHero
        label="EOSUITE"
        title="eOSuite"
        sub="The Complete EmbeddedOS App Ecosystem"
        lead={
          <>
            {totalApps}+ apps across 6 categories — native C/LVGL apps, browser
            extensions, and Flutter mobile companions. Every app runs on EoS,
            ships with source, and is MIT licensed.
          </>
        }
      />

      <div className="wrap es-stats">
        <Stats
          items={categories.map(c => ({ value: c.count, label: c.name }))}
        />
      </div>

      <Section id="apps" className="es-apps">
        <div className="es-bar">
          <div
            className="ctas es-tabs"
            role="tablist"
            aria-label="App categories"
            onKeyDown={moveTabFocus}
          >
            {categories.map(c => (
              <button
                key={c.id}
                type="button"
                role="tab"
                id={`suite-tab-${c.id}`}
                aria-selected={activeCategory === c.id}
                aria-controls={`suite-panel-${c.id}`}
                tabIndex={activeCategory === c.id ? 0 : -1}
                onClick={() => setActiveCategory(c.id)}
                className="btn gh"
                style={{ "--c": c.color } as CSSProperties}
              >
                {c.name} ({c.count})
              </button>
            ))}
          </div>
          <div className="es-search">
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              aria-hidden="true"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              type="text"
              placeholder="Search apps..."
              aria-label="Search apps"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
        {categories.map(cat => (
          <div
            key={cat.id}
            role="tabpanel"
            id={`suite-panel-${cat.id}`}
            aria-labelledby={`suite-tab-${cat.id}`}
            hidden={cat.id !== activeCategory}
            style={{ "--c": cat.color } as CSSProperties}
          >
            {/* the panel's own heading, for the outline; the tab shows the name */}
            <h2 className="sr-only">{cat.name}</h2>
            <ul className="cards">
              {cat.apps.filter(matches).map(app => (
                <li key={app.name}>
                  <div className="card">
                    <div className="top">
                      <h3>{app.name}</h3>
                      <span className="st">{app.type}</span>
                    </div>
                    <p>{app.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Section>

      <section className="sec tight es-more">
        <div className="wrap">
          <div className="ctas">
            <Link href="/eapps" className="btn pri">
              eApps Store{" "}
              <span className="ar" aria-hidden="true">
                →
              </span>
            </Link>
            <Link href="/eoffice" className="btn gh">
              eOffice Suite
            </Link>
          </div>
        </div>
      </section>
    </BpPage>
  );
}
