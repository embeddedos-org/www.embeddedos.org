import {
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  RotateCcw,
} from "lucide-react";
import { ARCHITECTURE_STAGES, type MaturityStatus } from "@/data/architecture";
import { supportsWebGL } from "./HeroTechStack";

const CadEvolutionScene = lazy(() =>
  import("./CadEvolutionScene").then(m => ({ default: m.CadEvolutionScene }))
);

export const TOTAL_STEPS = ARCHITECTURE_STAGES.length;
export const STEP_INTERVAL_MS = 3200;
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/** Pure step helpers (unit-tested). */
export function nextStepIndex(current: number): number {
  return Math.min(current + 1, TOTAL_STEPS - 1);
}
export function prevStepIndex(current: number): number {
  return Math.max(current - 1, 0);
}
export function clampStepIndex(step: number): number {
  return Math.min(Math.max(step, 0), TOTAL_STEPS - 1);
}

const MATURITY_TONES: Record<MaturityStatus, string> = {
  "Shipped profile": "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
  "Available project": "border-cyan-400/40 bg-cyan-400/10 text-cyan-300",
  "Experimental / Research":
    "border-amber-400/40 bg-amber-400/10 text-amber-300",
  Planned: "border-fuchsia-400/40 bg-fuchsia-400/10 text-fuchsia-300",
  "Design / Concept": "border-slate-400/40 bg-slate-400/10 text-slate-300",
};

function usePrefersReducedMotion(): boolean {
  const [reduced] = useState(() =>
    typeof window !== "undefined" && typeof window.matchMedia === "function"
      ? window.matchMedia(REDUCED_MOTION_QUERY).matches
      : false
  );
  return reduced;
}

/**
 * CadEvolutionHero — the homepage 3D centerpiece.
 *
 * A blueprint-style CAD model of a circuit board assembles itself through the
 * seven reference-architecture stages until it becomes the full EmbeddedOS
 * ecosystem. The stepper, controls, and explainer panel are real HTML so the
 * story is fully available without WebGL, to screen readers, and to crawlers.
 */
