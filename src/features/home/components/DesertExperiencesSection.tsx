"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "framer-motion";
import { Container } from "@/components/layout/Container";
import { DESERT_EXPERIENCES_CONTENT } from "@/content/experiences";
import { TextReveal } from "@/components/motion/TextReveal";

export function DesertExperiencesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const content = DESERT_EXPERIENCES_CONTENT;

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    if (!section) return;

    const prefersReduced =
      shouldReduceMotion ||
      (typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches);

    if (prefersReduced) return;

    const cards = gsap.utils.toArray<HTMLElement>(".photo-card");
    const texts = gsap.utils.toArray<HTMLElement>(".text-block");
    const totalItems = cards.length;

    if (totalItems === 0) return;

    // 1. Initial GSAP setup
    gsap.set(cards, {
      transformStyle: "preserve-3d",
      transformOrigin: "top center", // Pivot at the top edge (calendar style)
      rotateX: 0,
      z: 0,
      opacity: 1,
      zIndex: (i) => totalItems - i,
    });

    gsap.set(texts, {
      opacity: (i) => (i === 0 ? 1 : 0),
      y: (i) => (i === 0 ? 0 : 30),
      pointerEvents: (i) => (i === 0 ? "auto" : "none"),
    });

    // 2. Main Timeline pinned to section
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: `+=${totalItems * 100}%`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
      },
    });

    // 3. Sequence the Calendar Flips and Text Changes
    for (let i = 0; i < totalItems - 1; i++) {
      // Photo Card flips up (bottom comes toward viewer, goes up over the top)
      tl.to(
        cards[i],
        {
          rotateX: 160, 
          z: -50, // Slight push back into the screen to prevent clipping on mobile
          opacity: 0, 
          ease: "power1.inOut",
          duration: 1,
        },
        i
      );

      // Current Text fades out and goes up
      tl.to(
        texts[i],
        {
          opacity: 0,
          y: -30,
          ease: "power2.in",
          duration: 0.45,
          pointerEvents: "none",
        },
        i
      );

      // Next Text fades in from below
      tl.to(
        texts[i + 1],
        {
          opacity: 1,
          y: 0,
          ease: "power2.out",
          duration: 0.45,
          pointerEvents: "auto",
        },
        i + 0.55
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.vars.trigger === section) t.kill();
      });
    };
  }, [shouldReduceMotion]);

  return (
    <section
      id={content.id}
      ref={sectionRef}
      aria-labelledby="desert-experiences-heading"
      className="relative bg-[#120F0D] text-[#F6EFE3] overflow-hidden select-none border-b border-[#D7B98E]/10 h-[100svh]"
    >
      {/* Ambient background glows */}
      <div
        aria-hidden="true"
        className="absolute top-1/4 left-1/4 w-[800px] h-[800px] rounded-full bg-radial from-[#B88A44]/05 via-[#A65335]/02 to-transparent blur-3xl pointer-events-none"
      />

      <Container className="h-full px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row items-center justify-center h-full gap-4 lg:gap-16 pt-20 lg:pt-0 pb-12 lg:pb-0">
          
          {/* ========================================================================
              LEFT/BOTTOM: Dynamic Text Block
              Order is 2 on mobile (bottom), 1 on desktop (left)
              ======================================================================== */}
          <div className="w-full lg:w-[45%] h-[35svh] lg:h-full relative flex items-center justify-center z-20 order-2 lg:order-1">
            
            {/* Global Eyebrow for the whole section */}
            <div className="absolute top-2 lg:top-[30%] left-0 w-full flex items-center gap-3">
              <TextReveal
                as="span"
                variant="eyebrow"
                className="text-[10px] lg:text-xs font-semibold tracking-[0.34em] uppercase text-[#B88A44]"
              >
                {content.eyebrow}
              </TextReveal>
              <span className="h-px w-9 bg-[#B88A44]/40" />
            </div>

            {/* Stacked Dynamic Texts */}
            <div className="relative w-full h-[180px] sm:h-[220px] lg:h-[300px] mt-10 lg:mt-0">
              {content.experiences.map((exp, i) => (
                <div
                  key={`text-${exp.id}`}
                  className="text-block absolute inset-0 flex flex-col justify-center"
                >
                  <span className="font-mono text-xs lg:text-sm tracking-[0.3em] font-medium text-[#B88A44] mb-2 lg:mb-4">
                    0{i + 1}
                  </span>
                  <h3 className="font-serif text-[28px] sm:text-4xl lg:text-[4rem] font-normal leading-[1.1] text-[#F6EFE3] mb-3 lg:mb-6 uppercase drop-shadow-md">
                    {exp.title}
                  </h3>
                  <p className="text-[#D7B98E]/80 text-[13px] sm:text-sm lg:text-base leading-relaxed font-light max-w-sm lg:max-w-md">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ========================================================================
              RIGHT/TOP: Calendar Page Flip 3D Stage
              Order is 1 on mobile (top), 2 on desktop (right)
              ======================================================================== */}
          <div className="w-full lg:w-[55%] h-[45svh] lg:h-full flex items-center justify-center relative perspective-[1500px] perspective-origin-center z-10 order-1 lg:order-2">
            
            {/* The Binder / Rings visual */}
            <div className="absolute top-[5%] lg:top-[12%] xl:top-[15%] left-1/2 -translate-x-1/2 w-[70%] max-w-[280px] lg:max-w-[400px] h-4 flex justify-between px-6 lg:px-10 z-30 pointer-events-none opacity-50">
               <div className="w-2.5 lg:w-3.5 h-6 lg:h-8 bg-gradient-to-b from-[#B88A44] to-[#4A3022] rounded-full shadow-lg" />
               <div className="w-2.5 lg:w-3.5 h-6 lg:h-8 bg-gradient-to-b from-[#B88A44] to-[#4A3022] rounded-full shadow-lg" />
            </div>

            <div className="relative w-[90%] max-w-[340px] sm:max-w-[400px] lg:max-w-[550px] aspect-[4/5] rounded-md shadow-2xl">
              {content.experiences.map((exp, i) => (
                <div
                  key={`photo-${exp.id}`}
                  className="photo-card absolute inset-0 w-full h-full rounded-md overflow-hidden border border-[#D7B98E]/30 bg-[#120F0D]"
                >
                  <Image
                    src={exp.image.src}
                    alt={exp.image.alt}
                    fill
                    quality={95}
                    sizes="(max-width: 1024px) 90vw, 50vw"
                    priority={i === 0}
                    className="object-cover"
                  />
                  {/* Subtle dark gradient to ensure text/UI around it pops */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#120F0D]/60 via-transparent to-transparent pointer-events-none" />
                </div>
              ))}
            </div>
            
            {/* Scroll Indicator */}
            <div className="absolute bottom-2 lg:bottom-12 right-6 lg:right-1/2 lg:translate-x-1/2 z-20">
              <p className="text-[9px] lg:text-[10px] font-mono tracking-[0.2em] uppercase text-[#B88A44]/60 animate-pulse">
                Scroll
              </p>
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
}
