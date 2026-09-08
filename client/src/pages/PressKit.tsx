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

import { Mail } from "lucide-react";
import { Link } from "wouter";
import { openContactForm } from "@/lib/contact-form";

import {
  FOUNDATION,
  IRS_LOOKUP_URL,
  MAILING_ADDRESS,
  MISSION_STATEMENT,
} from "@/data/foundation";
import { categoryByPath } from "@/data/categories";

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
        </div>
      </section>

      <section className="section-padding">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-14">
          <div className="glass rounded-2xl border border-[#F97316]/25 p-6">
            <h2 className="font-heading font-bold text-white text-lg mb-2">
              Press enquiries
            </h2>
            <p className="text-white/60 text-sm leading-relaxed mb-4">
              Working to a deadline? Email directly rather than using the
              general contact form. Say what your deadline is and it will be
              treated as the constraint it is.
            </p>
            <button
              type="button"
              onClick={() => openContactForm({ topic: "press" })}
              className="inline-flex items-center gap-2 text-[#F97316] underline hover:no-underline font-semibold"
            >
              <Mail size={15} aria-hidden="true" /> Contact Press &amp; Media
            </button>
          </div>

          <div>
            <h2 className="font-heading font-bold text-white text-2xl mb-6">
              Facts
            </h2>
            <dl className="glass rounded-2xl border border-white/5 divide-y divide-white/5">
              {FACTS.map(fact => (
                <div
                  key={fact.label}
                  className="flex flex-wrap gap-x-6 gap-y-1 px-5 py-3.5"
                >
                  <dt className="text-white/55 text-sm w-48 shrink-0">
                    {fact.label}
                  </dt>
                  <dd className="text-white text-sm font-medium">
                    {fact.value}
                  </dd>
                </div>
              ))}
              <div className="flex flex-wrap gap-x-6 gap-y-1 px-5 py-3.5">
                <dt className="text-white/55 text-sm w-48 shrink-0">
                  Address of record
                </dt>
                <dd className="text-white text-sm font-medium">
                  {MAILING_ADDRESS.street}, {MAILING_ADDRESS.city},{" "}
                  {MAILING_ADDRESS.region} {MAILING_ADDRESS.postalCode},{" "}
                  {MAILING_ADDRESS.country}
                </dd>
              </div>
            </dl>
            <p className="text-white/55 text-sm mt-4 leading-relaxed">
              The exempt status is independently verifiable through the IRS{" "}
              <a
                href={IRS_LOOKUP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#F97316] underline hover:no-underline"
              >
                Tax Exempt Organization Search
              </a>
              . Please check it rather than taking this page's word for it.
            </p>
          </div>

          <div>
            <h2 className="font-heading font-bold text-white text-2xl mb-3">
              Boilerplate
            </h2>
            <p className="text-white/50 text-sm mb-5">
              Free to use, unedited or trimmed, in any article about the
              Foundation.
            </p>
            <blockquote className="glass rounded-2xl border border-white/5 p-6">
              <p className="text-white/80 text-sm leading-relaxed">
                {BOILERPLATE}
              </p>
            </blockquote>
          </div>

          <div>
            <h2 className="font-heading font-bold text-white text-2xl mb-3">
              Logos and colours
            </h2>
            <p className="text-white/60 text-sm leading-relaxed">
              The marks, the palette, the typefaces and the rules for using them
              are on the{" "}
              <Link
                href="/brand"
                className="text-[#F97316] underline hover:no-underline"
              >
                brand assets
              </Link>{" "}
              page. Most editorial use needs no permission.
            </p>
          </div>

          <div>
            <h2 className="font-heading font-bold text-white text-2xl mb-3">
              What we will not say
            </h2>
            <p className="text-white/60 text-sm leading-relaxed">
              The Foundation does not have adoption numbers, revenue figures or
              named production users to give you, because it does not yet have
              them. If a claim of that kind appears in a story about EmbeddedOS,
              it did not come from here. What can be substantiated is on{" "}
              <Link
                href="/transparency"
                className="text-[#F97316] underline hover:no-underline"
              >
                transparency
              </Link>{" "}
              and in the public repositories.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
