"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useReducedMotion } from "framer-motion";
import { gsap, registerGsap, EASE } from "@/lib/motion";
import Reveal from "./ui/Reveal";
import { cn } from "@/lib/utils";

/**
 * Bento v2: the Spade/Bitwage/Aave grammar. Every tile is a working UI
 * fragment that explains itself, with mono evidence chips as proof.
 * Row 1: raw→verified flow (span 2) · dramatic white-label swap.
 * Row 2: live latency counter · portable-anywhere · bulk table→certs.
 */
export default function Bento() {
  const t = useTranslations("bento");

  return (
    <section id="institutions" className="bg-paper py-[clamp(5rem,12vh,9rem)] text-paper-ink">
      <div className="container-g">
        <Reveal>
          <h2 className="max-w-[40rem] text-h2 font-bold">{t("title")}</h2>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:gap-5 lg:grid-cols-3">
          <Reveal className="lg:col-span-2">
            <FlowTile />
          </Reveal>
          <Reveal delay={0.06}>
            <WhitelabelTile />
          </Reveal>
          <Reveal delay={0.04}>
            <LatencyTile />
          </Reveal>
          <Reveal delay={0.08}>
            <PortableTile />
          </Reveal>
          <Reveal delay={0.12}>
            <BulkTile />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

const tileShadow = "shadow-[0_18px_50px_-34px_rgb(10_20_15/0.3)]";

/** IO-gated looping timeline helper */
function useLoop(
  build: (root: HTMLElement) => gsap.core.Timeline,
  deps: unknown[] = []
) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    registerGsap();
    const root = rootRef.current;
    if (!root || reduced) return;
    let tl: gsap.core.Timeline | null = null;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (!tl) tl = build(root);
          tl.play();
        } else tl?.pause();
      },
      { threshold: 0.35 }
    );
    io.observe(root);
    return () => {
      io.disconnect();
      tl?.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { rootRef, reduced };
}

