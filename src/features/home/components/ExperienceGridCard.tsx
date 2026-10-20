"use client";

import { useState, useCallback, useId } from "react";
import Image from "next/image";
import { Eye, ArrowUpRight } from "lucide-react";
import type { ExperienceItem } from "@/content/experiences";

interface ExperienceGridCardProps {
  readonly item: ExperienceItem;
  readonly isReducedMotion?: boolean;
}

export function ExperienceGridCard({ item, isReducedMotion = false }: ExperienceGridCardProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const titleId = useId();
  const descId = useId();

  // Mouse hover handlers
  const handleMouseEnter = useCallback(() => {
    setIsRevealed(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsRevealed(false);
  }, []);

  // Keyboard focus handlers
  const handleFocus = useCallback(() => {
    setIsRevealed(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsRevealed(false);
  }, []);

  // Keyboard and touch toggle handler
  const handleToggle = useCallback(() => {
    setIsRevealed((prev) => !prev);
  }, []);

  return (
    <article
      data-testid={`experience-grid-card-${item.index}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="experience-grid-card-item group relative w-full h-[255px] sm:h-[270px] lg:h-[285px] rounded-xl overflow-hidden select-none border transition-all duration-300 focus-within:ring-2 focus-within:ring-[#B88A44] focus-within:ring-offset-2 hover:-translate-y-1 hover:shadow-lg"
      style={{
        backgroundColor: item.color.bg,
        borderColor: isRevealed ? "rgba(184, 138, 68, 0.55)" : item.color.cardBorder,
        boxShadow: isRevealed
          ? "0 20px 36px -10px rgba(25, 25, 24, 0.2)"
          : "0 3px 12px -2px rgba(25, 25, 24, 0.04)",
        transition: isReducedMotion
          ? "none"
          : "transform 350ms cubic-bezier(0.25, 1, 0.5, 1), box-shadow 450ms cubic-bezier(0.25, 1, 0.5, 1), border-color 400ms ease",
      }}
      aria-labelledby={titleId}
      aria-describedby={descId}
    >
      {/* ===================================================================
          1. PHOTOGRAPHIC REVEAL WINDOW (Smooth LEFT-TO-RIGHT curtain mask reveal)
          Reveal: ~900ms, Reverse: ~700ms, smooth cubic easing
          =================================================================== */}
      <div
        className="absolute inset-0 z-20 overflow-hidden pointer-events-none rounded-xl"
        style={{
          clipPath: isReducedMotion
            ? isRevealed
              ? "inset(0 0% 0 0)"
              : "inset(0 100% 0 0)"
            : isRevealed
            ? "inset(0 0% 0 0)"
            : "inset(0 100% 0 0)",
          transition: isReducedMotion
            ? "none"
            : isRevealed
            ? "clip-path 900ms cubic-bezier(0.25, 1, 0.5, 1)"
            : "clip-path 700ms cubic-bezier(0.25, 1, 0.5, 1)",
          willChange: "clip-path",
        }}
        aria-hidden={!isRevealed}
      >
        <div className="relative h-full w-full">
          <Image
            src={item.image.src}
            alt={item.image.alt}
            fill
            quality={95}
            sizes="(min-width: 1440px) 260px, (min-width: 1024px) 220px, (min-width: 640px) 45vw, 90vw"
            priority={item.index === "01"}
            className="object-cover"
            style={{
              transform: isReducedMotion
                ? "none"
                : isRevealed
                ? "scale(1.025)"
                : "scale(1.0)",
              transition: isReducedMotion
                ? "none"
                : isRevealed
                ? "transform 900ms cubic-bezier(0.25, 1, 0.5, 1)"
                : "transform 700ms cubic-bezier(0.25, 1, 0.5, 1)",
            }}
          />
        </div>

        {/* Ambient Dark Scrim Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#191918]/90 via-[#191918]/30 to-transparent pointer-events-none" />

        {/* Revealed Image Caption */}
        <div
          className="absolute bottom-0 inset-x-0 p-3.5 sm:p-4 text-left z-30"
          style={{
            opacity: isRevealed ? 1 : 0,
            transform: isRevealed ? "translateY(0)" : "translateY(8px)",
            transition: isReducedMotion
              ? "none"
              : "opacity 400ms ease 80ms, transform 400ms ease 80ms",
          }}
        >
          <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#E4C198] font-semibold block mb-0.5">
            {item.index} — {item.category} · {item.photoCaption}
          </span>
          <h4 className="font-serif text-base sm:text-[1.1rem] font-normal text-[#FAF6F0] leading-snug drop-shadow-sm">
            {item.title}
          </h4>
        </div>
      </div>

      {/* ===================================================================
          2. DEFAULT COMPACT EDITORIAL CONTENT LAYER (Visible at rest)
          =================================================================== */}
      <div
        className="relative z-10 h-full w-full p-3.5 sm:p-4 flex flex-col justify-between"
        style={{
          opacity: isRevealed ? 0 : 1,
          transform: isRevealed ? "translateY(-6px)" : "translateY(0)",
          transition: isReducedMotion
            ? "none"
            : "opacity 400ms cubic-bezier(0.25, 1, 0.5, 1), transform 400ms cubic-bezier(0.25, 1, 0.5, 1)",
        }}
      >
        {/* Top: Category Tag & Index */}
        <div className="flex items-center justify-between">
          <span
            className="font-mono text-[9px] sm:text-[9.5px] font-semibold tracking-[0.2em] uppercase px-2 py-0.5 rounded-full border border-current"
            style={{
              color: item.color.accent,
              backgroundColor: item.color.badgeBg,
            }}
          >
            {item.index} &mdash; {item.category}
          </span>

          <span
            className="text-[9px] font-mono tracking-widest uppercase text-[#30251F]/40"
            aria-hidden="true"
          >
            0{item.index.slice(-1)} / 05
          </span>
        </div>

        {/* Center: Title, Decorative Line & Description */}
        <div className="my-auto py-1 space-y-1.5 text-left">
          <h3
            id={titleId}
            className="font-serif text-base sm:text-[1.05rem] lg:text-[1.1rem] font-normal leading-snug text-[#30251F] text-balance"
          >
            {item.title}
          </h3>

          {/* Delicate Line Illustration */}
          <div className="py-0.5" aria-hidden="true">
            {renderIllustration(item.illustration, item.color.accent)}
          </div>

          <p
            id={descId}
            className="text-[11px] sm:text-[11.5px] text-[#6B5D55] font-light leading-relaxed line-clamp-2 sm:line-clamp-3"
          >
            {item.description}
          </p>
        </div>

        {/* Bottom Bar: "View image" interactive cue */}
        <div className="pt-2 border-t border-[#30251F]/10 flex items-center justify-between">
          <button
            type="button"
            onClick={handleToggle}
            onFocus={handleFocus}
            onBlur={handleBlur}
            aria-expanded={isRevealed}
            aria-label={
              isRevealed
                ? `Show details for ${item.title}`
                : `View photograph of ${item.title} (${item.photoCaption})`
            }
            className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#30251F] hover:text-[#A65335] transition-colors focus-visible:ring-2 focus-visible:ring-[#B88A44] rounded-sm py-0.5 cursor-pointer"
          >
            <span className="flex items-center justify-center w-3.5 h-3.5 rounded-full border border-current">
              {isRevealed ? (
                <span className="font-mono text-[9px] leading-none">&times;</span>
              ) : (
                <Eye size={9} strokeWidth={2} />
              )}
            </span>
            <span>{isRevealed ? "Close" : "View photo"}</span>
          </button>

          <span
            className="text-[9px] font-mono tracking-wider uppercase text-[#30251F]/40 inline-flex items-center gap-0.5"
            aria-hidden="true"
          >
            <span>Hover</span>
            <ArrowUpRight size={10} />
          </span>
        </div>
      </div>
    </article>
  );
}

/* =========================================================================
   RESTRAINED FAINT DECORATIVE LINE ILLUSTRATIONS
   ========================================================================= */

function renderIllustration(
  type: ExperienceItem["illustration"],
  accentColor: string
) {
  switch (type) {
    case "tent":
      return (
        <svg
          viewBox="0 0 140 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-20 h-3.5 opacity-40 overflow-visible"
        >
          <path
            d="M 5 20 Q 35 14 70 6 Q 105 14 135 20"
            stroke={accentColor}
            strokeWidth="1.2"
          />
          <path d="M 70 6 L 70 2" stroke={accentColor} strokeWidth="1.2" />
          <circle cx="70" cy="2" r="1.5" fill={accentColor} />
        </svg>
      );
    case "safari":
      return (
        <svg
          viewBox="0 0 140 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-20 h-3.5 opacity-40 overflow-visible"
        >
          <path
            d="M 5 18 C 30 8 60 22 95 11 C 115 6 128 13 135 16"
            stroke={accentColor}
            strokeWidth="1.2"
          />
        </svg>
      );
    case "sunset":
      return (
        <svg
          viewBox="0 0 140 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-20 h-3.5 opacity-40 overflow-visible"
        >
          <path d="M 5 18 L 135 18" stroke={accentColor} strokeWidth="1" />
          <path
            d="M 50 18 A 16 16 0 0 1 90 18"
            stroke={accentColor}
            strokeWidth="1.2"
          />
          <path d="M 70 10 L 70 5" stroke={accentColor} strokeWidth="1" />
        </svg>
      );
    case "dining":
      return (
        <svg
          viewBox="0 0 140 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-20 h-3.5 opacity-40 overflow-visible"
        >
          <path
            d="M 20 17 C 40 17 55 11 70 11 C 85 11 100 17 120 17"
            stroke={accentColor}
            strokeWidth="1.2"
          />
          <circle cx="70" cy="14" r="3" stroke={accentColor} strokeWidth="1" />
          <circle cx="56" cy="16" r="1.8" stroke={accentColor} strokeWidth="0.8" />
          <circle cx="84" cy="16" r="1.8" stroke={accentColor} strokeWidth="0.8" />
        </svg>
      );
    case "cultural":
      return (
        <svg
          viewBox="0 0 140 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-20 h-3.5 opacity-40 overflow-visible"
        >
          <path
            d="M 64 20 C 64 15 67 12 69 8 C 71 12 73 14 73 20"
            stroke={accentColor}
            strokeWidth="1.2"
          />
          <circle cx="69" cy="5" r="1.2" fill={accentColor} />
          <path
            d="M 35 20 Q 70 15 105 20"
            stroke={accentColor}
            strokeWidth="0.8"
          />
        </svg>
      );
    default:
      return null;
  }
}
