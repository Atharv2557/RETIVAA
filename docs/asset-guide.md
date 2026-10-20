# RETIVAA — Digital Asset & Photography Guide

## 1. Photography Art Direction

RETIVAA's visual tone is grounded, editorial, and cinematic. Photographs must convey the stillness of the Thar Desert, the warmth of Rajasthani hospitality, and the understated luxury of private tent living.

### Key Guidelines:
- **Lighting**: Favor golden hour (late afternoon sun skimming dune crests), blue hour (deep desert twilight), and clear night skies. Avoid flat, harsh midday glare.
- **Color Grading**: Warm ivory, deep sand, amber, and terracotta undertones. Avoid oversaturated neon yellows or artificial HDR filters.
- **Subjects**:
  - Handcrafted tent architecture with crisp white/sand canvas, natural wood, and brass accents.
  - Quiet camel caravan silhouettes at sunset.
  - Authentic cultural performances (Kalbelia dancers, folk musicians, starlight fire shows) captured in genuine motion without tourist staging.

---

## 2. Image Asset Specifications

| Asset Type | Target Location | Recommended Aspect Ratio | Desktop Target (2x) | Mobile Target | Formats |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero Landscape** | `public/images/hero/` | 16:9 or 21:9 | 2560 &times; 1440 px | 1080 &times; 1920 px | AVIF, WebP |
| **Tent Architecture** | `public/images/camp/` | 3:2 or 4:3 | 1920 &times; 1280 px | 960 &times; 640 px | AVIF, WebP |
| **Safaris & Dunes** | `public/images/experiences/` | 16:9 or 3:2 | 1920 &times; 1080 px | 960 &times; 540 px | AVIF, WebP |
| **Cultural Evenings** | `public/images/evenings/` | 3:2 or 4:3 | 1920 &times; 1280 px | 960 &times; 640 px | AVIF, WebP |
| **Dining & Hi-Tea** | `public/images/dining/` | 4:3 or 1:1 | 1440 &times; 1080 px | 720 &times; 540 px | AVIF, WebP |
| **Curated Gallery** | `public/images/gallery/` | Mixed (3:2, 4:3, 2:3, 1:1) | 1920 &times; 1280 px | 960 &times; 640 px | AVIF, WebP |

### File Compression Targets:
- Maximum hero image weight: **&le; 180 KB** (AVIF).
- Standard gallery cards: **&le; 80 KB** (WebP/AVIF).
- Always generate placeholder blur data (`blurDataURL`) for progressive loading.

---

## 3. Textures & Overlays (`public/textures/`)

- **Curtain Intro Textures**:
  - Unbleached organic cotton/linen weave texture with transparent alpha channel for the parting intro curtains.
  - Dimensions: 1920 &times; 1080 px per curtain wing (left and right), optimized as WebP/PNG (&le; 150 KB).
- **Paper & Desert Sand Grain**:
  - Ultra-subtle monochrome noise overlay (opacity: 2–4%) to add tactile grain to solid backgrounds without impacting readability.

---

## 4. Typography & Font Licensing (`public/fonts/`)

In Phase 1, the design system utilizes high-quality system font stacks to ensure instantaneous page rendering. For subsequent phases, self-hosted fonts must adhere to:

- **Format**: Strictly modern `.woff2` files (compressed with brotli).
- **Font Display**: `font-display: swap` to prevent Flash of Invisible Text (FOIT).
- **Editorial Serif Pairing**:
  - *Primary Display*: Cormorant Garamond / Canela / Editorial New (300, 400, 500, Italic).
- **Interface Sans Pairing**:
  - *Body & Controls*: Inter / Plus Jakarta Sans / General Sans (400, 500, 600).
- **Storage**: Place files in `public/fonts/` with appropriate licensing clearances.
