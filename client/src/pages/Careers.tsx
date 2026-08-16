import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Cpu,
  Brain,
  Shield,
  Code2,
  Rocket,
  Users,
  DollarSign,
  Heart,
  BookOpen,
  Home,
  MapPin,
  Briefcase,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Search,
  Filter,
  Zap,
  Globe,
  Database,
  Radio,
  Layers,
  Terminal,
  Star,
  GraduationCap,
  CheckCircle2,
  XCircle,
  Send,
  AlertCircle,
} from "lucide-react";
import { Link } from "wouter";
import {
  composeApplication,
  postApplication,
  shortMailto,
  CAREERS_ADDRESS,
} from "@/lib/application-email";
import { copyText } from "@/lib/clipboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BOARD_COUNT } from "@/data/stack";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

// ─── Job Data ─────────────────────────────────────────────────────────────────

const DEPARTMENTS = [
  "All",
  "Engineering",
  "Research",
  "Leadership",
  "Design",
  "Community",
];

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
    summary:
      "Design and maintain the EoS build system, Ninja backend integration, YAML configuration, and cross-compilation targets for ARM, x86, and RISC-V architectures.",
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
    summary:
      "Develop and maintain the EIPC secure IPC framework including capability-based authorization, audit logging, replay protection, and transport security for embedded systems.",
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
    summary: `Design staged boot architecture, A/B slot management, CRC/signature verification, and firmware upgrade APIs for the eBoot bootloader running on ${BOARD_COUNT} embedded boards.`,
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
    summary:
      "Build and maintain the eOffice Suite — 11 productivity apps (eWriter, eSheet, ePresent, eNotes, eDraw, eCalc, eCalendar, eContacts, eMail, eChat, eFiles) running on embedded displays.",
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
    summary:
      "Develop firmware for the eHealth365 wearable platform — Smart Ring Pro and Smart Patch Pro — including biometric sensor fusion, BLE communication, and real-time health monitoring algorithms.",
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
    summary:
      "Develop DSP algorithms and real-time signal processing pipelines for the eRadar360 / Aegis One 77 GHz FMCW radar system, including object detection, tracking, and classification.",
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
    summary:
      "Build and maintain eDB — a multi-model embedded database supporting SQL, Document, Key-Value, and AI-native query modes optimized for resource-constrained embedded systems.",
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
    summary:
      "Research and develop the EAI-Min edge runtime and EAI-Framework industrial AI platform, including llama.cpp/ONNX/TFLite optimization for resource-constrained embedded devices.",
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
    summary:
      "Research vendor-neutral BCI interfaces, neural signal processing, and ENI-Framework multi-lane routing for brain-computer interface integration with EmbeddedOS.",
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
    summary:
      "Lead fundraising initiatives, build relationships with donors and foundations, and develop grant proposals to support EmbeddedOS Foundation's research and education mission.",
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
    summary:
      "Oversee membership, certification, and internship programs. Drive growth and ensure excellent participant experiences across all EmbeddedOS Foundation programs.",
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
    summary:
      "Build and engage the global EmbeddedOS community of researchers, engineers, and enthusiasts. Manage forums, events, social media, and outreach programs.",
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
    summary:
      "Design intuitive user interfaces for embedded displays, developer tools, and the EmbeddedOS web platform. Bridge the gap between hardware constraints and great user experience.",
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
  {
    icon: BookOpen,
    title: "Real-World Open Source Work",
    desc: "Contribute to production-grade embedded OS code used by engineers worldwide.",
    color: "#F97316",
  },
  {
    icon: Users,
    title: "Mentorship",
    desc: "Work alongside experienced embedded engineers, researchers, and open-source maintainers.",
    color: "#8B5CF6",
  },
  {
    icon: Star,
    title: "Contribution Certificates",
    desc: "Receive formal certificates recognizing your contributions to the Foundation's projects.",
    color: "#10B981",
  },
  {
    icon: BookOpen,
    title: "Recommendation Letters",
    desc: "Eligible contributors receive professional recommendation letters from Foundation leadership.",
    color: "#06B6D4",
  },
  {
    icon: Rocket,
    title: "Publish Technical Work",
    desc: "Opportunities to co-author technical papers, blog posts, and participate in community initiatives.",
    color: "#EC4899",
  },
  {
    icon: Home,
    title: "Flexible & Remote-First",
    desc: "Remote-first culture with flexible hours. Work from anywhere in the world.",
    color: "#F59E0B",
  },
];

const DEPT_COLORS: Record<string, string> = {
  Engineering: "#F97316",
  Research: "#8B5CF6",
  Leadership: "#10B981",
  Design: "#06B6D4",
  Community: "#EC4899",
};

