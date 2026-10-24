import { useState, type CSSProperties } from "react";
import { Link } from "wouter";
import { BpPage, PageHero, Section } from "@/components/bp";
import "./EBrowser.css";

const engines = [
  {
    id: "html",
    name: "HTML Parser",
    color: "#F97316",
    desc: "Full HTML5 parser with DOM construction. Supports HTML5 semantic elements, custom elements, and shadow DOM. Streaming parser for low-memory devices.",
    apis: [
      "eBrowser_parse_html()",
      "eBrowser_dom_query()",
      "eBrowser_dom_mutate()",
      "eBrowser_shadow_attach()",
    ],
  },
  {
    id: "css",
    name: "CSS Engine",
    color: "#22D3EE",
    desc: "CSS3 layout engine with Flexbox and Grid support. Configurable feature set — disable Grid on devices with <64KB RAM. Hardware-accelerated compositing.",
    apis: [
      "eBrowser_css_apply()",
      "eBrowser_layout_compute()",
      "eBrowser_style_query()",
      "eBrowser_animation_tick()",
    ],
  },
  {
    id: "js",
    name: "JS Runtime",
    color: "#A855F7",
    desc: "QuickJS-based JavaScript engine. ES2023 support, 128KB RAM minimum. Optional V8 backend for devices with >512MB RAM.",
    apis: [
      "eBrowser_js_eval()",
      "eBrowser_js_call()",
      "eBrowser_js_module()",
      "eBrowser_js_gc()",
    ],
  },
  {
    id: "net",
    name: "Network Stack",
    color: "#34D399",
    desc: "HTTP/1.1 and HTTP/2 with TLS 1.3. WebSocket support. Content caching with configurable storage backend (RAM, flash, SD card).",
    apis: [
      "eBrowser_fetch()",
      "eBrowser_ws_connect()",
      "eBrowser_cache_set()",
      "eBrowser_tls_config()",
    ],
  },
];

const platforms = [
  {
    name: "Raspberry Pi 4",
    ram: "4 GB",
    features: "Full HTML5 + CSS3 + JS + WebGL",
    color: "#34D399",
  },
  {
    name: "RK3588S",
    ram: "8 GB",
    features: "Full HTML5 + CSS3 + JS + WebGL + WebGPU",
    color: "#22D3EE",
  },
  {
    name: "ESP32-S3",
    ram: "8 MB PSRAM",
    features: "HTML5 + CSS3 + JS (no WebGL)",
    color: "#F97316",
  },
  {
    name: "STM32H7",
    ram: "1 MB RAM",
    features: "HTML5 + CSS2 (no JS)",
    color: "#A855F7",
  },
  {
    name: "Cortex-M4",
    ram: "256 KB RAM",
    features: "HTML5 subset + CSS1 (no JS)",
    color: "#FBBF24",
  },
];

export default function EBrowserPage() {
  const [activeEngine, setActiveEngine] = useState("html");
  const engine = engines.find(e => e.id === activeEngine)!;

  return (
    <BpPage className="ebrowser">
      <PageHero
        sig
        label="EBROWSER"
        title="eBrowser"
        sub="Embedded Web Browser Engine"
        lead="A full HTML5/CSS3/JS browser engine built for embedded systems. Scales from 256KB Cortex-M4 to 8GB RK3588S. Configurable feature set, hardware-accelerated compositing, and TLS 1.3."
      />

      <Section title="Engine Components">
        <div className="ctas eb-tabs">
          {engines.map(e => (
            <button
              key={e.id}
              type="button"
              onClick={() => setActiveEngine(e.id)}
              aria-pressed={activeEngine === e.id}
              className="btn gh"
            >
              {e.name}
            </button>
          ))}
        </div>
        <div
          className="eb-panel"
          style={{ "--c": engine.color } as CSSProperties}
        >
          <div>
            <p className="eb-desc">{engine.desc}</p>
          </div>
          <div>
            <div className="label">Key APIs</div>
            <ul className="eb-apis">
              {engine.apis.map(api => (
                <li key={api}>{api}</li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section title="Platform Support">
        <div className="tbl eb-plat">
          <table>
            <thead>
              <tr>
                <th scope="col">Platform</th>
                <th scope="col">RAM</th>
                <th scope="col">Feature Set</th>
              </tr>
            </thead>
            <tbody>
              {platforms.map(p => (
                <tr key={p.name}>
                  <td>
                    <span
                      className="st"
                      style={{ "--c": p.color } as CSSProperties}
                    >
                      {p.name}
                    </span>
                  </td>
                  <td className="eb-mono">{p.ram}</td>
                  <td>{p.features}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section tight>
        <div className="ctas">
          <Link href="/api-docs" className="btn pri">
            API Reference{" "}
            <span className="ar" aria-hidden="true">
              →
            </span>
          </Link>
          <Link href="/eos" className="btn gh">
            EoS Kernel
          </Link>
        </div>
      </Section>
    </BpPage>
  );
}
