import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

// The getting-started guide must only show commands that exist and were run.
// Each forbidden string below was on the page and was false when checked on
// 2026-10-01 against ebuild 3.0.1 / EoSim 3.0.1 / eos master.
const page = readFileSync(
  resolve(__dirname, "../../client/src/pages/GettingStarted.tsx"),
  "utf8"
);
const demo = readFileSync(
  resolve(__dirname, "../../client/src/pages/Demo.tsx"),
  "utf8"
);

describe("getting-started guide truth", () => {
  it.each([
    ["ebuild cad ", "there is no `ebuild cad` command; it is `ebuild analyze`"],
    ["ebuild sim --gdb", "ebuild sim has no --gdb flag"],
    ["ebuild sim --gui", "ebuild sim has no --gui flag"],
    ["--bsp", "neither init nor sim accepts --bsp"],
    ["eosim inject", "eosim has no inject command"],
    ["ebuild eapp new", "ebuild has no eapp command"],
    ["ebuild eflow open", "ebuild has no eflow command"],
    ["embeddedos-ebuild[cad]", "there is no [cad] extra"],
    ["ebuild.toml", "projects use build.yaml and eos.yaml"],
    ["ebuild v2.1.0", "ebuild reports 'ebuild, version 3.0.1'"],
    ["EoSim v1.4.0", "EoSim is 3.0.1"],
    ["EmbeddedOS v2.5.0 starting", "invented boot banner"],
    [
      "bundles the Xtensa GCC toolchain",
      "ebuild does not bundle any toolchain",
    ],
    [
      "runs entirely in your browser using WebAssembly",
      "/demo is a JavaScript visualisation",
    ],
  ])("does not claim %s", needle => {
    expect(page).not.toContain(needle);
  });

  it("installs from GitHub until a PyPI release exists", () => {
    expect(page).toContain(
      '"embeddedos-ebuild @ git+https://github.com/embeddedos-org/ebuild"'
    );
    expect(page).not.toMatch(
      /\npip install embeddedos-ebuild embeddedos-eosim\\n/
    );
  });

  it("documents the verified simulator path", () => {
    for (const cmd of [
      "ebuild setup",
      "ebuild init my-blink --template rtos --target stm32f4",
      "ebuild sim",
      "ebuild platforms list",
    ]) {
      expect(page).toContain(cmd);
    }
  });

  it("does not call the demo an emulator or reference headers that do not exist", () => {
    expect(demo).not.toContain("all simulated in-browser");
    expect(demo).not.toContain("Run real EoS firmware code in your browser");
    expect(demo).not.toContain("eos/gpio.h");
  });
});
