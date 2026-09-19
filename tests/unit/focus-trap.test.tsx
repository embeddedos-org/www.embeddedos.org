/** @vitest-environment jsdom */

/**
 * Focus-trap behavior for modal dialogs (F-19, F-20).
 *
 * EBot and SearchModal share the useFocusTrap hook extracted from DonateModal.
 * These tests fail if the trap regresses: Tab must cycle inside the panel
 * (WCAG 2.4.3), focus must move in on open, and focus must return to the
 * opener on close.
 */
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useRef, useState } from "react";
import { focusableWithin, useFocusTrap } from "../../client/src/lib/focus-trap";

// jsdom does not implement layout, so offsetParent is always null. Stub it so
// "attached to the document" counts as visible, matching browser behavior for
// these flat test fixtures.
beforeEach(() => {
  Object.defineProperty(HTMLElement.prototype, "offsetParent", {
    configurable: true,
    get() {
      return this.parentNode instanceof HTMLElement ? this.parentNode : null;
    },
  });
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

function Dialog({
  active,
  onClose,
}: {
  active: boolean;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  useFocusTrap(active, panelRef);
  if (!active) return null;
  return (
    <div ref={panelRef} role="dialog" aria-label="Test dialog" tabIndex={-1}>
      <button>First</button>
      <input aria-label="Name" />
      <button onClick={onClose}>Last</button>
    </div>
  );
}

function Harness() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>Open dialog</button>
      <Dialog active={open} onClose={() => setOpen(false)} />
    </>
  );
}

describe("focusableWithin", () => {
  it("returns tabbable descendants in DOM order, skipping disabled and tabindex=-1", () => {
    render(
      <div data-testid="root">
        <button>one</button>
        <button disabled>nope</button>
        <div tabIndex={-1}>nope</div>
        <a>no href, nope</a>
        <a href="/x">two</a>
        <input aria-label="three" />
      </div>
    );
    const root = screen.getByTestId("root");
    const names = focusableWithin(root).map(
      el => el.textContent || el.getAttribute("aria-label")
    );
    expect(names).toEqual(["one", "two", "three"]);
  });
});

describe("useFocusTrap", () => {
  it("moves focus into the panel on open", () => {
    render(<Harness />);
    fireEvent.click(screen.getByText("Open dialog"));
    expect(screen.getByText("First")).toHaveFocus();
  });

  it("wraps Tab from the last focusable back to the first", () => {
    render(<Harness />);
    fireEvent.click(screen.getByText("Open dialog"));
    const last = screen.getByText("Last");
    last.focus();
    fireEvent.keyDown(document, { key: "Tab" });
    expect(screen.getByText("First")).toHaveFocus();
  });

  it("wraps Shift+Tab from the first focusable to the last", () => {
    render(<Harness />);
    fireEvent.click(screen.getByText("Open dialog"));
    const first = screen.getByText("First") as HTMLElement;
    expect(first).toHaveFocus();
    fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
    expect(screen.getByText("Last")).toHaveFocus();
  });

  it("does not trap Tab when the dialog is closed", () => {
    render(<Harness />);
    const opener = screen.getByText("Open dialog");
    opener.focus();
    fireEvent.keyDown(document, { key: "Tab" });
    // No dialog in the DOM: the keydown listener is gone, so nothing steals
    // focus and no error is thrown.
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("returns focus to the opener on close", () => {
    render(<Harness />);
    const opener = screen.getByText("Open dialog");
    opener.focus();
    fireEvent.click(opener);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Last")); // closes the dialog
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(opener).toHaveFocus();
  });
});
