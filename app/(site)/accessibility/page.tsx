import { getTranslations } from "next-intl/server";
import { LegalDoc, LH2, LP } from "@/components/v2/LegalDoc";

export const metadata = { title: "Accessibility statement · Glemo" };

/** The statement the European Accessibility Act asks for, in force since 28 June 2025.
 *
 *  It lives here and not under /docs for one reason: the docs tree has no i18n
 *  (lib/source.ts builds the loader without an `i18n` option), while this page goes
 *  through next-intl like the rest of the site, so the locale switcher actually
 *  switches it. A declaration only half the audience can read is not a declaration.
 *
 *  Every figure below comes from a gate that runs, and the limitations are named on
 *  purpose: a statement claiming full conformity on the strength of automated tools
 *  is the one that gets challenged, because no automated tool can find most of what
 *  makes a page unusable. */
export default async function AccessibilityPage() {
  const t = await getTranslations("accessibility");

  return (
    <LegalDoc
      title={t("title")}
      notice={
        <>
          <strong className="text-[var(--ink)]">{t("noticeLead")}</strong> {t("noticeBody")}
        </>
      }
    >
      <LP>{t("intro")}</LP>

      <LH2>{t("standardTitle")}</LH2>
      <LP>{t("standardBody")}</LP>

      <LH2>{t("stateTitle")}</LH2>
      <LP>{t("stateBody")}</LP>
      <ul className="flex max-w-[68ch] list-disc flex-col gap-2 pl-5">
        <li>{t("stateAxe")}</li>
        <li>{t("stateLighthouse")}</li>
        <li>{t("stateContrast")}</li>
        <li>{t("stateResponsive")}</li>
        <li>{t("stateMotion")}</li>
      </ul>

      <LH2>{t("limitsTitle")}</LH2>
      <LP>{t("limitsBody")}</LP>
      <ul className="flex max-w-[68ch] list-disc flex-col gap-2 pl-5">
        <li>{t("limitsAssistive")}</li>
        <li>{t("limitsLighthouseScope")}</li>
        <li>{t("limitsLanguage")}</li>
        <li>{t("limitsThirdParty")}</li>
        <li>{t("limitsIssuerContent")}</li>
      </ul>

      <LH2>{t("methodTitle")}</LH2>
      <LP>{t("methodBody")}</LP>

      <LH2>{t("reviewedTitle")}</LH2>
      <LP>{t("reviewedBody")}</LP>

      <LH2>{t("contactTitle")}</LH2>
      <LP>{t("contactBody")}</LP>
    </LegalDoc>
  );
}
