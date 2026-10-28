"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Archivo_Black } from "next/font/google";

import { CircularText } from "@/components/ui/CircularText";

const archivoBlack = Archivo_Black({ weight: "400", subsets: ["latin"], display: "swap" });

gsap.registerPlugin(ScrollTrigger);

export interface CinematicMapProps {
  ringText?: string;
  repeat?: number;
}

export function CinematicMap({
  ringText = "RETIVAA DESERT CAMP • JAISALMER • ",
  repeat,
}: CinematicMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapWrapperRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ ringSize: 1040, fontSize: 46 });

  const finalRepeat = repeat ?? (ringText.trim().length <= 36 ? 3 : 1);

  useEffect(() => {
    const updateDimensions = () => {
      const w = window.innerWidth;
      if (w < 640) {
        // Mobile screens: size allows the bold ring to arch comfortably above and below the map
        const size = Math.min(Math.max(w * 1.25, 460), 560);
        setDimensions({ ringSize: Math.round(size), fontSize: 22 });
      } else if (w < 1024) {
        // Tablet screens
        const size = Math.min(Math.max(w * 1.05, 740), 880);
        setDimensions({ ringSize: Math.round(size), fontSize: 34 });
      } else {
        // Desktop screens: majestic full-size orbit peaking boldly above and below the wide cinematic map
        setDimensions({ ringSize: 1040, fontSize: 46 });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    if (containerRef.current && mapWrapperRef.current) {
      // Map entrance fade-in
      gsap.fromTo(
        mapWrapperRef.current,
        { opacity: 0, scale: 0.96 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.4,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 65%",
          },
        }
      );
    }

    return () => {
      window.removeEventListener("resize", updateDimensions);
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-[640px] sm:min-h-[860px] lg:min-h-[1150px] flex flex-col items-center justify-center bg-[#191918] py-14 sm:py-24 lg:py-36 overflow-x-clip border-t border-[#D7B98E]/20 select-none"
    >
      {/* 1. BACKGROUND: Interactive 3D Circular Rotating Text (Covered in the center by the foreground map) */}
      <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none overflow-visible">
        <div className="pointer-events-auto transition-all duration-300">
          <CircularText
            key={`${ringText}-${finalRepeat}`}
            text={ringText}
            repeat={finalRepeat}
            spinDuration={24}
            onHover="speedUp"
            direction="clockwise"
            size={dimensions.ringSize}
            fontSize={dimensions.fontSize}
            fontWeight={900}
            color="#F5D09D"
            draggable={true}
            hoverTilt={16}
            ring={true}
            ringColor="rgba(240, 198, 142, 0.3)"
            className={`${archivoBlack.className} uppercase tracking-wider drop-shadow-[0_0_35px_rgba(245,208,157,0.6)] font-black`}
          />
        </div>
      </div>

      {/* 2. FOREGROUND: Full-Width Cinematic Google Maps Card Covering the Center of the Ring */}
      <div
        ref={mapWrapperRef}
        className="relative z-10 w-full max-w-[94%] md:max-w-[85%] lg:max-w-[80%] aspect-[4/3] md:aspect-[21/9] rounded-sm overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.85)] border border-[#D7B98E]/30 bg-[#1A1512] transition-all duration-300"
      >
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1494.4207171401663!2d70.56456740041713!3d26.86708072126241!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2sin!4v1791519052211!5m2!1sen!2sin"
          width="100%"
          height="100%"
          style={{ border: 0, filter: "contrast(1.1) saturate(1.2)" }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 w-full h-full"
        />

        {/* 3. TOP OVERLAY: Floating Camp Details Card */}
        <div className="absolute bottom-3 left-3 sm:bottom-6 sm:left-6 z-30 p-3 sm:p-6 bg-[#FDFBF7]/95 backdrop-blur-md rounded-xs border border-[#B38B57]/40 shadow-2xl max-w-[200px] xs:max-w-[240px] sm:max-w-[280px]">
          <h4 className="font-serif text-sm sm:text-xl text-[#201B18] tracking-wide mb-0.5 sm:mb-1 uppercase font-semibold">
            RETIVAA DESERT CAMP
          </h4>
          <p className="font-sans text-[8px] sm:text-[11px] tracking-[0.2em] text-[#8C2C30] uppercase mb-2">
            Sam Sand Dunes · Jaisalmer
          </p>
          <p className="font-serif italic text-[11px] sm:text-xs text-[#392A22]/80 mb-3 sm:mb-4">
            &quot;Your desert escape awaits.&quot;
          </p>
          <div className="h-[1px] w-8 sm:w-12 bg-[#B38B57]/30 mb-2 sm:mb-3" />
          <p className="text-[8px] sm:text-[9px] font-mono tracking-widest text-[#392A22]/60 uppercase leading-relaxed">
            Exact coordinates provided upon confirmation.
          </p>
        </div>
      </div>
    </div>
  );
}
