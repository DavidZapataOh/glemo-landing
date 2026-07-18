"use client";

import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";
import SplitReveal from "./ui/SplitReveal";
import Reveal from "./ui/Reveal";
import { cn } from "@/lib/utils";

/** desktop positions for the floating "fake PDF" chips (Spade lesson) */
const CHIP_POS = [
  { top: "8%", left: "4%", r: -7 },
  { top: "16%", right: "6%", r: 5 },
  { bottom: "30%", left: "2%", r: 4 },
  { bottom: "18%", right: "10%", r: -5 },
  { top: "48%", right: "2%", r: 8 },
];

/**
 * The problem, materialized (the Spade statement lesson): a dark panel where
 * the junk that passes for "credentials" floats around the claim. Sourced
 * stats below in editorial cells.
 */
export default function Problem() {
  const t = useTranslations("problem");
  const chips = t.raw("chips") as string[];
  const stats = t.raw("stats") as { value: string; label: string }[];
  const reduced = useReducedMotion();

  return (
    <section className="py-[clamp(5rem,12vh,9rem)]">
      <div className="container-g">
        <div className="relative overflow-hidden rounded-lg border border-line bg-[oklch(0.12_0.011_170)] px-6 py-16 sm:px-12 sm:py-24">
          {/* floating fake-credential chips (desktop) */}
          {chips.map((chip, i) => (
            <motion.span
              key={chip}
              initial={reduced ? false : { opacity: 0, y: 14, scale: 0.85 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-20% 0px" }}
              transition={{
                duration: 0.5,
                delay: 0.35 + i * 0.16,
                ease: [0.625, 0.05, 0, 1],
              }}
              className="absolute hidden rounded-md border border-dashed border-ink-2/40 bg-bg/70 px-3 py-1.5 font-mono text-[11.5px] text-ink-2/80 lg:block"
              style={{
                top: CHIP_POS[i]?.top,
                left: CHIP_POS[i]?.left,
                right: CHIP_POS[i]?.right,
                bottom: CHIP_POS[i]?.bottom,
                rotate: `${CHIP_POS[i]?.r ?? 0}deg`,
              }}
              aria-hidden="true"
            >
              {chip}
            </motion.span>
          ))}

          <div className="mx-auto max-w-[46rem] text-center">
            <SplitReveal as="h2" className="text-h2 font-bold text-ink">
              {t("titleA")} <span className="text-verify">{t("titleB")}</span>
            </SplitReveal>
            <Reveal delay={0.15}>
              <p className="mx-auto mt-6 max-w-[36rem] text-body text-ink-2">
                {t("body")}
              </p>
            </Reveal>

            {/* mobile chips: a simple wrapped row */}
            <div className="mt-8 flex flex-wrap justify-center gap-2 lg:hidden" aria-hidden="true">
              {chips.slice(0, 3).map((chip) => (
                <span
                  key={chip}
                  className="rounded-md border border-dashed border-ink-2/40 px-2.5 py-1 font-mono text-[10.5px] text-ink-2/80"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </div>

        <Reveal delay={0.1} className="mx-auto mt-10 max-w-[54rem]">
          <dl className="grid grid-cols-1 overflow-hidden rounded-lg border border-line sm:grid-cols-3">
            {stats.map((s, i) => (
              <div
                key={s.value}
                className={cn(
                  "px-7 py-8",
                  i > 0 && "border-t border-line sm:border-l sm:border-t-0"
                )}
              >
                <dd className="font-mono text-[2rem] font-medium tabular-nums leading-none text-ink sm:text-[2.35rem]">
                  {s.value}
                </dd>
                <dt className="mt-3 text-[0.9rem] leading-snug text-ink-2">{s.label}</dt>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-right font-mono text-[10.5px] tracking-wide text-ink-2/50">
            {t("statsNote")}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
