"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Compass } from "lucide-react";
import { useLenis } from "lenis/react";

export function ScrollCamelBar() {
  const [percentDisplay, setPercentDisplay] = useState(0);
  const [isOverDark, setIsOverDark] = useState(true);

  // References for direct 60/120fps DOM animation (bypassing React re-renders for fluid smoothness)
  const barRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const trackActiveRef = useRef<HTMLDivElement>(null);
  const camelRef = useRef<HTMLDivElement>(null);
  const camelFlipRef = useRef<HTMLDivElement>(null);
  const dustRef = useRef<HTMLDivElement>(null);
  const percentTextRef = useRef<HTMLSpanElement>(null);

  // SVG limb and body part refs for smooth kinematic gait
  const legFNRef = useRef<SVGGElement>(null);
  const legFFRef = useRef<SVGGElement>(null);
  const legBNRef = useRef<SVGGElement>(null);
  const legBFRef = useRef<SVGGElement>(null);
  const bodyRef = useRef<SVGGElement>(null);

  // Animation & Physics state (held in refs for instantaneous frame updates)
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const prevProgressRef = useRef(0);
  const walkPhaseRef = useRef(0);
  const strideIntensityRef = useRef(0);
  const smoothVelocityRef = useRef(0);
  const directionRef = useRef<"forward" | "backward">("forward");
  const consecutiveDirRef = useRef(0);
  const lastSampleTimeRef = useRef(0);

  // Obtain Lenis instance to drive progress & smooth scrub
  const lenis = useLenis((lenisInstance) => {
    targetProgressRef.current = lenisInstance.progress;
  });

  // Fallback scroll handler if Lenis is initializing or on non-Lenis scroll events
  const handleNativeScroll = useCallback(() => {
    if (!lenis) {
      const currentY = window.scrollY;
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      targetProgressRef.current = Math.min(Math.max(currentY / maxScroll, 0), 1);
    }
  }, [lenis]);

  // Click on track to smoothly scrub to destination via Lenis
  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    const maxScroll = Math.max(
      1,
      document.documentElement.scrollHeight - window.innerHeight
    );
    const targetY = percentage * maxScroll;

    if (lenis) {
      lenis.scrollTo(targetY, { duration: 1.2 });
    } else {
      window.scrollTo({
        top: targetY,
        behavior: "smooth",
      });
    }
  };

  // Sample contrast under the current camel position (throttled)
  const sampleContrast = useCallback(() => {
    if (typeof window === "undefined") return;
    const camelScreenX = Math.max(
      24,
      Math.min(
        window.innerWidth - 24,
        currentProgressRef.current * window.innerWidth
      )
    );
    const sampleY = Math.max(10, window.innerHeight - 30);

    const targetEl = document.elementFromPoint(camelScreenX, sampleY);
    if (!targetEl) return;

    let curr: HTMLElement | null = targetEl as HTMLElement;
    let foundBg = "";
    while (curr && curr !== document.documentElement) {
      const bg = window.getComputedStyle(curr).backgroundColor;
      if (
        bg &&
        bg !== "transparent" &&
        bg !== "rgba(0, 0, 0, 0)" &&
        !bg.startsWith("rgba(0, 0, 0, 0")
      ) {
        foundBg = bg;
        break;
      }
      curr = curr.parentElement;
    }

    if (!foundBg) {
      foundBg = window.getComputedStyle(document.body).backgroundColor;
    }

    const rgbMatch = foundBg.match(/\d+/g);
    if (rgbMatch && rgbMatch.length >= 3) {
      const r = parseInt(rgbMatch[0], 10);
      const g = parseInt(rgbMatch[1], 10);
      const b = parseInt(rgbMatch[2], 10);
      const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      setIsOverDark(luminance < 140);
    } else {
      const darkSection = targetEl.closest(
        "[data-testid='hero-section'], footer, [data-theme='dark']"
      );
      setIsOverDark(!!darkSection);
    }
  }, []);

  // Main 60/120fps Kinematic Animation Loop (Smooth Lerp + Organic Gait Physics)
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const dt = Math.min(50, currentTime - lastTime) / 1000;
      lastTime = currentTime;

      // 1. Exponential smoothing (lerp) on position: never sudden or jagged
      const diff = targetProgressRef.current - currentProgressRef.current;
      currentProgressRef.current += diff * 0.12;

      const progress = currentProgressRef.current;
      const progressDelta = progress - prevProgressRef.current;
      prevProgressRef.current = progress;

      // 2. Continuous velocity estimation & smooth damping
      const rawVelocity = Math.abs(progressDelta) / Math.max(dt, 0.001); // progress units / sec
      smoothVelocityRef.current += (rawVelocity - smoothVelocityRef.current) * 0.15;

      // 3. Direction hysteresis: prevents rapid twitching on micro-scrolls
      if (diff > 0.0008) {
        consecutiveDirRef.current = Math.min(10, consecutiveDirRef.current + 1);
        if (consecutiveDirRef.current >= 4 && directionRef.current !== "forward") {
          directionRef.current = "forward";
          if (camelFlipRef.current) {
            camelFlipRef.current.style.transform = "scaleX(1)";
          }
        }
      } else if (diff < -0.0008) {
        consecutiveDirRef.current = Math.max(-10, consecutiveDirRef.current - 1);
        if (consecutiveDirRef.current <= -4 && directionRef.current !== "backward") {
          directionRef.current = "backward";
          if (camelFlipRef.current) {
            camelFlipRef.current.style.transform = "scaleX(-1)";
          }
        }
      }

      // 4. Stride Intensity: smoothly ramps up when moving, softly eases to 0 when resting
      const targetIntensity = smoothVelocityRef.current > 0.015 ? Math.min(smoothVelocityRef.current * 4, 1) : 0;
      strideIntensityRef.current += (targetIntensity - strideIntensityRef.current) * 0.1;
      const intensity = strideIntensityRef.current;

      // Advance gait phase in proportion to actual displacement (legs step when moving)
      walkPhaseRef.current += smoothVelocityRef.current * dt * 14;
      const phase = walkPhaseRef.current;

      // 5. Procedural Dromedary Camel Kinematics
      // Pacing gait: Front near & Back near move in coordinated rhythm
      const angleFN = Math.sin(phase) * 18 * intensity;
      const angleFF = Math.sin(phase + Math.PI) * 18 * intensity;
      const angleBN = Math.sin(phase + 0.45) * 16 * intensity;
      const angleBF = Math.sin(phase + Math.PI + 0.45) * 16 * intensity;
      const bobY = Math.abs(Math.sin(phase * 2)) * -2.4 * intensity;
      const bodyTilt = Math.sin(phase) * 1.2 * intensity;

      // Update SVG leg & torso rotations natively via transform attributes (zero layout thrash)
      if (legFNRef.current) {
        legFNRef.current.setAttribute("transform", `rotate(${angleFN.toFixed(1)} 45 33)`);
      }
      if (legFFRef.current) {
        legFFRef.current.setAttribute("transform", `rotate(${angleFF.toFixed(1)} 45 33)`);
      }
      if (legBNRef.current) {
        legBNRef.current.setAttribute("transform", `rotate(${angleBN.toFixed(1)} 17 30)`);
      }
      if (legBFRef.current) {
        legBFRef.current.setAttribute("transform", `rotate(${angleBF.toFixed(1)} 17 30)`);
      }
      if (bodyRef.current) {
        bodyRef.current.setAttribute(
          "transform",
          `translate(0, ${bobY.toFixed(2)}) rotate(${bodyTilt.toFixed(1)} 32 30)`
        );
      }

      // 6. Update Camel horizontal track position & active track fill
      const progressPercent = Math.max(0, Math.min(100, progress * 100));
      if (camelRef.current) {
        camelRef.current.style.left = `${progressPercent.toFixed(3)}%`;
      }
      if (trackActiveRef.current) {
        trackActiveRef.current.style.width = `${progressPercent.toFixed(3)}%`;
      }

      // 7. Ambient dust particle puff
      if (dustRef.current) {
        dustRef.current.style.opacity = (intensity * 0.55).toFixed(2);
      }

      // 8. Low-frequency display label updates (throttled to avoid re-renders)
      const rounded = Math.round(progressPercent);
      if (percentTextRef.current) {
        percentTextRef.current.innerText = `${rounded}% EXPEDITION`;
      }

      // 9. Contrast sampling check (every ~200ms)
      if (currentTime - lastSampleTimeRef.current > 200) {
        lastSampleTimeRef.current = currentTime;
        sampleContrast();
        setPercentDisplay(rounded);
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    window.addEventListener("scroll", handleNativeScroll, { passive: true });
    window.addEventListener("resize", handleNativeScroll, { passive: true });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("scroll", handleNativeScroll);
      window.removeEventListener("resize", handleNativeScroll);
    };
  }, [handleNativeScroll, sampleContrast]);

  // Dynamic Theme Colors (Clean floating appearance without background block)
  const textColor = isOverDark ? "text-[#FAF6F0]" : "text-[#231A15]";
  const subtextColor = isOverDark ? "text-[#FAF6F0]/80" : "text-[#231A15]/80";
  const camelColor = isOverDark ? "#E4C198" : "#2A1E17";
  const camelGlow = isOverDark
    ? "drop-shadow(0 0 8px rgba(228,193,152,0.75)) drop-shadow(0 1px 3px rgba(0,0,0,0.95))"
    : "drop-shadow(0 0 3px rgba(228,193,152,0.45)) drop-shadow(0 1px 2px rgba(0,0,0,0.3))";
  const trackBaseBg = isOverDark ? "bg-[#FAF6F0]/25" : "bg-[#30251F]/20";
  const trackActiveBg = isOverDark
    ? "bg-gradient-to-r from-[#FAF6F0]/70 via-[#E4C198] to-[#D7B98E] shadow-[0_0_8px_#E4C198]"
    : "bg-gradient-to-r from-[#8C6D4A] via-[#30251F] to-[#1A1512]";

  return (
    <aside
      ref={barRef}
      aria-label="Thar Desert Scroll Progress Caravan"
      data-testid="scroll-camel-bar"
      className="fixed bottom-0 inset-x-0 z-40 select-none pointer-events-none pb-2 pt-1 transition-colors duration-700"
    >
      <div className="relative mx-auto max-w-[1600px] px-3 sm:px-8 flex flex-col justify-center">
        {/* Desert Track Line with Moving Trot Camel (Background Removed) */}
        <div
          ref={trackRef}
          onClick={handleTrackClick}
          className="relative w-full h-8 cursor-pointer flex items-end group pointer-events-auto"
          title={`Scrub page (${percentDisplay}%)`}
        >
          {/* Subtle Base Track Line */}
          <div
            className={`absolute bottom-0 inset-x-0 h-[1.5px] rounded-full transition-colors duration-700 ${trackBaseBg}`}
          />

          {/* Active Progress Line */}
          <div
            ref={trackActiveRef}
            style={{ width: "0%" }}
            className={`absolute bottom-0 left-0 h-[2.5px] rounded-full transition-colors duration-700 ${trackActiveBg}`}
          />

          {/* Floating Silhouetted Dromedary Camel */}
          <div
            ref={camelRef}
            style={{
              left: "0%",
              transform: "translateX(-50%)",
              color: camelColor,
              filter: camelGlow,
            }}
            className="absolute bottom-[-1px] w-12 h-10 pointer-events-none transition-[color,filter] duration-700"
          >
            {/* Smooth Flip Container for seamless directional turns */}
            <div
              ref={camelFlipRef}
              style={{
                transform: "scaleX(1)",
                transformOrigin: "center center",
                transition: "transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)",
              }}
              className="w-full h-full"
            >
              <svg
                viewBox="0 0 72 56"
                fill="currentColor"
                className="w-full h-full overflow-visible"
              >
                {/* Far Legs (behind torso) */}
                <g ref={legFFRef} opacity="0.8">
                  <path d="M 45 33 C 46 38 47 43 47 45 L 46 52 L 43 52 L 44 45 C 44 41 43 36 43 33 Z" />
                </g>
                <g ref={legBFRef} opacity="0.8">
                  <path d="M 18 31 C 17 37 13 42 14 45 L 17 52 L 14 52 L 12 45 C 11 40 14 35 15 31 Z" />
                </g>

                {/* Camel Torso, Hump, Head, Neck, Tail */}
                <g ref={bodyRef}>
                  <path d="
                    M 58 13
                    C 59 10, 62 10, 64 12
                    C 66 13, 67 15, 66 17
                    C 64 19, 61 18, 59 17
                    L 56 22
                    C 53 28, 49 32, 45 34
                    C 41 36, 36 37, 28 37
                    C 21 37, 17 35, 14 31
                    C 11 30, 9 32, 9 37
                    C 8 42, 8 45, 7 47
                    C 6 47, 6 45, 7 41
                    C 7 35, 8 30, 11 27
                    C 14 24, 16 23, 19 18
                    C 22 13, 27 13, 31 18
                    C 34 23, 38 25, 43 25
                    C 46 20, 48 15, 52 11
                    C 54 9, 57 10, 58 13
                    Z
                  " />
                  {/* Eye */}
                  <circle
                    cx="63"
                    cy="13.2"
                    r="0.8"
                    fill={isOverDark ? "#14110E" : "#FAF6F0"}
                    className="transition-colors duration-700"
                  />
                  {/* Ear */}
                  <path d="M 57 10 L 59 8 L 59 11 Z" />
                  {/* Saddle Blanket Fringe */}
                  <path d="M 23 32 Q 28 35 33 32 L 32 35 L 24 35 Z" opacity="0.35" />
                </g>

                {/* Near Legs (in front of torso) */}
                <g ref={legFNRef}>
                  <path d="M 44 33 C 45 38 46 43 46 46 L 45 52 L 41 52 L 42 45 C 42 40 42 36 42 33 Z" />
                </g>
                <g ref={legBNRef}>
                  <path d="M 16 30 C 15 36 12 41 13 45 L 16 52 L 12 52 L 10 45 C 9 39 12 34 13 30 Z" />
                </g>
              </svg>

              {/* Floating Dust Puff Behind Camel Feet While Trotting */}
              <div
                ref={dustRef}
                style={{ opacity: 0 }}
                className={`absolute -bottom-0.5 -left-1 w-2.5 h-1 rounded-full pointer-events-none transition-colors duration-700 ${
                  isOverDark ? "bg-[#E4C198]" : "bg-[#30251F]"
                }`}
              />
            </div>
          </div>
        </div>

        {/* Minimal Floating Metadata Row (Transparent, Never Obstructing Content) */}
        <div className="mt-1 flex items-center justify-between text-[9px] xs:text-[10px] tracking-[0.16em] xs:tracking-[0.25em] uppercase font-medium select-none pointer-events-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
          {/* Left Side: North Compass & Label */}
          <div className={`flex items-center gap-1.5 xs:gap-2 transition-colors duration-700 ${textColor}`}>
            <div className="flex h-3.5 w-3.5 xs:h-4 xs:w-4 items-center justify-center rounded-full border border-current opacity-75">
              <span className="text-[6.5px] xs:text-[7px] font-bold">N</span>
            </div>
            <span className="font-sans font-semibold hidden xs:inline">SCROLL TO DISCOVER CAMP</span>
            <span className="font-sans font-semibold xs:hidden">CAMP DISCOVERY</span>
          </div>

          {/* Right Side: Progress & Coordinates */}
          <div className={`flex items-center gap-3 sm:gap-4 transition-colors duration-700 ${subtextColor}`}>
            <span ref={percentTextRef} className="font-mono font-bold tracking-wider">
              {percentDisplay}% EXPEDITION
            </span>
            <div className="hidden sm:flex items-center gap-1.5 font-mono">
              <Compass size={11} className="opacity-80" />
              <span>26.9157° N · 70.9083° E · SAM DUNES</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
