import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  Target,
  Compass,
  Heart,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Users,
  Scale,
  FileText,
} from "lucide-react";
import {
  FOUNDATION,
  MISSION_STATEMENT,
  CHARITABLE_PURPOSES,
  PROGRAMS,
  OUT_OF_SCOPE,
} from "@/data/foundation";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.07, ease: "easeOut" as const },
  }),
};

/**
 * How the Foundation judges whether a programme is working. Deliberately not a
 * table of results: these are the measures, and each one names a public artefact
 * a reader can go and check for themselves rather than a number they must take
 * on trust.
 */
const HOW_WE_MEASURE = [
  {
    measure: "Is the work actually public?",
    evidence:
      "Every repository, issue, design discussion and release is readable " +
      "without an account. If a decision cannot be found in public, it has not " +
      "been made properly.",
  },
  {
    measure: "Can someone learn from it without paying?",
    evidence:
      "Books, documentation, tutorials and the Kids Edition stay free and " +
      "unpaywalled. A cost that appears between a learner and the material is a " +
      "programme failure.",
  },
  {
    measure: "Can the results be reproduced?",
    evidence:
      "Research is published with the designs and sources needed to repeat it. " +
      "A claim we cannot show the working for is retired rather than restated.",
  },
  {
    measure: "Does anyone outside the Foundation hold the direction?",
    evidence:
      "Contributions, review and maintainership come from outside the " +
      "Foundation. A project only one organisation can steer is not yet a " +
      "public asset.",
  },
];

