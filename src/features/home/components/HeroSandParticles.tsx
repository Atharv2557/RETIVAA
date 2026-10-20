"use client";

import { useEffect, useRef } from "react";

interface HeroSandParticlesProps {
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  r: number;
  vx: number;
  phase: number;
  speed: number;
  o: number;
  color: string;
}

export function HeroSandParticles({ className = "" }: HeroSandParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let animId = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const particleCount = window.innerWidth < 768 ? 16 : 38;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    // Warm desert sand palette
    const colors = [
      "rgba(246, 239, 227,", // Sunlit ivory
      "rgba(228, 193, 152,", // Golden Thar sand
      "rgba(215, 185, 142,", // Warm sandstone
      "rgba(245, 210, 160,", // Amber dust
    ];

    const particles: Particle[] = Array.from({ length: particleCount }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.7 + Math.random() * 1.8,
      vx: 0.00012 + Math.random() * 0.00035,
      phase: Math.random() * Math.PI * 2,
      speed: 0.0004 + Math.random() * 0.001,
      o: 0.08 + Math.random() * 0.22,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    let tick = 0;
    const render = () => {
      tick += 1;
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        if (p.x > 1.05) p.x = -0.05;

        const posX = p.x * width;
        const posY = (p.y + Math.sin(tick * p.speed + p.phase) * 0.025) * height;

        ctx.beginPath();
        ctx.arc(posX, posY, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color} ${p.o})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
