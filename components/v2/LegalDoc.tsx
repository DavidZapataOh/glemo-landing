import type { ReactNode } from "react";

const card = { borderColor: "var(--line)", background: "var(--surface)" } as const;

/** Shared chrome for the legal pages: title, a visible "draft template" banner, and prose. */
export function LegalDoc({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main className="min-h-screen bg-[var(--bg)] px-[var(--container-gutter)] py-24 text-[var(--ink)]">
      <article className="mx-auto max-w-2xl">
        <h1 className="font-sans text-4xl font-bold tracking-tight sm:text-5xl">{title}</h1>
        <p className="mt-6 rounded-xl border p-4 text-sm text-[var(--ink-2)]" style={card}>
          <strong className="text-[var(--ink)]">Under legal review.</strong> This document
          describes the system&apos;s real architecture and is published for transparency while
          counsel finalizes the wording. Questions: privacy@glemo.io.
        </p>
        <div className="mt-10 flex flex-col gap-6 leading-relaxed text-[var(--ink-2)]">{children}</div>
      </article>
    </main>
  );
}

export function LH2({ children }: { children: ReactNode }) {
  return <h2 className="mt-4 font-sans text-xl font-semibold text-[var(--ink)]">{children}</h2>;
}

export function LP({ children }: { children: ReactNode }) {
  return <p className="max-w-[68ch]">{children}</p>;
}
