import { HomeHeroExperience } from "@/features/home/components/HomeHeroExperience";
import { WelcomeSection } from "@/features/home/components/WelcomeSection";
import { StaySection } from "@/features/home/components/StaySection";
import { ExploreSection } from "@/features/home/components/ExploreSection";
import { DesertExperiencesSection } from "@/features/home/components/DesertExperiencesSection";

export default function HomePage() {
  return (
    <main>
      {/* 1. Cinematic Brand Opening Intro & Immersive Desert Hero Experience */}
      <div id="home-hero-container">
        <HomeHeroExperience />
      </div>

      {/* 2. Post-Hero Welcome & Camp Overview Section */}
      <WelcomeSection />

      {/* 3. The Stay: Accommodation in Tent Section */}
      <StaySection />

      {/* 4. Explore the Thar: Immersive Panoramic Desert Section */}
      <ExploreSection />

      {/* 5. Desert Experiences: Dedicated Interactive Experience Card Grid */}
      <DesertExperiencesSection />
    </main>
  );
}
