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
import AboutSections from "@/components/AboutSections";
import type { AboutSection } from "@/data/about-section";

/** What the channel is intended to carry, once it does. */
const PLANNED = [
  "Recordings of webinars and technical sessions, posted after the live run.",
  "Walkthroughs: bringing up a board, building an image, signing and flashing firmware.",
  "Conference talks given by maintainers, mirrored here when the organiser allows it.",
  "Short demonstrations of individual subsystems — the scheduler, eBoot, EoSim.",
];

/**
 * Supporting text for the channel page (Ad Grants: substantial content).
 *
 * The channel has no videos yet; everything below is either a present fact
 * about the page or a stated plan. Nothing invents recordings, schedules, or
 * subscriber counts.
 */
const YOUTUBE_ABOUT: ReadonlyArray<AboutSection> = [
  {
    heading: "Why this page exists",
    body: [
      "The channel is a destination: a place to subscribe so that new recordings find you. The videos index is the archive: a searchable listing of every recording with titles, dates, and descriptions. The two serve different readers, so they are different pages.",
      "This page also serves as verification. A young foundation with an active GitHub presence is easy to impersonate, and a channel link on the domain nobody else controls is how you check that the channel claiming to be ours is actually ours.",
    ],
  },
  {
    heading: "Why there is no embedded player",
    body: [
      "Embedding the channel would load Google's player — and its cookies — on a page a reader may have opened only to check the channel is genuine. It would also report an empty channel as a broken-looking black rectangle rather than as a sentence. The channel has no videos yet, and this page says so in words instead of showing you an empty frame.",
      "When recordings exist, they still will not autoplay here, and watching them here will still be optional. The videos index will always let you find a recording without a Google account.",
    ],
  },
  {
    heading: "What the channel will carry",
    body: [
      "Four kinds of material, matching the work the Foundation actually does. Recordings of webinars and technical sessions, posted after the live run. Walkthroughs: bringing up a board, building an image, signing and flashing firmware — the procedures people currently do from memory. Conference talks by maintainers, mirrored here when the organiser allows it. And short demonstrations of individual subsystems: the scheduler, eBoot, EoSim.",
      "What it will not carry is marketing. A recording here exists to teach something specific, and the test for publishing one is whether a working engineer learns something from watching it.",
    ],
  },
  {
    heading: "Everything is indexed twice",
    body: [
      "Every recording posted to the channel will also be listed on this site, on the videos index and on this page. A recording that exists only inside one company's platform is a recording the Foundation does not really control, and platforms change their rules, their search, and their availability without asking.",
      "Each index entry carries the title, the recording date, a description, and chapters where they exist — enough to judge whether a recording is worth your time before you open it.",
    ],
  },
  {
    heading: "How you will know when something is published",
    body: [
      "New recordings will be announced on the News page, which is where the Foundation puts timely updates. There is no separate notification list for the channel; subscribing on YouTube or watching the News page are the two ways to hear about new material.",
      "If there is something you would like to see explained on camera — a subsystem nobody has documented, a bring-up procedure you keep doing from memory, a demonstration of something the stack can do — the contact page reaches us, and requests genuinely shape what gets scheduled.",
    ],
  },
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

      <AboutSections title="About the channel" sections={YOUTUBE_ABOUT} />
    </div>
  );
}
