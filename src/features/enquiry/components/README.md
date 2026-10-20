# Enquiry Feature Components (`src/features/enquiry/components/`)

## Architectural Overview
This directory encapsulates all booking enquiry controls, form logic, date validation, and WhatsApp message construction for RETIVAA.

---

## Strict Domain Rules

1. **Enquiry Only (Never a Confirmed Booking)**:
   - This system facilitates direct booking *enquiries*. It must never present deceptive "Instant Confirmation", "Room Reserved", or automated booking guarantees.
   - No mock payment processors, gateway forms, or credit card inputs.
2. **Honest Availability State**:
   - If the site configuration WhatsApp number is unconfigured (remains `[WHATSAPP NUMBER WITH COUNTRY CODE]`), controls must visibly indicate that direct WhatsApp enquiries are temporarily unavailable rather than opening broken `wa.me/` URLs.
3. **Encapsulated Business Logic**:
   - All validation routines and WhatsApp payload construction must reside in `src/features/enquiry/` (e.g. `validation.ts` and `whatsapp.ts`), never leaking into page components.

---

## Planned Components

### 1. `EnquiryForm.tsx`
- **Fields**:
  - `name`: Guest full name (required, string, minimum 2 characters).
  - `checkIn`: Desired arrival date (required, ISO `YYYY-MM-DD`, cannot be in the past).
  - `checkOut`: Desired departure date (required, ISO `YYYY-MM-DD`, must be strictly after `checkIn`).
  - `adults`: Count of adult guests (required, integer >= 1).
  - `children`: Count of child guests (required, integer >= 0).
  - `experienceInterest`: Optional selection from confirmed activities (Camel Safari, Jeep Safari, Sunset Point, etc.).
  - `message`: Optional notes or dietary requests.
- **Client-Side Validation**:
  - Semantic HTML input validation paired with accessible ARIA error messages (`aria-invalid`, `aria-describedby`).
  - Real-time date comparison preventing check-out <= check-in.
- **Submission Action**:
  - On valid submission, serializes form data into a structured, readable, URL-encoded WhatsApp query string:
    ```
    Namaste RETIVAA Team,
    I would like to enquire about staying at your desert camp:
    - Guest: [Name]
    - Dates: [Check-in] to [Check-out]
    - Guests: [X] Adults, [Y] Children
    - Experiences: [Interest]
    - Notes: [Message]
    ```

### 2. `WhatsAppEnquiryButton.tsx`
- **Purpose**: Shared CTA button triggering direct WhatsApp conversation with pre-composed inquiry text.
- **Fallback**: Disables cleanly or routes to the standard contact form if WhatsApp is unconfigured.

### 3. `MobileStickyBookingBar.tsx`
- **Purpose**: Bottom-docked sticky enquiry trigger for mobile screens.
- **Safe Area**: Uses `env(safe-area-inset-bottom)` to respect home indicator bars on modern mobile devices.
- **Non-Obtrusive**: Automatically hides or avoids covering active form input fields when the user enters the `/contact` route or scrolls to an inline form.
