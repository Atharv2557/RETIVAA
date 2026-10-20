"use client";

import { useEffect, useRef } from "react";

interface DustPuff {
  active: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  maxRadius: number;
  life: number;
  maxLife: number;
  colorRgb: string;
}

const MAX_PUFFS = 50;

// Authentic Thar Desert Sand & Dust Palette
const DESERT_DUST_COLORS = [
  "232, 184, 109", // Warm golden sand
  "215, 185, 142", // Sandstone #D7B98E
  "196, 98, 55",   // Terracotta dust #C46237
  "246, 239, 227", // Sunlit ivory dust #F6EFE3
  "168, 109, 69",  // Deep dune shadow dust
  "245, 210, 160", // Fine pale amber sand
];

export function SandCursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Check reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    // Check for fine pointer device
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!hasFinePointer) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let dpr = Math.min(1.5, window.devicePixelRatio || 1);
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(1.5, window.devicePixelRatio || 1);
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Pre-allocated billowing dust puff pool
    const puffs: DustPuff[] = [];
    for (let i = 0; i < MAX_PUFFS; i++) {
      puffs.push({
        active: false,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        radius: 12,
        maxRadius: 38,
        life: 0,
        maxLife: 0.8,
        colorRgb: DESERT_DUST_COLORS[0],
      });
    }

    let lastX = -1;
    let lastY = -1;
    let isMouseInWindow = false;
    let animFrameId: number | null = null;
    let lastTime = performance.now();
    let isRunning = false;

    // Spawn a billowing cloud of fine airborne desert dust
    const spawnPuff = (x: number, y: number, vx: number, vy: number) => {
      if (!Number.isFinite(x) || !Number.isFinite(y)) return;
      const safeVx = Number.isFinite(vx) ? vx : 0;
      const safeVy = Number.isFinite(vy) ? vy : 0;

      const puff = puffs.find((item) => !item.active);
      if (!puff) return;

      puff.active = true;
      puff.x = x + (Math.random() - 0.5) * 10;
      puff.y = y + (Math.random() - 0.5) * 10;

      // Drift in wind wake with slight thermal lift
      puff.vx = safeVx * 0.14 + (Math.random() - 0.5) * 0.35;
      puff.vy = safeVy * 0.14 + (Math.random() - 0.5) * 0.35 - 0.08;

      puff.radius = Math.max(6, 12 + Math.random() * 8);
      puff.maxRadius = Math.max(puff.radius + 12, 32 + Math.random() * 22); // Expands as it diffuses
      puff.life = 0;
      puff.maxLife = Math.max(0.3, 0.65 + Math.random() * 0.45); // 0.65s to 1.1s
      puff.colorRgb = DESERT_DUST_COLORS[Math.floor(Math.random() * DESERT_DUST_COLORS.length)];
    };

    // Animation Loop
    const animate = (now: number) => {
      const rawDt = (now - lastTime) / 1000;
      const dt = Number.isFinite(rawDt) ? Math.max(0, Math.min(rawDt, 0.1)) : 0.016;
      lastTime = now;

      ctx.clearRect(0, 0, width, height);

      let activeCount = 0;

      // Render Billowing Dust Cloud Haze
      for (let i = 0; i < MAX_PUFFS; i++) {
        const puff = puffs[i];
        if (!puff || !puff.active) continue;

        puff.life += dt;
        if (puff.life >= puff.maxLife) {
          puff.active = false;
          continue;
        }

        const safeMaxLife = puff.maxLife > 0 ? puff.maxLife : 0.7;
        const progress = Math.max(0, Math.min(puff.life / safeMaxLife, 1));
        const currentRadius = Math.max(
          1,
          puff.radius + (puff.maxRadius - puff.radius) * Math.sqrt(progress)
        );

        puff.x += (Number.isFinite(puff.vx) ? puff.vx : 0) * 45 * dt;
        puff.y += (Number.isFinite(puff.vy) ? puff.vy : 0) * 45 * dt;
        puff.vx *= 0.94;
        puff.vy *= 0.94;

        if (
          !Number.isFinite(puff.x) ||
          !Number.isFinite(puff.y) ||
          !Number.isFinite(currentRadius) ||
          currentRadius <= 0
        ) {
          puff.active = false;
          continue;
        }

        activeCount++;

        const alpha = Math.max(0, Math.min(Math.sin(progress * Math.PI) * 0.32, 1));
        if (alpha <= 0.005) continue;

        const grad = ctx.createRadialGradient(
          puff.x,
          puff.y,
          0,
          puff.x,
          puff.y,
          currentRadius
        );
        grad.addColorStop(0, `rgba(${puff.colorRgb}, ${(alpha * 1.1).toFixed(2)})`);
        grad.addColorStop(0.45, `rgba(${puff.colorRgb}, ${(alpha * 0.6).toFixed(2)})`);
        grad.addColorStop(0.8, `rgba(${puff.colorRgb}, ${(alpha * 0.15).toFixed(2)})`);
        grad.addColorStop(1, `rgba(${puff.colorRgb}, 0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(puff.x, puff.y, currentRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      if (activeCount > 0) {
        animFrameId = requestAnimationFrame(animate);
      } else {
        isRunning = false;
        animFrameId = null;
      }
    };

    const startLoopIfNeeded = () => {
      if (!isRunning) {
        isRunning = true;
        lastTime = performance.now();
        animFrameId = requestAnimationFrame(animate);
      }
    };

    // Mousemove Handler
    const handleMouseMove = (e: MouseEvent) => {
      if (!isMouseInWindow) {
        isMouseInWindow = true;
      }

      // Suppress when hovering over text inputs, selects, textareas, or when menu is open
      if (document.body.getAttribute("data-menu-open") === "true") {
        return;
      }

      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }

      if (lastX >= 0 && lastY >= 0) {
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        const dist = Math.hypot(dx, dy);

        if (Number.isFinite(dist) && dist > 4) {
          // Spawn continuous billowing dust along the travel vector
          const count = Math.min(Math.floor(dist / 8) + 1, 3);
          for (let i = 0; i < count; i++) {
            const ratio = (i + 1) / (count + 1);
            spawnPuff(
              lastX + dx * ratio,
              lastY + dy * ratio,
              dx,
              dy
            );
          }
        }
      }

      lastX = e.clientX;
      lastY = e.clientY;
      startLoopIfNeeded();
    };

    const handleMouseLeave = () => {
      isMouseInWindow = false;
      lastX = -1;
      lastY = -1;
    };

    const handleMouseEnter = () => {
      isMouseInWindow = true;
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (animFrameId) {
          cancelAnimationFrame(animFrameId);
          animFrameId = null;
          isRunning = false;
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (animFrameId) {
        cancelAnimationFrame(animFrameId);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
      style={{ width: "100%", height: "100%" }}
    />
  );
}