export default function Mission() {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero — the mission statement itself, first thing on the page */}
      <section className="section-padding bg-grid relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1D3A]/80 to-[#080F1E]" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            <div className="badge-amber mb-4 inline-flex items-center gap-1.5">
              <Target size={12} />
              Mission &amp; Scope
            </div>
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-white mb-6">
              Our <span className="text-gradient">Mission and Scope</span>
            </h1>
            {/* The statement is wrapped in a <p> inside the <blockquote> so that
                scripts/prerender.mjs, which derives each page's meta description
                from the first substantial `main p`, uses the mission itself
                rather than a paragraph further down the page. */}
            <blockquote className="max-w-3xl mx-auto mb-6">
              <p className="text-white/75 text-lg sm:text-xl leading-relaxed">
                {MISSION_STATEMENT}
              </p>
            </blockquote>
            <p className="text-white/45 text-sm">
              {FOUNDATION.legalName} · {FOUNDATION.taxStatus} · EIN{" "}
              {FOUNDATION.ein}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Charitable purpose */}
      <section className="section-padding">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-3xl mb-10"
          >
            <div className="badge-teal mb-4 inline-flex items-center gap-1.5">
              <Scale size={12} />
              Charitable Purpose
            </div>
            <h2 className="font-heading font-bold text-white text-3xl mb-4">
              What we are exempt to do
            </h2>
            <p className="text-white/60 leading-relaxed">
              The Foundation is a {FOUNDATION.taxStatus} recognised by the
              Internal Revenue Service, exempt since{" "}
              {FOUNDATION.exemptionEffective}. Exemption is not a general
              licence to operate — it is granted for specific purposes, and the
              Foundation's programmes are built to serve them. These are the
              three we work under.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5">
            {CHARITABLE_PURPOSES.map((p, i) => (
              <motion.div
                key={p.purpose}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="glass rounded-2xl p-6 border border-white/5 card-hover"
              >
                <h3 className="font-heading font-bold text-white text-lg mb-2">
                  {p.purpose}
                </h3>
                <p className="text-sm text-white/55 leading-relaxed">
                  {p.detail}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Programmes — the scope of the work */}
      <section className="section-padding bg-[#080F1E]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-3xl mb-10"
          >
            <div className="badge-purple mb-4 inline-flex items-center gap-1.5">
              <Compass size={12} />
              In Scope
            </div>
            <h2 className="font-heading font-bold text-white text-3xl mb-4">
              The five programmes we run
            </h2>
            <p className="text-white/60 leading-relaxed">
              Everything the Foundation spends time or money on belongs to one
              of these five programmes. Each names what it does, who it is for,
              and where the work itself can be inspected.
            </p>
          </motion.div>

          <div className="space-y-5">
            {PROGRAMS.map((program, i) => (
              <motion.article
                key={program.id}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="glass rounded-2xl p-6 sm:p-7 border border-white/5"
              >
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="w-7 h-7 rounded-lg bg-[#F97316]/15 border border-[#F97316]/30 flex items-center justify-center text-[#F97316] text-xs font-bold shrink-0">
                    {i + 1}
                  </span>
                  <h3 className="font-heading font-bold text-white text-xl">
                    {program.name}
                  </h3>
                </div>

                <p className="text-white/60 leading-relaxed mb-5">
                  {program.summary}
                </p>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <h4 className="text-white/40 text-[10px] uppercase tracking-[0.18em] font-bold mb-3">
                      What this involves
                    </h4>
                    <ul className="space-y-2">
                      {program.activities.map(activity => (
                        <li
                          key={activity}
                          className="flex items-start gap-2.5 text-sm text-white/55 leading-relaxed"
                        >
                          <CheckCircle2
                            size={14}
                            className="text-[#34D399] shrink-0 mt-0.5"
                            aria-hidden="true"
                          />
                          <span>{activity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-white/40 text-[10px] uppercase tracking-[0.18em] font-bold mb-3">
                      Who it serves
                    </h4>
                    <p className="text-sm text-white/55 leading-relaxed mb-4">
                      {program.serves}
                    </p>
                    <Link
                      href={program.href}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#F97316] hover:text-[#FB923C] transition-colors"
                    >
                      See this programme's work
                      <ArrowRight size={14} aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Out of scope */}
      <section className="section-padding">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-3xl mb-10"
          >
            <div className="badge-amber mb-4 inline-flex items-center gap-1.5">
              <XCircle size={12} />
              Out of Scope
            </div>
            <h2 className="font-heading font-bold text-white text-3xl mb-4">
              What the Foundation does not do
            </h2>
            <p className="text-white/60 leading-relaxed">
              A scope is only meaningful if it has an edge. These are the things
              the Foundation deliberately stays out of — stated here so that no
              one has to infer them from an absence.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-5">
            {OUT_OF_SCOPE.map((item, i) => (
              <motion.div
                key={item.claim}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="glass rounded-2xl p-5 border border-white/5"
              >
                <div className="flex items-start gap-3">
                  <XCircle
                    size={16}
                    className="text-[#F87171] shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <div>
                    <h3 className="font-semibold text-white mb-1.5 leading-snug">
                      {item.claim}
                    </h3>
                    <p className="text-sm text-white/50 leading-relaxed">
                      {item.detail}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How we measure */}
      <section className="section-padding bg-[#080F1E]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-10"
          >
            <div className="badge-teal mb-4 inline-flex items-center gap-1.5">
              <Users size={12} />
              Accountability
            </div>
            <h2 className="font-heading font-bold text-white text-3xl mb-4">
              How we judge whether it is working
            </h2>
            <p className="text-white/60 leading-relaxed">
              These are questions rather than metrics, and each one is
              answerable by a reader without asking us. That is the point: a
              measure only we can check is not accountability.
            </p>
          </motion.div>

          <div className="space-y-4">
            {HOW_WE_MEASURE.map((m, i) => (
              <motion.div
                key={m.measure}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="glass rounded-xl p-5 border border-white/5"
              >
                <h3 className="font-semibold text-white mb-1.5">{m.measure}</h3>
                <p className="text-sm text-white/50 leading-relaxed">
                  {m.evidence}
                </p>
              </motion.div>
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
            viewport={{ once: true }}
          >
            <h2 className="font-heading font-bold text-white text-2xl mb-3">
              Support the mission, or come and work on it
            </h2>
            <p className="text-white/55 leading-relaxed mb-7">
              The Foundation is funded by donations, membership and sponsorship
              — not by selling what it builds. Contributions are tax-deductible
              under {FOUNDATION.deductibility.toLowerCase()}.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/donate"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#F97316] hover:bg-[#EA580C] text-white font-bold rounded-xl btn-press transition-colors"
              >
                <Heart size={16} aria-hidden="true" />
                Make a Tax-Deductible Donation
              </Link>
              <Link
                href="/get-involved"
                className="inline-flex items-center gap-2 px-6 py-3 glass hover:bg-white/10 text-white font-semibold rounded-xl btn-press border border-white/10 transition-colors"
              >
                Volunteer or Contribute
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link
                href="/transparency"
                className="inline-flex items-center gap-2 px-6 py-3 glass hover:bg-white/10 text-white font-semibold rounded-xl btn-press border border-white/10 transition-colors"
              >
                <FileText size={16} aria-hidden="true" />
                Accountability &amp; Finances
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
