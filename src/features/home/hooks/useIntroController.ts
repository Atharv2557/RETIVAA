"use client";

import { useSyncExternalStore, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { siteConfig, isConfigured, getWhatsAppEnquiryUrl } from "@/config/site.config";

const HARD_TIMEOUT_MS = 4600;

// Module-level external store for intro dismissal during the current page view
let dismissedInCurrentView = false;
let listeners: Array<() => void> = [];

function subscribeIntro(callback: () => void) {
  listeners.push(callback);
  return () => {
    listeners = listeners.filter((l) => l !== callback);
  };
}

function notifyIntro() {
  for (const listener of listeners) {
    listener();
  }
}

function getIntroSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  // If dismissed during this view (via Skip, Enquire, Escape, or natural completion)
  if (dismissedInCurrentView) return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  // Plays on every page load as requested by client
  return true;
}

interface UseIntroControllerReturn {
  isIntroActive: boolean;
  isReady: boolean;
  skipIntro: () => void;
  enquireAndDismiss: () => void;
  replayIntro: () => void;
}

export function useIntroController(): UseIntroControllerReturn {
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const shouldShowIntro = useSyncExternalStore(
    subscribeIntro,
    getIntroSnapshot,
    () => false
  );

  const isIntroActive = isClient && shouldShowIntro;
  const hardTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const dismissIntro = useCallback(() => {
    dismissedInCurrentView = true;
    notifyIntro();

    if (hardTimeoutRef.current) {
      clearTimeout(hardTimeoutRef.current);
      hardTimeoutRef.current = null;
    }

    // Restore body scroll
    document.body.style.overflow = "";

    // Remove inert from background elements
    const mainContent = document.getElementById("main-content");
    const siteHeader = document.querySelector("header");
    if (mainContent) mainContent.removeAttribute("inert");
    if (siteHeader) siteHeader.removeAttribute("inert");

    // Restore focus
    requestAnimationFrame(() => {
      const heroHeading = document.getElementById("hero-heading");
      if (heroHeading) {
        heroHeading.focus({ preventScroll: true });
      }
    });
  }, []);

  const skipIntro = useCallback(() => {
    dismissIntro();
  }, [dismissIntro]);

  const enquireAndDismiss = useCallback(() => {
    dismissIntro();

    const isWhatsAppConfigured = isConfigured(siteConfig.contact.whatsapp);
    const whatsappUrl = getWhatsAppEnquiryUrl(
      "Namaste RETIVAA, I would like to enquire about staying at your desert camp in Jaisalmer."
    );

    if (isWhatsAppConfigured && whatsappUrl) {
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    } else {
      router.push("/contact");
    }
  }, [dismissIntro, router]);

  const replayIntro = useCallback(() => {
    dismissedInCurrentView = false;
    notifyIntro();
  }, []);

  // DOM synchronizations when intro is active
  useEffect(() => {
    if (!isIntroActive) {
      document.body.style.overflow = "";
      const mainContent = document.getElementById("main-content");
      const siteHeader = document.querySelector("header");
      if (mainContent) mainContent.removeAttribute("inert");
      if (siteHeader) siteHeader.removeAttribute("inert");
      return;
    }

    // Lock body scrolling during intro
    document.body.style.overflow = "hidden";

    // Set inert on background elements
    const mainContent = document.getElementById("main-content");
    const siteHeader = document.querySelector("header");
    if (mainContent) mainContent.setAttribute("inert", "");
    if (siteHeader) siteHeader.setAttribute("inert", "");

    // Safety timeout to prevent getting trapped
    hardTimeoutRef.current = setTimeout(() => {
      dismissIntro();
    }, HARD_TIMEOUT_MS);

    // Escape listener
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        dismissIntro();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (hardTimeoutRef.current) {
        clearTimeout(hardTimeoutRef.current);
      }
      document.body.style.overflow = "";
      if (mainContent) mainContent.removeAttribute("inert");
      if (siteHeader) siteHeader.removeAttribute("inert");
    };
  }, [isIntroActive, dismissIntro]);

  return {
    isIntroActive,
    isReady: isClient,
    skipIntro,
    enquireAndDismiss,
    replayIntro,
  };
}
