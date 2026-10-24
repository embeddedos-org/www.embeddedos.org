import { Suspense, lazy, type CSSProperties } from "react";
import ViewportGate from "../components/ViewportGate";
import { Link } from "wouter";
import { BOARD_COUNT, SIM_PLATFORM_COUNT } from "@/data/stack";
import { BpPage, PageHero, Section, Stats } from "@/components/bp";
import "./EApps.css";
const EAppsCanvas = lazy(() =>
  import("../components/EoS3D").then(m => ({ default: m.EAppsCanvas }))
);

const APP_CATEGORIES = [
  {
    title: "eOffice Suite",
    count: 11,
    color: "#F97316",
    desc: "Complete office productivity suite for embedded displays and workstations.",
    apps: [
      "eWriter (Word Processor)",
      "eSheet (Spreadsheet)",
      "ePresent (Slides)",
      "eNotes (Markdown)",
      "eDraw (Vector Graphics)",
      "eCalc (Calculator)",
      "eCalendar",
      "eContacts",
      "eMail Client",
      "eChat",
      "eFiles (File Manager)",
    ],
  },
  {
    title: "Browser & Extensions",
    count: 11,
    color: "#22D3EE",
    desc: "eBrowser with 11 extensions for Chrome, Firefox, VS Code, JetBrains, Obsidian, and Slack.",
    apps: [
      "eBrowser (Core)",
      "Chrome Extension",
      "Firefox Extension",
      "VS Code Extension",
      "JetBrains Plugin",
      "Obsidian Plugin",
      "Slack App",
      "Edge Extension",
      "Safari Extension",
      "eBot Web Extension",
      "DevTools Panel",
    ],
  },
  {
    title: "Desktop Apps",
    count: 4,
    color: "#A78BFA",
    desc: "Native desktop applications for development and system management.",
    apps: [
      "EoStudio (Universal IDE v3.1)",
      "EoSim (Board Simulator)",
      "eBrowser Desktop",
      "eOffice Desktop",
    ],
  },
  {
    title: "Mobile Apps",
    count: 5,
    color: "#34D399",
    desc: "Flutter-based mobile apps for iOS and Android.",
    apps: [
      "eRide (Transportation)",
      "eSocial (Social Network)",
      "eTrack (Asset Tracking)",
      "eTravel (Travel Planner)",
      "eWallet (Digital Wallet)",
    ],
  },
  {
    title: "Native LVGL Apps",
    count: 40,
    color: "#F59E0B",
    desc: "40+ native C/LVGL apps for embedded displays running directly on EmbeddedOS.",
    apps: [
      "System Monitor",
      "Network Config",
      "File Browser",
      "Terminal Emulator",
      "Media Player",
      "Image Viewer",
      "Text Editor",
      "Calculator",
      "Clock/Timer",
      "Weather",
      "Maps (Offline)",
      "Camera Viewer",
      "Sensor Dashboard",
      "Log Viewer",
      "OTA Updater",
      "Settings App",
      "App Store Client",
      "Diagnostics",
      "Benchmark Tool",
      "Crypto Wallet",
      "QR Scanner",
      "Barcode Reader",
      "PDF Viewer",
      "eBook Reader",
      "Music Player",
      "Video Player",
      "Photo Gallery",
      "Contact Book",
      "Calendar",
      "Task Manager",
      "Notes",
      "Voice Recorder",
      "Alarm",
      "Stopwatch",
      "Unit Converter",
      "Currency Converter",
      "Password Manager",
      "2FA Authenticator",
      "SSH Client",
      "FTP Client",
    ],
  },
  {
    title: "Developer Tools",
    count: 3,
    color: "#60A5FA",
    desc: "Tools for building, testing, and deploying EmbeddedOS applications.",
    apps: ["ebuild CLI", "eosim CLI", "eBot CLI"],
  },
];

const STATS = [
  { value: "60+", label: "Total Apps" },
  { value: "11", label: "Browser Extensions" },
  { value: "5", label: "Mobile Apps" },
  { value: "40+", label: "Native LVGL Apps" },
];

