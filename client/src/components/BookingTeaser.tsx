import { Link } from "wouter";
import { ArrowRight, CalendarDays } from "lucide-react";
import { BOOKING_MINUTES } from "@/data/booking";

export default function BookingTeaser({
  href,
  title,
  line,
}: {
  href: string;
  title: string;
  line: string;
}) {
  return (
    <div
      data-booking="teaser"
      className="relative overflow-hidden rounded-2xl border border-brand-amber/30 bg-brand-navy-light p-6 shadow-glow-amber flex flex-col sm:flex-row sm:items-center gap-5"
    >
      <div
        aria-hidden="true"
        className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-amber/10 blur-2xl"
      />
      <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-brand-amber/40 bg-brand-amber/10 text-brand-amber-light">
        <CalendarDays size={22} aria-hidden="true" />
      </span>
      <div className="relative flex-1 min-w-0">
        <p className="font-heading text-lg font-bold text-white">{title}</p>
        <p className="mt-1 text-sm leading-relaxed text-gray-300">
          {line} {BOOKING_MINUTES} minutes, by video.
        </p>
      </div>
      <Link
        href={href}
        className="relative inline-flex items-center justify-center gap-2 rounded-xl bg-brand-amber px-5 py-3 font-semibold text-brand-navy hover:bg-brand-amber-light"
      >
        Book a call <ArrowRight size={16} aria-hidden="true" />
      </Link>
    </div>
  );
}
