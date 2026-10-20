# Motion Architecture & Reserved Provider (`src/components/motion/`)

## Architectural Overview
This directory is reserved for animation orchestration, GSAP timelines, Lenis smooth scrolling, and reduced-motion handling.

> **CRITICAL RULE**: Do not initialize GSAP, ScrollTrigger, or Lenis in Phase 1. All content must remain fully server-rendered and readable when JavaScript or animation scripts are absent or fail.

---

## Single Coordinated Update Loop Architecture

When GSAP and Lenis are introduced in later phases, they MUST share **a single coordinated requestAnimationFrame (rAF) update loop** to prevent frame dropping, scroll desynchronization, and jitter.

### Planned Integration Model:
```typescript
// Conceptual architecture for later phases:
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// 1. Initialize Lenis smooth scroll
const lenis = new Lenis({
  lerp: 0.1,
  smoothWheel: true,
  // Preserve native touch scrolling on mobile to avoid high-latency scrolling:
  touchMultiplier: 1.0,
});

// 2. Synchronize Lenis scroll position with ScrollTrigger
lenis.on("scroll", ScrollTrigger.update);

// 3. Connect GSAP ticker to drive Lenis updates in one unified loop
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

// 4. Disable GSAP internal lag smoothing to prevent time jumps
gsap.ticker.lagSmoothing(0);
```

---

## Lifecycle & Cleanup Rules

1. **Explicit Timeline Cleanup**:
   - Any component that creates a GSAP timeline or ScrollTrigger instance must use `gsap.context()` inside a `useLayoutEffect` or `useEffect`.
   - The returned cleanup function must call `ctx.revert()` to kill all triggers and reset inline DOM styles.
2. **Native Touch Scrolling Preservation**:
   - Lenis must never highjack or disable native touch scrolling on iOS/Android devices. Mobile scrolling remains native and fluid.
3. **Reduced Motion**:
   - Check `window.matchMedia('(prefers-reduced-motion: reduce)')`.
   - If reduced motion is requested, disable Lenis smoothing and immediately resolve intro sequences without animated scroll pinning.
4. **Progressive Enhancement & Fallback**:
   - Content must never start at `opacity: 0` or `transform: translateY(100px)` in raw CSS without a fallback.
   - If JavaScript fails to load or GSAP encounters an error, all text, headings, and photographs remain 100% visible and accessible.
