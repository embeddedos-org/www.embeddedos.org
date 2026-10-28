import type { MouseEvent } from "react";
import { Link } from "wouter";
import {
  Github,
  Twitter,
  Youtube,
  Mail,
  Heart,
  Linkedin,
  Facebook,
  Instagram,
  MessageCircle,
  ExternalLink,
} from "lucide-react";
import { COMMUNITY_LINKS } from "@/data/community";
import {
  CONTACT_EMAILS,
  FOUNDATION,
  MAILING_ADDRESS,
  SOCIAL_URLS,
  formatMailingAddress,
} from "@/data/foundation";
import { openContactForm } from "@/lib/contact-form";

/**
 * Community destinations kept in the footer.
 *
 * The full COMMUNITY_LINKS list lives on /community. The footer carries only
 * the two contribution paths e2e pins (Discussions, Projects): Wiki, Issues,
 * Discord and AGENTS.md are one click away on /community instead. A developer
 * config filename (AGENTS.md) in a nonprofit footer confused reviewers, and
 * six external links in Join & Support buried the donation path.
 */
const FOOTER_COMMUNITY_LINKS = COMMUNITY_LINKS.filter(
  link => link.name === "Discussions" || link.name === "Projects"
);

const LOGO_MARK = "/media/embeddedos-logo-mark_bc053888.jpg";
const WEBSITE_HOST = new URL(FOUNDATION.website).hostname;

/**
 * The footer is the site's organisational map; the header is its product menu.
 *
 * The two used to be near-duplicates — 16 routes appeared in both, and the
 * header's "Community" menu carried About, Mission, Transparency, Careers and
 * Patents, none of which a visitor browsing the software is looking for. The
 * institutional pages now live here only, and the header keeps the builder's
 * journey: Projects, Products, Docs, Community.
 *
 * Six columns of at most eight links (Ad Grants: "clear navigation" — the
 * footer previously ran seven columns and ~90 links). Depth beyond that lives
 * on hub pages, and tests/unit/navigation.test.ts holds the chain: every route
 * the router serves must appear here directly or on its hub (/news for the
 * marketing sections, /research for research output, /resources for site
 * pages, /ecosystem for project pages, /about for institutional pages,
 * /donate for membership paths). A page linked only from body copy on another
 * page is one edit away from being orphaned — `/docs`, `/security`,
 * `/licenses`, `/roadmap`, `/research` and `/demo` had already reached that
 * state once, which is why the hub rule exists.
 */
