import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useReducedMotion } from "../hooks/useReducedMotion";

interface CardCarouselProps {
  /** Accessible name for the carousel region, e.g. "Product showcase". */
  label: string;
  /** Plural item noun used in the arrow button labels, e.g. "products". */
  itemLabel: string;
  /**
   * Card items. The caller wraps each item in a sizing element
   * (e.g. `w-[82%] sm:w-[calc(50%-0.5rem)] shrink-0 snap-start`) so the
   * number of visible cards stays responsive.
   */
  children: ReactNode;
}

/**
 * A single-row, paged strip of cards with horizontal arrow controls.
 *
 * All items stay in the DOM inside a native horizontal scroll container, so
 * the content remains crawlable and every link stays clickable; the arrows
 * (plus swipe / keyboard arrows) page through them one viewport at a time.
 * Paging is instant when the visitor prefers reduced motion.
 */
export default function CardCarousel({
  label,
  itemLabel,
  children,
}: CardCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);

  const syncPage = useCallback(() => {
    const track = trackRef.current;
    if (!track || track.clientWidth === 0) return;
    const pages = Math.max(
      1,
      Math.ceil((track.scrollWidth - 1) / track.clientWidth)
    );
    const current = Math.min(
      pages,
      Math.max(1, Math.round(track.scrollLeft / track.clientWidth) + 1)
    );
    setPage(current);
    setPageCount(pages);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    syncPage();
    track.addEventListener("scroll", syncPage, { passive: true });
    window.addEventListener("resize", syncPage);
    return () => {
      track.removeEventListener("scroll", syncPage);
      window.removeEventListener("resize", syncPage);
    };
  }, [syncPage]);

  const goToPage = useCallback(
    (next: number) => {
      const track = trackRef.current;
      if (!track) return;
      const pages = Math.max(
        1,
        Math.ceil((track.scrollWidth - 1) / track.clientWidth)
      );
      const clamped = Math.min(pages, Math.max(1, next));
      track.scrollTo({
        left: (clamped - 1) * track.clientWidth,
        top: 0,
        behavior: reducedMotion ? "auto" : "smooth",
      });
    },
    [reducedMotion]
  );

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goToPage(page - 1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        goToPage(page + 1);
      }
    },
    [goToPage, page]
  );

  const controlClass =
    "w-10 h-10 rounded-xl glass border border-white/10 flex items-center justify-center " +
    "text-white/70 hover:text-white hover:bg-white/10 transition-all duration-150 active:scale-95 " +
    "disabled:opacity-30 disabled:pointer-events-none";

  return (
    <div>
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label={label}
        onKeyDown={onKeyDown}
      >
        <div
          ref={trackRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {children}
        </div>
      </div>
      {pageCount > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <p
            className="text-sm text-white/40"
            aria-live="polite"
            aria-atomic="true"
          >
            Page {page} of {pageCount}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => goToPage(page - 1)}
              disabled={page <= 1}
              aria-label={`Previous ${itemLabel}`}
              className={controlClass}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => goToPage(page + 1)}
              disabled={page >= pageCount}
              aria-label={`Next ${itemLabel}`}
              className={controlClass}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
