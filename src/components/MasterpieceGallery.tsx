"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { TOP_THREE_WORKS, type TattooWork } from "@/config/studio";

gsap.registerPlugin(ScrollTrigger);

interface MasterpieceGalleryProps {
  onSelectVibe: (vibe: string, inspirationTitle: string) => void;
}

export function MasterpieceGallery({ onSelectVibe }: MasterpieceGalleryProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const touchStartX = useRef<number | null>(null);

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [activeWork, setActiveWork] = useState<TattooWork | null>(null);

  const count = TOP_THREE_WORKS.length;
  const prevIndex = (activeIndex - 1 + count) % count;
  const nextIndex = (activeIndex + 1) % count;

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.from(".coverflow-stage", {
        scrollTrigger: {
          trigger: el,
          start: "top 82%",
          once: true,
        },
        y: 20,
        opacity: 0,
        duration: 0.65,
        ease: "power3.out",
      });
    }, el);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const onClose = () => {
      dialog.returnValue = "";
      setActiveWork(null);
    };
    dialog.addEventListener("close", onClose);

    if (!("closedBy" in HTMLDialogElement.prototype)) {
      const outside = (e: PointerEvent) => {
        const r = dialog.getBoundingClientRect();
        return (
          e.clientX < r.left ||
          e.clientX > r.right ||
          e.clientY < r.top ||
          e.clientY > r.bottom
        );
      };
      let pressedOutside = false;
      const onPointerDown = (e: PointerEvent) => {
        pressedOutside = outside(e);
      };
      const onPointerUp = (e: PointerEvent) => {
        if (pressedOutside && outside(e)) dialog.close();
      };
      dialog.addEventListener("pointerdown", onPointerDown);
      dialog.addEventListener("pointerup", onPointerUp);
      return () => {
        dialog.removeEventListener("close", onClose);
        dialog.removeEventListener("pointerdown", onPointerDown);
        dialog.removeEventListener("pointerup", onPointerUp);
      };
    }

    return () => {
      dialog.removeEventListener("close", onClose);
    };
  }, []);

  const openModal = (work: TattooWork) => {
    setActiveWork(work);
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) {
      dialog.showModal();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (dx > 40) {
      setActiveIndex(prevIndex);
    } else if (dx < -40) {
      setActiveIndex(nextIndex);
    }
  };

  const centerWork = TOP_THREE_WORKS[activeIndex];
  const leftWork = TOP_THREE_WORKS[prevIndex];
  const rightWork = TOP_THREE_WORKS[nextIndex];

  return (
    <section
      id="galerie"
      ref={sectionRef}
      className="relative mx-auto max-w-4xl px-4 pt-12 pb-6 md:px-8 md:pt-16"
    >
      <div className="mb-8 text-center">
        <p className="mb-1.5 text-[11px] font-semibold tracking-[0.24em] text-[#d9789b] uppercase">
          Art Gallery · Top 3
        </p>
        <h2 className="font-editorial text-2xl font-semibold text-[#f2f0f1] sm:text-3xl">
          Meine 3 schönsten &amp; größten Werke
        </h2>
      </div>

      {/* 3-Karten-Coverflow exakt wie in der Skizze (Bild 3 links, Bild 1 Mitte, Bild 2 rechts) */}
      <div
        className="coverflow-stage relative mx-auto flex h-[390px] max-w-xl items-center justify-center sm:h-[430px] sm:max-w-2xl"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Linke hintere Karte (Bild 3) */}
        <button
          type="button"
          onClick={() => setActiveIndex(prevIndex)}
          aria-label={`Vorheriges Werk anzeigen: ${leftWork.title}`}
          className="group absolute left-0 z-10 flex h-[300px] w-[42%] flex-col overflow-hidden rounded-xl border border-white/15 bg-[#121216] text-left opacity-70 shadow-lg transition-all duration-300 hover:opacity-95 sm:left-4 sm:h-[340px] sm:w-[36%]"
        >
          <div className="relative flex-1 overflow-hidden bg-[#050506]">
            <img
              src={leftWork.image}
              alt={leftWork.title}
              loading="lazy"
              className="h-full w-full object-cover brightness-75 transition group-hover:brightness-90"
            />
          </div>
          <div className="border-t border-white/10 bg-[#0e0e10] px-3 py-2">
            <p className="text-[10px] font-semibold tracking-wider text-[#d9789b] uppercase">
              0{prevIndex + 1}
            </p>
            <p className="truncate text-[11px] font-medium text-[#f2f0f1]">
              {leftWork.title}
            </p>
          </div>
        </button>

        {/* Rechte hintere Karte (Bild 2) */}
        <button
          type="button"
          onClick={() => setActiveIndex(nextIndex)}
          aria-label={`Nächstes Werk anzeigen: ${rightWork.title}`}
          className="group absolute right-0 z-10 flex h-[300px] w-[42%] flex-col overflow-hidden rounded-xl border border-white/15 bg-[#121216] text-right opacity-70 shadow-lg transition-all duration-300 hover:opacity-95 sm:right-4 sm:h-[340px] sm:w-[36%]"
        >
          <div className="relative flex-1 overflow-hidden bg-[#050506]">
            <img
              src={rightWork.image}
              alt={rightWork.title}
              loading="lazy"
              className="h-full w-full object-cover brightness-75 transition group-hover:brightness-90"
            />
          </div>
          <div className="border-t border-white/10 bg-[#0e0e10] px-3 py-2">
            <p className="text-[10px] font-semibold tracking-wider text-[#d9789b] uppercase">
              0{nextIndex + 1}
            </p>
            <p className="truncate text-[11px] font-medium text-[#f2f0f1]">
              {rightWork.title}
            </p>
          </div>
        </button>

        {/* Mittlere Hauptkarte (Bild 1 — aktiv im Vordergrund) */}
        <article className="relative z-20 flex h-[375px] w-[66%] flex-col overflow-hidden rounded-2xl border border-[#d9789b]/45 bg-[#0e0e10] shadow-[0_20px_50px_rgba(0,0,0,0.85)] transition-all duration-300 sm:h-[420px] sm:w-[50%]">
          <div className="relative flex-1 overflow-hidden bg-[#050506]">
            <img
              src={centerWork.image}
              alt={`${centerWork.title} — Tattoo von Laura (LaLuBa.ink)`}
              loading="lazy"
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={() => openModal(centerWork)}
              aria-label={`${centerWork.title} groß ansehen`}
              className="absolute top-2.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-full border border-white/25 bg-[#050506]/75 text-[#f2f0f1] backdrop-blur-md transition hover:border-[#d9789b]"
            >
              <Expand className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Untere abgetrennte Leiste exakt wie in Skizze (Bild 1 Titel-Kasten) */}
          <div className="border-t border-white/15 bg-[#0e0e10] p-3.5">
            <div className="flex items-center justify-between text-[10px] tracking-[0.16em] text-[#9a9598] uppercase">
              <span className="font-semibold text-[#d9789b]">
                0{activeIndex + 1} · Top Werk
              </span>
              <span className="truncate pl-2">{centerWork.category}</span>
            </div>
            <h3 className="font-editorial mt-0.5 truncate text-base font-semibold text-[#f2f0f1] sm:text-lg">
              {centerWork.title}
            </h3>

            <div className="mt-2.5 flex items-center gap-2">
              <button
                type="button"
                onClick={() => openModal(centerWork)}
                className="inline-flex min-h-[34px] flex-1 items-center justify-center rounded border border-white/15 px-2 py-1 text-[11px] font-medium text-[#f2f0f1] transition hover:border-white/40"
              >
                Ansehen
              </button>
              <button
                type="button"
                onClick={() => {
                  onSelectVibe(centerWork.configVibe, centerWork.title);
                  document
                    .getElementById("ideen-check")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex min-h-[34px] flex-1 items-center justify-center rounded bg-[#f2f0f1] px-2 py-1 text-[11px] font-bold text-[#050506] transition hover:bg-[#eab8c9]"
              >
                Anfragen
              </button>
            </div>
          </div>
        </article>
      </div>

      {/* Kompakte Coverflow-Steuerung (Pfeile + Indikator-Dots) */}
      <div className="mt-4 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => setActiveIndex(prevIndex)}
          aria-label="Vorheriges Tattoo"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-[#0e0e10] text-[#f2f0f1] transition hover:border-[#d9789b]"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2" role="tablist" aria-label="Werk auswählen">
          {TOP_THREE_WORKS.map((work, idx) => (
            <button
              key={work.id}
              type="button"
              role="tab"
              aria-selected={idx === activeIndex}
              aria-label={`Werk ${idx + 1}: ${work.title}`}
              onClick={() => setActiveIndex(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === activeIndex
                  ? "w-6 bg-[#d9789b]"
                  : "w-2 bg-white/25 hover:bg-white/45"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => setActiveIndex(nextIndex)}
          aria-label="Nächstes Tattoo"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-[#0e0e10] text-[#f2f0f1] transition hover:border-[#d9789b]"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Compact Native <dialog> Lightbox */}
      <dialog
        ref={dialogRef}
        closedby="any"
        aria-labelledby="gallery-dialog-title"
        className="w-full max-w-lg"
      >
        {activeWork && (
          <div className="overflow-hidden rounded-lg border border-white/15 bg-[#0e0e10] shadow-2xl">
            <div className="relative max-h-[48dvh] w-full bg-[#050506]">
              <img
                src={activeWork.image}
                alt={activeWork.title}
                fetchPriority="low"
                className="mx-auto max-h-[48dvh] w-full object-contain"
              />
              <form method="dialog" className="absolute top-3 right-3">
                <button
                  type="submit"
                  aria-label="Detailansicht schließen"
                  autoFocus
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-[#050506]/85 text-[#f2f0f1] backdrop-blur-md transition hover:border-[#d9789b]"
                >
                  <X className="h-4 w-4" />
                </button>
              </form>
            </div>
            <div className="p-5">
              <p className="text-[10px] font-semibold tracking-[0.18em] text-[#d9789b] uppercase">
                {activeWork.category} · {activeWork.placement}
              </p>
              <h1
                id="gallery-dialog-title"
                className="font-editorial mt-1 text-xl font-semibold text-[#f2f0f1]"
              >
                {activeWork.title}
              </h1>
              <p className="mt-1.5 text-xs leading-relaxed text-[#9a9598] sm:text-sm">
                {activeWork.description}
              </p>
              <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
                <button
                  type="button"
                  onClick={() => {
                    const vibe = activeWork.configVibe;
                    const title = activeWork.title;
                    dialogRef.current?.close();
                    onSelectVibe(vibe, title);
                    document
                      .getElementById("ideen-check")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="inline-flex min-h-[40px] flex-1 items-center justify-center rounded bg-[#f2f0f1] px-4 py-2 text-xs font-bold tracking-wider text-[#050506] uppercase transition hover:bg-[#eab8c9]"
                >
                  Ähnliches Motiv anfragen
                </button>
                <form method="dialog">
                  <button
                    type="submit"
                    className="inline-flex min-h-[40px] w-full items-center justify-center rounded border border-white/15 px-4 py-2 text-xs font-semibold tracking-wider text-[#f2f0f1] uppercase sm:w-auto"
                  >
                    Schließen
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </section>
  );
}
