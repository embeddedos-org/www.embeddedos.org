/**
 * CadWalkthrough3D — the Architecture page's default diagram: a CAD-to-product
 * walkthrough. One sensor board starts as a blueprint CAD drawing and gains
 * tangible parts stage by stage until it is a complete product.
 *
 * Robustness mirrors the homepage hero (CadEvolutionHero):
 * - no WebGL → a static 2D SVG exploded-view diagram of the same 8 steps,
 *   never a broken canvas;
 * - a runtime renderer failure swaps to the same SVG via an error boundary;
 * - prefers-reduced-motion → the 3D scene renders fully static (no
 *   auto-orbit, no build animation, no pulsing); manual orbit still works;
 * - the full narrative lives in real DOM: a keyboard-operable stepper and a
 *   detail panel, so the canvas itself is informative but never the only path.
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
import { ArrowRight, Pause, Play } from "lucide-react";
import { EAI_EDGE_PROFILE, MATURITY_TONES } from "@/data/architecture";
import { supportsWebGL } from "./HeroTechStack";
import { usePrefersReducedMotion } from "@/lib/reduced-motion";
import { useOnScreen } from "@/lib/on-screen";
import {
  MATURITY_DOT,
  WALKTHROUGH_STEPS,
  nextWalkthroughStep,
} from "./cad-walkthrough-data";

const CadScene = lazy(() => import("./CadWalkthroughScene"));

// ── Static 2D fallback (SVG exploded view of the same 8 steps) ──────────────
const SVG_W = 520;
const SVG_H = 620;

function CadStatic({
  activeStep,
  onSelect,
  reason,
}: {
  activeStep: number;
  onSelect: (step: number) => void;
  reason: string;
}) {
  const onStepKeyDown = (event: KeyboardEvent<SVGGElement>, step: number) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect(step);
    }
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center px-4 py-6">
      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className="h-full w-full max-w-[420px]"
        role="img"
        aria-label="Static exploded view of the CAD-to-product walkthrough: a bare circuit board drawing gaining parts through seven architecture stages"
      >
        <defs>
          <linearGradient id="cadwalk-spine" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#a1a1a6" />
            <stop offset="1" stopColor="#48484e" />
          </linearGradient>
        </defs>
        <path
          d={`M${SVG_W / 2} 30V${SVG_H - 30}`}
          stroke="url(#cadwalk-spine)"
          strokeWidth="2"
          strokeDasharray="5 8"
          opacity="0.7"
        />
        {WALKTHROUGH_STEPS.map((s, i) => {
          const y = 52 + i * 68;
          const inset = i * 6;
          const selected = i === activeStep;
          const label = s.maturity
            ? `${s.label}. Maturity: ${s.maturity}.`
            : `${s.label}. The bare board as a CAD drawing.`;
          return (
            <g
              key={s.key}
              role="button"
              tabIndex={0}
              aria-label={label}
              aria-pressed={selected}
              onClick={() => onSelect(i)}
              onKeyDown={e => onStepKeyDown(e, i)}
              className="cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <path
                d={`M${105 + inset} ${y} L${SVG_W / 2} ${y - 20} L${415 - inset} ${y} L${SVG_W / 2} ${y + 20} Z`}
                fill={s.color}
                fillOpacity={selected ? 0.3 : i === 0 ? 0 : 0.08}
                stroke={selected ? "#ffffff" : s.color}
                strokeWidth={selected ? 2.5 : 1.5}
                strokeDasharray={i === 0 ? "6 4" : undefined}
              />
              <text
                x={SVG_W / 2}
                y={y + 4.5}
                textAnchor="middle"
                fill="#ffffff"
                fillOpacity={selected ? 1 : 0.85}
                fontSize={13}
                fontWeight={selected ? 700 : 600}
              >
                {i === 0 ? "CAD" : s.shortLabel}
              </text>
              {s.maturity && (
                <circle
                  cx={415 - inset - 14}
                  cy={y}
                  r={5}
                  fill={MATURITY_DOT[s.maturity]}
                >
                  <title>{s.maturity}</title>
                </circle>
              )}
            </g>
          );
        })}
      </svg>
      <p className="mt-2 text-center font-mono text-xs uppercase tracking-[0.16em] text-white/60">
        {reason}
      </p>
    </div>
  );
}

// ── Error boundary: a renderer that dies at runtime swaps to the SVG ─────────
class CadErrorBoundary extends Component<{
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
/** Room kept clear at the top of the viewport for the pause control (px). */
const STAGE_CONTROLS_INSET = 56;

