import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  Factory,
  CircuitBoard,
  FileCode2,
  Layers,
  ArrowRight,
  ShieldCheck,
  Gauge,
  Target,
  Landmark,
  Info,
} from "lucide-react";
import {
  INDUSTRIES,
  industriesInGroup,
  withReferenceDesign,
  FUNDING_THEMES,
  type Industry,
} from "@/data/industries";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      delay: Math.min(i, 6) * 0.05,
      ease: "easeOut" as const,
    },
  }),
};

/**
 * The path every one of these industries follows. This is the answer to "why
 * does a hardware project need an operating system foundation" — the CAD file is
 * where it starts, and the board is useless until something runs on it.
 */
const PIPELINE = [
  {
    icon: FileCode2,
    color: "#F97316",
    step: "Schematic & CAD",
    detail:
      "The design starts as a schematic and PCB layout — KiCad sources, a bill of materials, and the mechanical model, published openly rather than held as a trade secret.",
  },
  {
    icon: CircuitBoard,
    color: "#22D3EE",
    step: "Board & bring-up",
    detail:
      "Fabrication and assembly produce real hardware, which then has to be brought up: power sequencing, clocks, memory, and every peripheral proven one at a time.",
  },
  {
    icon: Layers,
    color: "#34D399",
    step: "Operating system & drivers",
    detail:
      "This is the gap the Foundation exists to close. A board with no scheduler, no driver model and no bootloader does nothing. EoS, eBoot and the driver layer make it a computer.",
  },
  {
    icon: Factory,
    color: "#A78BFA",
    step: "Application & certification",
    detail:
      "Above the OS sits the domain logic — flight control, patient monitoring, grid protection — and the evidence trail a certification authority will ask for.",
  },
];

/** Colour per funding theme, so a reader can scan the grid by theme. */
const THEME_COLOR: Record<string, string> = {
  Sovereignty: "#60A5FA",
  "Safety certification": "#F97316",
  Decarbonisation: "#34D399",
  "Health access": "#F472B6",
  Resilience: "#FBBF24",
};

function MaturityBadge({ maturity }: { maturity: Industry["maturity"] }) {
  const isSought = maturity.trl === null;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border"
      style={{
        background: isSought ? "#FFFFFF0D" : "#22D3EE14",
        borderColor: isSought ? "#FFFFFF1A" : "#22D3EE33",
        color: isSought ? "#FFFFFF66" : "#67E8F9",
      }}
    >
      <Gauge size={11} aria-hidden="true" />
      {maturity.trl ?? "Not yet assessed"}
    </span>
  );
}

function IndustryCard({ industry, index }: { industry: Industry; index: number }) {
  const themeColor = THEME_COLOR[industry.fundingTheme] ?? "#FFFFFF";
  return (
    <motion.article
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "80px" }}
      custom={index}
      className="glass rounded-2xl p-5 border border-white/5 flex flex-col h-full"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="font-heading font-bold text-white text-base leading-snug">
          {industry.name}
        </h3>
        <MaturityBadge maturity={industry.maturity} />
      </div>

      <p className="text-sm text-white/55 leading-relaxed mb-4">
        {industry.blurb}
      </p>

      <dl className="space-y-3 text-sm flex-1">
        <div>
          <dt className="text-white/35 text-[10px] uppercase tracking-[0.16em] font-bold mb-1.5 flex items-center gap-1.5">
            <Target size={10} aria-hidden="true" />
            Target standards
          </dt>
          <dd className="flex flex-wrap gap-1.5">
            {industry.targetStandards.map(s => (
              <span
                key={s}
                className="px-2 py-0.5 rounded bg-white/[0.06] border border-white/[0.08] text-white/60 text-[11px] font-medium"
              >
                {s}
              </span>
            ))}
          </dd>
        </div>

        <div>
          <dt className="text-white/35 text-[10px] uppercase tracking-[0.16em] font-bold mb-1.5 flex items-center gap-1.5">
            <CircuitBoard size={10} aria-hidden="true" />
            Reference design
          </dt>
          <dd className="text-white/60 leading-relaxed">
            {industry.referenceDesign ? (
              <>
                <span className="text-white/85 font-medium">
                  {industry.referenceDesign.name}
                </span>
                <span className="block text-white/45 text-[13px] mt-0.5">
                  {industry.referenceDesign.note}
                </span>
                <code className="block mt-1.5 text-[11px] text-white/30 break-all">
                  {industry.referenceDesign.repoPath}
                </code>
              </>
            ) : (
              <span className="text-white/40 text-[13px] leading-relaxed">
                None yet. Listed here because the Foundation intends to serve this
                sector — the work is on the{" "}
                {/* inline-block + py lifts this from a ~20px line-height target
                    to ~28px on mobile, the same technique the footer uses. The
                    mobile audit flags anything under 24px. */}
                <Link
                  href="/roadmap"
                  className="inline-block py-1 text-[#F97316] underline underline-offset-2"
                >
                  roadmap
                </Link>
                , not in a repository.
              </span>
            )}
          </dd>
        </div>

        <div>
          <dt className="text-white/35 text-[10px] uppercase tracking-[0.16em] font-bold mb-1.5 flex items-center gap-1.5">
            <Landmark size={10} aria-hidden="true" />
            Maturity
          </dt>
          <dd className="text-white/50 text-[13px] leading-relaxed">
            {industry.maturity.status}
          </dd>
        </div>
      </dl>

      <div className="mt-4 pt-3 border-t border-white/5">
        <span
          className="inline-flex items-center gap-1.5 text-[11px] font-semibold"
          style={{ color: themeColor }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: themeColor }}
            aria-hidden="true"
          />
          {industry.fundingTheme}
        </span>
      </div>
    </motion.article>
  );
}

