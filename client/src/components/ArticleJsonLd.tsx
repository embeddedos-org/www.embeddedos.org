/**
 * NewsArticle structured data for the generic article page.
 *
 * The SEO audit found this site's only JSON-LD was the static NGO block in
 * index.html, so no article was eligible for article rich results. The meta
 * pipeline (title/description/canonical/OG) already runs per route; this is
 * the remaining gap for /article/:slug and the eight legacy /article-xxx
 * addresses, all of which render through the single Article page.
 *
 * The script is rendered declaratively, keyed by slug. When the visitor
 * navigates from one article to another the component re-renders, React
 * updates the one script element in place, and the structured data can never
 * go stale or accumulate duplicates the way an appended-on-navigate effect
 * would. Because it is part of the JSX, the prerenderer captures it in the
 * static HTML snapshot — no head-stamping step needed.
 *
 * The logo URL is the mark the navbar, footer and brand guidelines already
 * use (/media/embeddedos-logo-mark_bc053888.jpg); there is no
 * embeddedos-logo.png asset on the site.
 */
import { bodyOf } from "@/data/article-bodies";
import type { ContentItem } from "@/data/content";

const ORIGIN = "https://www.embeddedos.org";
const ORG_NAME = "Embedded Operating Systems (EoS) Research Foundation";
const ORG_LOGO = `${ORIGIN}/media/embeddedos-logo-mark_bc053888.jpg`;

/** Canonical address of an article, regardless of which route served it. */
export const articleCanonical = (slug: string): string =>
  `${ORIGIN}/article/${slug}`;

/**
 * The structured-data object for one article: a NewsArticle plus a
 * BreadcrumbList (Home > News > title), as an @graph in a single block.
 * Pure so tests can assert the shape without rendering React.
 */
export function articleJsonLd(item: ContentItem): Record<string, unknown> {
  const canonical = articleCanonical(item.slug);
  const body = bodyOf(item.slug);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "NewsArticle",
        "@id": canonical,
        headline: item.title,
        description: body?.lede ?? item.summary,
        datePublished: item.date,
        author: { "@type": "Organization", name: ORG_NAME },
        publisher: {
          "@type": "Organization",
          name: ORG_NAME,
          logo: { "@type": "ImageObject", url: ORG_LOGO },
        },
        mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${ORIGIN}/` },
          {
            "@type": "ListItem",
            position: 2,
            name: "News",
            item: `${ORIGIN}/news`,
          },
          { "@type": "ListItem", position: 3, name: item.title },
        ],
      },
    ],
  };
}

export default function ArticleJsonLd({ item }: { item: ContentItem }) {
  // Escaping "<" keeps a "</script>" inside a title or lede from closing the
  // element early; JSON parsers decode \u003c back to the literal.
  const json = JSON.stringify(articleJsonLd(item)).replace(/</g, "\\u003c");
  return (
    <script
      type="application/ld+json"
      key={`article-jsonld-${item.slug}`}
      data-article-jsonld={item.slug}
    >
      {json}
    </script>
  );
}
