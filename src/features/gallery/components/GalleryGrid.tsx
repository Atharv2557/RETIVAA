"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { GalleryCategory, GalleryCategoryId, GalleryImage } from "../types";
import { X, ZoomIn } from "lucide-react";

interface GalleryGridProps {
  categories: readonly GalleryCategory[];
  images: readonly GalleryImage[];
}

export function GalleryGrid({ categories, images }: GalleryGridProps) {
  const [activeCategory, setActiveCategory] = useState<GalleryCategoryId>("all");
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  const filteredImages =
    activeCategory === "all"
      ? images
      : images.filter((img) => img.category === activeCategory);

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* Filters */}
      <div className="border-b border-[rgba(48,37,31,0.12)] pb-4">
        <nav aria-label="Gallery category filters" className="flex flex-wrap gap-2 sm:gap-4">
          {categories.map((category) => {
            const isActive = category.id === activeCategory;
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 text-xs uppercase tracking-widest font-medium rounded-sm transition-all duration-300 ${
                  isActive
                    ? "bg-[#30251F] text-[#F6EFE3] shadow-md scale-[1.02]"
                    : "text-[#30251F]/70 hover:text-[#30251F] hover:bg-[#ECE2D0] bg-[#ECE2D0]/30"
                }`}
              >
                {category.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredImages.map((image) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              key={image.id}
              className="group relative aspect-[4/3] sm:aspect-square md:aspect-[4/3] lg:aspect-[3/2] overflow-hidden rounded-md bg-[#ECE2D0]/50 cursor-pointer"
              onClick={() => setSelectedImage(image)}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                quality={95}
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#30251F]/80 via-[#30251F]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-white font-serif text-xl mb-1">{image.title}</h3>
                  <p className="text-[#F6EFE3]/80 text-sm">{image.caption}</p>
                </div>
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                  <ZoomIn className="w-5 h-5 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      
      {/* Empty State when no images in filter */}
      {filteredImages.length === 0 && (
         <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           className="border border-dashed border-[#D7B98E] bg-[#ECE2D0]/30 rounded-sm p-10 md:p-16 text-center space-y-4"
         >
           <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#B88A44]">
             More Curated Imagery Soon
           </span>
           <h2 className="font-serif text-xl sm:text-2xl text-[#30251F]">
             Authentic Camp Imagery Coming Soon
           </h2>
           <p className="max-w-md mx-auto text-sm text-[#6B5D55] leading-relaxed">
             We are currently in the process of updating our photography for this category.
           </p>
         </motion.div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-[#30251F]/95 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-4 right-4 sm:top-8 sm:right-8 p-3 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition-colors z-50"
              onClick={() => setSelectedImage(null)}
              aria-label="Close lightbox"
            >
              <X className="w-6 h-6" />
            </button>
            <motion.div
              layoutId={selectedImage.id}
              className="relative w-full max-w-5xl aspect-video sm:aspect-auto sm:h-[80vh] bg-black rounded-lg overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt}
                fill
                className="object-contain"
                sizes="100vw"
                quality={100}
                priority
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 sm:p-8">
                <h3 className="text-white font-serif text-2xl sm:text-3xl mb-2">{selectedImage.title}</h3>
                <p className="text-[#F6EFE3]/90 text-sm sm:text-base max-w-3xl">{selectedImage.caption}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
