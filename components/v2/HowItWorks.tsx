"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useReducedMotion } from "framer-motion";
import { ScrollTrigger, registerGsap } from "@/lib/motion";
import SplitReveal from "./ui/SplitReveal";
import Reveal from "./ui/Reveal";
import { cn } from "@/lib/utils";

type Step = { num: string; name: string; body: string; mono: string };

/**
 * How it works: the page's one pinned sequence (a real ordered flow, which is
 * what earns the numbers). Desktop: CSS-sticky viewport, scroll progress
 * drives the active step. Mobile & reduced motion: honest stacked flow.
 */
export default function HowItWorks() {
  const t = useTranslations("how");
  const steps = t.raw("steps") as Step[];
  const reduced = useReducedMotion();

  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    registerGsap();
    if (reduced) return;
    const track = trackRef.current;
    if (!track) return;

    const st = ScrollTrigger.create({
      trigger: track,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        setActive(Math.min(steps.length - 1, Math.floor(self.progress * steps.length)));
      },
    });
    return () => st.kill();
  }, [reduced, steps.length]);

  const Scene = ({ step, index }: { step: Step; index: number }) => (
    <div className="rounded-lg border border-line bg-surface p-6 sm:p-8">
      {index === 0 && (
        <div className="space-y-4">
          <CredentialCard />
          <MonoLine text={step.mono} />
        </div>
      )}
      {index === 1 && (
        <div className="space-y-4">
          <CredentialCard withStandards />
          <MonoLine text={step.mono} />
        </div>
      )}
      {index === 2 && (
        <div className="space-y-4">
          <pre className="overflow-x-auto rounded-md bg-bg p-5 font-mono text-[13px] leading-relaxed text-ink-2">
            <code>{`{
  "status": `}<span className="font-medium text-verify">&quot;verified&quot;</span>{`,
  "issuer":  { "name": "…", "trusted": true },
  "holder":  { "match": true },
  "revoked": false
}`}</code>
          </pre>
          <MonoLine text={step.mono} verified />
        </div>
      )}
    </div>
  );

  return (
    <section id="how" className="relative">
      <div className="container-g pb-4 pt-[clamp(4rem,8vh,6rem)]">
        <SplitReveal as="h2" className="max-w-[44rem] text-h2 font-bold text-ink">
          {t("title")}
        </SplitReveal>
      </div>

      {/* Desktop: sticky sequence */}
      <div ref={trackRef} className="hidden lg:block" style={{ height: "260vh" }}>
        <div className="sticky top-0 flex h-screen items-center">
          <div className="container-g grid grid-cols-2 items-center gap-16">
            <ol className="space-y-2">
              {steps.map((s, i) => (
                <li key={s.num}>
                  <div
                    className={cn(
                      "rounded-lg border p-6 transition-all duration-500 ease-glemo",
                      active === i
                        ? "border-line bg-surface"
                        : "border-transparent opacity-40"
                    )}
                  >
                    <div className="flex items-baseline gap-4">
                      <span
                        className={cn(
                          "font-mono text-[13px] tabular-nums transition-colors duration-500",
                          active === i ? "text-verify" : "text-ink-2"
                        )}
                      >
                        {s.num}
                      </span>
                      <h3 className="text-h3 font-bold text-ink">{s.name}</h3>
                    </div>
                    <p
                      className={cn(
                        "mt-2.5 pl-10 text-[0.975rem] leading-relaxed text-ink-2 transition-opacity duration-500",
                        active === i ? "opacity-100" : "opacity-0"
                      )}
                    >
                      {s.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="relative min-h-[320px]">
              {steps.map((s, i) => (
                <div
                  key={s.num}
                  className={cn(
                    "absolute inset-0 transition-all duration-500 ease-glemo",
                    active === i
                      ? "translate-y-0 opacity-100"
                      : "pointer-events-none translate-y-3 opacity-0"
                  )}
                  aria-hidden={active !== i}
                >
                  <Scene step={s} index={i} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile & reduced motion: stacked */}
      <div className="container-g space-y-14 py-10 lg:hidden">
        {steps.map((s, i) => (
          <Reveal key={s.num}>
            <div className="flex items-baseline gap-4">
              <span className="font-mono text-[13px] tabular-nums text-verify">
                {s.num}
              </span>
              <h3 className="text-h3 font-bold text-ink">{s.name}</h3>
            </div>
            <p className="mt-2.5 text-[0.975rem] leading-relaxed text-ink-2">
              {s.body}
            </p>
            <div className="mt-5">
              <Scene step={s} index={i} />
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function CredentialCard({ withStandards = false }: { withStandards?: boolean }) {
  return (
    <div className="rounded-md border border-line bg-bg p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-2/70">
            credential
          </p>
          <p className="mt-2 text-[1.05rem] font-bold text-ink">
            Full-Stack Engineering
          </p>
          <p className="mt-0.5 text-[0.85rem] text-ink-2">Andes Tech Academy · 2026</p>
        </div>
        <svg viewBox="0 0 80 80" className="h-10 w-10 shrink-0" aria-hidden="true">
          <polygon
            points="40,4 72,22 72,58 40,76 8,58 8,22"
            fill="none"
            stroke="var(--verify)"
            strokeWidth="2"
          />
          <path
            d="M28 41 L37 50 L54 30"
            stroke="var(--verify)"
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      {withStandards && (
        <div className="mt-4 flex flex-wrap gap-2">
          {["W3C VC", "Open Badges 3.0", "portable"].map((s) => (
            <span
              key={s}
              className="rounded-full border border-line px-2.5 py-1 font-mono text-[10.5px] text-ink-2"
            >
              {s}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function MonoLine({ text, verified = false }: { text: string; verified?: boolean }) {
  return (
    <p
      className={cn(
        "font-mono text-[12px] tracking-wide",
        verified ? "text-verify" : "text-ink-2/80"
      )}
    >
      {text}
    </p>
  );
}
