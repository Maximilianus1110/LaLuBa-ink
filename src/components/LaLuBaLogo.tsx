"use client";

import React, { useEffect, useId, useRef } from "react";
import gsap from "gsap";
import { LOGO_PATHS } from "@/data/logoPaths";

interface LaLuBaLogoProps {
  className?: string;
  animateDraw?: boolean;
  compact?: boolean;
  onDrawComplete?: () => void;
}

export function LaLuBaLogo({
  className = "",
  animateDraw = false,
  compact = false,
  onDrawComplete,
}: LaLuBaLogoProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const uid = useId().replace(/:/g, "");
  const ringGradId = `ringGrad-${uid}`;
  const starGradId = `starGrad-${uid}`;
  const inkGradId = `inkGrad-${uid}`;

  useEffect(() => {
    if (!animateDraw || !svgRef.current) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      onDrawComplete?.();
      return;
    }

    const ctx = gsap.context(() => {
      const arcs = svgRef.current?.querySelectorAll<SVGPathElement>(".logo-arc");
      const stars = svgRef.current?.querySelectorAll<SVGPathElement>(".logo-star");
      const lettersOutline =
        svgRef.current?.querySelector<SVGPathElement>(".logo-letters-draw");
      const lettersFill =
        svgRef.current?.querySelector<SVGPathElement>(".logo-letters-fill");
      const shadow = svgRef.current?.querySelector<SVGPathElement>(".logo-shadow");
      const inkPath = svgRef.current?.querySelector<SVGPathElement>(".logo-ink-path");
      const subline = svgRef.current?.querySelector<SVGGElement>(".logo-subline");

      arcs?.forEach((arc) => {
        const len = arc.getTotalLength();
        gsap.set(arc, {
          strokeDasharray: len,
          strokeDashoffset: len,
        });
      });

      if (lettersOutline) {
        const len = lettersOutline.getTotalLength();
        gsap.set(lettersOutline, {
          strokeDasharray: len,
          strokeDashoffset: len,
          opacity: 1,
        });
      }

      if (inkPath) {
        const len = inkPath.getTotalLength();
        gsap.set(inkPath, {
          strokeDasharray: len,
          strokeDashoffset: len,
          fillOpacity: 0,
        });
      }

      if (lettersFill) gsap.set(lettersFill, { opacity: 0 });
      if (shadow) gsap.set(shadow, { opacity: 0, x: -3, y: -3 });
      if (stars) gsap.set(stars, { scale: 0, opacity: 0, transformOrigin: "center center" });
      if (subline) gsap.set(subline, { opacity: 0, y: 6 });

      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        onComplete: () => onDrawComplete?.(),
      });

      // 1. Äußerer gebrochener Kreis zeichnet sich
      if (arcs && arcs.length > 0) {
        tl.to(arcs, {
          strokeDashoffset: 0,
          duration: 0.95,
          stagger: 0.08,
          ease: "power2.inOut",
        });
      }

      // 2. 12-Uhr & 6-Uhr Sparkles ploppen auf
      if (stars) {
        tl.to(
          stars,
          {
            scale: 1,
            opacity: 1,
            duration: 0.45,
            stagger: 0.1,
            ease: "back.out(2)",
          },
          "-=0.4"
        );
      }

      // 3. LaLuBa-Kontur wird wie von der Nadel nachgefahren, dann Fill + 3D-Schatten
      if (lettersOutline) {
        tl.to(
          lettersOutline,
          {
            strokeDashoffset: 0,
            duration: 1.15,
            ease: "power1.inOut",
          },
          "-=0.45"
        );
      }
      if (lettersFill) {
        tl.to(
          lettersFill,
          {
            opacity: 1,
            duration: 0.45,
          },
          "-=0.35"
        );
      }
      if (shadow) {
        tl.to(
          shadow,
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 0.45,
          },
          "-=0.35"
        );
      }

      // 4. "Ink" Brush-Umriss zeichnet sich + füllt sich mit Pink
      if (inkPath) {
        tl.to(
          inkPath,
          {
            strokeDashoffset: 0,
            duration: 0.75,
            ease: "power2.inOut",
          },
          "-=0.3"
        ).to(
          inkPath,
          {
            fillOpacity: 1,
            duration: 0.35,
          },
          "-=0.2"
        );
      }

      // 5. Subline TATTOO'S ♡ BY LAURA
      if (subline) {
        tl.to(
          subline,
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
          },
          "-=0.2"
        );
      }
    }, svgRef);

    return () => ctx.revert();
  }, [animateDraw, onDrawComplete]);

  return (
    <svg
      ref={svgRef}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 500 500"
      className={className}
      role="img"
      aria-label="LaLuBa.ink — Tattoo's by Laura"
    >
      <defs>
        <linearGradient id={ringGradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e59bb6" />
          <stop offset="50%" stopColor="#c85c84" />
          <stop offset="100%" stopColor="#e59bb6" />
        </linearGradient>
        <linearGradient id={starGradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f2b5cb" />
          <stop offset="100%" stopColor="#d45d8b" />
        </linearGradient>
        <linearGradient id={inkGradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#eab8c9" />
          <stop offset="50%" stopColor="#d96b96" />
          <stop offset="100%" stopColor="#c44d7b" />
        </linearGradient>
      </defs>

      {/* Äußerer gebrochener Kreisring */}
      <g
        fill="none"
        stroke={`url(#${ringGradId})`}
        strokeWidth={compact ? "6.5" : "4.2"}
        strokeLinecap="round"
      >
        {LOGO_PATHS.arcs.map((d, i) => (
          <path key={i} className="logo-arc" d={d} />
        ))}
      </g>

      {/* 12-Uhr & 6-Uhr Sparkle-Sterne */}
      <path
        className="logo-star"
        d={LOGO_PATHS.starTop}
        fill={`url(#${starGradId})`}
        stroke="#14090e"
        strokeWidth="2.2"
      />
      <path
        className="logo-star"
        d={LOGO_PATHS.starBottom}
        fill={`url(#${starGradId})`}
        stroke="#14090e"
        strokeWidth="2.2"
      />

      {/* LaLuBa Pink 3D-Schatten */}
      <path
        className="logo-shadow"
        d={LOGO_PATHS.shadow}
        fill="#b8537a"
        fillRule="evenodd"
        stroke="#14090e"
        strokeWidth="1.2"
      />

      {/* LaLuBa Weiße Blackletter-Kontur (Fill + Nadel-Draw-Stroke) */}
      <path
        className="logo-letters-fill"
        d={LOGO_PATHS.letters}
        fill="#f5f1f4"
        fillRule="evenodd"
      />
      <path
        className="logo-letters-draw"
        d={LOGO_PATHS.letters}
        fill="none"
        stroke={animateDraw ? "#e59bb6" : "#14090e"}
        strokeWidth={animateDraw ? "1.6" : "1.4"}
        strokeOpacity={animateDraw ? "0.9" : "1"}
      />

      {/* Ink Brush Script */}
      <path
        className="logo-ink-path"
        d={LOGO_PATHS.ink}
        fill={`url(#${inkGradId})`}
        fillRule="evenodd"
        stroke="#e59bb6"
        strokeWidth={animateDraw ? "1.4" : "1"}
        strokeOpacity={animateDraw ? "0.95" : "0.35"}
      />

      {/* Subline TATTOO'S ♡ BY LAURA */}
      <g
        className="logo-subline"
        fill="#e5dce0"
        fontFamily="var(--font-sans), ui-sans-serif, sans-serif"
        fontWeight="700"
        textAnchor="middle"
      >
        <text x="250" y="369" fontSize="9.5" letterSpacing="3.8">
          TATTOO&apos;S
        </text>
        <line
          x1="186"
          y1="379"
          x2="238"
          y2="379"
          stroke="#d9789b"
          strokeWidth="1.2"
          strokeOpacity="0.85"
        />
        <line
          x1="262"
          y1="379"
          x2="314"
          y2="379"
          stroke="#d9789b"
          strokeWidth="1.2"
          strokeOpacity="0.85"
        />
        <path
          d={LOGO_PATHS.heart}
          fill="none"
          stroke="#d9789b"
          strokeWidth="1.4"
        />
        <text
          x="250"
          y="396"
          fontSize="8.5"
          letterSpacing="3.5"
          fill="#cbbdc3"
        >
          BY LAURA
        </text>
      </g>
    </svg>
  );
}
