/**
 * @file home.ts
 * @description Supplied copy and section content models for the RETIVAA homepage.
 *
 * ARCHITECTURAL RULE:
 * Hero copy matches the client-supplied text strictly.
 * Planned section descriptors define structural boundaries for upcoming phases.
 */

export interface HeroCopy {
  readonly eyebrow: string;
  readonly headline: string;
  readonly supportingText: string;
  readonly primaryCta: {
    readonly label: string;
    readonly intent: "whatsapp_enquiry";
  };
  readonly secondaryCta: {
    readonly label: string;
    readonly href: string;
  };
}

export interface WelcomePillar {
  readonly number: string;
  readonly title: string;
  readonly description: string;
}

export interface WelcomeCopy {
  readonly eyebrow: string;
  readonly headline: string;
  readonly narrative: string;
  readonly cta: {
    readonly label: string;
    readonly href: string;
  };
  readonly image: {
    readonly src: string;
    readonly alt: string;
  };
  readonly pillars: readonly WelcomePillar[];
}

export interface StayHighlight {
  readonly number: string;
  readonly title: string;
  readonly description: string;
}

export interface StayCopy {
  readonly id: string;
  readonly eyebrow: string;
  readonly headline: string;
  readonly narrative: string;
  readonly cta: {
    readonly label: string;
    readonly href: string;
  };
  readonly primaryCta: {
    readonly label: string;
    readonly href: string;
  };
  readonly secondaryCta?: {
    readonly label: string;
    readonly href: string;
  };
  readonly image: {
    readonly src: string;
    readonly alt: string;
    readonly caption: string;
  };
  readonly highlights: readonly StayHighlight[];
  readonly mainImage?: {
    readonly src: string;
    readonly alt: string;
    readonly caption: string;
  };
  readonly detailImage?: {
    readonly src: string;
    readonly alt: string;
    readonly caption?: string;
  };
}

export interface ExploreExperience {
  readonly number: string;
  readonly title: string;
  readonly description: string;
}

export interface ExploreCopy {
  readonly id: string;
  readonly eyebrow: string;
  readonly headline: string;
  readonly narrative: string;
  readonly image: {
    readonly src: string;
    readonly alt: string;
    readonly caption?: string;
  };
  readonly experiences: readonly ExploreExperience[];
}

export interface SectionDescriptor {
  readonly id: string;
  readonly title: string;
  readonly subtitle?: string;
  readonly plannedPurpose: string;
}

export interface HomeContent {
  readonly hero: HeroCopy;
  readonly welcome: WelcomeCopy;
  readonly stay: StayCopy;
  readonly explore: ExploreCopy;
  readonly plannedSections: readonly SectionDescriptor[];
}

