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
    title: "1. Information We Collect",
    content: `We collect minimal information necessary to operate this website. This includes:
    
• **Usage Data:** Anonymous page view counts and referrer information collected via our self-hosted analytics (no third-party tracking).
• **Contact Information:** If you contact us through the form at www.embeddedos.org/contact, we retain your email address and message content solely to respond to your inquiry.
• **Donation Data:** If you donate via our website, your payment is processed securely by Stripe. We receive only a notification of the donation amount and your name/email (if provided). Card details are never stored on our servers.
• **GitHub:** If you interact with our GitHub repositories, GitHub's privacy policy applies to that data.`,
  },
  {
    title: "2. How We Use Information",
    content: `We use collected information solely for:
    
• Operating and improving the EmbeddedOS website and documentation.
• Responding to support and contact inquiries.
• Sending project update emails if you have explicitly opted in.
• Complying with legal obligations as a 501(c)(3).

We do not sell, rent, or share your personal information with third parties for marketing purposes.`,
  },
  {
    title: "3. Cookies",
    content: `This website uses only essential cookies required for basic functionality (session management). We do not use advertising cookies, cross-site tracking cookies, or third-party analytics cookies.

You can disable cookies in your browser settings. Doing so will not prevent you from accessing any content on this website.`,
  },
  {
    title: "4. Third-Party Services",
    content: `This website integrates with the following third-party services:

• **Stripe** (donation payment processing) — governed by Stripe's Privacy Policy at stripe.com/privacy
• **GitHub** (source code hosting) — governed by GitHub's Privacy Policy at docs.github.com/en/site-policy/privacy-policies
• **InterServer** (web hosting) — governed by InterServer's Privacy Policy at interserver.net/privacy-policy

We have no control over the data practices of these third parties.`,
  },
  {
    title: "5. Data Retention",
    content: `We retain contact inquiry emails for up to 12 months. Anonymous analytics data is retained for up to 24 months. Donation records are retained as required by IRS regulations for 501(c)(3) organizations (minimum 7 years).`,
  },
  {
    title: "6. Your Rights",
    content: `You have the right to:

• Request access to personal data we hold about you.
• Request correction or deletion of your personal data.
• Withdraw consent for any data processing based on consent.
• Lodge a complaint with your local data protection authority.

To exercise these rights, contact us through the form at www.embeddedos.org/contact.`,
  },
  {
    title: "7. Children's Privacy",
    content: `This website is not directed at children under 13. We do not knowingly collect personal information from children under 13. If you believe we have inadvertently collected such information, please contact us immediately through the form at www.embeddedos.org/contact.`,
  },
  {
    title: "8. Changes to This Policy",
    content: `We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated effective date. Continued use of the website after changes constitutes acceptance of the updated policy.`,
  },
  {
    title: "9. Contact",
    content: `For privacy-related questions or requests, contact the Embedded Operating Systems Research Foundation at:

**Contact form:** www.embeddedos.org/contact
**Website:** www.embeddedos.org
**GitHub:** github.com/embeddedos-org`,
  },
];

export default function Privacy() {
  return (
    <div className="min-h-screen pt-16">
      <section className="section-padding bg-grid relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1D3A]/80 to-[#080F1E]" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            <div className="badge-teal mb-4 inline-flex">Legal</div>
            <h1 className="font-heading font-extrabold text-4xl text-white mb-4">
              Privacy Policy
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
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="glass rounded-2xl border border-white/10 p-6 sm:p-8 mb-6"
          >
            <p className="text-white/60 text-sm leading-relaxed">
              The Embedded Operating Systems Research Foundation ("Foundation",
              "we", "us", or "our") operates the website at{" "}
              <strong className="text-white">www.embeddedos.org</strong>. This
              Privacy Policy explains how we collect, use, and protect
              information when you use our website, documentation, and services.
              As a 501(c)(3), we are committed to transparency and minimal data
              collection.
            </p>
          </motion.div>

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
