#!/usr/bin/env node
// Regla #3: marketing copy must not promise a capability the product does not have.
//
// Sibling of check-sdk-copy.mjs, which does the same for the SDK surface over a single
// file. This one covers messages, docs, pricing flags and the legal pages, because that
// is where an audit found seven false claims at a moment when the capability review
// asserted the debt was reconciled. A review with a date expires the moment the product
// moves; a gate does not.
//
// Every rule carries a REASON THAT IS CHECKABLE IN THIS REPOSITORY OR THE BACKEND, and
// deliberately not a line number into the private capability ledger. Two reasons: that
// ledger is not public and nothing here may point at it, and line numbers rot. The
// first draft of this gate cited five of them and one was already stale, which is the
// exact failure the gate exists to prevent.
import { globSync, readFileSync } from "node:fs";

/** Claims that may not appear at all.
 *
 *  Patterns and not fixed strings, because the same promise is made with different
 *  words in each language and with words in between. Measured: a fixed-string list
 *  caught "any credential" in English and missed both "cualquier ENLACE DE credencial"
 *  and "Verifica lo que sea", which say exactly the same thing. */
const BANNED = [
  {
    term: "OpenID for VC",
    why: "accepting external wallet presentations is not built: zero lines of OpenID4VP in glemo-backend",
  },
  { term: "OpenID4VP", why: "idem" },
  { term: "mDoc", why: "idem" },
  { term: "ISO 18013-5", why: "idem" },
  {
    term: "verify.nova.edu",
    why: "a customer verification domain needs DNS provisioning that has not happened; the slider shows a domain nobody can reach",
  },
  {
    term: "verify anything",
    pattern: /verify anything|verifica lo que sea/i,
    why: "verification covers credentials this product issued, plus the recipes in the issuer registry; not anything",
  },
  // Up to two words in between, so "any credential" and "cualquier enlace de
  // credencial" are one rule instead of a list that grows by one miss at a time.
  {
    // The billing unit is a verification TRANSACTION, and metering aggregates
    // count(*) over verification_events with no DISTINCT per credential
    // (glemo-backend metering.ts:58-64). A second check of the same credential is
    // charged exactly like the first, in the same period or any other.
    term: "re-checking is free",
    pattern:
      /re-?check\w*[^.]{0,80}(already verified|same billing period)[^.]{0,40}\bfree\b|volver a (?:revisar|verificar)[^.]{0,80}gratis/i,
    why: "metering counts every verification event; there is no per-credential discount and no deduplication",
  },
  {
    term: "any credential",
    pattern: /any (?:\w+ ){0,2}credential|cualquier (?:\w+ ){0,2}credencial/i,
    why: "idem",
  },
  {
    term: "any issuer",
    pattern: /any (?:\w+ ){0,2}issuer|cualquier (?:\w+ ){0,2}emisor/i,
    why: "idem",
  },
  {
    term: "eIDAS",
    why: "there is no compliance status to claim: a non-qualified issuer gets non-discrimination under art 45b(1) and nothing more",
  },
  { term: "EUDI", why: "idem" },
];

/** Terms that are TRUE but incomplete on their own: the capability exists and the
 *  qualifier is what keeps the sentence honest. Each must appear within WINDOW
 *  characters of its qualifier. */
const WINDOW = 200;
const CONDITIONED = [
  {
    term: "zkTLS",
    requires: /sandbox/i,
    why: 'the capability works end to end, but all 8 recipes in the issuer registry are engine:"mock": selling it without saying sandbox is charging for a demo',
  },
  {
    term: "UNTP",
    requires: /self-declar|autodeclar/i,
    why: "the conformity credential is issued as self / no-endorsement / declaration; naming the standard without that reads as EUDR compliance, which needs an accredited assessor",
  },
  {
    term: "conformity credential",
    requires: /self-declar|autodeclar/i,
    why: "idem",
  },
];

/** Rules that belong to ONE file, because the same word is honest elsewhere.
 *
 *  A repo-wide ban on "Stripe" would flag a CSS comment about table styling, and one
 *  on "Avalanche" would flag the example course name in the issuing guide. Both are
 *  legitimate. What is not legitimate is either of them appearing in the subprocessor
 *  table of the data processing agreement, which is a legal document about who
 *  actually touches customer data. */
