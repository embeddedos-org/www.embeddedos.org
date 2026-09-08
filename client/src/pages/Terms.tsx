import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.05, ease: "easeOut" as const },
  }),
};

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
    content: `Donations made through this website are processed securely by Stripe under their terms of service. Donations to the Foundation are tax-deductible to the extent permitted by law for U.S. taxpayers. The Foundation is a 501(c)(3) organization. Donations are non-refundable except at the Foundation's sole discretion.`,
  },
  {
    title: "8. Links to Third-Party Sites",
    content: `This website contains links to third-party websites including GitHub, Stripe, InterServer, and social media platforms. These links are provided for convenience only. The Foundation is not responsible for the content or privacy practices of third-party sites.`,
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

export default function Terms() {
  return (
    <div className="min-h-screen pt-16">
      <section className="section-padding bg-grid relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1D3A]/80 to-[#080F1E]" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            <div className="badge-amber mb-4 inline-flex">Legal</div>
            <h1 className="font-heading font-extrabold text-4xl text-white mb-4">
              Terms of Use
            </h1>
            <p className="text-white/50 text-sm">
              Effective date: January 1, 2026 · Embedded Operating Systems
              Research Foundation
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="space-y-6">
            {SECTIONS.map((section, i) => (
              <motion.div
                key={section.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="glass rounded-xl border border-white/5 p-6"
              >
                <h2 className="font-heading font-bold text-white text-lg mb-3">
                  {section.title}
                </h2>
                <div className="text-white/60 text-sm leading-relaxed whitespace-pre-line">
                  {section.content.split("**").map((part, j) =>
                    j % 2 === 1 ? (
                      <strong key={j} className="text-white">
                        {part}
                      </strong>
                    ) : (
                      part
                    )
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
