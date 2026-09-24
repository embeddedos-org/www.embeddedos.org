import { useEffect, useRef } from "react";

type noop = (...args: any[]) => any;

/**
 * usePersistFn instead of useCallback to reduce cognitive load
 */
export function usePersistFn<T extends noop>(fn: T) {
  const fnRef = useRef<T>(fn);
  // The ref update lives in an effect, never during render: assigning
  // fnRef.current = fn in the render body is a render-phase side effect
  // (React may discard renders, leaving the ref stale or torn). The stable
  // wrapper below reads fnRef.current only when it is actually called, by
  // which point the effect has run.
  useEffect(() => {
    fnRef.current = fn;
  });

  const persistFn = useRef<T>(null);
  if (!persistFn.current) {
    persistFn.current = function (this: unknown, ...args) {
      return fnRef.current!.apply(this, args);
    } as T;
  }

  return persistFn.current!;
}
