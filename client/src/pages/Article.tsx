/**
 * One component for every hosted article.
 *
 * Replaces eight ArticleXxx.tsx files, 1,077 lines, whose only difference was
 * the words. Identical chrome eight times over meant the metadata was written
 * out eight times too, and it had drifted: seven of the eight showed a
 * different publication date on the article than /news showed in its listing —
 * one by eleven months. Rendering both from the registry makes that
 * impossible rather than merely unlikely.
 *
 * The route is /article/:slug. The legacy /article-xxx paths (eight from the
 * original migration, plus later additions such as the newsletter archive)
 * still resolve, so nothing that is already linked or indexed breaks; see App.tsx.
 */

import type { CSSProperties } from "react";
import { Link, useRoute } from "wouter";

import { bodyOf } from "@/data/article-bodies";
import { badgeOf, bySlug, formatDate } from "@/data/content";
import AboutSections from "@/components/AboutSections";
import ArticleJsonLd from "@/components/ArticleJsonLd";
import type { AboutSection } from "@/data/about-section";
import { BpPage, Crumbs, PageHero, Section } from "@/components/bp";
import "./Article.css";

/** Badge colours, matching the palette /news uses for the same labels. */
const BADGE_COLOR: Record<string, string> = {
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
  "Technical Paper": "#A78BFA",
};

const DEFAULT_BADGE_COLOR = "#F97316";

/**
 * Supporting text for article pages (Ad Grants: substantial content).
 * Describes the publication model — one renderer, one registry — not new
 * claims about the articles themselves.
 */
const ARTICLE_ABOUT: ReadonlyArray<AboutSection> = [
  {
    heading: "How these articles are published",
    body: [
      "Every article on this site renders through this one page, from the Foundation's shared content registry. The title, date, badge, tags, and body all come from the same data the News page lists — which is why the two can never disagree about what an article says or when it appeared.",
      "The registry replaced eight separate article pages whose metadata had drifted apart: seven of them showed a different publication date than the news listing. One source of truth is less interesting than eight bespoke pages, and considerably more honest.",
    ],
  },
  {
    heading: "What an article is",
    body: [
      "Articles are the long form: explanations of how something works, technical writing about the stack, and reflections on the work. News carries the timely announcement; the article carries the full treatment — the reasoning, the context, and the detail that would not fit in a listing.",
      "Each article states its assumptions and links its evidence where evidence exists. The source material behind the technical claims — the code, the measurements, the filings — is public in the Foundation's repositories.",
    ],
  },
  {
    heading: "Dates and addresses",
    body: [
      "The date on an article is its publication date. The address is /article/ followed by the article's slug, and the older /article-xxx addresses from the previous site still resolve to the same pages — nothing already linked or indexed breaks.",
      "If an article is corrected after publication, the correction is noted rather than silently made — the same standard our press releases are held to. The page you are reading is the current version, and the record of what changed stays with it.",
    ],
  },
];

export default function Article({ slug: slugProp }: { slug?: string }) {
  const [, params] = useRoute("/article/:slug");
  const slug = slugProp ?? params?.slug;

  const item = slug ? bySlug(slug) : undefined;
  const body = slug ? bodyOf(slug) : undefined;

  // An unknown slug, or a registry entry with no prose, is not a page. Saying
  // so beats rendering an empty article shell that looks like a broken post.
  if (!item || !body) {
    return (
      <BpPage className="article">
        <PageHero
          sig
          title="Article not found"
          lead="No article is published at this address."
        >
          <div className="ctas">
            <Link href="/news" className="btn gh">
              Browse all news <span aria-hidden="true">→</span>
            </Link>
          </div>
        </PageHero>
      </BpPage>
    );
  }

  const badge = badgeOf(item);
  const color = BADGE_COLOR[badge] ?? DEFAULT_BADGE_COLOR;

  return (
    <BpPage className="article">
      <ArticleJsonLd item={item} />
      <PageHero
        sig
        crumbs={
          <Crumbs
            items={[
              { label: "Home", href: "/" },
              { label: "News", href: "/news" },
              { label: item.title },
            ]}
          />
        }
        label={
          <>
            <span>{formatDate(item.date)}</span>
            <span aria-hidden="true"> · </span>
            <span
              className="ar-badge"
              style={{ "--c": color } as CSSProperties}
            >
              {badge}
            </span>
          </>
        }
        title={item.title}
        lead={body.lede}
      />

      <Section className="ar-read">
        <div className="prose ar-body">
          {body.sections.map(section => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              <p>{section.text}</p>
            </section>
          ))}
        </div>

        <div className="ar-end">
          <ul className="ar-tags" aria-label="Tags">
            {item.tags.map(tag => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
          <ul className="glinks">
            <li>
              <Link href="/news">
                <span>All news and articles</span>
                <i aria-hidden="true">→</i>
              </Link>
            </li>
          </ul>
        </div>
      </Section>

      <AboutSections title="About these articles" sections={ARTICLE_ABOUT} />
    </BpPage>
  );
}
