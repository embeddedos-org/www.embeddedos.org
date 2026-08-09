import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import {
  Cpu,
  Zap,
  MessageSquare,
  Shield,
  Network,
  BookOpen,
  Code,
  Layers,
  Users,
  Github,
  Search,
  ChevronDown,
  Menu,
  X,
  Star,
  Package,
  Wrench,
  Heart,
  Gamepad2,
  Database,
  Globe,
  FileText,
  FlaskConical,
  ArrowRight,
  Plane,
  Activity,
  Microscope,
  Watch,
  Fingerprint,
  Terminal,
  Braces,
  Blocks,
  Bot,
  Rocket,
  LayoutGrid,
  Wifi,
  Brain,
  Cpu as CpuIcon,
  Atom,
  Briefcase,
  GraduationCap,
  Target,
  Scale,
  Factory,
} from "lucide-react";
import { BOARD_COUNT, SIM_PLATFORM_COUNT } from "../data/stack";

const LOGO_MARK = "/manus-storage/embeddedos-logo-mark_bc053888.jpg";

// ─── NAVIGATION DATA (from real GitHub repos) ──────────────────────────────

const NAV_ITEMS = {
  Projects: {
    description: "Open-source projects powering the EmbeddedOS ecosystem",
    sections: [
      {
        title: "Core OS",
        items: [
          {
            name: "EoS Kernel",
            desc: "Real-time embedded OS",
            icon: Cpu,
            href: "https://github.com/embeddedos-org/eos",
            color: "#F97316",
            external: true,
          },
          {
            name: "eBoot",
            desc: "Secure bootloader & OTA",
            icon: Zap,
            href: "https://github.com/embeddedos-org/eBoot",
            color: "#22D3EE",
            external: true,
          },
          {
            name: "eIPC",
            desc: "Ultra-low latency IPC",
            icon: MessageSquare,
            href: "https://github.com/embeddedos-org/eIPC",
            color: "#A78BFA",
            external: true,
          },
          {
            name: "ebuild",
            desc: "Next-gen build tool",
            icon: Wrench,
            href: "/ebuild",
            color: "#34D399",
            external: false,
          },
          {
            name: "eosllm",
            desc: "On-device LLM inference",
            icon: Bot,
            href: "https://github.com/embeddedos-org/eosllm",
            color: "#F59E0B",
            external: true,
          },
          // eos-programming-language is a private repo — link the org profile until it is published.
          {
            name: "EoS Language",
            desc: "Fastest embedded APIs",
            icon: Braces,
            href: "https://github.com/embeddedos-org",
            color: "#60A5FA",
            external: true,
          },
        ],
      },
      {
        title: "AI & Neural",
        items: [
          {
            name: "eAI",
            desc: "AI layer & eBot agent",
            icon: FlaskConical,
            href: "https://github.com/embeddedos-org/eAI",
            color: "#34D399",
            external: true,
          },
          {
            name: "eNI",
            desc: "Neural interface adapter",
            icon: Wifi,
            href: "https://github.com/embeddedos-org/eNI",
            color: "#A78BFA",
            external: true,
          },
        ],
      },
      {
        title: "Dev Tools",
        items: [
          {
            name: "EoSim",
            desc: "63+ board simulator",
            icon: Terminal,
            href: "https://github.com/embeddedos-org/EoSim",
            color: "#F97316",
            external: true,
          },
          {
            name: "EoStudio",
            desc: "Universal IDE v3.1",
            icon: LayoutGrid,
            href: "https://github.com/embeddedos-org/EoStudio",
            color: "#22D3EE",
            external: true,
          },
          {
            name: "eos-stack-manifest",
            desc: "Unified build manifest",
            icon: Blocks,
            href: "https://github.com/embeddedos-org/eos-stack-manifest",
            color: "#F59E0B",
            external: true,
          },
        ],
      },
      {
        title: "Quantum Computing",
        items: [
          {
            name: "eQC Module",
            desc: "EoS quantum kernel support",
            icon: Atom,
            href: "/quantum",
            color: "#A855F7",
            external: false,
          },
        ],
      },
      {
        title: "Aerospace",
        items: [
          // eos-aero is a private repo — point at the on-site Aerospace page instead of a 404.
          {
            name: "AeroSwift Personal",
            desc: "1-2 seat VTOL aircraft",
            icon: Plane,
            href: "/aerospace",
            color: "#60A5FA",
            external: false,
          },
          {
            name: "AeroSwift Transit",
            desc: "10-seat urban air taxi",
            icon: Rocket,
            href: "/aerospace",
            color: "#F472B6",
            external: false,
          },
        ],
      },
    ],
  },
  Products: {
    description: "End-user products and applications built on EmbeddedOS",
    sections: [
      {
        title: "Core Platform",
        items: [
          {
            name: "All Products",
            desc: "What We Build — full ecosystem",
            icon: Layers,
            href: "/products",
            color: "#F97316",
            external: false,
          },
          {
            name: "EoS Kernel",
            desc: `RTOS kernel for ${BOARD_COUNT} boards`,
            icon: CpuIcon,
            href: "/product-eos",
            color: "#22D3EE",
            external: false,
          },
          {
            name: "eos-platform",
            desc: "Desktop, Laptop, Tablet, TV, Kiosk",
            icon: Layers,
            href: "/product-eos-platform",
            color: "#6366F1",
            external: false,
          },
          {
            name: "eBootloader",
            desc: "Secure bootloader + OTA updates",
            icon: Zap,
            href: "/product-eboot",
            color: "#F97316",
            external: false,
          },
        ],
      },
      {
        title: "AI & Connectivity",
        items: [
          {
            name: "EAI",
            desc: "On-device LLM inference & agents",
            icon: Brain,
            href: "/product-eai",
            color: "#A855F7",
            external: false,
          },
          {
            name: "ENI",
            desc: "1,024-channel neural interface",
            icon: Activity,
            href: "/product-eni",
            color: "#10B981",
            external: false,
          },
          {
            name: "EIPC",
            desc: "Capability-secured IPC fabric",
            icon: Network,
            href: "/product-eipc",
            color: "#F59E0B",
            external: false,
          },
          {
            name: "eDB",
            desc: "SQL + Document + KV database",
            icon: Database,
            href: "/product-edb",
            color: "#3B82F6",
            external: false,
          },
        ],
      },
      {
        title: "Applications",
        items: [
          {
            name: "eApps",
            desc: "60+ first-party embedded apps",
            icon: Package,
            href: "/product-eapps",
            color: "#F97316",
            external: false,
          },
          {
            name: "eOffice Suite",
            desc: "11-app embedded office suite",
            icon: FileText,
            href: "/product-eoffice",
            color: "#059669",
            external: false,
          },
          {
            name: "eServiceApps",
            desc: "eSocial, eRide, eTravel, eWallet",
            icon: Globe,
            href: "/product-eserviceapps",
            color: "#EC4899",
            external: false,
          },
        ],
      },
      {
        title: "Toolchain",
        items: [
          {
            name: "eBuild",
            desc: "Build system & SDK generator",
            icon: Wrench,
            href: "/product-ebuild",
            color: "#EF4444",
            external: false,
          },
          {
            name: "EoSim",
            desc: `${SIM_PLATFORM_COUNT} virtual platforms simulator`,
            icon: Zap,
            href: "/product-eosim",
            color: "#06B6D4",
            external: false,
          },
          {
            name: "EoStudio",
            desc: "Embedded IDE with board picker",
            icon: Code,
            href: "/product-eostudio",
            color: "#8B5CF6",
            external: false,
          },
        ],
      },
      {
        title: "Health Devices",
        items: [
          {
            name: "HEALTH-KEY ULTRA",
            desc: "USB-C ECG + SpO₂ key",
            icon: Activity,
            href: "/health",
            color: "#F85149",
            external: false,
          },
          {
            name: "HEALTH-BAND Neuro",
            desc: "sEMG + TENS wristband",
            icon: Watch,
            href: "/health",
            color: "#F59E0B",
            external: false,
          },
          {
            name: "HEALTH-RING",
            desc: "Titanium smart ring",
            icon: Fingerprint,
            href: "/health",
            color: "#A78BFA",
            external: false,
          },
          {
            name: "HEALTH-LAB",
            desc: "14-day biosensor patch",
            icon: Microscope,
            href: "/health",
            color: "#34D399",
            external: false,
          },
        ],
      },
    ],
  },
  Docs: {
    description: "Everything you need to build with EmbeddedOS",
    sections: [
      {
        title: "Learn",
        items: [
          {
            name: "Getting Started",
            desc: "Up in 10 minutes",
            icon: BookOpen,
            href: "/getting-started",
            color: "#F97316",
            external: false,
          },
          {
            name: "API Reference",
            desc: "300+ APIs documented",
            icon: Code,
            href: "/api-docs",
            color: "#22D3EE",
            external: false,
          },
          {
            name: "Architecture",
            desc: "3D block diagrams & system design",
            icon: Layers,
            href: "/architecture",
            color: "#A78BFA",
            external: false,
          },
          {
            name: "Books",
            desc: "14 technical books",
            icon: FileText,
            href: "/books",
            color: "#34D399",
            external: false,
          },
        ],
      },
      {
        title: "Build",
        items: [
          {
            name: "Hardware Lab",
            desc: "Board bring-up guides",
            icon: Wrench,
            href: "/hardware-lab",
            color: "#F59E0B",
            external: false,
          },
          {
            name: "Stacks",
            desc: "Technology stacks",
            icon: Layers,
            href: "/stacks",
            color: "#60A5FA",
            external: false,
          },
          {
            name: "eFlow",
            desc: "Visual block programming",
            icon: Zap,
            href: "/eflow",
            color: "#F472B6",
            external: false,
          },
          {
            name: "eBuild",
            desc: "Build, sim & flash tool",
            icon: Wrench,
            href: "/ebuild",
            color: "#34D399",
            external: false,
          },
          {
            name: "Kids Edition",
            desc: "Educational platform",
            icon: Gamepad2,
            href: "/kids",
            color: "#F97316",
            external: false,
          },
        ],
      },
    ],
  },
  Community: {
    description: "Join the open-source movement",
    sections: [
      {
        title: "Participate",
        items: [
          {
            name: "Careers",
            desc: "Open positions & apply now",
            icon: Briefcase,
            href: "/careers",
            color: "#F97316",
            external: false,
          },
          {
            name: "Internships",
            desc: "F-1 CPT/OPT, research & open source",
            icon: GraduationCap,
            href: "/internship",
            color: "#A78BFA",
            external: false,
          },
          {
            name: "Get Involved",
            desc: "Contribute to EmbeddedOS",
            icon: Heart,
            href: "/get-involved",
            color: "#34D399",
            external: false,
          },
          {
            name: "Membership",
            desc: "Join the Foundation",
            icon: Star,
            href: "/membership",
            color: "#F59E0B",
            external: false,
          },
          {
            name: "GitHub Org",
            desc: "22 open-source repos",
            icon: Github,
            href: "https://github.com/embeddedos-org",
            color: "#22D3EE",
            external: true,
          },
          {
            name: "Discussions",
            desc: "Community forum",
            icon: MessageSquare,
            href: "https://github.com/orgs/embeddedos-org/discussions",
            color: "#A78BFA",
            external: true,
          },
          {
            name: "About",
            desc: "Foundation & mission",
            icon: Users,
            href: "/about",
            color: "#34D399",
            external: false,
          },
          {
            name: "Mission & Scope",
            desc: "Charitable purpose & programmes",
            icon: Target,
            href: "/mission",
            color: "#F97316",
            external: false,
          },
          {
            name: "Industries",
            desc: "38 sectors, standards & maturity",
            icon: Factory,
            href: "/industries",
            color: "#FBBF24",
            external: false,
          },
          {
            name: "Transparency",
            desc: "Registration, finances & policies",
            icon: Scale,
            href: "/transparency",
            color: "#22D3EE",
            external: false,
          },
          {
            name: "What We Do",
            desc: "Company overview & stack",
            icon: Layers,
            href: "/what-we-do",
            color: "#22D3EE",
            external: false,
          },
          {
            name: "eCAD Hardware",
            desc: "Hardware design catalog",
            icon: CpuIcon,
            href: "/ecad-hardware",
            color: "#F97316",
            external: false,
          },
          {
            name: "Patents",
            desc: "IP & provisional patents",
            icon: Shield,
            href: "/patents",
            color: "#A78BFA",
            external: false,
          },
          {
            name: "News",
            desc: "Latest updates",
            icon: FileText,
            href: "/news",
            color: "#60A5FA",
            external: false,
          },
        ],
      },
    ],
  },
};

