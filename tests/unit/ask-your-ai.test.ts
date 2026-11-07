/**
 * The "Ask your AI" card opens an outside assistant with a prompt that sends it
 * to the embeddedos-org repository list. Two things can silently break this
 * feature: a link that no longer carries the whole prompt, and /llms.txt (the
 * site guide for crawlers) pointing at a page the site no longer has.
 */
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
// @ts-expect-error - plain .mjs script, no type declarations
import { discoverRoutes } from "../../scripts/prerender.mjs";
import {
  AI_TARGETS,
  ASK_AI_PROMPT,
  askUrl,
} from "../../client/src/components/AskYourAI";

const BRIEF = fs.readFileSync(
  path.resolve(__dirname, "../../client/public/llms.txt"),
  "utf8"
);

describe("Ask your AI links", () => {
  it.each(AI_TARGETS)("$name receives the full prompt in q", target => {
    const url = new URL(askUrl(target));
    expect(url.protocol).toBe("https:");
    expect(url.searchParams.get("q")).toBe(ASK_AI_PROMPT);
  });

  it("points the assistant at the embeddedos-org repositories", () => {
    expect(ASK_AI_PROMPT).toContain(
      "https://github.com/orgs/embeddedos-org/repositories"
    );
  });
});

describe("llms.txt", () => {
  it("links only to routes the app declares", () => {
    const routes = new Set<string>(discoverRoutes());
    const linked = [
      ...BRIEF.matchAll(/\]\((https:\/\/www\.embeddedos\.org[^)]*)\)/g),
    ].map(m => new URL(m[1]).pathname);
    expect(linked.length).toBeGreaterThan(0);
    expect(linked.filter(p => !routes.has(p))).toEqual([]);
  });

  it("tells the assistant to stay on our sources and admit gaps", () => {
    expect(BRIEF).toContain("Use only www.embeddedos.org");
    expect(BRIEF).toContain("say you are not sure");
  });
});
