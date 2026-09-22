import type { KeyboardEvent } from "react";

export function moveTabFocus(event: KeyboardEvent<HTMLElement>): void {
  const list = event.currentTarget;
  const vertical = list.getAttribute("aria-orientation") === "vertical";
  const previous = vertical ? "ArrowUp" : "ArrowLeft";
  const next = vertical ? "ArrowDown" : "ArrowRight";
  const tabs = Array.from(list.querySelectorAll<HTMLElement>('[role="tab"]'));
  const from = tabs.indexOf(event.target as HTMLElement);
  if (from < 0) return;
  let to: number;
  if (event.key === "Home") to = 0;
  else if (event.key === "End") to = tabs.length - 1;
  else if (event.key === previous) to = (from - 1 + tabs.length) % tabs.length;
  else if (event.key === next) to = (from + 1) % tabs.length;
  else return;
  event.preventDefault();
  tabs[to].focus();
  tabs[to].click();
}
