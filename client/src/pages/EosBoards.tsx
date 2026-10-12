import { useEffect, useRef, useState } from "react";
import {
  CircleCheck,
  CircuitBoard,
  ExternalLink,
  GraduationCap,
  Handshake,
  Mail,
  Scale,
  TriangleAlert,
} from "lucide-react";
import {
  BOARD_LICENSOR,
  BOARD_STATUS,
  EOS_BOARDS,
  boardFolderUrl,
  boardImage,
  boardMailto,
  boardThumb,
  boardTurntable,
  pullRequestUrl,
  type BoardView,
  type EosBoard,
  type PixelSize,
} from "@/data/eos-boards";
import { usePrefersReducedMotion } from "@/lib/reduced-motion";

export const CHECK_TERMS = [
  {
    term: "ERC",
    meaning:
      "KiCad's electrical rules check on the schematic: outputs driven together, inputs left floating, power pins with no source.",
  },
  {
    term: "DRC errors",
    meaning:
      "KiCad's design rules check on the layout: clearances, track widths, drill sizes and copper too close to the board edge.",
  },
  {
    term: "Unconnected items",
    meaning:
      "Connections the schematic asks for that the copper on the board does not yet make.",
  },
  {
    term: "Schematic parity",
    meaning:
      "Differences between the schematic and the board: a part or a net present in one and missing from the other.",
  },
  {
    term: "DRC warnings",
    meaning:
      "Findings KiCad reports as warnings rather than errors. Each board below says what its warnings are.",
  },
] as const;

export const CONTACT_REASONS = [
  {
    icon: Scale,
    title: "Licensing",
    body: "Copying, modifying, manufacturing or selling one of these designs needs written permission, which may be given for a fee.",
    subject: "Licence request: EmbeddedOS development boards",
    action: "Ask about a licence",
  },
  {
    icon: Handshake,
    title: "Partnerships",
    body: "Companies and universities that want to build on a board, co-develop a new one or take one to manufacture.",
    subject: "Partnership: EmbeddedOS development boards",
    action: "Propose a partnership",
  },
  {
    icon: GraduationCap,
    title: "Evaluation",
    body: "Professors, labs and engineering teams weighing a board for a course, a research project or a product.",
    subject: "Evaluation: EmbeddedOS development boards",
    action: "Ask about an evaluation",
  },
] as const;

const VIEW_LABEL: Record<BoardView, string> = {
  iso: "Perspective",
  top: "Top",
  bottom: "Bottom",
};

function formatSize([width, height]: readonly [number, number]): string {
  return `${width} × ${height} mm`;
}

function imageAlt(board: EosBoard, view: BoardView): string {
  if (view === "iso")
    return `Perspective render of the ${board.name} from its KiCad 3D model: ${board.looks}`;
  return `${VIEW_LABEL[view]} side of the ${board.name}, rendered from its KiCad 3D model`;
}

export const BOARD_PULL_REQUESTS = EOS_BOARDS.map(
  board => board.source.pullRequest
)
  .filter((pullRequest, i, all) => all.indexOf(pullRequest) === i)
  .sort((a, b) => a - b);

function Picture({
  src,
  size,
  alt,
}: {
  src: string;
  size: PixelSize;
  alt: string;
}) {
  return (
    <picture>
      <source srcSet={`${src}.webp`} type="image/webp" />
      <img
        src={`${src}.jpg`}
        width={size.width}
        height={size.height}
        alt={alt}
        loading="lazy"
        decoding="async"
        style={{ height: "100%" }}
        className="absolute inset-0 w-full h-full object-cover"
      />
    </picture>
  );
}