const FOOTER_LINKS = {
  Foundation: [
    { name: "About", href: "/about" },
    { name: "Mission & Scope", href: "/mission" },
    { name: "Our Vision", href: "/vision" },
    { name: "Organization", href: "/organization" },
    { name: "Transparency", href: "/transparency" },
    { name: "Programmes", href: "/programmes" },
    { name: "Research", href: "/research" },
    { name: "Contact", href: "/contact" },
  ],
  // Marketing sections with their own indexes. The remaining sections
  // (case studies, member stories, showcases, video, social, press kit) are
  // one click away in /news "Browse by section" — see the hub rule above.
  "News & Stories": [
    { name: "News", href: "/news" },
    { name: "Blog", href: "/blog" },
    { name: "Newsletter", href: "/newsletter" },
    { name: "Press Releases", href: "/press-releases" },
    { name: "Events", href: "/events" },
    { name: "Videos", href: "/videos" },
    { name: "Podcast", href: "/podcast" },
    { name: "Webinars", href: "/webinars" },
  ],
  // The three hubs (All Products, All Projects, Ecosystem) carry the full
  // catalogue; the columns name the stack's front doors only.
  Platform: [
    { name: "All Products", href: "/products" },
    { name: "All Projects", href: "/projects" },
    { name: "Ecosystem", href: "/ecosystem" },
    { name: "How EmbeddedOS Works", href: "/what-we-do" },
    { name: "EoS Kernel", href: "/eos" },
    { name: "eAI", href: "/eai" },
    { name: "eBuild", href: "/ebuild" },
    { name: "Quantum (eQC)", href: "/quantum" },
  ],
  Applications: [
    { name: "All Apps", href: "/eapps" },
    { name: "EoSuite", href: "/eosuite" },
    { name: "EoStudio IDE", href: "/eostudio" },
    { name: "EoSim Simulator", href: "/eosim" },
    { name: "eOffice Suite", href: "/eoffice" },
    { name: "eBrowser", href: "/ebrowser" },
    { name: "eDB", href: "/edb" },
    { name: "eServiceApps", href: "/eserviceapps" },
  ],
  Resources: [
    { name: "All Resources", href: "/resources" },
    { name: "Documentation", href: "/docs" },
    { name: "Getting Started", href: "/getting-started" },
    { name: "API Reference", href: "/api-docs" },
    { name: "Books", href: "/books" },
    { name: "Downloads", href: "/downloads" },
    { name: "Changelog", href: "/changelog" },
    { name: "FAQ", href: "/faq" },
  ],
  "Join & Support": [
    { name: "Get Involved", href: "/get-involved" },
    { name: "Community", href: "/community" },
    { name: "Careers", href: "/careers" },
    { name: "Partners", href: "/partners" },
    { name: "Donate", href: "/donate" },
    { name: "Fundraising", href: "/fundraising" },
    // Membership and Sponsors live one click away on /donate, which names
    // both paths. The two slots they free carry the contribution links e2e
    // pins to the footer; the rest of COMMUNITY_LINKS lives on /community.
    ...FOOTER_COMMUNITY_LINKS.map(link => ({ ...link, external: true })),
  ],
};

/**
 * Policy pages, kept out of the columns above and shown in the bottom bar.
 *
 * `/licenses`, `/security` and `/code-of-conduct` were reachable from body copy
 * only. Legal and policy links are conventionally in the bottom bar, which is
 * where a reader looks for them.
 */
const LEGAL_LINKS = [
  { name: "Privacy", href: "/privacy" },
  { name: "Terms", href: "/terms" },
  { name: "Licenses", href: "/licenses" },
  { name: "Security", href: "/security" },
  { name: "Code of Conduct", href: "/code-of-conduct" },
];

const SOCIAL_LINKS = [
  {
    icon: Github,
    href: SOCIAL_URLS.github,
    label: "GitHub",
    color: "#FFFFFF",
  },
  {
    icon: Twitter,
    href: SOCIAL_URLS.x,
    label: "X / Twitter",
    color: "#1DA1F2",
  },
  {
    icon: Linkedin,
    href: SOCIAL_URLS.linkedin,
    label: "LinkedIn",
    color: "#0A66C2",
  },
  {
    icon: Youtube,
    href: SOCIAL_URLS.youtube,
    label: "YouTube",
    color: "#FF0000",
  },
  {
    icon: Instagram,
    href: SOCIAL_URLS.instagram,
    label: "Instagram",
    color: "#E4405F",
  },
  {
    icon: Facebook,
    href: SOCIAL_URLS.facebook,
    label: "Facebook",
    color: "#1877F2",
  },
  {
    icon: MessageCircle,
    href: SOCIAL_URLS.discord,
    label: "Discord",
    color: "#5865F2",
  },
  {
    icon: Mail,
    onClick: () => openContactForm({ topic: "contact" }),
    label: "Email",
    color: "#F97316",
  },
];

