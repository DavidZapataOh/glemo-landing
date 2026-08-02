"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** pure-fade cascade (the Pop pattern), no vertical travel */
  delay?: number;
  y?: number;
};

/**
 * Restrained viewport reveal for content blocks: fade with minimal travel,
 * once only. Enhance-first, strictly: the element is visible in server HTML
 * and at every moment JS is absent, slow or headless. The entrance is a
 * one-shot WAAPI animation played only when the observer actually fires,
 * and only for blocks that were below the fold at hydration.
 */
export default function Reveal({ children, className, delay = 0, y = 14 }: Props) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    // Already on screen: never hide what the visitor can see.
    if (el.getBoundingClientRect().top <= window.innerHeight) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        io.disconnect();
        el.animate(
          [
            { opacity: 0, transform: `translateY(${y}px)` },
            { opacity: 1, transform: "translateY(0)" },
          ],
          {
            duration: 500,
            delay: delay * 1000,
            easing: "cubic-bezier(0.625, 0.05, 0, 1)",
            fill: "backwards",
          },
        );
      },
      { rootMargin: "-12% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced, delay, y]);

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}
