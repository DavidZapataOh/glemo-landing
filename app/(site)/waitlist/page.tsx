import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

/**
 * The waitlist. Every CTA on this site lands here while the product is gated.
 *
 * The frame is ours and the form is not: the questions live in an external form
 * so they can change without a deploy, and the page around them carries the
 * brand and, more importantly, what happens after you press send. A form with no
 * answer to "and then what?" is where intent goes to die.
 *
 * The URL ships as a default and stays overridable by env. It is a public form,
 * not a secret, so keeping it here means the page cannot deploy broken because a
 * variable was missing on a new environment; the override is there for the day
 * the form is replaced, so that does not need a code review either.
 *
 * The query is load bearing: hideTitle because this page already carries the
 * heading and the lead, transparentBackground so the form sits on our canvas
 * instead of a white slab, dynamicHeight so the frame grows per page rather than
 * nesting a scrollbar inside the page's own.
 */
const FORM_URL =
  process.env.NEXT_PUBLIC_WAITLIST_FORM_URL ??
  "https://tally.so/embed/KYb25V?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("waitlist");
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    // A waitlist page has nothing to offer a search engine and everything to
    // lose from being indexed instead of the home page.
    robots: { index: false, follow: true },
  };
}

export default async function WaitlistPage() {
  const t = await getTranslations("waitlist");
  const steps = t.raw("steps") as string[];

  return (
    <main className="pb-[clamp(5rem,12vh,9rem)] pt-[clamp(7rem,16vh,11rem)]">
      <div className="container-g">
        {/* Three blocks, not two columns, so the phone can put the form second.
            A page whose only job is conversion should not make a thumb travel
            past seven hundred pixels of reassurance to reach the thing it came
            for. On desktop the left column takes rows one and two and the form
            spans both, which reads as the same two columns it always was. */}
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-x-16 lg:gap-y-10">
          <div className="lg:col-start-1 lg:row-start-1">
            <h1 className="text-h2 max-w-[14ch] font-bold text-ink">
              {t("title")}
            </h1>
            <p className="mt-5 max-w-[46ch] text-[1.0625rem] leading-[1.65] text-ink-2">
              {t("lead")}
            </p>
          </div>

          <div className="overflow-hidden rounded-lg border border-line bg-surface lg:col-start-2 lg:row-start-1 lg:row-span-2">
            {FORM_URL ? (
              <iframe
                src={FORM_URL}
                title={t("formTitle")}
                loading="lazy"
                /* color-scheme normal, and it is the whole reason this frame is
                   readable. This page declares color-scheme dark, and Chrome then
                   paints an OPAQUE canvas behind a cross-origin iframe that does
                   not declare a scheme of its own, so a form that really is
                   transparent still lands on white. Opting the element out of the
                   scheme lets the transparency through to our canvas. */
                style={{ colorScheme: "normal" }}
                className="h-[min(78vh,760px)] w-full border-0 bg-transparent"
              />
            ) : (
              /* No form configured: say so and keep a working way through,
                   rather than rendering an empty box that looks broken. */
              <div className="flex flex-col items-start gap-4 p-8">
                <p className="text-[0.95rem] leading-[1.6] text-ink-2">
                  {t("fallbackLead")}
                </p>
                <Link
                  href="/"
                  className="rounded-full border border-line px-5 py-2.5 text-[0.9rem] font-medium text-ink transition-colors hover:bg-surface-2"
                >
                  {t("fallbackCta")}
                </Link>
              </div>
            )}
          </div>

          <div className="lg:col-start-1 lg:row-start-2">
            <h2 className="font-mono text-[0.75rem] uppercase tracking-[0.14em] text-ink-2">
              {t("stepsTitle")}
            </h2>
            <ol className="mt-4 flex flex-col gap-4">
              {steps.map((s, i) => (
                <li key={s} className="flex gap-4">
                  <span className="mt-0.5 font-mono text-[0.75rem] tabular-nums text-verify">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="max-w-[40ch] text-[0.95rem] leading-[1.6] text-ink-2">
                    {s}
                  </span>
                </li>
              ))}
            </ol>

            <Link
              href="/"
              className="mt-10 inline-flex text-[0.9rem] font-medium text-ink-2 underline decoration-line underline-offset-4 transition-colors hover:text-ink"
            >
              {t("back")}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
