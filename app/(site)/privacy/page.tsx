import { LegalDoc, LH2, LP } from "@/components/v2/LegalDoc";

export const metadata = { title: "Privacy policy · Glemo" };

const rows: [string, string, string][] = [
  ["Holder email", "Service delivery (issuer's instruction)", "Deliver the credential and its verification link"],
  ["Credential claims (name, achievement)", "Same", "The verifiable content"],
  ["Account email (users)", "Contract", "Authentication and account management"],
  ["Verification events (verdicts, latencies, no claims)", "Legitimate interest", "Metering, anti-fraud, and aggregate analytics"],
];

export default function PrivacyPage() {
  return (
    <LegalDoc title="Privacy policy">
      <LH2>Who we are</LH2>
      <LP>
        Glemo is a credential verification network. For credentials issued by our customers, Glemo
        acts as a <strong>processor</strong>; the issuer is the data controller.
      </LP>

      <LH2>What data we process and why</LH2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              {["Data", "Basis", "For what"].map((h) => (
                <th key={h} className="border-b border-[var(--line)] px-3 py-2 text-left font-semibold text-[var(--ink)]">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(([data, basis, use]) => (
              <tr key={data}>
                <td className="border-b border-[var(--line)] px-3 py-2 align-top text-[var(--ink)]">{data}</td>
                <td className="border-b border-[var(--line)] px-3 py-2 align-top">{basis}</td>
                <td className="border-b border-[var(--line)] px-3 py-2 align-top">{use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <LH2>What we don&apos;t do</LH2>
      <ul className="flex max-w-[68ch] list-disc flex-col gap-2 pl-5">
        <li>
          We publish no personal data on any blockchain: only keyed hashes (commitments) travel
          on-chain, and they cannot be reversed or linked without the key.
        </li>
        <li>We don&apos;t sell data. We don&apos;t use claims for advertising.</li>
      </ul>

      <LH2>Your rights</LH2>
      <LP>
        Access, rectification, erasure, portability. Erasure follows the pattern the CNIL endorses:
        we destroy the cryptographic key (the public anchor becomes unlinkable) and delete the
        internal copies. Target time: 72 h from a validated request; backups rotate out fully within
        the stated retention window. Contact: privacy@glemo.io.
      </LP>

      <LH2>Retention</LH2>
      <LP>
        Credential data: while the credential is active, or until an erasure request. Verification
        events: aggregated without claims, retained for billing and audit.
      </LP>
    </LegalDoc>
  );
}
