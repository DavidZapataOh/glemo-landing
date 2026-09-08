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
  // The billing model is verifier-pays, and it is not a slogan: billing.ts says
  // "Verifier-pays: issuance is free (there is NOTHING about /issue here)", quotaGuard
  // is mounted only on the verify routes, and no issuing route touches metering. So a
  // sentence that prices issuing is not a rounding of the truth, it is the opposite of
  // it, and the pricing page one screen away says issuance is always free.
  //
  // The banned shape is "issuing HAS a price", not the word issuing near the word
  // price: "issuing is free" must stay sayable, and so must "what does issuing cost".
  {
    term: "issuing is priced",
    pattern:
      /issuing is priced|issuing[^.]{0,40}\bcosts?\b[^.]{0,20}(per|from|\$)|emitir tiene un precio|emitir[^.]{0,40}cuesta\b/i,
    why: "verifier-pays: billing.ts states issuance is free and there is NOTHING about /issue in the billing module, quotaGuard is mounted only on the verify routes, and the pricing page says issuing is always free",
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
  // The four levels are declared/signed/anchored/independent in
  // glemo-backend rules.schema.ts, computed by assurance/level.ts from the checks the
  // engine emitted. They measure ONE axis, how little the issuer had to cooperate, and
  // no published standard grades that axis for a verifier at verification time.
  //
  // The ban covers naming a published assurance vocabulary NEXT TO ours, in either
  // direction: claiming equivalence with NIST or ISO would be false, and so would
  // implying our four values are an accepted scale. The generic phrase "assurance
  // level" is in the same pattern because it is the term those standards define, and a
  // reader who knows them will import their meaning into ours.
  {
    term: "NIST SP 800-63",
    pattern: /\bNIST\b|\bSP ?800-?63\b|\bIAL[123]\b|\bAAL[123]\b|\bISO ?29115\b|assurance level|nivel de garant[ií]a/i,
    why: "our four levels measure independence from the issuer, an axis no published standard grades for the verifier; naming NIST, SP 800-63 or ISO 29115 beside them claims an equivalence we cannot sustain in either direction",
  },
  // UNTP is the near neighbour and the easiest honest mistake, so it gets its own
  // reason rather than sharing one. Its assessorLevel and AssuranceClass DO order
  // parties by independence, but institutional accredited independence, written by the
  // issuer of the attestation and not computed by the verifier. It is already
  // CONDITIONED below for the self-declaration caveat; this rule is about pinning it to
  // our scale specifically.
  {
    term: "UNTP assurance",
    pattern: /UNTP[^.]{0,60}(assurance level|assessorLevel|AssuranceClass)|assurance level[^.]{0,60}UNTP/i,
    why: "UNTP grades accredited institutional independence, declared by the attestation issuer; ours is operational and computed at verification time, so pinning one to the other misdescribes both",
  },
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

/** Every finding in ONE source. Split out of the loop so the fixtures below can run
 *  the real rules against text that is not on disk. */
function scanSource(file, raw) {
  const bad = [];
  const src = withoutFullLineComments(raw);
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
  return bad;
}

/** The gate's own test, and it runs on every invocation.
 *
 *  A rule is only worth what it catches, and the sentences below were PUBLISHED until
 *  Sprint 29 plan 08 removed them: without this, softening the pattern later would go
 *  unnoticed because the copy that used to trip it is gone. The negative cases matter
 *  as much: a rule that also flags "issuing is free" would make the honest sentence
 *  unsayable, which is how a gate gets deleted instead of fixed. */
const FIXTURES = [
  {
    caught: "issuing is priced",
    text: "Issuing is priced so any institution can afford it; heavy verification is billed per check.",
  },
  {
    caught: "issuing is priced",
    text: "Emitir tiene un precio que cualquier institución puede pagar; la verificación intensiva se cobra por chequeo.",
  },
  {
    caught: "re-checking is free",
    text: "Re-checking a credential you already verified in the same billing period is free.",
  },
  { safe: "Issuing credentials is free. Verifiers pay per verification." },
  { safe: "Emitir credenciales es gratis. Los verificadores pagan por verificación." },
  { safe: "What does it cost? Every plan publishes its rate." },
  // The question is not the claim. "How much does issuing cost" must stay askable, and
  // the honest answer to it is the sentence above.
  { safe: "¿Cuánto cuesta emitir? Nada: emitir credenciales es gratis." },
];

const fixtureFailures = [];
for (const f of FIXTURES) {
  const found = scanSource("<fixture>", f.text ?? f.safe).map((b) => b.term);
  if (f.caught && !found.includes(f.caught)) {
    fixtureFailures.push(`rule "${f.caught}" no longer catches: ${f.text}`);
  }
  if (f.safe && found.length > 0) {
    fixtureFailures.push(`honest copy flagged by ${found.join(", ")}: ${f.safe}`);
  }
}
if (fixtureFailures.length) {
  console.error("[copy] the GATE ITSELF is broken, before any copy was checked:\n");
  for (const f of fixtureFailures) console.error(`  ${f}`);
  process.exit(1);
}

const bad = [];
for (const file of FILES) {
  let src;
  try {
    src = readFileSync(file, "utf8");
  } catch {
    continue;
  }
  bad.push(...scanSource(file, src));
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
