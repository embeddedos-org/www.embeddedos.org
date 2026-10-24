import { useState } from "react";
import { BpPage, PageHero } from "@/components/bp";
import "./FAQ.css";

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
    <BpPage className="faqpage">
      <PageHero
        sig
        label="FAQ"
        title="Frequently Asked Questions"
        lead="Answers to the most common questions about EmbeddedOS, its products, licensing, and community."
      />

      <section className="sec fq">
        <div className="wrap">
          <div className="fq-tools">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search questions..."
              aria-label="Search frequently asked questions"
              className="fq-search"
            />
            <div className="fq-cats">
              {cats.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCat(c)}
                  aria-pressed={cat === c}
                  className="btn gh"
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="fq-list">
            {filtered.map((f, i) => (
              <div key={f.q} className="fq-item">
                <button
                  type="button"
                  onClick={() => setOpen(open === i ? null : i)}
                  aria-expanded={open === i}
                  aria-controls={`faq-answer-${i}`}
                  className="fq-q"
                >
                  <span className="fq-cat">{f.cat}</span>
                  <span className="fq-text">{f.q}</span>
                </button>
                <div id={`faq-answer-${i}`} hidden={open !== i}>
                  <p className="fq-a">{f.a}</p>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <p className="fq-none">
                No questions found matching your search.
              </p>
            )}
          </div>
        </div>
      </section>
    </BpPage>
  );
}
