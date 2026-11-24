"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface InkCanvas3DProps {
  isPaused: boolean;
}

export function InkCanvas3D({ isPaused }: InkCanvas3DProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pausedRef = useRef(isPaused);

  useEffect(() => {
    pausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      return;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / Math.max(1, container.clientHeight),
      0.1,
      100
    );
    camera.position.z = 4.2;

    // 1. Minimalist Monochrome Dark-Silk / Ink Shader
    const uniforms = {
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2(0.5, 0.5) },
      uResolution: {
        value: new THREE.Vector2(container.clientWidth, container.clientHeight),
      },
      uScroll: { value: 0 },
    };

    const shaderMaterial = new THREE.ShaderMaterial({
      uniforms,
      transparent: true,
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec2 uPointer;
        uniform vec2 uResolution;
        uniform float uScroll;
        varying vec2 vUv;

        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
        }

        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(
            mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
            mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
            u.y
          );
        }

        float fbm(vec2 p) {
          float v = 0.0;
          float a = 0.5;
          mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
          for (int i = 0; i < 4; i++) {
            v += a * noise(p);
            p = rot * p * 2.02;
            a *= 0.5;
          }
          return v;
        }

        void main() {
          vec2 st = vUv;
          float aspect = uResolution.x / max(1.0, uResolution.y);
          vec2 p = (st - 0.5) * vec2(aspect, 1.0) * 2.1;

          vec2 pointerOffset = (uPointer - 0.5) * vec2(aspect, 1.0) * 0.45;
          float t = uTime * 0.14 + uScroll * 0.35;

          vec2 q = vec2(
            fbm(p + vec2(0.0, t)),
            fbm(p + vec2(4.2, -t * 0.7))
          );

          vec2 r = vec2(
            fbm(p + 2.2 * q + vec2(1.7, 9.2) - pointerOffset + 0.1 * t),
            fbm(p + 2.2 * q + vec2(8.3, 2.8) + pointerOffset - 0.08 * t)
          );

          float f = fbm(p + 1.8 * r);

          // Pure matte black + subtle graphite silk + whisper of dusty rose
          vec3 colObsidian = vec3(0.02, 0.02, 0.024);
          vec3 colGraphite = vec3(0.085, 0.082, 0.092);
          vec3 colDustyRose = vec3(0.85, 0.47, 0.61);

          vec3 col = mix(colObsidian, colGraphite, smoothstep(0.32, 0.85, f));

          float sheen = smoothstep(0.74, 0.96, dot(r, q));
          col += colDustyRose * sheen * 0.09;

          // Subtle pointer light
          float dist = length((st - uPointer) * vec2(aspect, 1.0));
          float aura = exp(-dist * 4.2) * 0.055;
          col += vec3(0.95, 0.93, 0.94) * aura;

          float vig = smoothstep(1.3, 0.25, length((st - 0.5) * vec2(1.05, 1.0)));
          col *= vig;

          gl_FragColor = vec4(col, 0.98);
        }
      `,
    });

    const planeGeo = new THREE.PlaneGeometry(14, 10);
    const planeMesh = new THREE.Mesh(planeGeo, shaderMaterial);
    planeMesh.position.z = -1.5;
    scene.add(planeMesh);

    // 2. Subtle Sparse Micro-Sparkles (48 fine particles in silver & dusty rose)
    const particleCount = 48;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const seeds = new Float32Array(particleCount);

    const silver = new THREE.Color("#e8e4e6");
    const dustyRose = new THREE.Color("#d9789b");

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 8.5;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 6.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2.5;
      sizes[i] = Math.random() * 9 + 5;
      seeds[i] = Math.random() * Math.PI * 2;

      const palette = i % 4 === 0 ? dustyRose : silver;
      colors[i * 3] = palette.r;
      colors[i * 3 + 1] = palette.g;
      colors[i * 3 + 2] = palette.b;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    particleGeo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    particleGeo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));

    const particleMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: uniforms.uTime,
        uPixelRatio: { value: dpr },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: `
        attribute float aSize;
        attribute float aSeed;
        attribute vec3 color;
        uniform float uTime;
        uniform float uPixelRatio;
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          vColor = color;
          vec3 pos = position;
          pos.y += sin(uTime * 0.32 + aSeed) * 0.16;
          pos.x += cos(uTime * 0.25 + aSeed * 1.2) * 0.12;

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          gl_PointSize = aSize * uPixelRatio * (1.0 / max(0.8, -mvPosition.z));
          vAlpha = 0.18 + 0.28 * sin(uTime * 1.1 + aSeed);
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          vec2 uv = gl_PointCoord - 0.5;
          float core = exp(-length(uv) * 8.5);
          float alpha = clamp(core, 0.0, 1.0) * vAlpha;
          if (alpha < 0.02) discard;
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
    });

    const points = new THREE.Points(particleGeo, particleMat);
    scene.add(points);

    const targetPointer = new THREE.Vector2(0.5, 0.5);

    const onPointerMove = (e: PointerEvent) => {
      targetPointer.x = e.clientX / Math.max(1, window.innerWidth);
      targetPointer.y = 1.0 - e.clientY / Math.max(1, window.innerHeight);
    };

    const onScroll = () => {
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      uniforms.uScroll.value = window.scrollY / maxScroll;
    };

    const onResize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth;
      const h = Math.max(1, container.clientHeight);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      uniforms.uResolution.value.set(w, h);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    let rafId = 0;
    let lastTime = performance.now();

    const renderFrame = (now: number) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      if (!pausedRef.current && !prefersReduced) {
        uniforms.uTime.value += dt;
        uniforms.uPointer.value.lerp(targetPointer, 0.05);
        points.rotation.y = (uniforms.uPointer.value.x - 0.5) * 0.16;
        points.rotation.x = (uniforms.uPointer.value.y - 0.5) * -0.12;
      }

      renderer?.render(scene, camera);
      if (!prefersReduced) {
        rafId = requestAnimationFrame(renderFrame);
      }
    };

    renderer.render(scene, camera);
    if (!prefersReduced) {
      rafId = requestAnimationFrame(renderFrame);
    }

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      planeGeo.dispose();
      shaderMaterial.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer?.dispose();
      if (renderer?.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    />
  );
}