const SCOPED = [
  {
    file: "app/(site)/dpa/page.tsx",
    term: "Stripe",
    why: "the payment processor is Paddle: the agreement names a company that processes nothing for us",
  },
  {
    file: "app/(site)/dpa/page.tsx",
    term: "Avalanche",
    why: "the attestation backend defaults to offchain and no contract is deployed to mainnet: declaring an active subprocessor that receives nothing",
  },
];

const FILES = [
  "messages/en.json",
  "messages/es.json",
  "public/plans.json",
  ...globSync("content/docs/**/*.mdx"),
  ...globSync("app/**/*.tsx"),
];

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Case-insensitive index, because a sentence-initial capital does not change what a
 *  claim promises. Listing both spellings is how a third one gets missed: the first
 *  draft of this gate caught "any credential" and missed "Verify anything" for exactly
 *  that reason. */
function indexOfTerm(src, term, from) {
  return src.toLowerCase().indexOf(term.toLowerCase(), from);
}

/** 1-based line number of an offset, so the report is clickable. */
function lineOf(src, index) {
  return src.slice(0, index).split("\n").length;
}

/** Blanks whole-line code comments, keeping the line count so the report stays
 *  clickable.
 *
 *  A comment is not published copy, and without this the gate flags its own
 *  explanations: the note in dpa/page.tsx saying why naming Stripe was wrong contains
 *  the word Stripe. Whole lines only, deliberately: stripping from the first `//`
 *  anywhere would cut a URL in half inside a JSX string and hide whatever follows. */
function withoutFullLineComments(src) {
  return src
    .split("\n")
    .map((line) => {
      const t = line.trimStart();
      return t.startsWith("//") || t.startsWith("*") || t.startsWith("/*") ? "" : line;
    })
    .join("\n");
}

const bad = [];
for (const file of FILES) {
  let src;
  try {
    src = withoutFullLineComments(readFileSync(file, "utf8"));
  } catch {
    continue;
  }
  // Case sensitive on purpose. "Any credential" at the start of a sentence and "any
  // credential" mid-sentence are both real copy, so each spelling that occurs is
  // listed above rather than matched loosely: a case-insensitive sweep also flags
  // prose that happens to contain the words for an unrelated reason.
  for (const { term, pattern, why } of BANNED) {
    // A pattern when the claim is phrased differently per language, the literal term
    // otherwise. Both are case insensitive: a sentence-initial capital does not change
    // what a claim promises.
    const re = new RegExp(pattern ? pattern.source : escapeRegExp(term), "gi");
    for (const m of src.matchAll(re)) {
      bad.push({ file, line: lineOf(src, m.index), term, why });
    }
  }
  for (const { file: scope, term, why } of SCOPED) {
    if (scope !== file) continue;
    let from = 0;
    for (;;) {
      const at = indexOfTerm(src, term, from);
      if (at === -1) break;
      bad.push({ file, line: lineOf(src, at), term, why });
      from = at + term.length;
    }
  }
  for (const { term, requires, why } of CONDITIONED) {
    let from = 0;
    for (;;) {
      const at = indexOfTerm(src, term, from);
      if (at === -1) break;
      // Skip identifiers. "zkTLS" inside byZkTls or featureZkTls is a property name and
      // a translation key, not a sentence: the copy those keys resolve to lives in the
      // message files and is checked there. Counting both double-reports and, worse,
      // makes the gate unfixable without an exception list, which is the thing this
      // gate exists to avoid.
      if (at > 0 && /[A-Za-z0-9_]/.test(src[at - 1])) {
        from = at + term.length;
        continue;
      }
      const around = src.slice(Math.max(0, at - WINDOW), at + term.length + WINDOW);
      if (!requires.test(around)) {
        bad.push({ file, line: lineOf(src, at), term: `${term} (unqualified)`, why });
      }
      from = at + term.length;
    }
  }
}

if (bad.length) {
  console.error(
    `[copy] the copy promises what the product does not do (Regla #3): ${bad.length} findings\n`,
  );
  for (const b of bad) {
    console.error(`  ${b.file}:${b.line}\n    ${b.term}\n    why: ${b.why}\n`);
  }
  process.exit(1);
}
console.log(`[copy] OK: ${FILES.length} files carry no claim the product cannot back.`);
