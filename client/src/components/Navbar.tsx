import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import {
  Cpu,
  Zap,
  MessageSquare,
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
  Bot,
  Rocket,
  LayoutGrid,
  Wifi,
  Brain,
  Cpu as CpuIcon,
  Atom,
} from "lucide-react";
import { BOARD_COUNT, SIM_PLATFORM_COUNT, REPO_COUNT } from "../data/stack";

const LOGO_MARK = "/media/embeddedos-logo-mark_bc053888.jpg";

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
            external: true,
          },
          {
            name: "eBoot",
            desc: "Secure bootloader & OTA",
            icon: Zap,
            href: "https://github.com/embeddedos-org/eBoot",
            external: true,
          },
          {
            name: "eIPC",
            desc: "Ultra-low latency IPC",
            icon: MessageSquare,
            href: "https://github.com/embeddedos-org/eIPC",
            external: true,
          },
          {
            name: "ebuild",
            desc: "Next-gen build tool",
            icon: Wrench,
            href: "/ebuild",
            external: false,
          },
          {
            name: "eosllm",
            desc: "On-device LLM inference",
            icon: Bot,
            href: "https://github.com/embeddedos-org/eosllm",
            external: true,
          },
          // eos-programming-language is a private repo — link the org profile until it is published.
          {
            name: "EoS Language",
            desc: "Fastest embedded APIs",
            icon: Braces,
            href: "https://github.com/embeddedos-org",
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
            external: true,
          },
          {
            name: "eNI",
            desc: "Neural interface adapter",
            icon: Wifi,
            href: "https://github.com/embeddedos-org/eNI",
            external: true,
          },
        ],
      },
      {
        title: "Dev Tools",
        items: [
          {
            name: "EoSim",
            desc: `${SIM_PLATFORM_COUNT} platform simulator`,
            icon: Terminal,
            href: "https://github.com/embeddedos-org/EoSim",
            external: true,
          },
          {
            name: "EoStudio",
            desc: "Universal IDE v3.1",
            icon: LayoutGrid,
            href: "https://github.com/embeddedos-org/EoStudio",
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
            external: false,
          },
          {
            name: "AeroSwift Transit",
            desc: "10-seat urban air taxi",
            icon: Rocket,
            href: "/aerospace",
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
            external: false,
          },
          {
            name: "EoS Kernel",
            desc: `RTOS kernel for ${BOARD_COUNT} boards`,
            icon: CpuIcon,
            href: "/product-eos",
            external: false,
          },
          {
            name: "eos-platform",
            desc: "Desktop, Laptop, Tablet, TV, Kiosk",
            icon: Layers,
            href: "/product-eos-platform",
            external: false,
          },
          {
            name: "eBootloader",
            desc: "Secure bootloader + OTA updates",
            icon: Zap,
            href: "/product-eboot",
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
            external: false,
          },
          {
            name: "ENI",
            desc: "Configurable neural research interface",
            icon: Activity,
            href: "/product-eni",
            external: false,
          },
          {
            name: "EIPC",
            desc: "Capability-secured IPC fabric",
            icon: Network,
            href: "/product-eipc",
            external: false,
          },
          {
            name: "eDB",
            desc: "SQL + Document + KV database",
            icon: Database,
            href: "/product-edb",
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
            external: false,
          },
          {
            name: "eOffice Suite",
            desc: "11-app embedded office suite",
            icon: FileText,
            href: "/product-eoffice",
            external: false,
          },
          {
            name: "eServiceApps",
            desc: "eSocial, eRide, eTravel, eWallet",
            icon: Globe,
            href: "/product-eserviceapps",
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
            external: false,
          },
          {
            name: "EoSim",
            desc: `${SIM_PLATFORM_COUNT} virtual platforms simulator`,
            icon: Zap,
            href: "/product-eosim",
            external: false,
          },
          {
            name: "EoStudio",
            desc: "Embedded IDE with board picker",
            icon: Code,
            href: "/product-eostudio",
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
            external: false,
          },
          {
            name: "HEALTH-BAND Neuro",
            desc: "sEMG + TENS wristband",
            icon: Watch,
            href: "/health",
            external: false,
          },
          {
            name: "HEALTH-RING",
            desc: "Titanium smart ring",
            icon: Fingerprint,
            href: "/health",
            external: false,
          },
          {
            name: "HEALTH-LAB",
            desc: "14-day biosensor patch",
            icon: Microscope,
            href: "/health",
            external: false,
          },
          {
            // Moved here from the Community menu, where a hardware catalogue
            // had nothing to do with participating in the project.
            name: "eCAD Hardware",
            desc: "Hardware design catalog",
            icon: CpuIcon,
            href: "/ecad-hardware",
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
            external: false,
          },
          {
            // /docs is the documentation landing page and was reachable only
            // from body copy on other pages — never from either menu.
            name: "Documentation",
            desc: "Guides & reference",
            icon: FileText,
            href: "/docs",
            external: false,
          },
          {
            name: "API Reference",
            desc: "300+ APIs documented",
            icon: Code,
            href: "/api-docs",
            external: false,
          },
          {
            name: "Architecture",
            desc: "3D block diagrams & system design",
            icon: Layers,
            href: "/architecture",
            external: false,
          },
          {
            name: "Books",
            desc: "14 technical books",
            icon: FileText,
            href: "/books",
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
            external: false,
          },
          {
            name: "Stacks",
            desc: "Technology stacks",
            icon: Layers,
            href: "/stacks",
            external: false,
          },
          {
            name: "eFlow",
            desc: "Visual block programming",
            icon: Zap,
            href: "/eflow",
            external: false,
          },
          {
            name: "eBuild",
            desc: "Build, sim & flash tool",
            icon: Wrench,
            href: "/ebuild",
            external: false,
          },
          {
            name: "Kids Edition",
            desc: "Educational platform",
            icon: Gamepad2,
            href: "/kids",
            external: false,
          },
        ],
      },
    ],
  },
  // Community is about taking part, not about the organisation. This menu was a
  // single 14-item "Participate" list that mixed contributing (Get Involved,
  // Discussions) with the Foundation's institutional pages (About, Mission,
  // Transparency, Careers, Patents) and even a hardware catalogue — so the top
  // nav and the footer were largely the same menu twice. The institutional
  // pages now live only in the footer, which is the site's organisational map;
  // see the note above FOOTER_LINKS in Footer.tsx.
  Community: {
    description: "Build EmbeddedOS with us",
    sections: [
      {
        title: "Contribute",
        items: [
          {
            name: "Get Involved",
            desc: "Where to start contributing",
            icon: Heart,
            href: "/get-involved",
            external: false,
          },
          {
            name: "GitHub Org",
            desc: `${REPO_COUNT} open-source repos`,
            icon: Github,
            href: "https://github.com/embeddedos-org",
            external: true,
          },
          {
            name: "Discussions",
            desc: "Ask and answer in public",
            icon: MessageSquare,
            href: "https://github.com/orgs/embeddedos-org/discussions",
            external: true,
          },
        ],
      },
      {
        title: "Connect",
        items: [
          {
            name: "Community",
            desc: "Governance & working groups",
            icon: Users,
            href: "/community",
            external: false,
          },
          {
            name: "Events",
            desc: "Meetups & conferences",
            icon: Rocket,
            href: "/events",
            external: false,
          },
          {
            name: "News",
            desc: "Releases & announcements",
            icon: FileText,
            href: "/news",
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
        className={`fixed top-0 left-0 right-0 z-50 border-b bg-black/[0.85] backdrop-blur-[18px] backdrop-saturate-[1.6] transition-[border-color,background-color] duration-300 ${
          scrolled ? "border-[#232326]" : "border-transparent"
        }`}
        role="banner"
      >
        <div className="max-w-[1200px] mx-auto px-[clamp(16px,4vw,44px)]">
          <div className="flex items-center justify-between h-[52px] xl:grid xl:grid-cols-[1fr_auto_1fr] xl:gap-x-6">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-[9px] shrink-0 group justify-self-start"
              aria-label="EmbeddedOS Home"
            >
              <img
                loading="eager"
                fetchPriority="high"
                src={LOGO_MARK}
                width={32}
                height={32}
                alt="EmbeddedOS"
                className="w-[22px] h-[22px] rounded-[5px] object-cover transition-transform duration-200 group-hover:scale-105"
              />
              <div className="flex flex-col leading-none">
                <span className="font-heading font-semibold text-[#f5f5f7] text-[15px] tracking-[-0.01em]">
                  EmbeddedOS
                </span>
                <span className="text-[10px] text-[#a1a1a6] font-medium tracking-[0.08em] uppercase mt-0.5">
                  Foundation · 501(c)(3)
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <NavigationMenu.Root
              className="hidden lg:flex items-center justify-self-center"
              delayDuration={100}
              value={openMenu}
              onValueChange={setOpenMenu}
            >
              <NavigationMenu.List className="flex items-center gap-5 xl:gap-[clamp(20px,2.6vw,34px)]">
                {(Object.keys(NAV_ITEMS) as NavKey[]).map(label => {
                  const section = NAV_ITEMS[label];
                  return (
                    <NavigationMenu.Item key={label}>
                      <NavigationMenu.Trigger className="relative flex items-center gap-1 py-4 leading-5 text-[13px] font-normal text-[#a1a1a6] hover:text-[#f5f5f7] transition-colors duration-200 data-[state=open]:text-[#f5f5f7] group select-none after:absolute after:left-0 after:right-0 after:bottom-[11px] after:h-px after:bg-[#f5f5f7] after:origin-left after:scale-x-0 after:transition-transform after:duration-[350ms] after:ease-[cubic-bezier(0.2,0.7,0.2,1)] hover:after:scale-x-100 focus-visible:after:scale-x-100 data-[state=open]:after:scale-x-100">
                        {label}
                        <ChevronDown
                          size={14}
                          className="transition-transform duration-200 group-data-[state=open]:rotate-180 text-[#6e6e73]"
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
                          className="bg-[#0b0b0d]/95 backdrop-blur-[32px] backdrop-saturate-[1.6] rounded-[22px] shadow-[0_24px_64px_rgba(0,0,0,0.7)] border border-[#232326] p-6 mx-4"
                        >
                          <div className="max-w-5xl mx-auto">
                            <p className="text-[12px] font-semibold text-[#a1a1a6] uppercase tracking-[0.08em] mb-5">
                              {section.description}
                            </p>
                            <div
                              className={`grid gap-6 ${section.sections.length > 2 ? "grid-cols-2 lg:grid-cols-4" : section.sections.length === 2 ? "grid-cols-2" : "grid-cols-1"}`}
                            >
                              {section.sections.map(sec => (
                                <div key={sec.title}>
                                  <div className="text-[11px] font-semibold text-[#a1a1a6] uppercase tracking-[0.08em] mb-2">
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
                                          className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-[#141417] transition-colors duration-200 group/item"
                                        >
                                          <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 bg-[#141417] border border-[#232326] text-[#a1a1a6] group-hover/item:text-[#f5f5f7] transition-colors">
                                            <Icon size={14} />
                                          </div>
                                          <div>
                                            <div className="text-[13px] font-medium tracking-[-0.01em] text-[#f5f5f7] leading-tight">
                                              {item.name}
                                            </div>
                                            <div className="text-[12px] text-[#a1a1a6] mt-0.5 leading-tight">
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
                    className="flex items-center gap-1.5 py-4 leading-5 text-[13px] text-[#a1a1a6] hover:text-[#f5f5f7] transition-colors duration-200"
                  >
                    <Star size={14} className="opacity-80" />
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
            <div className="flex items-center gap-3 justify-self-end">
              <button
                onClick={() => {
                  const event = new CustomEvent("open-search");
                  window.dispatchEvent(event);
                }}
                className="flex items-center justify-center w-9 h-9 rounded-full text-[#a1a1a6] hover:text-[#f5f5f7] hover:bg-white/[0.06] transition-colors duration-200"
                aria-label="Search (Ctrl+K)"
              >
                <Search size={18} />
              </button>

              <button
                onClick={() =>
                  window.dispatchEvent(new CustomEvent("open-donate"))
                }
                className="hidden sm:inline-flex items-center gap-1.5 h-[30px] px-[14px] whitespace-nowrap bg-primary hover:bg-brand-amber-light text-primary-foreground text-[13px] font-medium tracking-[-0.01em] rounded-full btn-press transition-colors duration-200"
              >
                <Heart size={13} />
                Donate
              </button>

              <Link
                href="/getting-started"
                className="hidden sm:inline-flex items-center gap-1.5 h-[30px] px-[14px] whitespace-nowrap border border-[#3a3a3e] hover:border-[#a1a1a6] text-[#f5f5f7] text-[13px] font-medium tracking-[-0.01em] rounded-full btn-press transition-colors duration-200"
              >
                Get Started
                <ArrowRight size={14} />
              </Link>

              {/* Mobile toggle */}
              <button
                onClick={toggleMobile}
                className="lg:hidden flex items-center justify-center w-11 h-11 -mr-2.5 rounded-full text-[#f5f5f7] hover:text-white transition-colors duration-200"
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
              className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />

            <motion.nav
              id="mobile-menu"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              // The drawer starts below the 53px site header (top-[53px]) and
              // sits under it in z-order, so its header row can never overlap
              // the site header — the header's own toggle (now an X) closes it.
              className="fixed top-[53px] right-0 bottom-0 z-40 w-80 bg-black border-t border-l border-[#232326] overflow-y-auto lg:hidden"
              aria-label="Mobile navigation"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-[#232326]">
                <Link href="/" className="flex items-center gap-2">
                  <img
                    loading="eager"
                    fetchPriority="high"
                    src={LOGO_MARK}
                    width={32}
                    height={32}
                    alt="EmbeddedOS"
                    className="w-[22px] h-[22px] rounded-[5px]"
                  />
                  <span className="font-heading font-semibold text-[#f5f5f7] text-[15px] tracking-[-0.01em]">
                    EmbeddedOS
                  </span>
                </Link>
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
                        aria-expanded={isExpanded}
                        className="w-full flex items-center justify-between px-1 py-3 border-b border-[#232326] text-[19px] font-medium tracking-[-0.015em] text-[#f5f5f7] hover:text-white transition-colors"
                      >
                        {label}
                        <ChevronDown
                          size={16}
                          className={`text-[#6e6e73] transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
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
                            <div className="pl-1 pt-2 pb-3 space-y-3">
                              {section.sections.map(sec => (
                                <div key={sec.title}>
                                  <div className="text-[12px] font-semibold text-[#a1a1a6] uppercase tracking-[0.08em] px-2 py-1">
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
                                        className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-[#141417] transition-colors"
                                      >
                                        <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 bg-[#141417] border border-[#232326] text-[#a1a1a6]">
                                          <Icon size={12} />
                                        </div>
                                        <div>
                                          <div className="text-[15px] font-medium tracking-[-0.01em] text-[#f5f5f7]">
                                            {item.name}
                                          </div>
                                          <div className="text-[12px] text-[#a1a1a6]">
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
                  className="flex items-center gap-2 px-1 py-3 text-[19px] font-medium tracking-[-0.015em] text-[#f5f5f7] hover:text-white transition-colors"
                >
                  <Star size={16} className="text-[#a1a1a6]" />
                  GitHub
                </a>
              </div>

              {/* CTA */}
              <div className="p-4 border-t border-[#232326] space-y-2">
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    window.dispatchEvent(new CustomEvent("open-donate"));
                  }}
                  className="flex items-center justify-center gap-2 w-full h-11 px-[22px] bg-primary hover:bg-brand-amber-light text-primary-foreground text-[15px] font-medium tracking-[-0.01em] rounded-full transition-all active:scale-95"
                >
                  <Heart size={16} />
                  Donate
                </button>
                <Link
                  href="/getting-started"
                  className="flex items-center justify-center gap-2 w-full h-11 px-[22px] border border-[#3a3a3e] hover:border-[#a1a1a6] text-[#f5f5f7] text-[15px] font-medium tracking-[-0.01em] rounded-full transition-all active:scale-95"
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
