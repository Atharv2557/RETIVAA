/**
 * @file experiences.ts
 * @description Confirmed editorial content for the RETIVAA Experience section.
 * Contains the five experience blocks, exact copy, image paths, alternative image configurations,
 * captions, color tokens, and adjacent panel features & highlights.
 */

export interface ExperienceImage {
  readonly src: string;
  readonly alt: string;
  readonly isPlaceholder?: boolean;
}

export interface ExperienceAlternativeImage {
  readonly src: string;
  readonly alt: string;
  readonly caption?: string;
}

export interface ExperienceColorPalette {
  readonly bg: string;
  readonly cardBorder: string;
  readonly accent: string;
  readonly badgeBg: string;
}

export interface ExperienceItem {
  readonly id: string;
  readonly index: string; // e.g. "01"
  readonly category: string; // e.g. "TENT STAYS"
  readonly eyebrowBadge: string; // e.g. "PREMIUM COMFORT · TENT STAY"
  readonly title: string; // e.g. "Stay beneath canvas."
  readonly description: string;
  readonly leadText: string;
  readonly features: readonly string[]; // 4 items for 2x2 grid with dashes
  readonly pricingNote: string;
  readonly image: ExperienceImage;
  readonly alternativeImage?: ExperienceAlternativeImage;
  readonly photoCaption: string;
  readonly ctaLabel?: string;
  readonly color: ExperienceColorPalette;
  readonly illustration: "tent" | "safari" | "sunset" | "dining" | "cultural";
}

export interface ExperiencesSectionContent {
  readonly eyebrow: string;
  readonly heading: string;
  readonly introduction: string;
  readonly discreetNote: string;
  readonly items: readonly ExperienceItem[];
}

