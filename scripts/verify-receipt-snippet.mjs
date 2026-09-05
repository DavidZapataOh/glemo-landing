#!/usr/bin/env node
// Runs the receipt-verification snippet FOR REAL instead of trusting it. Sibling of
// verify-quickstart.mjs and it borrows its shape on purpose.
//
// The point of this harness is a restriction, not an assertion: the snippet runs in a
// temporary directory where the ONLY installed dependency is `jose`. If the published
// code needed anything of ours, node would fail with ERR_MODULE_NOT_FOUND, which is
// exactly the claim the docs make ("depends on jose and nothing of ours").
//
// Honest boundary, same as its sibling: the copy shows the production host, which is
// deployed infrastructure we do not control from here, so the full run rewrites ONLY
// the host and points at a local backend. With no backend it exits 0 and says so: a
// runnable gate, not a hard failure. CI runs --extract-only, which needs no backend.
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const BASE = process.env.GLEMO_RECEIPT_BASE_URL ?? "http://localhost:3000";
const MDX = resolve(process.cwd(), "content/docs/concepts/verification.mdx");
const EXTRACT_ONLY = process.argv.includes("--extract-only");

/** Extracts the js block that follows the receipt-verification heading. */
export function extractReceiptSnippet(mdx) {
  const start = mdx.indexOf("### Verifying one, without asking us");
  if (start === -1) throw new Error("verification.mdx has no receipt verification section");
  const m = mdx.slice(start).match(/```js[^\n]*\n([\s\S]*?)```/);
  if (!m) throw new Error("receipt section has no ```js code block");
  return m[1];
}

const snippet = extractReceiptSnippet(readFileSync(MDX, "utf8"));

// The claim under test, asserted on the source rather than on the run: a snippet that
// imported @glemo/sdk would still run fine here if we installed it, and the promise is
// that a third party needs none of it.
if (!/from "jose"/.test(snippet)) {
  console.error("[receipt] the published snippet does not import jose");
  process.exit(1);
}
if (/@glemo/.test(snippet)) {
  console.error("[receipt] the published snippet imports something of ours, which defeats it");
  process.exit(1);
}

if (EXTRACT_ONLY) {
  console.log("[receipt] OK: the snippet exists, imports jose and nothing of ours.");
  process.exit(0);
}

async function backendUp() {
  try {
    const res = await fetch(`${BASE}/health`, { signal: AbortSignal.timeout(2000) });
    return res.ok;
  } catch {
    return false;
  }
}

if (!(await backendUp())) {
  console.log(`[receipt] no backend at ${BASE}: skipping the live run (runnable gate).`);
  process.exit(0);
}

// A real receipt from a real verification, through the same route a customer uses.
const seeded = JSON.parse(
  execFileSync("bun", ["run", "scripts/seed-receipt.ts"], {
    cwd: resolve(process.cwd(), "../glemo-backend"),
    encoding: "utf8",
  }).trim().split("\n").pop(),
);

const dir = mkdtempSync(join(tmpdir(), "glemo-receipt-"));
try {
  execFileSync("npm", ["init", "-y"], { cwd: dir, stdio: "ignore" });
  // The only dependency. That is the test.
  execFileSync("npm", ["install", "jose@^6"], { cwd: dir, stdio: "ignore" });
  writeFileSync(join(dir, "package.json"),
    JSON.stringify({ name: "t", type: "module", private: true }, null, 2));

  const runnable = snippet
    .replace(/https:\/\/api\.glemo\.io/g, BASE)
    .replace(/^/, `const signedEvidence = ${JSON.stringify(seeded.signedEvidence)};\n`);

  const cases = [
    ["intact receipt", runnable, null],
    // A byte of the payload changed. The signature no longer covers it.
    ["tampered payload", runnable.replace(
      JSON.stringify(seeded.signedEvidence),
      JSON.stringify(tamper(seeded.signedEvidence)),
    ), "ERR_JWS_SIGNATURE_VERIFICATION_FAILED"],
    // Signed by a key that was never published.
    ["foreign key", runnable.replace(
      JSON.stringify(seeded.signedEvidence),
      JSON.stringify(seeded.foreignReceipt),
    ), "ERR_JWKS_NO_MATCHING_KEY"],
  ];

  for (const [name, code, expected] of cases) {
    writeFileSync(join(dir, "run.mjs"), code);
    let out = "";
    let failed = false;
    try {
      out = execFileSync("node", ["run.mjs"], { cwd: dir, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
    } catch (err) {
      failed = true;
      out = `${err.stdout ?? ""}${err.stderr ?? ""}`;
    }
    if (expected === null) {
      if (failed) { console.error(`[receipt] ${name}: expected it to verify\n${out}`); process.exit(1); }
      console.log(`[receipt] ${name}: verified`);
    } else {
      if (!failed || !out.includes(expected)) {
        console.error(`[receipt] ${name}: expected ${expected}\n${out}`); process.exit(1);
      }
      console.log(`[receipt] ${name}: ${expected}`);
    }
  }
  console.log("[receipt] OK: a third party verifies a receipt with jose alone.");
} finally {
  rmSync(dir, { recursive: true, force: true });
}

/** Flips one base64url character of the payload, keeping the token well formed. */
function tamper(jwt) {
  const [h, p, s] = jwt.split(".");
  const flipped = p.slice(0, -1) + (p.at(-1) === "A" ? "B" : "A");
  return `${h}.${flipped}.${s}`;
}
