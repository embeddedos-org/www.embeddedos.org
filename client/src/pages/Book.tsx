import { useEffect, useReducer, useRef } from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  CircuitBoard,
  Clock,
  Globe,
  Home,
  Mail,
} from "lucide-react";
import BookingCalendar from "@/components/BookingCalendar";
import {
  BOOKING_EXPECT,
  BOOKING_EXPECT_BY_EMAIL,
  BOOKING_FAQ,
  BOOKING_FAQ_BY_EMAIL,
  BOOKING_MINUTES,
  BOOKING_TIME_ZONE_NOTE,
  BOOKING_TIME_ZONE_NOTE_BY_EMAIL,
  BOOKING_TOPICS,
  type BookingTopic,
} from "@/data/booking";
import { CALENDLY_EVENT_URL } from "@/data/foundation";
import {
  BOOKING_STEPS,
  INITIAL_BOOKING,
  bookingReducer,
  calendlyEventUrl,
  type BookingStep,
} from "@/lib/booking";
import { openContactForm } from "@/lib/contact-form";
import { usePrefersReducedMotion } from "@/lib/reduced-motion";

const TRACES = [
  "M1200 90 H1050 V190 H920",
  "M1200 300 H1080 V420 H880",
  "M0 360 H160 V330 H420 V430 H600",
  "M700 480 V430 H820 V370",
  "M0 120 H80 V260",
  "M1200 210 H1110 V250 H1000",
];
const VIAS: ReadonlyArray<readonly [number, number]> = [
  [920, 190],
  [880, 420],
  [600, 430],
  [820, 370],
  [80, 260],
  [1000, 250],
];

const CONFETTI = Array.from({ length: 14 }, (_, i) => ({
  angle: (360 / 14) * i,
  distance: 70 + (i % 3) * 22,
  color: ["#F97316", "#22D3EE", "#A78BFA", "#34D399", "#FB923C"][i % 5],
  delay: (i % 4) * 40,
}));

function stepIndex(step: BookingStep): number {
  return BOOKING_STEPS.findIndex(s => s.step === step);
}

function HeroTraces() {
  return (
    <svg
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
      style={{
        maskImage:
          "radial-gradient(ellipse 55% 45% at 32% 42%, transparent 35%, black 80%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 55% 45% at 32% 42%, transparent 35%, black 80%)",
      }}
      viewBox="0 0 1200 480"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
    >
      {TRACES.map((d, i) => (
        <g key={d}>
          <path
            d={d}
            stroke="currentColor"
            strokeWidth="2"
            className="text-white/[0.06]"
          />
          <path
            d={d}
            stroke={i % 2 ? "#22D3EE" : "#F97316"}
            strokeWidth="2"
            strokeLinecap="round"
            pathLength={100}
            className="book-trace"
            style={{ animationDelay: `${i * -1.7}s` }}
          />
        </g>
      ))}
      {VIAS.map(([cx, cy]) => (
        <circle
          key={`${cx}-${cy}`}
          cx={cx}
          cy={cy}
          r="5"
          className="fill-brand-navy stroke-brand-amber/60"
          strokeWidth="2"
        />
      ))}
    </svg>
  );
}

