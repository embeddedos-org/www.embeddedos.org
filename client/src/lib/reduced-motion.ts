import { useEffect, useState } from "react";

/**
 * Reactive `prefers-reduced-motion` (F-23).
 *
 * Canvas components gate their ambient requestAnimationFrame loops behind
 * this: with reduced motion they paint one static frame and stop, instead of
 * running a perpetual animation the visitor asked not to see. Re-runs the
 * consuming effect when the preference changes so toggling the OS setting
 * starts/stops the loop live.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
