"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ArrowRight } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { GalleryCategory } from "../types";

interface GalleryCategoryCardProps {
  category: GalleryCategory;
  index: number;
  onClick: (id: string) => void;
  isCompact: boolean;
  isActive: boolean;
}

export function GalleryCategoryCard({ category, index, onClick, isCompact, isActive }: GalleryCategoryCardProps) {
  const cardRef = useRef<HTMLButtonElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const titleForegroundRef = useRef<HTMLSpanElement>(null);
  
  const shouldReduceMotion = useReducedMotion();
  const prefersReduced = shouldReduceMotion || (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  const num = String(index + 1).padStart(2, "0");

  // Hover interactions (only active when not compact)
  useEffect(() => {
    if (prefersReduced || isCompact) return;
    
    const card = cardRef.current;
    if (!card) return;

    let xTo: gsap.QuickToFunc;
    let yTo: gsap.QuickToFunc;
    let imgXTo: gsap.QuickToFunc;
    let imgYTo: gsap.QuickToFunc;

    const ctx = gsap.context(() => {
      xTo = gsap.quickTo(imageWrapperRef.current, "--x", { duration: 0.6, ease: "power3.out" });
      yTo = gsap.quickTo(imageWrapperRef.current, "--y", { duration: 0.6, ease: "power3.out" });
      imgXTo = gsap.quickTo(imageRef.current, "x", { duration: 0.8, ease: "power2.out" });
      imgYTo = gsap.quickTo(imageRef.current, "y", { duration: 0.8, ease: "power2.out" });

      gsap.set(titleForegroundRef.current, { clipPath: "inset(0% 100% 0% 0%)" });
    }, card);

    const handleMouseEnter = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const relX = ((e.clientX - rect.left) / rect.width) * 100;
      const relY = ((e.clientY - rect.top) / rect.height) * 100;
      
      gsap.set(imageWrapperRef.current, { "--x": `${relX}%`, "--y": `${relY}%` });
      
      gsap.to(imageWrapperRef.current, {
        "--mask-size": "150%",
        duration: 0.8,
        ease: "power2.out"
      });

      gsap.to(titleForegroundRef.current, {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 0.85,
        ease: "power2.out"
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const relX = ((e.clientX - rect.left) / rect.width) * 100;
      const relY = ((e.clientY - rect.top) / rect.height) * 100;
      
      xTo(`${relX}%` as any);
      yTo(`${relY}%` as any);

      const normX = (e.clientX - rect.left) / rect.width * 2 - 1;
      const normY = (e.clientY - rect.top) / rect.height * 2 - 1;
      
      imgXTo(normX * -10);
      imgYTo(normY * -10);
    };

    const handleMouseLeave = (e: MouseEvent) => {
      gsap.to(imageWrapperRef.current, {
        "--mask-size": "0%",
        duration: 0.6,
        ease: "power2.out"
      });

      gsap.to(titleForegroundRef.current, {
        clipPath: "inset(0% 100% 0% 0%)",
        duration: 0.7,
        ease: "power2.out"
      });

      gsap.to(imageRef.current, {
        x: 0,
        y: 0,
        duration: 0.8,
        ease: "power2.out"
      });
    };

    card.addEventListener("mouseenter", handleMouseEnter);
    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      ctx.revert();
      card.removeEventListener("mouseenter", handleMouseEnter);
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [prefersReduced, isCompact]);

  // When switching to compact, ensure hover state resets
  useEffect(() => {
    if (isCompact && !prefersReduced) {
      gsap.set(imageWrapperRef.current, { "--mask-size": "0%" });
      gsap.set(titleForegroundRef.current, { clipPath: "inset(0% 100% 0% 0%)" });
      gsap.set(imageRef.current, { x: 0, y: 0 });
    }
  }, [isCompact, prefersReduced]);

  return (
    <button
      ref={cardRef}
      onClick={() => onClick(category.id)}
      data-flip-id={`cat-${category.id}`}
      className={`gallery-flip-item group relative overflow-hidden flex flex-col text-left transition-colors duration-500 will-change-transform ${
        isCompact 
          ? `shrink-0 px-5 py-2.5 rounded-full items-center justify-center ${isActive ? "bg-[#30251F] border-[#30251F]" : "bg-[#ECE2D0]/50 hover:bg-[#30251F]/10 border-[rgba(48,37,31,0.08)]"}`
          : `bg-[#ECE2D0]/50 border-[rgba(48,37,31,0.08)] p-6 md:p-8 lg:p-10 justify-between rounded hover:bg-[#E3D6C1]/50 w-full h-full`
      } border`}
    >
      {/* Background Image Reveal Layer (Discovery Mode) */}
      {!isCompact && category.coverImage && (
        <div
          ref={imageWrapperRef}
          className="absolute inset-0 z-0 pointer-events-none hidden md:block"
          style={
            !prefersReduced
              ? {
                  "--x": "50%",
                  "--y": "50%",
                  "--mask-size": "0%",
                  WebkitMaskImage: "radial-gradient(circle var(--mask-size) at var(--x) var(--y), black 0%, transparent 100%)",
                  maskImage: "radial-gradient(circle var(--mask-size) at var(--x) var(--y), black 0%, transparent 100%)",
                  WebkitMaskRepeat: "no-repeat",
                  maskRepeat: "no-repeat",
                } as React.CSSProperties
              : { opacity: 0 }
          }
        >
          <div className="absolute inset-0 bg-[#30251F]/30 z-10 transition-opacity duration-300" />
          <Image
            ref={imageRef}
            src={category.coverImage.src}
            alt={category.coverImage.alt}
            fill
            quality={95}
            className="object-cover scale-[1.02]"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={index === 0}
          />
        </div>
      )}

      {/* Top area - Number and Arrow (Hidden when compact) */}
      <div 
        className={`flex justify-between items-start w-full z-10 relative transition-all duration-700 ${
          isCompact ? "opacity-0 h-0 overflow-hidden" : "opacity-100 mb-auto"
        }`}
      >
        <span className={`text-sm font-mono transition-colors duration-500 ${!prefersReduced && !isCompact ? "group-hover:text-white" : "text-[#B88A44]"}`}>
          {num}
        </span>
        <ArrowRight className={`w-5 h-5 transition-colors duration-500 ${!prefersReduced && !isCompact ? "text-[#30251F]/40 group-hover:text-white" : "text-[#30251F]/40 group-hover:text-[#30251F]"}`} />
      </div>

      {/* Bottom area - Title and Description */}
      <div className={`z-10 relative ${isCompact ? "flex items-center justify-center w-full h-full" : "mt-auto w-full"}`}>
        {/* Title */}
        <div className={`relative transition-all duration-700 font-serif ${isCompact ? "text-xs tracking-[0.1em] uppercase font-semibold m-0" : "text-3xl md:text-4xl mb-3 font-normal"}`}>
          {/* Base Title */}
          <span className={`block whitespace-nowrap transition-colors duration-500 ${
            isCompact 
              ? isActive ? "text-[#F6EFE3]" : "text-[#30251F]/80"
              : "text-[#30251F]"
          }`}>
            {isCompact ? (category.shortLabel || category.label) : category.label}
          </span>
          
          {/* Bright Foreground Title for Hover (Discovery Mode only) */}
          {!prefersReduced && !isCompact && (
            <span 
              ref={titleForegroundRef}
              className="absolute inset-0 text-white whitespace-nowrap"
              aria-hidden="true"
              style={{ clipPath: "inset(0% 100% 0% 0%)" }}
            >
              {category.label}
            </span>
          )}
        </div>
        
        {/* Description (Hidden when compact) */}
        <p 
          className={`text-sm max-w-[80%] transition-all duration-700 ${
            isCompact ? "opacity-0 h-0 overflow-hidden m-0" : "opacity-100 mt-2"
          } ${!prefersReduced && !isCompact ? "text-[#6B5D55] group-hover:text-white/80" : "text-[#6B5D55]"}`}
        >
          {category.description}
        </p>
      </div>
    </button>
  );
}
