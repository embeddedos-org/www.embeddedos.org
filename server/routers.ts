import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";
import { donationRouter } from "./donationRouter";
import { sendApplicationEmails } from "./email.js";
// ── eBot system prompt ────────────────────────────────────────────────────────
const EBOT_SYSTEM = `You are eBot, the AI assistant for EmbeddedOS — the open-source operating system for every device.

EmbeddedOS is a nonprofit, open-source platform that powers IoT sensors, edge AI, automotive systems, industrial controllers, wearable health devices, and aerospace vehicles.

Key projects you know about:
- EoS Kernel: Real-time embedded OS, MIT License, supports 52+ hardware platforms
- eBoot: Secure bootloader with OTA delta updates and rollback protection
- eIPC: Ultra-low latency inter-process communication for embedded systems
- ebuild: One-command cross-compilation build system (like "ebuild build --target stm32h7")
- eAI: On-device AI inference with TFLite, ONNX, and eosllm
- eNI: Neural interface framework for embedded neural networks
- eApps: 60+ applications including eOffice suite (11 apps), eBrowser, eDB
- EoSim: Hardware simulator supporting 63+ virtual boards
- EoStudio: IDE for EmbeddedOS development
- HEALTH-KEY ULTRA: Patent-pending smart health key with 12+ biometric sensors
- HEALTH-BAND Neuro: Patent-pending neural health band
- HEALTH-RING: Smart health ring
- HEALTH-LAB: Portable health laboratory device
- AeroSwift Personal (AS-1/2): Personal VTOL aircraft powered by AeroOS
- AeroSwift Transit (AS-10): Urban air taxi, 10-passenger VTOL

Hardware support: ARM Cortex-M/A, RISC-V, Xtensa, AVR, automotive SoCs (52+ boards)
License: MIT
GitHub: https://github.com/embeddedos-org

Be concise, technical, and helpful. Answer questions about EmbeddedOS, its projects, how to get started, hardware support, and the health/aerospace products. If asked about something outside EmbeddedOS, politely redirect to relevant EmbeddedOS topics.`;

