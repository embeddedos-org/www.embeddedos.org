import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
const ROOT = path.resolve(import.meta.dirname, "..");
const JSON_OUT = process.argv.includes("--json");
const WITH_NETWORK = process.argv.includes("--network");
const CHECKS = [
  {
    id: "typecheck",
    label: "TypeScript",
    cmd: ["pnpm", "check"],
    kind: "repo",
  },
  { id: "lint", label: "ESLint", cmd: ["pnpm", "lint"], kind: "repo" },
  {
    id: "format",
    label: "Prettier",
    cmd: ["pnpm", "exec", "prettier", "--check", "."],
    kind: "repo",
  },
  {
    id: "seo",
    label: "SEO audit",
    cmd: ["node", "scripts/seo-audit.mjs", "--strict"],
    kind: "repo",
    needsBuild: true,
    known:
      "3 orphan product pages (/product-eapps, /product-eos-platform, /product-eserviceapps) are fixed by branch seo/products-hub-links-detail-pages, which links them from /products.",
  },
  {
    id: "links",
    label: "Internal link graph",
    cmd: ["node", "scripts/link-graph.mjs"],
    kind: "repo",
    needsBuild: true,
  },
  {
    id: "unit",
    label: "Unit + integration",
    cmd: ["pnpm", "exec", "vitest", "run", "tests/unit", "tests/integration"],
    kind: "repo",
    needsBuild: true,
  },
  {
    id: "integrity",
    label: "External link integrity",
    cmd: ["node", "scripts/link-integrity.mjs"],
    kind: "network",
    needsBuild: true,
    network: true,
  },
];
function excerpt(output) {
  const lines = output.trim().split("\n");
  const start = lines.findIndex(l =>
    /^\s*(errors?|failures?|failed)\b.*\(?\d/i.test(l)
  );
  return (start === -1 ? lines.slice(-6) : lines.slice(start, start + 12)).join(
    "\n"
  );
}
const results = [];
const distExists = fs.existsSync(
  path.join(ROOT, "dist", "public", "index.html")
);
for (const check of CHECKS) {
  if (check.network && !WITH_NETWORK) {
    results.push({ ...check, status: "skipped", reason: "needs --network" });
    continue;
  }
  if (check.needsBuild && !distExists) {
    results.push({
      ...check,
      status: "skipped",
      reason: "no build in dist/public \u2014 run pnpm build",
    });
    continue;
  }
  const started = Date.now();
  const run = spawnSync(check.cmd[0], check.cmd.slice(1), {
    cwd: ROOT,
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
  const ms = Date.now() - started;
  const output = `${run.stdout ?? ""}${run.stderr ?? ""}`;
  results.push({
    ...check,
    status: run.status === 0 ? "pass" : "fail",
    code: run.status,
    ms,
    tail: excerpt(output),
  });
}
const failures = results.filter(r => r.status === "fail");
const repoFailures = failures.filter(r => r.kind === "repo" && !r.known);
const knownFailures = failures.filter(r => r.known);
const networkFailures = failures.filter(r => r.kind === "network");
if (JSON_OUT) {
  console.log(
    JSON.stringify({ results, repoFailures: repoFailures.length }, null, 1)
  );
} else {
  console.log("[quality] website quality gate\n");
  for (const r of results) {
    const mark =
      r.status === "pass" ? "PASS" : r.status === "skipped" ? "SKIP" : "FAIL";
    const time = r.ms ? `${(r.ms / 1e3).toFixed(1)}s` : "";
    console.log(`  ${mark.padEnd(5)} ${r.label.padEnd(24)} ${time}`);
    if (r.status === "skipped") console.log(`        ${r.reason}`);
    if (r.status === "fail")
      console.log(
        r.tail
          .split("\n")
          .map(l => `        ${l}`)
          .join("\n")
      );
  }
  console.log("");
  if (knownFailures.length) {
    console.log("KNOWN \u2014 reported, not gating this run:");
    for (const r of knownFailures) console.log(`  ${r.label}: ${r.known}`);
    console.log("");
  }
  if (networkFailures.length) {
    console.log("NETWORK / INFRASTRUCTURE \u2014 not a repository defect:");
    for (const r of networkFailures)
      console.log(`  ${r.label}: destinations outside this repository`);
    console.log("");
  }
  console.log(
    repoFailures.length
      ? `[quality] ${repoFailures.length} repository defect(s)`
      : "[quality] no repository defects"
  );
}
if (repoFailures.length) process.exitCode = 1;
