/**
 * The Foundation's programmes for one track.
 *
 * Used on /research and /get-involved. A programme is not a publication, so it
 * does not get a card that looks like an article — no date, no read link, and
 * a status instead, because the only question a reader has is whether they can
 * do something about it today.
 *
 * It renders inside a Black Edition page (`BpPage`), as one section of cards.
 */

import { Link } from "wouter";

import { Section } from "@/components/bp";
import {
  STATUS_LABEL,
  byTrack,
  isActive,
  type ProgrammeTrack,
} from "@/data/programmes";
import "./ProgrammeList.css";

export default function ProgrammeList({
  track,
  heading,
  intro,
  id,
}: {
  track: ProgrammeTrack;
  heading: string;
  intro: string;
  /** The section's anchor, for a page's local navigation. */
  id?: string;
}) {
  const programmes = byTrack(track);
  if (programmes.length === 0) return null;

  return (
    <Section id={id} title={heading} lead={intro} split className="pgl">
      <ul className="cards">
        {programmes.map(p => (
          <li key={p.slug}>
            <div className="card">
              <div className="top">
                <h3>{p.name}</h3>
                <span className={isActive(p) ? "st ok" : "st"}>
                  {STATUS_LABEL[p.status]}
                </span>
              </div>
              <p>{p.summary}</p>
              {p.href && (
                <Link href={p.href} className="more">
                  Take part <span aria-hidden="true">→</span>
                </Link>
              )}
            </div>
          </li>
        ))}
      </ul>

      {/*
        Said once, plainly, rather than repeated on every planned card. A
        reader who sees several "Planned" badges deserves to know what that
        means and who to ask, and a foundation that lets a roadmap read as a
        prospectus is harder to believe later.
      */}
      {programmes.every(p => !isActive(p)) && (
        <p className="gnote pgl-note">
          These programmes are proposed and not yet running. Nothing here is
          open for applications today. If you would like to help start one,{" "}
          {/*
            Underlined always, not just on hover. axe flags a link inside a
            text block that is distinguished only by colour
            (link-in-text-block, WCAG 1.4.1): a reader who cannot separate
            orange from grey has nothing to tell them this is a link, and
            hover does not exist on touch.
          */}
          <Link href="/contact" className="tl">
            get in touch
          </Link>
          .
        </p>
      )}
    </Section>
  );
}
