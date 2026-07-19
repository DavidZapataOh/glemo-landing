"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { gsap, registerGsap, prefersReducedMotion, EASE } from "@/lib/motion";
import CredentialCard, { type CredentialVariant } from "./ui/CredentialCard";
import { cn } from "@/lib/utils";

const ORDER: CredentialVariant[] = ["diploma", "cert", "event"];

/** slot transforms: front, middle, back */
const SLOTS = [
  { x: 0, y: 26, r: -3, s: 1, z: 30, o: 1 },
  { x: 44, y: -14, r: 5, s: 0.94, z: 20, o: 0.92 },
  { x: -46, y: -46, r: -10, s: 0.88, z: 10, o: 0.85 },
];

/**
 * The hero object (Privado + Proof lesson): three human credentials fanned
 * like physical cards. Every ~5.5s the front card is scanned (beam sweep),
 * stamped VERIFIED, then the stack shuffles. Subtle pointer parallax.
 * Reduced motion: static fan with the front card already stamped.
 */
export default function HeroStack({ className }: { className?: string }) {
  const t = useTranslations("hero");
  const rootRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const orderRef = useRef<number[]>([0, 1, 2]); // card index -> slot

  useEffect(() => {
    registerGsap();
    const root = rootRef.current;
    if (!root) return;
    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
    const reduced = prefersReducedMotion();

    const apply = (instant = false) => {
      cards.forEach((card, i) => {
        const slot = SLOTS[orderRef.current[i]];
        gsap[instant ? "set" : "to"](card, {
          x: slot.x,
          y: slot.y,
          rotate: slot.r,
          scale: slot.s,
          zIndex: slot.z,
          opacity: slot.o,
          ...(instant ? {} : { duration: 0.85, ease: EASE }),
        });
      });
    };
    apply(true);

    if (reduced) {
      const front = cards[orderRef.current.indexOf(0)];
      front?.querySelector(".cc-stamp")?.classList.remove("opacity-0");
      front?.querySelector(".cc-chip")?.classList.remove("opacity-0");
      return;
    }

    let alive = true;
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), {
      threshold: 0.15,
    });
    io.observe(root);

    const timers: number[] = [];
    const later = (fn: () => void, ms: number) => {
      const id = window.setTimeout(fn, ms);
      timers.push(id);
    };

    const cycle = () => {
      if (!alive) return;
      if (!visible || document.hidden) return later(cycle, 1200);

      const front = cards[orderRef.current.indexOf(0)];
      if (!front) return;
      const beam = front.querySelector(".cc-beam");
      const stamp = front.querySelector(".cc-stamp");
      const chip = front.querySelector(".cc-chip");

      const tl = gsap.timeline();
      tl.fromTo(
        beam,
        { x: 0, opacity: 0 },
        { x: 430, opacity: 1, duration: 0.75, ease: "power2.inOut" }
      )
        .to(beam, { opacity: 0, duration: 0.15 }, "-=0.12")
        .fromTo(
          stamp,
          { opacity: 0, scale: 0.5, rotate: -20 },
          { opacity: 1, scale: 1, rotate: -11, duration: 0.45, ease: "back.out(2.2)" },
          "-=0.15"
        )
        .fromTo(
          chip,
          { opacity: 0, y: 6 },
          { opacity: 1, y: 0, duration: 0.3, ease: EASE },
          "<0.1"
        );

      later(() => {
        if (!alive) return;
        // clear verified state, shuffle front -> back
        gsap.to([stamp, chip], { opacity: 0, duration: 0.25 });
        orderRef.current = orderRef.current.map((s) => (s + 2) % 3);
        apply();
        later(cycle, 1400);
      }, 3400);
    };
    later(cycle, 1100);

    // pointer parallax (desktop only)
    const fine = window.matchMedia("(pointer: fine)").matches;
    const onMove = (e: MouseEvent) => {
      const rect = root.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(root, {
        rotateY: nx * 7,
        rotateX: -ny * 6,
        duration: 0.6,
        ease: "power2.out",
      });
    };
    const onLeave = () =>
      gsap.to(root, { rotateY: 0, rotateX: 0, duration: 0.8, ease: EASE });
    if (fine) {
      root.addEventListener("mousemove", onMove);
      root.addEventListener("mouseleave", onLeave);
    }

    return () => {
      alive = false;
      timers.forEach(clearTimeout);
      io.disconnect();
      if (fine) {
        root.removeEventListener("mousemove", onMove);
        root.removeEventListener("mouseleave", onLeave);
      }
    };
  }, []);

  const cards = ORDER.map((variant) => ({
    variant,
    data: {
      kind: t(`cards.${variant}.kind`),
      name: t(`cards.${variant}.name`),
      title: t(`cards.${variant}.title`),
      issuer: t(`cards.${variant}.issuer`),
      year: t(`cards.${variant}.year`),
    },
  }));

  return (
    <div
      className={cn("relative", className)}
      style={{ perspective: "1100px" }}
      role="img"
      aria-label={`${t("cards.diploma.kind")} · ${t("cards.cert.kind")} · ${t("cards.event.kind")}`}
    >
      {/* faint network arcs behind the stack — texture, not diagram */}
      <svg
        viewBox="0 0 560 420"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.16]"
        aria-hidden="true"
      >
        {[
          "M10 330 C 150 240, 400 250, 550 120",
          "M0 180 C 160 150, 380 320, 560 300",
          "M60 40 C 200 120, 360 60, 520 190",
        ].map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke="var(--verify)"
            strokeWidth="1"
            strokeDasharray="1 7"
            strokeLinecap="round"
          />
        ))}
        {[[40, 320], [530, 130], [20, 185], [545, 295], [80, 52], [500, 182]].map(
          ([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="2.5" fill="var(--verify)" />
          )
        )}
      </svg>

      <div ref={rootRef} className="relative mx-auto h-[340px] w-[352px] sm:h-[380px]">
        {cards.map((c, i) => (
          <div
            key={c.variant}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            className="absolute left-0 top-8 will-change-transform"
          >
            <CredentialCard
              variant={c.variant}
              data={c.data}
              verifiedChip={t("verifiedChip")}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
