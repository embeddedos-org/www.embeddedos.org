import { useState, type CSSProperties } from "react";
import { Link, useLocation } from "wouter";
import StructuredData from "@/components/StructuredData";
import { ECOSYSTEM } from "@/data/ecosystem";
import { ORIGIN, canonicalFor } from "@/lib/page-meta";
import { componentRouteFor, splitRelationship } from "@/lib/component-links";
import { BpPage, Crumbs, PageHero, Section, Stats } from "@/components/bp";
import "./ProductDetailPage.css";

export interface ProductSpec {
  key: string;
  value: string;
}

export interface ProductFeature {
  name: string;
  desc: string;
}

export interface ProductStat {
  value: string;
  label: string;
}

export interface ProductPair {
  name: string;
  route: string;
  desc: string;
}

export interface WorkflowStep {
  step: number;
  title: string;
  desc: string;
  code?: string;
}

export interface UsageExample {
  title: string;
  scenario: string;
  code: string;
  lang?: string;
}

export interface EcosystemRole {
  importance: "critical" | "high" | "medium";
  role: string;
  dependsOn: string[];
  enabledBy: string[];
  summary: string;
}

export interface ProductDetailProps {
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  accent: string;
  gradient: string;
  lang: string;
  github: string;
  stats: ProductStat[];
  features: ProductFeature[];
  specs: ProductSpec[];
  pairs: ProductPair[];
  stackHighlight?: string;
  heroImage?: string;
  workflow?: WorkflowStep[];
  usageExamples?: UsageExample[];
  ecosystemRole?: EcosystemRole;
}

const stackLayers = [
  "App layer",
  "UI / browser layer",
  "Data layer",
  "AI runtime",
  "Neural interface",
  "IPC fabric",
  "EoS kernel + HAL",
  "eos-platform profile",
  "eBootloader",
  "Build / IDE / Sim",
];

const importanceBadge: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  critical: {
    label: "Critical — Foundation Layer",
    color: "#EF4444",
    bg: "#EF444415",
  },
  high: { label: "High — Core Service", color: "#F97316", bg: "#F9731615" },
  medium: {
    label: "Important — Extended Stack",
    color: "#22D3EE",
    bg: "#22D3EE15",
  },
};

function RelatedComponent({ text }: { text: string }) {
  const { head, rest } = splitRelationship(text);
  const route = componentRouteFor(head);
  if (!route) return <>{text}</>;
  return (
    <span>
      <Link href={route} className="tl">
        {head}
      </Link>
      {rest}
    </span>
  );
}

