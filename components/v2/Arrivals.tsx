"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import Reveal from "./ui/Reveal";
import { cn } from "@/lib/utils";

type Item = {
  id: string;
  quote: string;
  arrival: string;
  arrivalNote: string;
  answer: string;
  checks: string[];
};

/**
 * Arrivals: the thesis of the whole product, drawn.
 *
 * Four ways a credential reaches a verifier, in the verifier's own words, and
 * ONE answer whichever it was. The panel is split on purpose: everything above
 * the rule changes per lane, and the verdict block underneath never moves. That
 * stillness is the argument, so it is the one thing that must not animate.
 *
 * Not a card grid: the section exists to show convergence, and four equal boxes
 * show the opposite.
 */
export default function Arrivals() {
  const t = useTranslations("arrivals");
  const items = t.raw("items") as Item[];
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const item = items[active]!;

  /** Roving focus, which a tablist owes its keyboard users. */
  function onKey(e: React.KeyboardEvent, i: number) {
    const delta = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
    if (!delta) return;
    e.preventDefault();
    const next = (i + delta + items.length) % items.length;
    setActive(next);
    tabs.current[next]?.focus();
  }

  return (
    <section id="arrivals" className="py-[clamp(5rem,12vh,9rem)]">
      <div className="container-g">
        <Reveal>
          <h2 className="text-h2 max-w-[18ch] font-bold text-ink">{t("title")}</h2>
          <p className="mt-4 max-w-[52ch] text-[1.0625rem] leading-[1.65] text-ink-2">{t("sub")}</p>
        </Reveal>

        <div className="mt-12 grid gap-8 lg:mt-16 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-14">
          {/* The four arrivals, in the visitor's voice. */}
          <div role="tablist" aria-orientation="vertical" aria-label={t("title")} className="flex flex-col gap-3">
            {items.map((it, i) => (
              <button
                key={it.id}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                role="tab"
                id={`arr-tab-${it.id}`}
                aria-selected={active === i}
                aria-controls="arr-panel"
                tabIndex={active === i ? 0 : -1}
                onClick={() => setActive(i)}
                onKeyDown={(e) => onKey(e, i)}
                className={cn(
                  "group rounded-md border px-5 py-4 text-left transition-colors duration-300 ease-glemo",
                  active === i
                    ? "border-verify/60 bg-surface"
                    : "border-line hover:border-ink-2/40 hover:bg-surface/60",
                )}
              >
                <span
                  className={cn(
                    "block text-[1.0625rem] font-bold leading-[1.4] transition-colors duration-300",
                    active === i ? "text-ink" : "text-ink-2 group-hover:text-ink",
                  )}
                >
                  {it.quote}
                </span>
                <span className="mt-1.5 block font-mono text-[0.75rem] tracking-[0.02em] text-ink-2">
                  {it.arrival}
                </span>
              </button>
            ))}
            {/* The argument, once, where the eye lands after the fourth situation. It
                also squares the two columns instead of leaving a hole under the rail. */}
            <p className="mt-4 max-w-[34ch] text-[0.9375rem] leading-[1.6] text-ink-2 lg:mt-auto lg:pt-6">
              {t("thesis")}
            </p>
          </div>

          {/* One answer. The top half changes; the verdict underneath does not. */}
          <div
            role="tabpanel"
            id="arr-panel"
            aria-labelledby={`arr-tab-${item.id}`}
            className="flex flex-col overflow-hidden rounded-lg border border-line bg-surface"
          >
            <div className="min-h-[19rem] flex-1 p-6 sm:p-8">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={item.id}
                  initial={reduced ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduced ? { opacity: 1 } : { opacity: 0, y: -6 }}
                  transition={{ duration: reduced ? 0 : 0.3, ease: [0.625, 0.05, 0, 1] }}
                >
                  <p className="font-mono text-[0.75rem] uppercase tracking-[0.14em] text-ink-2">
                    {item.arrivalNote}
                  </p>
                  <p className="mt-3 max-w-[46ch] text-[1.0625rem] leading-[1.6] text-ink">{item.answer}</p>

                  <ul className="mt-6 flex flex-col gap-2.5">
                    {item.checks.map((c, ci) => (
                      <motion.li
                        key={c}
                        initial={reduced ? false : { opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: reduced ? 0 : 0.3,
                          delay: reduced ? 0 : 0.06 * ci,
                          ease: [0.625, 0.05, 0, 1],
                        }}
                        className="flex items-center gap-3 font-mono text-[0.8125rem] text-ink-2"
                      >
                        <svg viewBox="0 0 16 16" aria-hidden className="size-4 shrink-0 text-verify">
                          <path
                            d="M3.5 8.4l3 3 6-6.8"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        {c}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* The constant. Never animates: that is the whole point of the section. */}
            <div className="border-t border-line bg-surface-2/60 p-6 sm:p-8">
              <p className="font-mono text-[0.75rem] uppercase tracking-[0.14em] text-ink-2">
                {t("answerLabel")}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-3">
                <span className="text-[2rem] font-black leading-none tracking-[-0.03em] text-verify">
                  {t("verdict")}
                </span>
                <span className="rounded-full border border-line px-3 py-1 font-mono text-[0.75rem] text-ink-2">
                  {t("ruleLabel")} · {t("ruleName")}
                </span>
              </div>

              {/* The three states a requirement can be in. Collapsing "not checkable"
                  into "not met" would assert something nobody checked, so the answer
                  keeps them apart and the panel shows it. */}
              <dl className="mt-5 flex flex-col gap-2 border-t border-line pt-5">
                {(t.raw("requirements") as { name: string; state: string }[]).map((r) => {
                  const unknown = r.state === t("states.unknown");
                  return (
                    <div key={r.name} className="flex items-baseline justify-between gap-4">
                      <dt className="font-mono text-[0.8125rem] text-ink-2">{r.name}</dt>
                      <dd
                        className={cn(
                          "font-mono text-[0.8125rem]",
                          unknown ? "text-ink-2" : "text-verify",
                        )}
                      >
                        {r.state}
                      </dd>
                    </div>
                  );
                })}
              </dl>
              <p className="mt-4 max-w-[44ch] text-[0.875rem] leading-[1.6] text-ink-2">
                {t("requirementsNote")}
              </p>
              <p className="mt-4 font-mono text-[0.8125rem] text-ink-2">{t("receipt")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
