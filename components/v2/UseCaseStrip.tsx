"use client";

import { useTranslations } from "next-intl";
import {
  GraduationCap,
  Rocket,
  MonitorPlay,
  Briefcase,
  Trophy,
  ShieldCheck,
  Users,
  Building2,
} from "lucide-react";
import Marquee from "./ui/Marquee";

const ICONS = [
  GraduationCap,
  Rocket,
  MonitorPlay,
  Briefcase,
  Trophy,
  ShieldCheck,
  Users,
  Building2,
];

/**
 * Who this is for, told with icons (the Privado app-grid lesson): the
 * audience as visual vocabulary, one constant-speed marquee.
 */
export default function UseCaseStrip() {
  const t = useTranslations("usecases");
  const items = t.raw("items") as string[];

  return (
    <section className="border-y border-line py-8">
      <p className="container-g mb-5 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-ink-2/70">
        {t("label")}
      </p>
      <Marquee speed={44}>
        {items.map((item, i) => {
          const Icon = ICONS[i % ICONS.length];
          return (
            <span
              key={item}
              className="mx-2.5 inline-flex items-center gap-2.5 rounded-full border border-line bg-surface px-5 py-2.5 text-[0.92rem] font-bold text-ink-2"
            >
              <Icon className="h-4 w-4 text-verify" aria-hidden="true" />
              {item}
            </span>
          );
        })}
      </Marquee>
    </section>
  );
}
