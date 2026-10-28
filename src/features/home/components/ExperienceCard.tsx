"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getWhatsAppEnquiryUrl, isConfigured, siteConfig } from "@/config/site.config";
import type { DesertExperience, ExperienceItem } from "@/content/experiences";

export type ExperienceCardItem = DesertExperience | (ExperienceItem & { readonly number?: string });

interface ExperienceCardProps {
  readonly item: ExperienceCardItem;
  readonly isMobile?: boolean; // If true, renders the minimal mobile layout
  readonly index?: number;
  readonly isActive?: boolean;
  readonly isReducedMotion?: boolean;
}

export function ExperienceCard({ item, isMobile = false }: ExperienceCardProps) {
  const itemNumber =
    "number" in item && item.number
      ? item.number
      : "index" in item && typeof item.index === "string"
      ? item.index
      : "01";
  
  const itemHref = "href" in item ? item.href : undefined;
  const objectPosition =
    "objectPosition" in item.image && item.image.objectPosition
      ? item.image.objectPosition
      : "center";

  const isWhatsAppReady = isConfigured(siteConfig.contact.whatsapp);
  const whatsappUrl = getWhatsAppEnquiryUrl(
    `Khamma Ghani RETIVAA Desert Camp, I would like to enquire about ${item.title} in Jaisalmer.`
  );
  const targetHref = itemHref || (isWhatsAppReady && whatsappUrl ? whatsappUrl : "/contact");
  const isExternal = targetHref.startsWith("http");

  return (
    <Link
      href={targetHref}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="group relative block w-full h-full rounded-sm overflow-hidden select-none cursor-pointer focus-visible:outline-2 focus-visible:outline-[#B88A44] focus-visible:outline-offset-2 border border-[#D7B98E]/20 bg-[#120F0D]"
    >
      {/* Premium Cinematic Image */}
      <div className="absolute inset-0 w-full h-full transition-transform duration-700 ease-out group-hover:scale-105 will-change-transform">
        <Image
          src={item.image.src}
          alt={item.image.alt}
          fill
          quality={95}
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={itemNumber === "01"}
          className="object-cover"
          style={{ objectPosition }}
        />
      </div>

      {/* Luxury Dark Warm Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#120F0D]/90 via-[#120F0D]/30 to-[#120F0D]/10 pointer-events-none" />
      <div className="absolute inset-0 bg-[#4A3022] mix-blend-color opacity-20 pointer-events-none" />

      {/* Content Layouts */}
      {isMobile ? (
        // MOBILE: Minimalist layout (number + title only)
        <div className="absolute inset-0 p-5 flex flex-col justify-end pointer-events-none">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-[10px] tracking-[0.2em] text-[#B88A44]">
              {itemNumber}
            </span>
            <h3 className="font-serif text-xl sm:text-2xl text-[#F6EFE3] uppercase tracking-wide drop-shadow-sm">
              {item.title}
            </h3>
          </div>
        </div>
      ) : (
        // DESKTOP: Full luxury editorial layout
        <div className="absolute inset-0 p-8 lg:p-12 flex flex-col justify-between pointer-events-none">
          {/* Top Row: Number & Arrow */}
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs tracking-[0.3em] font-medium text-[#B88A44]">
              {itemNumber}
            </span>
            <div className="w-8 h-8 rounded-full border border-[#D7B98E]/30 flex items-center justify-center bg-[#120F0D]/40 backdrop-blur-sm group-hover:bg-[#B88A44] group-hover:border-[#B88A44] transition-colors duration-300">
              <ArrowUpRight size={16} className="text-[#D7B98E] group-hover:text-[#120F0D] transition-colors" />
            </div>
          </div>

          {/* Bottom Row: Title & Description */}
          <div className="space-y-4 max-w-md">
            <h3 className="font-serif text-4xl lg:text-5xl font-normal leading-tight text-[#F6EFE3] uppercase drop-shadow-md">
              {item.title}
            </h3>
            <p className="text-sm lg:text-base text-[#D7B98E]/90 font-light leading-relaxed">
              {item.description}
            </p>
          </div>
        </div>
      )}
    </Link>
  );
}
