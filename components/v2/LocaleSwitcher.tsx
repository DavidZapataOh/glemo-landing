"use client";

import { useLocale } from "next-intl";
import { useTransition } from "react";
import { setUserLocale } from "@/services/locale";
import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

/**
 * EN/ES toggle. Locale is stored in a cookie (services/locale) and the page
 * re-renders server-side. Full copy parity between both languages.
 */
export default function LocaleSwitcher({
  variant = "dark",
}: {
  variant?: "dark" | "paper";
}) {
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();

  const set = (l: Locale) =>
    startTransition(() => {
      void setUserLocale(l);
    });

  const base =
    "px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.08em] rounded-full transition-colors duration-200";

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border p-0.5",
        variant === "dark" ? "border-line" : "border-paper-line",
        isPending && "opacity-60"
      )}
      role="group"
      aria-label="Language"
    >
      {(["en", "es"] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => set(l)}
          aria-pressed={locale === l}
          className={cn(
            base,
            locale === l
              ? "bg-verify text-[oklch(0.17_0.03_170)] font-medium"
              : variant === "dark"
                ? "text-ink-2 hover:text-ink"
                : "text-paper-ink-2 hover:text-paper-ink"
          )}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
