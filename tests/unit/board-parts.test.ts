/**
 * The board showcase marks each board's parts with dots (client/src/black/parts.ts, generated from the boards'
 * KiCad files) and finds them by the showcase's board slugs (client/src/black/data.ts). A board added or renamed
 * on one side only would show no dots, or another board's, without any error, so the two lists are pinned
 * together here. Every dot must also sit on the stage image and say what its part is.
 */
import { describe, expect, it } from "vitest";
import { EOS_BOARDS } from "../../client/src/black/data";
import { BOARD_PARTS } from "../../client/src/black/parts";

describe("board showcase parts", () => {
  it("marks parts on exactly the showcase's boards", () => {
    expect(Object.keys(BOARD_PARTS).sort()).toEqual(
      EOS_BOARDS.map(b => b.slug).sort()
    );
  });

  it.each(Object.entries(BOARD_PARTS))(
    "%s: each dot is on the board image and names its part once",
    (_, parts) => {
      expect(parts.length).toBeGreaterThan(0);
      const refs = new Set<string>();
      for (const p of parts) {
        expect(p.ref).toMatch(/^[A-Z]+\d+$/);
        expect(refs.has(p.ref)).toBe(false);
        refs.add(p.ref);
        expect(p.name.trim()).not.toBe("");
        expect(p.note.trim().length).toBeGreaterThan(10);
        for (const v of [p.x, p.y]) {
          expect(v).toBeGreaterThan(0);
          expect(v).toBeLessThan(1);
        }
      }
    }
  );
});
