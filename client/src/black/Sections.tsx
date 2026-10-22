import type { CSSProperties } from "react";
import { Link } from "wouter";
import { BOARD_COUNT, REPO_COUNT } from "@/data/stack";
import { EAI_EDGE_PROFILE } from "@/data/architecture";
import { BOARD_CHECKS, BOARDS_URL, EOS_BOARDS, FILM, MEDIA_HOME } from "./data";

const S = MEDIA_HOME + "story/";
// frameTier() picks the 1920 set when max(width, height × 1.6) × 1.12 ≤ 1997 at 1x, i.e. width ≤ 1783 and height
// ≤ 1114: the poster on screen and the frames that replace it come from one set
const HQ =
  "(orientation: landscape) and (min-width: 801px) and (max-width: 1783px) and (max-height: 1114px) and (max-resolution: 1.49dppx)";
const SMALL = "(orientation: portrait), (max-width: 800px)";

/**
 * The hero and the scroll story: the EoS Learn RP2350, ray-traced from its
 * KiCad files, turns as the page scrolls (story.js draws the frames on a
 * canvas over the poster). The hero card carries what the 3D story's hero
 * carried: the mission link, the headline, the physical-AI line, the three
 * calls to action and the counts.
 */
export function StoryHero() {
  return (
    <section
      className="bk-story"
      id="bk-story"
      data-media={MEDIA_HOME}
      aria-label="The EoS Learn RP2350, ray-traced from its KiCad design"
    >
      <div className="bk-stage" id="bk-stage">
        <article
          className="card hero-card bk-scene bk-s0"
          id="bk-sc0"
          style={{ "--c": "#F97316" } as CSSProperties}
        >
          <div className="bk-wrap">
            <Link className="bk-label eyebrow" href="/mission">
              Foundation · 501(c)(3) · <b>MIT License</b>
            </Link>
            <h1 id="hero-heading">
              <span className="h1a">Open-source embedded systems</span>{" "}
              <span>for intelligent physical devices</span>
            </h1>
            <p className="bk-lead">
              From open hardware and secure boot to a real-time OS, developer
              tools, and on-device AI.
            </p>
            <p className="bk-tag">
              <b>Open infrastructure for physical AI.</b>{" "}
              <span>
                {EAI_EDGE_PROFILE.maturity}: {EAI_EDGE_PROFILE.name} ={" "}
                {EAI_EDGE_PROFILE.sequence.join(" → ")}
              </span>
            </p>
            <div className="bk-ctas">
              <Link className="bk-btn pri" href="/getting-started">
                Get Started{" "}
                <span className="ar" aria-hidden="true">
                  →
                </span>
              </Link>
              <Link className="bk-btn gh2" href="/donate">
                <span className="heart" aria-hidden="true">
                  ♥
                </span>
                {" Support Our Mission"}
              </Link>
              <a
                className="bk-btn ln"
                href="https://github.com/embeddedos-org"
                target="_blank"
                rel="noopener"
              >
                {"View on GitHub "}
                <span className="star" aria-hidden="true">
                  ★
                </span>
              </a>
            </div>
            <div className="bk-hstats" aria-label="At a glance">
              <div>
                <b>{REPO_COUNT}</b>
                <span>Repositories</span>
              </div>
              <div>
                <b>{BOARD_COUNT}</b>
                <span>Boards</span>
              </div>
              <div>
                <b>14</b>
                <span>Books</span>
              </div>
            </div>
          </div>
        </article>
        <div className="bk-cam" id="bk-cam">
          <picture>
            <source
              media={SMALL}
              srcSet={`${S}m/poster.avif`}
              type="image/avif"
              width={1280}
              height={800}
            />
            <source
              media={SMALL}
              srcSet={`${S}m/poster.webp`}
              width={1280}
              height={800}
            />
            <source
              media={HQ}
              srcSet={`${S}h/poster.avif`}
              type="image/avif"
              width={1920}
              height={1200}
            />
            <source
              media={HQ}
              srcSet={`${S}h/poster.webp`}
              width={1920}
              height={1200}
            />
            <source
              srcSet={`${S}d/poster.avif`}
              type="image/avif"
              width={2560}
              height={1600}
            />
            <img
              className="bk-poster"
              src={`${S}d/poster.webp`}
              width={2560}
              height={1600}
              alt="The EoS Learn RP2350 teaching board in black solder mask, ray-traced from its KiCad files"
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          </picture>
        </div>
        <div className="bk-scene bk-sc bk-s1" id="bk-sc1">
          <div className="bk-wrap">
            <div className="in">
              <p className="bk-kick">
                EoS Learn RP2350 · <em>Teaching board</em>
              </p>
              <h2>Built around the RP2350A.</h2>
              <p className="bk-lead">
                A dual-core Cortex-M33 microcontroller, with its 12 MHz crystal
                and 128 Mbit QSPI flash right beside it.
              </p>
            </div>
          </div>
        </div>
        <div className="bk-scene bk-sc bk-s2" id="bk-sc2">
          <div className="bk-wrap">
            <div className="in">
              <p className="bk-kick">Ray-traced from the KiCad files</p>
              <h2>52.6 × 51.6 mm. Four layers.</h2>
              <dl className="bk-specs">
                <div>
                  <dt>Main chip</dt>
                  <dd>RP2350A</dd>
                </div>
                <div>
                  <dt>Copper layers</dt>
                  <dd>4</dd>
                </div>
                <div>
                  <dt>Checked in</dt>
                  <dd>KiCad 10.0.6</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
        <div className="bk-scene bk-sc bk-s3" id="bk-sc3">
          <div className="bk-wrap">
            <div className="bk-zero" role="list">
              <div role="listitem">
                <b>0</b>
                <span>ERC violations</span>
              </div>
              <div role="listitem">
                <b>0</b>
                <span>DRC errors</span>
              </div>
              <div role="listitem">
                <b>0</b>
                <span>unconnected items</span>
              </div>
            </div>
            <p className="bk-cap">
              Every board passes KiCad 10.0.6 with 0 ERC violations, 0 DRC
              errors and 0 unconnected items.
            </p>
          </div>
        </div>
        <div className="bk-scene bk-sc bk-s4" id="bk-sc4">
          <div className="bk-wrap">
            <div className="in">
              <p className="bk-kick">The board’s real routing</p>
              <h2>Every trace, in the open.</h2>
              <p className="bk-lead">
                Drawn here from the board’s own KiCad file. Native KiCad files
                are downloadable.
              </p>
              <div className="bk-legend">
                <span>
                  <i />
                  Front copper
                </span>
                <span>
                  <i className="b" />
                  Back copper
                </span>
              </div>
              <a className="bk-tlink" href="#boards">
                See all fifteen boards{" "}
                <span className="ar" aria-hidden="true">
                  →
                </span>
              </a>
            </div>
          </div>
        </div>
        <div className="bk-scr l" id="bk-scr-l" />
        <div className="bk-scr r" id="bk-scr-r" />
        <div className="bk-scr b" id="bk-scr-b" />
      </div>
    </section>
  );
}

