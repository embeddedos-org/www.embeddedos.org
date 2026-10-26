import { useEffect, useState, type RefObject } from "react";

/**
 * Whether an element is on screen (or within `rootMargin` of it). Animated
 * canvases use it to stop drawing while nobody can see them, so a page with
 * several of them costs nothing once they are scrolled away.
 *
 * Starts as `true`, so a canvas paints its first frame before the observer
 * reports; without IntersectionObserver it stays `true`.
 */
export function useOnScreen<T extends Element>(
  ref: RefObject<T | null>,
  rootMargin = "120px"
): boolean {
  const [onScreen, setOnScreen] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      { rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin]);

  return onScreen;
}
