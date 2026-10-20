/**
 * @file facilities.ts
 * @description All 9 confirmed facilities for RETIVAA.
 *
 * ARCHITECTURAL INTEGRITY RULE:
 * Preserve these exact confirmed facility names verbatim.
 * Do NOT invent accommodation amenities, package inclusions, prices, reviews,
 * awards, or activity timings.
 */

export interface Facility {
  readonly id: string;
  readonly name: string;
  readonly category: "stay" | "safari" | "experience" | "dining" | "culture";
}

export const CONFIRMED_FACILITIES: readonly Facility[] = [
  {
    id: "accommodation-in-tent",
    name: "Accommodation in Tent",
    category: "stay",
  },
  {
    id: "camel-safari",
    name: "Camel Safari in Thar Desert",
    category: "safari",
  },
  {
    id: "sunset-point",
    name: "Sunset Point in Sand Dunes",
    category: "experience",
  },
  {
    id: "evening-hi-tea",
    name: "Evening Hi-Tea Snacks",
    category: "dining",
  },
  {
    id: "rajasthani-folk-dance",
    name: "Rajasthani Folk Dance",
    category: "culture",
  },
  {
    id: "live-folk-music",
    name: "Live Rajasthani Folk Music",
    category: "culture",
  },
  {
    id: "campfire-fire-show",
    name: "Camp Fire – Fire Show",
    category: "culture",
  },
  {
    id: "dinner-breakfast",
    name: "Dinner & Breakfast",
    category: "dining",
  },
  {
    id: "jeep-safari",
    name: "Jeep Safari",
    category: "safari",
  },
] as const;
