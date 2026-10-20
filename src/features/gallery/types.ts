/**
 * @file types.ts
 * @description Domain types for the RETIVAA Gallery feature, inspired by Super91 luxury card architecture.
 */

export type GalleryCategoryId = "all" | "tents" | "safaris" | "culture" | "dining" | "camp";

export interface GalleryCategory {
  readonly id: GalleryCategoryId;
  readonly label: string;
  readonly shortLabel?: string;
  readonly description?: string;
  readonly subtitle?: string;
  readonly color: string; // Dynamic morph theme color (e.g. #A65335, #B88A44, #9E6238)
  readonly badge: string;
  readonly iconName: "tent" | "safari" | "dining" | "culture" | "camp";
  readonly coverImage?: {
    src: string;
    alt: string;
  };
}

export interface GalleryImage {
  readonly id: string;
  readonly title: string;
  readonly category: Exclude<GalleryCategoryId, "all">;
  readonly src: string;
  readonly alt: string;
  readonly width: number;
  readonly height: number;
  readonly blurDataUrl?: string;
  readonly caption?: string;
}

export interface GalleryFilterState {
  readonly activeCategory: GalleryCategoryId;
}

export interface LightboxState {
  readonly isOpen: boolean;
  readonly activeImageIndex: number | null;
}
