"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type Props = {
  children: React.ReactNode;
  href: string;
  variant?: "primary" | "ghost" | "paper";
  size?: "md" | "lg";
  className?: string;
};

/**
 * CTA button. `primary` is the only element on the page allowed to wear the
 * verification green as a fill. Accent discipline is the brand.
 */
export default function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  className,
}: Props) {
  return (
    <motion.a
      href={href}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.2, ease: [0.625, 0.05, 0, 1] }}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-bold whitespace-nowrap select-none",
        size === "lg" ? "px-7 py-[0.95rem] text-[1.0625rem]" : "px-6 py-3 text-base",
        variant === "primary" &&
          "bg-verify text-[oklch(0.17_0.03_170)] hover:bg-verify-strong shadow-[0_0_24px_-8px_var(--verify)]",
        variant === "ghost" &&
          "border border-line text-ink hover:bg-surface hover:border-transparent",
        variant === "paper" &&
          "border border-paper-line text-paper-ink hover:bg-[oklch(0.93_0.01_165)]",
        className
      )}
    >
      {children}
    </motion.a>
  );
}
