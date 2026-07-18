"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";

/**
 * Glemo motion system.
 * One signature ease everywhere; back.out reserved for the hero CTA only.
 * Durations follow the 100/300/500 rule; exits run at ~75% of entrances.
 */
let registered = false;

export function registerGsap() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);
  CustomEase.create("glemo", "0.625, 0.05, 0, 1");
  registered = true;
}

export const EASE = "glemo" as const;
export const EASE_CSS = "cubic-bezier(0.625, 0.05, 0, 1)" as const;

export const DUR = {
  micro: 0.3,
  fade: 0.5,
  reveal: 0.8,
  hero: 0.9,
} as const;

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* Shared Lenis handle so the nav can drive smooth anchor scrolling. */
type LenisLike = {
  scrollTo: (
    target: string | number | HTMLElement,
    opts?: { offset?: number; duration?: number }
  ) => void;
  destroy: () => void;
  raf: (time: number) => void;
  on: (event: "scroll", cb: () => void) => void;
};

let lenisInstance: LenisLike | null = null;
export function setLenis(l: LenisLike | null) {
  lenisInstance = l;
}
export function getLenis(): LenisLike | null {
  return lenisInstance;
}

export { gsap, ScrollTrigger, SplitText };