/* ------------------------------------------------------------------ */
/* 1 · Raw → verified (the Spade phone-tile lesson, ours)              */
/* ------------------------------------------------------------------ */
function FlowTile() {
  const t = useTranslations("bento.flow");
  const rawLines = t.raw("rawLines") as string[];

  const { rootRef, reduced } = useLoop((root) => {
    const q = gsap.utils.selector(root);
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.6, paused: true });
    tl.set(q(".fl-line"), { opacity: 0.25 })
      .set(q(".fl-pulse"), { opacity: 0, x: 0 })
      .set(q(".fl-stamp"), { opacity: 0, scale: 0.6 })
      .set(q(".fl-counter"), { opacity: 0, y: 6 })
      .to(q(".fl-line"), { opacity: 1, duration: 0.35, stagger: 0.35, ease: EASE })
      .fromTo(
        q(".fl-pulse"),
        { opacity: 0, x: 0 },
        { opacity: 1, x: 92, duration: 0.55, ease: "power2.inOut" }
      )
      .to(q(".fl-pulse"), { opacity: 0, duration: 0.12 }, "-=0.1")
      .fromTo(
        q(".fl-stamp"),
        { opacity: 0, scale: 0.6, rotate: -18 },
        { opacity: 1, scale: 1, rotate: -8, duration: 0.4, ease: "back.out(2.2)" }
      )
      .to(q(".fl-counter"), { opacity: 1, y: 0, duration: 0.3, ease: EASE }, "-=0.1")
      .to({}, { duration: 1.4 });
    return tl;
  });

  return (
    <div
      ref={rootRef}
      className={cn("h-full rounded-lg border border-paper-line bg-white p-7", tileShadow)}
    >
      <p className="font-mono text-[10.5px] uppercase tracking-[0.15em] text-paper-ink-2">
        {t("label")}
      </p>

      <div className="mt-6 grid items-center gap-5 sm:grid-cols-[1fr_auto_1.1fr]">
        {/* raw side */}
        <div className="rounded-md border border-paper-line bg-[oklch(0.98_0.004_165)] p-4">
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-paper-ink-2/70">
            {t("rawTitle")}
          </p>
          <ul className="mt-2.5 space-y-1.5 font-mono text-[11.5px] text-paper-ink-2">
            {rawLines.map((line) => (
              <li key={line} className="fl-line">
                {line}
              </li>
            ))}
          </ul>
        </div>

        {/* connector */}
        <div className="relative hidden h-px w-24 sm:block" aria-hidden="true">
          <svg className="absolute inset-y-[-6px] w-full" viewBox="0 0 96 12">
            <line x1="0" y1="6" x2="96" y2="6" stroke="oklch(0.45 0.02 168 / 0.4)" strokeWidth="1.5" strokeDasharray="1 6" strokeLinecap="round" />
            <path d="M90 2 L95 6 L90 10" fill="none" stroke="oklch(0.45 0.02 168 / 0.5)" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <span
            className="fl-pulse absolute -top-[3px] left-0 h-[7px] w-[7px] rounded-full bg-[oklch(0.52_0.11_166)] shadow-[0_0_10px_oklch(0.52_0.11_166/0.6)]"
          />
        </div>

        {/* human result */}
        <div className="relative rounded-md border border-paper-line bg-white p-4 shadow-[0_10px_30px_-18px_rgb(10_20_15/0.35)]">
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-paper-ink-2/70">
            {t("resultTitle")}
          </p>
          <div className="mt-3 flex items-center gap-3">
            <span
              className="grid h-10 w-10 place-items-center rounded-full text-[13px] font-black text-white"
              style={{ background: "linear-gradient(135deg, oklch(0.78 0.11 55), oklch(0.62 0.13 320))" }}
            >
              MT
            </span>
            <div>
              <p className="text-[0.98rem] font-black leading-tight">María Torres</p>
              <p className="text-[0.8rem] text-paper-ink-2">Product Design · Andes Tech</p>
            </div>
          </div>
          <span
            className={cn(
              "fl-stamp absolute right-3 top-9 rotate-[-8deg] rounded-md border-2 border-[oklch(0.52_0.11_166)] px-2 py-0.5 font-mono text-[10px] font-medium tracking-[0.1em] text-[oklch(0.52_0.11_166)]",
              reduced ? "" : "opacity-0"
            )}
          >
            VERIFIED ✓
          </span>
          <p
            className={cn(
              "fl-counter mt-3 inline-block rounded-full bg-[oklch(0.52_0.11_166/0.1)] px-2.5 py-1 font-mono text-[10px] text-[oklch(0.45_0.1_166)]",
              reduced ? "" : "opacity-0"
            )}
          >
            {t("counter")}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 2 · White-label: a full brand swap, not a footnote                 */
/* ------------------------------------------------------------------ */
function WhitelabelTile() {
  const t = useTranslations("bento.whitelabel");
  const [split, setSplit] = useState(50);
  const nudged = useRef(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  // one gentle auto-nudge when it enters view: shows it's draggable
  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced || nudged.current) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || nudged.current) return;
      nudged.current = true;
      const obj = { v: 50 };
      gsap.to(obj, {
        v: 78,
        duration: 0.9,
        delay: 0.5,
        ease: "power2.inOut",
        onUpdate: () => setSplit(Math.round(obj.v)),
      });
      gsap.to(obj, {
        v: 50,
        duration: 0.9,
        delay: 1.6,
        ease: "power2.inOut",
        onUpdate: () => setSplit(Math.round(obj.v)),
      });
      io.disconnect();
    }, { threshold: 0.5 });
    io.observe(root);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <div
      ref={rootRef}
      className={cn("flex h-full flex-col rounded-lg border border-paper-line bg-white p-7", tileShadow)}
    >
      <h3 className="text-[1.15rem] font-bold">{t("title")}</h3>
      <p className="mt-1.5 text-[0.9rem] text-paper-ink-2">{t("body")}</p>

      <div className="relative mt-5 flex-1 overflow-hidden rounded-md border border-paper-line">
        <BrandScene brand="nova" domain={t("brandB")} />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }} aria-hidden="true">
          <BrandScene brand="glemo" domain={t("brandA")} />
        </div>
        <span
          className="pointer-events-none absolute inset-y-0 w-[3px] -translate-x-1/2 bg-paper-ink"
          style={{ left: `${split}%` }}
          aria-hidden="true"
        >
          <span className="absolute left-1/2 top-1/2 grid h-8 w-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-paper-ink text-[12px] font-black text-white shadow-[0_4px_14px_rgb(0_0_0/0.3)]">
            ⇄
          </span>
        </span>
        <input
          type="range"
          min={6}
          max={94}
          value={split}
          onChange={(e) => setSplit(Number(e.target.value))}
          aria-label={`${t("before")} / ${t("after")}`}
          className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
        />
      </div>
      <div className="mt-2.5 flex justify-between font-mono text-[10px] uppercase tracking-[0.1em] text-paper-ink-2">
        <span>{t("before")}</span>
        <span>{t("after")}</span>
      </div>
    </div>
  );
}

