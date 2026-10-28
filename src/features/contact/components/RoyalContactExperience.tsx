"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "framer-motion";
import Image from "next/image";
import { Great_Vibes } from "next/font/google";
import { Container } from "@/components/layout/Container";
import { siteConfig, isConfigured } from "@/config/site.config";
import { MessageCircle, Phone } from "lucide-react";
import { CinematicMap } from "./CinematicMap";

const cursive = Great_Vibes({ weight: "400", subsets: ["latin"], display: "swap" });

function GoldFleuron({ className = "w-20 sm:w-28 md:w-36 h-2.5 text-[#B88A44]" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 160 16" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      aria-hidden="true"
    >
      <path 
        d="M10 8H64M96 8H150" 
        stroke="currentColor" 
        strokeWidth="0.85" 
        strokeOpacity="0.75" 
      />
      <circle cx="28" cy="8" r="1.5" fill="currentColor" fillOpacity="0.8" />
      <circle cx="58" cy="8" r="1.5" fill="currentColor" fillOpacity="0.8" />
      <circle cx="102" cy="8" r="1.5" fill="currentColor" fillOpacity="0.8" />
      <circle cx="132" cy="8" r="1.5" fill="currentColor" fillOpacity="0.8" />
      <path 
        d="M80 1.5L82.6 6.2L87 8L82.6 9.8L80 14.5L77.4 9.8L73 8L77.4 6.2L80 1.5Z" 
        fill="currentColor" 
      />
      <circle cx="80" cy="8" r="1.2" fill="#FAF6EE" />
    </svg>
  );
}

type FormState = "writing" | "sending" | "sealing" | "thanks" | "error";

const LetterDesign = () => (
  <div className="w-full h-full bg-[#F4EBE1] text-[#392A22] p-5 sm:p-10 lg:p-16 relative shadow-sm"
       style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22 opacity=%220.06%22/%3E%3C/svg%3E")' }}>
    <div className="absolute inset-4 sm:inset-5 border border-[#B38B57]/30 pointer-events-none" />
    <div className="absolute inset-5 sm:inset-[26px] border border-[#66745E]/15 pointer-events-none" />
    <div className="text-center mb-6 sm:mb-12">
      <span className={`${cursive.className} text-2xl sm:text-3xl text-[#A65F49] drop-shadow-sm`}>Your words, our pleasure</span>
      <h2 className="font-serif text-xl sm:text-3xl lg:text-4xl uppercase tracking-[0.14em] sm:tracking-[0.2em] mt-2 sm:mt-3 text-[#201B18]">Write to RETIVAA DESERT CAMP</h2>
    </div>
    <div className="space-y-4 opacity-40 blur-[1px]">
      <div className="h-4 bg-[#392A22]/20 w-3/4 rounded-full mx-auto" />
      <div className="h-4 bg-[#392A22]/20 w-1/2 rounded-full mx-auto" />
      <div className="h-4 bg-[#392A22]/20 w-5/6 rounded-full mx-auto mt-10" />
      <div className="h-4 bg-[#392A22]/20 w-2/3 rounded-full mx-auto" />
      <div className="h-4 bg-[#392A22]/20 w-4/5 rounded-full mx-auto" />
    </div>
  </div>
);

