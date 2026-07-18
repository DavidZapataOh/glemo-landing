"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { gsap, registerGsap, prefersReducedMotion, EASE } from "@/lib/motion";
import Button from "./ui/Button";
import VerifyStroke from "./ui/VerifyStroke";
import NetworkCanvas from "./NetworkCanvas";

/**
 * Hero — the one fully-choreographed entrance on the page (Developios recipe:
 * overlapped offsets, back.out reserved for the primary CTA). The headline's
 * key phrase is "signed" by the verification stroke once the timeline lands.
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
          ".hero-net",
          { y: 44, opacity: 0, scale: 0.985, duration: 0.9 },
          "-=0.55"
        );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="relative overflow-hidden" id="top">
      {/* single, quiet atmosphere: a low glow where the network core sits */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[68%] h-[520px] w-[820px] -translate-x-1/2 rounded-full opacity-60"
        style={{
          background:
            "radial-gradient(closest-side, oklch(0.82 0.155 165 / 0.07), transparent 70%)",
        }}
      />

      <div className="container-g flex flex-col items-center pb-10 pt-24 text-center sm:pt-28">
        <h1 className="text-display font-bold text-ink">
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

        <p className="hero-sub mt-7 max-w-[36rem] text-body text-ink-2">
          {t("sub")}
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3.5">
          <span className="hero-cta-primary inline-flex">
            <Button href="#developers" size="lg">
              {t("ctaPrimary")}
            </Button>
          </span>
          <span className="hero-cta-ghost inline-flex">
            <Button href="#institutions" size="lg" variant="ghost">
              {t("ctaSecondary")}
            </Button>
          </span>
        </div>

        <p className="hero-trust mt-8 font-mono text-[11.5px] uppercase tracking-[0.12em] text-ink-2/80">
          {t("microTrust")}
        </p>
      </div>

      <div className="hero-net container-g">
        <NetworkCanvas className="mx-auto h-[280px] w-full max-w-[1080px] sm:h-[360px] lg:h-[420px]" />
      </div>
    </section>
  );
}
