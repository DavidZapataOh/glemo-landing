"use client";

import { cn } from "@/lib/utils";

export type CredentialVariant = "diploma" | "cert" | "event";

type Data = {
  kind: string;
  name: string;
  title: string;
  issuer: string;
  year: string;
};

const VARIANT = {
  diploma: {
    card: "bg-paper text-paper-ink border-paper-line",
    sub: "text-paper-ink-2",
    line: "border-paper-line",
    avatar: "linear-gradient(135deg, oklch(0.78 0.11 55), oklch(0.62 0.13 320))",
    initials: "MT",
  },
  cert: {
    card: "bg-surface-2 text-ink border-line",
    sub: "text-ink-2",
    line: "border-line",
    avatar: "linear-gradient(135deg, oklch(0.72 0.12 230), oklch(0.66 0.13 165))",
    initials: "DR",
  },
  event: {
    card: "bg-[oklch(0.24_0.045_165)] text-ink border-[oklch(0.82_0.155_165/0.25)]",
    sub: "text-ink-2",
    line: "border-line",
    avatar: "linear-gradient(135deg, oklch(0.7 0.14 300), oklch(0.75 0.13 160))",
    initials: "SL",
  },
} as const;

/** deterministic mini-QR */
const QR = [
  [1, 1, 1, 0, 1], [1, 0, 0, 1, 0], [1, 0, 1, 1, 1], [0, 1, 1, 0, 1], [1, 0, 1, 1, 0],
];

/**
 * A credential as a physical object (the Privado/Proof lesson): human name,
 * real-looking degree, issuer, signature, QR. HeroStack drives the `.cc-beam`
 * (scan) / `.cc-stamp` / `.cc-chip` elements via GSAP.
 */
export default function CredentialCard({
  variant,
  data,
  verifiedChip,
  className,
}: {
  variant: CredentialVariant;
  data: Data;
  verifiedChip: string;
  className?: string;
}) {
  const v = VARIANT[variant];

  return (
    <div
      className={cn(
        "relative h-[216px] w-[352px] overflow-hidden rounded-lg border p-5",
        "shadow-[0_24px_60px_-24px_rgb(0_0_0/0.55)]",
        v.card,
        className
      )}
    >
      {/* header row */}
      <div className="flex items-start justify-between">
        <p className={cn("font-mono text-[9.5px] uppercase tracking-[0.16em]", v.sub)}>
          {data.kind}
        </p>
        <svg viewBox="0 0 80 80" className="h-6 w-6 opacity-70" aria-hidden="true">
          <polygon
            points="40,4 72,22 72,58 40,76 8,58 8,22"
            fill="none"
            stroke="var(--verify)"
            strokeWidth="4"
          />
          <path
            d="M28 41 L37 50 L54 30"
            stroke="var(--verify)"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* person */}
      <div className="mt-3 flex items-center gap-3.5">
        <span
          className="grid h-12 w-12 shrink-0 place-items-center rounded-full text-[15px] font-black text-white"
          style={{ background: v.avatar }}
          aria-hidden="true"
        >
          {v.initials}
        </span>
        <div className="min-w-0">
          <p className="truncate text-[1.15rem] font-black leading-tight tracking-[-0.01em]">
            {data.name}
          </p>
          <p className={cn("truncate text-[0.9rem] font-medium", v.sub)}>
            {data.title}
          </p>
        </div>
      </div>

      {/* footer */}
      <div className={cn("mt-4 flex items-end justify-between border-t pt-3.5", v.line)}>
        <div className="min-w-0">
          <p className="truncate text-[0.82rem] font-bold">{data.issuer}</p>
          <p className={cn("font-mono text-[10px]", v.sub)}>{data.year}</p>
          {/* signature squiggle */}
          <svg viewBox="0 0 90 16" className="mt-1.5 h-3 w-20 opacity-60" aria-hidden="true">
            <path
              d="M2 11 C 14 3, 20 15, 32 8 S 52 3, 60 9 S 80 13, 88 5"
              stroke="currentColor"
              strokeWidth="1.6"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <svg viewBox="0 0 25 25" className="h-11 w-11 shrink-0 opacity-80" aria-hidden="true">
          {QR.flatMap((row, y) =>
            row.map((on, x) =>
              on ? (
                <rect key={`${x}-${y}`} x={x * 5} y={y * 5} width="4.2" height="4.2" rx="0.8" fill="currentColor" />
              ) : null
            )
          )}
        </svg>
      </div>

      {/* scan beam (driven by HeroStack) */}
      <div
        className="cc-beam pointer-events-none absolute inset-y-0 -left-28 w-24 opacity-0"
        style={{
          background:
            "linear-gradient(100deg, transparent, oklch(0.82 0.155 165 / 0.28), transparent)",
          transform: "skewX(-12deg)",
        }}
        aria-hidden="true"
      />

      {/* verified chip (top-right pop) */}
      <span className="cc-chip absolute right-4 top-4 hidden rounded-full bg-verify px-2.5 py-1 font-mono text-[10px] font-medium text-[oklch(0.17_0.03_170)] opacity-0 sm:block">
        {verifiedChip}
      </span>

      {/* stamp */}
      <div
        className="cc-stamp pointer-events-none absolute bottom-5 right-16 rotate-[-11deg] rounded-md border-2 border-verify px-2.5 py-1 opacity-0"
        aria-hidden="true"
      >
        <span className="flex items-center gap-1.5 font-mono text-[11px] font-medium tracking-[0.12em] text-verify">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none">
            <path d="M4 12.5 L9.5 18 L20 6.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          VERIFIED
        </span>
      </div>
    </div>
  );
}
