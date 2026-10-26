import { Link } from "wouter";
import { BpPage, PageHero, Section } from "@/components/bp";
import "./NotFound.css";

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
    <BpPage className="nf">
      <PageHero label="404 — PAGE NOT FOUND" title="404">
        <h2 className="sub">We could not find that page</h2>
        <p className="lead">
          The address may have been mistyped, or the page may have been moved or
          retired since it was linked. Nothing has been lost — everything the
          Foundation publishes is still reachable from the routes below.
        </p>
        <div id="not-found-button-group" className="ctas">
          <Link href="/" className="btn pri">
            Back to the homepage
          </Link>
          <Link href="/docs" className="btn gh">
            Search the documentation
          </Link>
        </div>
      </PageHero>

      <Section
        title="Where visitors usually mean to go"
        headingLevel={3}
        className="nf-go"
      >
        <ul className="cards two">
          {DESTINATIONS.map(d => (
            <li key={d.href}>
              <Link href={d.href} className="card">
                <span className="nf-t">{d.label}</span>
                <p>{d.desc}</p>
              </Link>
            </li>
          ))}
        </ul>
        <p className="fine nf-fine">
          If you followed a link from somewhere on this site and landed here,
          that is our mistake rather than yours — please tell us on the{" "}
          <Link href="/contact" className="tl">
            contact page
          </Link>{" "}
          so we can repair it.
        </p>
      </Section>
    </BpPage>
  );
}
