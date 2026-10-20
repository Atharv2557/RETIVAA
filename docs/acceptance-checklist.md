# RETIVAA — Acceptance & Verification Checklist

Use this checklist to verify compliance across development milestones.

---

## 1. Route & Navigation Integrity
- [x] **Route Availability**:
  - `/` (Home): Renders semantic hero copy, facilities grid, and phase status.
  - `/gallery`: Renders semantic heading, filter taxonomy preview, and honest empty state.
  - `/contact`: Renders camp coordinates, phone/email links, and enquiry specifications.
  - `/not-found`: Renders custom 404 page with return-home navigation.
- [x] **Shared Navigation**:
  - Semantic `<header>` and `<nav aria-label="Main Navigation">`.
  - Accessible skip-to-content link targeting `#main-content`.
  - Semantic `<footer>` with copyright, address, and filtered social links.
- [x] **Safe Mobile Layout**:
  - Clean responsive navigation at 360px and 390px without horizontal overflow (`overflow-x: hidden`).

---

## 2. Central Configuration & Data Truth
- [x] **Single Source of Truth**: All brand parameters and contact points reside exclusively in `src/config/site.config.ts`.
- [x] **No Fake Data**: No telephone numbers, emails, addresses, or handles have been hallucinated.
- [x] **Placeholder Protection**:
  - `isConfigured()` safely detects bracketed strings like `[PHONE NUMBER]`.
  - Unconfigured telephone numbers and emails do not generate active `tel:` or `mailto:` anchors.
  - Unconfigured social profiles are cleanly omitted from the UI.
  - WhatsApp enquiry triggers show an honest unavailable state until a valid business number is provided.

---

## 3. Content Integrity & Facility Verification
- [x] **Confirmed Facilities (Exact 9 preserved verbatim)**:
  1. `Accommodation in Tent`
  2. `Camel Safari in Thar Desert`
  3. `Sunset Point in Sand Dunes`
  4. `Evening Hi-Tea Snacks`
  5. `Rajasthani Folk Dance`
  6. `Live Rajasthani Folk Music`
  7. `Camp Fire – Fire Show`
  8. `Dinner & Breakfast`
  9. `Jeep Safari`
- [x] **Hero Copy (Supplied copy preserved verbatim)**:
  - Eyebrow: `JAISALMER · RAJASTHAN`
  - Headline: `Where the dunes become your home.`
  - Supporting text: `Tent stays, desert safaris and evenings filled with the spirit of Rajasthan.`
  - Primary CTA: `Enquire on WhatsApp`
  - Secondary CTA: `Explore the Camp`
- [x] **No Invented Amenities**: No synthetic room categories, fake package prices, or fake reviews.

---

## 4. Design System & Design Tokens
- [x] **Brand Color Palette Active in CSS**:
  - Warm ivory: `#F6EFE3`
  - Sandstone: `#D7B98E`
  - Antique gold: `#B88A44`
  - Terracotta: `#A65335`
  - Deep brown: `#30251F`
  - Evening charcoal: `#191918`
- [x] **Typography & Focus**:
  - System font fallbacks configured with editorial serif and interface sans hooks.
  - `:focus-visible` outline rings explicitly styled for keyboard accessibility.

---

## 5. Phase 2 — Immersive Desert Hero Verification
- [x] **Composition & Depth**:
  - Full-width, near-viewport-height scene (`min-h-[calc(100svh-5rem)]`).
  - Three perceptible depth zones: background horizon & warm sky, middle-distance sculpted dunes, foreground rippled sand.
  - Priority-loaded high-resolution photographic asset (`public/images/hero/thar_desert_hero.jpg`).
  - Layered directional vignettes and warm ambient wash ensuring WCAG AA text contrast.
- [x] **Animated Dust Particle System (Three.js / React Three Fiber)**:
  - Lightweight transparent canvas dynamically loaded via Next.js `dynamic(..., { ssr: false })`.
  - Points system with a single draw call and memory-efficient `BufferGeometry`.
  - Soft organic sand grain texture procedurally generated with radial alpha gradient.
  - Continuous gentle windward drift with sinusoidal breeze undulations and seamless wrap-around bounds.
  - Conservative particle budget: 320 on desktop, 120 on mobile.
  - Capped device pixel ratio (`Math.min(1.5, devicePixelRatio)`) and `depth: false` / `stencil: false` for low GPU draw.
  - Rendering automatically paused when scrolled off-screen (`IntersectionObserver`) or tab is inactive (`visibilitychange`).
  - Pure static photographic fallback if WebGL is unavailable or `prefers-reduced-motion: reduce` is active.
- [x] **GSAP Orchestrated Motion**:
  - Coordinated entrance: subtle camera push (scale 1.02) -> eyebrow entrance -> headline reveal -> supporting text & CTAs.
  - Scoped lifecycle inside `gsap.context()` with clean `ctx.revert()` teardown.
  - Subtle pointer parallax on desktop devices (`pointer: fine`), clamped to +/- 14px horizontal, paused when off-screen.
  - Zero-lag immediate rest state when `(prefers-reduced-motion: reduce)` is enabled.
