import { useEffect, useRef, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
  liftScale?: number;
  glare?: boolean;
}

/**
 * Wraps a card in a mouse-driven 3D tilt + glare effect, matching the
 * WebGL-heavy visual language already used elsewhere on the site with a
 * much cheaper, dependency-free CSS transform. Respects prefers-reduced-motion
 * (renders a static wrapper, no listeners). Mutates the DOM directly instead
 * of going through React state so many cards on one page stay cheap.
 */
export default function TiltCard({
  children,
  className = "",
  maxTilt = 8,
  liftScale = 1.02,
  glare = true,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = cardRef.current;
    if (!el || reducedMotion) return;

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const rotateY = (px - 0.5) * maxTilt * 2;
      const rotateX = -(py - 0.5) * maxTilt * 2;
      el.style.transition = "transform 0.05s linear";
      el.style.transform = `rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale(${liftScale})`;
      if (glareRef.current) {
        glareRef.current.style.background = `radial-gradient(circle at ${(px * 100).toFixed(1)}% ${(py * 100).toFixed(1)}%, rgba(255,255,255,0.12), transparent 60%)`;
        glareRef.current.style.opacity = "1";
      }
    };

    const handleLeave = () => {
      el.style.transition = "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)";
      el.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
      if (glareRef.current) glareRef.current.style.opacity = "0";
    };

    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);
    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
    };
  }, [maxTilt, liftScale, reducedMotion]);

  return (
    <div className="h-full" style={{ perspective: "1200px" }}>
      <div
        ref={cardRef}
        className={`relative h-full ${className}`}
        style={{ transformStyle: "preserve-3d", willChange: "transform" }}
      >
        {children}
        {glare && !reducedMotion && (
          <div
            ref={glareRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300"
          />
        )}
      </div>
    </div>
  );
}
