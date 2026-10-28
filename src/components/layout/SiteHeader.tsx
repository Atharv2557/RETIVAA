"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig, isConfigured, getWhatsAppEnquiryUrl } from "@/config/site.config";
import { useNavigation } from "./NavigationContext";

export function SiteHeader() {
  const pathname = usePathname();
  const { isMenuOpen, toggleMenu, menuButtonRef, currentTheme } = useNavigation();
  const [isScrolled, setIsScrolled] = useState(false);

  // Check if we are over the dark desert hero on the homepage
  const isHomePage = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 48);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Theme states
  const isHeroTransparent = isHomePage && !isScrolled && !isMenuOpen;
  const isDarkActive = isHeroTransparent || (isMenuOpen && currentTheme === "dark");

  // Header background & border styling
  const headerBgClass = isHeroTransparent
    ? "bg-transparent border-transparent"
    : isMenuOpen
    ? "bg-transparent border-transparent"
    : "bg-[#F6EFE3]/95 backdrop-blur-md border-[rgba(48,37,31,0.08)] shadow-[0_2px_12px_rgba(48,37,31,0.03)]";

  // Text & brand colors
  const brandTextClass = isDarkActive
    ? "text-[#FAF6F0] drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]"
    : "text-[#30251F]";

  const brandSubtitleClass = isDarkActive
    ? "text-[#E4C198] drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
    : "text-[#A65335]";

  const buttonTextClass = isDarkActive
    ? "text-[#FAF6F0] hover:text-[#E4C198]"
    : "text-[#30251F] hover:text-[#B88A44]";

  const iconBarClass = isDarkActive
    ? "bg-[#FAF6F0]"
    : "bg-[#30251F]";

  // Enquiry link target & behavior
  const isWhatsAppReady = isConfigured(siteConfig.contact.whatsapp);
  const whatsappUrl = getWhatsAppEnquiryUrl(
    "Khamma Ghani RETIVAA Desert Camp, I would like to enquire about staying at your desert camp in Jaisalmer."
  );
  const enquiryHref = isWhatsAppReady && whatsappUrl ? whatsappUrl : "/contact";
  const enquiryTarget = isWhatsAppReady && whatsappUrl ? "_blank" : undefined;
  const enquiryRel = isWhatsAppReady && whatsappUrl ? "noopener noreferrer" : undefined;

  return (
    <header
      id="site-header"
      className={`fixed top-0 inset-x-0 z-40 w-full transition-colors duration-400 select-none border-b ${headerBgClass}`}
      style={{
        paddingTop: "max(0.5rem, env(safe-area-inset-top, 0.5rem))",
      }}
    >
      <div className="w-full px-3 xs:px-5 sm:px-8 md:px-10 lg:px-12">
        <div className="flex h-14 sm:h-20 items-center justify-between">
          {/* Brand Wordmark */}
          <Link
            href="/"
            onClick={() => {
              if (isMenuOpen) toggleMenu();
            }}
            className="group flex flex-col focus-visible:outline-2 focus-visible:outline-[#B88A44] rounded-xs transition-transform active:scale-[0.98] min-w-0"
            aria-label={`${siteConfig.brand.name} - Return to homepage`}
          >
            <span
              className={`font-serif text-sm xs:text-base sm:text-xl md:text-2xl lg:text-3xl font-medium tracking-[0.14em] sm:tracking-[0.24em] uppercase transition-colors duration-400 truncate ${brandTextClass}`}
            >
              {siteConfig.brand.name}
            </span>
            <span
              className={`text-[8px] sm:text-[10px] uppercase tracking-[0.3em] sm:tracking-[0.35em] font-medium transition-colors duration-400 ${brandSubtitleClass}`}
            >
              Jaisalmer
            </span>
          </Link>

          {/* Right Controls: Shifted to right-hand corner with refined spacing between them and from corner */}
          <div className="flex items-center gap-2 sm:gap-4 lg:gap-6 shrink-0">
            {/* Enquiry / Explore Stay Shortcut */}
            <a
              href={enquiryHref}
              target={enquiryTarget}
              rel={enquiryRel}
              aria-label="Enquire about luxury camp stay"
              className={`inline-flex items-center justify-center rounded-sm px-2.5 sm:px-5 py-1.5 sm:py-2 text-[10px] sm:text-xs font-semibold uppercase tracking-widest transition-all duration-300 min-h-[36px] sm:min-h-[44px] cursor-pointer focus-visible:outline-2 focus-visible:outline-[#B88A44] active:scale-[0.97] ${
                isHeroTransparent || isMenuOpen
                  ? "border border-[#FAF6F0]/30 text-[#FAF6F0] hover:bg-[#FAF6F0] hover:text-[#191918] hover:border-transparent drop-shadow-sm"
                  : "bg-[#30251F] text-[#F6EFE3] hover:bg-[#B88A44]"
              }`}
            >
              Enquire
            </a>

            {/* Menu / Close Button with Animated Icon */}
            <button
              ref={menuButtonRef}
              type="button"
              onClick={toggleMenu}
              aria-expanded={isMenuOpen}
              aria-controls="fullscreen-navigation-menu"
              aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              className={`flex items-center gap-2 sm:gap-3 px-2.5 sm:px-4 py-1.5 sm:py-2 min-h-[36px] sm:min-h-[44px] min-w-[36px] sm:min-w-[44px] rounded-sm font-sans text-[10px] sm:text-xs font-semibold uppercase tracking-[0.18em] sm:tracking-[0.2em] transition-all duration-300 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#B88A44] active:scale-[0.96] ${buttonTextClass}`}
            >
              <span className="inline">
                {isMenuOpen ? "Close" : "Menu"}
              </span>

              {/* Animated Icon: 2 lines that smoothly morph into 'X' without shifting position */}
              <div
                className="relative w-5 h-5 flex flex-col justify-center items-center pointer-events-none"
                aria-hidden="true"
              >
                <span
                  className={`absolute h-[1.5px] w-5 rounded-full transition-transform duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] ${iconBarClass} ${
                    isMenuOpen
                      ? "rotate-45 translate-y-0"
                      : "-translate-y-[4px]"
                  }`}
                />
                <span
                  className={`absolute h-[1.5px] w-5 rounded-full transition-transform duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] ${iconBarClass} ${
                    isMenuOpen
                      ? "-rotate-45 translate-y-0"
                      : "translate-y-[4px]"
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