// ── Careers / Job Applications ────────────────────────────────────────────────
export const careersRouter = router({
  submitApplication: publicProcedure
    .input(
      z.object({
        fullName: z.string().min(2).max(120),
        email: z.string().email(),
        phone: z.string().max(30).optional(),
        linkedin: z.string().max(300).optional().or(z.literal("")),
        github: z.string().max(300).optional().or(z.literal("")),
        portfolio: z.string().max(300).optional().or(z.literal("")),
        roleCategory: z.enum([
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
        ]),
        employmentType: z.enum([
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
        ]),
        workAuthorization: z.enum([
          "US Citizen",
          "Permanent Resident (Green Card)",
          "EAD Holder",
          "F-1 CPT Authorized",
          "F-1 OPT Authorized",
          "F-1 STEM OPT Authorized",
          "J-1 Intern / Trainee",
          "Other (please specify in statement)",
        ]),
        statement: z.string().min(50).max(3000),
        availability: z.string().max(200).optional(),
        heardFrom: z.string().max(200).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { notifyOwner } = await import("./_core/notification.js");
      const lines = [
        `**New Job Application — EmbeddedOS Research Foundation**`,
        ``,
        `**Applicant:** ${input.fullName}`,
        `**Email:** ${input.email}`,
        input.phone ? `**Phone:** ${input.phone}` : null,
        `**Role Category:** ${input.roleCategory}`,
        `**Employment Type:** ${input.employmentType}`,
        `**Work Authorization:** ${input.workAuthorization}`,
        input.availability ? `**Availability:** ${input.availability}` : null,
        ``,
        `**Links:**`,
        input.linkedin ? `- LinkedIn: ${input.linkedin}` : `- LinkedIn: not provided`,
        input.github ? `- GitHub: ${input.github}` : `- GitHub: not provided`,
        input.portfolio ? `- Portfolio: ${input.portfolio}` : null,
        ``,
        `**Statement of Interest:**`,
        input.statement,
        input.heardFrom ? `\n**How they heard about us:** ${input.heardFrom}` : null,
        ``,
        `---`,
        `Submitted: ${new Date().toISOString()}`,
      ].filter((l): l is string => l !== null);
      await notifyOwner({
        title: `Job Application: ${input.fullName} — ${input.roleCategory}`,
        content: lines.join("\n"),
      });
      // Send SMTP emails: notification to careers@embeddedos.org + confirmation to applicant
      await sendApplicationEmails(input).catch((err) => {
        console.error("[Careers] Email send failed (non-fatal):", err);
      });
      return { success: true };
    }),
});


export const appRouter = router({
  system: systemRouter,
  donation: donationRouter,
  careers: careersRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ── eBot AI chat ──────────────────────────────────────────────────────────
  ebot: router({
    chat: publicProcedure
      .input(
        z.object({
          messages: z.array(
            z.object({
              role: z.enum(["user", "assistant"]),
              content: z.string(),
            })
          ),
        })
      )
      .mutation(async ({ input }) => {
        const result = await invokeLLM({
          messages: [
            { role: "system", content: EBOT_SYSTEM },
            ...input.messages.map(m => ({ role: m.role as "user" | "assistant", content: m.content })),
          ],
          maxTokens: 600,
        });

        const content = result.choices[0]?.message?.content;
        const text = typeof content === "string" ? content : Array.isArray(content) ? content.map(c => (c as { text?: string }).text ?? "").join("") : "";
        return { reply: text };
      }),
  }),

  // ── Global search ─────────────────────────────────────────────────────────
  search: router({
    query: publicProcedure
      .input(z.object({ q: z.string().min(1).max(200) }))
      .query(async ({ input }) => {
        const q = input.q.toLowerCase().trim();

        const PAGES = [
          { title: "Home", path: "/", tags: ["embeddedos", "operating system", "iot", "embedded", "open source", "home"] },
          { title: "Getting Started", path: "/getting-started", tags: ["install", "setup", "quickstart", "tutorial", "beginner", "start", "getting started"] },
          { title: "Documentation", path: "/docs", tags: ["docs", "documentation", "api", "reference", "guide", "manual"] },
          { title: "Books", path: "/books", tags: ["books", "learning", "education", "pdf", "read", "book"] },
          { title: "eFlow Visual Programming", path: "/flow", tags: ["flow", "visual programming", "eflow", "no-code", "drag drop", "flowchart"] },
          { title: "Hardware Lab", path: "/hardware-lab", tags: ["hardware", "boards", "arm", "risc-v", "stm32", "esp32", "raspberry", "bsp", "platform", "cortex", "nrf", "arduino"] },
          { title: "Technology Stacks", path: "/stacks", tags: ["stack", "technology", "bare metal", "iot", "ai", "automotive", "health", "tech"] },
          { title: "eApps Store", path: "/eapps", tags: ["apps", "applications", "eoffice", "ebrowser", "edb", "store", "eapps"] },
          { title: "Kids Edition", path: "/kids", tags: ["kids", "children", "education", "learn", "school", "beginner", "junior"] },
          { title: "Get Involved", path: "/get-involved", tags: ["contribute", "community", "open source", "github", "pr", "volunteer", "join"] },
          { title: "All Projects", path: "/projects", tags: ["projects", "repos", "github", "eos", "eboot", "eipc", "eai", "eni", "repositories"] },
          { title: "Health Devices", path: "/health", tags: ["health", "wearable", "key ultra", "band neuro", "ring", "lab", "biometric", "patent", "medical"] },
          { title: "Aerospace", path: "/aerospace", tags: ["aerospace", "aeroswift", "vtol", "aircraft", "drone", "aviation", "aeros", "flight"] },
          // Product-level entries
          { title: "HEALTH-KEY ULTRA", path: "/health", tags: ["health key ultra", "key ultra", "usb health", "ecg pendrive", "bac", "blood oxygen", "patent"] },
          { title: "HEALTH-BAND Neuro", path: "/health", tags: ["health band", "band neuro", "semg", "neural band", "tens", "gesture control", "wristband"] },
          { title: "HEALTH-RING", path: "/health", tags: ["health ring", "smart ring", "ring", "afib", "hba1c", "titanium ring", "sleep ring"] },
          { title: "HEALTH-LAB", path: "/health", tags: ["health lab", "biosensor", "patch", "glucose", "cortisol", "lactate", "14 day"] },
          { title: "AeroSwift Personal (AS-1/2)", path: "/aerospace", tags: ["aeroswift personal", "as-1", "as-2", "personal aircraft", "pav", "vtol personal", "solar aircraft"] },
          { title: "AeroSwift Transit (AS-10)", path: "/aerospace", tags: ["aeroswift transit", "as-10", "air taxi", "uam", "urban air", "10 passenger", "vtol taxi"] },
          { title: "EoS Kernel", path: "/projects", tags: ["eos kernel", "kernel", "rtos", "real time os", "embedded os"] },
          { title: "eAI Inference", path: "/projects", tags: ["eai", "ai inference", "tflite", "onnx", "on device ai", "neural"] },
          { title: "EoSim Simulator", path: "/projects", tags: ["eosim", "simulator", "emulator", "virtual board", "simulation"] },
          { title: "About the Foundation", path: "/about", tags: ["about", "foundation", "nonprofit", "mission", "501c3", "history", "team", "values"] },
          { title: "Mission & Scope", path: "/mission", tags: ["mission", "scope", "charitable purpose", "programmes", "programs", "501c3", "nonprofit", "what we do", "out of scope", "public benefit"] },
          { title: "Industries We Serve", path: "/industries", tags: ["industries", "sectors", "aerospace", "defence", "defense", "automotive", "medical", "rail", "energy", "robotics", "cad", "hardware", "standards", "trl", "certification", "grant"] },
          { title: "Transparency & Accountability", path: "/transparency", tags: ["transparency", "accountability", "ein", "irs", "501c3", "finances", "annual report", "form 990", "governance", "use of funds", "policies"] },
          { title: "Donate", path: "/donate", tags: ["donate", "donation", "zeffy", "support", "fund", "501c3", "tax deductible", "contribute"] },
          { title: "News & Updates", path: "/news", tags: ["news", "updates", "releases", "announcements", "blog", "changelog", "latest"] },
          { title: "Privacy Policy", path: "/privacy", tags: ["privacy", "policy", "data", "gdpr", "legal"] },
          { title: "Terms of Use", path: "/terms", tags: ["terms", "legal", "license", "use", "conditions"] },
          { title: "Membership", path: "/membership", tags: ["membership", "member", "join", "supporter", "sponsor", "contributor", "enterprise", "tier", "foundation"] },
          { title: "EoSim Demo", path: "/demo", tags: ["eosim", "demo", "simulator", "simulation", "gpio", "uart", "stm32", "esp32", "rpi", "pico", "board", "hardware", "embedded", "firmware"] },
          { title: "Health Device Comparison", path: "/health-compare", tags: ["health", "compare", "comparison", "devices", "health-key", "health-band", "health-ring", "health-lab", "specs", "features", "ecg", "spo2", "emg", "glucose"] },
          { title: "Products — What We Build", path: "/products", tags: ["products", "what we build", "ecosystem", "platform", "eos", "eboot", "eai", "eni", "eoffice", "eapps", "health", "aerospace", "devtools", "overview"] },
          { title: "EoS Kernel", path: "/eos", tags: ["eos", "kernel", "rtos", "real-time", "operating system", "embedded os", "hal", "driver", "scheduler", "posix", "stm32", "esp32", "mcu", "firmware"] },
          { title: "eBoot Bootloader", path: "/eboot", tags: ["eboot", "bootloader", "secure boot", "ota", "update", "verified boot", "root of trust", "recovery", "a/b update", "flash"] },
          { title: "ENI / EAI — Neural Interface & Edge AI", path: "/eai", tags: ["eai", "eni", "neural interface", "edge ai", "on-device ai", "tflite", "onnx", "bci", "eeg", "emg", "ebot", "inference", "llm", "quantization"] },
          { title: "eOffice Suite", path: "/eoffice", tags: ["eoffice", "office suite", "ewriter", "esheet", "epresent", "enotes", "edraw", "ecalc", "ecalendar", "econtacts", "email", "echat", "efiles", "word processor", "spreadsheet", "slides"] },
          { title: "eFlow — Visual Block Programming", path: "/eflow", tags: ["eflow", "visual programming", "block editor", "no-code", "drag drop", "node editor", "gpio block", "timer block", "pid", "kalman", "tflite block", "generate c", "firmware visual"] },
          { title: "eBuild — Developer Build Tool", path: "/ebuild", tags: ["ebuild", "build tool", "cad analyze", "kicad", "bsp generate", "cross compile", "flash firmware", "ota push", "static analysis", "misra", "stack check", "ebuild.toml", "sim", "eosim", "monitor"] },
          { title: "eRadar360 — 360° Automotive Safety", path: "/eradar360", tags: ["eradar360", "radar", "automotive", "v2x", "laser", "aegis one", "77ghz", "fmcw", "dsrc", "c-v2x", "ai", "npu", "collision", "safety", "ecad", "hardware"] },
          { title: "eHealth365 — Two-Device Health Monitoring", path: "/ehealth365", tags: ["ehealth365", "smart ring", "smart patch", "cgm", "glucose", "sweat", "biosensor", "health", "wearable", "ecad", "hardware", "ring pro", "patch pro"] },
          { title: "Careers — Open Positions at EmbeddedOS Foundation", path: "/careers", tags: ["careers", "jobs", "hiring", "engineer", "researcher", "remote", "firmware", "embedded", "ai", "neural", "eai", "eni", "eoffice", "ehealth", "eradar", "edb", "eipc", "eboot", "build system", "community", "fundraising", "internship", "work"] },
          { title: "FAQ — Frequently Asked Questions", path: "/faq", tags: ["faq", "questions", "help", "support", "licensing", "mit", "hardware", "freertos", "zephyr", "production", "commercial", "general"] },
          { title: "Roadmap — EmbeddedOS Development Roadmap", path: "/roadmap", tags: ["roadmap", "future", "planned", "v0.2", "v1.0", "release", "milestones", "upcoming", "schedule"] },
          { title: "Security Policy — Vulnerability Reporting", path: "/security", tags: ["security", "vulnerability", "cve", "disclosure", "report", "bug", "responsible", "policy"] },
          { title: "Internships & Fellowships", path: "/internship", tags: ["internship", "fellowship", "student", "graduate", "research", "summer", "stipend", "remote", "apply"] },
          { title: "Ecosystem — Full EmbeddedOS Product Map", path: "/ecosystem", tags: ["ecosystem", "architecture", "layers", "stack", "platform", "all products", "overview", "map"] },
          { title: "Research Programs", path: "/research", tags: ["research", "papers", "publications", "neural", "ai", "bci", "formal verification", "post-quantum", "benchmarks"] },
          { title: "Changelog — Release History", path: "/changelog", tags: ["changelog", "releases", "history", "versions", "updates", "what's new", "v0.1"] },
          { title: "Partners & Sponsors", path: "/partners", tags: ["partners", "sponsors", "sponsorship", "donate", "support", "platinum", "gold", "silver", "community"] },
          { title: "Vision — Our Mission & Long-Term Goals", path: "/vision", tags: ["vision", "mission", "goals", "future", "2030", "billion devices", "foundation", "pillars", "timeline"] },
          { title: "Contact Us", path: "/contact", tags: ["contact", "email", "press", "security", "partnerships", "careers", "donate", "social", "discord", "github"] },
          { title: "Events — Conferences, Workshops & Hackathons", path: "/events", tags: ["events", "conference", "summit", "workshop", "hackathon", "meetup", "2026", "virtual", "in-person"] },
          { title: "Licenses — MIT & Third-Party", path: "/licenses", tags: ["licenses", "mit", "apache", "bsd", "open source", "third party", "cmsis", "lwip", "mbedtls", "fatfs", "tflite"] },
          { title: "Code of Conduct", path: "/code-of-conduct", tags: ["code of conduct", "community", "behavior", "harassment", "inclusive", "contributor covenant", "enforcement"] },
          { title: "eDB — Embedded Multi-Model Database", path: "/edb", tags: ["edb", "database", "sql", "document", "key-value", "rest", "ai query", "acid", "encryption", "embedded db"] },
          { title: "ENI — Embedded Neural Interface", path: "/eni", tags: ["eni", "neural interface", "bci", "brain computer interface", "eeg", "emg", "ecog", "lfp", "spike detection", "neural decoding", "neurostimulation"] },
          { title: "EoStudio — Embedded IDE", path: "/eostudio", tags: ["eostudio", "ide", "editor", "debugger", "learning paths", "ai tutor", "eosim", "eflow", "monaco", "embedded ide"] },
          { title: "Organization — Foundation Governance", path: "/organization", tags: ["organization", "governance", "board", "tsc", "technical steering committee", "501c3", "nonprofit", "legal", "ein", "maintainers"] },
          { title: "Community — EmbeddedOS Community Hub", path: "/community", tags: ["community", "discord", "forum", "contributors", "events", "chat", "slack", "github discussions"] },
          { title: "EIPC — Embedded IPC Protocol", path: "/eipc", tags: ["eipc", "ipc", "inter-process communication", "wire format", "hmac", "shared memory", "uart transport", "spi transport", "tcp transport", "latency"] },
          { title: "EoSim — Hardware Simulator Product", path: "/eosim", tags: ["eosim", "simulator", "63 boards", "cli", "eosim list", "eosim run", "eosim gui", "hil", "hardware in loop", "virtual board"] },
          { title: "Building an OS from Scratch", path: "/building-os", tags: ["building os", "kernel architecture", "microkernel", "secure boot chain", "ipc", "build system", "ebuild", "design decisions", "embedded os design"] },
          { title: "AI-Native OS — EAI Platform", path: "/ai-os", tags: ["ai os", "eai", "on-device llm", "npu", "inference", "tflite", "onnx", "llama", "ebot", "ai stack", "embedded ai"] },
          { title: "Sponsors — Corporate Sponsorship", path: "/sponsors", tags: ["sponsors", "sponsorship", "corporate", "platinum", "gold", "silver", "invest", "esg", "csr", "talent pipeline"] },
          { title: "Certification — Professional Credentials", path: "/certification", tags: ["certification", "cert", "exam", "badge", "credly", "eos developer", "security cert", "ai cert", "health cert", "aerospace cert", "rtos cert", "60 certifications", "12 tracks"] },
          { title: "Future Research Directions", path: "/future-research", tags: ["future research", "formal verification", "tla+", "coq", "neural interface", "closed loop bci", "distributed os", "space grade", "sub-mw ai", "neuromorphic", "loihi", "moonshot"] },
          { title: "Neural Link AI — eNI Platform", path: "/neural-link-ai", tags: ["neural link", "eni", "bci", "eeg", "emg", "ecog", "lfp", "spikes", "fnirs", "1024 channels", "neural decoding", "closed loop stimulation", "prosthetics", "seizure detection"] },
          { title: "Fundraising — Support the Foundation", path: "/fundraising", tags: ["fundraising", "donate", "501c3", "tax deductible", "supporter", "educator", "builder", "innovator", "monthly giving", "zeffy"] },
          { title: "eBrowser — Embedded Web Browser Engine", path: "/ebrowser", tags: ["ebrowser", "browser", "html5", "css3", "javascript", "quickjs", "v8", "webgl", "tls", "embedded browser", "webkit", "rendering engine"] },
          { title: "eServiceApps — Flutter Mobile Companion Apps", path: "/eserviceapps", tags: ["eserviceapps", "mobile app", "flutter", "ios", "android", "companion app", "ehealth365 app", "eosim mobile", "eradar360 app", "eoffice mobile", "device manager", "ebot agent"] },
          { title: "eAI Edge — Neural Interface AI Stack", path: "/eai-edge", tags: ["eai edge", "neural interface", "eni", "eipc", "eai", "manifest", "cmake", "bci", "motor intent", "seizure detection", "gesture recognition", "cognitive load", "pipeline"] },
          { title: "eOSuite — Complete App Ecosystem", path: "/eosuite", tags: ["eosuite", "app store", "eoffice", "system apps", "media apps", "developer tools", "browser extensions", "flutter", "55 apps", "native c", "lvgl"] },
          { title: "Ecosystem Map — 7-Layer Architecture", path: "/ecosystem-map", tags: ["ecosystem", "ecosystem map", "architecture", "layers", "hal", "kernel", "services", "ai layer", "apps", "products", "hardware"] },
          { title: "Resources — Documentation, Downloads & Community", path: "/resources", tags: ["resources", "documentation", "downloads", "community", "discord", "github", "books", "api docs", "ebuild", "eflow", "eostudio", "eosim"] },
          { title: "Article: eos-platform 1.0 — One Toolchain, Every EoS Profile", path: "/article-eos-platform-launch", tags: ["eos-platform", "1.0", "release", "reproducible builds", "manifest", "toolchain", "article"] },
          { title: "Article: EAI INT4 LLM Runtime — 11 tok/s on Cortex-M85", path: "/article-eai-llm-bench", tags: ["eai", "llm", "int4", "cortex-m85", "benchmark", "quantization", "article"] },
          { title: "Article: eBoot Secure Boot Deep Dive", path: "/article-eboot-secure-boot-deepdive", tags: ["eboot", "secure boot", "chain of trust", "attestation", "anti-rollback", "article"] },
          { title: "Article: eDB AES-XTS At-Rest Encryption", path: "/article-edb-encryption-at-rest", tags: ["edb", "encryption", "aes-xts", "security", "embedded", "article"] },
          { title: "Article: ENI 1,024-Channel Spike Sorting Pipeline", path: "/article-eni-1024-channel-pipeline", tags: ["eni", "neural interface", "spike sorting", "bci", "1024 channels", "article"] },
          { title: "Article: EoS RTOS Roadmap 2026", path: "/article-eos-roadmap-2026", tags: ["roadmap", "rtos", "tickless", "formal verification", "rt-ipc", "2026", "article"] },
          { title: "Article: EoSim 2.4 HIL Bridge", path: "/article-eosim-hil-bridge", tags: ["eosim", "hil", "hardware-in-the-loop", "ezbus", "testing", "article"] },
          { title: "Article: Foundation 2026 Membership & Governance", path: "/article-foundation-membership-2026", tags: ["foundation", "governance", "membership", "working groups", "tsc", "voting", "article"] },
          { title: "Downloads", path: "/downloads", tags: ["download", "install", "release", "binary", "source", "github", "mit", "kernel", "eboot", "ebuild", "eosim", "eostudio", "eoffice", "edb", "eai", "eni"] },
          { title: "Patents — EmbeddedOS Intellectual Property", path: "/patents", tags: ["patents", "ip", "intellectual property", "health-key ultra", "health-band neuro", "provisional patent", "licensing"] },
          { title: "EoS Product Detail — Embedded Operating System", path: "/product-eos", tags: ["eos", "kernel", "rtos", "hal", "product", "real-time", "c11", "scheduler", "capability"] },
          { title: "eos-platform Product Detail — Form-Factor Profiles", path: "/product-eos-platform", tags: ["eos-platform", "platform", "desktop", "laptop", "tablet", "tv", "kiosk", "product", "profile"] },
          { title: "eBootloader Product Detail — Multi-Architecture Bootloader", path: "/product-eboot", tags: ["eboot", "bootloader", "a/b update", "signed images", "secure boot", "product", "ota"] },
          { title: "EAI Product Detail — Embedded AI Runtime", path: "/product-eai", tags: ["eai", "ai runtime", "llm", "react agent", "lora", "federated learning", "product", "inference"] },
          { title: "ENI Product Detail — Embedded Neural Interface", path: "/product-eni", tags: ["eni", "neural interface", "1024 channels", "eeg", "ecog", "spike sorter", "product", "bci"] },
          { title: "EIPC Product Detail — Secure IPC Fabric", path: "/product-eipc", tags: ["eipc", "ipc", "capability", "hmac", "zero-copy", "product", "inter-process"] },
          { title: "eDB Product Detail — Embedded Database", path: "/product-edb", tags: ["edb", "database", "sql", "document", "key-value", "rest api", "aes-256", "product"] },
          { title: "eBuild Product Detail — Build System & SDK Generator", path: "/product-ebuild", tags: ["ebuild", "build system", "sdk", "cmake", "profile composition", "product", "signing"] },
          { title: "EoSim Product Detail — Embedded Systems Simulator", path: "/product-eosim", tags: ["eosim", "simulator", "qemu", "renode", "hil", "product", "virtual platform"] },
          { title: "EoStudio Product Detail — Embedded IDE", path: "/product-eostudio", tags: ["eostudio", "ide", "board picker", "profile composer", "hal configurator", "product", "debugger"] },
          { title: "eOffice Product Detail — Embedded Office Suite", path: "/product-eoffice", tags: ["eoffice", "office suite", "edocs", "esheets", "eslides", "product", "flutter"] },
          { title: "eApps Product Detail — 60+ First-Party Apps", path: "/product-eapps", tags: ["eapps", "apps", "app library", "media", "productivity", "communications", "product", "sandboxed"] },
          { title: "eServiceApps Product Detail — Consumer Service Apps", path: "/product-eserviceapps", tags: ["eserviceapps", "service apps", "esocial", "eride", "etravel", "etrack", "ewallet", "product", "flutter"] },
          { title: "What We Do — EmbeddedOS Company Overview", path: "/what-we-do", tags: ["what we do", "company", "overview", "stack", "eos", "eboot", "eai", "eni", "eoffice", "eapps", "health", "aerospace", "robotics", "industrial", "use cases"] },
          { title: "eCAD Hardware — Hardware Design Catalog", path: "/ecad-hardware", tags: ["ecad", "hardware", "cad", "pcb", "aerospace", "robotics", "industrial", "transport", "energy", "smart city", "health", "consumer", "defense", "design", "eoshealth", "eosrobotics"] },
          { title: "Architecture — 3D Block Diagrams & System Design", path: "/architecture", tags: ["architecture", "block diagram", "3d diagram", "system design", "eos kernel", "eboot boot sequence", "eni eai neural pipeline", "eoffice suite", "edb database", "eradar360", "full stack", "layered architecture"] },
          { title: "Quantum Computing — eQC Kernel Module", path: "/quantum", tags: ["quantum", "quantum computing", "eqc", "qpu", "qubit", "ibm", "google", "microsoft", "ionq", "rigetti", "quantinuum", "qiskit", "cirq", "q#", "tket", "inquanto", "pyquil", "pennylane", "qutip", "qulacs", "amazon braket", "braket", "willow", "heron", "forte", "ankaa", "h2-1", "qccd", "quantum error correction", "qec", "surface code", "hybrid quantum", "topological qubit", "majorana", "trapped ion", "superconducting", "vqe", "qaoa", "variational", "simulation", "quantum simulation"] },
          { title: "EoS API Reference", path: "/api-docs", tags: ["api", "api docs", "api reference", "hal", "gpio", "uart", "spi", "i2c", "kernel", "rtos", "task", "mutex", "semaphore", "queue", "ota", "crypto", "aes", "sha256", "sensor", "filesystem", "power", "networking", "mqtt", "http", "debug", "logging", "services", "multicore", "function reference", "c api"] },
          { title: "Getting Started with EmbeddedOS", path: "/getting-started", tags: ["getting started", "start", "beginner", "new developer", "no hardware", "simulator path", "install eos", "first firmware", "tutorial", "onboarding", "quickstart"] },
        ];

        const REPOS = [
          { title: "EoS Kernel", path: "https://github.com/embeddedos-org/EoS", tags: ["kernel", "rtos", "os", "real-time"] },
          { title: "eBoot", path: "https://github.com/embeddedos-org/eBoot", tags: ["bootloader", "ota", "secure boot"] },
          { title: "eIPC", path: "https://github.com/embeddedos-org/eIPC", tags: ["ipc", "inter-process", "communication"] },
          { title: "ebuild", path: "https://github.com/embeddedos-org/ebuild", tags: ["build", "compile", "cross-compilation"] },
          { title: "eAI", path: "https://github.com/embeddedos-org/eAI", tags: ["ai", "inference", "tflite", "onnx", "neural"] },
          { title: "eNI", path: "https://github.com/embeddedos-org/eNI", tags: ["neural interface", "ni", "neural network"] },
          { title: "eApps Store", path: "https://github.com/embeddedos-org/eApps", tags: ["apps", "store", "applications"] },
          { title: "EoSim", path: "https://github.com/embeddedos-org/EoSim", tags: ["simulator", "emulator", "virtual board"] },
          { title: "EoStudio", path: "https://github.com/embeddedos-org/EoStudio", tags: ["ide", "studio", "editor"] },
          { title: "eos-health", path: "https://github.com/embeddedos-org/eos-health", tags: ["health", "wearable", "biometric"] },
          { title: "eos-aero", path: "https://github.com/embeddedos-org/eos-aero", tags: ["aerospace", "vtol", "aircraft"] },
        ];

        // Fuzzy scoring: exact title match (4pts), title contains query (3pts), tag exact (2pts), partial match (1pt)
        const scoreItem = (title: string, tags: string[]) => {
          const titleLower = title.toLowerCase();
          let s = 0;
          // Exact title match
          if (titleLower === q) s += 8;
          // Title starts with query
          else if (titleLower.startsWith(q)) s += 5;
          // Title contains query
          else if (titleLower.includes(q)) s += 3;
          // Tag scoring
          for (const tag of tags) {
            if (tag === q) s += 4;
            else if (tag.startsWith(q) || q.startsWith(tag)) s += 2;
            else if (tag.includes(q) || q.includes(tag)) s += 1;
          }
          // Multi-word query: check each word
          const words = q.split(/\s+/).filter(w => w.length > 2);
          for (const word of words) {
            if (titleLower.includes(word)) s += 1;
            for (const tag of tags) {
              if (tag.includes(word)) s += 0.5;
            }
          }
          return s;
        };
        const pageResults = PAGES
          .map(p => ({ ...p, score: scoreItem(p.title, p.tags), type: "page" as const }))
          .filter(p => p.score > 0)
          .sort((a, b) => b.score - a.score)
          .slice(0, 7);

        const repoResults = REPOS
          .map(r => ({ ...r, score: scoreItem(r.title, r.tags), type: "repo" as const }))
          .filter(r => r.score > 0)
          .sort((a, b) => b.score - a.score)
          .slice(0, 4);

        return { pages: pageResults, repos: repoResults };
      }),
  }),
});

export type AppRouter = typeof appRouter;
