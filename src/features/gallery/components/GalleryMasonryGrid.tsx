"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { useReducedMotion } from "framer-motion";
import { GalleryImage } from "../types";

interface GalleryMasonryGridProps {
  images: readonly GalleryImage[];
}

export function GalleryMasonryGrid({ images }: GalleryMasonryGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const prefersReduced = shouldReduceMotion || (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  useEffect(() => {
    if (prefersReduced || !containerRef.current) return;
    
    const items = gsap.utils.toArray<HTMLElement>(".masonry-image-item", containerRef.current);
    if (!items.length) return;

    // Reset initial state for animation
    gsap.set(items, { 
      opacity: 0, 
      scale: 1.025,
      clipPath: "inset(10% 0% 10% 0%)"
    });

    // Staggered reveal
    const ctx = gsap.context(() => {
      gsap.to(items, {
        opacity: 1,
        scale: 1,
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
        clearProps: "all" // clean up after
      });
    }, containerRef);

    return () => ctx.revert();
  }, [images, prefersReduced]); // Re-run animation when images change

  if (!images.length) {
    return (
      <div className="py-20 text-center border border-dashed border-[#D7B98E] bg-[#ECE2D0]/30 rounded-sm">
        <p className="text-sm text-[#6B5D55]">No imagery currently available for this category.</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
      {images.map((img) => {
        // We'll vary the aspect ratio based on original dimensions if we had them.
        // For now, we simulate masonry by using different aspect ratios based on index
        // Or since we use CSS columns, we just let the images maintain their natural aspect ratio!
        // We can enforce some variety by setting random tailwind classes if we wanted, 
        // but since we have fixed width/height in our generated images, they are mostly squares.
        // Let's just use CSS columns and let them flow naturally.
        
        return (
          <div 
            key={img.id} 
            className="masonry-image-item break-inside-avoid group relative rounded overflow-hidden bg-[#ECE2D0]/50"
          >
            <div className="relative w-full overflow-hidden" style={{ aspectRatio: img.width / img.height }}>
              <Image
                src={img.src}
                alt={img.alt}
                width={img.width}
                height={img.height}
                quality={95}
                className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#30251F]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex items-end p-4">
                <span className="text-[#F6EFE3] text-sm tracking-wide transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  {img.title}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
