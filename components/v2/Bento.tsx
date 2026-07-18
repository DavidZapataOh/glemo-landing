"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Reveal from "./ui/Reveal";
import { cn } from "@/lib/utils";

/**
 * Bento (Greenly/Certifier lesson): the paper interlude. Each tile shows one
 * idea with a tiny product-shaped visual — including Certifier's best trick,
 * the draggable white-label slider. No two tiles share a layout.
 */
export default function Bento() {
  const t = useTranslations("bento");
  const journey = t.raw("journey.steps") as string[];
  const chips = t.raw("nolockin.chips") as string[];
  const [split, setSplit] = useState(58);

  return (
    <section id="institutions" className="bg-paper py-[clamp(5rem,12vh,9rem)] text-paper-ink">
      <div className="container-g">
        <Reveal>
          <h2 className="max-w-[40rem] text-h2 font-bold">{t("title")}</h2>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:gap-5 lg:grid-cols-3">
          {/* journey — spans 2 */}
          <Reveal className="lg:col-span-2">
            <div className="h-full rounded-lg border border-paper-line bg-white p-7 shadow-[0_18px_50px_-34px_rgb(10_20_15/0.3)]">
              <p className="font-mono text-[10.5px] uppercase tracking-[0.15em] text-paper-ink-2">
                {t("journey.label")}
              </p>
              <div className="relative mt-8 flex flex-wrap items-center gap-y-6">
                {journey.map((step, i) => (
                  <div key={step} className="flex items-center">
                    <span
                      className={cn(
                        "relative z-10 rounded-full border px-4 py-2 text-[0.9rem] font-bold",
                        i === 2
                          ? "border-[oklch(0.52_0.11_166)] bg-[oklch(0.52_0.11_166)] text-white"
                          : "border-paper-line bg-white text-paper-ink"
                      )}
                    >
                      {i === 2 && <span aria-hidden="true">✓ </span>}
                      {step}
                    </span>
                    {i < journey.length - 1 && (
                      <svg width="46" height="10" className="mx-1 shrink-0" aria-hidden="true">
                        <line
                          x1="2"
                          y1="5"
                          x2="44"
                          y2="5"
                          stroke="oklch(0.45 0.02 168 / 0.5)"
                          strokeWidth="1.6"
                          strokeDasharray="1 6"
                          strokeLinecap="round"
                        />
                        <path d="M40 1.5 L45 5 L40 8.5" fill="none" stroke="oklch(0.45 0.02 168 / 0.6)" strokeWidth="1.4" strokeLinecap="round" />
                      </svg>
                    )}
                  </div>
                ))}
              </div>
              <p className="mt-7 max-w-[30rem] text-[0.95rem] leading-relaxed text-paper-ink-2">
                {t("latency.note")}: {t("latency.value")} {t("latency.label")}.
              </p>
            </div>
          </Reveal>

          {/* white-label draggable slider */}
          <Reveal delay={0.06}>
            <div className="h-full rounded-lg border border-paper-line bg-white p-7 shadow-[0_18px_50px_-34px_rgb(10_20_15/0.3)]">
              <h3 className="text-[1.15rem] font-bold">{t("whitelabel.title")}</h3>
              <p className="mt-1.5 text-[0.9rem] text-paper-ink-2">{t("whitelabel.body")}</p>

              <div className="relative mt-5 overflow-hidden rounded-md border border-paper-line">
                {/* white-label layer (bottom) */}
                <MiniCert branded={false} />
                {/* branded layer (top, clipped) */}
                <div
                  className="absolute inset-0"
                  style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}
                  aria-hidden="true"
                >
                  <MiniCert branded />
                </div>
                {/* divider */}
                <span
                  className="pointer-events-none absolute inset-y-0 w-[3px] -translate-x-1/2 rounded-full bg-[oklch(0.52_0.11_166)]"
                  style={{ left: `${split}%` }}
                  aria-hidden="true"
                >
                  <span className="absolute left-1/2 top-1/2 grid h-7 w-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[oklch(0.52_0.11_166)] text-[11px] font-black text-white">
                    ⇄
                  </span>
                </span>
                <input
                  type="range"
                  min={8}
                  max={92}
                  value={split}
                  onChange={(e) => setSplit(Number(e.target.value))}
                  aria-label={`${t("whitelabel.before")} / ${t("whitelabel.after")}`}
                  className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
                />
              </div>
              <div className="mt-2.5 flex justify-between font-mono text-[10px] uppercase tracking-[0.1em] text-paper-ink-2">
                <span>{t("whitelabel.before")}</span>
                <span>{t("whitelabel.after")}</span>
              </div>
            </div>
          </Reveal>

          {/* latency */}
          <Reveal delay={0.04}>
            <div className="flex h-full flex-col justify-between rounded-lg border border-paper-line bg-[oklch(0.16_0.02_168)] p-7 text-ink shadow-[0_18px_50px_-34px_rgb(10_20_15/0.4)]">
              <div className="flex items-end gap-1.5" aria-hidden="true">
                {[34, 18, 26, 12, 22, 8, 15].map((h, i) => (
                  <span
                    key={i}
                    className="w-2.5 rounded-sm bg-verify/70"
                    style={{ height: `${h}px` }}
                  />
                ))}
              </div>
              <div className="mt-6">
                <p className="font-mono text-[2.6rem] font-medium leading-none text-verify">
                  {t("latency.value")}
                </p>
                <p className="mt-2 text-[0.92rem] text-ink-2">{t("latency.label")}</p>
              </div>
            </div>
          </Reveal>

          {/* no lock-in */}
          <Reveal delay={0.08}>
            <div className="h-full rounded-lg border border-paper-line bg-white p-7 shadow-[0_18px_50px_-34px_rgb(10_20_15/0.3)]">
              <h3 className="text-[1.15rem] font-bold">{t("nolockin.title")}</h3>
              <p className="mt-1.5 max-w-[24rem] text-[0.9rem] leading-relaxed text-paper-ink-2">
                {t("nolockin.body")}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {chips.map((c) => (
                  <span
                    key={c}
                    className="rounded-full border border-paper-line px-3 py-1.5 font-mono text-[11px] text-paper-ink-2"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          {/* bulk */}
          <Reveal delay={0.12}>
            <div className="flex h-full flex-col justify-between rounded-lg border border-paper-line bg-white p-7 shadow-[0_18px_50px_-34px_rgb(10_20_15/0.3)]">
              <p className="font-mono text-[10.5px] uppercase tracking-[0.15em] text-paper-ink-2">
                bulk
              </p>
              <div className="mt-5">
                <p className="font-mono text-[2.6rem] font-medium leading-none text-paper-ink">
                  {t("bulk.value")}
                </p>
                <p className="mt-2 text-[0.92rem] text-paper-ink-2">{t("bulk.label")}</p>
                <p className="mt-3 text-[0.85rem] italic text-paper-ink-2/80">
                  {t("bulk.note")}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function MiniCert({ branded }: { branded: boolean }) {
  return (
    <div className="flex h-[150px] items-center justify-center bg-paper">
      <div className="w-[75%] rounded-md border border-paper-line bg-white p-4 text-center">
        <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-paper-ink-2">
          certificate
        </p>
        <p className="mt-1.5 text-[0.95rem] font-black">María Torres</p>
        <p className="text-[9.5px] text-paper-ink-2">Product Design · 2026</p>
        <div className="mt-2 flex items-center justify-center gap-1.5">
          {branded ? (
            <>
              <svg viewBox="0 0 80 80" className="h-3.5 w-3.5" aria-hidden="true">
                <polygon points="40,4 72,22 72,58 40,76 8,58 8,22" fill="none" stroke="oklch(0.52 0.11 166)" strokeWidth="5" />
                <path d="M28 41 L37 50 L54 30" stroke="oklch(0.52 0.11 166)" strokeWidth="7" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="font-mono text-[8.5px] text-[oklch(0.52_0.11_166)]">
                glemo verified
              </span>
            </>
          ) : (
            <span className="font-mono text-[8.5px] text-paper-ink-2/70">
              yourbrand.com/verify
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
