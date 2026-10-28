"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { 
  Tent, 
  Compass, 
  UtensilsCrossed, 
  Sparkles, 
  Flame, 
  ArrowLeft,
  X,
  Maximize2
} from "lucide-react";
import { useLenis } from "lenis/react";
import { GalleryCategory, GalleryImage } from "../types";
import { Super91Card } from "./Super91Card";

interface GalleryExperienceProps {
  categories: readonly GalleryCategory[];
  images: readonly GalleryImage[];
}

export function GalleryExperience({ categories, images }: GalleryExperienceProps) {
  // viewMode: "hero-grid" (cards in center grid) | "opened-section" (docked at top, category section opened)
  // viewMode: "hero-grid" (cards in center grid) | "opened-section" (docked at top, category section opened)
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isMorphing, setIsMorphing] = useState(false);
  const [pendingCategory, setPendingCategory] = useState<string | null>(null);
  const [hoverColor, setHoverColor] = useState<string | null>(null);
  const [isGridVisible, setIsGridVisible] = useState(false);
  const [isDropActive, setIsDropActive] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<GalleryImage | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const stickyNavRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const contentAreaRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  // Entrance drop animation trigger on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsGridVisible(true);
      setIsDropActive(true);
    }, 60);
    return () => clearTimeout(timer);
  }, []);

  const getCategoryIcon = (iconName: GalleryCategory["iconName"], size = 16) => {
    switch (iconName) {
      case "tent":
        return <Tent size={size} />;
      case "safari":
        return <Compass size={size} />;
      case "dining":
        return <UtensilsCrossed size={size} />;
      case "culture":
        return <Sparkles size={size} />;
      case "camp":
      default:
        return <Flame size={size} />;
    }
  };

  // The Seamless Super91 Tap-to-Top Animation for All Cards (Fixed Container-Relative Geometry)
  const handleSelectCategory = (categoryId: string) => {
    const selectedCat = categories.find((c) => c.id === categoryId);
    if (!selectedCat) return;

    // Prevent multiple concurrent morph triggers
    if (isMorphing) return;

    // If already in opened-section view, smoothly switch without re-flying
    if (activeCategory) {
      setActiveCategory(categoryId);
      if (contentAreaRef.current) {
        contentAreaRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      return;
    }

    const grid = gridRef.current;
    const container = containerRef.current;
    if (!grid || !container) {
      setActiveCategory(categoryId);
      return;
    }

    const cardElements = grid.querySelectorAll(".super91-card");
    if (!cardElements.length) {
      setActiveCategory(categoryId);
      return;
    }

    // Step 1: Measure cards relative to container so scroll position cannot corrupt coordinates
    const containerRect = container.getBoundingClientRect();
    const cardMeasurements = Array.from(cardElements).map((el) => {
      const htmlEl = el as HTMLElement;
      const rect = htmlEl.getBoundingClientRect();
      return {
        id: htmlEl.getAttribute("data-target") || "",
        top: rect.top - containerRect.top,
        left: rect.left - containerRect.left,
        width: rect.width,
        height: rect.height,
        bg: window.getComputedStyle(htmlEl).backgroundColor,
      };
    });

    // Step 2: Mount the destination top bar in stable flow mode, and hide original cards without collapsing grid height
    setIsMorphing(true);
    setPendingCategory(categoryId);

    // Step 3: Animate clones from each card position directly to each target pill
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const topNav = stickyNavRef.current;
        const currentContainer = containerRef.current;
        if (!topNav || !currentContainer) {
          setActiveCategory(categoryId);
          setIsMorphing(false);
          setPendingCategory(null);
          return;
        }

        const currentContainerRect = currentContainer.getBoundingClientRect();
        const clones: HTMLElement[] = [];

        cardMeasurements.forEach(({ id, top, left, width, height, bg }) => {
          const catData = categories.find((c) => c.id === id);
          if (!catData) return;

          const pill = topNav.querySelector(`[data-pill-id="${id}"]`) as HTMLElement | null;
          const pillRect = pill?.getBoundingClientRect();

          const targetTop = pillRect ? (pillRect.top - currentContainerRect.top) : top;
          const targetLeft = pillRect ? (pillRect.left - currentContainerRect.left) : left;
          const targetWidth = pillRect ? pillRect.width : 120;
          const targetHeight = pillRect ? pillRect.height : 38;

          const clone = document.createElement("div");
          clone.className = "super91-morph-clone";
          clone.style.backgroundColor = bg;
          clone.style.top = `${top}px`;
          clone.style.left = `${left}px`;
          clone.style.width = `${width}px`;
          clone.style.height = `${height}px`;
          clone.style.borderRadius = "24px";

          // Add category label inside clone that fades in as it shapes into the pill
          const labelSpan = document.createElement("span");
          labelSpan.className = "super91-morph-clone-label";
          labelSpan.textContent = catData.shortLabel || catData.label;
          clone.appendChild(labelSpan);

          currentContainer.appendChild(clone);
          clones.push(clone);

          if (pill) {
            pill.style.visibility = "hidden";
          }

          // Trigger smooth flight to target pill position
          requestAnimationFrame(() => {
            clone.style.top = `${targetTop}px`;
            clone.style.left = `${targetLeft}px`;
            clone.style.width = `${targetWidth}px`;
            clone.style.height = `${targetHeight}px`;
            clone.style.borderRadius = "9999px";
            labelSpan.style.opacity = "1";
          });
        });

        // Step 4: When flight completes (720ms), reveal real pills and finalize category view
        setTimeout(() => {
          // Reveal real interactive pills in the top rail
          topNav.querySelectorAll<HTMLElement>(".super91-nav-pill").forEach((pill) => {
            pill.style.visibility = "visible";
          });

          // Fade out clones
          clones.forEach((clone) => {
            clone.classList.add("fading-out");
          });

          // Switch active state
          setActiveCategory(categoryId);
          setIsMorphing(false);
          setPendingCategory(null);

          setTimeout(() => {
            clones.forEach((c) => c.remove());
          }, 220);
        }, 720);
      });
    });
  };

  const handleReturnToHero = () => {
    setActiveCategory(null);
    setIsMorphing(false);
    setPendingCategory(null);
    if (lenis && containerRef.current) {
      lenis.scrollTo(containerRef.current, { offset: -90, duration: 0.8 });
    }
  };

  const displayCategory = activeCategory || pendingCategory;
  const activeCategoryData = categories.find((c) => c.id === displayCategory);
  const activeCategoryImages = activeCategory
    ? images.filter((img) => img.category === activeCategory)
    : [];

  const effectiveBgColor = hoverColor || activeCategoryData?.color || "#f6efe3";

  return (
    <div 
      ref={containerRef}
      className="super91-morph-container py-8 md:py-16 transition-colors duration-700"
      style={{
        ["--service-section-color" as string]: effectiveBgColor,
      }}
    >
      {/* 1. Watermark Background Title (Super91 Style) */}
      <div className="super91-hero-wrapper">
        <h1 className="super91-hero-watermark">
          OUR GALLERY
        </h1>

        {/* Header Content */}
        <div className="relative z-10 max-w-4xl mx-auto mb-12 text-center px-4">
          <span className="text-xs font-semibold tracking-[0.3em] uppercase text-[#B88A44] inline-block mb-3">
            RETIVAA DESERT CAMP · JAISALMER
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#30251F] font-bold tracking-tight">
            {activeCategory ? activeCategoryData?.label : "Explore Our Sanctuary"}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#6B5D55] max-w-2xl mx-auto font-light leading-relaxed">
            {activeCategory 
              ? activeCategoryData?.description 
              : "Discover luxury tent stays, dune expeditions, royal desert dining, and starlit cultural heritage."}
          </p>
        </div>

        {/* 2. DOCKED TOP STICKY BAR (When a card is tapped, cards dock at the top!) */}
        {(activeCategory || isMorphing) && (
          <div 
            ref={stickyNavRef}
            className={`super91-sticky-sub-nav max-w-5xl mx-auto ${
              isMorphing ? "morphing-target" : "animate-in fade-in duration-400"
            }`}
          >
            {/* Back Button */}
            <button
              onClick={handleReturnToHero}
              className="flex items-center gap-2 px-3 py-2 rounded-full text-xs font-semibold tracking-wider uppercase text-[#30251F] hover:bg-[#30251F]/10 transition-colors shrink-0"
              title="Return to all cards"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">All Categories</span>
            </button>

            {/* Scrollable Category Nav Pills */}
            <div className="super91-sticky-links-track">
              {categories.map((cat) => {
                const currentActive = activeCategory || pendingCategory;
                const isPillActive = currentActive === cat.id;
                return (
                  <button
                    key={cat.id}
                    data-pill-id={cat.id}
                    onClick={() => handleSelectCategory(cat.id)}
                    className={`super91-nav-pill ${isPillActive ? "active" : ""}`}
                    style={{
                      backgroundColor: isPillActive ? "#ffffff" : cat.color,
                      color: isPillActive ? cat.color : "#ffffff",
                      ["--pill-color" as string]: cat.color,
                    }}
                  >
                    {getCategoryIcon(cat.iconName, 14)}
                    <span>{cat.shortLabel || cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. HERO CARDS GRID (When NOT in opened-section view, preserved during morph flight) */}
        {(!activeCategory || isMorphing) && (
          <div
            ref={gridRef}
            className={`super91-cards-grid ${isGridVisible ? "visible" : ""} ${
              isDropActive ? "drop-entrance" : ""
            } ${isMorphing ? "is-morphing-out" : ""}`}
            onMouseLeave={() => setHoverColor(null)}
          >
            {categories.map((cat, idx) => (
              <Super91Card
                key={cat.id}
                category={cat}
                index={idx}
                totalCards={categories.length}
                isActive={activeCategory === cat.id}
                onSelect={handleSelectCategory}
                onHoverStart={(col) => setHoverColor(col)}
                onHoverEnd={() => setHoverColor(null)}
              />
            ))}
          </div>
        )}

        {/* 4. OPENED CATEGORY CONTENT SECTION (Opens below docked top bar) */}
        {activeCategory && activeCategoryData && (
          <div 
            ref={contentAreaRef}
            className="relative z-10 max-w-6xl mx-auto px-4 mt-8 animate-in fade-in duration-500"
          >
            {/* Category Overview Card */}
            <div 
              className="rounded-3xl p-6 sm:p-10 mb-12 text-white relative overflow-hidden shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-end gap-6"
              style={{ backgroundColor: activeCategoryData.color }}
            >
              {/* Decorative Subtle Watermark Icon */}
              <div className="absolute right-[-20px] bottom-[-20px] opacity-15 pointer-events-none">
                {getCategoryIcon(activeCategoryData.iconName, 240)}
              </div>

              <div className="relative z-10 max-w-2xl">
                <span className="text-xs font-bold tracking-[0.25em] uppercase text-white/80 bg-black/20 px-3 py-1 rounded-full border border-white/20 inline-block mb-3">
                  {activeCategoryData.badge}
                </span>
                <h3 className="font-serif text-3xl sm:text-5xl font-bold mb-3 tracking-wide">
                  {activeCategoryData.label}
                </h3>
                <p className="text-white/90 text-sm sm:text-base leading-relaxed">
                  {activeCategoryData.description}
                </p>
              </div>

              <div className="relative z-10 flex items-center gap-3">
                <button
                  onClick={handleReturnToHero}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-[#30251F] font-semibold text-xs tracking-wider uppercase shadow-lg hover:bg-[#F6EFE3] transition-all transform hover:scale-105"
                  title="Switch or view all categories"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Switch Category</span>
                </button>
              </div>
            </div>

            {/* Masonry / Photo Gallery for Opened Category */}
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
              {activeCategoryImages.map((img) => (
                <div
                  key={img.id}
                  onClick={() => setLightboxImage(img)}
                  className="break-inside-avoid group relative rounded-2xl overflow-hidden bg-[#ECE2D0]/40 border border-[#30251F]/10 cursor-pointer shadow-md hover:shadow-xl transition-all duration-500"
                >
                  <div className="relative w-full overflow-hidden" style={{ aspectRatio: img.width / img.height }}>
                    <Image
                      src={img.src}
                      alt={img.alt}
                      width={img.width}
                      height={img.height}
                      quality={95}
                      className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    
                    {/* Hover Overlay with Caption & Zoom */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#30251F]/80 via-[#30251F]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                      <div className="transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
                        <span className="text-[10px] tracking-widest uppercase font-semibold text-[#B88A44] block mb-1">
                          RETIVAA DESERT CAMP EXCLUSIVE
                        </span>
                        <h4 className="text-white font-serif text-lg leading-tight mb-1">
                          {img.title}
                        </h4>
                        {img.caption && (
                          <p className="text-white/80 text-xs line-clamp-2">
                            {img.caption}
                          </p>
                        )}
                      </div>

                      <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full text-white">
                        <Maximize2 className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* If category has few images, show respectful curation note */}
            {activeCategoryImages.length === 0 && (
              <div className="text-center py-20 bg-white/40 rounded-2xl border border-dashed border-[#B88A44]/40 p-8">
                <p className="text-[#6B5D55] text-sm">
                  Curation in progress. New on-location desert photographs arriving soon.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 5. Accessible Fullscreen Lightbox Modal */}
      {lightboxImage && (
        <div 
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[10000] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-300"
          onClick={() => setLightboxImage(null)}
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>

          <div 
            className="relative max-w-4xl max-h-[85vh] w-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full max-h-[70vh] aspect-[16/10] overflow-hidden rounded-xl shadow-2xl">
              <Image
                src={lightboxImage.src}
                alt={lightboxImage.alt}
                fill
                quality={98}
                className="object-contain"
                sizes="(max-width: 1200px) 100vw, 1200px"
              />
            </div>

            <div className="text-center mt-4 text-white max-w-xl">
              <h3 className="font-serif text-2xl mb-1">{lightboxImage.title}</h3>
              {lightboxImage.caption && (
                <p className="text-sm text-white/80">{lightboxImage.caption}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
