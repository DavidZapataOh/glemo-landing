"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** pure-fade cascade (the Pop pattern) — no vertical travel */
  delay?: number;
  y?: number;
};

/**
 * Restrained viewport reveal for content blocks: fade with minimal travel,
 * once only. Used sparingly — sections with purpose-built motion (terminal,
 * counters, pinned scrub) don't stack this on top.
 */
export default function Reveal({ children, className, delay = 0, y = 14 }: Props) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={cn(className)}
      initial={reduced ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ duration: 0.5, delay, ease: [0.625, 0.05, 0, 1] }}
    >
      {children}
    </motion.div>
  );
}
