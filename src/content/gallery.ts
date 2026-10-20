/**
 * @file gallery.ts
 * @description Authentic Gallery categories & photography for RETIVAA with Super91 luxury card styling.
 * All images are authentic on-site resort photographs provided directly by the client.
 */

import type { GalleryCategory, GalleryImage } from "@/features/gallery/types";

export const GALLERY_CATEGORIES: readonly GalleryCategory[] = [
  {
    id: "tents",
    label: "TENTS & STAY",
    shortLabel: "TENTS",
    subtitle: "Canvas Luxury in Thar",
    description: "Handcrafted canvas suites with modern en-suite comforts, air conditioning, and lantern-lit verandas.",
    color: "#A65335", // Warm Terracotta
    badge: "01 · ROYAL CANVAS",
    iconName: "tent",
    coverImage: { src: "/images/gallery/tent-bedroom-suite.jpg", alt: "Royal Canvas Suite Bedroom" }
  },
  {
    id: "safaris",
    label: "DESERT SAFARI",
    shortLabel: "SAFARI",
    subtitle: "Dune Excursions & Expeditions",
    description: "High-octane 4x4 Thar dune bashing and tranquil sunset camel treks across golden sand horizons.",
    color: "#B88A44", // Antique Gold
    badge: "02 · DUNE EXPEDITION",
    iconName: "safari",
    coverImage: { src: "/images/gallery/safari-4x4-dune-bashing.jpg", alt: "4x4 Thar Dune Bashing Expedition" }
  },
  {
    id: "dining",
    label: "DESERT DINING",
    shortLabel: "DINING",
    subtitle: "Royal Hospitality Under Stars",
    description: "Wood-fired regional thalis, gourmet buffet dining, and royal hospitality in our lantern-lit dining pavilion.",
    color: "#9E6238", // Warm Amber Sandstone
    badge: "03 · ROYAL CUISINE",
    iconName: "dining",
    coverImage: { src: "/images/gallery/dining-hall-interior.jpg", alt: "Royal Desert Dining Pavilion" }
  },
  {
    id: "culture",
    label: "CULTURAL EVENINGS",
    shortLabel: "CULTURE",
    subtitle: "Folk Music & Kalbelia Fire",
    description: "Hypnotic Manganiyar folk rhythms, Kalbelia dances, and campfire fire performances under the desert night.",
    color: "#843926", // Deep Sunset Ochre
    badge: "04 · FOLK HERITAGE",
    iconName: "culture",
    coverImage: { src: "/images/gallery/culture-campfire-fire-show.jpg", alt: "Campfire & Fire Show Spectacle" }
  },
  {
    id: "camp",
    label: "CAMP & AMBIENCE",
    shortLabel: "CAMP",
    subtitle: "Sanctuary Beneath Starlight",
    description: "Serene lantern-lit sanctuaries framed by rolling sand ridges, central fountain, and pristine desert skies.",
    color: "#6D533E", // Desert Twilight
    badge: "05 · DUNE SANCTUARY",
    iconName: "camp",
    coverImage: { src: "/images/gallery/camp-starlit-panorama.jpg", alt: "Retivaa Desert Camp Under Stars" }
  }
] as const;

