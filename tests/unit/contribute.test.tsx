/** @vitest-environment jsdom */

/**
 * /contribute promises three things that can silently drift:
 *  - the template it shows is the template GitHub uses (a copy is kept in
 *    client/src/data/contribute.ts because the dev server denies dotfiles);
 *  - every package link built by contributeHref() lands on an element that
 *    exists, so product pages can link to a package's entry safely;
 *  - no package links into a private repository, which answers 404.
 */
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import path from "node:path";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("wouter", () => ({
  Link: ({
    href,
    children,
    ...rest
  }: {
    href: string;
    children: ReactNode;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

import Contribute from "../../client/src/pages/Contribute";
import {
  CONTRIBUTE_PACKAGES,
  PR_TEMPLATE,
  contributeHref,
  packageAnchor,
} from "../../client/src/data/contribute";
import { STACK } from "../../client/src/data/stack";

const root = path.resolve(__dirname, "../..");
const githubTemplate = readFileSync(
  path.join(root, ".github/PULL_REQUEST_TEMPLATE.md"),
  "utf8"
);

afterEach(cleanup);

describe("PR template", () => {
  it("is identical to .github/PULL_REQUEST_TEMPLATE.md", () => {
    expect(PR_TEMPLATE).toBe(githubTemplate);
  });

  it("asks for architecture impact and points at the review section", () => {
    expect(githubTemplate).toContain("## Architecture impact");
    expect(githubTemplate).toContain(
      "https://www.embeddedos.org/contribute/#architecture-review"
    );
  });

  it("is rendered on the page", () => {
    render(<Contribute />);
    expect(screen.getByLabelText("Pull request template").textContent).toBe(
      PR_TEMPLATE
    );
  });
});

describe("page anchors", () => {
  it("has every section the template and local nav link to", () => {
    const { container } = render(<Contribute />);
    for (const id of [
      "architecture-review",
      "submit-pr",
      "pr-template",
      "review-timelines",
      "packages",
    ])
      expect(container.querySelector(`#${id}`), id).not.toBeNull();
  });
});

describe("package entries", () => {
  it("builds an anchor of letters, digits and single hyphens", () => {
    expect(packageAnchor("eBoot")).toBe("pkg-eboot");
    expect(packageAnchor(".github")).toBe("pkg-github");
    expect(packageAnchor("embeddedos-org.github.io")).toBe(
      "pkg-embeddedos-org-github-io"
    );
    expect(contributeHref("eBoot")).toBe("/contribute#pkg-eboot");
  });

  it("gives every package a unique anchor", () => {
    const anchors = CONTRIBUTE_PACKAGES.map(p => p.anchor);
    expect(new Set(anchors).size).toBe(anchors.length);
  });

  it("resolves contributeHref() for every listed package to a rendered element", () => {
    const { container } = render(<Contribute />);
    const missing = CONTRIBUTE_PACKAGES.filter(p => {
      const id = contributeHref(p.name).split("#")[1];
      return !container.querySelector(`[id="${id}"]`);
    }).map(p => p.name);
    expect(missing).toEqual([]);
  });

  it("lists every public project and links none into a private repository", () => {
    const listed = CONTRIBUTE_PACKAGES.map(p => p.name);
    expect(listed).not.toContain("www.embeddedos.org");
    expect(listed).not.toContain("eVera");
    expect(listed.length).toBe(STACK.projects.length - 2);
    for (const p of CONTRIBUTE_PACKAGES) {
      expect(p.repoUrl).toMatch(/^https:\/\/github\.com\/embeddedos-org\//);
      expect(p.area, p.name).toBeTruthy();
    }
  });
});
