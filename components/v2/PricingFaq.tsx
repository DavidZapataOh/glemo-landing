import { getTranslations } from "next-intl/server";

const KEYS = ["1", "2", "3", "4", "5"] as const;

export async function PricingFaq() {
  const t = await getTranslations("pricing");
  return (
    <section className="mt-20 border-t border-[var(--line)] pt-14">
      <h2 className="font-sans text-2xl font-bold tracking-tight text-[var(--ink)]">
        {t("faqTitle")}
      </h2>
      <div className="mt-6 max-w-3xl divide-y divide-[var(--line)]">
        {KEYS.map((k) => (
          <details key={k} className="group py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-[var(--ink)]">
              {t(`faq.q${k}`)}
              <span
                aria-hidden
                className="text-[var(--ink-2)] transition-transform duration-200 group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="mt-3 max-w-2xl text-[0.95rem] leading-relaxed text-[var(--ink-2)]">
              {t(`faq.a${k}`)}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
