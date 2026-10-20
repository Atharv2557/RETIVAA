"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";
import { siteConfig, isConfigured, getWhatsAppEnquiryUrl } from "@/config/site.config";
import { homeContent } from "@/content/home";
import { HeroSandParticles } from "./HeroSandParticles";
import { HeroPhotoTrack, HERO_TRACK_ITEMS } from "./HeroPhotoTrack";
import { LineReveal, FadeSlide } from "./HeroMotionText";
import { HeroBookingBar } from "./HeroBookingBar";

const EASE_LUXURY = [0.16, 1, 0.3, 1] as const;
const SLIDE_INTERVAL_MS = 3000;

interface DesertHeroProps {
  isIntroActive?: boolean;
}

export function DesertHero({ isIntroActive = false }: DesertHeroProps) {
  const containerRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Slide state for hero photo track
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const totalItems = HERO_TRACK_ITEMS.length;

  const navigate = useCallback(
    (step: number) => {
      setActiveIndex((prev) => (prev + step + totalItems) % totalItems);
    },
    [totalItems]
  );

  const selectSlide = useCallback(
    (index: number) => {
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
      setIsPaused(true);
      setActiveIndex(index);
      pauseTimeoutRef.current = setTimeout(() => setIsPaused(false), 3800);
    },
    []
  );

  const handleManualNav = useCallback(
    (step: number) => {
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
      setIsPaused(true);
      navigate(step);
      pauseTimeoutRef.current = setTimeout(() => setIsPaused(false), 3800);
    },
    [navigate]
  );

  // Automatic slide progression in milliseconds
  useEffect(() => {
    if (isIntroActive || isPaused) return;

    const timer = setInterval(() => {
      navigate(1);
    }, SLIDE_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [isIntroActive, isPaused, navigate]);

  useEffect(() => {
    return () => {
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    };
  }, []);

  // Scroll Parallax (replicates and elevates reference website B_ function)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const trackX = useTransform(scrollYProgress, [0, 1], [0, -60]);

  const isWhatsAppReady = isConfigured(siteConfig.contact.whatsapp);
  const whatsappUrl = getWhatsAppEnquiryUrl(
    "Namaste RETIVAA, I would like to enquire about staying at your desert camp in Jaisalmer."
  );

  return (
    <section
      ref={containerRef}
      data-testid="hero-section"
      aria-label="RETIVAA Desert Camp & Dunes Experience"
      className="relative min-h-[100svh] overflow-hidden bg-[#14110E] text-[#FAF6F0] selection:bg-[#E4C198] selection:text-[#14110E]"
    >
      {/* 1. Cinematic Full-Bleed Background with Parallax Scale */}
      <motion.div
        className="absolute inset-0 z-0"
        style={shouldReduceMotion ? undefined : { y: bgY, scale: bgScale }}
        initial={{ scale: 1.04 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.8, ease: EASE_LUXURY }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/gallery/camp-starlit-panorama.jpg"
          alt="Panoramic starlit night sky over RETIVAA luxury desert camp with illuminated tents and red carpet pathway"
          loading="eager"
          decoding="async"
          className="h-full w-full object-cover object-center brightness-[0.92] contrast-[1.08] saturate-[1.05]"
          style={{ imageRendering: "auto", backfaceVisibility: "hidden" }}
        />
      </motion.div>

      {/* 2. Focused Atmospheric Scrims - Preserves photo clarity while guaranteeing text contrast */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[#14110E] via-[#14110E]/25 to-black/35 pointer-events-none" />
      <div className="absolute inset-y-0 left-0 z-[2] w-full lg:w-[65%] bg-gradient-to-r from-[#14110E]/85 via-[#14110E]/40 to-transparent pointer-events-none" />

      {/* 3. Floating Amber Sand Dust Ambient Canvas */}
      <HeroSandParticles className="z-[3]" />

      {/* Main Hero Stage Container */}
      <div className="relative z-[5] mx-auto min-h-[100svh] max-w-[1600px] flex flex-col justify-between px-6 pt-28 pb-28 md:px-10 lg:pt-28 lg:pb-24">
        {/* Top/Center Grid: Typography & 3D Interactive Photo Track */}
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-8 my-auto">
          {/* Left Column: Semantic Editorial Typography & Actions */}
          <motion.div
            style={shouldReduceMotion ? undefined : { y: textY }}
            className="max-w-xl text-left relative z-20"
          >
            {/* Eyebrow Tag */}
            <FadeSlide delay={0.25} immediate={!isIntroActive}>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#FAF6F0]/08 border border-[#FAF6F0]/15 px-3 py-1 backdrop-blur-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-[#E4C198] animate-pulse" />
                <p className="text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.38em] text-[#E4C198]">
                  Thar Desert · Jaisalmer, Rajasthan
                </p>
              </div>
            </FadeSlide>

            {/* Kinetic Main Headline (Left-to-Right Line Mask Reveal) */}
            <h1 className="mt-5 font-serif text-[12vw] leading-[1.03] tracking-tight text-[#FAF6F0] sm:text-6xl lg:text-[4.75rem] drop-shadow-[0_2px_14px_rgba(20,17,14,0.9)]">
              <LineReveal
                lines={["WHERE THE", "THAR DESERT", "FEELS LIKE HOME"]}
                delay={0.35}
                immediate={!isIntroActive}
              />
            </h1>

            {/* Supporting Narrative Text */}
            <FadeSlide delay={0.75} immediate={!isIntroActive}>
              <p className="mt-5 max-w-lg text-sm leading-relaxed text-[#D6C7B8] md:text-base font-light drop-shadow-[0_1px_6px_rgba(20,17,14,0.8)]">
                {homeContent.hero.supportingText ||
                  "A luxury desert retreat shaped by warm Rajasthani hospitality, handcrafted royal tented suites, and the golden silence of the dunes."}
              </p>
            </FadeSlide>

            {/* Action CTAs */}
            <FadeSlide delay={0.95} immediate={!isIntroActive}>
              <div className="mt-8 flex flex-wrap items-center gap-4 sm:gap-5">
                {/* Primary Explore Button */}
                <a
                  href={homeContent.hero.secondaryCta.href}
                  data-testid="hero-explore-button"
                  className="group flex items-center gap-3 rounded-full bg-[#FAF6F0] px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#14110E] transition-all duration-300 hover:bg-[#E4C198] hover:shadow-[0_0_25px_rgba(228,193,152,0.4)] active:scale-95"
                >
                  <span>{homeContent.hero.secondaryCta.label}</span>
                  <ArrowRight
                    size={14}
                    strokeWidth={2}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </a>

                {/* WhatsApp or Contact Direct Booking */}
                {isWhatsAppReady && whatsappUrl ? (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="hero-whatsapp-button"
                    className="group flex items-center gap-2 rounded-full border border-[#FAF6F0]/30 bg-[#14110E]/40 backdrop-blur-md px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#FAF6F0] transition-colors hover:border-[#E4C198] hover:text-[#E4C198]"
                  >
                    <MessageCircle size={14} className="text-[#25D366]" />
                    <span>WhatsApp Concierge</span>
                  </a>
                ) : (
                  <Link
                    href="/contact"
                    data-testid="hero-contact-button"
                    className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#FAF6F0]/85 underline-offset-8 transition-colors hover:text-[#E4C198] hover:underline py-2"
                  >
                    Reserve Your Stay
                  </Link>
                )}
              </div>
            </FadeSlide>
          </motion.div>

          {/* Right Column: 3D Interactive Stacked Photo Track */}
          <motion.div
            style={shouldReduceMotion ? undefined : { x: trackX }}
            className="w-full flex items-center justify-center lg:justify-end relative z-10"
          >
            <HeroPhotoTrack
              activeIndex={activeIndex}
              onSelectIndex={selectSlide}
              onNavigate={handleManualNav}
              isPaused={isPaused}
              setIsPaused={setIsPaused}
              intervalMs={SLIDE_INTERVAL_MS}
            />
          </motion.div>
        </div>

        {/* Integrated Luxury Booking / Availability Bar */}
        <HeroBookingBar />

        {/* Bottom spacing clearance for fixed ScrollCamelBar */}
        <div className="h-12 lg:h-16" aria-hidden="true" />
      </div>
    </section>
  );
}
