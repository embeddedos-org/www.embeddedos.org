import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cpu, Brain, Shield, Code2, Rocket, Users, DollarSign,
  Heart, BookOpen, Clock, Home, Gift, MapPin, Briefcase,
  ChevronDown, ChevronUp, ExternalLink, Search, Filter,
  Zap, Globe, Database, Radio, Layers, Terminal, Star
} from "lucide-react";
import { Link } from "wouter";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

// ─── Job Data ─────────────────────────────────────────────────────────────────

const DEPARTMENTS = ["All", "Engineering", "Research", "Leadership", "Design", "Community"];

const JOBS = [
  // ── Engineering ──────────────────────────────────────────────────────────────
  {
    id: "eos-build-engineer",
    title: "EoS Build System Engineer",
    department: "Engineering",
    team: "Core Platform",
    type: "Full-time",
    location: "Remote / San Francisco Bay Area",
    level: "Senior",
    icon: Terminal,
    color: "#F97316",
    summary: "Design and maintain the EoS build system, Ninja backend integration, YAML configuration, and cross-compilation targets for ARM, x86, and RISC-V architectures.",
    responsibilities: [
      "Design and maintain the ebuild build system with Ninja backend integration",
      "Develop and maintain YAML-based board configuration and cross-compilation toolchains",
      "Implement and optimize build pipelines for ARM Cortex-M/A, x86, and RISC-V targets",
      "Maintain CI/CD pipelines and automated testing infrastructure",
      "Collaborate with firmware engineers on BSP integration and driver build systems",
      "Write and maintain build system documentation and developer guides",
    ],
    requirements: [
      "5+ years of experience with embedded build systems (CMake, Make, Ninja, Meson)",
      "Deep knowledge of cross-compilation toolchains (GCC, Clang, LLVM) for ARM and RISC-V",
      "Experience with YAML/TOML configuration systems and schema validation",
      "Strong C/C++ and Python skills",
      "Familiarity with CI/CD systems (GitHub Actions, Jenkins)",
      "Experience with ELF binary formats, linker scripts, and memory layout",
    ],
    niceToHave: [
      "Experience with Zephyr RTOS, FreeRTOS, or similar RTOS build systems",
      "Knowledge of LLVM/Clang toolchain internals",
      "Contributions to open-source build tools",
    ],
  },
  {
    id: "eipc-security-engineer",
    title: "EIPC Security Engineer",
    department: "Engineering",
    team: "Security & IPC",
    type: "Full-time",
    location: "Remote / San Francisco Bay Area",
    level: "Senior",
    icon: Shield,
    color: "#EF4444",
    summary: "Develop and maintain the EIPC secure IPC framework including capability-based authorization, audit logging, replay protection, and transport security for embedded systems.",
    responsibilities: [
      "Design and implement capability-based authorization model for EIPC",
      "Develop HMAC-SHA256 message authentication and replay protection mechanisms",
      "Implement audit logging and security event monitoring for IPC channels",
      "Design and maintain transport security for shared memory, UART, SPI, and I²C backends",
      "Conduct threat modeling and security reviews for IPC protocol changes",
      "Write security documentation and threat model reports",
    ],
    requirements: [
      "5+ years of experience in embedded security or systems security",
      "Deep knowledge of cryptographic primitives (HMAC, AES, ECC, SHA-2/3)",
      "Experience with capability-based security models and access control",
      "Strong C skills and understanding of memory safety in embedded contexts",
      "Experience with secure boot, TrustZone, or similar TEE technologies",
      "Familiarity with IPC mechanisms (shared memory, message queues, sockets)",
    ],
    niceToHave: [
      "Experience with formal verification tools (Coq, Isabelle, CBMC)",
      "Knowledge of FIPS 140-2/3 certification requirements",
      "Contributions to open-source cryptography libraries",
    ],
  },
  {
    id: "ebootloader-firmware-engineer",
    title: "eBootloader / Firmware Engineer",
    department: "Engineering",
    team: "Boot & Firmware",
    type: "Full-time",
    location: "Remote / San Francisco Bay Area",
    level: "Senior",
    icon: Cpu,
    color: "#8B5CF6",
    summary: "Design staged boot architecture, A/B slot management, CRC/signature verification, and firmware upgrade APIs for the eBoot bootloader running on 52+ embedded platforms.",
    responsibilities: [
      "Design and implement staged boot architecture (ROM → eBoot → EoS)",
      "Develop A/B slot management and rollback protection mechanisms",
      "Implement CRC verification, RSA/ECDSA signature validation, and secure boot chain",
      "Build OTA firmware upgrade APIs and delta update support",
      "Port eBoot to new MCU families (STM32, ESP32, NXP, Nordic, RP2040)",
      "Write HAL drivers for flash, UART, SPI, and I²C boot interfaces",
    ],
    requirements: [
      "5+ years of embedded firmware development experience",
      "Deep knowledge of ARM Cortex-M boot sequences and startup code",
      "Experience with flash memory management, wear leveling, and NOR/NAND flash",
      "Strong C skills with experience writing bare-metal firmware",
      "Knowledge of secure boot, code signing, and firmware verification",
      "Experience with JTAG/SWD debugging and hardware bring-up",
    ],
    niceToHave: [
      "Experience with U-Boot, MCUboot, or similar open-source bootloaders",
      "Knowledge of RISC-V boot sequences",
      "Experience with HSM integration for key storage",
    ],
  },
  {
    id: "eoffice-frontend-engineer",
    title: "eOffice Frontend Engineer",
    department: "Engineering",
    team: "Applications",
    type: "Full-time",
    location: "Remote",
    level: "Mid / Senior",
    icon: Layers,
    color: "#06B6D4",
    summary: "Build and maintain the eOffice Suite — 11 productivity apps (eWriter, eSheet, ePresent, eNotes, eDraw, eCalc, eCalendar, eContacts, eMail, eChat, eFiles) running on embedded displays.",
    responsibilities: [
      "Develop and maintain all 11 eOffice applications using C/LVGL and React (web preview)",
      "Implement document rendering, editing, and export (DOCX, XLSX, PPTX, PDF)",
      "Build responsive layouts for embedded displays (240×320 to 1920×1080)",
      "Optimize rendering performance for low-RAM MCUs (256 KB – 8 MB)",
      "Implement file system integration with eDB and eFiles",
      "Write unit tests and integration tests for all eOffice components",
    ],
    requirements: [
      "3+ years of experience with LVGL or similar embedded GUI frameworks",
      "Strong C skills and experience with embedded display drivers",
      "Experience with document format parsing (OOXML, ODF, PDF)",
      "Knowledge of font rendering, Unicode, and text layout algorithms",
      "Familiarity with embedded file systems (FAT32, LittleFS, SPIFFS)",
    ],
    niceToHave: [
      "Experience with React for web-based previews and testing",
      "Knowledge of accessibility standards for embedded UIs",
      "Contributions to LVGL or similar open-source GUI projects",
    ],
  },
  {
    id: "ehealth-firmware-engineer",
    title: "eHealth365 Firmware Engineer",
    department: "Engineering",
    team: "Health Devices",
    type: "Full-time",
    location: "Remote / San Francisco Bay Area",
    level: "Senior",
    icon: Heart,
    color: "#EC4899",
    summary: "Develop firmware for the eHealth365 wearable platform — Smart Ring Pro and Smart Patch Pro — including biometric sensor fusion, BLE communication, and real-time health monitoring algorithms.",
    responsibilities: [
      "Develop firmware for MAX30102 (SpO₂/HR), MAX30205 (temperature), and glucose biosensors",
      "Implement real-time sensor fusion algorithms for multi-modal health monitoring",
      "Build BLE 5.3 communication stack and health data synchronization protocols",
      "Optimize firmware for ultra-low power operation (< 1 mW average)",
      "Implement FDA-compliant data logging and audit trail mechanisms",
      "Write automated test suites for sensor accuracy and power consumption",
    ],
    requirements: [
      "5+ years of embedded firmware development for wearable or medical devices",
      "Experience with biometric sensors (PPG, ECG, temperature, accelerometer)",
      "Strong knowledge of BLE stack programming (NimBLE, SoftDevice, Zephyr BT)",
      "Experience with ultra-low power design and power management ICs",
      "Familiarity with medical device software standards (IEC 62304, ISO 14971)",
      "Strong C skills and RTOS experience (FreeRTOS, Zephyr)",
    ],
    niceToHave: [
      "Experience with FDA 510(k) or CE marking submissions",
      "Knowledge of signal processing for PPG/ECG waveform analysis",
      "Experience with Nordic nRF52/nRF53 or STM32WB platforms",
    ],
  },
  {
    id: "eradar-dsp-engineer",
    title: "eRadar360 DSP / Signal Processing Engineer",
    department: "Engineering",
    team: "Sensing & Radar",
    type: "Full-time",
    location: "Remote / San Francisco Bay Area",
    level: "Senior",
    icon: Radio,
    color: "#10B981",
    summary: "Develop DSP algorithms and real-time signal processing pipelines for the eRadar360 / Aegis One 77 GHz FMCW radar system, including object detection, tracking, and classification.",
    responsibilities: [
      "Develop FMCW radar signal processing pipeline (range-Doppler, CFAR, MUSIC/ESPRIT)",
      "Implement real-time object detection, tracking, and multi-target classification",
      "Optimize DSP algorithms for TI AWR2944 radar SoC and RK3588S NPU",
      "Develop sensor fusion algorithms combining radar, LiDAR, and camera data",
      "Implement V2X (DSRC/C-V2X) communication protocols for vehicle-to-infrastructure",
      "Write real-time performance benchmarks and validation test suites",
    ],
    requirements: [
      "5+ years of DSP or radar signal processing experience",
      "Deep knowledge of FMCW radar principles, range-Doppler processing, and CFAR detection",
      "Experience with TI mmWave radar SDK or similar radar development platforms",
      "Strong C/C++ and MATLAB/Python skills for algorithm development",
      "Knowledge of Kalman filtering, particle filters, and multi-target tracking",
      "Experience with real-time embedded signal processing optimization",
    ],
    niceToHave: [
      "Experience with automotive radar standards (ISO 26262 ASIL-B, AUTOSAR)",
      "Knowledge of LiDAR point cloud processing (PCL, Open3D)",
      "Experience with NVIDIA CUDA or NPU acceleration",
    ],
  },
  {
    id: "edb-database-engineer",
    title: "eDB Database Engine Engineer",
    department: "Engineering",
    team: "Data Systems",
    type: "Full-time",
    location: "Remote",
    level: "Senior",
    icon: Database,
    color: "#F59E0B",
    summary: "Build and maintain eDB — a multi-model embedded database supporting SQL, Document, Key-Value, and AI-native query modes optimized for resource-constrained embedded systems.",
    responsibilities: [
      "Design and implement the eDB query engine (SQL parser, query planner, executor)",
      "Develop document store and key-value store backends with unified API",
      "Implement AI-native query mode with vector similarity search and embedding support",
      "Optimize storage engine for flash wear leveling and low-RAM operation",
      "Build REST API layer and gRPC interface for remote database access",
      "Write comprehensive test suites including correctness, performance, and durability tests",
    ],
    requirements: [
      "5+ years of database engine development experience",
      "Deep knowledge of query optimization, B-tree/LSM-tree storage engines",
      "Experience with SQLite, LevelDB, or similar embedded database internals",
      "Strong C/C++ skills and experience with memory-constrained environments",
      "Knowledge of ACID transactions, WAL logging, and crash recovery",
      "Familiarity with vector databases and embedding-based retrieval",
    ],
    niceToHave: [
      "Experience with SQLite extension development",
      "Knowledge of ONNX or TFLite for on-device AI inference",
      "Contributions to open-source database projects",
    ],
  },
  // ── Research ──────────────────────────────────────────────────────────────────
  {
    id: "eai-runtime-researcher",
    title: "EAI Runtime Researcher",
    department: "Research",
    team: "Edge AI",
    type: "Full-time",
    location: "Remote / San Francisco Bay Area",
    level: "Research Scientist",
    icon: Brain,
    color: "#A78BFA",
    summary: "Research and develop the EAI-Min edge runtime and EAI-Framework industrial AI platform, including llama.cpp/ONNX/TFLite optimization for resource-constrained embedded devices.",
    responsibilities: [
      "Research and develop quantization techniques for LLM inference on MCUs (INT4/INT8/FP16)",
      "Optimize llama.cpp, ONNX Runtime, and TFLite for ARM Cortex-M55/M85 and RISC-V",
      "Design the EAI-Min runtime for < 256 KB RAM inference with model caching",
      "Develop EAI-Framework industrial AI platform with multi-model pipeline orchestration",
      "Publish research findings at top-tier venues (NeurIPS, ICLR, MLSys, ASPLOS)",
      "Collaborate with firmware team on NPU driver integration (Ethos-U, Kendryte K210)",
    ],
    requirements: [
      "PhD or equivalent research experience in ML systems, edge AI, or embedded ML",
      "Deep knowledge of neural network quantization, pruning, and model compression",
      "Experience with llama.cpp, ONNX Runtime, or TFLite Micro",
      "Strong C/C++ and Python skills",
      "Publication record in ML systems or embedded AI",
      "Experience with ARM Cortex-M NPU or similar edge accelerators",
    ],
    niceToHave: [
      "Experience with MLIR compiler infrastructure",
      "Knowledge of neuromorphic computing or spiking neural networks",
      "Contributions to open-source ML frameworks",
    ],
  },
  {
    id: "eni-integration-researcher",
    title: "ENI Integration Researcher",
    department: "Research",
    team: "Neural Interface",
    type: "Full-time",
    location: "Remote / San Francisco Bay Area",
    level: "Research Scientist",
    icon: Zap,
    color: "#60A5FA",
    summary: "Research vendor-neutral BCI interfaces, neural signal processing, and ENI-Framework multi-lane routing for brain-computer interface integration with EmbeddedOS.",
    responsibilities: [
      "Research and develop neural signal acquisition and preprocessing pipelines",
      "Design vendor-neutral BCI abstraction layer supporting OpenBCI, Emotiv, Muse, NeuroSky",
      "Develop ENI-Framework multi-lane routing for concurrent neural data streams",
      "Implement real-time EEG/EMG/ECoG signal processing (bandpass, ICA, artifact rejection)",
      "Research intent classification and motor imagery decoding algorithms",
      "Publish research at BCI Society, NeurIPS, or IEEE EMBC",
    ],
    requirements: [
      "PhD or equivalent in neuroscience, BME, or signal processing",
      "Experience with EEG/EMG signal acquisition and processing",
      "Knowledge of BCI paradigms (P300, SSVEP, motor imagery, SEEG)",
      "Strong Python and C/C++ skills",
      "Familiarity with BCI hardware platforms (OpenBCI, g.tec, BrainProducts)",
      "Experience with real-time signal processing frameworks (MNE, BrainFlow)",
    ],
    niceToHave: [
      "Experience with closed-loop neurostimulation systems",
      "Knowledge of FDA regulatory pathway for BCI devices",
      "Contributions to open-source BCI software",
    ],
  },
  // ── Leadership ────────────────────────────────────────────────────────────────
  {
    id: "fundraising-manager",
    title: "Fundraising Manager",
    department: "Leadership",
    team: "Development",
    type: "Full-time",
    location: "Remote / San Francisco Bay Area",
    level: "Manager",
    icon: DollarSign,
    color: "#34D399",
    summary: "Lead fundraising initiatives, build relationships with donors and foundations, and develop grant proposals to support EmbeddedOS Foundation's research and education mission.",
    responsibilities: [
      "Develop and execute annual fundraising strategy aligned with Foundation mission",
      "Build and maintain relationships with individual donors, foundations, and corporate sponsors",
      "Write compelling grant proposals for NSF, DARPA, NIH, and private foundations",
      "Manage donor database, gift processing, and acknowledgment workflows",
      "Organize fundraising events, campaigns, and donor cultivation activities",
      "Report to Board of Directors on fundraising progress and pipeline",
    ],
    requirements: [
      "5+ years of nonprofit fundraising experience, preferably in technology or research",
      "Proven track record of securing six-figure grants and major gifts",
      "Experience writing successful NSF, NIH, or DARPA grant proposals",
      "Strong relationship management and communication skills",
      "Knowledge of 501(c)(3) compliance and gift acceptance policies",
      "Experience with CRM systems (Salesforce, Bloomerang, or similar)",
    ],
    niceToHave: [
      "CFRE certification",
      "Experience with technology or open-source foundation fundraising",
      "Network of contacts in the embedded systems or AI research community",
    ],
  },
  {
    id: "general-manager-programs",
    title: "General Manager — Programs",
    department: "Leadership",
    team: "Operations",
    type: "Full-time",
    location: "San Francisco",
    level: "Director",
    icon: Briefcase,
    color: "#F97316",
    summary: "Oversee membership, certification, and internship programs. Drive growth and ensure excellent participant experiences across all EmbeddedOS Foundation programs.",
    responsibilities: [
      "Lead and scale the Foundation's membership, certification, and internship programs",
      "Develop program strategy, KPIs, and growth targets in collaboration with leadership",
      "Manage program staff and coordinate with engineering, research, and community teams",
      "Build partnerships with universities, companies, and government agencies",
      "Ensure program quality, participant satisfaction, and continuous improvement",
      "Report program metrics and impact to the Board of Directors",
    ],
    requirements: [
      "7+ years of program management experience, preferably in nonprofit or education",
      "Experience managing certification or credentialing programs",
      "Strong leadership, communication, and stakeholder management skills",
      "Data-driven approach to program design and evaluation",
      "Experience building partnerships with academic institutions and industry",
      "Knowledge of nonprofit governance and 501(c)(3) operations",
    ],
    niceToHave: [
      "PMP or similar project management certification",
      "Background in embedded systems, computer science, or engineering",
      "Experience with LMS platforms (Canvas, Moodle, or similar)",
    ],
  },
  {
    id: "community-manager",
    title: "Community Manager",
    department: "Community",
    team: "Community & Outreach",
    type: "Full-time",
    location: "Remote",
    level: "Mid-level",
    icon: Users,
    color: "#EC4899",
    summary: "Build and engage the global EmbeddedOS community of researchers, engineers, and enthusiasts. Manage forums, events, social media, and outreach programs.",
    responsibilities: [
      "Manage and grow EmbeddedOS community across GitHub, Discord, Reddit, and social media",
      "Organize virtual and in-person events: hackathons, office hours, conference presence",
      "Create and curate community content: tutorials, showcases, newsletters, blog posts",
      "Onboard new contributors and guide them through the contribution process",
      "Gather community feedback and communicate it to engineering and research teams",
      "Track community health metrics and report on growth and engagement",
    ],
    requirements: [
      "3+ years of developer community management experience",
      "Experience managing open-source project communities on GitHub and Discord",
      "Strong written and verbal communication skills",
      "Ability to create technical content accessible to developers of all levels",
      "Experience organizing online and in-person developer events",
      "Passion for embedded systems, open-source software, or hardware hacking",
    ],
    niceToHave: [
      "Background in embedded systems or electrical engineering",
      "Experience with developer advocacy or technical evangelism",
      "Existing network in the embedded systems or IoT community",
    ],
  },
  // ── Design ────────────────────────────────────────────────────────────────────
  {
    id: "ux-designer-embedded",
    title: "UX Designer — Embedded Interfaces",
    department: "Design",
    team: "Design & UX",
    type: "Full-time",
    location: "Remote",
    level: "Senior",
    icon: Globe,
    color: "#06B6D4",
    summary: "Design intuitive user interfaces for embedded displays, developer tools, and the EmbeddedOS web platform. Bridge the gap between hardware constraints and great user experience.",
    responsibilities: [
      "Design UI/UX for eOffice Suite apps on embedded displays (240×320 to 1920×1080)",
      "Create design systems and component libraries for LVGL-based embedded UIs",
      "Design developer tools interfaces: EoStudio IDE, eFlow visual editor, EoSim simulator",
      "Conduct user research with embedded developers and hardware engineers",
      "Create prototypes, wireframes, and high-fidelity mockups",
      "Collaborate with firmware and frontend engineers on implementation",
    ],
    requirements: [
      "5+ years of UX/UI design experience, preferably for developer tools or embedded systems",
      "Proficiency in Figma, Sketch, or similar design tools",
      "Experience designing for constrained display environments",
      "Strong understanding of accessibility and usability principles",
      "Ability to create and maintain design systems at scale",
      "Experience working closely with engineering teams in agile environments",
    ],
    niceToHave: [
      "Background in embedded systems or hardware engineering",
      "Experience with LVGL or similar embedded GUI frameworks",
      "Knowledge of motion design and micro-interaction principles",
    ],
  },
];

