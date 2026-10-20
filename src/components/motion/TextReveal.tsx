"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "framer-motion";

export type TextRevealVariant =
  | "heading"
  | "body"
  | "eyebrow"
  | "cta"
  | "meta";

interface TextRevealGroupContextValue {
  isGrouped: boolean;
  groupRef: RefObject<HTMLElement | null>;
}

const TextRevealGroupContext = createContext<TextRevealGroupContextValue>({
  isGrouped: false,
  groupRef: { current: null },
});

// ============================================================================
// 1. TEXT REVEAL GROUP (Orchestrates all child text in a single ScrollTrigger)
// ============================================================================

export interface TextRevealGroupProps {
  children: ReactNode;
  triggerRef?: RefObject<HTMLElement | null>;
  start?: string;
  className?: string;
  immediate?: boolean;
  onTimelineReady?: (tl: gsap.core.Timeline) => void;
}

export function TextRevealGroup({
  children,
  triggerRef,
  start = "top 78%",
  className = "",
  immediate = false,
  onTimelineReady,
}: TextRevealGroupProps) {
  const groupRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Default to the content container itself so animation only fires when content enters viewport
    const container = triggerRef?.current || groupRef.current;
    if (!container) return;

    const prefersReduced =
      shouldReduceMotion ||
      (typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches);

    if (prefersReduced) {
      return;
    }

    const ctx = gsap.context(() => {
      // Find all classified foreground text reveal targets within this group
      const eyebrows = container.querySelectorAll<HTMLElement>(
        ".text-reveal-eyebrow-fg"
      );
      const headings = container.querySelectorAll<HTMLElement>(
        ".text-reveal-heading-fg"
      );
      const bodies = container.querySelectorAll<HTMLElement>(
        ".text-reveal-body-fg"
      );
      const metas = container.querySelectorAll<HTMLElement>(
        ".text-reveal-meta-fg"
      );
      const ctas = container.querySelectorAll<HTMLElement>(
        ".text-reveal-cta-fg"
      );

      // Ensure hidden state on GSAP initialization without relying only on CSS
      if (eyebrows.length) {
        gsap.set(eyebrows, { clipPath: "inset(0% 100% 0% 0%)" });
      }
      if (headings.length) {
        gsap.set(headings, { clipPath: "inset(0% 100% 0% 0%)" });
      }
      if (bodies.length) {
        gsap.set(bodies, {
          opacity: 0,
          y: 6,
          clipPath: "inset(0% 100% 0% 0%)",
        });
      }
      if (metas.length) {
        gsap.set(metas, { clipPath: "inset(0% 100% 0% 0%)" });
      }
      if (ctas.length) {
        gsap.set(ctas, { opacity: 0, y: 10 });
      }

      // Master timeline: Calm, slow, line-by-line editorial reveal
      const tl = gsap.timeline({
        scrollTrigger: immediate
          ? undefined
          : {
              trigger: container,
              start,
              once: true,
            },
      });

      // Step 1: Eyebrow (~1.0s steady left-to-right wipe over ghost text)
      if (eyebrows.length) {
        tl.to(
          eyebrows,
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.0,
            ease: "power2.out",
            stagger: 0.1,
            clearProps: "clipPath",
          },
          0
        );
      }

      // Step 2: Main Headings (Line-by-line: 1.45s per line, 0.27s stagger, power2.out)
      const headingStartTime = eyebrows.length ? 0.2 : 0;
      if (headings.length) {
        tl.to(
          headings,
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.45,
            ease: "power2.out",
            stagger: 0.27,
            clearProps: "clipPath",
          },
          headingStartTime
        );
      }

      // Step 3: Paragraphs / Body Lines (Line-by-line: 0.95s per line, 0.13s stagger, starts 0.65s after heading begins)
      const paragraphStartTime = headingStartTime + 0.65;
      if (bodies.length) {
        tl.to(
          bodies,
          {
            opacity: 1,
            y: 0,
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 0.95,
            ease: "power2.out",
            stagger: 0.13,
            clearProps: "transform,opacity,clipPath",
          },
          paragraphStartTime
        );
      }

      // Step 4: Metadata / Orientation Labels (~0.9s wipe over ghost layer)
      const metaStartTime = paragraphStartTime + 0.45;
      if (metas.length) {
        tl.to(
          metas,
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 0.9,
            ease: "power2.out",
            stagger: 0.1,
            clearProps: "clipPath",
          },
          metaStartTime
        );
      }

      // Step 5: CTAs (0.75s soft rise & fade)
      const ctaStartTime = paragraphStartTime + 0.65;
      if (ctas.length) {
        tl.to(
          ctas,
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: "power2.out",
            stagger: 0.1,
            clearProps: "transform,opacity",
          },
          ctaStartTime
        );
      }

      if (onTimelineReady) {
        onTimelineReady(tl);
      }
    }, container);

    return () => {
      ctx.revert();
    };
  }, [shouldReduceMotion, immediate, start, triggerRef, onTimelineReady]);

  return (
    <TextRevealGroupContext.Provider
      value={{ isGrouped: true, groupRef: triggerRef || groupRef }}
    >
      <div ref={groupRef} className={className}>
        {children}
      </div>
    </TextRevealGroupContext.Provider>
  );
}

