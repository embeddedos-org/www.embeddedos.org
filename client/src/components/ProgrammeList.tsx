/**
 * The Foundation's programmes for one track.
 *
 * Used on /research and /get-involved. A programme is not a publication, so it
 * does not get a card that looks like an article — no date, no read link, and
 * a status instead, because the only question a reader has is whether they can
 * do something about it today.
 */

import { ArrowRight } from "lucide-react";
import { Link } from "wouter";

import {
  STATUS_LABEL,
  byTrack,
  isActive,
  type ProgrammeTrack,
} from "@/data/programmes";

export default function ProgrammeList({
  track,
  heading,
  intro,
}: {
  track: ProgrammeTrack;
  heading: string;
  intro: string;
}) {
  const programmes = byTrack(track);
  if (programmes.length === 0) return null;

  return (
    <section className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-2">{heading}</h2>
        <p className="text-gray-400 text-sm mb-8">{intro}</p>

        <div className="space-y-3">
          {programmes.map(p => (
            <div
              key={p.slug}
              className="bg-white/5 border border-white/10 rounded-xl p-5"
            >
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h3 className="text-white font-medium">{p.name}</h3>
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full border ${
                    isActive(p)
                      ? "text-emerald-400 border-emerald-400/40 bg-emerald-400/10"
                      : "text-gray-400 border-white/15 bg-white/5"
                  }`}
                >
                  {STATUS_LABEL[p.status]}
                </span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                {p.summary}
              </p>
              {p.href && (
                <Link
                  href={p.href}
                  className="inline-flex items-center gap-1.5 mt-3 text-xs text-[#F97316] hover:text-[#EA580C] font-semibold"
                >
                  Take part <ArrowRight className="w-3 h-3" />
                </Link>
              )}
            </div>
          ))}
        </div>

        {/*
          Said once, plainly, rather than repeated on every planned card. A
          reader who sees several "Planned" badges deserves to know what that
          means and who to ask, and a foundation that lets a roadmap read as a
          prospectus is harder to believe later.
        */}
        {programmes.every(p => !isActive(p)) && (
          <p className="text-gray-500 text-xs mt-6 leading-relaxed">
            These programmes are proposed and not yet running. Nothing here is
            open for applications today. If you would like to help start one,{" "}
            {/*
              Underlined always, not just on hover. axe flags a link inside a
              text block that is distinguished only by colour
              (link-in-text-block, WCAG 1.4.1): a reader who cannot separate
              orange from grey has nothing to tell them this is a link, and
              hover does not exist on touch.
            */}
            <Link
              href="/contact"
              className="text-[#F97316] underline hover:no-underline"
            >
              get in touch
            </Link>
            .
          </p>
        )}
      </div>
    </section>
  );
}
