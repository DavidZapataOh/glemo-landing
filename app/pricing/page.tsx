import type { Metadata } from "next";
import Link from "next/link";
import { PricingFaq } from "@/components/v2/PricingFaq";
import { appUrl } from "@/lib/app-url";
import plansData from "@/public/plans.json";

export const metadata: Metadata = {
  title: "Pricing - Glemo",
  description: "Verifier-pays pricing. Issuing is always free.",
};

interface Plan {
  id: string;
  name: string;
  includedVerifications: number;
  pricePerVerificationCents: number;
  overagePolicy: string;
  features: { byZkTls: boolean; byImage: boolean };
}

const { plans } = plansData as { plans: Plan[] };
const fmt = new Intl.NumberFormat("en");

function overageLabel(plan: Plan): string {
  if (plan.pricePerVerificationCents === 0) {
    return plan.overagePolicy === "block" ? "Hard cap, no overage" : "No overage charge";
  }
  return `$${(plan.pricePerVerificationCents / 100).toFixed(2)} / verification beyond that`;
}

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[var(--bg)] px-[var(--container-gutter)] py-24 text-[var(--ink)]">
      <div className="mx-auto max-w-5xl">
        <header className="mb-14 max-w-2xl">
          <h1 className="font-sans text-5xl font-bold tracking-tight sm:text-6xl">Pricing</h1>
          <p className="mt-4 text-lg text-[var(--ink-2)]">
            Verifiers pay for verifications. Issuing credentials is always free. No wallet,
            no per-seat fees, no lock-in.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => {
            const featured = plan.id === "starter";
            return (
              <div
                key={plan.id}
                className="flex flex-col rounded-2xl border p-7"
                style={{
                  borderColor: featured ? "var(--verify)" : "var(--line)",
                  background: featured ? "var(--verify-dim)" : "var(--surface)",
                }}
              >
                <div className="flex items-baseline justify-between">
                  <h2 className="font-sans text-xl font-bold">{plan.name}</h2>
                  {featured && (
                    <span className="rounded-full bg-[var(--verify)] px-2.5 py-0.5 font-mono text-xs font-medium text-[oklch(0.17_0.03_170)]">
                      popular
                    </span>
                  )}
                </div>

                <p className="mt-5 font-sans text-4xl font-bold tracking-tight">
                  {fmt.format(plan.includedVerifications)}
                  <span className="ml-1.5 align-middle text-sm font-medium text-[var(--ink-2)]">
                    verifications / mo
                  </span>
                </p>
                <p className="mt-2 text-sm text-[var(--ink-2)]">{overageLabel(plan)}</p>

                <ul className="mt-6 flex flex-1 flex-col gap-2.5 text-sm">
                  <Feature on>Cryptographic verification by hash & VC</Feature>
                  <Feature on={plan.features.byZkTls}>zkTLS cross-issuer verification</Feature>
                  <Feature on={plan.features.byImage}>Image / certificate verification</Feature>
                </ul>

                <Link
                  href={appUrl(`/signup?plan=${plan.id}`)}
                  className="mt-7 rounded-lg px-4 py-2.5 text-center font-medium transition-colors"
                  style={
                    featured
                      ? { background: "var(--verify)", color: "oklch(0.17 0.03 170)" }
                      : { border: "1px solid var(--line)", color: "var(--ink)" }
                  }
                >
                  Start free
                </Link>
              </div>
            );
          })}
        </div>

        <p className="mt-10 text-sm text-[var(--ink-2)]">
          Every plan includes the independent trust mark, the public verification page and the
          full API. Overage on paid plans is billed monthly at the per-verification rate above.
        </p>

        <PricingFaq />
      </div>
    </main>
  );
}

function Feature({ on, children }: { on: boolean; children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-2.5">
      <span
        aria-hidden
        className="font-mono text-sm"
        style={{ color: on ? "var(--verify)" : "var(--ink-2)" }}
      >
        {on ? "✓" : "-"}
      </span>
      <span style={{ color: on ? "var(--ink)" : "var(--ink-2)" }}>{children}</span>
    </li>
  );
}
