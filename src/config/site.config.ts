/**
 * @file site.config.ts
 * @description Central typed configuration for RETIVAA.
 *
 * IMPORTANT ARCHITECTURAL RULES:
 * 1. This file is the SINGLE editable source for brand identity, contact details, and external links.
 * 2. Do NOT invent real telephone numbers, addresses, social handles, or email accounts.
 * 3. Any value remaining enclosed in square brackets (e.g. `[PHONE NUMBER]`) is considered UNCONFIGURED.
 * 4. Helper utilities (`isConfigured`, `getWhatsAppEnquiryUrl`) ensure unconfigured values degrade
 *    gracefully: social icons remain hidden, and WhatsApp enquiry controls render an honest
 *    unavailable state rather than generating broken, deceptive links.
 */

export interface BrandConfig {
  readonly name: string;
  readonly tagline: string;
  readonly location: string;
  readonly region: string;
  readonly state: string;
  readonly country: string;
  readonly description: string;
}

export interface ContactConfig {
  readonly whatsapp: string;
  readonly phone: string;
  readonly email: string;
  readonly address: string;
  readonly directionsUrl: string;
  readonly mapEmbedUrl: string;
}

export interface SocialConfig {
  readonly instagram: string;
  readonly facebook: string;
  readonly youtube: string;
}

export interface SiteConfig {
  readonly brand: BrandConfig;
  readonly contact: ContactConfig;
  readonly social: SocialConfig;
}

export const siteConfig: SiteConfig = {
  brand: {
    name: "RETIVAA",
    tagline: "Where the dunes become your home.",
    location: "Jaisalmer, Rajasthan, India",
    region: "Thar Desert",
    state: "Rajasthan",
    country: "India",
    description:
      "A premium desert camp retreat in the Thar Desert of Jaisalmer, Rajasthan, offering luxury tented stays, desert safaris, and authentic cultural evenings.",
  },
  contact: {
    // Exact placeholder values as required by project specifications:
    whatsapp: "[WHATSAPP NUMBER WITH COUNTRY CODE]",
    phone: "[PHONE NUMBER]",
    email: "[EMAIL ADDRESS]",
    address: "[EXACT CAMP LOCATION]",
    directionsUrl: "[MAP DIRECTIONS URL]",
    mapEmbedUrl: "[MAP EMBED URL]",
  },
  social: {
    instagram: "[INSTAGRAM]",
    facebook: "[FACEBOOK]",
    youtube: "[YOUTUBE]",
  },
} as const;

/**
 * Checks whether a configuration value has been populated with a real, valid string.
 * Bracketed placeholders (e.g. `[PHONE NUMBER]`) or empty strings return false.
 */
export function isConfigured(value: string | null | undefined): boolean {
  if (!value) return false;
  const trimmed = value.trim();
  if (trimmed === "") return false;
  // If the value is still wrapped in bracketed placeholder notation, consider it unconfigured
  if (trimmed.startsWith("[") && trimmed.endsWith("]")) return false;
  return true;
}

/**
 * Generates a direct WhatsApp click-to-chat URL if a valid WhatsApp number is configured.
 * Returns null if the number is unconfigured or a placeholder, allowing UI components
 * to render an honest unavailable state.
 *
 * @param message Optional pre-filled text for enquiry
 */
export function getWhatsAppEnquiryUrl(message?: string): string | null {
  if (!isConfigured(siteConfig.contact.whatsapp)) {
    return null;
  }

  // Clean non-digit characters except leading plus
  const sanitizedNumber = siteConfig.contact.whatsapp.replace(/[^\d+]/g, "");
  const encodedText = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${sanitizedNumber}${encodedText}`;
}

/**
 * Returns safe social link definitions, omitting any that remain unconfigured.
 */
export function getConfiguredSocialLinks(): Array<{ platform: "instagram" | "facebook" | "youtube"; label: string; href: string }> {
  const links: Array<{ platform: "instagram" | "facebook" | "youtube"; label: string; href: string }> = [];

  if (isConfigured(siteConfig.social.instagram)) {
    links.push({ platform: "instagram", label: "Instagram", href: siteConfig.social.instagram });
  }
  if (isConfigured(siteConfig.social.facebook)) {
    links.push({ platform: "facebook", label: "Facebook", href: siteConfig.social.facebook });
  }
  if (isConfigured(siteConfig.social.youtube)) {
    links.push({ platform: "youtube", label: "YouTube", href: siteConfig.social.youtube });
  }

  return links;
}
