import { Link } from "wouter";
import { Github, Twitter, Youtube, Mail, Heart, Linkedin, Facebook, ExternalLink } from "lucide-react";

const LOGO_MARK = "/manus-storage/embeddedos-logo-mark_bc053888.png";

const FOOTER_LINKS = {
  Foundation: [
    { name: "About", href: "/about" },
    { name: "Contact", href: "mailto:hello@embeddedos.org", external: true },
    { name: "Donate", href: "/donate" },
    { name: "Membership", href: "/membership" },
    { name: "Ecosystem", href: "/projects" },
    { name: "Research", href: "/docs" },
    { name: "Documentation", href: "/docs" },
    { name: "News", href: "/news" },
  ],
  Projects: [
    { name: "All Projects", href: "/projects" },
    { name: "EoS Kernel", href: "https://github.com/embeddedos-org/EoS", external: true },
    { name: "eBoot", href: "https://github.com/embeddedos-org/eBoot", external: true },
    { name: "eAI", href: "https://github.com/embeddedos-org/eAI", external: true },
    { name: "AeroSwift", href: "/aerospace" },
    { name: "GitHub Org", href: "https://github.com/embeddedos-org", external: true },
  ],
  Applications: [
    { name: "EoStudio IDE", href: "/eostudio" },
    { name: "EoSim Simulator", href: "/eosim" },
    { name: "eOffice Suite", href: "/eoffice" },
    { name: "eBrowser", href: "/ebrowser" },
    { name: "eDB", href: "/edb" },
    { name: "eFlow", href: "/eflow" },
    { name: "All Apps", href: "/eapps" },
  ],
  Resources: [
    { name: "Getting Started", href: "/getting-started" },
    { name: "API Reference", href: "/api-docs" },
    { name: "Books (14)", href: "/books" },
    { name: "Hardware Lab", href: "/hardware-lab" },
    { name: "Stacks", href: "/stacks" },
    { name: "Kids Edition", href: "/kids" },
    { name: "Get Involved", href: "/get-involved" },
  ],
};

const SOCIAL_LINKS = [
  { icon: Github,   href: "https://github.com/embeddedos-org", label: "GitHub", color: "#FFFFFF" },
  { icon: Twitter,  href: "https://x.com/EmbeddedOS_ORG", label: "X / Twitter", color: "#1DA1F2" },
  { icon: Linkedin, href: "https://www.linkedin.com/company/embedded-operating-systems-research-foundation", label: "LinkedIn", color: "#0A66C2" },
  { icon: Youtube,  href: "https://www.youtube.com/@EmbeddedOS_ORG", label: "YouTube", color: "#FF0000" },
  { icon: Facebook, href: "https://www.facebook.com/profile.php?id=61588978691494", label: "Facebook", color: "#1877F2" },
  { icon: Mail,     href: "mailto:hello@embeddedos.org", label: "Email", color: "#F97316" },
];

function FooterLink({ link }: { link: { name: string; href: string; external?: boolean } }) {
  const cls = "group relative inline-flex items-center gap-1 text-sm text-white/50 hover:text-white transition-colors duration-200";
  const inner = (
    <>
      {link.name}
      {(link as { external?: boolean }).external && (
        <ExternalLink size={10} className="opacity-0 group-hover:opacity-60 transition-opacity" />
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
  return <Link href={link.href} className={cls}>{inner}</Link>;
}

export default function Footer() {
  return (
    <footer
      className="relative border-t border-white/[0.06] overflow-hidden"
      style={{ background: "linear-gradient(180deg, #080F1E 0%, #020617 100%)" }}
      role="contentinfo"
    >
      {/* Subtle top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-px bg-gradient-to-r from-transparent via-[#F97316]/30 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-16 bg-[#F97316]/4 blur-[40px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-5 group w-fit">
              <div className="relative">
                <img src={LOGO_MARK} alt="EmbeddedOS" className="w-10 h-10 rounded-xl" />
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ boxShadow: "0 0 16px #F9731640" }} />
              </div>
              <div>
                <div className="font-heading font-bold text-white text-base">EmbeddedOS</div>
                <div className="text-[10px] text-[#F97316] font-bold tracking-[0.15em] uppercase">Foundation · 501(c)(3) · 509(a)(2)</div>
              </div>
            </Link>

            <p className="text-sm text-white/45 leading-relaxed mb-4 max-w-xs">
              Built by embedded engineers, for any embedded hardware. Every design decision prioritizes reliability, security, and developer experience.
            </p>

            <p className="text-xs text-white/25 mb-6 max-w-xs leading-relaxed">
              Embedded Operating Systems Research Foundation<br />
              501(c)(3) · 509(a)(2) · MIT License ·{" "}
              <a href="https://www.embeddedos.org/" target="_blank" rel="noopener noreferrer" className="text-[#F97316]/70 hover:text-[#F97316] transition-colors">
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
                  rel={href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                  aria-label={label}
                  className="group w-9 h-9 flex items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] text-white/40 hover:text-white transition-all duration-200"
                  style={{ "--hover-color": color } as React.CSSProperties}
                >
                  <Icon size={15} className="transition-transform duration-200 group-hover:scale-110" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h3 className="text-[10px] font-extrabold text-white/30 uppercase tracking-[0.18em] mb-5">
                {section}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
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

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/25">
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
            501(c)(3) · 509(a)(2)
          </div>

          <div className="flex items-center gap-1.5 text-white/30">
            Made with{" "}
            <Heart size={11} className="text-[#F97316] mx-0.5 animate-pulse" />
            {" "}for the embedded community
          </div>

          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-white/50 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white/50 transition-colors">Terms</Link>
            <a href="https://github.com/embeddedos-org" target="_blank" rel="noopener noreferrer" className="hover:text-white/50 transition-colors">GitHub</a>
            <a href="https://www.interserver.net" target="_blank" rel="noopener noreferrer" className="hover:text-white/50 transition-colors">Powered by InterServer</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
