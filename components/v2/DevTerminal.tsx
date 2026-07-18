"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useReducedMotion } from "framer-motion";
import Reveal from "./ui/Reveal";
import { cn } from "@/lib/utils";

const SNIPPETS: Record<string, string> = {
  curl: `curl -X POST https://api.glemo.io/v1/verifications \\
  -H "Authorization: Bearer glm_sk_…" \\
  -d '{ "credential": "glm_cred_8f3a…c21" }'`,
  node: `import { Glemo } from "@glemo/sdk";

const glemo = new Glemo("glm_sk_…");
const check = await glemo.verify("glm_cred_8f3a…c21");`,
  python: `from glemo import Glemo

glemo = Glemo("glm_sk_…")
check = glemo.verify("glm_cred_8f3a…c21")`,
};

const RESPONSE = [
  `{`,
  `  "status": "verified",`,
  `  "issuer": "Andes Tech Academy",`,
  `  "issued_at": "2026-03-14",`,
  `  "revoked": false,`,
  `  "latency_ms": 182`,
  `}`,
];

/**
 * Developer section — the credibility no competitor shows: real code, typing
 * itself, answering with the verified state. Typing starts when the panel
 * enters the viewport; reduced motion renders everything instantly.
 */
export default function DevTerminal() {
  const t = useTranslations("dev");
  const reduced = useReducedMotion();
  const [tab, setTab] = useState<keyof typeof SNIPPETS>("curl");
  const [typed, setTyped] = useState(0);
  const [showResponse, setShowResponse] = useState(false);
  const [started, setStarted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const snippet = SNIPPETS[tab];

  // start when visible
  useEffect(() => {
    const el = panelRef.current;
    if (!el || started) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setStarted(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [started]);

  // typing loop (restarts on tab change)
  useEffect(() => {
    if (!started) return;
    if (reduced) {
      setTyped(snippet.length);
      setShowResponse(true);
      return;
    }
    setTyped(0);
    setShowResponse(false);
    let i = 0;
    const interval = window.setInterval(() => {
      i += 2;
      setTyped(Math.min(i, snippet.length));
      if (i >= snippet.length) {
        window.clearInterval(interval);
        window.setTimeout(() => setShowResponse(true), 420);
      }
    }, 16);
    return () => window.clearInterval(interval);
  }, [snippet, started, reduced]);

  return (
    <section id="developers" className="py-[clamp(5rem,12vh,9rem)]">
      <div className="container-g grid items-center gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
        <Reveal>
          <h2 className="text-h2 font-bold text-ink">{t("title")}</h2>
          <p className="mt-5 max-w-[32rem] text-body text-ink-2">{t("body")}</p>
          <a
            href="#cta"
            className="mt-7 inline-flex items-center gap-2 font-bold text-verify transition-colors duration-200 hover:text-verify-strong"
          >
            {t("docs")} <span aria-hidden="true">→</span>
          </a>
        </Reveal>

        <Reveal delay={0.1}>
          <div
            ref={panelRef}
            className="overflow-hidden rounded-lg border border-line bg-[oklch(0.12_0.01_170)]"
          >
            {/* window chrome + tabs */}
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <div className="flex gap-1.5" aria-hidden="true">
                {[0, 1, 2].map((d) => (
                  <span key={d} className="h-2.5 w-2.5 rounded-full bg-surface-2" />
                ))}
              </div>
              <div role="tablist" aria-label="Language" className="flex gap-1">
                {(Object.keys(SNIPPETS) as (keyof typeof SNIPPETS)[]).map((k) => (
                  <button
                    key={k}
                    role="tab"
                    aria-selected={tab === k}
                    onClick={() => setTab(k)}
                    className={cn(
                      "rounded-md px-3 py-1.5 font-mono text-[12px] transition-colors duration-200",
                      tab === k
                        ? "bg-surface-2 text-ink"
                        : "text-ink-2 hover:text-ink"
                    )}
                  >
                    {t(`tabs.${k}`)}
                  </button>
                ))}
              </div>
            </div>

            {/* request */}
            <div className="min-h-[128px] px-5 py-4">
              <pre className="whitespace-pre-wrap font-mono text-[13px] leading-relaxed text-ink-2">
                <code>
                  {snippet.slice(0, typed)}
                  {typed < snippet.length && (
                    <span className="caret text-verify">▍</span>
                  )}
                </code>
              </pre>
            </div>

            {/* response */}
            <div
              className={cn(
                "border-t border-line bg-bg/60 px-5 py-4 transition-all duration-500 ease-glemo",
                showResponse ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
              )}
              aria-hidden={!showResponse}
            >
              <p className="mb-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-2/60">
                200 OK
              </p>
              <pre className="font-mono text-[13px] leading-relaxed text-ink-2">
                <code>
                  {RESPONSE.map((line, i) => (
                    <span
                      key={i}
                      className={cn(
                        "block",
                        line.includes("verified") && "text-verify"
                      )}
                    >
                      {line}
                    </span>
                  ))}
                </code>
              </pre>
            </div>
          </div>
          <p className="mt-3 text-right font-mono text-[10.5px] tracking-wide text-ink-2/50">
            {t("responseNote")}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
