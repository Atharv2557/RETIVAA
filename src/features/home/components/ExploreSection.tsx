"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "framer-motion";
import { Container } from "@/components/layout/Container";
import { homeContent } from "@/content/home";
import { TextReveal, TextRevealGroup } from "@/components/motion/TextReveal";

export function ExploreSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageFrameRef = useRef<HTMLDivElement>(null);
  const imageParallaxRef = useRef<HTMLDivElement>(null);
  const washLayerRef = useRef<HTMLDivElement>(null);
  const finalLayerRef = useRef<HTMLDivElement>(null);

  const shouldReduceMotion = useReducedMotion();
  const explore = homeContent.explore;

  const headlineLines = [
    "Beyond the camp,",
    "the desert begins.",
  ] as const;

  const narrativeLines = [
    "Step beyond the camp and into the open Thar — across sweeping",
    "dunes, quiet sunset trails and desert journeys shaped by Jaisalmer.",
  ] as const;

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const imageFrame = imageFrameRef.current;
    const imageParallax = imageParallaxRef.current;
    const washLayer = washLayerRef.current;
    const finalLayer = finalLayerRef.current;

    if (!section || !imageFrame) return;

    const prefersReduced =
      shouldReduceMotion ||
      (typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches);

    if (prefersReduced) {
      if (finalLayer) {
        finalLayer.style.webkitMaskSize = "300% 300%";
        finalLayer.style.maskSize = "300% 300%";
      }
      return;
    }

    const ctx = gsap.context(() => {
      // 1. Initial pencil-sketch frame reveal
      gsap.set(imageFrame, {
        clipPath: "inset(5% 5% 5% 5%)",
        opacity: 0,
        scale: 0.97,
      });

      gsap.to(imageFrame, {
        clipPath: "inset(0% 0% 0% 0%)",
        opacity: 1,
        scale: 1,
        duration: 1.8,
        ease: "power2.out",
        clearProps: "clipPath,scale",
        scrollTrigger: {
          trigger: imageFrame,
          start: "top 85%",
          once: true,
        },
      });

      // 2. 3-Stage Sketch -> Golden Wash -> Final Paint scrub reveal
      const maskProxy = { wash: 0, final: 0 };
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: imageFrame,
          start: "top 65%",
          end: "bottom 15%",
          scrub: 1.5,
        }
      });

      // Phase 1: Reveal Golden Wash over the Pencil Sketch
      if (washLayer) {
        tl.to(maskProxy, {
          wash: 250,
          ease: "power1.inOut",
          duration: 1,
          onUpdate: () => {
            washLayer.style.webkitMaskSize = `${maskProxy.wash}% ${maskProxy.wash}%`;
            washLayer.style.maskSize = `${maskProxy.wash}% ${maskProxy.wash}%`;
          },
        }, 0);
      }

      // Phase 2: Reveal Final Cinematic over the Golden Wash (Starts halfway)
      if (finalLayer) {
        tl.to(maskProxy, {
          final: 250,
          ease: "power1.inOut",
          duration: 1,
          onUpdate: () => {
            finalLayer.style.webkitMaskSize = `${maskProxy.final}% ${maskProxy.final}%`;
            finalLayer.style.maskSize = `${maskProxy.final}% ${maskProxy.final}%`;
          },
        }, 0.5);
      }

      // 3. Subtle internal vertical parallax (max 3% travel inside stationary outer frame)
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
      id={explore.id}
      ref={sectionRef}
      aria-labelledby="explore-heading"
      className="scroll-mt-20 relative bg-[#191918] text-[#F6EFE3] pt-24 pb-16 sm:pt-32 sm:pb-24 lg:pt-40 lg:pb-32 overflow-hidden select-none border-b border-[#D7B98E]/10"
    >
      {/* SVG Filter for True Edge Detection Pencil Sketch */}
      <svg aria-hidden="true" className="absolute w-0 h-0">
        <filter id="pencil-edges">
          {/* 1. Grayscale conversion */}
          <feColorMatrix type="matrix" values="
            0.33 0.33 0.33 0 0
            0.33 0.33 0.33 0 0
            0.33 0.33 0.33 0 0
            0    0    0    1 0" in="SourceGraphic" result="gray" />
          
          {/* 2. Edge Detection (Laplacian Kernel) */}
          <feConvolveMatrix order="3 3" kernelMatrix="-1 -1 -1  -1 8 -1  -1 -1 -1" in="gray" result="edges" preserveAlpha="true" />
          
          {/* 3. Invert edges (Dark lines on light background) */}
          <feColorMatrix type="matrix" values="
            -1  0  0  0  1
             0 -1  0  0  1
             0  0 -1  0  1
             0  0  0  1  0" in="edges" result="invEdges" />
             
          {/* 4. Map to Sand Paper & Brown Charcoal tones */}
          {/* Background Maps to: #E8DCC4 (0.91, 0.86, 0.77) */}
          {/* Lines Map to: #4A3022 (0.29, 0.19, 0.13) */}
          <feComponentTransfer in="invEdges" result="tinted">
            <feFuncR type="linear" slope="0.62" intercept="0.29" />
            <feFuncG type="linear" slope="0.67" intercept="0.19" />
            <feFuncB type="linear" slope="0.64" intercept="0.13" />
          </feComponentTransfer>
        </filter>
      </svg>

      {/* 1. Subtle top tone transition from The Stay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-black/40 via-black/10 to-transparent"
      />

      {/* 2. Ambient deep dusk / golden hour sand glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-48 left-1/4 w-[600px] h-[600px] rounded-full bg-radial from-[#D7B98E]/10 via-[#B88A44]/04 to-transparent blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-48 right-10 w-[550px] h-[550px] rounded-full bg-radial from-[#A65335]/08 via-transparent to-transparent blur-3xl"
      />

      <Container size="wide" className="relative z-10">
        <TextRevealGroup start="top 78%">
          {/* -------------------------------------------------------------- */}
          {/* ASYMMETRICAL EDITORIAL HEADER                                  */}
          {/* -------------------------------------------------------------- */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end mb-12 sm:mb-16 lg:mb-20">
            <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-left">
              <div className="flex items-center gap-3">
                <TextReveal
                  as="span"
                  variant="eyebrow"
                  className="text-[11px] sm:text-xs font-semibold tracking-[0.34em] uppercase text-[#B88A44]"
                >
                  {explore.eyebrow}
                </TextReveal>
                <span className="h-px w-9 bg-[#B88A44]/40" aria-hidden="true" />
              </div>

              <TextReveal
                as="h2"
                id="explore-heading"
                variant="heading"
                lines={headlineLines}
                className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-[3.75rem] xl:text-[4.25rem] font-normal leading-[1.08] text-[#F6EFE3] text-balance"
              />
            </div>

            <div className="lg:col-span-5 text-left lg:pb-2">
              <TextReveal
                as="p"
                variant="body"
                lines={narrativeLines}
                className="text-[#D7B98E]/80 text-sm sm:text-base leading-relaxed max-w-xl font-light"
              />
            </div>
          </div>

          {/* -------------------------------------------------------------- */}
          {/* PANORAMIC DESERT PHOTOGRAPHY: 3-Stage Pencil to Paint Reveal   */}
          {/* -------------------------------------------------------------- */}
          <div className="w-full mb-14 sm:mb-20 lg:mb-24">
            <div
              ref={imageFrameRef}
              className="relative aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9] lg:aspect-[16/8] w-full overflow-hidden rounded-xs bg-[#E8DCC4] border border-[#D7B98E]/15 shadow-2xl"
            >
              <div
                ref={imageParallaxRef}
                className="relative w-full h-[106%] -top-[3%] overflow-hidden will-change-transform"
              >
                {/* STAGE 1: Pencil-Outline Sketch (Base Layer) */}
                <div className="absolute inset-0 bg-[#E8DCC4]">
                  <Image
                    src={explore.image.src}
                    alt=""
                    fill
                    sizes="(min-width: 1440px) 1400px, 100vw"
                    priority={false}
                    className="object-cover object-center mix-blend-multiply opacity-90"
                    style={{
                      filter: "url(#pencil-edges)",
                    }}
                  />
                  {/* Subtle paper grain texture overlay */}
                  <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
                </div>

                {/* STAGE 2: Golden Tonal Wash (Middle Layer) */}
                <div
                  ref={washLayerRef}
                  className="absolute inset-0 will-change-transform"
                  style={{
                    WebkitMaskImage: 'radial-gradient(ellipse at 50% 80%, black 15%, rgba(0,0,0,0.5) 45%, transparent 75%)',
                    WebkitMaskRepeat: 'no-repeat',
                    WebkitMaskPosition: 'center',
                    WebkitMaskSize: '0% 0%',
                    maskImage: 'radial-gradient(ellipse at 50% 80%, black 15%, rgba(0,0,0,0.5) 45%, transparent 75%)',
                    maskRepeat: 'no-repeat',
                    maskPosition: 'center',
                    maskSize: '0% 0%',
                  }}
                >
                  <Image
                    src={explore.image.src}
                    alt=""
                    fill
                    quality={95}
                    sizes="(min-width: 1440px) 1400px, 100vw"
                    priority={false}
                    className="object-cover object-center"
                    style={{
                      filter: "sepia(0.8) hue-rotate(-10deg) saturate(1.8) brightness(1.15) contrast(1.1)",
                    }}
                  />
                  {/* Amber/Gold tint overlay */}
                  <div className="absolute inset-0 bg-[#D7B98E] mix-blend-color opacity-30" />
                </div>

                {/* STAGE 3: Final Cinematic Image (Top Layer) */}
                <div
                  ref={finalLayerRef}
                  className="absolute inset-0 will-change-transform"
                  style={{
                    WebkitMaskImage: 'radial-gradient(ellipse at 50% 80%, black 10%, rgba(0,0,0,0.7) 40%, transparent 70%)',
                    WebkitMaskRepeat: 'no-repeat',
                    WebkitMaskPosition: 'center',
                    WebkitMaskSize: '0% 0%',
                    maskImage: 'radial-gradient(ellipse at 50% 80%, black 10%, rgba(0,0,0,0.7) 40%, transparent 70%)',
                    maskRepeat: 'no-repeat',
                    maskPosition: 'center',
                    maskSize: '0% 0%',
                  }}
                >
                  <Image
                    src={explore.image.src}
                    alt={explore.image.alt}
                    fill
                    quality={95}
                    sizes="(min-width: 1440px) 1400px, 100vw"
                    priority={false}
                    className="object-cover object-center"
                  />
                </div>

                {/* Overlay vignette to preserve edge depth */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-[#191918]/60 via-transparent to-black/20 pointer-events-none"
                />
              </div>

              {/* Minimalist Editorial Corner Tag */}
              {explore.image.caption && (
                <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 pointer-events-none hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
                  <span className="text-[#D7B98E] text-[10px]" aria-hidden="true">
                    ☼
                  </span>
                  <span className="text-[10px] font-mono tracking-[0.25em] text-[#F6EFE3]/80 uppercase">
                    {explore.image.caption}
                  </span>
                </div>
              )}
            </div>
          </div>
        </TextRevealGroup>
      </Container>
    </section>
  );
}
