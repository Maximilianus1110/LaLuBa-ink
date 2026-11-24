"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ArrowDown, Instagram, MapPin, MessageCircle } from "lucide-react";
import { InkCanvas3D } from "./InkCanvas3D";
import { LaLuBaLogo } from "./LaLuBaLogo";
import { STUDIO_CONFIG } from "@/config/studio";

interface HeroSectionProps {
  isMotionPaused: boolean;
}

export function HeroSection({ isMotionPaused }: HeroSectionProps) {
  const heroRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.from(".hero-stagger", {
        y: 16,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.35,
      });
    }, el);

    return () => ctx.revert();
  }, []);

  const whatsappDirectUrl = `https://wa.me/${STUDIO_CONFIG.whatsappNumber}?text=${encodeURIComponent(
    "Hey Laura, ich habe deine Seite gesehen und möchte gerne wegen eines Tattoos anfragen."
  )}`;

  return (
    <section
      id="start"
      ref={heroRef}
      className="relative flex min-h-[88dvh] flex-col justify-between overflow-hidden border-b border-white/[0.08] pt-20 pb-8"
    >
      <InkCanvas3D isPaused={isMotionPaused} />

      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-5 text-center md:px-8">
        <div className="hero-stagger mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#0e0e10]/80 px-3.5 py-1 text-[10px] font-medium tracking-[0.2em] text-[#9a9598] uppercase backdrop-blur-md">
          <MapPin className="h-3 w-3 text-[#d9789b]" />
          <span>{STUDIO_CONFIG.locationShort}</span>
          <span className="text-white/20">·</span>
          <span>{STUDIO_CONFIG.roleLabel}</span>
        </div>

        {/* Pure Vector SVG Logo animated live like a tattoo needle */}
        <div className="mb-4 flex flex-col items-center">
          <LaLuBaLogo
            animateDraw
            className="h-44 w-44 sm:h-52 sm:w-52 md:h-60 md:w-60"
          />
        </div>

        <h1 className="hero-stagger font-editorial max-w-xl text-3xl leading-[1.15] font-semibold tracking-tight text-[#f2f0f1] sm:text-4xl md:text-5xl">
          Deine Idee,{" "}
          <span className="italic font-normal text-[#eab8c9]">ruhig</span> &amp;
          präzise unter der Haut.
        </h1>

        <p className="hero-stagger mt-3.5 max-w-md text-sm leading-relaxed text-[#9a9598]">
          Fine-Line, Script &amp; individuelle Motive von{" "}
          <span className="text-[#f2f0f1]">Laura</span> in Fürth bei Nürnberg —{" "}
          <span className="text-[#eab8c9]">Preise nur nach Absprache</span>.
        </p>

        <div className="hero-stagger mt-6 flex w-full max-w-sm flex-col gap-2.5 sm:max-w-md sm:flex-row sm:justify-center">
          <a
            href="#ideen-check"
            className="inline-flex min-h-[42px] items-center justify-center rounded bg-[#f2f0f1] px-5 py-2.5 text-xs font-bold tracking-[0.14em] text-[#050506] uppercase transition hover:bg-[#eab8c9]"
          >
            Tattoo anfragen
          </a>

          <div className="grid grid-cols-2 gap-2.5 sm:flex">
            <a
              href={STUDIO_CONFIG.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[42px] items-center justify-center gap-1.5 rounded border border-white/15 bg-[#0e0e10]/80 px-4 py-2.5 text-xs font-semibold tracking-wider text-[#f2f0f1] uppercase backdrop-blur-md transition hover:border-[#d9789b]/60"
            >
              <Instagram className="h-3.5 w-3.5 text-[#d9789b]" />
              <span>Insta</span>
            </a>

            <a
              href={whatsappDirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[42px] items-center justify-center gap-1.5 rounded border border-white/15 bg-[#0e0e10]/80 px-4 py-2.5 text-xs font-semibold tracking-wider text-[#f2f0f1] uppercase backdrop-blur-md transition hover:border-white/40"
            >
              <MessageCircle className="h-3.5 w-3.5 text-[#9a9598]" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-6 flex justify-center">
        <a
          href="#atelier"
          aria-label="Weiter zum Atelier-Abschnitt"
          className="inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.2em] text-[#9a9598] uppercase transition hover:text-[#f2f0f1]"
        >
          <span>Mehr entdecken</span>
          <ArrowDown className="h-3.5 w-3.5 text-[#d9789b]" />
        </a>
      </div>
    </section>
  );
}
