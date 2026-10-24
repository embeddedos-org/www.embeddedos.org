import { Fragment, useState, lazy, Suspense, type CSSProperties } from "react";
import { Link } from "wouter";
import { BpPage, PageHero, Section } from "@/components/bp";
import "./HealthCompare.css";

const DeviceRadarChart = lazy(() => import("../components/DeviceRadarChart"));

// ─── Device data ──────────────────────────────────────────────────────────────

const DEVICES = [
  {
    id: "key",
    name: "HEALTH-KEY ULTRA",
    tagline: "USB-C Pendrive",
    color: "#F85149",
    formFactor: "USB-C Pendrive",
    chip: "nRF52840",
    status: "In Development",
    patent: "64/073,334",
    targetUser: "Clinicians, travelers, developers",
    price: "TBD",
  },
  {
    id: "band",
    name: "HEALTH-BAND Neuro",
    tagline: "AI Neuro Wristband",
    color: "#F59E0B",
    formFactor: "Wristband",
    chip: "nRF52840 + TFLite",
    status: "In Development",
    patent: "64/076,078",
    targetUser: "Athletes, rehabilitation, developers",
    price: "TBD",
  },
  {
    id: "ring",
    name: "HEALTH-RING",
    tagline: "Titanium Smart Ring",
    color: "#A78BFA",
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
    tagline: "Biosensor Patch Concept",
    color: "#34D399",
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
  {
    category: "Hardware",
    label: "Form Factor",
    values: ["USB-C Pendrive", "Wristband", "Titanium Ring", "Flexible Patch"],
  },
  {
    category: "Hardware",
    label: "Planned MCU / Chip",
    values: [
      "nRF52840",
      "nRF52840 + TFLite",
      "Custom ASIC",
      "Custom ASIC + BLE 5.3",
    ],
  },
  {
    category: "Hardware",
    label: "Planned Wireless",
    values: ["BLE 5.0 + USB", "BLE 5.0 + USB", "BLE 5.3", "BLE 5.3"],
  },
  {
    category: "Hardware",
    label: "Target Battery Life",
    values: ["N/A (USB powered)", "7 days", "5 days", "14 days"],
  },
  {
    category: "Hardware",
    label: "Target Water Resistance",
    values: ["IPX4", "IP68", "IP68", "IP67"],
  },
  // Vitals
  {
    category: "Vitals",
    label: "ECG",
    values: [true, true, true, false],
    highlight: true,
  },
  {
    category: "Vitals",
    label: "Heart Rate",
    values: [true, true, true, false],
  },
  {
    category: "Vitals",
    label: "SpO₂ (Blood Oxygen)",
    values: [true, true, true, false],
  },
  {
    category: "Vitals",
    label: "Blood Pressure (cuffless)",
    values: [false, false, true, false],
  },
  {
    category: "Vitals",
    label: "Body Temperature",
    values: [true, true, true, false],
  },
  {
    category: "Vitals",
    label: "HRV (Heart Rate Variability)",
    values: [false, true, true, false],
  },
  // Advanced
  {
    category: "Advanced",
    label: "sEMG Gesture Control",
    values: [false, true, false, false],
    highlight: true,
  },
  {
    category: "Advanced",
    label: "TENS Stimulation Research",
    values: [false, true, false, false],
  },
  {
    category: "Advanced",
    label: "BAC Breath Alcohol",
    values: [true, true, false, false],
  },
  {
    category: "Advanced",
    label: "UV Index",
    values: [true, false, false, false],
  },
  {
    category: "Advanced",
    label: "AFib Detection",
    values: [false, false, true, false],
  },
  {
    category: "Advanced",
    label: "HbA1c Estimation",
    values: [false, false, true, false],
  },
  {
    category: "Advanced",
    label: "Sleep Staging",
    values: [false, false, true, false],
  },
  {
    category: "Advanced",
    label: "Stress Score",
    values: [false, false, true, false],
  },
  // Biochemistry
  {
    category: "Biochemistry",
    label: "Continuous Glucose",
    values: [false, false, false, true],
    highlight: true,
  },
  {
    category: "Biochemistry",
    label: "Lactate",
    values: [false, false, false, true],
  },
  {
    category: "Biochemistry",
    label: "Cortisol",
    values: [false, false, false, true],
  },
  {
    category: "Biochemistry",
    label: "Electrolytes (Na⁺, K⁺)",
    values: [false, false, false, true],
  },
  {
    category: "Biochemistry",
    label: "Uric Acid",
    values: [false, false, false, true],
  },
  {
    category: "Biochemistry",
    label: "pH",
    values: [false, false, false, true],
  },
  // Software
  {
    category: "Software",
    label: "EoS Firmware",
    values: [true, true, true, true],
  },
  {
    category: "Software",
    label: "Open-Source SDK",
    values: [true, true, true, true],
  },
  {
    category: "Software",
    label: "Mobile App (iOS/Android)",
    values: [true, true, true, true],
  },
  {
    category: "Software",
    label: "Developer API",
    values: [true, true, true, true],
  },
  {
    category: "Software",
    label: "On-Device AI (TFLite)",
    values: [false, true, true, true],
  },
  // Status
  {
    category: "Status",
    label: "Patent Status",
    values: [
      "Pending (64/073,334)",
      "Pending (64/076,078)",
      "Provisional Target Q3 2026",
      "Provisional Target Q3 2026",
    ],
  },
  {
    category: "Status",
    label: "Development Stage",
    values: [
      "In Development",
      "In Development",
      "In Development",
      "In Development",
    ],
  },
];

const CATEGORIES = [
  "Hardware",
  "Vitals",
  "Advanced",
  "Biochemistry",
  "Software",
  "Status",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function CellValue({ value, color }: { value: RowValue; color: string }) {
  if (typeof value === "boolean") {
    return value ? (
      <span className="hc-yes" style={{ "--c": color } as CSSProperties}>
        Planned
      </span>
    ) : (
      <span className="hc-no">
        <span aria-hidden="true">—</span>
        <span className="sr-only">Not planned</span>
      </span>
    );
  }
  return <span className="hc-val">{value}</span>;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function HealthCompare() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredRows = activeCategory
    ? ROWS.filter(r => r.category === activeCategory)
    : ROWS;

  return (
    <BpPage className="hc">
      <PageHero
        sig
        label="In-Development Design Comparison"
        title="Compare All 4 Health Concepts"
        lead="Side-by-side comparison of four in-development health research designs. Listed capabilities are design goals; clinical validation and regulatory review are pending."
      >
        <div className="ctas">
          <Link href="/health" className="btn pri">
            View Health Page <span className="ar">›</span>
          </Link>
          <a
            href="https://github.com/embeddedos-org/eos-health"
            target="_blank"
            rel="noopener noreferrer"
            className="btn gh"
          >
            GitHub Repository <span aria-hidden="true">↗</span>
          </a>
        </div>
      </PageHero>

      {/* Radar chart */}
      <Section id="radar" alt>
        <div className="split2 hc-radar">
          <div className="sec-h">
            <h2>Illustrative Planned-Capability Radar</h2>
            <p className="lead">
              Conceptual comparison, not measured device performance.
            </p>
          </div>
          <div className="hc-stage">
            <Suspense fallback={<div className="hc-wait">Loading...</div>}>
              <DeviceRadarChart />
            </Suspense>
          </div>
        </div>
      </Section>

      {/* Comparison table */}
      <Section
        id="compare"
        wide
        title="Planned capabilities, side by side"
        lead="Filter by category. Listed capabilities are design goals for in-development concepts."
        split
      >
        <div
          className="ctas hc-filter"
          role="group"
          aria-label="Filter rows by category"
        >
          <button
            type="button"
            onClick={() => setActiveCategory(null)}
            aria-pressed={activeCategory === null}
            className="btn gh sm"
          >
            All Categories
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              aria-pressed={activeCategory === cat}
              className="btn gh sm"
            >
              {cat}
            </button>
          ))}
        </div>

        <div
          className="tbl hc-tbl"
          tabIndex={0}
          role="region"
          aria-label="Planned capabilities comparison table"
        >
          <table>
            <thead>
              <tr>
                <th scope="col">Feature</th>
                {DEVICES.map(d => (
                  <th
                    key={d.id}
                    scope="col"
                    style={{ "--c": d.color } as CSSProperties}
                  >
                    <span className="hc-dn">{d.name}</span>
                    <span className="hc-dt">{d.tagline}</span>
                    <span className="st">{d.status}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row, i) => {
                const prevCategory =
                  i > 0 ? filteredRows[i - 1].category : null;
                const showCategoryHeader = row.category !== prevCategory;
                return (
                  <Fragment key={row.label}>
                    {showCategoryHeader && (
                      <tr className="hc-cat">
                        <th colSpan={5} scope="colgroup">
                          {row.category}
                        </th>
                      </tr>
                    )}
                    <tr className={row.highlight ? "hc-key" : undefined}>
                      <th scope="row">
                        {row.label}
                        {row.highlight && <span className="hc-kb">KEY</span>}
                      </th>
                      {row.values.map((val, vi) => (
                        <td key={vi}>
                          <CellValue value={val} color={DEVICES[vi].color} />
                        </td>
                      ))}
                    </tr>
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Device cards summary */}
        <ul className="cards four hc-sum">
          {DEVICES.map((d, i) => {
            const count = ROWS.filter(r => r.values[i] === true).length;
            return (
              <li key={d.id}>
                <div
                  className="card"
                  style={{ "--c": d.color } as CSSProperties}
                >
                  <div>
                    <h3 className="hc-sn">{d.name}</h3>
                    <span className="k">{d.formFactor}</span>
                  </div>
                  <p className="hc-count">
                    <b>{count}</b>
                    <span>planned features</span>
                  </p>
                  <dl className="hc-dl">
                    <div>
                      <dt>Chip:</dt> <dd>{d.chip}</dd>
                    </div>
                    <div>
                      <dt>Research audience:</dt> <dd>{d.targetUser}</dd>
                    </div>
                    <div>
                      <dt>Patent:</dt> <dd>{d.patent}</dd>
                    </div>
                  </dl>
                </div>
              </li>
            );
          })}
        </ul>
      </Section>

      {/* CTA */}
      <Section
        id="open"
        alt
        title="Open Health Research Concept"
        lead="The device concepts are intended to share EoS research firmware and SDK interfaces. Review the linked repository for the components and integrations currently available."
      >
        <div className="ctas">
          <Link href="/health" className="btn pri">
            Explore Health Devices <span className="ar">›</span>
          </Link>
          <a
            href="https://github.com/embeddedos-org/eos-health"
            target="_blank"
            rel="noopener noreferrer"
            className="btn gh"
          >
            View Repository on GitHub <span aria-hidden="true">↗</span>
          </a>
        </div>
      </Section>
    </BpPage>
  );
}
