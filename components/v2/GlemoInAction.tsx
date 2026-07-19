"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useReducedMotion } from "framer-motion";
import { gsap, registerGsap, EASE } from "@/lib/motion";
import Reveal from "./ui/Reveal";
import { cn } from "@/lib/utils";

type Step = { name: string; desc: string };

const SCENE_SECONDS = [5.2, 4.6, 4.8, 4.6, 3.8];

/**
 * "Watch it work" — the Certifier lesson executed for Glemo: a simulated
 * cursor builds a credential, issues a cohort, delivers it, verifies it and
 * audits it, while the lifecycle rail auto-advances. Click any step to jump.
 * Reduced motion / mobile: manual tabs with finished states, no cursor.
 */
export default function GlemoInAction() {
  const t = useTranslations("action");
  const steps = t.raw("steps") as Step[];
  const sc = {
    toolLogo: t("scene.toolLogo"),
    toolName: t("scene.toolName"),
    toolQr: t("scene.toolQr"),
    certTitle: t("scene.certTitle"),
    certCourse: t("scene.certCourse"),
    recipients: t.raw("scene.recipients") as string[],
    moreRecipients: t("scene.moreRecipients"),
    issueButton: t("scene.issueButton"),
    issuedChip: t("scene.issuedChip"),
    emailSubject: t("scene.emailSubject"),
    emailFrom: t("scene.emailFrom"),
    walletShare: t("scene.walletShare"),
    verifyPlaceholder: t("scene.verifyPlaceholder"),
    verifyChecks: t.raw("scene.verifyChecks") as string[],
    verifiedIn: t("scene.verifiedIn"),
    auditRows: t.raw("scene.auditRows") as string[][],
    auditExport: t("scene.auditExport"),
  };

  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const [animated, setAnimated] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const progressRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // decide once on mount whether we run the cursor show (desktop + motion ok)
  useEffect(() => {
    setAnimated(!reduced && window.matchMedia("(min-width: 1024px)").matches);
  }, [reduced]);

  useEffect(() => {
    if (!animated) return;
    registerGsap();
    const stage = stageRef.current;
    if (!stage) return;

    let alive = true;
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), {
      threshold: 0.25,
    });
    io.observe(stage);

    const $ = (sel: string) => stage.querySelector(sel) as HTMLElement | null;
    const cursor = $(".ga-cursor");
    const ring = $(".ga-ring");

    // Cursor + ring live at stage origin (left-0/top-0); x/y is the full
    // position. Measure targets lazily at tween start so layout shifts
    // (rail expansion, scene transitions) can't desync the pointer.
    const pt = (el: HTMLElement | null) => {
      if (!el) return { x: 60, y: 60 };
      const r = el.getBoundingClientRect();
      const s = stage.getBoundingClientRect();
      // aim the arrow tip slightly inside the target center
      return { x: r.left - s.left + r.width / 2 - 3, y: r.top - s.top + r.height / 2 - 3 };
    };
    let lastPt = { x: 60, y: 60 };
    const move = (tl: gsap.core.Timeline, sel: string, dur = 0.55) =>
      tl.to(cursor, {
        duration: dur,
        ease: "power2.inOut",
        // lazy getters: resolved when the tween starts, not when built
        x: () => {
          lastPt = pt($(sel));
          return lastPt.x;
        },
        y: () => lastPt.y,
      });
    const click = (tl: gsap.core.Timeline) => {
      tl.add(() => {
        gsap.set(ring, { x: lastPt.x + 3, y: lastPt.y + 3 });
      });
      tl.to(cursor, { scale: 0.8, duration: 0.09, yoyo: true, repeat: 1 });
      tl.fromTo(
        ring,
        { scale: 0.4, opacity: 0.7 },
        { scale: 1.8, opacity: 0, duration: 0.4 },
        "<"
      );
      return tl;
    };
    const pop = (
      tl: gsap.core.Timeline,
      sel: string,
      pos: gsap.Position = "-=0.05"
    ) =>
      tl.fromTo(
        sel,
        { opacity: 0, scale: 0.7 },
        { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(2)" },
        pos
      );

    const ctx = gsap.context(() => {}, stage);
    let advanceTimer = 0;

    const playScene = (i: number) => {
      if (!alive) return;
      ctx.revert();
      window.clearTimeout(advanceTimer);

      ctx.add(() => {
        // progress bar for the active rail item
        const bar = progressRefs.current[i];
        if (bar)
          gsap.fromTo(
            bar,
            { scaleX: 0 },
            { scaleX: 1, duration: SCENE_SECONDS[i], ease: "none" }
          );

        gsap.set(cursor, { ...pt($(`[data-s="${i}"]`)), opacity: 1, scale: 1 });
        const tl = gsap.timeline();

        if (i === 0) {
          gsap.set(['[data-t="c-logo"]', '[data-t="c-name"]', '[data-t="c-qr"]'], {
            opacity: 0,
            scale: 0.7,
          });
          move(tl, '[data-t="tool-logo"]', 0.7);
          click(tl);
          pop(tl, '[data-t="c-logo"]');
          move(tl, '[data-t="tool-name"]');
          click(tl);
          pop(tl, '[data-t="c-name"]');
          move(tl, '[data-t="tool-qr"]');
          click(tl);
          pop(tl, '[data-t="c-qr"]');
        } else if (i === 1) {
          gsap.set('[data-t="rec-row"]', { opacity: 0, x: -14 });
          gsap.set(['[data-t="rec-more"]', '[data-t="issued"]'], { opacity: 0 });
          gsap.set('[data-t="issue-fill"]', { scaleX: 0 });
          tl.to('[data-t="rec-row"]', {
            opacity: 1,
            x: 0,
            duration: 0.4,
            stagger: 0.16,
            ease: EASE,
          });
          tl.to('[data-t="rec-more"]', { opacity: 1, duration: 0.3 });
          move(tl, '[data-t="issue-btn"]', 0.6);
          click(tl);
          tl.to('[data-t="issue-fill"]', {
            scaleX: 1,
            duration: 1.1,
            ease: "power1.inOut",
          });
          pop(tl, '[data-t="issued"]');
        } else if (i === 2) {
          gsap.set('[data-t="email"]', { opacity: 0, y: 18 });
          gsap.set('[data-t="phone"]', { opacity: 0, y: 30 });
          gsap.set('[data-t="linkedin"]', { opacity: 0, scale: 0.7 });
          tl.to('[data-t="email"]', { opacity: 1, y: 0, duration: 0.55, ease: EASE });
          tl.to('[data-t="phone"]', { opacity: 1, y: 0, duration: 0.6, ease: EASE }, "+=0.3");
          move(tl, '[data-t="share-btn"]', 0.6);
          click(tl);
          pop(tl, '[data-t="linkedin"]');
        } else if (i === 3) {
          const target = $('[data-t="v-text"]');
          if (target) target.textContent = "";
          gsap.set('[data-t="v-check"]', { opacity: 0, y: 6 });
          gsap.set('[data-t="v-badge"]', { opacity: 0, scale: 0.6 });
          gsap.set('[data-t="v-beam"]', { x: 0, opacity: 0 });
          move(tl, '[data-t="v-input"]', 0.55);
          click(tl);
          tl.add(() => {
            if (target) target.textContent = "glemo.io/c/8f3a…c21";
          });
          move(tl, '[data-t="v-btn"]', 0.45);
          click(tl);
          tl.fromTo(
            '[data-t="v-beam"]',
            { x: 0, opacity: 0 },
            { x: 360, opacity: 1, duration: 0.6, ease: "power2.inOut" }
          ).to('[data-t="v-beam"]', { opacity: 0, duration: 0.12 }, "-=0.1");
          tl.to('[data-t="v-check"]', {
            opacity: 1,
            y: 0,
            duration: 0.3,
            stagger: 0.14,
            ease: EASE,
          });
          pop(tl, '[data-t="v-badge"]');
        } else {
          gsap.set('[data-t="a-row"]', { opacity: 0, x: -12 });
          tl.to('[data-t="a-row"]', {
            opacity: 1,
            x: 0,
            duration: 0.4,
            stagger: 0.2,
            ease: EASE,
          });
          move(tl, '[data-t="a-export"]', 0.6);
          click(tl);
        }
      });

      advanceTimer = window.setTimeout(() => {
        if (!alive) return;
        if (!visible || document.hidden) {
          // idle-wait without advancing
          advanceTimer = window.setTimeout(() => playScene(i), 1200);
          return;
        }
        setActive((i + 1) % steps.length);
      }, SCENE_SECONDS[i] * 1000);
    };

    playScene(active);

    return () => {
      alive = false;
      window.clearTimeout(advanceTimer);
      io.disconnect();
      ctx.revert();
    };
  }, [active, animated, steps.length]);

  return (
    <section id="action" className="py-[clamp(5rem,12vh,9rem)]">
      <div className="container-g">
        <Reveal>
          <h2 className="text-h2 font-bold text-ink">{t("title")}</h2>
          <p className="mt-4 max-w-[36rem] text-body text-ink-2">{t("sub")}</p>
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-[340px_1fr] lg:gap-14">
          {/* rail */}
          <ol className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
            {steps.map((s, i) => (
              <li key={s.name} className="min-w-[220px] lg:min-w-0">
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  aria-current={active === i}
                  className={cn(
                    "w-full rounded-md border p-4 text-left transition-all duration-500 ease-glemo lg:p-5",
                    active === i
                      ? "border-line bg-surface"
                      : "border-transparent opacity-45 hover:opacity-80"
                  )}
                >
                  <span className="flex items-baseline gap-3">
                    <span
                      className={cn(
                        "font-mono text-[12px] tabular-nums",
                        active === i ? "text-verify" : "text-ink-2"
                      )}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[1.1rem] font-bold text-ink">{s.name}</span>
                  </span>
                  <span
                    className={cn(
                      "mt-1.5 block pl-8 text-[0.9rem] leading-relaxed text-ink-2 transition-opacity duration-400",
                      active === i ? "opacity-100" : "hidden lg:block lg:opacity-0"
                    )}
                  >
                    {s.desc}
                  </span>
                  {/* progress (static-full when the cursor show is off) */}
                  <span className="mt-3 block h-[3px] w-full overflow-hidden rounded-full bg-line lg:ml-8 lg:w-[calc(100%-2rem)]">
                    <span
                      ref={(el) => {
                        progressRefs.current[i] = el;
                      }}
                      className={cn(
                        "block h-full origin-left bg-verify",
                        active === i ? (animated ? "" : "scale-x-100") : "scale-x-0"
                      )}
                    />
                  </span>
                </button>
              </li>
            ))}
          </ol>

          {/* stage */}
          <div
            ref={stageRef}
            className="relative overflow-hidden rounded-lg border border-line bg-[oklch(0.13_0.011_170)] lg:min-h-[420px]"
            style={{
              backgroundImage:
                "radial-gradient(oklch(1 0 0 / 0.045) 1px, transparent 1px)",
              backgroundSize: "22px 22px",
            }}
          >
            {/* window chrome */}
            <div className="flex items-center gap-1.5 border-b border-line px-4 py-3">
              {[0, 1, 2].map((d) => (
                <span key={d} className="h-2.5 w-2.5 rounded-full bg-surface-2" />
              ))}
              <span className="ml-3 font-mono text-[10.5px] text-ink-2/60">
                glemo · {steps[active].name.toLowerCase()}
              </span>
            </div>

            {/* scenes */}
            <SceneDesign visible={active === 0} done={!animated} sc={sc} />
            <SceneIssue visible={active === 1} done={!animated} sc={sc} />
            <SceneDeliver visible={active === 2} done={!animated} sc={sc} />
            <SceneVerify visible={active === 3} done={!animated} sc={sc} />
            <SceneAudit visible={active === 4} done={!animated} sc={sc} />

            {/* cursor */}
            {animated && (
              <>
                <span className="ga-ring pointer-events-none absolute left-0 top-0 z-40 -ml-4 -mt-4 h-8 w-8 rounded-full border-2 border-verify opacity-0" />
                <svg
                  className="ga-cursor pointer-events-none absolute left-0 top-0 z-50 h-5 w-5 drop-shadow-[0_2px_6px_rgb(0_0_0/0.6)]"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    d="M5 3 L19 12.5 L12.6 13.8 L15.6 20.4 L13 21.6 L10 15 L5 19 Z"
                    fill="oklch(0.96 0.005 165)"
                    stroke="oklch(0.15 0.012 170)"
                    strokeWidth="1.2"
                  />
                </svg>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- scenes ---------- */

type SceneProps = {
  visible: boolean;
  /** render finished state (no-animation contexts) */
  done: boolean;
  sc: Record<string, string | string[] | string[][]> & {
    recipients: string[];
    verifyChecks: string[];
    auditRows: string[][];
  };
};

function Shell({ visible, children }: { visible: boolean; children: React.ReactNode }) {
  // Mobile: normal flow, only the active scene rendered visible (stage height
  // adapts). Desktop: absolute layers cross-fading inside the fixed stage.
  return (
    <div
      className={cn(
        "p-5 sm:p-7 lg:absolute lg:inset-x-0 lg:bottom-0 lg:top-[45px] lg:p-8 lg:transition-opacity lg:duration-400 lg:ease-glemo",
        visible
          ? "block lg:opacity-100"
          : "hidden lg:pointer-events-none lg:block lg:opacity-0"
      )}
      aria-hidden={!visible}
    >
      {children}
    </div>
  );
}

function SceneDesign({ visible, done, sc }: SceneProps) {
  const hidden = done ? "" : "opacity-0";
  return (
    <Shell visible={visible}>
      <div className="flex flex-col gap-4 lg:h-full lg:flex-row lg:items-center lg:gap-6" data-s="0">
        {/* canvas */}
        <div className="grid flex-1 place-items-center rounded-md border border-line bg-surface py-6 lg:self-stretch lg:py-0">
          <div className="relative w-[78%] max-w-[330px] rounded-md border border-line bg-[oklch(0.17_0.013_170)] p-6 text-center">
            <span
              data-t="c-logo"
              className={cn("absolute left-4 top-4", hidden)}
            >
              <svg viewBox="0 0 80 80" className="h-7 w-7" aria-hidden="true">
                <polygon points="40,4 72,22 72,58 40,76 8,58 8,22" fill="none" stroke="var(--verify)" strokeWidth="4" />
                <path d="M28 41 L37 50 L54 30" stroke="var(--verify)" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <p className="px-8 font-mono text-[9px] uppercase tracking-[0.18em] text-ink-2/70">
              {sc.certTitle as string}
            </p>
            <p
              data-t="c-name"
              className={cn(
                "mt-3 rounded-sm border border-dashed border-verify/60 px-2 py-1 font-mono text-[13px] text-verify",
                hidden
              )}
            >
              {"{{recipient_name}}"}
            </p>
            <p className="mt-3 text-[11px] text-ink-2">{sc.certCourse as string}</p>
            <span data-t="c-qr" className={cn("absolute bottom-3 right-3", hidden)}>
              <svg viewBox="0 0 25 25" className="h-8 w-8 text-ink-2" aria-hidden="true">
                {[[0,0],[1,2],[2,1],[3,3],[4,0],[0,4],[2,3],[4,4],[1,0],[3,1]].map(([x,y],k)=>(
                  <rect key={k} x={x*5} y={y*5} width="4" height="4" rx="0.8" fill="currentColor" />
                ))}
              </svg>
            </span>
          </div>
        </div>
        {/* tools */}
        <div className="flex w-full flex-row flex-wrap justify-center gap-2 lg:w-40 lg:shrink-0 lg:flex-col lg:gap-2.5">
          {(
            [
              ["tool-logo", sc.toolLogo],
              ["tool-name", sc.toolName],
              ["tool-qr", sc.toolQr],
            ] as const
          ).map(([id, label]) => (
            <span
              key={id}
              data-t={id}
              className="rounded-md border border-line bg-surface px-4 py-2.5 font-mono text-[12px] text-ink-2"
            >
              {label as string}
            </span>
          ))}
        </div>
      </div>
    </Shell>
  );
}

function SceneIssue({ visible, done, sc }: SceneProps) {
  const initials = ["MT", "DR", "SL"];
  return (
    <Shell visible={visible}>
      <div className="mx-auto flex h-full max-w-[420px] flex-col justify-center" data-s="1">
        <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-2/70">
          recipients.csv
        </p>
        <ul className="mt-3 space-y-2">
          {sc.recipients.map((name, i) => (
            <li
              key={name}
              data-t="rec-row"
              className={cn(
                "flex items-center gap-3 rounded-md border border-line bg-surface px-4 py-2.5",
                done ? "" : "opacity-0"
              )}
            >
              <span className="grid h-7 w-7 place-items-center rounded-full bg-surface-2 text-[10.5px] font-black text-ink-2">
                {initials[i]}
              </span>
              <span className="text-[0.92rem] font-medium text-ink">{name}</span>
            </li>
          ))}
        </ul>
        <p
          data-t="rec-more"
          className={cn("mt-2 pl-1 font-mono text-[11px] text-ink-2/70", done ? "" : "opacity-0")}
        >
          {sc.moreRecipients as string}
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3 sm:gap-4">
          <span
            data-t="issue-btn"
            className="rounded-full bg-verify px-5 py-2.5 text-[0.9rem] font-bold text-[oklch(0.17_0.03_170)]"
          >
            {sc.issueButton as string}
          </span>
          <span className="h-[5px] flex-1 overflow-hidden rounded-full bg-line">
            <span
              data-t="issue-fill"
              className={cn("block h-full origin-left bg-verify", done ? "" : "scale-x-0")}
            />
          </span>
          <span
            data-t="issued"
            className={cn(
              "rounded-full border border-verify px-3 py-1 font-mono text-[11px] text-verify",
              done ? "" : "opacity-0"
            )}
          >
            {sc.issuedChip as string}
          </span>
        </div>
      </div>
    </Shell>
  );
}

function SceneDeliver({ visible, done, sc }: SceneProps) {
  const hidden = done ? "" : "opacity-0";
  return (
    <Shell visible={visible}>
      <div
        className="flex flex-col items-center gap-5 lg:h-full lg:flex-row lg:justify-center lg:gap-6"
        data-s="2"
      >
        <div
          data-t="email"
          className={cn(
            "w-full max-w-[300px] rounded-md border border-line bg-surface p-5",
            hidden
          )}
        >
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-surface-2 text-sm">✉</span>
            <div className="min-w-0">
              <p className="truncate text-[0.95rem] font-bold text-ink">
                {sc.emailSubject as string}
              </p>
              <p className="text-[12px] text-ink-2">{sc.emailFrom as string}</p>
            </div>
          </div>
          <span className="mt-4 inline-block rounded-full border border-line px-4 py-2 text-[12.5px] font-bold text-ink">
            glemo.io/c/8f3a…c21
          </span>
        </div>
        <div
          data-t="phone"
          className={cn(
            "relative w-[170px] rounded-[22px] border border-line bg-[oklch(0.17_0.013_170)] p-3 pb-5",
            hidden
          )}
        >
          <span className="mx-auto mb-2 block h-1 w-10 rounded-full bg-surface-2" />
          <div className="rounded-md border border-line bg-surface p-3">
            <svg viewBox="0 0 80 80" className="h-5 w-5" aria-hidden="true">
              <polygon points="40,4 72,22 72,58 40,76 8,58 8,22" fill="none" stroke="var(--verify)" strokeWidth="4" />
              <path d="M28 41 L37 50 L54 30" stroke="var(--verify)" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="mt-2 text-[11.5px] font-bold leading-tight text-ink">
              María Torres
            </p>
            <p className="text-[10px] text-ink-2">{sc.certCourse as string}</p>
          </div>
          <span
            data-t="share-btn"
            className="mt-3 block rounded-full bg-verify px-3 py-2 text-center text-[11px] font-bold text-[oklch(0.17_0.03_170)]"
          >
            {sc.walletShare as string}
          </span>
          <span
            data-t="linkedin"
            className={cn(
              "absolute -right-3 -top-3 grid h-9 w-9 place-items-center rounded-md bg-[#0A66C2] text-[13px] font-black text-white",
              hidden
            )}
          >
            in
          </span>
        </div>
      </div>
    </Shell>
  );
}

function SceneVerify({ visible, done, sc }: SceneProps) {
  const hidden = done ? "" : "opacity-0";
  return (
    <Shell visible={visible}>
      <div className="mx-auto flex h-full max-w-[430px] flex-col justify-center" data-s="3">
        <div className="flex items-center gap-2.5">
          <span
            data-t="v-input"
            className="flex-1 rounded-full border border-line bg-surface px-4 py-2.5 font-mono text-[12px] text-ink-2"
          >
            <span data-t="v-text">{done ? "glemo.io/c/8f3a…c21" : ""}</span>
            <span className="caret text-verify">▍</span>
          </span>
          <span
            data-t="v-btn"
            className="rounded-full bg-verify px-4 py-2.5 text-[0.85rem] font-bold text-[oklch(0.17_0.03_170)]"
          >
            ✓
          </span>
        </div>

        <div className="relative mt-5 overflow-hidden rounded-md border border-line bg-surface p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[1rem] font-bold text-ink">María Torres</p>
              <p className="text-[12px] text-ink-2">
                {sc.certCourse as string} · Andes Tech Academy
              </p>
            </div>
            <span
              data-t="v-badge"
              className={cn(
                "rounded-md border-2 border-verify px-2.5 py-1 font-mono text-[11px] font-medium tracking-[0.1em] text-verify",
                hidden
              )}
            >
              VERIFIED ✓
            </span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {sc.verifyChecks.map((c) => (
              <span
                key={c}
                data-t="v-check"
                className={cn(
                  "rounded-full border border-line px-3 py-1 font-mono text-[11px] text-ink-2",
                  hidden
                )}
              >
                {c}
              </span>
            ))}
          </div>
          <span
            data-t="v-beam"
            className="pointer-events-none absolute inset-y-0 -left-24 w-20 opacity-0"
            style={{
              background:
                "linear-gradient(100deg, transparent, oklch(0.82 0.155 165 / 0.25), transparent)",
              transform: "skewX(-12deg)",
            }}
          />
        </div>
        <p className="mt-3 text-right font-mono text-[11px] text-verify">
          {sc.verifiedIn as string}
        </p>
      </div>
    </Shell>
  );
}

function SceneAudit({ visible, done, sc }: SceneProps) {
  return (
    <Shell visible={visible}>
      <div className="mx-auto flex h-full max-w-[430px] flex-col justify-center" data-s="4">
        <div className="flex items-center justify-between">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-2/70">
            verification log
          </p>
          <span
            data-t="a-export"
            className="rounded-full border border-line px-3.5 py-1.5 font-mono text-[11px] text-ink-2"
          >
            {sc.auditExport as string} ↓
          </span>
        </div>
        <ul className="mt-3 divide-y divide-line rounded-md border border-line bg-surface font-mono text-[12px]">
          {sc.auditRows.map(([time, who, status]) => (
            <li
              key={time}
              data-t="a-row"
              className={cn(
                "flex items-center justify-between gap-3 px-4 py-3",
                done ? "" : "opacity-0"
              )}
            >
              <span className="text-ink-2/70">{time}</span>
              <span className="flex-1 truncate text-ink">{who}</span>
              <span className={status.includes("revo") ? "text-ink-2" : "text-verify"}>
                {status}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Shell>
  );
}
