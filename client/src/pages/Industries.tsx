import type { CSSProperties } from "react";
import { Link } from "wouter";
import {
  INDUSTRIES,
  industriesInGroup,
  withReferenceDesign,
  FUNDING_THEMES,
  type Industry,
} from "@/data/industries";
import {
  BpPage,
  BoardFigure,
  LocalNav,
  PageHero,
  Section,
} from "@/components/bp";
import "./Industries.css";

/**
 * The path every one of these industries follows. This is the answer to "why
 * does a hardware project need an operating system foundation" — the CAD file is
 * where it starts, and the board is useless until something runs on it.
 */
const PIPELINE = [
  {
    step: "Schematic & CAD",
    detail:
      "The design starts as a schematic and PCB layout — KiCad sources, a bill of materials, and the mechanical model, published openly rather than held as a trade secret.",
  },
  {
    step: "Board & bring-up",
    detail:
      "Fabrication and assembly produce real hardware, which then has to be brought up: power sequencing, clocks, memory, and every peripheral proven one at a time.",
  },
  {
    step: "Operating system & drivers",
    detail:
      "This is the gap the Foundation exists to close. A board with no scheduler, no driver model and no bootloader does nothing. EoS, eBoot and the driver layer make it a computer.",
  },
  {
    step: "Application & certification",
    detail:
      "Above the OS sits the domain logic — flight control, patient monitoring, grid protection — and the evidence trail a certification authority will ask for.",
  },
];

/** Colour per funding theme, so a reader can scan the sectors by theme. */
const THEME_COLOR: Record<string, string> = {
  Sovereignty: "#60A5FA",
  "Safety certification": "#F97316",
  Decarbonisation: "#34D399",
  "Health access": "#F472B6",
  Resilience: "#FBBF24",
};

const MEDIA = "/media/home-2026-10-22/industries/";

/**
 * The homepage's industry renders (Chapters.tsx, data-clip) that depict a
 * design in a sector listed here. Each caption names the design actually shown,
 * which is not always the sector's reference design; the wording follows the
 * homepage chapter for that render. Sectors with no render that depicts one of
 * their designs have no entry, rather than borrowing an unrelated image.
 */
const SECTOR_RENDER: Record<
  string,
  { clip: string; design: string; shows: string }
> = {
  aerospace: {
    clip: "d06",
    design: "ePAM Urban Drone",
    shows:
      "a four-seat tilt-rotor eVTOL design from the ePAM collection, shown as a scale model",
  },
  "space-satellite": {
    clip: "d10",
    design: "eSRB-900",
    shows:
      "a space-robotics controller design for a seven-axis arm on a rad-hard processor (eFrontier)",
  },
  defence: {
    clip: "d19",
    design: "eRGD-2000",
    shows:
      "a rugged mission computer design that cools by conduction and needs no fan (eDefense)",
  },
  "naval-maritime": {
    clip: "d05",
    design: "eNav-ECDIS",
    shows: "the electronic chart display design named on this sector",
  },
  "radar-sensing": {
    clip: "d04",
    design: "eRadar360",
    shows:
      "the windshield-mounted design fusing 77 GHz radar, laser detectors and V2X",
  },
  "ev-charging": {
    clip: "d12",
    design: "eBMS-100A",
    shows: "the battery-management design named on this sector",
  },
  "medical-devices": {
    clip: "d03",
    design: "eECG-12",
    shows: "a battery-powered 12-lead ECG design (eMedical)",
  },
  "digital-health": {
    clip: "d02",
    design: "HEALTH-BAND Neuro",
    shows: "a wristband design from the same EoS Health family",
  },
  "oil-gas": {
    clip: "d14",
    design: "eGasDetect-4",
    shows: "the four-gas detector design in the same family as eEnv-ATEX",
  },
  "industrial-automation": {
    clip: "d11",
    design: "ePLC-1000",
    shows: "the modular PLC design named on this sector",
  },
  robotics: {
    clip: "d08",
    design: "eRobotics",
    shows:
      "a robot assembled from five eRobotics designs, the eArm-7 arm on an eAMR-500 base among them",
  },
  semiconductors: {
    clip: "d16",
    design: "eASIC-Vision",
    shows:
      "a computer-vision chip design from the same semiconductor-products line",
  },
  cybersecurity: {
    clip: "d18",
    design: "eHSM-9000",
    shows:
      "a network-attached hardware security module design (eCybersecurity)",
  },
  agriculture: {
    clip: "d09",
    design: "eAgri-Tractor",
    shows:
      "the autonomous tractor design in the eRobotics autonomous-systems line",
  },
  "smart-cities": {
    clip: "d13",
    design: "eSL-400",
    shows: "a street-light controller design from the eSmartCity collection",
  },
  "smart-home-iot": {
    clip: "d17",
    design: "eHub-Pro",
    shows: "the multi-protocol home hub named on this sector",
  },
  "edge-ai": {
    clip: "d15",
    design: "eVIS-600",
    shows: "a four-camera vision design on an i.MX 8M Plus NPU (eEdgeAI)",
  },
  "autonomous-drones": {
    clip: "d07",
    design: "eMR-400",
    shows:
      "a multirotor inspection drone design from the same UAV and drone line",
  },
};

