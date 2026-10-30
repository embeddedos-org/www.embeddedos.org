/** @vitest-environment jsdom */

/**
 * The Foundation's registration identifiers: EIN, SAM.gov UEI and D-U-N-S.
 *
 * Funders and grant reviewers check these numbers against SAM.gov, Dun &
 * Bradstreet and the IRS, so each must read the same everywhere it appears.
 * Every page takes them from FOUNDATION; the structured data in index.html is
 * static, so it is compared with FOUNDATION here. The footer shows all three
 * on every page, with each label next to its own value.
 */
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import fs from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import Footer from "../../client/src/components/Footer";
import { FOUNDATION } from "../../client/src/data/foundation";

const root = path.resolve(__dirname, "../..");
const read = (file: string) => fs.readFileSync(path.join(root, file), "utf8");

afterEach(cleanup);

function registration(container: HTMLElement): HTMLElement {
  const list = container.querySelector<HTMLElement>(
    'dl[data-footer-section="Registration"]'
  );
  if (!list) throw new Error("footer has no Registration list");
  return list;
}

describe("registration identifiers", () => {
  it("are well-formed", () => {
    expect(FOUNDATION.ein).toMatch(/^\d{2}-\d{7}$/);
    // A UEI is 12 characters from digits and capitals without I and O.
    expect(FOUNDATION.uei).toMatch(/^[A-HJ-NP-Z0-9]{12}$/);
    expect(FOUNDATION.duns).toMatch(/^\d{2}-\d{3}-\d{4}$/);
  });

  it("match the NGO structured data in index.html", () => {
    const html = read("client/index.html");
    const blocks = [
      ...html.matchAll(
        /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g
      ),
    ].map(m => JSON.parse(m[1]));
    const ngo = blocks.find(b => b["@type"] === "NGO");
    expect(ngo).toBeDefined();
    expect(ngo.taxID).toBe(FOUNDATION.ein);
    expect(ngo.duns).toBe(FOUNDATION.duns.replace(/-/g, ""));
    expect(ngo.identifier).toEqual({
      "@type": "PropertyValue",
      propertyID: "SAM.gov UEI",
      value: FOUNDATION.uei,
    });
  });

  it("are listed on every page that lists the EIN in a registration table", () => {
    for (const page of [
      "client/src/pages/Transparency.tsx",
      "client/src/pages/Contact.tsx",
      "client/src/pages/PressKit.tsx",
      "client/src/pages/Organization.tsx",
    ]) {
      const source = read(page);
      expect(source, page).toContain("value: FOUNDATION.ein");
      expect(source, page).toContain("value: FOUNDATION.uei");
      expect(source, page).toContain("value: FOUNDATION.duns");
    }
  });
});

describe("footer bottom bar", () => {
  it("pairs each identifier with its own label", () => {
    const { container } = render(<Footer />);
    const list = registration(container);
    const pairs = within(list)
      .getAllByRole("term")
      .map(term => [
        term.textContent,
        term.nextElementSibling?.textContent ?? "",
      ]);
    expect(pairs).toEqual([
      ["Status", FOUNDATION.taxStatus],
      ["EIN", FOUNDATION.ein],
      ["SAM.gov UEI", FOUNDATION.uei],
      ["D-U-N-S", FOUNDATION.duns],
    ]);
  });

  it("keeps the policy links in one labelled list, each unbreakable", () => {
    render(<Footer />);
    const nav = screen.getByRole("navigation", { name: "Legal" });
    const links = within(nav).getAllByRole("link");
    expect(links.map(a => a.textContent)).toEqual([
      "Privacy",
      "Terms",
      "Licenses",
      "Security",
      "Code of Conduct",
    ]);
    for (const a of links) expect(a).toHaveClass("whitespace-nowrap");
  });

  it("never lets a licence or registration item break inside itself", () => {
    const { container } = render(<Footer />);
    expect(
      screen.getByRole("link", {
        name: `${FOUNDATION.softwareLicense} (software)`,
      })
    ).toHaveClass("whitespace-nowrap");
    expect(
      screen.getByRole("link", {
        name: "EoS board designs: all rights reserved",
      })
    ).toHaveClass("whitespace-nowrap");
    const list = registration(container);
    for (const term of within(list).getAllByRole("term"))
      expect(term.parentElement).toHaveClass("whitespace-nowrap");
  });
});
