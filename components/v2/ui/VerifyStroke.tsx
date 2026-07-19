"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGsap, prefersReducedMotion } from "@/lib/motion";

/**
 * The brand ritual: a hand-drawn verification stroke that "signs" the key
 * word — an underline that resolves into a check. Draws itself in after a
 * delay (post hero-timeline). Used twice on the whole page: hero + final CTA.
 */
export default function VerifyStroke({
  delay = 1.4,
  className,
  onScroll = false,
}: {
  delay?: number;
  className?: string;
  /** draw when scrolled into view instead of on mount (final CTA) */
  onScroll?: boolean;
}) {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    registerGsap();
    const path = pathRef.current;
    if (!path) return;

    const length = path.getTotalLength();
    if (prefersReducedMotion()) {
      path.style.strokeDasharray = "none";
      return;
    }
    const tween = gsap.fromTo(
      path,
      { strokeDasharray: length, strokeDashoffset: length },
      {
        strokeDashoffset: 0,
        duration: 0.7,
        delay,
        ease: "power2.inOut",
        ...(onScroll
          ? {
              scrollTrigger: {
                trigger: path,
                start: "top 85%",
                once: true,
              },
            }
          : {}),
      }
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [delay, onScroll]);

  return (
    <svg
      viewBox="0 0 220 26"
      fill="none"
      aria-hidden="true"
      className={className}
      preserveAspectRatio="none"
    >
      {/* Underline that ends in a check tick — drawn like a signature */}
      <path
        ref={pathRef}
        d="M4 18 C 50 23, 120 21, 168 15 C 176 14, 182 15, 186 19 L 193 24 L 215 3"
        stroke="var(--verify)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
