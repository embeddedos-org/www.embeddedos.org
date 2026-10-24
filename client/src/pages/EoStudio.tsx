import { useState, type CSSProperties } from "react";
import { SIM_PLATFORM_COUNT } from "@/data/stack";
import { Link } from "wouter";
import { Band, BpPage, PageHero, Section } from "@/components/bp";
import "./EoStudio.css";

const editors = [
  {
    id: "code",
    color: "#F97316",
    name: "Code Editor",
    desc: "Monaco-based editor with EoS-aware syntax highlighting, auto-complete for all 197 EoS APIs, and inline documentation.",
  },
  {
    id: "flow",
    color: "#22D3EE",
    name: "eFlow Visual Editor",
    desc: "Drag-and-drop block programming for GPIO, timers, UART, SPI, I²C, PWM, ADC, and AI inference blocks.",
  },
  {
    id: "debug",
    color: "#A855F7",
    name: "Debugger",
    desc: "GDB-based debugger with EoS-aware task and memory views. Set breakpoints in EoS kernel code and user tasks simultaneously.",
  },
  {
    id: "sim",
    color: "#34D399",
    name: "EoSim Integration",
    desc: `One-click simulation of your firmware on ${SIM_PLATFORM_COUNT} virtual platforms. No hardware required to test your application.`,
  },
  {
    id: "ai",
    color: "#F472B6",
    name: "AI Tutor",
    desc: "Built-in AI assistant trained on EoS documentation. Ask questions, get code examples, and debug errors in natural language.",
  },
  {
    id: "learn",
    color: "#FBBF24",
    name: "Learning Paths",
    desc: "4 structured learning paths from beginner to advanced. Interactive exercises with instant feedback in the simulator.",
  },
];

const paths = [
  {
    level: "Beginner",
    title: "EoS Fundamentals",
    modules: 8,
    hours: "12h",
    color: "#34D399",
    topics: [
      "GPIO & Interrupts",
      "UART & SPI",
      "Timers & PWM",
      "Task Scheduling",
    ],
  },
  {
    level: "Intermediate",
    title: "RTOS & Drivers",
    modules: 12,
    hours: "20h",
    color: "#22D3EE",
    topics: ["Kernel Internals", "Device Drivers", "Filesystem", "Networking"],
  },
  {
    level: "Advanced",
    title: "Security & AI",
    modules: 10,
    hours: "18h",
    color: "#A855F7",
    topics: ["Secure Boot", "Crypto APIs", "EAI Inference", "ENI Integration"],
  },
  {
    level: "Expert",
    title: "Safety-Critical",
    modules: 8,
    hours: "16h",
    color: "#F97316",
    topics: ["MISRA C", "Formal Verification", "DO-178C", "IEC 61508"],
  },
];

export default function EoStudioPage() {
  const [activeEditor, setActiveEditor] = useState("code");
  const editor = editors.find(e => e.id === activeEditor)!;

  return (
    <BpPage className="eostudio">
      <PageHero
        sig
        label="EOSTUDIO"
        title="EoStudio"
        sub="The Embedded IDE for EmbeddedOS"
        lead="12 specialized editors, 4 learning paths, AI tutor, and built-in EoSim integration — everything you need to build EoS applications in one environment."
      />

      <Section
        title="12 Specialized Editors"
        lead="Each editor is purpose-built for a specific aspect of embedded development."
      >
        <div className="es-tabs">
          {editors.map(e => (
            <button
              key={e.id}
              type="button"
              onClick={() => setActiveEditor(e.id)}
              aria-pressed={activeEditor === e.id}
              className="btn gh"
            >
              <span>{e.name.split(" ")[0]}</span>
            </button>
          ))}
        </div>
        <div
          className="card es-editor"
          style={{ "--c": editor.color } as CSSProperties}
        >
          <h3>{editor.name}</h3>
          <p>{editor.desc}</p>
        </div>
      </Section>

      <Section
        title="4 Learning Paths"
        lead="Structured curriculum from beginner to safety-critical expert. Interactive exercises with instant feedback in EoSim."
      >
        <ul className="cards two">
          {paths.map(p => (
            <li key={p.title}>
              <div className="card" style={{ "--c": p.color } as CSSProperties}>
                <div className="top">
                  <span className="st">{p.level}</span>
                  <span className="k">
                    {p.modules} modules · {p.hours}
                  </span>
                </div>
                <h3>{p.title}</h3>
                <ul className="es-topics">
                  {p.topics.map(t => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Band
        title="Start Learning for Free"
        lead="EoStudio is free and open-source. Download it or use the web version to start building EoS applications today."
      >
        <Link href="/demo" className="btn pri">
          Try in Browser
        </Link>
        <Link href="/getting-started" className="btn gh">
          Getting Started
        </Link>
        <Link href="/product-eostudio" className="btn gh">
          EoStudio engineering detail
        </Link>
      </Band>
    </BpPage>
  );
}
