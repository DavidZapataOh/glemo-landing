"use client";

import { useTranslations } from "next-intl";
import Button from "./ui/Button";
import VerifyStroke from "./ui/VerifyStroke";
import Reveal from "./ui/Reveal";

/**
 * Final CTA — a glow-edged panel; the verification stroke signs the last word
 * (its second and final appearance on the page).
 */
export default function FinalCta() {
  const t = useTranslations("cta");
  const title = t("title");
  const words = title.split(" ");
  const last = words.pop() ?? "";
  const head = words.join(" ");

  return (
    <section id="cta" className="py-[clamp(5rem,12vh,9rem)]">
      <div className="container-g">
        <Reveal>
          <div className="relative overflow-hidden rounded-lg border border-line bg-surface px-6 py-16 text-center sm:px-12 sm:py-20">
            {/* quiet inner glow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-0 h-[340px] w-[640px] -translate-x-1/2 -translate-y-1/3 rounded-full"
              style={{
                background:
                  "radial-gradient(closest-side, oklch(0.82 0.155 165 / 0.1), transparent 70%)",
              }}
            />

            <h2 className="relative text-h2 font-bold text-ink">
              {head}{" "}
              <span className="relative inline-block">
                {last}
                <VerifyStroke
                  onScroll
                  delay={0.35}
                  className="absolute -bottom-2 left-0 h-[0.22em] w-full"
                />
              </span>
            </h2>
            <p className="relative mx-auto mt-5 max-w-[34rem] text-body text-ink-2">
              {t("body")}
            </p>

            <div className="relative mt-9 flex flex-wrap items-center justify-center gap-3.5">
              <Button href="mailto:hello@glemo.io?subject=Design%20partner%20program" size="lg">
                {t("primary")}
              </Button>
              <Button
                href="mailto:hello@glemo.io?subject=Demo"
                size="lg"
                variant="ghost"
              >
                {t("secondary")}
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
