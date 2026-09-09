/**
 * Contract tests for the static hosting config that ships in the build.
 *
 * The deploy branch is served by Apache, not by dist/index.js, so the e2e suite
 * — which drives the express server — cannot see a defect that lives only in
 * .htaccess. That is exactly how the soft 404 survived: express returned a real
 * 404 for unknown URLs and the smoke test passed, while the deployed .htaccess
 * rewrote every unmatched path to /index.html and answered HTTP 200.
 *
 * Apache cannot be executed here, so these tests assert the two things that
 * make the config correct without it: the rules themselves, and the assumption
 * those rules rest on — that every application route is prerendered, so no
 * fallback rewrite is needed to serve it.
 *
 * Requires `pnpm build` first.
 */
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
// @ts-expect-error - plain .mjs script, no type declarations
import { discoverRoutes } from "../../scripts/prerender.mjs";

const DIST = path.resolve(import.meta.dirname, "../../dist/public");
const HTACCESS = path.join(DIST, ".htaccess");

const CPANEL_YML = path.join(DIST, ".cpanel.yml");
const HOME_HTML = path.join(DIST, "index.html");

const readHtaccess = () => fs.readFileSync(HTACCESS, "utf8");

describe("the build ships the hosting config", () => {
  it("emits .htaccess into the build output", () => {
    // Kept in client/public so vite copies it every build. When it lived only
    // on the deploy branch, rebuilding that branch dropped it.
    expect(
      fs.existsSync(HTACCESS),
      ".htaccess missing from dist/public — the deploy branch would ship without hosting rules"
    ).toBe(true);
  });

  it("emits .cpanel.yml into the build output", () => {
    // Same reasoning, and the same trap: this is the file cPanel reads to copy
    // the build into the document root, so if a rebuild drops it the deploy
    // branch updates and the live site silently does not.
    expect(
      fs.existsSync(CPANEL_YML),
      ".cpanel.yml missing from dist/public — cPanel would have nothing to deploy with"
    ).toBe(true);
  });

  it("does not ship the removed homepage showcase video", () => {
    const html = fs.readFileSync(HOME_HTML, "utf8");
    expect(html).not.toContain("Twenty seconds");
    expect(html).not.toContain("See the stack");
    expect(html).not.toContain("product-showcase.mp4");
    expect(html).not.toMatch(/<video\b/i);
  });

  it("copies .htaccess by name, since the glob skips dotfiles", () => {
    // `cp -R *` does not match dotfiles. .htaccess is the one dotfile the
    // document root actually needs, so it must be copied explicitly or the
    // ErrorDocument rule never reaches the server — which is the whole defect
    // this file guards against.
    const yml = fs.readFileSync(CPANEL_YML, "utf8");
    expect(yml).toMatch(/^\s*-\s*\S*cp\s+\.htaccess\s+\$DEPLOYPATH/m);
  });
});

describe("the hosting config uses only directives this host honours", () => {
  /**
   * <Limit> and <LimitExcept> are banned here, by measurement rather than
   * taste.
   *
   * `<Files "apply.php"><LimitExcept POST>Require all denied` shipped to
   * restrict the careers endpoint to POST. On Apache 2.4 it did exactly that —
   * GET 403, POST executed — and it was tested there before shipping. The host
   * runs LiteSpeed, which denied every method including POST, so the endpoint
   * answered 403 to the form itself and every application silently fell back to
   * the mail draft.
   *
   * The rule was scoped, not incidental: on the live site GET and POST both
   * returned 403 for apply.php, while /api/nonexistent.php returned 404 and a
   * POST to a static file returned 200.
   *
   * apply.php enforces the method itself with a 405, which is portable because
   * it is code rather than a server directive.
   */
  it("contains no <Limit> or <LimitExcept> block", () => {
    const htaccess = fs.readFileSync(HTACCESS, "utf8");

    // Comments explain the ban and necessarily name the directive, so only
    // uncommented lines are judged.
    const active = htaccess
      .split("\n")
      .filter(l => !l.trim().startsWith("#"))
      .join("\n");

    expect(
      active,
      "<Limit>/<LimitExcept> denies every method on LiteSpeed — see the note in .htaccess"
    ).not.toMatch(/<\s*Limit(Except)?[\s>]/i);
  });
});

describe("unknown URLs return a real 404", () => {
  it("declares an ErrorDocument pointing at the prerendered 404 page", () => {
    expect(readHtaccess()).toMatch(
      /^\s*ErrorDocument\s+404\s+\/404\.html\s*$/m
    );
  });

  it("serves the page that ErrorDocument names", () => {
    const notFound = path.join(DIST, "404.html");
    expect(fs.existsSync(notFound), "dist/public/404.html missing").toBe(true);
    expect(fs.readFileSync(notFound, "utf8")).toContain("404");
  });

  it("does not rewrite unmatched paths to the homepage", () => {
    // The regression this file exists for. A blanket fallback to /index.html
    // makes every unknown URL a soft 404: HTTP 200 carrying the homepage.
    const rules = readHtaccess()
      .split("\n")
      .filter(line => !line.trim().startsWith("#"))
      .join("\n");

    expect(rules).not.toMatch(/RewriteRule\s+\S+\s+\/index\.html/);
  });
});

describe("every route resolves without a fallback rewrite", () => {
  // Removing the SPA fallback is only safe while this holds. If someone adds a
  // route that the prerenderer does not emit, direct navigation to it would
  // start returning 404 on the static host — this fails first and says so.
  const routes: string[] = Array.from(discoverRoutes());

  it("discovers the application's routes", () => {
    expect(routes.length).toBeGreaterThan(50);
  });

  it.each(routes)("%s is prerendered to a file Apache can serve", route => {
    const file =
      route === "/"
        ? path.join(DIST, "index.html")
        : path.join(DIST, route.replace(/^\//, ""), "index.html");

    expect(
      fs.existsSync(file),
      `${route} has no prerendered index.html; without a fallback rewrite the static host will 404 it`
    ).toBe(true);
  });
});
