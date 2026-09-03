/**
 * A short silent tour of the product pages, on the front page.
 *
 * ## Why the video is generated rather than authored
 *
 * The frames come from `scripts/showcase-shots.mjs`, which screenshots the
 * built site, and `pnpm showcase` reassembles the reel from them. Nothing here
 * is a mockup. That is deliberate: a showcase video is a claim about what the
 * software looks like, and a hand-made one starts drifting from the product the
 * day after it is cut, with nothing to catch it. Regenerating from the real
 * build keeps the claim true by construction.
 *
 * ## Why it does not autoplay
 *
 * Autoplay would cost every visitor a 550 KB download for something most of
 * them did not ask to watch, and moving video under text is a barrier for
 * readers with vestibular disorders and for anyone trying to read the page.
 * `preload="none"` means the bytes are fetched only when someone presses play;
 * until then the poster frame is a 95 KB JPEG.
 *
 * ## Accessibility
 *
 * The reel has no audio track, so WCAG 1.2.1 applies rather than the captions
 * criterion: video-only content needs an equivalent in text. The list beneath
 * the player is that equivalent, and it is visible rather than screen-reader
 * only, because "what is in this video" is a reasonable question for a sighted
 * visitor who does not want to watch twenty seconds to find out.
 */

import { Link } from "wouter";

/**
 * What the reel shows, in order, matching FRAMES in scripts/showcase-shots.mjs.
 *
 * Kept adjacent to the video rather than derived from it because it is the
 * text alternative: if the reel changes and this does not, the alternative is
 * wrong, and a stale description is worse than none. The unit test in
 * tests/unit/showcase.test.ts fails when the two lists disagree.
 */
export const SHOWCASE_SCENES: readonly {
  href: string;
  label: string;
  note: string;
}[] = [
  {
    href: "/",
    label: "The platform",
    note: "What EmbeddedOS is and who it is for",
  },
  {
    href: "/products",
    label: "Products",
    note: "The full ecosystem in one view",
  },
  { href: "/eos", label: "EoS Kernel", note: "Deterministic real-time kernel" },
  { href: "/eboot", label: "eBoot", note: "Verified secure boot and OTA" },
  { href: "/ebuild", label: "ebuild", note: "One CLI for the whole lifecycle" },
  {
    href: "/eosim",
    label: "EoSim",
    note: "Simulation and hardware-in-the-loop",
  },
  {
    href: "/eostudio",
    label: "EoStudio",
    note: "Visual design and code generation",
  },
  {
    href: "/get-involved",
    label: "Get involved",
    note: "Where to start contributing",
  },
];

export default function ProductShowcase() {
  return (
    <section
      className="py-16 px-4 bg-[#060A14] border-y border-white/5"
      aria-labelledby="showcase-heading"
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          {/*
            white/55, not the white/25 the marquee eyebrow uses. Over this
            section's #060A14 that works out at 2.14:1, and axe failed the
            whole page on it — WCAG 1.4.3 wants 4.5:1 for text this size.
            white/55 measures 6.25:1 and still reads as a muted label.
          */}
          <span className="text-[10px] text-white/55 uppercase tracking-[0.2em] font-mono">
            Twenty seconds
          </span>
          <h2
            id="showcase-heading"
            className="text-2xl sm:text-3xl font-bold text-white mt-3"
          >
            See the stack
          </h2>
          <p className="text-gray-400 text-sm mt-3 max-w-xl mx-auto leading-relaxed">
            A silent tour of the products, recorded from this site. No sound, no
            narration — press play or read the list below.
          </p>
        </div>

        <video
          className="w-full rounded-xl border border-white/10 bg-black shadow-2xl"
          controls
          preload="none"
          playsInline
          poster="/media/product-showcase-poster.jpg"
          width={1280}
          height={720}
          aria-describedby="showcase-scenes"
        >
          <source src="/media/product-showcase.mp4" type="video/mp4" />
          {/*
            Reached only by a browser that cannot play H.264 at all. It gets the
            same information the video carries, not an apology.
          */}
          Your browser cannot play this video. The list below covers everything
          it shows.
        </video>

        <ol
          id="showcase-scenes"
          className="mt-8 grid gap-x-8 gap-y-3 sm:grid-cols-2"
        >
          {SHOWCASE_SCENES.map((scene, i) => (
            <li key={scene.href} className="flex gap-3 text-sm">
              <span
                // aria-hidden keeps the ordinal out of the accessible name,
                // but it is still on screen, so it still owes the contrast
                // minimum — axe counted all eight of these.
                className="text-white/55 font-mono tabular-nums shrink-0"
                aria-hidden="true"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-gray-400 leading-relaxed">
                <Link
                  href={scene.href}
                  className="text-white underline decoration-white/25 underline-offset-4 hover:decoration-[#F97316]"
                >
                  {scene.label}
                </Link>{" "}
                — {scene.note}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
