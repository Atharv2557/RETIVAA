# Test Suite (`tests/`)

## Reserved Scope (Phase 5 QA)

This directory is reserved for unit, integration, and browser testing. In accordance with Phase 1 constraints, no test framework has been pre-installed and no dummy tests have been written solely for scaffolding.

### Planned Test Suites:
1. **Unit Tests (`tests/unit/`)**:
   - `enquiry-validation.test.ts`: Verify rejection of past dates, verify checkout > checkin rule, verify adult count (&ge; 1), verify child count (&ge; 0).
   - `whatsapp-payload.test.ts`: Verify accurate URL-encoding and structured text message composition.
   - `site-config.test.ts`: Verify `isConfigured()` correctly guards bracketed placeholders and prevents broken links.
2. **End-to-End / Browser Tests (`tests/e2e/`)**:
   - Navigation flow across Home, Gallery, and Contact routes.
   - Screen width regressions at 360px, 390px, 768px, and 1440px desktop.
   - Lightbox keyboard trapping (`Escape`, `ArrowLeft`, `ArrowRight`).
   - Curtain intro skip button behavior and `sessionStorage` persistence.
   - Reduced-motion detection and animation bypass.
