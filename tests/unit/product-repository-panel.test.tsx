/** @vitest-environment jsdom */
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import ProductRepositoryPanel from "../../client/src/components/ProductRepositoryPanel";
import {
  PRODUCT_REPOSITORIES,
  type ProductRepositoryId,
} from "../../client/src/data/product-repositories";
import EOffice from "../../client/src/pages/EOffice";

vi.mock("../../client/src/lib/clipboard", () => ({ copyText: vi.fn() }));
import { copyText } from "../../client/src/lib/clipboard";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("source-backed product panels", () => {
  it.each(Object.keys(PRODUCT_REPOSITORIES) as ProductRepositoryId[])(
    "%s exposes the correct repository, source paths, and build guide without WebGL",
    product => {
      const source = PRODUCT_REPOSITORIES[product];
      const url = `https://github.com/embeddedos-org/${source.repo}`;
      const { container } = render(
        <ProductRepositoryPanel product={product} />
      );
      expect(
        screen.getByRole("heading", { name: source.title })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: /View repository/ })
      ).toHaveAttribute("href", url);
      expect(
        screen.getByRole("link", { name: /Read build guide/ })
      ).toHaveAttribute("href", `${url}/blob/master/README.md`);
      for (const link of screen.getAllByRole("link")) {
        expect(link).toHaveAttribute("target", "_blank");
        expect(link).toHaveAttribute("rel", "noopener noreferrer");
        expect(link.getAttribute("href")).toMatch(
          /^https:\/\/github\.com\/embeddedos-org\//
        );
      }
      expect(container).toHaveTextContent(source.note);
      expect(container.querySelector("canvas")).toBeNull();
      expect(source.sourceCommit).toMatch(/^[a-f0-9]{40}$/);
      fireEvent.click(screen.getByText("Build from source"));
      expect(container.querySelector("details")).toHaveAttribute("open");
      expect(container.querySelector("pre code")).toHaveTextContent(
        source.commands.replace(/\s+/g, " ")
      );
    }
  );

  it("copies the exact build commands and confirms success", async () => {
    vi.mocked(copyText).mockResolvedValue(true);
    render(<ProductRepositoryPanel product="eboot" />);
    fireEvent.click(screen.getByText("Build from source"));
    fireEvent.click(
      screen.getByRole("button", { name: "Copy build commands" })
    );
    expect(copyText).toHaveBeenCalledWith(PRODUCT_REPOSITORIES.eboot.commands);
    expect(
      await screen.findByText("Copied", { exact: true })
    ).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent(
      "Build commands copied to clipboard"
    );
  });

  it("links each eOffice app to its own real source folder", () => {
    render(<EOffice />);
    for (const [name, folder] of [
      ["eDocs", "edocs"],
      ["eSheets", "esheets"],
      ["eForms", "eforms"],
      ["eConnect", "econnect"],
      ["eDrive", "edrive"],
    ]) {
      fireEvent.click(screen.getByRole("button", { name, exact: true }));
      expect(
        screen.getByRole("link", { name: `Browse ${name} source ↗` })
      ).toHaveAttribute(
        "href",
        `https://github.com/embeddedos-org/eOffice/tree/master/apps/${folder}`
      );
    }
    expect(
      screen.queryByRole("button", { name: "eWriter" })
    ).not.toBeInTheDocument();
  });
});
