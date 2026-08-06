/**
 * Unit tests for the /manus-storage asset resolver.
 *
 * This resolver is what stops every image on the site from 500ing when the
 * Manus Forge storage credentials are absent, and it is the one place that
 * takes an untrusted path segment from the URL — so traversal is covered here.
 */
import { describe, it, expect } from "vitest";
import path from "node:path";
import fs from "node:fs";
import {
  resolveLocalAsset,
  localAssetDirs,
} from "../../server/_core/storageProxy";

const ASSET_DIR = path.resolve(
  import.meta.dirname,
  "../../client/public/manus-storage"
);
const anExistingAsset = fs.existsSync(ASSET_DIR)
  ? fs.readdirSync(ASSET_DIR).find(f => f.endsWith(".jpg"))
  : undefined;

describe("localAssetDirs", () => {
  it("returns absolute candidate directories", () => {
    const dirs = localAssetDirs();
    expect(dirs.length).toBeGreaterThan(0);
    expect(dirs.every(d => path.isAbsolute(d))).toBe(true);
  });

  it("includes the committed client/public location", () => {
    expect(
      localAssetDirs().some(d =>
        d.includes(path.join("client", "public", "manus-storage"))
      )
    ).toBe(true);
  });
});

describe("resolveLocalAsset", () => {
  it("resolves an asset that is committed to the repo", () => {
    expect(
      anExistingAsset,
      "no committed manus-storage assets found"
    ).toBeDefined();
    const resolved = resolveLocalAsset(anExistingAsset!);
    expect(resolved).not.toBeNull();
    expect(fs.existsSync(resolved!)).toBe(true);
  });

  it("returns null for a key that does not exist", () => {
    expect(
      resolveLocalAsset("definitely-not-a-real-asset-9f8a7b.jpg")
    ).toBeNull();
  });

  // Traversal: the key comes straight from the URL path.
  it.each([
    "../../package.json",
    "../../../etc/passwd",
    "..%2f..%2fpackage.json",
    "subdir/../../../package.json",
  ])("refuses to escape the asset directory: %s", key => {
    const resolved = resolveLocalAsset(key);
    if (resolved !== null) {
      // If anything resolved, it must still be inside an allowed directory.
      expect(
        localAssetDirs().some(d => resolved.startsWith(d + path.sep))
      ).toBe(true);
    } else {
      expect(resolved).toBeNull();
    }
  });

  it("never resolves a directory as if it were a file", () => {
    expect(resolveLocalAsset("")).toBeNull();
    expect(resolveLocalAsset(".")).toBeNull();
  });
});
