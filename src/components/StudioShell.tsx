"use client";

import React, { useEffect, useState } from "react";
import {
  Grid3X3,
  HelpCircle,
  Instagram,
  MessageCircle,
  Pause,
  Play,
  Sparkles,
} from "lucide-react";
import { STUDIO_CONFIG } from "@/config/studio";
import { LaLuBaLogo } from "./LaLuBaLogo";
import { HeroSection } from "./HeroSection";
import { AboutSection } from "./AboutSection";
import { MasterpieceGallery } from "./MasterpieceGallery";
import { InstagramSection } from "./InstagramSection";
import { TattooConfigurator } from "./TattooConfigurator";
import { GoodToKnowSection } from "./GoodToKnowSection";

type SectionId =
  | "start"
  | "atelier"
  | "galerie"
  | "instagram"
  | "ideen-check"
  | "wissen";

const SECTION_ORDER: SectionId[] = [
  "start",
  "atelier",
  "galerie",
  "instagram",
  "ideen-check",
  "wissen",
];

export function StudioShell() {
  const [isMotionPaused, setIsMotionPaused] = useState<boolean>(false);
  const [preselectedVibe, setPreselectedVibe] = useState<string | null>(null);
  const [preselectedInspiration, setPreselectedInspiration] = useState<
    string | null
  >(null);
  const [expandSignal, setExpandSignal] = useState<number>(0);
  const [activeSection, setActiveSection] = useState<SectionId>("start");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateActiveFromScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY < 120) {
        setActiveSection("start");
        return;
      }

      const nearBottom =
        window.innerHeight + scrollY >=
        document.documentElement.scrollHeight - 60;
      if (nearBottom) {
        setActiveSection("wissen");
        return;
      }

      const probeY = scrollY + window.innerHeight * 0.36;
      let current: SectionId = "start";
      for (const id of SECTION_ORDER) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= probeY) {
          current = id;
        }
      }
      setActiveSection(current);
    };

    updateActiveFromScroll();
    window.addEventListener("scroll", updateActiveFromScroll, { passive: true });
    window.addEventListener("resize", updateActiveFromScroll);
    return () => {
      window.removeEventListener("scroll", updateActiveFromScroll);
      window.removeEventListener("resize", updateActiveFromScroll);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (CSS.supports("animation-timeline", "scroll(root)")) return;

    const updateProgress = () => {
      const scrollable = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      const ratio = Math.min(1, Math.max(0, window.scrollY / scrollable));
      document
        .querySelectorAll<HTMLElement>(".scroll-progress-bar")
        .forEach((bar) => {
          bar.style.transform = `scaleX(${ratio})`;
        });
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

  const navItems: { id: SectionId; label: string }[] = [
    { id: "atelier", label: "Atelier" },
    { id: "galerie", label: "Top 3" },
    { id: "instagram", label: "Instagram" },
    { id: "ideen-check", label: "Kontakt" },
    { id: "wissen", label: "Wissenswertes" },
  ];

  return (
    <div className="relative min-h-screen pb-24 md:pb-0">
      {/* Minimal Sticky Top Header mit integriertem Progress-Balken */}
      <header className="fixed top-0 right-0 left-0 z-50 border-b border-white/[0.08] bg-[#050506]/85 backdrop-blur-lg">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5 md:px-8">
          <a
            href="#start"
            aria-current={activeSection === "start" ? "location" : undefined}
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
            className="hidden items-center gap-6 text-[11px] font-medium tracking-[0.16em] uppercase md:flex"
          >
            {navItems.map((item) => {
              const isCurrent = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  aria-current={isCurrent ? "location" : undefined}
                  className={`border-b-2 py-1 transition ${
                    isCurrent
                      ? "border-[#d9789b] text-[#f2f0f1]"
                      : "border-transparent text-[#9a9598] hover:text-[#f2f0f1]"
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
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

        <div className="scroll-progress-bar" aria-hidden="true" />
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
        <GoodToKnowSection />
      </main>

      {/* Clean Footer (ohne Link zur versteckten /aftercare-Unterseite) */}
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

      {/* Mobile App-Style Bottom Bar mit aktivem Section-Highlight & integriertem Progress-Balken */}
      <nav
        aria-label="Mobile Schnellnavigation"
        className="fixed right-3 bottom-3 left-3 z-50 mx-auto max-w-md overflow-hidden rounded-xl border border-white/15 bg-[#0e0e10]/94 shadow-2xl backdrop-blur-xl md:hidden"
      >
        <div className="scroll-progress-bar" aria-hidden="true" />
        <div className="grid grid-cols-5 items-center gap-1 px-1.5 py-1.5">
          {[
            {
              id: "start" as SectionId,
              match: ["start", "atelier"] as SectionId[],
              label: "Start",
              icon: Sparkles,
            },
            {
              id: "galerie" as SectionId,
              match: ["galerie"] as SectionId[],
              label: "Top 3",
              icon: Grid3X3,
            },
            {
              id: "instagram" as SectionId,
              match: ["instagram"] as SectionId[],
              label: "Insta",
              icon: Instagram,
            },
            {
              id: "ideen-check" as SectionId,
              match: ["ideen-check"] as SectionId[],
              label: "Kontakt",
              icon: MessageCircle,
            },
            {
              id: "wissen" as SectionId,
              match: ["wissen"] as SectionId[],
              label: "Tipps",
              icon: HelpCircle,
            },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = tab.match.includes(activeSection);
            return (
              <a
                key={tab.id}
                href={`#${tab.id}`}
                aria-current={isActive ? "location" : undefined}
                className={`relative flex flex-col items-center justify-center gap-0.5 rounded-lg py-1.5 text-[10px] font-semibold transition ${
                  isActive
                    ? "bg-[#f2f0f1] text-[#050506] shadow-sm"
                    : "text-[#9a9598] hover:text-[#f2f0f1]"
                }`}
              >
                <Icon
                  className={`h-3.5 w-3.5 ${
                    isActive ? "text-[#050506]" : "text-[#d9789b]"
                  }`}
                />
                <span>{tab.label}</span>
              </a>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
