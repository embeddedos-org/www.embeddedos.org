import type { CSSProperties, ReactNode } from "react";
import { Link } from "wouter";
import "./bp.css";

/**
 * Black Edition page blocks (bp.css). Each block is markup only: no state, no
 * script, nothing that has to load before the page can be read. Pages keep
 * their own content, links and behaviour and use these for the layout.
 */

/** The page root: the Black Edition ground and type for everything inside. */
export function BpPage({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={className ? `bp ${className}` : "bp"} style={style}>
      {children}
    </div>
  );
}

export interface Crumb {
  label: string;
  href?: string;
}

/** A breadcrumb trail; the last item is the current page. */
export function Crumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="crumbs">
      <ol>
        {items.flatMap((c, i) => [
          ...(i > 0
            ? [
                <li key={"s" + i} aria-hidden="true">
                  /
                </li>,
              ]
            : []),
          c.href ? (
            <li key={c.label + i}>
              <Link href={c.href}>{c.label}</Link>
            </li>
          ) : (
            <li key={c.label + i} aria-current="page">
              {c.label}
            </li>
          ),
        ])}
      </ol>
    </nav>
  );
}

/**
 * The page hero: a label, the headline, an optional second line and lead, then
 * whatever the page puts under it (buttons, badges, a board). `sig` sets the
 * EoS Learn RP2350's copper routing behind the copy.
 */
export function PageHero({
  label,
  title,
  sub,
  lead,
  crumbs,
  sig = false,
  children,
  visual,
  id,
  headingId,
}: {
  label?: ReactNode;
  title: ReactNode;
  sub?: ReactNode;
  lead?: ReactNode;
  crumbs?: ReactNode;
  sig?: boolean;
  children?: ReactNode;
  visual?: ReactNode;
  id?: string;
  headingId?: string;
}) {
  return (
    <section className="phero" id={id}>
      {sig && (
        <div className="sig" aria-hidden="true">
          <i />
        </div>
      )}
      <div className="wrap">
        {crumbs}
        {label && <p className="label">{label}</p>}
        <h1 id={headingId}>{title}</h1>
        {sub && <p className="sub">{sub}</p>}
        {lead && <p className="lead">{lead}</p>}
        {children}
        {visual && <div className="pvis">{visual}</div>}
      </div>
    </section>
  );
}

/** A sticky bar under the site header with the page's name and its sections. */
export function LocalNav({
  name,
  items,
}: {
  name: string;
  items: { id: string; label: string }[];
}) {
  return (
    <nav className="lnav" aria-label={`${name}: sections`}>
      <div className="wrap">
        <b>{name}</b>
        <ul>
          {items.map(it => (
            <li key={it.id}>
              <a href={`#${it.id}`}>{it.label}</a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

/**
 * A page section with its header: a small label, the heading and a lead.
 * `split` sets the heading beside the lead on wide screens.
 */
export function Section({
  id,
  label,
  title,
  lead,
  split = false,
  alt = false,
  tight = false,
  wide = false,
  className,
  children,
  headingLevel = 2,
  headingId,
  ariaLabel,
}: {
  id?: string;
  label?: ReactNode;
  title?: ReactNode;
  lead?: ReactNode;
  split?: boolean;
  alt?: boolean;
  tight?: boolean;
  wide?: boolean;
  className?: string;
  children?: ReactNode;
  headingLevel?: 2 | 3;
  headingId?: string;
  ariaLabel?: string;
}) {
  const H = headingLevel === 3 ? "h3" : "h2";
  const cls = ["sec", alt && "alt", tight && "tight", className]
    .filter(Boolean)
    .join(" ");
  return (
    <section id={id} className={cls} aria-label={ariaLabel}>
      <div className={wide ? "wrap wide" : "wrap"}>
        {(label || title || lead) && (
          <div className={split ? "sec-h split" : "sec-h"}>
            {label && <p className="label">{label}</p>}
            {title && <H id={headingId}>{title}</H>}
            {lead && <div className="lead">{lead}</div>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

/** A row of large figures. */
export function Stats({
  items,
  small = false,
}: {
  items: { value: ReactNode; label: ReactNode }[];
  small?: boolean;
}) {
  return (
    <ul className={small ? "gstats tx" : "gstats"}>
      {items.map((s, i) => (
        <li key={i}>
          <b>{s.value}</b>
          <span>{s.label}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * A board (or device) shown large, from its ray-traced render: the AVIF where
 * the browser takes it, the WebP otherwise. `base` is the path without the
 * extension.
 */
export function BoardFigure({
  base,
  alt,
  width,
  height,
  caption,
  eager = false,
}: {
  base: string;
  alt: string;
  width: number;
  height: number;
  caption?: ReactNode;
  eager?: boolean;
}) {
  return (
    <figure className="board">
      <picture>
        <source type="image/avif" srcSet={`${base}.avif`} />
        <img
          src={`${base}.webp`}
          width={width}
          height={height}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
        />
      </picture>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

/** The closing band: one line and the page's next step. */
export function Band({
  title,
  children,
  id,
}: {
  title: ReactNode;
  children?: ReactNode;
  id?: string;
}) {
  return (
    <section className="band" id={id}>
      <div className="wrap">
        <h2>{title}</h2>
        {children && <div className="ctas">{children}</div>}
      </div>
    </section>
  );
}
