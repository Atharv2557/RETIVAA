# Home Feature Components (`src/features/home/components/`)

## Architectural Overview
This directory is planned for the component decomposition of the RETIVAA homepage. In accordance with architectural boundaries for Phase 1, the planned components are documented here rather than generating empty shell TSX files.

---

## Planned Component Catalog

### 1. `CurtainIntro.tsx`
- **Purpose**: Immersive editorial arrival experience.
- **Scroll Travel**: Desktop pinned scroll distance of approximately 120–160vh.
- **Phase Breakdown**:
  - `0% – 30%`: Curtains part horizontally from center.
  - `30% – 70%`: Forward dolly/camera scale motion stepping into the tent threshold.
  - `70% – 100%`: Curtains fade out, atmospheric dust haze disperses, and the hero typography settles into position.
- **State & Dismissal**:
  - Runs in full once per browser session (backed by `sessionStorage`).
  - Accessible "Skip Intro" button instantly resolves the timeline, pins the scroll back to `0`, and unblocks normal page scrolling.
  - Mobile viewports (<= 768px) bypass prolonged pinning, executing a lightweight 1.2s reveal.
  - Users with `prefers-reduced-motion: reduce` bypass the sequence entirely, revealing the settled hero state immediately.

### 2. `DesertHero.tsx`
- **Purpose**: Above-the-fold brand identity and primary call-to-actions.
- **Content**:
  - Eyebrow: `JAISALMER · RAJASTHAN`
  - Headline: `Where the dunes become your home.`
  - Supporting text: `Tent stays, desert safaris and evenings filled with the spirit of Rajasthan.`
  - Primary CTA: `Enquire on WhatsApp` (with fallback to contact page if unconfigured).
  - Secondary CTA: `Explore the Camp` (smooth anchor scroll to camp overview).

### 3. `WelcomeSection.tsx`
- **Purpose**: Editorial narrative introducing the quiet luxury philosophy of RETIVAA.
- **Content**: Philosophy of understated desert hospitality, cultural resonance, and sanctuary amidst the Thar Desert.

### 4. `TentStaySection.tsx`
- **Purpose**: Architectural showcase of the luxury tented accommodations.
- **Visuals**: Handcrafted canopies, traditional block-printed textiles, en-suite desert stone amenities, and shaded verandahs facing the dunes.

### 5. `DesertExperiencesSection.tsx`
- **Purpose**: Active discovery section highlighting:
  - Camel Safari in Thar Desert.
  - Sunset Point in Sand Dunes.
  - Jeep Safari over undulating crests.

### 6. `EveningStorySection.tsx`
- **Purpose**: Transition from golden hour to starlit night in the desert.
- **Highlights**:
  - Camp Fire – Fire Show.
  - Live Rajasthani Folk Music.
  - Rajasthani Folk Dance performances under the desert sky.

### 7. `FacilitiesOverviewSection.tsx`
- **Purpose**: Structured presentation of all 9 confirmed facilities.
- **Integrity Rule**: Exact names maintained without fabricated inclusions or false amenity claims.

### 8. `GalleryPreviewSection.tsx`
- **Purpose**: Curated teaser grid of 4–6 authentic photos routing directly to the `/gallery` page.

### 9. `FinalEnquirySection.tsx`
- **Purpose**: High-intent closing section prompting the guest to initiate an enquiry or open WhatsApp conversation.
