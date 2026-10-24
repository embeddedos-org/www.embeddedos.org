/**
 * One index page for any content category.
 *
 * /blog, /publications, /press-releases and the twenty-odd others are the same
 * page with a different filter. Writing them as separate components would
 * repeat the article-page mistake one level up: near-identical files whose
 * metadata drifts apart because nothing ties them together.
 *
 * The page is driven by a path rather than a loose set of strings, so the
 * heading, intro and filter cannot disagree with the category registry — they
 * come from the same record. An unknown path renders a not-found rather than an
 * untitled empty list.
 *
 * ## Empty categories
 *
 * An earlier version of this file routed only categories that had something to
 * show, on the reasoning that "no episodes yet" is a placeholder with a URL.
 * That is right about bare placeholders and wrong about the reader. A
 * journalist looking for /press-releases the day before the first one exists is
 * better served by a page naming the press contact than by a 404.
 *
 * So an empty category ships, on one condition, enforced by
 * tests/unit/categories.test.ts: it must carry an `emptyNote` that says plainly
 * that nothing is published and what will appear. What must never happen is a
 * page implying volume that is not there — so the count is always stated, zero
 * included.
 */

import { Link } from "wouter";

import {
  AREA_LABEL,
  KIND_LABEL,
  type ContentItem,
  badgeOf,
  byArea,
  byKind,
  byKinds,
  formatDate,
  isInternal,
} from "@/data/content";
import { type Category, categoryByPath } from "@/data/categories";
import { CATEGORY_ABOUT } from "@/data/category-about";
import { openContactForm } from "@/lib/contact-form";
import AboutSections from "@/components/AboutSections";
import { BpPage, PageHero, Section } from "@/components/bp";
import "./ContentIndex.css";

/** The items a category shows. Programme and bespoke categories show none. */
export function itemsFor(category: Category): ContentItem[] {
  if (category.binding.type === "kind") return byKind(category.binding.kind);
  if (category.binding.type === "kinds") return byKinds(category.binding.kinds);
  if (category.binding.type === "area") return byArea(category.binding.area);
  return [];
}

/** The small label above the title. */
function eyebrowFor(category: Category): string {
  if (category.binding.type === "kind")
    return KIND_LABEL[category.binding.kind];
  if (category.binding.type === "area")
    return AREA_LABEL[category.binding.area];
  return category.group === "research" ? "Research" : "Marketing";
}

export interface ContentIndexProps {
  /** The category's path, as declared in data/categories.ts. */
  path: string;
}

export default function ContentIndex({ path }: ContentIndexProps) {
  const category = categoryByPath(path);

  if (!category) {
    return (
      <BpPage className="ci">
        <PageHero
          sig
          title="Category not found"
          lead="There is no category at this address."
        >
          <div className="ctas">
            <Link href="/news" className="btn gh">
              Everything the Foundation publishes
            </Link>
          </div>
        </PageHero>
      </BpPage>
    );
  }

  const items = itemsFor(category);

  return (
    <BpPage className="ci">
      <PageHero
        sig
        label={eyebrowFor(category)}
        title={category.name}
        lead={category.summary}
      >
        {/*
          Stated on every index, zero included. A count is the cheapest
          defence against a page that looks busier than it is.
        */}
        <p className={items.length === 0 ? "ci-count" : "ci-count on"}>
          {items.length === 0
            ? "Nothing published yet"
            : `${items.length} published`}
        </p>
      </PageHero>

      <Section className="ci-main">
        {items.length === 0 ? (
          <div className="card hl ci-empty">
            <h2>What will appear here</h2>
            <p>{category.emptyNote}</p>
            <div className="ctas">
              <button
                type="button"
                onClick={() =>
                  openContactForm({
                    topic: category.contactTopic ?? "contact",
                  })
                }
                className="btn pri"
              >
                Send us a message
              </button>
              <Link href="/news" className="btn gh">
                What has been published <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="ci-list">
            {items.map(item => (
              <article key={item.slug} className="card ci-item">
                <div className="ci-meta">
                  <span className="ci-badge">{badgeOf(item)}</span>
                  <span>{formatDate(item.date)}</span>
                  {item.area && <span>{AREA_LABEL[item.area]}</span>}
                </div>
                <h2>{item.title}</h2>
                <p>{item.summary}</p>
                <div className="ci-foot">
                  <ul className="ci-tags" aria-label="Tags">
                    {item.tags.map(tag => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                  {isInternal(item) ? (
                    <Link href={item.href} className="btn gh sm ci-read">
                      Read <span aria-hidden="true">→</span>
                    </Link>
                  ) : (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn gh sm ci-read"
                    >
                      Read <span aria-hidden="true">↗</span>
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        <ul className="glinks ci-all">
          <li>
            <Link href="/news">
              <span>Everything the Foundation publishes</span>
              <i aria-hidden="true">→</i>
            </Link>
          </li>
        </ul>
      </Section>

      {/*
        Long-form about content (F-01): the fourteen empty categories carry
        six substantial sections each, so the page is useful before the first
        item exists. Categories with published items have no entry here.
      */}
      {CATEGORY_ABOUT[path] && (
        <AboutSections
          title={`About ${category.name}`}
          sections={CATEGORY_ABOUT[path]}
        />
      )}
    </BpPage>
  );
}
