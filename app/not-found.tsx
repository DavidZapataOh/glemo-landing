import Link from "next/link";
import { appUrl } from "@/lib/app-url";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-[var(--bg)] px-6 text-center text-[var(--ink)]">
      <p className="font-mono text-sm uppercase tracking-[0.2em] text-verify">404</p>
      <h1 className="max-w-xl font-sans text-4xl font-bold tracking-tight sm:text-5xl">
        This page could not be verified
      </h1>
      <p className="max-w-md text-[var(--ink-2)]">
        The link may be old or mistyped. Everything that matters is one hop away.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="rounded-full bg-verify px-5 py-2.5 font-bold text-[oklch(0.17_0.03_170)] transition-colors hover:bg-verify-strong"
        >
          Back home
        </Link>
        <Link
          href="/docs"
          className="rounded-full border border-line px-5 py-2.5 font-medium text-ink transition-colors hover:bg-surface"
        >
          Read the docs
        </Link>
        <a
          href={appUrl("/")}
          className="rounded-full border border-line px-5 py-2.5 font-medium text-ink transition-colors hover:bg-surface"
        >
          Open the app
        </a>
      </div>
    </main>
  );
}
