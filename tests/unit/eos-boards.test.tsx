/** @vitest-environment jsdom */

import "@testing-library/jest-dom/vitest";
import { act, cleanup, render, screen, within } from "@testing-library/react";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import EosBoards, {
  BOARD_PULL_REQUESTS,
} from "../../client/src/pages/EosBoards";
import {
  BOARD_LICENSOR,
  BOARD_STATUS,
  EOS_BOARDS,
  boardCadUrl,
  boardFolderUrl,
  boardImage,
  boardThumb,
  boardTurntable,
  boardLicenceUrl,
  pullRequestUrl,
} from "../../client/src/data/eos-boards";
import { readDescription } from "../../client/src/lib/page-meta";

const media = path.resolve(__dirname, "../../client/public");
const fileOf = (url: string) => path.join(media, url);

function mockMatchMedia(reduced: boolean) {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: vi.fn().mockReturnValue({
      matches: reduced,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }),
  });
}

type IoCallback = (entries: Array<{ isIntersecting: boolean }>) => void;

function mockIntersectionObserver() {
  const callbacks: IoCallback[] = [];
  class FakeIO {
    constructor(cb: IoCallback) {
      callbacks.push(cb);
    }
    observe() {}
    disconnect() {}
    unobserve() {}
  }
  vi.stubGlobal("IntersectionObserver", FakeIO);
  return (intersecting: boolean) =>
    act(() => {
      for (const cb of callbacks) cb([{ isIntersecting: intersecting }]);
    });
}

const pageText = (container: HTMLElement) =>
  (container.textContent ?? "").replace(/\s+/g, " ");

