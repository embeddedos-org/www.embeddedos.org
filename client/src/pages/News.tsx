import type { CSSProperties } from "react";
import { Link } from "wouter";

import {
  MARKETING_KINDS,
  RESEARCH_KINDS,
  badgeOf,
  byKinds,
  formatDate,
  isInternal,
  type ContentItem,
} from "@/data/content";
import AboutSections from "@/components/AboutSections";
import type { AboutSection } from "@/data/about-section";
import { Band, BpPage, LocalNav, PageHero, Section } from "@/components/bp";
import "./News.css";

/**
 * Items come from the shared content registry rather than an array in this
 * file. Before, /news owned sixteen entries inline, hand-ordered, with a
 * `(item as any).internal` cast to read a field the untyped array did not
 * declare. Anything the Foundation publishes now appears here by kind, and
 * ordering is computed from ISO dates.
 *
 * The tag colour stays here because it is presentation, not content.
 */
const TAG_COLOR: Record<string, string> = {
  Release: "#F97316",
  Patent: "#F472B6",
  Announcement: "#22D3EE",
  Ecosystem: "#34D399",
  Foundation: "#F97316",
  Engineering: "#A78BFA",
  Roadmap: "#F97316",
  Research: "#EC4899",
  Security: "#22D3EE",
  Benchmark: "#A78BFA",
};

const DEFAULT_TAG_COLOR = "#F97316";

const NEWS_ITEMS: ContentItem[] = byKinds([
  ...MARKETING_KINDS,
  ...RESEARCH_KINDS,
]);

/**
 * Supporting text for the newsroom page (Ad Grants: substantial content).
 * Describes the page's own mechanics — where items come from, what the
 * badges mean, the corrections standard — not new events.
 */
const NEWS_ABOUT: ReadonlyArray<AboutSection> = [
  {
    heading: "What counts as news here",
    body: [
      "Releases, patent filings, ecosystem announcements, and research updates from the Foundation — the introduction above says it, and the listing follows it. News is timely and specific: something happened, and this is the record of it.",
      "What does not appear here: plans without substance behind them, routine development activity, and anything the Foundation cannot state as fact. If there is not enough real material, the page is quiet rather than filled.",
    ],
  },
  {
    heading: "Where the items come from",
    body: [
      "Items come from the site's shared content registry rather than a hand-maintained list, and they are ordered by date. That is why the listing and the article pages can never disagree about a title or a date: both render from the same data.",
      "Some items are articles hosted on this site — the ones with a \u201cRead Article\u201d link. Others point outward, usually to a GitHub release — the ones marked \u201cView on GitHub.\u201d The distinction is shown on each card, so you know before you click whether you are staying on this site.",
    ],
  },
  {
    heading: "What each listing tells you",
    body: [
      "Every card carries the same information: a badge naming the kind of item, the publication date, a summary of what happened, and tags for the topics it touches. The badge colours are consistent across the site — a Release is the same orange here as on the article page.",
      "Dates are publication dates. Where an item describes work done earlier — a filing, a measurement campaign — the summary says so.",
    ],
  },
  {
    heading: "Corrections",
    body: [
      "If a fact in a news item turns out to be wrong, we will correct the item and note the correction rather than quietly editing it. The news page is a record, and a record that is silently rewritten is not a record.",
      "This is the same standard our press releases are held to: state facts, link the evidence, and correct errors openly.",
    ],
  },
  {
    heading: "What news is not",
    body: [
      "News is not the whole publication output. Longer pieces — explanations, technical writing, reflections — live in the articles. The newsletter, when it begins, will be the digest for readers who check in occasionally. News is the timely layer: one item at a time, as things happen.",
      "And it is not a marketing feed. Announcements of plans with no substance behind them do not appear here, and neither do rehashes of the other pages. The page earns its keep by being the fastest reliable record of what the Foundation has actually done.",
    ],
  },
];

export default function News() {
  return (
    <BpPage className="news">
      <PageHero
        sig
        label="Latest News"
        title={
          <>
            EmbeddedOS <span>News & Updates</span>
          </>
        }
        lead="Releases, patent filings, ecosystem announcements, and research updates from the Embedded Operating Systems Research Foundation."
      />
      <LocalNav
        name="News"
        items={[
          { id: "latest", label: "Latest" },
          { id: "sections", label: "Browse by section" },
          { id: "follow", label: "Stay updated" },
          { id: "about-newsroom", label: "About" },
        ]}
      />

      {/* News List */}
      <Section id="latest" className="nw-main" ariaLabel="Latest news">
        <div className="nw-list">
          {NEWS_ITEMS.map(item => {
            const color = TAG_COLOR[badgeOf(item)] ?? DEFAULT_TAG_COLOR;
            return (
              <article key={item.title} className="card nw-item">
                <div className="nw-meta">
                  <span
                    className="nw-badge"
                    style={{ "--c": color } as CSSProperties}
                  >
                    {badgeOf(item)}
                  </span>
                  <span>{formatDate(item.date)}</span>
                </div>
                <h2>{item.title}</h2>
                <p>{item.summary}</p>
                <div className="nw-foot">
                  <ul className="nw-tags" aria-label="Tags">
                    {item.tags.map(tag => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                  {isInternal(item) ? (
                    <Link href={item.href} className="btn gh sm nw-read">
                      Read Article
                      <span aria-hidden="true">→</span>
                    </Link>
                  ) : (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn gh sm nw-read"
                    >
                      View on GitHub
                      <span aria-hidden="true">↗</span>
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </Section>

      {/*
        Marketing sections, in one place. /news is the footer's hub for them:
        the sections below are not footer columns, so this row is their way
        in — see tests/unit/navigation.test.ts.
      */}
      <Section
        id="sections"
        title="Browse by section"
        lead="Every desk in the newsroom, from the blog to the press kit."
        split
        alt
      >
        <ul className="glinks cols nw-desks">
          {[
            { label: "Blog", href: "/blog" },
            { label: "Newsletter", href: "/newsletter" },
            { label: "Case Studies", href: "/case-studies" },
            { label: "Member Stories", href: "/member-stories" },
            { label: "Product Showcases", href: "/product-showcases" },
            { label: "Project Showcases", href: "/project-showcases" },
            { label: "Videos", href: "/videos" },
            { label: "Social Media", href: "/social" },
            { label: "Press Kit", href: "/press-kit" },
            { label: "Brand Assets", href: "/brand" },
          ].map(item => (
            <li key={item.href}>
              <Link href={item.href}>
                <span>{item.label}</span>
                <i aria-hidden="true">→</i>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      {/* Follow */}
      <Band
        id="follow"
        title="Stay Updated"
        lead="Follow EmbeddedOS on GitHub and social media for real-time updates."
      >
        <a
          href="https://github.com/embeddedos-org"
          target="_blank"
          rel="noopener noreferrer"
          className="btn pri"
        >
          Watch on GitHub
        </a>
        <a
          href="https://x.com/EmbeddedOS_ORG"
          target="_blank"
          rel="noopener noreferrer"
          className="btn gh"
        >
          Follow on X
        </a>
        <Link href="/get-involved" className="btn gh">
          Join Community{" "}
          <span className="ar" aria-hidden="true">
            →
          </span>
        </Link>
      </Band>

      <AboutSections
        id="about-newsroom"
        title="About this newsroom"
        sections={NEWS_ABOUT}
      />
    </BpPage>
  );
}
