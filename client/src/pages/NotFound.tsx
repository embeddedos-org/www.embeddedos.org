import { AlertCircle, ArrowRight, Home, Search } from "lucide-react";
import { Link } from "wouter";

/**
 * A 404 that helps rather than apologises.
 *
 * The previous version was scaffold boilerplate: a light-themed card on a site
 * that is dark everywhere else, offering a single "Go Home" button. A visitor
 * who mistypes a URL or follows a stale link needs somewhere to go, so the
 * page now lists the destinations people actually arrive looking for. That
 * also lifts it clear of the thin-content threshold in scripts/audit.mjs,
 * which it previously failed at 1146 characters.
 */
const DESTINATIONS = [
  {
    href: "/about",
    label: "About the Foundation",
    desc: "Who we are, what we build, and how the 501(c)(3) is structured.",
  },
  {
    href: "/getting-started",
    label: "Getting started",
    desc: "Install the toolchain and build your first image for a supported board.",
  },
  {
    href: "/docs",
    label: "Documentation",
    desc: "Guides, API references, and the technical books, all free to read.",
  },
  {
    href: "/projects",
    label: "Projects",
    desc: "The repositories that make up the platform, from kernel to tooling.",
  },
  {
    href: "/get-involved",
    label: "Get involved",
    desc: "Contribute code, documentation, hardware testing, or curriculum.",
  },
  {
    href: "/resources",
    label: "Resources",
    desc: "Pre-built firmware, datasheets, and reference designs to download.",
  },
  {
    href: "/faq",
    label: "FAQ",
    desc: "Licensing, supported hardware, and how the Foundation is funded.",
  },
  {
    href: "/contact",
    label: "Contact",
    desc: "Reach the Foundation directly, including our postal address and EIN.",
  },
];

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0A0E1A] text-white">
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-red-500/5" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium mb-6">
            <AlertCircle className="w-4 h-4" /> 404 — PAGE NOT FOUND
          </div>

          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-orange-300 bg-clip-text text-transparent">
            404
          </h1>

          <h2 className="text-xl font-semibold text-gray-200 mb-4">
            We could not find that page
          </h2>

          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            The address may have been mistyped, or the page may have been moved
            or retired since it was linked. Nothing has been lost — everything
            the Foundation publishes is still reachable from the routes below.
          </p>

          <div
            id="not-found-button-group"
            className="flex flex-col sm:flex-row gap-3 justify-center mt-8"
          >
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-medium transition-colors"
            >
              <Home className="w-4 h-4" />
              Back to the homepage
            </Link>
            <Link
              href="/docs"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium transition-colors"
            >
              <Search className="w-4 h-4" />
              Search the documentation
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white/40 mb-6 text-center">
            Where visitors usually mean to go
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DESTINATIONS.map(d => (
              <Link
                key={d.href}
                href={d.href}
                className="group bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 hover:border-white/20 transition-colors"
              >
                <div className="flex items-center justify-between gap-3 mb-1.5">
                  <span className="text-white font-semibold">{d.label}</span>
                  <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-orange-400 transition-colors shrink-0" />
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {d.desc}
                </p>
              </Link>
            ))}
          </div>

          <p className="text-sm text-gray-500 text-center mt-10 max-w-2xl mx-auto">
            If you followed a link from somewhere on this site and landed here,
            that is our mistake rather than yours — please tell us on the{" "}
            <Link
              href="/contact"
              // inline-block plus vertical padding keeps the tap target at least
              // 24px tall; as plain inline text it was ~20px, which
              // scripts/audit-mobile.mjs counts as too small to hit on a phone.
              className="inline-block py-1 text-orange-400 hover:text-orange-300 underline"
            >
              contact page
            </Link>{" "}
            so we can repair it.
          </p>
        </div>
      </section>
    </div>
  );
}