function Turntable({ board }: { board: EosBoard }) {
  const ref = useRef<HTMLVideoElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [blocked, setBlocked] = useState(false);
  const { video, poster } = boardTurntable(board.slug);

  useEffect(() => {
    const element = ref.current;
    if (!element || reducedMotion || typeof IntersectionObserver !== "function")
      return;
    element.muted = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return element.pause();
        element.play().catch((error: unknown) => {
          if (error instanceof DOMException && error.name === "NotAllowedError")
            setBlocked(true);
        });
      },
      { threshold: 0.25 }
    );
    observer.observe(element);
    return () => {
      observer.disconnect();
      element.pause();
    };
  }, [reducedMotion]);

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="none"
      controls={reducedMotion || blocked}
      poster={poster}
      width={board.media.turntable.width}
      height={board.media.turntable.height}
      aria-label={`The ${board.name} turning on a turntable, rendered from its KiCad 3D model`}
      style={{ height: "100%" }}
      className="absolute inset-0 w-full h-full object-cover"
    >
      <source src={video} type="video/mp4" />
    </video>
  );
}

function CheckTile({
  label,
  value,
  warn = false,
}: {
  label: string;
  value: number;
  warn?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border px-3 py-2 ${warn ? "border-amber-400/30 bg-amber-400/[0.06]" : "border-emerald-400/25 bg-emerald-400/[0.06]"}`}
    >
      <dt className="text-xs text-gray-300">{label}</dt>
      <dd
        className={`text-2xl font-black ${warn ? "text-amber-300" : "text-emerald-300"}`}
      >
        {value}
      </dd>
    </div>
  );
}

function BoardSection({ board }: { board: EosBoard }) {
  const { checks } = board;
  return (
    <article
      id={board.slug}
      aria-labelledby={`${board.slug}-name`}
      className="scroll-mt-24 py-14 px-6 border-t border-white/[0.06]"
    >
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
        <div className="min-w-0 grid gap-3 lg:sticky lg:top-24">
          <div className="relative aspect-[3/2] w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0b1220]">
            <Turntable board={board} />
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {(["iso", "top", "bottom"] as const).map(view => (
              <figure key={view} className="min-w-0">
                <div className="relative aspect-[3/2] w-full overflow-hidden rounded-xl border border-white/10 bg-[#0b1220]">
                  <Picture
                    src={boardImage(board.slug, view)}
                    size={view === "iso" ? board.media.iso : board.media.plan}
                    alt={imageAlt(board, view)}
                  />
                </div>
                <figcaption className="text-xs text-gray-400 mt-1.5">
                  {VIEW_LABEL[view]}
                </figcaption>
              </figure>
            ))}
          </div>
          <p className="text-xs text-gray-400">
            Renders and animation © {BOARD_LICENSOR.year} {BOARD_LICENSOR.name}.
            All rights reserved.
          </p>
        </div>

        <div className="min-w-0">
          <h2
            id={`${board.slug}-name`}
            className="text-3xl md:text-4xl font-black mb-3"
          >
            {board.name}
          </h2>
          <p className="text-lg text-gray-300 leading-relaxed mb-4">
            {board.purpose}
          </p>
          <p className="inline-flex items-start gap-2 rounded-lg border border-amber-400/30 bg-amber-400/[0.08] px-3 py-2 text-sm text-amber-200 mb-6">
            <TriangleAlert size={16} className="shrink-0 mt-0.5" />
            <span>Status: {BOARD_STATUS}.</span>
          </p>

          <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8 text-sm">
            <div className="col-span-2 sm:col-span-3">
              <dt className="text-gray-400">Main chip</dt>
              <dd className="font-semibold text-white">{board.mainChip}</dd>
            </div>
            <div>
              <dt className="text-gray-400">Size</dt>
              <dd className="font-semibold text-white">
                {formatSize(board.sizeMm)}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-gray-400">Layers</dt>
              <dd className="font-semibold text-white">
                {board.layers} ({board.stackup})
              </dd>
            </div>
          </dl>

          <h3 className="text-lg font-bold mb-3">Checks, as recorded</h3>
          <dl className="grid grid-cols-3 gap-2 sm:gap-3 mb-3">
            <CheckTile label="ERC violations" value={checks.ercViolations} />
            <CheckTile label="DRC errors" value={checks.drcErrors} />
            <CheckTile label="Unconnected" value={checks.unconnectedItems} />
            <CheckTile
              label="Schematic parity"
              value={checks.schematicParity}
            />
            <CheckTile
              label="DRC warnings"
              value={checks.drcWarnings}
              warn={checks.drcWarnings > 0}
            />
          </dl>
          {checks.warningNote && (
            <p className="text-sm text-gray-300 mb-3">
              <span className="font-semibold text-amber-200">
                {checks.drcWarnings === 1
                  ? "The warning:"
                  : `The ${checks.drcWarnings} warnings:`}
              </span>{" "}
              {checks.warningNote}
            </p>
          )}
          <p className="text-xs text-gray-400 mb-6">
            From build-report.json and drc.json in the board's folder, KiCad{" "}
            {checks.kicad}, commit {checks.commit}.
          </p>

          <details className="group mb-6 rounded-xl border border-white/10 bg-white/[0.02]">
            <summary className="cursor-pointer select-none px-4 py-3 font-semibold text-white">
              Key features, what is not done yet, and third-party material
            </summary>
            <div className="px-4 pb-2 pt-2">
              <h3 className="text-lg font-bold mb-3">Key features</h3>
              <ul className="space-y-2 text-sm text-gray-300 mb-8">
                {board.features.map(feature => (
                  <li key={feature} className="flex gap-2">
                    <CircuitBoard
                      size={14}
                      className="shrink-0 mt-1 text-orange-400"
                      aria-hidden="true"
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <h3 className="text-lg font-bold mb-3">Not done yet</h3>
              <ul className="space-y-2 text-sm text-gray-300 mb-8">
                {[
                  "This board has not been manufactured, powered or tested on the bench.",
                  ...board.notYetDone,
                ].map(item => (
                  <li key={item} className="flex gap-2">
                    <TriangleAlert
                      size={14}
                      className="shrink-0 mt-1 text-amber-300"
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <h3 className="text-lg font-bold mb-3">
                Third-party material, under its own licence
              </h3>
              <ul className="list-disc pl-5 space-y-1 text-xs text-gray-400 mb-4">
                {board.thirdParty.map(item => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </details>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <a
              href={boardFolderUrl(board)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold border border-white/15 text-white hover:border-white/30"
            >
              {board.name} files on GitHub <ExternalLink size={16} />
            </a>
            <a
              href="#boards"
              className="text-sm text-gray-300 underline underline-offset-2 hover:text-white"
            >
              All boards
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function EosBoards() {
  return (
    <div className="min-h-screen bg-[#050A14] text-white">
      <section className="relative pt-28 pb-12 px-6 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="relative max-w-6xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 border border-orange-500/30 bg-orange-500/10 text-orange-400">
            <CircuitBoard size={12} /> EmbeddedOS HARDWARE · ORIGINAL BOARD
            DESIGNS
          </span>
          <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6">
            EmbeddedOS{" "}
            <span className="bg-gradient-to-br from-orange-500 to-amber-400 bg-clip-text text-transparent">
              development boards
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl leading-relaxed mb-6">
            Original development boards designed by {BOARD_LICENSOR.name} for
            EmbeddedOS: complete KiCad designs, each with the check results its
            build recorded.
          </p>
          <p className="inline-flex items-start gap-2 rounded-xl border border-amber-400/30 bg-amber-400/[0.08] px-4 py-3 text-amber-200 max-w-3xl mb-8">
            <TriangleAlert size={18} className="shrink-0 mt-0.5" />
            <span>
              Every board here is {BOARD_STATUS}. None has been built or
              powered.
            </span>
          </p>
          <nav
            id="boards"
            aria-label="Boards on this page"
            className="scroll-mt-24"
          >
            <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {EOS_BOARDS.map(board => (
                <li key={board.slug} className="min-w-0">
                  <a
                    href={`#${board.slug}`}
                    style={{ display: "flex", flexDirection: "column" }}
                    className="h-full overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] hover:border-orange-400/50"
                  >
                    <span className="relative block aspect-[3/2] w-full overflow-hidden bg-[#0b1220]">
                      <Picture
                        src={boardThumb(board.slug)}
                        size={board.media.thumb}
                        alt=""
                      />
                    </span>
                    <span className="block px-3 py-2.5">
                      <span className="block text-xs text-orange-300">
                        {board.category}
                      </span>
                      <span className="block font-bold text-white leading-snug">
                        {board.name}
                      </span>
                      <span className="block text-xs text-gray-400 mt-0.5">
                        {formatSize(board.sizeMm)} · {board.layers} layers
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>

      <section
        id="licence"
        aria-labelledby="licence-heading"
        className="px-6 pb-14"
      >
        <div className="max-w-6xl mx-auto rounded-2xl border border-orange-400/30 bg-orange-500/[0.06] p-6 md:p-8">
          <h2
            id="licence-heading"
            className="text-2xl md:text-3xl font-black mb-4 flex items-center gap-3"
          >
            <Scale size={24} className="text-orange-400 shrink-0" /> Licence:
            not open source
          </h2>
          <ul className="space-y-3 text-gray-200 leading-relaxed max-w-4xl">
            <li>
              These boards are Copyright (c) {BOARD_LICENSOR.year}{" "}
              {BOARD_LICENSOR.name}, all rights reserved, and not open source.
              They are not under the MIT licence that covers EmbeddedOS
              software.
            </li>
            <li>
              Anyone may view them. Copying, modifying, manufacturing or selling
              needs written permission from {BOARD_LICENSOR.name}, which may be
              given for a fee. Contact{" "}
              <a
                href={boardMailto(
                  "Licence request: EmbeddedOS development boards"
                )}
                className="font-semibold text-orange-300 underline underline-offset-2 break-words"
              >
                {BOARD_LICENSOR.email}
              </a>
              .
            </li>
            <li>
              EmbeddedOS (EoS) Research Foundation has a limited, revocable
              permission to use them.
            </li>
            <li className="text-sm text-gray-300">
              Third-party material on a board keeps its own licence; each board
              lists its own below. The full terms are in the LICENSE.txt file in
              each board's folder.
            </li>
          </ul>
        </div>
      </section>

      <section aria-labelledby="checks-heading" className="px-6 pb-14">
        <div className="max-w-6xl mx-auto">
          <h2
            id="checks-heading"
            className="text-2xl md:text-3xl font-black mb-3 flex items-center gap-3"
          >
            <CircleCheck size={24} className="text-emerald-300 shrink-0" /> What
            the checks mean
          </h2>
          <p className="text-gray-300 max-w-3xl mb-6 leading-relaxed">
            One command generates each board's schematic, layout, routing and
            fabrication files and runs KiCad's checks. The counts on this page
            are copied from the report that command wrote. They show the design
            is consistent; they cannot show that a manufactured board works.
          </p>
          <dl className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {CHECK_TERMS.map(c => (
              <div
                key={c.term}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
              >
                <dt className="font-bold text-white mb-1">{c.term}</dt>
                <dd className="text-sm text-gray-400 leading-relaxed">
                  {c.meaning}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {EOS_BOARDS.map(board => (
        <BoardSection key={board.slug} board={board} />
      ))}

      <section
        id="contact"
        aria-labelledby="contact-heading"
        className="py-16 px-6 border-t border-white/[0.06]"
      >
        <div className="max-w-6xl mx-auto">
          <h2 id="contact-heading" className="text-3xl font-black mb-3">
            Licensing, partnerships and evaluation
          </h2>
          <p className="text-gray-300 max-w-3xl mb-8 leading-relaxed">
            Write to {BOARD_LICENSOR.name} at{" "}
            <span className="font-semibold text-white break-words">
              {BOARD_LICENSOR.email}
            </span>
            . Each button opens an email with the subject filled in.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {CONTACT_REASONS.map(reason => (
              <div
                key={reason.title}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 flex flex-col"
              >
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                  <reason.icon
                    size={20}
                    className="text-orange-400"
                    aria-hidden="true"
                  />
                  {reason.title}
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed mb-6">
                  {reason.body}
                </p>
                <a
                  href={boardMailto(reason.subject)}
                  className="mt-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold bg-orange-500 hover:bg-orange-600 text-white"
                >
                  <Mail size={16} aria-hidden="true" /> {reason.action}
                </a>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            {BOARD_PULL_REQUESTS.map(pullRequest => (
              <a
                key={pullRequest}
                href={pullRequestUrl(pullRequest)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold border border-white/15 text-white hover:border-white/30"
              >
                Board files in eCAD pull request #{pullRequest}{" "}
                <ExternalLink size={16} />
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
