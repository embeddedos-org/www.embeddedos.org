/**
 * ArchitectureSystemMap3D — the Architecture page's default diagram: a
 * detailed, interactive 3D system map of the seven-stage EmbeddedOS reference
 * architecture (client/src/data/architecture.ts).
 *
 * Robustness mirrors the homepage hero (CadEvolutionHero):
 * - no WebGL → a static 2D SVG node-link map of the same stages and edges,
 *   never a broken canvas;
 * - a runtime renderer failure swaps to the same SVG via an error boundary;
 * - prefers-reduced-motion → the 3D scene renders fully static (no
 *   auto-rotate, no idle motion); manual orbit still works;
 * - the full stage narrative lives in real DOM: a keyboard-operable stage
 *   list and a detail panel, so the canvas itself is informative but never
 *   the only path.
 */
import {
  Component,
  Suspense,
  lazy,
  useCallback,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import {
  ARCHITECTURE_STAGES,
  EAI_EDGE_PROFILE,
  type ArchitectureStageId,
  type MaturityStatus,
} from "@/data/architecture";
import { nextStageIndex, supportsWebGL } from "./HeroTechStack";
import { usePrefersReducedMotion } from "@/lib/reduced-motion";
import {
  MATURITY_DOT,
  SYSTEM_MAP_EDGES,
  edgeCurve,
  systemMapLayout,
  type PlacedNode,
} from "./system-map-data";

const SystemMapScene = lazy(() => import("./ArchitectureSystemMapScene"));

const MATURITY_TONES: Record<MaturityStatus, string> = {
  "Shipped profile": "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
  "Available project": "border-cyan-400/40 bg-cyan-400/10 text-cyan-300",
  "Experimental / Research":
    "border-amber-400/40 bg-amber-400/10 text-amber-300",
  Planned: "border-fuchsia-400/40 bg-fuchsia-400/10 text-fuchsia-300",
  "Design / Concept": "border-slate-400/40 bg-slate-400/10 text-slate-300",
};

const EDGE_COLOR = "#5B6B8C";
const HIGHLIGHT_COLOR = "#34D399";

// ── Static 2D fallback (SVG node-link map of the same stages + edges) ───────
const SVG_W = 620;
const SVG_H = 600;
const svgX = (x: number) => SVG_W / 2 + x * 62;
const svgY = (y: number) => SVG_H / 2 - y * 82;

function SystemMapStatic({
  nodes,
  selectedId,
  onSelect,
  reason,
}: {
  nodes: PlacedNode[];
  selectedId: ArchitectureStageId | null;
  onSelect: (id: ArchitectureStageId) => void;
  reason: string;
}) {
  const onNodeKeyDown = (
    event: KeyboardEvent<SVGGElement>,
    id: ArchitectureStageId
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect(id);
    }
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center px-4 py-6">
      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className="h-full w-full max-w-[520px]"
        role="img"
        aria-label="Static system map of the seven-stage EmbeddedOS reference architecture"
      >
        <defs>
          <marker
            id="sysmap-arrow"
            viewBox="0 0 8 8"
            refX="7"
            refY="4"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L8,4 L0,8 z" fill={EDGE_COLOR} />
          </marker>
          <marker
            id="sysmap-arrow-hl"
            viewBox="0 0 8 8"
            refX="7"
            refY="4"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L8,4 L0,8 z" fill={HIGHLIGHT_COLOR} />
          </marker>
        </defs>

        {SYSTEM_MAP_EDGES.map(edge => {
          const { a, b, c } = edgeCurve(edge, nodes);
          const hl = edge.highlight;
          return (
            <path
              key={`${edge.from}->${edge.to}`}
              d={`M${svgX(a[0])},${svgY(a[1])} Q${svgX(c[0])},${svgY(c[1])} ${svgX(b[0])},${svgY(b[1])}`}
              fill="none"
              stroke={hl ? HIGHLIGHT_COLOR : EDGE_COLOR}
              strokeWidth={hl ? 3 : 1.5}
              opacity={hl ? 0.95 : 0.6}
              markerEnd={hl ? "url(#sysmap-arrow-hl)" : "url(#sysmap-arrow)"}
            >
              <title>{`${edge.from} → ${edge.to}: ${edge.evidence}`}</title>
            </path>
          );
        })}

        {nodes.map(node => {
          const stage = ARCHITECTURE_STAGES.find(s => s.id === node.id);
          if (!stage) return null;
          const selected = selectedId === node.id;
          const w = node.w * 62;
          const h = 40;
          const x = svgX(node.x) - w / 2;
          const y = svgY(node.y) - h / 2;
          return (
            <g
              key={node.id}
              role="button"
              tabIndex={0}
              aria-label={`${stage.label}. Maturity: ${stage.maturity}.`}
              aria-pressed={selected}
              onClick={() => onSelect(node.id)}
              onKeyDown={e => onNodeKeyDown(e, node.id)}
              className="cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <rect
                x={x}
                y={y}
                width={w}
                height={h}
                rx={8}
                fill={stage.color}
                fillOpacity={selected ? 0.32 : 0.14}
                stroke={selected ? "#ffffff" : stage.color}
                strokeWidth={selected ? 2.5 : 1.5}
              />
              <text
                x={svgX(node.x)}
                y={svgY(node.y) + 4.5}
                textAnchor="middle"
                fill="#ffffff"
                fillOpacity={selected ? 1 : 0.85}
                fontSize={13}
                fontWeight={selected ? 700 : 600}
              >
                {stage.shortLabel}
              </text>
              <circle
                cx={x + w - 12}
                cy={y + h / 2}
                r={5}
                fill={MATURITY_DOT[stage.maturity]}
              >
                <title>{stage.maturity}</title>
              </circle>
            </g>
          );
        })}
      </svg>
      <p className="mt-2 text-center font-mono text-[10px] uppercase tracking-[0.16em] text-white/50">
        {reason}
      </p>
    </div>
  );
}

