"use client";

import { useCallback, useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "https://api.glemo.io";
type State = "operational" | "degraded" | "down" | "unreachable" | "loading";

interface Health {
  api: State;
  db: State;
  redis: State;
  checkedAt: string | null;
}

const LABEL: Record<State, string> = {
  operational: "Operational",
  degraded: "Degraded",
  down: "Down",
  unreachable: "Unreachable",
  loading: "Checking…",
};

const COLOR: Record<State, string> = {
  operational: "var(--verify)",
  degraded: "oklch(0.8 0.15 90)",
  down: "oklch(0.68 0.19 25)",
  unreachable: "var(--ink-2)",
  loading: "var(--ink-2)",
};

async function probe(): Promise<Health> {
  const checkedAt = new Date().toLocaleTimeString();
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(`${API}/health/ready`, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok && res.status !== 503) {
      return { api: "degraded", db: "unreachable", redis: "unreachable", checkedAt };
    }
    const body = (await res.json()) as { ready: boolean; checks: Record<string, string> };
    const map = (v: string | undefined): State =>
      v === "ok" ? "operational" : v === "skipped" ? "operational" : "down";
    return {
      api: "operational",
      db: map(body.checks.db),
      redis: body.checks.redis === "skipped" ? "operational" : map(body.checks.redis),
      checkedAt,
    };
  } catch {
    // The case that matters: the API doesn't respond. A designed state, no crash.
    return { api: "unreachable", db: "unreachable", redis: "unreachable", checkedAt };
  }
}

export default function StatusPage() {
  const [health, setHealth] = useState<Health>({
    api: "loading",
    db: "loading",
    redis: "loading",
    checkedAt: null,
  });

  const refresh = useCallback(() => {
    void probe().then(setHealth);
  }, []);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 30_000);
    return () => clearInterval(id);
  }, [refresh]);

  const allUp = health.api === "operational" && health.db === "operational";
  const overall: State =
    health.api === "loading"
      ? "loading"
      : health.api === "unreachable"
        ? "unreachable"
        : allUp
          ? "operational"
          : "degraded";

  return (
    <main className="min-h-screen bg-[var(--bg)] px-[var(--container-gutter)] py-24 text-[var(--ink)]">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-sans text-4xl font-bold tracking-tight sm:text-5xl">System status</h1>

        <div
          className="mt-8 flex items-center gap-3 rounded-xl border p-5"
          style={{ borderColor: "var(--line)", background: "var(--surface)" }}
        >
          <span
            aria-hidden
            className="inline-block h-3 w-3 rounded-full"
            style={{ background: COLOR[overall] }}
          />
          <p className="font-sans text-lg font-semibold">
            {overall === "operational"
              ? "All systems operational"
              : overall === "unreachable"
                ? "Status API unreachable"
                : overall === "loading"
                  ? "Checking…"
                  : "Some systems degraded"}
          </p>
        </div>

        <ul className="mt-6 flex flex-col gap-3">
          {(["api", "db", "redis"] as const).map((key) => (
            <li
              key={key}
              className="flex items-center justify-between rounded-lg border p-4"
              style={{ borderColor: "var(--line)", background: "var(--surface)" }}
            >
              <span className="font-medium">
                {key === "api" ? "API" : key === "db" ? "Database" : "Cache (Redis)"}
              </span>
              <span className="flex items-center gap-2 font-mono text-sm">
                <span
                  aria-hidden
                  className="inline-block h-2.5 w-2.5 rounded-full"
                  style={{ background: COLOR[health[key]] }}
                />
                <span style={{ color: COLOR[health[key]] }}>{LABEL[health[key]]}</span>
              </span>
            </li>
          ))}
        </ul>

        <p className="mt-6 text-sm text-[var(--ink-2)]">
          {health.checkedAt
            ? `Last checked at ${health.checkedAt} · auto-refreshes every 30s`
            : "Auto-refreshes every 30s"}
        </p>
      </div>
    </main>
  );
}
