"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { useReducedMotion } from "framer-motion";
import { gsap, registerGsap, EASE } from "@/lib/motion";
import Reveal from "./ui/Reveal";
import { cn } from "@/lib/utils";

type Step = { name: string; desc: string };

const SCENE_SECONDS = [4.6, 5.0, 4.8, 4.6, 4.0];

/**
 * "Watch it work": the verification layer demonstrating itself. Something the
 * visitor did not issue arrives, their own rule decides, the verdict keeps its
 * three states apart, the receipt is signed, and the cost lands per rule. A
 * simulated cursor drives it while the rail auto-advances; click any step to
 * jump. Reduced motion / mobile: manual tabs with finished states, no cursor.
 *
 * It used to show design, issue, deliver, verify, audit, which was the product
 * of two sprints ago: three of its five scenes sold issuance on a page whose
 * hero sells the layer.
 */
const DESKTOP_QUERY = "(min-width: 1024px)";

function subscribeToDesktop(onChange: () => void): () => void {
  const mql = window.matchMedia(DESKTOP_QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

export default function GlemoInAction() {
  const t = useTranslations("action");
  const steps = t.raw("steps") as Step[];
  const sc = {
    inbox: t("scene.inbox"),
    arrivals: t.raw("scene.arrivals") as { label: string; kind: string }[],
    ruleTitle: t("scene.ruleTitle"),
    ruleRows: [
      [t("scene.ruleAccept"), t("scene.ruleAcceptValue")],
      [t("scene.ruleFrom"), t("scene.ruleFromValue")],
      [t("scene.ruleFields"), t("scene.ruleFieldsValue")],
    ] as [string, string][],
    rulePublish: t("scene.rulePublish"),
    ruleChip: t("scene.ruleChip"),
    verdictName: t("scene.verdictName"),
    verdictCourse: t("scene.verdictCourse"),
    verdictWord: t("scene.verdictWord"),
    verdictReqs: t.raw("scene.verdictReqs") as [string, string][],
    receiptTitle: t("scene.receiptTitle"),
    receiptLines: t.raw("scene.receiptLines") as string[],
    receiptNote: t("scene.receiptNote"),
    usageTitle: t("scene.usageTitle"),
    usageRows: t.raw("scene.usageRows") as [string, string][],
    usageTotal: t("scene.usageTotal"),
  };

  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const progressRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // Subscribed rather than read once on mount. The old version set state inside an
  // effect, which costs a second render, and it also never re-read the query: a
  // window resized past the breakpoint (or a tablet rotated) kept whichever answer
  // was true at mount, so the cursor show ran on a phone-width viewport.
  const isDesktop = useSyncExternalStore(
    subscribeToDesktop,
    () => window.matchMedia(DESKTOP_QUERY).matches,
    () => false, // the server has no viewport; render the static frame
  );
  const animated = isDesktop && !reduced;

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
          // Three things land that the verifier did not issue. The cursor picks
          // the first, because the point is that it does not matter which.
          gsap.set('[data-t="arr-item"]', { opacity: 0, y: 12 });
          tl.to('[data-t="arr-item"]', {
            opacity: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.18,
            ease: EASE,
          });
          move(tl, '[data-t="arr-item"]', 0.6);
          click(tl);
        } else if (i === 1) {
          gsap.set('[data-t="rule-row"]', { opacity: 0, x: -12 });
          gsap.set('[data-t="rule-chip"]', { opacity: 0, scale: 0.7 });
          tl.to('[data-t="rule-row"]', {
            opacity: 1,
            x: 0,
            duration: 0.4,
            stagger: 0.18,
            ease: EASE,
          });
          move(tl, '[data-t="rule-publish"]', 0.6);
          click(tl);
          pop(tl, '[data-t="rule-chip"]');
        } else if (i === 2) {
          gsap.set('[data-t="v-req"]', { opacity: 0, y: 6 });
          gsap.set('[data-t="v-badge"]', { opacity: 0, scale: 0.6 });
          gsap.set('[data-t="v-beam"]', { x: 0, opacity: 0 });
          tl.fromTo(
            '[data-t="v-beam"]',
            { x: 0, opacity: 0 },
            { x: 360, opacity: 1, duration: 0.6, ease: "power2.inOut" }
          ).to('[data-t="v-beam"]', { opacity: 0, duration: 0.12 }, "-=0.1");
          tl.to('[data-t="v-req"]', {
            opacity: 1,
            y: 0,
            duration: 0.3,
            stagger: 0.16,
            ease: EASE,
          });
          pop(tl, '[data-t="v-badge"]');
        } else if (i === 3) {
          gsap.set('[data-t="r-line"]', { opacity: 0, y: 6 });
          gsap.set('[data-t="r-sig"]', { opacity: 0 });
          gsap.set('[data-t="r-note"]', { opacity: 0, y: 8 });
          tl.to('[data-t="r-line"]', {
            opacity: 1,
            y: 0,
            duration: 0.3,
            stagger: 0.16,
            ease: EASE,
          });
          tl.to('[data-t="r-sig"]', { opacity: 1, duration: 0.45, ease: EASE });
          tl.to('[data-t="r-note"]', { opacity: 1, y: 0, duration: 0.4, ease: EASE }, "-=0.1");
        } else {
          gsap.set('[data-t="u-row"]', { opacity: 0, x: -12 });
          tl.to('[data-t="u-row"]', {
            opacity: 1,
            x: 0,
            duration: 0.4,
            stagger: 0.2,
            ease: EASE,
          });
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
            className="relative overflow-hidden rounded-lg border border-line bg-[oklch(0.13_0.011_170)] lg:h-[460px] lg:self-center"
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
            <SceneArrives visible={active === 0} done={!animated} sc={sc} />
            <SceneRule visible={active === 1} done={!animated} sc={sc} />
            <SceneVerdict visible={active === 2} done={!animated} sc={sc} />
            <SceneReceipt visible={active === 3} done={!animated} sc={sc} />
            <SceneUsage visible={active === 4} done={!animated} sc={sc} />

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
  sc: {
    inbox: string;
    arrivals: { label: string; kind: string }[];
    ruleTitle: string;
    ruleRows: [string, string][];
    rulePublish: string;
    ruleChip: string;
    verdictName: string;
    verdictCourse: string;
    verdictWord: string;
    verdictReqs: [string, string][];
    receiptTitle: string;
    receiptLines: string[];
    receiptNote: string;
    usageTitle: string;
    usageRows: [string, string][];
    usageTotal: string;
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

function SceneArrives({ visible, done, sc }: SceneProps) {
  const hidden = done ? "" : "opacity-0";
  return (
    <Shell visible={visible}>
      <div className="mx-auto flex h-full max-w-[430px] flex-col justify-center" data-s="0">
        <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-2">{sc.inbox}</p>
        <ul className="mt-3 flex flex-col gap-2.5">
          {sc.arrivals.map((a, i) => (
            <li
              key={a.label}
              data-t="arr-item"
              className={cn(
                "flex items-center justify-between gap-3 rounded-md border bg-surface px-4 py-3",
                i === 0 ? "border-verify/50" : "border-line",
                hidden
              )}
            >
              <span className="truncate font-mono text-[12px] text-ink">{a.label}</span>
              <span className="shrink-0 rounded-full border border-line px-2.5 py-0.5 font-mono text-[10.5px] text-ink-2">
                {a.kind}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Shell>
  );
}

function SceneRule({ visible, done, sc }: SceneProps) {
  const hidden = done ? "" : "opacity-0";
  return (
    <Shell visible={visible}>
      <div className="mx-auto flex h-full max-w-[430px] flex-col justify-center" data-s="1">
        <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-2">
          {sc.ruleTitle}
        </p>
        <div className="mt-3 divide-y divide-line rounded-md border border-line bg-surface">
          {sc.ruleRows.map(([k, v]) => (
            <div
              key={k}
              data-t="rule-row"
              className={cn("flex items-baseline justify-between gap-4 px-4 py-3", hidden)}
            >
              <span className="shrink-0 font-mono text-[10.5px] uppercase tracking-[0.1em] text-ink-2">
                {k}
              </span>
              <span className="text-right text-[0.9rem] leading-[1.4] text-ink">{v}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
          <span
            data-t="rule-chip"
            className={cn(
              "rounded-full border border-verify/60 px-3 py-1 font-mono text-[11px] text-verify",
              hidden
            )}
          >
            {sc.ruleChip}
          </span>
          <span
            data-t="rule-publish"
            className="rounded-full bg-verify px-4 py-2 text-[0.85rem] font-bold text-[oklch(0.17_0.03_170)]"
          >
            {sc.rulePublish}
          </span>
        </div>
      </div>
    </Shell>
  );
}

function SceneVerdict({ visible, done, sc }: SceneProps) {
  const hidden = done ? "" : "opacity-0";
  return (
    <Shell visible={visible}>
      <div className="mx-auto flex h-full max-w-[430px] flex-col justify-center" data-s="2">
        <div className="relative overflow-hidden rounded-md border border-line bg-surface p-5">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="truncate text-[1rem] font-bold text-ink">{sc.verdictName}</p>
              <p className="truncate text-[12px] text-ink-2">{sc.verdictCourse}</p>
            </div>
            <span
              data-t="v-badge"
              className={cn(
                "shrink-0 rounded-md border-2 border-verify px-2.5 py-1 font-mono text-[11px] font-medium tracking-[0.1em] text-verify",
                hidden
              )}
            >
              {sc.verdictWord}
            </span>
          </div>

          {/* The three states, kept apart. Collapsing the last one into "not met"
              would assert something nobody checked. */}
          <dl className="mt-4 flex flex-col gap-2 border-t border-line pt-4">
            {sc.verdictReqs.map(([name, state], i) => (
              <div
                key={name}
                data-t="v-req"
                className={cn("flex items-baseline justify-between gap-4 font-mono text-[12px]", hidden)}
              >
                <dt className="text-ink-2">{name}</dt>
                <dd className={i === sc.verdictReqs.length - 1 ? "text-ink-2" : "text-verify"}>
                  {state}
                </dd>
              </div>
            ))}
          </dl>

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
        <p className="mt-3 text-right font-mono text-[11px] text-ink-2">{sc.ruleChip}</p>
      </div>
    </Shell>
  );
}

function SceneReceipt({ visible, done, sc }: SceneProps) {
  const hidden = done ? "" : "opacity-0";
  return (
    <Shell visible={visible}>
      <div className="mx-auto flex h-full max-w-[430px] flex-col justify-center" data-s="3">
        <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-2">
          {sc.receiptTitle}
        </p>
        <div className="mt-3 rounded-md border border-line bg-surface p-4">
          {sc.receiptLines.map((l, i) => (
            <p
              key={l}
              data-t="r-line"
              className={cn("font-mono text-[12px] text-ink-2", i > 0 && "mt-1.5", hidden)}
            >
              {l}
            </p>
          ))}
          <p
            data-t="r-sig"
            className={cn(
              "mt-3 truncate border-t border-line pt-3 font-mono text-[11px] text-verify",
              hidden
            )}
          >
            eyJhbGciOiJFUzI1NiIsInR5cCI6InNlY2V2ZW50K2p3dCJ9…
          </p>
        </div>
        <p
          data-t="r-note"
          className={cn("mt-3 text-[0.85rem] leading-[1.55] text-ink-2", hidden)}
        >
          {sc.receiptNote}
        </p>
      </div>
    </Shell>
  );
}

function SceneUsage({ visible, done, sc }: SceneProps) {
  const hidden = done ? "" : "opacity-0";
  return (
    <Shell visible={visible}>
      <div className="mx-auto flex h-full max-w-[430px] flex-col justify-center" data-s="4">
        <div className="flex items-baseline justify-between gap-3">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-2">
            {sc.usageTitle}
          </p>
          <span className="font-mono text-[11px] text-ink-2">{sc.usageTotal}</span>
        </div>
        <ul className="mt-3 divide-y divide-line rounded-md border border-line bg-surface font-mono text-[12px]">
          {sc.usageRows.map(([rule, count], i) => (
            <li
              key={rule}
              data-t="u-row"
              className={cn("flex items-center justify-between gap-3 px-4 py-3", hidden)}
            >
              <span className={i === sc.usageRows.length - 1 ? "text-ink-2" : "text-ink"}>
                {rule}
              </span>
              <span className="text-ink-2">{count}</span>
            </li>
          ))}
        </ul>
      </div>
    </Shell>
  );
}
