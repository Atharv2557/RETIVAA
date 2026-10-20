"use client";

import { useEffect, useRef, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap } from "gsap";
import { useNavigation } from "./NavigationContext";
import { TornPaperEdge } from "./TornPaperEdge";

export function PageTransitionWipe() {
  const {
    isTransitioning,
    targetRoute,
    completePageTransition,
    destinationTheme,
  } = useNavigation();
  const pathname = usePathname();
  const router = useRouter();

  const wipeContainerRef = useRef<HTMLDivElement>(null);
  const wipeSheetRef = useRef<HTMLDivElement>(null);
  const isNavigatingRef = useRef(false);
  const hasCoveredRef = useRef(false);
  const isRevealingRef = useRef(false);

  // Dynamic Wipe Theme: Dark for black theme destinations, Light for ivory theme destinations
  const isDarkDestination = destinationTheme === "dark";
  const wipeBg = isDarkDestination ? "bg-[#191918]" : "bg-[#F6EFE3]";
  const wipeColor = isDarkDestination ? "#191918" : "#F6EFE3";
  const wipeFringe = isDarkDestination ? "#D7B98E" : "#D7B98E";
  const watermarkText = isDarkDestination ? "text-[#F6EFE3]" : "text-[#30251F]";
  const watermarkSub = isDarkDestination ? "text-[#E4C198]" : "text-[#A65335]";

  // Animate the paper layer sweeping upward to cover viewport
  const coverViewport = useCallback(() => {
    if (!wipeSheetRef.current || !targetRoute) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      router.push(targetRoute);
      return;
    }

    hasCoveredRef.current = false;
    isRevealingRef.current = false;

    // Reset position: starts below the viewport
    gsap.set(wipeSheetRef.current, { yPercent: 105, opacity: 1 });

    gsap.to(wipeSheetRef.current, {
      yPercent: 0,
      duration: 0.55,
      ease: "power3.inOut",
      onComplete: () => {
        hasCoveredRef.current = true;
        // Viewport is now completely covered by the paper layer
        // Commit route change in Next.js App Router
        router.push(targetRoute);
      },
    });
  }, [targetRoute, router]);

  // Once destination route matches target, reveal the new page smoothly
  const revealDestination = useCallback(() => {
    if (!wipeSheetRef.current || isRevealingRef.current) return;
    isRevealingRef.current = true;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      completePageTransition();
      return;
    }

    // Small frame delay to let destination page DOM mount cleanly behind the cover
    requestAnimationFrame(() => {
      // Sweep the paper layer away upward, smoothly unveiling the destination page
      gsap.to(wipeSheetRef.current, {
        yPercent: -105,
        duration: 0.5,
        ease: "power3.inOut",
        onComplete: () => {
          hasCoveredRef.current = false;
          isNavigatingRef.current = false;
          isRevealingRef.current = false;
          completePageTransition();
        },
      });
    });
  }, [completePageTransition]);

  // Trigger sweep upward when transition starts
  useEffect(() => {
    if (isTransitioning && targetRoute && !isNavigatingRef.current) {
      isNavigatingRef.current = true;
      coverViewport();
    }
  }, [isTransitioning, targetRoute, coverViewport]);

  // Watch for pathname matching destination to reveal
  useEffect(() => {
    if (isTransitioning && hasCoveredRef.current && pathname === targetRoute) {
      revealDestination();
    }
  }, [isTransitioning, pathname, targetRoute, revealDestination]);

  if (!isTransitioning) return null;

  return (
    <div
      ref={wipeContainerRef}
      aria-hidden="true"
      className="fixed inset-0 z-[60] pointer-events-none select-none overflow-hidden"
    >
      {/* Ascending Paper Layer with Dynamic Theme (Dark vs Light) */}
      <div
        ref={wipeSheetRef}
        className={`relative w-full h-[100dvh] ${wipeBg} flex flex-col justify-start will-change-transform shadow-2xl transition-colors duration-300`}
      >
        {/* Irregular Torn Paper Edge on the leading upper boundary */}
        <div className="absolute bottom-full left-0 right-0 z-10 -mb-[1px]">
          <TornPaperEdge
            direction="up"
            color={wipeColor}
            fringeColor={wipeFringe}
          />
        </div>

        {/* Subtle Desert Watermark in the center of the paper wipe */}
        <div className="m-auto flex flex-col items-center justify-center opacity-25">
          <span className={`font-serif text-3xl sm:text-4xl tracking-[0.28em] ${watermarkText} uppercase font-light`}>
            RETIVAA
          </span>
          <span className={`text-[10px] tracking-[0.4em] uppercase ${watermarkSub} mt-1 font-mono`}>
            Jaisalmer
          </span>
        </div>
      </div>
    </div>
  );
}
