import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Search, Cpu, Brain, Terminal, Shield, Database, Globe, Code2, Layers, Zap, Package, Smartphone, Settings, ChevronRight, ArrowRight } from "lucide-react";

const allProducts = [
  {
    slug: "eos",
    name: "EoS",
    fullName: "EoS — Embedded Operating System",
    tagline: "Real-time kernel for ARM Cortex-M and RISC-V targets",
    desc: "EoS is the foundation embedded operating system at the heart of the EmbeddedOS stack — a tightly-engineered real-time kernel with deterministic scheduling, A/B OTA updates, and a signed bootloader. Supports ARM Cortex-M and RISC-V architectures.",
    icon: Cpu,
    category: "Core OS",
    status: "Live",
    features: ["Deterministic RTOS scheduling", "A/B-slotted OTA updates", "Signed bootloader chain", "ARM Cortex-M & RISC-V"],
  },
  {
    slug: "eai",
    name: "EAI",
    fullName: "EAI — Embedded AI Runtime",
    tagline: "On-device AI inference with 12 model variants and ReAct agents",
    desc: "EAI is the EoS embedded AI runtime — twelve curated LLM and small-model variants, ReAct agent orchestration, and on-device inference without cloud dependency. Runs on constrained hardware with quantized models.",
    icon: Brain,
    category: "AI",
    status: "Live",
    features: ["12 curated model variants", "ReAct agent orchestration", "On-device inference", "Quantized model support"],
  },
  {
    slug: "ebuild",
    name: "eBuild",
    fullName: "eBuild — Build System & SDK Generator",
    tagline: "18-command CLI for cross-compilation, signing, and deployment",
    desc: "eBuild is the EoS build system and SDK generator — an 18-command CLI that drives configuration, cross-compilation, signing, and OTA packaging. Supports STM32, ESP32, RISC-V, and Linux host targets.",
    icon: Terminal,
    category: "Tooling",
    status: "Live",
    features: ["18-command CLI", "Cross-compilation", "OTA package signing", "Multi-architecture support"],
  },
  {
    slug: "eipc",
    name: "EIPC",
    fullName: "EIPC — Secure Inter-Process Communication",
    tagline: "Capability-based message bus with HMAC-SHA256 authentication",
    desc: "EIPC is the secure communication fabric that connects every EoS component — a capability-based message bus with HMAC-SHA256 message authentication and fine-grained capability tokens across every component boundary.",
    icon: Shield,
    category: "Core OS",
    status: "Live",
    features: ["Capability-based security", "HMAC-SHA256 auth", "Zero-copy messaging", "Cross-component isolation"],
  },
  {
    slug: "edb",
    name: "eDB",
    fullName: "eDB — Embedded Database",
    tagline: "Single engine supporting SQL, document, and key-value with REST API",
    desc: "eDB is the EoS embedded database — a single, embeddable engine that speaks SQL, document, and key-value, exposes a REST API, and runs on devices with as little as 64KB of RAM.",
    icon: Database,
    category: "Data",
    status: "Live",
    features: ["SQL + document + key-value", "REST API interface", "64KB RAM minimum", "ACID transactions"],
  },
  {
    slug: "ebowser",
    name: "eBowser",
    fullName: "eBowser — Embedded HTML5/CSS Engine",
    tagline: "Hardware-accelerated HTML5/CSS/JS renderer for embedded displays",
    desc: "eBowser is the embedded browser engine for EoS — a compact, hardware-accelerated HTML5/CSS/JS renderer designed for embedded displays and touch interfaces. Supports WebGL and CSS animations.",
    icon: Globe,
    category: "UI",
    status: "Beta",
    features: ["HTML5 / CSS / JS", "Hardware acceleration", "WebGL support", "Touch interface ready"],
  },
  {
    slug: "eostudio",
    name: "EoStudio",
    fullName: "EoStudio — Embedded IDE",
    tagline: "Full IDE with 12 domain editors, 30+ code generators, and debugger",
    desc: "EoStudio is the integrated development environment for EoS — twelve domain-specific editors, thirty-plus code generators, a hardware-in-the-loop debugger, and a visual RTOS task inspector.",
    icon: Code2,
    category: "Tooling",
    status: "Live",
    features: ["12 domain editors", "30+ code generators", "HIL debugger", "RTOS task inspector"],
  },
  {
    slug: "eoffice",
    name: "eOffice",
    fullName: "eOffice — Embedded Office Suite",
    tagline: "11-app productivity suite including eDocs, eSheets, eSlides, and eDrive",
    desc: "eOffice is the EoS office productivity suite: eleven apps including eDocs, eSheets, eSlides, eMail, and eDrive, all built for embedded and edge devices with offline-first architecture.",
    icon: Layers,
    category: "Apps",
    status: "Beta",
    features: ["11 productivity apps", "Offline-first", "eDocs, eSheets, eSlides", "eMail & eDrive"],
  },
  {
    slug: "eni",
    name: "ENI",
    fullName: "ENI — Embedded Neural Interface",
    tagline: "Low-latency BCI stack for 1024-channel neural signal acquisition",
    desc: "ENI is the EoS embedded neural interface — a low-latency, capability-secured stack that handles Neuralink-class 1024-channel neural signal acquisition, real-time spike sorting, and closed-loop stimulation.",
    icon: Zap,
    category: "AI",
    status: "Beta",
    features: ["1024-channel acquisition", "Real-time spike sorting", "Closed-loop stimulation", "Capability-secured"],
  },
  {
    slug: "eapps",
    name: "eApps",
    fullName: "eApps — 60+ First-Party Applications",
    tagline: "Production-ready app catalog spanning media, productivity, and communication",
    desc: "eApps is the EoS first-party application catalog — over 60 production-ready apps spanning media, productivity, communication, and system utilities, all optimized for embedded hardware.",
    icon: Smartphone,
    category: "Apps",
    status: "Live",
    features: ["60+ production apps", "Media & productivity", "System utilities", "Embedded-optimized"],
  },
  {
    slug: "eboot",
    name: "eBootloader",
    fullName: "eBootloader — Multi-Architecture Bootloader",
    tagline: "Portable, signed, A/B-slotted bootloader for 24+ reference boards",
    desc: "eBootloader is the boot stage of the EoS stack — a portable, signed, A/B-slotted bootloader that already supports 24 reference boards including STM32, ESP32, and RISC-V targets.",
    icon: Settings,
    category: "Core OS",
    status: "Live",
    features: ["24+ reference boards", "A/B slot support", "Signed boot chain", "Portable architecture"],
  },
  {
    slug: "eosim",
    name: "EoSim",
    fullName: "EoSim — Embedded Systems Simulator",
    tagline: "Unified QEMU/Renode harness with hardware-in-the-loop bridge",
    desc: "EoSim is the EoS simulator — a unified harness over QEMU, Renode, and a hardware-in-the-loop bridge that lets you boot, debug, and test EoS images without physical hardware.",
    icon: Package,
    category: "Tooling",
    status: "Live",
    features: ["QEMU & Renode support", "HIL bridge", "No hardware required", "Full stack simulation"],
  },
  {
    slug: "eos-platform",
    name: "eos-platform",
    fullName: "eos-platform — Form-Factor Profiles",
    tagline: "Ready-to-flash configurations for 5 common device classes",
    desc: "eos-platform packages the EoS RTOS into ready-to-flash configurations for five common device classes — wearable, industrial, automotive, medical, and consumer IoT.",
    icon: Cpu,
    category: "Core OS",
    status: "Live",
    features: ["5 device profiles", "Wearable & industrial", "Automotive & medical", "Consumer IoT"],
  },
  {
    slug: "eserviceapps",
    name: "eServiceApps",
    fullName: "eServiceApps — Embedded Service Apps",
    tagline: "eSocial, eRide, eTravel, eTrack, and eWallet in Dart/Flutter",
    desc: "eServiceApps is the EoS consumer-services suite — eSocial, eRide, eTravel, eTrack, and eWallet — built in Dart/Flutter for embedded and mobile targets.",
    icon: Smartphone,
    category: "Apps",
    status: "Beta",
    features: ["eSocial & eRide", "eTravel & eTrack", "eWallet payments", "Dart/Flutter stack"],
  },
];