// ─── Internship Types ─────────────────────────────────────────────────────────

const INTERNSHIP_TYPES = [
  {
    title: "Paid Internships",
    desc: "Subject to project funding availability. Compensation is provided for qualifying roles.",
    color: "#F97316",
    icon: DollarSign,
  },
  {
    title: "Unpaid Internships",
    desc: "Available where permitted by applicable law. Participants receive certificates, mentorship, and recommendation letters.",
    color: "#8B5CF6",
    icon: Star,
  },
  {
    title: "Research Internships",
    desc: "Collaborate on active research projects in edge AI, neural interfaces, embedded security, and more.",
    color: "#10B981",
    icon: Brain,
  },
  {
    title: "Open Source Internships",
    desc: "Contribute to EmbeddedOS GitHub repositories under mentorship of core maintainers.",
    color: "#06B6D4",
    icon: Code2,
  },
  {
    title: "Capstone / Academic Project",
    desc: "Partner with the Foundation on your university capstone or thesis project.",
    color: "#EC4899",
    icon: GraduationCap,
  },
  {
    title: "F-1 CPT Internships",
    desc: "Curricular Practical Training for F-1 students. Requires CPT authorization from your DSO.",
    color: "#A78BFA",
    icon: Briefcase,
  },
  {
    title: "F-1 OPT Internships",
    desc: "Optional Practical Training for F-1 students. Standard OPT (12 months) and STEM OPT extension (24 months) accepted.",
    color: "#60A5FA",
    icon: Briefcase,
  },
  {
    title: "J-1 Intern / Trainee Programs",
    desc: "J-1 Exchange Visitor programs where program sponsor requirements are met.",
    color: "#34D399",
    icon: Globe,
  },
];

// ─── Work Authorization ───────────────────────────────────────────────────────

const ACCEPTED_AUTH = [
  "US Citizens",
  "Permanent Residents (Green Card holders)",
  "EAD holders (any category)",
  "F-1 CPT authorized students",
  "F-1 OPT authorized graduates",
  "F-1 STEM OPT extension holders",
  "J-1 Intern and Trainee program participants",
];

const NOT_SPONSORED = [
  "H-1B (we do not file petitions)",
  "O-1 Extraordinary Ability",
  "TN (Canada/Mexico professionals)",
  "E-3 (Australian professionals)",
  "L-1 Intracompany Transferee",
  "Green Card / Permanent Residency sponsorship",
];

// ─── Application Form ─────────────────────────────────────────────────────────

const ROLE_CATEGORIES = [
  "Software Engineer",
  "AI/ML Engineer",
  "Embedded Systems Engineer",
  "Full-Stack Developer",
  "DevOps & Cloud Engineer",
  "Research Engineer",
  "Technical Writer",
  "Open Source Contributor",
  "Student Intern",
  "Volunteer",
  "Research Fellow",
] as const;

const EMPLOYMENT_TYPES = [
  "Full-Time",
  "Part-Time",
  "Contractor",
  "Internship — Paid",
  "Internship — Unpaid",
  "Research Internship",
  "Open Source Internship",
  "Capstone / Academic Project",
  "F-1 CPT",
  "F-1 OPT",
  "F-1 STEM OPT",
  "J-1 Intern / Trainee",
  "Volunteer",
  "Research Fellow",
] as const;

const WORK_AUTH_OPTIONS = [
  "US Citizen",
  "Permanent Resident (Green Card)",
  "EAD Holder",
  "F-1 CPT Authorized",
  "F-1 OPT Authorized",
  "F-1 STEM OPT Authorized",
  "J-1 Intern / Trainee",
  "Other (please specify in statement)",
] as const;

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  portfolio: string;
  roleCategory: string;
  employmentType: string;
  workAuthorization: string;
  statement: string;
  availability: string;
  heardFrom: string;
};

const EMPTY_FORM: FormState = {
  fullName: "",
  email: "",
  phone: "",
  linkedin: "",
  github: "",
  portfolio: "",
  roleCategory: "",
  employmentType: "",
  workAuthorization: "",
  statement: "",
  availability: "",
  heardFrom: "",
};

/** What the confirmation panel needs to tell the applicant what to do next. */
type PreparedApplication = {
  subject: string;
  body: string;
  /** True when the body had to go to the clipboard instead of the mail draft. */
  viaClipboard: boolean;
  /** False when the clipboard was unavailable and the copy did not happen. */
  copied: boolean;
};

