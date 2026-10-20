# RETIVAA — Frontend Architecture Documentation

## 1. Architectural Principles

1. **Server Components by Default**:
   - Every page and layout component in `src/app/` is rendered on the server.
   - Client Components (`"use client"`) are strictly reserved for interactive leaves (form inputs, lightbox focus trapping, and GSAP/Lenis animation wrappers).
2. **Feature-Based Modularity**:
   - Code is organized by business feature (`src/features/home/`, `src/features/gallery/`, `src/features/enquiry/`).
   - Domain-specific types, validation routines, and components remain colocated within their feature directory.
3. **No Unnecessary Abstractions**:
   - No backend controllers, ORMs, databases, user authentication, Redux stores, or mock payment gateways.
   - Clean, functional TypeScript and native Next.js primitives.
4. **Resilient Progressive Enhancement**:
   - The entire website must remain 100% readable and navigable if JavaScript is disabled or fails to load.
   - No content starts at `opacity: 0` without JS-governed progressive enhancement.

---

## 2. Directory Layout & Boundaries

```
retivaa/
├── docs/                      # Architectural specifications and plans
│   ├── project-brief.md
│   ├── architecture.md
│   ├── implementation-plan.md
│   ├── asset-guide.md
│   └── acceptance-checklist.md
├── public/                    # Static public assets
│   ├── fonts/                 # Self-hosted WOFF2 fonts
│   ├── images/                # Categorized photography
│   │   ├── camp/
│   │   ├── dining/
│   │   ├── evenings/
│   │   ├── experiences/
│   │   ├── gallery/
│   │   └── hero/
│   └── textures/              # Curtain & textile grain assets
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── contact/           # Contact & enquiries route
│   │   ├── gallery/           # Curated photo gallery route
│   │   ├── globals.css        # Tailwind v4 theme & CSS tokens
│   │   ├── layout.tsx         # Root layout with metadata & skip link
│   │   ├── not-found.tsx      # Branded 404 page
│   │   └── page.tsx           # Home route
│   ├── components/
│   │   ├── layout/            # SiteHeader, SiteFooter, Container, MobileMenu
│   │   ├── media/             # Responsive photography wrappers
│   │   ├── motion/            # Animation provider & GSAP/Lenis loop
│   │   └── ui/                # Reusable accessible UI primitives (Button)
│   ├── config/
│   │   └── site.config.ts     # Single source of truth for brand & contact
│   ├── content/
│   │   ├── facilities.ts      # 9 confirmed facilities verbatim
│   │   ├── gallery.ts         # Categories & photo collection model
│   │   └── home.ts            # Client-supplied hero copy & section plans
│   ├── features/
│   │   ├── enquiry/           # Form types, validation & WhatsApp compilation
│   │   ├── gallery/           # Filter types & lightbox contracts
│   │   └── home/              # Planned homepage section catalog
│   ├── hooks/                 # Shared generic hooks (e.g. useReducedMotion)
│   └── types/                 # Cross-feature shared types (NavItem, etc.)
└── tests/                     # Reserved for Phase 5 unit & browser tests
```

---

## 3. Motion & Smooth Scrolling Architecture

### 3.1 Single Update Loop
To avoid micro-stuttering and race conditions between smooth scrolling and scroll-triggered animations:
- Lenis handles the smoothed scroll position.
- GSAP's `ticker` drives Lenis's `raf()` call on every frame.
- ScrollTrigger subscribes to Lenis's `scroll` event.

### 3.2 Cleanup & Memory Management
- Every GSAP animation must be wrapped inside a `gsap.context()` scope.
- Component unmounts invoke `ctx.revert()` to purge triggers, event listeners, and inline styles.

### 3.3 Touch & Mobile Discipline
- Native touch scrolling is preserved on mobile devices (`touchMultiplier: 1.0`).
- No virtual scroll hijacking on small screens.

### 3.4 Reduced Motion
- When `(prefers-reduced-motion: reduce)` is detected:
  - GSAP animations are bypassed or zero-durationed.
  - The curtain intro resolves immediately on initial render.
  - Lenis smooth scrolling is disabled.

---

## 4. Central Configuration & Truth Policy

All contact and brand values are centralized in `src/config/site.config.ts`:
- Bracketed values (e.g. `[PHONE NUMBER]`) indicate unconfigured data.
- The `isConfigured()` helper prevents rendering broken functional links (`tel:`, `mailto:`, `wa.me/`).
- Social channel links remain hidden when unconfigured.
- Enquiry controls provide an honest explanatory note rather than navigating to a non-existent WhatsApp URL.

---

## 5. Design System & Design Tokens

Implemented via Tailwind CSS v4 `@theme` in `src/app/globals.css`:
- `--color-warm-ivory: #F6EFE3` (Primary background, evokes desert limestone and linen).
- `--color-sandstone: #D7B98E` (Subtle border and divider tone, evokes golden dunes).
- `--color-antique-gold: #B88A44` (Accent tone, evokes desert sunlight and Rajasthani brass).
- `--color-terracotta: #A65335` (Accent and focus ring tone, evokes baked earth).
- `--color-deep-brown: #30251F` (Primary text ink, ensures WCAG AA contrast against ivory).
- `--color-evening-charcoal: #191918` (Night palette, footer, and lightbox backdrop).
