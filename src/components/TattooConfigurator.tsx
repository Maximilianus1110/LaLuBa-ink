"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  ChevronDown,
  Copy,
  ImagePlus,
  Instagram,
  MessageCircle,
  Share2,
  Trash2,
} from "lucide-react";
import { STUDIO_CONFIG } from "@/config/studio";

const VIBE_OPTIONS = [
  "Fine-Line & Script",
  "Illustrativ / Character",
  "Red Ink / Micro",
  "Partner-Tattoo",
  "Wannado-Inspiration",
] as const;

const PLACEMENT_OPTIONS = [
  "Unterarm",
  "Oberschenkel",
  "Rippen / Seite",
  "Handgelenk / Knöchel",
  "Rücken / Nacken",
  "Noch offen",
] as const;

interface TattooConfiguratorProps {
  preselectedVibe: string | null;
  preselectedInspiration: string | null;
  expandSignal: number;
}

export function TattooConfigurator({
  preselectedVibe,
  preselectedInspiration,
  expandSignal,
}: TattooConfiguratorProps) {
  const [isConfiguratorOpen, setIsConfiguratorOpen] = useState<boolean>(false);
  const [vibe, setVibe] = useState<string>("Fine-Line & Script");
  const [placement, setPlacement] = useState<string>("Unterarm");
  const [sizeCm, setSizeCm] = useState<number>(8);
  const [ideaText, setIdeaText] = useState<string>("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [canShareFiles, setCanShareFiles] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (expandSignal > 0) {
      setIsConfiguratorOpen(true);
    }
  }, [expandSignal]);

  useEffect(() => {
    if (preselectedVibe) setVibe(preselectedVibe);
    if (preselectedInspiration) {
      setIdeaText(`Inspiration: „${preselectedInspiration}“`);
    }
  }, [preselectedVibe, preselectedInspiration]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    const nextUrl = URL.createObjectURL(file);
    setUploadedFile(file);
    setPreviewUrl(nextUrl);

    if (
      typeof navigator !== "undefined" &&
      "canShare" in navigator &&
      navigator.canShare({ files: [file] })
    ) {
      setCanShareFiles(true);
    } else {
      setCanShareFiles(false);
    }
  };

  const removeImage = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setUploadedFile(null);
    setPreviewUrl(null);
    setCanShareFiles(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const sizeLabel = useMemo(() => {
    if (sizeCm <= 5) return `Mini (${sizeCm} cm)`;
    if (sizeCm <= 12) return `Medium (ca. ${sizeCm} cm)`;
    return `Statement (ca. ${sizeCm}+ cm)`;
  }, [sizeCm]);

  const generatedMessage = useMemo(() => {
    const ideaLine = ideaText.trim() ? `\nIdee: ${ideaText.trim()}` : "";
    const imageLine = uploadedFile
      ? `\nReferenzbild (${uploadedFile.name}) schicke ich direkt im Chat mit.`
      : "";

    return `Hey Laura! Ich hätte Interesse an einem Tattoo in Fürth:\n• Stil: ${vibe}\n• Stelle: ${placement}\n• Größe: ${sizeLabel}${ideaLine}${imageLine}\n\nLass uns gerne wegen Preis & Termin schreiben.`;
  }, [vibe, placement, sizeLabel, ideaText, uploadedFile]);

  const whatsappUrl = `https://wa.me/${STUDIO_CONFIG.whatsappNumber}?text=${encodeURIComponent(
    generatedMessage
  )}`;

  const quickWhatsappUrl = `https://wa.me/${STUDIO_CONFIG.whatsappNumber}?text=${encodeURIComponent(
    "Hey Laura! Ich möchte gerne ein Tattoo bei dir in Fürth anfragen."
  )}`;

  const handleCopyAndOpenInsta = async () => {
    try {
      await navigator.clipboard.writeText(generatedMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // ignore
    }
    window.open(STUDIO_CONFIG.instagramUrl, "_blank", "noopener,noreferrer");
  };

  const handleCopyOnly = async () => {
    try {
      await navigator.clipboard.writeText(generatedMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2600);
    } catch {
      // ignore
    }
  };

  const handleNativeShareWithImage = async () => {
    if (!uploadedFile || !navigator.share) return;
    try {
      await navigator.share({
        title: "Tattoo-Idee für LaLuBa.ink",
        text: generatedMessage,
        files: [uploadedFile],
      });
    } catch {
      // cancelled
    }
  };

  return (
    <section
      id="ideen-check"
      className="relative mx-auto max-w-2xl px-5 py-12 md:px-8 md:py-16"
    >
      {/* Kompakte, sofort überblickbare Kontakt-Box */}
      <div className="noir-card rounded-2xl p-5 sm:p-7">
        <div className="text-center">
          <p className="text-[11px] font-semibold tracking-[0.22em] text-[#d9789b] uppercase">
            Kontakt &amp; Termin
          </p>
          <h2 className="font-editorial mt-1.5 text-2xl font-semibold text-[#f2f0f1] sm:text-3xl">
            Schreib mir direkt
          </h2>
          <p className="mt-2 text-xs text-[#9a9598] sm:text-sm">
            Fürth bei Nürnberg ·{" "}
            <span className="text-[#eab8c9]">{STUDIO_CONFIG.pricingNote}</span>
          </p>
        </div>

        {/* 2 sofort sichtbare 1-Tap Kontakt-Buttons */}
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <a
            href={STUDIO_CONFIG.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-[52px] items-center justify-between rounded-lg border border-white/15 bg-[#050506] px-4 py-3 transition hover:border-[#d9789b]"
          >
            <div className="flex items-center gap-3">
              <Instagram className="h-4 w-4 text-[#d9789b]" />
              <div className="text-left">
                <p className="text-xs font-bold text-[#f2f0f1]">Instagram DM</p>
                <p className="text-[11px] text-[#9a9598]">@laluba.ink</p>
              </div>
            </div>
            <span className="text-xs text-[#eab8c9]">→</span>
          </a>

          <a
            href={quickWhatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-[52px] items-center justify-between rounded-lg border border-white/15 bg-[#050506] px-4 py-3 transition hover:border-white/40"
          >
            <div className="flex items-center gap-3">
              <MessageCircle className="h-4 w-4 text-[#f2f0f1]" />
              <div className="text-left">
                <p className="text-xs font-bold text-[#f2f0f1]">WhatsApp</p>
                <p className="text-[11px] text-[#9a9598]">Direkter Chat</p>
              </div>
            </div>
            <span className="text-xs text-[#f2f0f1]">→</span>
          </a>
        </div>

        {/* Toggle für optionalen 3-Tap Ideen-Konfigurator */}
        <div className="mt-5 border-t border-white/[0.08] pt-4">
          <button
            type="button"
            aria-expanded={isConfiguratorOpen}
            onClick={() => setIsConfiguratorOpen((prev) => !prev)}
            className="flex w-full items-center justify-between rounded-lg border border-white/10 bg-[#050506] px-4 py-2.5 text-left text-xs font-medium text-[#9a9598] transition hover:border-white/25 hover:text-[#f2f0f1]"
          >
            <span>
              <strong className="text-[#eab8c9]">Optional:</strong> 3-Tap
              Ideen-Konfigurator &amp; Referenzbild-Upload
            </span>
            <ChevronDown
              className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                isConfiguratorOpen ? "rotate-180 text-[#d9789b]" : ""
              }`}
            />
          </button>

          {isConfiguratorOpen && (
            <div className="mt-4 space-y-5 border-t border-white/[0.06] pt-4">
              {/* 1. Stil */}
              <div>
                <p className="mb-2 text-[10px] font-semibold tracking-[0.18em] text-[#9a9598] uppercase">
                  01 · Stil
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {VIBE_OPTIONS.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setVibe(item)}
                      className={`rounded-full border px-3 py-1 text-[11px] font-medium transition ${
                        vibe === item
                          ? "border-[#d9789b] bg-[#f2f0f1] text-[#050506]"
                          : "border-white/15 bg-[#050506] text-[#9a9598] hover:text-[#f2f0f1]"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Stelle & Größe */}
              <div className="space-y-3">
                <p className="text-[10px] font-semibold tracking-[0.18em] text-[#9a9598] uppercase">
                  02 · Stelle &amp; Größe
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {PLACEMENT_OPTIONS.map((spot) => (
                    <button
                      key={spot}
                      type="button"
                      onClick={() => setPlacement(spot)}
                      className={`rounded-full border px-3 py-1 text-[11px] font-medium transition ${
                        placement === spot
                          ? "border-[#d9789b] bg-[#f2f0f1] text-[#050506]"
                          : "border-white/15 bg-[#050506] text-[#9a9598] hover:text-[#f2f0f1]"
                      }`}
                    >
                      {spot}
                    </button>
                  ))}
                </div>

                <div className="rounded border border-white/10 bg-[#050506] px-3.5 py-2.5">
                  <div className="mb-1.5 flex items-center justify-between text-[11px]">
                    <label htmlFor="tattoo-size-slider" className="text-[#9a9598]">
                      Größe
                    </label>
                    <span className="font-semibold text-[#eab8c9]">
                      {sizeLabel}
                    </span>
                  </div>
                  <input
                    id="tattoo-size-slider"
                    type="range"
                    min={2}
                    max={25}
                    value={sizeCm}
                    onChange={(e) => setSizeCm(Number(e.target.value))}
                    className="noir-slider w-full"
                  />
                </div>
              </div>

              {/* 3. Idee & optionaler Upload */}
              <div className="space-y-2.5">
                <p className="text-[10px] font-semibold tracking-[0.18em] text-[#9a9598] uppercase">
                  03 · Idee &amp; Bild (kein Muss)
                </p>
                <textarea
                  rows={2}
                  value={ideaText}
                  onChange={(e) => setIdeaText(e.target.value)}
                  placeholder="Optional: Kurz deine Idee beschreiben…"
                  aria-label="Kurze Beschreibung deiner Tattoo-Idee"
                  className="w-full rounded border border-white/15 bg-[#050506] px-3 py-2 text-xs text-[#f2f0f1] placeholder:text-[#9a9598]/50 focus:border-[#d9789b] focus:outline-none"
                />

                <div className="flex flex-wrap items-center justify-between gap-2 rounded border border-dashed border-white/15 bg-[#050506] px-3 py-2">
                  <div className="flex items-center gap-2 text-[11px] text-[#9a9598]">
                    <ImagePlus className="h-3.5 w-3.5 text-[#d9789b]" />
                    <span>Referenzbild anhängen (optional)</span>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="sr-only"
                    id="reference-image-upload"
                  />
                  <label
                    htmlFor="reference-image-upload"
                    className="cursor-pointer rounded border border-white/15 px-2.5 py-1 text-[11px] font-medium text-[#f2f0f1] hover:border-[#d9789b]"
                  >
                    {uploadedFile ? "Ändern" : "Wählen"}
                  </label>
                </div>

                {previewUrl && uploadedFile && (
                  <div className="flex items-center justify-between gap-2 rounded border border-white/10 bg-[#050506] p-2">
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <img
                        src={previewUrl}
                        alt="Ausgewähltes Referenzbild"
                        className="h-10 w-10 shrink-0 rounded object-cover"
                      />
                      <p className="truncate text-[11px] text-[#f2f0f1]">
                        {uploadedFile.name}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={removeImage}
                      aria-label="Referenzbild entfernen"
                      className="p-1 text-[#9a9598] hover:text-[#f2f0f1]"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Vorschau & Senden */}
              <div className="rounded border border-white/10 bg-[#050506] p-3.5">
                <div className="mb-2 flex items-center justify-between text-[10px] uppercase">
                  <span className="tracking-wider text-[#9a9598]">Vorschau</span>
                  <button
                    type="button"
                    onClick={handleCopyOnly}
                    className="inline-flex items-center gap-1 text-[#9a9598] hover:text-[#f2f0f1]"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3 w-3 text-[#d9789b]" />
                        <span>Kopiert</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>Kopieren</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs leading-relaxed whitespace-pre-line text-[#f2f0f1]">
                  {generatedMessage}
                </p>

                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-[40px] items-center justify-center gap-1.5 rounded bg-[#f2f0f1] px-3 py-2 text-[11px] font-bold tracking-wider text-[#050506] uppercase transition hover:bg-[#eab8c9]"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    <span>Per WhatsApp</span>
                  </a>
                  <button
                    type="button"
                    onClick={handleCopyAndOpenInsta}
                    className="flex min-h-[40px] items-center justify-center gap-1.5 rounded border border-white/20 px-3 py-2 text-[11px] font-semibold tracking-wider text-[#f2f0f1] uppercase transition hover:border-[#d9789b]"
                  >
                    <Instagram className="h-3.5 w-3.5 text-[#d9789b]" />
                    <span>Kopieren &amp; Insta</span>
                  </button>
                </div>

                {canShareFiles && uploadedFile && (
                  <button
                    type="button"
                    onClick={handleNativeShareWithImage}
                    className="mt-2 flex min-h-[38px] w-full items-center justify-center gap-1.5 rounded border border-white/15 px-3 py-1.5 text-[11px] text-[#eab8c9]"
                  >
                    <Share2 className="h-3.5 w-3.5" />
                    <span>Text &amp; Bild teilen</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
