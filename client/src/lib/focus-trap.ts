import { useEffect, useRef, type RefObject } from "react";

/**
 * Shared focus-trap + focus-return for modal dialogs (F-19, F-20).
 *
 * Extracted from the DonateModal implementation, which was the one dialog
 * that did this right: while `active`, Tab cycles inside the panel instead
 * of wandering into the page behind the overlay (WCAG 2.4.3); focus moves
 * into the panel on open; and on close focus returns to whatever opened the
 * dialog instead of dropping to <body>.
 *
 * The panel element should carry tabIndex={-1} so the `(first ?? panel)`
 * fallback has somewhere to land when the dialog has no tabbable content
 * yet (e.g. still animating in).
 */
export function focusableWithin(root: HTMLElement): HTMLElement[] {
  return Array.from(
    root.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), ' +
        'textarea:not([disabled]), select:not([disabled]), ' +
        '[tabindex]:not([tabindex="-1"])'
    )
  ).filter(
    el =>
      el instanceof HTMLElement &&
      (el.offsetParent !== null || el === document.activeElement)
  ) as HTMLElement[];
}

export function useFocusTrap(
  active: boolean,
  panelRef: RefObject<HTMLElement | null>
): void {
  const returnFocusTo = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) return;
    const panel = panelRef.current;
    if (!panel) return;

    returnFocusTo.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    (focusableWithin(panel)[0] ?? panel).focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const focusable = focusableWithin(panel);
      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const current = document.activeElement;

      if (!panel.contains(current)) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
      } else if (e.shiftKey && current === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && current === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown, true);
    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      returnFocusTo.current?.focus();
    };
  }, [active, panelRef]);
}
