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
  ExternalLink,
} from "lucide-react";
import { SOCIAL_URLS } from "@/data/foundation";

const LOGO_MARK = "/manus-storage/embeddedos-logo-mark_bc053888.jpg";

/**
 * The footer is the site's organisational map; the header is its product menu.
 *
 * The two used to be near-duplicates — 16 routes appeared in both, and the
 * header's "Community" menu carried About, Mission, Transparency, Careers and
 * Patents, none of which a visitor browsing the software is looking for. The
 * institutional pages now live here only, and the header keeps the builder's
 * journey: Projects, Products, Docs, Community.
 *
 * Every internal route should still be reachable from this footer. Pages linked
 * only from body copy on another page are one edit away from being orphaned,
 * and `/docs`, `/security`, `/licenses`, `/roadmap`, `/research` and `/demo`
 * had already reached that state — present in the router, absent from both
 * menus. tests/unit/navigation.test.ts fails when a new route is added without
 * a home in one of these columns.
 */
const FOOTER_LINKS = {
  Foundation: [
    { name: "About", href: "/about" },
    { name: "Mission & Scope", href: "/mission" },
    { name: "Our Vision", href: "/vision" },
    { name: "What We Do", href: "/what-we-do" },
    { name: "Organization", href: "/organization" },
    { name: "Industries", href: "/industries" },
    { name: "Transparency", href: "/transparency" },
    { name: "Research", href: "/research" },
    { name: "Future Research", href: "/future-research" },
    { name: "Patents", href: "/patents" },
    { name: "News", href: "/news" },
  ],
  "Join & Support": [
    { name: "Careers", href: "/careers" },
    { name: "Internships", href: "/internship" },
    { name: "Get Involved", href: "/get-involved" },
    { name: "Membership", href: "/membership" },
    { name: "Community", href: "/community" },
    { name: "Events", href: "/events" },
    { name: "Partners", href: "/partners" },
    { name: "Sponsors", href: "/sponsors" },
    { name: "Donate", href: "/donate" },
    { name: "Fundraising", href: "/fundraising" },
    { name: "Contact", href: "/contact" },
  ],
  Platform: [
    // "All Products" is the hub for the 13 /product-* detail pages, which are
    // linked from it rather than listed here; see tests/unit/navigation.test.ts.
    { name: "All Products", href: "/products" },
    { name: "All Projects", href: "/projects" },
    { name: "EoS Kernel", href: "/eos" },
    { name: "eBoot", href: "/eboot" },
    { name: "eIPC", href: "/eipc" },
    { name: "eAI", href: "/eai" },
    { name: "eAI Edge", href: "/eai-edge" },
    { name: "eNI", href: "/eni" },
    { name: "Neural Link AI", href: "/neural-link-ai" },
    { name: "eBuild", href: "/ebuild" },
    { name: "Architecture", href: "/architecture" },
    { name: "Ecosystem", href: "/ecosystem" },
    { name: "Stacks", href: "/stacks" },
    { name: "Quantum (eQC)", href: "/quantum" },
    { name: "eCAD Hardware", href: "/ecad-hardware" },
    { name: "AeroSwift", href: "/aerospace" },
    { name: "Health Devices", href: "/health" },
    { name: "Compare Health", href: "/health-compare" },
    {
      name: "GitHub Org",
      href: "https://github.com/embeddedos-org",
      external: true,
    },
  ],
  Applications: [
    { name: "EoSuite", href: "/eosuite" },
    { name: "EoStudio IDE", href: "/eostudio" },
    { name: "EoSim Simulator", href: "/eosim" },
    { name: "eOffice Suite", href: "/eoffice" },
    { name: "eBrowser", href: "/ebrowser" },
    { name: "eDB", href: "/edb" },
    { name: "eFlow", href: "/eflow" },
    // /flow is the older visual-programming page; /eflow is the product page.
    // Both are routed, so both are listed rather than leaving one orphaned.
    { name: "Flow Editor", href: "/flow" },
    { name: "eServiceApps", href: "/eserviceapps" },
    { name: "eRadar360", href: "/eradar360" },
    { name: "eHealth365", href: "/ehealth365" },
    { name: "All Apps", href: "/eapps" },
  ],
  Resources: [
    { name: "Documentation", href: "/docs" },
    { name: "Getting Started", href: "/getting-started" },
    { name: "API Reference", href: "/api-docs" },
    { name: "Books", href: "/books" },
    { name: "Downloads", href: "/downloads" },
    { name: "Live Demo", href: "/demo" },
    { name: "Hardware Lab", href: "/hardware-lab" },
    { name: "Kids Edition", href: "/kids" },
    { name: "Building an OS", href: "/building-os" },
    { name: "AI OS", href: "/ai-os" },
    { name: "Certification", href: "/certification" },
    { name: "Roadmap", href: "/roadmap" },
    { name: "Changelog", href: "/changelog" },
    { name: "FAQ", href: "/faq" },
    { name: "All Resources", href: "/resources" },
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
    icon: Mail,
    href: "mailto:hello@embeddedos.org",
    label: "Email",
    color: "#F97316",
  },
];