export default function ProductDetailPage({
  badge,
  title,
  subtitle,
  description,
  accent,
  lang,
  github,
  stats,
  features,
  specs,
  pairs,
  stackHighlight,
  heroImage,
  workflow,
  usageExamples,
  ecosystemRole,
}: ProductDetailProps) {
  const [activeExample, setActiveExample] = useState(0);
  const shortName = title.split(" — ")[0];
  const [location] = useLocation();
  const repoUrl = `https://github.com/${github}`;
  const component = ECOSYSTEM.find(
    c => c.repository.toLowerCase() === repoUrl.toLowerCase()
  );
  // canonicalFor(), not a hand-built string: the breadcrumb's last item has to
  // be the page's own canonical URL, and the two drifted apart once already.
  const pageUrl = canonicalFor(location);
  const facts =
    component && location === `/product-${component.id}` ? component : null;
  const shownLang = facts?.language ?? lang;
  const shownVersion = facts?.version ?? null;
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${ORIGIN}/` },
        {
          "@type": "ListItem",
          position: 2,
          name: "Products",
          item: canonicalFor("/products"),
        },
        { "@type": "ListItem", position: 3, name: shortName, item: pageUrl },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "SoftwareSourceCode",
      name: facts?.name ?? shortName,
      ...(facts && facts.name !== shortName
        ? { alternateName: shortName }
        : {}),
      description,
      codeRepository: component ? component.repository : repoUrl,
      ...(facts?.language ? { programmingLanguage: facts.language } : {}),
      url: pageUrl,
      license: "https://spdx.org/licenses/MIT.html",
      isAccessibleForFree: true,
      maintainer: {
        "@type": "NGO",
        name: "Embedded Operating Systems Research Foundation",
        url: ORIGIN,
      },
      ...(shownVersion ? { version: shownVersion } : {}),
    },
  ];

  const imp = ecosystemRole ? importanceBadge[ecosystemRole.importance] : null;

  return (
    <BpPage className="pd" style={{ "--c": accent } as CSSProperties}>
      <StructuredData schema={schema} />
      {heroImage && (
        <img
          loading="lazy"
          decoding="async"
          src={heroImage}
          alt=""
          aria-hidden="true"
          className="pd-heroimg"
        />
      )}
      <PageHero
        sig={!heroImage}
        crumbs={
          <Crumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Products", href: "/products" },
              { label: shortName },
            ]}
          />
        }
        label={badge}
        title={title}
        sub={subtitle}
        lead={description}
      >
        {component?.sitePage && component.sitePage !== location && (
          <p className="fine pd-over">
            For a shorter introduction to {component.name}, see the{" "}
            <Link href={component.sitePage} className="tl">
              {component.name} overview
            </Link>
            . This page is the engineering detail.
          </p>
        )}
        <div className="ctas">
          <a
            href={`https://github.com/${github}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn pri"
          >
            View on GitHub →
          </a>
          <Link href="/api-docs" className="btn gh">
            Read the Docs
          </Link>
        </div>
        <ul className="badges" aria-label="Facts">
          <li>{shownLang}</li>
          <li className="ok">
            {shownVersion ? `MIT · v${shownVersion}` : "MIT licensed"}
          </li>
          {imp && (
            <li className="dot" style={{ "--c": imp.color } as CSSProperties}>
              {imp.label}
            </li>
          )}
        </ul>
      </PageHero>

      <div className="wrap pd-stats">
        <Stats items={stats.map(s => ({ value: s.value, label: s.label }))} />
      </div>

      {/* How It Works — Workflow Steps */}
      {workflow && workflow.length > 0 && (
        <Section
          title="How It Works"
          lead="Step-by-step flow — from initialization to output."
          split
        >
          <ol className="steps num">
            {workflow.map(step => (
              <li key={step.step}>
                <span className="n">{step.step}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                  {step.code && (
                    <div className="code">
                      <pre className="wrapm">{step.code}</pre>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </Section>
      )}

      {/* Usage Examples */}
      {usageExamples && usageExamples.length > 0 && (
        <Section
          title="Usage Examples"
          lead={<>Real-world scenarios showing {shortName} in action.</>}
          split
        >
          <div className="ctas pd-tabs">
            {usageExamples.map((ex, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveExample(i)}
                aria-pressed={activeExample === i}
                className="btn gh sm"
              >
                {ex.title}
              </button>
            ))}
          </div>
          {usageExamples[activeExample] && (
            <div className="code pd-ex" key={activeExample}>
              <div className="cbar">
                <b>{usageExamples[activeExample].title}</b>
                <span>{usageExamples[activeExample].scenario}</span>
              </div>
              <pre>{usageExamples[activeExample].code}</pre>
            </div>
          )}
        </Section>
      )}

      {/* Features Grid */}
      <Section
        title="Features"
        lead={<>The shape of {shortName} at a glance.</>}
        split
      >
        <ul className="cards">
          {features.map(feat => (
            <li key={feat.name}>
              <div className="card">
                <h3>{feat.name}</h3>
                <p>{feat.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      {/* Role in the EoS Ecosystem */}
      {ecosystemRole && (
        <Section
          title="Role in the EoS Ecosystem"
          lead={
            <>
              Why {shortName} matters — and what breaks without it. See how the
              pieces fit together in the{" "}
              <Link href="/ecosystem" className="tl">
                EmbeddedOS ecosystem overview
              </Link>
              .
            </>
          }
          split
        >
          <p className="pd-role">{ecosystemRole.summary}</p>
          <div className="cards two">
            {ecosystemRole.dependsOn.length > 0 && (
              <div className="card">
                <h3>Depends On</h3>
                <ul className="pd-rel dep">
                  {ecosystemRole.dependsOn.map(dep => (
                    <li key={dep}>
                      <RelatedComponent text={dep} />
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {ecosystemRole.enabledBy.length > 0 && (
              <div className="card">
                <h3>Enables / Powers</h3>
                <ul className="pd-rel ena">
                  {ecosystemRole.enabledBy.map(dep => (
                    <li key={dep}>
                      <RelatedComponent text={dep} />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Section>
      )}

      {/* GitHub + Stack + Pairs */}
      <Section>
        <div className="cards">
          <div className="card">
            <h2 className="pd-h">Open source on GitHub</h2>
            <p>
              MIT licensed and developed in the open. Issues, discussions, and
              pull requests welcome.
            </p>
            <div className="pd-repo">
              <div className="pd-repo-name">⌥ {github}</div>
              <div>{title.split(" — ")[1] || title}</div>
              <ul className="badges">
                <li>{shownLang}</li>
                <li>MIT</li>
                {shownVersion && <li>v{shownVersion}</li>}
              </ul>
            </div>
            <a
              href={`https://github.com/${github}`}
              target="_blank"
              rel="noopener noreferrer"
              className="more"
            >
              Open
              <span className="sr-only">
                {" "}
                the {github} repository on GitHub
              </span>{" "}
              ↗
            </a>
            <p className="fine">
              Every EmbeddedOS repository, with install commands, is listed on{" "}
              <Link href="/downloads" className="tl">
                the downloads page
              </Link>
              .
            </p>
          </div>

          <div className="card">
            <h2 className="pd-h">In the EoS stack</h2>
            <p>{shortName} is highlighted in the layer below.</p>
            <ol className="pd-stack">
              {stackLayers.map(layer => {
                const isHighlight =
                  stackHighlight &&
                  layer.toLowerCase().includes(stackHighlight.toLowerCase());
                return (
                  <li key={layer} className={isHighlight ? "on" : undefined}>
                    {layer}
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="card">
            <h2 className="pd-h">Pairs well with</h2>
            <p>Sibling components that {shortName} commonly works alongside.</p>
            <ul className="glinks pd-pairs">
              {pairs.map(pair => (
                <li key={pair.name}>
                  <Link href={pair.route}>
                    <span>{pair.name}</span>
                    <small>{pair.desc}</small>
                    <i aria-hidden="true">→</i>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Specs Table */}
      {specs.length > 0 && (
        <Section title="Technical Specifications">
          <div className="tbl">
            <table>
              <tbody>
                {specs.map((spec, i) => (
                  <tr key={i}>
                    <td>{spec.key}</td>
                    <td>{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      )}
    </BpPage>
  );
}
