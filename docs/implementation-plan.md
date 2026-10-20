# RETIVAA — Implementation Plan

This document outlines the multi-phase implementation roadmap for the RETIVAA luxury desert camp website.

---

## Phase 1: Architecture & Technical Foundation *(Current — Complete)*
- [x] Next.js App Router initialization with TypeScript strict mode.
- [x] Tailwind CSS v4 design token integration with brand palette (`#F6EFE3`, `#D7B98E`, `#B88A44`, `#A65335`, `#30251F`, `#191918`).
- [x] Central typed configuration (`site.config.ts`) with graceful placeholder handling (`isConfigured`).
- [x] Content models (`facilities.ts` with 9 confirmed amenities, `home.ts` with exact hero copy, `gallery.ts`).
- [x] Shared layout architecture (`SiteHeader.tsx`, `SiteFooter.tsx`, `Container.tsx`, `MobileMenu.tsx` stub).
- [x] Minimal working semantic routes (`/`, `/gallery`, `/contact`, `/not-found`).
- [x] Reserved asset tree and architecture documentation in `docs/`.
- [x] Typecheck (`npm run typecheck`) and production build (`npm run build`) verification with 0 errors.

---

## Phase 2: Design System & Editorial Content Layout
- [ ] Integration of licensed editorial serif font (e.g. Cormorant Garamond / Canela) and readable sans-serif.
- [ ] Implementation of full desktop navigation bar with sticky scroll transformation.
- [ ] Full layout for homepage sections:
  - Welcome narrative section.
  - Tent stay architecture showcase.
  - Desert experiences & safaris grid.
  - Evening story & cultural performance highlights.
  - Confirmed facilities full component with icons.
- [ ] Responsive navigation drawer (`MobileMenu.tsx`) with focus trapping and ARIA dialog semantics.

---

## Phase 3: Motion Engine & Curtain Intro Experience
- [ ] Safe installation and setup of GSAP, ScrollTrigger, and Lenis inside `src/components/motion/`.
- [ ] Construction of unified `requestAnimationFrame` update loop.
- [ ] Desktop curtain intro sequence:
  - 120–160vh pinned scroll travel.
  - 0–30%: curtains part horizontally from center.
  - 30–70%: forward dolly movement through tent aperture.
  - 70–100%: curtains fade, dust haze disperses, typography settles.
  - Single execution per session via `sessionStorage`.
  - Accessible "Skip Intro" button.
  - Simplified instant reveal on mobile viewports (< 768px).
  - Immediate bypass for `prefers-reduced-motion: reduce`.
- [ ] Subtle desktop pointer parallax for landscape imagery.

---

## Phase 4: Curated Photo Gallery & Accessible Lightbox
- [ ] High-resolution photography ingestion into `public/images/`.
- [ ] Filter tab switching (`All`, `Tents`, `Desert & Safaris`, `Cultural Evenings`, `Dining`).
- [ ] Fluid responsive masonry/grid with intrinsic aspect ratio boxes.
- [ ] Accessible modal lightbox:
  - Keyboard navigation (`Escape`, `ArrowLeft`, `ArrowRight`).
  - Touch swipe gestures for mobile.
  - Trapped focus and scroll lock.
  - Dynamic image counter and descriptive captions.

---

## Phase 5: Enquiry Engine & WhatsApp Integration
- [ ] Interactive `EnquiryForm.tsx` in `src/features/enquiry/`:
  - Date inputs with past-date rejection.
  - Dynamic rule enforcing check-out date > check-in date.
  - Integer constraints on adults (&ge; 1) and children (&ge; 0).
  - Optional activity checkboxes.
- [ ] WhatsApp message compiler formatting structured enquiry URL.
- [ ] Mobile sticky bottom booking trigger with safe-area insets (`env(safe-area-inset-bottom)`).
- [ ] Unit tests for date logic and payload generation in `tests/unit/`.

---

## Phase 6: Performance, Accessibility & Launch QA
- [ ] Responsive verification across viewports: 360px, 390px, 768px, 1024px, 1440px.
- [ ] WCAG AA contrast ratio compliance on all typography pairs.
- [ ] Lighthouse performance audit (Core Web Vitals: LCP < 2.5s, INP < 200ms, CLS < 0.1).
- [ ] Production build and CDN edge caching validation.