export const GALLERY_IMAGES: readonly GalleryImage[] = [
  // 1. Tents & Stays
  {
    id: "tent-suite",
    title: "Royal Canvas Suite Bedroom",
    category: "tents",
    src: "/images/gallery/tent-bedroom-suite.jpg",
    alt: "Interior of handcrafted luxury tent suite featuring plush king bed, striped canopy, air conditioning, and Rajasthani almirah",
    width: 1024,
    height: 682,
    caption: "Spacious air-conditioned canvas suites appointed with bespoke wooden furniture, king bedding, and authentic Rajasthani textiles.",
  },
  {
    id: "tent-dressing",
    title: "Suite & Artisanal Dressing Mirror",
    category: "tents",
    src: "/images/gallery/tent-bedroom-dressing.jpg",
    alt: "Luxury tent bedroom with king bed, ornate hand-painted Rajasthani standing mirror, tea station, and bedside stands",
    width: 1024,
    height: 682,
    caption: "Bespoke handcrafted furnishings including an artisanal hand-painted standing mirror, king bed, and private tea station.",
  },
  {
    id: "tent-veranda",
    title: "Lantern-lit Veranda Deck",
    category: "tents",
    src: "/images/gallery/tent-veranda-night.jpg",
    alt: "Private veranda of luxury tent suite with wooden lounge chairs and tea table overlooking the illuminated camp courtyard at night",
    width: 1024,
    height: 682,
    caption: "Private sit-out deck with comfortable deck chairs overlooking the central camp arena under the evening sky.",
  },
  {
    id: "tent-bathroom",
    title: "Modern En-Suite Bathroom",
    category: "tents",
    src: "/images/gallery/tent-ensuite-bathroom.jpg",
    alt: "En-suite bathroom in luxury tent featuring ceramic vanity wash basin, wooden framed mirror, geyser, and shower",
    width: 1024,
    height: 682,
    caption: "Full private attached bathroom complete with hot water geyser, ceramic vanity basin, shower, and modern amenities.",
  },

  // 2. Desert Safaris
  {
    id: "safari-jeep",
    title: "4x4 Thar Dune Bashing Expedition",
    category: "safaris",
    src: "/images/gallery/safari-4x4-dune-bashing.jpg",
    alt: "Open 4x4 Thar jeep drifting across steep golden sand dunes with sand spray under clear desert skies",
    width: 1024,
    height: 576,
    caption: "An adrenaline-pumping 4x4 off-road adventure climbing and descending the towering dunes of the Thar Desert.",
  },
  {
    id: "safari-camel-sunset",
    title: "Golden Hour Sunset Camel Trek",
    category: "safaris",
    src: "/images/gallery/safari-camel-sunset-walk.jpg",
    alt: "Guest walking alongside a beautifully decorated camel in the golden Thar Desert with the sun setting on the horizon",
    width: 1024,
    height: 768,
    caption: "A quintessential Rajasthani sunset journey across golden sand ridges at the timeless, gentle pace of camels.",
  },
  {
    id: "safari-camel-caravan",
    title: "Traditional Camel Caravan in Sand Dunes",
    category: "safaris",
    src: "/images/gallery/safari-camel-caravan-dunes.jpg",
    alt: "Caravan of camels resting on rippling golden dunes adorned with traditional embroidered colorful saddles at sunset",
    width: 1024,
    height: 768,
    caption: "Traditional desert camels dressed in vibrant hand-woven Rajasthani jhool saddles resting against the backdrop of an amber sunset.",
  },

  // 3. Desert Dining
  {
    id: "dining-hall",
    title: "Royal Desert Dining Pavilion",
    category: "dining",
    src: "/images/gallery/dining-hall-interior.jpg",
    alt: "Interior of the resort's dining hall featuring solid wooden tables, festive hanging lamps, and traditional Rajasthani wall art",
    width: 1024,
    height: 682,
    caption: "Warm and inviting indoor dining pavilion serving freshly prepared regional thalis, buffet breakfasts, and evening snacks.",
  },

  // 4. Cultural Evenings
  {
    id: "culture-fire-show",
    title: "Campfire & Dramatic Fire Show",
    category: "culture",
    src: "/images/gallery/culture-campfire-fire-show.jpg",
    alt: "Spectacular fire breathing performance with blazing fire burst and sparks in front of a campfire with audience gathered around",
    width: 1024,
    height: 682,
    caption: "An electrifying desert night spectacle featuring daring Rajasthani fire-breathing, burning embers, and a crackling central hearth.",
  },
  {
    id: "culture-ensemble",
    title: "Folk Ensemble & Kalbelia Dancers",
    category: "culture",
    src: "/images/gallery/culture-folk-ensemble-moonlight.jpg",
    alt: "Rajasthani folk musicians with dholak and harmonium performing alongside Kalbelia dancers on stage under full moonlight",
    width: 1024,
    height: 682,
    caption: "Celebrated Manganiyar folk masters playing dholak, harmonium, and khartal accompanying dazzling Kalbelia dance under the desert moon.",
  },
  {
    id: "culture-kalbelia",
    title: "Kalbelia Folk Dance Recital",
    category: "culture",
    src: "/images/gallery/culture-kalbelia-dance.jpg",
    alt: "Kalbelia dancers performing in traditional mirrored attire on the central circular amphitheater stage",
    width: 1024,
    height: 576,
    caption: "Mesmerizing Kalbelia folk dance recitals set against the desert night on the resort's central amphitheater stage.",
  },
  {
    id: "culture-amphitheater",
    title: "Royal Amphitheater Arena",
    category: "culture",
    src: "/images/gallery/culture-amphitheater-aerial.jpg",
    alt: "Elevated aerial night panorama of the circular performance stage and seating encircled by glowing luxury tents",
    width: 1024,
    height: 576,
    caption: "A magnificent circular desert amphitheater illuminated under spotlights with guest seating and glowing tent rows.",
  },
  {
    id: "culture-arena-night",
    title: "Live Folk Music & Evening Gathering",
    category: "culture",
    src: "/images/gallery/culture-evening-arena.jpg",
    alt: "Evening camp courtyard with central fountain, ceremonial flags, and seated audience watching live Rajasthani folk musicians on stage",
    width: 1024,
    height: 576,
    caption: "Guests gathered around the central courtyard and fountain enjoying authentic live Rajasthani folk musicians and singers.",
  },

  // 5. Camp Sanctuary & Ambience
  {
    id: "camp-starlit",
    title: "Starlit Camp Sanctuary",
    category: "camp",
    src: "/images/gallery/camp-starlit-panorama.jpg",
    alt: "Panoramic night view of Retivaa desert camp with red carpet entrance, central fountain, and glowing tents under starry sky",
    width: 1024,
    height: 682,
    caption: "A celestial desert oasis beneath millions of Thar stars, with illuminated red carpet pathways and a central fountain.",
  },
  {
    id: "camp-daytime",
    title: "Daylight Arena & Luxury Canvas Village",
    category: "camp",
    src: "/images/gallery/camp-daytime-amphitheater.jpg",
    alt: "Daytime view of the circular amphitheater with cushioned seating and a clean row of white luxury tents under blue sky",
    width: 1024,
    height: 682,
    caption: "Crisp white luxury swiss tents arrayed gracefully around the central courtyard under the brilliant desert sunshine.",
  },
  {
    id: "camp-fountain",
    title: "Central Fountain & Courtyard",
    category: "camp",
    src: "/images/gallery/camp-fountain-evening.jpg",
    alt: "Close-up of the illuminated circular water fountain pool with ceremonial flags and courtyard seating at dusk",
    width: 1024,
    height: 576,
    caption: "The resort's central water feature lit up as twilight falls, creating a serene desert oasis atmosphere.",
  }
];
