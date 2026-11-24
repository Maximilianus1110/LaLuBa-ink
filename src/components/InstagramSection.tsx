"use client";

import React, { useEffect, useRef, useState } from "react";
import { ExternalLink, Instagram, X } from "lucide-react";
import { STUDIO_CONFIG } from "@/config/studio";
import { LaLuBaLogo } from "./LaLuBaLogo";
import type { SyncedInstaPost } from "@/app/api/instagram/route";

const INITIAL_SIX_POSTS: SyncedInstaPost[] = [
  {
    id: "napoli-1926",
    title: "1926 NAPOLI",
    caption: "Klassisches Serif-Lettering sauber ausgefüllt auf dem Oberschenkel.",
    image: "/portfolio/napoli_1926.png",
    permalink: STUDIO_CONFIG.instagramUrl,
    tag: "Lettering",
    vibe: "Fine-Line & Script",
  },
  {
    id: "red-ink-liebe",
    title: "Red Ink — حب (Liebe)",
    caption: "Zartes arabisches Schriftzeichen in leuchtender Red Ink.",
    image: "/portfolio/red_ink_liebe.png",
    permalink: STUDIO_CONFIG.instagramUrl,
    tag: "Red Ink",
    vibe: "Red Ink / Micro",
  },
  {
    id: "process-foam",
    title: "Behind the Needle — 449",
    caption: "Einblick aus dem Studio in Fürth — sauberes Arbeiten & Wohlfühl-Vibe.",
    image: "/portfolio/process_foam.png",
    permalink: STUDIO_CONFIG.instagramUrl,
    tag: "Studio",
    vibe: "Fine-Line & Script",
  },
  {
    id: "script-ribs",
    title: "Vertical Rib Script",
    caption: "Langes, filigranes Rippen-Lettering entlang der Körperlinie.",
    image: "/portfolio/script_ribs.png",
    permalink: STUDIO_CONFIG.instagramUrl,
    tag: "Fine-Line",
    vibe: "Fine-Line & Script",
  },
  {
    id: "la-vida-es-prestada",
    title: "La Vida Es Prestada",
    caption: "Fließende Calligraffiti-Linien auf dem Oberschenkel.",
    image: "/portfolio/la_vida_es_prestada.png",
    permalink: STUDIO_CONFIG.instagramUrl,
    tag: "Script",
    vibe: "Fine-Line & Script",
  },
  {
    id: "smile-face",
    title: "SMILE Sketch",
    caption: "Roher Brush-Smiley direkt vom Stencil unter die Haut gebracht.",
    image: "/portfolio/smile_face.png",
    permalink: STUDIO_CONFIG.instagramUrl,
    tag: "Sketch",
    vibe: "Illustrativ / Character",
  },
];

interface InstagramSectionProps {
  onSelectInspiration: (vibe: string, inspirationTitle: string) => void;
}

