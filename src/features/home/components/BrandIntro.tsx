"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface BrandIntroProps {
  onComplete: () => void;
  onSkip: () => void;
  onEnquire: () => void;
}

export function BrandIntro({ onComplete, onSkip, onEnquire }: BrandIntroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLHeadingElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const lineRef = useRef<HTMLParagraphElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const skipBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (skipBtnRef.current) {
      skipBtnRef.current.focus();
    }

    const ctx = gsap.context(() => {
      // Setup Initial States
      gsap.set(leftPanelRef.current, { xPercent: 0 });
      gsap.set(rightPanelRef.current, { xPercent: 0 });
      gsap.set(glowRef.current, { opacity: 0, scale: 0.8 });
      gsap.set(eyebrowRef.current, { opacity: 0, y: 15 });
      gsap.set(wordmarkRef.current, { opacity: 0, y: 25, letterSpacing: "0.45em" });
      gsap.set(dividerRef.current, { scaleX: 0, opacity: 0 });
      gsap.set(lineRef.current, { opacity: 0, y: 12 });

      // Master Timeline Orchestration
      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        onComplete: () => {
          onComplete();
        },
      });

      // Stage 1: Warm Ambient Atmosphere
      tl.to(
        glowRef.current,
        { opacity: 0.55, scale: 1.15, duration: 1.4, ease: "power2.inOut" },
        0
      );

      // Stage 2: Clean Brand Reveal with Elegant Typography Tracking
      tl.to(eyebrowRef.current, { opacity: 1, y: 0, duration: 0.7 }, 0.4);
      tl.to(
        wordmarkRef.current,
        {
          opacity: 1,
          y: 0,
          letterSpacing: "0.28em",
          duration: 1.1,
          ease: "power3.out",
        },
        0.6
      );
      tl.to(
        dividerRef.current,
        { scaleX: 1, opacity: 1, duration: 0.7, ease: "power2.inOut" },
        0.9
      );
      tl.to(lineRef.current, { opacity: 0.85, y: 0, duration: 0.8 }, 1.1);

      // Stage 3: Arrival & Curtain Parting
      tl.to(
        contentRef.current,
        {
          opacity: 0,
          y: -18,
          scale: 1.02,
          duration: 0.6,
          ease: "power2.in",
        },
        2.5
      );

      tl.to(glowRef.current, { opacity: 0, duration: 0.7 }, 2.5);

      // Left & Right sleek luxury panels part cleanly from the center
      tl.to(
        leftPanelRef.current,
        {
          xPercent: -100,
          duration: 1.2,
          ease: "power3.inOut",
        },
        2.7
      );

      tl.to(
        rightPanelRef.current,
        {
          xPercent: 100,
          duration: 1.2,
          ease: "power3.inOut",
        },
        2.7
      );
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to RETIVAA"
      className="fixed inset-0 z-50 overflow-hidden select-none pointer-events-auto bg-transparent"
    >
      {/* Left Curtain Panel (Minimalist, rich dark canvas) */}
      <div
        ref={leftPanelRef}
        className="absolute top-0 bottom-0 left-0 w-1/2 bg-[#120F0D] border-r border-[#B88A44]/15 shadow-2xl z-10 will-change-transform overflow-hidden"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 80% 50%, rgba(48,37,31,0.5) 0%, rgba(18,15,13,0.98) 70%)",
        }}
      />

      {/* Right Curtain Panel (Minimalist, rich dark canvas) */}
      <div
        ref={rightPanelRef}
        className="absolute top-0 bottom-0 right-0 w-1/2 bg-[#120F0D] border-l border-[#B88A44]/15 shadow-2xl z-10 will-change-transform overflow-hidden"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 20% 50%, rgba(48,37,31,0.5) 0%, rgba(18,15,13,0.98) 70%)",
        }}
      />

      {/* Center Warm Ambient Glow */}
      <div
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-radial from-[#B88A44]/25 via-[#A65335]/10 to-transparent blur-3xl z-20 will-change-transform"
      />

      {/* Top Controls Bar */}
      <div className="absolute top-6 inset-x-0 z-30 px-6 sm:px-10 flex items-center justify-between pointer-events-auto">
        <button
          type="button"
          onClick={onEnquire}
          className="text-xs uppercase tracking-[0.2em] font-medium text-[#D7B98E] hover:text-[#F6EFE3] transition-colors py-2 px-3 rounded-xs focus-visible:outline-2 focus-visible:outline-[#D7B98E] cursor-pointer"
        >
          Enquire
        </button>

        <button
          ref={skipBtnRef}
          type="button"
          onClick={onSkip}
          className="text-xs uppercase tracking-[0.2em] font-medium text-[#F6EFE3]/80 hover:text-[#D7B98E] transition-colors py-2 px-3 border border-[#F6EFE3]/20 hover:border-[#D7B98E] rounded-xs focus-visible:outline-2 focus-visible:outline-[#D7B98E] cursor-pointer"
        >
          Skip intro <span className="hidden sm:inline text-[10px] text-[#F6EFE3]/50 ml-1">[Esc]</span>
        </button>
      </div>

      {/* Center Brand Typography (Retivaa Wordmark & Poetic Descriptor) */}
      <div
        ref={contentRef}
        className="absolute inset-0 z-30 flex flex-col items-center justify-center text-center px-4 pointer-events-none will-change-transform"
      >
        {/* Eyebrow */}
        <span
          ref={eyebrowRef}
          className="text-xs sm:text-sm font-semibold tracking-[0.4em] uppercase text-[#D7B98E] drop-shadow-sm mb-4 sm:mb-6"
        >
          JAISALMER &bull; RAJASTHAN
        </span>

        {/* Wordmark */}
        <h2
          ref={wordmarkRef}
          className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-normal text-[#F6EFE3] drop-shadow-lg uppercase leading-none"
        >
          RETIVAA
        </h2>

        {/* Divider */}
        <div
          ref={dividerRef}
          className="w-14 sm:w-20 h-[1px] bg-gradient-to-r from-transparent via-[#B88A44] to-transparent my-4 sm:my-6"
        />

        {/* Supporting Line */}
        <p
          ref={lineRef}
          className="text-xs sm:text-sm md:text-base font-light italic tracking-widest text-[#F6EFE3]/75 font-serif"
        >
          A world shaped by sand.
        </p>
      </div>
    </div>
  );
}