const BENEFITS = [
  { icon: DollarSign, title: "Competitive Compensation", desc: "Market-rate salaries with annual reviews, plus opportunities for equity participation in spin-off ventures.", color: "#F97316" },
  { icon: Heart, title: "Health & Wellness", desc: "Comprehensive medical, dental, and vision insurance. Mental health support and wellness stipends.", color: "#EF4444" },
  { icon: Clock, title: "Generous Time Off", desc: "Unlimited PTO, paid holidays, sabbatical opportunities, and 16 weeks parental leave.", color: "#10B981" },
  { icon: BookOpen, title: "Learning & Development", desc: "Conference attendance budget, training stipend, and access to O'Reilly, Coursera, and Udemy.", color: "#8B5CF6" },
  { icon: Home, title: "Flexible & Remote-First", desc: "Remote-first culture with optional co-working spaces. Flexible hours that work for your timezone.", color: "#06B6D4" },
  { icon: Gift, title: "Additional Perks", desc: "Home office setup stipend ($2,000), latest dev hardware, team retreats, and open-source conference sponsorship.", color: "#F59E0B" },
];

const DEPT_COLORS: Record<string, string> = {
  Engineering: "#F97316",
  Research: "#8B5CF6",
  Leadership: "#10B981",
  Design: "#06B6D4",
  Community: "#EC4899",
};

