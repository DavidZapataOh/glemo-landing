#!/usr/bin/env node
// Regla #4: developer-facing copy must not promise an SDK/API surface that does not
// exist. The real SDK is `createGlemo({ apiKey }).verify({ credentialId })`; the
// verdict is "valid" (never "verified"); keys are glemo_live_ / glemo_test_; the
// HTTP endpoint is POST /verify with { method, credentialId }.
import { readFileSync } from "node:fs";

const files = ["components/v2/DevTerminal.tsx"];
const forbidden = [
  ["new Glemo( ... ) constructor (real is createGlemo({ apiKey }))", /new Glemo\(/],
  ['a "verified" status (real verdict is "valid")', /["']verified["']/],
  ["the fake key prefix glm_sk_ (real is glemo_live_ / glemo_test_)", /glm_sk_/],
  ["the fake credential prefix glm_cred_", /glm_cred_/],
  ["verify() called with a bare string (real takes { credentialId })", /\.verify\(["'`]/],
  ["a /v1/verifications endpoint (real is /verify)", /\/v1\/verifications/],
  ["a non-existent python `from glemo import`", /from glemo import/],
];

const bad = [];
for (const f of files) {
  let src;
  try {
    src = readFileSync(f, "utf8");
  } catch {
    continue;
  }
  for (const [label, re] of forbidden) if (re.test(src)) bad.push(`${f}: ${label}`);
}

if (bad.length) {
  console.error(`[sdk-copy] developer copy promises an API that does not exist (Regla #4):\n  ${bad.join("\n  ")}`);
  process.exit(1);
}
console.log("[sdk-copy] OK: developer copy matches the real SDK surface.");
