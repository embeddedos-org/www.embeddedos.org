/** Which frame set suits this screen and machine, and whether the machine is weak. */
export function frameTier(): {
  set: "d" | "h" | "m";
  weak: boolean;
  small: boolean;
  slow: boolean;
};
/** Wires the homepage story, film, explorer and showcase inside host; the returned function undoes all of it. */
export function mountBlack(host: HTMLElement): () => void;
