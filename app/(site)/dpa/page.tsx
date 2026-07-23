import { LegalDoc, LH2, LP } from "@/components/v2/LegalDoc";

export const metadata = { title: "Data Processing Agreement · Glemo" };

const subprocessors: [string, string, string][] = [
  ["Managed Postgres provider", "Primary storage", "All off-chain data"],
  ["Resend", "Credential email delivery", "Holder email"],
  ["Stripe", "Customer billing", "Customer billing data"],
  ["Avalanche (public network)", "Anchoring", "Keyed hashes only, no PII"],
];

export default function DpaPage() {
  return (
    <LegalDoc title="Data Processing Agreement">
      <LH2>Roles</LH2>
      <ul className="flex max-w-[68ch] list-disc flex-col gap-2 pl-5">
        <li>
          <strong className="text-[var(--ink)]">Controller:</strong> the B2B customer (issuer or
          verifying organization).
        </li>
        <li>
          <strong className="text-[var(--ink)]">Processor:</strong> Glemo. It processes credentials
          and verifications on the controller&apos;s instructions; it does not decide purposes or means.
        </li>
      </ul>

      <LH2>Subject and duration</LH2>
      <LP>
        Issuing, cryptographic anchoring, verification, and aggregate analytics of verifiable
        credentials, for as long as the controller&apos;s account is active.
      </LP>

      <LH2>Data categories</LH2>
      <ul className="flex max-w-[68ch] list-disc flex-col gap-2 pl-5">
        <li>Credential holders: email (the credential subject identifier), name in claims, achievements.</li>
        <li>Controller&apos;s users: account email.</li>
        <li>
          <strong className="text-[var(--ink)]">Never on-chain:</strong> only keyed hashes.
        </li>
      </ul>

      <LH2>Technical and organizational measures</LH2>
      <ul className="flex max-w-[68ch] list-disc flex-col gap-2 pl-5">
        <li>Keyed commitments per credential; PII never leaves for attestation backends.</li>
        <li>Right to erasure: key destruction plus off-chain scrub, audited in the erasure log.</li>
        <li>Encryption in transit (TLS); issuer keys in a KMS; hashed API keys.</li>
        <li>Retention: data lives while the credential is active; backups rotate on the stated window.</li>
      </ul>

      <LH2>Subprocessors</LH2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              {["Subprocessor", "Function", "Data"].map((h) => (
                <th key={h} className="border-b border-[var(--line)] px-3 py-2 text-left font-semibold text-[var(--ink)]">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {subprocessors.map(([name, fn, data]) => (
              <tr key={name}>
                <td className="border-b border-[var(--line)] px-3 py-2 align-top text-[var(--ink)]">{name}</td>
                <td className="border-b border-[var(--line)] px-3 py-2 align-top">{fn}</td>
                <td className="border-b border-[var(--line)] px-3 py-2 align-top">{data}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <LH2>Assistance to the controller</LH2>
      <LP>
        Rights requests (access, erasure): Glemo runs the technical erasure (72 h SLA) on the
        controller&apos;s instruction.
      </LP>

      <LH2>Breach notification</LH2>
      <LP>Without undue delay, and no later than 48 h after internal confirmation.</LP>
    </LegalDoc>
  );
}
