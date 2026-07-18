"use client";

import { useTranslations } from "next-intl";
import SplitReveal from "./ui/SplitReveal";
import Reveal from "./ui/Reveal";

/**
 * The problem statement — one idea per viewport (the Spade rhythm). The second
 * line carries the accent; stats are real, sourced figures from the research,
 * set in bordered editorial cells (not the hero-metric cliché).
 */
export default function Problem() {
  const t = useTranslations("problem");
  const stats = t.raw("stats") as { value: string; label: string }[];

  return (
    <section className="py-[clamp(6rem,14vh,10rem)]">
      <div className="container-g">
        <div className="mx-auto max-w-[54rem]">
          <SplitReveal as="h2" className="text-h2 font-bold text-ink">
            {t("titleA")}{" "}
            <span className="text-verify">{t("titleB")}</span>
          </SplitReveal>
          <Reveal delay={0.15}>
            <p className="mt-6 max-w-[40rem] text-body text-ink-2">{t("body")}</p>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="mx-auto mt-16 max-w-[54rem]">
          <dl className="grid grid-cols-1 overflow-hidden rounded-lg border border-line sm:grid-cols-3">
            {stats.map((s, i) => (
              <div
                key={s.value}
                className={
                  "px-7 py-8 " +
                  (i > 0 ? "border-t border-line sm:border-l sm:border-t-0" : "")
                }
              >
                <dd className="font-mono text-[2rem] font-medium tabular-nums leading-none text-ink sm:text-[2.35rem]">
                  {s.value}
                </dd>
                <dt className="mt-3 text-[0.9rem] leading-snug text-ink-2">
                  {s.label}
                </dt>
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
