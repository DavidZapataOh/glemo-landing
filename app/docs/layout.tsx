import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { RootProvider } from "fumadocs-ui/provider/next";
import Link from "next/link";
import { appUrl } from "@/lib/app-url";
import { source } from "@/lib/source";
import "./docs.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <RootProvider theme={{ defaultTheme: "dark", forcedTheme: "dark" }}>
      <DocsLayout
        tree={source.pageTree}
        // v16 replaced the disableThemeSwitch flag with a slot that can be turned off.
        // The docs live on the (dark) marketing site: keep them dark to match their host,
        // and offering a switch that RootProvider already forces would be a dead control.
        slots={{ themeSwitch: false }}
        // Always offer the way back to the site and into the app.
        links={[
          { text: "Site", url: "/" },
          { text: "Open app", url: appUrl("/") },
        ]}
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
