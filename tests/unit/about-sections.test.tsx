/** @vitest-environment jsdom */

/**
 * AboutSections rendering (F-01, F-11).
 *
 * The fourteen empty content categories and the nine planned programmes get
 * their long-form content through this component. These tests fail if the
 * sections stop rendering: the headings must appear as h3s under a single
 * h2 title, and every paragraph must be in the document.
 */
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import AboutSections from "../../client/src/components/AboutSections";
import { CATEGORY_ABOUT } from "../../client/src/data/category-about";
import { PROGRAMME_DETAILS } from "../../client/src/data/programme-details";

afterEach(() => {
  cleanup();
});

describe("AboutSections", () => {
  it("renders a category's six sections with their paragraphs", () => {
    const sections = CATEGORY_ABOUT["/press-releases"];
    render(<AboutSections title="About Press Releases" sections={sections} />);

    expect(
      screen.getByRole("heading", { level: 2, name: "About Press Releases" })
    ).toBeInTheDocument();
    const h3s = screen.getAllByRole("heading", { level: 3 });
    expect(h3s).toHaveLength(sections.length);
    expect(h3s.map(h => h.textContent)).toEqual(sections.map(s => s.heading));
    for (const s of sections) {
      for (const p of s.body) {
        expect(screen.getByText(p)).toBeInTheDocument();
      }
    }
  });

  it("renders a programme's detail sections", () => {
    const sections = PROGRAMME_DETAILS["grants"];
    render(<AboutSections title="About this programme" sections={sections} />);

    expect(
      screen.getByRole("heading", { level: 2, name: "About this programme" })
    ).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(
      sections.length
    );
  });
});
