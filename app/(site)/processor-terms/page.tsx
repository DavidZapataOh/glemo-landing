import { LegalDoc, LP } from "@/components/v2/LegalDoc";

export const metadata = { title: "Processor terms · Glemo" };

const clauses: [string, string][] = [
  [
    "Documented instructions",
    "Glemo processes personal data only to issue, anchor, and verify credentials on the customer's instruction (the API calls are the documented instruction).",
  ],
  [
    "No own purposes",
    "Glemo does not use holder data for its own purposes; analytics and reputation run on aggregates without claims.",
  ],
  [
    "Confidentiality",
    "Staff with access are under a confidentiality duty; production access is restricted and audited.",
  ],
  [
    "Subprocessors",
    "A public list (see the DPA); changes are notified 30 days ahead for objection.",
  ],
  [
    "Holder rights",
    "Glemo runs the technical erasure (CNIL pattern) on the customer's instruction within the SLA; the customer answers to the holder.",
  ],
  [
    "Return or deletion at contract end",
    "Export of the customer's credentials plus deletion of personal data; on-chain anchors become unlinkable through key destruction.",
  ],
  [
    "Audit",
    "Reasonable information to demonstrate compliance (erasure log, CI security gates, compliance docs).",
  ],
];

export default function ProcessorTermsPage() {
  return (
    <LegalDoc title="Processor terms">
      <LP>
        Clauses that fix Glemo&apos;s role as a <strong>processor</strong> (not a controller) in the B2B
        terms of service:
      </LP>
      <ol className="flex max-w-[68ch] list-decimal flex-col gap-3 pl-5">
        {clauses.map(([heading, body]) => (
          <li key={heading}>
            <strong className="text-[var(--ink)]">{heading}.</strong> {body}
          </li>
        ))}
      </ol>
    </LegalDoc>
  );
}
