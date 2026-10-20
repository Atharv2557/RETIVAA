"use client";

import { useRef, MouseEvent } from "react";
import { 
  Tent, 
  Compass, 
  UtensilsCrossed, 
  Sparkles, 
  Flame, 
  ArrowUpRight 
} from "lucide-react";
import { GalleryCategory } from "../types";

interface Super91CardProps {
  category: GalleryCategory;
  index: number;
  totalCards: number;
  isActive: boolean;
  onSelect: (categoryId: string) => void;
  onHoverStart?: (color: string) => void;
  onHoverEnd?: () => void;
}

export function Super91Card({
  category,
  index,
  totalCards,
  isActive,
  onSelect,
  onHoverStart,
  onHoverEnd,
}: Super91CardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Compute staggered drop entrance delay matching Super91's center-outward formula
  const centerIndex = (totalCards - 1) / 2;
  const dropDelayMs = Math.round(Math.abs(index - centerIndex) * 90);

  // Icon selector based on category iconName
  const renderIcon = (isLargeWatermark = false) => {
    const size = isLargeWatermark ? 160 : 20;
    const strokeWidth = isLargeWatermark ? 1.1 : 1.75;
    const className = isLargeWatermark
      ? "super91-card-watermark-icon"
      : "w-5 h-5 text-white";

    switch (category.iconName) {
      case "tent":
        return <Tent className={className} size={size} strokeWidth={strokeWidth} />;
      case "safari":
        return <Compass className={className} size={size} strokeWidth={strokeWidth} />;
      case "dining":
        return <UtensilsCrossed className={className} size={size} strokeWidth={strokeWidth} />;
      case "culture":
        return <Sparkles className={className} size={size} strokeWidth={strokeWidth} />;
      case "camp":
      default:
        return <Flame className={className} size={size} strokeWidth={strokeWidth} />;
    }
  };

  // Exact Super91 dynamic mouse tracking handler
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    el.style.setProperty("--reveal-x", `${x.toFixed(1)}%`);
    el.style.setProperty("--reveal-y", `${y.toFixed(1)}%`);
  };

  const coverSrc = category.coverImage?.src;
  const coverBgUrl = coverSrc ? `url("${coverSrc}")` : "none";

  return (
    <div
      ref={cardRef}
      role="button"
      tabIndex={0}
      data-target={category.id}
      aria-label={`Open category ${category.label}`}
      onClick={() => onSelect(category.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(category.id);
        }
      }}
      onMouseEnter={() => onHoverStart?.(category.color)}
      onMouseLeave={() => {
        onHoverEnd?.();
        // Reset reveal coordinates on exit
        const el = cardRef.current;
        if (el) {
          el.style.setProperty("--reveal-x", "50%");
          el.style.setProperty("--reveal-y", "50%");
        }
      }}
      onMouseMove={handleMouseMove}
      className={`super91-card ${isActive ? "active-docked" : ""}`}
      style={{
        backgroundColor: category.color,
        ["--service-card-image" as string]: coverBgUrl,
        ["--drop-delay" as string]: `${dropDelayMs}ms`,
        ["--reveal-x" as string]: "50%",
        ["--reveal-y" as string]: "50%",
        ["--card-accent" as string]: category.color,
      }}
    >
      {/* 1. Super91 Circular Clip-path Image Expansion Layer */}
      <span
        className="super91-card-hover-image"
        aria-hidden="true"
        style={{ backgroundImage: coverBgUrl }}
      />

      {/* 2. Giant Watermark Background Vector Icon */}
      <div className="super91-card-watermark-wrapper" aria-hidden="true">
        {renderIcon(true)}
      </div>

      {/* 3. Card Foreground Content */}
      <div className="super91-card-inner">
        {/* Top Header: Frosted Badge & Expand Arrow */}
        <div className="flex items-center justify-between w-full mb-8">
          <div className="super91-card-icon-badge">
            {renderIcon(false)}
          </div>
          <div className="super91-card-arrow-pill">
            <span className="text-[10px] tracking-widest font-semibold uppercase opacity-90 mr-1.5 hidden sm:inline">
              TAP TO EXPLORE
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>

        {/* Category Index & Badge */}
        <div className="mb-2">
          <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/80 bg-black/25 backdrop-blur-md px-3 py-1 rounded-full border border-white/15">
            {category.badge}
          </span>
        </div>

        {/* Title */}
        <h3 className="super91-card-title text-white">
          {category.label}
        </h3>

        {/* Subtitle */}
        {category.subtitle && (
          <p className="super91-card-subtitle text-white/90">
            {category.subtitle}
          </p>
        )}

        {/* Concise Description */}
        {category.description && (
          <p className="super91-card-desc text-white/80 mt-2 line-clamp-2">
            {category.description}
          </p>
        )}
      </div>
    </div>
  );
}