export const homeContent: HomeContent = {
  hero: {
    eyebrow: "JAISALMER · RAJASTHAN",
    headline: "Where the dunes become your home.",
    supportingText: "Tent stays, desert safaris and evenings filled with the spirit of Rajasthan.",
    primaryCta: {
      label: "Enquire on WhatsApp",
      intent: "whatsapp_enquiry",
    },
    secondaryCta: {
      label: "Explore the Camp",
      href: "#camp-overview",
    },
  },
  welcome: {
    eyebrow: "WELCOME TO RETIVAA",
    headline: "A quieter way to experience Jaisalmer.",
    narrative:
      "RETIVAA is a desert camp shaped around the simple pleasures of the Thar — staying close to the dunes, watching the light change across the sand, and spending evenings with the music and warmth of Rajasthan.",
    cta: {
      label: "Discover the experience",
      href: "#experience-pillars",
    },
    image: {
      src: "/images/gallery/camp-daytime-amphitheater.jpg",
      alt: "Daytime view of RETIVAA luxury desert camp featuring circular amphitheater, lush lawn, and rows of pristine swiss tents",
    },
    pillars: [
      {
        number: "01",
        title: "STAY",
        description: "Tent living close to the dunes.",
      },
      {
        number: "02",
        title: "EXPLORE",
        description: "Camel safari, jeep safari and sunset across the Thar.",
      },
      {
        number: "03",
        title: "EXPERIENCE",
        description: "Rajasthani music, folk dance and evenings around the camp.",
      },
    ],
  },
  stay: {
    id: "stay",
    eyebrow: "THE STAY",
    headline: "Luxury Tents. Timeless Experiences.",
    narrative:
      "Experience the perfect blend of traditional Rajasthani hospitality and modern comfort in our elegantly designed desert tents, where every detail is crafted for an unforgettable stay beneath the desert sky.",
    cta: {
      label: "Explore The Stay",
      href: "/contact",
    },
    primaryCta: {
      label: "Explore The Stay",
      href: "/contact",
    },
    secondaryCta: {
      label: "Watch Video",
      href: "#stay-video",
    },
    image: {
      src: "/images/gallery/tent-bedroom-suite.jpg",
      alt: "Luxury royal canvas tent suite at RETIVAA with plush king bed, striped canopy, and air conditioning",
      caption: "STAY · RELAX · RECONNECT",
    },
    highlights: [
      {
        number: "01",
        title: "Spacious Tents",
        description: "WITH MODERN AMENITIES",
      },
      {
        number: "02",
        title: "Premium Comfort",
        description: "FOR A RESTFUL STAY",
      },
      {
        number: "03",
        title: "Desert Views",
        description: "RIGHT AT YOUR DOORSTEP",
      },
    ],
    mainImage: {
      src: "/images/gallery/tent-bedroom-suite.jpg",
      alt: "Luxury royal canvas tent suite at RETIVAA with plush king bed, striped canopy, and air conditioning",
      caption: "STAY · RELAX · RECONNECT",
    },
    detailImage: {
      src: "/images/gallery/tent-bedroom-dressing.jpg",
      alt: "Handcrafted wooden furnishings and artisanal hand-painted standing mirror inside the luxury desert tent suite",
      caption: "Handcrafted Bedroom Details",
    },
  },
  explore: {
    id: "explore",
    eyebrow: "EXPLORE THE THAR",
    headline: "Beyond the camp, the desert begins.",
    narrative:
      "Step beyond the camp and into the open Thar — across sweeping dunes, quiet sunset trails and desert journeys shaped by Jaisalmer.",
    image: {
      src: "/images/gallery/safari-camel-caravan-dunes.jpg",
      alt: "Majestic camel safari caravan resting atop undulating golden sand dunes in the Thar Desert at sunset",
      caption: "BEYOND THE CAMP · INTO THE DUNES",
    },
    experiences: [
      {
        number: "01",
        title: "CAMEL SAFARI",
        description: "Cross the dunes at the timeless pace of the desert.",
      },
      {
        number: "02",
        title: "JEEP SAFARI",
        description: "Travel deeper into the landscape across the open Thar.",
      },
      {
        number: "03",
        title: "SUNSET DUNES",
        description: "Watch the desert change colour as evening settles in.",
      },
    ],
  },
  plannedSections: [
    {
      id: "curtain-intro",
      title: "Arrival at the Desert",
      plannedPurpose:
        "Desktop curtain intro with 120-160vh pinned scroll travel. Parts curtains (30%), dollies through tent opening (40%), and reveals desert hero (30%). Runs once per session with instant skip and reduced-motion bypass.",
    },
    {
      id: "desert-hero",
      title: "Hero Showcase",
      plannedPurpose:
        "Cinematic presentation of the Thar Desert horizon, introducing RETIVAA's landscape with the primary enquiry CTA and exploration link.",
    },
    {
      id: "welcome-section",
      title: "Welcome to Retivaa",
      plannedPurpose:
        "Editorial narrative introducing the luxury desert hospitality philosophy rooted in Jaisalmer's timeless heritage.",
    },
    {
      id: "tent-stay",
      title: "Accommodation in Tent",
      plannedPurpose:
        "Showcase of handcrafted luxury tent architecture, natural textiles, desert air cooling, and comfortable living amidst the dunes.",
    },
    {
      id: "desert-experiences",
      title: "Desert Safaris & Sunset Dunes",
      plannedPurpose:
        "Highlighting Camel Safari in Thar Desert, Sunset Point in Sand Dunes, and thrilling Jeep Safari excursions.",
    },
    {
      id: "evening-story",
      title: "Evenings Under Desert Stars",
      plannedPurpose:
        "Immersive journey through Rajasthani Folk Dance, Live Rajasthani Folk Music, and the Camp Fire – Fire Show by starlight.",
    },
    {
      id: "facilities-overview",
      title: "Confirmed Camp Facilities",
      plannedPurpose:
        "Curated grid showcasing all 9 confirmed amenities from evening hi-tea to dining and safaris.",
    },
    {
      id: "gallery-preview",
      title: "Moments in the Sand",
      plannedPurpose:
        "Visual preview linking to the full category-filtered photography gallery.",
    },
    {
      id: "final-enquiry",
      title: "Plan Your Desert Sanctuary",
      plannedPurpose:
        "Final invitation prompting direct communication and structured WhatsApp booking enquiry.",
    },
  ],
} as const;
