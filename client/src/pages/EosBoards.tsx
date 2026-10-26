import { Fragment, useEffect, useRef, useState } from "react";
import {
  BOARD_LICENSOR,
  BOARD_STATUS,
  EOS_BOARDS,
  boardCadUrl,
  boardFolderUrl,
  boardImage,
  boardLicenceUrl,
  boardMailto,
  boardThumb,
  boardTurntable,
  pullRequestUrl,
  type BoardView,
  type EosBoard,
  type PixelSize,
} from "@/data/eos-boards";
import { usePrefersReducedMotion } from "@/lib/reduced-motion";
import BookingTeaser from "@/components/BookingTeaser";
import { BpPage, LocalNav, PageHero } from "@/components/bp";
import { bookingCalendarReady } from "@/lib/booking";
import "./EosBoards.css";

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
    title: "Licensing",
    body: "Copying, modifying, manufacturing or selling one of these designs needs written permission, which may be given for a fee.",
    subject: "Licence request: EmbeddedOS development boards",
    action: "Ask about a licence",
  },
  {
    title: "Partnerships",
    body: "Companies and universities that want to build on a board, co-develop a new one or take one to manufacture.",
    subject: "Partnership: EmbeddedOS development boards",
    action: "Propose a partnership",
  },
  {
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

/**
 * One recorded check: the label, then the count. A small dot carries what the
 * colour used to: green for none found, orange for warnings, grey otherwise.
 */
function CheckTile({
  label,
  value,
  warn = false,
}: {
  label: string;
  value: number;
  warn?: boolean;
}) {
  const state = warn ? "warn" : value === 0 ? "ok" : "found";
  return (
    <div className="eb-chk" data-state={state}>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function BoardSection({ board }: { board: EosBoard }) {
  const { checks } = board;
  return (
    <article
      id={board.slug}
      aria-labelledby={`${board.slug}-name`}
      className="sec eb-board"
    >
      <div className="wrap wide eb-bgrid">
        <div className="eb-media">
          <div className="eb-frame eb-tt">
            <Turntable board={board} />
          </div>
          <div className="eb-views">
            {(["iso", "top", "bottom"] as const).map(view => (
              <figure key={view}>
                <div className="eb-frame">
                  <Picture
                    src={boardImage(board.slug, view)}
                    size={view === "iso" ? board.media.iso : board.media.plan}
                    alt={imageAlt(board, view)}
                  />
                </div>
                <figcaption>{VIEW_LABEL[view]}</figcaption>
              </figure>
            ))}
          </div>
          <p className="fine">
            Renders and animation © {BOARD_LICENSOR.year} {BOARD_LICENSOR.name}.
            All rights reserved.
          </p>
        </div>

        <div className="eb-info">
          <h2 id={`${board.slug}-name`}>{board.name}</h2>
          <p className="eb-purpose">{board.purpose}</p>
          <p className="eb-status">
            <span>Status: {BOARD_STATUS}.</span>
          </p>

          <dl className="kv eb-spec">
            <dt>Main chip</dt>
            <dd>{board.mainChip}</dd>
            <dt>Size</dt>
            <dd>{formatSize(board.sizeMm)}</dd>
            <dt>Layers</dt>
            <dd>
              {board.layers} ({board.stackup})
            </dd>
          </dl>

          <h3 className="eb-h3">Checks, as recorded</h3>
          <dl className="eb-checks">
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
            <p className="eb-warn">
              <b>
                {checks.drcWarnings === 1
                  ? "The warning:"
                  : `The ${checks.drcWarnings} warnings:`}
              </b>{" "}
              {checks.warningNote}
            </p>
          )}
          <p className="fine eb-src">
            From build-report.json and drc.json in the board's folder, KiCad{" "}
            {checks.kicad}, commit {checks.commit}.
          </p>

          <details className="eb-more">
            <summary>
              Key features, what is not done yet, and third-party material
            </summary>
            <div className="eb-more-b">
              <h3 className="eb-h3">Key features</h3>
              <ul>
                {board.features.map(feature => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>

              <h3 className="eb-h3">Not done yet</h3>
              <ul>
                {[
                  "This board has not been manufactured, powered or tested on the bench.",
                  ...board.notYetDone,
                ].map(item => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <h3 className="eb-h3">
                Third-party material, under its own licence
              </h3>
              <ul className="eb-third">
                {board.thirdParty.map(item => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </details>

          <div className="ctas eb-dl">
            {(["schematic", "pcb"] as const).map(kind => (
              <a
                key={kind}
                href={boardCadUrl(board, kind)}
                download
                className="btn gh"
              >
                <span aria-hidden="true">↓</span>
                {kind === "schematic"
                  ? "Schematic (.kicad_sch)"
                  : "PCB layout (.kicad_pcb)"}
                {/* Fifteen boards repeat these labels; a links list needs the board. */}{" "}
                <span className="sr-only">for {board.name}</span>
              </a>
            ))}
          </div>
          <p className="fine eb-cadnote">
            Native KiCad files from commit {checks.commit}, for viewing under{" "}
            <a href={boardLicenceUrl(board)} className="tl">
              this board’s full licence
            </a>
            . Keep the licence with any permitted copies. The GitHub folder
            includes the project settings and supporting files.
          </p>
          <div className="ctas">
            <a
              href={boardFolderUrl(board)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn gh"
            >
              {board.name} files on GitHub <span aria-hidden="true">↗</span>
            </a>
            <a href="#boards" className="tl">
              All boards
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

const PROCESS = [
  [
    "Define the circuit",
    "Component datasheets set pin assignments, supply limits and component values. Published dimensions and pinouts guide the connectors. Each board identifies its sources and any third-party material.",
  ],
  [
    "Place and route",
    "Parts receive physical footprints. Copper tracks, vias and planes connect the schematic’s nets, with critical signals and supply connections laid first.",
  ],
  [
    "Check the CAD",
    "KiCad checks the schematic, physical clearances, missing connections and agreement between the two files. The results below belong to a specific saved revision.",
  ],
  [
    "Inspect the views",
    "Perspective, top, bottom and rotating views come from that board’s CAD. Missing component models can leave empty areas in a render; the PCB file still records the fitted footprints.",
  ],
] as const;

export default function EosBoards() {
  return (
    <BpPage className="eosb">
      <PageHero
        sig
        label="EmbeddedOS HARDWARE · ORIGINAL BOARD DESIGNS"
        title="EmbeddedOS development boards"
        lead={`Original development boards designed by ${BOARD_LICENSOR.name} for EmbeddedOS: complete KiCad designs, each with the check results its build recorded.`}
      >
        <p className="gnote eb-hstatus">
          Every board here is {BOARD_STATUS}. None has been built or powered.
        </p>
      </PageHero>
      <LocalNav
        name="EoS boards"
        items={[
          { id: "boards", label: "Boards" },
          { id: "licence", label: "Licence" },
          { id: "process", label: "From circuit to board" },
          { id: "checks", label: "What the checks mean" },
          { id: "contact", label: "Licensing and contact" },
        ]}
      />

      <section className="sec eb-index">
        <div className="wrap wide">
          <nav id="boards" aria-label="Boards on this page">
            <ul className="eb-cards">
              {EOS_BOARDS.map(board => (
                <li key={board.slug}>
                  <a
                    href={`#${board.slug}`}
                    style={{ display: "flex", flexDirection: "column" }}
                    className="eb-card"
                  >
                    <span className="eb-thumb">
                      <Picture
                        src={boardThumb(board.slug)}
                        size={board.media.thumb}
                        alt=""
                      />
                    </span>
                    <span className="eb-ct">
                      <span className="eb-cat">{board.category}</span>
                      <span className="eb-name">{board.name}</span>
                      <span className="eb-size">
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
        className="sec eb-licence"
      >
        <div className="wrap">
          <div className="card hl eb-lic">
            <h2 id="licence-heading">Licence: not open source</h2>
            <ul>
              <li>
                These boards are Copyright (c) {BOARD_LICENSOR.year}{" "}
                {BOARD_LICENSOR.name}, all rights reserved, and not open source.
                They are not under the MIT licence that covers EmbeddedOS
                software.
              </li>
              <li>
                Anyone may view them. Copying, modifying, manufacturing or
                selling needs written permission from {BOARD_LICENSOR.name},
                which may be given for a fee. Contact{" "}
                <a
                  href={boardMailto(
                    "Licence request: EmbeddedOS development boards"
                  )}
                  className="tl"
                >
                  {BOARD_LICENSOR.email}
                </a>
                .
              </li>
              <li>
                EmbeddedOS (EoS) Research Foundation has a limited, revocable
                permission to use them.
              </li>
              <li className="eb-lic-fine">
                Third-party material on a board keeps its own licence; each
                board lists its own below. The full terms are in the LICENSE.txt
                file in each board's folder.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section
        id="process"
        aria-labelledby="process-heading"
        className="sec alt"
      >
        <div className="wrap">
          <div className="sec-h">
            <h2 id="process-heading">From circuit to board</h2>
            <p className="lead">
              The schematic describes what connects. The PCB file places those
              parts and draws the copper connections. Each board below includes
              both files, its recorded checks and views rendered from the PCB.
            </p>
          </div>
          <ol className="cards four eb-proc">
            {PROCESS.map(([title, body], index) => (
              <li key={title}>
                <div className="card">
                  <span className="k">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="checks" aria-labelledby="checks-heading" className="sec">
        <div className="wrap">
          <div className="sec-h">
            <h2 id="checks-heading">What the checks mean</h2>
            <p className="lead">
              One command generates each board's schematic, layout, routing and
              fabrication files and runs KiCad's checks. The counts on this page
              are copied from the report that command wrote. They show the
              design is consistent; they cannot show that a manufactured board
              works.
            </p>
          </div>
          <dl className="kv">
            {CHECK_TERMS.map(c => (
              <Fragment key={c.term}>
                <dt>{c.term}</dt>
                <dd>{c.meaning}</dd>
              </Fragment>
            ))}
          </dl>
        </div>
      </section>

      {EOS_BOARDS.map(board => (
        <BoardSection key={board.slug} board={board} />
      ))}

      <section id="contact" aria-labelledby="contact-heading" className="sec">
        <div className="wrap">
          <div className="sec-h">
            <h2 id="contact-heading">Licensing, partnerships and evaluation</h2>
            <p className="lead">
              Write to {BOARD_LICENSOR.name} at{" "}
              <b className="eb-mail">{BOARD_LICENSOR.email}</b>. Each button
              opens an email with the subject filled in.
            </p>
          </div>
          <ul className="cards eb-reasons">
            {CONTACT_REASONS.map(reason => (
              <li key={reason.title}>
                <div className="card">
                  <h3>{reason.title}</h3>
                  <p>{reason.body}</p>
                  <a
                    href={boardMailto(reason.subject)}
                    className="btn pri eb-ask"
                  >
                    {reason.action}
                  </a>
                </div>
              </li>
            ))}
          </ul>
          <div id="book-a-meeting" className="eb-book">
            <h3 className="eb-h3">Book a call</h3>
            <BookingTeaser
              href="/book"
              title="Talk to us about a board"
              line={
                bookingCalendarReady()
                  ? "Pick a time on the booking page and mention EoS boards and hardware."
                  : "Arrange a time by email through the booking page and mention EoS boards and hardware."
              }
            />
          </div>
          <div className="ctas eb-prs">
            {BOARD_PULL_REQUESTS.map(pullRequest => (
              <a
                key={pullRequest}
                href={pullRequestUrl(pullRequest)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn gh"
              >
                Board files in eCAD pull request #{pullRequest}{" "}
                <span aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </BpPage>
  );
}
