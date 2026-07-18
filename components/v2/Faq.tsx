"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Reveal from "./ui/Reveal";
import { cn } from "@/lib/utils";

type Item = { q: string; a: string };

/**
 * FAQ — where "blockchain invisible" is executed in words: the objections a
 * serious buyer actually has, answered in human language.
 */
export default function Faq() {
  const t = useTranslations("faq");
  const items = t.raw("items") as Item[];
  const [open, setOpen] = useState<number | null>(0);
  const reduced = useReducedMotion();

  return (
    <section id="faq" className="py-[clamp(5rem,12vh,9rem)]">
      <div className="container-g">
        <div className="mx-auto max-w-[46rem]">
          <Reveal>
            <h2 className="text-h2 font-bold text-ink">{t("title")}</h2>
          </Reveal>

          <ul className="mt-10 divide-y divide-line border-y border-line">
            {items.map((item, i) => {
              const isOpen = open === i;
              return (
                <li key={item.q}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-a-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-6 py-5 text-left"
                  >
                    <span
                      className={cn(
                        "text-[1.05rem] font-bold transition-colors duration-200",
                        isOpen ? "text-ink" : "text-ink-2 hover:text-ink"
                      )}
                    >
                      {item.q}
                    </span>
                    <span
                      aria-hidden="true"
                      className={cn(
                        "grid h-7 w-7 shrink-0 place-items-center rounded-full border border-line font-mono text-[13px] text-ink-2 transition-transform duration-300 ease-glemo",
                        isOpen && "rotate-45 border-verify text-verify"
                      )}
                    >
                      +
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-a-${i}`}
                        initial={reduced ? false : { height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={reduced ? undefined : { height: 0, opacity: 0 }}
                        transition={{ duration: 0.32, ease: [0.625, 0.05, 0, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-[40rem] pb-6 text-[0.975rem] leading-relaxed text-ink-2">
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
