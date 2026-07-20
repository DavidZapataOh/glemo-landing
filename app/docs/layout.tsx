import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { RootProvider } from "fumadocs-ui/provider";
import Link from "next/link";
import { source } from "@/lib/source";
import "./docs.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <RootProvider theme={{ defaultTheme: "dark", forcedTheme: "dark" }}>
      <DocsLayout
        tree={source.pageTree}
        disableThemeSwitch
        nav={{
          title: (
            <span className="inline-flex items-baseline gap-2">
              <span
                className="font-mono text-xs font-medium uppercase tracking-[0.2em]"
                style={{ color: "hsl(159 74% 57%)" }}
              >
                Glemo
              </span>
              <span className="text-sm text-fd-muted-foreground">Docs</span>
            </span>
          ),
        }}
        sidebar={{
          banner: (
            <Link
              href="/docs/quickstart"
              className="mb-2 block rounded-xl border border-fd-border bg-fd-card p-3 text-sm transition-colors hover:border-fd-primary/40"
            >
              <span className="font-medium text-fd-primary">First verification →</span>
              <span className="mt-1 block text-xs text-fd-muted-foreground">
                Test key + verdict in under 5 minutes.
              </span>
            </Link>
          ),
        }}
      >
        {children}
      </DocsLayout>
    </RootProvider>
  );
}