export const EXPERIENCES_CONTENT: ExperiencesSectionContent = {
  eyebrow: "THE RETIVAA EXPERIENCE",
  heading: "Five ways to feel Rajasthan.",
  introduction:
    "Stay beneath canvas, explore the dunes, and discover evenings shaped by food, music and desert skies.",
  discreetNote:
    "Experiences and inclusions vary. Please enquire about availability and your preferred stay.",
  items: [
    {
      id: "experience-tent-stays",
      index: "01",
      category: "TENT STAYS",
      eyebrowBadge: "PREMIUM COMFORT · TENT STAY",
      title: "Stay beneath canvas.",
      description:
        "Make a tent stay part of your Jaisalmer escape, with the desert setting the pace for time away.",
      leadText:
        "A handcrafted luxury tent accommodation sitting directly along the Thar sands, combining peaceful seclusion, private modern washrooms, and open-air lantern verandas.",
      features: [
        "LUXURY CANVAS SUITE",
        "EN-SUITE BATHROOM",
        "PRIVATE DUNE VERANDA",
        "DAILY HI-TEA & DINNER",
      ],
      pricingNote: "LUXURY TENT STAY · ENQUIRE FOR DETAILS",
      image: {
        src: "/images/gallery/tent-bedroom-suite.jpg",
        alt: "Handcrafted luxury canvas tent suite with king bed, striped canopy, and air conditioning at RETIVAA",
      },
      photoCaption: "Accommodation in Tent",
      ctaLabel: "Enquire about your stay ↗",
      color: {
        bg: "#FAF6F0",
        cardBorder: "rgba(48, 37, 31, 0.12)",
        accent: "#A65335", // Terracotta
        badgeBg: "rgba(166, 83, 53, 0.08)",
      },
      illustration: "tent",
    },
    {
      id: "experience-desert-safaris",
      index: "02",
      category: "DESERT SAFARIS",
      eyebrowBadge: "THAR EXPEDITION · SAFARIS",
      title: "Follow the dunes.",
      description:
        "Discover the Thar through a camel safari or a jeep safari, with open sand and sweeping desert views along the way.",
      leadText:
        "Traverse the wind-sculpted sand ridges of Jaisalmer through a rhythmic camel caravan or an energetic 4x4 open jeep safari guided by local Thar specialists.",
      features: [
        "GUIDED CAMEL CARAVAN",
        "4X4 OPEN JEEP SAFARI",
        "SUNSET DUNE CROSSING",
        "EXPERIENCED LOCAL GUIDES",
      ],
      pricingNote: "SUNSET & MORNING DEPARTURES · ARRANGED ON SITE",
      image: {
        src: "/images/gallery/safari-4x4-dune-bashing.jpg",
        alt: "High-energy 4x4 open jeep safari drifting through the golden Thar dunes near Jaisalmer",
      },
      alternativeImage: {
        src: "/images/gallery/safari-camel-sunset-walk.jpg",
        alt: "Golden hour camel trek traversing the rippling sand dunes near Jaisalmer",
        caption: "Sunset Camel Caravan",
      },
      photoCaption: "Camel & Jeep Safaris",
      ctaLabel: "Enquire about safaris ↗",
      color: {
        bg: "#F8F2E8",
        cardBorder: "rgba(184, 138, 68, 0.18)",
        accent: "#B88A44", // Antique Gold
        badgeBg: "rgba(184, 138, 68, 0.10)",
      },
      illustration: "safari",
    },
    {
      id: "experience-sunset-sand",
      index: "03",
      category: "SUNSET ON THE SAND",
      eyebrowBadge: "THE GOLDEN HOUR · DUNE POINT",
      title: "Stay for the golden hour.",
      description:
        "Watch the light soften across the sand dunes and enjoy the desert as day gives way to evening.",
      leadText:
        "Watch the afternoon light soften into amber across vast sand horizons. Enjoy peaceful low seating in virgin sand with traditional hot chai as evening begins.",
      features: [
        "PANORAMIC DUNE VIEWS",
        "CUSHIONED DUNE SEATING",
        "TRADITIONAL MASALA CHAI",
        "SUNSET PHOTOGRAPHY",
      ],
      pricingNote: "THE GOLDEN HOUR · ENQUIRE FOR DETAILS",
      image: {
        src: "/images/gallery/safari-camel-caravan-dunes.jpg",
        alt: "Majestic camel caravan resting atop undulating Thar desert dunes at sunset in Jaisalmer",
      },
      photoCaption: "Sunset Point in Sand Dunes",
      ctaLabel: "Enquire about sunset point ↗",
      color: {
        bg: "#F7EFE4",
        cardBorder: "rgba(215, 185, 142, 0.35)",
        accent: "#9E6238", // Warm Amber Sandstone
        badgeBg: "rgba(215, 185, 142, 0.18)",
      },
      illustration: "sunset",
    },
    {
      id: "experience-dining",
      index: "04",
      category: "DINING",
      eyebrowBadge: "ROYAL HOSPITALITY · DINING",
      title: "Gather around the table.",
      description:
        "From evening hi-tea snacks to dinner and breakfast, make time to pause, share a meal and enjoy your stay.",
      leadText:
        "Savor authentic regional delicacies prepared with wood-fire techniques and fragrant desert spices, served under starlit skies with warm traditional hospitality.",
      features: [
        "RAJASTHANI BRASS THALI",
        "WOOD-FIRED COOKING",
        "EVENING CAMP HI-TEA",
        "OPEN-AIR DESERT SEATING",
      ],
      pricingNote: "CAMP HI-TEA & DINNER · ENQUIRE FOR DETAILS",
      image: {
        src: "/images/gallery/dining-hall-interior.jpg",
        alt: "Spacious indoor dining hall with polished wooden tables and woven hanging lanterns at RETIVAA",
      },
      photoCaption: "Hi-Tea · Dinner · Breakfast",
      ctaLabel: "Enquire about dining ↗",
      color: {
        bg: "#F6ECE0",
        cardBorder: "rgba(166, 83, 53, 0.14)",
        accent: "#A65335", // Terracotta
        badgeBg: "rgba(166, 83, 53, 0.08)",
      },
      illustration: "dining",
    },
    {
      id: "experience-cultural-evenings",
      index: "05",
      category: "CULTURAL EVENINGS",
      eyebrowBadge: "DESERT NIGHT · FOLK ARTS",
      title: "Feel Rajasthan after dark.",
      description:
        "Discover Rajasthani folk dance and live folk music, with campfire and fire-show experiences adding to the evening atmosphere.",
      leadText:
        "Gather around the central campfire for hypnotic desert rhythms by folk musicians, vibrant Kalbelia dance recitals, and mesmerizing fire-show performances.",
      features: [
        "LIVE FOLK MUSICIANS",
        "KALBELIA DANCERS",
        "CENTRAL OPEN CAMPFIRE",
        "DRAMATIC FIRE SHOW",
      ],
      pricingNote: "CULTURAL EVENING · ENQUIRE FOR DETAILS",
      image: {
        src: "/images/gallery/culture-campfire-fire-show.jpg",
        alt: "Spectacular Kalbelia fire-breathing performance lighting the desert campfire night at RETIVAA",
      },
      alternativeImage: {
        src: "/images/gallery/culture-folk-ensemble-moonlight.jpg",
        alt: "Manganiyar folk musicians and Kalbelia dancers performing on stage under full moonlight",
        caption: "Folk Ensemble & Moonlit Arena",
      },
      photoCaption: "Music, Folk Dance & Firelight",
      ctaLabel: "Enquire about cultural nights ↗",
      color: {
        bg: "#F5EAE0",
        cardBorder: "rgba(184, 138, 68, 0.22)",
        accent: "#B88A44", // Antique Gold
        badgeBg: "rgba(184, 138, 68, 0.12)",
      },
      illustration: "cultural",
    },
  ],
} as const;

