"use client";

import { useTranslations } from "next-intl";
import Marquee from "./ui/Marquee";

/**
 * Standards marquee. Honest social proof: what we're built on, not fake
 * client logos. Mono chips, constant speed.
 */
export default function StandardsStrip() {
  const t = useTranslations("standards");
  const items = t.raw("items") as string[];

  return (
    <section className="border-y border-line py-7">
      <p className="container-g mb-4 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-ink-2/70">
        {t("label")}
      </p>
      <Marquee speed={40}>
        {items.map((item) => (
          <span
            key={item}
            className="mx-3 inline-flex items-center gap-2.5 rounded-full border border-line px-5 py-2.5 font-mono text-[13px] text-ink-2"
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
              <path
                d="M4 12.5 L9.5 18 L20 6.5"
                stroke="var(--verify)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {item}
          </span>
        ))}
      </Marquee>
    </section>
  );
}
