#!/usr/bin/env node
// Runs the docs quickstart FOR REAL instead of trusting it. Extracts the JS block
// from the Node tab of content/docs/quickstart.mdx, installs the packed @glemo/sdk
// (the sibling package, or GLEMO_SDK_TARBALL), and executes the snippet against a
// real backend. If the SDK and the doc snippet drift, this fails.
//
// Honest boundaries: the copy shows the public sandbox host (api-sandbox.glemo.io),
// which is a deployed-infra dependency [I]; this harness runs the SAME code against
// a local backend by overriding only the host. The npm publish is [I] too, so we
// install the packed tarball (byte-identical to npm), not a registry download.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const BASE = process.env.GLEMO_QUICKSTART_BASE_URL ?? "http://localhost:3000";
const MDX = resolve(process.cwd(), "content/docs/quickstart.mdx");
const SDK_DIR = resolve(process.cwd(), "../glemo-js");

/** Extracts the JS code block from the `<Tab value="Node">` of the quickstart. */
export function extractNodeSnippet(mdx) {
  const start = mdx.indexOf('<Tab value="Node">');
  if (start === -1) throw new Error('quickstart.mdx has no <Tab value="Node">');
  const end = mdx.indexOf("</Tab>", start);
  const tab = mdx.slice(start, end === -1 ? undefined : end);
  const m = tab.match(/```js[^\n]*\n([\s\S]*?)```/);
  if (!m) throw new Error("Node tab has no ```js code block");
  return m[1];
}

function run(cmd, args, opts = {}) {
  return execFileSync(cmd, args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], ...opts });
}

async function backendUp() {
  try {
    return (await fetch(`${BASE}/health`)).ok;
  } catch {
    return false;
  }
}

async function main() {
  const snippet = extractNodeSnippet(readFileSync(MDX, "utf8"));
  // Drift guard: the doc must use the real SDK surface.
  if (!/createGlemo\(/.test(snippet) || !/\.verify\(\{/.test(snippet)) {
    console.error("[quickstart] the Node snippet no longer uses createGlemo(...).verify({...})");
    process.exit(1);
  }
  if (process.argv.includes("--extract-only")) {
    console.log("[quickstart] OK: extracted a Node snippet that uses createGlemo(...).verify({...}).");
    return;
  }

  if (!(await backendUp())) {
    console.log(`[quickstart] backend not reachable at ${BASE}; skipping the live run (runnable gate, not a hard failure).`);
    return;
  }

  // Resolve the SDK tarball: an explicit path, or pack the sibling package.
  const work = mkdtempSync(join(tmpdir(), "glemo-quickstart-"));
  try {
    let tarball = process.env.GLEMO_SDK_TARBALL;
    if (!tarball) {
      if (!existsSync(SDK_DIR)) {
        console.log(`[quickstart] no SDK tarball and sibling ${SDK_DIR} not found; skipping.`);
        return;
      }
      run("pnpm", ["--filter", "@glemo/sdk", "pack", "--pack-destination", work], { cwd: SDK_DIR });
      const tgz = readdirSync(work).find((f) => f.endsWith(".tgz"));
      if (!tgz) throw new Error("pnpm pack produced no tarball");
      tarball = join(work, tgz);
    }

    const proj = join(work, "consumer");
    mkdirSync(proj, { recursive: true });
    writeFileSync(join(proj, "package.json"), JSON.stringify({ name: "quickstart-consumer", private: true, type: "module" }));
    run("npm", ["install", "--no-audit", "--no-fund", tarball], { cwd: proj });

    // Provision a real sandbox key + seeded valid credential.
    const keyRes = await fetch(`${BASE}/sandbox/keys`, { method: "POST" });
    if (keyRes.status === 429) {
      console.log("[quickstart] sandbox key rate limit (429); skipping the live run, try again later.");
      return;
    }
    if (!keyRes.ok) throw new Error(`sandbox/keys failed: ${keyRes.status}`);
    const { apiKey, credentials } = await keyRes.json();

    // Run the EXACT doc snippet; substitute only environment specifics (host + placeholder
    // credential), then assert the verdict it logs.
    const runnable =
      snippet
        .replace(/"https:\/\/api-sandbox\.glemo\.io"/g, JSON.stringify(BASE))
        .replace('"<credentials.valid>"', JSON.stringify(credentials.valid)) +
      '\nif (result.status !== "valid") { console.error("expected valid, got", result.status); process.exit(1); }\n' +
      'console.log("[quickstart] OK: the doc snippet verified a real credential =>", result.status);\n';
    writeFileSync(join(proj, "run.mjs"), runnable);
    process.stdout.write(run("node", ["run.mjs"], { cwd: proj, env: { ...process.env, GLEMO_API_KEY: apiKey } }));
  } finally {
    rmSync(work, { recursive: true, force: true });
  }
}

main().catch((err) => {
  console.error("[quickstart] FAILED:", err?.message ?? err);
  process.exit(1);
});
