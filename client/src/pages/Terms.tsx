import { Fragment } from "react";
import { BpPage, LocalNav, PageHero } from "@/components/bp";
import "./Legal.css";

const SECTIONS = [
  {
    title: "1. Acceptance of Terms",
    content: `By accessing or using the EmbeddedOS website (www.embeddedos.org), documentation, or any associated services, you agree to be bound by these Terms of Use. If you do not agree, please do not use this website.`,
  },
  {
    title: "2. About the Foundation",
    content: `The Embedded Operating Systems Research Foundation is a 501(c)(3) organization. Our mission is to advance open-source embedded systems research, education, and technology. All software published by the Foundation is released under the **MIT License** unless otherwise stated.`,
  },
  {
    title: "3. Intellectual Property",
    content: `**Software:** All EmbeddedOS software repositories are licensed under the MIT License. You are free to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the software, subject to the MIT License terms.

**Website Content:** The text, documentation, and design of www.embeddedos.org are © 2026 Embedded Operating Systems Research Foundation. You may share and reproduce content with attribution.

**Trademarks:** "EmbeddedOS", "EoS", "eBoot", "eAI", "eNI", "EoSim", "EoStudio", "AeroSwift", "HEALTH-KEY ULTRA", "HEALTH-BAND Neuro", "HEALTH-RING", and "HEALTH-LAB" are trademarks of the Embedded Operating Systems Research Foundation.

**Patents:** HEALTH-KEY ULTRA (U.S. App. No. 64/073,334) and HEALTH-BAND Neuro (U.S. App. No. 64/076,078) are patent-pending inventions of the Foundation.`,
  },
  {
    title: "4. Use of the Website",
    content: `You agree not to:

• Use the website for any unlawful purpose or in violation of any applicable laws.
• Attempt to gain unauthorized access to any part of the website or its infrastructure.
• Scrape, crawl, or harvest content in a manner that places excessive load on our servers.
• Impersonate the Foundation or any of its representatives.
• Use the Foundation's trademarks without prior written permission.`,
  },
  {
    title: "5. Disclaimer of Warranties",
    content: `The website and all content are provided "as is" without warranty of any kind, express or implied. The Foundation does not warrant that the website will be uninterrupted, error-free, or free of viruses or other harmful components.

**Medical Disclaimer:** EmbeddedOS health device firmware and documentation are provided for research and educational purposes only. They are not FDA-approved medical devices. Do not use EmbeddedOS health software for clinical diagnosis or treatment without appropriate regulatory approval.

**Aerospace Disclaimer:** EmbeddedOS aerospace software is provided for research purposes. It has not been certified under FAA, EASA, or any other aviation authority. Do not use in actual flight systems without appropriate certification.`,
  },
  {
    title: "6. Limitation of Liability",
    content: `To the maximum extent permitted by law, the Embedded Operating Systems Research Foundation shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of this website or any EmbeddedOS software.`,
  },
  {
    title: "7. Donations",
    content: `The donation flow offers a Zeffy-hosted donation form, card payment via Stripe, and PayPal checkout. Information and payment details entered are submitted directly to the chosen processor (Zeffy, Stripe, or PayPal) and any payment or anti-abuse providers identified there, under their applicable terms. The Foundation may receive donor contact details and transaction records made available by the processor, but this website does not receive or store full card or bank credentials. The Foundation is a 501(c)(3) organization but does not provide tax or legal advice; donors are responsible for determining how a contribution is treated in their circumstances. Contact the Foundation about donation or refund questions.`,
  },
  {
    title: "8. Links to Third-Party Sites",
    content: `This website contains links to third-party websites including GitHub, Zeffy, Stripe, PayPal, InterServer, and social media platforms. These links are provided for convenience only. The Foundation is not responsible for the content or privacy practices of third-party sites.`,
  },
  {
    title: "9. Governing Law",
    content: `These Terms of Use are governed by the laws of the United States. Any disputes arising from these terms shall be resolved in accordance with applicable U.S. federal and state law.`,
  },
  {
    title: "10. Changes to Terms",
    content: `The Foundation reserves the right to modify these Terms of Use at any time. Changes will be posted on this page with an updated effective date. Continued use of the website after changes constitutes acceptance of the updated terms.`,
  },
  {
    title: "11. Contact",
    content: `For questions about these Terms of Use, contact us at:

**Contact form:** www.embeddedos.org/contact
**Website:** www.embeddedos.org
**GitHub:** github.com/embeddedos-org`,
  },
];

/** One run of policy text: `**bold**` spans become <strong>. */
function rich(line: string) {
  return line
    .split("**")
    .map((part, j) => (j % 2 === 1 ? <strong key={j}>{part}</strong> : part));
}

/**
 * A section's text, word for word: blank lines separate paragraphs, a block
 * whose every line starts with "• " is a list, and single line breaks inside a
 * paragraph are kept.
 *
 * Paragraphs and list items are <div>s with ARIA roles here, not <p>/<li>:
 * scripts/prerender.mjs takes the meta description from the first long
 * `main p, main li`, and this page's published description is its effective-
 * date line. Real paragraphs would silently replace it.
 */
function PolicyText({ text }: { text: string }) {
  return (
    <div className="prose">
      {text.split("\n\n").map((block, i) => {
        const lines = block.split("\n");
        if (lines.every(l => l.startsWith("• ")))
          return (
            <div key={i} role="list" className="lg-ul">
              {lines.map((l, j) => (
                <div key={j} role="listitem">
                  {rich(l.slice(2))}
                </div>
              ))}
            </div>
          );
        return (
          <div key={i}>
            {lines.map((l, j) => (
              <Fragment key={j}>
                {j > 0 && <br />}
                {rich(l)}
              </Fragment>
            ))}
          </div>
        );
      })}
    </div>
  );
}

export default function Terms() {
  return (
    <BpPage className="legal terms">
      <PageHero sig label="Legal" title="Terms of Use">
        <p className="lg-meta">
          Effective date: September 15, 2026 · Embedded Operating Systems
          Research Foundation
        </p>
      </PageHero>
      <LocalNav
        name="Terms of Use"
        items={SECTIONS.map((s, i) => ({
          id: `s${i + 1}`,
          label: s.title.replace(/^\d+\.\s*/, ""),
        }))}
      />
      <div className="sec lg-body">
        <div className="wrap">
          <div className="lg-doc">
            {SECTIONS.map((section, i) => (
              <section
                key={section.title}
                id={`s${i + 1}`}
                className="lg-sec"
                aria-labelledby={`s${i + 1}-h`}
              >
                <h2 id={`s${i + 1}-h`}>{section.title}</h2>
                <PolicyText text={section.content} />
              </section>
            ))}
          </div>
        </div>
      </div>
    </BpPage>
  );
}
