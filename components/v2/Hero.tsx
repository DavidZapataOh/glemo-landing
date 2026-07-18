"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { gsap, registerGsap, prefersReducedMotion, EASE } from "@/lib/motion";
import Button from "./ui/Button";
import VerifyStroke from "./ui/VerifyStroke";
import HeroStack from "./HeroStack";

/**
 * Hero v3 — graphic-first (the Privado/Proof lesson): copy on the left, the
 * credential stack as the hero object on the right. One overlapped entrance
 * timeline; back.out reserved for the primary CTA; the verification stroke
 * signs the key phrase once everything lands.
 */
export default function Hero() {
  const t = useTranslations("hero");
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    registerGsap();
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: EASE } });
      tl.from(
        ".hero-line-inner",
        { yPercent: 112, rotate: 3, duration: 0.9, stagger: 0.09 },
        0.25
      )
        .from(".hero-sub", { y: 22, opacity: 0, duration: 0.7 }, "-=0.5")
        .from(".hero-cta-ghost", { y: 16, opacity: 0, duration: 0.55 }, "-=0.38")
        .from(
          ".hero-cta-primary",
          { y: 20, opacity: 0, scale: 0.9, duration: 0.6, ease: "back.out(1.7)" },
          "<0.08"
        )
        .from(".hero-trust", { opacity: 0, duration: 0.5 }, "-=0.3")
        .from(
          ".hero-stack",
          { y: 40, opacity: 0, scale: 0.97, duration: 0.9 },
          "-=0.75"
        );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="relative overflow-hidden" id="top">
      <div className="container-g grid items-center gap-14 pb-16 pt-24 sm:pt-28 lg:grid-cols-[1fr_1.02fr] lg:gap-8 lg:pb-20">
        <div className="text-center lg:text-left">
          <h1 className="text-display font-bold text-ink lg:text-[clamp(2.5rem,4.35vw,4.35rem)]">
            <span className="block overflow-hidden pb-1">
              <span className="hero-line-inner block">{t("titleA")}</span>
            </span>
            <span className="block overflow-hidden pb-3">
              <span className="hero-line-inner relative inline-block">
                {t("titleB")}
                <VerifyStroke
                  delay={1.45}
                  className="absolute -bottom-2 left-0 h-[0.22em] w-full sm:-bottom-3"
                />
              </span>
            </span>
          </h1>

          <p className="hero-sub mx-auto mt-7 max-w-[33rem] text-body text-ink-2 lg:mx-0">
            {t("sub")}
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3.5 lg:justify-start">
            <span className="hero-cta-primary inline-flex">
              <Button href="#cta" size="lg">
                {t("ctaPrimary")}
              </Button>
            </span>
            <span className="hero-cta-ghost inline-flex">
              <Button href="#action" size="lg" variant="ghost">
                {t("ctaSecondary")}
              </Button>
            </span>
          </div>

          <p className="hero-trust mt-8 font-mono text-[11.5px] uppercase tracking-[0.12em] text-ink-2/80">
            {t("microTrust")}
          </p>
        </div>

        <div className="hero-stack">
          <HeroStack />
        </div>
      </div>
    </section>
  );
}