const mmss = (t: number) =>
  `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`;

/**
 * The making-of film: the EoS Learn RP2350 told through its own files, in
 * short segments that story.js plays back to back. Without script the
 * poster and the chapter list still show.
 */
export function MakingOf() {
  const total = FILM.segments[FILM.segments.length - 1];
  return (
    <section className="bk-sec bk-film" id="film" aria-labelledby="bk-film-h">
      <div className="bk-wrap">
        <div className="bk-sec-h bk-split">
          <div>
            <p className="bk-label">The making of</p>
            <h2 id="bk-film-h">One board, end to end.</h2>
          </div>
          <p className="bk-lead">
            The EoS Learn RP2350 told through its own files: the schematic, the
            parts and what each one does, the four copper layers, the checks it
            passes, and what happens in its first second of boot.{" "}
            <b>{FILM.length}, silent</b>. Jump to any part below.
          </p>
        </div>
        <figure
          className="bk-player"
          id="bk-player"
          data-segs={FILM.segments.join(",")}
          data-base={MEDIA_HOME + "film/"}
        >
          {/* a lazy image, not the video's poster attribute (which loads at once, ahead of the hero) */}
          <img
            className="bk-fposter"
            src={MEDIA_HOME + "film/poster.webp"}
            width={1920}
            height={1080}
            alt=""
            loading="lazy"
            decoding="async"
          />
          <video
            id="bk-fv"
            className="on"
            muted
            playsInline
            preload="none"
            aria-label="The making of the EoS Learn RP2350: schematic, parts, copper layers, checks, the ray-traced board, the boot chain and the published files"
          />
          <video
            id="bk-fv2"
            muted
            playsInline
            preload="none"
            aria-hidden="true"
            tabIndex={-1}
          />
          <button
            type="button"
            className="bk-pbig"
            id="bk-pbig"
            aria-label="Play film"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8 5.5v13l10.5-6.5z" />
            </svg>
          </button>
          <figcaption className="bk-pbar">
            <button
              type="button"
              className="bk-pp"
              id="bk-fpp"
              aria-label="Play film"
            >
              <svg className="i-play" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M4.5 2.8v10.4l8.4-5.2z" />
              </svg>
              <svg className="i-pause" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M4 2.5h3v11H4zM9 2.5h3v11H9z" />
              </svg>
            </button>
            <div
              className="bk-track"
              id="bk-ftrack"
              role="slider"
              tabIndex={0}
              aria-label="Film position"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={0}
            >
              <i id="bk-ffill" />
            </div>
            <span className="bk-time" id="bk-ftime">
              0:00 / {mmss(total)}
            </span>
          </figcaption>
        </figure>
        <ol className="bk-fchap" id="bk-fchap">
          {FILM.chapters.map(([name, t]) => (
            <li key={name}>
              <button type="button" data-t={t}>
                <span className="t">{mmss(t)}</span>
                {name}
              </button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const B = MEDIA_HOME + "boards/";

/**
 * The board showcase: one board large on a stage, a spec pane per board and
 * a strip of all fifteen. Without script every pane shows and each strip item
 * links to the board's files; with it the strip selects.
 */
export function Showcase() {
  const first = EOS_BOARDS[0];
  const n = EOS_BOARDS.length;
  return (
    <section className="bk-sec" id="boards" aria-labelledby="bk-boards-h">
      <div className="bk-wrap">
        <div className="bk-sec-h bk-split">
          <div>
            <p className="bk-label">EoS boards</p>
            <h2 id="bk-boards-h">Fifteen original boards.</h2>
          </div>
          <p className="bk-lead">
            Teaching boards, development boards, a debug probe and compute
            module carriers.{" "}
            <b>
              Every one passes KiCad 10.0.6 with 0 ERC violations, 0 DRC errors
              and 0 unconnected items.
            </b>
          </p>
        </div>
      </div>
      <div className="bk-wrap xw">
        <div className="bshow" id="bshow" data-base={B}>
          <div className="bs-stage">
            <div className="bs-fig">
              <span className="bs-shadow" aria-hidden="true" />
              <picture className="bs-img on">
                <source type="image/avif" srcSet={`${B}${first.slug}.avif`} />
                <img
                  src={`${B}${first.slug}.webp`}
                  width={1600}
                  height={1200}
                  alt={`${first.name}, ray-traced from its KiCad files`}
                  loading="lazy"
                  decoding="async"
                />
              </picture>
              {/* the cross-fade's second slot: it starts on the same image (the same file, so nothing more
                  downloads) rather than with no source, which reads as a broken image */}
              <picture className="bs-img" aria-hidden="true">
                <source type="image/avif" srcSet={`${B}${first.slug}.avif`} />
                <img
                  src={`${B}${first.slug}.webp`}
                  alt=""
                  width={1600}
                  height={1200}
                  loading="lazy"
                  decoding="async"
                />
              </picture>
            </div>
            <div className="bs-lens" aria-hidden="true" />
            <p className="bs-tip" aria-hidden="true">
              Point at the board to look closer
            </p>
            <p className="bs-count" aria-hidden="true">
              <b>01</b> / {String(n).padStart(2, "0")}
            </p>
          </div>
          <div className="bs-info">
            {EOS_BOARDS.map((b, i) => (
              <div
                key={b.slug}
                className={"bs-pane" + (i === 0 ? " on" : "")}
                id={`bp-${b.slug}`}
                role="tabpanel"
                aria-labelledby={`bt-${b.slug}`}
              >
                <p className="bs-k">{b.kind}</p>
                <h3>{b.name}</h3>
                <p className="bs-d">{b.purpose}</p>
                <dl className="bs-dl">
                  <dt>Main chip</dt>
                  <dd>{b.chip}</dd>
                  <dt>Size</dt>
                  <dd>{b.size} mm</dd>
                  <dt>Layers</dt>
                  <dd>{b.layers}</dd>
                  <dt>KiCad 10.0.6</dt>
                  <dd>{BOARD_CHECKS}</dd>
                </dl>
                <ul className="bs-f">
                  {b.facts.map(f => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <a className="bs-go" href={BOARDS_URL + b.folder}>
                  Open the design files <span aria-hidden="true">→</span>
                </a>
              </div>
            ))}
            <div className="bs-act">
              <span className="bs-hint">
                {n} boards · ray-traced from their KiCad files
              </span>
              <div className="bs-nav">
                <button
                  className="bk-rb bs-p"
                  type="button"
                  aria-label="Previous board"
                >
                  <svg viewBox="0 0 16 16" aria-hidden="true">
                    <path d="M10 3 5 8l5 5" />
                  </svg>
                </button>
                <button
                  className="bk-rb bs-n"
                  type="button"
                  aria-label="Next board"
                >
                  <svg viewBox="0 0 16 16" aria-hidden="true">
                    <path d="m6 3 5 5-5 5" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <ul className="bs-strip" role="tablist" aria-label="Boards">
            {EOS_BOARDS.map((b, i) => (
              <li
                key={b.slug}
                className={i === 0 ? "on" : undefined}
                role="presentation"
              >
                <a
                  role="tab"
                  id={`bt-${b.slug}`}
                  href={BOARDS_URL + b.folder}
                  aria-controls={`bp-${b.slug}`}
                  aria-selected={i === 0}
                  tabIndex={i === 0 ? 0 : -1}
                  data-s={b.slug}
                  data-alt={`${b.name}, ray-traced from its KiCad files`}
                  data-lens="1"
                >
                  <img
                    src={`${B}${b.slug}-t.webp`}
                    width={320}
                    height={240}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                  <span>{b.name.replace("EoS ", "")}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="bk-wrap">
        <div className="bk-proof">
          <span>
            Design files, not yet manufactured or bench-tested. Board designs ©
            Kartikeydheer Srivastava, all rights reserved; EmbeddedOS may use
            them.
          </span>
          <a href={BOARDS_URL.replace(/\/$/, "")}>
            Native KiCad files on GitHub →
          </a>
        </div>
      </div>
    </section>
  );
}
