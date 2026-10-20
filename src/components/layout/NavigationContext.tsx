"use client";

import {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
  type ReactNode,
  type RefObject,
} from "react";
import { usePathname } from "next/navigation";
import { useLenis } from "lenis/react";

export type NavigationTheme = "dark" | "light";

interface NavigationContextValue {
  isMenuOpen: boolean;
  isTransitioning: boolean;
  targetRoute: string | null;
  currentTheme: NavigationTheme;
  destinationTheme: NavigationTheme;
  menuButtonRef: RefObject<HTMLButtonElement | null>;
  openMenu: () => void;
  closeMenu: () => void;
  toggleMenu: () => void;
  navigateWithTransition: (href: string) => void;
  completePageTransition: () => void;
}

const NavigationContext = createContext<NavigationContextValue | null>(null);

const defaultNavigationContext: NavigationContextValue = {
  isMenuOpen: false,
  isTransitioning: false,
  targetRoute: null,
  currentTheme: "dark",
  destinationTheme: "dark",
  menuButtonRef: { current: null },
  openMenu: () => {},
  closeMenu: () => {},
  toggleMenu: () => {},
  navigateWithTransition: () => {},
  completePageTransition: () => {},
};

export function useNavigation(): NavigationContextValue {
  const context = useContext(NavigationContext);
  return context || defaultNavigationContext;
}

interface NavigationProviderProps {
  children: ReactNode;
}

function computeNavigationTheme(pathname: string): NavigationTheme {
  if (typeof window === "undefined") return "dark";

  if (pathname === "/gallery" || pathname === "/contact") {
    return "light";
  }

  if (pathname === "/") {
    const isOverDarkHero = window.scrollY < 480;
    const isNearDarkFooter =
      window.scrollY + window.innerHeight >
      document.documentElement.scrollHeight - 360;
    return isOverDarkHero || isNearDarkFooter ? "dark" : "light";
  }

  return "light";
}

export function NavigationProvider({ children }: NavigationProviderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [targetRoute, setTargetRoute] = useState<string | null>(null);
  const [currentTheme, setCurrentTheme] = useState<NavigationTheme>("dark");
  const [destinationTheme, setDestinationTheme] = useState<NavigationTheme>("dark");

  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const savedScrollY = useRef(0);
  const isNavigatingRef = useRef(false);
  const safetyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const pathname = usePathname();
  const lenis = useLenis();

  // Listen for scroll changes to update theme state
  useEffect(() => {
    const handleScroll = () => {
      const theme = computeNavigationTheme(pathname);
      setCurrentTheme((prev) => (prev !== theme ? theme : prev));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  // Helper to lock body scroll, pause dust cursor, and mark background inert
  const lockPage = useCallback(() => {
    savedScrollY.current = window.scrollY;
    document.body.style.overflow = "hidden";
    document.body.setAttribute("data-menu-open", "true");

    // Pause Lenis smooth scrolling if active
    if (lenis) {
      lenis.stop();
    }

    // Set inert on background landmarks
    const mainContent = document.getElementById("main-content");
    const footer = document.querySelector("footer");
    if (mainContent) mainContent.setAttribute("inert", "");
    if (footer) footer.setAttribute("inert", "");
  }, [lenis]);

  // Helper to unlock body scroll, resume dust cursor, and restore inert
  const unlockPage = useCallback(() => {
    document.body.style.overflow = "";
    document.body.removeAttribute("data-menu-open");

    // Resume Lenis smooth scrolling
    if (lenis) {
      lenis.start();
    }

    // Remove inert from background landmarks
    const mainContent = document.getElementById("main-content");
    const footer = document.querySelector("footer");
    if (mainContent) mainContent.removeAttribute("inert");
    if (footer) footer.removeAttribute("inert");
  }, [lenis]);

  const openMenu = useCallback(() => {
    if (isTransitioning) return;
    setCurrentTheme(computeNavigationTheme(pathname));
    lockPage();
    setIsMenuOpen(true);
  }, [isTransitioning, pathname, lockPage]);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
    unlockPage();

    // Restore focus to Menu button
    requestAnimationFrame(() => {
      if (menuButtonRef.current) {
        menuButtonRef.current.focus({ preventScroll: true });
      }
    });
  }, [unlockPage]);

  const toggleMenu = useCallback(() => {
    if (isMenuOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }, [isMenuOpen, closeMenu, openMenu]);

  // Page Transition: wipes screen with theme matching the destination route
  const navigateWithTransition = useCallback(
    (href: string) => {
      // If clicking current route, simply close menu without route change
      if (href === pathname) {
        closeMenu();
        return;
      }

      if (isNavigatingRef.current) return;
      isNavigatingRef.current = true;

      // Determine theme of destination route (/ has dark hero at top; /gallery and /contact are light ivory)
      const destTheme: NavigationTheme = href === "/" ? "dark" : "light";
      setDestinationTheme(destTheme);

      // Lock page for transition
      lockPage();
      setIsMenuOpen(false);
      setTargetRoute(href);
      setIsTransitioning(true);

      // Safety timeout: ensure user is never permanently stuck behind wipe (2.8s max fallback)
      if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);
      safetyTimeoutRef.current = setTimeout(() => {
        setIsTransitioning(false);
        setTargetRoute(null);
        isNavigatingRef.current = false;
        unlockPage();
      }, 2800);
    },
    [pathname, closeMenu, lockPage, unlockPage]
  );

  const completePageTransition = useCallback(() => {
    if (safetyTimeoutRef.current) {
      clearTimeout(safetyTimeoutRef.current);
      safetyTimeoutRef.current = null;
    }
    setIsTransitioning(false);
    setTargetRoute(null);
    isNavigatingRef.current = false;
    unlockPage();

    // Focus destination main heading or main landmark accessibly
    requestAnimationFrame(() => {
      const heading = document.querySelector("h1") as HTMLElement | null;
      if (heading) {
        heading.setAttribute("tabindex", "-1");
        heading.focus({ preventScroll: true });
      } else {
        const main = document.getElementById("main-content");
        if (main) {
          main.setAttribute("tabindex", "-1");
          main.focus({ preventScroll: true });
        }
      }
    });
  }, [unlockPage]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (safetyTimeoutRef.current) {
        clearTimeout(safetyTimeoutRef.current);
      }
      document.body.style.overflow = "";
      document.body.removeAttribute("data-menu-open");
    };
  }, []);

  return (
    <NavigationContext.Provider
      value={{
        isMenuOpen,
        isTransitioning,
        targetRoute,
        currentTheme,
        destinationTheme,
        menuButtonRef,
        openMenu,
        closeMenu,
        toggleMenu,
        navigateWithTransition,
        completePageTransition,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}
