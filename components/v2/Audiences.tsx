"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Reveal from "./ui/Reveal";
import { cn } from "@/lib/utils";

type Tab = { id: string; label: string; headline: string; points: string[] };

/**
 * Audiences: the Auth0 sticky-rail idea distilled into a tab rail. One
 * section serves both sides of the network (plus developers) without
 * duplicating the page or falling into an identical card grid.
 */
export default function Audiences() {
  const t = useTranslations("audiences");
  const tabs = t.raw("tabs") as Tab[];
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const tab = tabs[active];

  return (
    <section id="audiences" className="py-[clamp(5rem,12vh,9rem)]">
      <div className="container-g">
        <Reveal>
          <h2 className="text-h2 font-bold text-ink">{t("title")}</h2>
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-[280px_1fr] lg:gap-16">
          <div
            role="tablist"
            aria-orientation="vertical"
            className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible"
          >
            {tabs.map((tb, i) => (
              <button
                key={tb.id}
                role="tab"
                id={`aud-tab-${tb.id}`}
                aria-selected={active === i}
                aria-controls={`aud-panel-${tb.id}`}
                onClick={() => setActive(i)}
                className={cn(
                  "whitespace-nowrap rounded-full border px-5 py-3 text-left text-[0.95rem] font-bold transition-colors duration-300 ease-glemo lg:whitespace-normal",
                  active === i
                    ? "border-verify text-ink"
                    : "border-line text-ink-2 hover:border-ink-2/40 hover:text-ink"
                )}
              >
                {tb.label}
              </button>
            ))}
          </div>

          <div
            role="tabpanel"
            id={`aud-panel-${tab.id}`}
            aria-labelledby={`aud-tab-${tab.id}`}
            className="min-h-[260px]"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={tab.id}
                initial={reduced ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.625, 0.05, 0, 1] }}
              >
                <h3 className="max-w-[30rem] text-[1.7rem] font-bold leading-tight tracking-[-0.015em] text-ink">
                  {tab.headline}
                </h3>
                <ul className="mt-8 grid gap-x-10 gap-y-5 sm:grid-cols-2">
                  {tab.points.map((p) => (
                    <li key={p} className="flex items-start gap-3">
                      <svg
                        viewBox="0 0 24 24"
                        className="mt-1 h-4 w-4 shrink-0"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M4 12.5 L9.5 18 L20 6.5"
                          stroke="var(--verify)"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="text-[0.99rem] leading-relaxed text-ink-2">
                        {p}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
