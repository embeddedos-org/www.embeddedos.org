import { useState, Suspense, lazy } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
const EOfficeCanvas = lazy(() =>
  import("../components/EoS3D").then(m => ({ default: m.EOfficeCanvas }))
);
import {
  FileText, Table2, Presentation, StickyNote, PenTool,
  Calculator, Calendar, Users, Mail, MessageSquare, FolderOpen,
  ArrowRight, Monitor, Smartphone, Package, Check, ChevronRight
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.45, delay: i * 0.07, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] },
  }),
};

const APPS = [
  {
    id: "ewriter",
    icon: FileText,
    color: "#F97316",
    name: "eWriter",
    subtitle: "Word Processor",
    desc: "Full-featured word processor with rich text editing, templates, export to PDF/DOCX, and real-time collaboration over local network.",
    features: ["Rich text + markdown", "PDF/DOCX export", "Local collaboration", "Spell check", "Templates library"],
    preview: {
      title: "eWriter — Untitled Document",
      content: [
        { type: "h1", text: "Project Report Q3 2026" },
        { type: "p", text: "This document summarises the key findings from the third quarter..." },
        { type: "p", text: "The embedded systems team shipped 3 major releases, including EoS v2.4 with improved..." },
        { type: "bullet", text: "EoS v2.4 — 52+ board support" },
        { type: "bullet", text: "eBoot v1.2 — OTA A/B rollback" },
        { type: "bullet", text: "EAI Engine — 4-bit quantization" },
      ],
    },
  },
  {
    id: "esheet",
    icon: Table2,
    color: "#34D399",
    name: "eSheet",
    subtitle: "Spreadsheet",
    desc: "Spreadsheet app with 200+ functions, pivot tables, charting, and CSV/XLSX import/export. Runs natively on embedded displays.",
    features: ["200+ functions", "Pivot tables", "Charts & graphs", "CSV/XLSX import", "Formula bar"],
    preview: {
      title: "eSheet — sensor_data.csv",
      content: [
        { type: "header", text: "Timestamp | Temp (°C) | Humidity | Pressure" },
        { type: "row", text: "2026-07-14 09:00 | 23.4 | 61.2 | 1013.2" },
        { type: "row", text: "2026-07-14 09:05 | 23.6 | 61.0 | 1013.1" },
        { type: "row", text: "2026-07-14 09:10 | 23.5 | 61.4 | 1013.3" },
        { type: "formula", text: "=AVERAGE(B2:B4) → 23.5°C" },
        { type: "formula", text: "=MAX(C2:C4) → 61.4%" },
      ],
    },
  },
  {
    id: "epresent",
    icon: Presentation,
    color: "#22D3EE",
    name: "ePresent",
    subtitle: "Presentation",
    desc: "Slide presentation tool with animations, transitions, speaker notes, and PPTX export. Perfect for embedded kiosk displays.",
    features: ["Slide animations", "Speaker notes", "PPTX export", "Kiosk mode", "Remote control"],
    preview: {
      title: "ePresent — EoS Overview.pptx",
      content: [
        { type: "slide", text: "Slide 1/8 — Title: EmbeddedOS Platform Overview" },
        { type: "slide", text: "Slide 2/8 — The EoS Stack" },
        { type: "slide", text: "Slide 3/8 — 52+ Supported Boards" },
        { type: "note", text: "Speaker note: Mention STM32H7 performance numbers" },
        { type: "note", text: "Transition: Fade → 400ms" },
      ],
    },
  },
  {
    id: "enotes",
    icon: StickyNote,
    color: "#F59E0B",
    name: "eNotes",
    subtitle: "Markdown Notes",
    desc: "Markdown-first note-taking app with live preview, tags, full-text search, and sync across EoS devices on the local network.",
    features: ["Markdown + live preview", "Tags & folders", "Full-text search", "Local network sync", "Code highlighting"],
    preview: {
      title: "eNotes — eos-setup.md",
      content: [
        { type: "h1", text: "# EoS Setup Notes" },
        { type: "p", text: "## Flash eBoot" },
        { type: "code", text: "$ ebuild flash --board stm32h7 --image eboot.bin" },
        { type: "p", text: "## Verify boot" },
        { type: "code", text: "$ minicom -D /dev/ttyUSB0 -b 115200" },
        { type: "p", text: "[BOOT2] EoS kernel hash... OK ✓" },
      ],
    },
  },
  {
    id: "edraw",
    icon: PenTool,
    color: "#A78BFA",
    name: "eDraw",
    subtitle: "Vector Graphics",
    desc: "Vector drawing and diagramming tool. Create circuit schematics, flowcharts, and UI mockups. Exports SVG and PNG.",
    features: ["Vector drawing", "Circuit schematic mode", "Flowchart templates", "SVG/PNG export", "Layer management"],
    preview: {
      title: "eDraw — circuit-v2.svg",
      content: [
        { type: "p", text: "Canvas: 1920×1080 · Layers: 3" },
        { type: "bullet", text: "Layer 1: PCB traces (copper)" },
        { type: "bullet", text: "Layer 2: Components (STM32H7, caps, resistors)" },
        { type: "bullet", text: "Layer 3: Annotations" },
        { type: "p", text: "Objects: 142 · Groups: 8 · Connectors: 34" },
      ],
    },
  },
  {
    id: "ecalc",
    icon: Calculator,
    color: "#60A5FA",
    name: "eCalc",
    subtitle: "Calculator",
    desc: "Scientific and programmer calculator with unit conversion, base conversion (hex/bin/oct), and expression history.",
    features: ["Scientific mode", "Programmer mode (hex/bin/oct)", "Unit conversion", "Expression history", "Bitwise ops"],
    preview: {
      title: "eCalc — Programmer Mode",
      content: [
        { type: "formula", text: "0xFF & 0x0F = 0x0F (15)" },
        { type: "formula", text: "0b1010 << 2 = 0b101000 (40)" },
        { type: "formula", text: "1024 * 1024 = 1,048,576 (1MB)" },
        { type: "formula", text: "sin(π/4) = 0.7071..." },
        { type: "formula", text: "log₂(65536) = 16" },
      ],
    },
  },
  {
    id: "ecalendar",
    icon: Calendar,
    color: "#F472B6",
    name: "eCalendar",
    subtitle: "Calendar",
    desc: "Calendar and scheduling app with event management, reminders, recurring events, and CalDAV sync.",
    features: ["Month/week/day views", "Recurring events", "Reminders", "CalDAV sync", "Meeting scheduler"],
    preview: {
      title: "eCalendar — July 2026",
      content: [
        { type: "row", text: "Mon 14 — EoS v2.5 release planning (10:00)" },
        { type: "row", text: "Tue 15 — TSC meeting (14:00, recurring weekly)" },
        { type: "row", text: "Wed 16 — Hardware Lab board bring-up (09:00)" },
        { type: "row", text: "Fri 18 — Community call (16:00)" },
      ],
    },
  },
  {
    id: "econtacts",
    icon: Users,
    color: "#34D399",
    name: "eContacts",
    subtitle: "Contacts",
    desc: "Contact management with vCard import/export, groups, and CardDAV sync. Works offline on any EoS device.",
    features: ["vCard import/export", "Groups & tags", "CardDAV sync", "Photo support", "Merge duplicates"],
    preview: {
      title: "eContacts — 247 contacts",
      content: [
        { type: "row", text: "Alice Chen — alice@embeddedos.org · TSC Member" },
        { type: "row", text: "Bob Kumar — bob@embeddedos.org · Core Contributor" },
        { type: "row", text: "Carol Diaz — carol@embeddedos.org · Health Team" },
        { type: "p", text: "Groups: TSC (7) · Contributors (42) · Health (12)" },
      ],
    },
  },
  {
    id: "email",
    icon: Mail,
    color: "#F97316",
    name: "eMail",
    subtitle: "Email Client",
    desc: "Lightweight email client with IMAP/SMTP support, threading, search, and PGP encryption. Designed for low-memory embedded displays.",
    features: ["IMAP/SMTP", "Thread view", "Full-text search", "PGP encryption", "Offline mode"],
    preview: {
      title: "eMail — Inbox (12 unread)",
      content: [
        { type: "row", text: "★ EoS v2.5 RC1 ready for testing — Alice Chen" },
        { type: "row", text: "  HEALTH-KEY ULTRA PCB rev3 shipped — Bob Kumar" },
        { type: "row", text: "  [TSC] July meeting agenda — Carol Diaz" },
        { type: "row", text: "  New contributor: welcome @devuser42 — GitHub" },
      ],
    },
  },
  {
    id: "echat",
    icon: MessageSquare,
    color: "#22D3EE",
    name: "eChat",
    subtitle: "Chat",
    desc: "End-to-end encrypted local network chat. No cloud server required. Works between EoS devices on the same network.",
    features: ["E2E encryption", "Local network only", "File sharing", "Group channels", "No cloud required"],
    preview: {
      title: "eChat — #general",
      content: [
        { type: "row", text: "alice: EoS v2.5 RC1 is up on the test server" },
        { type: "row", text: "bob: Testing now on STM32H7 ✓" },
        { type: "row", text: "carol: HEALTH-RING firmware flashed OK" },
        { type: "row", text: "alice: Great! Merge to main tomorrow?" },
        { type: "row", text: "bob: 👍 LGTM" },
      ],
    },
  },
  {
    id: "efiles",
    icon: FolderOpen,
    color: "#F59E0B",
    name: "eFiles",
    subtitle: "File Manager",
    desc: "Full-featured file manager with dual-pane view, archive support (ZIP/TAR), SFTP/FTP access, and thumbnail previews.",
    features: ["Dual-pane view", "ZIP/TAR support", "SFTP/FTP access", "Thumbnail previews", "Batch operations"],
    preview: {
      title: "eFiles — /home/eos",
      content: [
        { type: "row", text: "📁 firmware/   (3 items, 2.4 MB)" },
        { type: "row", text: "📁 logs/       (47 items, 12.1 MB)" },
        { type: "row", text: "📄 eboot.bin   (128 KB)" },
        { type: "row", text: "📄 eos-v2.5.img (4.2 MB)" },
        { type: "row", text: "📄 sensor_data.csv (892 KB)" },
      ],
    },
  },
];