const categories = ["All", "Core OS", "AI", "Tooling", "Data", "UI", "Apps"];

export default function Products() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = allProducts.filter((p) => {
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.tagline.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-black pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14"
        >
          <p className="text-[#C9A84C] text-sm font-semibold uppercase tracking-widest mb-3">Product Catalog</p>
          <h1 className="font-['Playfair_Display'] font-black text-5xl sm:text-6xl text-white mb-4">
            The <span className="text-gold-gradient">EmbeddedOS</span> Stack
          </h1>
          <p className="text-[#666] text-lg max-w-2xl mx-auto">
            14 production-grade components — from real-time kernel to AI runtime, browser engine to office suite.
          </p>
        </motion.div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#444]" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-dark w-full pl-10 pr-4 py-3 rounded-xl text-sm"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-[#C9A84C] text-black"
                    : "bg-[rgba(255,255,255,0.04)] text-[#666] border border-[rgba(255,255,255,0.08)] hover:text-white hover:border-[rgba(201,168,76,0.3)]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((product, i) => (
            <motion.div
              key={product.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
            >
              <Link href={`/products/${product.slug}`}>
                <div className="glass-card rounded-2xl p-6 cursor-pointer group h-full flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(201,168,76,0.1)]">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[rgba(201,168,76,0.08)] border border-[rgba(201,168,76,0.2)] flex items-center justify-center group-hover:bg-[rgba(201,168,76,0.15)] transition-colors">
                      <product.icon size={22} className="text-[#C9A84C]" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`badge ${product.status === "Live" ? "bg-[rgba(201,168,76,0.1)] text-[#C9A84C] border border-[rgba(201,168,76,0.25)]" : "bg-[rgba(255,255,255,0.04)] text-[#555] border border-[rgba(255,255,255,0.08)]"}`}>
                        {product.status}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-['Playfair_Display'] font-semibold text-xl text-white mb-1 group-hover:text-[#E8C97A] transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-[#C9A84C] text-xs font-medium uppercase tracking-wider mb-3">{product.category}</p>
                  <p className="text-[#555] text-sm leading-relaxed mb-5 flex-1">{product.tagline}</p>

                  <div className="space-y-1.5 mb-5">
                    {product.features.slice(0, 3).map((f) => (
                      <div key={f} className="flex items-center gap-2 text-xs text-[#444]">
                        <span className="w-1 h-1 rounded-full bg-[#C9A84C44]" />
                        {f}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-1 text-[#C9A84C] text-sm font-medium group-hover:gap-2 transition-all">
                    Learn more
                    <ChevronRight size={16} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-[#444]">
            <Package size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg">No products match your search.</p>
          </div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 glass-card rounded-3xl p-10 text-center"
        >
          <h2 className="font-['Playfair_Display'] font-bold text-3xl text-white mb-4">
            Ready to Build?
          </h2>
          <p className="text-[#666] mb-8 max-w-lg mx-auto">
            Start with the eBuild CLI and have your first EoS project running in under 60 seconds.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/getting-started" className="btn-gold px-8 py-4 rounded-xl font-semibold flex items-center gap-2">
              Get Started
              <ArrowRight size={18} />
            </Link>
            <a
              href="https://github.com/embeddedos-org"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline-gold px-8 py-4 rounded-xl font-semibold"
            >
              View on GitHub
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
