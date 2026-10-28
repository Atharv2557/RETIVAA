import Link from "next/link";
import { MessageCircle, Phone } from "lucide-react";
import { Container } from "./Container";
import { siteConfig, getConfiguredSocialLinks } from "@/config/site.config";

export function SiteFooter() {
  const currentYear = new Date().getFullYear();
  const configuredSocialLinks = getConfiguredSocialLinks();

  return (
    <footer className="mt-auto border-t border-[rgba(48,37,31,0.12)] bg-[#191918] text-[#F6EFE3]">
      <Container size="wide" className="pt-16 pb-28 sm:pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="space-y-4">
            <span className="font-serif text-lg sm:text-2xl font-bold tracking-[0.15em] sm:tracking-[0.25em] text-[#D7B98E] block">
              {siteConfig.brand.name}
            </span>
            <p className="text-xs uppercase tracking-widest text-[#B88A44]">
              {siteConfig.brand.location}
            </p>
            <p className="text-sm text-[#F6EFE3]/70 leading-relaxed">
              {siteConfig.brand.description}
            </p>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <h3 className="font-serif text-sm tracking-wider uppercase text-[#D7B98E]">
              Explore
            </h3>
            <ul className="space-y-2 text-sm text-[#F6EFE3]/80">
              <li>
                <Link href="/" className="hover:text-[#D7B98E] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-[#D7B98E] transition-colors">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#D7B98E] transition-colors">
                  Contact & Enquiries
                </Link>
              </li>
            </ul>
          </div>

          {/* Direct Reservations & WhatsApp */}
          <div className="space-y-4">
            <h3 className="font-serif text-sm tracking-wider uppercase text-[#D7B98E]">
              Reservations
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="block text-[10px] uppercase tracking-widest text-[#B88A44] mb-1 font-mono">
                  Direct Line
                </span>
                <a
                  href={`tel:${siteConfig.contact.phone.replace(/\s+/g, "")}`}
                  className="inline-flex items-center gap-2 font-serif text-base sm:text-lg text-[#FAF6F0] hover:text-[#D7B98E] transition-colors"
                >
                  <Phone size={14} className="text-[#B88A44]" />
                  <span>{siteConfig.contact.phone}</span>
                </a>
              </div>

              <div>
                <span className="block text-[10px] uppercase tracking-widest text-[#B88A44] mb-1 font-mono">
                  WhatsApp Concierge
                </span>
                <a
                  href="https://wa.me/918107817873?text=Khamma%20Ghani%20RETIVAA%20Desert%20Camp%2C%20I%20would%20like%20to%20enquire%20about%20staying%20at%20your%20desert%20camp."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#25D366]/15 border border-[#25D366]/30 text-[#25D366] hover:bg-[#25D366] hover:text-[#120F0D] text-xs font-mono tracking-wider transition-all"
                >
                  <MessageCircle size={14} />
                  <span>+91 81078 17873</span>
                </a>
              </div>

              <p className="text-xs text-[#F6EFE3]/50">
                Available daily for reservations & desert safari planning.
              </p>
            </div>
          </div>

          {/* Connect Column */}
          <div className="space-y-4">
            <h3 className="font-serif text-sm tracking-wider uppercase text-[#D7B98E]">
              Connect
            </h3>
            {configuredSocialLinks.length > 0 ? (
              <ul className="space-y-2 text-sm text-[#F6EFE3]/80">
                {configuredSocialLinks.map((social) => (
                  <li key={social.platform}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#D7B98E] transition-colors"
                    >
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="space-y-2 text-xs text-[#F6EFE3]/60">
                <p>Thar Desert, Sam Sand Dunes</p>
                <p>Jaisalmer, Rajasthan 345001</p>
                <p className="text-[11px] text-[#D7B98E] pt-1">
                  &bull; Instant assistance via WhatsApp
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[rgba(246,239,227,0.1)] flex flex-col sm:flex-row items-center justify-between text-xs text-[#F6EFE3]/50 gap-4">
          <p>
            &copy; {currentYear} {siteConfig.brand.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-2 text-[11px] tracking-wide">
            <span>Thar Desert &bull; Jaisalmer &bull; Rajasthan</span>
            <span className="hidden sm:inline">&bull;</span>
            <a href="tel:+918107817873" className="hover:text-[#D7B98E] transition-colors">
              +91 81078 17873
            </a>
            <span>&bull;</span>
            <a
              href="https://wa.me/918107817873"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#25D366] hover:underline"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
