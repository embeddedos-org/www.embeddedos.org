/**
 * One index page for any content kind.
 *
 * /blog, /publications, /benchmarks and the rest are the same page with a
 * different filter. Writing them as separate components would repeat the
 * article-page mistake one level up: eight near-identical files whose metadata
 * drifted apart because nothing tied them together.
 *
 * Only kinds that have something to show are routed. The repository standard is
 * explicit that placeholders are not acceptable, and a /podcast page reading
 * "no episodes yet" is a placeholder with a URL. The taxonomy is still visible
 * in full on the programme hubs, which list every category with its count
 * including zero — so the shape of the programme is published without shipping
 * empty pages to represent it.
 */

import { motion } from "framer-motion";
import { ArrowRight, Calendar, ExternalLink, Tag } from "lucide-react";
import { Link } from "wouter";

import {
  AREA_LABEL,
  KIND_LABEL,
  type ContentKind,
  badgeOf,
  byKind,
  formatDate,
  isInternal,
} from "@/data/content";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.06, ease: "easeOut" as const },
  }),
};

export interface ContentIndexProps {
  kind: ContentKind;
  /** Plural heading. The KIND_LABEL is singular and reads oddly as a title. */
  heading: string;
  intro: string;
}

export default function ContentIndex({
  kind,
  heading,
  intro,
}: ContentIndexProps) {
  const items = byKind(kind);

  return (
    <div className="min-h-screen pt-16">
      <section className="section-padding bg-grid relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1D3A]/80 to-[#080F1E]" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            <div className="badge-teal mb-4 inline-flex">
              {KIND_LABEL[kind]}
            </div>
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-white mb-4">
              {heading}
            </h1>
            <p className="text-white/60 text-lg max-w-xl mx-auto">{intro}</p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
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
                  <span className="flex items-center gap-1.5 text-white/40">
                    <Calendar size={12} />
                    {formatDate(item.date)}
                  </span>
                  {item.area && (
                    <span className="text-white/40">
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
                        className="flex items-center gap-1 text-[11px] text-white/40 bg-white/5 px-2 py-0.5 rounded-full"
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