export default function Industries() {
  const core = industriesInGroup("core");
  const frontier = industriesInGroup("frontier");
  const backed = withReferenceDesign();

  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="section-padding bg-grid relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1D3A]/80 to-[#080F1E]" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            <div className="badge-amber mb-4 inline-flex items-center gap-1.5">
              <Factory size={12} />
              Industries
            </div>
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-white mb-6">
              Industries We Serve —{" "}
              <span className="text-gradient">from CAD to certification</span>
            </h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto leading-relaxed mb-4">
              A schematic becomes a board, and a board is inert until an operating
              system, a bootloader and a driver layer bring it to life. That gap
              is the same in an aircraft, an insulin pump and a substation relay —
              and it is the gap the Foundation exists to close, openly, for every
              sector below.
            </p>
            <p className="text-white/40 text-sm">
              {INDUSTRIES.length} sectors · {backed} with a reference design in a
              public repository today
            </p>
          </motion.div>
        </div>
      </section>

      {/* The pipeline */}
      <section className="section-padding">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "80px" }}
            className="max-w-3xl mb-10"
          >
            <div className="badge-teal mb-4 inline-flex items-center gap-1.5">
              <Layers size={12} />
              From CAD to Certified Product
            </div>
            <h2 className="font-heading font-bold text-white text-3xl mb-4">
              The same four steps, in every industry
            </h2>
            <p className="text-white/60 leading-relaxed">
              The Foundation works across all four, which is why one organisation
              can serve sectors as different as avionics and agriculture: the
              hardware differs, the path does not.
            </p>
          </motion.div>

          <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PIPELINE.map((stage, i) => {
              const Icon = stage.icon;
              return (
                <motion.li
                  key={stage.step}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "80px" }}
                  custom={i}
                  className="glass rounded-2xl p-5 border border-white/5"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                    style={{
                      background: `${stage.color}20`,
                      border: `1px solid ${stage.color}40`,
                    }}
                  >
                    <Icon size={19} style={{ color: stage.color }} />
                  </div>
                  <div className="text-white/30 text-[10px] font-bold tracking-[0.18em] mb-1">
                    STEP {i + 1}
                  </div>
                  <h3 className="font-semibold text-white mb-2">{stage.step}</h3>
                  <p className="text-[13px] text-white/50 leading-relaxed">
                    {stage.detail}
                  </p>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* How to read these cards — the honesty legend */}
      <section className="section-padding bg-[#080F1E]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "80px" }}
            className="glass rounded-2xl border border-[#22D3EE]/20 bg-[#22D3EE]/[0.04] p-6 sm:p-7"
          >
            <h2 className="font-heading font-bold text-white text-xl mb-4 flex items-center gap-2">
              <Info size={18} className="text-[#22D3EE]" aria-hidden="true" />
              How to read these cards
            </h2>
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="text-white font-semibold mb-1">
                  Target standards are targets, not certifications held.
                </dt>
                <dd className="text-white/55 leading-relaxed">
                  The Foundation holds no certification from any authority. Each
                  design is engineered toward the standard named on its card, and
                  the standards tables in the design repositories are titled
                  "Compliance Targets" for the same reason. Certification is the
                  responsibility of whoever brings a device to market.
                </dd>
              </div>
              <div>
                <dt className="text-white font-semibold mb-1">
                  TRL is self-assessed and has not been independently audited.
                </dt>
                <dd className="text-white/55 leading-relaxed">
                  The bands are derived from each design's own recorded status:
                  a concept maps to TRL 1–2, a research-phase design to TRL 2–3,
                  and a design-phase design to TRL 3–4. No physical qualification
                  campaign has been run, so nothing here claims TRL 5 or above.
                </dd>
              </div>
              <div>
                <dt className="text-white font-semibold mb-1">
                  A reference design means a design that exists.
                </dt>
                <dd className="text-white/55 leading-relaxed">
                  Each card names a real design and the repository path holding
                  it. Where the Foundation has no design for a sector yet, the
                  card says so and points at the roadmap rather than borrowing an
                  unrelated board.
                </dd>
              </div>
            </dl>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "80px" }}
            className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2"
          >
            <span className="text-white/35 text-[11px] uppercase tracking-[0.16em] font-bold">
              Funding themes
            </span>
            {FUNDING_THEMES.map(theme => (
              <span
                key={theme}
                className="inline-flex items-center gap-1.5 text-xs font-medium"
                style={{ color: THEME_COLOR[theme] }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: THEME_COLOR[theme] }}
                  aria-hidden="true"
                />
                {theme}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Core industries */}
      <section className="section-padding">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "80px" }}
            className="max-w-3xl mb-10"
          >
            <div className="badge-purple mb-4 inline-flex items-center gap-1.5">
              <Factory size={12} />
              Core Industries
            </div>
            <h2 className="font-heading font-bold text-white text-3xl mb-4">
              {core.length} sectors the platform already targets
            </h2>
            <p className="text-white/60 leading-relaxed">
              Each card carries the standard the design is built toward, its
              self-assessed maturity, a reference design that exists in a public
              repository, and the public-funding theme the work maps to.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {core.map((industry, i) => (
              <IndustryCard key={industry.id} industry={industry} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Frontier */}
      <section className="section-padding bg-[#080F1E]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "80px" }}
            className="max-w-3xl mb-10"
          >
            <div className="badge-amber mb-4 inline-flex items-center gap-1.5">
              <ShieldCheck size={12} />
              Emerging &amp; Frontier
            </div>
            <h2 className="font-heading font-bold text-white text-3xl mb-4">
              Where the research is earlier
            </h2>
            <p className="text-white/60 leading-relaxed">
              These are earlier than the core sectors and are labelled that way
              deliberately. They are the innovation-track work: promising, funded
              by research grants rather than product revenue, and honest about how
              far along they are.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-5">
            {frontier.map((industry, i) => (
              <IndustryCard key={industry.id} industry={industry} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Close */}
      <section className="section-padding">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "80px" }}
          >
            <h2 className="font-heading font-bold text-white text-2xl mb-3">
              Where this is going next
            </h2>
            <p className="text-white/55 leading-relaxed mb-7">
              The roadmap says which of these sectors gets attention next, and
              what has to be true before a design can move past TRL 4 — physical
              qualification, then certification evidence. The programmes behind
              the work, and what the Foundation deliberately does not do, are on
              the Mission &amp; Scope page.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/roadmap"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#F97316] hover:bg-[#EA580C] text-white font-bold rounded-xl btn-press transition-colors"
              >
                See the roadmap
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link
                href="/mission"
                className="inline-flex items-center gap-2 px-6 py-3 glass hover:bg-white/10 text-white font-semibold rounded-xl btn-press border border-white/10 transition-colors"
              >
                Mission &amp; Scope
              </Link>
              <Link
                href="/ecad-hardware"
                className="inline-flex items-center gap-2 px-6 py-3 glass hover:bg-white/10 text-white font-semibold rounded-xl btn-press border border-white/10 transition-colors"
              >
                Hardware design catalogue
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