// ============================================================================
// 2. TEXT REVEAL (Dual-layer architecture: Ghost Base + Masked Foreground)
// ============================================================================

export interface TextRevealProps {
  children?: ReactNode;
  lines?: readonly string[];
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
  variant?: TextRevealVariant;
  className?: string;
  lineClassName?: string;
  delay?: number;
  triggerRef?: RefObject<HTMLElement | null>;
  start?: string;
  immediate?: boolean;
  id?: string;
}

function splitTextIntoLines(text: string, targetWordsPerLine = 8): string[] {
  const trimmed = text.trim();
  if (!trimmed) return [];
  const words = trimmed.split(/\s+/);
  if (words.length <= targetWordsPerLine + 2) {
    return [trimmed];
  }
  const result: string[] = [];
  let currentWords: string[] = [];

  for (let i = 0; i < words.length; i++) {
    currentWords.push(words[i]);
    const endsWithPunctuation = /[.,—;:!?]$/.test(words[i]);
    const reachedTarget = currentWords.length >= targetWordsPerLine;
    const isNearEnd = words.length - (i + 1) < 4;

    if (
      (reachedTarget ||
        (endsWithPunctuation && currentWords.length >= targetWordsPerLine - 2)) &&
      !isNearEnd
    ) {
      result.push(currentWords.join(" "));
      currentWords = [];
    }
  }

  if (currentWords.length > 0) {
    result.push(currentWords.join(" "));
  }

  return result;
}

