import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { siteConfig } from "@/config/site.config";
import { ScrollCamelBar } from "@/components/motion/ScrollCamelBar";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { NavigationProvider } from "@/components/layout/NavigationContext";
import { FullScreenMenu } from "@/components/layout/FullScreenMenu";
import { PageTransitionWipe } from "@/components/layout/PageTransitionWipe";
import { HeroSoundscape } from "@/features/home/components/HeroSoundscape";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.brand.name} | Luxury Desert Camp, Jaisalmer`,
    template: `%s | ${siteConfig.brand.name}`,
  },
  description: siteConfig.brand.description,
  keywords: [
    "RETIVAA",
    "Jaisalmer desert camp",
    "luxury tent stay Jaisalmer",
    "Thar desert safari",
    "Rajasthan desert camp",
    "Sam sand dunes resort",
  ],
  authors: [{ name: siteConfig.brand.name }],
  robots: {
    index: true,
    follow: true,
  },
};

interface RootLayoutProps {
  readonly children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${jakarta.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-[#F6EFE3] text-[#30251F] font-sans antialiased">
        <SmoothScrollProvider>
          <NavigationProvider>
            {/* Accessible skip link */}
            <a href="#main-content" className="skip-to-content">
              Skip to main content
            </a>

            {/* Global shared navigation */}
            <SiteHeader />

            {/* Route main landmark */}
            <main id="main-content" className="flex-1">
              {children}
            </main>

            {/* Global shared footer */}
            <SiteFooter />

            {/* Global Fixed Scroll Camel Progress Bar across all pages */}
            <ScrollCamelBar />

            {/* Global Fixed Desert Ambience Soundscape Toggle */}
            <HeroSoundscape />

            {/* Full-Screen Navigation Menu Modal */}
            <FullScreenMenu />

            {/* Warm Paper-Colored Page Transition Wipe */}
            <PageTransitionWipe />
          </NavigationProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
