import { useState } from "react";
import { motion } from "framer-motion";
import { Globe, ArrowRight } from "lucide-react";
import { Link } from "wouter";

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
    <div className="min-h-screen bg-[#0A0E1A] text-white">
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-green-500/5" />
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-sm font-medium mb-6">
              <Globe className="w-4 h-4" /> EBROWSER
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-orange-200 to-orange-400 bg-clip-text text-transparent">
              eBrowser
            </h1>
            <p className="text-2xl text-gray-300 mb-2">
              Embedded Web Browser Engine
            </p>
            <p className="text-gray-400 max-w-2xl mx-auto">
              A full HTML5/CSS3/JS browser engine built for embedded systems.
              Scales from 256KB Cortex-M4 to 8GB RK3588S. Configurable feature
              set, hardware-accelerated compositing, and TLS 1.3.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            Engine Components
          </h2>
          <div className="flex gap-2 mb-6 justify-center flex-wrap">
            {engines.map(e => (
              <button
                key={e.id}
                onClick={() => setActiveEngine(e.id)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={
                  activeEngine === e.id
                    ? {
                        background: e.color + "20",
                        color: e.color,
                        border: "1px solid " + e.color + "40",
                      }
                    : {
                        background: "rgba(255,255,255,0.05)",
                        color: "#9CA3AF",
                        border: "1px solid rgba(255,255,255,0.1)",
                      }
                }
              >
                {e.name}
              </button>
            ))}
          </div>
          <motion.div
            key={activeEngine}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 border border-white/10 rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div>
              <p className="text-gray-400 mb-4">{engine.desc}</p>
            </div>
            <div>
              <div className="text-gray-500 text-xs mb-2 uppercase tracking-wider">
                Key APIs
              </div>
              <div className="space-y-1">
                {engine.apis.map(api => (
                  <div
                    key={api}
                    className="font-mono text-sm px-3 py-1.5 bg-black/30 rounded-lg"
                    style={{ color: engine.color }}
                  >
                    {api}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            Platform Support
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-gray-500">
                  <th className="text-left py-2 pr-4">Platform</th>
                  <th className="text-left py-2 pr-4">RAM</th>
                  <th className="text-left py-2">Feature Set</th>
                </tr>
              </thead>
              <tbody>
                {platforms.map((p, i) => (
                  <tr
                    key={p.name}
                    className={i % 2 === 0 ? "bg-white/[0.02]" : ""}
                  >
                    <td
                      className="py-3 pr-4 font-semibold"
                      style={{ color: p.color }}
                    >
                      {p.name}
                    </td>
                    <td className="py-3 pr-4 text-gray-400 font-mono text-xs">
                      {p.ram}
                    </td>
                    <td className="py-3 text-gray-300 text-xs">{p.features}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/api-docs"
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors"
            >
              API Reference <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/eos"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold border border-white/20 transition-colors"
            >
              EoS Kernel
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