- [x] **Editorial Typography & Hierarchy**:
  - Google Fonts `Cormorant Garamond` (expressive display serif) + `Plus Jakarta Sans` (interface sans).
  - Semantic single `<h1>` with responsive linebreaks.
- [x] **Action & CTA Resilience**:
  - Primary CTA reads from central `siteConfig.contact.whatsapp`. If unconfigured, degrades safely to `/contact` without broken `wa.me/` URLs.
  - Secondary CTA (`#camp-overview`) connects to temporary Phase 2 destination anchor directly below the hero.

---

## 6. Brand Opening & Sand-Dust Cursor Trail Verification
- [x] **Brand Opening Sequence (`BrandIntro.tsx`, `useIntroController.ts`)**:
  - Full-screen arrival layer staged above the homepage (`z-50`).
  - Stage 1: Atmosphere (warm ambient glow, floating dust motes) ~0.8s.
  - Stage 2: Brand reveal (eyebrow, RETIVAA wordmark with refined letter-spacing, gold divider, supporting line) ~1.4s.
  - Stage 3: Split curtain departure (left panel `xPercent: -100`, right panel `xPercent: 100`, duration: 1.05s).
  - Total duration ~3.6s (capped under 4.5s maximum).
  - "Skip intro" button visible and focusable from the start.
  - Keyboard Escape key triggers immediate dismissal.
  - "Enquire" shortcut dismisses intro and navigates to WhatsApp or `/contact`.
  - Single execution per browser session via `sessionStorage`.
  - Direct visits to `/gallery` and `/contact` have no intro.
  - Bypassed immediately under `prefers-reduced-motion: reduce`.
  - Accessible dialog (`role="dialog"`, `aria-modal="true"`) with `inert` applied to background content during playback.
  - Hard safety timeout (4.6s) ensures visitor is never trapped.
  - Completely unmounted from DOM upon completion, fully restoring body scroll and keyboard focus.
- [x] **Sand-Dust Cursor Trail (`SandCursorTrail.tsx`)**:
  - Activated strictly after intro completes on desktop devices (`(pointer: fine) and (hover: hover)`).
  - Native OS cursor remains completely visible and unhindered.
  - Lightweight Canvas 2D layer (`pointer-events-none`, `aria-hidden="true"`).
  - Object-pooled memory (50 max particles), 0% idle CPU when stationary.
  - Emits based on pointer distance threshold; particles drift gently in warm sand/amber tones with occasional tiny glints.
  - Naturally dissipates within ~0.8s when mouse stops.
  - Suppresses emission over inputs, textareas, selects, and contenteditable elements.
  - Paused when pointer leaves window (`mouseleave`) or tab is hidden (`visibilitychange`).
  - Disabled under `prefers-reduced-motion: reduce` and on touch/coarse devices.

---

## 7. Future Feature Verification (Upcoming Phases)

### Gallery & Lightbox (Phase 4)
- [ ] All 5 filters operational (`All`, `Tents`, `Desert & Safaris`, `Cultural Evenings`, `Dining`).
- [ ] Category tabs support keyboard arrow navigation and ARIA tab semantics.
- [ ] Lightbox traps keyboard focus when open.
- [ ] `Escape` dismisses the lightbox and restores focus to triggering element.
- [ ] `ArrowLeft` and `ArrowRight` navigate between photographs.
- [ ] Mobile touch swipe navigates previous/next slides.
- [ ] Empty categories show honest curation notices without broken image icons.

### Enquiry & WhatsApp Flow (Phase 5)
- [ ] Date validation rejects past check-in dates.
- [ ] Date validation enforces check-out strictly after check-in.
- [ ] Guest counts enforce integers: adults &ge; 1, children &ge; 0.
- [ ] Valid submission compiles URL-encoded message targeting `https://wa.me/<number>`.
- [ ] No deceptive "Instant Confirmation" or simulated payments.
- [ ] Mobile bottom booking bar respects `env(safe-area-inset-bottom)` and hides when forms are focused.

---

## 6. Viewport & Device Testing Matrix
- [ ] **360px width** (Compact Android / Galaxy S-series): No horizontal overflow, readable typography.
- [ ] **390px width** (iPhone 12/13/14/15 standard): Safe area compliance, fluid layout.
- [ ] **768px width** (iPad / Tablet portrait): Grid transitions from 1-column to 2-column.
- [ ] **1024px width** (Tablet landscape / Small laptop): Desktop header activates.
- [ ] **1440px+ width** (Desktop monitors): Content constrained cleanly by `Container` max-widths.

---

## 7. Performance & Code Quality
- [x] TypeScript strict mode: 0 errors (`npm run typecheck`).
- [x] ESLint rules: 0 warnings/errors (`npm run lint`).
- [x] Next.js production build: compiles cleanly (`npm run build`).
- [ ] Core Web Vitals measured in production environment (do not fabricate untested scores).
