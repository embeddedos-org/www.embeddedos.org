/**
 * The Foundation's legal facts appear in three places that cannot import from
 * each other: client/src/data/foundation.ts (the source of truth, used by the
 * React pages), the JSON-LD block in client/index.html (static, read by
 * crawlers), and client/public/sitemap.xml (static, read by crawlers).
 *
 * Drift between them is the failure this file exists to catch, and it has
 * already happened once: /contact published "EIN available upon request" while
 * /donate and /organization published the EIN itself — a contradiction on the
 * single number that proves charitable status, which is exactly what a Google
 * Ad Grants reviewer checks. Nothing else in the suite compares a TypeScript
 * constant against static markup, so it gets its own check here.
 */
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = path.resolve(__dirname, "../..");
const INDEX_HTML = path.join(ROOT, "client/index.html");
const SITEMAP = path.join(ROOT, "client/public/sitemap.xml");
const APP_TSX = path.join(ROOT, "client/src/App.tsx");
const FOUNDATION_TS = path.join(ROOT, "client/src/data/foundation.ts");

const indexHtml = fs.readFileSync(INDEX_HTML, "utf8");
const sitemap = fs.readFileSync(SITEMAP, "utf8");
const appTsx = fs.readFileSync(APP_TSX, "utf8");
const foundationTs = fs.readFileSync(FOUNDATION_TS, "utf8");

const ORIGIN = "https://www.embeddedos.org";

/** The single JSON-LD block in the shell, parsed. */
function structuredData(): Record<string, unknown> {
  const match = indexHtml.match(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/
  );
  expect(match, "index.html must carry a JSON-LD block").not.toBeNull();
  return JSON.parse(match![1]);
}

/** A string literal assigned to `key:` in foundation.ts. */
function foundationValue(key: string): string {
  const match = foundationTs.match(
    new RegExp(`\\b${key}:\\s*"((?:[^"\\\\]|\\\\.)*)"`)
  );
  expect(match, `foundation.ts must define ${key}`).not.toBeNull();
  return match![1];
}

/** The SOCIAL_URLS block in foundation.ts, parsed to key → URL. */
function socialUrls(): Record<string, string> {
  const block = foundationTs.match(
    /export const SOCIAL_URLS = \{([\s\S]*?)\n\} as const;/
  );
  expect(block, "foundation.ts must define SOCIAL_URLS").not.toBeNull();

  const urls: Record<string, string> = {};
  for (const m of block![1].matchAll(/(\w+):\s*"([^"]*)"/g)) urls[m[1]] = m[2];
  return urls;
}

/** The CONTACT_EMAILS block in foundation.ts, parsed to key → address. */
function contactEmails(): Record<string, string> {
  const block = foundationTs.match(
    /export const CONTACT_EMAILS = \{([\s\S]*?)\n\} as const;/
  );
  expect(block, "foundation.ts must define CONTACT_EMAILS").not.toBeNull();

  const emails: Record<string, string> = {};
  for (const m of block![1].matchAll(/(\w+):\s*"([^"]*)"/g))
    emails[m[1]] = m[2];
  return emails;
}

/**
 * Every .ts/.tsx the site ships, plus the static shell.
 *
 * `shared/` is included because eBot answers out of shared/ebot-knowledge.ts
 * and hands the visitor a mailto link. It cannot import CONTACT_EMAILS — the
 * client alias does not resolve from shared/ — so its addresses are literals,
 * and a check that skipped the directory would skip the one file most likely
 * to drift.
 */
function clientSources(): { file: string; text: string }[] {
  const found: { file: string; text: string }[] = [];

  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (/\.tsx?$/.test(entry.name)) {
        found.push({
          file: path.relative(ROOT, full),
          text: fs.readFileSync(full, "utf8"),
        });
      }
    }
  };

  walk(path.join(ROOT, "client/src"));
  walk(path.join(ROOT, "shared"));
  found.push({ file: "client/index.html", text: indexHtml });
  return found;
}

/** Static route paths declared in App.tsx, excluding the 404 fallback. */
function declaredRoutes(): string[] {
  return [...appTsx.matchAll(/<Route\s+path="([^"]+)"/g)]
    .map(m => m[1])
    .filter(r => !r.includes(":") && !r.includes("*") && r !== "/404");
}