export interface DesertExperience {
  readonly id: string;
  readonly number: string;
  readonly title: string;
  readonly description: string;
  readonly image: {
    readonly src: string;
    readonly alt: string;
    readonly objectPosition?: string;
  };
  readonly href?: string;
}

export interface DesertExperiencesSectionData {
  readonly id: string;
  readonly eyebrow: string;
  readonly headingLines: readonly [string, string];
  readonly paragraphLines: readonly [string, string];
  readonly experiences: readonly DesertExperience[];
}

export const DESERT_EXPERIENCES_CONTENT: DesertExperiencesSectionData = {
  id: "desert-experiences",
  eyebrow: "DESERT EXPERIENCES",
  headingLines: ["Moments shaped", "by the desert."],
  paragraphLines: [
    "From quiet camel trails at sunset to the hypnotic rhythms of folk musicians",
    "and starlight embers — experience the timeless spirit of the Thar.",
  ],
  experiences: [
    {
      id: "camel-safari",
      number: "01",
      title: "CAMEL SAFARI",
      description:
        "Cross the dunes at the timeless pace of the desert as the Thar unfolds in silence.",
      image: {
        src: "/images/gallery/safari-camel-sunset-walk.jpg",
        alt: "Quiet golden hour camel trek through the undulating desert dunes at sunset in Jaisalmer",
        objectPosition: "center 45%",
      },
      href: "/contact",
    },
    {
      id: "jeep-safari",
      number: "02",
      title: "JEEP SAFARI",
      description:
        "Travel deeper into the landscape across open crests and undulating sand ridges.",
      image: {
        src: "/images/gallery/safari-4x4-dune-bashing.jpg",
        alt: "4x4 open Thar jeep expedition dune bashing across desert crests near Jaisalmer",
        objectPosition: "center 50%",
      },
      href: "/contact",
    },
    {
      id: "sunset-dunes",
      number: "03",
      title: "SUNSET DUNES",
      description:
        "Watch the desert change colour and soften into amber as daylight gives way to evening.",
      image: {
        src: "/images/gallery/safari-camel-caravan-dunes.jpg",
        alt: "Camel caravan resting on the golden sand dunes as evening sets in",
        objectPosition: "center 60%",
      },
      href: "/contact",
    },
    {
      id: "folk-dance",
      number: "04",
      title: "FOLK DANCE",
      description:
        "Hypnotic Kalbelia and traditional desert recitals celebrating centuries of Rajasthani rhythm.",
      image: {
        src: "/images/gallery/culture-kalbelia-dance.jpg",
        alt: "Traditional Kalbelia folk dance performance on the illuminated circular amphitheater stage",
        objectPosition: "center 35%",
      },
      href: "/contact",
    },
    {
      id: "live-music",
      number: "05",
      title: "LIVE MUSIC",
      description:
        "Soulful desert ragas and songs of the Thar played on traditional acoustic instruments.",
      image: {
        src: "/images/gallery/culture-folk-ensemble-moonlight.jpg",
        alt: "Live Rajasthani Manganiyar folk musicians playing harmonium and dholak under the moonlight",
        objectPosition: "center 40%",
      },
      href: "/contact",
    },
    {
      id: "campfire-evening",
      number: "06",
      title: "CAMPFIRE EVENING",
      description:
        "Gather around open embers beneath starlit skies as the desert cool settles in.",
      image: {
        src: "/images/gallery/culture-campfire-fire-show.jpg",
        alt: "Dramatic campfire fire-breathing show and evening gathering under the starlit sky",
        objectPosition: "center 55%",
      },
      href: "/contact",
    },
  ],
} as const;

export const DESERT_EXPERIENCES = DESERT_EXPERIENCES_CONTENT.experiences;