function FooterLink({
  link,
}: {
  link: { name: string; href: string; external?: boolean };
}) {
  // py-1.5 on small screens lifts each link from a 20px to a ~32px touch
  // target without changing the desktop footer's density. min-w-6 (24px) does
  // the same for width: most labels are already wider, so it only affects the
  // handful ("eAI", "eNI") whose text alone is narrower than the 24px floor.
  const cls =
    "group relative inline-flex items-center gap-1 py-1.5 sm:py-0 min-w-6 text-[13px] text-[#a1a1a6] hover:text-[#f5f5f7] transition-colors duration-200";
  const inner = (
    <>
      {link.name}
      {(link as { external?: boolean }).external && (
        <ExternalLink
          size={10}
          className="opacity-0 group-hover:opacity-60 transition-opacity"
        />
      )}
      {/* Underline slide */}
      <span className="absolute -bottom-0.5 left-0 h-px w-0 group-hover:w-full bg-[#f5f5f7]/40 transition-all duration-200" />
    </>
  );

  if ((link as { external?: boolean }).external) {
    return (
      <a
        href={link.href}
        target={link.href.startsWith("mailto") ? undefined : "_blank"}
        rel={link.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
        className={cls}
      >
        {inner}
      </a>
    );
  }
  return (
    <Link href={link.href} className={cls}>
      {inner}
    </Link>
  );
}

/**
 * The footer's board-licence link, clicked on /eos-boards itself. wouter does
 * not scroll to a hash on the path already open, so the click would only change
 * the URL; scroll to the section instead. Its scroll-mt clears the fixed navbar.
 */
function toBoardLicence(event: MouseEvent<HTMLAnchorElement>) {
  if (window.location.pathname !== "/eos-boards") return;
  const target = document.getElementById("licence");
  if (!target) return;
  event.preventDefault();
  window.history.pushState(null, "", "/eos-boards#licence");
  target.scrollIntoView({ block: "start" });
}

export default function Footer() {
  return (
    <footer
      className="relative border-t border-[#232326] overflow-hidden bg-black"
      role="contentinfo"
    >
      {/* phones: the bottom row clears the assistant button (56px, 24px from the corner) */}
      <div className="max-w-[1200px] mx-auto px-[clamp(16px,4vw,44px)] pt-[72px] pb-28 sm:pb-10 relative">
        {/* At xl, the brand and all six link groups share one row. Below xl,
            the existing responsive spans keep the denser columns readable. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-[2fr_repeat(6,minmax(0,1fr))] gap-x-8 xl:gap-x-6 gap-y-10">
          {/* Brand */}
          <div
            data-footer-section="Brand"
            className="sm:col-span-2 md:col-span-3 lg:col-span-2 xl:col-span-1"
          >
            <Link href="/" className="flex items-center gap-3 mb-5 group w-fit">
              <div className="relative">
                <img
                  loading="lazy"
                  decoding="async"
                  src={LOGO_MARK}
                  width={40}
                  height={40}
                  alt={FOUNDATION.shortName}
                  className="w-8 h-8 rounded-lg"
                />
                <div
                  className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ boxShadow: "0 0 16px #F9731640" }}
                />
              </div>
              <div>
                <div className="font-heading font-semibold text-[#f5f5f7] text-[15px] tracking-[-0.01em]">
                  EmbeddedOS
                </div>
                <div className="text-[10px] text-[#a1a1a6] font-medium tracking-[0.08em] uppercase">
                  {FOUNDATION.taxStatus}
                </div>
              </div>
            </Link>

            <p className="text-[13px] text-[#a1a1a6] leading-relaxed mb-4 max-w-xs">
              Built by embedded engineers, for any embedded hardware. Every
              design decision prioritizes reliability, security, and developer
              experience.
            </p>

            <p className="text-xs text-[#a1a1a6] mb-2 max-w-xs leading-relaxed">
              {FOUNDATION.legalName}
              <br />
              {FOUNDATION.softwareLicense} (software) ·{" "}
              <a
                href={FOUNDATION.website}
                target="_blank"
                rel="noopener noreferrer"
                /* The footer's link style (grey, hairline underline), as the
                   address link below; #A1A1A6 is 8.2:1 on black. */
                className="underline decoration-[#3a3a3e] underline-offset-4 hover:text-[#f5f5f7] transition-colors"
              >
                {WEBSITE_HOST}
              </a>
            </p>

            <address className="text-xs text-[#a1a1a6] mb-2 max-w-xs not-italic leading-relaxed">
              {formatMailingAddress(MAILING_ADDRESS)}
            </address>
            {/*
              A published, crawler-visible mailbox. The contact form stays the
              primary path, but reviewers and crawlers need a verifiable
              address — see F-03.
            */}
            <a
              href={`mailto:${CONTACT_EMAILS.contact}`}
              className="text-xs text-[#a1a1a6] underline decoration-[#3a3a3e] underline-offset-4 hover:text-[#f5f5f7] transition-colors mb-6 inline-block"
            >
              {CONTACT_EMAILS.contact}
            </a>

            {/* Social icons */}
            <div className="flex items-center flex-wrap gap-2">
              {SOCIAL_LINKS.map(
                ({ icon: Icon, href, onClick, label, color }) => {
                  const className =
                    "group w-9 h-9 flex items-center justify-center rounded-full border border-[#232326] hover:border-[#3a3a3e] text-[#a1a1a6] hover:text-[#f5f5f7] transition-colors duration-200";
                  const iconEl = (
                    <Icon
                      size={15}
                      className="transition-transform duration-200 group-hover:scale-110"
                    />
                  );
                  return href ? (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className={className}
                      style={{ "--hover-color": color } as React.CSSProperties}
                    >
                      {iconEl}
                    </a>
                  ) : (
                    <button
                      key={label}
                      type="button"
                      onClick={onClick}
                      aria-label={label}
                      className={className}
                      style={{ "--hover-color": color } as React.CSSProperties}
                    >
                      {iconEl}
                    </button>
                  );
                }
              )}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section} data-footer-section={section}>
              {/* h2, not h3: the footer is a top-level landmark, and pages
                  whose body has no h2 (e.g. /faq, whose questions are buttons)
                  would otherwise jump h1 -> h3, which is a WCAG heading-order
                  violation. h2 is correct on every page and skips nothing. */}
              {/* F-32: text-white/30 was 2.5:1 — section headings need 4.5:1.
                  #F5F5F7 on the black footer is 19:1. */}
              <h2 className="text-[12px] font-semibold text-[#f5f5f7] mb-3">
                {section}
              </h2>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link.name}>
                    <FooterLink link={link} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Hairline divider */}
        <div className="mt-[52px] mb-[22px] h-px bg-[#232326]" />

        {/* Bottom bar. Two rows rather than three columns: the policy links
            outgrew a single row when Licenses, Security and Code of Conduct
            joined Privacy and Terms, and squeezed the tagline into a three-line
            wrap between them. */}
        {/* F-32: text-white/25 was 2.1:1 on the footer background. */}
        <div className="flex flex-col gap-4 text-xs text-[#a1a1a6]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-center sm:text-left">
              © 2018–2026 {FOUNDATION.legalName}.
              <span className="mx-1.5 text-[#3a3a3e]">·</span>
              <a
                href="https://spdx.org/licenses/MIT.html"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#f5f5f7] transition-colors"
              >
                {FOUNDATION.softwareLicense} (software)
              </a>
              <span className="mx-1.5 text-[#3a3a3e]">·</span>
              <Link
                href="/eos-boards#licence"
                onClick={toBoardLicence}
                className="hover:text-[#f5f5f7] transition-colors"
              >
                EoS board designs: all rights reserved
              </Link>
              <span className="mx-1.5 text-[#3a3a3e]">·</span>
              {FOUNDATION.taxStatus}
              <span className="mx-1.5 text-[#3a3a3e]">·</span>
              EIN {FOUNDATION.ein}
            </div>

            <div className="flex items-center flex-wrap justify-center gap-x-4 gap-y-1">
              {LEGAL_LINKS.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="py-1 whitespace-nowrap hover:text-[#f5f5f7] transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[#a1a1a6]">
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              Made with
              <Heart size={11} className="text-[#a1a1a6]" />
              for the embedded community
            </div>
            <a
              href="https://www.interserver.net"
              target="_blank"
              rel="noopener noreferrer"
              className="whitespace-nowrap hover:text-[#f5f5f7] transition-colors"
            >
              Powered by InterServer
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
