import { useEffect, useRef, type CSSProperties } from "react";
import { Link } from "wouter";
import { BOARD_COUNT, REPO_COUNT } from "@/data/stack";
import { StoryHero, MakingOf, Showcase } from "../black/Sections";
import Chapters from "../black/Chapters";
import "../black/black.css";
import "./home-sections.css";

type PrerenderWindow = Window & { __EOS_PRERENDER__?: boolean };

export default function Home() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = root.current;
    if (!host || (window as PrerenderWindow).__EOS_PRERENDER__) return;
    const sections = host.querySelector<HTMLElement>(".hs");
    const disposers: (() => void)[] = [];
    let cancelled = false;
    // Both scripts are their own chunks: the poster, the chapters, the boards
    // and every section are in the HTML before they arrive, and read without
    // them.
    void import("../black/story").then(({ mountBlack }) => {
      if (!cancelled) disposers.push(mountBlack(host));
    });
    if (sections)
      void import("./home-sections").then(({ mountSections }) => {
        if (!cancelled) disposers.push(mountSections(sections));
      });
    return () => {
      cancelled = true;
      disposers.forEach(d => d());
    };
  }, []);

  return (
    <div ref={root} className="bk">
      <StoryHero />
      <Chapters />
      <MakingOf />
      <Showcase />
      <div className="hs">
        <div className="hp" id="home-sections">
          {" "}
          <div className="hp-marquee" aria-label="EmbeddedOS ecosystem">
            {" "}
            <p>EmbeddedOS Ecosystem</p>{" "}
            <div className="mq-row">
              <span
                className="mq-item"
                style={{ "--c": "#F97316" } as CSSProperties}
              >
                <i>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect width="16" height="16" x="4" y="4" rx="2" />
                    <rect width="6" height="6" x="9" y="9" rx="1" />
                    <path d="M15 2v2" />
                    <path d="M15 20v2" />
                    <path d="M2 15h2" />
                    <path d="M2 9h2" />
                    <path d="M20 15h2" />
                    <path d="M20 9h2" />
                    <path d="M9 2v2" />
                    <path d="M9 20v2" />
                  </svg>
                </i>
                <b>EoS Kernel</b>
                <em>Core</em>
              </span>
              <span
                className="mq-item"
                style={{ "--c": "#22D3EE" } as CSSProperties}
              >
                <i>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
                  </svg>
                </i>
                <b>eBoot</b>
                <em>Security</em>
              </span>
              <span
                className="mq-item"
                style={{ "--c": "#A78BFA" } as CSSProperties}
              >
                <i>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </i>
                <b>eIPC</b>
                <em>Platform</em>
              </span>
              <span
                className="mq-item"
                style={{ "--c": "#34D399" } as CSSProperties}
              >
                <i>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2" />
                    <path d="M8.5 2h7" />
                    <path d="M7 16h10" />
                  </svg>
                </i>
                <b>eAI</b>
                <em>AI</em>
              </span>
              <span
                className="mq-item"
                style={{ "--c": "#60A5FA" } as CSSProperties}
              >
                <i>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
                    <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
                    <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
                    <path d="M17.599 6.5a3 3 0 0 0 .399-1.375" />
                    <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5" />
                    <path d="M3.477 10.896a4 4 0 0 1 .585-.396" />
                    <path d="M19.938 10.5a4 4 0 0 1 .585.396" />
                    <path d="M6 18a4 4 0 0 1-1.967-.516" />
                    <path d="M19.967 17.484A4 4 0 0 1 18 18" />
                  </svg>
                </i>
                <b>eosllm</b>
                <em>AI</em>
              </span>
              <span
                className="mq-item"
                style={{ "--c": "#F472B6" } as CSSProperties}
              >
                <i>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" />
                  </svg>
                </i>
                <b>eNI</b>
                <em>Neural</em>
              </span>
              <span
                className="mq-item"
                style={{ "--c": "#22D3EE" } as CSSProperties}
              >
                <i>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <ellipse cx="12" cy="5" rx="9" ry="3" />
                    <path d="M3 5V19A9 3 0 0 0 21 19V5" />
                    <path d="M3 12A9 3 0 0 0 21 12" />
                  </svg>
                </i>
                <b>eDB</b>
                <em>Data</em>
              </span>
              <span
                className="mq-item"
                style={{ "--c": "#F97316" } as CSSProperties}
              >
                <i>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z" />
                    <path d="M12 22V12" />
                    <path d="m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7" />
                    <path d="m7.5 4.27 9 5.15" />
                  </svg>
                </i>
                <b>eApps</b>
                <em>Apps</em>
              </span>
              <span
                className="mq-item"
                style={{ "--c": "#A78BFA" } as CSSProperties}
              >
                <i>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                    <path d="M2 12h20" />
                  </svg>
                </i>
                <b>eBrowser</b>
                <em>UI</em>
              </span>
              <span
                className="mq-item"
                style={{ "--c": "#34D399" } as CSSProperties}
              >
                <i>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                    <path d="M10 9H8" />
                    <path d="M16 13H8" />
                    <path d="M16 17H8" />
                  </svg>
                </i>
                <b>eOffice</b>
                <em>Apps</em>
              </span>
              <span
                className="mq-item"
                style={{ "--c": "#FBBF24" } as CSSProperties}
              >
                <i>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                  </svg>
                </i>
                <b>ebuild</b>
                <em>Build</em>
              </span>
              <span
                className="mq-item"
                style={{ "--c": "#F472B6" } as CSSProperties}
              >
                <i>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="16 18 22 12 16 6" />
                    <polyline points="8 6 2 12 8 18" />
                  </svg>
                </i>
                <b>EoStudio</b>
                <em>IDE</em>
              </span>
              <span
                className="mq-item"
                style={{ "--c": "#60A5FA" } as CSSProperties}
              >
                <i>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
                    <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
                    <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
                  </svg>
                </i>
                <b>EoSim</b>
                <em>Simulation</em>
              </span>
              <span
                className="mq-item"
                style={{ "--c": "#38BDF8" } as CSSProperties}
              >
                <i>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect width="16" height="16" x="4" y="4" rx="2" />
                    <rect width="6" height="6" x="9" y="9" rx="1" />
                    <path d="M15 2v2" />
                    <path d="M15 20v2" />
                    <path d="M2 15h2" />
                    <path d="M2 9h2" />
                    <path d="M20 15h2" />
                    <path d="M20 9h2" />
                    <path d="M9 2v2" />
                    <path d="M9 20v2" />
                  </svg>
                </i>
                <b>eCAD Hardware</b>
                <em>Hardware</em>
              </span>
              <span
                className="mq-item"
                style={{ "--c": "#F59E0B" } as CSSProperties}
              >
                <i>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <line x1="6" x2="10" y1="11" y2="11" />
                    <line x1="8" x2="8" y1="9" y2="13" />
                    <line x1="15" x2="15.01" y1="12" y2="12" />
                    <line x1="18" x2="18.01" y1="10" y2="10" />
                    <path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z" />
                  </svg>
                </i>
                <b>Kids Edition</b>
                <em>Education</em>
              </span>
              <span
                className="mq-item"
                style={{ "--c": "#60A5FA" } as CSSProperties}
              >
                <i>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="16" y="16" width="6" height="6" rx="1" />
                    <rect x="2" y="16" width="6" height="6" rx="1" />
                    <rect x="9" y="2" width="6" height="6" rx="1" />
                    <path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3" />
                    <path d="M12 12V8" />
                  </svg>
                </i>
                <b>eNet</b>
                <em>Planned</em>
              </span>
              <span
                className="mq-item"
                style={{ "--c": "#F59E0B" } as CSSProperties}
              >
                <i>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
                  </svg>
                </i>
                <b>eSec</b>
                <em>Planned</em>
              </span>
              <span aria-hidden="true" style={{ display: "contents" }}>
                <span
                  className="mq-item"
                  style={{ "--c": "#F97316" } as CSSProperties}
                >
                  <i>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <rect width="16" height="16" x="4" y="4" rx="2" />
                      <rect width="6" height="6" x="9" y="9" rx="1" />
                      <path d="M15 2v2" />
                      <path d="M15 20v2" />
                      <path d="M2 15h2" />
                      <path d="M2 9h2" />
                      <path d="M20 15h2" />
                      <path d="M20 9h2" />
                      <path d="M9 2v2" />
                      <path d="M9 20v2" />
                    </svg>
                  </i>
                  <b>EoS Kernel</b>
                  <em>Core</em>
                </span>
                <span
                  className="mq-item"
                  style={{ "--c": "#22D3EE" } as CSSProperties}
                >
                  <i>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
                    </svg>
                  </i>
                  <b>eBoot</b>
                  <em>Security</em>
                </span>
                <span
                  className="mq-item"
                  style={{ "--c": "#A78BFA" } as CSSProperties}
                >
                  <i>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </i>
                  <b>eIPC</b>
                  <em>Platform</em>
                </span>
                <span
                  className="mq-item"
                  style={{ "--c": "#34D399" } as CSSProperties}
                >
                  <i>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2" />
                      <path d="M8.5 2h7" />
                      <path d="M7 16h10" />
                    </svg>
                  </i>
                  <b>eAI</b>
                  <em>AI</em>
                </span>
                <span
                  className="mq-item"
                  style={{ "--c": "#60A5FA" } as CSSProperties}
                >
                  <i>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
                      <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
                      <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
                      <path d="M17.599 6.5a3 3 0 0 0 .399-1.375" />
                      <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5" />
                      <path d="M3.477 10.896a4 4 0 0 1 .585-.396" />
                      <path d="M19.938 10.5a4 4 0 0 1 .585.396" />
                      <path d="M6 18a4 4 0 0 1-1.967-.516" />
                      <path d="M19.967 17.484A4 4 0 0 1 18 18" />
                    </svg>
                  </i>
                  <b>eosllm</b>
                  <em>AI</em>
                </span>
                <span
                  className="mq-item"
                  style={{ "--c": "#F472B6" } as CSSProperties}
                >
                  <i>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" />
                    </svg>
                  </i>
                  <b>eNI</b>
                  <em>Neural</em>
                </span>
                <span
                  className="mq-item"
                  style={{ "--c": "#22D3EE" } as CSSProperties}
                >
                  <i>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <ellipse cx="12" cy="5" rx="9" ry="3" />
                      <path d="M3 5V19A9 3 0 0 0 21 19V5" />
                      <path d="M3 12A9 3 0 0 0 21 12" />
                    </svg>
                  </i>
                  <b>eDB</b>
                  <em>Data</em>
                </span>
                <span
                  className="mq-item"
                  style={{ "--c": "#F97316" } as CSSProperties}
                >
                  <i>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z" />
                      <path d="M12 22V12" />
                      <path d="m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7" />
                      <path d="m7.5 4.27 9 5.15" />
                    </svg>
                  </i>
                  <b>eApps</b>
                  <em>Apps</em>
                </span>
                <span
                  className="mq-item"
                  style={{ "--c": "#A78BFA" } as CSSProperties}
                >
                  <i>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                      <path d="M2 12h20" />
                    </svg>
                  </i>
                  <b>eBrowser</b>
                  <em>UI</em>
                </span>
                <span
                  className="mq-item"
                  style={{ "--c": "#34D399" } as CSSProperties}
                >
                  <i>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                      <path d="M10 9H8" />
                      <path d="M16 13H8" />
                      <path d="M16 17H8" />
                    </svg>
                  </i>
                  <b>eOffice</b>
                  <em>Apps</em>
                </span>
                <span
                  className="mq-item"
                  style={{ "--c": "#FBBF24" } as CSSProperties}
                >
                  <i>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                    </svg>
                  </i>
                  <b>ebuild</b>
                  <em>Build</em>
                </span>
                <span
                  className="mq-item"
                  style={{ "--c": "#F472B6" } as CSSProperties}
                >
                  <i>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <polyline points="16 18 22 12 16 6" />
                      <polyline points="8 6 2 12 8 18" />
                    </svg>
                  </i>
                  <b>EoStudio</b>
                  <em>IDE</em>
                </span>
                <span
                  className="mq-item"
                  style={{ "--c": "#60A5FA" } as CSSProperties}
                >
                  <i>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
                      <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
                      <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
                    </svg>
                  </i>
                  <b>EoSim</b>
                  <em>Simulation</em>
                </span>
                <span
                  className="mq-item"
                  style={{ "--c": "#38BDF8" } as CSSProperties}
                >
                  <i>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <rect width="16" height="16" x="4" y="4" rx="2" />
                      <rect width="6" height="6" x="9" y="9" rx="1" />
                      <path d="M15 2v2" />
                      <path d="M15 20v2" />
                      <path d="M2 15h2" />
                      <path d="M2 9h2" />
                      <path d="M20 15h2" />
                      <path d="M20 9h2" />
                      <path d="M9 2v2" />
                      <path d="M9 20v2" />
                    </svg>
                  </i>
                  <b>eCAD Hardware</b>
                  <em>Hardware</em>
                </span>
                <span
                  className="mq-item"
                  style={{ "--c": "#F59E0B" } as CSSProperties}
                >
                  <i>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <line x1="6" x2="10" y1="11" y2="11" />
                      <line x1="8" x2="8" y1="9" y2="13" />
                      <line x1="15" x2="15.01" y1="12" y2="12" />
                      <line x1="18" x2="18.01" y1="10" y2="10" />
                      <path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z" />
                    </svg>
                  </i>
                  <b>Kids Edition</b>
                  <em>Education</em>
                </span>
                <span
                  className="mq-item"
                  style={{ "--c": "#60A5FA" } as CSSProperties}
                >
                  <i>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <rect x="16" y="16" width="6" height="6" rx="1" />
                      <rect x="2" y="16" width="6" height="6" rx="1" />
                      <rect x="9" y="2" width="6" height="6" rx="1" />
                      <path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3" />
                      <path d="M12 12V8" />
                    </svg>
                  </i>
                  <b>eNet</b>
                  <em>Planned</em>
                </span>
                <span
                  className="mq-item"
                  style={{ "--c": "#F59E0B" } as CSSProperties}
                >
                  <i>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
                    </svg>
                  </i>
                  <b>eSec</b>
                  <em>Planned</em>
                </span>
              </span>
            </div>{" "}
          </div>{" "}
          <section
            className="hp-band hp-stats"
            aria-label="Key statistics"
            data-reveal=""
          >
            {" "}
            <div className="hp-wrap">
              {" "}
              <div className="hp-grid g6" data-stagger="">
                <div
                  className="hp-stat"
                  style={{ "--c": "#F97316" } as CSSProperties}
                >
                  <span className="dot" />
                  <b data-n={REPO_COUNT}>{REPO_COUNT}</b>
                  <span>Repositories</span>
                </div>
                <div
                  className="hp-stat"
                  style={{ "--c": "#22D3EE" } as CSSProperties}
                >
                  <span className="dot" />
                  <b data-n={BOARD_COUNT}>{BOARD_COUNT}</b>
                  <span>Boards</span>
                </div>
                <div
                  className="hp-stat"
                  style={{ "--c": "#A78BFA" } as CSSProperties}
                >
                  <span className="dot" />
                  <b data-n="300">300</b>
                  <i>+</i>
                  <span>APIs</span>
                </div>
                <div
                  className="hp-stat"
                  style={{ "--c": "#34D399" } as CSSProperties}
                >
                  <span className="dot" />
                  <b data-n="60">60</b>
                  <i>+</i>
                  <span>Apps</span>
                </div>
                <div
                  className="hp-stat"
                  style={{ "--c": "#F59E0B" } as CSSProperties}
                >
                  <span className="dot" />
                  <b data-n="4">4</b>
                  <span>Health devices</span>
                </div>
                <div
                  className="hp-stat"
                  style={{ "--c": "#60A5FA" } as CSSProperties}
                >
                  <span className="dot" />
                  <b data-n="14">14</b>
                  <span>Books</span>
                </div>
              </div>{" "}
            </div>{" "}
          </section>{" "}
          <section
            className="hp-sec"
            id="board-map"
            aria-labelledby="hp-map"
            data-reveal=""
          >
            {" "}
            <div className="hp-wrap">
              {" "}
              <div className="hp-head center">
                {" "}
                <span
                  className="hp-badge"
                  style={{ "--c": "#FDBA74" } as CSSProperties}
                  data-fade=""
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect width="16" height="16" x="4" y="4" rx="2" />
                    <rect width="6" height="6" x="9" y="9" rx="1" />
                    <path d="M15 2v2" />
                    <path d="M15 20v2" />
                    <path d="M2 15h2" />
                    <path d="M2 9h2" />
                    <path d="M20 15h2" />
                    <path d="M20 9h2" />
                    <path d="M9 2v2" />
                    <path d="M9 20v2" />
                  </svg>
                  {" The board, part by part"}
                </span>{" "}
                <h2 id="hp-map" data-split="">
                  Every component, and the bus that reaches it
                </h2>{" "}
                <p data-fade="">
                  Click or tap any part. U1 runs EoS; every other part hangs off
                  its own bus, and each says how EoS uses it today. The board is
                  illustrative; the statuses come from the code.
                </p>{" "}
              </div>{" "}
              <div className="hp-map">
                {" "}
                <div className="hp-board" data-fade="">
                  {" "}
                  <svg
                    viewBox="0 0 1000 720"
                    role="group"
                    aria-label="Board map: click a part for details"
                  >
                    {" "}
                    <defs>
                      <pattern
                        id="hp-grid"
                        width="40"
                        height="40"
                        patternUnits="userSpaceOnUse"
                      >
                        <path
                          className="grid"
                          d="M 40 0 L 0 0 0 40"
                          fill="none"
                        />
                      </pattern>
                    </defs>{" "}
                    <rect
                      x="4"
                      y="4"
                      width="992"
                      height="712"
                      rx="18"
                      fill="url(#hp-grid)"
                    />{" "}
                    <rect
                      className="edge"
                      x="14"
                      y="14"
                      width="972"
                      height="692"
                      rx="14"
                    />{" "}
                    <g className="traces" />
                    <g className="holes" />
                    <g className="parts" />
                    <g className="pulses" />{" "}
                    <text className="silk" x="560" y="702">
                      EMBEDDEDOS · EoS REFERENCE · REV A
                    </text>{" "}
                  </svg>{" "}
                </div>{" "}
                <aside className="hp-detail" aria-live="polite" data-fade="">
                  {" "}
                  <span className="ref" /> <h3 /> <p className="bus" />{" "}
                  <p className="what" />{" "}
                  <div className="eos">
                    <i>EoS</i>
                    <span />
                  </div>{" "}
                  <span className="hp-pill st-pill" />{" "}
                </aside>{" "}
              </div>{" "}
              <div
                className="hp-parts"
                role="group"
                aria-label="All parts"
              />{" "}
            </div>{" "}
          </section>{" "}
          <section
            className="hp-sec hp-band"
            aria-labelledby="hp-mission"
            data-reveal=""
          >
            {" "}
            <div className="hp-wrap">
              {" "}
              <div className="hp-head center">
                {" "}
                <span className="hp-badge" data-fade="">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                  {" Our Mission"}
                </span>{" "}
                <h2 id="hp-mission" data-split="">
                  Embedded computing should be free to learn and free to build
                  on
                </h2>{" "}
                <p data-fade="">
                  The Embedded Operating Systems Research Foundation is a
                  501(c)(3) public charity (EIN 41-4821627). We exist to advance
                  open-source embedded systems research, education, and
                  technology for the public benefit, accountable to our
                  community, not to shareholders. Every line of code we publish
                  is MIT licensed and free, forever.
                </p>{" "}
              </div>{" "}
              <div className="hp-grid g3" data-stagger="">
                {" "}
                <div className="hp-cell">
                  <div
                    className="hp-card"
                    style={{ "--c": "#F97316" } as CSSProperties}
                  >
                    <span className="hp-ic">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <polyline points="16 18 22 12 16 6" />
                        <polyline points="8 6 2 12 8 18" />
                      </svg>
                    </span>
                    <h3>Open-source software, permanently free</h3>
                    <p>
                      The kernel, bootloader, drivers, build tools, and every
                      application we ship are MIT licensed and developed in
                      public on GitHub. No paid tiers, no license fees, no
                      vendor lock-in.
                    </p>
                  </div>
                </div>{" "}
                <div className="hp-cell">
                  <div
                    className="hp-card"
                    style={{ "--c": "#22D3EE" } as CSSProperties}
                  >
                    <span className="hp-ic">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
                        <path d="M9 18h6" />
                        <path d="M10 22h4" />
                      </svg>
                    </span>
                    <h3>Free education for engineers and students</h3>
                    <p>
                      14 full-length technical books, free certification exams,
                      a Kids Edition for classrooms, and paid internships for
                      students and new graduates, all at no cost to learners.
                    </p>
                  </div>
                </div>{" "}
                <div className="hp-cell">
                  <div
                    className="hp-card"
                    style={{ "--c": "#A78BFA" } as CSSProperties}
                  >
                    <span className="hp-ic">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M6 18h8" />
                        <path d="M3 22h18" />
                        <path d="M14 22a7 7 0 1 0 0-14h-1" />
                        <path d="M9 14h2" />
                        <path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z" />
                        <path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3" />
                      </svg>
                    </span>
                    <h3>Public-benefit research</h3>
                    <p>
                      We publish our research openly, including patent filings
                      for health-monitoring hardware, so that clinicians,
                      universities, and other nonprofits can build on the work
                      rather than license it.
                    </p>
                  </div>
                </div>{" "}
              </div>{" "}
              <div
                className="hp-actions center"
                style={{ marginTop: "40px" }}
                data-fade=""
              >
                {" "}
                <Link className="hp-btn primary" href="/donate">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                  {" Make a Donation"}
                </Link>{" "}
                <Link className="hp-btn ghost" href="/get-involved">
                  {"Volunteer or Contribute "}
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </Link>{" "}
                <Link className="hp-btn ghost" href="/mission">
                  {"Our Mission & Scope "}
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </Link>{" "}
                <Link className="hp-btn ghost" href="/about">
                  About the Foundation
                </Link>{" "}
              </div>{" "}
            </div>{" "}
          </section>{" "}
          <section className="hp-sec" aria-labelledby="hp-stack" data-reveal="">
            {" "}
            <div className="hp-wrap">
              {" "}
              <div className="hp-head center">
                {" "}
                <span
                  className="hp-badge"
                  style={{ "--c": "#22D3EE" } as CSSProperties}
                  data-fade=""
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
                    <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
                    <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
                  </svg>
                  {" Architecture and maturity"}
                </span>{" "}
                <h2 id="hp-stack" data-split="">
                  An Illustrative Reference Architecture
                </h2>{" "}
                <p data-fade="">
                  Seven layers, the same ones you scrolled through, each with
                  what is built and tested and what is still planned.
                  Illustrative reference only. Individual projects and
                  integrations have different maturity levels; planned elements
                  are not yet available products.
                </p>{" "}
              </div>{" "}
              <div className="hp-stack">
                {" "}
                <div className="hp-rail" aria-hidden="true">
                  <span className="hp-dot" />
                </div>{" "}
                <div className="hp-layers">
                  {" "}
                  <div
                    className="hp-layer"
                    style={{ "--c": "#fbbf24" } as CSSProperties}
                  >
                    <h3>eBoot</h3>
                    <p>
                      Two-stage secure boot: Ed25519 + SHA-512 image check, A/B
                      slots and recovery. Host-tested; key storage needs board
                      hooks.
                    </p>
                    <div className="hp-chips">
                      <span className="hp-pill s-work">Working</span>
                      <span className="hp-pill s-docs">Keys: board hooks</span>
                    </div>
                  </div>{" "}
                  <div
                    className="hp-layer"
                    style={{ "--c": "#34d399" } as CSSProperties}
                  >
                    <h3>EoS HAL</h3>
                    <p>
                      One driver API on every target. The dispatch layer, GPIO
                      on Linux and the devicetree parser work; 28 extended
                      classes are stubs.
                    </p>
                    <div className="hp-chips">
                      <span className="hp-pill s-work">Dispatch</span>
                      <span className="hp-pill s-docs">28 stubs</span>
                    </div>
                  </div>{" "}
                  <div
                    className="hp-layer"
                    style={{ "--c": "#34d399" } as CSSProperties}
                  >
                    <h3>EoS kernel</h3>
                    <p>
                      Priority scheduler, priority-inheritance mutexes,
                      semaphores, events, queues and a validated heap. 45 CTest
                      suites on hosts.
                    </p>
                    <div className="hp-chips">
                      <span className="hp-pill s-work">Working</span>
                    </div>
                  </div>{" "}
                  <div
                    className="hp-layer"
                    style={{ "--c": "#34d399" } as CSSProperties}
                  >
                    <h3>EoS services</h3>
                    <p>
                      18 libraries: motor and sensor control, OTA, crypto,
                      networking, files and debug. Flash writes and an MCU
                      network stack are planned.
                    </p>
                    <div className="hp-chips">
                      <span className="hp-pill s-code">In code</span>
                      <span className="hp-pill s-plan">Some planned</span>
                    </div>
                  </div>{" "}
                  <div
                    className="hp-layer"
                    style={{ "--c": "#22d3ee" } as CSSProperties}
                  >
                    <h3>eIPC · eDB</h3>
                    <p>
                      Authenticated messages between services and devices; a
                      multi-model data store with 38 endpoints. Both are working
                      prototypes.
                    </p>
                    <div className="hp-chips">
                      <span className="hp-pill s-work">Prototypes</span>
                    </div>
                  </div>{" "}
                  <div
                    className="hp-layer"
                    style={{ "--c": "#f97316" } as CSSProperties}
                  >
                    <h3>Apps</h3>
                    <p>
                      The eApps catalogue (124 entries), the eBrowser engine and
                      11 eOffice apps; packages install as verified .eapp files.
                      Many apps are templates.
                    </p>
                    <div className="hp-chips">
                      <span className="hp-pill s-code">In code</span>
                      <span className="hp-pill s-docs">Templates</span>
                    </div>
                  </div>{" "}
                  <div
                    className="hp-layer"
                    style={{ "--c": "#a78bfa" } as CSSProperties}
                  >
                    <h3>On-device AI</h3>
                    <p>
                      eosllm runs models with three real back ends; eNI works in
                      simulation; eAI's runtimes are placeholders today.
                    </p>
                    <div className="hp-chips">
                      <span className="hp-pill s-work">eosllm</span>
                      <span className="hp-pill s-docs">eAI runtimes</span>
                    </div>
                  </div>{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
          </section>{" "}
          <section
            className="hp-sec hp-band"
            aria-labelledby="hp-eco"
            data-reveal=""
          >
            {" "}
            <div className="hp-wrap hp-ix-wrap">
              {" "}
              <div className="hp-head hp-ix-head">
                {" "}
                <span className="hp-badge" data-fade="">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z" />
                    <path d="M12 22V12" />
                    <path d="m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7" />
                    <path d="m7.5 4.27 9 5.15" />
                  </svg>
                  {" The ecosystem"}
                </span>{" "}
                <h2 id="hp-eco" data-split="">
                  The Complete Embedded Ecosystem
                </h2>{" "}
                <p data-fade="">
                  Every component you need to build, deploy and manage embedded
                  systems, each described as it stands in its repository today.
                </p>{" "}
                <div className="hp-ix-links" data-fade="">
                  {" "}
                  <Link className="hp-btn ghost" href="/projects">
                    {"All Projects "}
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </Link>{" "}
                  <Link className="hp-btn ghost" href="/eapps">
                    {"All Apps "}
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </Link>{" "}
                </div>{" "}
              </div>{" "}
              <div className="hp-ix">
                {" "}
                <h3 className="hp-ix-k" data-fade="">
                  <span>On the device</span>
                  <span>9 repositories</span>
                </h3>{" "}
                <ul className="hp-ix-list" data-stagger="">
                  {" "}
                  <li style={{ "--c": "#22D3EE" } as CSSProperties}>
                    <b>eBoot</b>
                    <span className="hp-st s-work">Working</span>
                    <p>
                      Signed two-stage boot with A/B slots and recovery; not yet
                      booted on hardware.
                    </p>
                  </li>{" "}
                  <li style={{ "--c": "#F97316" } as CSSProperties}>
                    <b>EoS kernel</b>
                    <span className="hp-st s-work">Working</span>
                    <p>
                      Real-time kernel with priority scheduling, sync and
                      queues; tested on hosts.
                    </p>
                  </li>{" "}
                  <li style={{ "--c": "#A78BFA" } as CSSProperties}>
                    <b>eIPC</b>
                    <span className="hp-st s-code">Prototype</span>
                    <p>
                      Authenticated messages between processes and devices; Go
                      core and a C SDK.
                    </p>
                  </li>{" "}
                  <li style={{ "--c": "#22D3EE" } as CSSProperties}>
                    <b>eDB</b>
                    <span className="hp-st s-code">Prototype</span>
                    <p>
                      Multi-model data store: five models, 38 endpoints, 42
                      passing tests.
                    </p>
                  </li>{" "}
                  <li style={{ "--c": "#60A5FA" } as CSSProperties}>
                    <b>eosllm</b>
                    <span className="hp-st s-work">Working</span>
                    <p>
                      Runs language models on the device with three real back
                      ends; 160 tests.
                    </p>
                  </li>{" "}
                  <li style={{ "--c": "#34D399" } as CSSProperties}>
                    <b>eAI</b>
                    <span className="hp-st s-docs">Framework</span>
                    <p>
                      The on-device AI layer; its model runtimes are
                      placeholders today.
                    </p>
                  </li>{" "}
                  <li style={{ "--c": "#A78BFA" } as CSSProperties}>
                    <b>eBrowser</b>
                    <span className="hp-st s-code">Engine</span>
                    <p>
                      Browser engine for embedded displays; JavaScript and the
                      sandbox are planned.
                    </p>
                  </li>{" "}
                  <li style={{ "--c": "#34D399" } as CSSProperties}>
                    <b>eOffice</b>
                    <span className="hp-st s-code">Prototype</span>
                    <p>11 office apps with 741 tests.</p>
                  </li>{" "}
                  <li style={{ "--c": "#F97316" } as CSSProperties}>
                    <b>eApps</b>
                    <span className="hp-st s-code">Catalogue</span>
                    <p>124 catalogue entries; many apps are templates.</p>
                  </li>{" "}
                </ul>{" "}
                <h3 className="hp-ix-k" data-fade="">
                  <span>To build and test it</span>
                  <span>3 repositories</span>
                </h3>{" "}
                <ul className="hp-ix-list" data-stagger="">
                  {" "}
                  <li style={{ "--c": "#FBBF24" } as CSSProperties}>
                    <b>ebuild</b>
                    <span className="hp-st s-work">Working</span>
                    <p>
                      One CLI to create, build, flash and simulate; knows 171
                      MCUs, 826 tests.
                    </p>
                  </li>{" "}
                  <li style={{ "--c": "#F472B6" } as CSSProperties}>
                    <b>EoStudio</b>
                    <span className="hp-st s-docs">7 of 13</span>
                    <p>
                      Design studio and IDE: 7 of its 13 editors are real; 40
                      code generators.
                    </p>
                  </li>{" "}
                  <li style={{ "--c": "#60A5FA" } as CSSProperties}>
                    <b>EoSim</b>
                    <span className="hp-st s-work">Working</span>
                    <p>Simulator with 153 platforms and 2,117 passing tests.</p>
                  </li>{" "}
                </ul>{" "}
              </div>{" "}
            </div>{" "}
          </section>{" "}
          <section
            className="hp-sec"
            aria-labelledby="hp-health"
            data-reveal=""
          >
            {" "}
            <div className="hp-wrap">
              {" "}
              <div className="hp-head center">
                {" "}
                <span
                  className="hp-badge"
                  style={{ "--c": "#F472B6" } as CSSProperties}
                  data-fade=""
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                  {" Health Technology"}
                </span>{" "}
                <h2 id="hp-health" data-split="">
                  4 Health Devices · 2 Patents Pending
                </h2>{" "}
                <p data-fade="">
                  In-development open hardware designs for health-monitoring
                  research. Physical reliability and clinical validation are
                  pending.
                </p>{" "}
              </div>{" "}
              <div className="hp-grid g4" data-stagger="">
                {" "}
                <div className="hp-cell">
                  <div
                    className="hp-card"
                    style={{ "--c": "#F472B6" } as CSSProperties}
                  >
                    <span className="hp-ic">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" />
                      </svg>
                    </span>
                    <h3>HEALTH-KEY ULTRA</h3>
                    <p>
                      A USB-C research design for exploring ECG, blood-oxygen,
                      breath-alcohol, temperature, UV and motion sensing.
                      Validation is pending.
                    </p>
                  </div>
                </div>{" "}
                <div className="hp-cell">
                  <div
                    className="hp-card"
                    style={{ "--c": "#A78BFA" } as CSSProperties}
                  >
                    <span className="hp-ic">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <circle cx="12" cy="12" r="6" />
                        <polyline points="12 10 12 12 13 13" />
                        <path d="m16.13 7.66-.81-4.05a2 2 0 0 0-2-1.61h-2.68a2 2 0 0 0-2 1.61l-.78 4.05" />
                        <path d="m7.88 16.36.8 4a2 2 0 0 0 2 1.61h2.72a2 2 0 0 0 2-1.61l.81-4.05" />
                      </svg>
                    </span>
                    <h3>HEALTH-BAND Neuro</h3>
                    <p>
                      A wristband research design for sEMG gesture studies,
                      biometric sensing and TENS exploration. No therapeutic
                      benefit is claimed.
                    </p>
                  </div>
                </div>{" "}
                <div className="hp-cell">
                  <div
                    className="hp-card"
                    style={{ "--c": "#22D3EE" } as CSSProperties}
                  >
                    <span className="hp-ic">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4" />
                        <path d="M14 13.12c0 2.38 0 6.38-1 8.88" />
                        <path d="M17.29 21.02c.12-.6.43-2.3.5-3.02" />
                        <path d="M2 12a10 10 0 0 1 18-6" />
                        <path d="M2 16h.01" />
                        <path d="M21.8 16c.2-2 .131-5.354 0-6" />
                        <path d="M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2" />
                        <path d="M8.65 22c.21-.66.45-1.32.57-2" />
                        <path d="M9 6.8a6 6 0 0 1 9 5.2v2" />
                      </svg>
                    </span>
                    <h3>HEALTH-RING</h3>
                    <p>
                      A concept ring for researching optical and electrical
                      sensing. Clinical measurement has not been validated.
                    </p>
                  </div>
                </div>{" "}
                <div className="hp-cell">
                  <div
                    className="hp-card"
                    style={{ "--c": "#34D399" } as CSSProperties}
                  >
                    <span className="hp-ic">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M6 18h8" />
                        <path d="M3 22h18" />
                        <path d="M14 22a7 7 0 1 0 0-14h-1" />
                        <path d="M9 14h2" />
                        <path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z" />
                        <path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3" />
                      </svg>
                    </span>
                    <h3>HEALTH-LAB</h3>
                    <p>
                      A biosensor patch concept for health-monitoring research.
                    </p>
                  </div>
                </div>{" "}
              </div>{" "}
            </div>{" "}
          </section>{" "}
          <section
            className="hp-sec hp-band"
            aria-labelledby="hp-hw"
            data-reveal=""
          >
            {" "}
            <div className="hp-wrap">
              {" "}
              <div className="hp-head" style={{ marginBottom: "0" }}>
                {" "}
                <span
                  className="hp-badge"
                  style={{ "--c": "#38BDF8" } as CSSProperties}
                  data-fade=""
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect width="16" height="16" x="4" y="4" rx="2" />
                    <rect width="6" height="6" x="9" y="9" rx="1" />
                    <path d="M15 2v2" />
                    <path d="M15 20v2" />
                    <path d="M2 15h2" />
                    <path d="M2 9h2" />
                    <path d="M20 15h2" />
                    <path d="M20 9h2" />
                    <path d="M9 2v2" />
                    <path d="M9 20v2" />
                  </svg>
                  {" Open Hardware"}
                </span>{" "}
                <h2 id="hp-hw" data-split="">
                  eCAD Hardware · 18 domains, 292 models
                </h2>{" "}
                <p data-fade="">
                  Open designs from smart rings to a tilt-rotor eVTOL, in 125
                  product lines. Every one is at design stage with a datasheet,
                  and most add a bill of materials and a power simulation. A
                  dev-board CAD database adds 322 reference boards, 186 of them
                  verified.
                </p>{" "}
                <div className="hp-actions" data-fade="">
                  <Link className="hp-btn ghost" href="/ecad-hardware">
                    {"View all eCAD Hardware "}
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </Link>
                </div>{" "}
              </div>{" "}
            </div>{" "}
          </section>{" "}
          <section className="hp-sec" aria-labelledby="hp-why" data-reveal="">
            {" "}
            <div className="hp-wrap">
              {" "}
              <div className="hp-head center">
                {" "}
                <span className="hp-badge" data-fade="">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
                    <path d="M20 3v4" />
                    <path d="M22 5h-4" />
                    <path d="M4 17v2" />
                    <path d="M5 18H3" />
                  </svg>
                  {" Why EmbeddedOS"}
                </span>{" "}
                <h2 id="hp-why" data-split="">
                  The Operating System for Every Device
                </h2>{" "}
                <p data-fade="">
                  Built by embedded engineers, for any embedded hardware. Every
                  design decision prioritizes reliability, security, and
                  developer experience.
                </p>{" "}
              </div>{" "}
              <div className="hp-grid g3" data-stagger="">
                {" "}
                <div className="hp-cell">
                  <div
                    className="hp-card"
                    style={{ "--c": "#F97316" } as CSSProperties}
                  >
                    <span className="hp-ic">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <polyline points="4 17 10 11 4 5" />
                        <line x1="12" x2="20" y1="19" y2="19" />
                      </svg>
                    </span>
                    <h3>Real-Time Scheduling</h3>
                    <p>
                      Priority-driven scheduling with priority inheritance;
                      timing is characterized per target.
                    </p>
                  </div>
                </div>{" "}
                <div className="hp-cell">
                  <div
                    className="hp-card"
                    style={{ "--c": "#22D3EE" } as CSSProperties}
                  >
                    <span className="hp-ic">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <rect
                          width="18"
                          height="11"
                          x="3"
                          y="11"
                          rx="2"
                          ry="2"
                        />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </span>
                    <h3>Signed From the First Instruction</h3>
                    <p>
                      Ed25519-signed boot and authenticated messages; hardware
                      key storage needs board hooks.
                    </p>
                  </div>
                </div>{" "}
                <div className="hp-cell">
                  <div
                    className="hp-card"
                    style={{ "--c": "#34D399" } as CSSProperties}
                  >
                    <span className="hp-ic">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M12 20h.01" />
                        <path d="M2 8.82a15 15 0 0 1 20 0" />
                        <path d="M5 12.859a10 10 0 0 1 14 0" />
                        <path d="M8.5 16.429a5 5 0 0 1 7 0" />
                      </svg>
                    </span>
                    <h3>Connectivity, Honestly</h3>
                    <p>
                      Wi-Fi, BLE, Ethernet and CAN are defined in the HAL;
                      sockets work on hosts and MCU stacks are planned.
                    </p>
                  </div>
                </div>{" "}
                <div className="hp-cell">
                  <div
                    className="hp-card"
                    style={{ "--c": "#A78BFA" } as CSSProperties}
                  >
                    <span className="hp-ic">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <polyline points="16 18 22 12 16 6" />
                        <polyline points="8 6 2 12 8 18" />
                      </svg>
                    </span>
                    <h3>Developer Friendly</h3>
                    <p>
                      ebuild, EoStudio and EoSim, 14 technical books,
                      documentation and free certification.
                    </p>
                  </div>
                </div>{" "}
                <div className="hp-cell">
                  <div
                    className="hp-card"
                    style={{ "--c": "#FBBF24" } as CSSProperties}
                  >
                    <span className="hp-ic">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
                        <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
                        <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
                      </svg>
                    </span>
                    <h3>Modular Architecture</h3>
                    <p>
                      Use only what you need, from the bare kernel to the full
                      application stack.
                    </p>
                  </div>
                </div>{" "}
                <div className="hp-cell">
                  <div
                    className="hp-card"
                    style={{ "--c": "#60A5FA" } as CSSProperties}
                  >
                    <span className="hp-ic">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <rect width="16" height="16" x="4" y="4" rx="2" />
                        <rect width="6" height="6" x="9" y="9" rx="1" />
                        <path d="M15 2v2" />
                        <path d="M15 20v2" />
                        <path d="M2 15h2" />
                        <path d="M2 9h2" />
                        <path d="M20 15h2" />
                        <path d="M20 9h2" />
                        <path d="M9 2v2" />
                        <path d="M9 20v2" />
                      </svg>
                    </span>
                    <h3>Broad Hardware Coverage</h3>
                    <p>
                      {BOARD_COUNT}
                      {
                        " board descriptors across 55 architectures. Maturity varies by target; a descriptor is not a validated port."
                      }
                    </p>
                  </div>
                </div>{" "}
              </div>{" "}
            </div>{" "}
          </section>{" "}
          <section
            className="hp-sec hp-band"
            aria-labelledby="hp-comm"
            data-reveal=""
          >
            {" "}
            <div className="hp-wrap hp-split">
              {" "}
              <div className="hp-head" style={{ marginBottom: "0" }}>
                {" "}
                <span className="hp-badge" data-fade="">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  {" Foundation Community"}
                </span>{" "}
                <h2 id="hp-comm" data-split="">
                  Built by the Community, for the Community
                </h2>{" "}
                <p data-fade="">
                  EmbeddedOS is a 501(c)(3), community-driven project, built by
                  embedded engineers for any embedded hardware. Every line of
                  code, every document, and every tool prioritizes reliability,
                  security, and developer experience.
                </p>{" "}
                <div className="hp-actions" data-fade="">
                  <Link className="hp-btn primary" href="/get-involved">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                    </svg>
                    {" Get Involved"}
                  </Link>
                  <a
                    className="hp-btn ghost"
                    href="https://github.com/embeddedos-org"
                    target="_blank"
                    rel="noopener"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                      <path d="M9 18c-4.51 2-5-2-7-2" />
                    </svg>
                    {" Star on GitHub"}
                  </a>
                </div>{" "}
              </div>{" "}
              <div
                className="hp-grid"
                style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}
                data-stagger=""
              >
                {" "}
                <div className="hp-cell">
                  <div
                    className="hp-card"
                    style={{ "--c": "#34D399" } as CSSProperties}
                  >
                    <span className="hp-ic">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                        <path d="M9 18c-4.51 2-5-2-7-2" />
                      </svg>
                    </span>
                    <h3>25 repositories in public</h3>
                    <p>Developed openly on GitHub, 23 of them MIT licensed.</p>
                  </div>
                </div>{" "}
                <div className="hp-cell">
                  <div
                    className="hp-card"
                    style={{ "--c": "#F97316" } as CSSProperties}
                  >
                    <span className="hp-ic">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M12 7v14" />
                        <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
                      </svg>
                    </span>
                    <h3>14 books to learn from</h3>
                    <p>Full-length technical books, free for everyone.</p>
                  </div>
                </div>{" "}
                <div className="hp-cell">
                  <div
                    className="hp-card"
                    style={{ "--c": "#22D3EE" } as CSSProperties}
                  >
                    <span className="hp-ic">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
                      </svg>
                    </span>
                    <h3>10 fuzz harnesses</h3>
                    <p>Plus CodeQL and Scorecard across the organisation.</p>
                  </div>
                </div>{" "}
                <div className="hp-cell">
                  <div
                    className="hp-card"
                    style={{ "--c": "#A78BFA" } as CSSProperties}
                  >
                    <span className="hp-ic">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
                        <path d="M20 3v4" />
                        <path d="M22 5h-4" />
                        <path d="M4 17v2" />
                        <path d="M5 18H3" />
                      </svg>
                    </span>
                    <h3>Every claim checked</h3>
                    <p>
                      This page says what works, what is partial and what is
                      planned.
                    </p>
                  </div>
                </div>{" "}
              </div>{" "}
            </div>{" "}
          </section>{" "}
          <section
            className="hp-sec hp-cta"
            aria-labelledby="hp-cta"
            data-reveal=""
          >
            {" "}
            <span
              className="hp-orb"
              style={
                { left: "6%", top: "8%", "--o": "#f97316" } as CSSProperties
              }
              aria-hidden="true"
            />{" "}
            <span
              className="hp-orb"
              style={
                { right: "8%", top: "28%", "--o": "#22d3ee" } as CSSProperties
              }
              aria-hidden="true"
            />{" "}
            <span
              className="hp-orb"
              style={
                {
                  left: "42%",
                  bottom: "-90px",
                  "--o": "#a78bfa",
                } as CSSProperties
              }
              aria-hidden="true"
            />{" "}
            <div className="hp-wrap">
              {" "}
              <div className="hp-cta-card">
                {" "}
                <span className="hp-badge" data-fade="">
                  Open Source · 501(c)(3) · MIT License
                </span>{" "}
                <h2 id="hp-cta" data-split="">
                  Ready to build on EmbeddedOS?
                </h2>{" "}
                <p
                  className="hp-muted"
                  style={{ margin: "0 auto" }}
                  data-fade=""
                >
                  Join engineers building the next generation of embedded
                  systems. Free, foundation-backed, and 501(c)(3) forever.
                </p>{" "}
                <div
                  className="hp-actions center"
                  style={{ marginTop: "28px" }}
                  data-fade=""
                >
                  <Link className="hp-btn primary" href="/getting-started">
                    {"Start Building "}
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </Link>
                  <Link className="hp-btn ghost" href="/docs">
                    Read the Docs
                  </Link>
                </div>{" "}
              </div>{" "}
            </div>{" "}
          </section>{" "}
        </div>
      </div>
    </div>
  );
}
