"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Compass, Sparkles } from "lucide-react";

export interface HeroTrackItem {
  id: string;
  src: string;
  alt: string;
  title: string;
  subtitle: string;
  tag: string;
}

export const HERO_TRACK_ITEMS: readonly HeroTrackItem[] = [
  {
    id: "royal-canvas-suite",
    src: "/images/gallery/tent-bedroom-suite.jpg",
    alt: "Luxury royal tent suite with plush king bed, striped canopy, and handcrafted furniture",
    title: "Royal Canvas Suite",
    subtitle: "Air-conditioned luxury tent sanctuary with bespoke furnishings",
    tag: "Signature Stay",
  },
  {
    id: "thar-dune-safari",
    src: "/images/gallery/safari-4x4-dune-bashing.jpg",
    alt: "4x4 Thar open jeep safari drifting through golden dunes with sand spray",
    title: "4x4 Thar Dune Bashing",
    subtitle: "High-energy off-road dune crossing across the desert ridges",
    tag: "Dune Adventure",
  },
  {
    id: "sunset-camel-safari",
    src: "/images/gallery/safari-camel-sunset-walk.jpg",
    alt: "Golden hour camel trek traversing the rippling sand dunes at sunset",
    title: "Sunset Camel Trek",
    subtitle: "Quiet sunset wander into the golden sands of Jaisalmer",
    tag: "Desert Safari",
  },
  {
    id: "campfire-fire-show",
    src: "/images/gallery/culture-campfire-fire-show.jpg",
    alt: "Dramatic Kalbelia fire-breathing show with fiery bursts and campfire crowd",
    title: "Campfire & Fire Show",
    subtitle: "Electrifying evening performance with traditional fire dancers",
    tag: "Campfire Show",
  },
  {
    id: "folk-music-ensemble",
    src: "/images/gallery/culture-folk-ensemble-moonlight.jpg",
    alt: "Rajasthani folk musicians with dholak and harmonium under full moonlight",
    title: "Live Rajasthani Folk Music",
    subtitle: "Hypnotic Manganiyar melodies and rhythmic desert folklore",
    tag: "Cultural Night",
  },
  {
    id: "starlit-camp-sanctuary",
    src: "/images/gallery/camp-starlit-panorama.jpg",
    alt: "Panoramic starry night view of Retivaa desert camp with red carpet and central fountain",
    title: "Starlit Camp Sanctuary",
    subtitle: "Celestial desert oasis beneath millions of Thar stars",
    tag: "Night Panorama",
  },
  {
    id: "artisanal-dressing-suite",
    src: "/images/gallery/tent-bedroom-dressing.jpg",
    alt: "Handcrafted wooden furnishings and artisanal hand-painted standing mirror in tent suite",
    title: "Handcrafted Canvas Details",
    subtitle: "Traditional painted Rajasthani mirror and private tea station",
    tag: "Luxury Suite",
  },
  {
    id: "royal-dining-pavilion",
    src: "/images/gallery/dining-hall-interior.jpg",
    alt: "Spacious indoor dining hall with polished wooden tables and woven hanging lanterns",
    title: "Royal Desert Dining",
    subtitle: "Freshly prepared authentic regional thalis & buffet breakfasts",
    tag: "Desert Dining",
  },
];

const CARD_CLASSES = [
  "md:w-[310px] md:h-[400px]",
  "md:w-[270px] md:h-[350px]",
  "md:w-[330px] md:h-[420px]",
];

const EASE_SNAPPY = [0.22, 1, 0.36, 1] as const;

function getCyclicOffset(index: number, activeIndex: number, total: number): number {
  let diff = (index - activeIndex) % total;
  if (diff > total / 2) diff -= total;
  if (diff < -total / 2) diff += total;
  return diff;
}

export interface HeroPhotoTrackProps {
  activeIndex?: number;
  onSelectIndex?: (index: number) => void;
  onNavigate?: (step: number) => void;
  isPaused?: boolean;
  setIsPaused?: (paused: boolean | ((prev: boolean) => boolean)) => void;
  intervalMs?: number;
}

