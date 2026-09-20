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
import { openContactForm } from "@/lib/contact-form";
import AboutSections from "@/components/AboutSections";
import type { AboutSection } from "@/data/about-section";

const TRACKS: ProgrammeTrack[] = ["community", "marketing", "research"];

/**
 * Supporting text for the programmes hub (Ad Grants: substantial content).
 *
 * Every statement below is either a present fact verifiable in
 * `@/data/programmes` or a stated plan for a not-yet-started programme.
 * Nothing invents launches, members, dates, or application processes.
 */
const PROGRAMMES_ABOUT: ReadonlyArray<AboutSection> = [
  {
    heading: "What a programme is here",
    body: [
      "A programme is an organised activity: something people join, attend, apply to, or do together. That is the distinction this page draws. The things the Foundation publishes — articles, videos, datasets, releases — live under Resources and Research. The things it organises — ambassadors, university partnerships, grants, meetups — live here.",
      "The distinction matters because the two kinds of work make different promises. A publication promises that something is true or useful. A programme promises that something will happen, with people, on a schedule. This page lists the second kind, and it is honest about which of them are real yet.",
    ],
  },
  {
    heading: "The three tracks",
    body: [
      "The nine programmes fall into three tracks, matching the parts of the Foundation that would run them. Community covers the people side: the Ambassador Program, the University Program, and Community Meetups — the ways individuals gather around the work.",
      "Marketing covers presence: Conference Presence, Member Marketing, and Partner Marketing — the talks, booths, announcements, and amplification that carry the work outward. Research covers collaboration: University Collaborations, Industry Collaborations, and Research Grants — the formal partnerships and funding through which new work gets done.",
    ],
  },
  {
    heading: "What \u201cPlanned\u201d means",
    body: [
      "Every programme on this page currently carries the Planned status, which means exactly what it says: the Foundation intends to run it, has described what it would be, and has not started it. No applications are open, no cohorts exist, and no dates are set.",
      "They are published anyway, for the reason stated at the top of this page: the shape of what the Foundation intends to build is worth showing. When a programme moves from planned to open, this page will say so, and the programme will get a detail page with the terms, the timeline, and how to take part. Until then, \u201cPlanned\u201d is the whole story, and we would rather you read that than wonder.",
    ],
  },
  {
    heading: "How programmes serve the mission",
    body: [
      "The Foundation exists to advance open-source embedded systems research, education, and technology for the public benefit. The programmes are how that mission reaches people directly: the University Program and the research grants carry the education and research purposes; the community track carries the stewardship of the ecosystem; the marketing track makes sure the work is found by the people it is for.",
      "None of this is separate from the software. The programmes exist because open-source research does not sustain itself on code alone — it needs people who can teach it, meet about it, fund it, and carry it into new organisations.",
    ],
  },
  {
    heading: "Helping start one",
    body: [
      "Programmes will start when there are people to run them and a community to serve. If you want to help start one — as an ambassador, a university partner, a meetup organiser, or a funder — the contact form linked on this page reaches the Foundation directly.",
      "There is no application process yet because there is nothing to apply to. When that changes, the change will be announced on the News page and reflected here the same day.",
    ],
  },
];

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
              <button
                type="button"
                onClick={() => openContactForm({ topic: "contact" })}
                className="inline-block mt-4 text-sm text-[#F97316] underline hover:no-underline"
              >
                Help start one — contact us
              </button>
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

      <AboutSections title="About programmes" sections={PROGRAMMES_ABOUT} />
    </div>
  );
}
