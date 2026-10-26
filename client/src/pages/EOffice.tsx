import { useState, Suspense, lazy, type CSSProperties } from "react";
import ViewportGate from "../components/ViewportGate";
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
import { BOARD_COUNT } from "@/data/stack";
import {
  Band,
  BpPage,
  LocalNav,
  PageHero,
  Section,
  Stats,
} from "@/components/bp";
import "./EOffice.css";
const EOfficeCanvas = lazy(() =>
  import("../components/EoS3D").then(m => ({ default: m.EOfficeCanvas }))
);

const APPS = [
  {
    id: "ewriter",
    icon: FileText,
    color: "#F97316",
    name: "eWriter",
    subtitle: "Word Processor",
    desc: "Full-featured word processor with rich text editing, templates, export to PDF/DOCX, and real-time collaboration over local network.",
    features: [
      "Rich text + markdown",
      "PDF/DOCX export",
      "Local collaboration",
      "Spell check",
      "Templates library",
    ],
    preview: {
      title: "eWriter — Untitled Document",
      content: [
        { type: "h1", text: "Project Report Q3 2026" },
        {
          type: "p",
          text: "This document summarises the key findings from the third quarter...",
        },
        {
          type: "p",
          text: "The embedded systems team shipped 3 major releases, including EoS v2.4 with improved...",
        },
        { type: "bullet", text: `EoS v2.4 — ${BOARD_COUNT} board support` },
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
    features: [
      "200+ functions",
      "Pivot tables",
      "Charts & graphs",
      "CSV/XLSX import",
      "Formula bar",
    ],
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
    features: [
      "Slide animations",
      "Speaker notes",
      "PPTX export",
      "Kiosk mode",
      "Remote control",
    ],
    preview: {
      title: "ePresent — EoS Overview.pptx",
      content: [
        {
          type: "slide",
          text: "Slide 1/8 — Title: EmbeddedOS Platform Overview",
        },
        { type: "slide", text: "Slide 2/8 — The EoS Stack" },
        { type: "slide", text: `Slide 3/8 — ${BOARD_COUNT} Supported Boards` },
        {
          type: "note",
          text: "Speaker note: Mention STM32H7 performance numbers",
        },
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
    features: [
      "Markdown + live preview",
      "Tags & folders",
      "Full-text search",
      "Local network sync",
      "Code highlighting",
    ],
    preview: {
      title: "eNotes — eos-setup.md",
      content: [
        { type: "h1", text: "# EoS Setup Notes" },
        { type: "p", text: "## Flash eBoot" },
        {
          type: "code",
          text: "$ ebuild flash --board stm32h7 --image eboot.bin",
        },
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
    features: [
      "Vector drawing",
      "Circuit schematic mode",
      "Flowchart templates",
      "SVG/PNG export",
      "Layer management",
    ],
    preview: {
      title: "eDraw — circuit-v2.svg",
      content: [
        { type: "p", text: "Canvas: 1920×1080 · Layers: 3" },
        { type: "bullet", text: "Layer 1: PCB traces (copper)" },
        {
          type: "bullet",
          text: "Layer 2: Components (STM32H7, caps, resistors)",
        },
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
    features: [
      "Scientific mode",
      "Programmer mode (hex/bin/oct)",
      "Unit conversion",
      "Expression history",
      "Bitwise ops",
    ],
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
    features: [
      "Month/week/day views",
      "Recurring events",
      "Reminders",
      "CalDAV sync",
      "Meeting scheduler",
    ],
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
    features: [
      "vCard import/export",
      "Groups & tags",
      "CardDAV sync",
      "Photo support",
      "Merge duplicates",
    ],
    preview: {
      title: "eContacts — 247 contacts",
      content: [
        { type: "row", text: "Alice Chen — alice@embeddedos.org · TSC Member" },
        {
          type: "row",
          text: "Bob Kumar — bob@embeddedos.org · Core Contributor",
        },
        {
          type: "row",
          text: "Carol Diaz — carol@embeddedos.org · Health Team",
        },
        {
          type: "p",
          text: "Groups: TSC (7) · Contributors (42) · Health (12)",
        },
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
    features: [
      "IMAP/SMTP",
      "Thread view",
      "Full-text search",
      "PGP encryption",
      "Offline mode",
    ],
    preview: {
      title: "eMail — Inbox (12 unread)",
      content: [
        { type: "row", text: "★ EoS v2.5 RC1 ready for testing — Alice Chen" },
        {
          type: "row",
          text: "  HEALTH-KEY ULTRA PCB rev3 shipped — Bob Kumar",
        },
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
    features: [
      "E2E encryption",
      "Local network only",
      "File sharing",
      "Group channels",
      "No cloud required",
    ],
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
    features: [
      "Dual-pane view",
      "ZIP/TAR support",
      "SFTP/FTP access",
      "Thumbnail previews",
      "Batch operations",
    ],
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

const PLATFORMS = [
  "Desktop (EoS Native)",
  "Mobile (Flutter)",
  "Embedded Display (LVGL)",
];

const STATS = [
  { value: "11", label: "Office Apps" },
  { value: "3", label: "Platforms" },
  { value: "MIT", label: "License" },
  { value: "0", label: "Cloud Required" },
];

export default function EOffice() {
  const [activeApp, setActiveApp] = useState("ewriter");
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
        lead="A complete office productivity suite built for embedded displays, workstations, and mobile devices. Word processor, spreadsheet, slides, notes, drawing, calendar, contacts, email, chat, and file manager — all running natively on EmbeddedOS."
        visual={
          // The 3D suite of apps, on a large stage; it loads only near the viewport.
          <div className="board stage">
            <Suspense fallback={<div className="stage-wait" />}>
              <ViewportGate>
                <EOfficeCanvas hovered={false} />
              </ViewportGate>
            </Suspense>
          </div>
        }
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
            <ul className="eo-feat">
              {app.features.map(f => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>

          <div className="code eo-prev">
            <div className="cbar">
              <b>{app.preview.title}</b>
            </div>
            <div className="eo-lines">
              {app.preview.content.map((item, i) => (
                <div key={i} className={`t-${item.type}`}>
                  {item.type === "bullet" ? `• ${item.text}` : item.text}
                </div>
              ))}
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
        title="Office productivity on any device"
        lead="eOffice is part of the eApps ecosystem. Install it on any EoS device, mobile, or desktop."
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