function Stepper({ step }: { step: BookingStep }) {
  const current = stepIndex(step);
  return (
    <ol
      aria-label="Booking progress"
      className="grid grid-cols-3 gap-2 sm:gap-4"
    >
      {BOOKING_STEPS.map((s, i) => {
        const done = i < current || step === "confirmed";
        const active = i === current;
        return (
          <li
            key={s.step}
            aria-current={active ? "step" : undefined}
            className="min-w-0"
          >
            <div
              className={`h-1 rounded-full transition-colors duration-500 motion-reduce:transition-none ${done || active ? "bg-brand-amber" : "bg-white/15"}`}
            />
            <div className="mt-2 flex items-center gap-2 min-w-0">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-all duration-300 motion-reduce:transition-none ${done ? "border-brand-amber bg-brand-amber text-brand-navy" : active ? "border-brand-amber text-brand-amber-light shadow-glow-amber" : "border-white/25 text-white/70"}`}
              >
                {done ? <Check size={14} aria-hidden="true" /> : i + 1}
              </span>
              <span
                className={`text-xs sm:text-sm font-semibold leading-tight ${active || done ? "text-white" : "text-white/70"}`}
              >
                {s.label}
                {done && <span className="sr-only"> (done)</span>}
              </span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function TopicCard({
  topic,
  checked,
  disabled,
  onSelect,
}: {
  topic: BookingTopic;
  checked: boolean;
  disabled: boolean;
  onSelect: () => void;
}) {
  return (
    <label className="group relative block cursor-pointer has-[:disabled]:cursor-default">
      <input
        type="radio"
        name="booking-topic"
        value={topic.key}
        checked={checked}
        disabled={disabled}
        onChange={onSelect}
        className="peer sr-only"
      />
      <span className="flex h-full flex-col gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-all duration-300 ease-out motion-reduce:transition-none group-hover:-translate-y-0.5 group-hover:border-white/25 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-amber peer-checked:-translate-y-0.5 peer-checked:border-brand-amber peer-checked:bg-brand-amber/[0.08] peer-checked:shadow-glow-amber motion-reduce:group-hover:translate-y-0 motion-reduce:peer-checked:translate-y-0">
        <span className="flex items-start justify-between gap-3">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
            style={{ background: `${topic.color}1f`, color: topic.color }}
          >
            <topic.icon size={20} aria-hidden="true" />
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-white/15 px-2 py-0.5 text-xs text-white/80">
            <Clock size={12} aria-hidden="true" /> {topic.minutes} min
          </span>
        </span>
        <span className="font-heading text-base font-bold text-white">
          {topic.title}
        </span>
        <span className="text-sm leading-relaxed text-gray-300">
          {topic.line}
        </span>
      </span>
      <span
        aria-hidden="true"
        className="book-pop absolute right-3 bottom-3 hidden h-6 w-6 items-center justify-center rounded-full bg-brand-amber text-brand-navy peer-checked:flex"
      >
        <Check size={14} />
      </span>
    </label>
  );
}

function Confirmed({
  topic,
  onRestart,
}: {
  topic: BookingTopic | null;
  onRestart: () => void;
}) {
  const heading = useRef<HTMLHeadingElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  useEffect(() => {
    heading.current?.focus();
  }, []);
  return (
    <div
      data-booking-state="confirmed"
      className="relative overflow-hidden rounded-2xl border border-brand-green/40 bg-brand-navy-light p-6 sm:p-10 text-center shadow-glow-teal"
    >
      <div className="relative mx-auto mb-6 h-24 w-24">
        {!reducedMotion && (
          <div aria-hidden="true" className="absolute inset-0">
            {CONFETTI.map(c => (
              <span
                key={c.angle}
                className="book-confetti absolute left-1/2 top-1/2 h-2 w-2 rounded-sm"
                style={
                  {
                    background: c.color,
                    animationDelay: `${500 + c.delay}ms`,
                    "--angle": `${c.angle}deg`,
                    "--distance": `${c.distance}px`,
                  } as React.CSSProperties
                }
              />
            ))}
          </div>
        )}
        <svg viewBox="0 0 96 96" className="h-24 w-24" aria-hidden="true">
          <circle
            cx="48"
            cy="48"
            r="44"
            fill="none"
            strokeWidth="4"
            pathLength={100}
            className="book-draw stroke-brand-green"
          />
          <path
            d="M30 50 L43 62 L67 36"
            fill="none"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={100}
            className="book-draw book-draw-late stroke-brand-green"
          />
        </svg>
      </div>
      <h2
        ref={heading}
        tabIndex={-1}
        className="font-heading text-3xl font-black text-white outline-none"
      >
        You're booked
      </h2>
      {topic && (
        <p className="mt-2 text-brand-amber-light font-semibold">
          {topic.title} · {topic.minutes} min
        </p>
      )}
      <p className="mx-auto mt-4 max-w-xl leading-relaxed text-gray-300">
        You and the team each get an email with the time and a video link. To
        reschedule or cancel, use the link in yours.
      </p>
      <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
        <Link
          href="/eos-boards"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-amber px-5 py-3 font-semibold text-brand-navy hover:bg-brand-amber-light"
        >
          <CircuitBoard size={18} aria-hidden="true" /> Explore EoS boards
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 px-5 py-3 font-semibold text-white hover:border-white/40"
        >
          <Home size={18} aria-hidden="true" /> Back to home
        </Link>
      </div>
      <button
        type="button"
        onClick={onRestart}
        className="mt-6 text-sm text-gray-300 underline underline-offset-2 hover:text-white"
      >
        Book another call
      </button>
    </div>
  );
}

export default function Book() {
  const [state, dispatch] = useReducer(bookingReducer, INITIAL_BOOKING);
  const topic = BOOKING_TOPICS.find(t => t.key === state.topic) ?? null;
  const current = BOOKING_STEPS[stepIndex(state.step)];
  // The test BookingCalendar applies: without a valid event URL there is no
  // calendar, only the email fallback, and Calendly sends no confirmation.
  const hasCalendar = calendlyEventUrl(CALENDLY_EVENT_URL) !== null;
  const expectations = hasCalendar ? BOOKING_EXPECT : BOOKING_EXPECT_BY_EMAIL;
  const questions = hasCalendar ? BOOKING_FAQ : BOOKING_FAQ_BY_EMAIL;

  return (
    <div className="min-h-screen bg-background text-white">
      <section className="relative overflow-hidden px-6 pt-28 pb-16">
        <div
          aria-hidden="true"
          className="book-glow absolute left-1/2 top-1/3 h-[420px] w-[720px] max-w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-amber/10 blur-3xl"
        />
        <HeroTraces />
        <div className="relative mx-auto max-w-6xl">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-amber/30 bg-brand-amber/10 px-4 py-1.5 text-xs font-semibold text-brand-amber-light">
            <CalendarDays size={12} aria-hidden="true" /> BOOK A CALL
          </span>
          <h1 className="font-heading text-4xl md:text-6xl font-black leading-tight">
            Talk to the{" "}
            <span className="bg-gradient-to-br from-brand-amber to-brand-amber-light bg-clip-text text-transparent">
              EmbeddedOS team
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg md:text-xl leading-relaxed text-gray-300">
            A {BOOKING_MINUTES}-minute video call with the people who build
            EmbeddedOS: the kernel, the tools and the boards.
          </p>
        </div>
      </section>

      <div className="px-6 pb-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-5">
            <Stepper step={state.step} />
            <p role="status" className="sr-only">
              Step {stepIndex(state.step) + 1} of {BOOKING_STEPS.length}:{" "}
              {current.label}
            </p>
          </div>

          <div className="grid gap-10 lg:grid-cols-3">
            <div className="min-w-0 lg:col-span-2 grid gap-10">
              <section aria-labelledby="topic-heading">
                <h2
                  id="topic-heading"
                  className="font-heading text-2xl font-bold mb-2"
                >
                  What would you like to talk about?
                </h2>
                <p className="mb-5 text-sm text-gray-300">
                  Pick one; it goes into the booking so the right people join.
                </p>
                <fieldset>
                  <legend className="sr-only">Topic of the call</legend>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {BOOKING_TOPICS.map(t => (
                      <TopicCard
                        key={t.key}
                        topic={t}
                        checked={state.topic === t.key}
                        disabled={state.step === "confirmed"}
                        onSelect={() =>
                          dispatch({ type: "select", topic: t.key })
                        }
                      />
                    ))}
                  </div>
                </fieldset>
              </section>

              <section
                id="pick-a-time"
                aria-labelledby="time-heading"
                className="scroll-mt-24"
              >
                {state.step === "confirmed" ? (
                  <Confirmed
                    topic={topic}
                    onRestart={() => dispatch({ type: "restart" })}
                  />
                ) : (
                  <>
                    <h2
                      id="time-heading"
                      className="font-heading text-2xl font-bold mb-5"
                    >
                      Pick a time
                    </h2>
                    <div className="rounded-2xl border border-brand-amber/25 bg-brand-navy-light p-3 sm:p-4 shadow-glow-amber">
                      <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-2 px-1 text-sm">
                        <span className="font-semibold text-white">
                          {topic ? topic.title : "No topic chosen yet"}
                        </span>
                        <span className="inline-flex items-center gap-1 text-gray-300">
                          <Clock size={14} aria-hidden="true" />{" "}
                          {BOOKING_MINUTES} min
                        </span>
                        <span className="inline-flex items-center gap-1 text-gray-300">
                          <Globe size={14} aria-hidden="true" /> Your time zone
                        </span>
                      </div>
                      {topic ? (
                        <BookingCalendar
                          topic={topic.title}
                          page="/book"
                          onReady={() => dispatch({ type: "frame-ready" })}
                          onFailed={() => dispatch({ type: "frame-failed" })}
                          onScheduled={notice =>
                            dispatch({ type: "scheduled", notice })
                          }
                          fallback={
                            <div className="rounded-xl border border-white/10 bg-brand-navy p-6 flex flex-col sm:flex-row sm:items-center gap-4">
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-white mb-1">
                                  Arrange the call by email
                                </p>
                                <p className="text-sm leading-relaxed text-gray-300">
                                  Send us a few times that suit you and we will
                                  set up your “{topic.title}” call.
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  openContactForm({
                                    topic:
                                      topic.key === "partnership"
                                        ? "partners"
                                        : "contact",
                                    subject: `Meeting request: ${topic.title}`,
                                  })
                                }
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-amber px-5 py-3 font-semibold text-brand-navy hover:bg-brand-amber-light"
                              >
                                <Mail size={16} aria-hidden="true" /> Email us
                                to arrange it
                              </button>
                            </div>
                          }
                        />
                      ) : (
                        <div className="flex h-56 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-white/15 bg-brand-navy px-6 text-center">
                          <CalendarDays
                            size={28}
                            className="text-brand-amber-light"
                            aria-hidden="true"
                          />
                          <p className="text-gray-300">
                            {hasCalendar
                              ? "Choose a topic above and the calendar opens here."
                              : "Choose a topic above to arrange the call by email."}
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </section>
            </div>

            <aside className="min-w-0 grid content-start gap-6">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <h2 className="font-heading text-xl font-bold mb-4">
                  What to expect
                </h2>
                <ul className="space-y-3 text-sm text-gray-300">
                  {expectations.map(item => (
                    <li key={item} className="flex gap-2">
                      <ArrowRight
                        size={14}
                        className="mt-1 shrink-0 text-brand-amber"
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-brand-teal/25 bg-brand-teal/[0.05] p-6">
                <h2 className="font-heading text-xl font-bold mb-2 flex items-center gap-2">
                  <Globe
                    size={18}
                    className="text-brand-teal"
                    aria-hidden="true"
                  />
                  Your time zone
                </h2>
                <p className="text-sm leading-relaxed text-gray-300">
                  {hasCalendar
                    ? BOOKING_TIME_ZONE_NOTE
                    : BOOKING_TIME_ZONE_NOTE_BY_EMAIL}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <h2 className="font-heading text-xl font-bold mb-3">
                  Questions
                </h2>
                <div className="divide-y divide-white/10">
                  {questions.map(item => (
                    <details key={item.question} className="group py-3">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-amber [&::-webkit-details-marker]:hidden">
                        {item.question}
                        <ChevronDown
                          size={16}
                          aria-hidden="true"
                          className="shrink-0 text-gray-300 transition-transform duration-200 motion-reduce:transition-none group-open:rotate-180"
                        />
                      </summary>
                      <p className="pt-2 text-sm leading-relaxed text-gray-300">
                        {item.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
