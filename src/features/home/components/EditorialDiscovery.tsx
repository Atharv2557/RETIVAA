"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "framer-motion";
import { EXPERIENCES_CONTENT } from "@/content/experiences";
import { ExperienceCard } from "./ExperienceCard";

export function EditorialDiscovery() {
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);

  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    // Desktop Pinned Alternating Storytelling (Activates on lg+ viewports >= 1024px)
    mm.add("(min-width: 1024px)", () => {
      const section = sectionRef.current;
      const stage = stageRef.current;
      const track = trackRef.current;
      if (!section || !stage || !track) return;

      const numPanels = EXPERIENCES_CONTENT.items.length; // 5
      if (numPanels <= 1) return;

      // Function to dynamically measure exact stage width on resize
      const getStageWidth = () => stage.clientWidth || window.innerWidth;

      // Reset initial track position
      gsap.set(track, { x: 0 });

      // Build coordinated scrubbed timeline:
      // Total virtual timeline length: 4.6 units
      // Slide 0: hold 0.0 -> 0.6 (60% settled hold)
      // Travel 0 -> 1: 0.6 -> 1.0 (40% transition)
      // Slide 1: hold 1.0 -> 1.6 (60% settled hold)
      // Travel 1 -> 2: 1.6 -> 2.0 (40% transition)
      // Slide 2: hold 2.0 -> 2.6 (60% settled hold)
      // Travel 2 -> 3: 2.6 -> 3.0 (40% transition)
      // Slide 3: hold 3.0 -> 3.6 (60% settled hold)
      // Travel 3 -> 4: 3.6 -> 4.0 (40% transition)
      // Slide 4: hold 4.0 -> 4.6 (60% settled hold, readable final slide before release)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 0.8,
          start: "top top",
          end: () => "+=2800",
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const t = self.progress * 4.6;
            let activeIndex = 0;
            if (t < 0.8) activeIndex = 0;
            else if (t < 1.8) activeIndex = 1;
            else if (t < 2.8) activeIndex = 2;
            else if (t < 3.8) activeIndex = 3;
            else activeIndex = 4;

            setActiveStoryIndex(activeIndex);

            if (progressBarRef.current) {
              const fillScale = 0.2 + self.progress * 0.8;
              progressBarRef.current.style.transform = `scaleX(${Math.min(1, fillScale)})`;
            }
          },
        },
      });

      // Transition 0 -> 1
      tl.to(
        track,
        {
          x: () => -1 * getStageWidth(),
          ease: "power2.inOut",
          duration: 0.4,
        },
        0.6
      );

      // Transition 1 -> 2
      tl.to(
        track,
        {
          x: () => -2 * getStageWidth(),
          ease: "power2.inOut",
          duration: 0.4,
        },
        1.6
      );

      // Transition 2 -> 3
      tl.to(
        track,
        {
          x: () => -3 * getStageWidth(),
          ease: "power2.inOut",
          duration: 0.4,
        },
        2.6
      );

      // Transition 3 -> 4
      tl.to(
        track,
        {
          x: () => -4 * getStageWidth(),
          ease: "power2.inOut",
          duration: 0.4,
        },
        3.6
      );

      // Hold slide 4 until timeline ends at 4.6 before normal pin release
      tl.set({}, {}, 4.6);

      return () => {
        tl.kill();
        ScrollTrigger.getAll().forEach((st) => {
          if (st.trigger === section) st.kill();
        });
      };
    });

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <section
      id="editorial-discovery"
      ref={sectionRef}
      aria-label="The RETIVAA DESERT CAMP Experience"
      className="scroll-mt-16 bg-[#F6EFE3] text-[#30251F] relative select-none"
    >
      {/* Ambient Warm Atmosphere Glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 right-20 w-96 h-96 rounded-full bg-radial from-[#D7B98E]/20 via-transparent to-transparent blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 left-20 w-96 h-96 rounded-full bg-radial from-[#A65335]/15 via-transparent to-transparent blur-3xl"
      />

      {/* =====================================================================
          1. DESKTOP PINNED ALTERNATING SLIDE STAGE (Visible on lg+ viewports)
          ===================================================================== */}
      <div className="hidden lg:flex relative w-full h-[100dvh] min-h-[680px] max-h-[1050px] overflow-hidden flex-col justify-between pt-16 lg:pt-20 pb-6 sm:pb-8">
        {/* Section Heading: Placed stably at top-left above the slide stage */}
        <div className="w-full max-w-[1380px] mx-auto px-6 sm:px-8 shrink-0 z-20">
          <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.3em] text-[#A65335] block mb-1">
            {EXPERIENCES_CONTENT.eyebrow}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[2.65rem] font-normal leading-tight text-[#30251F]">
            {EXPERIENCES_CONTENT.heading}
          </h2>
        </div>

        {/* Clipped Slide Stage:
            Stage width ~92vw, max 1380px, centered with balanced margins.
            Shows ONE complete slide at each resting position.
            GSAP translates track by measured stage width with 60% hold / 40% travel. */}
        <div
          ref={stageRef}
          className="relative w-[92vw] max-w-[1380px] mx-auto my-auto overflow-hidden h-[460px] lg:h-[480px] xl:h-[500px] select-none"
        >
          <div
            ref={trackRef}
            className="flex flex-row flex-nowrap h-full w-full will-change-transform"
          >
            {EXPERIENCES_CONTENT.items.map((item, index) => (
              <div
                key={item.id}
                className="experience-panel w-full h-full shrink-0 flex items-center justify-center"
                aria-hidden={index !== activeStoryIndex}
              >
                <ExperienceCard
                  item={item}
                  index={index}
                  isActive={index === activeStoryIndex}
                  isReducedMotion={Boolean(shouldReduceMotion)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Slide Stage Footer: Status Counter, Progress Indicator & Discreet Note */}
        <div className="w-full max-w-[1380px] mx-auto px-6 sm:px-8 shrink-0 z-20 space-y-3">
          {/* Progress Bar & Counter Bar */}
          <div className="flex items-center justify-between border-t border-[#30251F]/15 pt-3.5">
            {/* Left Active Counter: "01 / 05" */}
            <span className="font-mono text-xs sm:text-sm font-semibold text-[#A65335] tracking-widest min-w-[50px]">
              0{activeStoryIndex + 1} / 05
            </span>

            {/* Horizontal Progress Line */}
            <div
              className="flex-1 mx-6 sm:mx-10 h-[2px] bg-[#30251F]/15 rounded-full overflow-hidden relative max-w-2xl"
              role="progressbar"
              aria-valuenow={activeStoryIndex + 1}
              aria-valuemin={1}
              aria-valuemax={5}
            >
              <div
                ref={progressBarRef}
                className="absolute inset-y-0 left-0 w-full bg-[#A65335] origin-left rounded-full transition-transform duration-100 ease-out"
                style={{ transform: "scaleX(0.2)" }}
              />
            </div>

            {/* Right Scroll Cue */}
            <div className="flex items-center gap-1.5 text-xs font-mono tracking-[0.25em] uppercase text-[#30251F]/70">
              <span>SCROLL TO EXPLORE</span>
              <span aria-hidden="true">&darr;</span>
            </div>
          </div>

          {/* Discreet Availability Note */}
          <p className="text-[11px] sm:text-xs text-[#6B5D55] font-light italic text-center sm:text-left">
            {EXPERIENCES_CONTENT.discreetNote}
          </p>
        </div>
      </div>

      {/* =====================================================================
          2. MOBILE, TABLET & REDUCED-MOTION VERTICAL STORYTELLING
             (Normal vertical flow with photograph stacked above text, native scrolling)
          ===================================================================== */}
      <div className="lg:hidden py-14 sm:py-18 px-5 sm:px-8 space-y-12">
        {/* Section Header */}
        <div className="space-y-2 text-left">
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#A65335] block">
            {EXPERIENCES_CONTENT.eyebrow}
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-normal leading-tight text-[#30251F]">
            {EXPERIENCES_CONTENT.heading}
          </h2>
          <p className="text-xs sm:text-sm text-[#6B5D55] font-light leading-relaxed pt-1">
            {EXPERIENCES_CONTENT.introduction}
          </p>
        </div>

        {/* Vertical Stack: All 5 experiences accessible with native touch scrolling */}
        <div className="space-y-12">
          {EXPERIENCES_CONTENT.items.map((item, index) => (
            <div
              key={item.id}
              className="border-b border-[#30251F]/10 pb-10 last:border-b-0 last:pb-0"
            >
              <ExperienceCard
                item={item}
                index={index}
                isActive={true}
                isReducedMotion={true}
              />
            </div>
          ))}
        </div>

        {/* Discreet Note */}
        <p className="text-xs text-[#6B5D55] font-light italic text-center pt-2">
          {EXPERIENCES_CONTENT.discreetNote}
        </p>
      </div>

      {/* Anchor point immediately below the experience sequence */}
      <div id="after-discovery" tabIndex={-1} className="outline-none" />
    </section>
  );
}
