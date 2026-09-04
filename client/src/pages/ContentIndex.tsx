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

import { motion } from "framer-motion";
import { ArrowRight, Calendar, ExternalLink, Mail, Tag } from "lucide-react";
import { Link } from "wouter";

import {
  AREA_LABEL,
  KIND_LABEL,
  type ContentItem,
  badgeOf,
  byArea,
  byKind,
  formatDate,
  isInternal,
} from "@/data/content";
import { type Category, categoryByPath } from "@/data/categories";
import { CONTACT_EMAILS } from "@/data/foundation";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.06, ease: "easeOut" as const },
  }),
};

/** The items a category shows. Programme and bespoke categories show none. */
export function itemsFor(category: Category): ContentItem[] {
  if (category.binding.type === "kind") return byKind(category.binding.kind);
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
      <div className="min-h-screen pt-16">
        <section className="section-padding">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <h1 className="font-heading font-extrabold text-3xl text-white mb-4">
              Category not found
            </h1>
            <p className="text-white/60 mb-8">
              There is no category at this address.
            </p>
            <Link href="/news" className="text-[#F97316] underline">
              Everything the Foundation publishes
            </Link>
          </div>
        </section>
      </div>
    );
  }

  const items = itemsFor(category);

  return (
    <div className="min-h-screen pt-16">
      <section className="section-padding bg-grid relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1D3A]/80 to-[#080F1E]" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            <div className="badge-teal mb-4 inline-flex">
              {eyebrowFor(category)}
            </div>
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-white mb-4">
              {category.name}
            </h1>
            <p className="text-white/60 text-lg max-w-xl mx-auto">
              {category.summary}
            </p>
            {/*
              Stated on every index, zero included. A count is the cheapest
              defence against a page that looks busier than it is.
            */}
            <p className="text-white/55 text-sm mt-4">
              {items.length === 0
                ? "Nothing published yet"
                : `${items.length} published`}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {items.length === 0 ? (
            <div className="glass rounded-2xl border border-white/5 p-8">
              <h2 className="font-heading font-bold text-white text-lg mb-3">
                What will appear here
              </h2>
              <p className="text-white/60 text-sm leading-relaxed">
                {category.emptyNote}
              </p>
              <div className="flex flex-wrap gap-4 mt-6 text-sm">
                <a
                  href={`mailto:${CONTACT_EMAILS.contact}`}
                  className="inline-flex items-center gap-2 text-[#F97316] underline hover:no-underline"
                >
                  <Mail size={14} /> {CONTACT_EMAILS.contact}
                </a>
                <Link
                  href="/news"
                  className="inline-flex items-center gap-2 text-white/60 underline hover:no-underline"
                >
                  What has been published <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item, i) => (
                <motion.article
                  key={item.slug}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  className="glass rounded-2xl border border-white/5 hover:border-white/10 p-6 card-hover"
                >
                  <div className="flex flex-wrap items-center gap-3 mb-3 text-xs">
                    <span className="font-bold px-2.5 py-1 rounded-full bg-[#F97316]/15 text-[#F97316] border border-[#F97316]/30">
                      {badgeOf(item)}
                    </span>
                    <span className="flex items-center gap-1.5 text-white/55">
                      <Calendar size={12} />
                      {formatDate(item.date)}
                    </span>
                    {item.area && (
                      <span className="text-white/55">
                        {AREA_LABEL[item.area]}
                      </span>
                    )}
                  </div>
                  <h2 className="font-heading font-bold text-white text-lg mb-2 leading-snug">
                    {item.title}
                  </h2>
                  <p className="text-white/60 text-sm leading-relaxed mb-4">
                    {item.summary}
                  </p>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-1.5">
                      {item.tags.map(tag => (
                        <span
                          key={tag}
                          className="flex items-center gap-1 text-[11px] text-white/55 bg-white/5 px-2 py-0.5 rounded-full"
                        >
                          <Tag size={9} />
                          {tag}
                        </span>
                      ))}
                    </div>
                    {isInternal(item) ? (
                      <Link
                        href={item.href}
                        className="flex items-center gap-1.5 text-xs text-[#F97316] hover:text-[#EA580C] font-semibold transition-colors"
                      >
                        Read <ArrowRight size={12} />
                      </Link>
                    ) : (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs text-[#F97316] hover:text-[#EA580C] font-semibold transition-colors"
                      >
                        Read <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </motion.article>
              ))}
            </div>
          )}

          <div className="pt-10">
            <Link
              href="/news"
              className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
            >
              Everything the Foundation publishes <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
