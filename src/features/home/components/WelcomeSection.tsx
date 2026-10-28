"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "framer-motion";
import { Container } from "@/components/layout/Container";
import { homeContent } from "@/content/home";
import { TextReveal, TextRevealGroup } from "@/components/motion/TextReveal";

export function WelcomeSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageFrameRef = useRef<HTMLDivElement>(null);
  const imageParallaxRef = useRef<HTMLDivElement>(null);

  const shouldReduceMotion = useReducedMotion();
  const welcome = homeContent.welcome;

  // Split headline for responsive editorial line-by-line mask reveal
  const headlineLines = [
    "A quieter way to",
    "experience Jaisalmer.",
  ] as const;

  // Split narrative into semantic lines for line-by-line mask reveal
  const narrativeLines = [
    "RETIVAA DESERT CAMP is a desert camp shaped around the simple",
    "pleasures of the Thar — staying close to the dunes,",
    "watching the light change across the sand, and spending",
    "evenings with the music and warmth of Rajasthan.",
  ] as const;

  // Image animations synchronized with the master TextRevealGroup
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const imageFrame = imageFrameRef.current;
    const imageParallax = imageParallaxRef.current;
    if (!section || !imageFrame) return;

    const prefersReduced =
      shouldReduceMotion ||
      (typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches);

    if (prefersReduced) {
      return;
    }

    const ctx = gsap.context(() => {
      // 1. Initial image frame mask state
      gsap.set(imageFrame, {
        clipPath: "inset(22% 0% 0% 0%)",
        scale: 1.025,
      });

      // 2. Image reveal triggered when imageFrame enters viewport
      gsap.to(imageFrame, {
        clipPath: "inset(0% 0% 0% 0%)",
        scale: 1,
        duration: 1.8,
        ease: "power2.out",
        clearProps: "clipPath,scale",
        scrollTrigger: {
          trigger: imageFrame,
          start: "top 78%",
          once: true,
        },
      });

      // 3. Subtle internal image parallax (max 4-6% travel inside stationary outer frame)
      if (imageParallax) {
        gsap.fromTo(
          imageParallax,
          { yPercent: -3 },
          {
            yPercent: 3,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2,
            },
          }
        );
      }
    }, section);

    return () => {
      ctx.revert();
    };
  }, [shouldReduceMotion]);

  return (
    <section
      id="camp-overview"
      ref={sectionRef}
      aria-labelledby="welcome-heading"
      className="scroll-mt-20 relative bg-[#F6EFE3] text-[#30251F] py-20 sm:py-28 md:py-28 lg:py-36 overflow-hidden select-none border-b border-[#30251F]/10"
    >
      {/* 1. Subtle soft gradient transition from Hero section */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 inset-x-0 h-28 sm:h-36 bg-gradient-to-b from-[#14110E]/[0.07] via-[#14110E]/[0.02] to-transparent"
      />

      {/* 2. Restrained desert atmosphere ambient glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 right-0 w-[500px] h-[500px] rounded-full bg-radial from-[#D7B98E]/16 via-[#B88A44]/05 to-transparent blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 left-0 w-[450px] h-[450px] rounded-full bg-radial from-[#A65335]/10 via-transparent to-transparent blur-3xl"
      />

      <Container size="wide" className="relative z-10">
        <TextRevealGroup start="top 78%">
          {/* Main Editorial Two-Column Composition */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 lg:gap-16 xl:gap-20 items-center">
            {/* Left Column: Semantic Editorial Content (~45%) */}
            <div className="lg:col-span-5 flex flex-col justify-center space-y-6 sm:space-y-8 text-left">
              <div className="space-y-3 sm:space-y-4">
                <TextReveal
                  as="span"
                  variant="eyebrow"
                  className="inline-block text-xs sm:text-[13px] font-semibold tracking-[0.32em] uppercase text-[#A65335]"
                >
                  {welcome.eyebrow}
                </TextReveal>

                <TextReveal
                  as="h2"
                  id="welcome-heading"
                  variant="heading"
                  lines={headlineLines}
                  className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] xl:text-[3.65rem] font-normal leading-[1.14] text-[#30251F] text-balance"
                />
              </div>

              <TextReveal
                as="p"
                variant="body"
                lines={narrativeLines}
                className="text-[#5A4D45] text-base sm:text-lg font-light leading-relaxed max-w-xl"
              />

              {/* Desktop Editorial CTA */}
              <TextReveal variant="cta" className="hidden lg:block pt-2">
                <a
                  href={welcome.cta.href}
                  className="group/cta inline-flex items-center gap-2.5 text-xs sm:text-[13px] font-semibold uppercase tracking-[0.2em] text-[#30251F] hover:text-[#A65335] transition-colors pb-1 border-b border-[#30251F]/30 hover:border-[#A65335] focus-visible:outline-2 focus-visible:outline-[#B88A44] rounded-xs"
                >
                  <span>{welcome.cta.label}</span>
                  <ArrowRight
                    size={14}
                    className="text-[#A65335] transition-transform duration-300 group-hover/cta:translate-x-1"
                  />
                </a>
              </TextReveal>
            </div>

            {/* Right Column: Architectural Photography Frame (~55%) */}
            <div className="lg:col-span-7 flex items-center justify-center">
              {/* Outer Stationary Frame */}
              <div
                ref={imageFrameRef}
                className="relative aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/5] w-full max-w-[620px] lg:max-w-none overflow-hidden rounded-xs sm:rounded-sm bg-[#D7B98E]/20 border border-[#30251F]/10 shadow-xs"
              >
                {/* Internal Image Frame for Smooth 6% Scrub Parallax */}
                <div
                  ref={imageParallaxRef}
                  className="relative w-full h-[112%] -top-[6%] overflow-hidden will-change-transform"
                >
                  <Image
                    src={welcome.image.src}
                    alt={welcome.image.alt}
                    fill
                    quality={95}
                    sizes="(min-width: 1440px) 720px, (min-width: 1024px) 55vw, 100vw"
                    priority={false}
                    className="object-cover object-center"
                  />

                  {/* Subtle warm desert overlay for visual harmony */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-[#30251F]/20 via-transparent to-transparent pointer-events-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Three Experience Pillars (Restrained Orientation Items) */}
          <div
            id="experience-pillars"
            className="mt-14 sm:mt-20 lg:mt-28 pt-8 sm:pt-12 border-t border-[#30251F]/15"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
              {welcome.pillars.map((pillar) => (
                <div
                  key={pillar.number}
                  className="group flex flex-col justify-between space-y-2.5 pt-4 sm:pt-0 select-none border-t border-[#30251F]/10 md:border-t-0 first:border-t-0"
                >
                  <div className="flex items-center justify-between">
                    <TextReveal
                      as="span"
                      variant="meta"
                      className="font-mono text-xs sm:text-[13px] font-semibold tracking-[0.26em] uppercase text-[#B88A44] group-hover:text-[#A65335] transition-colors"
                    >
                      {pillar.number} — {pillar.title}
                    </TextReveal>
                    <span
                      aria-hidden="true"
                      className="text-xs text-[#A65335] opacity-0 -translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0"
                    >
                      →
                    </span>
                  </div>
                  <TextReveal
                    as="p"
                    variant="body"
                    className="font-serif text-lg sm:text-xl lg:text-[1.32rem] font-normal leading-snug text-[#30251F] group-hover:text-[#A65335] transition-colors"
                  >
                    {pillar.description}
                  </TextReveal>
                </div>
              ))}
            </div>

            {/* Mobile Editorial CTA (Rendered below pillars in normal vertical flow) */}
            <TextReveal
              variant="cta"
              className="lg:hidden mt-8 sm:mt-10 pt-2 text-left"
            >
              <a
                href={welcome.cta.href}
                className="group/cta inline-flex items-center gap-2.5 text-xs sm:text-[13px] font-semibold uppercase tracking-[0.2em] text-[#30251F] hover:text-[#A65335] transition-colors pb-1 border-b border-[#30251F]/30 hover:border-[#A65335] focus-visible:outline-2 focus-visible:outline-[#B88A44] rounded-xs"
              >
                <span>{welcome.cta.label}</span>
                <ArrowRight
                  size={14}
                  className="text-[#A65335] transition-transform duration-300 group-hover/cta:translate-x-1"
                />
              </a>
            </TextReveal>
          </div>
        </TextRevealGroup>
      </Container>
    </section>
  );
}