/** Two complete identities: the swap must be unmistakable */
function BrandScene({ brand, domain }: { brand: "glemo" | "nova"; domain: string }) {
  const isGlemo = brand === "glemo";
  return (
    <div
      className={cn(
        "flex h-[190px] flex-col",
        isGlemo ? "bg-[oklch(0.17_0.013_170)]" : "bg-[oklch(0.97_0.008_280)]"
      )}
    >
      {/* browser bar with domain */}
      <div
        className={cn(
          "flex items-center gap-2 border-b px-3 py-1.5",
          isGlemo ? "border-white/10" : "border-[oklch(0.85_0.02_280)]"
        )}
      >
        <span className={cn("h-1.5 w-1.5 rounded-full", isGlemo ? "bg-white/25" : "bg-[oklch(0.75_0.03_280)]")} />
        <span
          className={cn(
            "rounded-sm px-2 py-0.5 font-mono text-[8.5px]",
            isGlemo ? "bg-white/10 text-white/70" : "bg-white text-[oklch(0.4_0.1_280)]"
          )}
        >
          {isGlemo ? "glemo.io/verify" : domain}
        </span>
      </div>
      {/* credential */}
      <div className="grid flex-1 place-items-center p-3">
        <div
          className={cn(
            "w-[82%] rounded-md p-3 text-center",
            isGlemo
              ? "border border-white/10 bg-[oklch(0.2_0.015_170)]"
              : "border border-[oklch(0.85_0.02_280)] bg-white"
          )}
        >
          {isGlemo ? (
            <svg viewBox="0 0 80 80" className="mx-auto h-5 w-5" aria-hidden="true">
              <polygon points="40,4 72,22 72,58 40,76 8,58 8,22" fill="none" stroke="var(--verify)" strokeWidth="5" />
              <path d="M28 41 L37 50 L54 30" stroke="var(--verify)" strokeWidth="7" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <p className="font-serif text-[13px] font-bold tracking-[0.2em] text-[oklch(0.4_0.12_280)]">
              NOVA
            </p>
          )}
          <p className={cn("mt-1 text-[0.9rem] font-black", isGlemo ? "text-white" : "text-[oklch(0.25_0.05_280)]")}>
            María Torres
          </p>
          <p className={cn("text-[9px]", isGlemo ? "text-white/60" : "text-[oklch(0.5_0.05_280)]")}>
            Product Design · 2026
          </p>
          <p
            className={cn(
              "mx-auto mt-1.5 inline-block rounded-full px-2 py-0.5 font-mono text-[8px]",
              isGlemo
                ? "bg-[oklch(0.82_0.155_165/0.15)] text-verify"
                : "bg-[oklch(0.4_0.12_280)] text-white"
            )}
          >
            {isGlemo ? "✓ glemo verified" : "✓ verified"}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 3 · Latency: segmented ring (chosen: option B). Smartwatch dial:     */
/* segments light up in sequence, then all pulse + "VERIFIED ✓".        */
/* ------------------------------------------------------------------ */
const RING = { cx: 70, cy: 70, rIn: 48, rOut: 58, N: 44, A0: -140, A1: 140 };

function ringSeg(i: number) {
  const a = ((RING.A0 + (i / (RING.N - 1)) * (RING.A1 - RING.A0)) * Math.PI) / 180;
  // Rounded so server and client render byte-identical attributes: trig is
  // not bit-stable across engines and the drift shows up as hydration noise.
  const r = (n: number) => Math.round(n * 1000) / 1000;
  return {
    x1: r(RING.cx + RING.rIn * Math.sin(a)),
    y1: r(RING.cy - RING.rIn * Math.cos(a)),
    x2: r(RING.cx + RING.rOut * Math.sin(a)),
    y2: r(RING.cy - RING.rOut * Math.cos(a)),
  };
}

function LatencyTile() {
  const t = useTranslations("bento.latency");
  const feed = t.raw("feed") as string[];

  const { rootRef, reduced } = useLoop((root) => {
    const q = gsap.utils.selector(root);
    const numEl = root.querySelector(".lt-num") as HTMLElement;
    const lbl = root.querySelector(".lt-lbl") as HTMLElement;
    const segs = Array.from(root.querySelectorAll(".lt-seg")) as SVGLineElement[];
    const counter = { v: 0 };
    const N = RING.N;

    const paintSegs = (litFrac: number, glow = false) => {
      const litN = litFrac * N;
      segs.forEach((s, i) => {
        const on = i < litN;
        const lead = on && i >= litN - 2;
        s.setAttribute(
          "stroke",
          on ? (lead ? "var(--verify-strong)" : "var(--verify)") : "var(--line)"
        );
        s.setAttribute("stroke-width", lead ? "4.2" : "3.2");
        (s.style as CSSStyleDeclaration).filter =
          glow && on
            ? "drop-shadow(0 0 7px oklch(0.82 0.155 165 / 0.8))"
            : lead
              ? "drop-shadow(0 0 4px oklch(0.82 0.155 165 / 0.7))"
              : "none";
      });
    };

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.5, paused: true });
    tl.set(counter, { v: 0 })
      .set(q(".lt-chip"), { opacity: 0, y: 8 })
      .add(() => {
        if (numEl) numEl.textContent = "0.00";
        if (lbl) {
          lbl.textContent = "VERIFY";
          lbl.style.color = "#8f8d86";
        }
        paintSegs(0);
      })
      // segments illuminate in sequence while the digits race
      .to(counter, {
        v: 0.04,
        duration: 1.2,
        ease: "power2.out",
        onUpdate: () => {
          if (numEl) numEl.textContent = counter.v.toFixed(2);
          paintSegs(counter.v / 0.04);
        },
      })
      // the "verified" beat: all lit segments pulse + label swaps
      .add(() => {
        if (lbl) {
          lbl.textContent = "VERIFIED ✓";
          lbl.style.color = "var(--verify)";
        }
        paintSegs(1, true);
      })
      .to({}, { duration: 0.22 })
      .add(() => paintSegs(1, false));

    // rotating verification feed under the dial
    q(".lt-chip").forEach((chip) => {
      tl.to(chip, { opacity: 1, y: 0, duration: 0.35, ease: EASE }, "<0.1").to(chip, {
        opacity: 0,
        y: -6,
        duration: 0.3,
        delay: 0.85,
      });
    });
    tl.to({}, { duration: 0.3 });
    return tl;
  });

  return (
    <div
      ref={rootRef}
      className={cn(
        "flex h-full flex-col items-center justify-between rounded-lg border border-paper-line bg-[oklch(0.16_0.02_168)] p-7 text-ink",
        tileShadow
      )}
    >
      {/* segmented ring */}
      <div className="relative mt-1">
        <svg viewBox="0 0 140 140" className="h-[176px] w-[176px]" aria-hidden="true">
          {Array.from({ length: RING.N }, (_, i) => {
            const s = ringSeg(i);
            return (
              <line
                key={i}
                className="lt-seg"
                x1={s.x1}
                y1={s.y1}
                x2={s.x2}
                y2={s.y2}
                stroke={reduced ? "var(--verify)" : "var(--line)"}
                strokeWidth={3.2}
                strokeLinecap="round"
              />
            );
          })}
        </svg>
        {/* digits + label centered in the ring */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <p className="font-mono text-[2rem] font-medium leading-none text-verify">
            <span className="lt-num">{reduced ? "0.04" : "0.00"}</span>
            <span className="text-[0.95rem] text-ink-2">s</span>
          </p>
          <p
            className="lt-lbl mt-1.5 font-mono text-[10px] uppercase tracking-[0.18em]"
            style={{ color: reduced ? "var(--verify)" : "#8f8d86" }}
          >
            {reduced ? "VERIFIED ✓" : "VERIFY"}
          </p>
        </div>
      </div>

      <p className="mt-2 text-center text-[0.92rem] text-ink-2">{t("label")}</p>

      {/* one verification at a time, under the dial */}
      <div className="relative mt-4 h-9 w-full" aria-hidden="true">
        {feed.map((row, i) => (
          <p
            key={row}
            className={cn(
              "lt-chip absolute inset-x-0 mx-auto w-fit max-w-full truncate rounded-full border border-line bg-[oklch(0.19_0.02_168)] px-3.5 py-2 font-mono text-[10.5px] text-ink-2",
              reduced && i > 0 && "hidden",
              !reduced && "opacity-0"
            )}
          >
            <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-verify" />
            {row}
          </p>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 4 · Portable: verifies here, verifies anywhere                      */
/* ------------------------------------------------------------------ */
/** Hoisted on purpose: declared inside PortableTile it became a new component type
 *  on every render, so React remounted the subtree and the timeline animating
 *  .pt-check-b lost the element it had captured. */
function MiniCard({ side, reduced }: { side: "a" | "b"; reduced: boolean | null }) {
  return (
    <div
      className={cn(
        "relative rounded-md border border-paper-line bg-white px-3 py-2.5",
        side === "b" && "pt-card-b"
      )}
    >
      <p className="text-[0.8rem] font-black leading-none">María T.</p>
      <p className="mt-0.5 text-[8.5px] text-paper-ink-2">Product Design</p>
      <span
        className={cn(
          "absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-[oklch(0.52_0.11_166)] text-[9px] font-black text-white",
          side === "b" && "pt-check-b",
          side === "b" && !reduced && "opacity-0"
        )}
      >
        ✓
      </span>
    </div>
  );
}

function PortableTile() {
  const t = useTranslations("bento.nolockin");
  const chips = t.raw("chips") as string[];

  const { rootRef, reduced } = useLoop((root) => {
    const q = gsap.utils.selector(root);
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.8, paused: true });
    tl.set(q(".pt-card-b"), { opacity: 0, x: -26, scale: 0.9 })
      .set(q(".pt-check-b"), { opacity: 0, scale: 0.5 })
      .to(q(".pt-card-b"), { opacity: 1, x: 0, scale: 1, duration: 0.6, ease: EASE, delay: 0.5 })
      .fromTo(
        q(".pt-check-b"),
        { opacity: 0, scale: 0.5 },
        { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(2.2)" }
      )
      .to({}, { duration: 1.2 });
    return tl;
  });

  return (
    <div
      ref={rootRef}
      className={cn("flex h-full flex-col rounded-lg border border-paper-line bg-white p-7", tileShadow)}
    >
      <h3 className="text-[1.15rem] font-bold">{t("title")}</h3>
      <p className="mt-1.5 text-[0.9rem] leading-relaxed text-paper-ink-2">{t("body")}</p>

      <div className="mt-5 grid flex-1 grid-cols-[1fr_auto_1fr] items-center gap-2">
        <div className="rounded-md border border-paper-line bg-[oklch(0.98_0.004_165)] p-3">
          <p className="mb-2 font-mono text-[8.5px] uppercase tracking-[0.14em] text-paper-ink-2/70">
            {t("here")}
          </p>
          <MiniCard side="a" reduced={reduced} />
        </div>
        <svg width="26" height="10" aria-hidden="true">
          <line x1="0" y1="5" x2="24" y2="5" stroke="oklch(0.45 0.02 168 / 0.5)" strokeWidth="1.5" strokeDasharray="1 5" strokeLinecap="round" />
        </svg>
        <div className="rounded-md border border-dashed border-paper-line p-3">
          <p className="mb-2 font-mono text-[8.5px] uppercase tracking-[0.14em] text-paper-ink-2/70">
            {t("anywhere")}
          </p>
          <MiniCard side="b" reduced={reduced} />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {chips.map((c) => (
          <span key={c} className="rounded-full border border-paper-line px-3 py-1.5 font-mono text-[10.5px] text-paper-ink-2">
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 5 · Bulk: spreadsheet in, certificates out (Bitwage table lesson)   */
/* ------------------------------------------------------------------ */
function BulkTile() {
  const t = useTranslations("bento.bulk");
  const rows = t.raw("rows") as string[];

  const { rootRef, reduced } = useLoop((root) => {
    const q = gsap.utils.selector(root);
    const counter = { v: 0 };
    const numEl = root.querySelector(".bk-num") as HTMLElement;
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 2, paused: true });
    tl.set(q(".bk-cert"), { opacity: 0, x: -10, scale: 0.85 })
      .set(counter, { v: 0 })
      .add(() => {
        if (numEl) numEl.textContent = "0";
      })
      .to(q(".bk-row"), {
        backgroundColor: "oklch(0.52 0.11 166 / 0.08)",
        duration: 0.3,
        stagger: 0.28,
        ease: "none",
      })
      .to(
        q(".bk-cert"),
        { opacity: 1, x: 0, scale: 1, duration: 0.4, stagger: 0.28, ease: "back.out(1.8)" },
        "<0.15"
      )
      .to(
        counter,
        {
          v: 2000,
          duration: 1.5,
          ease: "power3.out",
          onUpdate: () => {
            if (numEl) numEl.textContent = Math.round(counter.v).toLocaleString("en-US");
          },
        },
        "<"
      )
      .to(q(".bk-row"), { backgroundColor: "transparent", duration: 0.4, delay: 1 });
    return tl;
  });

  return (
    <div
      ref={rootRef}
      className={cn("flex h-full flex-col rounded-lg border border-paper-line bg-white p-7", tileShadow)}
    >
      <div>
        <p className="font-mono text-[3rem] font-medium leading-none text-paper-ink">
          <span className="bk-num">{reduced ? t("value") : "0"}</span>
        </p>
        <p className="mt-2 text-[0.92rem] text-paper-ink-2">{t("label")}</p>
      </div>

      <div className="mt-5 grid flex-1 grid-cols-[1.4fr_1fr] items-center gap-3">
        <ul className="divide-y divide-paper-line overflow-hidden rounded-md border border-paper-line font-mono text-[10.5px]">
          {rows.map((r, i) => (
            <li key={r} className="bk-row flex items-center gap-2 px-2.5 py-2 text-paper-ink-2">
              <span className="text-paper-ink-2/50">{i + 2}</span>
              {r}
            </li>
          ))}
        </ul>
        <div className="space-y-1.5">
          {rows.map((r) => (
            <div
              key={r}
              className={cn(
                "bk-cert flex items-center gap-1.5 rounded-sm border border-paper-line bg-[oklch(0.98_0.004_165)] px-2 py-1.5",
                reduced ? "" : "opacity-0"
              )}
            >
              <svg viewBox="0 0 80 80" className="h-3 w-3 shrink-0" aria-hidden="true">
                <polygon points="40,4 72,22 72,58 40,76 8,58 8,22" fill="none" stroke="oklch(0.52 0.11 166)" strokeWidth="6" />
                <path d="M28 41 L37 50 L54 30" stroke="oklch(0.52 0.11 166)" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="truncate text-[9px] font-bold text-paper-ink">{r.split(" ")[0]}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-3 font-mono text-[10px] text-paper-ink-2/70">{t("note")}</p>
    </div>
  );
}
