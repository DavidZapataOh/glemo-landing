"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * The verification network — the hero visual and brand motif.
 * Canvas draws the links and the traveling light pulses; HTML chips carry the
 * node labels (crisper type, accessible). A pulse travels issuer → core →
 * verifier; on arrival the verifier chip flashes its "verified ✓" state.
 *
 * Honest by design: this is a product visualization, not usage data.
 * Reduced motion: a single static frame with one verified state shown.
 */

type NodeDef = {
  id: string;
  side: "issuer" | "verifier";
  x: number; // fraction of width
  y: number; // fraction of height
  mobile?: boolean; // keep visible on small screens
};

const NODES: NodeDef[] = [
  { id: "university", side: "issuer", x: 0.1, y: 0.16, mobile: true },
  { id: "bootcamp", side: "issuer", x: 0.055, y: 0.42 },
  { id: "academy", side: "issuer", x: 0.07, y: 0.68, mobile: true },
  { id: "event", side: "issuer", x: 0.13, y: 0.9 },
  { id: "employer", side: "verifier", x: 0.9, y: 0.16, mobile: true },
  { id: "platform", side: "verifier", x: 0.945, y: 0.42 },
  { id: "hrTool", side: "verifier", x: 0.93, y: 0.68, mobile: true },
  { id: "marketplace", side: "verifier", x: 0.87, y: 0.9 },
];

const CORE = { x: 0.5, y: 0.5 };

/** point on a cubic bezier */
function bezier(
  t: number,
  p0: { x: number; y: number },
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  p3: { x: number; y: number }
) {
  const u = 1 - t;
  return {
    x:
      u * u * u * p0.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t * t * t * p3.x,
    y:
      u * u * u * p0.y + 3 * u * u * t * p1.y + 3 * u * t * t * p2.y + t * t * t * p3.y,
  };
}

type Pulse = {
  from: number; // node index
  to: number; // node index
  start: number; // ms timestamp
  leg: "in" | "out"; // issuer→core, then core→verifier
};

const LEG_MS = 850;

