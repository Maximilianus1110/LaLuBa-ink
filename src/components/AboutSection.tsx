"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { STUDIO_CONFIG } from "@/config/studio";

gsap.registerPlugin(ScrollTrigger);

const PRINCIPLES = [
  {
    num: "01",
    title: "Persönlich in Fürth",
    text: "Keine Massenabfertigung. Wir nehmen uns in entspannter 1:1-Atmosphäre Zeit für deine Idee.",
  },
  {
    num: "02",
    title: "Präziser Stencil-Check",
    text: "Jedes Motiv wird direkt an deine Körperlinie angepasst, bevor auch nur ein Stich sitzt.",
  },
  {
    num: "03",
    title: "Steril & inklusive TouchUp",
    text: "Sauberes Arbeiten auf Studio-Niveau — plus kostenloser TouchUp innerhalb von 6 Wochen.",
  },
] as const;

export function AboutSection() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.from(".about-reveal", {
        scrollTrigger: {
          trigger: el,
          start: "top 82%",
          once: true,
        },
        y: 20,
        opacity: 0,
        duration: 0.65,
        stagger: 0.12,
        ease: "power3.out",
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="atelier"
      ref={sectionRef}
      className="relative mx-auto max-w-5xl border-b border-white/[0.08] px-5 py-14 md:px-8 md:py-20"
    >
      <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-12">
        {/* Left: Laura & Approach */}
        <div className="about-reveal md:col-span-5">
          <p className="mb-2 text-[11px] font-semibold tracking-[0.24em] text-[#d9789b] uppercase">
            Atelier &amp; Arbeitsweise
          </p>
          <h2 className="font-editorial text-2xl leading-snug font-semibold text-[#f2f0f1] sm:text-3xl">
            Mit Ruhe, Herz &amp; sicherer Hand.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-[#9a9598]">
            Als aufstrebende Tattoo-Artistin in{" "}
            <span className="text-[#f2f0f1]">{STUDIO_CONFIG.locationShort}</span>{" "}
            stecke ich in jedes Motiv volle Aufmerksamkeit — egal ob zartes
            Fine-Line, persönliches Lettering oder detailreiches Einzelstück.
          </p>
          <p className="mt-3 text-xs tracking-wider text-[#eab8c9] uppercase">
            ✦ {STUDIO_CONFIG.pricingNote}
          </p>
        </div>

        {/* Right: 3 Minimalist Principles */}
        <div className="divide-y divide-white/[0.08] border-y border-white/[0.08] md:col-span-7">
          {PRINCIPLES.map((item) => (
            <div
              key={item.num}
              className="about-reveal flex items-start gap-4 py-4 sm:gap-6 sm:py-5"
            >
              <span className="pt-0.5 text-xs font-semibold tracking-widest text-[#d9789b]">
                {item.num}
              </span>
              <div>
                <h3 className="text-sm font-semibold text-[#f2f0f1]">
                  {item.title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-[#9a9598] sm:text-sm">
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