function ApplicationForm() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [prepared, setPrepared] = useState<PreparedApplication | null>(null);
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  /** Honeypot. Anything but "" here means the submitter was not a person. */
  const [honeypot, setHoneypot] = useState("");
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});

  const validate = (): boolean => {
    const errors: Partial<Record<keyof FormState, string>> = {};
    if (!form.fullName.trim() || form.fullName.trim().length < 2)
      errors.fullName = "Full name is required (min 2 characters).";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errors.email = "A valid email address is required.";
    if (!form.roleCategory)
      errors.roleCategory = "Please select a role category.";
    if (!form.employmentType)
      errors.employmentType = "Please select an employment type.";
    if (!form.workAuthorization)
      errors.workAuthorization =
        "Please select your work authorization status.";
    if (!form.statement.trim() || form.statement.trim().length < 50)
      errors.statement = "Statement must be at least 50 characters.";
    if (form.statement.trim().length > 3000)
      errors.statement = "Statement must be 3000 characters or fewer.";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Submit to the site's own endpoint, and fall back to a mail draft.
   *
   * /api/apply.php ships inside the static build and is the only first-party
   * way to accept a post here: no Node process runs in production. When it
   * answers `{ ok: true }` the application really has been delivered, and the
   * panel says so.
   *
   * Everything else falls back to composing a draft in the visitor's own mail
   * client — a host without PHP, an error, a timeout. That path says only that
   * a draft was prepared, never that the application was received, because the
   * send has not happened and this page cannot observe whether it does.
   *
   * The fallback is the point. The form previously posted to a tRPC route that
   * did not exist in production, and every application submitted through it was
   * lost while the applicant was shown a failure they could do nothing about.
   * An uncertain result has to end with the application in the applicant's own
   * hands rather than in nobody's.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || submitting) return;

    const fields = {
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || undefined,
      linkedin: form.linkedin.trim() || undefined,
      github: form.github.trim() || undefined,
      portfolio: form.portfolio.trim() || undefined,
      roleCategory: form.roleCategory,
      employmentType: form.employmentType,
      workAuthorization: form.workAuthorization,
      statement: form.statement.trim(),
      availability: form.availability.trim() || undefined,
      heardFrom: form.heardFrom.trim() || undefined,
    };

    setSubmitting(true);
    const delivered = await postApplication(fields, { honeypot });
    setSubmitting(false);

    if (delivered) {
      setSent(true);
      toast.success("Application sent. A confirmation is on its way to you.");
      return;
    }

    const { subject, body, mailtoUrl } = composeApplication(fields);

    // A long statement cannot ride in the URL, so it goes to the clipboard and
    // the draft opens empty for the applicant to paste into.
    const viaClipboard = mailtoUrl === null;
    const copied = await copyText(body);

    window.location.href = mailtoUrl ?? shortMailto(subject);
    setPrepared({ subject, body, viaClipboard, copied });

    if (viaClipboard && !copied) {
      toast.error(
        "Your statement is too long for an email link and the clipboard was blocked. Copy the text below by hand."
      );
    } else if (viaClipboard) {
      toast.success("Application copied — paste it into the email that opens.");
    } else {
      toast.success(
        "Draft email prepared. Send it to complete your application."
      );
    }
  };

  const set =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm(prev => ({ ...prev, [field]: e.target.value }));
      if (fieldErrors[field])
        setFieldErrors(prev => ({ ...prev, [field]: undefined }));
    };

  // The endpoint confirmed delivery, so this panel may say so outright. The
  // draft panel below deliberately may not.
  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl border border-[#34D399]/30 bg-[#34D399]/10 p-8 text-center"
      >
        <Send size={44} className="text-[#34D399] mx-auto mb-4" />
        <h3 className="font-heading font-bold text-2xl text-white mb-2">
          Application received
        </h3>
        <p className="text-white/60 mb-6 max-w-lg mx-auto">
          Thank you — your application reached{" "}
          <span className="text-white/80">{CAREERS_ADDRESS}</span> and a
          confirmation is on its way to your inbox. A person reads every one; we
          usually reply within 5–10 business days.
        </p>
        <p className="text-sm text-white/50 mb-6 max-w-lg mx-auto">
          To add a CV, reply to that confirmation email with it attached.
        </p>
        <button
          type="button"
          onClick={() => {
            setSent(false);
            setForm(EMPTY_FORM);
          }}
          className="px-5 py-2.5 rounded-xl border border-white/20 hover:border-white/40 hover:bg-white/5 text-white text-sm font-semibold transition-all"
        >
          Submit another application
        </button>
      </motion.div>
    );
  }

  if (prepared) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl border border-[#34D399]/30 bg-[#34D399]/10 p-8"
      >
        <div className="text-center">
          <Send size={44} className="text-[#34D399] mx-auto mb-4" />
          <h3 className="font-heading font-bold text-2xl text-white mb-2">
            One step left — send the email
          </h3>
          <p className="text-white/60 mb-6 max-w-lg mx-auto">
            Your application is prepared as an email to{" "}
            <span className="text-white/80">{CAREERS_ADDRESS}</span>. Your mail
            app should have opened with it.{" "}
            <span className="text-[#FDBA74]">
              It is not sent until you send it
            </span>{" "}
            — and you can attach your CV before you do.
          </p>
        </div>

        {prepared.viaClipboard && (
          <p className="text-sm text-white/60 bg-white/5 border border-white/10 rounded-lg p-4 mb-5">
            {prepared.copied
              ? "Your statement was too long to fit in the email link, so the full application has been copied to your clipboard. Paste it into the message body before sending."
              : "Your statement was too long to fit in the email link, and the clipboard was unavailable. Copy the text below into the message body before sending."}
          </p>
        )}

        <details className="mb-6 group">
          <summary className="cursor-pointer text-sm text-white/50 hover:text-white/80 transition-colors">
            Show the application text
          </summary>
          <pre className="mt-3 max-h-64 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-black/30 border border-white/10 p-4 text-xs text-white/70 font-mono">
            {prepared.body}
          </pre>
        </details>

        <div className="flex flex-wrap gap-3 justify-center">
          <a
            href={
              prepared.viaClipboard
                ? shortMailto(prepared.subject)
                : composeApplication({
                    ...form,
                    phone: form.phone || undefined,
                  }).mailtoUrl || shortMailto(prepared.subject)
            }
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#F97316] hover:bg-[#EA580C] text-white text-sm font-semibold transition-colors"
          >
            <Send size={15} /> Reopen the email
          </a>
          <Button
            variant="outline"
            className="border-white/20 text-white/70 hover:bg-white/10"
            onClick={async () => {
              const ok = await copyText(prepared.body);
              if (ok) toast.success("Application copied to clipboard.");
              else toast.error("The clipboard is unavailable in this browser.");
            }}
          >
            Copy application text
          </Button>
          <Button
            variant="outline"
            className="border-white/20 text-white/70 hover:bg-white/10"
            onClick={() => {
              setPrepared(null);
              setForm(EMPTY_FORM);
            }}
          >
            Start another application
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/*
        Honeypot. Hidden from people and from assistive technology, so anyone
        who fills it in is automated; the endpoint then answers 200 without
        sending, which gives a bot nothing to learn from. Positioned off-screen
        rather than `display:none`, which some bots skip.
      */}
      <div className="absolute left-[-9999px] top-auto w-px h-px overflow-hidden">
        <label htmlFor="website">Leave this field empty</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          value={honeypot}
          onChange={e => setHoneypot(e.target.value)}
        />
      </div>
      {/* Identity */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="fullName" className="text-white/80 text-sm">
            Full Name <span className="text-[#F97316]">*</span>
          </Label>
          <Input
            id="fullName"
            value={form.fullName}
            onChange={set("fullName")}
            placeholder="Jane Smith"
            className="bg-white/5 border-white/10 text-white placeholder-white/30 focus:border-[#F97316]/50"
          />
          {fieldErrors.fullName && (
            <p className="text-xs text-red-400 flex items-center gap-1">
              <AlertCircle size={12} />
              {fieldErrors.fullName}
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-white/80 text-sm">
            Email Address <span className="text-[#F97316]">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={set("email")}
            placeholder="jane@example.com"
            className="bg-white/5 border-white/10 text-white placeholder-white/30 focus:border-[#F97316]/50"
          />
          {fieldErrors.email && (
            <p className="text-xs text-red-400 flex items-center gap-1">
              <AlertCircle size={12} />
              {fieldErrors.email}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="phone" className="text-white/80 text-sm">
          Phone (optional)
        </Label>
        <Input
          id="phone"
          value={form.phone}
          onChange={set("phone")}
          placeholder="+1 (555) 000-0000"
          className="bg-white/5 border-white/10 text-white placeholder-white/30 focus:border-[#F97316]/50"
        />
      </div>

      {/* Links */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="linkedin" className="text-white/80 text-sm">
            LinkedIn URL (optional)
          </Label>
          <Input
            id="linkedin"
            value={form.linkedin}
            onChange={set("linkedin")}
            placeholder="https://linkedin.com/in/..."
            className="bg-white/5 border-white/10 text-white placeholder-white/30 focus:border-[#F97316]/50"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="github" className="text-white/80 text-sm">
            GitHub URL (optional)
          </Label>
          <Input
            id="github"
            value={form.github}
            onChange={set("github")}
            placeholder="https://github.com/..."
            className="bg-white/5 border-white/10 text-white placeholder-white/30 focus:border-[#F97316]/50"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="portfolio" className="text-white/80 text-sm">
          Portfolio / Personal Website (optional)
        </Label>
        <Input
          id="portfolio"
          value={form.portfolio}
          onChange={set("portfolio")}
          placeholder="https://..."
          className="bg-white/5 border-white/10 text-white placeholder-white/30 focus:border-[#F97316]/50"
        />
      </div>

      {/* Role & Employment */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-white/80 text-sm">
            Role Category <span className="text-[#F97316]">*</span>
          </Label>
          <Select
            value={form.roleCategory}
            onValueChange={v => {
              setForm(p => ({ ...p, roleCategory: v }));
              setFieldErrors(p => ({ ...p, roleCategory: undefined }));
            }}
          >
            <SelectTrigger className="bg-white/5 border-white/10 text-white focus:border-[#F97316]/50">
              <SelectValue placeholder="Select a role..." />
            </SelectTrigger>
            <SelectContent className="bg-[#0D1829] border-white/10">
              {ROLE_CATEGORIES.map(r => (
                <SelectItem
                  key={r}
                  value={r}
                  className="text-white/80 focus:bg-white/10 focus:text-white"
                >
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {fieldErrors.roleCategory && (
            <p className="text-xs text-red-400 flex items-center gap-1">
              <AlertCircle size={12} />
              {fieldErrors.roleCategory}
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label className="text-white/80 text-sm">
            Employment Type <span className="text-[#F97316]">*</span>
          </Label>
          <Select
            value={form.employmentType}
            onValueChange={v => {
              setForm(p => ({ ...p, employmentType: v }));
              setFieldErrors(p => ({ ...p, employmentType: undefined }));
            }}
          >
            <SelectTrigger className="bg-white/5 border-white/10 text-white focus:border-[#F97316]/50">
              <SelectValue placeholder="Select type..." />
            </SelectTrigger>
            <SelectContent className="bg-[#0D1829] border-white/10">
              {EMPLOYMENT_TYPES.map(t => (
                <SelectItem
                  key={t}
                  value={t}
                  className="text-white/80 focus:bg-white/10 focus:text-white"
                >
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {fieldErrors.employmentType && (
            <p className="text-xs text-red-400 flex items-center gap-1">
              <AlertCircle size={12} />
              {fieldErrors.employmentType}
            </p>
          )}
        </div>
      </div>

      {/* Work Authorization */}
      <div className="space-y-1.5">
        <Label className="text-white/80 text-sm">
          Work Authorization <span className="text-[#F97316]">*</span>
        </Label>
        <Select
          value={form.workAuthorization}
          onValueChange={v => {
            setForm(p => ({ ...p, workAuthorization: v }));
            setFieldErrors(p => ({ ...p, workAuthorization: undefined }));
          }}
        >
          <SelectTrigger className="bg-white/5 border-white/10 text-white focus:border-[#F97316]/50">
            <SelectValue placeholder="Select authorization status..." />
          </SelectTrigger>
          <SelectContent className="bg-[#0D1829] border-white/10">
            {WORK_AUTH_OPTIONS.map(a => (
              <SelectItem
                key={a}
                value={a}
                className="text-white/80 focus:bg-white/10 focus:text-white"
              >
                {a}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {fieldErrors.workAuthorization && (
          <p className="text-xs text-red-400 flex items-center gap-1">
            <AlertCircle size={12} />
            {fieldErrors.workAuthorization}
          </p>
        )}
        <p className="text-xs text-white/30">
          We do not sponsor H-1B, O-1, TN, E-3, L-1, or Green Card petitions.
          See Work Authorization section above.
        </p>
      </div>

      {/* Statement */}
      <div className="space-y-1.5">
        <Label htmlFor="statement" className="text-white/80 text-sm">
          Statement of Interest <span className="text-[#F97316]">*</span>
          <span className="ml-2 text-white/30 font-normal">
            ({form.statement.length}/3000 chars, min 50)
          </span>
        </Label>
        <Textarea
          id="statement"
          value={form.statement}
          onChange={set("statement")}
          rows={6}
          placeholder="Tell us about your background, what you'd like to work on, and why you're interested in EmbeddedOS..."
          className="bg-white/5 border-white/10 text-white placeholder-white/30 focus:border-[#F97316]/50 resize-y"
        />
        {fieldErrors.statement && (
          <p className="text-xs text-red-400 flex items-center gap-1">
            <AlertCircle size={12} />
            {fieldErrors.statement}
          </p>
        )}
      </div>

      {/* Availability & How heard */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="availability" className="text-white/80 text-sm">
            Availability (optional)
          </Label>
          <Input
            id="availability"
            value={form.availability}
            onChange={set("availability")}
            placeholder="e.g. Available from Sept 2026, 20 hrs/week"
            className="bg-white/5 border-white/10 text-white placeholder-white/30 focus:border-[#F97316]/50"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="heardFrom" className="text-white/80 text-sm">
            How did you hear about us? (optional)
          </Label>
          <Input
            id="heardFrom"
            value={form.heardFrom}
            onChange={set("heardFrom")}
            placeholder="e.g. GitHub, LinkedIn, a friend..."
            className="bg-white/5 border-white/10 text-white placeholder-white/30 focus:border-[#F97316]/50"
          />
        </div>
      </div>

      {/* Submit */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
        {/* Composing the email is synchronous, so there is no pending state to
            show — and no "Submitting…" label, which would claim a transmission
            this page does not perform. */}
        <Button
          type="submit"
          disabled={submitting}
          className="bg-[#F97316] hover:bg-[#EA580C] text-white font-bold px-8 py-3 rounded-xl transition-all duration-150 active:scale-95 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Send size={16} />
          {submitting ? "Sending…" : "Send Application"}
        </Button>
        <p className="text-xs text-white/30">
          Or email directly:{" "}
          <a
            href="mailto:careers@embeddedos.org"
            className="text-[#F97316] hover:underline"
          >
            careers@embeddedos.org
          </a>
        </p>
      </div>
    </form>
  );
}

// ─── Job Card ─────────────────────────────────────────────────────────────────

function JobCard({
  job,
  isOpen,
  onToggle,
}: {
  job: (typeof JOBS)[0];
  isOpen: boolean;
  onToggle: () => void;
}) {
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
          style={{
            background: `${job.color}20`,
            border: `1px solid ${job.color}40`,
          }}
        >
          <Icon size={22} style={{ color: job.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="font-heading font-bold text-white text-lg leading-tight">
              {job.title}
            </h3>
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{
                background: `${DEPT_COLORS[job.department]}20`,
                color: DEPT_COLORS[job.department],
              }}
            >
              {job.department}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/10 text-white/60">
              {job.level}
            </span>
          </div>
          <p className="text-white/50 text-sm mb-3 leading-relaxed">
            {job.summary}
          </p>
          <div className="flex flex-wrap gap-3 text-xs text-white/40">
            <span className="flex items-center gap-1.5">
              <Briefcase size={12} />
              {job.type}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin size={12} />
              {job.location}
            </span>
            <span className="flex items-center gap-1.5">
              <Users size={12} />
              {job.team}
            </span>
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
                  <Star size={14} style={{ color: job.color }} />{" "}
                  Responsibilities
                </h4>
                <ul className="space-y-2">
                  {job.responsibilities.map((r, i) => (
                    <li key={i} className="text-sm text-white/60 flex gap-2">
                      <span
                        className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: job.color }}
                      />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Requirements + Nice to Have */}
              <div className="space-y-5">
                <div>
                  <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                    <Code2 size={14} style={{ color: job.color }} />{" "}
                    Requirements
                  </h4>
                  <ul className="space-y-2">
                    {job.requirements.map((r, i) => (
                      <li key={i} className="text-sm text-white/60 flex gap-2">
                        <span
                          className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ background: job.color }}
                        />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
                {job.niceToHave && (
                  <div>
                    <h4 className="text-sm font-bold text-white/60 mb-3">
                      Nice to Have
                    </h4>
                    <ul className="space-y-2">
                      {job.niceToHave.map((r, i) => (
                        <li
                          key={i}
                          className="text-sm text-white/40 flex gap-2"
                        >
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
                href="#apply"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all duration-150 active:scale-95"
                style={{ background: job.color }}
                onClick={e => {
                  e.preventDefault();
                  document
                    .getElementById("apply")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Apply Now
                <ExternalLink size={14} />
              </a>
              <span className="text-xs text-white/30">
                or email careers@embeddedos.org
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Careers() {
  const [openJob, setOpenJob] = useState<string | null>(null);
  const [dept, setDept] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = JOBS.filter(j => {
    const matchDept = dept === "All" || j.department === dept;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      j.title.toLowerCase().includes(q) ||
      j.team.toLowerCase().includes(q) ||
      j.summary.toLowerCase().includes(q);
    return matchDept && matchSearch;
  });

  const deptCounts = DEPARTMENTS.reduce<Record<string, number>>((acc, d) => {
    acc[d] =
      d === "All" ? JOBS.length : JOBS.filter(j => j.department === d).length;
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
            <motion.p
              variants={fadeUp}
              className="text-xs font-bold tracking-widest uppercase text-[#F97316] mb-4"
            >
              Join the Foundation
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className="font-heading font-extrabold text-4xl sm:text-6xl text-white mb-6 leading-tight"
            >
              Build the OS for{" "}
              <span className="text-gradient">Every Device</span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="text-lg text-white/60 max-w-2xl mx-auto mb-8 leading-relaxed"
            >
              Join a team of embedded engineers, AI researchers, and open-source
              advocates building the operating system that powers billions of
              devices — from wearables to aerospace systems.
            </motion.p>
            <motion.div
              variants={fadeUp}
              className="flex flex-wrap items-center justify-center gap-4 text-sm text-white/50"
            >
              <span className="flex items-center gap-1.5">
                <Briefcase size={14} className="text-[#F97316]" />
                {JOBS.length} open positions
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin size={14} className="text-[#F97316]" />
                Remote-first · SF Bay Area
              </span>
              <span className="flex items-center gap-1.5">
                <Heart size={14} className="text-[#F97316]" />
                501(c)(3) · 509(a)(2) Public Charity
              </span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-[#080F1E]">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              {
                icon: Rocket,
                color: "#F97316",
                title: "Global Impact",
                desc: "Work on technology that affects millions of devices and users worldwide.",
              },
              {
                icon: Brain,
                color: "#8B5CF6",
                title: "Cutting-Edge Research",
                desc: "Collaborate with leading researchers in AI, neural interfaces, and embedded systems.",
              },
              {
                icon: BookOpen,
                color: "#34D399",
                title: "Growth & Learning",
                desc: "Continuous learning opportunities, mentorship, and skill development.",
              },
              {
                icon: Home,
                color: "#06B6D4",
                title: "Remote-First",
                desc: "Flexible schedules, remote opportunities, and a globally distributed team.",
              },
            ].map(v => {
              const Icon = v.icon;
              return (
                <motion.div
                  key={v.title}
                  variants={fadeUp}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center"
                >
                  <div
                    className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center"
                    style={{ background: `${v.color}20` }}
                  >
                    <Icon size={22} style={{ color: v.color }} />
                  </div>
                  <h3 className="font-heading font-bold text-white mb-2">
                    {v.title}
                  </h3>
                  <p className="text-sm text-white/50 leading-relaxed">
                    {v.desc}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="section-padding">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-10"
          >
            <p className="text-xs font-bold tracking-widest uppercase text-[#F97316] mb-3">
              Open Positions
            </p>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white mb-4">
              {JOBS.length} Roles Across {DEPARTMENTS.length - 1} Departments
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              We are a remote-first, mission-driven team. Every role contributes
              directly to the EmbeddedOS Foundation's research and education
              mission.
            </p>
          </motion.div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
              />
              <input
                type="text"
                placeholder="Search positions..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#F97316]/50"
              />
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <Filter size={14} className="text-white/30 flex-shrink-0" />
              {DEPARTMENTS.map(d => (
                <button
                  key={d}
                  onClick={() => setDept(d)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                    dept === d
                      ? "bg-[#F97316] text-white"
                      : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {d}{" "}
                  {deptCounts[d] > 0 && (
                    <span className="opacity-60">({deptCounts[d]})</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Job list */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="space-y-4"
          >
            {filtered.length === 0 ? (
              <div className="text-center py-16 text-white/30">
                <Briefcase size={40} className="mx-auto mb-4 opacity-30" />
                <p>No positions match your search. Try a different filter.</p>
              </div>
            ) : (
              filtered.map(job => (
                <JobCard
                  key={job.id}
                  job={job}
                  isOpen={openJob === job.id}
                  onToggle={() =>
                    setOpenJob(openJob === job.id ? null : job.id)
                  }
                />
              ))
            )}
          </motion.div>
        </div>
      </section>

      {/* Internship Types */}
      <section className="section-padding bg-[#080F1E]">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-12"
          >
            <p className="text-xs font-bold tracking-widest uppercase text-[#F97316] mb-3">
              Internships & Fellowships
            </p>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white mb-4">
              Internship Program Types
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              We offer a range of internship structures to accommodate different
              academic programs, visa statuses, and career stages.
            </p>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {INTERNSHIP_TYPES.map(it => {
              const Icon = it.icon;
              return (
                <motion.div
                  key={it.title}
                  variants={fadeUp}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5"
                >
                  <div
                    className="w-10 h-10 rounded-xl mb-3 flex items-center justify-center"
                    style={{ background: `${it.color}20` }}
                  >
                    <Icon size={18} style={{ color: it.color }} />
                  </div>
                  <h3 className="font-heading font-bold text-white text-sm mb-2">
                    {it.title}
                  </h3>
                  <p className="text-xs text-white/50 leading-relaxed">
                    {it.desc}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mt-8 text-center"
          >
            <Link
              href="/internship"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-xl transition-all duration-150 active:scale-95 text-sm"
            >
              View Full Internship & Fellowship Guide
              <ExternalLink size={14} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Work Authorization */}
      <section className="section-padding">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-12"
          >
            <p className="text-xs font-bold tracking-widest uppercase text-[#F97316] mb-3">
              Eligibility
            </p>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white mb-4">
              Work Authorization
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              EmbeddedOS Research Foundation is a California-based 501(c)(3)
              nonprofit. Please review our work authorization policy before
              applying.
            </p>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid md:grid-cols-2 gap-8"
          >
            {/* Accepted */}
            <motion.div
              variants={fadeUp}
              className="rounded-2xl border border-[#34D399]/20 bg-[#34D399]/5 p-7"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-[#34D399]/20 flex items-center justify-center">
                  <CheckCircle2 size={20} className="text-[#34D399]" />
                </div>
                <h3 className="font-heading font-bold text-white text-lg">
                  We Accept
                </h3>
              </div>
              <ul className="space-y-3">
                {ACCEPTED_AUTH.map(a => (
                  <li
                    key={a}
                    className="flex items-start gap-2.5 text-sm text-white/70"
                  >
                    <CheckCircle2
                      size={14}
                      className="text-[#34D399] mt-0.5 flex-shrink-0"
                    />
                    {a}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Not sponsored */}
            <motion.div
              variants={fadeUp}
              className="rounded-2xl border border-red-500/20 bg-red-500/5 p-7"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                  <XCircle size={20} className="text-red-400" />
                </div>
                <h3 className="font-heading font-bold text-white text-lg">
                  We Do Not Sponsor
                </h3>
              </div>
              <ul className="space-y-3">
                {NOT_SPONSORED.map(a => (
                  <li
                    key={a}
                    className="flex items-start gap-2.5 text-sm text-white/70"
                  >
                    <XCircle
                      size={14}
                      className="text-red-400 mt-0.5 flex-shrink-0"
                    />
                    {a}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-white/30 mt-5 leading-relaxed">
                As a nonprofit foundation, we are unable to file visa petitions.
                Applicants must already hold or be eligible for independent work
                authorization.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-padding bg-[#080F1E]">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-12"
          >
            <p className="text-xs font-bold tracking-widest uppercase text-[#F97316] mb-3">
              Benefits
            </p>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white mb-4">
              What We Offer
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              As a nonprofit foundation, our benefits focus on professional
              growth, open-source recognition, and community impact.
            </p>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {BENEFITS.map(b => {
              const Icon = b.icon;
              return (
                <motion.div
                  key={b.title}
                  variants={fadeUp}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6"
                >
                  <div
                    className="w-11 h-11 rounded-xl mb-4 flex items-center justify-center"
                    style={{ background: `${b.color}20` }}
                  >
                    <Icon size={20} style={{ color: b.color }} />
                  </div>
                  <h3 className="font-heading font-bold text-white mb-2">
                    {b.title}
                  </h3>
                  <p className="text-sm text-white/50 leading-relaxed">
                    {b.desc}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Application Form */}
      <section id="apply" className="section-padding">
        <div className="max-w-3xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-10"
          >
            <p className="text-xs font-bold tracking-widest uppercase text-[#F97316] mb-3">
              Apply
            </p>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white mb-4">
              Submit Your Application
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              Fill out the form below or email your resume and statement of
              interest directly to{" "}
              <a
                href="mailto:careers@embeddedos.org"
                className="text-[#F97316] hover:underline"
              >
                careers@embeddedos.org
              </a>
              .
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-8"
          >
            <ApplicationForm />
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-[#080F1E]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.h2
              variants={fadeUp}
              className="font-heading font-extrabold text-3xl sm:text-4xl text-white mb-4"
            >
              Don't See Your Role?
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-white/50 mb-8 leading-relaxed"
            >
              We're always looking for exceptional people. Send us your resume
              and tell us what you'd like to build — we'll reach out when the
              right opportunity opens.
            </motion.p>
            <motion.div
              variants={fadeUp}
              className="flex flex-wrap items-center justify-center gap-4"
            >
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
