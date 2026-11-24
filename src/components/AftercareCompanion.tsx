"use client";

import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import {
  AlertCircle,
  Ban,
  Check,
  ChevronDown,
  Clock,
  Download,
  Heart,
  Instagram,
  MessageCircle,
  QrCode,
  RefreshCw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { AFTERCARE_STEPS, STUDIO_CONFIG, TOUCHUP_INFO } from "@/config/studio";
import { LaLuBaLogo } from "./LaLuBaLogo";

const HEALING_PHASES = [
  {
    id: "day1-2",
    label: "Tag 1–2",
    title: "Folie & Erste Reinigung",
    summary:
      "Lass die Folie nach Absprache drauf (meist ca. 48 Std.). Danach vorsichtig unter lauwarmem Wasser lösen, mit milder, parfümfreier Seife reinigen und mit einem sauberen, fusselfreien Tuch sanft abtupfen — niemals rubbeln.",
    focus: "Ruhe bewahren, kein Reiben, saubere Hände vor jedem Kontakt.",
  },
  {
    id: "day3-7",
    label: "Tag 3–7",
    title: "Dünn cremen & Schutz",
    summary:
      "Crem dein Tattoo 2–3× täglich hauchdünn mit der empfohlenen Tattoo-Salbe ein. Die Haut muss weiter atmen können — weniger ist hier mehr.",
    focus: "Lockere Kleidung tragen, kein Sport mit starkem Schwitzen, kein Alkohol in den ersten 4 Tagen.",
  },
  {
    id: "week2",
    label: "Woche 2",
    title: "Jucken & Schälen (normal!)",
    summary:
      "Jetzt kann sich die oberste Hautschicht leicht pellen, spannen oder jucken. Das ist ein gutes Zeichen der Heilung — bitte auf keinen Fall kratzen oder Krusten abziehen!",
    focus: "Weiterhin dünn pflegen und Sonne, Sauna sowie Schwimmbad konsequent meiden.",
  },
  {
    id: "week3-6",
    label: "Woche 3–6",
    title: "Abheilung & TouchUp-Check",
    summary:
      "Die äußere Heilungsphase dauert meist 2–4 Wochen (je nach Stelle etwas länger). Schau dir das Ergebnis in Ruhe an — falls etwas nachgestochen werden muss, vereinbare innerhalb von 6 Wochen deinen kostenlosen TouchUp-Termin.",
    focus: "Bei Fragen oder falls ein kostenloser TouchUp nötig ist: einfach direkt schreiben.",
  },
] as const;

const DAILY_CHECKLIST = [
  "Hände vorher gründlich mit Seife gewaschen",
  "Mit lauwarmem Wasser & parfümfreier Seife gereinigt",
  "Mit frischem, fusselfreiem Tuch sanft abgetupft",
  "Hauchdünn eingecremt (Haut kann noch atmen)",
] as const;

const STEP_ICONS = [ShieldCheck, Heart, Ban, Clock] as const;
const AFTERCARE_PUBLIC_URL = "https://laluba-ink.vercel.app/aftercare";

export function AftercareCompanion() {
  const [selectedPhaseIdx, setSelectedPhaseIdx] = useState<number>(0);
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const [qrSvg, setQrSvg] = useState<string>("");

  const activePhase = HEALING_PHASES[selectedPhaseIdx];

  useEffect(() => {
    QRCode.toString(AFTERCARE_PUBLIC_URL, {
      type: "svg",
      margin: 2,
      width: 220,
      color: {
        dark: "#f2f0f1",
        light: "#0e0e10",
      },
    })
      .then((svg) => setQrSvg(svg))
      .catch(() => {});
  }, []);

  const toggleChecklist = (idx: number) => {
    setCheckedItems((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const completedCount = Object.values(checkedItems).filter(Boolean).length;

  const whatsappCareUrl = `https://wa.me/${STUDIO_CONFIG.whatsappNumber}?text=${encodeURIComponent(
    "Hey Laura! ♥ Ich habe eine kurze Frage zur Heilung / Pflege meines Tattoos."
  )}`;

  const handleDownloadQr = () => {
    if (!qrSvg) return;
    const blob = new Blob([qrSvg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "laluba-ink-aftercare-qr.svg";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#050506] text-[#f2f0f1]">
      {/* Minimal Header (bewusst ohne Hauptseiten-Navigation) */}
      <header className="border-b border-white/[0.08] bg-[#050506]/90 backdrop-blur-lg">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-5">
          <div className="flex items-center gap-2.5">
            <LaLuBaLogo compact className="h-9 w-9" />
            <div className="leading-tight">
              <span className="font-editorial block text-sm font-semibold text-[#f2f0f1]">
                LaLuBa.ink
              </span>
              <span className="block text-[10px] tracking-wider text-[#d9789b] uppercase">
                Aftercare Guide
              </span>
            </div>
          </div>

          <a
            href={whatsappCareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-8 items-center gap-1.5 rounded border border-white/15 px-3 text-[11px] font-semibold text-[#f2f0f1] transition hover:border-[#d9789b]"
          >
            <MessageCircle className="h-3.5 w-3.5 text-[#d9789b]" />
            <span>Frage an Laura</span>
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-10 px-5 py-10 md:py-14">
        {/* Hero */}
        <section className="text-center">
          <div className="mx-auto mb-4 h-24 w-24">
            <LaLuBaLogo animateDraw className="h-full w-full" />
          </div>
          <p className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[#0e0e10] px-3.5 py-1 text-[10px] font-semibold tracking-[0.2em] text-[#eab8c9] uppercase">
            <Sparkles className="h-3 w-3 text-[#d9789b]" />
            <span>Dein persönlicher Pflege-Guide</span>
          </p>
          <h1 className="font-editorial mt-4 text-3xl font-semibold text-[#f2f0f1] sm:text-4xl">
            Glückwunsch zu deinem neuen Tattoo
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-[#9a9598]">
            Gut gepflegt — für ein langes, schönes Ergebnis. Hier hast du alle
            wichtigen Schritte für die nächsten Wochen immer griffbereit.
          </p>
        </section>

        {/* Interaktiver Heilungs-Timeline-Wähler */}
        <section
          aria-labelledby="timeline-heading"
          className="noir-card rounded-2xl p-5 sm:p-6"
        >
          <div className="mb-4">
            <p className="text-[10px] font-semibold tracking-[0.2em] text-[#d9789b] uppercase">
              Heilungs-Kompass
            </p>
            <h2
              id="timeline-heading"
              className="font-editorial mt-1 text-xl font-semibold text-[#f2f0f1]"
            >
              In welcher Phase bist du gerade?
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {HEALING_PHASES.map((phase, idx) => {
              const active = idx === selectedPhaseIdx;
              return (
                <button
                  key={phase.id}
                  type="button"
                  onClick={() => setSelectedPhaseIdx(idx)}
                  className={`rounded-lg border px-3 py-2.5 text-left transition ${
                    active
                      ? "border-[#d9789b] bg-[#f2f0f1] text-[#050506]"
                      : "border-white/10 bg-[#050506] text-[#9a9598] hover:border-white/25 hover:text-[#f2f0f1]"
                  }`}
                >
                  <span className="block text-[10px] font-bold tracking-wider uppercase">
                    {phase.label}
                  </span>
                  <span className="mt-0.5 block truncate text-xs font-semibold">
                    {phase.title}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 rounded-xl border border-white/10 bg-[#050506] p-4">
            <p className="text-xs font-semibold tracking-wider text-[#eab8c9] uppercase">
              {activePhase.label} · {activePhase.title}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[#f2f0f1]">
              {activePhase.summary}
            </p>
            <p className="mt-3 border-t border-white/[0.08] pt-2.5 text-xs text-[#9a9598]">
              <strong className="text-[#d9789b]">Fokus:</strong>{" "}
              {activePhase.focus}
            </p>
          </div>
        </section>

        {/* Tägliche Pflege-Checkliste */}
        <section
          aria-labelledby="checklist-heading"
          className="noir-card rounded-2xl p-5 sm:p-6"
        >
          <div className="mb-4 flex items-center justify-between gap-2">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.2em] text-[#d9789b] uppercase">
                Tägliche Routine
              </p>
              <h2
                id="checklist-heading"
                className="font-editorial mt-0.5 text-xl font-semibold text-[#f2f0f1]"
              >
                Schnelle Pflege-Checkliste
              </h2>
            </div>
            <span className="rounded-full border border-white/15 bg-[#050506] px-3 py-1 text-xs font-semibold text-[#eab8c9]">
              {completedCount} / {DAILY_CHECKLIST.length}
            </span>
          </div>

          <div className="space-y-2">
            {DAILY_CHECKLIST.map((item, idx) => {
              const done = Boolean(checkedItems[idx]);
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleChecklist(idx)}
                  className={`flex w-full items-center gap-3 rounded-lg border px-3.5 py-3 text-left text-xs transition sm:text-sm ${
                    done
                      ? "border-[#d9789b]/50 bg-[#050506] text-[#f2f0f1]"
                      : "border-white/10 bg-[#050506] text-[#9a9598] hover:border-white/25"
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition ${
                      done
                        ? "border-[#d9789b] bg-[#d9789b] text-[#050506]"
                        : "border-white/25 bg-transparent"
                    }`}
                  >
                    {done && <Check className="h-3.5 w-3.5" />}
                  </span>
                  <span className={done ? "line-through opacity-75" : ""}>
                    {item}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Alle 4 offiziellen Pflege-Regeln (Akkordeon) */}
        <section aria-labelledby="rules-heading">
          <div className="mb-4">
            <p className="text-[10px] font-semibold tracking-[0.2em] text-[#d9789b] uppercase">
              Studio-Merkblatt
            </p>
            <h2
              id="rules-heading"
              className="font-editorial mt-0.5 text-2xl font-semibold text-[#f2f0f1]"
            >
              Alle Regeln im Überblick
            </h2>
          </div>

          <div className="aftercare-accordion space-y-2.5">
            {AFTERCARE_STEPS.map((step, idx) => {
              const Icon = STEP_ICONS[idx] ?? Heart;
              return (
                <details
                  key={step.id}
                  open={idx === 0 || idx === 2}
                  className="noir-card overflow-hidden rounded-xl"
                >
                  <summary className="flex items-center justify-between gap-3 px-4 py-3.5 text-left">
                    <span className="flex min-w-0 items-center gap-3">
                      <ChevronDown
                        aria-hidden="true"
                        className="accordion-chevron h-4 w-4 shrink-0 text-[#d9789b]"
                      />
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-white/15 bg-[#050506] text-[#d9789b]">
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[10px] font-semibold tracking-[0.18em] text-[#9a9598] uppercase">
                          {step.step} · {step.badge}
                        </span>
                        <span className="font-editorial block truncate text-base font-semibold text-[#f2f0f1]">
                          {step.title}
                        </span>
                      </span>
                    </span>
                  </summary>

                  <div className="border-t border-white/[0.08] px-4 py-3.5">
                    <ul className="space-y-2">
                      {step.points.map((pt) => (
                        <li
                          key={pt}
                          className="flex items-start gap-2.5 text-xs leading-relaxed text-[#9a9598] sm:text-sm"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-1 shrink-0 text-[10px] text-[#d9789b]"
                          >
                            ♥
                          </span>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </details>
              );
            })}
          </div>
        </section>

        {/* TouchUp & Direkt-Hilfe */}
        <section className="noir-card rounded-2xl p-5 sm:p-7">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded border border-white/15 bg-[#050506] text-[#eab8c9]">
              <RefreshCw className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[10px] font-semibold tracking-[0.2em] text-[#d9789b] uppercase">
                Nachsorge-Service
              </p>
              <h2 className="font-editorial text-xl font-semibold text-[#f2f0f1]">
                {TOUCHUP_INFO.title}
              </h2>
            </div>
          </div>

          <ul className="mt-4 space-y-2">
            {TOUCHUP_INFO.points.map((pt) => (
              <li
                key={pt}
                className="flex items-start gap-2.5 text-xs leading-relaxed text-[#9a9598] sm:text-sm"
              >
                <span aria-hidden="true" className="mt-1 text-[10px] text-[#d9789b]">
                  ♥
                </span>
                <span>{pt}</span>
              </li>
            ))}
          </ul>

          <div className="mt-5 rounded-xl border border-[#d9789b]/35 bg-[#050506] p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#d9789b]" />
              <p className="font-editorial text-xs leading-relaxed text-[#f2f0f1] italic sm:text-sm">
                „{TOUCHUP_INFO.alert}“
              </p>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              <a
                href={whatsappCareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded bg-[#f2f0f1] px-4 py-2 text-xs font-bold tracking-wider text-[#050506] uppercase transition hover:bg-[#eab8c9]"
              >
                <MessageCircle className="h-4 w-4" />
                <span>WhatsApp schreiben</span>
              </a>
              <a
                href={STUDIO_CONFIG.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded border border-white/15 px-4 py-2 text-xs font-semibold tracking-wider text-[#f2f0f1] uppercase transition hover:border-[#d9789b]"
              >
                <Instagram className="h-4 w-4 text-[#d9789b]" />
                <span>@laluba.ink</span>
              </a>
            </div>
          </div>
        </section>

        {/* Studio QR-Code zum Teilen / Ausdrucken für Laura */}
        <section className="aftercare-accordion">
          <details className="noir-card overflow-hidden rounded-xl">
            <summary className="flex items-center justify-between gap-3 px-4 py-3.5 text-left">
              <span className="flex items-center gap-3">
                <ChevronDown
                  aria-hidden="true"
                  className="accordion-chevron h-4 w-4 shrink-0 text-[#d9789b]"
                />
                <QrCode className="h-4 w-4 shrink-0 text-[#d9789b]" />
                <span className="text-xs font-semibold text-[#f2f0f1]">
                  Für Laura: Studio-QR-Code zu diesem Guide anzeigen &amp; laden
                </span>
              </span>
            </summary>

            <div className="flex flex-col items-center gap-4 border-t border-white/[0.08] p-5 text-center">
              {qrSvg && (
                <div
                  className="overflow-hidden rounded-xl border border-white/15 bg-[#0e0e10] p-2"
                  dangerouslySetInnerHTML={{ __html: qrSvg }}
                />
              )}
              <p className="max-w-sm text-xs text-[#9a9598]">
                Diesen QR-Code einfach scannen lassen oder als SVG für deine
                Pflegekärtchen speichern: <br />
                <span className="text-[#eab8c9]">{AFTERCARE_PUBLIC_URL}</span>
              </p>
              <button
                type="button"
                onClick={handleDownloadQr}
                className="inline-flex min-h-[40px] items-center gap-2 rounded border border-white/15 px-4 py-2 text-xs font-semibold text-[#f2f0f1] transition hover:border-[#d9789b]"
              >
                <Download className="h-3.5 w-3.5 text-[#d9789b]" />
                <span>QR-Code als SVG herunterladen</span>
              </button>
            </div>
          </details>
        </section>
      </main>
    </div>
  );
}
