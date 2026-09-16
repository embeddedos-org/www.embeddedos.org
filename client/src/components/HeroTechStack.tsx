import {
  Suspense,
  lazy,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { Pause, Play } from "lucide-react";
import {
  ARCHITECTURE_STAGES,
  EAI_EDGE_PROFILE,
  type ArchitectureStageId,
  type MaturityStatus,
} from "@/data/architecture";

const ArchitectureHologramCanvas = lazy(
  () => import("./ArchitectureHologramCanvas")
);

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

const STATUS_TONES: Record<MaturityStatus, string> = {
  "Shipped profile": "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
  "Available project": "border-cyan-400/40 bg-cyan-400/10 text-cyan-300",
  "Experimental / Research":
    "border-amber-400/40 bg-amber-400/10 text-amber-300",
  Planned: "border-fuchsia-400/40 bg-fuchsia-400/10 text-fuchsia-300",
  "Design / Concept": "border-slate-400/40 bg-slate-400/10 text-slate-300",
};

export function supportsWebGL(): boolean {
  if (typeof document === "undefined") return false;

  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export function nextStageIndex(
  current: number,
  key: string,
  total = ARCHITECTURE_STAGES.length
): number {
  if (key === "Home") return 0;
  if (key === "End") return total - 1;
  if (key === "ArrowRight" || key === "ArrowDown") {
    return (current + 1) % total;
  }
  if (key === "ArrowLeft" || key === "ArrowUp") {
    return (current - 1 + total) % total;
  }
  return current;
}

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia?.(REDUCED_MOTION_QUERY);
    if (!mediaQuery) return;

    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);
    updatePreference();
    mediaQuery.addEventListener?.("change", updatePreference);
    return () => mediaQuery.removeEventListener?.("change", updatePreference);
  }, []);

  return prefersReducedMotion;
}

function StaticArchitecture({ reason }: { reason: string }) {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center px-8"
      data-testid="architecture-static-fallback"
    >
      <svg
        viewBox="0 0 520 330"
        className="h-full w-full max-h-[360px]"
        role="img"
        aria-label="Static exploded view of the seven-stage reference architecture"
      >
        <defs>
          <linearGradient id="hologram-line" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#38BDF8" />
            <stop offset="1" stopColor="#F97316" />
          </linearGradient>
        </defs>
        <path
          d="M260 42V288"
          stroke="url(#hologram-line)"
          strokeWidth="2"
          strokeDasharray="5 8"
          opacity="0.7"
        />
        {ARCHITECTURE_STAGES.map((stage, index) => {
          const y = 35 + index * 42;
          const inset = index * 7;
          return (
            <g key={stage.id}>
              <path
                d={`M${105 + inset} ${y} L${260} ${y - 18} L${415 - inset} ${y} L260 ${y + 18} Z`}
                fill={stage.color}
                fillOpacity="0.07"
                stroke={stage.color}
                strokeOpacity="0.8"
              />
              <circle cx="260" cy={y} r="3.5" fill={stage.color} />
            </g>
          );
        })}
      </svg>
      <p className="absolute bottom-4 left-4 right-4 text-center font-mono text-[10px] uppercase tracking-[0.16em] text-white/60">
        {reason}
      </p>
    </div>
  );
}

