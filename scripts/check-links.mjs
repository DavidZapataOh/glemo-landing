// Link discipline gate for the landing:
//  1. no mailto: CTAs anywhere except the Footer contact link
//  2. the CTAs that enter the product go through appUrl() (FinalCta, Nav, pricing)
//  3. no hardcoded app host outside lib/app-url.ts
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
    if (src.includes("app.glemo.io") && rel !== "lib/app-url.ts") {
      failures.push(`${rel}: hardcoded app host; use appUrl() from lib/app-url`);
    }
  }
}

for (const mustUseAppUrl of [
  "components/v2/FinalCta.tsx",
  "components/v2/Nav.tsx",
  "app/pricing/page.tsx",
]) {
  const src = readFileSync(join(ROOT, mustUseAppUrl), "utf8");
  if (!src.includes("appUrl(")) {
    failures.push(`${mustUseAppUrl}: product CTA does not go through appUrl()`);
  }
}

// Unification: the whole surface must be reachable, so nav and footer link the routes.
const mustLink = [
  { file: "components/v2/Nav.tsx", hrefs: ["/pricing", "/docs"] },
  { file: "components/v2/Footer.tsx", hrefs: ["/pricing", "/docs", "/status"] },
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
console.log("check-links OK: CTAs go through appUrl(), no stray mailto.");
