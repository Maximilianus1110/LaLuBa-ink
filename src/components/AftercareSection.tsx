"use client";

import React, { useState } from "react";
import { AlertCircle, Ban, Clock, Heart, RefreshCw, ShieldCheck } from "lucide-react";
import { AFTERCARE_STEPS, TOUCHUP_INFO } from "@/config/studio";

const STEP_ICONS = [ShieldCheck, Heart, Ban, Clock] as const;

export function AftercareSection() {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  return (
    <section
      id="aftercare"
      className="relative mx-auto max-w-4xl px-5 py-14 md:px-8 md:py-20"
    >
      <div className="mb-10 flex flex-col gap-3 border-b border-white/[0.08] pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-2 text-[11px] font-semibold tracking-[0.24em] text-[#d9789b] uppercase">
            Aftercare &amp; TouchUp
          </p>
          <h2 className="font-editorial text-3xl font-semibold text-[#f2f0f1] sm:text-4xl">
            So pflegst du dein Tattoo richtig
          </h2>
        </div>
        <p className="max-w-md text-sm text-[#9a9598]">
          Gut gepflegt — für ein langes, schönes Ergebnis. Alle Hinweise aus
          meinem Studio-Guide kompakt zusammengefasst.
        </p>
      </div>

      {/* Mobile step tabs */}
      <div className="mb-5 flex gap-2 overflow-x-auto pb-1 md:hidden">
        {AFTERCARE_STEPS.map((step, idx) => (
          <button
            key={step.id}
            type="button"
            onClick={() => setActiveStepIndex(idx)}
            className={`shrink-0 rounded-full border px-3.5 py-1.5 text-[11px] font-semibold tracking-wider uppercase transition ${
              activeStepIndex === idx
                ? "border-[#d9789b] bg-[#f2f0f1] text-[#050506]"
                : "border-white/15 bg-[#0e0e10] text-[#9a9598]"
            }`}
          >
            {step.step} · {step.badge}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {AFTERCARE_STEPS.map((step, idx) => {
          const Icon = STEP_ICONS[idx] ?? Heart;
          const isMobileHidden = idx !== activeStepIndex;
          return (
            <article
              key={step.id}
              className={`noir-card rounded-lg p-5 sm:p-6 ${
                isMobileHidden ? "hidden md:block" : "block"
              }`}
            >
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
      <div className="noir-card mt-6 rounded-lg p-5 sm:p-7">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3 md:max-w-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded border border-white/15 bg-[#050506] text-[#eab8c9]">
                <RefreshCw className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[10px] font-semibold tracking-[0.2em] text-[#d9789b] uppercase">
                  Nachsorge
                </p>
                <h3 className="font-editorial text-2xl font-semibold text-[#f2f0f1]">
                  {TOUCHUP_INFO.title}
                </h3>
              </div>
            </div>

            <ul className="space-y-2 pt-1">
              {TOUCHUP_INFO.points.map((pt) => (
                <li
                  key={pt}
                  className="flex items-start gap-3 text-sm text-[#9a9598]"
                >
                  <span aria-hidden="true" className="mt-1 text-[10px] text-[#d9789b]">
                    ♥
                  </span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded border border-white/10 bg-[#050506] p-4 md:max-w-sm">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#d9789b]" />
              <p className="font-editorial text-sm leading-relaxed text-[#f2f0f1] italic">
                „{TOUCHUP_INFO.alert}“
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