export default function CadWalkthrough3D({
  height = 400,
  className = "",
}: {
  height?: number;
  className?: string;
}) {
  const reducedMotion = usePrefersReducedMotion();
  const [webglOk, setWebglOk] = useState(() => supportsWebGL());
  const [step, setStep] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const motionPaused = reducedMotion || userPaused;
  const stepButtons = useRef<Array<HTMLButtonElement | null>>([]);
  // The scene draws every frame only while it is on screen (and motion is
  // allowed); scrolled away it stops.
  const stageRef = useRef<HTMLDivElement>(null);
  const onScreen = useOnScreen(stageRef);

  const selectStep = useCallback((next: number) => {
    setStep(Math.max(0, Math.min(WALKTHROUGH_STEPS.length - 1, next)));
  }, []);

  const handleStepKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number
  ) => {
    const next = nextWalkthroughStep(index, event.key);
    if (next === index && !["Home", "End"].includes(event.key)) return;
    event.preventDefault();
    selectStep(next);
    stepButtons.current[next]?.focus();
  };

  const active = WALKTHROUGH_STEPS[step];

  const staticFallback = (
    <CadStatic
      activeStep={step}
      onSelect={selectStep}
      reason="Static view: WebGL is unavailable"
    />
  );

  return (
    <div className={className}>
      {/* The stage: the 3D viewport, with its legend in a strip under it
          (never over the model, however many lines it wraps to on a phone) */}
      <div
        ref={stageRef}
        className="w-full rounded-2xl overflow-hidden border border-white/8"
        style={{ background: "var(--panel, #0b0b0d)" }}
      >
        {/* Viewport: 3D canvas or the static SVG exploded view */}
        <div className="relative w-full" style={{ height }}>
          {webglOk ? (
            <CadErrorBoundary
              onUnavailable={() => setWebglOk(false)}
              fallback={staticFallback}
            >
              {/* Informative graphic: the DOM stepper below is the keyboard
                path; the canvas is operable by pointer. */}
              <div
                role="img"
                aria-label={`Interactive 3D CAD walkthrough of the EmbeddedOS reference device, currently at step ${step + 1} of ${WALKTHROUGH_STEPS.length}: ${active.label}`}
                className="absolute inset-0"
              >
                <Suspense fallback={null}>
                  <CadScene
                    step={step}
                    reducedMotion={reducedMotion}
                    motionPaused={motionPaused}
                    onScreen={onScreen}
                    insetTop={STAGE_CONTROLS_INSET}
                    onRendererUnavailable={() => setWebglOk(false)}
                  />
                </Suspense>
              </div>
            </CadErrorBoundary>
          ) : (
            staticFallback
          )}

          {/* Mode badge */}
          <div className="absolute top-2 right-3 z-10 pointer-events-none">
            <span className="text-xs font-mono font-bold tracking-widest uppercase px-2 py-0.5 rounded-full border text-[#a1a1a6] border-[#34343a] bg-black/70">
              cad walkthrough
            </span>
          </div>

          {/* Pause control for the auto-orbit */}
          {webglOk && (
            <div className="absolute top-2 left-3 z-10">
              <button
                type="button"
                onClick={() => setUserPaused(p => !p)}
                disabled={reducedMotion}
                aria-pressed={motionPaused}
                aria-label={
                  reducedMotion
                    ? "Animation paused for reduced motion"
                    : userPaused
                      ? "Resume auto-orbit"
                      : "Pause auto-orbit"
                }
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-black/80 px-3 py-1.5 font-mono text-xs uppercase tracking-[0.12em] text-white/70 transition-colors hover:border-[#a1a1a6] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                // a 44px tap target; inline, because index.css sets a 32px
                // floor on inline-flex buttons outside Tailwind's layers
                style={{ minHeight: 44 }}
              >
                {motionPaused ? <Play size={13} /> : <Pause size={13} />}
                {reducedMotion
                  ? "Motion reduced"
                  : userPaused
                    ? "Resume"
                    : "Pause"}
              </button>
            </div>
          )}
        </div>

        {/* Legend: stage colors + maturity key */}
        <div className="border-t border-white/8 px-3 py-2.5">
          <div className="flex flex-wrap gap-x-3 gap-y-1 mb-1.5">
            {WALKTHROUGH_STEPS.map((s, i) => (
              <div key={s.key} className="flex items-center gap-1.5">
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: s.color }}
                />
                <span className="text-xs font-mono font-semibold tracking-wider text-white/70 uppercase">
                  {i === 0 ? "CAD" : s.shortLabel}
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
                <span className="text-xs font-mono tracking-wider text-white/60 uppercase">
                  {m}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* DOM stepper — the keyboard path and the narrative in text */}
      <nav aria-label="CAD walkthrough steps" className="mt-4">
        <ol className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-1.5">
          {WALKTHROUGH_STEPS.map((s, i) => {
            const isActive = i === step;
            return (
              <li key={s.key}>
                <button
                  ref={el => {
                    stepButtons.current[i] = el;
                  }}
                  type="button"
                  onClick={() => selectStep(i)}
                  onKeyDown={e => handleStepKeyDown(e, i)}
                  aria-pressed={isActive}
                  tabIndex={isActive ? 0 : -1}
                  className={`w-full rounded-lg border px-2 py-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                    isActive
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
                    <span className="font-mono text-xs text-white/60">
                      {i === 0 ? "CAD" : `0${i}`}
                    </span>
                  </span>
                  <span
                    className={`mt-1 block text-xs font-semibold leading-tight ${
                      isActive ? "text-white" : "text-white/70"
                    }`}
                  >
                    {s.shortLabel}
                  </span>
                  {s.maturity ? (
                    <span
                      className={`mt-1 inline-flex items-center gap-1.5 rounded-md border px-1.5 py-px text-xs font-medium leading-snug ${MATURITY_TONES[s.maturity]}`}
                    >
                      <span
                        className="w-1.5 h-1.5 rotate-45 flex-shrink-0"
                        style={{ background: MATURITY_DOT[s.maturity] }}
                        aria-hidden="true"
                      />
                      {s.maturity}
                    </span>
                  ) : (
                    <span className="mt-1 inline-block rounded-md border border-[#34343a] px-1.5 py-px text-xs font-medium leading-snug text-[#a1a1a6]">
                      Drawing
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Detail panel — the semantic equivalent of the 3D step */}
      <div
        aria-live="polite"
        className="mt-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5"
      >
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="inline-block h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: active.color }}
            aria-hidden="true"
          />
          <span className="text-base font-bold text-white">
            {step === 0 ? "Step 0 — " : `Step ${step} — `}
            {active.label}
          </span>
          {active.maturity && (
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${MATURITY_TONES[active.maturity]}`}
            >
              <span
                className="w-1.5 h-1.5 rotate-45 flex-shrink-0"
                style={{ background: MATURITY_DOT[active.maturity] }}
                aria-hidden="true"
              />
              {active.maturity}
            </span>
          )}
        </div>
        <p className="mt-2 text-sm leading-relaxed text-white/65">
          {active.description}
        </p>
        {active.key === "on-device-ai" && (
          <p className="mt-2 font-mono text-xs text-[#a1a1a6]">
            {EAI_EDGE_PROFILE.maturity}: {EAI_EDGE_PROFILE.name} ={" "}
            {EAI_EDGE_PROFILE.sequence.join(" → ")}
          </p>
        )}
        {active.products.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {active.products.map(p => (
              <span
                key={p}
                className="rounded-md bg-white/5 px-2 py-1 font-mono text-xs text-white/70"
              >
                {p}
              </span>
            ))}
          </div>
        )}
        {active.href && (
          <Link
            href={active.href}
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[#ff8a3d] hover:text-[#f97316]"
          >
            Explore {active.shortLabel}
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        )}
      </div>
    </div>
  );
}
