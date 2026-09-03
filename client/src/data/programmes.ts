/**
 * The Foundation's programmes — the organisational activities, as distinct
 * from the things it publishes.
 *
 * The marketing and research structure names 37 categories, and they are not
 * 37 of the same thing. Most are *content kinds*: a Press Release and a White
 * Paper are things you publish, and those live in content.ts. A handful are
 * not publications at all — an Ambassador Program is people, a Grant is money,
 * a University Collaboration is an agreement. Modelling those as empty content
 * categories would misrepresent them: "0 published" is the wrong statement
 * about a programme that has members rather than posts.
 *
 * ## Every status here is "planned", and that is a finding rather than a default
 *
 * I searched the site for evidence that any of these run. There is none:
 * "Ambassador" appears nowhere in the codebase, nor does "Press Kit"; the only
 * occurrence of "grant" is in Transparency.tsx, and it refers to a *donor*
 * preparing a grant application to give money to the Foundation — the opposite
 * direction from a grants programme.
 *
 * So each entry below says `planned`. Publishing a roadmap is honest and
 * useful; publishing "Ambassador Program" with no qualifier would tell a
 * visitor they can apply to something that does not exist, and a foundation
 * that overstates its programmes has a harder time being believed about its
 * software.
 *
 * **Anyone who knows a programme is actually running should correct its
 * status.** The value is having one place to correct rather than a claim
 * scattered across pages.
 */

/**
 * How open a programme is to someone reading the page.
 *
 * `planned` is deliberately distinct from `paused`: one has never run, the
 * other has and stopped. Collapsing them would lose the distinction a reader
 * needs to know whether to wait or to ask.
 */
export type ProgrammeStatus = "open" | "by-application" | "planned" | "paused";

export const STATUS_LABEL: Record<ProgrammeStatus, string> = {
  open: "Open to all",
  "by-application": "By application",
  planned: "Planned",
  paused: "Paused",
};

/** Which part of the Foundation runs it. */
export type ProgrammeTrack = "community" | "research" | "marketing";

export const TRACK_LABEL: Record<ProgrammeTrack, string> = {
  community: "Community",
  research: "Research",
  marketing: "Marketing",
};

export interface Programme {
  slug: string;
  name: string;
  track: ProgrammeTrack;
  status: ProgrammeStatus;
  /** One sentence a reader can act on, or decline to act on. */
  summary: string;
  /**
   * Where to go next. Absent for a planned programme, because a link to a page
   * that cannot yet answer the question is worse than no link.
   */
  href?: string;
}

export const PROGRAMMES: readonly Programme[] = [
  {
    slug: "ambassador",
    name: "Ambassador Program",
    track: "community",
    status: "planned",
    summary:
      "Recognised contributors who represent EmbeddedOS at events, run local sessions, and carry feedback from their region back to the technical steering committee.",
  },
  {
    slug: "university-program",
    name: "University Program",
    track: "community",
    status: "planned",
    summary:
      "Course materials, hardware kits and mentoring for universities teaching embedded systems on an open stack rather than a vendor toolchain.",
  },
  {
    slug: "community-meetups",
    name: "Community Meetups",
    track: "community",
    status: "planned",
    summary:
      "Regular local meetings for people building on EmbeddedOS, organised by ambassadors and supported with materials from the Foundation.",
  },
  {
    slug: "conference-presence",
    name: "Conference Presence",
    track: "marketing",
    status: "planned",
    summary:
      "A coordinated calendar of talks, booths and workshops at embedded, RTOS and open-source conferences, with a shared CFP pipeline members can join.",
  },
  {
    slug: "member-marketing",
    name: "Member Marketing",
    track: "marketing",
    status: "planned",
    summary:
      "Blog slots, social amplification and launch support for member organisations, on the model OpenSSF and RISC-V run for their members.",
  },
  {
    slug: "partner-marketing",
    name: "Partner Marketing",
    track: "marketing",
    status: "planned",
    summary:
      "Joint announcements and co-authored material with silicon vendors and integrators shipping EmbeddedOS in their products.",
  },
  {
    slug: "university-collaborations",
    name: "University Collaborations",
    track: "research",
    status: "planned",
    summary:
      "Formal research partnerships with academic groups, publishing jointly and contributing results back into the platform.",
  },
  {
    slug: "industry-collaborations",
    name: "Industry Collaborations",
    track: "research",
    status: "planned",
    summary:
      "Applied research with companies deploying EmbeddedOS, on problems too large for one organisation and too specific for a standards body.",
  },
  {
    slug: "grants",
    name: "Research Grants",
    track: "research",
    status: "planned",
    summary:
      "Funding for independent work on the embedded stack — security analysis, formal verification, hardware bring-up — awarded on published criteria.",
  },
];

/** Programmes in one track, in declaration order. */
export function byTrack(track: ProgrammeTrack): Programme[] {
  return PROGRAMMES.filter(p => p.track === track);
}

/** True when a reader can do something about it today. */
export function isActive(programme: Programme): boolean {
  return programme.status === "open" || programme.status === "by-application";
}