export function InstagramSection({
  onSelectInspiration,
}: InstagramSectionProps) {
  const [posts, setPosts] = useState<SyncedInstaPost[]>(INITIAL_SIX_POSTS);
  const [isSyncedLive, setIsSyncedLive] = useState<boolean>(false);
  const [selectedPost, setSelectedPost] = useState<SyncedInstaPost | null>(
    null
  );
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  // Synchronisiere die aktuellsten 6 Beiträge von /api/instagram
  useEffect(() => {
    let active = true;
    fetch("/api/instagram")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!active || !data?.posts?.length) return;
        setPosts(data.posts.slice(0, 6));
        setIsSyncedLive(Boolean(data.synced));
      })
      .catch(() => {
        // Fallback bleibt INITIAL_SIX_POSTS
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const onClose = () => {
      dialog.returnValue = "";
      setSelectedPost(null);
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

  const openPost = (post: SyncedInstaPost) => {
    setSelectedPost(post);
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) {
      dialog.showModal();
    }
  };

  return (
    <section
      id="instagram"
      className="relative mx-auto max-w-4xl px-5 py-12 md:px-8 md:py-16"
    >
      {/* Kompakte Instagram-Karte im Stil von design/insta-einbindung.png (Dark Noir) */}
      <div className="mx-auto max-w-xl rounded-2xl border border-white/10 bg-[#0e0e10] p-4 shadow-xl sm:p-6">
        {/* Top Profile Row */}
        <div className="flex items-center justify-between gap-3 pb-4">
          <div className="flex items-center gap-3.5">
            <div className="relative h-14 w-14 shrink-0 rounded-full border border-[#d9789b]/50 bg-[#050506] p-0.5">
              <LaLuBaLogo compact className="h-full w-full" />
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full border border-[#0e0e10] bg-[#d9789b] px-1.5 py-px text-[9px] font-bold tracking-wider text-[#050506] uppercase">
                {isSyncedLive ? "Sync" : "Neu"}
              </span>
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-sm font-bold text-[#f2f0f1] sm:text-base">
                laluba.ink
              </h2>
              <p className="truncate text-xs text-[#9a9598]">
                Tattoo Artist · Fürth / Nürnberg
              </p>
            </div>
          </div>

          <a
            href={STUDIO_CONFIG.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 shrink-0 items-center justify-center rounded-full bg-[#f2f0f1] px-4 text-xs font-bold text-[#050506] transition hover:bg-[#eab8c9]"
          >
            Folgen
          </a>
        </div>

        {/* Hairline Divider */}
        <div className="border-t border-white/[0.08] pt-4">
          {/* Kompaktes 3x2 Grid der letzten 6 Beiträge */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
            {posts.slice(0, 6).map((post) => (
              <button
                key={post.id}
                type="button"
                onClick={() => openPost(post)}
                className="group relative aspect-square overflow-hidden rounded-lg border border-white/10 bg-[#050506] transition hover:border-[#d9789b]/55 focus-visible:ring-1 focus-visible:ring-[#d9789b] focus-visible:outline-none"
              >
                <img
                  src={post.image}
                  alt={post.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/25" />
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Caption */}
        <p className="mt-4 text-center text-xs leading-relaxed text-[#9a9598]">
          Folge{" "}
          <a
            href={STUDIO_CONFIG.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#f2f0f1] underline decoration-[#d9789b]/60 underline-offset-4 hover:text-[#eab8c9]"
          >
            @laluba.ink
          </a>{" "}
          auf Instagram, um die neuesten Tattoos, Flash-Motive &amp;
          Terminfenster nicht zu verpassen.
        </p>
      </div>

      {/* Native <dialog> for Post Detail */}
      <dialog
        ref={dialogRef}
        closedby="any"
        aria-labelledby="insta-dialog-title"
        className="w-full max-w-md"
      >
        {selectedPost && (
          <div className="overflow-hidden rounded-lg border border-white/15 bg-[#0e0e10] shadow-2xl">
            <div className="relative max-h-[46dvh] w-full bg-[#050506]">
              <img
                src={selectedPost.image}
                alt={selectedPost.title}
                fetchPriority="low"
                className="mx-auto max-h-[46dvh] w-full object-contain"
              />
              <form method="dialog" className="absolute top-3 right-3">
                <button
                  type="submit"
                  aria-label="Beitrag schließen"
                  autoFocus
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-[#050506]/85 text-[#f2f0f1] backdrop-blur-md transition hover:border-[#d9789b]"
                >
                  <X className="h-4 w-4" />
                </button>
              </form>
            </div>

            <div className="p-5">
              <span className="text-[10px] font-semibold tracking-[0.18em] text-[#d9789b] uppercase">
                @laluba.ink · {selectedPost.tag}
              </span>
              <h1
                id="insta-dialog-title"
                className="font-editorial mt-1 text-xl font-semibold text-[#f2f0f1]"
              >
                {selectedPost.title}
              </h1>
              <p className="mt-1.5 text-xs leading-relaxed text-[#9a9598] sm:text-sm">
                {selectedPost.caption}
              </p>

              <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
                <button
                  type="button"
                  onClick={() => {
                    const vibe = selectedPost.vibe;
                    const title = selectedPost.title;
                    dialogRef.current?.close();
                    onSelectInspiration(vibe, title);
                    document
                      .getElementById("ideen-check")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="inline-flex min-h-[40px] flex-1 items-center justify-center rounded bg-[#f2f0f1] px-4 py-2 text-xs font-bold tracking-wider text-[#050506] uppercase transition hover:bg-[#eab8c9]"
                >
                  Als Inspiration anfragen
                </button>
                <a
                  href={selectedPost.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded border border-white/15 px-4 py-2 text-xs font-semibold tracking-wider text-[#f2f0f1] uppercase"
                >
                  <Instagram className="h-3.5 w-3.5 text-[#d9789b]" />
                  <span>Instagram</span>
                  <ExternalLink className="h-3 w-3 opacity-60" />
                </a>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </section>
  );
}
