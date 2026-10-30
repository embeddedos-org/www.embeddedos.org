/** @vitest-environment jsdom */

/**
 * The Foundation's registration identifiers: EIN, SAM.gov UEI and D-U-N-S.
 *
 * Funders and grant reviewers check these numbers against SAM.gov, Dun &
 * Bradstreet and the IRS, so each must read the same wherever it appears, next
 * to its own label. Pages take them from FOUNDATION; the structured data in
 * index.html is checked in foundation-facts.test.ts. The bottom bar's layout
 * (one row of policy links, nothing breaking inside itself) is a rendering
 * question, so e2e/ui-ux.spec.ts checks it in a real browser.
 */
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import type { ComponentType } from "react";
import { afterEach, describe, expect, it } from "vitest";
import Footer from "../../client/src/components/Footer";
import { FOUNDATION } from "../../client/src/data/foundation";
import Contact from "../../client/src/pages/Contact";
import Organization from "../../client/src/pages/Organization";
import PressKit from "../../client/src/pages/PressKit";
import Transparency from "../../client/src/pages/Transparency";

afterEach(cleanup);

/** Every dt/dd pair under `root`, in document order. */
function pairs(root: HTMLElement): [string, string][] {
  return [...root.querySelectorAll("dt")].map(term => [
    term.textContent ?? "",
    term.nextElementSibling?.textContent ?? "",
  ]);
}

describe("registration identifiers", () => {
  it("are well-formed", () => {
    expect(FOUNDATION.ein).toMatch(/^\d{2}-\d{7}$/);
    // 12 characters from digits and capitals without I and O; never a leading 0.
    expect(FOUNDATION.uei).toMatch(/^[A-HJ-NP-Z1-9][A-HJ-NP-Z0-9]{11}$/);
    expect(FOUNDATION.duns).toMatch(/^\d{2}-\d{3}-\d{4}$/);
  });

  const PAGES: [string, ComponentType][] = [
    ["/transparency", Transparency],
    ["/contact", Contact],
    ["/organization", Organization],
    ["/press-kit", PressKit],
  ];

  it.each(PAGES)(
    "%s lists the UEI and the D-U-N-S number right after the EIN",
    (_route, Page) => {
      const { container } = render(<Page />);
      const rows = pairs(container);
      const ein = rows.findIndex(([, value]) => value === FOUNDATION.ein);
      expect(ein, JSON.stringify(rows)).toBeGreaterThanOrEqual(0);
      expect(rows[ein][0]).toMatch(/\bEIN\b/);
      const [ueiLabel, ueiValue] = rows[ein + 1];
      expect(ueiLabel).toMatch(/^SAM\.gov (UEI|Unique Entity ID \(UEI\))$/);
      expect(ueiValue).toBe(FOUNDATION.uei);
      const [dunsLabel, dunsValue] = rows[ein + 2];
      expect(dunsLabel).toMatch(/^D-U-N-S( Number)?$/);
      expect(dunsValue).toBe(FOUNDATION.duns);
    }
  );
});

describe("footer bottom bar", () => {
  it("pairs each identifier with its own label", () => {
    const { container } = render(<Footer />);
    const list = container.querySelector<HTMLElement>(
      "dl[data-footer-registration]"
    );
    expect(list).not.toBeNull();
    expect(pairs(list!)).toEqual([
      ["Status", FOUNDATION.taxStatus],
      ["EIN", FOUNDATION.ein],
      ["SAM.gov UEI", FOUNDATION.uei],
      ["D-U-N-S", FOUNDATION.duns],
    ]);
  });

  it("reads the copyright as one sentence, with a space after the year", () => {
    const { container } = render(<Footer />);
    const name = container.querySelector("[data-footer-legal-name]");
    expect(name?.parentElement?.textContent).toBe(
      `© 2018–2026 ${FOUNDATION.legalName}`
    );
  });

  it("keeps the policy links in one labelled list, in order", () => {
    render(<Footer />);
    const nav = screen.getByRole("navigation", { name: "Legal" });
    expect(
      within(nav)
        .getAllByRole("link")
        .map(a => [a.textContent, a.getAttribute("href")])
    ).toEqual([
      ["Privacy", "/privacy"],
      ["Terms", "/terms"],
      ["Licenses", "/licenses"],
      ["Security", "/security"],
      ["Code of Conduct", "/code-of-conduct"],
    ]);
  });

  it("does not count the registration list as a link column", () => {
    // e2e/ui-ux.spec.ts lines the footer's link columns up by
    // [data-footer-section]; the bottom bar must not join them.
    const { container } = render(<Footer />);
    const sections = [
      ...container.querySelectorAll("[data-footer-section]"),
    ].map(el => el.getAttribute("data-footer-section"));
    expect(sections).toEqual([
      "Brand",
      "Foundation",
      "News & Stories",
      "Platform",
      "Applications",
      "Resources",
      "Join & Support",
    ]);
  });
});
