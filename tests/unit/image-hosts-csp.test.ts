import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "../..");
const SRC = path.join(ROOT, "client/src");

function cspImgHosts(): string[] {
  const htaccess = fs.readFileSync(
    path.join(ROOT, "client/public/.htaccess"),
    "utf8"
  );
  const csp = htaccess.match(/Content-Security-Policy "([^"]+)"/)?.[1] ?? "";
  const imgSrc = csp
    .split(";")
    .map(d => d.trim())
    .find(d => d.startsWith("img-src "));
  return (imgSrc ?? "")
    .split(/\s+/)
    .slice(1)
    .filter(s => s.startsWith("https://"))
    .map(s => new URL(s).host);
}

function sourceFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(full);
    return /\.(tsx?)$/.test(entry.name) ? [full] : [];
  });
}

function imageHostsInSource(): Map<string, string[]> {
  const found = new Map<string, string[]>();
  const pattern = /\b(?:src|srcSet)=\{?["'`]https:\/\/([^"'`/]+)/g;
  for (const file of sourceFiles(SRC)) {
    const text = fs.readFileSync(file, "utf8");
    for (const match of text.matchAll(pattern)) {
      const files = found.get(match[1]) ?? [];
      files.push(path.relative(ROOT, file));
      found.set(match[1], files);
    }
  }
  return found;
}

describe("images load from hosts the CSP allows", () => {
  it("reads an img-src directive from the shipped .htaccess", () => {
    expect(cspImgHosts().length).toBeGreaterThan(0);
  });

  it("every absolute image URL in client/src is on img-src", () => {
    const allowed = new Set(cspImgHosts());
    const blocked = [...imageHostsInSource()].filter(
      ([host]) => !allowed.has(host)
    );
    expect(blocked).toEqual([]);
  });
});

describe("book covers are served from the site", () => {
  it("has a JPEG and a WebP cover for every book's repository", () => {
    const books = fs.readFileSync(path.join(SRC, "pages/Books.tsx"), "utf8");
    const repos = [
      ...new Set([...books.matchAll(/repo:\s*"([^"]+)"/g)].map(m => m[1])),
    ];
    expect(repos.length).toBeGreaterThan(0);
    const missing = repos.flatMap(repo =>
      ["jpg", "webp"]
        .map(
          ext => `client/public/media/book-cover-${repo.toLowerCase()}.${ext}`
        )
        .filter(file => !fs.existsSync(path.join(ROOT, file)))
    );
    expect(missing).toEqual([]);
  });
});
