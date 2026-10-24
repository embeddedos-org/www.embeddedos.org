/**
 * Media/Press Kit — the facts, in the form a journalist needs them.
 *
 * Every value comes from data/foundation.ts, the same record that feeds /about,
 * /transparency and the JSON-LD in the document head. That is the point: a
 * press kit that carries its own copy of the legal name and the EIN is a press
 * kit that will eventually disagree with the rest of the site, and the
 * disagreement will surface in someone else's article.
 *
 * The boilerplate is offered as selectable text rather than a download, because
 * what a journalist actually does with it is paste it.
 */

import { Link } from "wouter";
import { openContactForm } from "@/lib/contact-form";

import {
  FOUNDATION,
  IRS_LOOKUP_URL,
  MAILING_ADDRESS,
  MISSION_STATEMENT,
} from "@/data/foundation";
import { categoryByPath } from "@/data/categories";
import { BpPage, LocalNav, PageHero } from "@/components/bp";
import "./PressKit.css";

/** Label/value pairs a reporter is likely to need to verify. */
const FACTS: readonly { label: string; value: string }[] = [
  { label: "Legal name", value: FOUNDATION.legalName },
  { label: "Short name", value: FOUNDATION.shortName },
  { label: "Tax status", value: FOUNDATION.taxStatus },
  {
    label: "IRS classification",
    value: FOUNDATION.publicCharityClassification,
  },
  { label: "EIN", value: FOUNDATION.ein },
  { label: "Exemption effective", value: FOUNDATION.exemptionEffective },
  { label: "Jurisdiction", value: FOUNDATION.jurisdiction },
  { label: "Software licence", value: FOUNDATION.softwareLicense },
  { label: "Website", value: FOUNDATION.website },
];

/**
 * The paragraph to paste at the foot of an article.
 *
 * Assembled from the same fields shown above rather than written out again, so
 * it cannot drift from them.
 */
const BOILERPLATE =
  `${FOUNDATION.legalName} (${FOUNDATION.shortName}) is a ${FOUNDATION.taxStatus} ` +
  `nonprofit registered in the ${FOUNDATION.jurisdiction}. ${MISSION_STATEMENT} ` +
  `Its software is released under the ${FOUNDATION.softwareLicense}. ` +
  `More at ${FOUNDATION.website}.`;

export default function PressKit() {
  const category = categoryByPath("/press-kit")!;

  return (
    <BpPage className="presskit">
      <PageHero
        sig
        label="Marketing"
        title={category.name}
        lead={category.summary}
      />
      <LocalNav
        name={category.name}
        items={[
          { id: "press", label: "Press enquiries" },
          { id: "facts", label: "Facts" },
          { id: "boilerplate", label: "Boilerplate" },
          { id: "logos", label: "Logos and colours" },
          { id: "not-say", label: "What we will not say" },
        ]}
      />

      <div className="sec pk-body">
        <div className="wrap">
          <section id="press" className="pk-row pk-press">
            <h2>Press enquiries</h2>
            <div className="pk-c">
              <p>
                Working to a deadline? Email directly rather than using the
                general contact form. Say what your deadline is and it will be
                treated as the constraint it is.
              </p>
              <div className="ctas">
                <button
                  type="button"
                  onClick={() => openContactForm({ topic: "press" })}
                  className="btn or"
                >
                  Contact Press &amp; Media
                </button>
              </div>
            </div>
          </section>

          <section id="facts" className="pk-row">
            <h2>Facts</h2>
            <div className="pk-c">
              <dl className="kv">
                {FACTS.map(fact => (
                  <div key={fact.label} className="pk-kv">
                    <dt>{fact.label}</dt>
                    <dd>{fact.value}</dd>
                  </div>
                ))}
                <div className="pk-kv">
                  <dt>Address of record</dt>
                  <dd>
                    {MAILING_ADDRESS.street}, {MAILING_ADDRESS.city},{" "}
                    {MAILING_ADDRESS.region} {MAILING_ADDRESS.postalCode},{" "}
                    {MAILING_ADDRESS.country}
                  </dd>
                </div>
              </dl>
              <p className="pk-note">
                The exempt status is independently verifiable through the IRS{" "}
                <a
                  href={IRS_LOOKUP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tl"
                >
                  Tax Exempt Organization Search
                </a>
                . Please check it rather than taking this page's word for it.
              </p>
            </div>
          </section>

          <section id="boilerplate" className="pk-row">
            <h2>Boilerplate</h2>
            <div className="pk-c">
              <p>
                Free to use, unedited or trimmed, in any article about the
                Foundation.
              </p>
              <blockquote className="pk-quote">
                <p>{BOILERPLATE}</p>
              </blockquote>
            </div>
          </section>

          <section id="logos" className="pk-row">
            <h2>Logos and colours</h2>
            <div className="pk-c">
              <p>
                The marks, the palette, the typefaces and the rules for using
                them are on the{" "}
                <Link href="/brand" className="tl">
                  brand assets
                </Link>{" "}
                page. Most editorial use needs no permission.
              </p>
            </div>
          </section>

          <section id="not-say" className="pk-row">
            <h2>What we will not say</h2>
            <div className="pk-c">
              <p>
                The Foundation does not have adoption numbers, revenue figures
                or named production users to give you, because it does not yet
                have them. If a claim of that kind appears in a story about
                EmbeddedOS, it did not come from here. What can be substantiated
                is on{" "}
                <Link href="/transparency" className="tl">
                  transparency
                </Link>{" "}
                and in the public repositories.
              </p>
            </div>
          </section>
        </div>
      </div>
    </BpPage>
  );
}
