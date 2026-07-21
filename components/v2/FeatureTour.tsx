"use client";

import { useTranslations } from "next-intl";
import Reveal from "./ui/Reveal";
import { cn } from "@/lib/utils";

type Scene = { title: string; body: string; mono: string };

/**
 * Issuer feature tour: the paper interlude (light band for institutional
 * warmth). Three alternating scenes, each with a distinct product-shaped
 * visual; no identical card grid.
 */
export default function FeatureTour() {
  const t = useTranslations("features");
  const scenes = t.raw("scenes") as Scene[];

  return (
    <section id="institutions" className="bg-paper py-[clamp(5rem,12vh,9rem)] text-paper-ink">
      <div className="container-g">
        <Reveal>
          <h2 className="max-w-[46rem] text-h2 font-bold">{t("title")}</h2>
        </Reveal>

        <div className="mt-16 space-y-20 sm:mt-20 sm:space-y-28">
          {scenes.map((scene, i) => (
            <Reveal key={scene.title} delay={0.05}>
              <div
                className={cn(
                  "grid items-center gap-10 lg:grid-cols-2 lg:gap-16",
                  i % 2 === 1 && "lg:[&>*:first-child]:order-2"
                )}
              >
                <div>
                  <h3 className="text-[1.6rem] font-bold leading-tight tracking-[-0.015em]">
                    {scene.title}
                  </h3>
                  <p className="mt-4 max-w-[34rem] text-[1.0125rem] leading-relaxed text-paper-ink-2">
                    {scene.body}
                  </p>
                  <p className="mt-5 font-mono text-[12px] tracking-wide text-verify-ink">
                    {scene.mono}
                  </p>
                </div>
                <SceneVisual index={i} />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Product-shaped illustrations, drawn with the design system itself. */
function SceneVisual({ index }: { index: number }) {
  if (index === 0) {
    // Design studio: canvas + layers panel
    return (
      <div className="rounded-lg border border-paper-line bg-white p-5 shadow-[0_18px_50px_-30px_rgb(10_20_15/0.25)]">
        <div className="flex gap-4">
          <div className="grid flex-1 place-items-center rounded-md border border-paper-line bg-paper py-10">
            <div className="w-[78%] rounded-md border border-paper-line bg-white p-5 text-center">
              <p className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-paper-ink-2">
                certificate of completion
              </p>
              <p className="mt-3 text-[1.15rem] font-black tracking-tight">
                {"{{recipient_name}}"}
              </p>
              <div className="mx-auto mt-3 h-px w-24 bg-paper-line" />
              <p className="mt-3 text-[11px] text-paper-ink-2">
                Cloud Architecture · 2026
              </p>
            </div>
          </div>
          <div className="hidden w-36 shrink-0 flex-col gap-2 sm:flex">
            {["Logo", "Title", "{{name}}", "Date", "Signature"].map((l, j) => (
              <span
                key={l}
                className={cn(
                  "rounded-md border border-paper-line px-3 py-2 font-mono text-[11px]",
                  j === 2 ? "border-verify-ink text-verify-ink" : "text-paper-ink-2"
                )}
              >
                {l}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }
  if (index === 1) {
    // Delivery: email → public verify page
    return (
      <div className="space-y-3">
        <div className="rounded-lg border border-paper-line bg-white p-5 shadow-[0_18px_50px_-30px_rgb(10_20_15/0.25)]">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-paper font-bold">
              ✉
            </span>
            <div>
              <p className="text-[0.95rem] font-bold">Your credential is ready</p>
              <p className="text-[12px] text-paper-ink-2">to: maria@example.com</p>
            </div>
          </div>
          <div className="mt-4 inline-flex rounded-full bg-[oklch(0.52_0.11_166)] px-4 py-2 text-[12.5px] font-bold text-white">
            View & share →
          </div>
        </div>
        <div className="ml-8 rounded-lg border border-paper-line bg-white p-4 sm:ml-14">
          <p className="flex items-center gap-2 font-mono text-[12px] text-verify-ink">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
              <path
                d="M4 12.5 L9.5 18 L20 6.5"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            glemo.io/verify/8f3a…c21, verified
          </p>
        </div>
      </div>
    );
  }
  // Audit: log rows
  return (
    <div className="rounded-lg border border-paper-line bg-white p-5 shadow-[0_18px_50px_-30px_rgb(10_20_15/0.25)]">
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-paper-ink-2">
        verification log
      </p>
      <ul className="mt-3 divide-y divide-paper-line font-mono text-[12px]">
        {[
          ["14:02:11", "hr-platform.co", "verified ✓"],
          ["13:47:52", "employer portal", "verified ✓"],
          ["11:20:04", "credential #291", "revoked by issuer"],
          ["09:15:33", "marketplace api", "verified ✓"],
        ].map(([time, who, status]) => (
          <li key={time} className="flex items-center justify-between gap-3 py-2.5">
            <span className="text-paper-ink-2">{time}</span>
            <span className="flex-1 truncate text-paper-ink">{who}</span>
            <span
              className={
                status.includes("revoked") ? "text-paper-ink-2" : "text-verify-ink"
              }
            >
              {status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
