import Link from "next/link";
import { Container } from "./Container";
import { siteConfig, getConfiguredSocialLinks } from "@/config/site.config";

export function SiteFooter() {
  const currentYear = new Date().getFullYear();
  const configuredSocialLinks = getConfiguredSocialLinks();

  return (
    <footer className="mt-auto border-t border-[rgba(48,37,31,0.12)] bg-[#191918] text-[#F6EFE3]">
      <Container size="wide" className="pt-16 pb-28 sm:pb-24">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <span className="font-serif text-2xl font-bold tracking-[0.25em] text-[#D7B98E]">
              {siteConfig.brand.name}
            </span>
            <p className="text-xs uppercase tracking-widest text-[#B88A44]">
              {siteConfig.brand.location}
            </p>
            <p className="max-w-md text-sm text-[#F6EFE3]/70 leading-relaxed">
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

          {/* Social Links (Hidden if unconfigured) */}
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
              <p className="text-xs text-[#F6EFE3]/40 italic">
                Social channels will be published upon launch.
              </p>
            )}
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[rgba(246,239,227,0.1)] flex flex-col sm:flex-row items-center justify-between text-xs text-[#F6EFE3]/50 gap-4">
          <p>
            &copy; {currentYear} {siteConfig.brand.name}. All rights reserved.
          </p>
          <p className="text-[11px] tracking-wide">
            Thar Desert &bull; Jaisalmer &bull; Rajasthan &bull; India
          </p>
        </div>
      </Container>
    </footer>
  );
}
