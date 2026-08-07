/**
 * The stack's facts, for use in page copy.
 *
 * Everything here resolves to shared/stack-data.ts, which `pnpm sync:stack`
 * regenerates by counting the sibling repositories. Import these instead of
 * typing a number into a page: the hand-written figures drifted badly — the
 * platform count read "52+" on nine pages while eos/boards held 83 board
 * definitions across 55 architectures.
 *
 * There is no latency or throughput constant here on purpose. The eos
 * repository contains no measured context-switch or interrupt-latency figure,
 * so the site has nothing to cite and must not state one as fact. Performance
 * targets belong on the roadmap, phrased as targets.
 */
import { STACK } from "@shared/stack-data";

export { STACK };

/** Board definitions in embeddedos-org/eos. */
export const BOARD_COUNT = STACK.totals.boards;

/** Distinct instruction-set architectures across those boards. */
export const ARCH_COUNT = STACK.totals.architectures;

/** Distinct silicon vendors across those boards. */
export const VENDOR_COUNT = STACK.totals.vendors;

/** Public repositories in the embeddedos-org organisation. */
export const REPO_COUNT = STACK.totals.repositories;

/** Distinct MCU families across the board definitions. */
export const FAMILY_COUNT = STACK.totals.families;

/**
 * Platforms EoSim can simulate. Deliberately separate from BOARD_COUNT — the
 * simulator covers a wider set than the kernel ships board files for, and the
 * site previously used one figure for both.
 */
export const SIM_PLATFORM_COUNT = STACK.totals.simulatedPlatforms;

/**
 * How the site writes the supported-hardware figure. One helper so the phrase
 * stays identical everywhere it appears.
 *
 * @example
 * boardsLabel()        // "83 boards"
 * boardsLabel(true)    // "83 boards across 55 architectures"
 */
export function boardsLabel(withArchitectures = false): string {
  const boards = `${BOARD_COUNT} boards`;
  return withArchitectures
    ? `${boards} across ${ARCH_COUNT} architectures`
    : boards;
}

/** Projects in one tier of the stack, in manifest order. */
export function projectsInTier(tier: number) {
  return STACK.projects.filter(p => p.tier === tier);
}

/** Roadmap entries that have shipped, newest last. */
export const SHIPPED_PROFILES = STACK.roadmap.filter(r => r.shipped);

/** Roadmap entries still planned. */
export const PLANNED_PROFILES = STACK.roadmap.filter(r => !r.shipped);
