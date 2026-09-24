/** @vitest-environment jsdom */

/**
 * Keyboard navigation for tablists (used by the Architecture diagram
 * selector). moveTabFocus implements the roving-tabindex pattern: arrows
 * move focus AND activate the tab, Home/End jump to the ends, and the
 * direction follows aria-orientation.
 */
import "@testing-library/jest-dom/vitest";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { KeyboardEvent } from "react";
import { moveTabFocus } from "../../client/src/lib/tablist";

afterEach(() => {
  document.body.innerHTML = "";
  vi.restoreAllMocks();
});

function buildTablist({ vertical = false }: { vertical?: boolean } = {}) {
  const list = document.createElement("div");
  list.setAttribute("role", "tablist");
  if (vertical) list.setAttribute("aria-orientation", "vertical");
  const clicks: string[] = [];
  const tabs = ["alpha", "beta", "gamma"].map(id => {
    const tab = document.createElement("button");
    tab.setAttribute("role", "tab");
    tab.id = `tab-${id}`;
    tab.textContent = id;
    tab.addEventListener("click", () => clicks.push(id));
    list.appendChild(tab);
    return tab;
  });
  document.body.appendChild(list);
  return { list, tabs, clicks };
}

function keyEvent(
  list: HTMLElement,
  target: HTMLElement,
  key: string
): KeyboardEvent<HTMLElement> {
  return {
    currentTarget: list,
    target,
    key,
    preventDefault: vi.fn(),
  } as unknown as KeyboardEvent<HTMLElement>;
}

function press(
  list: HTMLElement,
  tabs: HTMLElement[],
  from: number,
  key: string
) {
  const event = keyEvent(list, tabs[from], key);
  moveTabFocus(event);
  return event;
}

describe("moveTabFocus (horizontal)", () => {
  it("moves right with ArrowRight and wraps past the last tab", () => {
    const { list, tabs } = buildTablist();
    press(list, tabs, 0, "ArrowRight");
    expect(document.activeElement).toBe(tabs[1]);
    press(list, tabs, 2, "ArrowRight");
    expect(document.activeElement).toBe(tabs[0]);
  });

  it("moves left with ArrowLeft and wraps before the first tab", () => {
    const { list, tabs } = buildTablist();
    press(list, tabs, 0, "ArrowLeft");
    expect(document.activeElement).toBe(tabs[2]);
    press(list, tabs, 1, "ArrowLeft");
    expect(document.activeElement).toBe(tabs[0]);
  });

  it("jumps with Home and End", () => {
    const { list, tabs } = buildTablist();
    press(list, tabs, 1, "Home");
    expect(document.activeElement).toBe(tabs[0]);
    press(list, tabs, 1, "End");
    expect(document.activeElement).toBe(tabs[2]);
  });

  it("activates the newly focused tab (roving tabindex pattern)", () => {
    const { list, tabs, clicks } = buildTablist();
    press(list, tabs, 0, "ArrowRight");
    expect(clicks).toEqual(["beta"]);
  });

  it("prevents the default key behavior on handled keys", () => {
    const { list, tabs } = buildTablist();
    const event = press(list, tabs, 0, "ArrowRight");
    expect(event.preventDefault).toHaveBeenCalledTimes(1);
  });
});

describe("moveTabFocus (vertical)", () => {
  it("uses ArrowDown/ArrowUp instead of ArrowLeft/ArrowRight", () => {
    const { list, tabs } = buildTablist({ vertical: true });
    press(list, tabs, 0, "ArrowDown");
    expect(document.activeElement).toBe(tabs[1]);
    press(list, tabs, 1, "ArrowUp");
    expect(document.activeElement).toBe(tabs[0]);
  });

  it("ignores horizontal arrows in a vertical tablist", () => {
    const { list, tabs } = buildTablist({ vertical: true });
    tabs[1].focus();
    const event = press(list, tabs, 1, "ArrowRight");
    expect(document.activeElement).toBe(tabs[1]);
    expect(event.preventDefault).not.toHaveBeenCalled();
  });
});

describe("moveTabFocus (ignored input)", () => {
  it("ignores unhandled keys", () => {
    const { list, tabs } = buildTablist();
    tabs[0].focus();
    const event = press(list, tabs, 0, "Enter");
    expect(document.activeElement).toBe(tabs[0]);
    expect(event.preventDefault).not.toHaveBeenCalled();
  });

  it("ignores events whose target is not a tab in the list", () => {
    const { list } = buildTablist();
    const outsider = document.createElement("button");
    document.body.appendChild(outsider);
    outsider.focus();
    const event = keyEvent(list, outsider, "ArrowRight");
    moveTabFocus(event);
    expect(document.activeElement).toBe(outsider);
    expect(event.preventDefault).not.toHaveBeenCalled();
  });

  it("ignores a tablist with no tabs", () => {
    const list = document.createElement("div");
    list.setAttribute("role", "tablist");
    document.body.appendChild(list);
    const event = keyEvent(list, list, "ArrowRight");
    expect(() => moveTabFocus(event)).not.toThrow();
    expect(event.preventDefault).not.toHaveBeenCalled();
  });
});