function FooterLink({
  link,
}: {
  link: { name: string; href: string; external?: boolean };
}) {
  // py-1.5 on small screens lifts each link from a 20px to a ~32px touch target
  // without changing the desktop footer's density.
  const cls =
    "group relative inline-flex items-center gap-1 py-1.5 sm:py-0 text-sm text-white/50 hover:text-white transition-colors duration-200";
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
      <span className="absolute -bottom-0.5 left-0 h-px w-0 group-hover:w-full bg-[#F97316]/60 transition-all duration-200" />
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

export default function Footer() {
  return (
    <footer
      className="relative border-t border-white/[0.06] overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #080F1E 0%, #020617 100%)",
      }}
      role="contentinfo"
    >
      {/* Subtle top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-px bg-gradient-to-r from-transparent via-[#F97316]/30 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-16 bg-[#F97316]/4 blur-[40px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        {/* Seven tracks: two for the brand block, one for each of the five link
            columns. The brand needs the extra width for its description; the
            link columns hold short labels and wrap acceptably when narrow. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-x-8 gap-y-10">
          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-3 lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-5 group w-fit">
              <div className="relative">
                <img
                  loading="lazy"
                  decoding="async"
                  src={LOGO_MARK}
                  alt="EmbeddedOS"
                  className="w-10 h-10 rounded-xl"
                />
                <div
                  className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ boxShadow: "0 0 16px #F9731640" }}
                />
              </div>
              <div>
                <div className="font-heading font-bold text-white text-base">
                  EmbeddedOS
                </div>
                <div className="text-[10px] text-[#F97316] font-bold tracking-[0.15em] uppercase">
                  Foundation · 501(c)(3)
                </div>
              </div>
            </Link>

            <p className="text-sm text-white/45 leading-relaxed mb-4 max-w-xs">
              Built by embedded engineers, for any embedded hardware. Every
              design decision prioritizes reliability, security, and developer
              experience.
            </p>

            <p className="text-xs text-white/25 mb-6 max-w-xs leading-relaxed">
              Embedded Operating Systems Research Foundation
              <br />
              501(c)(3) · MIT License ·{" "}
              <a
                href="https://www.embeddedos.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#F97316]/70 hover:text-[#F97316] transition-colors"
              >
                www.embeddedos.org
              </a>
            </p>

            {/* Social icons */}
            <div className="flex items-center flex-wrap gap-2">
              {SOCIAL_LINKS.map(({ icon: Icon, href, label, color }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("mailto") ? undefined : "_blank"}
                  rel={
                    href.startsWith("mailto")
                      ? undefined
                      : "noopener noreferrer"
                  }
                  aria-label={label}
                  className="group w-9 h-9 flex items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] text-white/40 hover:text-white transition-all duration-200"
                  style={{ "--hover-color": color } as React.CSSProperties}
                >
                  <Icon
                    size={15}
                    className="transition-transform duration-200 group-hover:scale-110"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              {/* h2, not h3: the footer is a top-level landmark, and pages
                  whose body has no h2 (e.g. /faq, whose questions are buttons)
                  would otherwise jump h1 -> h3, which is a WCAG heading-order
                  violation. h2 is correct on every page and skips nothing. */}
              <h2 className="text-[10px] font-extrabold text-white/30 uppercase tracking-[0.18em] mb-5">
                {section}
              </h2>
              <ul className="space-y-3">
                {links.map(link => (
                  <li key={link.name}>
                    <FooterLink link={link} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Gradient divider */}
        <div className="my-10 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Bottom bar. Two rows rather than three columns: the policy links
            outgrew a single row when Licenses, Security and Code of Conduct
            joined Privacy and Terms, and squeezed the tagline into a three-line
            wrap between them. */}
        <div className="flex flex-col gap-4 text-xs text-white/25">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-center sm:text-left">
              © 2018–2026 Embedded Operating Systems Research Foundation.
              <span className="mx-1.5 text-white/15">·</span>
              <a
                href="https://opensource.org/licenses/MIT"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white/50 transition-colors"
              >
                MIT License
              </a>
              <span className="mx-1.5 text-white/15">·</span>
              501(c)(3)
            </div>

            <div className="flex items-center flex-wrap justify-center gap-x-4 gap-y-1">
              {LEGAL_LINKS.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="py-1 whitespace-nowrap hover:text-white/50 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-white/20">
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              Made with
              <Heart size={11} className="text-[#F97316] animate-pulse" />
              for the embedded community
            </div>
            <a
              href="https://www.interserver.net"
              target="_blank"
              rel="noopener noreferrer"
              className="whitespace-nowrap hover:text-white/50 transition-colors"
            >
              Powered by InterServer
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
