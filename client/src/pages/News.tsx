import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Github, Calendar, Tag } from "lucide-react";

import {
  MARKETING_KINDS,
  RESEARCH_KINDS,
  badgeOf,
  byKinds,
  formatDate,
  isInternal,
  type ContentItem,
} from "@/data/content";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.07, ease: "easeOut" as const },
  }),
};

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

export default function News() {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="section-padding bg-grid relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1D3A]/80 to-[#080F1E]" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            <div className="badge-teal mb-4 inline-flex">Latest News</div>
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-white mb-4">
              EmbeddedOS <span className="text-gradient">News & Updates</span>
            </h1>
            <p className="text-white/60 text-lg max-w-xl mx-auto">
              Releases, patent filings, ecosystem announcements, and research
              updates from the Embedded Operating Systems Research Foundation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* News List */}
      <section className="section-padding">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="space-y-6">
            {NEWS_ITEMS.map((item, i) => (
              <motion.article
                key={item.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="glass rounded-2xl border border-white/5 hover:border-white/10 p-6 card-hover"
              >
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span
                    className="text-xs font-bold px-2.5 py-1 rounded-full"
                    style={{
                      background:
                        (TAG_COLOR[badgeOf(item)] ?? DEFAULT_TAG_COLOR) + "20",
                      color: TAG_COLOR[badgeOf(item)] ?? DEFAULT_TAG_COLOR,
                      border: `1px solid ${
                        TAG_COLOR[badgeOf(item)] ?? DEFAULT_TAG_COLOR
                      }40`,
                    }}
                  >
                    {badgeOf(item)}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-white/40">
                    <Calendar size={12} />
                    {formatDate(item.date)}
                  </div>
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
                      Read Article
                      <ArrowRight size={12} />
                    </Link>
                  ) : (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-[#F97316] hover:text-[#EA580C] font-semibold transition-colors"
                    >
                      <Github size={13} />
                      View on GitHub
                      <ArrowRight size={12} />
                    </a>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Follow */}
      <section className="section-padding bg-[#080F1E]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="font-heading font-bold text-white text-2xl mb-2">
              Stay Updated
            </h2>
            <p className="text-white/50 text-sm mb-6">
              Follow EmbeddedOS on GitHub and social media for real-time
              updates.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="https://github.com/embeddedos-org"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#F97316]/15 hover:bg-[#F97316]/25 text-[#F97316] border border-[#F97316]/40 rounded-xl text-sm font-semibold transition-all duration-150"
              >
                <Github size={15} /> Watch on GitHub
              </a>
              <a
                href="https://x.com/EmbeddedOS_ORG"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 glass hover:bg-white/10 text-white/70 hover:text-white border border-white/10 rounded-xl text-sm font-medium transition-all duration-150"
              >
                Follow on X
              </a>
              <Link
                href="/get-involved"
                className="inline-flex items-center gap-2 px-5 py-2.5 glass hover:bg-white/10 text-white/70 hover:text-white border border-white/10 rounded-xl text-sm font-medium transition-all duration-150"
              >
                Join Community <ArrowRight size={13} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
