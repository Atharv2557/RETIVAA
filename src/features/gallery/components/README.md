# Gallery Feature Components (`src/features/gallery/components/`)

## Architectural Overview
This directory houses components responsible for displaying and interacting with RETIVAA's photography collection.

---

## Planned Components

### 1. `GalleryFilters.tsx`
- **Categories**:
  - `All`
  - `Tents`
  - `Desert & Safaris`
  - `Cultural Evenings`
  - `Dining`
- **UX & Accessibility**:
  - Implemented as an accessible tab list (`role="tablist"`).
  - ARIA attributes: `role="tab"`, `aria-selected="true|false"`, `aria-controls="gallery-grid"`.
  - Arrow key navigation between filter tabs.
  - Active indicator with subtle desert gold accent (`#B88A44`).

### 2. `GalleryGrid.tsx`
- **Layout**:
  - Responsive CSS grid (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6`).
  - Intrinsic aspect ratios maintained to prevent CLS.
- **Empty States**:
  - For categories lacking supplied photographs, renders an honest, respectful notification (e.g. *"Photographs for this category are currently being curated on location in Jaisalmer."*).
- **Progressive Enhancement**:
  - High-resolution photographs load lazily via Next.js `<Image>`.
  - Clicking any image activates the accessible lightbox.

### 3. `GalleryLightbox.tsx`
- **Accessibility & Focus Management**:
  - Implemented using the native HTML `<dialog>` or accessible modal pattern (`role="dialog"`, `aria-modal="true"`).
  - Focus is trapped within the lightbox while open.
  - Previous focus element is restored upon close.
  - Full keyboard control: `Escape` to close, `ArrowLeft` for previous photo, `ArrowRight` for next photo.
- **Touch / Mobile Gestures**:
  - Supports horizontal swipe gesture navigation on touchscreen devices.
- **Visuals**:
  - Dark desert night backdrop (`#191918` at 95% opacity).
  - Image captions and photo counters (e.g. "3 of 12").
