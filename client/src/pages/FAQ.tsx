import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, ChevronDown, Search } from "lucide-react";

const faqs = [
  {
    cat: "General",
    q: "What is EmbeddedOS?",
    a: "EmbeddedOS is a 501(c)(3) research foundation building the world's most complete open-source embedded AI systems stack. We develop EoS (the RTOS kernel), EAI (AI inference runtime), ENI (neural interface), EIPC (secure IPC), eBootloader (secure boot), eBuild (build system), EoSim (simulator), EoStudio (IDE), and eDB (embedded database) — all under the MIT license.",
  },
  {
    cat: "General",
    q: "Is EmbeddedOS free to use commercially?",
    a: "Yes. All EmbeddedOS products are released under the MIT license, which permits unrestricted commercial use, modification, and redistribution without royalty payments. You only need to include the MIT license notice in your product documentation or about screen.",
  },
  {
    cat: "General",
    q: "How does EmbeddedOS compare to FreeRTOS, Zephyr, or RTEMS?",
    a: "EmbeddedOS is not just an RTOS — it is a full embedded AI platform. EoS (the kernel) is comparable to FreeRTOS or Zephyr in scope, but the broader EmbeddedOS stack adds AI inference (EAI), neural interfaces (ENI), secure boot (eBootloader), and an integrated IDE (EoStudio) that no other open-source embedded platform provides. EoS is also designed from the ground up with capability-based security, which is more robust than the permission models in FreeRTOS or Zephyr.",
  },
  {
    cat: "General",
    q: "What hardware does EmbeddedOS support?",
    a: "EoS supports ARM Cortex-M/A/R, RISC-V RV32/RV64, x86, MIPS, ARC, and Xtensa architectures. eBuild includes 41 pre-configured product profiles covering sensor nodes, gateways, infotainment, robotics, and edge servers. New BSP profiles can be added by the community.",
  },
  {
    cat: "General",
    q: "Is EmbeddedOS production-ready?",
    a: "EmbeddedOS is currently in active development (v0.1.x). The core components (EoS kernel, eBootloader, eBuild) are approaching production readiness for non-safety-critical applications. Safety-critical certification (DO-178C, IEC 61508) artifacts are on the v1.0 roadmap. We recommend evaluating EmbeddedOS for new designs and providing feedback through GitHub.",
  },
  {
    cat: "Technical",
    q: "What is the minimum hardware requirement for EoS?",
    a: "EoS requires a minimum of 4 KB flash and 2 KB RAM for the bare scheduler and HAL. A typical sensor node application with UART, SPI, and GPIO uses approximately 16 KB flash and 4 KB RAM. The full EoS stack with networking and file system requires approximately 64 KB flash and 16 KB RAM.",
  },
  {
    cat: "Technical",
    q: "Can I run EAI on a Cortex-M4?",
    a: "Yes, but with limitations. Cortex-M4 does not have Helium MVE acceleration, so EAI uses the generic CMSIS-NN backend. Inference latency is 3–8× higher than on Cortex-M55/M85 with Helium. For latency-sensitive applications, we recommend Cortex-M55 or M85 with Helium, or a Cortex-A device with NEON.",
  },
  {
    cat: "Technical",
    q: "How does eBootloader handle OTA updates?",
    a: "eBootloader implements A/B partition updates. The new firmware image is written to the inactive partition while the active partition continues running. On next boot, eBootloader verifies the Ed25519 signature of the new image, checks the version number against the rollback counter, and activates the new partition if verification passes. If the new firmware fails to boot three times, eBootloader automatically reverts to the previous partition.",
  },
  {
    cat: "Technical",
    q: "Does EoS support SMP (symmetric multiprocessing)?",
    a: "Yes. EoS supports SMP on ARM Cortex-A and RISC-V multi-core platforms. The scheduler uses per-CPU run queues with work-stealing for load balancing. AMP (asymmetric multiprocessing) is also supported, where different cores run different EoS instances communicating via EIPC.",
  },
  {
    cat: "Technical",
    q: "What neural network formats does EAI support?",
    a: "EAI supports ONNX, TensorFlow Lite, and EAI's native .eai format. The eBuild toolchain includes an ahead-of-time compiler that converts ONNX or TFLite models to .eai format with INT8 or INT4 quantization and optional Helium MVE acceleration code generation.",
  },
  {
    cat: "Licensing",
    q: "Can I use EmbeddedOS in a closed-source product?",
    a: "Yes. The MIT license permits use in closed-source products. You must include the MIT license notice in your product documentation, firmware about screen, or a licenses.txt file shipped with the product. You do not need to publish your source code.",
  },
  {
    cat: "Licensing",
    q: "Can I fork EmbeddedOS and create a proprietary version?",
    a: "Yes, under the MIT license. However, we strongly encourage contributing improvements back to the main repository. Proprietary forks fragment the ecosystem and lose access to future upstream improvements. The Foundation offers commercial support agreements for organizations that need proprietary customizations with upstream integration.",
  },
  {
    cat: "Community",
    q: "How do I report a security vulnerability?",
    a: "Use the contact form on the Security page with a description of the vulnerability, affected components, and reproduction steps. We follow responsible disclosure with a 90-day disclosure timeline. Critical vulnerabilities are patched within 7 days. Do not open public GitHub issues for security vulnerabilities.",
  },
  {
    cat: "Community",
    q: "How do I become a TSC member?",
    a: "Technical Steering Committee membership is open to contributors with 6+ months of sustained contribution to EmbeddedOS repositories. Nominations are made by existing TSC members and confirmed by a community vote. TSC members serve 1-year rotating terms.",
  },
  {
    cat: "Community",
    q: "Does the Foundation offer internships or fellowships?",
    a: "Yes. The Foundation offers 12-week summer internships and 6-month research fellowships for students and early-career engineers. All positions are remote with a stipend. See the Internships page for current openings.",
  },
];

const cats = ["All", ...Array.from(new Set(faqs.map(f => f.cat)))];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  const [cat, setCat] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = faqs.filter(
    f =>
      (cat === "All" || f.cat === cat) &&
      (search === "" ||
        f.q.toLowerCase().includes(search.toLowerCase()) ||
        f.a.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#0A0E1A] text-white">
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-cyan-500/5" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-sm font-medium mb-6">
              <HelpCircle className="w-4 h-4" /> FAQ
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-orange-300 bg-clip-text text-transparent">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-gray-300">
              Answers to the most common questions about EmbeddedOS, its
              products, licensing, and community.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-8 px-4">
        <div className="max-w-3xl mx-auto space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search questions..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50"
            />
          </div>
          {/* Category filter */}
          <div className="flex flex-wrap gap-2">
            {cats.map(c => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={
                  "px-4 py-1.5 rounded-full text-sm font-medium transition-colors " +
                  (cat === c
                    ? "bg-orange-500 text-white"
                    : "bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10")
                }
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 px-4 pb-24">
        <div className="max-w-3xl mx-auto space-y-3">
          {filtered.map((f, i) => (
            <motion.div
              key={f.q}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="bg-white/5 border border-white/10 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 font-medium">
                    {f.cat}
                  </span>
                  <span className="text-white font-medium">{f.q}</span>
                </div>
                <ChevronDown
                  className={
                    "w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ml-4 " +
                    (open === i ? "rotate-180" : "")
                  }
                />
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-5 pb-5 text-gray-300 text-sm leading-relaxed border-t border-white/5 pt-4">
                      {f.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No questions found matching your search.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
