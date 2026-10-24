import {
  ArrowRight,
  CalendarDays,
  ChevronDown,
  Clock,
  Globe,
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
import {
  BOOKING_STEPS,
  BOOKING_STEPS_BY_EMAIL,
  bookingCalendarReady,
} from "@/lib/booking";
import { openContactForm } from "@/lib/contact-form";

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

function Steps({ steps }: { steps: typeof BOOKING_STEPS }) {
  return (
    <ol
      aria-label="How booking works"
      className="grid grid-cols-3 gap-2 sm:gap-4"
    >
      {steps.map((s, i) => (
        <li key={s.step} className="min-w-0">
          <div className="h-1 rounded-full bg-brand-amber/50" />
          <div className="mt-2 flex items-center gap-2 min-w-0">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-brand-amber text-xs font-bold text-brand-amber-light">
              {i + 1}
            </span>
            <span className="text-xs sm:text-sm font-semibold leading-tight text-white">
              {s.label}
            </span>
          </div>
        </li>
      ))}
    </ol>
  );
}

function TopicCard({ topic }: { topic: BookingTopic }) {
  return (
    <li className="flex h-full flex-col gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
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
    </li>
  );
}

function EmailFallback() {
  return (
    <div className="rounded-xl border border-white/10 bg-brand-navy p-6 flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-white mb-1">
          Arrange the call by email
        </p>
        <p className="text-sm leading-relaxed text-gray-300">
          Send us a few times that suit you and we will set up your call.
        </p>
      </div>
      <button
        type="button"
        onClick={() =>
          openContactForm({ topic: "contact", subject: "Meeting request" })
        }
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-amber px-5 py-3 font-semibold text-brand-navy hover:bg-brand-amber-light"
      >
        <Mail size={16} aria-hidden="true" /> Email us to arrange it
      </button>
    </div>
  );
}

export default function Book() {
  // Without a valid embed URL there is no calendar, only the email fallback,
  // and Google sends no confirmation.
  const hasCalendar = bookingCalendarReady();
  const steps = hasCalendar ? BOOKING_STEPS : BOOKING_STEPS_BY_EMAIL;
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
            <Steps steps={steps} />
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
                  {hasCalendar
                    ? "Mention your topic in the booking form so the right people join."
                    : "Mention your topic in your email so the right people join."}
                </p>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {BOOKING_TOPICS.map(t => (
                    <TopicCard key={t.key} topic={t} />
                  ))}
                </ul>
              </section>

              <section
                id="pick-a-time"
                aria-labelledby="time-heading"
                className="scroll-mt-24"
              >
                <h2
                  id="time-heading"
                  className="font-heading text-2xl font-bold mb-5"
                >
                  {hasCalendar ? "Pick a time" : "Suggest a few times"}
                </h2>
                <div className="rounded-2xl border border-brand-amber/25 bg-brand-navy-light p-3 sm:p-4 shadow-glow-amber">
                  <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-2 px-1 text-sm">
                    <span className="inline-flex items-center gap-1 text-gray-300">
                      <Clock size={14} aria-hidden="true" /> {BOOKING_MINUTES}{" "}
                      min
                    </span>
                    <span className="inline-flex items-center gap-1 text-gray-300">
                      <Globe size={14} aria-hidden="true" /> Your time zone
                    </span>
                  </div>
                  <BookingCalendar fallback={<EmailFallback />} />
                </div>
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
