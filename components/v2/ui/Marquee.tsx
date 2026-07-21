"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** px per second, constant speed regardless of content width (Osmo rule) */
  speed?: number;
};

/**
 * Constant-speed infinite marquee. Content is duplicated once; duration is
 * derived from measured width / speed so every marquee moves at the same
 * velocity. Pauses on hover; stops under prefers-reduced-motion (CSS).
 */
export default function Marquee({ children, className, speed = 50 }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const setDuration = () => {
      const width = track.scrollWidth / 2;
      track.style.setProperty("--marquee-duration", `${width / speed}s`);
    };
    setDuration();
    const ro = new ResizeObserver(setDuration);
    ro.observe(track);
    return () => ro.disconnect();
  }, [speed]);

  return (
    <div className={cn("overflow-hidden marquee-mask", className)} aria-hidden="true">
      <div ref={trackRef} className="marquee-track">
        {children}
        {children}
      </div>
    </div>
  );
}
