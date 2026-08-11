import { Suspense, lazy } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Package,
  Globe,
  FileText,
  Code,
  Smartphone,
  Monitor,
  Puzzle,
} from "lucide-react";
import { BOARD_COUNT, SIM_PLATFORM_COUNT } from "@/data/stack";
const EAppsCanvas = lazy(() =>
  import("../components/EoS3D").then(m => ({ default: m.EAppsCanvas }))
);

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.05, ease: "easeOut" as const },
  }),
};

const APP_CATEGORIES = [
  {
    title: "eOffice Suite",
    count: 11,
    color: "#F97316",
    icon: FileText,
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
    icon: Globe,
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
    icon: Monitor,
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
    icon: Smartphone,
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
    icon: Package,
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
    icon: Code,
    desc: "Tools for building, testing, and deploying EmbeddedOS applications.",
    apps: ["ebuild CLI", "eosim CLI", "eBot CLI"],
  },
];

const STATS = [
  { value: "60+", label: "Total Apps", color: "#F97316" },
  { value: "11", label: "Browser Extensions", color: "#22D3EE" },
  { value: "5", label: "Mobile Apps", color: "#34D399" },
  { value: "40+", label: "Native LVGL Apps", color: "#A78BFA" },
];

export default function EApps() {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="section-padding bg-grid">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            <div className="badge-amber mb-4 inline-flex">
              <Package size={12} />
              eApps — App Store
            </div>
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-white mb-4">
              60+ Apps for <span className="text-gradient">Every Platform</span>
            </h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto mb-8">
              Native LVGL apps, browser extensions, desktop apps, and mobile
              apps — all built on EmbeddedOS and available through the unified
              eApps store.
            </p>
            <a
              href="https://github.com/embeddedos-org/eApps"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#F97316] hover:bg-[#EA580C] text-white font-bold rounded-xl transition-all active:scale-95"
            >
              Browse on GitHub
              <ArrowRight size={16} />
            </a>
            {/* 3D eApps Animation */}
            <div
              className="mt-10 rounded-2xl border border-white/8 overflow-hidden h-56 max-w-lg mx-auto"
              style={{ background: "rgba(5,10,20,0.8)" }}
            >
              <Suspense
                fallback={
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-[#F97316] border-t-transparent rounded-full animate-spin" />
                  </div>
                }
              >
                <EAppsCanvas hovered={false} />
              </Suspense>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Applications */}
      <section className="section-padding bg-[#080F1E]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-white mb-2">
              Featured Applications
            </h2>
            <p className="text-white/50 text-sm">
              Flagship apps built on EmbeddedOS — available on desktop, mobile,
              and embedded targets
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
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
            ].map((app, i) => (
              <motion.div
                key={app.name}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="glass rounded-2xl p-6 border border-white/5 flex flex-col gap-4"
                style={{ borderTopColor: app.color, borderTopWidth: 2 }}
              >
                <div className="flex items-start gap-3">
                  <span className="text-3xl leading-none">{app.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-heading font-bold text-white text-base">
                        {app.name}
                      </h3>
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{
                          background: app.color + "20",
                          color: app.color,
                        }}
                      >
                        {app.version}
                      </span>
                    </div>
                    <p
                      className="text-xs font-semibold"
                      style={{ color: app.color }}
                    >
                      {app.tagline}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-white/55 leading-relaxed">
                  {app.desc}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {app.features.map(f => (
                    <span
                      key={f}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 text-white/60 border border-white/10"
                    >
                      {f}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5">
                  <div className="flex gap-1.5">
                    {app.platforms.map(p => (
                      <span
                        key={p}
                        className="text-[10px] px-2 py-0.5 rounded-full"
                        style={{
                          background: app.color + "15",
                          color: app.color,
                        }}
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                  <a
                    href={app.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold hover:underline"
                    style={{ color: app.color }}
                  >
                    View on GitHub →
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 bg-[#080F1E]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {STATS.map(s => (
              <div key={s.label}>
                <div
                  className="font-heading font-extrabold text-3xl"
                  style={{ color: s.color }}
                >
                  {s.value}
                </div>
                <div className="text-xs text-white/40 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* App Categories */}
      <section className="section-padding">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
          {APP_CATEGORIES.map((cat, ci) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={ci}
                className="glass rounded-2xl p-6 border border-white/5"
                style={{ borderLeftColor: cat.color, borderLeftWidth: 3 }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background: cat.color + "20",
                      border: `1px solid ${cat.color}40`,
                    }}
                  >
                    <Icon size={24} style={{ color: cat.color }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-heading font-bold text-white text-base">
                        {cat.title}
                      </h3>
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{
                          background: cat.color + "20",
                          color: cat.color,
                        }}
                      >
                        {cat.count} apps
                      </span>
                    </div>
                    <p className="text-sm text-white/50">{cat.desc}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {cat.apps.map(app => (
                    <span
                      key={app}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 hover:text-white transition-colors"
                    >
                      {app}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CI/CD Note */}
      <section className="py-12 bg-[#080F1E]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="glass rounded-2xl p-6 border border-[#34D399]/20 flex items-start gap-4"
          >
            <Puzzle size={32} className="text-[#34D399] shrink-0 mt-1" />
            <div>
              <h3 className="font-heading font-bold text-white text-lg mb-2">
                Automated CI/CD Builds
              </h3>
              <p className="text-white/60 text-sm leading-relaxed">
                All 60+ apps are built automatically via GitHub Actions on every
                commit. Binaries are published for Linux, Windows, macOS,
                Android, iOS, and embedded targets. The eApps store client
                auto-updates from the manifest.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