export default function EOffice() {
  const [activeApp, setActiveApp] = useState("ewriter");
  const app = APPS.find(a => a.id === activeApp)!;
  const AppIcon = app.icon;

  return (
    <div className="min-h-screen bg-[#080F1E]">

      {/* Hero */}
      <section className="relative py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628] to-[#080F1E]" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-[#F97316]/6 rounded-full blur-[100px]" />
          <div className="absolute top-1/4 right-1/3 w-64 h-64 bg-[#A78BFA]/5 rounded-full blur-[80px]" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6"
              style={{ background: "rgba(167,139,250,0.12)", border: "1px solid rgba(167,139,250,0.3)", color: "#A78BFA" }}>
              <Package size={12} /> eOffice Suite
            </span>
          </motion.div>
          <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1}
            className="font-heading font-black text-5xl sm:text-6xl text-white mb-5 leading-[1.05]">
            eOffice<br />
            <span style={{ color: "#A78BFA" }}>11-App Suite</span>
          </motion.h1>
          <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2}
            className="text-white/60 text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
            A complete office productivity suite built for embedded displays, workstations, and mobile devices.
            Word processor, spreadsheet, slides, notes, drawing, calendar, contacts, email, chat, and file manager —
            all running natively on EmbeddedOS.
          </motion.p>

          {/* Platform badges */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}
            className="flex flex-wrap justify-center gap-3 mb-8">
            {[
              { icon: Monitor, label: "Desktop (EoS Native)" },
              { icon: Smartphone, label: "Mobile (Flutter)" },
              { icon: Package, label: "Embedded Display (LVGL)" },
            ].map(p => {
              const PIcon = p.icon;
              return (
                <span key={p.label} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-white/60"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <PIcon size={14} /> {p.label}
                </span>
              );
            })}
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}
            className="flex flex-wrap justify-center gap-3">
            <Link href="/eapps"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-95"
              style={{ background: "#A78BFA", color: "#fff" }}>
              View All eApps <ArrowRight size={15} />
            </Link>
            <Link href="/getting-started"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm border border-white/15 text-white/70 hover:bg-white/5 transition-all">
              Get Started <ChevronRight size={15} />
            </Link>
          </motion.div>
          {/* 3D eOffice Apps Animation */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5}
            className="mt-10 rounded-2xl border border-white/8 overflow-hidden h-56 max-w-lg mx-auto"
            style={{ background: "rgba(5,10,20,0.8)" }}>
            <Suspense fallback={<div className="w-full h-full flex items-center justify-center"><div className="w-6 h-6 border-2 border-[#A78BFA] border-t-transparent rounded-full animate-spin" /></div>}>
              <EOfficeCanvas hovered={false} />
            </Suspense>
          </motion.div>
        </div>
      </section>

      {/* App explorer */}
      <section className="pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-8">
            <h2 className="font-heading font-black text-3xl text-white mb-2">Explore the Suite</h2>
            <p className="text-white/40 text-base">Click any app to see what it does</p>
          </motion.div>

          {/* App icon grid */}
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-11 gap-2 mb-8">
            {APPS.map(a => {
              const AIcon = a.icon;
              return (
                <button key={a.id} onClick={() => setActiveApp(a.id)}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all"
                  style={activeApp === a.id
                    ? { background: `${a.color}20`, border: `1px solid ${a.color}50` }
                    : { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: activeApp === a.id ? `${a.color}25` : `${a.color}12` }}>
                    <AIcon size={18} style={{ color: a.color }} />
                  </div>
                  <span className="text-[10px] font-bold text-white/60 text-center leading-tight">{a.name}</span>
                </button>
              );
            })}
          </div>

          {/* App detail */}
          <AnimatePresence mode="wait">
            <motion.div key={activeApp}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Info */}
              <div className="rounded-2xl border p-6"
                style={{ background: `${app.color}06`, borderColor: `${app.color}20` }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{ background: `${app.color}18` }}>
                    <AppIcon size={22} style={{ color: app.color }} />
                  </div>
                  <div>
                    <h3 className="font-heading font-black text-xl text-white">{app.name}</h3>
                    <p className="text-sm" style={{ color: app.color }}>{app.subtitle}</p>
                  </div>
                </div>
                <p className="text-white/60 text-sm leading-relaxed mb-4">{app.desc}</p>
                <div className="space-y-2">
                  {app.features.map(f => (
                    <div key={f} className="flex items-center gap-2 text-sm text-white/60">
                      <Check size={13} style={{ color: app.color }} className="shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div className="rounded-2xl border border-white/8 overflow-hidden"
                style={{ background: "rgba(5,10,20,0.85)" }}>
                <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#F85149]/60" />
                    <div className="w-3 h-3 rounded-full bg-[#F0883E]/60" />
                    <div className="w-3 h-3 rounded-full bg-[#3FB950]/60" />
                  </div>
                  <span className="text-xs font-mono text-white/30 ml-2">{app.preview.title}</span>
                </div>
                <div className="p-5 space-y-2.5">
                  {app.preview.content.map((item, i) => (
                    <div key={i} className="text-sm"
                      style={{
                        color: item.type === "h1" ? "#fff"
                          : item.type === "header" ? app.color
                          : item.type === "formula" || item.type === "code" ? "#34D399"
                          : item.type === "note" ? "#F59E0B"
                          : item.type === "bullet" ? "rgba(255,255,255,0.6)"
                          : "rgba(255,255,255,0.5)",
                        fontFamily: item.type === "code" || item.type === "formula" ? "monospace" : undefined,
                        fontWeight: item.type === "h1" || item.type === "header" ? "700" : undefined,
                        paddingLeft: item.type === "bullet" ? "1rem" : undefined,
                      }}>
                      {item.type === "bullet" ? `• ${item.text}` : item.text}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Stats */}
      <section className="pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { value: "11", label: "Office Apps", color: "#A78BFA" },
              { value: "3", label: "Platforms", color: "#22D3EE" },
              { value: "MIT", label: "License", color: "#34D399" },
              { value: "0", label: "Cloud Required", color: "#F97316" },
            ].map(s => (
              <motion.div key={s.label} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="rounded-2xl border p-5 text-center"
                style={{ background: `${s.color}08`, borderColor: `${s.color}20` }}>
                <div className="font-heading font-black text-3xl mb-1" style={{ color: s.color }}>{s.value}</div>
                <div className="text-white/50 text-sm">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="rounded-3xl p-10 text-center border"
            style={{ background: "rgba(167,139,250,0.06)", borderColor: "rgba(167,139,250,0.2)" }}>
            <h2 className="font-heading font-black text-3xl text-white mb-3">
              Office productivity on any device
            </h2>
            <p className="text-white/55 text-lg mb-6 max-w-xl mx-auto">
              eOffice is part of the eApps ecosystem. Install it on any EoS device, mobile, or desktop.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/eapps"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-95"
                style={{ background: "#A78BFA", color: "#fff" }}>
                Browse All eApps <ArrowRight size={15} />
              </Link>
              <Link href="/getting-started"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm border border-white/15 text-white/70 hover:bg-white/5 transition-all">
                <ChevronRight size={15} /> Get Started
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
