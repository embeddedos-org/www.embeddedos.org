import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Terminal, Code2, Layers, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export interface ProductSpec {
  key: string;
  value: string;
}

export interface ProductFeature {
  name: string;
  desc: string;
}

export interface ProductStat {
  value: string;
  label: string;
}

export interface ProductPair {
  name: string;
  route: string;
  desc: string;
}

export interface WorkflowStep {
  step: number;
  title: string;
  desc: string;
  code?: string;
}

export interface UsageExample {
  title: string;
  scenario: string;
  code: string;
  lang?: string;
}

export interface EcosystemRole {
  importance: "critical" | "high" | "medium";
  role: string;
  dependsOn: string[];
  enabledBy: string[];
  summary: string;
}

export interface ProductDetailProps {
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  accent: string;
  gradient: string;
  lang: string;
  github: string;
  stats: ProductStat[];
  features: ProductFeature[];
  specs: ProductSpec[];
  pairs: ProductPair[];
  stackHighlight?: string;
  heroImage?: string;
  workflow?: WorkflowStep[];
  usageExamples?: UsageExample[];
  ecosystemRole?: EcosystemRole;
}

const stackLayers = [
  "App layer",
  "UI / browser layer",
  "Data layer",
  "AI runtime",
  "Neural interface",
  "IPC fabric",
  "EoS kernel + HAL",
  "eos-platform profile",
  "eBootloader",
  "Build / IDE / Sim",
];

const importanceBadge: Record<string, { label: string; color: string; bg: string }> = {
  critical: { label: "Critical — Foundation Layer", color: "#EF4444", bg: "#EF444415" },
  high:     { label: "High — Core Service",          color: "#F97316", bg: "#F9731615" },
  medium:   { label: "Important — Extended Stack",   color: "#22D3EE", bg: "#22D3EE15" },
};