// ── Error boundary: a renderer that dies at runtime swaps to the SVG ─────────
class SystemMapErrorBoundary extends Component<{
  onUnavailable: () => void;
  fallback: ReactNode;
  children: ReactNode;
}> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    this.props.onUnavailable();
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

// ── Main component ──────────────────────────────────────────────────────────
export default function ArchitectureSystemMap3D({
  height = 400,
  className = "",
}: {
  height?: number;
  className?: string;
}) {
  const reducedMotion = usePrefersReducedMotion();
  const [webglOk, setWebglOk] = useState(() => supportsWebGL());
  const [selectedId, setSelectedId] =
    useState<ArchitectureStageId>("hardware-sensors");
  const stageButtons = useRef<Array<HTMLButtonElement | null>>([]);

  const selectStage = useCallback((id: ArchitectureStageId) => {
    setSelectedId(id);
  }, []);

  const handleStageKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number
  ) => {
    const next = nextStageIndex(index, event.key);
    if (next === index && !["Home", "End"].includes(event.key)) return;
    event.preventDefault();
    setSelectedId(ARCHITECTURE_STAGES[next].id);
    stageButtons.current[next]?.focus();
  };

  const selected =
    ARCHITECTURE_STAGES.find(s => s.id === selectedId) ??
    ARCHITECTURE_STAGES[0];
  const nodes = systemMapLayout();

  const staticFallback = (
    <SystemMapStatic
      nodes={nodes}
      selectedId={selectedId}
      onSelect={selectStage}
      reason="Static view: WebGL is unavailable"
    />
  );

  return (
    <div className={className}>
      {/* Viewport: 3D canvas or the static SVG map */}
      <div
        className="relative w-full rounded-2xl overflow-hidden border border-white/8"
        style={{ height, background: "#050A18" }}
      >
        {webglOk ? (
          <SystemMapErrorBoundary
            onUnavailable={() => setWebglOk(false)}
            fallback={staticFallback}
          >
            {/* Informative graphic: keyboard users get the same stages via
                the DOM list below; the canvas is operable by pointer. */}
            <div
              role="img"
              aria-label="Interactive 3D system map of the seven-stage EmbeddedOS reference architecture, from hardware at the base to physical action at the crown"
              className="absolute inset-0"
            >
              <Suspense fallback={null}>
                <SystemMapScene
                  reducedMotion={reducedMotion}
                  selectedId={selectedId}
                  onSelect={selectStage}
                />
              </Suspense>
            </div>
          </SystemMapErrorBoundary>
        ) : (
          staticFallback
        )}

        {/* Mode badge */}
        <div className="absolute top-2 right-3 z-10 pointer-events-none">
          <span className="text-[9px] font-mono font-bold tracking-widest uppercase px-2 py-0.5 rounded-full border text-cyan-300 border-cyan-300/40 bg-cyan-300/15">
            system map
          </span>
        </div>

        {/* Legend overlay: stage colors + maturity key + profile path */}
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none z-10 px-3 pt-6 pb-2"
          style={{
            background: "linear-gradient(to top, #050A18ee, transparent)",
          }}
        >
          <div className="flex flex-wrap gap-x-3 gap-y-1 mb-1.5">
            {ARCHITECTURE_STAGES.map(s => (
              <div key={s.id} className="flex items-center gap-1.5">
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: s.color }}
                />
                <span className="text-[9px] font-mono font-semibold tracking-wider text-white/55 uppercase">
                  {s.shortLabel}
                </span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {(
              Object.keys(MATURITY_DOT) as Array<keyof typeof MATURITY_DOT>
            ).map(m => (
              <div key={m} className="flex items-center gap-1.5">
                <div
                  className="w-2 h-2 rotate-45 flex-shrink-0"
                  style={{ background: MATURITY_DOT[m] }}
                />
                <span className="text-[9px] font-mono tracking-wider text-white/50 uppercase">
                  {m}
                </span>
              </div>
            ))}
            <div className="flex items-center gap-1.5">
              <div
                className="w-4 h-0.5 flex-shrink-0"
                style={{ background: HIGHLIGHT_COLOR }}
              />
              <span className="text-[9px] font-mono tracking-wider text-white/50 uppercase">
                {EAI_EDGE_PROFILE.maturity}: {EAI_EDGE_PROFILE.name}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* DOM stage selector — the keyboard path and the narrative in text */}
      <nav aria-label="System map stages" className="mt-4">
        <ol className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5">
          {ARCHITECTURE_STAGES.map((s, i) => {
            const active = s.id === selectedId;
            return (
              <li key={s.id}>
                <button
                  ref={el => {
                    stageButtons.current[i] = el;
                  }}
                  type="button"
                  onClick={() => selectStage(s.id)}
                  onKeyDown={e => handleStageKeyDown(e, i)}
                  aria-pressed={active}
                  tabIndex={active ? 0 : -1}
                  className={`w-full rounded-lg border px-2 py-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                    active
                      ? "border-white/30 bg-white/10"
                      : "border-white/8 bg-white/[0.025] hover:bg-white/5"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: s.color }}
                      aria-hidden="true"
                    />
                    <span className="font-mono text-[9px] text-white/50">
                      0{i + 1}
                    </span>
                  </span>
                  <span
                    className={`mt-1 block text-[11px] font-semibold leading-tight ${
                      active ? "text-white" : "text-white/70"
                    }`}
                  >
                    {s.shortLabel}
                  </span>
                  <span
                    className={`mt-1 inline-block rounded-full border px-1.5 py-px text-[9px] font-medium ${MATURITY_TONES[s.maturity]}`}
                  >
                    {s.maturity}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Detail panel — the semantic equivalent of a selected node */}
      <div
        aria-live="polite"
        className="mt-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5"
      >
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="inline-block h-2.5 w-2.5 rounded-full"
            style={{
              backgroundColor: selected.color,
              boxShadow: `0 0 10px ${selected.color}`,
            }}
            aria-hidden="true"
          />
          <span className="text-base font-bold text-white">
            {selected.label}
          </span>
          <span
            className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${MATURITY_TONES[selected.maturity]}`}
          >
            {selected.maturity}
          </span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-white/65">
          {selected.description}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {selected.products.map(p => (
            <span
              key={p}
              className="rounded-md bg-white/5 px-2 py-1 font-mono text-[11px] text-white/70"
            >
              {p}
            </span>
          ))}
        </div>
        <Link
          href={selected.href}
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[#38bdf8] hover:text-white"
        >
          Explore {selected.shortLabel}
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
