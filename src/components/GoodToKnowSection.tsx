"use client";

import React from "react";
import { ChevronDown, Coffee, Heart, Shirt, Sparkles, Sun } from "lucide-react";

const PREP_TIPS = [
  {
    num: "01",
    title: "Ausgeschlafen & satt",
    text: "Komm bitte nicht auf nüchternen Magen — ein stabiler Kreislauf macht die Session deutlich entspannter.",
    icon: Coffee,
  },
  {
    num: "02",
    title: "Haut & kein Alkohol",
    text: "24 Std. vorher keinen Alkohol, am Termintag die Stelle nicht einölen und keinen Sonnenbrand riskieren.",
    icon: Sun,
  },
  {
    num: "03",
    title: "Lockere Kleidung",
    text: "Zieh dir etwas Bequemes (gerne dunkel) an, damit die Stelle gut erreichbar ist und danach nichts reibt.",
    icon: Shirt,
  },
  {
    num: "04",
    title: "Ruhe & Pausen",
    text: "Kein Zeitdruck: Wir checken das Stencil gemeinsam in Ruhe und machen jederzeit Pause, wenn nötig.",
    icon: Sparkles,
  },
] as const;

const FAQ_ITEMS = [
  {
    q: "Wie läuft das mit den Preisen?",
    a: "Preise gibt es immer individuell nach Absprache. Schreib mir einfach kurz deine Idee, Stelle und ungefähre Größe auf Instagram oder WhatsApp — dann bekommst du eine faire, ehrliche Einschätzung vorab.",
  },
  {
    q: "Brauche ich schon eine komplett fertige Vorlage?",
    a: "Nein! Eine grobe Idee, ein Stichwort oder 1–2 Referenzbilder reichen völlig. Wir stimmen Details, Größe und Position zusammen ab, bis es sich 100% richtig anfühlt.",
  },
  {
    q: "Wie lange dauert ein Termin und tut es sehr weh?",
    a: "Das hängt stark von Motiv und Körperstelle ab — Rippen oder Knöchel sind spürbarer als der Unterarm. Da ich im 1:1-Termin ohne Hektik arbeite, kannst du jederzeit durchatmen.",
  },
  {
    q: "Was passiert nach dem Stechen mit der Pflege?",
    a: "Direkt nach der Session erkläre ich dir jeden Schritt in Ruhe und gebe dir meinen digitalen Aftercare-Guide als QR-Code mit — so hast du alle Tipps für die Heilung immer auf dem Handy.",
  },
] as const;

export function GoodToKnowSection() {
  return (
    <section
      id="wissen"
      aria-labelledby="wissen-heading"
      className="relative mx-auto max-w-4xl px-5 py-14 md:px-8 md:py-20"
    >
      <div className="mb-8 flex flex-col gap-2 border-b border-white/[0.08] pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-1.5 text-[11px] font-semibold tracking-[0.24em] text-[#d9789b] uppercase">
            Wissenswertes · Tipps &amp; FAQ
          </p>
          <h2
            id="wissen-heading"
            className="font-editorial text-2xl font-semibold text-[#f2f0f1] sm:text-3xl"
          >
            Gut zu wissen vor deinem Tattoo
          </h2>
        </div>
        <p className="max-w-md text-xs leading-relaxed text-[#9a9598] sm:text-sm">
          Kurz &amp; ehrlich zusammengefasst, damit dein Termin in Fürth
          entspannt und perfekt vorbereitet startet.
        </p>
      </div>

      {/* 4 Prep-Cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {PREP_TIPS.map((tip) => {
          const Icon = tip.icon;
          return (
            <article
              key={tip.num}
              className="noir-card flex items-start gap-3.5 rounded-xl p-4 sm:p-5"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded border border-white/15 bg-[#050506] text-[#d9789b]">
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[10px] font-semibold tracking-[0.18em] text-[#9a9598] uppercase">
                  Tipp {tip.num}
                </p>
                <h3 className="font-editorial mt-0.5 text-lg font-semibold text-[#f2f0f1]">
                  {tip.title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-[#9a9598]">
                  {tip.text}
                </p>
              </div>
            </article>
          );
        })}
      </div>

      {/* FAQ Accordion (Modern Web Guidance: native <details> without headings inside <summary>) */}
      <div className="mt-8">
        <p className="mb-3 flex items-center gap-2 text-[11px] font-semibold tracking-[0.2em] text-[#eab8c9] uppercase">
          <Heart className="h-3 w-3 text-[#d9789b]" />
          <span>Häufige Fragen</span>
        </p>

        <div className="aftercare-accordion space-y-2.5">
          {FAQ_ITEMS.map((item, idx) => (
            <details
              key={item.q}
              open={idx === 0}
              className="noir-card overflow-hidden rounded-xl"
            >
              <summary className="flex items-center gap-3 px-4 py-3.5 text-left">
                <ChevronDown
                  aria-hidden="true"
                  className="accordion-chevron h-4 w-4 shrink-0 text-[#d9789b]"
                />
                <span className="text-sm font-semibold text-[#f2f0f1]">
                  {item.q}
                </span>
              </summary>
              <div className="border-t border-white/[0.08] px-4 py-3.5">
                <p className="text-xs leading-relaxed text-[#9a9598] sm:text-sm">
                  {item.a}
                </p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