export default function CadEvolutionHero() {
  const reducedMotion = usePrefersReducedMotion();
  const [webglOk, setWebglOk] = useState(() => supportsWebGL());
  // stage 0..6 = the stage being explained; the 3D model builds stages 0..stage.
  const [stage, setStage] = useState(() =>
    reducedMotion ? TOTAL_STEPS - 1 : 0
  );
  const [playing, setPlaying] = useState(() => !reducedMotion);
  const progress = useRef<number[]>(Array(TOTAL_STEPS).fill(0));

  const goTo = useCallback(
    (next: number) => setStage(clampStepIndex(next)),
    []
  );

  // Auto-play the build: advance one stage per interval, then stop on the
  // finished ecosystem. Never auto-plays for reduced-motion users.
  useEffect(() => {
    if (!playing || reducedMotion) return;
    if (stage >= TOTAL_STEPS - 1) {
      setPlaying(false);
      return;
    }
    const id = window.setTimeout(
      () => setStage(s => nextStepIndex(s)),
      STEP_INTERVAL_MS
    );
    return () => window.clearTimeout(id);
  }, [playing, reducedMotion, stage]);

  const togglePlay = useCallback(() => {
    if (stage >= TOTAL_STEPS - 1 && !playing) {
      // Replay from the bare CAD design.
      setStage(0);
      setPlaying(true);
    } else {
      setPlaying(p => !p);
    }
  }, [stage, playing]);

  const onStepperKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        event.preventDefault();
        goTo(nextStepIndex(stage));
      } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        event.preventDefault();
        goTo(prevStepIndex(stage));
      } else if (event.key === "Home") {
        event.preventDefault();
        goTo(0);
      } else if (event.key === "End") {
        event.preventDefault();
        goTo(TOTAL_STEPS - 1);
      }
    },
    [goTo, stage]
  );

  const current = ARCHITECTURE_STAGES[stage];
  const atEnd = stage >= TOTAL_STEPS - 1;

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="px-5 pt-5 sm:px-6 sm:pt-6">
        <p className="eyebrow text-[#38bdf8] mb-2">
          Interactive 3D · The EoS stack
        </p>
        <h2
          id="cad-evolution-heading"
          className="font-heading text-xl sm:text-2xl font-bold text-white tracking-tight"
        >
          From CAD design to full ecosystem
        </h2>
        <p className="mt-2 text-sm text-white/60 leading-relaxed">
          Watch a bare circuit-board CAD model build itself into the complete
          EmbeddedOS platform — one stage at a time.
        </p>
      </div>

      {/* 3D viewport */}
      <div
        className="relative mx-5 sm:mx-6 mt-4 h-[340px] sm:h-[400px] overflow-hidden rounded-xl border border-white/10 bg-[#060b16]"
        aria-hidden="true"
      >
        {webglOk ? (
          <Suspense fallback={null}>
            <CadEvolutionScene
              step={stage + 1}
              progress={progress}
              reducedMotion={reducedMotion}
              onRendererUnavailable={() => setWebglOk(false)}
            />
          </Suspense>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
            <p className="text-sm text-white/50">
              3D preview unavailable on this device — the build steps below tell
              the full story.
            </p>
          </div>
        )}
        {/* Step badge */}
        <div className="absolute top-3 right-3 rounded-full border border-white/15 bg-black/50 px-3 py-1 font-mono text-[11px] text-white/80 backdrop-blur">
          Step {stage + 1} of {TOTAL_STEPS}
        </div>
      </div>

      {/* Stepper */}
      <nav
        aria-label="Ecosystem build steps"
        className="px-5 sm:px-6 mt-4"
        onKeyDown={onStepperKeyDown}
      >
        <ol className="flex items-center gap-1.5 sm:gap-2">
          {ARCHITECTURE_STAGES.map((s, i) => {
            const built = i <= stage;
            const active = i === stage;
            return (
              <li key={s.id} className="flex-1 min-w-0">
                <button
                  type="button"
                  onClick={() => {
                    goTo(i);
                    setPlaying(false);
                  }}
                  aria-current={active ? "step" : undefined}
                  aria-label={`Step ${i + 1}: ${s.label}${built ? " (built)" : ""}`}
                  title={s.label}
                  className={`group flex w-full flex-col items-center gap-1.5 rounded-lg px-1 py-2 transition-colors ${
                    active ? "bg-white/10" : "hover:bg-white/5"
                  }`}
                >
                  <span
                    className="h-2 w-full rounded-full transition-all"
                    style={{
                      backgroundColor: built
                        ? s.color
                        : "rgba(255,255,255,0.12)",
                      boxShadow: active ? `0 0 12px ${s.color}` : undefined,
                    }}
                  />
                  <span
                    className={`hidden sm:block truncate text-[10px] font-medium uppercase tracking-wider ${
                      active
                        ? "text-white"
                        : "text-white/50 group-hover:text-white/70"
                    }`}
                  >
                    {s.shortLabel}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Controls */}
      <div className="flex items-center justify-center gap-2 px-5 sm:px-6 mt-3">
        <button
          type="button"
          onClick={() => goTo(prevStepIndex(stage))}
          disabled={stage === 0}
          aria-label="Previous build step"
          className="rounded-lg border border-white/15 p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          type="button"
          onClick={togglePlay}
          aria-label={
            atEnd && !playing
              ? "Replay build animation"
              : playing
                ? "Pause build animation"
                : "Play build animation"
          }
          className="rounded-lg border border-white/15 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10"
        >
          <span className="inline-flex items-center gap-2">
            {atEnd && !playing ? (
              <RotateCcw size={15} />
            ) : playing ? (
              <Pause size={15} />
            ) : (
              <Play size={15} />
            )}
            {atEnd && !playing ? "Replay" : playing ? "Pause" : "Play"}
          </span>
        </button>
        <button
          type="button"
          onClick={() => goTo(nextStepIndex(stage))}
          disabled={atEnd}
          aria-label="Next build step"
          className="rounded-lg border border-white/15 p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Explainer panel — the semantic equivalent of the 3D story */}
      <div className="px-5 sm:px-6 mt-4 pb-5 sm:pb-6" aria-live="polite">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{
                backgroundColor: current.color,
                boxShadow: `0 0 10px ${current.color}`,
              }}
              aria-hidden="true"
            />
            <h3 className="font-heading text-base font-bold text-white">
              {current.label}
            </h3>
            <span
              className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${MATURITY_TONES[current.maturity]}`}
            >
              {current.maturity}
            </span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-white/65">
            {current.description}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {current.products.map(p => (
              <span
                key={p}
                className="rounded-md bg-white/5 px-2 py-1 font-mono text-[11px] text-white/70"
              >
                {p}
              </span>
            ))}
          </div>
          <Link
            href={current.href}
            className="link-underline mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[#38bdf8] hover:text-white"
          >
            Explore {current.shortLabel}
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