const FEATURED = [
  {
    name: "EoStudio IDE",
    version: "v3.1",
    color: "#22D3EE",
    icon: "💻",
    tagline: "Universal IDE for Embedded Development",
    desc: "A full-featured IDE with EmbeddedOS-native debugging, JTAG/SWD support, AI code completion via eBot, real-time RTOS task visualization, and one-click board flashing. Runs on Windows, macOS, Linux, and natively on EmbeddedOS.",
    features: [
      "AI code completion (eBot)",
      "RTOS task visualizer",
      "JTAG/SWD debugger",
      "One-click board flash",
      `${BOARD_COUNT} board profiles`,
      "eFlow visual editor",
    ],
    platforms: ["Windows", "macOS", "Linux", "EmbeddedOS"],
    href: "https://github.com/embeddedos-org/EoStudio",
  },
  {
    name: "EoSim",
    version: "v2.0",
    color: "#F97316",
    icon: "🖥️",
    tagline: `${SIM_PLATFORM_COUNT}-Platform Simulator & Hardware Emulator`,
    desc: `Simulate any of ${SIM_PLATFORM_COUNT} embedded platforms in software — GPIO toggles, UART output, SPI/I2C buses, ADC readings, and full memory maps. Run your firmware before hardware arrives. Integrates with EoStudio and CI/CD pipelines.`,
    features: [
      `${SIM_PLATFORM_COUNT} platform profiles`,
      "GPIO/UART/SPI/I2C emulation",
      "Memory map viewer",
      "CI/CD integration",
      "Waveform recorder",
      "Fault injection testing",
    ],
    platforms: ["Windows", "macOS", "Linux", "Web (WASM)"],
    href: "https://github.com/embeddedos-org/EoStudio",
  },
  {
    name: "eOffice Suite",
    version: "v1.0",
    color: "#A78BFA",
    icon: "📄",
    tagline: "11-App Office Suite for Embedded & Desktop",
    desc: "A complete office productivity suite designed to run on embedded displays (800×480+) and full desktops. Includes word processor, spreadsheet, presentation, notes, drawing, calendar, contacts, mail, chat, file manager, and calculator — all in a unified LVGL + Flutter UI.",
    features: [
      "eWriter (Word Processor)",
      "eSheet (Spreadsheet)",
      "ePresent (Slides)",
      "eNotes (Markdown)",
      "eDraw (Vector)",
      "eMail + eChat",
    ],
    platforms: ["EmbeddedOS", "Linux", "Android", "iOS"],
    href: "https://github.com/embeddedos-org/eApps",
  },
  {
    name: "eBrowser",
    version: "v1.0",
    color: "#34D399",
    icon: "🌐",
    tagline: "Privacy-First Browser with 11 Extensions",
    desc: "A Chromium-based browser hardened for privacy and embedded use. Ships with 11 extensions including Chrome, Firefox, VS Code, JetBrains, Obsidian, and Slack integrations. Built-in eBot AI assistant, ad blocker, and offline mode for air-gapped systems.",
    features: [
      "Built-in ad blocker",
      "eBot AI sidebar",
      "Offline / air-gapped mode",
      "11 extensions",
      "VS Code + JetBrains plugins",
      "Tor-compatible",
    ],
    platforms: ["Windows", "macOS", "Linux", "EmbeddedOS"],
    href: "https://github.com/embeddedos-org/eApps",
  },
];

export default function EApps() {
  return (
    <BpPage className="eapps">
      <PageHero
        label="eApps — App Store"
        title="60+ Apps for Every Platform"
        lead="Native LVGL apps, browser extensions, desktop apps, and mobile apps — all built on EmbeddedOS and available through the unified eApps store."
        visual={
          // The 3D app grid, on a large stage; it loads only near the viewport.
          <div className="board stage">
            <Suspense fallback={<div className="stage-wait" />}>
              <ViewportGate>
                <EAppsCanvas hovered={false} />
              </ViewportGate>
            </Suspense>
          </div>
        }
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
        lead="Flagship apps built on EmbeddedOS — available on desktop, mobile, and embedded targets"
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
                <span className="st">{cat.count} apps</span>
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
            All 60+ apps are built automatically via GitHub Actions on every
            commit. Binaries are published for Linux, Windows, macOS, Android,
            iOS, and embedded targets. The eApps store client auto-updates from
            the manifest.
          </p>
        </div>
      </Section>
    </BpPage>
  );
}
