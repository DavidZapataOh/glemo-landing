"use client";

import { useTranslations } from "next-intl";
import LocaleSwitcher from "./LocaleSwitcher";

/**
 * Footer: columns above, then the giant GLEMO wordmark cut by the viewport
 * edge (the Osmo/Supaste close). The wordmark is the brand's final gesture.
 */
export default function Footer() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  const cols = [
    {
      title: t("product"),
      links: [
        { label: t("productLinks.how"), href: "#action" },
        { label: t("productLinks.features"), href: "#institutions" },
        { label: t("productLinks.audiences"), href: "#audiences" },
      ],
    },
    {
      title: t("developersCol"),
      links: [
        { label: t("developersLinks.api"), href: "#developers" },
        { label: t("developersLinks.standards"), href: "#top" },
        { label: t("developersLinks.faq"), href: "#faq" },
      ],
    },
    {
      title: t("company"),
      links: [
        { label: t("companyLinks.partners"), href: "#cta" },
        { label: t("companyLinks.contact"), href: "mailto:hello@glemo.io" },
      ],
    },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-line">
      <div className="container-g pt-16">
        <div className="flex flex-col justify-between gap-12 pb-16 md:flex-row">
          <div className="max-w-xs">
            <p className="text-[1.05rem] font-black tracking-tight text-ink">glemo</p>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-2">
              {t("tagline")}
            </p>
            <div className="mt-6">
              <LocaleSwitcher />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            {cols.map((col) => (
              <div key={col.title}>
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-2/70">
                  {col.title}
                </p>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        className="text-[0.95rem] font-medium text-ink-2 transition-colors duration-200 hover:text-ink"
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <p className="border-t border-line py-6 text-[13px] text-ink-2/80">
          {t("rights", { year })}
        </p>
      </div>

      {/* giant wordmark, cut by the bottom edge */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none overflow-hidden leading-none"
      >
        <p className="translate-y-[30%] text-center font-black tracking-tighter text-ink/[0.05] text-[clamp(6rem,22vw,19rem)]">
          GLEMO
        </p>
      </div>
    </footer>
  );
}
