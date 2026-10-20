/**
 * @file discovery.ts
 * @description Supplied editorial copy, headings, and confirmed offerings for RETIVAA's
 * scroll-driven horizontal discovery sequence.
 */

export interface DiscoveryStory {
  readonly id: string;
  readonly index: string;
  readonly total: string;
  readonly eyebrow: string;
  readonly headingLines: readonly [string, string];
  readonly leadParagraph: string;
  readonly supportingParagraph: string;
  readonly featureLine: string;
  readonly cta: {
    readonly label: string;
    readonly href: string;
    readonly isWhatsApp?: boolean;
    readonly whatsappPrompt?: string;
  };
  readonly image: {
    readonly src: string;
    readonly alt: string;
    readonly objectPosition?: string;
  };
}

export interface DiscoverySectionContent {
  readonly intro: {
    readonly eyebrow: string;
    readonly heading: string;
    readonly supportingLine: string;
  };
  readonly stories: readonly DiscoveryStory[];
}

export const DISCOVERY_CONTENT: DiscoverySectionContent = {
  intro: {
    eyebrow: "DISCOVER RETIVAA",
    heading: "Three ways to feel the desert.",
    supportingLine:
      "Stay close to the sands, follow the open horizon, and experience the warmth of Rajasthan.",
  },
  stories: [
    {
      id: "panel-stay",
      index: "01",
      total: "03",
      eyebrow: "01 / STAY",
      headingLines: ["A slower stay.", "A different world."],
      leadParagraph:
        "Make room for a different rhythm in Jaisalmer. A tent stay at RETIVAA brings your journey closer to the sands and the spirit of Rajasthan.",
      supportingParagraph:
        "Let your stay become the starting point for time among the dunes and evenings around the camp. Ask us about accommodation arrangements and the experiences available during your visit.",
      featureLine: "Accommodation in Tent",
      cta: {
        label: "Enquire about a tent stay",
        href: "/contact",
        isWhatsApp: true,
        whatsappPrompt:
          "Hello RETIVAA, I would like to enquire about tent stay accommodation and arrangements in Jaisalmer.",
      },
      image: {
        src: "/images/gallery/tent-bedroom-suite.jpg",
        alt: "Handcrafted luxury desert tent suite with king bed and lantern ambiance at RETIVAA",
        objectPosition: "center 45%",
      },
    },
    {
      id: "panel-explore",
      index: "02",
      total: "03",
      eyebrow: "02 / EXPLORE",
      headingLines: ["Follow the dunes.", "Find your moment."],
      leadParagraph:
        "Discover the Thar through the gentle rhythm of a camel safari, the changing light at sunset, and the energy of a jeep adventure.",
      supportingParagraph:
        "Each experience offers a different way to spend time in the desert. Tell us what interests you, and ask about availability and arrangements for your visit.",
      featureLine: "Camel Safari · Sunset Point in Sand Dunes · Jeep Safari",
      cta: {
        label: "Enquire about desert experiences",
        href: "/contact",
        isWhatsApp: true,
        whatsappPrompt:
          "Hello RETIVAA, I would like to enquire about camel safaris, dune sunsets and jeep adventures in Jaisalmer.",
      },
      image: {
        src: "/images/gallery/safari-4x4-dune-bashing.jpg",
        alt: "4x4 Thar open jeep safari drifting through the golden sand ridges of Jaisalmer",
        objectPosition: "center 50%",
      },
    },
    {
      id: "panel-experience",
      index: "03",
      total: "03",
      eyebrow: "03 / EXPERIENCE",
      headingLines: ["When daylight fades,", "Rajasthan comes alive."],
      leadParagraph:
        "As the light softens, the camp takes on a different character. Folk music, traditional dance, and the warmth of a campfire bring people together.",
      supportingParagraph:
        "Ask about evening hi-tea snacks, cultural performances, the fire show, and dinner and breakfast arrangements. Experiences and inclusions depend on the stay you choose.",
      featureLine: "Folk Dance · Live Folk Music · Camp Fire – Fire Show",
      cta: {
        label: "Plan your camp experience",
        href: "/contact",
        isWhatsApp: true,
        whatsappPrompt:
          "Hello RETIVAA, I would like to plan a desert camp experience including folk music, cultural performances and campfire evenings.",
      },
      image: {
        src: "/images/gallery/culture-campfire-fire-show.jpg",
        alt: "Spectacular Kalbelia fire-show performance illuminating the camp night in Jaisalmer",
        objectPosition: "center 55%",
      },
    },
  ],
} as const;

export const DISCOVERY_STORIES = DISCOVERY_CONTENT.stories;
