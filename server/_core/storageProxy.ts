import fs from "node:fs";
import path from "node:path";
import type { Express } from "express";
import { ENV } from "./env";

/**
 * Where a /manus-storage/<key> asset may live on disk. This route is registered
 * before the static handler, so without these checks every image on the site
 * depends on the Manus Forge storage API being configured — and 500s when it
 * is not. Assets committed under client/public/manus-storage are served
 * directly and the proxy is only used for keys that are not in the build.
 */
export function localAssetDirs(): string[] {
  return [
    // Production: the server bundle sits at dist/index.js next to dist/public.
    path.resolve(import.meta.dirname, "public", "manus-storage"),
    // Development / running from source.
    path.resolve(
      import.meta.dirname,
      "../..",
      "client",
      "public",
      "manus-storage"
    ),
    path.resolve(
      import.meta.dirname,
      "../..",
      "dist",
      "public",
      "manus-storage"
    ),
  ];
}

export function resolveLocalAsset(key: string): string | null {
  for (const dir of localAssetDirs()) {
    const candidate = path.resolve(dir, key);
    // Refuse anything that escapes the asset directory.
    if (!candidate.startsWith(dir + path.sep)) continue;
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile())
      return candidate;
  }
  return null;
}

export function registerStorageProxy(app: Express) {
  app.get("/manus-storage/*", async (req, res) => {
    const key = (req.params as Record<string, string>)[0];
    if (!key) {
      res.status(400).send("Missing storage key");
      return;
    }

    const local = resolveLocalAsset(key);
    if (local) {
      res.sendFile(local, {
        maxAge: "7d",
        headers: { "Cache-Control": "public, max-age=604800, immutable" },
      });
      return;
    }

    if (!ENV.forgeApiUrl || !ENV.forgeApiKey) {
      res.status(404).send("Not found");
      return;
    }

    try {
      const forgeUrl = new URL(
        "v1/storage/presign/get",
        ENV.forgeApiUrl.replace(/\/+$/, "") + "/"
      );
      forgeUrl.searchParams.set("path", key);

      const forgeResp = await fetch(forgeUrl, {
        headers: { Authorization: `Bearer ${ENV.forgeApiKey}` },
      });

      if (!forgeResp.ok) {
        const body = await forgeResp.text().catch(() => "");
        console.error(
          `[StorageProxy] forge error: ${forgeResp.status} ${body}`
        );
        res.status(502).send("Storage backend error");
        return;
      }

      const { url } = (await forgeResp.json()) as { url: string };
      if (!url) {
        res.status(502).send("Empty signed URL from backend");
        return;
      }

      res.set("Cache-Control", "no-store");
      res.redirect(307, url);
    } catch (err) {
      console.error("[StorageProxy] failed:", err);
      res.status(502).send("Storage proxy error");
    }
  });
}
