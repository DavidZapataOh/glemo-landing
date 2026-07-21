"use client";

import { useEffect, useRef } from "react";
import {
  gsap,
  SplitText,
  registerGsap,
  prefersReducedMotion,
  EASE,
  DUR,
} from "@/lib/motion";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  as?: "h1" | "h2" | "p" | "div";
  className?: string;
  /** delay in seconds before the reveal starts (used by the hero timeline) */
  delay?: number;
  /** if false, plays immediately on mount instead of on scroll */
  onScroll?: boolean;
};

/**
 * Masked-line reveal (the Osmo pattern): lines rise from behind a mask with a
 * slight rotation that straightens. Reserved for the hero and the two
 * statement headings, not a universal section reflex.
 * Content is visible by default; the animation only *starts* from a hidden
 * state when JS + motion are available (no blank sections in headless/reader).
 */
export default function SplitReveal({
  children,
  as: Tag = "h2",
  className,
  delay = 0,
  onScroll = true,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    registerGsap();
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const split = new SplitText(el, {
      type: "lines",
      mask: "lines",
      linesClass: "split-line",
    });

    const tween = gsap.from(split.lines, {
      yPercent: 110,
      rotate: 4,
      duration: DUR.reveal,
      ease: EASE,
      stagger: 0.07,
      delay,
      ...(onScroll
        ? {
            scrollTrigger: {
              trigger: el,
              start: "clamp(top 82%)",
              once: true,
            },
          }
        : {}),
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      split.revert();
    };
  }, [delay, onScroll]);

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} className={cn(className)}>
      {children}
    </Tag>
  );
}
