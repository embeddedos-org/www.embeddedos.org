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
import { BpPage, LocalNav, PageHero, Section } from "@/components/bp";
import "./Programmes.css";

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
  const tracks = TRACKS.filter(track =>
    PROGRAMMES.some(p => p.track === track)
  );

  return (
    <BpPage className="progs">
      <PageHero
        sig
        label="Foundation"
        title="Programmes"
        lead="The Foundation's organised activities, as distinct from the things it publishes — ambassadors, university partnerships, grants and the marketing programmes that support members."
      />
      <LocalNav
        name="Programmes"
        items={[
          ...tracks.map(track => ({
            id: `track-${track}`,
            label: TRACK_LABEL[track],
          })),
          { id: "about-programmes", label: "About" },
        ]}
      />

      {!anyActive && (
        <Section className="progs-state" tight>
          <div className="card hl progs-note">
            <h2>None of these are running yet</h2>
            <p>
              All nine are proposed. Nothing on this page is open for
              applications today, and no programme here has members. They are
              published because the shape of what the Foundation intends to
              build is worth showing — but a roadmap presented as a prospectus
              is the kind of thing that makes everything else harder to believe,
              so it is said plainly instead.
            </p>
            <div className="ctas">
              <button
                type="button"
                onClick={() => openContactForm({ topic: "contact" })}
                className="btn or"
              >
                Help start one — contact us
              </button>
            </div>
          </div>
        </Section>
      )}

      {tracks.map(track => (
        <Section key={track} id={`track-${track}`} title={TRACK_LABEL[track]}>
          <ul className="cards">
            {PROGRAMMES.filter(p => p.track === track).map(p => (
              <li key={p.slug}>
                <div className="card">
                  <div className="top">
                    <h3>
                      <Link href={`/programmes/${p.slug}`}>{p.name}</Link>
                    </h3>
                    <span className={isActive(p) ? "st ok" : "st"}>
                      {STATUS_LABEL[p.status]}
                    </span>
                  </div>
                  <p>{p.summary}</p>
                  <Link href={`/programmes/${p.slug}`} className="more">
                    Details <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </Section>
      ))}

      <AboutSections
        id="about-programmes"
        title="About programmes"
        sections={PROGRAMMES_ABOUT}
      />
    </BpPage>
  );
}
