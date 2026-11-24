"use client";

import React from "react";
import { AlertCircle, Ban, ChevronDown, Clock, Heart, RefreshCw, ShieldCheck } from "lucide-react";
import { AFTERCARE_STEPS, TOUCHUP_INFO } from "@/config/studio";

const STEP_ICONS = [ShieldCheck, Heart, Ban, Clock] as const;

export function AftercareSection() {
  return (
    <section
      id="aftercare"
      aria-labelledby="aftercare-heading"
      className="relative mx-auto max-w-4xl px-5 py-14 md:px-8 md:py-20"
    >
      <div className="mb-8 flex flex-col gap-2 border-b border-white/[0.08] pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-1.5 text-[11px] font-semibold tracking-[0.24em] text-[#d9789b] uppercase">
            Aftercare &amp; TouchUp
          </p>
          <h2
            id="aftercare-heading"
            className="font-editorial text-2xl font-semibold text-[#f2f0f1] sm:text-3xl"
          >
            So pflegst du dein Tattoo richtig
          </h2>
        </div>
        <p className="max-w-md text-xs leading-relaxed text-[#9a9598] sm:text-sm">
          Gut gepflegt — für ein langes, schönes Ergebnis. Alle Hinweise
          kompakt zum Aufklappen.
        </p>
      </div>

      {/* Mobile: Intuitives vertikales <details>-Akkordeon ohne horizontale Breite (Modern Web Guidance: accordion) */}
      <div className="aftercare-accordion space-y-2.5 md:hidden">
        {AFTERCARE_STEPS.map((step, idx) => {
          const Icon = STEP_ICONS[idx] ?? Heart;
          return (
            <details
              key={step.id}
              open={idx === 0}
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
                      Schritt {step.step}
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
                      className="flex items-start gap-2.5 text-xs leading-relaxed text-[#9a9598]"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-0.5 shrink-0 text-[10px] text-[#d9789b]"
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

      {/* Desktop: Übersichtliches 2x2-Raster */}
      <div className="hidden gap-4 md:grid md:grid-cols-2">
        {AFTERCARE_STEPS.map((step, idx) => {
          const Icon = STEP_ICONS[idx] ?? Heart;
          return (
            <article key={step.id} className="noir-card rounded-lg p-6">
              <div className="mb-4 flex items-center gap-3.5 border-b border-white/[0.08] pb-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-white/15 bg-[#050506] text-[#d9789b]">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-[10px] font-semibold tracking-[0.2em] text-[#9a9598] uppercase">
                    {step.step} · {step.badge}
                  </span>
                  <h3 className="font-editorial text-xl font-semibold text-[#f2f0f1]">
                    {step.title}
                  </h3>
                </div>
              </div>

              <ul className="space-y-2.5">
                {step.points.map((pt) => (
                  <li
                    key={pt}
                    className="flex items-start gap-3 text-sm leading-relaxed text-[#9a9598]"
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
            </article>
          );
        })}
      </div>

      {/* TouchUp Card */}
      <div className="noir-card mt-5 rounded-xl p-5 sm:p-7">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3 md:max-w-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded border border-white/15 bg-[#050506] text-[#eab8c9]">
                <RefreshCw className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[10px] font-semibold tracking-[0.2em] text-[#d9789b] uppercase">
                  Nachsorge
                </p>
                <h3 className="font-editorial text-xl font-semibold text-[#f2f0f1]">
                  {TOUCHUP_INFO.title}
                </h3>
              </div>
            </div>

            <ul className="space-y-2 pt-1">
              {TOUCHUP_INFO.points.map((pt) => (
                <li
                  key={pt}
                  className="flex items-start gap-2.5 text-xs leading-relaxed text-[#9a9598] sm:text-sm"
                >
                  <span
                    aria-hidden="true"
                    className="mt-0.5 text-[10px] text-[#d9789b]"
                  >
                    ♥
                  </span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-white/10 bg-[#050506] p-4 md:max-w-sm">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#d9789b]" />
              <p className="font-editorial text-xs leading-relaxed text-[#f2f0f1] italic sm:text-sm">
                „{TOUCHUP_INFO.alert}“
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
