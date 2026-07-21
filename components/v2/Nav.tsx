"use client";

import { useCallback } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { getLenis } from "@/lib/motion";
import LocaleSwitcher from "./LocaleSwitcher";

const LINKS = [
  { id: "action", key: "product" },
  { id: "developers", key: "developers" },
  { id: "institutions", key: "institutions" },
  { id: "faq", key: "faq" },
] as const;

/**
 * Floating pill nav (Proof/Mavity pattern) over a slim announcement bar.
 * The announcement scrolls away; the pill stays.
 */
export default function Nav() {
  const t = useTranslations("nav");
  const ta = useTranslations("announcement");

  const scrollTo = useCallback((hash: string) => {
    const lenis = getLenis();
    const el = document.querySelector(hash) as HTMLElement | null;
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -96 });
    else el.scrollIntoView({ behavior: "smooth" });
  }, []);

  const onLink =
    (hash: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      scrollTo(hash);
    };

  return (
    <>
      {/* announcement: scrolls away with the page */}
      <div className="relative z-10 border-b border-line bg-surface/60">
        <div className="container-g flex items-center justify-center gap-3 py-2.5">
          <span className="h-1.5 w-1.5 rounded-full bg-verify" aria-hidden="true" />
          <p className="text-[13px] font-medium text-ink-2">
            {ta("text")}{" "}
            <a
              href="#cta"
              onClick={onLink("#cta")}
              className="font-bold text-ink underline decoration-verify decoration-2 underline-offset-4 hover:text-verify"
            >
              {ta("cta")} →
            </a>
          </p>
        </div>
      </div>

      {/* floating pill, sticky: sits below the announcement at load, pins on scroll */}
      <header className="sticky top-3 z-nav mt-3 flex justify-center px-4">
        <nav
          className="flex w-full max-w-[860px] items-center justify-between gap-2 rounded-full border border-line bg-bg/75 py-2 pl-5 pr-2 backdrop-blur-md"
          aria-label="Main"
        >
          <a
            href="#top"
            onClick={onLink("#top")}
            className="flex shrink-0 items-center gap-2.5"
            aria-label="Glemo, home"
          >
            <Image
              src="/logos/logo.png"
              alt=""
              width={26}
              height={26}
              className="h-[26px] w-[26px] object-contain"
            />
            <span className="text-[1.05rem] font-black tracking-tight text-ink">
              glemo
            </span>
          </a>

          <div className="hidden items-center gap-1 md:flex">
            {LINKS.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                onClick={onLink(`#${l.id}`)}
                className="rounded-full px-3.5 py-2 text-[0.9rem] font-medium text-ink-2 transition-colors duration-200 hover:bg-surface hover:text-ink"
              >
                {t(l.key)}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex">
              <LocaleSwitcher />
            </span>
            <a
              href="#cta"
              onClick={onLink("#cta")}
              className="rounded-full bg-verify px-5 py-2.5 text-[0.9rem] font-bold text-[oklch(0.17_0.03_170)] transition-colors duration-200 hover:bg-verify-strong"
            >
              {t("cta")}
            </a>
          </div>
        </nav>
      </header>
    </>
  );
}
