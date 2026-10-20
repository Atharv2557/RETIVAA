# UI Primitives (`src/components/ui/`)

## Architectural Boundary Policy

This directory is strictly reserved for **genuinely reusable, unstyled or micro-styled UI primitives**.

### Rules:
1. **No Speculative Bloat**: Do not generate sprawling component libraries (e.g. dozens of unused inputs, accordions, avatars, or tooltips) until they are actually required by a specific feature.
2. **Accessible by Default**: Every primitive placed here must support WAI-ARIA guidelines, keyboard focus visibility (`:focus-visible`), and sensible screen-reader labels.
3. **Compound Components**: For complex primitives (modals, lightboxes, drawers), keep feature-specific logic within `src/features/<feature>/components/` and extract to this folder only when shared across two or more distinct features.
