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
 * The route is /article/:slug. The eight legacy /article-xxx paths still
 * resolve, so nothing that is already linked or indexed breaks; see App.tsx.
 */

import { motion } from "framer-motion";
import { ArrowRight, Calendar, Tag } from "lucide-react";
import { Link, useRoute } from "wouter";

import { bodyOf } from "@/data/article-bodies";
import { badgeOf, bySlug, formatDate } from "@/data/content";

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

export default function Article({ slug: slugProp }: { slug?: string }) {
  const [, params] = useRoute("/article/:slug");
  const slug = slugProp ?? params?.slug;

  const item = slug ? bySlug(slug) : undefined;
  const body = slug ? bodyOf(slug) : undefined;

  // An unknown slug, or a registry entry with no prose, is not a page. Saying
  // so beats rendering an empty article shell that looks like a broken post.
  if (!item || !body) {
    return (
      <div className="min-h-screen bg-[#0A0E1A] text-white flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-3">Article not found</h1>
          <p className="text-gray-400 mb-6">
            No article is published at this address.
          </p>
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-[#F97316] hover:text-[#EA580C] font-semibold"
          >
            Browse all news <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const badge = badgeOf(item);
  const color = BADGE_COLOR[badge] ?? DEFAULT_BADGE_COLOR;

  return (
    <div className="min-h-screen bg-[#0A0E1A] text-white">
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-transparent" />
        <div className="max-w-3xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 mb-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {formatDate(item.date)}
              </span>
              <span
                className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs"
                style={{ background: `${color}26`, color }}
              >
                <Tag className="w-3 h-3" /> {badge}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              {item.title}
            </h1>
            <p className="text-xl text-gray-400 leading-relaxed">{body.lede}</p>
          </motion.div>
        </div>
      </section>

      <section className="pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          {body.sections.map(section => (
            <section key={section.heading} className="mb-10">
              <h2 className="text-2xl font-bold text-white mb-4">
                {section.heading}
              </h2>
              <p className="text-gray-300 leading-relaxed">{section.text}</p>
            </section>
          ))}

          <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
            {item.tags.map(tag => (
              <span
                key={tag}
                className="text-xs text-white/40 bg-white/5 px-2.5 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="pt-8">
            <Link
              href="/news"
              className="inline-flex items-center gap-2 text-[#F97316] hover:text-[#EA580C] font-semibold text-sm"
            >
              All news and articles <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
