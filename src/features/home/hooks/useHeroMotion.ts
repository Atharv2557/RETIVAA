"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface HeroMotionElements {
  containerRef: React.RefObject<HTMLElement | null>;
  imageRef: React.RefObject<HTMLDivElement | null>;
  eyebrowRef: React.RefObject<HTMLElement | null>;
  headlineRef: React.RefObject<HTMLElement | null>;
  supportingTextRef: React.RefObject<HTMLElement | null>;
  ctaGroupRef: React.RefObject<HTMLDivElement | null>;
  isIntroActive?: boolean;
}

export function useHeroMotion({
  containerRef,
  imageRef,
  eyebrowRef,
  headlineRef,
  supportingTextRef,
  ctaGroupRef,
  isIntroActive = false,
}: HeroMotionElements) {
  const isOffscreenRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // Check reduced motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        // Instant visual rest state for reduced motion users
        if (imageRef.current) gsap.set(imageRef.current, { scale: 1, opacity: 1 });
        if (eyebrowRef.current) gsap.set(eyebrowRef.current, { y: 0, opacity: 1 });
        if (headlineRef.current) gsap.set(headlineRef.current, { y: 0, opacity: 1 });
        if (supportingTextRef.current) gsap.set(supportingTextRef.current, { y: 0, opacity: 1 });
        if (ctaGroupRef.current) gsap.set(ctaGroupRef.current, { y: 0, opacity: 1 });
        return;
      }

      // Initial visual states for coordinated entrance
      if (imageRef.current) {
        gsap.set(imageRef.current, { scale: 1.06, opacity: 0.85 });
      }
      if (eyebrowRef.current) {
        gsap.set(eyebrowRef.current, { y: 16, opacity: 0 });
      }
      if (headlineRef.current) {
        gsap.set(headlineRef.current, { y: 24, opacity: 0 });
      }
      if (supportingTextRef.current) {
        gsap.set(supportingTextRef.current, { y: 20, opacity: 0 });
      }
      if (ctaGroupRef.current) {
        gsap.set(ctaGroupRef.current, { y: 16, opacity: 0 });
      }

      // If the brand intro is actively covering the screen, pause and wait for arrival
      if (isIntroActive) {
        return;
      }

      // Master Entrance Timeline
      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        delay: 0.05,
      });

      // 1. Subtle camera settling
      if (imageRef.current) {
        tl.to(
          imageRef.current,
          {
            scale: 1.02,
            opacity: 1,
            duration: 2.2,
            ease: "power2.out",
          },
          0
        );
      }

      // 2. Eyebrow arrives
      if (eyebrowRef.current) {
        tl.to(
          eyebrowRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
          },
          0.35
        );
      }

      // 3. Headline reveals by line / block with dignity
      if (headlineRef.current) {
        tl.to(
          headlineRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 1.1,
            ease: "power3.out",
          },
          0.55
        );
      }

      // 4. Supporting text & CTAs settle into place
      if (supportingTextRef.current) {
        tl.to(
          supportingTextRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
          },
          0.8
        );
      }

      if (ctaGroupRef.current) {
        tl.to(
          ctaGroupRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
          },
          0.95
        );
      }

      // Subtle desktop pointer parallax (fine pointer devices only)
      const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
      if (hasFinePointer && window.innerWidth >= 1024 && imageRef.current) {
        const xTo = gsap.quickTo(imageRef.current, "x", {
          duration: 1.2,
          ease: "power2.out",
        });
        const yTo = gsap.quickTo(imageRef.current, "y", {
          duration: 1.2,
          ease: "power2.out",
        });

        const handleMouseMove = (e: MouseEvent) => {
          if (isOffscreenRef.current) return;
          const { innerWidth, innerHeight } = window;
          const normX = (e.clientX / innerWidth - 0.5) * 2; // -1 to 1
          const normY = (e.clientY / innerHeight - 0.5) * 2; // -1 to 1

          // Very small, restrained displacement (+/- 14px horizontally, +/- 8px vertically)
          xTo(normX * -14);
          yTo(normY * -8);
        };

        window.addEventListener("mousemove", handleMouseMove, { passive: true });

        // Clean up mouse listener inside gsap.context return
        return () => {
          window.removeEventListener("mousemove", handleMouseMove);
        };
      }
    }, containerRef);

    // Track hero visibility to stop parallax when scrolled past
    const observer = new IntersectionObserver(
      ([entry]) => {
        isOffscreenRef.current = !entry.isIntersecting;
      },
      { threshold: 0.05 }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
      ctx.revert(); // Full cleanup of timelines and inline styles
    };
  }, [containerRef, imageRef, eyebrowRef, headlineRef, supportingTextRef, ctaGroupRef, isIntroActive]);
}