type NavKey = keyof typeof NAV_ITEMS;

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  // Radix NavigationMenu has to be controlled here. Left uncontrolled it closes
  // on outside-click, blur or Escape — and a wouter <Link> is none of those, so
  // clicking an item navigated the page while leaving the dropdown open on top
  // of it, covering the new route and swallowing every click that landed on the
  // panel. Holding the open item in state lets the route effect below clear it.
  const [openMenu, setOpenMenu] = useState("");
  const [location] = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMobileExpanded(null);
    setOpenMenu("");
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const toggleMobile = useCallback(() => setMobileOpen(o => !o), []);

  return (
    <>
      <a href="#main-content" className="skip-to-content">
        Skip to content
      </a>

      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[oklch(12%_0.04_248/0.88)] backdrop-blur-[28px] shadow-[0_1px_0_oklch(100%_0_0/0.07),0_4px_32px_oklch(0%_0_0/0.5)]"
            : "bg-transparent"
        }`}
        role="banner"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 shrink-0 group"
              aria-label="EmbeddedOS Home"
            >
              <img
                loading="eager"
                fetchPriority="high"
                src={LOGO_MARK}
                alt="EmbeddedOS"
                className="w-8 h-8 rounded-lg object-cover transition-transform duration-200 group-hover:scale-105"
              />
              <div className="flex flex-col leading-none">
                <span className="font-heading font-bold text-white text-sm tracking-tight">
                  EmbeddedOS
                </span>
                <span className="text-[10px] text-[#F97316] font-semibold tracking-widest uppercase">
                  Foundation · 501(c)(3)
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <NavigationMenu.Root
              className="hidden lg:flex items-center"
              delayDuration={100}
              value={openMenu}
              onValueChange={setOpenMenu}
            >
              <NavigationMenu.List className="flex items-center gap-1">
                {(Object.keys(NAV_ITEMS) as NavKey[]).map(label => {
                  const section = NAV_ITEMS[label];
                  return (
                    <NavigationMenu.Item key={label}>
                      <NavigationMenu.Trigger className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-white/70 hover:text-white rounded-lg hover:bg-white/[0.07] transition-all duration-200 data-[state=open]:text-white data-[state=open]:bg-white/[0.07] group select-none">
                        {label}
                        <ChevronDown
                          size={14}
                          className="transition-transform duration-200 group-data-[state=open]:rotate-180 text-white/50"
                        />
                      </NavigationMenu.Trigger>

                      <NavigationMenu.Content className="absolute top-full left-0 right-0 mt-1">
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{
                            duration: 0.18,
                            ease: "easeOut" as const,
                          }}
                          className="bg-[oklch(13%_0.045_248/0.95)] backdrop-blur-[32px] rounded-2xl shadow-[0_24px_64px_oklch(0%_0_0/0.65),inset_0_1px_0_oklch(100%_0_0/0.09)] border border-white/[0.08] p-6 mx-4"
                        >
                          <div className="max-w-5xl mx-auto">
                            <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-5">
                              {section.description}
                            </p>
                            <div
                              className={`grid gap-6 ${section.sections.length > 2 ? "grid-cols-2 lg:grid-cols-4" : section.sections.length === 2 ? "grid-cols-2" : "grid-cols-1"}`}
                            >
                              {section.sections.map(sec => (
                                <div key={sec.title}>
                                  <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2">
                                    {sec.title}
                                  </div>
                                  <div className="space-y-1">
                                    {sec.items.map(item => {
                                      const Icon = item.icon;
                                      const Comp = item.external ? "a" : Link;
                                      const extraProps = item.external
                                        ? {
                                            href: item.href,
                                            target: "_blank",
                                            rel: "noopener noreferrer",
                                          }
                                        : { href: item.href };
                                      return (
                                        <Comp
                                          key={item.name}
                                          {...extraProps}
                                          // The route effect closes the menu on
                                          // navigation, but clicking through to
                                          // the page you are already on does not
                                          // change the location and would leave
                                          // the panel open. Close it here too.
                                          onClick={() => setOpenMenu("")}
                                          className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-white/[0.07] transition-all duration-200 group/item"
                                        >
                                          <div
                                            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                                            style={{
                                              background: `${item.color}20`,
                                              border: `1px solid ${item.color}40`,
                                            }}
                                          >
                                            <Icon
                                              size={14}
                                              style={{ color: item.color }}
                                            />
                                          </div>
                                          <div>
                                            <div className="text-xs font-semibold text-white group-hover/item:text-[#F97316] transition-colors leading-tight">
                                              {item.name}
                                            </div>
                                            <div className="text-[11px] text-white/40 mt-0.5 leading-tight">
                                              {item.desc}
                                            </div>
                                          </div>
                                        </Comp>
                                      );
                                    })}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      </NavigationMenu.Content>
                    </NavigationMenu.Item>
                  );
                })}

                <NavigationMenu.Item>
                  <a
                    href="https://github.com/embeddedos-org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white/80 hover:text-white rounded-lg hover:bg-white/5 transition-colors duration-150"
                  >
                    <Star size={14} className="text-[#F97316]" />
                    GitHub
                  </a>
                </NavigationMenu.Item>
              </NavigationMenu.List>

              <NavigationMenu.Viewport
                className="absolute top-full left-0 right-0 w-full"
                style={{ perspective: "1200px" }}
              />
            </NavigationMenu.Root>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const event = new CustomEvent("open-search");
                  window.dispatchEvent(event);
                }}
                className="flex items-center justify-center w-9 h-9 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors duration-150"
                aria-label="Search (Ctrl+K)"
              >
                <Search size={18} />
              </button>

              <button
                onClick={() =>
                  window.dispatchEvent(new CustomEvent("open-donate"))
                }
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 bg-[#34D399]/15 hover:bg-[#34D399]/25 text-[#34D399] border border-[#34D399]/40 text-sm font-semibold rounded-lg btn-press"
              >
                <Heart size={13} />
                Donate
              </button>

              <Link
                href="/getting-started"
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-[#F97316] hover:bg-[#EA580C] text-white text-sm font-semibold rounded-lg btn-press"
              >
                Get Started
                <ArrowRight size={14} />
              </Link>

              {/* Mobile toggle */}
              <button
                onClick={toggleMobile}
                className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg text-white/80 hover:text-white hover:bg-white/5 transition-colors duration-150"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
                aria-controls="mobile-menu"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {mobileOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <X size={20} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Menu size={20} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />

            <motion.nav
              id="mobile-menu"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-80 glass-strong border-l border-white/10 overflow-y-auto lg:hidden"
              aria-label="Mobile navigation"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <Link href="/" className="flex items-center gap-2">
                  <img
                    loading="eager"
                    fetchPriority="high"
                    src={LOGO_MARK}
                    alt="EmbeddedOS"
                    className="w-7 h-7 rounded-lg"
                  />
                  <span className="font-heading font-bold text-white text-sm">
                    EmbeddedOS
                  </span>
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/5"
                  aria-label="Close menu"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-4 space-y-1">
                {(Object.keys(NAV_ITEMS) as NavKey[]).map(label => {
                  const section = NAV_ITEMS[label];
                  const isExpanded = mobileExpanded === label;
                  return (
                    <div key={label}>
                      <button
                        onClick={() =>
                          setMobileExpanded(e => (e === label ? null : label))
                        }
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-white/80 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        {label}
                        <ChevronDown
                          size={16}
                          className={`text-white/40 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                        />
                      </button>
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="overflow-hidden"
                          >
                            <div className="pl-3 pb-2 space-y-3">
                              {section.sections.map(sec => (
                                <div key={sec.title}>
                                  <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest px-2 py-1">
                                    {sec.title}
                                  </div>
                                  {sec.items.map(item => {
                                    const Icon = item.icon;
                                    const Comp = item.external ? "a" : Link;
                                    const extraProps = item.external
                                      ? {
                                          href: item.href,
                                          target: "_blank",
                                          rel: "noopener noreferrer",
                                        }
                                      : { href: item.href };
                                    return (
                                      <Comp
                                        key={item.name}
                                        {...extraProps}
                                        className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-white/5 transition-colors"
                                      >
                                        <div
                                          className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
                                          style={{
                                            background: `${item.color}20`,
                                            border: `1px solid ${item.color}40`,
                                          }}
                                        >
                                          <Icon
                                            size={12}
                                            style={{ color: item.color }}
                                          />
                                        </div>
                                        <div>
                                          <div className="text-xs font-semibold text-white">
                                            {item.name}
                                          </div>
                                          <div className="text-[10px] text-white/40">
                                            {item.desc}
                                          </div>
                                        </div>
                                      </Comp>
                                    );
                                  })}
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}

                {/* GitHub */}
                <a
                  href="https://github.com/embeddedos-org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-white/80 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <Star size={16} className="text-[#F97316]" />
                  GitHub
                </a>
              </div>

              {/* CTA */}
              <div className="p-4 border-t border-white/10 space-y-2">
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    window.dispatchEvent(new CustomEvent("open-donate"));
                  }}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-[#34D399]/15 hover:bg-[#34D399]/25 text-[#34D399] border border-[#34D399]/40 font-bold rounded-xl transition-all active:scale-95"
                >
                  <Heart size={16} />
                  Donate
                </button>
                <Link
                  href="/getting-started"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-[#F97316] hover:bg-[#EA580C] text-white font-bold rounded-xl transition-all active:scale-95"
                  onClick={() => setMobileOpen(false)}
                >
                  Get Started
                  <ArrowRight size={16} />
                </Link>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
