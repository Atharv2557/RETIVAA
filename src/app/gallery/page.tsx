import type { Metadata } from "next";
import { GALLERY_CATEGORIES, GALLERY_IMAGES } from "@/content/gallery";
import { siteConfig } from "@/config/site.config";
import { GalleryExperience } from "@/features/gallery/components/GalleryExperience";

export const metadata: Metadata = {
  title: "Gallery",
  description: `Visual journey through the luxury tents, desert landscapes, and starlit evenings at ${siteConfig.brand.name} in Jaisalmer.`,
};

export default function GalleryPage() {
  return (
    <div className="relative min-h-screen bg-[#F6EFE3] overflow-hidden pt-16 sm:pt-24">
      <GalleryExperience categories={GALLERY_CATEGORIES} images={GALLERY_IMAGES} />
    </div>
  );
}
