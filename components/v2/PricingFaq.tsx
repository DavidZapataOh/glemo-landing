const FAQS = [
  {
    q: "What counts as a verification?",
    a: "One check of one credential: by hash, by verifiable credential, by zkTLS proof, or by uploaded certificate image. Issuing credentials never counts, and re-checking a credential you already verified in the same billing period is free.",
  },
  {
    q: "What happens when I pass my included verifications?",
    a: "On Free, verification is capped: further calls are blocked until the next period, so you are never charged by surprise. On Starter and Scale, extra verifications are billed monthly at the per-verification rate on the plan.",
  },
  {
    q: "Is issuing really free?",
    a: "Yes. Anyone can issue credentials, design templates and share the public credential page at no cost. Only the verifier side, the relying parties consuming the API, pays.",
  },
  {
    q: "Do my recipients need a wallet or an account?",
    a: "No. A credential is a link. Recipients open it, share it and add it to LinkedIn without installing anything, and verifiers confirm it with one API call.",
  },
  {
    q: "Can I change plans later?",
    a: "Any time, from your workspace. Upgrades apply immediately; the included quota and the per-verification rate change with the plan.",
  },
];

export function PricingFaq() {
  return (
    <section className="mt-20 border-t border-[var(--line)] pt-14">
      <h2 className="font-sans text-2xl font-bold tracking-tight text-[var(--ink)]">
        Pricing questions
      </h2>
      <div className="mt-6 max-w-3xl divide-y divide-[var(--line)]">
        {FAQS.map((f) => (
          <details key={f.q} className="group py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-[var(--ink)]">
              {f.q}
              <span
                aria-hidden
                className="text-[var(--ink-2)] transition-transform duration-200 group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="mt-3 max-w-2xl text-[0.95rem] leading-relaxed text-[var(--ink-2)]">
              {f.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
