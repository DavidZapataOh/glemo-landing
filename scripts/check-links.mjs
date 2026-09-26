// Link discipline gate for the landing:
//  1. no mailto: CTAs anywhere except the Footer contact link
//  2. every conversion CTA lands on /waitlist (FinalCta, Nav, pricing, hero, 404, docs)
//  3. NOTHING links to the app host while signup is gated
//
// Rule 2 used to say "product CTAs go through appUrl()". It stopped describing the
// site the day the funnel became a waitlist, and a gate that asserts the previous
// shape is worse than no gate: it goes green on a page that does the opposite.
// Zero deps; runs in CI before tsc.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const SCOPES = ["app", "components/v2", "lib"];
const failures = [];

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) yield* walk(full);
    else if (/\.(ts|tsx)$/.test(entry)) yield full;
  }
}

for (const scope of SCOPES) {
  for (const file of walk(join(ROOT, scope))) {
    const rel = relative(ROOT, file);
    const src = readFileSync(file, "utf8");
    if (src.includes("mailto:") && rel !== "components/v2/Footer.tsx") {
      failures.push(`${rel}: mailto: CTA outside the Footer`);
    }
    // lib/app-url.ts is kept on purpose: it is the switch to flip the day signup
    // opens. Until then nothing may reach for it, and no file may hardcode the host.
    if (src.includes("app.glemo.io") && rel !== "lib/app-url.ts") {
      failures.push(`${rel}: links the app host while signup is gated; send it to /waitlist`);
    }
    if (src.includes("appUrl(") && rel !== "lib/app-url.ts") {
      failures.push(`${rel}: uses appUrl(); every CTA goes to /waitlist while signup is gated`);
    }
  }
}

// The conversion path. Every one of these carried a "start free" that entered the
// product; each has to land on the waitlist instead, or the funnel leaks from a
// place nobody is watching.
for (const mustReachWaitlist of [
  "components/v2/FinalCta.tsx",
  "components/v2/Nav.tsx",
  "components/v2/Hero.tsx",
  "app/(site)/pricing/page.tsx",
  "app/not-found.tsx",
  "app/docs/layout.tsx",
]) {
  const src = readFileSync(join(ROOT, mustReachWaitlist), "utf8");
  if (!src.includes("/waitlist")) {
    failures.push(`${mustReachWaitlist}: conversion CTA does not land on /waitlist`);
  }
}

// Unification: the whole surface must be reachable, so nav and footer link the routes.
const mustLink = [
  { file: "components/v2/Nav.tsx", hrefs: ["/pricing", "/docs"] },
  {
    file: "components/v2/Footer.tsx",
    hrefs: ["/pricing", "/docs", "/status", "/privacy", "/dpa", "/processor-terms", "/accessibility"],
  },
  { file: "app/not-found.tsx", hrefs: ["/docs"] },
];
for (const { file, hrefs } of mustLink) {
  const src = readFileSync(join(ROOT, file), "utf8");
  for (const href of hrefs) {
    if (!src.includes(`"${href}"`)) failures.push(`${file}: missing link to ${href}`);
  }
}

if (failures.length > 0) {
  console.error("check-links FAIL:");
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log("check-links OK: every conversion CTA lands on /waitlist, nothing reaches the app host.");
