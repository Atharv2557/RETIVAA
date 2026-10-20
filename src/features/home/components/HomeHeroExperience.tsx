"use client";

import { useIntroController } from "../hooks/useIntroController";
import { BrandIntro } from "./BrandIntro";
import { DesertHero } from "./DesertHero";
import { SandCursorTrail } from "@/components/motion/SandCursorTrail";

export function HomeHeroExperience() {
  const { isIntroActive, isReady, skipIntro, enquireAndDismiss } =
    useIntroController();

  return (
    <div id="hero-experience-wrapper" className="relative w-full">
      {/* 1. Cinematic Brand Opening Overlay (Session-persisted, skippable) */}
      {isReady && isIntroActive && (
        <BrandIntro
          onComplete={skipIntro}
          onSkip={skipIntro}
          onEnquire={enquireAndDismiss}
        />
      )}

      {/* 2. Interactive Desert Hero Scene (Staged behind intro, smoothly reveals) */}
      <DesertHero isIntroActive={isReady && isIntroActive} />

      {/* 3. Subtle Animated Sand-Dust Cursor Trail (Enabled after intro completion on fine-pointer desktop) */}
      {isReady && !isIntroActive && <SandCursorTrail />}
    </div>
  );
}
