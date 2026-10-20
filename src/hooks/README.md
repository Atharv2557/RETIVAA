# Shared React Hooks (`src/hooks/`)

## Architectural Boundary Policy

This directory is reserved strictly for **genuinely shared, application-wide React hooks**.

### Rules:
1. **No Premature Browser Hooks**:
   - In accordance with Phase 1 constraints, do not add browser hooks (e.g. `useScrollPosition`, `useWindowSize`, `useEventListener`) until a component actively consumes them.
2. **Planned Shared Hooks**:
   - `useReducedMotion.ts`: Observes the `(prefers-reduced-motion: reduce)` media query with SSR-safe initial fallback.
   - `useLockBodyScroll.ts`: Safely disables document body scroll during modal dialog or mobile menu activation, accounting for scrollbar layout shift.
3. **Feature Locality**:
   - Hooks used exclusively by one feature (such as `useGalleryFilter` or `useEnquiryForm`) must be housed within `src/features/<feature>/hooks/`, not here.
