import { useState, lazy, Suspense } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Watch, Fingerprint, Microscope, Check, X, ChevronRight, Github } from "lucide-react";
const DeviceRadarChart = lazy(() => import("../components/DeviceRadarChart"));

// ─── Device data ──────────────────────────────────────────────────────────────

const DEVICES = [
  {
    id: "key",
    name: "HEALTH-KEY ULTRA",
    tagline: "USB-C Pendrive",
    color: "#F85149",
    icon: Activity,
    formFactor: "USB-C Pendrive",
    chip: "nRF52840",
    status: "Patent Pending",
    patent: "64/073,334",
    targetUser: "Clinicians, travelers, developers",
    price: "TBD",
  },
  {
    id: "band",
    name: "HEALTH-BAND Neuro",
    tagline: "AI Neuro Wristband",
    color: "#F59E0B",
    icon: Watch,
    formFactor: "Wristband",
    chip: "nRF52840 + TFLite",
    status: "Patent Pending",
    patent: "64/076,078",
    targetUser: "Athletes, rehabilitation, developers",
    price: "TBD",
  },
  {
    id: "ring",
    name: "HEALTH-RING",
    tagline: "Titanium Smart Ring",
    color: "#A78BFA",
    icon: Fingerprint,
    formFactor: "Titanium Ring",
    chip: "Custom ASIC",
    status: "In Development",
    patent: "EOS-2026-003",
    targetUser: "Daily health monitoring",
    price: "TBD",
  },
  {
    id: "lab",
    name: "HEALTH-LAB",
    tagline: "14-Day Biosensor Patch",
    color: "#34D399",
    icon: Microscope,
    formFactor: "Flexible Patch",
    chip: "Custom ASIC + BLE 5.3",
    status: "In Development",
    patent: "EOS-2026-004",
    targetUser: "Metabolic health, clinical research",
    price: "TBD",
  },
];

// ─── Comparison rows ──────────────────────────────────────────────────────────

type RowValue = boolean | string;

interface CompareRow {
  category: string;
  label: string;
  values: RowValue[];
  highlight?: boolean;
}

const ROWS: CompareRow[] = [
  // Form Factor
  { category: "Hardware", label: "Form Factor", values: ["USB-C Pendrive", "Wristband", "Titanium Ring", "Flexible Patch"] },
  { category: "Hardware", label: "MCU / Chip", values: ["nRF52840", "nRF52840 + TFLite", "Custom ASIC", "Custom ASIC + BLE 5.3"] },
  { category: "Hardware", label: "Wireless", values: ["BLE 5.0 + USB", "BLE 5.0 + USB", "BLE 5.3", "BLE 5.3"] },
  { category: "Hardware", label: "Battery Life", values: ["N/A (USB powered)", "7 days", "5 days", "14 days"] },
  { category: "Hardware", label: "Water Resistance", values: ["IPX4", "IP68", "IP68", "IP67"] },
  // Vitals
  { category: "Vitals", label: "ECG", values: [true, true, true, false], highlight: true },
  { category: "Vitals", label: "Heart Rate", values: [true, true, true, false] },
  { category: "Vitals", label: "SpO₂ (Blood Oxygen)", values: [true, true, true, false] },
  { category: "Vitals", label: "Blood Pressure (cuffless)", values: [false, false, true, false] },
  { category: "Vitals", label: "Body Temperature", values: [true, true, true, false] },
  { category: "Vitals", label: "HRV (Heart Rate Variability)", values: [false, true, true, false] },
  // Advanced
  { category: "Advanced", label: "sEMG Gesture Control", values: [false, true, false, false], highlight: true },
  { category: "Advanced", label: "TENS Therapy", values: [false, true, false, false] },
  { category: "Advanced", label: "BAC Breath Alcohol", values: [true, true, false, false] },
  { category: "Advanced", label: "UV Index", values: [true, false, false, false] },
  { category: "Advanced", label: "AFib Detection", values: [false, false, true, false] },
  { category: "Advanced", label: "HbA1c Estimation", values: [false, false, true, false] },
  { category: "Advanced", label: "Sleep Staging", values: [false, false, true, false] },
  { category: "Advanced", label: "Stress Score", values: [false, false, true, false] },
  // Biochemistry
  { category: "Biochemistry", label: "Continuous Glucose", values: [false, false, false, true], highlight: true },
  { category: "Biochemistry", label: "Lactate", values: [false, false, false, true] },
  { category: "Biochemistry", label: "Cortisol", values: [false, false, false, true] },
  { category: "Biochemistry", label: "Electrolytes (Na⁺, K⁺)", values: [false, false, false, true] },
  { category: "Biochemistry", label: "Uric Acid", values: [false, false, false, true] },
  { category: "Biochemistry", label: "pH", values: [false, false, false, true] },
  // Software
  { category: "Software", label: "EoS Firmware", values: [true, true, true, true] },
  { category: "Software", label: "Open-Source SDK", values: [true, true, true, true] },
  { category: "Software", label: "Mobile App (iOS/Android)", values: [true, true, true, true] },
  { category: "Software", label: "Developer API", values: [true, true, true, true] },
  { category: "Software", label: "On-Device AI (TFLite)", values: [false, true, true, true] },
  // Status
  { category: "Status", label: "Patent Status", values: ["Pending (64/073,334)", "Pending (64/076,078)", "Provisional Target Q3 2026", "Provisional Target Q3 2026"] },
  { category: "Status", label: "Development Stage", values: ["Patent Pending", "Patent Pending", "In Development", "In Development"] },
];