/** Paths listed in the sitemap, normalised to route form. */
function sitemapPaths(): string[] {
  return [
    ...sitemap.matchAll(
      new RegExp(`<loc>${ORIGIN}([^<]*)</loc>`.replace(/\//g, "\\/"), "g")
    ),
  ].map(m => m[1] || "/");
}

describe("structured data agrees with the source of truth", () => {
  it("publishes the same EIN the pages publish", () => {
    expect(structuredData().taxID).toBe(foundationValue("ein"));
  });

  it("publishes the same legal name the pages publish", () => {
    expect(structuredData().name).toBe(foundationValue("legalName"));
  });

  it("publishes the same canonical URL", () => {
    expect(structuredData().url).toBe(foundationValue("website"));
  });

  it("publishes the same contact address the pages publish", () => {
    // index.html cannot import CONTACT_EMAILS, so this is the only thing
    // stopping the crawler-visible address outliving the one on the pages.
    expect(structuredData().email).toBe(contactEmails().contact);
  });

  it("publishes the same postal address the contact page publishes", () => {
    const address = structuredData().address as Record<string, string>;
    expect(address["@type"]).toBe("PostalAddress");
    expect(address.streetAddress).toBe(foundationValue("street"));
    expect(address.addressLocality).toBe(foundationValue("city"));
    expect(address.addressRegion).toBe(foundationValue("region"));
    expect(address.postalCode).toBe(foundationValue("postalCode"));
    expect(address.addressCountry).toBe(foundationValue("countryCode"));
  });

  it("declares 501(c)(3) status", () => {
    const data = structuredData();
    expect(data["@type"]).toBe("NGO");
    expect(data.nonprofitStatus).toBe("Nonprofit501c3");
  });

  it("links only accounts the site links elsewhere", () => {
    // A sameAs pointing at an account the Foundation does not control is worse
    // than no sameAs: it tells Google to treat that account as authoritative.
    const sameAs = structuredData().sameAs as string[];
    expect(sameAs.length).toBeGreaterThan(0);
    for (const url of sameAs) {
      expect(
        foundationTs,
        `${url} must be declared in foundation.ts`
      ).toContain(url);
    }
  });

  it("lists every social profile the site publishes", () => {
    // The reverse of the check above, and the direction the Instagram launch
    // needed: an account added to SOCIAL_URLS but not here leaves the knowledge
    // panel describing a Foundation that is on one fewer network than it is.
    //
    // `discussions` is exempt — it is a section of the GitHub org that sameAs
    // already lists, not a profile of its own.
    const sameAs = structuredData().sameAs as string[];
    const missing = Object.entries(socialUrls())
      .filter(([key]) => key !== "discussions")
      .filter(([, url]) => !sameAs.includes(url))
      .map(([key]) => key);

    expect(missing, "SOCIAL_URLS entries absent from sameAs").toEqual([]);
  });
});

/**
 * One entry per Foundation account: its key in SOCIAL_URLS, and a pattern that
 * matches the account however it is written — the wrong spellings included.
 *
 * The patterns deliberately do not match anything else. `linkedin.com/in/...`
 * is a form placeholder for an applicant's own profile on /careers, and
 * `github.com/embeddedos-org/<repo>` is a repository rather than the org, so
 * the GitHub pattern stops at the org path.
 */
const SOCIAL_ACCOUNTS: { key: string; anySpelling: RegExp }[] = [
  {
    key: "github",
    anySpelling: /https:\/\/(?:www\.)?github\.com\/embeddedos-org(?![\w./-])/g,
  },
  {
    key: "x",
    anySpelling: /https:\/\/(?:www\.)?(?:x|twitter)\.com\/EmbeddedOS_ORG\b/gi,
  },
  {
    key: "linkedin",
    anySpelling: /https:\/\/(?:www\.)?linkedin\.com\/company\/[\w-]+/g,
  },
  {
    key: "youtube",
    anySpelling: /https:\/\/(?:www\.)?youtube\.com\/@EmbeddedOS_ORG\b/gi,
  },
  {
    key: "instagram",
    anySpelling: /https:\/\/(?:www\.)?instagram\.com\/[\w.]+/g,
  },
  {
    key: "facebook",
    anySpelling: /https:\/\/(?:www\.)?facebook\.com\/[^"'\s<>,)]+/g,
  },
  {
    key: "discussions",
    anySpelling:
      /https:\/\/(?:www\.)?github\.com\/orgs\/embeddedos-org\/discussions\b/g,
  },
];

describe("the Foundation's accounts are spelled one way", () => {
  // SOCIAL_URLS was introduced to stop the same account being published under
  // two names, but nothing checked that pages actually agreed with it, so the
  // drift kept coming back: /community linked twitter.com while the footer and
  // /about linked x.com, and — one entry below the fix for that — linked
  // youtube.com against www.youtube.com everywhere else. Neither 404s, which
  // is why review missed both: the bare YouTube host just redirects. What they
  // cost is the identity a crawler builds from sameAs, one account split into
  // two, on the site of a foundation whose grant applications rest on it.
  //
  // This asserts spelling, not that a constant was used. A canonical URL typed
  // out in full is not a defect; the same URL typed two ways is.
  const sources = clientSources();

  for (const { key, anySpelling } of SOCIAL_ACCOUNTS) {
    it(`writes every ${key} link the way SOCIAL_URLS does`, () => {
      const canonical = socialUrls()[key];
      expect(canonical, `SOCIAL_URLS.${key} must exist`).toBeTruthy();

      const wrong: string[] = [];
      for (const { file, text } of sources) {
        for (const [url] of text.matchAll(anySpelling)) {
          if (url !== canonical) wrong.push(`${file} → ${url}`);
        }
      }

      expect(wrong, `every link must read "${canonical}"`).toEqual([]);
    });
  }

  it("sends mail only to an address the Foundation declares", () => {
    // The site has no server and sends no mail itself, so a mailto: is a
    // promise that a cPanel mailbox exists on the other side. hello@ was
    // retired in favour of contact@ and support@; a link still pointing at it,
    // or at a plausible typo, bounces with nothing on the site to show for it.
    //
    // Only literal addresses are checked. `mailto:${CONTACT_EMAILS.contact}`
    // does not match the pattern and needs no check — it is correct by
    // construction, which is the point of writing it that way.
    const declared = new Set(Object.values(contactEmails()));
    const undeclared: string[] = [];

    for (const { file, text } of sources) {
      for (const [, address] of text.matchAll(
        /mailto:([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+)/g
      )) {
        if (!declared.has(address)) undeclared.push(`${file} → ${address}`);
      }
    }

    expect(undeclared, "mailto: links to undeclared addresses").toEqual([]);
  });

  it("has retired hello@ everywhere, not just where it was noticed", () => {
    // It appeared 18 times across 10 files, including the eBot knowledge base
    // and the privacy and terms pages, where a stale address is a published
    // legal contact that does not answer.
    const survivors = sources
      .filter(({ text }) => text.includes("hello@embeddedos.org"))
      .map(({ file }) => file);

    expect(survivors, "files still using the retired hello@").toEqual([]);
  });

  it("covers every account SOCIAL_URLS declares", () => {
    // Without this, adding a key to SOCIAL_URLS silently opts it out of the
    // check above — the failure mode is a test file that looks thorough and
    // guards less each time the Foundation joins a network.
    const unchecked = Object.keys(socialUrls()).filter(
      key => !SOCIAL_ACCOUNTS.some(a => a.key === key)
    );

    expect(unchecked, "SOCIAL_URLS keys with no spelling check").toEqual([]);
  });
});

describe("the sitemap covers the site", () => {
  it("lists every static route", () => {
    const missing = declaredRoutes().filter(r => !sitemapPaths().includes(r));
    expect(missing, "routes absent from sitemap.xml").toEqual([]);
  });

  it("lists no path that is not a route", () => {
    const routes = declaredRoutes();
    const stray = sitemapPaths().filter(p => !routes.includes(p));
    expect(stray, "sitemap.xml entries with no matching route").toEqual([]);
  });

  it("includes the pages a nonprofit review looks for", () => {
    for (const required of [
      "/",
      "/about",
      "/mission",
      "/transparency",
      "/organization",
      "/contact",
      "/donate",
      "/privacy",
      "/terms",
    ]) {
      expect(sitemapPaths(), `sitemap missing ${required}`).toContain(required);
    }
  });
});

describe("the EIN is stated consistently", () => {
  it("is never described as withheld", () => {
    // The specific regression: /contact said "EIN available upon request" while
    // two other pages printed it.
    const pages = path.join(ROOT, "client/src/pages");
    const offenders: string[] = [];
    for (const file of fs.readdirSync(pages)) {
      if (!file.endsWith(".tsx")) continue;
      const text = fs.readFileSync(path.join(pages, file), "utf8");
      if (/EIN[^.]{0,40}(upon request|on request|available on)/i.test(text)) {
        offenders.push(file);
      }
    }
    expect(offenders, "pages that withhold the EIN").toEqual([]);
  });
});
