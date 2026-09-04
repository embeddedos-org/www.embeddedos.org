/**
 * YouTube — the channel, and what is on it.
 *
 * The design lists YouTube separately from Videos, and the distinction is
 * real: /videos is an index of recordings hosted anywhere, while this page is
 * about the channel as a destination someone might subscribe to.
 *
 * It deliberately does not embed the channel. An embed would load Google's
 * player and its cookies on a page a reader may have opened only to check the
 * channel is genuine, and it would report an empty channel as a broken-looking
 * black rectangle rather than as a sentence.
 */

import { ExternalLink, Youtube } from "lucide-react";
import { Link } from "wouter";

import { SOCIAL_URLS } from "@/data/foundation";
import { categoryByPath } from "@/data/categories";
import { byKind } from "@/data/content";

/** What the channel is intended to carry, once it does. */
const PLANNED = [
  "Recordings of webinars and technical sessions, posted after the live run.",
  "Walkthroughs: bringing up a board, building an image, signing and flashing firmware.",
  "Conference talks given by maintainers, mirrored here when the organiser allows it.",
  "Short demonstrations of individual subsystems — the scheduler, eBoot, EoSim.",
];

export default function YouTubeChannel() {
  const category = categoryByPath("/youtube")!;
  const indexed = byKind("video");

  return (
    <div className="min-h-screen pt-16">
      <section className="section-padding bg-grid relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1D3A]/80 to-[#080F1E]" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="badge-teal mb-4 inline-flex">Marketing</div>
          <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-white mb-4">
            {category.name}
          </h1>
          <p className="text-white/60 text-lg max-w-xl mx-auto">
            {category.summary}
          </p>
          <a
            href={SOCIAL_URLS.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-7 px-5 py-2.5 rounded-full bg-[#F97316] text-white text-sm font-semibold hover:bg-[#EA580C] transition-colors"
          >
            <Youtube size={16} aria-hidden="true" />
            Open the channel
            <ExternalLink size={13} aria-hidden="true" />
          </a>
        </div>
      </section>

      <section className="section-padding">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="glass rounded-2xl border border-white/5 p-6">
            <h2 className="font-heading font-bold text-white text-lg mb-3">
              {indexed.length === 0
                ? "Nothing published yet"
                : `${indexed.length} recordings indexed`}
            </h2>
            <p className="text-white/60 text-sm leading-relaxed">
              {indexed.length === 0
                ? "The channel exists and is the Foundation's, but no video has been posted to it yet. This page will not pretend otherwise, and it is here now so that the channel can be verified as genuine before it has an audience."
                : "Recordings are also indexed on the videos page, so they stay findable without a Google account."}
            </p>
            <Link
              href="/videos"
              className="inline-block mt-4 text-sm text-[#F97316] underline hover:no-underline"
            >
              Videos index
            </Link>
          </div>

          <div>
            <h2 className="font-heading font-bold text-white text-2xl mb-5">
              What it will carry
            </h2>
            <ul className="space-y-3">
              {PLANNED.map(item => (
                <li
                  key={item}
                  className="glass rounded-xl border border-white/5 p-4 text-sm text-white/65 leading-relaxed"
                >
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-white/55 text-sm mt-5 leading-relaxed">
              Everything posted to the channel will also be listed on this site,
              because a recording that exists only inside one company's platform
              is a recording the Foundation does not really control.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
