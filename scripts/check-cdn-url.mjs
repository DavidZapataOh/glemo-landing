#!/usr/bin/env node
// Docs must reference URLs that actually resolve. The verify-widget browser bundle
// is served by unpkg the moment the package is published; cdn.glemo.io is a vanity
// host that is not deployed. Fail if the docs point developers at it.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

function walk(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : p.endsWith(".mdx") ? [p] : [];
  });
}

const offenders = walk("content").filter((f) => readFileSync(f, "utf8").includes("cdn.glemo.io"));

if (offenders.length) {
  console.error(
    `[cdn-url] docs reference the undeployed cdn.glemo.io; use unpkg instead:\n  ${offenders.join("\n  ")}`,
  );
  process.exit(1);
}
console.log("[cdn-url] OK: no docs reference the undeployed cdn.glemo.io.");
