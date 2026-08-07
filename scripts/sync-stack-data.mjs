/**
 * Regenerates shared/stack-data.json from the sibling EmbeddedOS repositories.
 *
 * The website used to state the stack's shape from memory, and it drifted: the
 * platform count read "52+" on four pages while eos/boards held 83 definitions,
 * and the kernel's timing was quoted as "sub-1ms", "<=10us" and "sub-1us" on
 * three different pages. Everything this script emits is counted or copied from
 * a source repository, so a number can only change when the source changes.
 *
 * The output is committed. The website builds from the committed JSON and never
 * reads the sibling repos, so CI and a fresh clone work without them. Run this
 * when the stack changes:
 *
 *   pnpm sync:stack
 *
 * Deliberately absent: performance figures. No measured context-switch or
 * interrupt-latency number exists in the eos repository — its only benchmark
 * (tests/test_performance_benchmarks.c) times a host loop, not the kernel — so
 * there is nothing here to copy and the site must not assert one as fact.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const WORKSPACE = path.resolve(ROOT, "..");
const MANIFEST_REPO = path.join(WORKSPACE, "eos-stack-manifest");
const MANIFEST = path.join(MANIFEST_REPO, "manifest.json");
const ROADMAP = path.join(MANIFEST_REPO, "docs", "roadmap.md");
const BOARDS = path.join(WORKSPACE, "eos", "boards");
// EoSim simulates a wider set than the kernel has board files for, so the two
// counts are genuinely different and the site must not use one for the other.
const SIM_PLATFORMS = path.join(WORKSPACE, "EoSim", "platforms");
// Emitted as TypeScript rather than JSON so the data arrives typed without
// turning on resolveJsonModule for the whole project.
const OUT = path.join(ROOT, "shared", "stack-data.ts");

/** Fail loudly rather than emitting a file that silently drops a section. */
function require_(p, what) {
  if (!fs.existsSync(p)) {
    console.error(
      `[sync:stack] missing ${what}: ${p}\n` +
        `  This script reads the sibling repositories in ${WORKSPACE}.\n` +
        `  Clone them, or leave shared/stack-data.json as committed.`
    );
    process.exit(1);
  }
  return p;
}

/**
 * Reads one scalar field from each board YAML. The board files are flat enough
 * that a line match is exact here, which keeps a YAML parser out of the
 * dependency tree for four fields.
 */
function boardField(text, field) {
  const m = text.match(new RegExp(`^\\s*${field}\\s*:\\s*(.+)$`, "m"));
  return m ? m[1].trim().replace(/^["']|["']$/g, "") : null;
}

function readBoards(dir) {
  const files = fs.readdirSync(dir).filter(f => f.endsWith(".yaml"));
  const arch = new Set();
  const family = new Set();
  const vendor = new Set();

  for (const f of files) {
    const text = fs.readFileSync(path.join(dir, f), "utf8");
    const a = boardField(text, "arch");
    const fam = boardField(text, "family");
    const v = boardField(text, "vendor");
    if (a) arch.add(a);
    if (fam) family.add(fam);
    if (v) vendor.add(v);
  }

  return {
    boards: files.length,
    architectures: arch.size,
    families: family.size,
    vendors: vendor.size,
    architectureList: [...arch].sort(),
    vendorList: [...vendor].sort(),
  };
}

/**
 * Parses the eFab profile table. Each row is a release that bundles repos for
 * one use case, which is the only place the stack records what is shipped
 * versus planned.
 */
function readRoadmap(file) {
  const rows = fs
    .readFileSync(file, "utf8")
    .split("\n")
    .filter(l => /^\|/.test(l) && !/^\|\s*-+/.test(l))
    .map(l =>
      l
        .split("|")
        .slice(1, -1)
        .map(c => c.trim().replace(/\*\*/g, "").replace(/`/g, ""))
    )
    .filter(c => c.length >= 5 && /^v?\d/.test(c[0]));

  return rows.map(([version, profile, repos, useCase, status]) => ({
    version: version.replace(/^v/, ""),
    profile,
    repos: repos
      .split(/\s*\+\s*/)
      .map(r => r.trim())
      .filter(Boolean),
    useCase,
    shipped: /shipped|✅/i.test(status),
    status: status.replace(/[✅]/g, "").trim(),
  }));
}

function main() {
  require_(MANIFEST, "eos-stack-manifest/manifest.json");
  require_(BOARDS, "eos/boards");
  require_(ROADMAP, "eos-stack-manifest/docs/roadmap.md");

  const manifest = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
  const projects = Object.values(manifest.projects).map(p => ({
    name: p.name,
    repo: p.repo,
    tier: p.tier,
    type: p.type,
    platform: p.platform,
    language: p.language,
    // The manifest descriptions carry unverified performance figures; the
    // website states capability, not numbers, so only the first clause is kept.
    description: String(p.description || "")
      .split("—")
      .slice(1)
      .join("—")
      .trim()
      .split(/\.\s/)[0]
      .trim(),
  }));

  const hardware = readBoards(BOARDS);
  const roadmap = readRoadmap(ROADMAP);
  const simulatedPlatforms = fs.existsSync(SIM_PLATFORMS)
    ? fs.readdirSync(SIM_PLATFORMS).length
    : null;

  const data = {
    source: {
      manifest: "embeddedos-org/eos-stack-manifest",
      manifestUpdated: manifest.lastUpdated,
      boards: "embeddedos-org/eos (boards/*.yaml)",
    },
    totals: {
      repositories: manifest.totalRepos,
      projects: projects.length,
      ...hardware,
      simulatedPlatforms,
    },
    tiers: {
      1: "Core OS",
      2: "Platform Tools",
      3: "Applications",
      4: "Web & Docs",
      5: "Meta",
    },
    projects,
    roadmap,
  };

  const banner =
    "/**\n" +
    " * GENERATED FILE — do not edit by hand.\n" +
    " *\n" +
    " * Regenerate with `pnpm sync:stack`, which counts and copies from the sibling\n" +
    " * EmbeddedOS repositories. Every figure here is derived from a source repo, so\n" +
    " * the website cannot drift from the stack the way it did when these numbers\n" +
    " * were written by hand.\n" +
    " *\n" +
    " * See scripts/sync-stack-data.mjs for what is deliberately not included.\n" +
    " */\n\n";

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(
    OUT,
    banner +
      "export const STACK = " +
      JSON.stringify(data, null, 2) +
      " as const;\n\nexport type StackProject = (typeof STACK.projects)[number];\n" +
      "export type RoadmapEntry = (typeof STACK.roadmap)[number];\n"
  );

  console.log(
    `[sync:stack] ${projects.length} projects · ${hardware.boards} boards · ` +
      `${hardware.architectures} architectures · ${roadmap.length} roadmap entries -> ${path.relative(ROOT, OUT)}`
  );
}

main();
