import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * P-02: renders children only once the wrapper is near the viewport (and,
 * optionally, once the browser is idle). 3D canvases are React.lazy, so the
 * dynamic import — and the ~230KB gzipped three.js/fiber chunk behind it —
 * only downloads when the visitor can actually see the canvas, instead of
 * on page mount for canvases buried below the fold.
 *
 * The prerenderer scrolls the whole page before snapshotting, so gated
 * content still resolves into the prerendered HTML; canvases carry no text
 * content, so the snapshot is unaffected either way.
 */
export default function ViewportGate({
  children,
  rootMargin = "600px",
  waitForIdle = true,
}: {
  children: ReactNode;
  rootMargin?: string;
  waitForIdle?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let idleId: number | undefined;
    const reveal = () => setShow(true);
    const kick = () => {
      if (!waitForIdle || !("requestIdleCallback" in window)) {
        reveal();
        return;
      }
      idleId = window.requestIdleCallback(reveal, { timeout: 4000 });
    };

    if (typeof IntersectionObserver === "undefined") {
      kick();
      return () => {
        if (idleId !== undefined) window.cancelIdleCallback(idleId);
      };
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          io.disconnect();
          kick();
        }
      },
      { rootMargin }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (idleId !== undefined) window.cancelIdleCallback(idleId);
    };
  }, [rootMargin, waitForIdle]);

  // h-full w-full: every canvas using this gate lives in a fixed-height
  // container, and the fiber canvas sizes to its parent.
  return (
    <div ref={ref} className="h-full w-full">
      {show ? children : null}
    </div>
  );
}
