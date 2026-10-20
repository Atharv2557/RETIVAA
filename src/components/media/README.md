# Media Components (`src/components/media/`)

## Architectural Purpose
This directory houses shared visual media components designed specifically for luxury responsive photography, aspect ratio preservation, art direction, and lazy loading.

### Guidelines:
1. **Aspect Ratio Reservation**: Prevent Cumulative Layout Shift (CLS) by enforcing reserved aspect ratios (`16/9`, `3/2`, `4/3`, `1/1`, `2/3`) for all imagery before asset load.
2. **Next.js `<Image>` Best Practices**:
   - Utilize modern formats (`image/avif`, `image/webp`).
   - Define exact `sizes` attribute strings to prevent oversized desktop payloads on mobile devices.
   - Use `priority` strictly for LCP candidates (e.g. above-the-fold desert hero photograph).
3. **Graceful Fallbacks**: Ensure placeholder states harmonize with the desert palette (`#F6EFE3` and `#D7B98E`) while assets stream.