const CATEGORIES = ["Hardware", "Vitals", "Advanced", "Biochemistry", "Software", "Status"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.45, delay: i * 0.06, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] },
  }),
};

function CellValue({ value, color }: { value: RowValue; color: string }) {
  if (typeof value === "boolean") {
    return value
      ? <Check size={16} style={{ color }} className="mx-auto" />
      : <X size={14} className="mx-auto text-white/20" />;
  }
  return <span className="text-white/70 text-xs leading-tight">{value}</span>;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function HealthCompare() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredRows = activeCategory
    ? ROWS.filter(r => r.category === activeCategory)
    : ROWS;

  return (
    <div className="min-h-screen bg-[#080F1E]">
      {/* Hero */}
      <section className="relative py-14 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628] to-[#080F1E]" />
        {/* Animated glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/6 w-72 h-72 bg-[#F85149]/6 rounded-full blur-[90px]" />
          <div className="absolute top-1/3 right-1/5 w-64 h-64 bg-[#A78BFA]/6 rounded-full blur-[80px]" />
          <div className="absolute bottom-1/4 left-1/2 w-56 h-56 bg-[#34D399]/5 rounded-full blur-[70px]" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-5"
              style={{ background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.3)", color: "#F97316" }}>
              <Activity size={12} /> Health Device Comparison
            </span>
          </motion.div>
          <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1}
            className="font-heading font-black text-4xl sm:text-5xl text-white mb-4 leading-tight">
            Compare All <span style={{ color: "#F97316" }}>4 Health Devices</span>
          </motion.h1>
          <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2}
            className="text-white/60 text-lg max-w-2xl mx-auto mb-6">
            Side-by-side specification comparison across all EmbeddedOS health monitoring devices —
            from the USB-C pendrive to the 14-day biosensor patch.
          </motion.p>
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}
            className="flex flex-wrap justify-center gap-3">
            <Link href="/health"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all hover:opacity-90 active:scale-95"
              style={{ background: "#F97316", color: "#fff" }}>
              View Health Page <ChevronRight size={14} />
            </Link>
            <a href="https://github.com/embeddedos-org/eos-health" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm border border-white/15 text-white/70 hover:bg-white/5 transition-all">
              <Github size={14} /> GitHub Repository
            </a>
          </motion.div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">

          {/* Radar chart */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="mb-10 glass rounded-2xl p-8 border border-white/5">
            <div className="text-center mb-4">
              <h3 className="font-heading font-bold text-white text-xl mb-1">Capability Radar</h3>
              <p className="text-sm text-white/40">Click devices to toggle. Hover to highlight.</p>
            </div>
            <Suspense fallback={<div className="h-64 flex items-center justify-center text-white/20">Loading...</div>}>
              <DeviceRadarChart />
            </Suspense>
          </motion.div>

          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button onClick={() => setActiveCategory(null)}
              className="px-3 py-1.5 rounded-lg text-sm font-semibold transition-all"
              style={activeCategory === null
                ? { background: "#F97316", color: "#fff" }
                : { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)" }}>
              All Categories
            </button>
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className="px-3 py-1.5 rounded-lg text-sm font-semibold transition-all"
                style={activeCategory === cat
                  ? { background: "#F97316", color: "#fff" }
                  : { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)" }}>
                {cat}
              </button>
            ))}
          </div>

          {/* Table */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}
            className="rounded-2xl border overflow-hidden"
            style={{ borderColor: "rgba(255,255,255,0.08)" }}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                {/* Header */}
                <thead>
                  <tr style={{ background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                    <th className="text-left px-4 py-4 text-white/40 font-semibold text-xs uppercase tracking-widest w-48">
                      Feature
                    </th>
                    {DEVICES.map(d => {
                      const Icon = d.icon;
                      return (
                        <th key={d.id} className="px-4 py-4 text-center min-w-[140px]">
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                              style={{ background: `${d.color}20` }}>
                              <Icon size={16} style={{ color: d.color }} />
                            </div>
                            <div className="font-heading font-bold text-white text-xs leading-tight">{d.name}</div>
                            <div className="text-[10px] text-white/40">{d.tagline}</div>
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                              style={{ background: `${d.color}20`, color: d.color }}>
                              {d.status}
                            </span>
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                {/* Body */}
                <tbody>
                  {filteredRows.map((row, i) => {
                    // Category header row
                    const prevCategory = i > 0 ? filteredRows[i - 1].category : null;
                    const showCategoryHeader = row.category !== prevCategory;
                    return (
                      <>
                        {showCategoryHeader && (
                          <tr key={`cat-${row.category}`}
                            style={{ background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                            <td colSpan={5} className="px-4 py-2">
                              <span className="text-xs font-bold text-white/30 uppercase tracking-widest">
                                {row.category}
                              </span>
                            </td>
                          </tr>
                        )}
                        <tr key={row.label}
                          style={{
                            background: row.highlight
                              ? "rgba(249,115,22,0.04)"
                              : i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.015)",
                            borderBottom: "1px solid rgba(255,255,255,0.04)"
                          }}>
                          <td className="px-4 py-3 text-white/60 text-xs font-medium">
                            {row.label}
                            {row.highlight && (
                              <span className="ml-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                                style={{ background: "rgba(249,115,22,0.2)", color: "#F97316" }}>
                                KEY
                              </span>
                            )}
                          </td>
                          {row.values.map((val, vi) => (
                            <td key={vi} className="px-4 py-3 text-center">
                              <CellValue value={val} color={DEVICES[vi].color} />
                            </td>
                          ))}
                        </tr>
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Device cards summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            {DEVICES.map((d, i) => {
              const Icon = d.icon;
              const count = ROWS.filter(r => r.values[i] === true).length;
              return (
                <motion.div key={d.id} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
                  className="rounded-2xl border p-5"
                  style={{ background: "rgba(255,255,255,0.02)", borderColor: `${d.color}25`, borderTopColor: d.color, borderTopWidth: 2 }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ background: `${d.color}20` }}>
                      <Icon size={18} style={{ color: d.color }} />
                    </div>
                    <div>
                      <div className="font-heading font-bold text-white text-sm">{d.name}</div>
                      <div className="text-[10px] text-white/40">{d.formFactor}</div>
                    </div>
                  </div>
                  <div className="text-3xl font-black mb-1" style={{ color: d.color }}>{count}</div>
                  <div className="text-xs text-white/40 mb-3">features checked</div>
                  <div className="text-xs text-white/50 mb-1"><span className="text-white/70">Chip:</span> {d.chip}</div>
                  <div className="text-xs text-white/50 mb-1"><span className="text-white/70">For:</span> {d.targetUser}</div>
                  <div className="text-xs text-white/50"><span className="text-white/70">Patent:</span> {d.patent}</div>
                </motion.div>
              );
            })}
          </div>

          {/* CTA */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="mt-10 rounded-2xl border p-8 text-center"
            style={{ background: "rgba(249,115,22,0.05)", borderColor: "rgba(249,115,22,0.2)" }}>
            <h2 className="font-heading font-bold text-white text-2xl mb-3">
              Open-Source Health Platform
            </h2>
            <p className="text-white/60 max-w-xl mx-auto mb-6">
              All EmbeddedOS health devices run on the same open-source EoS firmware with a unified SDK.
              Build your own health applications, extend the platform, or contribute to the research.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/health"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all hover:opacity-90 active:scale-95"
                style={{ background: "#F97316", color: "#fff" }}>
                Explore Health Devices <ChevronRight size={14} />
              </Link>
              <a href="https://github.com/embeddedos-org/eos-health" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm border border-white/15 text-white/70 hover:bg-white/5 transition-all">
                <Github size={14} /> View SDK on GitHub
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
