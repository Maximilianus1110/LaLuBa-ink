"use client";

import React, { useEffect, useState } from "react";
import {
  Grid3X3,
  HeartHandshake,
  Instagram,
  MessageCircle,
  Pause,
  Play,
} from "lucide-react";
import { STUDIO_CONFIG } from "@/config/studio";
import { LaLuBaLogo } from "./LaLuBaLogo";
import { HeroSection } from "./HeroSection";
import { AboutSection } from "./AboutSection";
import { MasterpieceGallery } from "./MasterpieceGallery";
import { InstagramSection } from "./InstagramSection";
import { TattooConfigurator } from "./TattooConfigurator";
import { AftercareSection } from "./AftercareSection";

export function StudioShell() {
  const [isMotionPaused, setIsMotionPaused] = useState<boolean>(false);
  const [preselectedVibe, setPreselectedVibe] = useState<string | null>(null);
  const [preselectedInspiration, setPreselectedInspiration] = useState<
    string | null
  >(null);
  const [expandSignal, setExpandSignal] = useState<number>(0);

  // Scroll Progress Fallback for browsers without CSS scroll-driven animations (Modern Web Guidance)
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (CSS.supports("animation-timeline", "scroll()")) return;

    const progressEl = document.getElementById("scroll-progress");
    if (!progressEl) return;

    const updateProgress = () => {
      const scrollable = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      const ratio = Math.min(1, Math.max(0, window.scrollY / scrollable));
      progressEl.style.transform = `scaleX(${ratio})`;
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  const handleSelectInspiration = (vibe: string, title: string) => {
    setPreselectedVibe(vibe);
    setPreselectedInspiration(title);
    setExpandSignal((n) => n + 1);
  };

  return (
    <div className="relative min-h-screen pb-24 md:pb-0">
      {/* Minimal Sticky Top Header */}
      <header className="fixed top-[2px] right-0 left-0 z-50 border-b border-white/[0.08] bg-[#050506]/80 backdrop-blur-lg">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5 md:px-8">
          <a
            href="#start"
            className="flex items-center gap-2.5 focus-visible:outline-none"
          >
            <LaLuBaLogo compact className="h-9 w-9" />
            <div className="leading-tight">
              <span className="font-editorial block text-sm font-semibold tracking-wide text-[#f2f0f1]">
                LaLuBa.ink
              </span>
              <span className="block text-[10px] tracking-wider text-[#9a9598] uppercase">
                {STUDIO_CONFIG.location}
              </span>
            </div>
          </a>

          <nav
            aria-label="Hauptnavigation"
            className="hidden items-center gap-6 text-[11px] font-medium tracking-[0.16em] text-[#9a9598] uppercase md:flex"
          >
            <a href="#atelier" className="transition hover:text-[#f2f0f1]">
              Atelier
            </a>
            <a href="#galerie" className="transition hover:text-[#f2f0f1]">
              Top 3
            </a>
            <a href="#instagram" className="transition hover:text-[#f2f0f1]">
              Instagram
            </a>
            <a href="#ideen-check" className="transition hover:text-[#f2f0f1]">
              Kontakt
            </a>
            <a href="#aftercare" className="transition hover:text-[#f2f0f1]">
              Aftercare
            </a>
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsMotionPaused((prev) => !prev)}
              aria-label={
                isMotionPaused
                  ? "Hintergrund-Animation abspielen"
                  : "Hintergrund-Animation pausieren"
              }
              title={
                isMotionPaused ? "Animation abspielen" : "Animation pausieren"
              }
              className="inline-flex h-8 items-center gap-1.5 rounded border border-white/15 px-2.5 text-[11px] text-[#9a9598] transition hover:border-white/35 hover:text-[#f2f0f1]"
            >
              {isMotionPaused ? (
                <>
                  <Play className="h-3 w-3 text-[#d9789b]" />
                  <span className="hidden sm:inline">Play</span>
                </>
              ) : (
                <>
                  <Pause className="h-3 w-3" />
                  <span className="hidden sm:inline">Pause</span>
                </>
              )}
            </button>

            <a
              href="#ideen-check"
              className="inline-flex h-8 items-center rounded bg-[#f2f0f1] px-3.5 text-[11px] font-bold tracking-wider text-[#050506] uppercase transition hover:bg-[#eab8c9]"
            >
              Kontakt
            </a>
          </div>
        </div>
      </header>

      <main>
        <HeroSection isMotionPaused={isMotionPaused} />
        <AboutSection />
        <MasterpieceGallery onSelectVibe={handleSelectInspiration} />
        <InstagramSection onSelectInspiration={handleSelectInspiration} />
        <TattooConfigurator
          preselectedVibe={preselectedVibe}
          preselectedInspiration={preselectedInspiration}
          expandSignal={expandSignal}
        />
        <AftercareSection />
      </main>

      {/* Clean Footer */}
      <footer className="border-t border-white/[0.08] bg-[#050506] py-10">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-5 px-5 text-center md:flex-row md:px-8 md:text-left">
          <div className="flex items-center gap-3">
            <LaLuBaLogo compact className="h-12 w-12" />
            <div>
              <p className="font-editorial text-base font-semibold text-[#f2f0f1]">
                LaLuBa.ink — Tattoo&apos;s by Laura
              </p>
              <p className="text-xs text-[#9a9598]">
                Fürth bei Nürnberg · Preise nur nach Absprache
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={STUDIO_CONFIG.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded border border-white/15 px-3.5 py-1.5 text-xs font-medium text-[#f2f0f1] transition hover:border-[#d9789b]"
            >
              <Instagram className="h-3.5 w-3.5 text-[#d9789b]" />
              <span>@laluba.ink</span>
            </a>
            <a
              href={`https://wa.me/${STUDIO_CONFIG.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded border border-white/15 px-3.5 py-1.5 text-xs font-medium text-[#f2f0f1] transition hover:border-white/40"
            >
              <MessageCircle className="h-3.5 w-3.5 text-[#9a9598]" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </footer>

      {/* Monochrome Mobile Thumb Dock */}
      <nav
        aria-label="Mobile Schnellnavigation"
        className="fixed right-3 bottom-3 left-3 z-50 mx-auto flex max-w-md items-center justify-around rounded-xl border border-white/15 bg-[#0e0e10]/92 px-2 py-2 backdrop-blur-xl md:hidden"
      >
        <a
          href="#galerie"
          className="flex flex-col items-center gap-0.5 px-2 py-1 text-[10px] font-medium text-[#9a9598] hover:text-[#f2f0f1]"
        >
          <Grid3X3 className="h-4 w-4 text-[#d9789b]" />
          <span>Top 3</span>
        </a>
        <a
          href="#instagram"
          className="flex flex-col items-center gap-0.5 px-2 py-1 text-[10px] font-medium text-[#9a9598] hover:text-[#f2f0f1]"
        >
          <Instagram className="h-4 w-4" />
          <span>Insta</span>
        </a>
        <a
          href="#ideen-check"
          className="rounded bg-[#f2f0f1] px-4 py-2 text-[11px] font-bold tracking-wider text-[#050506] uppercase"
        >
          Kontakt
        </a>
        <a
          href="#aftercare"
          className="flex flex-col items-center gap-0.5 px-2 py-1 text-[10px] font-medium text-[#9a9598] hover:text-[#f2f0f1]"
        >
          <HeartHandshake className="h-4 w-4" />
          <span>Pflege</span>
        </a>
      </nav>
    </div>
  );
}