export function TextReveal({
  children,
  lines,
  as: Component = "div",
  variant = "body",
  className = "",
  lineClassName = "",
  delay = 0,
  triggerRef,
  start = "top 78%",
  immediate = false,
  id,
}: TextRevealProps) {
  const { isGrouped } = useContext(TextRevealGroupContext);
  const elementRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Resolve lines array: explicit lines prop takes precedence.
  // If variant === "body" and children is a long string, auto-partition into semantic line-by-line groups.
  const resolvedLines: readonly string[] | null = lines && lines.length > 0
    ? lines
    : typeof children === "string" && variant === "body" && children.trim().split(/\s+/).length > 6
      ? splitTextIntoLines(children)
      : null;

  // Standalone ScrollTrigger lifecycle (only active when NOT nested inside TextRevealGroup)
  useEffect(() => {
    if (isGrouped) return;

    gsap.registerPlugin(ScrollTrigger);

    const el = elementRef.current;
    if (!el) return;

    const prefersReduced =
      shouldReduceMotion ||
      (typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches);

    if (prefersReduced) {
      return;
    }

    const triggerTarget = triggerRef?.current || el;

    const ctx = gsap.context(() => {
      const eyebrows = el.querySelectorAll<HTMLElement>(
        ".text-reveal-eyebrow-fg"
      );
      const headings = el.querySelectorAll<HTMLElement>(
        ".text-reveal-heading-fg"
      );
      const bodies = el.querySelectorAll<HTMLElement>(".text-reveal-body-fg");
      const metas = el.querySelectorAll<HTMLElement>(".text-reveal-meta-fg");
      const ctas = el.querySelectorAll<HTMLElement>(".text-reveal-cta-fg");

      if (variant === "heading") {
        const targets = headings.length > 0 ? headings : [el];
        gsap.set(targets, { clipPath: "inset(0% 100% 0% 0%)" });

        gsap.to(targets, {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.45,
          ease: "power2.out",
          stagger: 0.27,
          delay,
          clearProps: "clipPath",
          scrollTrigger: immediate
            ? undefined
            : {
                trigger: triggerTarget,
                start,
                once: true,
              },
        });
      } else if (variant === "eyebrow") {
        const targets = eyebrows.length > 0 ? eyebrows : [el];
        gsap.set(targets, { clipPath: "inset(0% 100% 0% 0%)" });

        gsap.to(targets, {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.0,
          ease: "power2.out",
          stagger: 0.1,
          delay,
          clearProps: "clipPath",
          scrollTrigger: immediate
            ? undefined
            : {
                trigger: triggerTarget,
                start,
                once: true,
              },
        });
      } else if (variant === "body") {
        const targets = bodies.length > 0 ? bodies : [el];
        gsap.set(targets, {
          opacity: 0,
          y: 6,
          clipPath: "inset(0% 100% 0% 0%)",
        });

        gsap.to(targets, {
          opacity: 1,
          y: 0,
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.95,
          ease: "power2.out",
          stagger: 0.13,
          delay,
          clearProps: "transform,opacity,clipPath",
          scrollTrigger: immediate
            ? undefined
            : {
                trigger: triggerTarget,
                start,
                once: true,
              },
        });
      } else if (variant === "meta") {
        const targets = metas.length > 0 ? metas : [el];
        gsap.set(targets, { clipPath: "inset(0% 100% 0% 0%)" });

        gsap.to(targets, {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.9,
          ease: "power2.out",
          stagger: 0.1,
          delay,
          clearProps: "clipPath",
          scrollTrigger: immediate
            ? undefined
            : {
                trigger: triggerTarget,
                start,
                once: true,
              },
        });
      } else if (variant === "cta") {
        const targets = ctas.length > 0 ? ctas : [el];
        gsap.set(targets, { opacity: 0, y: 10 });

        gsap.to(targets, {
          opacity: 1,
          y: 0,
          duration: 0.75,
          ease: "power2.out",
          stagger: 0.1,
          delay,
          clearProps: "transform,opacity",
          scrollTrigger: immediate
            ? undefined
            : {
                trigger: triggerTarget,
                start,
                once: true,
              },
        });
      }
    }, el);

    return () => {
      ctx.revert();
    };
  }, [
    isGrouped,
    variant,
    delay,
    immediate,
    start,
    triggerRef,
    shouldReduceMotion,
  ]);

  // Initial CSS styles applied directly on HTML render to prevent preloaded text or flash
  const headingStyle: CSSProperties = shouldReduceMotion
    ? { clipPath: "none", opacity: 1 }
    : { clipPath: "inset(0% 100% 0% 0%)" };

  const eyebrowStyle: CSSProperties = shouldReduceMotion
    ? { clipPath: "none", opacity: 1 }
    : { clipPath: "inset(0% 100% 0% 0%)" };

  const bodyLineStyle: CSSProperties = shouldReduceMotion
    ? { clipPath: "none", opacity: 1, transform: "none" }
    : {
        clipPath: "inset(0% 100% 0% 0%)",
        opacity: 0,
        transform: "translateY(6px)",
      };

  const metaStyle: CSSProperties = shouldReduceMotion
    ? { clipPath: "none", opacity: 1 }
    : { clipPath: "inset(0% 100% 0% 0%)" };

  const ctaStyle: CSSProperties = shouldReduceMotion
    ? { opacity: 1, transform: "none" }
    : { opacity: 0, transform: "translateY(10px)" };

  // --------------------------------------------------------------------------
  // Variant A: Explicit / Resolved Line-by-Line Mode (Headings & Paragraphs)
  // --------------------------------------------------------------------------
  if (resolvedLines && resolvedLines.length > 0) {
    const isHeading = variant === "heading";

    return (
      <Component
        ref={elementRef as never}
        id={id}
        className={className}
        data-text-reveal={variant}
      >
        {resolvedLines.map((line, idx) => (
          <span
            key={idx}
            className={`block overflow-hidden ${
              isHeading
                ? "py-[0.1em] -my-[0.1em]"
                : "py-[0.06em] -my-[0.06em]"
            }`}
          >
            <span className="grid grid-cols-1 grid-rows-1 relative">
              {/* Back Layer: Ghost Text (exact spatial & typography overlap, aria-hidden) */}
              <span
                className={`col-start-1 row-start-1 select-none pointer-events-none ${
                  isHeading ? "opacity-[0.14]" : "opacity-[0.16]"
                } text-current ${shouldReduceMotion ? "hidden" : ""}`}
                aria-hidden="true"
              >
                {line}
              </span>
              {/* Foreground Layer: Individual Line Mask & Progressive Reveal (semantic text) */}
              <span
                style={isHeading ? headingStyle : bodyLineStyle}
                className={`${
                  isHeading
                    ? "text-reveal-heading-fg will-change-[clip-path]"
                    : "text-reveal-body-fg will-change-[transform,opacity,clip-path]"
                } col-start-1 row-start-1 ${lineClassName}`}
              >
                {line}
              </span>
            </span>
          </span>
        ))}
      </Component>
    );
  }

  // --------------------------------------------------------------------------
  // Variant B: Single-line heading with dual-layer ghost alignment
  // --------------------------------------------------------------------------
  if (variant === "heading") {
    return (
      <Component
        ref={elementRef as never}
        id={id}
        className={className}
        data-text-reveal="heading"
      >
        <span className="block overflow-hidden py-[0.1em] -my-[0.1em]">
          <span className="grid grid-cols-1 grid-rows-1 relative">
            <span
              className={`col-start-1 row-start-1 select-none pointer-events-none opacity-[0.14] text-current ${shouldReduceMotion ? "hidden" : ""}`}
              aria-hidden="true"
            >
              {children}
            </span>
            <span
              style={headingStyle}
              className={`text-reveal-heading-fg col-start-1 row-start-1 will-change-[clip-path] ${lineClassName}`}
            >
              {children}
            </span>
          </span>
        </span>
      </Component>
    );
  }

  // --------------------------------------------------------------------------
  // Variant C: Eyebrow label with dual-layer ghost alignment
  // --------------------------------------------------------------------------
  if (variant === "eyebrow") {
    return (
      <Component
        ref={elementRef as never}
        id={id}
        className={className}
        data-text-reveal="eyebrow"
      >
        <span className="inline-grid grid-cols-1 grid-rows-1 relative overflow-hidden py-[0.06em] -my-[0.06em]">
          <span
            className={`col-start-1 row-start-1 select-none pointer-events-none opacity-[0.18] text-current ${shouldReduceMotion ? "hidden" : ""}`}
            aria-hidden="true"
          >
            {children}
          </span>
          <span
            style={eyebrowStyle}
            className={`text-reveal-eyebrow-fg col-start-1 row-start-1 will-change-[clip-path] ${lineClassName}`}
          >
            {children}
          </span>
        </span>
      </Component>
    );
  }

  // --------------------------------------------------------------------------
  // Variant D: Paragraph / Body text (Fallback when lines array is not supplied)
  // --------------------------------------------------------------------------
  if (variant === "body") {
    return (
      <Component
        ref={elementRef as never}
        id={id}
        className={className}
        data-text-reveal="body"
      >
        <span className="grid grid-cols-1 grid-rows-1 relative">
          <span
            className={`col-start-1 row-start-1 select-none pointer-events-none opacity-[0.16] text-current ${shouldReduceMotion ? "hidden" : ""}`}
            aria-hidden="true"
          >
            {children}
          </span>
          <span
            style={bodyLineStyle}
            className={`text-reveal-body-fg col-start-1 row-start-1 will-change-[transform,opacity,clip-path] ${lineClassName}`}
          >
            {children}
          </span>
        </span>
      </Component>
    );
  }

  // --------------------------------------------------------------------------
  // Variant E: Metadata / Section numbering labels with dual-layer ghost
  // --------------------------------------------------------------------------
  if (variant === "meta") {
    return (
      <Component
        ref={elementRef as never}
        id={id}
        className={className}
        data-text-reveal="meta"
      >
        <span className="inline-grid grid-cols-1 grid-rows-1 relative overflow-hidden py-[0.06em] -my-[0.06em]">
          <span
            className={`col-start-1 row-start-1 select-none pointer-events-none opacity-[0.18] text-current ${shouldReduceMotion ? "hidden" : ""}`}
            aria-hidden="true"
          >
            {children}
          </span>
          <span
            style={metaStyle}
            className={`text-reveal-meta-fg col-start-1 row-start-1 will-change-[clip-path] ${lineClassName}`}
          >
            {children}
          </span>
        </span>
      </Component>
    );
  }

  // --------------------------------------------------------------------------
  // Variant F: CTA wrapper with soft rise & fade
  // --------------------------------------------------------------------------
  return (
    <Component
      ref={elementRef as never}
      id={id}
      className={className}
      data-text-reveal="cta"
    >
      <span
        style={ctaStyle}
        className={`text-reveal-cta-fg block will-change-[transform,opacity] ${lineClassName}`}
      >
        {children}
      </span>
    </Component>
  );
}
