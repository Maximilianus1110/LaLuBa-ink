"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Expand, X } from "lucide-react";
import { TOP_THREE_WORKS, type TattooWork } from "@/config/studio";

gsap.registerPlugin(ScrollTrigger);

interface MasterpieceGalleryProps {
  onSelectVibe: (vibe: string, inspirationTitle: string) => void;
}

export function MasterpieceGallery({ onSelectVibe }: MasterpieceGalleryProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [activeWork, setActiveWork] = useState<TattooWork | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.from(".masterpiece-card", {
        scrollTrigger: {
          trigger: el,
          start: "top 82%",
          once: true,
        },
        y: 22,
        opacity: 0,
        duration: 0.65,
        stagger: 0.12,
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

  return (
    <section
      id="galerie"
      ref={sectionRef}
      className="relative mx-auto max-w-4xl px-5 py-14 md:px-8 md:py-20"
    >
      <div className="mb-8 flex flex-col gap-2 border-b border-white/[0.08] pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-1.5 text-[11px] font-semibold tracking-[0.24em] text-[#d9789b] uppercase">
            Art Gallery · Top 3
          </p>
          <h2 className="font-editorial text-2xl font-semibold text-[#f2f0f1] sm:text-3xl">
            Meine 3 schönsten &amp; größten Werke
          </h2>
        </div>
        <p className="max-w-sm text-xs leading-relaxed text-[#9a9598] sm:text-sm">
          Bewusst kuratiert auf drei Hauptwerke — den Rest siehst du direkt
          darunter über Instagram.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {TOP_THREE_WORKS.map((work, index) => (
          <article
            key={work.id}
            className="masterpiece-card noir-card group flex flex-col overflow-hidden rounded-lg"
          >
            <div className="relative h-56 w-full overflow-hidden bg-[#050506] sm:h-60">
              <img
                src={work.image}
                alt={`${work.title} — Tattoo von Laura (LaLuBa.ink)`}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <button
                type="button"
                onClick={() => openModal(work)}
                aria-label={`${work.title} groß ansehen`}
                className="absolute top-2.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-[#050506]/75 text-[#f2f0f1] backdrop-blur-md transition hover:border-[#d9789b] hover:text-[#eab8c9]"
              >
                <Expand className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="flex flex-1 flex-col justify-between p-4">
              <div>
                <div className="mb-1.5 flex items-center justify-between text-[10px] tracking-[0.14em] text-[#9a9598] uppercase">
                  <span className="text-[#d9789b]">0{index + 1}</span>
                  <span>{work.category}</span>
                </div>
                <h3 className="font-editorial text-lg font-semibold text-[#f2f0f1]">
                  {work.title}
                </h3>
                <p className="mt-1.5 line-clamp-3 text-xs leading-relaxed text-[#9a9598]">
                  {work.description}
                </p>
              </div>

              <div className="mt-4 flex items-center gap-2 border-t border-white/[0.08] pt-3">
                <button
                  type="button"
                  onClick={() => openModal(work)}
                  className="inline-flex min-h-[36px] flex-1 items-center justify-center rounded border border-white/15 px-2.5 py-1.5 text-[11px] font-medium text-[#f2f0f1] transition hover:border-white/40"
                >
                  Ansehen
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onSelectVibe(work.configVibe, work.title);
                    document
                      .getElementById("ideen-check")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="inline-flex min-h-[36px] flex-1 items-center justify-center rounded bg-[#f2f0f1] px-2.5 py-1.5 text-[11px] font-semibold text-[#050506] transition hover:bg-[#eab8c9]"
                >
                  Anfragen
                </button>
              </div>
            </div>
          </article>
        ))}
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