export function RoyalContactExperience() {
  const [formState, setFormState] = useState<FormState>("writing");
  
  const formWrapperRef = useRef<HTMLDivElement>(null);
  const letterRef = useRef<HTMLDivElement>(null);
  const visualLetterRef = useRef<HTMLDivElement>(null);
  const liveFormRef = useRef<HTMLDivElement>(null);
  
  const panelTopRef = useRef<HTMLDivElement>(null);
  const panelMiddleRef = useRef<HTMLDivElement>(null);
  const panelBottomRef = useRef<HTMLDivElement>(null);

  const envelopeBackRef = useRef<HTMLDivElement>(null);
  const envelopePocketRef = useRef<HTMLDivElement>(null);
  const envelopeFlapRef = useRef<HTMLDivElement>(null);
  const waxSealRef = useRef<HTMLDivElement>(null);
  const thankYouRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  // Full-bleed Hero GSAP Refs
  const heroRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const cursiveRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLDivElement>(null);
  const actionRef = useRef<HTMLDivElement>(null);

  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const prefersReduced = shouldReduceMotion || 
      (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

    if (prefersReduced) {
      if (heroRef.current) gsap.set(heroRef.current, { opacity: 1 });
      if (bgRef.current) gsap.set(bgRef.current, { opacity: 1, scale: 1 });
      if (eyebrowRef.current) gsap.set(eyebrowRef.current, { opacity: 1, y: 0 });
      if (cursiveRef.current) gsap.set(cursiveRef.current, { opacity: 1, y: 0 });
      if (headingRef.current) gsap.set(headingRef.current, { opacity: 1, y: 0 });
      if (descRef.current) gsap.set(descRef.current, { opacity: 1, y: 0 });
      if (actionRef.current) gsap.set(actionRef.current, { opacity: 1, y: 0 });
    } else {
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      // 1. Gentle background reveal on page load
      if (bgRef.current) {
        tl.fromTo(bgRef.current,
          { opacity: 0, scale: 1.04 },
          { opacity: 1, scale: 1, duration: 1.5, ease: "power2.out" }
        );
      }

      // 2. Eyebrow fade-in
      if (eyebrowRef.current) {
        tl.fromTo(eyebrowRef.current,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.9 },
          "-=1.0"
        );
      }

      // 3. Cursive subtitle reveal
      if (cursiveRef.current) {
        tl.fromTo(cursiveRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 1.0 },
          "-=0.7"
        );
      }

      // 4. Heading fade-up with staggered lines
      if (headingRef.current) {
        tl.fromTo(headingRef.current.children,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 1.1, stagger: 0.18, ease: "power3.out" },
          "-=0.7"
        );
      }

      // 5. Description subtle fade-in
      if (descRef.current) {
        tl.fromTo(descRef.current,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 1.0 },
          "-=0.6"
        );
      }

      // 6. Action button / coordinates fade-in
      if (actionRef.current) {
        tl.fromTo(actionRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.5"
        );
      }
    }

    if (mapRef.current) {
      gsap.fromTo(mapRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power2.out", scrollTrigger: { trigger: mapRef.current, start: "top 85%" } }
      );
    }
    return () => { ScrollTrigger.getAll().forEach(t => t.kill()); };
  }, [shouldReduceMotion]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState("sending");

    const phone = "918107817873";
    const name = (document.getElementById("name") as HTMLInputElement).value;
    const email = (document.getElementById("email") as HTMLInputElement).value;
    const type = (document.getElementById("inquiryType") as HTMLSelectElement).value;
    const msg = (document.getElementById("message") as HTMLTextAreaElement).value;
    
    const text = encodeURIComponent(`Khamma Ghani RETIVAA DESERT CAMP,\n\nMy name is ${name} (${email}). I have an inquiry regarding: ${type}.\n\nMessage:\n${msg}`);
    const whatsappUrl = `https://wa.me/${phone}?text=${text}`;

    setFormState("sealing");

    const prefersReduced = shouldReduceMotion || (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    if (prefersReduced) {
      window.open(whatsappUrl, "_blank");
      setFormState("thanks");
      return;
    }

    const tl = gsap.timeline({ onComplete: () => setFormState("thanks") });

    tl.to(liveFormRef.current, { opacity: 0, duration: 0.3 });
    tl.set(visualLetterRef.current, { opacity: 1 });
    tl.set(letterRef.current, { backgroundColor: "transparent", backgroundImage: "none", boxShadow: "none" });
    
    tl.to(letterRef.current, { y: -20, scale: 0.95, duration: 0.4, ease: "power1.out" }, "<");
    tl.to(panelBottomRef.current, { rotateX: 179, duration: 0.8, ease: "power2.inOut" });
    tl.to(panelTopRef.current, { rotateX: -179, duration: 0.8, ease: "power2.inOut" }, "-=0.4");
    tl.to(letterRef.current, { scale: 0.75, duration: 0.6, ease: "power2.inOut" }, "-=0.4");
    tl.set([envelopeBackRef.current, envelopePocketRef.current, envelopeFlapRef.current], { opacity: 1 });
    tl.to(letterRef.current, { y: 200, duration: 0.9, ease: "power2.in" });
    tl.to(envelopeFlapRef.current, { rotateX: 0, duration: 0.8, ease: "power2.out" }, "-=0.2");
    tl.to(waxSealRef.current, { y: 0, scale: 1, opacity: 1, duration: 0.6, ease: "back.out(2)" });
    tl.to({}, { duration: 1.0 });
    tl.to(formWrapperRef.current, { y: 40, opacity: 0, scale: 0.95, duration: 0.8, ease: "power2.inOut" });

    if (formWrapperRef.current) formWrapperRef.current.dataset.wa = whatsappUrl;
  };

  const handleWhatsApp = () => {
    const url = formWrapperRef.current?.dataset.wa;
    if (url) window.open(url, "_blank");
  };

  const isEmailConfigured = isConfigured(siteConfig.contact.email);

  return (
    <div className="bg-[#FDFBF7] min-h-screen text-[#392A22] overflow-hidden selection:bg-[#B38B57]/30 perspective-[1500px]">
      
      {/* Subtle page-wide texture */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22 opacity=%220.02%22/%3E%3C/svg%3E")' }} />

      {/* =========================================================================
          PART 1: FULL-BLEED ROYAL ILLUMINATED MANUSCRIPT HERO
          ========================================================================= */}
      <section 
        ref={heroRef}
        className="relative w-full min-h-[calc(100svh-3.5rem)] sm:min-h-[calc(100svh-5rem)] mt-14 sm:mt-20 flex flex-col justify-between items-center overflow-hidden bg-[#F6EED8] border-b border-[#D7B98E]/40 select-none"
      >
        {/* Full-Bleed Rajasthani Hand-Painted Floral Archway Background */}
        <div ref={bgRef} className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
          {/* Desktop & Tablet: Full-bleed Landscape Manuscript Frame (Floral borders frame screen edges, archway centered) */}
          <Image
            src="/images/contact/contact-royal-arch-frame.webp"
            alt="Royal Rajasthani Illuminated Archway Artwork"
            fill
            priority
            sizes="100vw"
            className="hidden md:block object-cover object-center w-full h-full select-none"
          />

          {/* Mobile: Full-bleed Portrait Archway Artwork */}
          <Image
            src="/images/contact/contact-royal-arch-frame-mobile.webp"
            alt="Royal Rajasthani Illuminated Archway Artwork"
            fill
            priority
            sizes="100vw"
            className="block md:hidden object-cover object-top w-full h-full select-none"
          />

          {/* Subtle perimeter gold manuscript double frame lines */}
          <div className="absolute inset-2 sm:inset-3 md:inset-5 lg:inset-6 border border-[#B88A44]/35 pointer-events-none" />
          <div className="absolute inset-3 sm:inset-4 md:inset-6 lg:inset-8 border border-[#B88A44]/15 pointer-events-none" />

          {/* Authentic parchment wasli paper grain texture */}
          <div 
            className="absolute inset-0 opacity-[0.035] mix-blend-multiply pointer-events-none"
            style={{ 
              backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' 
            }} 
          />
        </div>

        {/* Top Spacer to balance the layout inside the archway */}
        <div className="w-full pt-3 xs:pt-4 sm:pt-6 pointer-events-none" />

        {/* Central Content Positioned Directly Inside the Decorative Arch */}
        <div className="relative z-10 w-full max-w-[260px] xs:max-w-[300px] sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl px-2 sm:px-8 mx-auto my-auto text-center flex flex-col items-center justify-center">
          
          {/* Small Eyebrow & Gold Fleuron */}
          <div ref={eyebrowRef} className="flex flex-col items-center gap-1 sm:gap-2 mb-1.5 sm:mb-3">
            <p className="font-sans font-semibold tracking-[0.18em] xs:tracking-[0.25em] sm:tracking-[0.42em] uppercase text-[#3D2E22] text-[8.5px] xs:text-[10px] sm:text-xs md:text-[13px] lg:text-sm">
              RETIVAA DESERT CAMP <span className="text-[#B88A44] mx-0.5 sm:mx-1">·</span> JAISALMER
            </p>
            <GoldFleuron className="w-14 xs:w-20 sm:w-28 md:w-36 h-1.5 sm:h-2.5 text-[#B88A44]" />
          </div>

          {/* Elegant Cursive Line */}
          <p 
            ref={cursiveRef}
            className={`${cursive.className} text-[#424A32] text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight font-normal mb-1.5 sm:mb-3 drop-shadow-[0_1px_1px_rgba(255,255,255,0.5)]`}
          >
            A little note from the heart
          </p>

          {/* Main Editorial Heading */}
          <h1 
            ref={headingRef}
            className="font-serif font-normal sm:font-medium text-[#1E1813] text-2xl xs:text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[76px] leading-[1.08] sm:leading-[0.95] tracking-tight mb-2 sm:mb-4"
          >
            <span className="block">Send a Note</span>
            <span className="block">to the Desert.</span>
          </h1>

          {/* Description & Supporting Text */}
          <div ref={descRef} className="flex flex-col items-center gap-1.5 sm:gap-3 max-w-[240px] xs:max-w-[270px] sm:max-w-xl mx-auto">
            <GoldFleuron className="w-12 xs:w-16 sm:w-24 md:w-32 h-1.5 sm:h-2 text-[#B88A44] mb-0.5 sm:mb-2" />
            
            <p className="font-serif text-[#2D231C] text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl leading-snug font-normal">
              Some journeys begin with a conversation.<br className="hidden sm:inline" /> We&apos;d love to hear yours.
            </p>
            
            <p className="text-[#554639] text-[10.5px] xs:text-xs sm:text-[13px] md:text-sm lg:text-base leading-relaxed">
              Whether it&apos;s a stay, a celebration, or a special desert experience, RETIVAA DESERT CAMP would be delighted to hear from you.
            </p>
          </div>
        </div>

        {/* Bottom Desert Coordinates & Quick Scroll Button */}
        <div ref={actionRef} className="relative z-10 w-full pb-14 xs:pb-16 sm:pb-8 flex flex-col items-center justify-center gap-2 xs:gap-3 sm:gap-6 text-xs sm:text-[13px] tracking-widest uppercase font-mono text-[#3D2E22]/85">
          <div className="flex items-center gap-1.5 sm:gap-2 text-[9.5px] xs:text-[11px] sm:text-xs">
            <span>26.9157° N, 70.9083° E</span>
            <span className="text-[#B88A44]/60">·</span>
            <span>Sam Sand Dunes</span>
          </div>

          <a 
            href="#letter-station"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('letter-station')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 px-4 py-1.5 xs:px-5 xs:py-2 rounded-full border border-[#B88A44]/50 bg-[#FAF6F0]/90 hover:bg-[#FAF6F0] text-[#30251F] text-[10px] xs:text-[11px] font-mono uppercase tracking-[0.2em] transition-all duration-300 shadow-sm backdrop-blur-xs group cursor-pointer"
          >
            <span>Pen Your Note</span>
            <span className="transform group-hover:translate-y-0.5 transition-transform text-[#B88A44]">↓</span>
          </a>
        </div>
      </section>

      <div id="letter-station" className="w-full bg-[#191918] py-24 lg:py-32 relative z-10 border-b border-[#D7B98E]/10">
        <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
        <Container className="relative z-20">
          
          {/* =========================================================================
              PART 2: THE ROYAL LETTER FORM & THANK YOU STATE
              ========================================================================= */}
          <div className="max-w-3xl mx-auto relative h-[800px] perspective-[2000px]">
          
          {/* THE THANK YOU COMPOSITION */}
          <div 
            ref={thankYouRef}
            className={`absolute inset-0 flex flex-col items-center justify-center text-center transition-all duration-1000 ${formState === "thanks" ? "opacity-100 pointer-events-auto scale-100 translate-y-0 delay-500" : "opacity-0 pointer-events-none scale-95 translate-y-10"}`}
            style={{ zIndex: 100 }}
          >
             <div className="w-full max-w-lg p-12 lg:p-16 border border-[#B38B57]/30 bg-[#1A1512] rounded-sm shadow-[0_30px_80px_rgba(0,0,0,0.5)] relative">
                <div className="absolute inset-3 border border-[#B38B57]/20 pointer-events-none" />
                
                <h2 className="font-serif text-4xl lg:text-5xl text-[#FDFBF7] mb-6 tracking-wide drop-shadow-sm">Khamma Ghani</h2>
                <p className={`${cursive.className} text-3xl lg:text-5xl text-[#B38B57] mb-6 drop-shadow-sm`}>
                  Thank you for writing to us.
                </p>
                <p className="text-[#FDFBF7]/80 text-sm leading-relaxed mb-8 px-4">
                  Your letter is ready in WhatsApp. Please press Continue to share it with RETIVAA DESERT CAMP.
                </p>
                <div className="mb-10">
                  <p className={`${cursive.className} text-3xl lg:text-4xl text-[#B38B57] mb-2`}>With warmth,</p>
                  <p className="font-serif text-[12px] tracking-[0.3em] uppercase text-[#FDFBF7]/60">RETIVAA DESERT CAMP</p>
                </div>
                <div className="flex flex-col gap-4 items-center relative z-10">
                  <button onClick={handleWhatsApp} className="px-10 py-4 bg-[#B38B57] border border-[#D7B98E] text-[#1A1512] text-xs font-mono tracking-widest uppercase hover:bg-[#D7B98E] transition-all rounded-sm shadow-xl font-bold">
                    Continue to WhatsApp
                  </button>
                  <button onClick={() => window.location.reload()} className="text-[10px] uppercase tracking-widest text-[#FDFBF7]/40 hover:text-[#B38B57] transition-colors mt-2">
                    Write Another Letter
                  </button>
                </div>
             </div>
          </div>

          {/* THE ENVELOPE & LETTER ASSEMBLY */}
          <div ref={formWrapperRef} className="absolute inset-0 pt-[40px] perspective-[1500px]">
            <div ref={envelopeBackRef} className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[95%] sm:w-[85%] max-w-[600px] h-[360px] bg-[#C9AA7E] shadow-[0_20px_50px_rgba(0,0,0,0.2)] opacity-0 rounded-sm" style={{ zIndex: 10 }}>
              <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.15)] rounded-sm pointer-events-none" />
            </div>

            <div ref={letterRef} className="relative w-full max-w-[650px] h-[650px] mx-auto transform-gpu" style={{ zIndex: 20, backgroundColor: "#F4EBE1", backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22 opacity=%220.06%22/%3E%3C/svg%3E")', boxShadow: "0 15px 40px rgba(0,0,0,0.15)" }}>
              <div ref={liveFormRef} className="absolute inset-0 p-5 sm:p-10 lg:p-16 z-20">
                <div className="absolute inset-4 sm:inset-5 border border-[#B38B57]/30 pointer-events-none" />
                <div className="absolute inset-5 sm:inset-[26px] border border-[#66745E]/15 pointer-events-none" />
                <div className="text-center mb-6 sm:mb-10">
                  <span className={`${cursive.className} text-2xl sm:text-3xl text-[#A65F49] drop-shadow-sm`}>Your words, our pleasure</span>
                  <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl uppercase tracking-[0.14em] sm:tracking-[0.2em] mt-2 sm:mt-3 text-[#201B18]">Write to RETIVAA DESERT CAMP</h2>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-10 relative z-30">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10">
                    <div className="relative group">
                      <input required type="text" id="name" className="w-full bg-transparent border-b border-[#392A22]/20 py-2 text-[#392A22] placeholder:text-transparent peer focus:outline-none focus:border-[#B38B57] transition-colors" placeholder="Full Name" />
                      <label className="absolute left-0 top-2 text-[#392A22]/50 text-sm transition-all peer-focus:-top-5 peer-focus:text-xs peer-focus:text-[#B38B57] peer-not-placeholder-shown:-top-5 peer-not-placeholder-shown:text-xs tracking-wide pointer-events-none">Full Name</label>
                    </div>
                    <div className="relative group">
                      <input required type="email" id="email" className="w-full bg-transparent border-b border-[#392A22]/20 py-2 text-[#392A22] placeholder:text-transparent peer focus:outline-none focus:border-[#B38B57] transition-colors" placeholder="Email Address" />
                      <label className="absolute left-0 top-2 text-[#392A22]/50 text-sm transition-all peer-focus:-top-5 peer-focus:text-xs peer-focus:text-[#B38B57] peer-not-placeholder-shown:-top-5 peer-not-placeholder-shown:text-xs tracking-wide pointer-events-none">Email Address</label>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10">
                    <div className="relative group">
                      <input required type="tel" id="phone" className="w-full bg-transparent border-b border-[#392A22]/20 py-2 text-[#392A22] placeholder:text-transparent peer focus:outline-none focus:border-[#B38B57] transition-colors" placeholder="Phone Number" />
                      <label className="absolute left-0 top-2 text-[#392A22]/50 text-sm transition-all peer-focus:-top-5 peer-focus:text-xs peer-focus:text-[#B38B57] peer-not-placeholder-shown:-top-5 peer-not-placeholder-shown:text-xs tracking-wide pointer-events-none">Phone Number</label>
                    </div>
                    <div className="relative group">
                      <select required id="inquiryType" className="w-full bg-transparent border-b border-[#392A22]/20 py-2 text-[#392A22] peer focus:outline-none focus:border-[#B38B57] transition-colors appearance-none rounded-none cursor-pointer tracking-wide">
                        <option value="" disabled hidden>Inquiry Type</option>
                        <option value="stay">Stay Inquiry</option>
                        <option value="event">Event or Celebration</option>
                        <option value="experiences">Desert Experiences</option>
                      </select>
                      <div className="absolute right-2 top-3 w-2 h-2 border-r border-b border-[#392A22]/40 rotate-45 pointer-events-none" />
                    </div>
                  </div>
                  <div className="relative group pt-1 sm:pt-2">
                    <textarea required id="message" rows={3} className="w-full bg-transparent border-b border-[#392A22]/20 py-2 text-[#392A22] placeholder:text-transparent peer focus:outline-none focus:border-[#B38B57] transition-colors resize-none leading-relaxed" placeholder="Message" />
                    <label className="absolute left-0 top-2 text-[#392A22]/50 text-sm transition-all peer-focus:-top-5 peer-focus:text-xs peer-focus:text-[#B38B57] peer-not-placeholder-shown:-top-5 peer-not-placeholder-shown:text-xs tracking-wide pointer-events-none">Your Message</label>
                  </div>
                  <div className="pt-3 sm:pt-6 text-center flex flex-col items-center gap-3">
                    <button disabled={formState !== "writing"} type="submit" className="group relative inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-3.5 sm:py-4 bg-[#2C211A] text-[#F3E8D4] hover:bg-[#B38B57] transition-all duration-300 rounded-sm disabled:opacity-70 shadow-xl cursor-pointer">
                      <span className="font-mono text-[11px] tracking-[0.25em] uppercase">{formState === "sending" ? "Sealing..." : "Seal & Send to WhatsApp"}</span>
                    </button>
                    <a
                      href="https://wa.me/918107817873?text=Khamma%20Ghani%20RETIVAA%20Desert%20Camp%2C%20I%20would%20like%20to%20enquire%20about%20staying%20at%20your%20desert%20camp."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[11px] font-mono tracking-wider uppercase text-[#392A22]/75 hover:text-[#25D366] transition-colors"
                    >
                      <MessageCircle size={14} className="text-[#25D366]" />
                      <span>Direct WhatsApp: +91 81078 17873</span>
                    </a>
                  </div>
                </form>
              </div>

              <div ref={visualLetterRef} className="absolute inset-0 opacity-0 pointer-events-none perspective-[1500px]" style={{ zIndex: 10 }}>
                <div ref={panelTopRef} className="absolute top-0 left-0 w-full h-[33.333%] origin-bottom" style={{ transformStyle: 'preserve-3d' }}>
                  <div className="absolute inset-0 overflow-hidden backface-hidden bg-[#F4EBE1]"><div className="absolute top-0 left-0 w-full h-[1950px]"><LetterDesign /></div></div>
                  <div className="absolute inset-0 backface-hidden bg-[#E6D4BE] border-b border-[#392A22]/10 shadow-[inset_0_-10px_20px_rgba(0,0,0,0.1)]" style={{ transform: "rotateX(180deg)" }} />
                </div>
                <div ref={panelMiddleRef} className="absolute top-[33.333%] left-0 w-full h-[33.333%] overflow-hidden bg-[#F4EBE1]">
                  <div className="absolute top-[-100%] left-0 w-full h-[1950px]"><LetterDesign /></div>
                </div>
                <div ref={panelBottomRef} className="absolute bottom-0 left-0 w-full h-[33.333%] origin-top" style={{ transformStyle: 'preserve-3d' }}>
                  <div className="absolute inset-0 overflow-hidden backface-hidden bg-[#F4EBE1]"><div className="absolute top-[-200%] left-0 w-full h-[1950px]"><LetterDesign /></div></div>
                  <div className="absolute inset-0 backface-hidden bg-[#DFCAAE] border-t border-[#392A22]/10 shadow-[inset_0_10px_20px_rgba(0,0,0,0.1)]" style={{ transform: "rotateX(-180deg)" }} />
                </div>
              </div>
            </div>

            <div ref={envelopePocketRef} className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[95%] sm:w-[85%] max-w-[600px] h-[240px] bg-[#D4B282] opacity-0 rounded-b-sm pointer-events-none shadow-[0_-5px_15px_rgba(0,0,0,0.05)]" style={{ zIndex: 30, clipPath: "polygon(0 0, 45% 20%, 55% 20%, 100% 0, 100% 100%, 0 100%)", backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22 opacity=%220.04%22/%3E%3C/svg%3E")' }}>
              <div className="absolute top-0 left-0 w-1/2 h-[1px] bg-white/30 origin-top-left rotate-[17deg]" />
              <div className="absolute top-0 right-0 w-1/2 h-[1px] bg-white/30 origin-top-right -rotate-[17deg]" />
            </div>

            <div ref={envelopeFlapRef} className="absolute bottom-[180px] left-1/2 -translate-x-1/2 w-[95%] sm:w-[85%] max-w-[600px] h-[180px] bg-[#C4A579] opacity-0 pointer-events-none" style={{ zIndex: 40, transformOrigin: "top center", transform: "rotateX(-180deg)", clipPath: "polygon(0 0, 100% 0, 90% 100%, 10% 100%)", backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22 opacity=%220.04%22/%3E%3C/svg%3E")' }}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-8 bg-gradient-to-b from-black/10 to-transparent blur-md" />
            </div>

            <div ref={waxSealRef} className="absolute left-1/2 -translate-x-1/2 bottom-[145px] w-[70px] h-[70px] rounded-full bg-gradient-to-br from-[#8C2C30] via-[#701E22] to-[#4A1012] shadow-[0_4px_10px_rgba(0,0,0,0.6),inset_0_2px_4px_rgba(255,255,255,0.2),inset_0_-2px_6px_rgba(0,0,0,0.4)] flex items-center justify-center opacity-0 scale-50 translate-y-10 pointer-events-none" style={{ zIndex: 50 }}>
              <div className="absolute inset-1.5 rounded-full border border-[#A53A3E]/40" />
              <span className={`${cursive.className} text-3xl text-[#E8C0A0] opacity-90`} style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.8), -1px -1px 1px rgba(255,255,255,0.1)", transform: "rotate(-5deg)" }}>R</span>
            </div>
          </div>
        </div>
        </Container>
      </div>

      <Container className="relative z-10 pt-24 lg:pt-32 pb-32">
        
        {/* =========================================================================
            PART 3: TREASURE HUNT MAP
            ========================================================================= */}
        <div ref={mapRef} className="max-w-5xl mx-auto mb-24 opacity-0">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl lg:text-5xl text-[#201B18] mb-3 tracking-wide">Find Us Beyond the Dunes.</h2>
            <p className={`${cursive.className} text-2xl lg:text-4xl text-[#B38B57] mb-5`}>Your journey begins here.</p>
            <p className="text-[#392A22]/70 font-light text-sm max-w-lg mx-auto">
              Follow the golden sands toward RETIVAA DESERT CAMP, nestled in the desert landscape near Sam, Jaisalmer.
            </p>
          </div>
        </div>
      </Container>

      <CinematicMap ringText="RETIVAA DESERT CAMP • JAISALMER • " repeat={3} />

      <Container className="relative z-10 pb-32 pt-24 lg:pt-32">

        {/* =========================================================================
            PART 4: CONTACT DETAILS
            ========================================================================= */}
        <div className="max-w-5xl mx-auto border-t border-[#D7B98E]/30 pt-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
             <div className="text-center space-y-4">
                <span className="block text-[11px] tracking-[0.25em] uppercase text-[#8C2C30] font-mono">Direct Line & WhatsApp</span>
                <a href={`tel:${siteConfig.contact.phone.replace(/\s+/g, "")}`} className="inline-flex items-center justify-center gap-2 font-serif text-2xl sm:text-3xl text-[#201B18] hover:text-[#B38B57] transition-colors">
                  <Phone size={18} className="text-[#8C2C30]" />
                  <span>{siteConfig.contact.phone}</span>
                </a>
                <a
                  href={`https://wa.me/918107817873?text=${encodeURIComponent("Khamma Ghani RETIVAA Desert Camp, I would like to connect with your concierge team.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#25D366]/10 border border-[#25D366]/30 text-[#1E5E32] text-xs font-mono tracking-widest uppercase hover:bg-[#25D366] hover:text-white transition-all shadow-sm"
                >
                  <MessageCircle size={14} className="text-[#25D366] group-hover:text-white" />
                  <span>WhatsApp: +91 81078 17873</span>
                </a>
             </div>
             <div className="text-center space-y-5">
                <span className="block text-[11px] tracking-[0.25em] uppercase text-[#8C2C30] font-mono">Email Enquiries</span>
                {isEmailConfigured ? (
                  <a href={`mailto:${siteConfig.contact.email}`} className="block font-serif text-xl sm:text-2xl text-[#201B18] hover:text-[#B38B57] transition-colors">{siteConfig.contact.email}</a>
                ) : (
                  <span className="block font-serif text-xl text-[#392A22]/50 italic">Email pending</span>
                )}
             </div>
             <div className="text-center space-y-5">
                <span className="block text-[11px] tracking-[0.25em] uppercase text-[#8C2C30] font-mono">Base Camp</span>
                <p className="font-serif text-xl sm:text-2xl text-[#201B18]">{siteConfig.brand.location}</p>
                <p className="text-[13px] text-[#392A22]/80 max-w-[220px] mx-auto leading-relaxed">
                  {isConfigured(siteConfig.contact.address) ? siteConfig.contact.address : "Location coordinates available upon confirmed reservation."}
                </p>
             </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
