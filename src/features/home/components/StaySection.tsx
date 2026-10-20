"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "framer-motion";
import { Container } from "@/components/layout/Container";
import { homeContent } from "@/content/home";
import { TextReveal, TextRevealGroup } from "@/components/motion/TextReveal";

export function StaySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageFrameRef = useRef<HTMLDivElement>(null);
  const imageParallaxRef = useRef<HTMLDivElement>(null);

  const [isVideoActive, setIsVideoActive] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const modalBgRef = useRef<HTMLDivElement>(null);
  const iframeContainerRef = useRef<HTMLDivElement>(null);

  const shouldReduceMotion = useReducedMotion();
  const stay = homeContent.stay;

  // Split headline into exactly three lines for progressive line-by-line reveal
  const headlineLines = [
    "Luxury Tents.",
    "Timeless",
    "Experiences.",
  ] as const;

  // Split narrative paragraph into four lines for progressive line-by-line reveal
  const narrativeLines = [
    "Experience the perfect blend of traditional Rajasthani",
    "hospitality and modern comfort in our elegantly designed",
    "desert tents, where every detail is crafted for an",
    "unforgettable stay beneath the desert sky.",
  ] as const;

  // Image reveal and subtle internal scrub parallax
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
        clipPath: "inset(20% 0% 0% 0%)",
        scale: 1.03,
      });

      // 2. Cinematic mask reveal (bottom -> top, settling scale)
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

      // 3. Subtle internal scrub parallax (max 4% travel inside stationary outer frame)
      if (imageParallax) {
        gsap.fromTo(
          imageParallax,
          { yPercent: -2 },
          {
            yPercent: 2,
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

  // Master timeline synchronization for stay highlights
  const handleTimelineReady = (tl: gsap.core.Timeline) => {
    const highlights =
      sectionRef.current?.querySelectorAll<HTMLElement>(".stay-highlight-item");
    if (highlights && highlights.length > 0) {
      tl.to(
        highlights,
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power2.out",
          stagger: 0.12,
          clearProps: "transform,opacity",
        },
        1.4
      );
    }
  };

  const openVideo = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!imageFrameRef.current || !iframeContainerRef.current || !modalBgRef.current || !modalRef.current) return;
    
    const rect = imageFrameRef.current.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(imageFrameRef.current);
    
    gsap.set(modalRef.current, {
      pointerEvents: "auto",
      zIndex: 100,
    });
    
    gsap.set(modalBgRef.current, {
      opacity: 0,
    });

    gsap.set(iframeContainerRef.current, {
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
      borderTopLeftRadius: computedStyle.borderTopLeftRadius,
      borderTopRightRadius: computedStyle.borderTopRightRadius,
      borderBottomRightRadius: computedStyle.borderBottomRightRadius,
      borderBottomLeftRadius: computedStyle.borderBottomLeftRadius,
    });

    setIsVideoActive(true);

    gsap.timeline()
      .to(modalBgRef.current, {
        opacity: 1,
        duration: 0.5,
        ease: "power2.inOut",
      })
      .to(iframeContainerRef.current, {
        left: "5vw",
        top: "5vh",
        width: "90vw",
        height: "90vh",
        borderTopLeftRadius: "24px",
        borderTopRightRadius: "24px",
        borderBottomRightRadius: "24px",
        borderBottomLeftRadius: "24px",
        duration: 0.8,
        ease: "power3.inOut",
      }, "<0.1");
  };

  const closeVideo = () => {
    if (!imageFrameRef.current || !iframeContainerRef.current || !modalBgRef.current || !modalRef.current) {
      setIsVideoActive(false);
      return;
    }

    const rect = imageFrameRef.current.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(imageFrameRef.current);

    gsap.timeline({
      onComplete: () => {
        setIsVideoActive(false);
        gsap.set(modalRef.current, { pointerEvents: "none", zIndex: -1 });
      }
    })
    .to(iframeContainerRef.current, {
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
      borderTopLeftRadius: computedStyle.borderTopLeftRadius,
      borderTopRightRadius: computedStyle.borderTopRightRadius,
      borderBottomRightRadius: computedStyle.borderBottomRightRadius,
      borderBottomLeftRadius: computedStyle.borderBottomLeftRadius,
      duration: 0.8,
      ease: "power3.inOut",
    })
    .to(modalBgRef.current, {
      opacity: 0,
      duration: 0.5,
      ease: "power2.inOut",
    }, "-=0.4");
  };

  return (
    <section
      id={stay.id}
      ref={sectionRef}
      aria-labelledby="stay-heading"
      className="scroll-mt-20 relative bg-[#E5D2BA] text-[#2C221E] py-20 sm:py-28 lg:py-32 overflow-hidden select-none border-b border-[#2C221E]/12"
    >
      {/* 1. Subtle desert botanical palm/flora line illustration on far left */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 w-72 h-96 opacity-[0.05] select-none"
      >
        <svg
          viewBox="0 0 200 300"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          className="w-full h-full text-[#2C221E]"
        >
          <path d="M10 280 Q 60 180 120 120 T 190 20" />
          <path d="M50 200 Q 110 170 170 140" />
          <path d="M70 160 Q 130 130 185 90" />
          <path d="M90 120 Q 140 85 175 40" />
          <path d="M30 240 Q 90 220 150 200" />
        </svg>
      </div>

      {/* 2. Soft subtle dune silhouette in background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-10 inset-x-0 h-44 opacity-[0.04] select-none"
      >
        <svg
          viewBox="0 0 1440 200"
          fill="currentColor"
          className="w-full h-full text-[#2C221E]"
          preserveAspectRatio="none"
        >
          <path d="M0,120 C320,60 540,160 880,100 C1140,50 1320,130 1440,90 L1440,200 L0,200 Z" />
        </svg>
      </div>

      {/* 3. Ambient warm desert glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 right-10 w-[500px] h-[500px] rounded-full bg-radial from-[#D7B98E]/16 via-transparent to-transparent blur-3xl"
      />

      <Container size="wide" className="relative z-10">
        <TextRevealGroup start="top 78%" onTimelineReady={handleTimelineReady}>
          {/* Asymmetrical Editorial Composition matching reference */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-8 sm:gap-y-10 lg:gap-y-8 lg:gap-x-12 xl:gap-x-16 items-center">
            {/* -------------------------------------------------------------- */}
            {/* 1. LEFT HEADER BLOCK: Eyebrow + Large Display Heading + Body   */}
            {/* -------------------------------------------------------------- */}
            <div className="order-1 lg:order-1 lg:col-span-5 lg:col-start-1 lg:row-start-1 space-y-5 sm:space-y-6 text-left">
              {/* Eyebrow with horizontal line */}
              <div className="flex items-center gap-3">
                <TextReveal
                  as="span"
                  variant="eyebrow"
                  className="text-[11px] sm:text-xs font-semibold tracking-[0.34em] uppercase text-[#8C7A6B]"
                >
                  {stay.eyebrow}
                </TextReveal>
                <span className="h-px w-9 bg-[#8C7A6B]/35" aria-hidden="true" />
              </div>

              {/* Main Headline (Three lines: Luxury Tents. / Timeless / Experiences.) */}
              <TextReveal
                as="h2"
                id="stay-heading"
                variant="heading"
                lines={headlineLines}
                className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-[3.65rem] xl:text-[4.15rem] font-normal leading-[1.08] text-[#28201C] text-balance"
              />

              {/* Body Paragraph (Four lines line-by-line progressive reveal) */}
              <TextReveal
                as="p"
                variant="body"
                lines={narrativeLines}
                className="text-[#63554B] text-sm sm:text-base leading-relaxed max-w-lg font-light"
              />
            </div>

            {/* -------------------------------------------------------------- */}
            {/* 2. RIGHT IMAGE BLOCK: Dominant Arched Tent Photograph Frame    */}
            {/* -------------------------------------------------------------- */}
            <div className="order-2 lg:order-2 lg:col-span-7 lg:col-start-6 lg:row-start-1 lg:row-span-3 self-center my-3 sm:my-4 lg:my-0">
              {/* Outer Architectural Frame (Characteristic Jharokha Arch on Top-Left Corner) */}
              <div
                ref={imageFrameRef}
                className="relative aspect-[16/11] sm:aspect-[4/3] lg:aspect-[16/11] w-full max-w-[660px] mx-auto lg:ml-auto overflow-hidden rounded-tl-[120px] sm:rounded-tl-[160px] lg:rounded-tl-[200px] rounded-tr-none rounded-br-none rounded-bl-none bg-[#D7B98E]/20 shadow-sm border border-[#2C221E]/10"
              >
                {/* Internal Image Frame for Smooth 4% Scrub Parallax */}
                <div
                  ref={imageParallaxRef}
                  className="relative w-full h-[108%] -top-[4%] overflow-hidden will-change-transform"
                >
                  <Image
                    src={stay.image.src}
                    alt={stay.image.alt}
                    fill
                    quality={95}
                    sizes="(min-width: 1440px) 760px, (min-width: 1024px) 58vw, 100vw"
                    priority={false}
                    className="object-cover object-center"
                  />

                  {/* Subtle warm dusk gradient overlay */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-[#2C221E]/20 via-transparent to-transparent pointer-events-none"
                  />
                </div>
              </div>

              {/* Tagline under image in bottom-right with subtle starburst */}
              <div className="flex items-center justify-end gap-2.5 mt-3 sm:mt-4 text-right pr-2">
                <span
                  className="inline-block text-[#D7B98E] text-xs select-none"
                  aria-hidden="true"
                >
                  ☼
                </span>
                <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.35em] text-[#8C7A6B] uppercase font-medium">
                  {stay.image.caption}
                </span>
              </div>
            </div>

            {/* -------------------------------------------------------------- */}
            {/* 3. THREE STAY HIGHLIGHTS: Clean, Delicate 3-Column Block       */}
            {/* -------------------------------------------------------------- */}
            <div className="order-3 lg:order-3 lg:col-span-5 lg:col-start-1 lg:row-start-2 pt-2 sm:pt-4">
              <div className="rounded-xl bg-[#FAF5ED]/65 backdrop-blur-xs border border-[#2C221E]/15 p-4 sm:p-5 shadow-[0_4px_24px_-8px_rgba(44,34,30,0.08)]">
                <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#2C221E]/15">
                {/* Highlight 1: Spacious Tents */}
                <div
                  style={{
                    opacity: shouldReduceMotion ? 1 : 0,
                    transform: shouldReduceMotion ? "none" : "translateY(14px)",
                  }}
                  className="stay-highlight-item flex flex-col justify-between py-3.5 sm:py-0 sm:px-4 first:sm:pl-0 first:pt-0 last:pb-0 text-left will-change-[transform,opacity]"
                >
                  <div className="shrink-0 text-[#2C221E]">
                    {/* Lotus line icon */}
                    <svg
                      width="26"
                      height="26"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.25"
                      className="text-[#2C221E]"
                      aria-hidden="true"
                    >
                      <path d="M12 4c1.5 3 4 5 7 6-3 1.5-4 4.5-4 8H9c0-3.5-1-6.5-4-8 3-1 5.5-3 7-6z" />
                      <path d="M12 4v16" />
                      <path d="M7 18c2-1 3.5-2.5 5-5 1.5 2.5 3 4 5 5" />
                    </svg>
                  </div>
                  <div className="mt-3">
                    <h3 className="font-serif text-sm sm:text-[15px] font-medium text-[#28201C] leading-snug">
                      Spacious Tents
                    </h3>
                    <p className="mt-1 text-[9px] sm:text-[10px] font-mono tracking-[0.2em] uppercase text-[#8C7A6B]">
                      WITH MODERN AMENITIES
                    </p>
                  </div>
                </div>

                {/* Highlight 2: Premium Comfort */}
                <div
                  style={{
                    opacity: shouldReduceMotion ? 1 : 0,
                    transform: shouldReduceMotion ? "none" : "translateY(14px)",
                  }}
                  className="stay-highlight-item flex flex-col justify-between py-3.5 sm:py-0 sm:px-4 text-left will-change-[transform,opacity]"
                >
                  <div className="shrink-0 text-[#2C221E]">
                    {/* Bed line icon */}
                    <svg
                      width="26"
                      height="26"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.25"
                      className="text-[#2C221E]"
                      aria-hidden="true"
                    >
                      <path d="M2 4v16M2 9h20v11M2 14h20M22 4v16" />
                      <rect x="4" y="6" width="6" height="3" rx="0.5" />
                      <rect x="14" y="6" width="6" height="3" rx="0.5" />
                    </svg>
                  </div>
                  <div className="mt-3">
                    <h3 className="font-serif text-sm sm:text-[15px] font-medium text-[#28201C] leading-snug">
                      Premium Comfort
                    </h3>
                    <p className="mt-1 text-[9px] sm:text-[10px] font-mono tracking-[0.2em] uppercase text-[#8C7A6B]">
                      FOR A RESTFUL STAY
                    </p>
                  </div>
                </div>

                {/* Highlight 3: Desert Views */}
                <div
                  style={{
                    opacity: shouldReduceMotion ? 1 : 0,
                    transform: shouldReduceMotion ? "none" : "translateY(14px)",
                  }}
                  className="stay-highlight-item flex flex-col justify-between py-3.5 sm:py-0 sm:px-4 last:sm:pr-0 last:pb-0 text-left will-change-[transform,opacity]"
                >
                  <div className="shrink-0 text-[#2C221E]">
                    {/* Sun with rays line icon */}
                    <svg
                      width="26"
                      height="26"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.25"
                      className="text-[#2C221E]"
                      aria-hidden="true"
                    >
                      <circle cx="12" cy="12" r="3.5" />
                      <path d="M12 2v2.5M12 19.5V22M4.93 4.93l1.77 1.77M17.3 17.3l1.77 1.77M2 12h2.5M19.5 12H22M4.93 19.07l1.77-1.77M17.3 6.7l1.77-1.77" />
                    </svg>
                  </div>
                  <div className="mt-3">
                    <h3 className="font-serif text-sm sm:text-[15px] font-medium text-[#28201C] leading-snug">
                      Desert Views
                    </h3>
                    <p className="mt-1 text-[9px] sm:text-[10px] font-mono tracking-[0.2em] uppercase text-[#8C7A6B]">
                      RIGHT AT YOUR DOORSTEP
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

            {/* -------------------------------------------------------------- */}
            {/* 4. ACTIONS: Explore The Stay Pill Button + Watch Video Circle   */}
            {/* -------------------------------------------------------------- */}
            <div className="order-4 lg:order-4 lg:col-span-5 lg:col-start-1 lg:row-start-3 pt-4 text-left">
              <TextReveal variant="cta">
                <div className="flex flex-wrap items-center gap-8 sm:gap-10 md:gap-12 lg:gap-14">
                {/* Primary Button CTA: Explore The Stay */}
                <Link
                  href={stay.primaryCta.href}
                  className="group/cta inline-flex items-center gap-3.5 rounded-full bg-[#241C18] px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#FAF6F0] transition-all duration-300 hover:bg-[#382D27] active:scale-95 focus-visible:outline-2 focus-visible:outline-[#B88A44]"
                >
                  <span>{stay.primaryCta.label}</span>
                  <ArrowRight
                    size={14}
                    className="text-[#FAF6F0] transition-transform duration-300 group-hover/cta:translate-x-1"
                  />
                </Link>

                {/* Secondary Button CTA: Watch Video */}
                <button
                  onClick={openVideo}
                  aria-label="Watch RETIVAA desert video"
                  className="group/video inline-flex items-center gap-3 text-xs font-semibold tracking-[0.16em] uppercase text-[#28201C] hover:text-[#A65335] transition-colors focus-visible:outline-2 focus-visible:outline-[#B88A44] rounded-full"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#28201C]/40 bg-transparent transition-all duration-300 group-hover/video:border-[#A65335] group-hover/video:scale-105 group-hover/video:bg-[#A65335]/10">
                    <Play
                      size={12}
                      fill="currentColor"
                      className="ml-0.5 text-[#28201C] transition-colors group-hover/video:text-[#A65335]"
                    />
                  </span>
                  <span>Watch Video</span>
                </button>
                </div>
              </TextReveal>
            </div>
          </div>
        </TextRevealGroup>
      </Container>

      {/* Video Modal Overlay */}
      <div
        ref={modalRef}
        className="fixed inset-0 z-[-1] pointer-events-none flex items-center justify-center"
      >
        <div
          ref={modalBgRef}
          className="absolute inset-0 bg-black/90 backdrop-blur-md opacity-0"
          onClick={closeVideo}
        />
        <div
          ref={iframeContainerRef}
          className="absolute overflow-hidden bg-[#191918] shadow-2xl flex items-center justify-center"
        >
          {isVideoActive && (
            <>
              <button
                onClick={closeVideo}
                aria-label="Close video"
                className="absolute top-4 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md hover:bg-white/20 transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                </svg>
              </button>
              <iframe
                src="https://www.youtube.com/embed/503VISwGROE?autoplay=1&mute=0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </>
          )}
        </div>
      </div>
    </section>
  );
}
