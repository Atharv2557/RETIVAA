"use client";

import { useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { siteConfig, getConfiguredSocialLinks } from "@/config/site.config";
import { useNavigation } from "./NavigationContext";
import { TornPaperEdge } from "./TornPaperEdge";

interface NavLinkItem {
  readonly label: string;
  readonly href: string;
}

const NAV_LINKS: readonly NavLinkItem[] = [
  { label: "Home", href: "/" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

export function FullScreenMenu() {
  const { isMenuOpen, closeMenu, navigateWithTransition, currentTheme } = useNavigation();
  const pathname = usePathname();

  const containerRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const linksContainerRef = useRef<HTMLDivElement>(null);
  const linkLabelRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const locationLabelRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const firstFocusableRef = useRef<HTMLAnchorElement>(null);

  const isAnimatingRef = useRef(false);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const configuredSocialLinks = getConfiguredSocialLinks();

  // Dynamic Theme Palette: "dark" (evening charcoal) vs "light" (warm ivory desert paper)
  const isDark = currentTheme === "dark";

  const sheetBg = isDark ? "bg-[#191918]" : "bg-[#F6EFE3]";
  const textColor = isDark ? "text-[#F6EFE3]" : "text-[#30251F]";
  const brandText = isDark ? "text-[#F6EFE3] group-hover:text-[#B88A44]" : "text-[#30251F] group-hover:text-[#B88A44]";
  const brandSubtitle = isDark ? "text-[#D7B98E]" : "text-[#A65335]";
  const closeBtnClass = isDark
    ? "text-[#F6EFE3] hover:text-[#B88A44]"
    : "text-[#30251F] hover:text-[#A65335]";
  const closeIconClass = isDark ? "bg-[#F6EFE3]" : "bg-[#30251F]";

  const linkActiveColor = isDark ? "text-[#F6EFE3]" : "text-[#30251F]";
  const linkInactiveColor = isDark
    ? "text-[#F6EFE3]/80 group-hover:text-[#F6EFE3] group-focus-visible:text-[#F6EFE3]"
    : "text-[#30251F]/75 group-hover:text-[#30251F] group-focus-visible:text-[#30251F]";

  const activeLineClass = isDark
    ? "bg-gradient-to-r from-transparent via-[#A65335] to-[#B88A44] shadow-[0_0_8px_rgba(184,138,68,0.6)]"
    : "bg-gradient-to-r from-transparent via-[#A65335] to-[#30251F] shadow-[0_0_6px_rgba(166,83,53,0.35)]";

  const hoverLineClass = isDark
    ? "bg-gradient-to-r from-[#B88A44] to-[#A65335]"
    : "bg-gradient-to-r from-[#A65335] to-[#30251F]";

  const locationTextClass = isDark ? "text-[#D7B98E]" : "text-[#A65335]";
  const pulseDotClass = isDark ? "bg-[#B88A44]" : "bg-[#A65335]";
  const socialTextClass = isDark ? "text-[#F6EFE3]/70 hover:text-[#B88A44]" : "text-[#30251F]/70 hover:text-[#A65335]";
  const coordTextClass = isDark ? "text-[#F6EFE3]/40" : "text-[#30251F]/40";

  const tornEdgeColor = isDark ? "#191918" : "#F6EFE3";
  const tornEdgeFringe = isDark ? "#F6EFE3" : "#D7B98E";

  // Open Animation (Descending sheet with torn paper edge + staggered masked text reveal)
  const animateOpen = useCallback(() => {
    if (!sheetRef.current) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Kill any existing timeline
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    if (prefersReducedMotion) {
      gsap.set(sheetRef.current, { yPercent: 0, opacity: 1 });
      gsap.set(linkLabelRefs.current.filter(Boolean), { yPercent: 0, opacity: 1 });
      gsap.set(locationLabelRef.current, { opacity: 1 });
      if (closeBtnRef.current) {
        closeBtnRef.current.focus();
      }
      return;
    }

    isAnimatingRef.current = true;

    // Reset initial state
    gsap.set(sheetRef.current, { yPercent: -100 });
    gsap.set(linkLabelRefs.current.filter(Boolean), { yPercent: 125, opacity: 0 });
    gsap.set(locationLabelRef.current, { opacity: 0, y: 15 });

    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      onComplete: () => {
        isAnimatingRef.current = false;
        if (closeBtnRef.current) {
          closeBtnRef.current.focus({ preventScroll: true });
        }
      },
    });

    timelineRef.current = tl;

    // Stage 1: Sheet descends covering the viewport (750–950ms)
    tl.to(sheetRef.current, {
      yPercent: 0,
      duration: 0.88,
      ease: "power3.inOut",
    });

    // Stage 2: Navigation labels rise out of overflow-hidden masks (~80ms stagger)
    const validLabels = linkLabelRefs.current.filter(Boolean);
    tl.to(
      validLabels,
      {
        yPercent: 0,
        opacity: 1,
        duration: 0.75,
        stagger: 0.08,
        ease: "power3.out",
      },
      "-=0.35"
    );

    // Stage 3: Location label and footer details fade in
    if (locationLabelRef.current) {
      tl.to(
        locationLabelRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
        },
        "-=0.25"
      );
    }
  }, []);

  // Close Animation (retract upward with smooth label exit)
  const animateClose = useCallback(
    (onCompleteCallback?: () => void) => {
      if (!sheetRef.current) {
        onCompleteCallback?.();
        return;
      }

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) {
        onCompleteCallback?.();
        return;
      }

      if (timelineRef.current) {
        timelineRef.current.kill();
      }

      isAnimatingRef.current = true;

      const tl = gsap.timeline({
        defaults: { ease: "power3.in" },
        onComplete: () => {
          isAnimatingRef.current = false;
          onCompleteCallback?.();
        },
      });

      timelineRef.current = tl;

      // Labels slide down/fade out
      const validLabels = linkLabelRefs.current.filter(Boolean);
      tl.to(validLabels, {
        yPercent: 100,
        opacity: 0,
        duration: 0.3,
        stagger: 0.04,
      });

      if (locationLabelRef.current) {
        tl.to(locationLabelRef.current, { opacity: 0, duration: 0.2 }, 0);
      }

      // Sheet retracts upward
      tl.to(
        sheetRef.current,
        {
          yPercent: -100,
          duration: 0.65,
          ease: "power3.inOut",
        },
        "-=0.15"
      );
    },
    []
  );

  // Trigger open animation when menu opens
  useEffect(() => {
    if (isMenuOpen) {
      animateOpen();
    }
  }, [isMenuOpen, animateOpen]);

  // Handle Close Button or Esc trigger
  const handleClose = useCallback(() => {
    if (isAnimatingRef.current) return;
    animateClose(() => {
      closeMenu();
    });
  }, [animateClose, closeMenu]);

  // Handle Link Navigation
  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    // Preserve modified clicks (Ctrl, Cmd, Shift, middle-click)
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return;
    }

    e.preventDefault();

    if (href === pathname) {
      handleClose();
      return;
    }

    if (isAnimatingRef.current) return;

    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    const validLabels = linkLabelRefs.current.filter(Boolean);
    gsap.to(validLabels, {
      yPercent: 100,
      opacity: 0,
      duration: 0.25,
      stagger: 0.03,
      ease: "power2.in",
      onComplete: () => {
        navigateWithTransition(href);
      },
    });
  };

  // Keyboard navigation & Focus trapping
  useEffect(() => {
    if (!isMenuOpen || !containerRef.current) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleClose();
        return;
      }

      // Trap focus
      if (e.key === "Tab") {
        const focusables = containerRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusables || focusables.length === 0) return;

        const firstElement = focusables[0];
        const lastElement = focusables[focusables.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen, handleClose]);

  if (!isMenuOpen) return null;

  return (
    <div
      ref={containerRef}
      id="fullscreen-navigation-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site Navigation Menu"
      className="fixed inset-0 z-50 pointer-events-auto select-none"
    >
      {/* Descending Menu Sheet with Dynamic Theme (Dark vs Light) */}
      <div
        ref={sheetRef}
        className={`relative w-full h-[100dvh] flex flex-col justify-between ${sheetBg} ${textColor} overflow-y-auto will-change-transform shadow-2xl transition-colors duration-500`}
        style={{
          paddingTop: "max(1rem, env(safe-area-inset-top, 1rem))",
          paddingBottom: "max(1.5rem, env(safe-area-inset-bottom, 1.5rem))",
        }}
      >
        {/* Top Header Bar inside Menu (Position-aligned with SiteHeader) */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14 sm:h-20 shrink-0">
          {/* RETIVAA DESERT CAMP Wordmark */}
          <Link
            ref={firstFocusableRef}
            href="/"
            onClick={(e) => handleLinkClick(e, "/")}
            className="group flex flex-col focus-visible:outline-2 focus-visible:outline-[#B88A44] rounded-xs min-w-0"
            aria-label={`${siteConfig.brand.name} - Return to homepage`}
          >
            <span className={`font-serif text-sm xs:text-base sm:text-xl md:text-2xl lg:text-3xl font-medium tracking-[0.14em] sm:tracking-[0.24em] uppercase transition-colors truncate ${brandText}`}>
              {siteConfig.brand.name}
            </span>
            <span className={`text-[8px] sm:text-[10px] uppercase tracking-[0.3em] sm:tracking-[0.35em] font-medium ${brandSubtitle}`}>
              Jaisalmer
            </span>
          </Link>

          {/* Close Button */}
          <button
            ref={closeBtnRef}
            type="button"
            onClick={handleClose}
            aria-label="Close navigation menu"
            className={`flex items-center gap-2.5 sm:gap-3 px-3 sm:px-4 py-2 min-h-[44px] min-w-[44px] rounded-sm font-sans text-xs font-semibold uppercase tracking-[0.2em] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#B88A44] ${closeBtnClass}`}
          >
            <span className="hidden xs:inline sm:inline">Close</span>
            <div className="relative w-5 h-5 flex flex-col justify-center items-center pointer-events-none">
              <span className={`absolute h-[1.5px] w-5 rounded-full rotate-45 ${closeIconClass}`} />
              <span className={`absolute h-[1.5px] w-5 rounded-full -rotate-45 ${closeIconClass}`} />
            </div>
          </button>
        </div>

        {/* Center: Expressive Editorial Serif Navigation Links (Carefully scaled with clamp so no overlap on laptops) */}
        <div
          ref={linksContainerRef}
          className="my-auto py-4 sm:py-8 flex flex-col items-center justify-center text-center shrink-0 px-4"
        >
          <nav aria-label="Menu Links" className="flex flex-col items-center space-y-3 sm:space-y-5 md:space-y-6">
            {NAV_LINKS.map((link, index) => {
              const isCurrent = pathname === link.href;

              return (
                <div
                  key={link.href}
                  className="overflow-hidden py-1 px-4 flex items-center justify-center max-w-full"
                >
                  <Link
                    href={link.href}
                    aria-current={isCurrent ? "page" : undefined}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className="group relative inline-block text-center focus-visible:outline-2 focus-visible:outline-[#B88A44] rounded-sm py-1 px-3"
                  >
                    {/* Animated Masked Label with Responsive Editorial Sizing */}
                    <span
                      ref={(el) => {
                        linkLabelRefs.current[index] = el;
                      }}
                      className={`relative inline-block font-serif font-normal uppercase leading-[1.08] tracking-[0.03em] transition-colors duration-300 text-[clamp(2.75rem,7vw,6.5rem)] ${
                        isCurrent ? linkActiveColor : linkInactiveColor
                      }`}
                    >
                      {link.label}

                      {/* Active Page Indicator: Thin accent line running through the label */}
                      {isCurrent && (
                        <span
                          aria-hidden="true"
                          className={`absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] sm:h-[3px] pointer-events-none ${activeLineClass}`}
                        />
                      )}

                      {/* Hover & Focus animated line running smoothly across the link */}
                      {!isCurrent && (
                        <span
                          aria-hidden="true"
                          className={`absolute left-0 bottom-0 h-[1.5px] sm:h-[2px] w-0 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full group-focus-visible:w-full pointer-events-none ${hoverLineClass}`}
                        />
                      )}
                    </span>
                  </Link>
                </div>
              );
            })}
          </nav>
        </div>

        {/* Bottom Supporting Details & Socials (Fades in last) */}
        <div
          ref={locationLabelRef}
          className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2 shrink-0 flex flex-col sm:flex-row items-center justify-between text-xs tracking-widest gap-4"
        >
          {/* Location Landmark */}
          <div className={`flex items-center gap-2 font-mono text-[10px] sm:text-xs uppercase ${locationTextClass}`}>
            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${pulseDotClass}`} />
            <span>JAISALMER &bull; RAJASTHAN</span>
          </div>

          {/* Social Links (Rendered only when configured) */}
          {configuredSocialLinks.length > 0 && (
            <div className="flex items-center gap-6 text-xs uppercase tracking-wider">
              {configuredSocialLinks.map((social) => (
                <a
                  key={social.platform}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`transition-colors focus-visible:outline-2 focus-visible:outline-[#B88A44] py-1 ${socialTextClass}`}
                >
                  {social.label}
                </a>
              ))}
            </div>
          )}

          {/* Coordinates */}
          <div className={`hidden md:block font-mono text-[10px] ${coordTextClass}`}>
            26.9157° N · 70.9083° E · SAM DUNES
          </div>
        </div>

        {/* Irregular Torn Paper Edge following lower boundary */}
        <div className="absolute top-full left-0 right-0 z-10 -mt-[1px]">
          <TornPaperEdge
            direction="down"
            color={tornEdgeColor}
            fringeColor={tornEdgeFringe}
          />
        </div>
      </div>
    </div>
  );
}
