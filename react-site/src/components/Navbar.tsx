import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ChevronDown, Cpu } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  {
    label: "About",
    href: "/about",
    children: [
      { label: "Our Mission", href: "/about" },
      { label: "Organization", href: "/organization" },
      { label: "Vision", href: "/vision" },
    ],
  },
  { label: "Products", href: "/products" },
  { label: "Ecosystem", href: "/ecosystem" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [location] = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
  }, [location]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-black/95 backdrop-blur-xl border-b border-[rgba(201,168,76,0.15)] shadow-[0_4px_30px_rgba(0,0,0,0.8)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C9A84C] to-[#8B6914] flex items-center justify-center shadow-[0_0_20px_rgba(201,168,76,0.3)] group-hover:shadow-[0_0_30px_rgba(201,168,76,0.5)] transition-all duration-300">
                <Cpu size={16} className="text-black" />
              </div>
              <span className="font-['Playfair_Display'] font-bold text-lg text-white tracking-tight">
                Embedded<span className="text-gold-gradient">OS</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) =>
                link.children ? (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => setActiveDropdown(link.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <button className="nav-link flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg hover:bg-white/5 transition-colors">
                      {link.label}
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${activeDropdown === link.label ? "rotate-180" : ""}`}
                      />
                    </button>
                    {activeDropdown === link.label && (
                      <div className="absolute top-full left-0 mt-1 w-48 glass-card rounded-xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-[rgba(201,168,76,0.2)]">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block px-4 py-2.5 text-sm text-[#888] hover:text-white hover:bg-[rgba(201,168,76,0.08)] transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`nav-link px-3 py-2 text-sm font-medium rounded-lg hover:bg-white/5 transition-colors ${
                      location === link.href ? "active" : ""
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </div>

            {/* CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <a
                href="https://github.com/embeddedos-org"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline-gold px-4 py-2 text-sm font-medium rounded-lg"
              >
                GitHub
              </a>
              <Link href="/getting-started" className="btn-gold px-4 py-2 text-sm rounded-lg">
                Get Started
              </Link>
            </div>

            {/* Mobile toggle */}
            <button
              className="lg:hidden p-2 text-[#888] hover:text-white transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/98 backdrop-blur-xl flex flex-col pt-16">
          <div className="flex-1 overflow-y-auto px-6 py-8 space-y-1">
            {navLinks.map((link) => (
              <div key={link.label}>
                <Link
                  href={link.href}
                  className="block py-3 text-lg font-medium text-[#888] hover:text-white border-b border-[rgba(201,168,76,0.1)] transition-colors"
                >
                  {link.label}
                </Link>
                {link.children && (
                  <div className="pl-4 mt-1 space-y-1">
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block py-2 text-sm text-[#555] hover:text-[#C9A84C] transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="px-6 py-6 border-t border-[rgba(201,168,76,0.15)] flex gap-3">
            <a
              href="https://github.com/embeddedos-org"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline-gold flex-1 py-3 text-sm font-medium rounded-xl text-center"
            >
              GitHub
            </a>
            <Link href="/getting-started" className="btn-gold flex-1 py-3 text-sm rounded-xl text-center">
              Get Started
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