export function HeroPhotoTrack({
  activeIndex: controlledIndex,
  onSelectIndex,
  onNavigate,
  isPaused: controlledIsPaused,
  setIsPaused: controlledSetIsPaused,
  intervalMs = 3000,
}: HeroPhotoTrackProps = {}) {
  const [internalIndex, setInternalIndex] = useState(0);
  const [internalPaused, setInternalPaused] = useState(false);
  const [trackSpacing, setTrackSpacing] = useState(200);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastWheelTime = useRef<number>(0);
  const shouldReduceMotion = useReducedMotion();
  const totalItems = HERO_TRACK_ITEMS.length;

  const isControlled = controlledIndex !== undefined;
  const activeIndex = isControlled ? controlledIndex : internalIndex;
  const isPaused = controlledIsPaused !== undefined ? controlledIsPaused : internalPaused;

  const setPaused = useCallback(
    (paused: boolean | ((prev: boolean) => boolean)) => {
      if (controlledSetIsPaused) {
        controlledSetIsPaused(paused);
      } else {
        setInternalPaused(paused);
      }
    },
    [controlledSetIsPaused]
  );

  // Responsive track spacing
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      setTrackSpacing(isMobile ? Math.min(220, window.innerWidth * 0.52) : 215);
    };

    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navigate = useCallback(
    (step: number) => {
      if (onNavigate) {
        onNavigate(step);
      } else {
        setInternalIndex((prev) => (prev + step + totalItems) % totalItems);
      }
    },
    [onNavigate, totalItems]
  );

  const handleSelect = useCallback(
    (index: number) => {
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
      setPaused(true);
      if (onSelectIndex) {
        onSelectIndex(index);
      } else {
        setInternalIndex(index);
      }
      pauseTimeoutRef.current = setTimeout(() => setPaused(false), 3800);
    },
    [onSelectIndex, setPaused]
  );

  const handleManualNav = useCallback(
    (step: number) => {
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
      setPaused(true);
      navigate(step);
      pauseTimeoutRef.current = setTimeout(() => setPaused(false), 3800);
    },
    [navigate, setPaused]
  );

  // Automatic photo progression (autoplay) in milliseconds when uncontrolled
  useEffect(() => {
    if (isControlled || isPaused) return;

    const timer = setInterval(() => {
      navigate(1);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isControlled, isPaused, navigate, intervalMs]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    };
  }, []);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handleManualNav(-1);
      if (e.key === "ArrowRight") handleManualNav(1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleManualNav]);

  // Mouse wheel scroll handler to change slides with debounce
  const handleWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaY) < 18 && Math.abs(e.deltaX) < 18) return;
    const now = Date.now();
    if (now - lastWheelTime.current < 350) return;
    lastWheelTime.current = now;
    if (e.deltaY > 0 || e.deltaX > 0) {
      handleManualNav(1);
    } else {
      handleManualNav(-1);
    }
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    setPaused(true);
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) {
      pauseTimeoutRef.current = setTimeout(() => setPaused(false), 3000);
      return;
    }
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    // Trigger only on intentional horizontal swipes
    if (Math.abs(deltaX) > 30 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2) {
      if (deltaX < 0) navigate(1);
      else navigate(-1);
    }
    touchStartX.current = null;
    touchStartY.current = null;

    pauseTimeoutRef.current = setTimeout(() => setPaused(false), 3500);
  };

  const pad = (n: number) => String(n).padStart(2, "0");

  // Filter items to render only visible cards (offset -2 to +2) for high FPS
  const visibleCards = useMemo(() => {
    return HERO_TRACK_ITEMS.map((item, index) => {
      const offset = getCyclicOffset(index, activeIndex, totalItems);
      return { item, index, offset };
    }).filter(({ offset }) => Math.abs(offset) <= 2);
  }, [activeIndex, totalItems]);

  return (
    <div
      className="relative w-full flex flex-col items-center select-none focus:outline-none"
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      data-testid="hero-photo-track"
      role="region"
      aria-label="Interactive 3D Photo Gallery of Retivaa Desert Camp"
      tabIndex={0}
    >
      {/* 1. 3D Stacked Photo Cards Container */}
      <div className="relative w-full h-[320px] sm:h-[350px] md:h-[430px] lg:h-[490px] flex items-center justify-center overflow-visible">
        {visibleCards.map(({ item, index, offset }) => {
          const isCurrent = offset === 0;
          const absOffset = Math.abs(offset);
          const sizeClass = CARD_CLASSES[index % 3];

          return (
            <motion.div
              key={item.id}
              className={`absolute left-1/2 top-1/2 w-[66vw] max-w-[270px] h-[280px] sm:h-[310px] cursor-grab active:cursor-grabbing overflow-hidden rounded-lg border border-[#FAF6F0]/25 shadow-[0_16px_36px_-10px_rgba(0,0,0,0.65)] group ${sizeClass} md:h-auto md:max-w-none will-change-transform`}
              initial={false}
              animate={{
                x: `calc(-50% + ${offset * trackSpacing}px)`,
                y: `calc(-50% + ${isCurrent ? 0 : index % 2 === 0 ? 16 : -14}px)`,
                scale: isCurrent ? 1.03 : 0.85,
                opacity: absOffset >= 2 ? 0.35 : isCurrent ? 1 : 0.75,
                rotate: isCurrent ? 0 : offset * 1.5,
                zIndex: isCurrent ? 25 : 15 - absOffset,
              }}
              transition={{
                duration: shouldReduceMotion ? 0.01 : 0.45,
                ease: EASE_SNAPPY,
              }}
              onPointerEnter={() => {
                // Pause only when hovering directly on the active front card
                if (isCurrent) setPaused(true);
              }}
              onPointerLeave={() => {
                if (isCurrent) setPaused(false);
              }}
              onClick={() => {
                if (!isCurrent) handleSelect(index);
              }}
              role="group"
              aria-label={item.title}
            >
              {/* Image with optimized crisp rendering */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.src}
                alt={item.alt}
                loading={absOffset <= 1 ? "eager" : "lazy"}
                decoding="async"
                draggable={false}
                className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                style={{ imageRendering: "auto", backfaceVisibility: "hidden" }}
              />

              {/* Lightweight Dimming Overlay for non-active cards */}
              <div
                className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${
                  isCurrent
                    ? "opacity-0"
                    : "bg-[#14110E]/20 group-hover:bg-[#14110E]/05"
                }`}
              />

              {/* Scrim Gradient for Title Readability without obscuring picture details */}
              <div
                className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${
                  isCurrent
                    ? "bg-gradient-to-t from-[#14110E]/90 via-[#14110E]/15 to-transparent"
                    : "bg-gradient-to-t from-[#14110E]/50 via-transparent to-transparent"
                }`}
              />

              {/* Tag Pill in Top-Right */}
              <div className="absolute top-3 right-3 z-10">
                <span className="inline-flex items-center gap-1 rounded-full bg-[#14110E]/65 backdrop-blur-xs border border-[#FAF6F0]/20 px-2.5 py-1 text-[9px] font-medium tracking-[0.2em] uppercase text-[#E4C198]">
                  <Sparkles size={9} className="text-[#E4C198]" />
                  {item.tag}
                </span>
              </div>

              {/* Active Card Bottom Descriptor Overlay */}
              {isCurrent && (
                <div className="absolute bottom-0 inset-x-0 p-3.5 sm:p-5 text-left z-10 pointer-events-none">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#E4C198] flex items-center gap-1.5">
                    <Compass size={11} className="text-[#E4C198]" />
                    {pad(index + 1)} · RETIVAA EXPERIENCE
                  </p>
                  <h3 className="mt-0.5 font-serif text-base sm:text-xl font-normal text-[#FAF6F0] leading-tight drop-shadow-sm">
                    {item.title}
                  </h3>
                  <p className="mt-0.5 text-[11px] sm:text-xs text-[#FAF6F0]/80 line-clamp-1 font-light">
                    {item.subtitle}
                  </p>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* 2. Navigation Pill (Positioned cleanly BELOW the photo on mobile, bottom-right on desktop) */}
      <div className="relative mt-4 sm:mt-5 md:mt-0 md:absolute md:-bottom-6 md:right-2 z-30 flex items-center gap-2.5 sm:gap-3 bg-[#14110E]/80 backdrop-blur-md border border-[#FAF6F0]/25 rounded-full px-3.5 py-1.5 shadow-xl">
        {/* Prev Button */}
        <button
          type="button"
          data-testid="hero-track-prev-button"
          aria-label="Previous photograph"
          onClick={() => handleManualNav(-1)}
          className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-[#FAF6F0]/30 text-[#FAF6F0] transition-colors duration-200 hover:bg-[#FAF6F0] hover:text-[#1A1512] active:scale-95 cursor-pointer"
        >
          <ArrowLeft size={14} strokeWidth={2} />
        </button>

        {/* Counter & Millisecond Progress Indicator */}
        <div className="flex flex-col items-center px-1 sm:px-2 min-w-[70px]">
          <div
            data-testid="hero-track-counter"
            className="text-[11px] sm:text-xs font-mono font-medium tracking-[0.3em] text-[#FAF6F0]"
          >
            <span className="text-[#E4C198] font-semibold">{pad(activeIndex + 1)}</span>
            <span className="text-[#FAF6F0]/40 mx-1">/</span>
            <span className="text-[#FAF6F0]/60">{pad(totalItems)}</span>
          </div>

          {/* Real-time Millisecond Slide Progress Line */}
          <div className="relative w-full h-[2px] bg-[#FAF6F0]/15 rounded-full overflow-hidden mt-1">
            <motion.div
              key={`pill-progress-${activeIndex}-${isPaused}`}
              initial={{ width: "0%" }}
              animate={isPaused ? { width: "0%" } : { width: "100%" }}
              transition={{
                duration: intervalMs / 1000,
                ease: "linear",
              }}
              className="h-full bg-gradient-to-r from-[#FAF6F0] via-[#E4C198] to-[#D7B98E] shadow-[0_0_6px_#E4C198]"
            />
          </div>
        </div>

        {/* Next Button */}
        <button
          type="button"
          data-testid="hero-track-next-button"
          aria-label="Next photograph"
          onClick={() => handleManualNav(1)}
          className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-[#FAF6F0]/30 text-[#FAF6F0] transition-colors duration-200 hover:bg-[#FAF6F0] hover:text-[#1A1512] active:scale-95 cursor-pointer"
        >
          <ArrowRight size={14} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