function MaturityBadge({ maturity }: { maturity: Industry["maturity"] }) {
  const isSought = maturity.trl === null;
  return (
    <span
      className="st"
      style={{ "--c": isSought ? "var(--fg3)" : "#67E8F9" } as CSSProperties}
    >
      {maturity.trl ?? "Not yet assessed"}
    </span>
  );
}

function IndustryRow({ industry }: { industry: Industry }) {
  const themeColor = THEME_COLOR[industry.fundingTheme] ?? "#FFFFFF";
  const render = SECTOR_RENDER[industry.id];
  const details = (
    <dl className="ind-dl">
      <div>
        <dt>Target standards</dt>
        <dd>
          <ul className="ind-std">
            {industry.targetStandards.map(s => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </dd>
      </div>
      <div>
        <dt>Reference design</dt>
        <dd>
          {industry.referenceDesign ? (
            <>
              <span className="ind-ref">{industry.referenceDesign.name}</span>
              <span className="ind-note">{industry.referenceDesign.note}</span>
              <code className="ind-path">
                {industry.referenceDesign.repoPath}
              </code>
            </>
          ) : (
            <span className="ind-note">
              None yet. Listed here because the Foundation intends to serve this
              sector — the work is on the{" "}
              <Link href="/roadmap" className="tl ind-tap">
                roadmap
              </Link>
              , not in a repository.
            </span>
          )}
        </dd>
      </div>
      <div>
        <dt>Maturity</dt>
        <dd className="ind-note">{industry.maturity.status}</dd>
      </div>
    </dl>
  );

  return (
    <article
      className={render ? "ind-row has-fig" : "ind-row"}
      id={industry.id}
      aria-labelledby={`${industry.id}-h`}
    >
      <div className="ind-head">
        <div className="ind-top">
          <h3 id={`${industry.id}-h`}>{industry.name}</h3>
          <MaturityBadge maturity={industry.maturity} />
        </div>
        <p className="ind-blurb">{industry.blurb}</p>
        <span
          className="ind-theme"
          style={{ "--c": themeColor } as CSSProperties}
        >
          {industry.fundingTheme}
        </span>
      </div>
      {render && (
        <div className="ind-fig">
          <BoardFigure
            base={MEDIA + render.clip}
            width={1280}
            height={720}
            alt={`${render.design}: ${render.shows}`}
            caption={
              <>
                <span>
                  <b>{render.design}</b> — {render.shows}
                </span>
                <span>Render · design stage</span>
              </>
            }
          />
        </div>
      )}
      <div className="ind-body">{details}</div>
    </article>
  );
}

export default function Industries() {
  const core = industriesInGroup("core");
  const frontier = industriesInGroup("frontier");
  const backed = withReferenceDesign();

  return (
    <BpPage className="ind">
      <PageHero
        sig
        label="Industries"
        title="Industries We Serve — from CAD to certification"
        lead="A schematic becomes a board, and a board is inert until an operating system, a bootloader and a driver layer bring it to life. That gap is the same in an aircraft, an insulin pump and a substation relay — and it is the gap the Foundation exists to close, openly, for every sector below."
      >
        <p className="ind-count">
          <b>{INDUSTRIES.length}</b> sectors · <b>{backed}</b> with a reference
          design in a public repository today
        </p>
      </PageHero>

      <LocalNav
        name="Industries"
        items={[
          { id: "pipeline", label: "Four steps" },
          { id: "how-to-read", label: "How to read" },
          { id: "core", label: "Core industries" },
          { id: "frontier", label: "Frontier" },
          { id: "next", label: "What's next" },
        ]}
      />

      {/* The pipeline */}
      <Section
        id="pipeline"
        label="From CAD to Certified Product"
        title="The same four steps, in every industry"
        lead="The Foundation works across all four, which is why one organisation can serve sectors as different as avionics and agriculture: the hardware differs, the path does not."
        split
      >
        <ol className="cards four">
          {PIPELINE.map((stage, i) => (
            <li key={stage.step}>
              <div className="card">
                <span className="k">STEP {i + 1}</span>
                <h3>{stage.step}</h3>
                <p>{stage.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {/* How to read these entries — the honesty legend */}
      <Section id="how-to-read" alt title="How to read these cards">
        <dl className="cards ind-legend">
          <div className="card">
            <dt>Target standards are targets, not certifications held.</dt>
            <dd>
              The Foundation holds no certification from any authority. Each
              design is engineered toward the standard named on its card, and
              the standards tables in the design repositories are titled
              "Compliance Targets" for the same reason. Certification is the
              responsibility of whoever brings a device to market.
            </dd>
          </div>
          <div className="card">
            <dt>
              TRL is self-assessed and has not been independently audited.
            </dt>
            <dd>
              The bands are derived from each design's own recorded status: a
              concept maps to TRL 1–2, a research-phase design to TRL 2–3, and a
              design-phase design to TRL 3–4. No physical qualification campaign
              has been run, so nothing here claims TRL 5 or above.
            </dd>
          </div>
          <div className="card">
            <dt>A reference design means a design that exists.</dt>
            <dd>
              Each card names a real design and the repository path holding it.
              Where the Foundation has no design for a sector yet, the card says
              so and points at the roadmap rather than borrowing an unrelated
              board.
            </dd>
          </div>
        </dl>

        <div className="ind-themes">
          <span className="label">Funding themes</span>
          <ul>
            {FUNDING_THEMES.map(theme => (
              <li
                key={theme}
                className="ind-theme"
                style={{ "--c": THEME_COLOR[theme] } as CSSProperties}
              >
                {theme}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Core industries */}
      <Section
        id="core"
        wide
        label="Core Industries"
        title={<>{core.length} sectors the platform already targets</>}
        lead="Each card carries the standard the design is built toward, its self-assessed maturity, a reference design that exists in a public repository, and the public-funding theme the work maps to."
        split
      >
        <nav className="ind-index" aria-label="Sectors">
          <ul>
            {[...core, ...frontier].map(i => (
              <li key={i.id}>
                <a href={`#${i.id}`}>{i.name}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ind-list">
          {core.map(industry => (
            <IndustryRow key={industry.id} industry={industry} />
          ))}
        </div>
      </Section>

      {/* Frontier */}
      <Section
        id="frontier"
        wide
        alt
        label="Emerging & Frontier"
        title="Where the research is earlier"
        lead="These are earlier than the core sectors and are labelled that way deliberately. They are the innovation-track work: promising, funded by research grants rather than product revenue, and honest about how far along they are."
        split
      >
        <div className="ind-list">
          {frontier.map(industry => (
            <IndustryRow key={industry.id} industry={industry} />
          ))}
        </div>
      </Section>

      {/* Close */}
      <Section
        id="next"
        title="Where this is going next"
        lead="The roadmap says which of these sectors gets attention next, and what has to be true before a design can move past TRL 4 — physical qualification, then certification evidence. The programmes behind the work, and what the Foundation deliberately does not do, are on the Mission & Scope page."
      >
        <div className="ctas">
          <Link href="/roadmap" className="btn or">
            See the roadmap{" "}
            <span className="ar" aria-hidden="true">
              →
            </span>
          </Link>
          <Link href="/mission" className="btn gh">
            Mission &amp; Scope
          </Link>
          <Link href="/ecad-hardware" className="btn gh">
            Hardware design catalogue
          </Link>
        </div>
      </Section>
    </BpPage>
  );
}