function JobCard({ job, isOpen, onToggle }: { job: typeof JOBS[0]; isOpen: boolean; onToggle: () => void }) {
  const Icon = job.icon;
  return (
    <motion.div
      variants={fadeUp}
      className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden hover:border-white/20 transition-colors duration-200"
    >
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full text-left p-6 flex items-start gap-4 group"
        aria-expanded={isOpen}
      >
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ background: `${job.color}20`, border: `1px solid ${job.color}40` }}
        >
          <Icon size={22} style={{ color: job.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="font-heading font-bold text-white text-lg leading-tight">{job.title}</h3>
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{ background: `${DEPT_COLORS[job.department]}20`, color: DEPT_COLORS[job.department] }}
            >
              {job.department}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/10 text-white/60">
              {job.level}
            </span>
          </div>
          <p className="text-white/50 text-sm mb-3 leading-relaxed">{job.summary}</p>
          <div className="flex flex-wrap gap-3 text-xs text-white/40">
            <span className="flex items-center gap-1.5"><Briefcase size={12} />{job.type}</span>
            <span className="flex items-center gap-1.5"><MapPin size={12} />{job.location}</span>
            <span className="flex items-center gap-1.5"><Users size={12} />{job.team}</span>
          </div>
        </div>
        <div className="flex-shrink-0 ml-2 mt-1 text-white/30 group-hover:text-white/60 transition-colors">
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </button>

      {/* Expanded detail */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 border-t border-white/10 pt-5 grid md:grid-cols-2 gap-6">
              {/* Responsibilities */}
              <div>
                <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <Star size={14} style={{ color: job.color }} /> Responsibilities
                </h4>
                <ul className="space-y-2">
                  {job.responsibilities.map((r, i) => (
                    <li key={i} className="text-sm text-white/60 flex gap-2">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: job.color }} />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Requirements + Nice to Have */}
              <div className="space-y-5">
                <div>
                  <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                    <Code2 size={14} style={{ color: job.color }} /> Requirements
                  </h4>
                  <ul className="space-y-2">
                    {job.requirements.map((r, i) => (
                      <li key={i} className="text-sm text-white/60 flex gap-2">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: job.color }} />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
                {job.niceToHave && (
                  <div>
                    <h4 className="text-sm font-bold text-white/60 mb-3">Nice to Have</h4>
                    <ul className="space-y-2">
                      {job.niceToHave.map((r, i) => (
                        <li key={i} className="text-sm text-white/40 flex gap-2">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-white/20" />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Apply CTA */}
            <div className="px-6 pb-6 flex items-center gap-3">
              <a
                href={`mailto:careers@embeddedos.org?subject=Application: ${encodeURIComponent(job.title)}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all duration-150 active:scale-95"
                style={{ background: job.color }}
              >
                Apply Now
                <ExternalLink size={14} />
              </a>
              <span className="text-xs text-white/30">Send your resume to careers@embeddedos.org</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Careers() {
  const [openJob, setOpenJob] = useState<string | null>(null);
  const [dept, setDept] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = JOBS.filter((j) => {
    const matchDept = dept === "All" || j.department === dept;
    const q = search.toLowerCase();
    const matchSearch = !q || j.title.toLowerCase().includes(q) || j.team.toLowerCase().includes(q) || j.summary.toLowerCase().includes(q);
    return matchDept && matchSearch;
  });

  const deptCounts = DEPARTMENTS.reduce<Record<string, number>>((acc, d) => {
    acc[d] = d === "All" ? JOBS.length : JOBS.filter((j) => j.department === d).length;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#060D1A] text-white">
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-[#F97316]/5 via-transparent to-[#8B5CF6]/5" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#F97316]/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#8B5CF6]/8 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.p variants={fadeUp} className="text-xs font-bold tracking-widest uppercase text-[#F97316] mb-4">
              Join the Foundation
            </motion.p>
            <motion.h1 variants={fadeUp} className="font-heading font-extrabold text-4xl sm:text-6xl text-white mb-6 leading-tight">
              Build the OS for{" "}
              <span className="text-gradient">Every Device</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg text-white/60 max-w-2xl mx-auto mb-8 leading-relaxed">
              Join a team of embedded engineers, AI researchers, and open-source advocates building the operating system that powers billions of devices — from wearables to aerospace systems.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-4 text-sm text-white/50">
              <span className="flex items-center gap-1.5"><Briefcase size={14} className="text-[#F97316]" />{JOBS.length} open positions</span>
              <span className="flex items-center gap-1.5"><MapPin size={14} className="text-[#F97316]" />Remote-first · SF Bay Area</span>
              <span className="flex items-center gap-1.5"><Heart size={14} className="text-[#F97316]" />501(c)(3) · 509(a)(2) · Mission-driven</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-[#080F1E]">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Rocket, color: "#F97316", title: "Global Impact", desc: "Work on technology that affects millions of devices and users worldwide." },
              { icon: Brain, color: "#8B5CF6", title: "Cutting-Edge Research", desc: "Collaborate with leading researchers in AI, neural interfaces, and embedded systems." },
              { icon: BookOpen, color: "#34D399", title: "Growth & Learning", desc: "Continuous learning opportunities, conference attendance, and skill development." },
              { icon: Home, color: "#06B6D4", title: "Work-Life Balance", desc: "Flexible schedules, remote options, and generous time-off policies." },
            ].map((v) => {
              const Icon = v.icon;
              return (
                <motion.div key={v.title} variants={fadeUp} className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
                  <div className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center" style={{ background: `${v.color}20` }}>
                    <Icon size={22} style={{ color: v.color }} />
                  </div>
                  <h3 className="font-heading font-bold text-white mb-2">{v.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{v.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="section-padding">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-10">
            <p className="text-xs font-bold tracking-widest uppercase text-[#F97316] mb-3">Open Positions</p>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white mb-4">
              {JOBS.length} Roles Across {DEPARTMENTS.length - 1} Departments
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              We are a remote-first, mission-driven team. Every role contributes directly to the EmbeddedOS Foundation's research and education mission.
            </p>
          </motion.div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            {/* Search */}
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="text"
                placeholder="Search positions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#F97316]/50"
              />
            </div>
            {/* Department filter */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <Filter size={14} className="text-white/30 flex-shrink-0" />
              {DEPARTMENTS.map((d) => (
                <button
                  key={d}
                  onClick={() => setDept(d)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                    dept === d
                      ? "bg-[#F97316] text-white"
                      : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {d} {deptCounts[d] > 0 && <span className="opacity-60">({deptCounts[d]})</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Job list */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-4">
            {filtered.length === 0 ? (
              <div className="text-center py-16 text-white/30">
                <Briefcase size={40} className="mx-auto mb-4 opacity-30" />
                <p>No positions match your search. Try a different filter.</p>
              </div>
            ) : (
              filtered.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  isOpen={openJob === job.id}
                  onToggle={() => setOpenJob(openJob === job.id ? null : job.id)}
                />
              ))
            )}
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-padding bg-[#080F1E]">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-12">
            <p className="text-xs font-bold tracking-widest uppercase text-[#F97316] mb-3">Benefits</p>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white mb-4">What We Offer</h2>
            <p className="text-white/50 max-w-xl mx-auto">Comprehensive benefits for our team members — because great work requires great support.</p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {BENEFITS.map((b) => {
              const Icon = b.icon;
              return (
                <motion.div key={b.title} variants={fadeUp} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <div className="w-11 h-11 rounded-xl mb-4 flex items-center justify-center" style={{ background: `${b.color}20` }}>
                    <Icon size={20} style={{ color: b.color }} />
                  </div>
                  <h3 className="font-heading font-bold text-white mb-2">{b.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{b.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.h2 variants={fadeUp} className="font-heading font-extrabold text-3xl sm:text-4xl text-white mb-4">
              Don't See Your Role?
            </motion.h2>
            <motion.p variants={fadeUp} className="text-white/50 mb-8 leading-relaxed">
              We're always looking for exceptional people. Send us your resume and tell us what you'd like to build — we'll reach out when the right opportunity opens.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="mailto:careers@embeddedos.org?subject=General Application"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#F97316] hover:bg-[#EA580C] text-white font-bold rounded-xl transition-all duration-150 active:scale-95"
              >
                Send Open Application
                <ExternalLink size={16} />
              </a>
              <Link
                href="/internship"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-xl transition-all duration-150 active:scale-95"
              >
                View Internships
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