beforeEach(() => {
  mockMatchMedia(false);
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("board manifest", () => {
  it("lists each board once", () => {
    expect(EOS_BOARDS.length).toBeGreaterThan(0);
    expect(new Set(EOS_BOARDS.map(b => b.slug)).size).toBe(EOS_BOARDS.length);
    expect(new Set(EOS_BOARDS.map(b => b.name)).size).toBe(EOS_BOARDS.length);
    for (const board of EOS_BOARDS) {
      expect(board.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(board.features.length, board.slug).toBeGreaterThan(2);
    }
  });

  it("ships every render and index thumbnail as a JPEG with a WebP sibling, and each turntable with its poster", () => {
    const missing = EOS_BOARDS.flatMap(board => [
      ...[
        ...(["iso", "top", "bottom"] as const).map(view =>
          boardImage(board.slug, view)
        ),
        boardThumb(board.slug),
      ].flatMap(base => [".jpg", ".webp"].map(ext => `${base}${ext}`)),
      boardTurntable(board.slug).video,
      boardTurntable(board.slug).poster,
    ]).filter(url => !existsSync(fileOf(url)));
    expect(missing).toEqual([]);
  });

  it("declares the pixel size each file really has", async () => {
    const wrong: string[] = [];
    for (const board of EOS_BOARDS) {
      const files = [
        [`${boardThumb(board.slug)}.jpg`, board.media.thumb],
        [`${boardImage(board.slug, "iso")}.jpg`, board.media.iso],
        [`${boardImage(board.slug, "top")}.jpg`, board.media.plan],
        [`${boardImage(board.slug, "bottom")}.jpg`, board.media.plan],
        [boardTurntable(board.slug).poster, board.media.turntable],
      ] as const;
      for (const [url, size] of files) {
        const meta = await sharp(fileOf(url)).metadata();
        if (meta.width !== size.width || meta.height !== size.height)
          wrong.push(
            `${url}: ${meta.width}x${meta.height}, declared ${size.width}x${size.height}`
          );
      }
    }
    expect(wrong).toEqual([]);
  });
});

describe("board page", () => {
  it("offers each board’s native CAD files and its named full licence", () => {
    render(<EosBoards />);
    for (const board of EOS_BOARDS) {
      const article = document.getElementById(board.slug) as HTMLElement;
      for (const [kind, label, root] of [
        ["schematic", "Schematic (.kicad_sch)", "(kicad_sch"],
        ["pcb", "PCB layout (.kicad_pcb)", "(kicad_pcb"],
      ] as const) {
        const link = within(article).getByRole("link", {
          name: `${label} for ${board.name}`,
        });
        const url = boardCadUrl(board, kind);
        expect(link).toHaveAttribute("href", url);
        expect(link).toHaveAttribute("download");
        const cad = readFileSync(fileOf(url), "utf8");
        expect(cad.trimStart().startsWith(root), board.slug).toBe(true);
        expect(cad, board.slug).toContain(BOARD_LICENSOR.name);
        expect(cad, board.slug).toMatch(/All rights reserved/);
      }
      const licence = within(article).getByRole("link", {
        name: "this board’s full licence",
      });
      expect(licence).toHaveAttribute("href", boardLicenceUrl(board));
      const terms = readFileSync(fileOf(boardLicenceUrl(board)), "utf8");
      expect(terms).toContain(board.name);
      expect(terms).toContain(BOARD_LICENSOR.name);
      expect(terms).toContain("1. Permission is needed.");
    }
  });

  it("states each board's status, chip, size, layers and recorded checks", () => {
    render(<EosBoards />);
    for (const board of EOS_BOARDS) {
      const article = screen
        .getByRole("heading", { level: 2, name: board.name })
        .closest("article");
      expect(article, board.slug).not.toBeNull();
      const scope = within(article as HTMLElement);
      const text = pageText(article as HTMLElement);
      expect(text).toContain(`Status: ${BOARD_STATUS}.`);
      expect(text).toContain(board.mainChip);
      expect(text).toContain(`${board.sizeMm[0]} × ${board.sizeMm[1]} mm`);
      expect(text).toContain(`${board.layers} (${board.stackup})`);
      expect(text).toContain(
        `KiCad ${board.checks.kicad}, commit ${board.checks.commit}.`
      );
      for (const [label, value] of [
        ["ERC violations", board.checks.ercViolations],
        ["DRC errors", board.checks.drcErrors],
        ["Unconnected", board.checks.unconnectedItems],
        ["Schematic parity", board.checks.schematicParity],
        ["DRC warnings", board.checks.drcWarnings],
      ] as const) {
        const term = scope.getByText(label, { selector: "dt" });
        expect(
          term.nextElementSibling?.textContent,
          `${board.slug} ${label}`
        ).toBe(String(value));
      }
      for (const feature of board.features) expect(text).toContain(feature);
    }
  });

  it("opens with a paragraph that fits a search snippet whole", () => {
    render(
      <main>
        <EosBoards />
      </main>
    );
    const description = readDescription(document);
    expect(description).toContain(BOARD_LICENSOR.name);
    expect(description.length).toBeLessThanOrEqual(155);
    expect(description).toMatch(/\.$/);
  });

  it("never says a board was manufactured, built or tested", () => {
    const { container } = render(<EosBoards />);
    const claims = pageText(container)
      .split(/[.;:]/)
      .filter(s => /\b(manufactured|built|tested)\b/i.test(s))
      .filter(s => /\b(is|are|was|were|been|has|have)\b/i.test(s))
      .filter(s => !/\b(not|no|none|cannot|never)\b/i.test(s));
    expect(pageText(container)).toMatch(/has not been manufactured/);
    expect(claims).toEqual([]);
  });

  it("names Kartikeydheer Srivastava without a gendered pronoun", () => {
    const { container } = render(<EosBoards />);
    const text = pageText(container);
    expect(text).toContain(BOARD_LICENSOR.name);
    expect(text).not.toMatch(/\b(he|him|his|she|her|hers)\b/i);
  });

  it("states the licence plainly", () => {
    const { container } = render(<EosBoards />);
    const text = pageText(container);
    for (const sentence of [
      "These boards are Copyright (c) 2026 Kartikeydheer Srivastava, all rights reserved, and not open source.",
      "Anyone may view them. Copying, modifying, manufacturing or selling needs written permission from Kartikeydheer Srivastava, which may be given for a fee. Contact kartikeydheer@gmail.com.",
      "EmbeddedOS (EoS) Research Foundation has a limited, revocable permission to use them.",
    ])
      expect(text).toContain(sentence);
  });

  it("sends every licensing, partnership and evaluation email to the licensor with a subject", () => {
    const { container } = render(<EosBoards />);
    const mailtos = [...container.querySelectorAll('a[href^="mailto:"]')].map(
      a => a.getAttribute("href") ?? ""
    );
    expect(mailtos.length).toBe(4);
    for (const href of mailtos) {
      const url = new URL(href);
      expect(url.pathname).toBe(BOARD_LICENSOR.email);
      expect(url.searchParams.get("subject")).toMatch(
        /^(Licence request|Partnership|Evaluation): EmbeddedOS development boards$/
      );
    }
    for (const reason of ["Licensing", "Partnerships", "Evaluation"])
      expect(
        screen.getByRole("heading", { level: 3, name: reason })
      ).toBeInTheDocument();
  });

  it("links all 15 merged boards to upstream master, in a new tab", () => {
    const { container } = render(<EosBoards />);
    expect(EOS_BOARDS).toHaveLength(15);
    const catalogue = ["eos-cm4-base", "eos-motion-wing", "eos-esp32-devkit"];
    for (const board of EOS_BOARDS) {
      const href = boardFolderUrl(board);
      expect(href).toBe(
        `https://github.com/embeddedos-org/eCAD-Hardware-Products/tree/master/boards/eos/${board.slug}`
      );
      const link = container.querySelector(`a[href="${href}"]`);
      expect(link, board.slug).not.toBeNull();
      expect(link?.getAttribute("target")).toBe("_blank");
      expect(link?.getAttribute("rel")).toBe("noopener noreferrer");
    }
    for (const slug of catalogue)
      expect(EOS_BOARDS.map(b => b.slug)).toContain(slug);
  });

  it("links every pull request the boards come from, once each", () => {
    const { container } = render(<EosBoards />);
    expect(BOARD_PULL_REQUESTS).toEqual([60]);
    for (const pullRequest of BOARD_PULL_REQUESTS)
      expect(
        container.querySelectorAll(`a[href="${pullRequestUrl(pullRequest)}"]`)
          .length,
        `#${pullRequest}`
      ).toBe(1);
  });

  it("indexes every board at the top, in manifest order, each card jumping to its board", () => {
    render(<EosBoards />);
    const index = screen.getByRole("navigation", {
      name: "Boards on this page",
    });
    const cards = within(index).getAllByRole("link");
    expect(cards.map(a => a.getAttribute("href"))).toEqual(
      EOS_BOARDS.map(b => `#${b.slug}`)
    );
    EOS_BOARDS.forEach((board, i) => {
      expect(cards[i]).toHaveTextContent(board.name);
      expect(cards[i]).toHaveTextContent(board.category);
      expect(cards[i].style.flexDirection).toBe("column");
      expect(document.getElementById(board.slug)?.tagName).toBe("ARTICLE");
    });
  });

  it("keeps each board's features, open items and third-party list collapsed until asked for", () => {
    render(<EosBoards />);
    for (const board of EOS_BOARDS) {
      const article = document.getElementById(board.slug) as HTMLElement;
      const details = article.querySelectorAll("details");
      expect(details.length, board.slug).toBe(1);
      expect(details[0].hasAttribute("open"), board.slug).toBe(false);
      const hidden = pageText(details[0]);
      for (const item of [
        ...board.features,
        ...board.notYetDone,
        ...board.thirdParty,
      ])
        expect(hidden).toContain(item);
      expect(pageText(article)).toContain(`Status: ${BOARD_STATUS}.`);
      expect(details[0].textContent).not.toContain(BOARD_STATUS);
    }
  });

  it("gives every render alt text and its intrinsic size, and loads it lazily", () => {
    const { container } = render(<EosBoards />);
    const index = screen.getByRole("navigation", {
      name: "Boards on this page",
    });
    const images = [...container.querySelectorAll("img")];
    expect(images.length).toBe(EOS_BOARDS.length * 4);
    for (const img of images) {
      if (index.contains(img)) expect(img.getAttribute("alt")).toBe("");
      else expect(img.getAttribute("alt")?.length ?? 0).toBeGreaterThan(30);
      expect(Number(img.getAttribute("width"))).toBeGreaterThan(0);
      expect(Number(img.getAttribute("height"))).toBeGreaterThan(0);
      expect(img.getAttribute("loading")).toBe("lazy");
    }
    expect(index.querySelectorAll("img").length).toBe(EOS_BOARDS.length);
  });

  it("ships each turntable muted, labelled, with a poster, and loads nothing until it plays", () => {
    const { container } = render(<EosBoards />);
    const videos = [...container.querySelectorAll("video")];
    expect(videos.map(v => v.getAttribute("poster"))).toEqual(
      EOS_BOARDS.map(b => boardTurntable(b.slug).poster)
    );
    for (const video of videos) {
      expect(video.muted).toBe(true);
      expect(video.loop).toBe(true);
      expect(video.getAttribute("preload")).toBe("none");
      expect(video.hasAttribute("autoplay")).toBe(false);
      expect(video.getAttribute("aria-label")).toMatch(/turntable/);
      expect(video.querySelector("source")?.getAttribute("type")).toBe(
        "video/mp4"
      );
    }
  });

  it("plays a turntable only while it is on screen", () => {
    const fire = mockIntersectionObserver();
    const play = vi
      .spyOn(HTMLMediaElement.prototype, "play")
      .mockResolvedValue(undefined);
    const pause = vi
      .spyOn(HTMLMediaElement.prototype, "pause")
      .mockImplementation(() => {});
    render(<EosBoards />);
    expect(play).not.toHaveBeenCalled();
    fire(true);
    expect(play).toHaveBeenCalledTimes(EOS_BOARDS.length);
    fire(false);
    expect(pause).toHaveBeenCalledTimes(EOS_BOARDS.length);
  });

  it("offers controls when the browser refuses autoplay, but not when a scroll interrupts a play", async () => {
    for (const [name, controls] of [
      ["NotAllowedError", true],
      ["AbortError", false],
    ] as const) {
      mockMatchMedia(false);
      const fire = mockIntersectionObserver();
      vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(
        () => {}
      );
      vi.spyOn(HTMLMediaElement.prototype, "play").mockRejectedValue(
        new DOMException("refused", name)
      );
      const { container, unmount } = render(<EosBoards />);
      fire(true);
      await act(async () => {});
      for (const video of container.querySelectorAll("video"))
        expect(video.hasAttribute("controls"), name).toBe(controls);
      unmount();
      vi.unstubAllGlobals();
      vi.restoreAllMocks();
    }
  });

  it("never autoplays for a visitor who asks for reduced motion, and offers controls instead", () => {
    mockMatchMedia(true);
    const fire = mockIntersectionObserver();
    const play = vi
      .spyOn(HTMLMediaElement.prototype, "play")
      .mockResolvedValue(undefined);
    const { container } = render(<EosBoards />);
    fire(true);
    expect(play).not.toHaveBeenCalled();
    for (const video of container.querySelectorAll("video"))
      expect(video.hasAttribute("controls")).toBe(true);
  });
});