export default function ProductDetailPage({
  badge,
  title,
  subtitle,
  description,
  accent,
  gradient,
  lang,
  github,
  stats,
  features,
  specs,
  pairs,
  stackHighlight,
  heroImage,
  workflow,
  usageExamples,
  ecosystemRole,
}: ProductDetailProps) {
  const [activeExample, setActiveExample] = useState(0);
  const shortName = title.split(" — ")[0];

  return (
    <div className="min-h-screen bg-[#0A0F1E] text-white">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {heroImage && (
          <img src={heroImage} alt="" aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover opacity-8 pointer-events-none" />
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A0F1E] via-[#0D1B2A] to-[#0A0F1E]" />
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `radial-gradient(circle at 30% 40%, ${accent}22 0%, transparent 50%), radial-gradient(circle at 70% 60%, ${accent}11 0%, transparent 50%)`,
        }} />
        <div className="relative max-w-6xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <span className="inline-block text-xs font-mono font-bold tracking-widest uppercase px-3 py-1 rounded-full border"
                style={{ color: accent, borderColor: `${accent}40`, background: `${accent}15` }}>{badge}</span>
              <span className="text-xs font-mono text-white/40 px-2 py-1 rounded border border-white/10 bg-white/5">{lang}</span>
              <span className="text-xs font-mono text-green-400 px-2 py-1 rounded border border-green-400/30 bg-green-400/10">MIT · v0.1.0</span>
              {ecosystemRole && (
                <span className="text-xs font-mono font-bold px-2 py-1 rounded border"
                  style={{ color: importanceBadge[ecosystemRole.importance].color, borderColor: `${importanceBadge[ecosystemRole.importance].color}40`, background: importanceBadge[ecosystemRole.importance].bg }}>
                  {importanceBadge[ecosystemRole.importance].label}
                </span>
              )}
            </div>
            <h1 className="text-5xl md:text-6xl font-heading font-black mb-3 leading-tight">{title}</h1>
            <p className="text-xl font-semibold mb-4" style={{ color: accent }}>{subtitle}</p>
            <p className="text-lg text-white/60 leading-relaxed mb-8 max-w-2xl">{description}</p>
            <div className="flex gap-4 flex-wrap">
              <a href={`https://github.com/${github}`} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-all hover:scale-105"
                style={{ background: accent }}>
                View on GitHub →
              </a>
              <Link href="/api-docs"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold border border-white/20 text-white/80 hover:bg-white/10 transition-all">
                Read the Docs
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="flex gap-8 mt-12 flex-wrap">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-heading font-black" style={{ color: accent }}>{stat.value}</div>
                <div className="text-xs text-white/40 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works — Workflow Steps */}
      {workflow && workflow.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 pb-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-3 mb-2">
              <Layers className="w-5 h-5" style={{ color: accent }} />
              <h2 className="text-2xl font-heading font-black">How It Works</h2>
            </div>
            <p className="text-white/40 text-sm mb-8">Step-by-step flow — from initialization to output.</p>
            <div className="relative">
              {/* Vertical connector line */}
              <div className="absolute left-6 top-8 bottom-8 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent hidden md:block" />
              <div className="space-y-4">
                {workflow.map((step, i) => (
                  <motion.div key={step.step}
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.05 * i }}
                    className="flex gap-5 items-start">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full border-2 flex items-center justify-center font-heading font-black text-sm z-10"
                      style={{ borderColor: accent, color: accent, background: `${accent}15` }}>
                      {step.step}
                    </div>
                    <div className="flex-1 rounded-xl border border-white/10 bg-white/5 p-5">
                      <h3 className="font-bold text-base mb-1">{step.title}</h3>
                      <p className="text-white/60 text-sm leading-relaxed mb-3">{step.desc}</p>
                      {step.code && (
                        <pre className="rounded-lg bg-black/40 border border-white/10 p-3 text-xs font-mono text-green-300 overflow-x-auto whitespace-pre-wrap">
                          {step.code}
                        </pre>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>
      )}

      {/* Usage Examples */}
      {usageExamples && usageExamples.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 pb-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-3 mb-2">
              <Terminal className="w-5 h-5" style={{ color: accent }} />
              <h2 className="text-2xl font-heading font-black">Usage Examples</h2>
            </div>
            <p className="text-white/40 text-sm mb-6">Real-world scenarios showing {shortName} in action.</p>
            {/* Tab selector */}
            <div className="flex gap-2 flex-wrap mb-4">
              {usageExamples.map((ex, i) => (
                <button key={i} onClick={() => setActiveExample(i)}
                  className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                  style={activeExample === i
                    ? { background: accent, color: '#fff' }
                    : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  {ex.title}
                </button>
              ))}
            </div>
            {usageExamples[activeExample] && (
              <motion.div key={activeExample} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
                className="rounded-2xl border border-white/10 overflow-hidden">
                <div className="px-6 py-4 border-b border-white/10 bg-white/5">
                  <div className="flex items-center gap-2 mb-1">
                    <Code2 className="w-4 h-4" style={{ color: accent }} />
                    <span className="font-bold text-sm">{usageExamples[activeExample].title}</span>
                  </div>
                  <p className="text-white/50 text-xs">{usageExamples[activeExample].scenario}</p>
                </div>
                <pre className="p-5 text-xs font-mono text-green-300 overflow-x-auto bg-black/30 leading-relaxed whitespace-pre">
                  {usageExamples[activeExample].code}
                </pre>
              </motion.div>
            )}
          </motion.div>
        </section>
      )}

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          <h2 className="text-2xl font-heading font-black mb-2">Features</h2>
          <p className="text-white/40 text-sm mb-8">The shape of {shortName} at a glance.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feat, i) => (
              <motion.div key={feat.name}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 * i }}
                className={`rounded-xl border border-white/10 bg-gradient-to-br ${gradient} p-5`}>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: accent }} />
                  <h3 className="font-bold text-sm">{feat.name}</h3>
                </div>
                <p className="text-white/60 text-xs leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Role in the EoS Ecosystem */}
      {ecosystemRole && (
        <section className="max-w-6xl mx-auto px-6 pb-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-3 mb-2">
              <ArrowRight className="w-5 h-5" style={{ color: accent }} />
              <h2 className="text-2xl font-heading font-black">Role in the EoS Ecosystem</h2>
            </div>
            <p className="text-white/40 text-sm mb-6">Why {shortName} matters — and what breaks without it.</p>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 mb-6">
              <p className="text-white/80 leading-relaxed text-base">{ecosystemRole.summary}</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {ecosystemRole.dependsOn.length > 0 && (
                <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                  <h3 className="font-bold text-sm text-white/70 mb-3 uppercase tracking-wider">Depends On</h3>
                  <div className="space-y-2">
                    {ecosystemRole.dependsOn.map((dep) => (
                      <div key={dep} className="flex items-center gap-2 text-sm text-white/60">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                        {dep}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {ecosystemRole.enabledBy.length > 0 && (
                <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                  <h3 className="font-bold text-sm text-white/70 mb-3 uppercase tracking-wider">Enables / Powers</h3>
                  <div className="space-y-2">
                    {ecosystemRole.enabledBy.map((dep) => (
                      <div key={dep} className="flex items-center gap-2 text-sm text-white/60">
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: accent }} />
                        {dep}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </section>
      )}

      {/* GitHub + Stack + Pairs */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* GitHub Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-heading font-black mb-1">Open source on GitHub</h2>
            <p className="text-white/50 text-xs mb-4">MIT licensed and developed in the open. Issues, discussions, and pull requests welcome.</p>
            <div className="rounded-xl border p-4 mb-4" style={{ borderColor: `${accent}30`, background: `${accent}10` }}>
              <div className="font-mono text-xs mb-1" style={{ color: accent }}>⌥ {github}</div>
              <div className="text-white/60 text-xs">{title.split(" — ")[1] || title}</div>
              <div className="flex gap-2 mt-2">
                <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-white/60">{lang}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-white/60">MIT</span>
                <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-white/60">v0.1.0</span>
              </div>
            </div>
            <a href={`https://github.com/${github}`} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold transition-all hover:opacity-80" style={{ color: accent }}>
              Open ↗
            </a>
          </motion.div>

          {/* EoS Stack */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}
            className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-heading font-black mb-1">In the EoS stack</h2>
            <p className="text-white/50 text-xs mb-4">{shortName} is highlighted in the layer below.</p>
            <div className="space-y-1">
              {stackLayers.map((layer) => {
                const isHighlight = stackHighlight && layer.toLowerCase().includes(stackHighlight.toLowerCase());
                return (
                  <div key={layer} className="text-xs px-3 py-1.5 rounded-lg transition-all"
                    style={isHighlight
                      ? { background: accent, color: "#fff", fontWeight: 700 }
                      : { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)" }}>
                    {layer}
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Pairs Well With */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
            className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-heading font-black mb-1">Pairs well with</h2>
            <p className="text-white/50 text-xs mb-4">Sibling components that {shortName} commonly works alongside.</p>
            <div className="space-y-3">
              {pairs.map((pair) => (
                <Link key={pair.name} href={pair.route}
                  className="block rounded-xl border border-white/10 bg-white/5 p-3 hover:bg-white/10 transition-all group">
                  <div className="font-bold text-sm group-hover:text-[#F97316] transition-colors">{pair.name}</div>
                  <div className="text-white/50 text-xs mt-0.5 leading-relaxed">{pair.desc}</div>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Specs Table */}
      {specs.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 pb-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
            <h2 className="text-2xl font-heading font-black mb-6">Technical Specifications</h2>
            <div className="rounded-2xl border border-white/10 overflow-hidden">
              <table className="w-full text-sm">
                <tbody>
                  {specs.map((spec, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-white/5" : "bg-white/[0.02]"}>
                      <td className="px-6 py-3 font-semibold text-white/70 w-1/3 border-r border-white/5">{spec.key}</td>
                      <td className="px-6 py-3 text-white/60">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </section>
      )}

      <Footer />
    </div>
  );
}
