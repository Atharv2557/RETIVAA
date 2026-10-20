"use client";

import { useSyncExternalStore, useRef, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { DesertParticles } from "./DesertParticles";

interface HeroAtmosphereProps {
  className?: string;
}

function emptySubscribe() {
  return () => {};
}

function isWebGLAvailable(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

function subscribeReducedMotion(callback: () => void) {
  const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getReducedMotionSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function subscribeResize(callback: () => void) {
  window.addEventListener("resize", callback);
  return () => window.removeEventListener("resize", callback);
}

function getIsMobileSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 768;
}

export function HeroAtmosphere({ className = "" }: HeroAtmosphereProps) {
  // Use React 19 useSyncExternalStore for hydration and external browser state
  const isClient = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    () => false
  );
  const isMobile = useSyncExternalStore(
    subscribeResize,
    getIsMobileSnapshot,
    () => false
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;

    // Pause rendering when off-screen via IntersectionObserver
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );

    observer.observe(containerRef.current);

    // Pause rendering when tab is hidden
    const handleVisibility = () => {
      if (document.hidden) {
        setIsVisible(false);
      } else if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setIsVisible(rect.bottom > 0 && rect.top < window.innerHeight);
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  if (!isClient || prefersReducedMotion || !isWebGLAvailable()) {
    // Pure fallback: static photograph renders with zero WebGL overhead
    return null;
  }

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-10 overflow-hidden ${className}`.trim()}
    >
      {isVisible && (
        <Canvas
          frameloop="always"
          gl={{
            antialias: false,
            alpha: true,
            powerPreference: "low-power",
            depth: false,
            stencil: false,
          }}
          dpr={typeof window !== "undefined" ? Math.min(1.5, window.devicePixelRatio) : 1}
          camera={{ position: [0, 0, 16], fov: 50 }}
          style={{ width: "100%", height: "100%" }}
        >
          <DesertParticles
            particleCount={isMobile ? 120 : 320}
            speedMultiplier={isMobile ? 0.75 : 1.0}
          />
        </Canvas>
      )}
    </div>
  );
}
