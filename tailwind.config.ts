import type { Config } from "tailwindcss";
import { createPreset } from "fumadocs-ui/tailwind-plugin";

/**
 * Glemo landing v2: design tokens.
 * Single source of truth for values lives in app/globals.css (OKLCH custom
 * properties); Tailwind maps semantic names onto those variables.
 * Strategy: Committed. Green-tinted ink canvas, one reserved verification-green accent.
 * Docs (/docs) use the Fumadocs preset; its theme is painted with the same
 * tokens via app/docs/docs.css (--fd-* in HSL channels).
 */
const config: Config = {
  presets: [createPreset()],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.mdx",
    "./node_modules/fumadocs-ui/dist/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        /* Values duplicated from app/globals.css on purpose: Tailwind needs
           <alpha-value> for opacity modifiers (bg-bg/75, text-ink-2/70), which
           var() colors can't provide. DESIGN.md is the source of truth. */
        bg: "oklch(0.15 0.012 170 / <alpha-value>)",
        surface: "oklch(0.19 0.014 170 / <alpha-value>)",
        "surface-2": "oklch(0.24 0.016 170 / <alpha-value>)",
        ink: "oklch(0.96 0.005 165 / <alpha-value>)",
        "ink-2": "oklch(0.75 0.015 168 / <alpha-value>)",
        line: "var(--line)",
        paper: "oklch(0.97 0.006 165 / <alpha-value>)",
        "paper-ink": "oklch(0.2 0.015 170 / <alpha-value>)",
        "paper-ink-2": "oklch(0.45 0.02 168 / <alpha-value>)",
        "paper-line": "var(--paper-line)",
        verify: "oklch(0.82 0.155 165 / <alpha-value>)",
        "verify-strong": "oklch(0.87 0.17 163 / <alpha-value>)",
        "verify-ink": "oklch(0.52 0.11 166 / <alpha-value>)",
        "verify-dim": "var(--verify-dim)",
      },
      fontFamily: {
        sans: ["var(--font-satoshi)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
      },
      fontSize: {
        display: [
          "clamp(2.6rem, 1.2rem + 6vw, 5.75rem)",
          { lineHeight: "1.02", letterSpacing: "-0.03em" },
        ],
        h2: [
          "clamp(1.9rem, 1rem + 3.2vw, 3.4rem)",
          { lineHeight: "1.08", letterSpacing: "-0.025em" },
        ],
        h3: ["1.375rem", { lineHeight: "1.25", letterSpacing: "-0.01em" }],
        body: ["1.0625rem", { lineHeight: "1.65", letterSpacing: "0.01em" }],
      },
      borderRadius: {
        sm: "10px",
        md: "16px",
        lg: "24px",
      },
      zIndex: {
        nav: "40",
        overlay: "50",
      },
      transitionTimingFunction: {
        // Signature ease: cubic-bezier(0.625, 0.05, 0, 1), mirrors GSAP CustomEase "glemo"
        glemo: "cubic-bezier(0.625, 0.05, 0, 1)",
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      maxWidth: {
        container: "1200px",
      },
    },
  },
  plugins: [],
};

export default config;
