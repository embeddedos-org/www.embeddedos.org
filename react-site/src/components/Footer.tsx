import { Link } from "wouter";
import { Cpu, ExternalLink, MessageCircle, Play, BookOpen } from "lucide-react";

const footerLinks = {
  Products: [
    { label: "EoS Kernel", href: "/products/eos" },
    { label: "EAI Runtime", href: "/products/eai" },
    { label: "eBuild SDK", href: "/products/ebuild" },
    { label: "eDB Database", href: "/products/edb" },
    { label: "EoStudio IDE", href: "/products/eostudio" },
    { label: "All Products", href: "/products" },
  ],
  Developers: [
    { label: "Getting Started", href: "/getting-started" },
    { label: "Documentation", href: "/docs" },
    { label: "Hardware Lab", href: "/hardware-lab" },
    { label: "eApps Store", href: "/eapps" },
    { label: "Ecosystem Map", href: "/ecosystem" },
    { label: "Roadmap", href: "/roadmap" },
  ],
  Organization: [
    { label: "About Us", href: "/about" },
    { label: "Vision", href: "/vision" },
    { label: "Careers", href: "/careers" },
    { label: "Donate", href: "/donate" },
    { label: "Sponsors", href: "/sponsors" },
    { label: "Contact", href: "/contact" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Use", href: "/terms" },
    { label: "Licenses", href: "/licenses" },
    { label: "Security", href: "/security" },
  ],
};

const socials = [
  { icon: ExternalLink, href: "https://github.com/embeddedos-org", label: "GitHub" },
  { icon: MessageCircle, href: "https://twitter.com/embeddedos", label: "Twitter" },
  { icon: Play, href: "https://youtube.com/@embeddedos", label: "YouTube" },
  { icon: BookOpen, href: "/docs", label: "Docs" },
];

export default function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-[rgba(201,168,76,0.12)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Top */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-16">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4 group w-fit">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C9A84C] to-[#8B6914] flex items-center justify-center">
                <Cpu size={16} className="text-black" />
              </div>
              <span className="font-['Playfair_Display'] font-bold text-lg text-white">
                Embedded<span className="text-gold-gradient">OS</span>
              </span>
            </Link>
            <p className="text-[#555] text-sm leading-relaxed mb-6 max-w-xs">
              An open-source, modular embedded operating system for every device — from MCUs to Linux-capable SoCs.
            </p>
            <div className="flex items-center gap-3">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg border border-[rgba(201,168,76,0.15)] flex items-center justify-center text-[#555] hover:text-[#C9A84C] hover:border-[rgba(201,168,76,0.4)] transition-all duration-200"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-[#C9A84C] mb-4">{section}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#555] hover:text-[#C9A84C] transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="section-divider mb-8" />

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#444] text-sm">
            © {new Date().getFullYear()} EmbeddedOS Foundation. Open-source under{" "}
            <a href="/licenses" className="text-[#C9A84C] hover:underline">
              Apache 2.0 & MIT
            </a>
            .
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C9A84C] animate-pulse" />
            <span className="text-[#444] text-xs">Production-ready · ARM Cortex-M · RISC-V · Linux</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