export default function NetworkCanvas({ className }: { className?: string }) {
  const t = useTranslations("hero");
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const chipRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const styles = getComputedStyle(document.documentElement);
    const cVerify = styles.getPropertyValue("--verify").trim() || "#3BE8A6";
    const cLine = "rgba(242, 245, 242, 0.10)";
    const cDot = "rgba(242, 245, 242, 0.35)";

    let w = 0;
    let h = 0;
    let raf = 0;
    let running = true;
    let pulses: Pulse[] = [];
    let nextPulseAt = performance.now() + 600;
    const reduced = prefersReducedMotion();

    const px = (n: { x: number; y: number }) => ({ x: n.x * w, y: n.y * h });

    const controls = (a: { x: number; y: number }, b: { x: number; y: number }) => {
      const dx = (b.x - a.x) * 0.45;
      return [
        { x: a.x + dx, y: a.y },
        { x: b.x - dx, y: b.y },
      ] as const;
    };

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = wrap!.clientWidth;
      h = wrap!.clientHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function drawLinks() {
      ctx!.clearRect(0, 0, w, h);
      const core = px(CORE);
      NODES.forEach((n) => {
        const p = px(n);
        const [c1, c2] = controls(p, core);
        ctx!.beginPath();
        ctx!.moveTo(p.x, p.y);
        ctx!.bezierCurveTo(c1.x, c1.y, c2.x, c2.y, core.x, core.y);
        ctx!.strokeStyle = cLine;
        ctx!.lineWidth = 1;
        ctx!.stroke();
        // node dot
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx!.fillStyle = cDot;
        ctx!.fill();
      });
    }

    function flashChip(index: number) {
      const chip = chipRefs.current[index];
      if (!chip) return;
      chip.classList.add("chip-verified");
      window.setTimeout(() => chip.classList.remove("chip-verified"), 1600);
    }

    function flashCore() {
      const core = coreRef.current;
      if (!core) return;
      core.classList.add("core-pulse");
      window.setTimeout(() => core.classList.remove("core-pulse"), 500);
    }

    function drawPulse(pulse: Pulse, now: number) {
      const core = px(CORE);
      const t01 = Math.min((now - pulse.start) / LEG_MS, 1);
      const from = pulse.leg === "in" ? px(NODES[pulse.from]) : core;
      const to = pulse.leg === "in" ? core : px(NODES[pulse.to]);
      const [c1, c2] = controls(from, to);
      const pos = bezier(t01, from, c1, c2, to);

      ctx!.beginPath();
      ctx!.arc(pos.x, pos.y, 3.5, 0, Math.PI * 2);
      ctx!.fillStyle = cVerify;
      ctx!.shadowColor = cVerify;
      ctx!.shadowBlur = 14;
      ctx!.fill();
      ctx!.shadowBlur = 0;

      if (t01 >= 1) {
        if (pulse.leg === "in") {
          flashCore();
          pulse.leg = "out";
          pulse.start = now + 120;
        } else {
          flashChip(pulse.to);
          return false; // done
        }
      }
      return true;
    }

    function frame(now: number) {
      if (!running) return;
      drawLinks();

      if (now >= nextPulseAt) {
        const issuers = NODES.map((n, i) => (n.side === "issuer" ? i : -1)).filter(
          (i) => i >= 0
        );
        const verifiers = NODES.map((n, i) => (n.side === "verifier" ? i : -1)).filter(
          (i) => i >= 0
        );
        pulses.push({
          from: issuers[Math.floor(Math.random() * issuers.length)],
          to: verifiers[Math.floor(Math.random() * verifiers.length)],
          start: now,
          leg: "in",
        });
        nextPulseAt = now + 1500 + Math.random() * 900;
      }

      pulses = pulses.filter((p) => now >= p.start - 200 && drawPulse(p, now) !== false);
      raf = requestAnimationFrame(frame);
    }

    resize();
    const ro = new ResizeObserver(() => {
      resize();
      if (reduced) drawLinks();
    });
    ro.observe(wrap);

    if (reduced) {
      // Static frame: links + one verifier shown in its verified state
      drawLinks();
      const chip = chipRefs.current[4];
      chip?.classList.add("chip-verified");
    } else {
      const io = new IntersectionObserver(
        ([entry]) => {
          const visible = entry.isIntersecting;
          if (visible && !running) {
            running = true;
            raf = requestAnimationFrame(frame);
          } else if (!visible) {
            running = false;
            cancelAnimationFrame(raf);
          }
        },
        { threshold: 0.05 }
      );
      io.observe(wrap);
      raf = requestAnimationFrame(frame);
      return () => {
        running = false;
        cancelAnimationFrame(raf);
        io.disconnect();
        ro.disconnect();
      };
    }

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className={cn("relative", className)}
      role="img"
      aria-label={t("coreLabel")}
    >
      <canvas ref={canvasRef} className="absolute inset-0" aria-hidden="true" />

      {/* side labels */}
      <span className="absolute left-[2%] top-0 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-2/70 max-sm:hidden">
        {t("issuersLabel")}
      </span>
      <span className="absolute right-[2%] top-0 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-2/70 max-sm:hidden">
        {t("verifiersLabel")}
      </span>

      {/* core */}
      <div
        ref={coreRef}
        className="core absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <div className="relative grid h-16 w-16 place-items-center sm:h-20 sm:w-20">
          <svg viewBox="0 0 80 80" className="absolute inset-0 h-full w-full" aria-hidden="true">
            <polygon
              points="40,4 72,22 72,58 40,76 8,58 8,22"
              fill="var(--surface)"
              stroke="var(--verify)"
              strokeWidth="1.5"
            />
          </svg>
          <svg viewBox="0 0 24 24" className="relative h-6 w-6 sm:h-7 sm:w-7" fill="none" aria-hidden="true">
            <path
              d="M4 12.5 L9.5 18 L20 6.5"
              stroke="var(--verify)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* node chips */}
      {NODES.map((n, i) => (
        <div
          key={n.id}
          ref={(el) => {
            chipRefs.current[i] = el;
          }}
          className={cn(
            "chip absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap",
            !n.mobile && "max-sm:hidden"
          )}
          style={{ left: `${n.x * 100}%`, top: `${n.y * 100}%` }}
        >
          <span className="chip-label rounded-full border border-line bg-surface/90 px-3 py-1.5 text-[12.5px] font-medium text-ink-2 backdrop-blur-sm transition-colors duration-300 ease-glemo sm:text-[13px]">
            {t(`nodes.${n.id}`)}
          </span>
          <span className="chip-badge pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 rounded-full bg-verify px-2 py-0.5 font-mono text-[10px] font-medium text-[oklch(0.17_0.03_170)] opacity-0 transition-all duration-300 ease-glemo">
            {t("pulse")} ✓
          </span>
        </div>
      ))}

      <style jsx>{`
        .core :global(svg) {
          filter: drop-shadow(0 0 10px oklch(0.82 0.155 165 / 0.25));
          transition: filter 0.4s cubic-bezier(0.625, 0.05, 0, 1);
        }
        .core.core-pulse :global(svg) {
          filter: drop-shadow(0 0 22px oklch(0.82 0.155 165 / 0.65));
        }
        .chip.chip-verified :global(.chip-label),
        .chip.chip-verified .chip-label {
          border-color: var(--verify);
          color: var(--ink);
        }
        .chip.chip-verified .chip-badge {
          opacity: 1;
          transform: translate(-50%, -4px);
        }
        @media (prefers-reduced-motion: reduce) {
          .core :global(svg) {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}
