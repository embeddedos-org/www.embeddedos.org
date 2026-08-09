import { useState } from "react";
import { motion } from "framer-motion";
import { Smartphone, ArrowRight, Search } from "lucide-react";
import { Link } from "wouter";

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
        desc: "Hardware simulator: 63 boards, GPIO, UART, SPI, I2C.",
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
  const cat = categories.find(c => c.id === activeCategory)!;
  const filtered = cat.apps.filter(
    a =>
      !search ||
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.desc.toLowerCase().includes(search.toLowerCase())
  );
  const totalApps = categories.reduce((sum, c) => sum + c.count, 0);

  return (
    <div className="min-h-screen bg-[#0A0E1A] text-white">
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/5" />
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-medium mb-6">
              <Smartphone className="w-4 h-4" /> EOSUITE
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent">
              eOSuite
            </h1>
            <p className="text-2xl text-gray-300 mb-2">
              The Complete EmbeddedOS App Ecosystem
            </p>
            <p className="text-gray-400 max-w-2xl mx-auto">
              {totalApps}+ apps across 6 categories — native C/LVGL apps,
              browser extensions, and Flutter mobile companions. Every app runs
              on EoS, ships with source, and is MIT licensed.
            </p>
            <div className="flex flex-wrap gap-6 justify-center mt-8">
              {categories.map(c => (
                <div key={c.id} className="text-center">
                  <div
                    className="text-2xl font-bold"
                    style={{ color: c.color }}
                  >
                    {c.count}
                  </div>
                  <div className="text-gray-500 text-xs">{c.name}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap gap-2 mb-6 justify-center">
            {categories.map(c => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={
                  activeCategory === c.id
                    ? {
                        background: c.color + "20",
                        color: c.color,
                        border: "1px solid " + c.color + "40",
                      }
                    : {
                        background: "rgba(255,255,255,0.05)",
                        color: "#9CA3AF",
                        border: "1px solid rgba(255,255,255,0.1)",
                      }
                }
              >
                {c.name} ({c.count})
              </button>
            ))}
          </div>
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search apps..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-white/30"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((app, i) => (
              <motion.div
                key={app.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white/5 border border-white/10 rounded-xl p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-white font-semibold">{app.name}</h3>
                  <span
                    className="px-2 py-0.5 rounded text-xs"
                    style={{ background: cat.color + "15", color: cat.color }}
                  >
                    {app.type}
                  </span>
                </div>
                <p className="text-gray-400 text-sm">{app.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/eapps"
              className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-semibold transition-colors"
            >
              eApps Store <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/eoffice"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold border border-white/20 transition-colors"
            >
              eOffice Suite
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