export default function HeroTechStack() {
  const [activeStageId, setActiveStageId] =
    useState<ArchitectureStageId>("hardware-sensors");
  const [webGLAvailable, setWebGLAvailable] = useState<boolean | null>(null);
  const [userPaused, setUserPaused] = useState(false);
  const stageButtons = useRef<Array<HTMLButtonElement | null>>([]);
  const prefersReducedMotion = usePrefersReducedMotion();
  const motionPaused = prefersReducedMotion || userPaused;
  const activeIndex = ARCHITECTURE_STAGES.findIndex(
    stage => stage.id === activeStageId
  );
  const activeStage = ARCHITECTURE_STAGES[activeIndex];

  useEffect(() => {
    setWebGLAvailable(supportsWebGL());
  }, []);

  const handleStageKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number
  ) => {
    const nextIndex = nextStageIndex(index, event.key);
    if (nextIndex === index && !["Home", "End"].includes(event.key)) return;

    event.preventDefault();
    setActiveStageId(ARCHITECTURE_STAGES[nextIndex].id);
    stageButtons.current[nextIndex]?.focus();
  };

  return (
    <figure
      className="relative flex h-full min-h-[560px] flex-col overflow-hidden"
      aria-labelledby="architecture-hologram-caption"
    >
      <div className="relative min-h-[340px] flex-1">
        <div className="absolute inset-0" aria-hidden="true">
          {webGLAvailable ? (
            <Suspense
              fallback={
                <StaticArchitecture reason="Loading interactive view" />
              }
            >
              <ArchitectureHologramCanvas
                activeStageId={activeStageId}
                motionPaused={motionPaused}
                onSelectStage={setActiveStageId}
                onRendererUnavailable={() => setWebGLAvailable(false)}
              />
            </Suspense>
          ) : (
            <StaticArchitecture
              reason={
                webGLAvailable === false
                  ? "Static view: WebGL is unavailable"
                  : "Preparing reference view"
              }
            />
          )}
        </div>

        <div className="pointer-events-none absolute left-4 top-4 max-w-[250px] rounded-lg border border-cyan-300/20 bg-[#050B14]/90 px-3 py-2 backdrop-blur-sm">
          <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-cyan-300/75">
            Stage {activeIndex + 1} / {ARCHITECTURE_STAGES.length}
          </div>
          <div className="mt-1 font-mono text-sm font-semibold text-white">
            {activeStage.label}
          </div>
          <div className="mt-1 text-[11px] leading-snug text-white/55">
            {activeStage.description}
          </div>
        </div>

        <div className="absolute right-4 top-4">
          <button
            type="button"
            onClick={() => setUserPaused(paused => !paused)}
            disabled={prefersReducedMotion}
            aria-pressed={motionPaused}
            aria-label={
              prefersReducedMotion
                ? "Animation paused for reduced motion"
                : userPaused
                  ? "Resume hologram animation"
                  : "Pause hologram animation"
            }
            className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/15 bg-[#050B14]/90 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-white/70 transition-colors hover:border-cyan-300/50 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {motionPaused ? <Play size={13} /> : <Pause size={13} />}
            {prefersReducedMotion
              ? "Motion reduced"
              : userPaused
                ? "Resume"
                : "Pause"}
          </button>
        </div>
      </div>

      <div className="border-t border-white/10 bg-[#050A14]/95 px-3 py-3">
        <ol
          className="grid grid-cols-4 gap-1.5 sm:grid-cols-7"
          aria-label="Reference architecture stages"
        >
          {ARCHITECTURE_STAGES.map((stage, index) => {
            const selected = stage.id === activeStageId;
            return (
              <li key={stage.id}>
                <button
                  ref={button => {
                    stageButtons.current[index] = button;
                  }}
                  type="button"
                  onClick={() => setActiveStageId(stage.id)}
                  onKeyDown={event => handleStageKeyDown(event, index)}
                  aria-pressed={selected}
                  aria-describedby={`architecture-stage-${stage.id}`}
                  tabIndex={selected ? 0 : -1}
                  className={`min-h-14 w-full rounded-md border px-1.5 py-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300 ${
                    selected
                      ? "border-white/30 bg-white/10 text-white"
                      : "border-white/8 bg-white/[0.025] text-white/50 hover:bg-white/5 hover:text-white/80"
                  }`}
                >
                  <span className="block font-mono text-[9px] text-white/50">
                    0{index + 1}
                  </span>
                  <span className="mt-0.5 block text-[10px] font-semibold leading-tight">
                    {stage.shortLabel}
                  </span>
                  <span
                    id={`architecture-stage-${stage.id}`}
                    className="sr-only"
                  >
                    {stage.description} Maturity: {stage.maturity}.
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-white/8 pt-3">
          <span
            className={`rounded-full border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.12em] ${STATUS_TONES[activeStage.maturity]}`}
          >
            {activeStage.maturity}
          </span>
          <span className="font-mono text-[10px] text-emerald-300/90">
            {EAI_EDGE_PROFILE.maturity}: {EAI_EDGE_PROFILE.name} ={" "}
            {EAI_EDGE_PROFILE.sequence.join(" → ")}
          </span>
        </div>
      </div>

      <figcaption
        id="architecture-hologram-caption"
        className="border-t border-white/8 bg-[#03070E] px-4 py-2 text-center text-[10px] leading-relaxed text-white/60"
      >
        Illustrative reference architecture. Maturity labels distinguish
        available work from research, planned integrations, and concepts.
      </figcaption>
    </figure>
  );
}
