/**
 * All nine programmes, in one place.
 *
 * The hub for /programmes/*. It exists for two reasons: a reader looking for
 * "what can I actually join" should not have to know whether a programme is
 * filed under marketing or research, and every detail page needs a parent that
 * is reachable from the footer — otherwise the nine pages are only findable
 * through search.
 *
 * It states the uncomfortable fact once, at the top, rather than nine times
 * further down: none of these are running yet.
 */

import { ArrowRight } from "lucide-react";
import { Link } from "wouter";

import {
  PROGRAMMES,
  STATUS_LABEL,
  TRACK_LABEL,
  type ProgrammeTrack,
  isActive,
} from "@/data/programmes";
import { CONTACT_EMAILS } from "@/data/foundation";

const TRACKS: ProgrammeTrack[] = ["community", "marketing", "research"];

export default function Programmes() {
  const anyActive = PROGRAMMES.some(isActive);

  return (
    <div className="min-h-screen pt-16">
      <section className="section-padding bg-grid relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1D3A]/80 to-[#080F1E]" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="badge-teal mb-4 inline-flex">Foundation</div>
          <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-white mb-4">
            Programmes
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            The Foundation's organised activities, as distinct from the things
            it publishes — ambassadors, university partnerships, grants and the
            marketing programmes that support members.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-12">
          {!anyActive && (
            <div className="glass rounded-2xl border border-white/10 p-6">
              <h2 className="font-heading font-bold text-white text-lg mb-3">
                None of these are running yet
              </h2>
              <p className="text-white/60 text-sm leading-relaxed">
                All nine are proposed. Nothing on this page is open for
                applications today, and no programme here has members. They are
                published because the shape of what the Foundation intends to
                build is worth showing — but a roadmap presented as a prospectus
                is the kind of thing that makes everything else harder to
                believe, so it is said plainly instead.
              </p>
              <a
                href={`mailto:${CONTACT_EMAILS.contact}`}
                className="inline-block mt-4 text-sm text-[#F97316] underline hover:no-underline"
              >
                Help start one — {CONTACT_EMAILS.contact}
              </a>
            </div>
          )}

          {TRACKS.map(track => {
            const inTrack = PROGRAMMES.filter(p => p.track === track);
            if (inTrack.length === 0) return null;
            return (
              <div key={track}>
                <h2 className="font-heading font-bold text-white text-2xl mb-5">
                  {TRACK_LABEL[track]}
                </h2>
                <ul className="space-y-3">
                  {inTrack.map(p => (
                    <li
                      key={p.slug}
                      className="glass rounded-xl border border-white/5 p-5"
                    >
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <Link
                          href={`/programmes/${p.slug}`}
                          className="text-white font-medium underline decoration-white/25 underline-offset-4 hover:decoration-[#F97316]"
                        >
                          {p.name}
                        </Link>
                        <span
                          className={`text-[11px] px-2 py-0.5 rounded-full border ${
                            isActive(p)
                              ? "text-emerald-400 border-emerald-400/40 bg-emerald-400/10"
                              : "text-white/60 border-white/20 bg-white/5"
                          }`}
                        >
                          {STATUS_LABEL[p.status]}
                        </span>
                      </div>
                      <p className="text-white/55 text-sm leading-relaxed">
                        {p.summary}
                      </p>
                      <Link
                        href={`/programmes/${p.slug}`}
                        className="inline-flex items-center gap-1.5 mt-3 text-xs text-[#F97316] hover:text-[#EA580C] font-semibold"
                      >
                        Details <ArrowRight className="w-3 h-3" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
