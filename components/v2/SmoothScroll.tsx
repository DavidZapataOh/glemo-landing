"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import {
  gsap,
  ScrollTrigger,
  registerGsap,
  setLenis,
  prefersReducedMotion,
} from "@/lib/motion";

/**
 * Lenis smooth scroll synced to the GSAP ticker (Osmo tuning: smooth but fast).
 * Disabled entirely under prefers-reduced-motion — native scroll takes over.
 */
export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    registerGsap();
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({ lerp: 0.15, wheelMultiplier: 1.2 });
    setLenis(lenis);

    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return <>{children}</>;
}
