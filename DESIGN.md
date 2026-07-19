# Design

Visual system for the Glemo landing (v2, branch `landing-v2`). Register: brand. Strategy: **Committed** — a green-tinted ink-black canvas carries the brand; one electric verification-green accent, strictly reserved.

## Color

All colors OKLCH. Neutrals are tinted toward the brand hue (165, green) — never generic warm/cool.

### Dark canvas (default world)

| Token | OKLCH | ~Hex | Role |
|---|---|---|---|
| `--bg` | `oklch(0.15 0.012 170)` | `#0B100E` | Page canvas (green-tinted near-black — ownable vs blue-tinted dev default) |
| `--surface` | `oklch(0.19 0.014 170)` | `#141B18` | Raised panels (elevation = lighter, no shadows) |
| `--surface-2` | `oklch(0.24 0.016 170)` | `#1D2622` | Higher elevation, hover |
| `--ink` | `oklch(0.96 0.005 165)` | `#F2F5F2` | Primary text on dark |
| `--ink-2` | `oklch(0.75 0.015 168)` | `#A9B5AE` | Secondary text (AA on `--bg`) |
| `--line` | `oklch(1 0 0 / 0.09)` | — | Hairlines on dark |

### Light band (paper — used for the feature tour / FAQ interludes)

| Token | OKLCH | ~Hex | Role |
|---|---|---|---|
| `--paper` | `oklch(0.97 0.006 165)` | `#F2F6F2` | Band background (tinted toward brand hue per colorize rules — not generic cream) |
| `--paper-ink` | `oklch(0.2 0.015 170)` | `#161D19` | Text on paper |
| `--paper-ink-2` | `oklch(0.45 0.02 168)` | `#4E5C55` | Secondary on paper (AA) |
| `--paper-line` | `oklch(0 0 0 / 0.10)` | — | Hairlines on paper |

### Accent — verification green (the only thing that glows)

| Token | OKLCH | ~Hex | Role |
|---|---|---|---|
| `--verify` | `oklch(0.82 0.155 165)` | `#3BE8A6` | On dark: CTAs, verified checks, key words, network pulses. Slightly desaturated vs light-mode per dark-mode rules |
| `--verify-strong` | `oklch(0.87 0.17 163)` | `#54F5B4` | Pulse peaks, hover |
| `--verify-ink` | `oklch(0.52 0.11 166)` | `#1B7A57` | Accent-as-text on paper (AA) |
| `--verify-dim` | `oklch(0.82 0.155 165 / 0.12)` | — | Accent washes/tints |

Rules: the accent never exceeds ~10% of any viewport. Semantic green = "verified" everywhere; no other color carries meaning. No purple, no red decoration (error states only, if ever needed).

## Typography

Two families total.

- **Satoshi** (self-hosted, `public/fonts/satoshi/`, weights 400/500/700/900) — display AND body. One family, committed weight contrast. Display: 700/900 with tracking `-0.03em`. Body on dark: **500** (light-on-dark reads lighter; weight bumped one notch per typeset rules), line-height 1.65, letter-spacing `0.01em`.
- **JetBrains Mono** (via `next/font/google`, 400/500) — code, data, API responses, network labels, stats digits (`tabular-nums`). Used where content is genuinely technical — never as decorative eyebrow scaffolding.

Scale (fluid for display, fixed body): `--text-display: clamp(2.6rem, 1.2rem + 6vw, 5.75rem)` (≤6rem ceiling) · `--text-h2: clamp(1.9rem, 1rem + 3.2vw, 3.4rem)` · `--text-h3: 1.375rem` · body `1.0625rem` · small `0.875rem`. Ratio ≥1.25 between steps. `text-wrap: balance` on headings.

## Signature motifs

1. **The verification stroke** — a hand-drawn-feel SVG check/underline in `--verify` that "signs" the key word of the H1 (draws itself in after the hero timeline lands). The brand ritual; reused sparingly (hero + final CTA only).
2. **The network** — canvas 2D field: issuer nodes → Glemo core → verifier nodes, bezier links, light pulses traveling; a node flashes green when "verified". Appears in hero, echoed (dimmed, slower) behind the final CTA.
3. **Mono data labels** — small JetBrains Mono captions on genuinely technical elements (`~180ms`, `sig: valid ✓`, `p95 latency`), the Spade/Osmo pattern applied only where data is real.

## Motion

Stack: Lenis (`lerp: 0.15, wheelMultiplier: 1.2`) synced to `gsap.ticker` · GSAP 3.15 + ScrollTrigger + SplitText + CustomEase · framer-motion for micro-UI.

- **Signature ease**: `CustomEase.create("glemo", "0.625, 0.05, 0, 1")` (≈ expo-out) for every reveal. `back.out(1.7)` reserved for the hero CTA pop only. Exits at ~75% of entry duration.
- **Durations**: 0.3s micro / 0.5s fades / 0.8s reveals / hero timeline ≈1.6s total, overlapped offsets (`-=0.4` style).
- **Headline reveal**: SplitText masked lines (`yPercent: 100, rotate: 4→0`, stagger 0.06) — hero + the two statement headings only. Sections otherwise reveal with restrained fades or purpose-built motion (counters, terminal typing, pinned scrub). No uniform fade-up-on-every-section.
- **Pinned sequence**: "How it works" 01→03, one pin, scrub, max ~2.5 viewports.
- **Marquees**: CSS keyframes at constant speed (width/50 px/s), pause on hover, stop under reduced motion.
- **Reduced motion**: canvas renders one static frame; SplitText reveals become instant opacity; pin becomes normal flow; marquees static. Gate: `useReducedMotion()` + CSS media query.

## Layout

- Container: `max-w-[1200px]`, gutter `clamp(1.25rem, 4vw, 2.5rem)`.
- Spacing: 4pt scale; section separations `clamp(6rem, 12vh, 10rem)` on dark, tighter inside groups (8–12px siblings). Rhythm varies: the problem-statement section is a full viewport of type; the dev section is dense.
- Nav: floating pill, `position: fixed`, inset from top, backdrop blur (the one permitted glass moment).
- Radius: `--r-sm: 10px`, `--r-md: 16px`, `--r-lg: 24px`, pill `999px`.
- Z-scale: `--z-nav: 40`, `--z-overlay: 50`.
- No identical card grids; audience section uses an interactive rail, feature tour uses alternating large scenes.

## Components

`components/v2/`: `Nav`, `Announcement`, `Hero` (+`NetworkCanvas`), `StandardsStrip`, `Problem`, `HowItWorks`, `FeatureTour`, `DevTerminal`, `Audiences`, `Faq`, `FinalCta`, `Footer`, primitives in `components/v2/ui/` (`Button`, `SectionTitle`, `Reveal`, `Marquee`, `VerifyStroke`).
